-- Create folders view from legacy process tables
-- Maps tabela_open_processo_partes to modern folder structure
-- Handles NULL strings and invalid data from legacy system
CREATE OR REPLACE VIEW folders AS
SELECT DISTINCT ON (par_pro_ide)
    CASE 
        WHEN par_pro_ide ~ '^[0-9]+$' THEN par_pro_ide::INTEGER
        ELSE 0
    END as id,
    COALESCE(par_fic_nro, 'PROC-' || par_pro_ide) as cnj_number,
    COALESCE('Processo ' || par_pro_ide, 'Sem título') as title,
    par_nom as description,
    COALESCE(par_sit, 'active') as status,
    'Cível' as area,
    NULL::text as sub_area,
    NULL::text as court,
    NULL::text as forum,
    NULL::text as court_division,
    par_nom as active_party,
    NULL::text as passive_party,
    par_nom as object_description,
    NULL::numeric as value,
    CASE 
        WHEN par_cli_ide ~ '^[0-9]+$' THEN par_cli_ide::INTEGER
        ELSE 0
    END as client_id,
    COALESCE(par_nom_adv, 'Não atribuído') as responsible_lawyer,
    'Conhecimento' as phase,
    false as is_special,
    false as has_injunction,
    NULL::text as prognosis,
    false as is_favorite,
    CURRENT_TIMESTAMP as created_at,
    CURRENT_TIMESTAMP as updated_at
FROM tabela_open_processo_partes
WHERE par_pro_ide IS NOT NULL 
  AND par_pro_ide != ''
  AND par_pro_ide != 'NULL'
  AND par_cli_ide IS NOT NULL
  AND par_cli_ide != ''
  AND par_cli_ide != 'NULL'
  AND par_pro_ide ~ '^[0-9]+$';  -- Only numeric process IDs

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_processo_partes_pro_ide ON tabela_open_processo_partes(par_pro_ide);
CREATE INDEX IF NOT EXISTS idx_processo_partes_cli_ide ON tabela_open_processo_partes(par_cli_ide);
CREATE INDEX IF NOT EXISTS idx_processo_partes_sit ON tabela_open_processo_partes(par_sit);