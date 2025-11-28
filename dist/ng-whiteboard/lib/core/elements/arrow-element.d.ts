import { BaseElement, Bounds, Direction, ElementType, ElementUtil, Point } from '../types';
export interface ArrowElement extends BaseElement {
    type: ElementType.Arrow;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export declare class ArrowElementUtil implements ElementUtil<ArrowElement> {
    create(props: Partial<ArrowElement>): ArrowElement;
    resize(element: ArrowElement, direction: Direction, dx: number, dy: number): ArrowElement;
    getBounds(element: ArrowElement): Bounds;
    hitTest(element: ArrowElement, pointA: Point, pointB: Point, threshold: number): boolean;
}
