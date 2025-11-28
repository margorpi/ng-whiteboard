import { RectangleElement } from '../elements';
import { Point, PointerInfo, ToolType } from '../types';
import { BaseTool } from './base-tool';
import { CursorType } from '../types/cursors';
export declare class RectangleTool extends BaseTool {
    type: ToolType;
    baseCursor: CursorType;
    element: RectangleElement | null;
    startPoint: Point | null;
    handlePointerDown(event: PointerInfo): void;
    handlePointerMove(event: PointerInfo): void;
    handlePointerUp(): void;
    private getElementStyle;
}
