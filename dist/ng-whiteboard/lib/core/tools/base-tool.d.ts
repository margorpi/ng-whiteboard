import { ApiService } from '../api/api.service';
import { Point, PointerInfo, Tool, ToolType, WhiteboardConfig } from '../types';
import { CursorType } from '../types/cursors';
export declare abstract class BaseTool implements Tool {
    protected apiService: ApiService;
    abstract type: ToolType;
    protected active: boolean;
    baseCursor: CursorType;
    constructor(apiService: ApiService);
    get whiteboardConfig(): WhiteboardConfig;
    getPointerPosition({ x, y }: PointerInfo): Point;
    activate(): void;
    deactivate(): void;
    protected setCursor(cursor: CursorType): void;
    protected resetCursor(): void;
    get isActive(): boolean;
    handlePointerDown?(event: PointerInfo): void;
    handlePointerMove?(event: PointerInfo): void;
    handlePointerUp?(event: PointerInfo): void;
    handleKeyDown?(event: KeyboardEvent): void;
    handleKeyUp?(event: KeyboardEvent): void;
    onActivate?(): void;
    onDeactivate?(): void;
}
