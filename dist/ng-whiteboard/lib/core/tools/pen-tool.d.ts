import { PenElement } from '../elements';
import { PointerInfo, ToolType } from '../types';
import { BaseTool } from './base-tool';
import { CursorType } from '../types/cursors';
import { ApiService } from '../api/api.service';
export declare class PenTool extends BaseTool {
    type: ToolType;
    baseCursor: CursorType;
    element: PenElement | null;
    constructor(apiService: ApiService);
    private getCurrentPathOptions;
    handlePointerDown(event: PointerInfo): void;
    handlePointerMove(event: PointerInfo): void;
    handlePointerUp(): void;
    private getElementStyle;
}
