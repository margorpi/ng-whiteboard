import { BaseElement, Bounds, ElementType, ElementUtil, Point } from '../types';
import { StrokeOptions } from '../utils/drawing';
export interface PenElement extends BaseElement {
    type: ElementType.Pen;
    points: [number, number][];
    pathOptions?: StrokeOptions;
    isComplete?: boolean;
    isClosed?: boolean;
}
export declare class PenElementUtil implements ElementUtil<PenElement> {
    create(props: Partial<PenElement>): PenElement;
    resize(element: PenElement, direction: string, dx: number, dy: number): PenElement;
    private getScaleFactors;
    getBounds(element: PenElement): Bounds;
    hitTest(element: PenElement, pointA: Point, pointB: Point, threshold: number): boolean;
}
