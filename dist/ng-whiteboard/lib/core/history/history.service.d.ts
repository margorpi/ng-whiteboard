import { WhiteboardElement } from '../types';
import * as i0 from "@angular/core";
interface BatchHandle {
    execute: () => void;
    clear: () => void;
}
export declare class HistoryService {
    private undoStack;
    private redoStack;
    private readonly MAX_HISTORY;
    private canUndoSignal;
    private canRedoSignal;
    private undoDescriptionSignal;
    private redoDescriptionSignal;
    private batching;
    private batchDepth;
    private batchBeforeSnapshot;
    private batchDescription;
    private pendingBatchAfter;
    getCanUndoSignal(): import("@angular/core").Signal<boolean>;
    getCanRedoSignal(): import("@angular/core").Signal<boolean>;
    getUndoDescriptionSignal(): import("@angular/core").Signal<string | undefined>;
    getRedoDescriptionSignal(): import("@angular/core").Signal<string | undefined>;
    recordChange(before: WhiteboardElement[], after: WhiteboardElement[], description: string): void;
    recordElementCreation(before: WhiteboardElement[], after: WhiteboardElement[]): void;
    recordElementUpdate(before: WhiteboardElement[], after: WhiteboardElement[]): void;
    recordElementDeletion(before: WhiteboardElement[], after: WhiteboardElement[]): void;
    recordClear(before: WhiteboardElement[], after: WhiteboardElement[]): void;
    startBatch(description: string, beforeSnapshot: WhiteboardElement[]): BatchHandle;
    completeBatch(afterSnapshot: WhiteboardElement[]): void;
    private finishBatchCommit;
    private cancelBatch;
    private resetBatchState;
    undo(): WhiteboardElement[] | null;
    redo(): WhiteboardElement[] | null;
    clearHistory(): void;
    private performUndo;
    private performRedo;
    private pushHistory;
    private updateSignals;
    private cloneElements;
    private snapshotsEqual;
    static ɵfac: i0.ɵɵFactoryDeclaration<HistoryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HistoryService>;
}
export {};
