import { Bounds, WhiteboardElement } from '../../types';
/** Get the bounding box of an element from the DOM. */
export declare function getElementBbox(svgContainer: SVGSVGElement, element: WhiteboardElement): DOMRect;
/** Get the bounds of an element. */
export declare function getElementBounds(element: WhiteboardElement): Bounds;
