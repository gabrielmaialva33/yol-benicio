import {useMutation} from '@tanstack/react-query'
import {useId, useState} from 'react'
import {useNavigate} from 'react-router'
import {login} from '../../../shared/api/auth'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginForm() {
	const emailId = useId()
	const passwordId = useId()
	const navigate = useNavigate()
	const [errors, setErrors] = useState({email: '', password: ''})
	const {mutateAsync, isError, error} = useMutation({
		mutationFn: login,
		onSuccess: () => {
			void navigate('/dashboard')
		}
	})

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		const newErrors = {email: '', password: ''}
		if (!email) {
			newErrors.email = 'E-mail é obrigatório'
		} else if (!EMAIL_REGEX.test(email)) {
			newErrors.email = 'E-mail inválido'
		}
		if (!password) {
			newErrors.password = 'Senha é obrigatória'
		}

		if (newErrors.email || newErrors.password) {
			setErrors(newErrors)
			return
		}

		setErrors({email: '', password: ''})
		try {
			await mutateAsync({email, password})
		} catch {
			// error is indicated by isError, swallow to prevent unhandled rejection
		}
	}

	return (
		<div className='flex w-full flex-col items-center justify-center gap-10 rounded-[15px] bg-white p-8 font-sans shadow-lg animate-in fade-in zoom-in-95 duration-1000 md:h-[607px] md:px-[32.5px] md:py-16'>
			<div className='flex flex-col items-center gap-[15px] self-stretch'>
				<h2 className='self-stretch text-center text-[40px] font-semibold leading-[0.6em] tracking-[-0.01em] text-gray-900'>
					Fazer login
				</h2>
			</div>
			<form
				className='flex flex-col items-start gap-5 self-stretch'
				noValidate={true}
				onSubmit={handleSubmit}
			>
				<div className='flex flex-col items-start gap-5 self-stretch'>
					<div className='flex h-[50px] items-center gap-2.5 self-stretch rounded-md border border-default px-3 py-2.5'>
						<div className='flex w-full flex-col items-start justify-center'>
							<label className='sr-only' htmlFor={emailId}>
								E-mail
							</label>
							<input
								autoComplete='email'
								className='w-full bg-transparent text-base font-semibold text-gray-500 placeholder-gray-500 focus:outline-none'
								id={emailId}
								name='email'
								placeholder='E-mail'
								type='email'
							/>
						</div>
					</div>
					{errors.email && <p className='text-red-500'>{errors.email}</p>}
					<div className='flex h-[50px] items-center gap-2.5 self-stretch rounded-md border border-default px-3 py-2.5'>
						<div className='flex w-full flex-col items-start justify-center'>
							<label className='sr-only' htmlFor={passwordId}>
								Senha
							</label>
							<input
								autoComplete='current-password'
								className='w-full bg-transparent text-base font-semibold text-gray-500 placeholder-gray-500 focus:outline-none'
								id={passwordId}
								name='password'
								placeholder='Senha'
								type='password'
							/>
						</div>
					</div>
					{errors.password && <p className='text-red-500'>{errors.password}</p>}
					{isError && (
						<p className='text-red-500'>
							{error?.message || 'E-mail ou senha inválidos'}
						</p>
					)}
					<a
						className='self-stretch text-right text-base font-medium text-gray-500 underline'
						href='/#'
					>
						Esqueci minha senha
					</a>
				</div>
				<button
					className='flex h-[50px] items-center justify-center gap-2.5 self-stretch rounded-full bg-gray-900 px-4 py-3 font-work-sans'
					type='submit'
				>
					<span className='text-base font-semibold text-white'>Entrar</span>
				</button>
			</form>
		</div>
	)
}
