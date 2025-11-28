import { Direction, Point, PointerInfo, ToolType } from '../types';
import { BaseTool } from './base-tool';
import { CursorType } from '../types/cursors';
export declare enum SelectAction {
    None = 0,
    Select = 1,
    Move = 2,
    Resize = 3,
    Rotate = 4,
    BoxSelect = 5
}
export declare class SelectTool extends BaseTool {
    type: ToolType;
    baseCursor: CursorType;
    private currentAction;
    private startPoint;
    private currentHandle;
    private rotateStartAngle;
    private selectionCenter;
    private initialBoundingBox;
    private initialElementRotations;
    private initialElementStates;
    private rafId;
    private pendingPointerEvent;
    getCurrentAction(): SelectAction;
    getStartPoint(): Point | null;
    getCurrentHandle(): Direction | null;
    onDeactivate(): void;
    handlePointerDown(event: PointerInfo): void;
    handlePointerMove(event: PointerInfo): void;
    handlePointerUp(): void;
    private handleElementSelect;
    private handleMove;
    private handleResize;
    private handleRotate;
    private handleBoxSelect;
    private initializeBoxSelect;
    private initializeResize;
    private initializeRotation;
    private checkElementInSelectionBox;
    private getResizeDirection;
}
