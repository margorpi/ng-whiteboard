import { PointerInfo, ToolType } from '../types';
import { CursorType } from '../types/cursors';
import { BaseTool } from './base-tool';
export declare class EraserTool extends BaseTool {
    type: ToolType;
    baseCursor: CursorType;
    private isErasing;
    private readonly hoveredElementIds;
    private lastPosition;
    handlePointerDown(event: PointerInfo): void;
    handlePointerMove(event: PointerInfo): void;
    handlePointerUp(): void;
    private eraseElementsAt;
    private isPointInElement;
    private expandToIncludeGroups;
}
