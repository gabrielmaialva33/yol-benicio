interface ToggleSwitchProps {
	label: string
	checked: boolean
	onChange: (checked: boolean) => void
	disabled?: boolean
}

export function ToggleSwitch({
	label,
	checked,
	onChange,
	disabled = false
}: ToggleSwitchProps) {
	return (
		<div className='flex items-center justify-between'>
			<span className='text-sm font-medium text-gray-700'>{label}</span>
			<button
				aria-checked={checked}
				className={`
					relative inline-flex h-6 w-11 items-center rounded-full
					transition-colors focus:outline-none focus:ring-2 focus:ring-[#00B8D9] focus:ring-offset-2
					${checked ? 'bg-[#00B8D9]' : 'bg-gray-200'}
					${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
				`}
				disabled={disabled}
				onClick={() => onChange(!checked)}
				role='switch'
				type='button'
			>
				<span
					className={`
						inline-block h-4 w-4 transform rounded-full bg-white shadow-sm
						transition-transform
						${checked ? 'translate-x-6' : 'translate-x-1'}
					`}
				/>
			</button>
		</div>
	)
}
