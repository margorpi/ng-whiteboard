import { BaseElement, Bounds, Direction, ElementType, ElementUtil, Point } from '../types';
export interface ImageElement extends BaseElement {
    type: ElementType.Image;
    width: number;
    height: number;
    src: string | ArrayBuffer;
}
export declare class ImageElementUtil implements ElementUtil<ImageElement> {
    create(props: Partial<ImageElement>): ImageElement;
    resize(element: ImageElement, direction: Direction, dx: number, dy: number): ImageElement;
    getBounds(element: ImageElement): Bounds;
    hitTest(element: ImageElement, pointA: Point, pointB: Point, threshold: number): boolean;
}
