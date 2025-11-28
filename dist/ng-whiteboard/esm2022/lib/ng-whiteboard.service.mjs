import { Injectable, computed, inject, signal } from '@angular/core';
import { InstanceService } from './core/canvas/instance.service';
import { FormatType, ToolType, } from './core/types';
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
export class NgWhiteboardService {
    instanceService = inject(InstanceService);
    activeBoardId = signal(null);
    /**
     * Set the active board. Methods without boardId parameter will use this board.
     * @param boardId - The ID of the board to make active, or null to clear active board
     */
    setActiveBoard(boardId) {
        this.activeBoardId.set(boardId);
    }
    /**
     * Get the currently active board ID
     */
    getActiveBoard() {
        return this.activeBoardId();
    }
    /**
     * Get the API instance for a specific board, or the active board if no boardId provided.
     * @param boardId - Optional board ID. If not provided, uses the active board.
     * @throws Error if boardId is not provided and no active board is set.
     * @throws Error if the specified board is not found.
     */
    getApi(boardId) {
        const targetBoardId = boardId || this.activeBoardId();
        if (!targetBoardId) {
            throw new Error('NgWhiteboardService: No boardId provided and no active board set. Call setActiveBoard() first or pass boardId parameter.');
        }
        const instance = this.instanceService.getInstance(targetBoardId);
        if (!instance) {
            throw new Error(`NgWhiteboardService: Board "${targetBoardId}" not found. Ensure the whiteboard component is initialized.`);
        }
        return instance;
    }
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
    signals(boardId) {
        return {
            elements: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.elements() : [];
            }),
            selectedElements: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.selectedElements() : [];
            }),
            config: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.config() : {};
            }),
            elementsCount: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.elementsCount() : 0;
            }),
            hasElements: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.hasElements() : false;
            }),
            selectedTool: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.selectedTool() : ToolType.Pen;
            }),
            availableTools: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.availableTools() : [];
            }),
            layers: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.layers() : [];
            }),
            activeLayerId: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.activeLayerId() : null;
            }),
            activeLayer: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.activeLayer() : null;
            }),
            canUndo: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.getCanUndoSignal()() : false;
            }),
            canRedo: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.getCanRedoSignal()() : false;
            }),
            selectionBox: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.getSelectionBoxSignal()() : { x: 0, y: 0, width: 0, height: 0 };
            }),
            boundingBox: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.getBoundingBoxSignal()() : null;
            }),
        };
    }
    /**
     * Get all registered whiteboard instance IDs.
     */
    getAllBoards() {
        return this.instanceService.getAllInstanceIds();
    }
    /**
     * Get the total number of registered whiteboard instances.
     */
    getBoardCount() {
        return this.instanceService.getInstanceCount();
    }
    /**
     * Check if a whiteboard with the given ID exists.
     */
    hasBoard(boardId) {
        return this.instanceService.hasInstance(boardId);
    }
    /**
     * Set elements for the whiteboard.
     */
    setElements(elements) {
        const instance = this.getApi();
        instance.setElements(elements);
    }
    /**
     * Get all elements from the whiteboard.
     */
    getElements() {
        const instance = this.getApi();
        return instance.getElements();
    }
    /**
     * Add new elements to the whiteboard.
     */
    addElements(elements) {
        const instance = this.getApi();
        instance.addElements(elements);
    }
    /**
     * Update multiple elements.
     */
    updateElements(elements) {
        const instance = this.getApi();
        instance.updateElements(elements);
    }
    /**
     * Remove elements from the whiteboard.
     */
    removeElements(elements) {
        const instance = this.getApi();
        instance.removeElements(elements);
    }
    /**
     * Clear all elements from the whiteboard.
     */
    clear() {
        const instance = this.getApi();
        instance.clear();
    }
    /**
     * Clear all elements and selection.
     */
    clearAll() {
        const instance = this.getApi();
        instance.clearAll();
    }
    /**
     * Add a single element to the whiteboard.
     */
    addElement(element) {
        const instance = this.getApi();
        instance.addElement(element);
    }
    /**
     * Update an existing element.
     */
    updateElement(element) {
        const instance = this.getApi();
        instance.updateElement(element);
    }
    /**
     * Remove elements by their IDs.
     */
    removeElementsByIds(elementIds) {
        const instance = this.getApi();
        instance.removeElementsByIds(elementIds);
    }
    /**
     * Get element by ID.
     */
    getElementById(id) {
        const instance = this.getApi();
        return instance.getElementById(id);
    }
    /**
     * Get multiple elements by their IDs.
     */
    getElementsByIds(ids) {
        const instance = this.getApi();
        return instance.getElementsByIds(ids);
    }
    /**
     * Get next available Z-index.
     */
    getNextZIndex() {
        const instance = this.getApi();
        return instance.getNextZIndex();
    }
    /**
     * Check if an element exists.
     */
    elementExists(elementId) {
        const instance = this.getApi();
        return instance.elementExists(elementId);
    }
    /**
     * Select elements on the whiteboard.
     */
    selectElements(elementsOrIds, append = false) {
        const instance = this.getApi();
        instance.selectElements(elementsOrIds, append);
    }
    /**
     * Deselect an element.
     */
    deselectElement(elementOrId) {
        const instance = this.getApi();
        instance.deselectElement(elementOrId);
    }
    /**
     * Toggle element selection.
     */
    toggleSelection(elementOrId) {
        const instance = this.getApi();
        instance.toggleSelection(elementOrId);
    }
    /**
     * Clear the selection.
     */
    clearSelection() {
        const instance = this.getApi();
        instance.clearSelection();
    }
    /**
     * Select all elements.
     */
    selectAll() {
        const instance = this.getApi();
        instance.selectAll();
    }
    /**
     * Get currently selected elements.
     */
    getSelectedElements() {
        const instance = this.getApi();
        return instance.getSelectedElements();
    }
    /**
     * Update selected elements with partial properties.
     */
    updateSelectedElements(partialElement) {
        const instance = this.getApi();
        instance.updateSelectedElements(partialElement);
    }
    /**
     * Remove selected elements.
     */
    removeSelectedElements() {
        const instance = this.getApi();
        instance.removeSelectedElements();
    }
    /**
     * Check if an element is selected.
     */
    isSelected(elementOrId) {
        const instance = this.getApi();
        return instance.isSelected(elementOrId);
    }
    /**
     * Clear the selection box.
     */
    clearSelectionBox() {
        const instance = this.getApi();
        instance.clearSelectionBox();
    }
    /**
     * Transform selected elements using a transformation function.
     */
    transformSelectedElements(transformFn) {
        const instance = this.getApi();
        instance.transformSelectedElements(transformFn);
    }
    /**
     * Set the selection box.
     */
    setSelectionBox(selectionBox) {
        const instance = this.getApi();
        instance.setSelectionBox(selectionBox);
    }
    /**
     * Update bounding box for selected elements.
     */
    updateBoundingBox() {
        const instance = this.getApi();
        instance.updateBoundingBox();
    }
    /**
     * Get clipboard information.
     */
    getClipboardInfo() {
        const instance = this.getApi();
        return instance.getClipboardInfo();
    }
    /**
     * Copy selected elements to clipboard.
     */
    copyElements() {
        const instance = this.getApi();
        instance.copyElements();
    }
    /**
     * Cut selected elements.
     */
    cutElements() {
        const instance = this.getApi();
        instance.cutElements();
    }
    /**
     * Paste elements from clipboard.
     */
    pasteElements() {
        const instance = this.getApi();
        instance.pasteElements();
    }
    /**
     * Duplicate selected elements.
     */
    duplicateElements() {
        const instance = this.getApi();
        instance.duplicateElements();
    }
    /**
     * Delete selected elements.
     */
    deleteSelectedElements() {
        const instance = this.getApi();
        instance.deleteSelectedElements();
    }
    /**
     * Bring selected elements to front.
     */
    bringToFront() {
        const instance = this.getApi();
        instance.bringToFront();
    }
    /**
     * Bring selected elements forward by one level.
     */
    bringForward() {
        const instance = this.getApi();
        instance.bringForward();
    }
    /**
     * Send selected elements backward by one level.
     */
    sendBackward() {
        const instance = this.getApi();
        instance.sendBackward();
    }
    /**
     * Send selected elements to back.
     */
    sendToBack() {
        const instance = this.getApi();
        instance.sendToBack();
    }
    /**
     * Group selected elements.
     */
    groupSelectedElements() {
        const instance = this.getApi();
        instance.groupSelectedElements();
    }
    /**
     * Ungroup selected elements.
     */
    ungroupSelectedElements() {
        const instance = this.getApi();
        instance.ungroupSelectedElements();
    }
    /**
     * Lock selected elements.
     */
    lockElements() {
        const instance = this.getApi();
        instance.lockElements();
    }
    /**
     * Unlock selected elements.
     */
    unlockElements() {
        const instance = this.getApi();
        instance.unlockElements();
    }
    /**
     * Align selected elements.
     */
    alignElements(alignment) {
        const instance = this.getApi();
        instance.alignElements(alignment);
    }
    /**
     * Get the canvas SVG element.
     */
    getCanvas() {
        const instance = this.getApi();
        return instance.getCanvas();
    }
    /**
     * Set canvas dimensions.
     */
    setCanvasDimensions(width, height) {
        const instance = this.getApi();
        instance.setCanvasDimensions(width, height);
    }
    /**
     * Center the canvas.
     */
    centerCanvas() {
        const instance = this.getApi();
        instance.centerCanvas();
    }
    /**
     * Toggle fullscreen mode.
     */
    fullScreen() {
        const instance = this.getApi();
        instance.fullScreen();
    }
    /**
     * Exit fullscreen mode.
     */
    exitFullScreen(defaultWidth, defaultHeight) {
        const instance = this.getApi();
        instance.exitFullScreen(defaultWidth, defaultHeight);
    }
    /**
     * Reset canvas to default state.
     */
    resetCanvas() {
        const instance = this.getApi();
        instance.resetCanvas();
    }
    /**
     * Set zoom level.
     */
    setZoom(zoom) {
        const instance = this.getApi();
        instance.setZoom(zoom);
    }
    /**
     * Zoom in.
     */
    zoomIn() {
        const instance = this.getApi();
        instance.zoomIn();
    }
    /**
     * Zoom out.
     */
    zoomOut() {
        const instance = this.getApi();
        instance.zoomOut();
    }
    /**
     * Reset zoom to default.
     */
    resetZoom() {
        const instance = this.getApi();
        instance.resetZoom();
    }
    /**
     * Zoom to fit all elements.
     */
    zoomToFit() {
        const instance = this.getApi();
        instance.zoomToFit();
    }
    /**
     * Zoom to fit selected elements.
     */
    zoomToSelection() {
        const instance = this.getApi();
        instance.zoomToSelection();
    }
    /**
     * Pan the canvas by delta values.
     */
    pan(dx, dy) {
        const instance = this.getApi();
        instance.pan(dx, dy);
    }
    /**
     * Pan to a specific position.
     */
    panTo(x, y) {
        const instance = this.getApi();
        instance.panTo(x, y);
    }
    /**
     * Reset pan to default.
     */
    resetPan() {
        const instance = this.getApi();
        instance.resetPan();
    }
    /**
     * Save the whiteboard in the specified format.
     */
    async save(format = FormatType.Base64, name = 'whiteboard') {
        const instance = this.getApi();
        return instance.save(format, name);
    }
    /**
     * Add an image to the whiteboard.
     */
    addImage(imageInfo) {
        const instance = this.getApi();
        instance.addImage(imageInfo);
    }
    /**
     * Import an image from a file.
     */
    async importImageFile(file, x, y) {
        const instance = this.getApi();
        return instance.importImageFile(file, x, y);
    }
    /**
     * Export whiteboard data as JSON.
     */
    exportData() {
        const instance = this.getApi();
        return instance.exportData();
    }
    /**
     * Import whiteboard data from JSON.
     */
    importData(jsonData) {
        const instance = this.getApi();
        instance.importData(jsonData);
    }
    /**
     * Undo the last action.
     */
    undo() {
        const instance = this.getApi();
        return instance.undo();
    }
    /**
     * Redo the last undone action.
     */
    redo() {
        const instance = this.getApi();
        return instance.redo();
    }
    /**
     * Get signal for undo availability.
     */
    getCanUndoSignal() {
        const instance = this.getApi();
        return instance.getCanUndoSignal();
    }
    /**
     * Get signal for redo availability.
     */
    getCanRedoSignal() {
        const instance = this.getApi();
        return instance.getCanRedoSignal();
    }
    /**
     * Clear undo/redo history.
     */
    clearHistory() {
        const instance = this.getApi();
        instance.clearHistory();
    }
    /**
     * Get current whiteboard configuration.
     */
    getConfig() {
        const instance = this.getApi();
        return instance.getConfig();
    }
    /**
     * Update whiteboard configuration.
     */
    updateConfig(config) {
        const instance = this.getApi();
        instance.updateConfig(config);
    }
    /**
     * Update a single configuration value.
     */
    updateConfigValue(key, value) {
        const instance = this.getApi();
        instance.updateConfigValue(key, value);
    }
    /**
     * Add a new layer.
     */
    addLayer(name) {
        const instance = this.getApi();
        instance.addLayer(name);
    }
    /**
     * Remove a layer by ID.
     */
    removeLayer(id) {
        const instance = this.getApi();
        return instance.removeLayer(id);
    }
    /**
     * Set the active layer.
     */
    setActiveLayer(id) {
        const instance = this.getApi();
        return instance.setActiveLayer(id);
    }
    /**
     * Get the active layer ID.
     */
    getActiveLayerId() {
        const instance = this.getApi();
        return instance.getActiveLayerId();
    }
    /**
     * Toggle layer visibility.
     */
    toggleLayerVisibility(id) {
        const instance = this.getApi();
        return instance.toggleLayerVisibility(id);
    }
    /**
     * Toggle layer lock state.
     */
    toggleLayerLock(id) {
        const instance = this.getApi();
        return instance.toggleLayerLock(id);
    }
    /**
     * Rename a layer.
     */
    renameLayer(id, name) {
        const instance = this.getApi();
        return instance.renameLayer(id, name);
    }
    /**
     * Set layer opacity (0-1).
     */
    setLayerOpacity(id, opacity) {
        const instance = this.getApi();
        return instance.setLayerOpacity(id, opacity);
    }
    /**
     * Set layer blend mode.
     */
    setLayerBlendMode(id, blendMode) {
        const instance = this.getApi();
        return instance.setLayerBlendMode(id, blendMode);
    }
    /**
     * Move layer up in z-order.
     */
    moveLayerUp(id) {
        const instance = this.getApi();
        return instance.moveLayerUp(id);
    }
    /**
     * Move layer down in z-order.
     */
    moveLayerDown(id) {
        const instance = this.getApi();
        return instance.moveLayerDown(id);
    }
    /**
     * Reorder layers by index position.
     *
     * @example
     * ```typescript
     * this.whiteboardService.reorderLayersByIndex(2, 0);
     * ```
     */
    reorderLayersByIndex(previousIndex, currentIndex) {
        const instance = this.getApi();
        return instance.reorderLayersByIndex(previousIndex, currentIndex);
    }
    /**
     * Toggle grid visibility.
     */
    toggleGrid() {
        const instance = this.getApi();
        instance.toggleGrid();
    }
    /**
     * Toggle snap to grid.
     */
    toggleSnapToGrid() {
        const instance = this.getApi();
        instance.toggleSnapToGrid();
    }
    /**
     * Set grid size.
     */
    setGridSize(size) {
        const instance = this.getApi();
        instance.setGridSize(size);
    }
    /**
     * Set the active drawing tool.
     */
    setActiveTool(tool) {
        const instance = this.getApi();
        instance.setActiveTool(tool);
    }
    /**
     * Get the currently active tool.
     */
    getActiveTool() {
        const instance = this.getApi();
        return instance.getActiveTool();
    }
    /**
     * Enable or disable a specific tool.
     */
    setToolEnabled(toolType, enabled) {
        const instance = this.getApi();
        return instance.setToolEnabled(toolType, enabled);
    }
    /**
     * Set which tools should be enabled.
     */
    setEnabledTools(toolTypes) {
        const instance = this.getApi();
        instance.setEnabledTools(toolTypes);
    }
    /**
     * Set cursor explicitly.
     */
    setCursor(cursor) {
        const instance = this.getApi();
        instance.setCursor(cursor);
    }
    /**
     * Reset cursor to default.
     */
    resetCursor() {
        const instance = this.getApi();
        instance.resetCursor();
    }
    /**
     * Convert screen coordinates to canvas coordinates.
     */
    screenToCanvas(screenX, screenY) {
        const instance = this.getApi();
        return instance.screenToCanvas(screenX, screenY);
    }
    /**
     * Convert canvas coordinates to screen coordinates.
     */
    canvasToScreen(canvasX, canvasY) {
        const instance = this.getApi();
        return instance.canvasToScreen(canvasX, canvasY);
    }
    /**
     * Get selection box signal.
     */
    getSelectionBoxSignal() {
        const instance = this.getApi();
        return instance.getSelectionBoxSignal();
    }
    /**
     * Get bounding box signal.
     */
    getBoundingBoxSignal() {
        const instance = this.getApi();
        return instance.getBoundingBoxSignal();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NgWhiteboardService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NgWhiteboardService });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NgWhiteboardService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctd2hpdGVib2FyZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmctd2hpdGVib2FyZC9zcmMvbGliL25nLXdoaXRlYm9hcmQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFVLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNqRSxPQUFPLEVBSUwsVUFBVSxFQUVWLFFBQVEsR0FNVCxNQUFNLGNBQWMsQ0FBQzs7QUFFdEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0JHO0FBRUgsTUFBTSxPQUFPLG1CQUFtQjtJQUNiLGVBQWUsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDbkQsYUFBYSxHQUFHLE1BQU0sQ0FBZ0IsSUFBSSxDQUFDLENBQUM7SUFFcEQ7OztPQUdHO0lBQ0gsY0FBYyxDQUFDLE9BQXNCO1FBQ25DLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7T0FFRztJQUNILGNBQWM7UUFDWixPQUFPLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyxNQUFNLENBQUMsT0FBZ0I7UUFDN0IsTUFBTSxhQUFhLEdBQUcsT0FBTyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN0RCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FDYiwwSEFBMEgsQ0FDM0gsQ0FBQztRQUNKLENBQUM7UUFDRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsUUFBUSxFQUFFLENB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SUFDSSxjQUFjLENBQUMsT0FBZSxFQUFFLE9BQWU7UUFDcEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQy9CLE9BQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVEOztPQUVHO0lBQ0ksY0FBYyxDQUFDLE9BQWUsRUFBRSxPQUFlO1FBQ3BELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMvQixPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRDs7T0FFRztJQUNJLHFCQUFxQjtRQUMxQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDL0IsT0FBTyxRQUFRLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxvQkFBb0I7UUFDekIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQy9CLE9BQU8sUUFBUSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDekMsQ0FBQzt3R0F6NUJVLG1CQUFtQjs0R0FBbkIsbUJBQW1COzs0RkFBbkIsbUJBQW1CO2tCQUQvQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgU2lnbmFsLCBjb21wdXRlZCwgaW5qZWN0LCBzaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSW5zdGFuY2VTZXJ2aWNlIH0gZnJvbSAnLi9jb3JlL2NhbnZhcy9pbnN0YW5jZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtcclxuICBBZGRJbWFnZSxcclxuICBBbGlnbm1lbnRUeXBlLFxyXG4gIEJvdW5kaW5nQm94LFxyXG4gIEZvcm1hdFR5cGUsXHJcbiAgU2VsZWN0aW9uQm94LFxyXG4gIFRvb2xUeXBlLFxyXG4gIFdoaXRlYm9hcmRDb25maWcsXHJcbiAgV2hpdGVib2FyZEVsZW1lbnQsXHJcbiAgQmxlbmRNb2RlLFxyXG4gIEN1cnNvclR5cGUsXHJcbiAgQ2xpcGJvYXJkSW5mbyxcclxufSBmcm9tICcuL2NvcmUvdHlwZXMnO1xyXG5cclxuLyoqXHJcbiAqIFNlcnZpY2UgcHJvdmlkaW5nIGEgY2xlYW4gQVBJIGZvciBpbnRlcmFjdGluZyB3aXRoIHdoaXRlYm9hcmQgaW5zdGFuY2VzLlxyXG4gKlxyXG4gKiBLZXkgY29uY2VwdHM6XHJcbiAqIC0gRWFjaCB3aGl0ZWJvYXJkIGNvbXBvbmVudCBoYXMgYSB1bmlxdWUgYm9hcmRJZFxyXG4gKiAtIE1ldGhvZHMgYWNjZXB0IGFuIG9wdGlvbmFsIGJvYXJkSWQgcGFyYW1ldGVyIHRvIHRhcmdldCBhIHNwZWNpZmljIGJvYXJkXHJcbiAqIC0gVXNlIHNpZ25hbHMoYm9hcmRJZCkgdG8gZ2V0IHJlYWN0aXZlIHNpZ25hbHMgZm9yIGEgc3BlY2lmaWMgYm9hcmRcclxuICpcclxuICogQGV4YW1wbGVcclxuICogYGBgdHlwZXNjcmlwdFxyXG4gKiBjbGFzcyBNeUNvbXBvbmVudCB7XHJcbiAqICAgYm9hcmRJZCA9ICdteS1ib2FyZCc7XHJcbiAqICAgbGF5ZXJzID0gdGhpcy53aGl0ZWJvYXJkU2VydmljZS5zaWduYWxzKHRoaXMuYm9hcmRJZCkubGF5ZXJzO1xyXG4gKiAgIGVsZW1lbnRzID0gdGhpcy53aGl0ZWJvYXJkU2VydmljZS5zaWduYWxzKHRoaXMuYm9hcmRJZCkuZWxlbWVudHM7XHJcbiAqXHJcbiAqICAgY2xlYXIoKSB7XHJcbiAqICAgICB0aGlzLndoaXRlYm9hcmRTZXJ2aWNlLmNsZWFyKHRoaXMuYm9hcmRJZCk7XHJcbiAqICAgfVxyXG4gKiB9XHJcbiAqIGBgYFxyXG4gKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTmdXaGl0ZWJvYXJkU2VydmljZSB7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBpbnN0YW5jZVNlcnZpY2UgPSBpbmplY3QoSW5zdGFuY2VTZXJ2aWNlKTtcclxuICBwcml2YXRlIGFjdGl2ZUJvYXJkSWQgPSBzaWduYWw8c3RyaW5nIHwgbnVsbD4obnVsbCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGUgYWN0aXZlIGJvYXJkLiBNZXRob2RzIHdpdGhvdXQgYm9hcmRJZCBwYXJhbWV0ZXIgd2lsbCB1c2UgdGhpcyBib2FyZC5cclxuICAgKiBAcGFyYW0gYm9hcmRJZCAtIFRoZSBJRCBvZiB0aGUgYm9hcmQgdG8gbWFrZSBhY3RpdmUsIG9yIG51bGwgdG8gY2xlYXIgYWN0aXZlIGJvYXJkXHJcbiAgICovXHJcbiAgc2V0QWN0aXZlQm9hcmQoYm9hcmRJZDogc3RyaW5nIHwgbnVsbCk6IHZvaWQge1xyXG4gICAgdGhpcy5hY3RpdmVCb2FyZElkLnNldChib2FyZElkKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgY3VycmVudGx5IGFjdGl2ZSBib2FyZCBJRFxyXG4gICAqL1xyXG4gIGdldEFjdGl2ZUJvYXJkKCk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlQm9hcmRJZCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBBUEkgaW5zdGFuY2UgZm9yIGEgc3BlY2lmaWMgYm9hcmQsIG9yIHRoZSBhY3RpdmUgYm9hcmQgaWYgbm8gYm9hcmRJZCBwcm92aWRlZC5cclxuICAgKiBAcGFyYW0gYm9hcmRJZCAtIE9wdGlvbmFsIGJvYXJkIElELiBJZiBub3QgcHJvdmlkZWQsIHVzZXMgdGhlIGFjdGl2ZSBib2FyZC5cclxuICAgKiBAdGhyb3dzIEVycm9yIGlmIGJvYXJkSWQgaXMgbm90IHByb3ZpZGVkIGFuZCBubyBhY3RpdmUgYm9hcmQgaXMgc2V0LlxyXG4gICAqIEB0aHJvd3MgRXJyb3IgaWYgdGhlIHNwZWNpZmllZCBib2FyZCBpcyBub3QgZm91bmQuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRBcGkoYm9hcmRJZD86IHN0cmluZykge1xyXG4gICAgY29uc3QgdGFyZ2V0Qm9hcmRJZCA9IGJvYXJkSWQgfHwgdGhpcy5hY3RpdmVCb2FyZElkKCk7XHJcbiAgICBpZiAoIXRhcmdldEJvYXJkSWQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICdOZ1doaXRlYm9hcmRTZXJ2aWNlOiBObyBib2FyZElkIHByb3ZpZGVkIGFuZCBubyBhY3RpdmUgYm9hcmQgc2V0LiBDYWxsIHNldEFjdGl2ZUJvYXJkKCkgZmlyc3Qgb3IgcGFzcyBib2FyZElkIHBhcmFtZXRlci4nXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VTZXJ2aWNlLmdldEluc3RhbmNlKHRhcmdldEJvYXJkSWQpO1xyXG4gICAgaWYgKCFpbnN0YW5jZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgYE5nV2hpdGVib2FyZFNlcnZpY2U6IEJvYXJkIFwiJHt0YXJnZXRCb2FyZElkfVwiIG5vdCBmb3VuZC4gRW5zdXJlIHRoZSB3aGl0ZWJvYXJkIGNvbXBvbmVudCBpcyBpbml0aWFsaXplZC5gXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgcmVhY3RpdmUgc2lnbmFscyBmb3IgYSBzcGVjaWZpYyBib2FyZC5cclxuICAgKiBUaGVzZSBzaWduYWxzIGFyZSBib3VuZCB0byB0aGUgc3BlY2lmaWVkIGJvYXJkIGFuZCB3aWxsIHVwZGF0ZSB3aGVuIHRoYXQgYm9hcmQncyBkYXRhIGNoYW5nZXMuXHJcbiAgICogU2lnbmFscyBhcmUgbGF6eSBhbmQgd29uJ3QgdGhyb3cgZXJyb3JzIHVudGlsIGFjdHVhbGx5IGFjY2Vzc2VkLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGJvYXJkSWQgLSBUaGUgdW5pcXVlIGlkZW50aWZpZXIgb2YgdGhlIHdoaXRlYm9hcmRcclxuICAgKiBAcmV0dXJucyBPYmplY3QgY29udGFpbmluZyBhbGwgcmVhY3RpdmUgc2lnbmFscyBmb3IgdGhlIGJvYXJkXHJcbiAgICpcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIGBgYHR5cGVzY3JpcHRcclxuICAgKiBjbGFzcyBNeUNvbXBvbmVudCB7XHJcbiAgICogICBib2FyZElkID0gJ215LWJvYXJkJztcclxuICAgKiAgIHByaXZhdGUgc2lnbmFscyA9IHRoaXMud2hpdGVib2FyZFNlcnZpY2Uuc2lnbmFscyh0aGlzLmJvYXJkSWQpO1xyXG4gICAqICAgbGF5ZXJzID0gdGhpcy5zaWduYWxzLmxheWVycztcclxuICAgKiAgIGVsZW1lbnRzID0gdGhpcy5zaWduYWxzLmVsZW1lbnRzO1xyXG4gICAqIH1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBwdWJsaWMgc2lnbmFscyhib2FyZElkOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGVsZW1lbnRzOiBjb21wdXRlZCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZVNlcnZpY2UucmVnaXN0cnlWZXJzaW9uKCk7XHJcbiAgICAgICAgY29uc3QgYXBpID0gdGhpcy5pbnN0YW5jZVNlcnZpY2UuZ2V0SW5zdGFuY2UoYm9hcmRJZCk7XHJcbiAgICAgICAgcmV0dXJuIGFwaSA/IGFwaS5lbGVtZW50cygpIDogW107XHJcbiAgICAgIH0pLFxyXG4gICAgICBzZWxlY3RlZEVsZW1lbnRzOiBjb21wdXRlZCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZVNlcnZpY2UucmVnaXN0cnlWZXJzaW9uKCk7XHJcbiAgICAgICAgY29uc3QgYXBpID0gdGhpcy5pbnN0YW5jZVNlcnZpY2UuZ2V0SW5zdGFuY2UoYm9hcmRJZCk7XHJcbiAgICAgICAgcmV0dXJuIGFwaSA/IGFwaS5zZWxlY3RlZEVsZW1lbnRzKCkgOiBbXTtcclxuICAgICAgfSksXHJcbiAgICAgIGNvbmZpZzogY29tcHV0ZWQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VTZXJ2aWNlLnJlZ2lzdHJ5VmVyc2lvbigpO1xyXG4gICAgICAgIGNvbnN0IGFwaSA9IHRoaXMuaW5zdGFuY2VTZXJ2aWNlLmdldEluc3RhbmNlKGJvYXJkSWQpO1xyXG4gICAgICAgIHJldHVybiBhcGkgPyBhcGkuY29uZmlnKCkgOiAoe30gYXMgV2hpdGVib2FyZENvbmZpZyk7XHJcbiAgICAgIH0pLFxyXG4gICAgICBlbGVtZW50c0NvdW50OiBjb21wdXRlZCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZVNlcnZpY2UucmVnaXN0cnlWZXJzaW9uKCk7XHJcbiAgICAgICAgY29uc3QgYXBpID0gdGhpcy5pbnN0YW5jZVNlcnZpY2UuZ2V0SW5zdGFuY2UoYm9hcmRJZCk7XHJcbiAgICAgICAgcmV0dXJuIGFwaSA/IGFwaS5lbGVtZW50c0NvdW50KCkgOiAwO1xyXG4gICAgICB9KSxcclxuICAgICAgaGFzRWxlbWVudHM6IGNvbXB1dGVkKCgpID0+IHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlU2VydmljZS5yZWdpc3RyeVZlcnNpb24oKTtcclxuICAgICAgICBjb25zdCBhcGkgPSB0aGlzLmluc3RhbmNlU2VydmljZS5nZXRJbnN0YW5jZShib2FyZElkKTtcclxuICAgICAgICByZXR1cm4gYXBpID8gYXBpLmhhc0VsZW1lbnRzKCkgOiBmYWxzZTtcclxuICAgICAgfSksXHJcbiAgICAgIHNlbGVjdGVkVG9vbDogY29tcHV0ZWQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VTZXJ2aWNlLnJlZ2lzdHJ5VmVyc2lvbigpO1xyXG4gICAgICAgIGNvbnN0IGFwaSA9IHRoaXMuaW5zdGFuY2VTZXJ2aWNlLmdldEluc3RhbmNlKGJvYXJkSWQpO1xyXG4gICAgICAgIHJldHVybiBhcGkgPyBhcGkuc2VsZWN0ZWRUb29sKCkgOiBUb29sVHlwZS5QZW47XHJcbiAgICAgIH0pLFxyXG4gICAgICBhdmFpbGFibGVUb29sczogY29tcHV0ZWQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VTZXJ2aWNlLnJlZ2lzdHJ5VmVyc2lvbigpO1xyXG4gICAgICAgIGNvbnN0IGFwaSA9IHRoaXMuaW5zdGFuY2VTZXJ2aWNlLmdldEluc3RhbmNlKGJvYXJkSWQpO1xyXG4gICAgICAgIHJldHVybiBhcGkgPyBhcGkuYXZhaWxhYmxlVG9vbHMoKSA6IFtdO1xyXG4gICAgICB9KSxcclxuICAgICAgbGF5ZXJzOiBjb21wdXRlZCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZVNlcnZpY2UucmVnaXN0cnlWZXJzaW9uKCk7XHJcbiAgICAgICAgY29uc3QgYXBpID0gdGhpcy5pbnN0YW5jZVNlcnZpY2UuZ2V0SW5zdGFuY2UoYm9hcmRJZCk7XHJcbiAgICAgICAgcmV0dXJuIGFwaSA/IGFwaS5sYXllcnMoKSA6IFtdO1xyXG4gICAgICB9KSxcclxuICAgICAgYWN0aXZlTGF5ZXJJZDogY29tcHV0ZWQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VTZXJ2aWNlLnJlZ2lzdHJ5VmVyc2lvbigpO1xyXG4gICAgICAgIGNvbnN0IGFwaSA9IHRoaXMuaW5zdGFuY2VTZXJ2aWNlLmdldEluc3RhbmNlKGJvYXJkSWQpO1xyXG4gICAgICAgIHJldHVybiBhcGkgPyBhcGkuYWN0aXZlTGF5ZXJJZCgpIDogbnVsbDtcclxuICAgICAgfSksXHJcbiAgICAgIGFjdGl2ZUxheWVyOiBjb21wdXRlZCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZVNlcnZpY2UucmVnaXN0cnlWZXJzaW9uKCk7XHJcbiAgICAgICAgY29uc3QgYXBpID0gdGhpcy5pbnN0YW5jZVNlcnZpY2UuZ2V0SW5zdGFuY2UoYm9hcmRJZCk7XHJcbiAgICAgICAgcmV0dXJuIGFwaSA/IGFwaS5hY3RpdmVMYXllcigpIDogbnVsbDtcclxuICAgICAgfSksXHJcbiAgICAgIGNhblVuZG86IGNvbXB1dGVkKCgpID0+IHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlU2VydmljZS5yZWdpc3RyeVZlcnNpb24oKTtcclxuICAgICAgICBjb25zdCBhcGkgPSB0aGlzLmluc3RhbmNlU2VydmljZS5nZXRJbnN0YW5jZShib2FyZElkKTtcclxuICAgICAgICByZXR1cm4gYXBpID8gYXBpLmdldENhblVuZG9TaWduYWwoKSgpIDogZmFsc2U7XHJcbiAgICAgIH0pLFxyXG4gICAgICBjYW5SZWRvOiBjb21wdXRlZCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZVNlcnZpY2UucmVnaXN0cnlWZXJzaW9uKCk7XHJcbiAgICAgICAgY29uc3QgYXBpID0gdGhpcy5pbnN0YW5jZVNlcnZpY2UuZ2V0SW5zdGFuY2UoYm9hcmRJZCk7XHJcbiAgICAgICAgcmV0dXJuIGFwaSA/IGFwaS5nZXRDYW5SZWRvU2lnbmFsKCkoKSA6IGZhbHNlO1xyXG4gICAgICB9KSxcclxuICAgICAgc2VsZWN0aW9uQm94OiBjb21wdXRlZCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZVNlcnZpY2UucmVnaXN0cnlWZXJzaW9uKCk7XHJcbiAgICAgICAgY29uc3QgYXBpID0gdGhpcy5pbnN0YW5jZVNlcnZpY2UuZ2V0SW5zdGFuY2UoYm9hcmRJZCk7XHJcbiAgICAgICAgcmV0dXJuIGFwaSA/IGFwaS5nZXRTZWxlY3Rpb25Cb3hTaWduYWwoKSgpIDogeyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH07XHJcbiAgICAgIH0pLFxyXG4gICAgICBib3VuZGluZ0JveDogY29tcHV0ZWQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VTZXJ2aWNlLnJlZ2lzdHJ5VmVyc2lvbigpO1xyXG4gICAgICAgIGNvbnN0IGFwaSA9IHRoaXMuaW5zdGFuY2VTZXJ2aWNlLmdldEluc3RhbmNlKGJvYXJkSWQpO1xyXG4gICAgICAgIHJldHVybiBhcGkgPyBhcGkuZ2V0Qm91bmRpbmdCb3hTaWduYWwoKSgpIDogbnVsbDtcclxuICAgICAgfSksXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGFsbCByZWdpc3RlcmVkIHdoaXRlYm9hcmQgaW5zdGFuY2UgSURzLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRBbGxCb2FyZHMoKTogUmVhZG9ubHlBcnJheTxzdHJpbmc+IHtcclxuICAgIHJldHVybiB0aGlzLmluc3RhbmNlU2VydmljZS5nZXRBbGxJbnN0YW5jZUlkcygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSB0b3RhbCBudW1iZXIgb2YgcmVnaXN0ZXJlZCB3aGl0ZWJvYXJkIGluc3RhbmNlcy5cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0Qm9hcmRDb3VudCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VTZXJ2aWNlLmdldEluc3RhbmNlQ291bnQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlmIGEgd2hpdGVib2FyZCB3aXRoIHRoZSBnaXZlbiBJRCBleGlzdHMuXHJcbiAgICovXHJcbiAgcHVibGljIGhhc0JvYXJkKGJvYXJkSWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VTZXJ2aWNlLmhhc0luc3RhbmNlKGJvYXJkSWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IGVsZW1lbnRzIGZvciB0aGUgd2hpdGVib2FyZC5cclxuICAgKi9cclxuICBwdWJsaWMgc2V0RWxlbWVudHMoZWxlbWVudHM6IFdoaXRlYm9hcmRFbGVtZW50W10pOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLnNldEVsZW1lbnRzKGVsZW1lbnRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhbGwgZWxlbWVudHMgZnJvbSB0aGUgd2hpdGVib2FyZC5cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0RWxlbWVudHMoKTogV2hpdGVib2FyZEVsZW1lbnRbXSB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2UuZ2V0RWxlbWVudHMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZCBuZXcgZWxlbWVudHMgdG8gdGhlIHdoaXRlYm9hcmQuXHJcbiAgICovXHJcbiAgcHVibGljIGFkZEVsZW1lbnRzKGVsZW1lbnRzOiBXaGl0ZWJvYXJkRWxlbWVudFtdKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS5hZGRFbGVtZW50cyhlbGVtZW50cyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgbXVsdGlwbGUgZWxlbWVudHMuXHJcbiAgICovXHJcbiAgcHVibGljIHVwZGF0ZUVsZW1lbnRzKGVsZW1lbnRzOiBBcnJheTxQYXJ0aWFsPFdoaXRlYm9hcmRFbGVtZW50PiAmIHsgaWQ6IHN0cmluZyB9Pik6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2UudXBkYXRlRWxlbWVudHMoZWxlbWVudHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIGVsZW1lbnRzIGZyb20gdGhlIHdoaXRlYm9hcmQuXHJcbiAgICovXHJcbiAgcHVibGljIHJlbW92ZUVsZW1lbnRzKGVsZW1lbnRzOiBXaGl0ZWJvYXJkRWxlbWVudFtdKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS5yZW1vdmVFbGVtZW50cyhlbGVtZW50cyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDbGVhciBhbGwgZWxlbWVudHMgZnJvbSB0aGUgd2hpdGVib2FyZC5cclxuICAgKi9cclxuICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS5jbGVhcigpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2xlYXIgYWxsIGVsZW1lbnRzIGFuZCBzZWxlY3Rpb24uXHJcbiAgICovXHJcbiAgcHVibGljIGNsZWFyQWxsKCk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2UuY2xlYXJBbGwoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZCBhIHNpbmdsZSBlbGVtZW50IHRvIHRoZSB3aGl0ZWJvYXJkLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBhZGRFbGVtZW50KGVsZW1lbnQ6IFdoaXRlYm9hcmRFbGVtZW50KTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS5hZGRFbGVtZW50KGVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIGFuIGV4aXN0aW5nIGVsZW1lbnQuXHJcbiAgICovXHJcbiAgcHVibGljIHVwZGF0ZUVsZW1lbnQoZWxlbWVudDogV2hpdGVib2FyZEVsZW1lbnQpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLnVwZGF0ZUVsZW1lbnQoZWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmUgZWxlbWVudHMgYnkgdGhlaXIgSURzLlxyXG4gICAqL1xyXG4gIHB1YmxpYyByZW1vdmVFbGVtZW50c0J5SWRzKGVsZW1lbnRJZHM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS5yZW1vdmVFbGVtZW50c0J5SWRzKGVsZW1lbnRJZHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGVsZW1lbnQgYnkgSUQuXHJcbiAgICovXHJcbiAgcHVibGljIGdldEVsZW1lbnRCeUlkKGlkOiBzdHJpbmcpOiBXaGl0ZWJvYXJkRWxlbWVudCB8IHVuZGVmaW5lZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2UuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IG11bHRpcGxlIGVsZW1lbnRzIGJ5IHRoZWlyIElEcy5cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0RWxlbWVudHNCeUlkcyhpZHM6IHN0cmluZ1tdKTogV2hpdGVib2FyZEVsZW1lbnRbXSB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2UuZ2V0RWxlbWVudHNCeUlkcyhpZHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IG5leHQgYXZhaWxhYmxlIFotaW5kZXguXHJcbiAgICovXHJcbiAgcHVibGljIGdldE5leHRaSW5kZXgoKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIHJldHVybiBpbnN0YW5jZS5nZXROZXh0WkluZGV4KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBhbiBlbGVtZW50IGV4aXN0cy5cclxuICAgKi9cclxuICBwdWJsaWMgZWxlbWVudEV4aXN0cyhlbGVtZW50SWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlLmVsZW1lbnRFeGlzdHMoZWxlbWVudElkKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbGVjdCBlbGVtZW50cyBvbiB0aGUgd2hpdGVib2FyZC5cclxuICAgKi9cclxuICBwdWJsaWMgc2VsZWN0RWxlbWVudHMoXHJcbiAgICBlbGVtZW50c09ySWRzOiBXaGl0ZWJvYXJkRWxlbWVudCB8IFdoaXRlYm9hcmRFbGVtZW50W10gfCBzdHJpbmcgfCBzdHJpbmdbXSxcclxuICAgIGFwcGVuZCA9IGZhbHNlXHJcbiAgKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS5zZWxlY3RFbGVtZW50cyhlbGVtZW50c09ySWRzLCBhcHBlbmQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVzZWxlY3QgYW4gZWxlbWVudC5cclxuICAgKi9cclxuICBwdWJsaWMgZGVzZWxlY3RFbGVtZW50KGVsZW1lbnRPcklkOiBXaGl0ZWJvYXJkRWxlbWVudCB8IHN0cmluZyk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2UuZGVzZWxlY3RFbGVtZW50KGVsZW1lbnRPcklkKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRvZ2dsZSBlbGVtZW50IHNlbGVjdGlvbi5cclxuICAgKi9cclxuICBwdWJsaWMgdG9nZ2xlU2VsZWN0aW9uKGVsZW1lbnRPcklkOiBXaGl0ZWJvYXJkRWxlbWVudCB8IHN0cmluZyk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2UudG9nZ2xlU2VsZWN0aW9uKGVsZW1lbnRPcklkKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENsZWFyIHRoZSBzZWxlY3Rpb24uXHJcbiAgICovXHJcbiAgcHVibGljIGNsZWFyU2VsZWN0aW9uKCk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2UuY2xlYXJTZWxlY3Rpb24oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbGVjdCBhbGwgZWxlbWVudHMuXHJcbiAgICovXHJcbiAgcHVibGljIHNlbGVjdEFsbCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLnNlbGVjdEFsbCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGN1cnJlbnRseSBzZWxlY3RlZCBlbGVtZW50cy5cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0U2VsZWN0ZWRFbGVtZW50cygpOiBXaGl0ZWJvYXJkRWxlbWVudFtdIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIHJldHVybiBpbnN0YW5jZS5nZXRTZWxlY3RlZEVsZW1lbnRzKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgc2VsZWN0ZWQgZWxlbWVudHMgd2l0aCBwYXJ0aWFsIHByb3BlcnRpZXMuXHJcbiAgICovXHJcbiAgcHVibGljIHVwZGF0ZVNlbGVjdGVkRWxlbWVudHMocGFydGlhbEVsZW1lbnQ6IFBhcnRpYWw8V2hpdGVib2FyZEVsZW1lbnQ+KTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS51cGRhdGVTZWxlY3RlZEVsZW1lbnRzKHBhcnRpYWxFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSBzZWxlY3RlZCBlbGVtZW50cy5cclxuICAgKi9cclxuICBwdWJsaWMgcmVtb3ZlU2VsZWN0ZWRFbGVtZW50cygpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLnJlbW92ZVNlbGVjdGVkRWxlbWVudHMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlmIGFuIGVsZW1lbnQgaXMgc2VsZWN0ZWQuXHJcbiAgICovXHJcbiAgcHVibGljIGlzU2VsZWN0ZWQoZWxlbWVudE9ySWQ6IFdoaXRlYm9hcmRFbGVtZW50IHwgc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2UuaXNTZWxlY3RlZChlbGVtZW50T3JJZCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDbGVhciB0aGUgc2VsZWN0aW9uIGJveC5cclxuICAgKi9cclxuICBwdWJsaWMgY2xlYXJTZWxlY3Rpb25Cb3goKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS5jbGVhclNlbGVjdGlvbkJveCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVHJhbnNmb3JtIHNlbGVjdGVkIGVsZW1lbnRzIHVzaW5nIGEgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb24uXHJcbiAgICovXHJcbiAgcHVibGljIHRyYW5zZm9ybVNlbGVjdGVkRWxlbWVudHModHJhbnNmb3JtRm46IChlbGVtZW50czogV2hpdGVib2FyZEVsZW1lbnRbXSkgPT4gV2hpdGVib2FyZEVsZW1lbnRbXSk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2UudHJhbnNmb3JtU2VsZWN0ZWRFbGVtZW50cyh0cmFuc2Zvcm1Gbik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIHNlbGVjdGlvbiBib3guXHJcbiAgICovXHJcbiAgcHVibGljIHNldFNlbGVjdGlvbkJveChzZWxlY3Rpb25Cb3g6IFNlbGVjdGlvbkJveCk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2Uuc2V0U2VsZWN0aW9uQm94KHNlbGVjdGlvbkJveCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgYm91bmRpbmcgYm94IGZvciBzZWxlY3RlZCBlbGVtZW50cy5cclxuICAgKi9cclxuICBwdWJsaWMgdXBkYXRlQm91bmRpbmdCb3goKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS51cGRhdGVCb3VuZGluZ0JveCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGNsaXBib2FyZCBpbmZvcm1hdGlvbi5cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0Q2xpcGJvYXJkSW5mbygpOiBDbGlwYm9hcmRJbmZvIHwgbnVsbCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2UuZ2V0Q2xpcGJvYXJkSW5mbygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ29weSBzZWxlY3RlZCBlbGVtZW50cyB0byBjbGlwYm9hcmQuXHJcbiAgICovXHJcbiAgcHVibGljIGNvcHlFbGVtZW50cygpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLmNvcHlFbGVtZW50cygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3V0IHNlbGVjdGVkIGVsZW1lbnRzLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBjdXRFbGVtZW50cygpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLmN1dEVsZW1lbnRzKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYXN0ZSBlbGVtZW50cyBmcm9tIGNsaXBib2FyZC5cclxuICAgKi9cclxuICBwdWJsaWMgcGFzdGVFbGVtZW50cygpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLnBhc3RlRWxlbWVudHMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIER1cGxpY2F0ZSBzZWxlY3RlZCBlbGVtZW50cy5cclxuICAgKi9cclxuICBwdWJsaWMgZHVwbGljYXRlRWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS5kdXBsaWNhdGVFbGVtZW50cygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVsZXRlIHNlbGVjdGVkIGVsZW1lbnRzLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBkZWxldGVTZWxlY3RlZEVsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2UuZGVsZXRlU2VsZWN0ZWRFbGVtZW50cygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQnJpbmcgc2VsZWN0ZWQgZWxlbWVudHMgdG8gZnJvbnQuXHJcbiAgICovXHJcbiAgcHVibGljIGJyaW5nVG9Gcm9udCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLmJyaW5nVG9Gcm9udCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQnJpbmcgc2VsZWN0ZWQgZWxlbWVudHMgZm9yd2FyZCBieSBvbmUgbGV2ZWwuXHJcbiAgICovXHJcbiAgcHVibGljIGJyaW5nRm9yd2FyZCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLmJyaW5nRm9yd2FyZCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2VuZCBzZWxlY3RlZCBlbGVtZW50cyBiYWNrd2FyZCBieSBvbmUgbGV2ZWwuXHJcbiAgICovXHJcbiAgcHVibGljIHNlbmRCYWNrd2FyZCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLnNlbmRCYWNrd2FyZCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2VuZCBzZWxlY3RlZCBlbGVtZW50cyB0byBiYWNrLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZW5kVG9CYWNrKCk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2Uuc2VuZFRvQmFjaygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR3JvdXAgc2VsZWN0ZWQgZWxlbWVudHMuXHJcbiAgICovXHJcbiAgcHVibGljIGdyb3VwU2VsZWN0ZWRFbGVtZW50cygpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLmdyb3VwU2VsZWN0ZWRFbGVtZW50cygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVW5ncm91cCBzZWxlY3RlZCBlbGVtZW50cy5cclxuICAgKi9cclxuICBwdWJsaWMgdW5ncm91cFNlbGVjdGVkRWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS51bmdyb3VwU2VsZWN0ZWRFbGVtZW50cygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9jayBzZWxlY3RlZCBlbGVtZW50cy5cclxuICAgKi9cclxuICBwdWJsaWMgbG9ja0VsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2UubG9ja0VsZW1lbnRzKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVbmxvY2sgc2VsZWN0ZWQgZWxlbWVudHMuXHJcbiAgICovXHJcbiAgcHVibGljIHVubG9ja0VsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2UudW5sb2NrRWxlbWVudHMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFsaWduIHNlbGVjdGVkIGVsZW1lbnRzLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBhbGlnbkVsZW1lbnRzKGFsaWdubWVudDogQWxpZ25tZW50VHlwZSk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2UuYWxpZ25FbGVtZW50cyhhbGlnbm1lbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBjYW52YXMgU1ZHIGVsZW1lbnQuXHJcbiAgICovXHJcbiAgcHVibGljIGdldENhbnZhcygpOiBTVkdTVkdFbGVtZW50IHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIHJldHVybiBpbnN0YW5jZS5nZXRDYW52YXMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCBjYW52YXMgZGltZW5zaW9ucy5cclxuICAgKi9cclxuICBwdWJsaWMgc2V0Q2FudmFzRGltZW5zaW9ucyh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2Uuc2V0Q2FudmFzRGltZW5zaW9ucyh3aWR0aCwgaGVpZ2h0KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENlbnRlciB0aGUgY2FudmFzLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBjZW50ZXJDYW52YXMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS5jZW50ZXJDYW52YXMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRvZ2dsZSBmdWxsc2NyZWVuIG1vZGUuXHJcbiAgICovXHJcbiAgcHVibGljIGZ1bGxTY3JlZW4oKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS5mdWxsU2NyZWVuKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeGl0IGZ1bGxzY3JlZW4gbW9kZS5cclxuICAgKi9cclxuICBwdWJsaWMgZXhpdEZ1bGxTY3JlZW4oZGVmYXVsdFdpZHRoPzogbnVtYmVyLCBkZWZhdWx0SGVpZ2h0PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS5leGl0RnVsbFNjcmVlbihkZWZhdWx0V2lkdGgsIGRlZmF1bHRIZWlnaHQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzZXQgY2FudmFzIHRvIGRlZmF1bHQgc3RhdGUuXHJcbiAgICovXHJcbiAgcHVibGljIHJlc2V0Q2FudmFzKCk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2UucmVzZXRDYW52YXMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB6b29tIGxldmVsLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZXRab29tKHpvb206IG51bWJlcik6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2Uuc2V0Wm9vbSh6b29tKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFpvb20gaW4uXHJcbiAgICovXHJcbiAgcHVibGljIHpvb21JbigpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLnpvb21JbigpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogWm9vbSBvdXQuXHJcbiAgICovXHJcbiAgcHVibGljIHpvb21PdXQoKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS56b29tT3V0KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXNldCB6b29tIHRvIGRlZmF1bHQuXHJcbiAgICovXHJcbiAgcHVibGljIHJlc2V0Wm9vbSgpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLnJlc2V0Wm9vbSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogWm9vbSB0byBmaXQgYWxsIGVsZW1lbnRzLlxyXG4gICAqL1xyXG4gIHB1YmxpYyB6b29tVG9GaXQoKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS56b29tVG9GaXQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFpvb20gdG8gZml0IHNlbGVjdGVkIGVsZW1lbnRzLlxyXG4gICAqL1xyXG4gIHB1YmxpYyB6b29tVG9TZWxlY3Rpb24oKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS56b29tVG9TZWxlY3Rpb24oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhbiB0aGUgY2FudmFzIGJ5IGRlbHRhIHZhbHVlcy5cclxuICAgKi9cclxuICBwdWJsaWMgcGFuKGR4OiBudW1iZXIsIGR5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLnBhbihkeCwgZHkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGFuIHRvIGEgc3BlY2lmaWMgcG9zaXRpb24uXHJcbiAgICovXHJcbiAgcHVibGljIHBhblRvKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS5wYW5Ubyh4LCB5KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc2V0IHBhbiB0byBkZWZhdWx0LlxyXG4gICAqL1xyXG4gIHB1YmxpYyByZXNldFBhbigpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLnJlc2V0UGFuKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTYXZlIHRoZSB3aGl0ZWJvYXJkIGluIHRoZSBzcGVjaWZpZWQgZm9ybWF0LlxyXG4gICAqL1xyXG4gIHB1YmxpYyBhc3luYyBzYXZlKGZvcm1hdDogRm9ybWF0VHlwZSA9IEZvcm1hdFR5cGUuQmFzZTY0LCBuYW1lID0gJ3doaXRlYm9hcmQnKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIHJldHVybiBpbnN0YW5jZS5zYXZlKGZvcm1hdCwgbmFtZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGQgYW4gaW1hZ2UgdG8gdGhlIHdoaXRlYm9hcmQuXHJcbiAgICovXHJcbiAgcHVibGljIGFkZEltYWdlKGltYWdlSW5mbzogQWRkSW1hZ2UpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLmFkZEltYWdlKGltYWdlSW5mbyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJbXBvcnQgYW4gaW1hZ2UgZnJvbSBhIGZpbGUuXHJcbiAgICovXHJcbiAgcHVibGljIGFzeW5jIGltcG9ydEltYWdlRmlsZShmaWxlOiBGaWxlLCB4PzogbnVtYmVyLCB5PzogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2UuaW1wb3J0SW1hZ2VGaWxlKGZpbGUsIHgsIHkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXhwb3J0IHdoaXRlYm9hcmQgZGF0YSBhcyBKU09OLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBleHBvcnREYXRhKCk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2UuZXhwb3J0RGF0YSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW1wb3J0IHdoaXRlYm9hcmQgZGF0YSBmcm9tIEpTT04uXHJcbiAgICovXHJcbiAgcHVibGljIGltcG9ydERhdGEoanNvbkRhdGE6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2UuaW1wb3J0RGF0YShqc29uRGF0YSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVbmRvIHRoZSBsYXN0IGFjdGlvbi5cclxuICAgKi9cclxuICBwdWJsaWMgdW5kbygpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIHJldHVybiBpbnN0YW5jZS51bmRvKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZWRvIHRoZSBsYXN0IHVuZG9uZSBhY3Rpb24uXHJcbiAgICovXHJcbiAgcHVibGljIHJlZG8oKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2UucmVkbygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHNpZ25hbCBmb3IgdW5kbyBhdmFpbGFiaWxpdHkuXHJcbiAgICovXHJcbiAgcHVibGljIGdldENhblVuZG9TaWduYWwoKTogU2lnbmFsPGJvb2xlYW4+IHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIHJldHVybiBpbnN0YW5jZS5nZXRDYW5VbmRvU2lnbmFsKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgc2lnbmFsIGZvciByZWRvIGF2YWlsYWJpbGl0eS5cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0Q2FuUmVkb1NpZ25hbCgpOiBTaWduYWw8Ym9vbGVhbj4ge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlLmdldENhblJlZG9TaWduYWwoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENsZWFyIHVuZG8vcmVkbyBoaXN0b3J5LlxyXG4gICAqL1xyXG4gIHB1YmxpYyBjbGVhckhpc3RvcnkoKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS5jbGVhckhpc3RvcnkoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBjdXJyZW50IHdoaXRlYm9hcmQgY29uZmlndXJhdGlvbi5cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0Q29uZmlnKCk6IFdoaXRlYm9hcmRDb25maWcge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlLmdldENvbmZpZygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIHdoaXRlYm9hcmQgY29uZmlndXJhdGlvbi5cclxuICAgKi9cclxuICBwdWJsaWMgdXBkYXRlQ29uZmlnKGNvbmZpZzogUGFydGlhbDxXaGl0ZWJvYXJkQ29uZmlnPik6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2UudXBkYXRlQ29uZmlnKGNvbmZpZyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgYSBzaW5nbGUgY29uZmlndXJhdGlvbiB2YWx1ZS5cclxuICAgKi9cclxuICBwdWJsaWMgdXBkYXRlQ29uZmlnVmFsdWU8SyBleHRlbmRzIGtleW9mIFdoaXRlYm9hcmRDb25maWc+KGtleTogSywgdmFsdWU6IFdoaXRlYm9hcmRDb25maWdbS10pOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLnVwZGF0ZUNvbmZpZ1ZhbHVlKGtleSwgdmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWRkIGEgbmV3IGxheWVyLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBhZGRMYXllcihuYW1lPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS5hZGRMYXllcihuYW1lKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSBhIGxheWVyIGJ5IElELlxyXG4gICAqL1xyXG4gIHB1YmxpYyByZW1vdmVMYXllcihpZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2UucmVtb3ZlTGF5ZXIoaWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHRoZSBhY3RpdmUgbGF5ZXIuXHJcbiAgICovXHJcbiAgcHVibGljIHNldEFjdGl2ZUxheWVyKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIHJldHVybiBpbnN0YW5jZS5zZXRBY3RpdmVMYXllcihpZCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGFjdGl2ZSBsYXllciBJRC5cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0QWN0aXZlTGF5ZXJJZCgpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlLmdldEFjdGl2ZUxheWVySWQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRvZ2dsZSBsYXllciB2aXNpYmlsaXR5LlxyXG4gICAqL1xyXG4gIHB1YmxpYyB0b2dnbGVMYXllclZpc2liaWxpdHkoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlLnRvZ2dsZUxheWVyVmlzaWJpbGl0eShpZCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUb2dnbGUgbGF5ZXIgbG9jayBzdGF0ZS5cclxuICAgKi9cclxuICBwdWJsaWMgdG9nZ2xlTGF5ZXJMb2NrKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIHJldHVybiBpbnN0YW5jZS50b2dnbGVMYXllckxvY2soaWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVuYW1lIGEgbGF5ZXIuXHJcbiAgICovXHJcbiAgcHVibGljIHJlbmFtZUxheWVyKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlLnJlbmFtZUxheWVyKGlkLCBuYW1lKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCBsYXllciBvcGFjaXR5ICgwLTEpLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZXRMYXllck9wYWNpdHkoaWQ6IHN0cmluZywgb3BhY2l0eTogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2Uuc2V0TGF5ZXJPcGFjaXR5KGlkLCBvcGFjaXR5KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCBsYXllciBibGVuZCBtb2RlLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZXRMYXllckJsZW5kTW9kZShpZDogc3RyaW5nLCBibGVuZE1vZGU6IEJsZW5kTW9kZSk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlLnNldExheWVyQmxlbmRNb2RlKGlkLCBibGVuZE1vZGUpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW92ZSBsYXllciB1cCBpbiB6LW9yZGVyLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBtb3ZlTGF5ZXJVcChpZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2UubW92ZUxheWVyVXAoaWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW92ZSBsYXllciBkb3duIGluIHotb3JkZXIuXHJcbiAgICovXHJcbiAgcHVibGljIG1vdmVMYXllckRvd24oaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlLm1vdmVMYXllckRvd24oaWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVvcmRlciBsYXllcnMgYnkgaW5kZXggcG9zaXRpb24uXHJcbiAgICpcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIGBgYHR5cGVzY3JpcHRcclxuICAgKiB0aGlzLndoaXRlYm9hcmRTZXJ2aWNlLnJlb3JkZXJMYXllcnNCeUluZGV4KDIsIDApO1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIHB1YmxpYyByZW9yZGVyTGF5ZXJzQnlJbmRleChwcmV2aW91c0luZGV4OiBudW1iZXIsIGN1cnJlbnRJbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2UucmVvcmRlckxheWVyc0J5SW5kZXgocHJldmlvdXNJbmRleCwgY3VycmVudEluZGV4KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRvZ2dsZSBncmlkIHZpc2liaWxpdHkuXHJcbiAgICovXHJcbiAgcHVibGljIHRvZ2dsZUdyaWQoKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS50b2dnbGVHcmlkKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUb2dnbGUgc25hcCB0byBncmlkLlxyXG4gICAqL1xyXG4gIHB1YmxpYyB0b2dnbGVTbmFwVG9HcmlkKCk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2UudG9nZ2xlU25hcFRvR3JpZCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IGdyaWQgc2l6ZS5cclxuICAgKi9cclxuICBwdWJsaWMgc2V0R3JpZFNpemUoc2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICBpbnN0YW5jZS5zZXRHcmlkU2l6ZShzaXplKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGUgYWN0aXZlIGRyYXdpbmcgdG9vbC5cclxuICAgKi9cclxuICBwdWJsaWMgc2V0QWN0aXZlVG9vbCh0b29sOiBUb29sVHlwZSk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2Uuc2V0QWN0aXZlVG9vbCh0b29sKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgY3VycmVudGx5IGFjdGl2ZSB0b29sLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRBY3RpdmVUb29sKCk6IFRvb2xUeXBlIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIHJldHVybiBpbnN0YW5jZS5nZXRBY3RpdmVUb29sKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmFibGUgb3IgZGlzYWJsZSBhIHNwZWNpZmljIHRvb2wuXHJcbiAgICovXHJcbiAgcHVibGljIHNldFRvb2xFbmFibGVkKHRvb2xUeXBlOiBUb29sVHlwZSwgZW5hYmxlZDogYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlLnNldFRvb2xFbmFibGVkKHRvb2xUeXBlLCBlbmFibGVkKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB3aGljaCB0b29scyBzaG91bGQgYmUgZW5hYmxlZC5cclxuICAgKi9cclxuICBwdWJsaWMgc2V0RW5hYmxlZFRvb2xzKHRvb2xUeXBlczogVG9vbFR5cGVbXSk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2Uuc2V0RW5hYmxlZFRvb2xzKHRvb2xUeXBlcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgY3Vyc29yIGV4cGxpY2l0bHkuXHJcbiAgICovXHJcbiAgcHVibGljIHNldEN1cnNvcihjdXJzb3I6IEN1cnNvclR5cGUpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRBcGkoKTtcclxuICAgIGluc3RhbmNlLnNldEN1cnNvcihjdXJzb3IpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzZXQgY3Vyc29yIHRvIGRlZmF1bHQuXHJcbiAgICovXHJcbiAgcHVibGljIHJlc2V0Q3Vyc29yKCk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgaW5zdGFuY2UucmVzZXRDdXJzb3IoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbnZlcnQgc2NyZWVuIGNvb3JkaW5hdGVzIHRvIGNhbnZhcyBjb29yZGluYXRlcy5cclxuICAgKi9cclxuICBwdWJsaWMgc2NyZWVuVG9DYW52YXMoc2NyZWVuWDogbnVtYmVyLCBzY3JlZW5ZOiBudW1iZXIpOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0ge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlLnNjcmVlblRvQ2FudmFzKHNjcmVlblgsIHNjcmVlblkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ29udmVydCBjYW52YXMgY29vcmRpbmF0ZXMgdG8gc2NyZWVuIGNvb3JkaW5hdGVzLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBjYW52YXNUb1NjcmVlbihjYW52YXNYOiBudW1iZXIsIGNhbnZhc1k6IG51bWJlcik6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2UuY2FudmFzVG9TY3JlZW4oY2FudmFzWCwgY2FudmFzWSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgc2VsZWN0aW9uIGJveCBzaWduYWwuXHJcbiAgICovXHJcbiAgcHVibGljIGdldFNlbGVjdGlvbkJveFNpZ25hbCgpOiBTaWduYWw8U2VsZWN0aW9uQm94PiB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBpKCk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2UuZ2V0U2VsZWN0aW9uQm94U2lnbmFsKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgYm91bmRpbmcgYm94IHNpZ25hbC5cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0Qm91bmRpbmdCb3hTaWduYWwoKTogU2lnbmFsPEJvdW5kaW5nQm94IHwgbnVsbD4ge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEFwaSgpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlLmdldEJvdW5kaW5nQm94U2lnbmFsKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==