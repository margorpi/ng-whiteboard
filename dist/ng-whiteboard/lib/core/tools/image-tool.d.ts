import { PointerInfo, ToolType } from '../types';
import { CursorType } from '../types/cursors';
import { BaseTool } from './base-tool';
export declare class ImageTool extends BaseTool {
    type: ToolType;
    baseCursor: CursorType;
    handlePointerDown(event: PointerInfo): void;
}
