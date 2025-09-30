/**
 * Compound Component Pattern Base
 * Provides utilities for creating compound components
 */

import React, {createContext, useContext} from 'react'

/**
 * Create a compound component context with type safety
 */
export function createCompoundComponentContext<T>(
	componentName: string
): [React.Provider<T>, () => T] {
	const Context = createContext<T | undefined>(undefined)

	const useCompoundContext = () => {
		const context = useContext(Context)
		if (!context) {
			throw new Error(
				`This component must be used within ${componentName} component`
			)
		}
		return context
	}

	return [Context.Provider, useCompoundContext]
}

/**
 * Type for compound component children
 */
export type CompoundComponentChildren =
	| React.ReactNode
	| ((props: any) => React.ReactNode)

/**
 * Utility to find child component by type
 */
export function findChildByType(
	children: React.ReactNode,
	componentType: React.ComponentType<any>
): React.ReactElement | undefined {
	const childrenArray = React.Children.toArray(children)
	return childrenArray.find(
		child => React.isValidElement(child) && child.type === componentType
	) as React.ReactElement | undefined
}

/**
 * Utility to filter children by type
 */
export function filterChildrenByType(
	children: React.ReactNode,
	componentType: React.ComponentType<any>
): React.ReactElement[] {
	const childrenArray = React.Children.toArray(children)
	return childrenArray.filter(
		child => React.isValidElement(child) && child.type === componentType
	) as React.ReactElement[]
}
