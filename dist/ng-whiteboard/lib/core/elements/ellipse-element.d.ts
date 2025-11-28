import { BaseElement, Bounds, Direction, ElementType, ElementUtil, Point } from '../types';
export interface EllipseElement extends BaseElement {
    type: ElementType.Ellipse;
    cx: number;
    cy: number;
    rx: number;
    ry: number;
}
export declare class EllipseElementUtil implements ElementUtil<EllipseElement> {
    create(props: Partial<EllipseElement>): EllipseElement;
    resize(element: EllipseElement, direction: Direction, dx: number, dy: number): EllipseElement;
    getBounds(element: EllipseElement): Bounds;
    hitTest(element: EllipseElement, pointA: Point, pointB: Point, threshold: number): boolean;
}
