import { EllipseElement } from '../elements';
import { ToolType, Point, PointerInfo } from '../types';
import { BaseTool } from './base-tool';
import { CursorType } from '../types/cursors';
export declare class EllipseTool extends BaseTool {
    type: ToolType;
    baseCursor: CursorType;
    element: EllipseElement | null;
    startPoint: Point | null;
    handlePointerDown(event: PointerInfo): void;
    handlePointerMove(event: PointerInfo): void;
    handlePointerUp(): void;
    private getElementStyle;
}
