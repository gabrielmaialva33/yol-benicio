/**
 * LoadingScreen Component
 * Elegant loading screen with logo animation
 */

import {motion} from 'framer-motion'

export function LoadingScreen() {
	return (
		<div className='flex h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100'>
			<div className='flex flex-col items-center gap-6'>
				{/* Animated Logo */}
				<motion.div
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.8, 1, 0.8]
					}}
					className='flex items-center gap-3'
					transition={{
						duration: 2,
						repeat: Number.POSITIVE_INFINITY,
						ease: 'easeInOut'
					}}
				>
					{/* Orange Circle */}
					<div className='relative h-16 w-16'>
						<motion.div
							animate={{rotate: 360}}
							className='absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500'
							transition={{
								duration: 1.5,
								repeat: Number.POSITIVE_INFINITY,
								ease: 'linear'
							}}
						/>
						<div className='absolute inset-2 rounded-full bg-gradient-to-br from-orange-500 to-orange-600' />
					</div>

					{/* Brand Text */}
					<div className='font-sans text-3xl font-bold tracking-tight'>
						<span className='text-gray-800'>BENÍCIO</span>
					</div>
				</motion.div>

				{/* Loading Dots */}
				<div className='flex gap-2'>
					{[0, 1, 2].map(index => (
						<motion.div
							key={index}
							animate={{
								y: [0, -10, 0],
								opacity: [0.5, 1, 0.5]
							}}
							className='h-2 w-2 rounded-full bg-orange-500'
							transition={{
								duration: 0.8,
								repeat: Number.POSITIVE_INFINITY,
								delay: index * 0.15,
								ease: 'easeInOut'
							}}
						/>
					))}
				</div>

				{/* Loading Text */}
				<motion.p
					animate={{opacity: [0.5, 1, 0.5]}}
					className='text-sm font-medium text-gray-600'
					transition={{
						duration: 1.5,
						repeat: Number.POSITIVE_INFINITY,
						ease: 'easeInOut'
					}}
				>
					Carregando...
				</motion.p>
			</div>
		</div>
	)
}
