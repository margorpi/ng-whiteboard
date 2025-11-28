import { Signal } from '@angular/core';
import { EventBusService } from '../event-bus';
import { CanvasService } from '../canvas/canvas.service';
import { ClipboardService } from '../input/clipboard.service';
import { ToolsService } from '../tools/tools.service';
import { AlignmentType, BoundingBox, SelectionBox, WhiteboardElement } from '../types';
import { ElementsService } from './elements.service';
import * as i0 from "@angular/core";
export declare class SelectionService {
    private eventBus;
    private clipboardService;
    private elementsService;
    private toolsService;
    private canvasService;
    private readonly OFFSET_INCREMENT;
    private readonly selectedElementIdsSignal;
    private readonly selectionBoxSignal;
    private readonly boundingBoxSignal;
    readonly selectedIdsSignal: Signal<string[]>;
    readonly hasSelectionSignal: Signal<boolean>;
    private getElementsFn?;
    private updateElementsFn?;
    private removeElementsFn?;
    constructor(eventBus: EventBusService, clipboardService: ClipboardService, elementsService: ElementsService, toolsService: ToolsService, canvasService: CanvasService);
    private initializeDataProviders;
    cutElements(): void;
    copyElements(): void;
    pasteElements(): void;
    duplicateElements(): void;
    deleteSelectedElements(): void;
    getSelectedIds(): string[];
    /**
     * Get currently selected elements
     */
    getSelectedElements(): WhiteboardElement[];
    getSelectedElementsSignal(): Signal<WhiteboardElement[]>;
    /**
     * Check if element is selected
     */
    isSelected(elementOrId: WhiteboardElement | string): boolean;
    /**
     * Get selection count
     */
    getSelectionCount(): number;
    /**
     * Check if any elements are selected
     */
    hasSelection(): boolean;
    /**
     * Select elements by reference or ID, with option to append to existing selection
     */
    selectElements(elementsOrIds: WhiteboardElement | WhiteboardElement[] | string | string[], append?: boolean): void;
    /**
     * Deselect specific element
     */
    deselectElement(elementOrId: WhiteboardElement | string): void;
    /**
     * Toggle selection of element
     */
    toggleSelection(elementOrId: WhiteboardElement | string): void;
    /**
     * Clear all selection
     */
    clearSelection(): void;
    /**
     * Select all elements
     */
    selectAll(): void;
    /**
     * Select elements within a rectangular area
     */
    selectElementsInArea(area: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): void;
    /**
     * Set selection box state
     */
    setSelectionBox(box: SelectionBox): void;
    /**
     * Get current selection box
     */
    getSelectionBox(): SelectionBox;
    /**
     * Get selection box signal
     */
    getSelectionBoxSignal(): Signal<SelectionBox>;
    /**
     * Clear selection box
     */
    clearSelectionBox(): void;
    /**
     * Update bounding box based on current selection
     */
    updateBoundingBox(): void;
    /**
     * Get current bounding box
     */
    getBoundingBox(): BoundingBox | null;
    /**
     * Get bounding box signal
     */
    getBoundingBoxSignal(): Signal<BoundingBox | null>;
    /**
     * Clear bounding box
     */
    clearBoundingBox(): void;
    /**
     * Set bounding box directly (useful for dynamic updates during rotation)
     */
    setBoundingBox(bbox: BoundingBox | null): void;
    /**
     * Get all elements that belong to the same groups as the provided elements
     */
    private expandSelectionToIncludeGroups;
    private calculateBoundingBox;
    private updateBoundingBoxFromElements;
    /**
     * Update all selected elements with partial data
     */
    updateSelectedElements(partial: Partial<WhiteboardElement>, updateElementsFn?: (elements: (Partial<WhiteboardElement> & {
        id: string;
    })[], history?: boolean) => void): void;
    /**
     * Transform selected elements using a transformation function
     */
    transformSelectedElements(transformFn: (elements: WhiteboardElement[]) => WhiteboardElement[], updateElementsFn?: (elements: (Partial<WhiteboardElement> & {
        id: string;
    })[], history?: boolean) => void): void;
    /**
     * Get selection bounds (combined bounds of all selected elements)
     */
    getSelectionBounds(): {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    } | null;
    /**
     * Check if selection contains specific element type
     */
    selectionContainsType(elementType: string): boolean;
    /**
     * Get unique element types in current selection
     */
    getSelectedElementTypes(): string[];
    /**
     * Remove selected elements
     */
    removeSelectedElements(): void;
    /**
     * Bring selected elements to front
     */
    bringToFront(): void;
    /**
     * Bring selected elements forward by one level
     */
    bringForward(): void;
    /**
     * Send selected elements backward by one level
     */
    sendBackward(): void;
    /**
     * Send selected elements to back
     */
    sendToBack(): void;
    /**
     * Group selected elements
     */
    groupSelectedElements(): void;
    /**
     * Ungroup selected elements
     */
    ungroupSelectedElements(): void;
    /**
     * Lock selected elements
     */
    lockElements(): void;
    /**
     * Unlock selected elements
     */
    unlockElements(): void;
    /**
     * Align selected elements
     */
    alignElements(alignment: AlignmentType): void;
    /**
     * Distribute selected elements horizontally with equal spacing
     */
    distributeHorizontally(): void;
    /**
     * Distribute selected elements vertically with equal spacing
     */
    distributeVertically(): void;
    /**
     * Calculate alignment updates for selected elements
     */
    private calculateAlignmentUpdates;
    /**
     * Flip selected elements horizontally
     */
    flipHorizontal(): void;
    /**
     * Flip selected elements vertically
     */
    flipVertical(): void;
    /**
     * Move selected elements by a given offset
     */
    moveSelectedElements(dx: number, dy: number): void;
    /**
     * Rotate selected elements by a given angle (in degrees)
     */
    rotateSelectedElements(angle: number): void;
    /**
     * Scale selected elements by a given factor
     */
    scaleSelectedElements(factor: number): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SelectionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SelectionService>;
}
