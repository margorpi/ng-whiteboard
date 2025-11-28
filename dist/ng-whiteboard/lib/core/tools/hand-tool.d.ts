import { PointerInfo, ToolType } from '../types';
import { BaseTool } from './base-tool';
import { CursorType } from '../types/cursors';
export declare class HandTool extends BaseTool {
    type: ToolType;
    baseCursor: CursorType;
    private isDragging;
    private startX;
    private startY;
    handlePointerDown(event: PointerInfo): void;
    handlePointerMove(event: PointerInfo): void;
    handlePointerUp(): void;
}
