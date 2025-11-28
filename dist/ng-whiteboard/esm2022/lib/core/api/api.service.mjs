import { Injectable, computed, inject } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { CanvasService } from '../canvas/canvas.service';
import { ElementsService } from '../elements/elements.service';
import { LayerManagementService } from '../elements/layer-management.service';
import { PanService } from '../viewport/pan.service';
import { SelectionService } from '../elements/selection.service';
import { ToolsService } from '../tools/tools.service';
import { HistoryService } from '../history/history.service';
import { ZoomService } from '../viewport/zoom.service';
import { FormatType, } from '../types';
import { WhiteboardEvent } from '../types/events';
import { ClipboardService, IOService } from '../input';
import * as i0 from "@angular/core";
export class ApiService {
    elementsService = inject(ElementsService);
    canvasService = inject(CanvasService);
    selectionService = inject(SelectionService);
    toolsService = inject(ToolsService);
    ioService = inject(IOService);
    historyService = inject(HistoryService);
    zoomService = inject(ZoomService);
    panService = inject(PanService);
    layerService = inject(LayerManagementService);
    configService = inject(ConfigService);
    clipboardService = inject(ClipboardService);
    eventBusService = inject(EventBusService);
    elements = this.elementsService.elements;
    draftElements = this.elementsService.draftElements;
    allElements = this.elementsService.allElements;
    selectedElements = this.selectionService.getSelectedElementsSignal();
    config = computed(() => this.configService.getConfig());
    elementsCount = this.elementsService.elementsCount;
    hasElements = this.elementsService.hasElements;
    selectedTool = this.toolsService.selectedTool;
    availableTools = this.toolsService.availableTools;
    layers = this.layerService.layers;
    activeLayerId = this.layerService.activeLayerId;
    activeLayer = this.layerService.activeLayer;
    setElements(elements) {
        this.elementsService.setElements(elements);
    }
    getElements() {
        return this.elementsService.getElements();
    }
    addElements(elements) {
        this.elementsService.addElements(elements);
    }
    updateElements(elements) {
        const updates = elements.map((el) => ({ ...el, id: el.id }));
        this.elementsService.updateElements(updates);
    }
    removeElements(elements) {
        this.elementsService.removeElements(elements);
    }
    clear() {
        this.elementsService.clear();
    }
    clearAll() {
        this.elementsService.clear();
        this.selectionService.clearSelection();
    }
    addElement(element) {
        this.addElements([element]);
    }
    updateElement(element) {
        this.updateElements([element]);
    }
    removeElementsByIds(elementIds) {
        this.elementsService.removeElementsByIds(elementIds);
    }
    getElementById(id) {
        return this.elementsService.getElementById(id);
    }
    getElementsByIds(ids) {
        return this.elementsService.getElementsByIds(ids);
    }
    getNextZIndex() {
        return this.elementsService.getNextZIndex();
    }
    getAllElements() {
        return this.elementsService.getElements();
    }
    getDraftElements() {
        return this.elementsService.getDraftElements();
    }
    addDraftElements(elements) {
        this.elementsService.addDraftElements(elements);
    }
    updateDraftElements(elements) {
        this.elementsService.updateDraftElements(elements);
    }
    removeDraftElements(elementIds) {
        this.elementsService.removeDraftElements(elementIds);
    }
    commitDraftElements() {
        this.elementsService.commitDraftElements();
    }
    elementExists(elementId) {
        return this.elementsService.elementExists(elementId);
    }
    selectElements(elementsOrIds, append = false) {
        this.selectionService.selectElements(elementsOrIds, append);
    }
    deselectElement(elementOrId) {
        this.selectionService.deselectElement(elementOrId);
    }
    toggleSelection(elementOrId) {
        this.selectionService.toggleSelection(elementOrId);
    }
    clearSelection() {
        this.selectionService.clearSelection();
    }
    selectAll() {
        this.selectionService.selectAll();
    }
    getSelectedElements() {
        return this.selectionService.getSelectedElements();
    }
    updateSelectedElements(partialElement) {
        this.selectionService.updateSelectedElements(partialElement);
    }
    removeSelectedElements() {
        this.selectionService.removeSelectedElements();
    }
    isSelected(elementOrId) {
        return this.selectionService.isSelected(elementOrId);
    }
    clearSelectionBox() {
        this.selectionService.clearSelectionBox();
    }
    transformSelectedElements(transformFn) {
        this.selectionService.transformSelectedElements(transformFn);
    }
    setSelectionBox(selectionBox) {
        this.selectionService.setSelectionBox(selectionBox);
    }
    updateBoundingBox() {
        this.selectionService.updateBoundingBox();
    }
    getBoundingBox() {
        return this.selectionService.getBoundingBox();
    }
    setBoundingBox(bbox) {
        this.selectionService.setBoundingBox(bbox);
    }
    getClipboardInfo() {
        return this.clipboardService.getClipboardInfo();
    }
    copyElements() {
        this.selectionService.copyElements();
    }
    cutElements() {
        this.selectionService.cutElements();
    }
    pasteElements() {
        this.selectionService.pasteElements();
    }
    duplicateElements() {
        this.selectionService.duplicateElements();
    }
    deleteSelectedElements() {
        this.selectionService.deleteSelectedElements();
    }
    bringToFront() {
        this.selectionService.bringToFront();
    }
    bringForward() {
        this.selectionService.bringForward();
    }
    sendBackward() {
        this.selectionService.sendBackward();
    }
    sendToBack() {
        this.selectionService.sendToBack();
    }
    groupSelectedElements() {
        this.selectionService.groupSelectedElements();
    }
    ungroupSelectedElements() {
        this.selectionService.ungroupSelectedElements();
    }
    lockElements() {
        this.selectionService.lockElements();
    }
    unlockElements() {
        this.selectionService.unlockElements();
    }
    alignElements(alignment) {
        this.selectionService.alignElements(alignment);
    }
    distributeHorizontally() {
        this.selectionService.distributeHorizontally();
    }
    distributeVertically() {
        this.selectionService.distributeVertically();
    }
    flipHorizontal() {
        this.selectionService.flipHorizontal();
    }
    flipVertical() {
        this.selectionService.flipVertical();
    }
    moveSelectedElements(dx, dy) {
        this.selectionService.moveSelectedElements(dx, dy);
    }
    rotateSelectedElements(angle) {
        this.selectionService.rotateSelectedElements(angle);
    }
    scaleSelectedElements(factor) {
        this.selectionService.scaleSelectedElements(factor);
    }
    initializeWhiteboard(svgContainer) {
        this.canvasService.initializeCanvas(svgContainer);
        this.toolsService.setApiService(this);
    }
    getCanvas() {
        return this.canvasService.getCanvas();
    }
    setCanvasDimensions(width, height) {
        this.canvasService.setCanvasDimensions(width, height);
    }
    centerCanvas() {
        this.canvasService.centerCanvas();
    }
    fullScreen() {
        this.canvasService.fullScreen();
    }
    exitFullScreen(defaultWidth, defaultHeight) {
        this.canvasService.exitFullScreen(defaultWidth, defaultHeight);
    }
    resetCanvas() {
        this.canvasService.resetCanvas();
    }
    setZoom(zoom) {
        this.zoomService.zoom(zoom);
    }
    zoomIn() {
        this.zoomService.zoomIn();
    }
    zoomOut() {
        this.zoomService.zoomOut();
    }
    resetZoom() {
        this.zoomService.resetZoom();
    }
    zoomToFit() {
        this.zoomService.zoomToFit();
    }
    zoomToSelection() {
        this.zoomService.zoomToSelection();
    }
    pan(dx, dy) {
        this.panService.pan(dx, dy);
    }
    panTo(x, y) {
        this.panService.panTo(x, y);
    }
    resetPan() {
        this.panService.resetPan();
    }
    async save(format = FormatType.Base64, name = 'whiteboard') {
        return this.ioService.save(format, name);
    }
    addImage(imageInfo) {
        this.ioService.addImage(imageInfo);
    }
    async importImageFile(file, x, y) {
        return this.ioService.importImageFile(file, x, y);
    }
    exportData() {
        return this.ioService.exportData();
    }
    importData(jsonData) {
        this.ioService.importData(jsonData);
    }
    async exportAsPNG(name = 'whiteboard') {
        return this.ioService.exportAsPng(name);
    }
    async exportAsSVG(name = 'whiteboard') {
        return this.ioService.exportAsSvg(name);
    }
    exportAsJSON(name = 'whiteboard') {
        const jsonData = this.ioService.exportData();
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
    undo() {
        const elements = this.historyService.undo();
        if (elements) {
            this.elementsService.setElements(elements);
            this.selectionService.clearSelection();
            this.eventBusService.emit(WhiteboardEvent.Undo, undefined);
            return true;
        }
        return false;
    }
    redo() {
        const elements = this.historyService.redo();
        if (elements) {
            this.elementsService.setElements(elements);
            this.selectionService.clearSelection();
            this.eventBusService.emit(WhiteboardEvent.Redo, undefined);
            return true;
        }
        return false;
    }
    getCanUndoSignal() {
        return this.historyService.getCanUndoSignal();
    }
    getCanRedoSignal() {
        return this.historyService.getCanRedoSignal();
    }
    clearHistory() {
        this.historyService.clearHistory();
    }
    recordElementCreation(before, after) {
        this.historyService.recordElementCreation(before, after);
    }
    recordElementUpdate(before, after) {
        this.historyService.recordElementUpdate(before, after);
    }
    recordElementDeletion(before, after) {
        this.historyService.recordElementDeletion(before, after);
    }
    recordClear(before, after) {
        this.historyService.recordClear(before, after);
    }
    recordChange(before, after, description) {
        this.historyService.recordChange(before, after, description);
    }
    getConfig() {
        return this.configService.getConfig();
    }
    updateConfig(config) {
        this.configService.updateConfig(config);
    }
    updateConfigValue(key, value) {
        this.configService.updateConfigValue(key, value);
    }
    addLayer(name) {
        return this.layerService.addLayer(name);
    }
    removeLayer(id) {
        return this.layerService.removeLayer(id);
    }
    setActiveLayer(id) {
        return this.layerService.setActiveLayer(id);
    }
    getActiveLayerId() {
        return this.layerService.getActiveLayerId();
    }
    toggleLayerVisibility(id) {
        return this.layerService.toggleLayerVisibility(id);
    }
    toggleLayerLock(id) {
        return this.layerService.toggleLayerLock(id);
    }
    renameLayer(id, name) {
        return this.layerService.renameLayer(id, name);
    }
    setLayerOpacity(id, opacity) {
        return this.layerService.setLayerOpacity(id, opacity);
    }
    setLayerBlendMode(id, blendMode) {
        return this.layerService.setLayerBlendMode(id, blendMode);
    }
    moveLayerUp(id) {
        return this.layerService.moveLayerUp(id);
    }
    moveLayerDown(id) {
        return this.layerService.moveLayerDown(id);
    }
    reorderLayersByIndex(previousIndex, currentIndex) {
        return this.layerService.reorderLayersByIndex(previousIndex, currentIndex);
    }
    toggleGrid() {
        this.canvasService.toggleGrid();
    }
    toggleSnapToGrid() {
        this.canvasService.toggleSnapToGrid();
    }
    setGridSize(size) {
        this.canvasService.setGridSize(size);
    }
    setActiveTool(tool) {
        this.toolsService.setActiveTool(tool);
    }
    getActiveTool() {
        return this.toolsService.getActiveToolType();
    }
    setToolEnabled(toolType, enabled) {
        return this.toolsService.setToolEnabledByType(toolType, enabled);
    }
    setEnabledTools(toolTypes) {
        this.toolsService.setEnabledTools(toolTypes);
    }
    setCursor(cursor) {
        this.toolsService.setCursor(cursor);
    }
    resetCursor() {
        this.toolsService.resetCursor();
    }
    screenToCanvas(screenX, screenY) {
        return this.canvasService.screenToCanvas(screenX, screenY);
    }
    canvasToScreen(canvasX, canvasY) {
        return this.canvasService.canvasToScreen(canvasX, canvasY);
    }
    getSelectionBoxSignal() {
        return this.selectionService.getSelectionBoxSignal();
    }
    getBoundingBoxSignal() {
        return this.selectionService.getBoundingBoxSignal();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ApiService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ApiService });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ApiService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy13aGl0ZWJvYXJkL3NyYy9saWIvY29yZS9hcGkvYXBpLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBVSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDakUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUM5RSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDckQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDakUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDdkQsT0FBTyxFQUlMLFVBQVUsR0FNWCxNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFbEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFNBQVMsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7QUFHdkQsTUFBTSxPQUFPLFVBQVU7SUFDYixlQUFlLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzFDLGFBQWEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7SUFD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T0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUN0RCxDQUFDO3dHQXhoQlUsVUFBVTs0R0FBVixVQUFVOzs0RkFBVixVQUFVO2tCQUR0QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgU2lnbmFsLCBjb21wdXRlZCwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbmZpZ1NlcnZpY2UgfSBmcm9tICcuLi9jb25maWcvY29uZmlnLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBFdmVudEJ1c1NlcnZpY2UgfSBmcm9tICcuLi9ldmVudC1idXMvZXZlbnQtYnVzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDYW52YXNTZXJ2aWNlIH0gZnJvbSAnLi4vY2FudmFzL2NhbnZhcy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRWxlbWVudHNTZXJ2aWNlIH0gZnJvbSAnLi4vZWxlbWVudHMvZWxlbWVudHMuc2VydmljZSc7XHJcbmltcG9ydCB7IExheWVyTWFuYWdlbWVudFNlcnZpY2UgfSBmcm9tICcuLi9lbGVtZW50cy9sYXllci1tYW5hZ2VtZW50LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQYW5TZXJ2aWNlIH0gZnJvbSAnLi4vdmlld3BvcnQvcGFuLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTZWxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi4vZWxlbWVudHMvc2VsZWN0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBUb29sc1NlcnZpY2UgfSBmcm9tICcuLi90b29scy90b29scy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSGlzdG9yeVNlcnZpY2UgfSBmcm9tICcuLi9oaXN0b3J5L2hpc3Rvcnkuc2VydmljZSc7XHJcbmltcG9ydCB7IFpvb21TZXJ2aWNlIH0gZnJvbSAnLi4vdmlld3BvcnQvem9vbS5zZXJ2aWNlJztcclxuaW1wb3J0IHtcclxuICBBZGRJbWFnZSxcclxuICBBbGlnbm1lbnRUeXBlLFxyXG4gIEJvdW5kaW5nQm94LFxyXG4gIEZvcm1hdFR5cGUsXHJcbiAgU2VsZWN0aW9uQm94LFxyXG4gIFRvb2xUeXBlLFxyXG4gIFdoaXRlYm9hcmRDb25maWcsXHJcbiAgV2hpdGVib2FyZEVsZW1lbnQsXHJcbiAgQmxlbmRNb2RlLFxyXG59IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHsgV2hpdGVib2FyZEV2ZW50IH0gZnJvbSAnLi4vdHlwZXMvZXZlbnRzJztcclxuaW1wb3J0IHsgQ3Vyc29yVHlwZSB9IGZyb20gJy4uL3R5cGVzL2N1cnNvcnMnO1xyXG5pbXBvcnQgeyBDbGlwYm9hcmRTZXJ2aWNlLCBJT1NlcnZpY2UgfSBmcm9tICcuLi9pbnB1dCc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBBcGlTZXJ2aWNlIHtcclxuICBwcml2YXRlIGVsZW1lbnRzU2VydmljZSA9IGluamVjdChFbGVtZW50c1NlcnZpY2UpO1xyXG4gIHByaXZhdGUgY2FudmFzU2VydmljZSA9IGluamVjdChDYW52YXNTZXJ2aWNlKTtcclxuICBwcml2YXRlIHNlbGVjdGlvblNlcnZpY2UgPSBpbmplY3QoU2VsZWN0aW9uU2VydmljZSk7XHJcbiAgcHJpdmF0ZSB0b29sc1NlcnZpY2UgPSBpbmplY3QoVG9vbHNTZXJ2aWNlKTtcclxuICBwcml2YXRlIGlvU2VydmljZSA9IGluamVjdChJT1NlcnZpY2UpO1xyXG4gIHByaXZhdGUgaGlzdG9yeVNlcnZpY2UgPSBpbmplY3QoSGlzdG9yeVNlcnZpY2UpO1xyXG4gIHByaXZhdGUgem9vbVNlcnZpY2UgPSBpbmplY3QoWm9vbVNlcnZpY2UpO1xyXG4gIHByaXZhdGUgcGFuU2VydmljZSA9IGluamVjdChQYW5TZXJ2aWNlKTtcclxuICBwcml2YXRlIGxheWVyU2VydmljZSA9IGluamVjdChMYXllck1hbmFnZW1lbnRTZXJ2aWNlKTtcclxuICBwcml2YXRlIGNvbmZpZ1NlcnZpY2UgPSBpbmplY3QoQ29uZmlnU2VydmljZSk7XHJcbiAgcHJpdmF0ZSBjbGlwYm9hcmRTZXJ2aWNlID0gaW5qZWN0KENsaXBib2FyZFNlcnZpY2UpO1xyXG4gIHByaXZhdGUgZXZlbnRCdXNTZXJ2aWNlID0gaW5qZWN0KEV2ZW50QnVzU2VydmljZSk7XHJcblxyXG4gIHJlYWRvbmx5IGVsZW1lbnRzOiBTaWduYWw8V2hpdGVib2FyZEVsZW1lbnRbXT4gPSB0aGlzLmVsZW1lbnRzU2VydmljZS5lbGVtZW50cztcclxuXHJcbiAgcmVhZG9ubHkgZHJhZnRFbGVtZW50czogU2lnbmFsPFdoaXRlYm9hcmRFbGVtZW50W10+ID0gdGhpcy5lbGVtZW50c1NlcnZpY2UuZHJhZnRFbGVtZW50cztcclxuXHJcbiAgcmVhZG9ubHkgYWxsRWxlbWVudHM6IFNpZ25hbDxXaGl0ZWJvYXJkRWxlbWVudFtdPiA9IHRoaXMuZWxlbWVudHNTZXJ2aWNlLmFsbEVsZW1lbnRzO1xyXG5cclxuICByZWFkb25seSBzZWxlY3RlZEVsZW1lbnRzOiBTaWduYWw8V2hpdGVib2FyZEVsZW1lbnRbXT4gPSB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZ2V0U2VsZWN0ZWRFbGVtZW50c1NpZ25hbCgpO1xyXG5cclxuICByZWFkb25seSBjb25maWc6IFNpZ25hbDxXaGl0ZWJvYXJkQ29uZmlnPiA9IGNvbXB1dGVkKCgpID0+IHRoaXMuY29uZmlnU2VydmljZS5nZXRDb25maWcoKSk7XHJcblxyXG4gIHJlYWRvbmx5IGVsZW1lbnRzQ291bnQ6IFNpZ25hbDxudW1iZXI+ID0gdGhpcy5lbGVtZW50c1NlcnZpY2UuZWxlbWVudHNDb3VudDtcclxuXHJcbiAgcmVhZG9ubHkgaGFzRWxlbWVudHM6IFNpZ25hbDxib29sZWFuPiA9IHRoaXMuZWxlbWVudHNTZXJ2aWNlLmhhc0VsZW1lbnRzO1xyXG5cclxuICByZWFkb25seSBzZWxlY3RlZFRvb2w6IFNpZ25hbDxUb29sVHlwZT4gPSB0aGlzLnRvb2xzU2VydmljZS5zZWxlY3RlZFRvb2w7XHJcblxyXG4gIHJlYWRvbmx5IGF2YWlsYWJsZVRvb2xzID0gdGhpcy50b29sc1NlcnZpY2UuYXZhaWxhYmxlVG9vbHM7XHJcblxyXG4gIHJlYWRvbmx5IGxheWVycyA9IHRoaXMubGF5ZXJTZXJ2aWNlLmxheWVycztcclxuXHJcbiAgcmVhZG9ubHkgYWN0aXZlTGF5ZXJJZCA9IHRoaXMubGF5ZXJTZXJ2aWNlLmFjdGl2ZUxheWVySWQ7XHJcblxyXG4gIHJlYWRvbmx5IGFjdGl2ZUxheWVyID0gdGhpcy5sYXllclNlcnZpY2UuYWN0aXZlTGF5ZXI7XHJcblxyXG4gIHNldEVsZW1lbnRzKGVsZW1lbnRzOiBXaGl0ZWJvYXJkRWxlbWVudFtdKTogdm9pZCB7XHJcbiAgICB0aGlzLmVsZW1lbnRzU2VydmljZS5zZXRFbGVtZW50cyhlbGVtZW50cyk7XHJcbiAgfVxyXG5cclxuICBnZXRFbGVtZW50cygpOiBXaGl0ZWJvYXJkRWxlbWVudFtdIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnRzU2VydmljZS5nZXRFbGVtZW50cygpO1xyXG4gIH1cclxuXHJcbiAgYWRkRWxlbWVudHMoZWxlbWVudHM6IFdoaXRlYm9hcmRFbGVtZW50W10pOiB2b2lkIHtcclxuICAgIHRoaXMuZWxlbWVudHNTZXJ2aWNlLmFkZEVsZW1lbnRzKGVsZW1lbnRzKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUVsZW1lbnRzKGVsZW1lbnRzOiBBcnJheTxQYXJ0aWFsPFdoaXRlYm9hcmRFbGVtZW50PiAmIHsgaWQ6IHN0cmluZyB9Pik6IHZvaWQge1xyXG4gICAgY29uc3QgdXBkYXRlcyA9IGVsZW1lbnRzLm1hcCgoZWwpID0+ICh7IC4uLmVsLCBpZDogZWwuaWQgfSkpO1xyXG4gICAgdGhpcy5lbGVtZW50c1NlcnZpY2UudXBkYXRlRWxlbWVudHModXBkYXRlcyk7XHJcbiAgfVxyXG5cclxuICByZW1vdmVFbGVtZW50cyhlbGVtZW50czogV2hpdGVib2FyZEVsZW1lbnRbXSk6IHZvaWQge1xyXG4gICAgdGhpcy5lbGVtZW50c1NlcnZpY2UucmVtb3ZlRWxlbWVudHMoZWxlbWVudHMpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXIoKTogdm9pZCB7XHJcbiAgICB0aGlzLmVsZW1lbnRzU2VydmljZS5jbGVhcigpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJBbGwoKTogdm9pZCB7XHJcbiAgICB0aGlzLmVsZW1lbnRzU2VydmljZS5jbGVhcigpO1xyXG4gICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgfVxyXG5cclxuICBhZGRFbGVtZW50KGVsZW1lbnQ6IFdoaXRlYm9hcmRFbGVtZW50KTogdm9pZCB7XHJcbiAgICB0aGlzLmFkZEVsZW1lbnRzKFtlbGVtZW50XSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVFbGVtZW50KGVsZW1lbnQ6IFdoaXRlYm9hcmRFbGVtZW50KTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzKFtlbGVtZW50XSk7XHJcbiAgfVxyXG5cclxuICByZW1vdmVFbGVtZW50c0J5SWRzKGVsZW1lbnRJZHM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICB0aGlzLmVsZW1lbnRzU2VydmljZS5yZW1vdmVFbGVtZW50c0J5SWRzKGVsZW1lbnRJZHMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0RWxlbWVudEJ5SWQoaWQ6IHN0cmluZyk6IFdoaXRlYm9hcmRFbGVtZW50IHwgdW5kZWZpbmVkIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnRzU2VydmljZS5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgfVxyXG5cclxuICBnZXRFbGVtZW50c0J5SWRzKGlkczogc3RyaW5nW10pOiBXaGl0ZWJvYXJkRWxlbWVudFtdIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnRzU2VydmljZS5nZXRFbGVtZW50c0J5SWRzKGlkcyk7XHJcbiAgfVxyXG5cclxuICBnZXROZXh0WkluZGV4KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50c1NlcnZpY2UuZ2V0TmV4dFpJbmRleCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWxsRWxlbWVudHMoKTogV2hpdGVib2FyZEVsZW1lbnRbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50c1NlcnZpY2UuZ2V0RWxlbWVudHMoKTtcclxuICB9XHJcblxyXG4gIGdldERyYWZ0RWxlbWVudHMoKTogV2hpdGVib2FyZEVsZW1lbnRbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50c1NlcnZpY2UuZ2V0RHJhZnRFbGVtZW50cygpO1xyXG4gIH1cclxuXHJcbiAgYWRkRHJhZnRFbGVtZW50cyhlbGVtZW50czogV2hpdGVib2FyZEVsZW1lbnRbXSk6IHZvaWQge1xyXG4gICAgdGhpcy5lbGVtZW50c1NlcnZpY2UuYWRkRHJhZnRFbGVtZW50cyhlbGVtZW50cyk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVEcmFmdEVsZW1lbnRzKGVsZW1lbnRzOiBQYXJ0aWFsPFdoaXRlYm9hcmRFbGVtZW50PltdKTogdm9pZCB7XHJcbiAgICB0aGlzLmVsZW1lbnRzU2VydmljZS51cGRhdGVEcmFmdEVsZW1lbnRzKGVsZW1lbnRzKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZURyYWZ0RWxlbWVudHMoZWxlbWVudElkczogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgIHRoaXMuZWxlbWVudHNTZXJ2aWNlLnJlbW92ZURyYWZ0RWxlbWVudHMoZWxlbWVudElkcyk7XHJcbiAgfVxyXG5cclxuICBjb21taXREcmFmdEVsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5lbGVtZW50c1NlcnZpY2UuY29tbWl0RHJhZnRFbGVtZW50cygpO1xyXG4gIH1cclxuXHJcbiAgZWxlbWVudEV4aXN0cyhlbGVtZW50SWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudHNTZXJ2aWNlLmVsZW1lbnRFeGlzdHMoZWxlbWVudElkKTtcclxuICB9XHJcblxyXG4gIHNlbGVjdEVsZW1lbnRzKGVsZW1lbnRzT3JJZHM6IFdoaXRlYm9hcmRFbGVtZW50IHwgV2hpdGVib2FyZEVsZW1lbnRbXSB8IHN0cmluZyB8IHN0cmluZ1tdLCBhcHBlbmQgPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdEVsZW1lbnRzKGVsZW1lbnRzT3JJZHMsIGFwcGVuZCk7XHJcbiAgfVxyXG5cclxuICBkZXNlbGVjdEVsZW1lbnQoZWxlbWVudE9ySWQ6IFdoaXRlYm9hcmRFbGVtZW50IHwgc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZGVzZWxlY3RFbGVtZW50KGVsZW1lbnRPcklkKTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZVNlbGVjdGlvbihlbGVtZW50T3JJZDogV2hpdGVib2FyZEVsZW1lbnQgfCBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS50b2dnbGVTZWxlY3Rpb24oZWxlbWVudE9ySWQpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJTZWxlY3Rpb24oKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuY2xlYXJTZWxlY3Rpb24oKTtcclxuICB9XHJcblxyXG4gIHNlbGVjdEFsbCgpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5zZWxlY3RBbGwoKTtcclxuICB9XHJcblxyXG4gIGdldFNlbGVjdGVkRWxlbWVudHMoKTogV2hpdGVib2FyZEVsZW1lbnRbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmdldFNlbGVjdGVkRWxlbWVudHMoKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVNlbGVjdGVkRWxlbWVudHMocGFydGlhbEVsZW1lbnQ6IFBhcnRpYWw8V2hpdGVib2FyZEVsZW1lbnQ+KTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UudXBkYXRlU2VsZWN0ZWRFbGVtZW50cyhwYXJ0aWFsRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICByZW1vdmVTZWxlY3RlZEVsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLnJlbW92ZVNlbGVjdGVkRWxlbWVudHMoKTtcclxuICB9XHJcblxyXG4gIGlzU2VsZWN0ZWQoZWxlbWVudE9ySWQ6IFdoaXRlYm9hcmRFbGVtZW50IHwgc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmlzU2VsZWN0ZWQoZWxlbWVudE9ySWQpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJTZWxlY3Rpb25Cb3goKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuY2xlYXJTZWxlY3Rpb25Cb3goKTtcclxuICB9XHJcblxyXG4gIHRyYW5zZm9ybVNlbGVjdGVkRWxlbWVudHModHJhbnNmb3JtRm46IChlbGVtZW50czogV2hpdGVib2FyZEVsZW1lbnRbXSkgPT4gV2hpdGVib2FyZEVsZW1lbnRbXSk6IHZvaWQge1xyXG4gICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLnRyYW5zZm9ybVNlbGVjdGVkRWxlbWVudHModHJhbnNmb3JtRm4pO1xyXG4gIH1cclxuXHJcbiAgc2V0U2VsZWN0aW9uQm94KHNlbGVjdGlvbkJveDogU2VsZWN0aW9uQm94KTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2Uuc2V0U2VsZWN0aW9uQm94KHNlbGVjdGlvbkJveCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCb3VuZGluZ0JveCgpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS51cGRhdGVCb3VuZGluZ0JveCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Qm91bmRpbmdCb3goKTogQm91bmRpbmdCb3ggfCBudWxsIHtcclxuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZ2V0Qm91bmRpbmdCb3goKTtcclxuICB9XHJcblxyXG4gIHNldEJvdW5kaW5nQm94KGJib3g6IEJvdW5kaW5nQm94IHwgbnVsbCk6IHZvaWQge1xyXG4gICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLnNldEJvdW5kaW5nQm94KGJib3gpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2xpcGJvYXJkSW5mbygpIHtcclxuICAgIHJldHVybiB0aGlzLmNsaXBib2FyZFNlcnZpY2UuZ2V0Q2xpcGJvYXJkSW5mbygpO1xyXG4gIH1cclxuXHJcbiAgY29weUVsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmNvcHlFbGVtZW50cygpO1xyXG4gIH1cclxuXHJcbiAgY3V0RWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuY3V0RWxlbWVudHMoKTtcclxuICB9XHJcblxyXG4gIHBhc3RlRWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UucGFzdGVFbGVtZW50cygpO1xyXG4gIH1cclxuXHJcbiAgZHVwbGljYXRlRWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZHVwbGljYXRlRWxlbWVudHMoKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZVNlbGVjdGVkRWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZGVsZXRlU2VsZWN0ZWRFbGVtZW50cygpO1xyXG4gIH1cclxuXHJcbiAgYnJpbmdUb0Zyb250KCk6IHZvaWQge1xyXG4gICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmJyaW5nVG9Gcm9udCgpO1xyXG4gIH1cclxuXHJcbiAgYnJpbmdGb3J3YXJkKCk6IHZvaWQge1xyXG4gICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmJyaW5nRm9yd2FyZCgpO1xyXG4gIH1cclxuXHJcbiAgc2VuZEJhY2t3YXJkKCk6IHZvaWQge1xyXG4gICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLnNlbmRCYWNrd2FyZCgpO1xyXG4gIH1cclxuXHJcbiAgc2VuZFRvQmFjaygpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5zZW5kVG9CYWNrKCk7XHJcbiAgfVxyXG5cclxuICBncm91cFNlbGVjdGVkRWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZ3JvdXBTZWxlY3RlZEVsZW1lbnRzKCk7XHJcbiAgfVxyXG5cclxuICB1bmdyb3VwU2VsZWN0ZWRFbGVtZW50cygpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS51bmdyb3VwU2VsZWN0ZWRFbGVtZW50cygpO1xyXG4gIH1cclxuXHJcbiAgbG9ja0VsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmxvY2tFbGVtZW50cygpO1xyXG4gIH1cclxuXHJcbiAgdW5sb2NrRWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UudW5sb2NrRWxlbWVudHMoKTtcclxuICB9XHJcblxyXG4gIGFsaWduRWxlbWVudHMoYWxpZ25tZW50OiBBbGlnbm1lbnRUeXBlKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuYWxpZ25FbGVtZW50cyhhbGlnbm1lbnQpO1xyXG4gIH1cclxuXHJcbiAgZGlzdHJpYnV0ZUhvcml6b250YWxseSgpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5kaXN0cmlidXRlSG9yaXpvbnRhbGx5KCk7XHJcbiAgfVxyXG5cclxuICBkaXN0cmlidXRlVmVydGljYWxseSgpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5kaXN0cmlidXRlVmVydGljYWxseSgpO1xyXG4gIH1cclxuXHJcbiAgZmxpcEhvcml6b250YWwoKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZmxpcEhvcml6b250YWwoKTtcclxuICB9XHJcblxyXG4gIGZsaXBWZXJ0aWNhbCgpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5mbGlwVmVydGljYWwoKTtcclxuICB9XHJcblxyXG4gIG1vdmVTZWxlY3RlZEVsZW1lbnRzKGR4OiBudW1iZXIsIGR5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5tb3ZlU2VsZWN0ZWRFbGVtZW50cyhkeCwgZHkpO1xyXG4gIH1cclxuXHJcbiAgcm90YXRlU2VsZWN0ZWRFbGVtZW50cyhhbmdsZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2Uucm90YXRlU2VsZWN0ZWRFbGVtZW50cyhhbmdsZSk7XHJcbiAgfVxyXG5cclxuICBzY2FsZVNlbGVjdGVkRWxlbWVudHMoZmFjdG9yOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5zY2FsZVNlbGVjdGVkRWxlbWVudHMoZmFjdG9yKTtcclxuICB9XHJcblxyXG4gIGluaXRpYWxpemVXaGl0ZWJvYXJkKHN2Z0NvbnRhaW5lcjogU1ZHU1ZHRWxlbWVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5jYW52YXNTZXJ2aWNlLmluaXRpYWxpemVDYW52YXMoc3ZnQ29udGFpbmVyKTtcclxuICAgIHRoaXMudG9vbHNTZXJ2aWNlLnNldEFwaVNlcnZpY2UodGhpcyk7XHJcbiAgfVxyXG5cclxuICBnZXRDYW52YXMoKTogU1ZHU1ZHRWxlbWVudCB7XHJcbiAgICByZXR1cm4gdGhpcy5jYW52YXNTZXJ2aWNlLmdldENhbnZhcygpO1xyXG4gIH1cclxuXHJcbiAgc2V0Q2FudmFzRGltZW5zaW9ucyh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy5jYW52YXNTZXJ2aWNlLnNldENhbnZhc0RpbWVuc2lvbnMod2lkdGgsIGhlaWdodCk7XHJcbiAgfVxyXG5cclxuICBjZW50ZXJDYW52YXMoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNhbnZhc1NlcnZpY2UuY2VudGVyQ2FudmFzKCk7XHJcbiAgfVxyXG5cclxuICBmdWxsU2NyZWVuKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jYW52YXNTZXJ2aWNlLmZ1bGxTY3JlZW4oKTtcclxuICB9XHJcblxyXG4gIGV4aXRGdWxsU2NyZWVuKGRlZmF1bHRXaWR0aD86IG51bWJlciwgZGVmYXVsdEhlaWdodD86IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy5jYW52YXNTZXJ2aWNlLmV4aXRGdWxsU2NyZWVuKGRlZmF1bHRXaWR0aCwgZGVmYXVsdEhlaWdodCk7XHJcbiAgfVxyXG5cclxuICByZXNldENhbnZhcygpOiB2b2lkIHtcclxuICAgIHRoaXMuY2FudmFzU2VydmljZS5yZXNldENhbnZhcygpO1xyXG4gIH1cclxuXHJcbiAgc2V0Wm9vbSh6b29tOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMuem9vbVNlcnZpY2Uuem9vbSh6b29tKTtcclxuICB9XHJcblxyXG4gIHpvb21JbigpOiB2b2lkIHtcclxuICAgIHRoaXMuem9vbVNlcnZpY2Uuem9vbUluKCk7XHJcbiAgfVxyXG5cclxuICB6b29tT3V0KCk6IHZvaWQge1xyXG4gICAgdGhpcy56b29tU2VydmljZS56b29tT3V0KCk7XHJcbiAgfVxyXG5cclxuICByZXNldFpvb20oKTogdm9pZCB7XHJcbiAgICB0aGlzLnpvb21TZXJ2aWNlLnJlc2V0Wm9vbSgpO1xyXG4gIH1cclxuXHJcbiAgem9vbVRvRml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy56b29tU2VydmljZS56b29tVG9GaXQoKTtcclxuICB9XHJcblxyXG4gIHpvb21Ub1NlbGVjdGlvbigpOiB2b2lkIHtcclxuICAgIHRoaXMuem9vbVNlcnZpY2Uuem9vbVRvU2VsZWN0aW9uKCk7XHJcbiAgfVxyXG5cclxuICBwYW4oZHg6IG51bWJlciwgZHk6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy5wYW5TZXJ2aWNlLnBhbihkeCwgZHkpO1xyXG4gIH1cclxuXHJcbiAgcGFuVG8oeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMucGFuU2VydmljZS5wYW5Ubyh4LCB5KTtcclxuICB9XHJcblxyXG4gIHJlc2V0UGFuKCk6IHZvaWQge1xyXG4gICAgdGhpcy5wYW5TZXJ2aWNlLnJlc2V0UGFuKCk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBzYXZlKGZvcm1hdDogRm9ybWF0VHlwZSA9IEZvcm1hdFR5cGUuQmFzZTY0LCBuYW1lID0gJ3doaXRlYm9hcmQnKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIHJldHVybiB0aGlzLmlvU2VydmljZS5zYXZlKGZvcm1hdCwgbmFtZSk7XHJcbiAgfVxyXG5cclxuICBhZGRJbWFnZShpbWFnZUluZm86IEFkZEltYWdlKTogdm9pZCB7XHJcbiAgICB0aGlzLmlvU2VydmljZS5hZGRJbWFnZShpbWFnZUluZm8pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgaW1wb3J0SW1hZ2VGaWxlKGZpbGU6IEZpbGUsIHg/OiBudW1iZXIsIHk/OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLmlvU2VydmljZS5pbXBvcnRJbWFnZUZpbGUoZmlsZSwgeCwgeSk7XHJcbiAgfVxyXG5cclxuICBleHBvcnREYXRhKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5pb1NlcnZpY2UuZXhwb3J0RGF0YSgpO1xyXG4gIH1cclxuXHJcbiAgaW1wb3J0RGF0YShqc29uRGF0YTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLmlvU2VydmljZS5pbXBvcnREYXRhKGpzb25EYXRhKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGV4cG9ydEFzUE5HKG5hbWUgPSAnd2hpdGVib2FyZCcpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaW9TZXJ2aWNlLmV4cG9ydEFzUG5nKG5hbWUpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZXhwb3J0QXNTVkcobmFtZSA9ICd3aGl0ZWJvYXJkJyk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICByZXR1cm4gdGhpcy5pb1NlcnZpY2UuZXhwb3J0QXNTdmcobmFtZSk7XHJcbiAgfVxyXG5cclxuICBleHBvcnRBc0pTT04obmFtZSA9ICd3aGl0ZWJvYXJkJyk6IHZvaWQge1xyXG4gICAgY29uc3QganNvbkRhdGEgPSB0aGlzLmlvU2VydmljZS5leHBvcnREYXRhKCk7XHJcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW2pzb25EYXRhXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcbiAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xyXG4gICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgIGxpbmsuaHJlZiA9IHVybDtcclxuICAgIGxpbmsuZG93bmxvYWQgPSBgJHtuYW1lfS5qc29uYDtcclxuICAgIGxpbmsuY2xpY2soKTtcclxuICAgIFVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcclxuICB9XHJcblxyXG4gIHVuZG8oKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMuaGlzdG9yeVNlcnZpY2UudW5kbygpO1xyXG4gICAgaWYgKGVsZW1lbnRzKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudHNTZXJ2aWNlLnNldEVsZW1lbnRzKGVsZW1lbnRzKTtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICAgIHRoaXMuZXZlbnRCdXNTZXJ2aWNlLmVtaXQoV2hpdGVib2FyZEV2ZW50LlVuZG8sIHVuZGVmaW5lZCk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcmVkbygpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IGVsZW1lbnRzID0gdGhpcy5oaXN0b3J5U2VydmljZS5yZWRvKCk7XHJcbiAgICBpZiAoZWxlbWVudHMpIHtcclxuICAgICAgdGhpcy5lbGVtZW50c1NlcnZpY2Uuc2V0RWxlbWVudHMoZWxlbWVudHMpO1xyXG4gICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgICAgdGhpcy5ldmVudEJ1c1NlcnZpY2UuZW1pdChXaGl0ZWJvYXJkRXZlbnQuUmVkbywgdW5kZWZpbmVkKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBnZXRDYW5VbmRvU2lnbmFsKCk6IFNpZ25hbDxib29sZWFuPiB7XHJcbiAgICByZXR1cm4gdGhpcy5oaXN0b3J5U2VydmljZS5nZXRDYW5VbmRvU2lnbmFsKCk7XHJcbiAgfVxyXG5cclxuICBnZXRDYW5SZWRvU2lnbmFsKCk6IFNpZ25hbDxib29sZWFuPiB7XHJcbiAgICByZXR1cm4gdGhpcy5oaXN0b3J5U2VydmljZS5nZXRDYW5SZWRvU2lnbmFsKCk7XHJcbiAgfVxyXG5cclxuICBjbGVhckhpc3RvcnkoKTogdm9pZCB7XHJcbiAgICB0aGlzLmhpc3RvcnlTZXJ2aWNlLmNsZWFySGlzdG9yeSgpO1xyXG4gIH1cclxuXHJcbiAgcmVjb3JkRWxlbWVudENyZWF0aW9uKGJlZm9yZTogV2hpdGVib2FyZEVsZW1lbnRbXSwgYWZ0ZXI6IFdoaXRlYm9hcmRFbGVtZW50W10pOiB2b2lkIHtcclxuICAgIHRoaXMuaGlzdG9yeVNlcnZpY2UucmVjb3JkRWxlbWVudENyZWF0aW9uKGJlZm9yZSwgYWZ0ZXIpO1xyXG4gIH1cclxuXHJcbiAgcmVjb3JkRWxlbWVudFVwZGF0ZShiZWZvcmU6IFdoaXRlYm9hcmRFbGVtZW50W10sIGFmdGVyOiBXaGl0ZWJvYXJkRWxlbWVudFtdKTogdm9pZCB7XHJcbiAgICB0aGlzLmhpc3RvcnlTZXJ2aWNlLnJlY29yZEVsZW1lbnRVcGRhdGUoYmVmb3JlLCBhZnRlcik7XHJcbiAgfVxyXG5cclxuICByZWNvcmRFbGVtZW50RGVsZXRpb24oYmVmb3JlOiBXaGl0ZWJvYXJkRWxlbWVudFtdLCBhZnRlcjogV2hpdGVib2FyZEVsZW1lbnRbXSk6IHZvaWQge1xyXG4gICAgdGhpcy5oaXN0b3J5U2VydmljZS5yZWNvcmRFbGVtZW50RGVsZXRpb24oYmVmb3JlLCBhZnRlcik7XHJcbiAgfVxyXG5cclxuICByZWNvcmRDbGVhcihiZWZvcmU6IFdoaXRlYm9hcmRFbGVtZW50W10sIGFmdGVyOiBXaGl0ZWJvYXJkRWxlbWVudFtdKTogdm9pZCB7XHJcbiAgICB0aGlzLmhpc3RvcnlTZXJ2aWNlLnJlY29yZENsZWFyKGJlZm9yZSwgYWZ0ZXIpO1xyXG4gIH1cclxuXHJcbiAgcmVjb3JkQ2hhbmdlKGJlZm9yZTogV2hpdGVib2FyZEVsZW1lbnRbXSwgYWZ0ZXI6IFdoaXRlYm9hcmRFbGVtZW50W10sIGRlc2NyaXB0aW9uOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMuaGlzdG9yeVNlcnZpY2UucmVjb3JkQ2hhbmdlKGJlZm9yZSwgYWZ0ZXIsIGRlc2NyaXB0aW9uKTtcclxuICB9XHJcblxyXG4gIGdldENvbmZpZygpOiBXaGl0ZWJvYXJkQ29uZmlnIHtcclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ1NlcnZpY2UuZ2V0Q29uZmlnKCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVDb25maWcoY29uZmlnOiBQYXJ0aWFsPFdoaXRlYm9hcmRDb25maWc+KTogdm9pZCB7XHJcbiAgICB0aGlzLmNvbmZpZ1NlcnZpY2UudXBkYXRlQ29uZmlnKGNvbmZpZyk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVDb25maWdWYWx1ZTxLIGV4dGVuZHMga2V5b2YgV2hpdGVib2FyZENvbmZpZz4oa2V5OiBLLCB2YWx1ZTogV2hpdGVib2FyZENvbmZpZ1tLXSk6IHZvaWQge1xyXG4gICAgdGhpcy5jb25maWdTZXJ2aWNlLnVwZGF0ZUNvbmZpZ1ZhbHVlKGtleSwgdmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgYWRkTGF5ZXIobmFtZT86IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTZXJ2aWNlLmFkZExheWVyKG5hbWUpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlTGF5ZXIoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTZXJ2aWNlLnJlbW92ZUxheWVyKGlkKTtcclxuICB9XHJcblxyXG4gIHNldEFjdGl2ZUxheWVyKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmxheWVyU2VydmljZS5zZXRBY3RpdmVMYXllcihpZCk7XHJcbiAgfVxyXG5cclxuICBnZXRBY3RpdmVMYXllcklkKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5sYXllclNlcnZpY2UuZ2V0QWN0aXZlTGF5ZXJJZCgpO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlTGF5ZXJWaXNpYmlsaXR5KGlkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmxheWVyU2VydmljZS50b2dnbGVMYXllclZpc2liaWxpdHkoaWQpO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlTGF5ZXJMb2NrKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmxheWVyU2VydmljZS50b2dnbGVMYXllckxvY2soaWQpO1xyXG4gIH1cclxuXHJcbiAgcmVuYW1lTGF5ZXIoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5sYXllclNlcnZpY2UucmVuYW1lTGF5ZXIoaWQsIG5hbWUpO1xyXG4gIH1cclxuXHJcbiAgc2V0TGF5ZXJPcGFjaXR5KGlkOiBzdHJpbmcsIG9wYWNpdHk6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTZXJ2aWNlLnNldExheWVyT3BhY2l0eShpZCwgb3BhY2l0eSk7XHJcbiAgfVxyXG5cclxuICBzZXRMYXllckJsZW5kTW9kZShpZDogc3RyaW5nLCBibGVuZE1vZGU6IEJsZW5kTW9kZSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTZXJ2aWNlLnNldExheWVyQmxlbmRNb2RlKGlkLCBibGVuZE1vZGUpO1xyXG4gIH1cclxuXHJcbiAgbW92ZUxheWVyVXAoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTZXJ2aWNlLm1vdmVMYXllclVwKGlkKTtcclxuICB9XHJcblxyXG4gIG1vdmVMYXllckRvd24oaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTZXJ2aWNlLm1vdmVMYXllckRvd24oaWQpO1xyXG4gIH1cclxuXHJcbiAgcmVvcmRlckxheWVyc0J5SW5kZXgocHJldmlvdXNJbmRleDogbnVtYmVyLCBjdXJyZW50SW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTZXJ2aWNlLnJlb3JkZXJMYXllcnNCeUluZGV4KHByZXZpb3VzSW5kZXgsIGN1cnJlbnRJbmRleCk7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVHcmlkKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jYW52YXNTZXJ2aWNlLnRvZ2dsZUdyaWQoKTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZVNuYXBUb0dyaWQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNhbnZhc1NlcnZpY2UudG9nZ2xlU25hcFRvR3JpZCgpO1xyXG4gIH1cclxuXHJcbiAgc2V0R3JpZFNpemUoc2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLmNhbnZhc1NlcnZpY2Uuc2V0R3JpZFNpemUoc2l6ZSk7XHJcbiAgfVxyXG5cclxuICBzZXRBY3RpdmVUb29sKHRvb2w6IFRvb2xUeXBlKTogdm9pZCB7XHJcbiAgICB0aGlzLnRvb2xzU2VydmljZS5zZXRBY3RpdmVUb29sKHRvb2wpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWN0aXZlVG9vbCgpOiBUb29sVHlwZSB7XHJcbiAgICByZXR1cm4gdGhpcy50b29sc1NlcnZpY2UuZ2V0QWN0aXZlVG9vbFR5cGUoKTtcclxuICB9XHJcblxyXG4gIHNldFRvb2xFbmFibGVkKHRvb2xUeXBlOiBUb29sVHlwZSwgZW5hYmxlZDogYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMudG9vbHNTZXJ2aWNlLnNldFRvb2xFbmFibGVkQnlUeXBlKHRvb2xUeXBlLCBlbmFibGVkKTtcclxuICB9XHJcblxyXG4gIHNldEVuYWJsZWRUb29scyh0b29sVHlwZXM6IFRvb2xUeXBlW10pOiB2b2lkIHtcclxuICAgIHRoaXMudG9vbHNTZXJ2aWNlLnNldEVuYWJsZWRUb29scyh0b29sVHlwZXMpO1xyXG4gIH1cclxuXHJcbiAgc2V0Q3Vyc29yKGN1cnNvcjogQ3Vyc29yVHlwZSk6IHZvaWQge1xyXG4gICAgdGhpcy50b29sc1NlcnZpY2Uuc2V0Q3Vyc29yKGN1cnNvcik7XHJcbiAgfVxyXG5cclxuICByZXNldEN1cnNvcigpOiB2b2lkIHtcclxuICAgIHRoaXMudG9vbHNTZXJ2aWNlLnJlc2V0Q3Vyc29yKCk7XHJcbiAgfVxyXG5cclxuICBzY3JlZW5Ub0NhbnZhcyhzY3JlZW5YOiBudW1iZXIsIHNjcmVlblk6IG51bWJlcik6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB7XHJcbiAgICByZXR1cm4gdGhpcy5jYW52YXNTZXJ2aWNlLnNjcmVlblRvQ2FudmFzKHNjcmVlblgsIHNjcmVlblkpO1xyXG4gIH1cclxuXHJcbiAgY2FudmFzVG9TY3JlZW4oY2FudmFzWDogbnVtYmVyLCBjYW52YXNZOiBudW1iZXIpOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0ge1xyXG4gICAgcmV0dXJuIHRoaXMuY2FudmFzU2VydmljZS5jYW52YXNUb1NjcmVlbihjYW52YXNYLCBjYW52YXNZKTtcclxuICB9XHJcblxyXG4gIGdldFNlbGVjdGlvbkJveFNpZ25hbCgpOiBTaWduYWw8U2VsZWN0aW9uQm94PiB7XHJcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmdldFNlbGVjdGlvbkJveFNpZ25hbCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Qm91bmRpbmdCb3hTaWduYWwoKTogU2lnbmFsPEJvdW5kaW5nQm94IHwgbnVsbD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uU2VydmljZS5nZXRCb3VuZGluZ0JveFNpZ25hbCgpO1xyXG4gIH1cclxufVxyXG4iXX0=