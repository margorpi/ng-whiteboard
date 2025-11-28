import { PointerInfo, WhiteboardElement } from '../../types';
/** Get the target element from a pointer event. */
export declare function getTargetElement(info: PointerInfo, data: WhiteboardElement[]): WhiteboardElement | null;
/** Get the mouse target element from a pointer event. */
export declare function getMouseTarget(info: PointerInfo): SVGGraphicsElement | null;
