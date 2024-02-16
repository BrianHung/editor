// https://gist.github.com/eldh/54954e01b40ef6fb812e2c8ee13731dc
import { throttle } from 'lodash';
import * as React from 'react';
// import { useWindowEvent } from '@headlessui/react/dist/hooks/use-window-event'

/**
 * Mouse position as a tuple of [x, y]
 */
type MousePosition = [number, number];

/**
 * Hook to get the current mouse position
 *
 * @returns Mouse position as a tuple of [x, y]
 */
export const useMousePosition = () => {
	const [mousePosition, setMousePosition] = React.useState<MousePosition>([0, 0]);
	const updateMousePosition = throttle((event: MouseEvent) => setMousePosition([event.clientX, event.clientY]), 200);
	// useWindowEvent("mousemove", updateMousePosition);
	return mousePosition;
};
