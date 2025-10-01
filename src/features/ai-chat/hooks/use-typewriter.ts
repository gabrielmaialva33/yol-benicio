/**
 * useTypewriter Hook
 * Creates a typewriter effect for streaming text
 * Animates text character by character for a smooth reading experience
 */

import {useEffect, useState, useRef} from 'react'

interface UseTypewriterOptions {
	/** Speed in milliseconds per character (default: 15ms) */
	speed?: number
	/** Whether to vary speed (faster on spaces, default: true) */
	varySpeed?: boolean
	/** Callback when typing is complete */
	onComplete?: () => void
}

export function useTypewriter(
	text: string,
	options: UseTypewriterOptions = {}
) {
	const {speed = 15, varySpeed = true, onComplete} = options

	const [displayText, setDisplayText] = useState('')
	const [isTyping, setIsTyping] = useState(false)
	const timeoutRef = useRef<NodeJS.Timeout>()
	const indexRef = useRef(0)

	useEffect(() => {
		// Clear any existing timeout
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		// Reset if text changed
		if (text && indexRef.current === 0) {
			setIsTyping(true)
		}

		// Type next character
		const typeNextChar = () => {
			if (indexRef.current < text.length) {
				const char = text[indexRef.current]

				setDisplayText(text.slice(0, indexRef.current + 1))
				indexRef.current++

				// Vary speed: faster on spaces, slower on punctuation
				let charSpeed = speed
				if (varySpeed) {
					if (char === ' ') {
						charSpeed = speed * 0.5 // Faster on spaces
					} else if (['.', '!', '?', ','].includes(char)) {
						charSpeed = speed * 2 // Slower on punctuation
					}
				}

				timeoutRef.current = setTimeout(typeNextChar, charSpeed)
			} else {
				// Typing complete
				setIsTyping(false)
				if (onComplete) {
					onComplete()
				}
			}
		}

		// Start typing if there's new text
		if (text && text.length > displayText.length) {
			typeNextChar()
		}

		// Cleanup
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [text, speed, varySpeed, onComplete, displayText.length])

	// Reset when text becomes empty
	useEffect(() => {
		if (!text) {
			setDisplayText('')
			indexRef.current = 0
			setIsTyping(false)
		}
	}, [text])

	return {
		displayText,
		isTyping
	}
}
