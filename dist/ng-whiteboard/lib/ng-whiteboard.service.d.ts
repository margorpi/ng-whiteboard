import { Signal } from '@angular/core';
import { AddImage, AlignmentType, BoundingBox, FormatType, SelectionBox, ToolType, WhiteboardConfig, WhiteboardElement, BlendMode, CursorType, ClipboardInfo } from './core/types';
import * as i0 from "@angular/core";
/**
 * Service providing a clean API for interacting with whiteboard instances.
 *
 * Key concepts:
 * - Each whiteboard component has a unique boardId
 * - Methods accept an optional boardId parameter to target a specific board
 * - Use signals(boardId) to get reactive signals for a specific board
 *
 * @example
 * ```typescript
 * class MyComponent {
 *   boardId = 'my-board';
 *   layers = this.whiteboardService.signals(this.boardId).layers;
 *   elements = this.whiteboardService.signals(this.boardId).elements;
 *
 *   clear() {
 *     this.whiteboardService.clear(this.boardId);
 *   }
 * }
 * ```
 */
export declare class NgWhiteboardService {
    private readonly instanceService;
    private activeBoardId;
    /**
     * Set the active board. Methods without boardId parameter will use this board.
     * @param boardId - The ID of the board to make active, or null to clear active board
     */
    setActiveBoard(boardId: string | null): void;
    /**
     * Get the currently active board ID
     */
    getActiveBoard(): string | null;
    /**
     * Get the API instance for a specific board, or the active board if no boardId provided.
     * @param boardId - Optional board ID. If not provided, uses the active board.
     * @throws Error if boardId is not provided and no active board is set.
     * @throws Error if the specified board is not found.
     */
    private getApi;
    /**
     * Get reactive signals for a specific board.
     * These signals are bound to the specified board and will update when that board's data changes.
     * Signals are lazy and won't throw errors until actually accessed.
     *
     * @param boardId - The unique identifier of the whiteboard
     * @returns Object containing all reactive signals for the board
     *
     * @example
     * ```typescript
     * class MyComponent {
     *   boardId = 'my-board';
     *   private signals = this.whiteboardService.signals(this.boardId);
     *   layers = this.signals.layers;
     *   elements = this.signals.elements;
     * }
     * ```
     */
    signals(boardId: string): {
        elements: Signal<WhiteboardElement[]>;
        selectedElements: Signal<WhiteboardElement[]>;
        config: Signal<WhiteboardConfig>;
        elementsCount: Signal<number>;
        hasElements: Signal<boolean>;
        selectedTool: Signal<ToolType>;
        availableTools: Signal<readonly import("./core/types").ToolConfig[]>;
        layers: Signal<import("./core/types").WhiteboardLayer[]>;
        activeLayerId: Signal<string | null>;
        activeLayer: Signal<import("./core/types").WhiteboardLayer | null>;
        canUndo: Signal<boolean>;
        canRedo: Signal<boolean>;
        selectionBox: Signal<SelectionBox | {
            x: number;
            y: number;
            width: number;
            height: number;
        }>;
        boundingBox: Signal<BoundingBox | null>;
    };
    /**
     * Get all registered whiteboard instance IDs.
     */
    getAllBoards(): ReadonlyArray<string>;
    /**
     * Get the total number of registered whiteboard instances.
     */
    getBoardCount(): number;
    /**
     * Check if a whiteboard with the given ID exists.
     */
    hasBoard(boardId: string): boolean;
    /**
     * Set elements for the whiteboard.
     */
    setElements(elements: WhiteboardElement[]): void;
    /**
     * Get all elements from the whiteboard.
     */
    getElements(): WhiteboardElement[];
    /**
     * Add new elements to the whiteboard.
     */
    addElements(elements: WhiteboardElement[]): void;
    /**
     * Update multiple elements.
     */
    updateElements(elements: Array<Partial<WhiteboardElement> & {
        id: string;
    }>): void;
    /**
     * Remove elements from the whiteboard.
     */
    removeElements(elements: WhiteboardElement[]): void;
    /**
     * Clear all elements from the whiteboard.
     */
    clear(): void;
    /**
     * Clear all elements and selection.
     */
    clearAll(): void;
    /**
     * Add a single element to the whiteboard.
     */
    addElement(element: WhiteboardElement): void;
    /**
     * Update an existing element.
     */
    updateElement(element: WhiteboardElement): void;
    /**
     * Remove elements by their IDs.
     */
    removeElementsByIds(elementIds: string[]): void;
    /**
     * Get element by ID.
     */
    getElementById(id: string): WhiteboardElement | undefined;
    /**
     * Get multiple elements by their IDs.
     */
    getElementsByIds(ids: string[]): WhiteboardElement[];
    /**
     * Get next available Z-index.
     */
    getNextZIndex(): number;
    /**
     * Check if an element exists.
     */
    elementExists(elementId: string): boolean;
    /**
     * Select elements on the whiteboard.
     */
    selectElements(elementsOrIds: WhiteboardElement | WhiteboardElement[] | string | string[], append?: boolean): void;
    /**
     * Deselect an element.
     */
    deselectElement(elementOrId: WhiteboardElement | string): void;
    /**
     * Toggle element selection.
     */
    toggleSelection(elementOrId: WhiteboardElement | string): void;
    /**
     * Clear the selection.
     */
    clearSelection(): void;
    /**
     * Select all elements.
     */
    selectAll(): void;
    /**
     * Get currently selected elements.
     */
    getSelectedElements(): WhiteboardElement[];
    /**
     * Update selected elements with partial properties.
     */
    updateSelectedElements(partialElement: Partial<WhiteboardElement>): void;
    /**
     * Remove selected elements.
     */
    removeSelectedElements(): void;
    /**
     * Check if an element is selected.
     */
    isSelected(elementOrId: WhiteboardElement | string): boolean;
    /**
     * Clear the selection box.
     */
    clearSelectionBox(): void;
    /**
     * Transform selected elements using a transformation function.
     */
    transformSelectedElements(transformFn: (elements: WhiteboardElement[]) => WhiteboardElement[]): void;
    /**
     * Set the selection box.
     */
    setSelectionBox(selectionBox: SelectionBox): void;
    /**
     * Update bounding box for selected elements.
     */
    updateBoundingBox(): void;
    /**
     * Get clipboard information.
     */
    getClipboardInfo(): ClipboardInfo | null;
    /**
     * Copy selected elements to clipboard.
     */
    copyElements(): void;
    /**
     * Cut selected elements.
     */
    cutElements(): void;
    /**
     * Paste elements from clipboard.
     */
    pasteElements(): void;
    /**
     * Duplicate selected elements.
     */
    duplicateElements(): void;
    /**
     * Delete selected elements.
     */
    deleteSelectedElements(): void;
    /**
     * Bring selected elements to front.
     */
    bringToFront(): void;
    /**
     * Bring selected elements forward by one level.
     */
    bringForward(): void;
    /**
     * Send selected elements backward by one level.
     */
    sendBackward(): void;
    /**
     * Send selected elements to back.
     */
    sendToBack(): void;
    /**
     * Group selected elements.
     */
    groupSelectedElements(): void;
    /**
     * Ungroup selected elements.
     */
    ungroupSelectedElements(): void;
    /**
     * Lock selected elements.
     */
    lockElements(): void;
    /**
     * Unlock selected elements.
     */
    unlockElements(): void;
    /**
     * Align selected elements.
     */
    alignElements(alignment: AlignmentType): void;
    /**
     * Get the canvas SVG element.
     */
    getCanvas(): SVGSVGElement;
    /**
     * Set canvas dimensions.
     */
    setCanvasDimensions(width: number, height: number): void;
    /**
     * Center the canvas.
     */
    centerCanvas(): void;
    /**
     * Toggle fullscreen mode.
     */
    fullScreen(): void;
    /**
     * Exit fullscreen mode.
     */
    exitFullScreen(defaultWidth?: number, defaultHeight?: number): void;
    /**
     * Reset canvas to default state.
     */
    resetCanvas(): void;
    /**
     * Set zoom level.
     */
    setZoom(zoom: number): void;
    /**
     * Zoom in.
     */
    zoomIn(): void;
    /**
     * Zoom out.
     */
    zoomOut(): void;
    /**
     * Reset zoom to default.
     */
    resetZoom(): void;
    /**
     * Zoom to fit all elements.
     */
    zoomToFit(): void;
    /**
     * Zoom to fit selected elements.
     */
    zoomToSelection(): void;
    /**
     * Pan the canvas by delta values.
     */
    pan(dx: number, dy: number): void;
    /**
     * Pan to a specific position.
     */
    panTo(x: number, y: number): void;
    /**
     * Reset pan to default.
     */
    resetPan(): void;
    /**
     * Save the whiteboard in the specified format.
     */
    save(format?: FormatType, name?: string): Promise<string>;
    /**
     * Add an image to the whiteboard.
     */
    addImage(imageInfo: AddImage): void;
    /**
     * Import an image from a file.
     */
    importImageFile(file: File, x?: number, y?: number): Promise<void>;
    /**
     * Export whiteboard data as JSON.
     */
    exportData(): string;
    /**
     * Import whiteboard data from JSON.
     */
    importData(jsonData: string): void;
    /**
     * Undo the last action.
     */
    undo(): boolean;
    /**
     * Redo the last undone action.
     */
    redo(): boolean;
    /**
     * Get signal for undo availability.
     */
    getCanUndoSignal(): Signal<boolean>;
    /**
     * Get signal for redo availability.
     */
    getCanRedoSignal(): Signal<boolean>;
    /**
     * Clear undo/redo history.
     */
    clearHistory(): void;
    /**
     * Get current whiteboard configuration.
     */
    getConfig(): WhiteboardConfig;
    /**
     * Update whiteboard configuration.
     */
    updateConfig(config: Partial<WhiteboardConfig>): void;
    /**
     * Update a single configuration value.
     */
    updateConfigValue<K extends keyof WhiteboardConfig>(key: K, value: WhiteboardConfig[K]): void;
    /**
     * Add a new layer.
     */
    addLayer(name?: string): void;
    /**
     * Remove a layer by ID.
     */
    removeLayer(id: string): boolean;
    /**
     * Set the active layer.
     */
    setActiveLayer(id: string): boolean;
    /**
     * Get the active layer ID.
     */
    getActiveLayerId(): string;
    /**
     * Toggle layer visibility.
     */
    toggleLayerVisibility(id: string): boolean;
    /**
     * Toggle layer lock state.
     */
    toggleLayerLock(id: string): boolean;
    /**
     * Rename a layer.
     */
    renameLayer(id: string, name: string): boolean;
    /**
     * Set layer opacity (0-1).
     */
    setLayerOpacity(id: string, opacity: number): boolean;
    /**
     * Set layer blend mode.
     */
    setLayerBlendMode(id: string, blendMode: BlendMode): boolean;
    /**
     * Move layer up in z-order.
     */
    moveLayerUp(id: string): boolean;
    /**
     * Move layer down in z-order.
     */
    moveLayerDown(id: string): boolean;
    /**
     * Reorder layers by index position.
     *
     * @example
     * ```typescript
     * this.whiteboardService.reorderLayersByIndex(2, 0);
     * ```
     */
    reorderLayersByIndex(previousIndex: number, currentIndex: number): boolean;
    /**
     * Toggle grid visibility.
     */
    toggleGrid(): void;
    /**
     * Toggle snap to grid.
     */
    toggleSnapToGrid(): void;
    /**
     * Set grid size.
     */
    setGridSize(size: number): void;
    /**
     * Set the active drawing tool.
     */
    setActiveTool(tool: ToolType): void;
    /**
     * Get the currently active tool.
     */
    getActiveTool(): ToolType;
    /**
     * Enable or disable a specific tool.
     */
    setToolEnabled(toolType: ToolType, enabled: boolean): boolean;
    /**
     * Set which tools should be enabled.
     */
    setEnabledTools(toolTypes: ToolType[]): void;
    /**
     * Set cursor explicitly.
     */
    setCursor(cursor: CursorType): void;
    /**
     * Reset cursor to default.
     */
    resetCursor(): void;
    /**
     * Convert screen coordinates to canvas coordinates.
     */
    screenToCanvas(screenX: number, screenY: number): {
        x: number;
        y: number;
    };
    /**
     * Convert canvas coordinates to screen coordinates.
     */
    canvasToScreen(canvasX: number, canvasY: number): {
        x: number;
        y: number;
    };
    /**
     * Get selection box signal.
     */
    getSelectionBoxSignal(): Signal<SelectionBox>;
    /**
     * Get bounding box signal.
     */
    getBoundingBoxSignal(): Signal<BoundingBox | null>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgWhiteboardService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgWhiteboardService>;
}
