import { BaseElement, Bounds, Direction, ElementType, ElementUtil, Point } from '../types';
export interface TextElement extends BaseElement {
    type: ElementType.Text;
    text: string;
    selection?: {
        start: number;
        end: number;
    };
    scaleX: number;
    scaleY: number;
}
export declare class TextElementUtil implements ElementUtil<TextElement> {
    create(props: Partial<TextElement>): TextElement;
    resize(element: TextElement, direction: Direction, dx: number, dy: number): TextElement;
    getBounds(element: TextElement): Bounds;
    hitTest(element: TextElement, pointA: Point, pointB: Point, threshold: number): boolean;
}
