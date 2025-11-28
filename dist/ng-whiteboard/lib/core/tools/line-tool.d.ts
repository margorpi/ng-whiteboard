import { LineElement } from '../elements';
import { Point, PointerInfo, ToolType } from '../types';
import { BaseTool } from './base-tool';
import { CursorType } from '../types/cursors';
export declare class LineTool extends BaseTool {
    type: ToolType;
    baseCursor: CursorType;
    element: LineElement | null;
    startPoint: Point | null;
    private lastX;
    private lastY;
    private readonly MIN_LENGTH;
    handlePointerDown(event: PointerInfo): void;
    handlePointerMove(event: PointerInfo): void;
    handlePointerUp(): void;
    private getElementStyle;
}
