-- Create tasks view from open_agendas table
-- Filters and cleans legacy agenda data into modern task structure
CREATE OR REPLACE VIEW tasks AS
SELECT 
    CASE 
        WHEN age_ide ~ '^[0-9]+$' THEN age_ide::INTEGER
        ELSE 0
    END as id,
    COALESCE(NULLIF(TRIM(age_dsc), ''), 'Tarefa sem descrição') as title,
    NULLIF(TRIM(age_dsc), '') as description,
    CASE 
        WHEN age_flg = 'C' THEN 'completed'
        WHEN age_flg = 'P' THEN 'pending'
        WHEN age_flg = 'E' THEN 'in_progress'
        ELSE 'pending'
    END as status,
    CASE
        WHEN age_dta IS NOT NULL AND age_dta != '' AND age_dta != 'NULL' 
            AND age_dta ~ '^\d{4}-\d{2}-\d{2}' 
            AND SUBSTRING(age_dta, 1, 4)::INT BETWEEN 1900 AND 2100
        THEN age_dta::timestamp
        ELSE NULL
    END as due_date,
    CASE 
        WHEN age_pro_ide ~ '^[0-9]+$' AND age_pro_ide::INTEGER > 0 THEN age_pro_ide::INTEGER
        ELSE NULL
    END as folder_id,
    CASE 
        WHEN age_cli_ide ~ '^[0-9]+$' AND age_cli_ide::INTEGER > 0 THEN age_cli_ide::INTEGER
        ELSE NULL
    END as client_id,
    COALESCE(NULLIF(TRIM(age_usu), ''), 'sistema') as assigned_to,
    CASE 
        WHEN age_rev = 'S' THEN 'high'
        WHEN age_rev = 'U' THEN 'urgent'
        ELSE 'normal'
    END as priority,
    NULLIF(TRIM(age_tag_ide), '') as tags,
    CASE
        WHEN age_dta_inc IS NOT NULL AND age_dta_inc != '' AND age_dta_inc != 'NULL' 
            AND age_dta_inc ~ '^\d{4}-\d{2}-\d{2}' 
            AND SUBSTRING(age_dta_inc, 1, 4)::INT BETWEEN 1900 AND 2100
        THEN age_dta_inc::timestamp
        ELSE CURRENT_TIMESTAMP
    END as created_at,
    CASE
        WHEN age_dta_atu IS NOT NULL AND age_dta_atu != '' AND age_dta_atu != 'NULL' 
            AND age_dta_atu ~ '^\d{4}-\d{2}-\d{2}' 
            AND SUBSTRING(age_dta_atu, 1, 4)::INT BETWEEN 1900 AND 2100
        THEN age_dta_atu::timestamp
        ELSE CURRENT_TIMESTAMP
    END as updated_at
FROM open_agendas
WHERE age_ide IS NOT NULL 
  AND age_ide != ''
  AND age_ide != 'NULL'
  AND age_ide ~ '^[0-9]+$'
  AND age_dsc IS NOT NULL
  AND TRIM(age_dsc) != '';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_folder_id ON open_agendas(age_pro_ide) WHERE age_pro_ide ~ '^[0-9]+$';
CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON open_agendas(age_cli_ide) WHERE age_cli_ide ~ '^[0-9]+$';
CREATE INDEX IF NOT EXISTS idx_tasks_status ON open_agendas(age_flg);