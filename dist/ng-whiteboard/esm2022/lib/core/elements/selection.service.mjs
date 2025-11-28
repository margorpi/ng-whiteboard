import { computed, Injectable, signal } from '@angular/core';
import { EventBusService } from '../event-bus';
import { CanvasService } from '../canvas/canvas.service';
import { ClipboardService } from '../input/clipboard.service';
import { ToolsService } from '../tools/tools.service';
import { AlignmentType, ToolType } from '../types';
import { WhiteboardEvent } from '../types/events';
import { getElementBounds } from '../utils/dom';
import { getCombinedScreenBounds } from '../utils/geometry/transform-utils';
import { ElementsService } from './elements.service';
import * as i0 from "@angular/core";
import * as i1 from "../event-bus";
import * as i2 from "../input/clipboard.service";
import * as i3 from "./elements.service";
import * as i4 from "../tools/tools.service";
import * as i5 from "../canvas/canvas.service";
export class SelectionService {
    eventBus;
    clipboardService;
    elementsService;
    toolsService;
    canvasService;
    OFFSET_INCREMENT = 20;
    // Selection state
    selectedElementIdsSignal = signal(new Set());
    selectionBoxSignal = signal({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        visible: false,
    });
    boundingBoxSignal = signal(null);
    // Derived signals
    selectedIdsSignal = computed(() => Array.from(this.selectedElementIdsSignal()));
    hasSelectionSignal = computed(() => this.selectedElementIdsSignal().size > 0);
    getElementsFn;
    updateElementsFn;
    removeElementsFn;
    constructor(eventBus, clipboardService, elementsService, toolsService, canvasService) {
        this.eventBus = eventBus;
        this.clipboardService = clipboardService;
        this.elementsService = elementsService;
        this.toolsService = toolsService;
        this.canvasService = canvasService;
        this.initializeDataProviders();
    }
    initializeDataProviders() {
        this.getElementsFn = () => this.elementsService.getElements();
        this.updateElementsFn = (updates) => this.elementsService.updateElements(updates);
        this.removeElementsFn = (elements, history) => this.elementsService.removeElements(elements, history);
    }
    cutElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0)
            return;
        this.clipboardService.cut(selectedElements);
        this.deleteSelectedElements();
    }
    copyElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0)
            return;
        this.clipboardService.copy(selectedElements);
    }
    pasteElements() {
        const pastedElements = this.clipboardService.paste();
        if (pastedElements.length > 0) {
            this.selectElements(pastedElements);
        }
    }
    duplicateElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0)
            return;
        const duplicatedElements = this.clipboardService.duplicateElements(selectedElements);
        if (duplicatedElements.length > 0) {
            this.selectElements(duplicatedElements);
        }
    }
    deleteSelectedElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.removeElementsFn)
            return;
        this.removeElementsFn(selectedElements, true);
        this.clearSelection();
        // Emit granular event for elements removal
        this.eventBus.emit(WhiteboardEvent.ElementsRemoved, selectedElements);
        // Emit data change event
        this.eventBus.emit(WhiteboardEvent.DataChange, this.elementsService.getElements());
    }
    getSelectedIds() {
        return this.selectedIdsSignal();
    }
    /**
     * Get currently selected elements
     */
    getSelectedElements() {
        if (!this.getElementsFn) {
            console.warn('Element data provider not set');
            return [];
        }
        const ids = this.getSelectedIds();
        return this.getElementsFn().filter((el) => ids.includes(el.id));
    }
    getSelectedElementsSignal() {
        return computed(() => this.getSelectedElements());
    }
    /**
     * Check if element is selected
     */
    isSelected(elementOrId) {
        const id = typeof elementOrId === 'string' ? elementOrId : elementOrId.id;
        return this.selectedElementIdsSignal().has(id);
    }
    /**
     * Get selection count
     */
    getSelectionCount() {
        return this.selectedElementIdsSignal().size;
    }
    /**
     * Check if any elements are selected
     */
    hasSelection() {
        return this.getSelectionCount() > 0;
    }
    // SELECTION OPERATIONS
    /**
     * Select elements by reference or ID, with option to append to existing selection
     */
    selectElements(elementsOrIds, append = false) {
        const incoming = Array.isArray(elementsOrIds) ? elementsOrIds : [elementsOrIds];
        const selectedIds = incoming.map((el) => (typeof el === 'string' ? el : el.id));
        // Expand selection to include all grouped elements
        const expandedIds = this.expandSelectionToIncludeGroups(selectedIds);
        const currentSelection = Array.from(this.selectedElementIdsSignal());
        const newSelection = append ? [...new Set([...currentSelection, ...expandedIds])] : expandedIds;
        this.selectedElementIdsSignal.set(new Set(newSelection));
        if (newSelection.length > 0) {
            this.toolsService.setActiveTool(ToolType.Select);
        }
        // Get the updated selection elements after group expansion
        const fullSelectionElements = this.getSelectedElements();
        this.updateBoundingBoxFromElements(fullSelectionElements);
        this.eventBus.emit(WhiteboardEvent.ElementsSelected, fullSelectionElements);
    }
    /**
     * Deselect specific element
     */
    deselectElement(elementOrId) {
        const id = typeof elementOrId === 'string' ? elementOrId : elementOrId.id;
        const current = new Set(this.selectedElementIdsSignal());
        if (current.has(id)) {
            // Expand deselection to include all grouped elements
            const expandedIds = this.expandSelectionToIncludeGroups([id]);
            expandedIds.forEach((expandedId) => {
                current.delete(expandedId);
            });
            this.selectedElementIdsSignal.set(current);
            this.updateBoundingBox();
            const selectedElements = this.getSelectedElements();
            this.eventBus.emit(WhiteboardEvent.ElementsSelected, selectedElements);
        }
    }
    /**
     * Toggle selection of element
     */
    toggleSelection(elementOrId) {
        const id = typeof elementOrId === 'string' ? elementOrId : elementOrId.id;
        const current = new Set(this.selectedElementIdsSignal());
        const wasSelected = current.has(id);
        // Expand to include all grouped elements
        const expandedIds = this.expandSelectionToIncludeGroups([id]);
        if (wasSelected) {
            // Deselect all elements in the group
            expandedIds.forEach((expandedId) => {
                current.delete(expandedId);
            });
        }
        else {
            // Select all elements in the group
            expandedIds.forEach((expandedId) => {
                current.add(expandedId);
            });
            // Automatically activate select tool when an element gets selected
            this.toolsService.setActiveTool(ToolType.Select);
        }
        this.selectedElementIdsSignal.set(current);
        this.updateBoundingBox();
        const selectedElements = this.getSelectedElements();
        this.eventBus.emit(WhiteboardEvent.ElementsSelected, selectedElements);
    }
    /**
     * Clear all selection
     */
    clearSelection() {
        this.selectedElementIdsSignal.set(new Set());
        this.clearBoundingBox();
        this.eventBus.emit(WhiteboardEvent.ElementsSelected, []);
    }
    /**
     * Select all elements
     */
    selectAll() {
        if (!this.getElementsFn) {
            console.warn('Element data provider not set');
            return;
        }
        const allElements = this.getElementsFn();
        const ids = new Set(allElements.map((el) => el.id));
        this.selectedElementIdsSignal.set(ids);
        // Automatically activate select tool when elements are selected
        if (allElements.length > 0) {
            this.toolsService.setActiveTool(ToolType.Select);
        }
        this.updateBoundingBox();
        this.eventBus.emit(WhiteboardEvent.ElementsSelected, allElements);
    }
    /**
     * Select elements within a rectangular area
     */
    selectElementsInArea(area) {
        if (!this.getElementsFn) {
            console.warn('Element data provider not set');
            return;
        }
        const allElements = this.getElementsFn();
        const selectedIds = [];
        allElements.forEach((element) => {
            const bounds = getElementBounds(element);
            // Check if element intersects with selection area
            const intersects = !(bounds.maxX < area.x ||
                bounds.minX > area.x + area.width ||
                bounds.maxY < area.y ||
                bounds.minY > area.y + area.height);
            if (intersects) {
                selectedIds.push(element.id);
            }
        });
        if (selectedIds.length > 0) {
            // Expand to include grouped elements - this will be handled by selectElements
            this.selectElements(selectedIds);
        }
    }
    // SELECTION BOX (drag selection rectangle)
    /**
     * Set selection box state
     */
    setSelectionBox(box) {
        this.selectionBoxSignal.set(box);
    }
    /**
     * Get current selection box
     */
    getSelectionBox() {
        return this.selectionBoxSignal();
    }
    /**
     * Get selection box signal
     */
    getSelectionBoxSignal() {
        return this.selectionBoxSignal.asReadonly();
    }
    /**
     * Clear selection box
     */
    clearSelectionBox() {
        this.selectionBoxSignal.set({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            visible: false,
        });
    }
    // BOUNDING BOX (transform handles around selection)
    /**
     * Update bounding box based on current selection
     */
    updateBoundingBox() {
        const selectedElements = this.getSelectedElements();
        this.updateBoundingBoxFromElements(selectedElements);
    }
    /**
     * Get current bounding box
     */
    getBoundingBox() {
        return this.boundingBoxSignal();
    }
    /**
     * Get bounding box signal
     */
    getBoundingBoxSignal() {
        return this.boundingBoxSignal.asReadonly();
    }
    /**
     * Clear bounding box
     */
    clearBoundingBox() {
        this.boundingBoxSignal.set(null);
    }
    /**
     * Set bounding box directly (useful for dynamic updates during rotation)
     */
    setBoundingBox(bbox) {
        this.boundingBoxSignal.set(bbox);
    }
    // INTERNAL HELPERS
    /**
     * Get all elements that belong to the same groups as the provided elements
     */
    expandSelectionToIncludeGroups(elementIds) {
        if (!this.getElementsFn)
            return elementIds;
        const allElements = this.getElementsFn();
        const elementsToExpand = allElements.filter((el) => elementIds.includes(el.id));
        const groupIds = new Set(elementsToExpand
            .map((el) => el.groupId)
            .filter((groupId) => groupId !== undefined && groupId !== null));
        if (groupIds.size === 0) {
            return elementIds; // No groups, return original selection
        }
        // Find all elements that belong to any of these groups
        const expandedElements = allElements.filter((el) => {
            return (elementIds.includes(el.id) || // Original selection
                (el.groupId && groupIds.has(el.groupId)) // Elements in the same groups
            );
        });
        return expandedElements.map((el) => el.id);
    }
    calculateBoundingBox(elements) {
        let bounds;
        let rotation = 0;
        if (elements.length === 1) {
            // For single element, the bounding box should match the element's non-rotated bounds
            // The bounding box will rotate with the element via SVG transform
            const element = elements[0];
            rotation = element.rotation || 0;
            // Get bounds in local space (relative to element origin)
            // For rectangles, this returns {minX: element.x, minY: element.y, width, height}
            bounds = getElementBounds(element);
        }
        else {
            // For multiple elements, use screen-space bounds that account for rotation
            const combinedBounds = getCombinedScreenBounds(elements);
            if (!combinedBounds) {
                throw new Error('Cannot calculate bounding box for empty element list');
            }
            bounds = combinedBounds;
            rotation = 0; // No rotation for multi-selection
        }
        const { minX, minY, maxX, maxY, width, height } = bounds;
        const centerX = minX + width / 2;
        const handleOffset = 20;
        return {
            x: minX,
            y: minY,
            width,
            height,
            handles: {
                topLeft: { x: minX, y: minY },
                topRight: { x: maxX, y: minY },
                bottomLeft: { x: minX, y: maxY },
                bottomRight: { x: maxX, y: maxY },
                rotateHandle: { x: centerX, y: minY - handleOffset },
            },
            rotation,
        };
    }
    updateBoundingBoxFromElements(elements) {
        if (!elements || elements.length === 0) {
            this.clearBoundingBox();
            return;
        }
        this.boundingBoxSignal.set(this.calculateBoundingBox(elements));
    }
    // SELECTION TRANSFORMATION HELPERS
    /**
     * Update all selected elements with partial data
     */
    updateSelectedElements(partial, updateElementsFn) {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0)
            return;
        // Prefer provided updater, otherwise use internal elementsService updater
        const updater = updateElementsFn || this.updateElementsFn;
        if (!updater)
            return; // Nothing to do if no updater available
        // Create update patches for all selected elements
        const updates = selectedElements.map((element) => ({
            ...partial,
            id: element.id,
        }));
        // Apply updates through the provided function
        updater(updates, true);
        // Update bounding box to reflect changes
        this.updateBoundingBox();
        // Emit selection event to update UI
        const updatedElements = this.getSelectedElements();
        this.eventBus.emit(WhiteboardEvent.ElementsSelected, updatedElements);
    }
    /**
     * Transform selected elements using a transformation function
     */
    transformSelectedElements(transformFn, updateElementsFn) {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0)
            return;
        const updater = updateElementsFn || this.updateElementsFn;
        if (!updater)
            return;
        const transformedElements = transformFn(selectedElements);
        // Apply updates through the provided function
        const updates = transformedElements.map((el) => ({ ...el, id: el.id }));
        updater(updates, true);
        // Update bounding box to reflect changes
        this.updateBoundingBox();
        // Emit selection event to update UI
        const updatedElements = this.getSelectedElements();
        this.eventBus.emit(WhiteboardEvent.ElementsSelected, updatedElements);
    }
    // SELECTION UTILITIES
    /**
     * Get selection bounds (combined bounds of all selected elements)
     */
    getSelectionBounds() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0) {
            return null;
        }
        const allBounds = selectedElements.map(getElementBounds);
        return {
            minX: Math.min(...allBounds.map((b) => b.minX)),
            minY: Math.min(...allBounds.map((b) => b.minY)),
            maxX: Math.max(...allBounds.map((b) => b.maxX)),
            maxY: Math.max(...allBounds.map((b) => b.maxY)),
        };
    }
    /**
     * Check if selection contains specific element type
     */
    selectionContainsType(elementType) {
        return this.getSelectedElements().some((el) => el.type === elementType);
    }
    /**
     * Get unique element types in current selection
     */
    getSelectedElementTypes() {
        const types = this.getSelectedElements().map((el) => el.type);
        return [...new Set(types)];
    }
    /**
     * Remove selected elements
     */
    removeSelectedElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0) {
            return;
        }
        if (this.removeElementsFn) {
            this.removeElementsFn(selectedElements, true);
            this.clearSelection();
        }
    }
    // Z-INDEX OPERATIONS
    /**
     * Bring selected elements to front
     */
    bringToFront() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.getElementsFn || !this.updateElementsFn)
            return;
        const allElements = this.getElementsFn();
        const maxZIndex = Math.max(...allElements.map((el) => el.zIndex || 0));
        const updates = selectedElements.map((element, index) => ({
            id: element.id,
            zIndex: maxZIndex + index + 1,
        }));
        this.updateElementsFn(updates);
    }
    /**
     * Bring selected elements forward by one level
     */
    bringForward() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.getElementsFn || !this.updateElementsFn)
            return;
        const allElements = this.getElementsFn();
        // Sort all elements by z-index
        const sortedElements = [...allElements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        const updates = [];
        selectedElements.forEach((selectedElement) => {
            const currentIndex = sortedElements.findIndex((el) => el.id === selectedElement.id);
            // Find the next non-selected element ahead of this one
            let targetIndex = currentIndex + 1;
            while (targetIndex < sortedElements.length &&
                selectedElements.some((sel) => sel.id === sortedElements[targetIndex].id)) {
                targetIndex++;
            }
            // If there's an element to swap with
            if (targetIndex < sortedElements.length) {
                const targetElement = sortedElements[targetIndex];
                updates.push({
                    id: selectedElement.id,
                    zIndex: targetElement.zIndex,
                });
                updates.push({
                    id: targetElement.id,
                    zIndex: selectedElement.zIndex,
                });
            }
        });
        if (updates.length > 0) {
            this.updateElementsFn(updates);
        }
    }
    /**
     * Send selected elements backward by one level
     */
    sendBackward() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.getElementsFn || !this.updateElementsFn)
            return;
        const allElements = this.getElementsFn();
        // Sort all elements by z-index
        const sortedElements = [...allElements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        const updates = [];
        selectedElements.forEach((selectedElement) => {
            const currentIndex = sortedElements.findIndex((el) => el.id === selectedElement.id);
            // Find the previous non-selected element behind this one
            let targetIndex = currentIndex - 1;
            while (targetIndex >= 0 && selectedElements.some((sel) => sel.id === sortedElements[targetIndex].id)) {
                targetIndex--;
            }
            // If there's an element to swap with
            if (targetIndex >= 0) {
                const targetElement = sortedElements[targetIndex];
                updates.push({
                    id: selectedElement.id,
                    zIndex: targetElement.zIndex,
                });
                updates.push({
                    id: targetElement.id,
                    zIndex: selectedElement.zIndex,
                });
            }
        });
        if (updates.length > 0) {
            this.updateElementsFn(updates);
        }
    }
    /**
     * Send selected elements to back
     */
    sendToBack() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.getElementsFn || !this.updateElementsFn)
            return;
        // Start from z-index 1 and assign sequential values
        const updates = selectedElements.map((element, index) => ({
            id: element.id,
            zIndex: index + 1,
        }));
        this.updateElementsFn(updates);
        // Shift all other elements up to make room
        const allElements = this.getElementsFn();
        const otherElements = allElements.filter((el) => !selectedElements.some((selected) => selected.id === el.id));
        const otherUpdates = otherElements.map((element, index) => ({
            id: element.id,
            zIndex: selectedElements.length + index + 1,
        }));
        if (otherUpdates.length > 0) {
            this.updateElementsFn(otherUpdates);
        }
    }
    // GROUPING OPERATIONS
    /**
     * Group selected elements
     */
    groupSelectedElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length < 2 || !this.updateElementsFn)
            return;
        const groupId = `group_${Date.now()}`;
        const updates = selectedElements.map((element) => ({
            id: element.id,
            groupId: groupId,
        }));
        this.updateElementsFn(updates);
    }
    /**
     * Ungroup selected elements
     */
    ungroupSelectedElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.getElementsFn || !this.updateElementsFn)
            return;
        // Find elements that belong to the same group as selected elements
        const selectedElementsWithGroups = selectedElements.filter((el) => el.groupId !== undefined && el.groupId !== null);
        if (selectedElementsWithGroups.length === 0)
            return;
        // Get all group IDs from selected elements
        const groupIds = [...new Set(selectedElementsWithGroups.map((el) => el.groupId).filter(Boolean))];
        // Find all elements that belong to these groups
        const allElements = this.getElementsFn();
        const elementsToUngroup = allElements.filter((el) => {
            return el.groupId !== undefined && el.groupId !== null && groupIds.includes(el.groupId);
        });
        // Remove group ID from all elements in the groups
        const updates = elementsToUngroup.map((element) => ({
            id: element.id,
            groupId: undefined,
        }));
        this.updateElementsFn(updates);
    }
    // LOCKING OPERATIONS
    /**
     * Lock selected elements
     */
    lockElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.updateElementsFn)
            return;
        const updates = selectedElements.map((element) => ({
            id: element.id,
            locked: true,
        }));
        this.updateElementsFn(updates);
    }
    /**
     * Unlock selected elements
     */
    unlockElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.updateElementsFn)
            return;
        const updates = selectedElements.map((element) => ({
            id: element.id,
            locked: false,
        }));
        this.updateElementsFn(updates);
    }
    // ALIGNMENT OPERATIONS
    /**
     * Align selected elements
     */
    alignElements(alignment) {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0)
            return;
        if (!this.updateElementsFn) {
            console.warn('Update elements function not available');
            return;
        }
        const updates = this.calculateAlignmentUpdates(selectedElements, alignment);
        if (updates.length > 0) {
            this.updateElementsFn(updates, true);
            this.updateBoundingBox();
        }
    }
    /**
     * Distribute selected elements horizontally with equal spacing
     */
    distributeHorizontally() {
        this.alignElements(AlignmentType.DistributeHorizontally);
    }
    /**
     * Distribute selected elements vertically with equal spacing
     */
    distributeVertically() {
        this.alignElements(AlignmentType.DistributeVertically);
    }
    /**
     * Calculate alignment updates for selected elements
     */
    calculateAlignmentUpdates(elements, alignment) {
        if (elements.length === 0)
            return [];
        const updates = [];
        const bounds = elements.map((element) => ({
            element,
            bounds: getElementBounds(element),
        }));
        // For single element, align to visible viewport
        if (elements.length === 1) {
            const visibleBounds = this.canvasService.getVisibleBounds();
            const elementBounds = bounds[0].bounds;
            const element = bounds[0].element;
            switch (alignment) {
                case AlignmentType.Left: {
                    const offsetX = visibleBounds.left - elementBounds.minX;
                    if (offsetX !== 0) {
                        updates.push({
                            id: element.id,
                            x: element.x + offsetX,
                        });
                    }
                    break;
                }
                case AlignmentType.Center: {
                    const viewportCenterX = (visibleBounds.left + visibleBounds.right) / 2;
                    const elementCenterX = elementBounds.minX + elementBounds.width / 2;
                    const offsetX = viewportCenterX - elementCenterX;
                    if (offsetX !== 0) {
                        updates.push({
                            id: element.id,
                            x: element.x + offsetX,
                        });
                    }
                    break;
                }
                case AlignmentType.Right: {
                    const offsetX = visibleBounds.right - elementBounds.maxX;
                    if (offsetX !== 0) {
                        updates.push({
                            id: element.id,
                            x: element.x + offsetX,
                        });
                    }
                    break;
                }
                case AlignmentType.Top: {
                    const offsetY = visibleBounds.top - elementBounds.minY;
                    if (offsetY !== 0) {
                        updates.push({
                            id: element.id,
                            y: element.y + offsetY,
                        });
                    }
                    break;
                }
                case AlignmentType.Middle: {
                    const viewportCenterY = (visibleBounds.top + visibleBounds.bottom) / 2;
                    const elementCenterY = elementBounds.minY + elementBounds.height / 2;
                    const offsetY = viewportCenterY - elementCenterY;
                    if (offsetY !== 0) {
                        updates.push({
                            id: element.id,
                            y: element.y + offsetY,
                        });
                    }
                    break;
                }
                case AlignmentType.Bottom: {
                    const offsetY = visibleBounds.bottom - elementBounds.maxY;
                    if (offsetY !== 0) {
                        updates.push({
                            id: element.id,
                            y: element.y + offsetY,
                        });
                    }
                    break;
                }
                default:
                    console.warn('Unsupported alignment type for single element:', alignment);
                    return [];
            }
            return updates;
        }
        // For multiple elements, align to each other
        switch (alignment) {
            case AlignmentType.Left: {
                const leftMost = Math.min(...bounds.map((b) => b.bounds.minX));
                bounds.forEach(({ element, bounds: elementBounds }) => {
                    const offsetX = leftMost - elementBounds.minX;
                    if (offsetX !== 0) {
                        updates.push({
                            id: element.id,
                            x: element.x + offsetX,
                        });
                    }
                });
                break;
            }
            case AlignmentType.Center: {
                const centerX = bounds.reduce((acc, b) => acc + (b.bounds.minX + b.bounds.width / 2), 0) / bounds.length;
                bounds.forEach(({ element, bounds: elementBounds }) => {
                    const elementCenterX = elementBounds.minX + elementBounds.width / 2;
                    const offsetX = centerX - elementCenterX;
                    if (offsetX !== 0) {
                        updates.push({
                            id: element.id,
                            x: element.x + offsetX,
                        });
                    }
                });
                break;
            }
            case AlignmentType.Right: {
                const rightMost = Math.max(...bounds.map((b) => b.bounds.maxX));
                bounds.forEach(({ element, bounds: elementBounds }) => {
                    const offsetX = rightMost - elementBounds.maxX;
                    if (offsetX !== 0) {
                        updates.push({
                            id: element.id,
                            x: element.x + offsetX,
                        });
                    }
                });
                break;
            }
            case AlignmentType.Top: {
                const topMost = Math.min(...bounds.map((b) => b.bounds.minY));
                bounds.forEach(({ element, bounds: elementBounds }) => {
                    const offsetY = topMost - elementBounds.minY;
                    if (offsetY !== 0) {
                        updates.push({
                            id: element.id,
                            y: element.y + offsetY,
                        });
                    }
                });
                break;
            }
            case AlignmentType.Middle: {
                const centerY = bounds.reduce((acc, b) => acc + (b.bounds.minY + b.bounds.height / 2), 0) / bounds.length;
                bounds.forEach(({ element, bounds: elementBounds }) => {
                    const elementCenterY = elementBounds.minY + elementBounds.height / 2;
                    const offsetY = centerY - elementCenterY;
                    if (offsetY !== 0) {
                        updates.push({
                            id: element.id,
                            y: element.y + offsetY,
                        });
                    }
                });
                break;
            }
            case AlignmentType.Bottom: {
                const bottomMost = Math.max(...bounds.map((b) => b.bounds.maxY));
                bounds.forEach(({ element, bounds: elementBounds }) => {
                    const offsetY = bottomMost - elementBounds.maxY;
                    if (offsetY !== 0) {
                        updates.push({
                            id: element.id,
                            y: element.y + offsetY,
                        });
                    }
                });
                break;
            }
            case AlignmentType.DistributeHorizontally: {
                if (elements.length < 3)
                    return []; // Need at least 3 elements to distribute
                // Sort elements by their left position
                const sortedByX = bounds.sort((a, b) => a.bounds.minX - b.bounds.minX);
                const leftmostX = sortedByX[0].bounds.minX;
                const rightmostX = sortedByX[sortedByX.length - 1].bounds.maxX;
                const totalWidth = rightmostX - leftmostX;
                // Calculate total width of all elements
                const elementsWidth = sortedByX.reduce((acc, b) => acc + b.bounds.width, 0);
                const availableSpaceH = totalWidth - elementsWidth;
                const spacingH = availableSpaceH / (sortedByX.length - 1);
                let currentX = leftmostX;
                sortedByX.forEach(({ element, bounds: elementBounds }, index) => {
                    if (index === 0) {
                        // Keep the leftmost element in place
                        currentX += elementBounds.width;
                    }
                    else if (index === sortedByX.length - 1) {
                        // Keep the rightmost element in place
                        return;
                    }
                    else {
                        // Position middle elements with equal spacing
                        currentX += spacingH;
                        const offsetX = currentX - elementBounds.minX;
                        if (offsetX !== 0) {
                            updates.push({
                                id: element.id,
                                x: element.x + offsetX,
                            });
                        }
                        currentX += elementBounds.width;
                    }
                });
                break;
            }
            case AlignmentType.DistributeVertically: {
                if (elements.length < 3)
                    return []; // Need at least 3 elements to distribute
                // Sort elements by their top position
                const sortedByY = bounds.sort((a, b) => a.bounds.minY - b.bounds.minY);
                const topmostY = sortedByY[0].bounds.minY;
                const bottommostY = sortedByY[sortedByY.length - 1].bounds.maxY;
                const totalHeight = bottommostY - topmostY;
                // Calculate total height of all elements
                const elementsHeight = sortedByY.reduce((acc, b) => acc + b.bounds.height, 0);
                const availableSpaceV = totalHeight - elementsHeight;
                const spacingV = availableSpaceV / (sortedByY.length - 1);
                let currentY = topmostY;
                sortedByY.forEach(({ element, bounds: elementBounds }, index) => {
                    if (index === 0) {
                        // Keep the topmost element in place
                        currentY += elementBounds.height;
                    }
                    else if (index === sortedByY.length - 1) {
                        // Keep the bottommost element in place
                        return;
                    }
                    else {
                        // Position middle elements with equal spacing
                        currentY += spacingV;
                        const offsetY = currentY - elementBounds.minY;
                        if (offsetY !== 0) {
                            updates.push({
                                id: element.id,
                                y: element.y + offsetY,
                            });
                        }
                        currentY += elementBounds.height;
                    }
                });
                break;
            }
            default:
                console.warn('Unsupported alignment type:', alignment);
                return [];
        }
        return updates;
    }
    // TRANSFORM OPERATIONS
    /**
     * Flip selected elements horizontally
     */
    flipHorizontal() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.updateElementsFn)
            return;
        const updates = selectedElements.map((element) => {
            // Toggle horizontal flip by inverting scaleX
            const currentScaleX = element.scaleX ?? 1;
            return {
                id: element.id,
                scaleX: -currentScaleX,
            };
        });
        this.updateElementsFn(updates, true);
        this.updateBoundingBox();
    }
    /**
     * Flip selected elements vertically
     */
    flipVertical() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.updateElementsFn)
            return;
        const updates = selectedElements.map((element) => {
            // Toggle vertical flip by inverting scaleY
            const currentScaleY = element.scaleY ?? 1;
            return {
                id: element.id,
                scaleY: -currentScaleY,
            };
        });
        this.updateElementsFn(updates, true);
        this.updateBoundingBox();
    }
    /**
     * Move selected elements by a given offset
     */
    moveSelectedElements(dx, dy) {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.updateElementsFn)
            return;
        const updates = selectedElements.map((element) => ({
            id: element.id,
            x: element.x + dx,
            y: element.y + dy,
        }));
        this.updateElementsFn(updates, true);
        this.updateBoundingBox();
    }
    /**
     * Rotate selected elements by a given angle (in degrees)
     */
    rotateSelectedElements(angle) {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.updateElementsFn)
            return;
        const updates = selectedElements.map((element) => ({
            id: element.id,
            rotation: (element.rotation || 0) + angle,
        }));
        this.updateElementsFn(updates, true);
        this.updateBoundingBox();
    }
    /**
     * Scale selected elements by a given factor
     */
    scaleSelectedElements(factor) {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.updateElementsFn)
            return;
        const updates = selectedElements
            .map((element) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const update = { id: element.id };
            // Scale width and height if they exist (use 'in' operator for type checking)
            if ('width' in element && element.width !== undefined) {
                update.width = element.width * factor;
            }
            if ('height' in element && element.height !== undefined) {
                update.height = element.height * factor;
            }
            // Scale stroke width if it exists
            if (element.style?.strokeWidth !== undefined) {
                update.style = {
                    ...element.style,
                    strokeWidth: element.style.strokeWidth * factor,
                };
            }
            // For rectangles and ellipses, also scale radii if they exist
            if ('rx' in element && element.rx !== undefined) {
                update.rx = element.rx * factor;
            }
            if ('ry' in element && element.ry !== undefined) {
                update.ry = element.ry * factor;
            }
            return update;
        })
            .filter((update) => Object.keys(update).length > 1); // Only include updates with more than just id
        if (updates.length > 0) {
            this.updateElementsFn(updates, true);
            this.updateBoundingBox();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SelectionService, deps: [{ token: i1.EventBusService }, { token: i2.ClipboardService }, { token: i3.ElementsService }, { token: i4.ToolsService }, { token: i5.CanvasService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SelectionService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SelectionService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.EventBusService }, { type: i2.ClipboardService }, { type: i3.ElementsService }, { type: i4.ToolsService }, { type: i5.CanvasService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy13aGl0ZWJvYXJkL3NyYy9saWIvY29yZS9lbGVtZW50cy9zZWxlY3Rpb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDckUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUMvQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxhQUFhLEVBQTZCLFFBQVEsRUFBcUIsTUFBTSxVQUFVLENBQUM7QUFDakcsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNoRCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7Ozs7Ozs7QUFHckQsTUFBTSxPQUFPLGdCQUFnQjtJQXVCakI7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQTFCTyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7SUFFdkMsa0JBQWtCO0lBQ0Qsd0JBQXdCLEdBQUcsTUFBTSxDQUFjLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMxRCxrQkFBa0IsR0FBRyxNQUFNLENBQWU7UUFDekQsQ0FBQyxFQUFFLENBQUM7UUFDSixDQUFDLEVBQUUsQ0FBQztRQUNKLEtBQUssRUFBRSxDQUFDO1FBQ1IsTUFBTSxFQUFFLENBQUM7UUFD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RCxNQUFNLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDO1lBQ2xDLENBQUM7WUFDRCxJQUFJLElBQUksSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLEVBQUUsS0FBSyxTQUFTLEVBQUUsQ0FBQztnQkFDaEQsTUFBTSxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQztZQUNsQyxDQUFDO1lBRUQsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQyxDQUFDO2FBQ0QsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLDhDQUE4QztRQUVyRyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUMzQixDQUFDO0lBQ0gsQ0FBQzt3R0FocUNVLGdCQUFnQjs0R0FBaEIsZ0JBQWdCLGNBREgsTUFBTTs7NEZBQ25CLGdCQUFnQjtrQkFENUIsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb21wdXRlZCwgSW5qZWN0YWJsZSwgc2lnbmFsLCBTaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRXZlbnRCdXNTZXJ2aWNlIH0gZnJvbSAnLi4vZXZlbnQtYnVzJztcclxuaW1wb3J0IHsgQ2FudmFzU2VydmljZSB9IGZyb20gJy4uL2NhbnZhcy9jYW52YXMuc2VydmljZSc7XHJcbmltcG9ydCB7IENsaXBib2FyZFNlcnZpY2UgfSBmcm9tICcuLi9pbnB1dC9jbGlwYm9hcmQuc2VydmljZSc7XHJcbmltcG9ydCB7IFRvb2xzU2VydmljZSB9IGZyb20gJy4uL3Rvb2xzL3Rvb2xzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBbGlnbm1lbnRUeXBlLCBCb3VuZGluZ0JveCwgU2VsZWN0aW9uQm94LCBUb29sVHlwZSwgV2hpdGVib2FyZEVsZW1lbnQgfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCB7IFdoaXRlYm9hcmRFdmVudCB9IGZyb20gJy4uL3R5cGVzL2V2ZW50cyc7XHJcbmltcG9ydCB7IGdldEVsZW1lbnRCb3VuZHMgfSBmcm9tICcuLi91dGlscy9kb20nO1xyXG5pbXBvcnQgeyBnZXRDb21iaW5lZFNjcmVlbkJvdW5kcyB9IGZyb20gJy4uL3V0aWxzL2dlb21ldHJ5L3RyYW5zZm9ybS11dGlscyc7XHJcbmltcG9ydCB7IEVsZW1lbnRzU2VydmljZSB9IGZyb20gJy4vZWxlbWVudHMuc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2VsZWN0aW9uU2VydmljZSB7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBPRkZTRVRfSU5DUkVNRU5UID0gMjA7XHJcblxyXG4gIC8vIFNlbGVjdGlvbiBzdGF0ZVxyXG4gIHByaXZhdGUgcmVhZG9ubHkgc2VsZWN0ZWRFbGVtZW50SWRzU2lnbmFsID0gc2lnbmFsPFNldDxzdHJpbmc+PihuZXcgU2V0KCkpO1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgc2VsZWN0aW9uQm94U2lnbmFsID0gc2lnbmFsPFNlbGVjdGlvbkJveD4oe1xyXG4gICAgeDogMCxcclxuICAgIHk6IDAsXHJcbiAgICB3aWR0aDogMCxcclxuICAgIGhlaWdodDogMCxcclxuICAgIHZpc2libGU6IGZhbHNlLFxyXG4gIH0pO1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgYm91bmRpbmdCb3hTaWduYWwgPSBzaWduYWw8Qm91bmRpbmdCb3ggfCBudWxsPihudWxsKTtcclxuXHJcbiAgLy8gRGVyaXZlZCBzaWduYWxzXHJcbiAgcmVhZG9ubHkgc2VsZWN0ZWRJZHNTaWduYWwgPSBjb21wdXRlZCgoKSA9PiBBcnJheS5mcm9tKHRoaXMuc2VsZWN0ZWRFbGVtZW50SWRzU2lnbmFsKCkpKTtcclxuICByZWFkb25seSBoYXNTZWxlY3Rpb25TaWduYWwgPSBjb21wdXRlZCgoKSA9PiB0aGlzLnNlbGVjdGVkRWxlbWVudElkc1NpZ25hbCgpLnNpemUgPiAwKTtcclxuXHJcbiAgcHJpdmF0ZSBnZXRFbGVtZW50c0ZuPzogKCkgPT4gV2hpdGVib2FyZEVsZW1lbnRbXTtcclxuICBwcml2YXRlIHVwZGF0ZUVsZW1lbnRzRm4/OiAoZWxlbWVudHM6IChQYXJ0aWFsPFdoaXRlYm9hcmRFbGVtZW50PiAmIHsgaWQ6IHN0cmluZyB9KVtdLCBoaXN0b3J5PzogYm9vbGVhbikgPT4gdm9pZDtcclxuICBwcml2YXRlIHJlbW92ZUVsZW1lbnRzRm4/OiAoZWxlbWVudHM6IFdoaXRlYm9hcmRFbGVtZW50W10sIGhpc3Rvcnk/OiBib29sZWFuKSA9PiB2b2lkO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgZXZlbnRCdXM6IEV2ZW50QnVzU2VydmljZSxcclxuICAgIHByaXZhdGUgY2xpcGJvYXJkU2VydmljZTogQ2xpcGJvYXJkU2VydmljZSxcclxuICAgIHByaXZhdGUgZWxlbWVudHNTZXJ2aWNlOiBFbGVtZW50c1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIHRvb2xzU2VydmljZTogVG9vbHNTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBjYW52YXNTZXJ2aWNlOiBDYW52YXNTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgICB0aGlzLmluaXRpYWxpemVEYXRhUHJvdmlkZXJzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXRpYWxpemVEYXRhUHJvdmlkZXJzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5nZXRFbGVtZW50c0ZuID0gKCkgPT4gdGhpcy5lbGVtZW50c1NlcnZpY2UuZ2V0RWxlbWVudHMoKTtcclxuICAgIHRoaXMudXBkYXRlRWxlbWVudHNGbiA9ICh1cGRhdGVzKSA9PiB0aGlzLmVsZW1lbnRzU2VydmljZS51cGRhdGVFbGVtZW50cyh1cGRhdGVzKTtcclxuICAgIHRoaXMucmVtb3ZlRWxlbWVudHNGbiA9IChlbGVtZW50cywgaGlzdG9yeSkgPT4gdGhpcy5lbGVtZW50c1NlcnZpY2UucmVtb3ZlRWxlbWVudHMoZWxlbWVudHMsIGhpc3RvcnkpO1xyXG4gIH1cclxuXHJcbiAgY3V0RWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnRzID0gdGhpcy5nZXRTZWxlY3RlZEVsZW1lbnRzKCk7XHJcbiAgICBpZiAoc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcbiAgICB0aGlzLmNsaXBib2FyZFNlcnZpY2UuY3V0KHNlbGVjdGVkRWxlbWVudHMpO1xyXG4gICAgdGhpcy5kZWxldGVTZWxlY3RlZEVsZW1lbnRzKCk7XHJcbiAgfVxyXG5cclxuICBjb3B5RWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnRzID0gdGhpcy5nZXRTZWxlY3RlZEVsZW1lbnRzKCk7XHJcbiAgICBpZiAoc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcbiAgICB0aGlzLmNsaXBib2FyZFNlcnZpY2UuY29weShzZWxlY3RlZEVsZW1lbnRzKTtcclxuICB9XHJcblxyXG4gIHBhc3RlRWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBwYXN0ZWRFbGVtZW50cyA9IHRoaXMuY2xpcGJvYXJkU2VydmljZS5wYXN0ZSgpO1xyXG4gICAgaWYgKHBhc3RlZEVsZW1lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy5zZWxlY3RFbGVtZW50cyhwYXN0ZWRFbGVtZW50cyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkdXBsaWNhdGVFbGVtZW50cygpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkRWxlbWVudHMgPSB0aGlzLmdldFNlbGVjdGVkRWxlbWVudHMoKTtcclxuICAgIGlmIChzZWxlY3RlZEVsZW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGR1cGxpY2F0ZWRFbGVtZW50cyA9IHRoaXMuY2xpcGJvYXJkU2VydmljZS5kdXBsaWNhdGVFbGVtZW50cyhzZWxlY3RlZEVsZW1lbnRzKTtcclxuICAgIGlmIChkdXBsaWNhdGVkRWxlbWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLnNlbGVjdEVsZW1lbnRzKGR1cGxpY2F0ZWRFbGVtZW50cyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkZWxldGVTZWxlY3RlZEVsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRFbGVtZW50cyA9IHRoaXMuZ2V0U2VsZWN0ZWRFbGVtZW50cygpO1xyXG4gICAgaWYgKHNlbGVjdGVkRWxlbWVudHMubGVuZ3RoID09PSAwIHx8ICF0aGlzLnJlbW92ZUVsZW1lbnRzRm4pIHJldHVybjtcclxuXHJcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnRzRm4oc2VsZWN0ZWRFbGVtZW50cywgdHJ1ZSk7XHJcbiAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcblxyXG4gICAgLy8gRW1pdCBncmFudWxhciBldmVudCBmb3IgZWxlbWVudHMgcmVtb3ZhbFxyXG4gICAgdGhpcy5ldmVudEJ1cy5lbWl0KFdoaXRlYm9hcmRFdmVudC5FbGVtZW50c1JlbW92ZWQsIHNlbGVjdGVkRWxlbWVudHMpO1xyXG4gICAgLy8gRW1pdCBkYXRhIGNoYW5nZSBldmVudFxyXG4gICAgdGhpcy5ldmVudEJ1cy5lbWl0KFdoaXRlYm9hcmRFdmVudC5EYXRhQ2hhbmdlLCB0aGlzLmVsZW1lbnRzU2VydmljZS5nZXRFbGVtZW50cygpKTtcclxuICB9XHJcblxyXG4gIGdldFNlbGVjdGVkSWRzKCk6IHN0cmluZ1tdIHtcclxuICAgIHJldHVybiB0aGlzLnNlbGVjdGVkSWRzU2lnbmFsKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgY3VycmVudGx5IHNlbGVjdGVkIGVsZW1lbnRzXHJcbiAgICovXHJcbiAgZ2V0U2VsZWN0ZWRFbGVtZW50cygpOiBXaGl0ZWJvYXJkRWxlbWVudFtdIHtcclxuICAgIGlmICghdGhpcy5nZXRFbGVtZW50c0ZuKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignRWxlbWVudCBkYXRhIHByb3ZpZGVyIG5vdCBzZXQnKTtcclxuICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGlkcyA9IHRoaXMuZ2V0U2VsZWN0ZWRJZHMoKTtcclxuICAgIHJldHVybiB0aGlzLmdldEVsZW1lbnRzRm4oKS5maWx0ZXIoKGVsKSA9PiBpZHMuaW5jbHVkZXMoZWwuaWQpKTtcclxuICB9XHJcblxyXG4gIGdldFNlbGVjdGVkRWxlbWVudHNTaWduYWwoKTogU2lnbmFsPFdoaXRlYm9hcmRFbGVtZW50W10+IHtcclxuICAgIHJldHVybiBjb21wdXRlZCgoKSA9PiB0aGlzLmdldFNlbGVjdGVkRWxlbWVudHMoKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBlbGVtZW50IGlzIHNlbGVjdGVkXHJcbiAgICovXHJcbiAgaXNTZWxlY3RlZChlbGVtZW50T3JJZDogV2hpdGVib2FyZEVsZW1lbnQgfCBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IGlkID0gdHlwZW9mIGVsZW1lbnRPcklkID09PSAnc3RyaW5nJyA/IGVsZW1lbnRPcklkIDogZWxlbWVudE9ySWQuaWQ7XHJcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRJZHNTaWduYWwoKS5oYXMoaWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHNlbGVjdGlvbiBjb3VudFxyXG4gICAqL1xyXG4gIGdldFNlbGVjdGlvbkNvdW50KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRJZHNTaWduYWwoKS5zaXplO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgaWYgYW55IGVsZW1lbnRzIGFyZSBzZWxlY3RlZFxyXG4gICAqL1xyXG4gIGhhc1NlbGVjdGlvbigpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmdldFNlbGVjdGlvbkNvdW50KCkgPiAwO1xyXG4gIH1cclxuXHJcbiAgLy8gU0VMRUNUSU9OIE9QRVJBVElPTlNcclxuXHJcbiAgLyoqXHJcbiAgICogU2VsZWN0IGVsZW1lbnRzIGJ5IHJlZmVyZW5jZSBvciBJRCwgd2l0aCBvcHRpb24gdG8gYXBwZW5kIHRvIGV4aXN0aW5nIHNlbGVjdGlvblxyXG4gICAqL1xyXG4gIHNlbGVjdEVsZW1lbnRzKGVsZW1lbnRzT3JJZHM6IFdoaXRlYm9hcmRFbGVtZW50IHwgV2hpdGVib2FyZEVsZW1lbnRbXSB8IHN0cmluZyB8IHN0cmluZ1tdLCBhcHBlbmQgPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5jb21pbmcgPSBBcnJheS5pc0FycmF5KGVsZW1lbnRzT3JJZHMpID8gZWxlbWVudHNPcklkcyA6IFtlbGVtZW50c09ySWRzXTtcclxuICAgIGNvbnN0IHNlbGVjdGVkSWRzID0gaW5jb21pbmcubWFwKChlbCkgPT4gKHR5cGVvZiBlbCA9PT0gJ3N0cmluZycgPyBlbCA6IGVsLmlkKSk7XHJcblxyXG4gICAgLy8gRXhwYW5kIHNlbGVjdGlvbiB0byBpbmNsdWRlIGFsbCBncm91cGVkIGVsZW1lbnRzXHJcbiAgICBjb25zdCBleHBhbmRlZElkcyA9IHRoaXMuZXhwYW5kU2VsZWN0aW9uVG9JbmNsdWRlR3JvdXBzKHNlbGVjdGVkSWRzKTtcclxuXHJcbiAgICBjb25zdCBjdXJyZW50U2VsZWN0aW9uID0gQXJyYXkuZnJvbSh0aGlzLnNlbGVjdGVkRWxlbWVudElkc1NpZ25hbCgpKTtcclxuICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IGFwcGVuZCA/IFsuLi5uZXcgU2V0KFsuLi5jdXJyZW50U2VsZWN0aW9uLCAuLi5leHBhbmRlZElkc10pXSA6IGV4cGFuZGVkSWRzO1xyXG5cclxuICAgIHRoaXMuc2VsZWN0ZWRFbGVtZW50SWRzU2lnbmFsLnNldChuZXcgU2V0KG5ld1NlbGVjdGlvbikpO1xyXG5cclxuICAgIGlmIChuZXdTZWxlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLnRvb2xzU2VydmljZS5zZXRBY3RpdmVUb29sKFRvb2xUeXBlLlNlbGVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gR2V0IHRoZSB1cGRhdGVkIHNlbGVjdGlvbiBlbGVtZW50cyBhZnRlciBncm91cCBleHBhbnNpb25cclxuICAgIGNvbnN0IGZ1bGxTZWxlY3Rpb25FbGVtZW50cyA9IHRoaXMuZ2V0U2VsZWN0ZWRFbGVtZW50cygpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlQm91bmRpbmdCb3hGcm9tRWxlbWVudHMoZnVsbFNlbGVjdGlvbkVsZW1lbnRzKTtcclxuICAgIHRoaXMuZXZlbnRCdXMuZW1pdChXaGl0ZWJvYXJkRXZlbnQuRWxlbWVudHNTZWxlY3RlZCwgZnVsbFNlbGVjdGlvbkVsZW1lbnRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlc2VsZWN0IHNwZWNpZmljIGVsZW1lbnRcclxuICAgKi9cclxuICBkZXNlbGVjdEVsZW1lbnQoZWxlbWVudE9ySWQ6IFdoaXRlYm9hcmRFbGVtZW50IHwgc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCBpZCA9IHR5cGVvZiBlbGVtZW50T3JJZCA9PT0gJ3N0cmluZycgPyBlbGVtZW50T3JJZCA6IGVsZW1lbnRPcklkLmlkO1xyXG4gICAgY29uc3QgY3VycmVudCA9IG5ldyBTZXQodGhpcy5zZWxlY3RlZEVsZW1lbnRJZHNTaWduYWwoKSk7XHJcblxyXG4gICAgaWYgKGN1cnJlbnQuaGFzKGlkKSkge1xyXG4gICAgICAvLyBFeHBhbmQgZGVzZWxlY3Rpb24gdG8gaW5jbHVkZSBhbGwgZ3JvdXBlZCBlbGVtZW50c1xyXG4gICAgICBjb25zdCBleHBhbmRlZElkcyA9IHRoaXMuZXhwYW5kU2VsZWN0aW9uVG9JbmNsdWRlR3JvdXBzKFtpZF0pO1xyXG5cclxuICAgICAgZXhwYW5kZWRJZHMuZm9yRWFjaCgoZXhwYW5kZWRJZCkgPT4ge1xyXG4gICAgICAgIGN1cnJlbnQuZGVsZXRlKGV4cGFuZGVkSWQpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRFbGVtZW50SWRzU2lnbmFsLnNldChjdXJyZW50KTtcclxuICAgICAgdGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1xyXG5cclxuICAgICAgY29uc3Qgc2VsZWN0ZWRFbGVtZW50cyA9IHRoaXMuZ2V0U2VsZWN0ZWRFbGVtZW50cygpO1xyXG4gICAgICB0aGlzLmV2ZW50QnVzLmVtaXQoV2hpdGVib2FyZEV2ZW50LkVsZW1lbnRzU2VsZWN0ZWQsIHNlbGVjdGVkRWxlbWVudHMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVG9nZ2xlIHNlbGVjdGlvbiBvZiBlbGVtZW50XHJcbiAgICovXHJcbiAgdG9nZ2xlU2VsZWN0aW9uKGVsZW1lbnRPcklkOiBXaGl0ZWJvYXJkRWxlbWVudCB8IHN0cmluZyk6IHZvaWQge1xyXG4gICAgY29uc3QgaWQgPSB0eXBlb2YgZWxlbWVudE9ySWQgPT09ICdzdHJpbmcnID8gZWxlbWVudE9ySWQgOiBlbGVtZW50T3JJZC5pZDtcclxuICAgIGNvbnN0IGN1cnJlbnQgPSBuZXcgU2V0KHRoaXMuc2VsZWN0ZWRFbGVtZW50SWRzU2lnbmFsKCkpO1xyXG4gICAgY29uc3Qgd2FzU2VsZWN0ZWQgPSBjdXJyZW50LmhhcyhpZCk7XHJcblxyXG4gICAgLy8gRXhwYW5kIHRvIGluY2x1ZGUgYWxsIGdyb3VwZWQgZWxlbWVudHNcclxuICAgIGNvbnN0IGV4cGFuZGVkSWRzID0gdGhpcy5leHBhbmRTZWxlY3Rpb25Ub0luY2x1ZGVHcm91cHMoW2lkXSk7XHJcblxyXG4gICAgaWYgKHdhc1NlbGVjdGVkKSB7XHJcbiAgICAgIC8vIERlc2VsZWN0IGFsbCBlbGVtZW50cyBpbiB0aGUgZ3JvdXBcclxuICAgICAgZXhwYW5kZWRJZHMuZm9yRWFjaCgoZXhwYW5kZWRJZCkgPT4ge1xyXG4gICAgICAgIGN1cnJlbnQuZGVsZXRlKGV4cGFuZGVkSWQpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIFNlbGVjdCBhbGwgZWxlbWVudHMgaW4gdGhlIGdyb3VwXHJcbiAgICAgIGV4cGFuZGVkSWRzLmZvckVhY2goKGV4cGFuZGVkSWQpID0+IHtcclxuICAgICAgICBjdXJyZW50LmFkZChleHBhbmRlZElkKTtcclxuICAgICAgfSk7XHJcbiAgICAgIC8vIEF1dG9tYXRpY2FsbHkgYWN0aXZhdGUgc2VsZWN0IHRvb2wgd2hlbiBhbiBlbGVtZW50IGdldHMgc2VsZWN0ZWRcclxuICAgICAgdGhpcy50b29sc1NlcnZpY2Uuc2V0QWN0aXZlVG9vbChUb29sVHlwZS5TZWxlY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2VsZWN0ZWRFbGVtZW50SWRzU2lnbmFsLnNldChjdXJyZW50KTtcclxuICAgIHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcclxuXHJcbiAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnRzID0gdGhpcy5nZXRTZWxlY3RlZEVsZW1lbnRzKCk7XHJcbiAgICB0aGlzLmV2ZW50QnVzLmVtaXQoV2hpdGVib2FyZEV2ZW50LkVsZW1lbnRzU2VsZWN0ZWQsIHNlbGVjdGVkRWxlbWVudHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2xlYXIgYWxsIHNlbGVjdGlvblxyXG4gICAqL1xyXG4gIGNsZWFyU2VsZWN0aW9uKCk6IHZvaWQge1xyXG4gICAgdGhpcy5zZWxlY3RlZEVsZW1lbnRJZHNTaWduYWwuc2V0KG5ldyBTZXQoKSk7XHJcbiAgICB0aGlzLmNsZWFyQm91bmRpbmdCb3goKTtcclxuICAgIHRoaXMuZXZlbnRCdXMuZW1pdChXaGl0ZWJvYXJkRXZlbnQuRWxlbWVudHNTZWxlY3RlZCwgW10pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2VsZWN0IGFsbCBlbGVtZW50c1xyXG4gICAqL1xyXG4gIHNlbGVjdEFsbCgpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5nZXRFbGVtZW50c0ZuKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignRWxlbWVudCBkYXRhIHByb3ZpZGVyIG5vdCBzZXQnKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFsbEVsZW1lbnRzID0gdGhpcy5nZXRFbGVtZW50c0ZuKCk7XHJcbiAgICBjb25zdCBpZHMgPSBuZXcgU2V0KGFsbEVsZW1lbnRzLm1hcCgoZWwpID0+IGVsLmlkKSk7XHJcbiAgICB0aGlzLnNlbGVjdGVkRWxlbWVudElkc1NpZ25hbC5zZXQoaWRzKTtcclxuXHJcbiAgICAvLyBBdXRvbWF0aWNhbGx5IGFjdGl2YXRlIHNlbGVjdCB0b29sIHdoZW4gZWxlbWVudHMgYXJlIHNlbGVjdGVkXHJcbiAgICBpZiAoYWxsRWxlbWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLnRvb2xzU2VydmljZS5zZXRBY3RpdmVUb29sKFRvb2xUeXBlLlNlbGVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1xyXG5cclxuICAgIHRoaXMuZXZlbnRCdXMuZW1pdChXaGl0ZWJvYXJkRXZlbnQuRWxlbWVudHNTZWxlY3RlZCwgYWxsRWxlbWVudHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2VsZWN0IGVsZW1lbnRzIHdpdGhpbiBhIHJlY3Rhbmd1bGFyIGFyZWFcclxuICAgKi9cclxuICBzZWxlY3RFbGVtZW50c0luQXJlYShhcmVhOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9KTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuZ2V0RWxlbWVudHNGbikge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ0VsZW1lbnQgZGF0YSBwcm92aWRlciBub3Qgc2V0Jyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhbGxFbGVtZW50cyA9IHRoaXMuZ2V0RWxlbWVudHNGbigpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRJZHM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgYWxsRWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICBjb25zdCBib3VuZHMgPSBnZXRFbGVtZW50Qm91bmRzKGVsZW1lbnQpO1xyXG5cclxuICAgICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBpbnRlcnNlY3RzIHdpdGggc2VsZWN0aW9uIGFyZWFcclxuICAgICAgY29uc3QgaW50ZXJzZWN0cyA9ICEoXHJcbiAgICAgICAgYm91bmRzLm1heFggPCBhcmVhLnggfHxcclxuICAgICAgICBib3VuZHMubWluWCA+IGFyZWEueCArIGFyZWEud2lkdGggfHxcclxuICAgICAgICBib3VuZHMubWF4WSA8IGFyZWEueSB8fFxyXG4gICAgICAgIGJvdW5kcy5taW5ZID4gYXJlYS55ICsgYXJlYS5oZWlnaHRcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGlmIChpbnRlcnNlY3RzKSB7XHJcbiAgICAgICAgc2VsZWN0ZWRJZHMucHVzaChlbGVtZW50LmlkKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHNlbGVjdGVkSWRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgLy8gRXhwYW5kIHRvIGluY2x1ZGUgZ3JvdXBlZCBlbGVtZW50cyAtIHRoaXMgd2lsbCBiZSBoYW5kbGVkIGJ5IHNlbGVjdEVsZW1lbnRzXHJcbiAgICAgIHRoaXMuc2VsZWN0RWxlbWVudHMoc2VsZWN0ZWRJZHMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gU0VMRUNUSU9OIEJPWCAoZHJhZyBzZWxlY3Rpb24gcmVjdGFuZ2xlKVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgc2VsZWN0aW9uIGJveCBzdGF0ZVxyXG4gICAqL1xyXG4gIHNldFNlbGVjdGlvbkJveChib3g6IFNlbGVjdGlvbkJveCk6IHZvaWQge1xyXG4gICAgdGhpcy5zZWxlY3Rpb25Cb3hTaWduYWwuc2V0KGJveCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgY3VycmVudCBzZWxlY3Rpb24gYm94XHJcbiAgICovXHJcbiAgZ2V0U2VsZWN0aW9uQm94KCk6IFNlbGVjdGlvbkJveCB7XHJcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25Cb3hTaWduYWwoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBzZWxlY3Rpb24gYm94IHNpZ25hbFxyXG4gICAqL1xyXG4gIGdldFNlbGVjdGlvbkJveFNpZ25hbCgpOiBTaWduYWw8U2VsZWN0aW9uQm94PiB7XHJcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25Cb3hTaWduYWwuYXNSZWFkb25seSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2xlYXIgc2VsZWN0aW9uIGJveFxyXG4gICAqL1xyXG4gIGNsZWFyU2VsZWN0aW9uQm94KCk6IHZvaWQge1xyXG4gICAgdGhpcy5zZWxlY3Rpb25Cb3hTaWduYWwuc2V0KHtcclxuICAgICAgeDogMCxcclxuICAgICAgeTogMCxcclxuICAgICAgd2lkdGg6IDAsXHJcbiAgICAgIGhlaWdodDogMCxcclxuICAgICAgdmlzaWJsZTogZmFsc2UsXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIEJPVU5ESU5HIEJPWCAodHJhbnNmb3JtIGhhbmRsZXMgYXJvdW5kIHNlbGVjdGlvbilcclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIGJvdW5kaW5nIGJveCBiYXNlZCBvbiBjdXJyZW50IHNlbGVjdGlvblxyXG4gICAqL1xyXG4gIHVwZGF0ZUJvdW5kaW5nQm94KCk6IHZvaWQge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRFbGVtZW50cyA9IHRoaXMuZ2V0U2VsZWN0ZWRFbGVtZW50cygpO1xyXG4gICAgdGhpcy51cGRhdGVCb3VuZGluZ0JveEZyb21FbGVtZW50cyhzZWxlY3RlZEVsZW1lbnRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBjdXJyZW50IGJvdW5kaW5nIGJveFxyXG4gICAqL1xyXG4gIGdldEJvdW5kaW5nQm94KCk6IEJvdW5kaW5nQm94IHwgbnVsbCB7XHJcbiAgICByZXR1cm4gdGhpcy5ib3VuZGluZ0JveFNpZ25hbCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGJvdW5kaW5nIGJveCBzaWduYWxcclxuICAgKi9cclxuICBnZXRCb3VuZGluZ0JveFNpZ25hbCgpOiBTaWduYWw8Qm91bmRpbmdCb3ggfCBudWxsPiB7XHJcbiAgICByZXR1cm4gdGhpcy5ib3VuZGluZ0JveFNpZ25hbC5hc1JlYWRvbmx5KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDbGVhciBib3VuZGluZyBib3hcclxuICAgKi9cclxuICBjbGVhckJvdW5kaW5nQm94KCk6IHZvaWQge1xyXG4gICAgdGhpcy5ib3VuZGluZ0JveFNpZ25hbC5zZXQobnVsbCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgYm91bmRpbmcgYm94IGRpcmVjdGx5ICh1c2VmdWwgZm9yIGR5bmFtaWMgdXBkYXRlcyBkdXJpbmcgcm90YXRpb24pXHJcbiAgICovXHJcbiAgc2V0Qm91bmRpbmdCb3goYmJveDogQm91bmRpbmdCb3ggfCBudWxsKTogdm9pZCB7XHJcbiAgICB0aGlzLmJvdW5kaW5nQm94U2lnbmFsLnNldChiYm94KTtcclxuICB9XHJcblxyXG4gIC8vIElOVEVSTkFMIEhFTFBFUlNcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGFsbCBlbGVtZW50cyB0aGF0IGJlbG9uZyB0byB0aGUgc2FtZSBncm91cHMgYXMgdGhlIHByb3ZpZGVkIGVsZW1lbnRzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBleHBhbmRTZWxlY3Rpb25Ub0luY2x1ZGVHcm91cHMoZWxlbWVudElkczogc3RyaW5nW10pOiBzdHJpbmdbXSB7XHJcbiAgICBpZiAoIXRoaXMuZ2V0RWxlbWVudHNGbikgcmV0dXJuIGVsZW1lbnRJZHM7XHJcblxyXG4gICAgY29uc3QgYWxsRWxlbWVudHMgPSB0aGlzLmdldEVsZW1lbnRzRm4oKTtcclxuICAgIGNvbnN0IGVsZW1lbnRzVG9FeHBhbmQgPSBhbGxFbGVtZW50cy5maWx0ZXIoKGVsKSA9PiBlbGVtZW50SWRzLmluY2x1ZGVzKGVsLmlkKSk7XHJcbiAgICBjb25zdCBncm91cElkcyA9IG5ldyBTZXQoXHJcbiAgICAgIGVsZW1lbnRzVG9FeHBhbmRcclxuICAgICAgICAubWFwKChlbCkgPT4gZWwuZ3JvdXBJZClcclxuICAgICAgICAuZmlsdGVyKChncm91cElkKTogZ3JvdXBJZCBpcyBzdHJpbmcgPT4gZ3JvdXBJZCAhPT0gdW5kZWZpbmVkICYmIGdyb3VwSWQgIT09IG51bGwpXHJcbiAgICApO1xyXG5cclxuICAgIGlmIChncm91cElkcy5zaXplID09PSAwKSB7XHJcbiAgICAgIHJldHVybiBlbGVtZW50SWRzOyAvLyBObyBncm91cHMsIHJldHVybiBvcmlnaW5hbCBzZWxlY3Rpb25cclxuICAgIH1cclxuXHJcbiAgICAvLyBGaW5kIGFsbCBlbGVtZW50cyB0aGF0IGJlbG9uZyB0byBhbnkgb2YgdGhlc2UgZ3JvdXBzXHJcbiAgICBjb25zdCBleHBhbmRlZEVsZW1lbnRzID0gYWxsRWxlbWVudHMuZmlsdGVyKChlbCkgPT4ge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIGVsZW1lbnRJZHMuaW5jbHVkZXMoZWwuaWQpIHx8IC8vIE9yaWdpbmFsIHNlbGVjdGlvblxyXG4gICAgICAgIChlbC5ncm91cElkICYmIGdyb3VwSWRzLmhhcyhlbC5ncm91cElkKSkgLy8gRWxlbWVudHMgaW4gdGhlIHNhbWUgZ3JvdXBzXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZXhwYW5kZWRFbGVtZW50cy5tYXAoKGVsKSA9PiBlbC5pZCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNhbGN1bGF0ZUJvdW5kaW5nQm94KGVsZW1lbnRzOiBXaGl0ZWJvYXJkRWxlbWVudFtdKTogQm91bmRpbmdCb3gge1xyXG4gICAgbGV0IGJvdW5kcztcclxuICAgIGxldCByb3RhdGlvbiA9IDA7XHJcblxyXG4gICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAvLyBGb3Igc2luZ2xlIGVsZW1lbnQsIHRoZSBib3VuZGluZyBib3ggc2hvdWxkIG1hdGNoIHRoZSBlbGVtZW50J3Mgbm9uLXJvdGF0ZWQgYm91bmRzXHJcbiAgICAgIC8vIFRoZSBib3VuZGluZyBib3ggd2lsbCByb3RhdGUgd2l0aCB0aGUgZWxlbWVudCB2aWEgU1ZHIHRyYW5zZm9ybVxyXG4gICAgICBjb25zdCBlbGVtZW50ID0gZWxlbWVudHNbMF07XHJcbiAgICAgIHJvdGF0aW9uID0gZWxlbWVudC5yb3RhdGlvbiB8fCAwO1xyXG5cclxuICAgICAgLy8gR2V0IGJvdW5kcyBpbiBsb2NhbCBzcGFjZSAocmVsYXRpdmUgdG8gZWxlbWVudCBvcmlnaW4pXHJcbiAgICAgIC8vIEZvciByZWN0YW5nbGVzLCB0aGlzIHJldHVybnMge21pblg6IGVsZW1lbnQueCwgbWluWTogZWxlbWVudC55LCB3aWR0aCwgaGVpZ2h0fVxyXG4gICAgICBib3VuZHMgPSBnZXRFbGVtZW50Qm91bmRzKGVsZW1lbnQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gRm9yIG11bHRpcGxlIGVsZW1lbnRzLCB1c2Ugc2NyZWVuLXNwYWNlIGJvdW5kcyB0aGF0IGFjY291bnQgZm9yIHJvdGF0aW9uXHJcbiAgICAgIGNvbnN0IGNvbWJpbmVkQm91bmRzID0gZ2V0Q29tYmluZWRTY3JlZW5Cb3VuZHMoZWxlbWVudHMpO1xyXG4gICAgICBpZiAoIWNvbWJpbmVkQm91bmRzKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FsY3VsYXRlIGJvdW5kaW5nIGJveCBmb3IgZW1wdHkgZWxlbWVudCBsaXN0Jyk7XHJcbiAgICAgIH1cclxuICAgICAgYm91bmRzID0gY29tYmluZWRCb3VuZHM7XHJcbiAgICAgIHJvdGF0aW9uID0gMDsgLy8gTm8gcm90YXRpb24gZm9yIG11bHRpLXNlbGVjdGlvblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgbWluWCwgbWluWSwgbWF4WCwgbWF4WSwgd2lkdGgsIGhlaWdodCB9ID0gYm91bmRzO1xyXG4gICAgY29uc3QgY2VudGVyWCA9IG1pblggKyB3aWR0aCAvIDI7XHJcbiAgICBjb25zdCBoYW5kbGVPZmZzZXQgPSAyMDtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiBtaW5YLFxyXG4gICAgICB5OiBtaW5ZLFxyXG4gICAgICB3aWR0aCxcclxuICAgICAgaGVpZ2h0LFxyXG4gICAgICBoYW5kbGVzOiB7XHJcbiAgICAgICAgdG9wTGVmdDogeyB4OiBtaW5YLCB5OiBtaW5ZIH0sXHJcbiAgICAgICAgdG9wUmlnaHQ6IHsgeDogbWF4WCwgeTogbWluWSB9LFxyXG4gICAgICAgIGJvdHRvbUxlZnQ6IHsgeDogbWluWCwgeTogbWF4WSB9LFxyXG4gICAgICAgIGJvdHRvbVJpZ2h0OiB7IHg6IG1heFgsIHk6IG1heFkgfSxcclxuICAgICAgICByb3RhdGVIYW5kbGU6IHsgeDogY2VudGVyWCwgeTogbWluWSAtIGhhbmRsZU9mZnNldCB9LFxyXG4gICAgICB9LFxyXG4gICAgICByb3RhdGlvbixcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZUJvdW5kaW5nQm94RnJvbUVsZW1lbnRzKGVsZW1lbnRzOiBXaGl0ZWJvYXJkRWxlbWVudFtdKTogdm9pZCB7XHJcbiAgICBpZiAoIWVsZW1lbnRzIHx8IGVsZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB0aGlzLmNsZWFyQm91bmRpbmdCb3goKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5ib3VuZGluZ0JveFNpZ25hbC5zZXQodGhpcy5jYWxjdWxhdGVCb3VuZGluZ0JveChlbGVtZW50cykpO1xyXG4gIH1cclxuXHJcbiAgLy8gU0VMRUNUSU9OIFRSQU5TRk9STUFUSU9OIEhFTFBFUlNcclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIGFsbCBzZWxlY3RlZCBlbGVtZW50cyB3aXRoIHBhcnRpYWwgZGF0YVxyXG4gICAqL1xyXG4gIHVwZGF0ZVNlbGVjdGVkRWxlbWVudHMoXHJcbiAgICBwYXJ0aWFsOiBQYXJ0aWFsPFdoaXRlYm9hcmRFbGVtZW50PixcclxuICAgIHVwZGF0ZUVsZW1lbnRzRm4/OiAoZWxlbWVudHM6IChQYXJ0aWFsPFdoaXRlYm9hcmRFbGVtZW50PiAmIHsgaWQ6IHN0cmluZyB9KVtdLCBoaXN0b3J5PzogYm9vbGVhbikgPT4gdm9pZFxyXG4gICk6IHZvaWQge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRFbGVtZW50cyA9IHRoaXMuZ2V0U2VsZWN0ZWRFbGVtZW50cygpO1xyXG4gICAgaWYgKHNlbGVjdGVkRWxlbWVudHMubGVuZ3RoID09PSAwKSByZXR1cm47XHJcblxyXG4gICAgLy8gUHJlZmVyIHByb3ZpZGVkIHVwZGF0ZXIsIG90aGVyd2lzZSB1c2UgaW50ZXJuYWwgZWxlbWVudHNTZXJ2aWNlIHVwZGF0ZXJcclxuICAgIGNvbnN0IHVwZGF0ZXIgPSB1cGRhdGVFbGVtZW50c0ZuIHx8IHRoaXMudXBkYXRlRWxlbWVudHNGbjtcclxuICAgIGlmICghdXBkYXRlcikgcmV0dXJuOyAvLyBOb3RoaW5nIHRvIGRvIGlmIG5vIHVwZGF0ZXIgYXZhaWxhYmxlXHJcblxyXG4gICAgLy8gQ3JlYXRlIHVwZGF0ZSBwYXRjaGVzIGZvciBhbGwgc2VsZWN0ZWQgZWxlbWVudHNcclxuICAgIGNvbnN0IHVwZGF0ZXMgPSBzZWxlY3RlZEVsZW1lbnRzLm1hcCgoZWxlbWVudCkgPT4gKHtcclxuICAgICAgLi4ucGFydGlhbCxcclxuICAgICAgaWQ6IGVsZW1lbnQuaWQsXHJcbiAgICB9KSk7XHJcblxyXG4gICAgLy8gQXBwbHkgdXBkYXRlcyB0aHJvdWdoIHRoZSBwcm92aWRlZCBmdW5jdGlvblxyXG4gICAgdXBkYXRlcih1cGRhdGVzLCB0cnVlKTtcclxuXHJcbiAgICAvLyBVcGRhdGUgYm91bmRpbmcgYm94IHRvIHJlZmxlY3QgY2hhbmdlc1xyXG4gICAgdGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1xyXG5cclxuICAgIC8vIEVtaXQgc2VsZWN0aW9uIGV2ZW50IHRvIHVwZGF0ZSBVSVxyXG4gICAgY29uc3QgdXBkYXRlZEVsZW1lbnRzID0gdGhpcy5nZXRTZWxlY3RlZEVsZW1lbnRzKCk7XHJcbiAgICB0aGlzLmV2ZW50QnVzLmVtaXQoV2hpdGVib2FyZEV2ZW50LkVsZW1lbnRzU2VsZWN0ZWQsIHVwZGF0ZWRFbGVtZW50cyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUcmFuc2Zvcm0gc2VsZWN0ZWQgZWxlbWVudHMgdXNpbmcgYSB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvblxyXG4gICAqL1xyXG4gIHRyYW5zZm9ybVNlbGVjdGVkRWxlbWVudHMoXHJcbiAgICB0cmFuc2Zvcm1GbjogKGVsZW1lbnRzOiBXaGl0ZWJvYXJkRWxlbWVudFtdKSA9PiBXaGl0ZWJvYXJkRWxlbWVudFtdLFxyXG4gICAgdXBkYXRlRWxlbWVudHNGbj86IChlbGVtZW50czogKFBhcnRpYWw8V2hpdGVib2FyZEVsZW1lbnQ+ICYgeyBpZDogc3RyaW5nIH0pW10sIGhpc3Rvcnk/OiBib29sZWFuKSA9PiB2b2lkXHJcbiAgKTogdm9pZCB7XHJcbiAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnRzID0gdGhpcy5nZXRTZWxlY3RlZEVsZW1lbnRzKCk7XHJcbiAgICBpZiAoc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcbiAgICBjb25zdCB1cGRhdGVyID0gdXBkYXRlRWxlbWVudHNGbiB8fCB0aGlzLnVwZGF0ZUVsZW1lbnRzRm47XHJcbiAgICBpZiAoIXVwZGF0ZXIpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCB0cmFuc2Zvcm1lZEVsZW1lbnRzID0gdHJhbnNmb3JtRm4oc2VsZWN0ZWRFbGVtZW50cyk7XHJcblxyXG4gICAgLy8gQXBwbHkgdXBkYXRlcyB0aHJvdWdoIHRoZSBwcm92aWRlZCBmdW5jdGlvblxyXG4gICAgY29uc3QgdXBkYXRlcyA9IHRyYW5zZm9ybWVkRWxlbWVudHMubWFwKChlbCkgPT4gKHsgLi4uZWwsIGlkOiBlbC5pZCB9KSk7XHJcbiAgICB1cGRhdGVyKHVwZGF0ZXMsIHRydWUpO1xyXG5cclxuICAgIC8vIFVwZGF0ZSBib3VuZGluZyBib3ggdG8gcmVmbGVjdCBjaGFuZ2VzXHJcbiAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KCk7XHJcblxyXG4gICAgLy8gRW1pdCBzZWxlY3Rpb24gZXZlbnQgdG8gdXBkYXRlIFVJXHJcbiAgICBjb25zdCB1cGRhdGVkRWxlbWVudHMgPSB0aGlzLmdldFNlbGVjdGVkRWxlbWVudHMoKTtcclxuICAgIHRoaXMuZXZlbnRCdXMuZW1pdChXaGl0ZWJvYXJkRXZlbnQuRWxlbWVudHNTZWxlY3RlZCwgdXBkYXRlZEVsZW1lbnRzKTtcclxuICB9XHJcblxyXG4gIC8vIFNFTEVDVElPTiBVVElMSVRJRVNcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHNlbGVjdGlvbiBib3VuZHMgKGNvbWJpbmVkIGJvdW5kcyBvZiBhbGwgc2VsZWN0ZWQgZWxlbWVudHMpXHJcbiAgICovXHJcbiAgZ2V0U2VsZWN0aW9uQm91bmRzKCk6IHsgbWluWDogbnVtYmVyOyBtaW5ZOiBudW1iZXI7IG1heFg6IG51bWJlcjsgbWF4WTogbnVtYmVyIH0gfCBudWxsIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkRWxlbWVudHMgPSB0aGlzLmdldFNlbGVjdGVkRWxlbWVudHMoKTtcclxuXHJcbiAgICBpZiAoc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWxsQm91bmRzID0gc2VsZWN0ZWRFbGVtZW50cy5tYXAoZ2V0RWxlbWVudEJvdW5kcyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbWluWDogTWF0aC5taW4oLi4uYWxsQm91bmRzLm1hcCgoYikgPT4gYi5taW5YKSksXHJcbiAgICAgIG1pblk6IE1hdGgubWluKC4uLmFsbEJvdW5kcy5tYXAoKGIpID0+IGIubWluWSkpLFxyXG4gICAgICBtYXhYOiBNYXRoLm1heCguLi5hbGxCb3VuZHMubWFwKChiKSA9PiBiLm1heFgpKSxcclxuICAgICAgbWF4WTogTWF0aC5tYXgoLi4uYWxsQm91bmRzLm1hcCgoYikgPT4gYi5tYXhZKSksXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgaWYgc2VsZWN0aW9uIGNvbnRhaW5zIHNwZWNpZmljIGVsZW1lbnQgdHlwZVxyXG4gICAqL1xyXG4gIHNlbGVjdGlvbkNvbnRhaW5zVHlwZShlbGVtZW50VHlwZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRTZWxlY3RlZEVsZW1lbnRzKCkuc29tZSgoZWwpID0+IGVsLnR5cGUgPT09IGVsZW1lbnRUeXBlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB1bmlxdWUgZWxlbWVudCB0eXBlcyBpbiBjdXJyZW50IHNlbGVjdGlvblxyXG4gICAqL1xyXG4gIGdldFNlbGVjdGVkRWxlbWVudFR5cGVzKCk6IHN0cmluZ1tdIHtcclxuICAgIGNvbnN0IHR5cGVzID0gdGhpcy5nZXRTZWxlY3RlZEVsZW1lbnRzKCkubWFwKChlbCkgPT4gZWwudHlwZSk7XHJcbiAgICByZXR1cm4gWy4uLm5ldyBTZXQodHlwZXMpXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSBzZWxlY3RlZCBlbGVtZW50c1xyXG4gICAqL1xyXG4gIHJlbW92ZVNlbGVjdGVkRWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnRzID0gdGhpcy5nZXRTZWxlY3RlZEVsZW1lbnRzKCk7XHJcbiAgICBpZiAoc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnJlbW92ZUVsZW1lbnRzRm4pIHtcclxuICAgICAgdGhpcy5yZW1vdmVFbGVtZW50c0ZuKHNlbGVjdGVkRWxlbWVudHMsIHRydWUpO1xyXG4gICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBaLUlOREVYIE9QRVJBVElPTlNcclxuXHJcbiAgLyoqXHJcbiAgICogQnJpbmcgc2VsZWN0ZWQgZWxlbWVudHMgdG8gZnJvbnRcclxuICAgKi9cclxuICBicmluZ1RvRnJvbnQoKTogdm9pZCB7XHJcbiAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnRzID0gdGhpcy5nZXRTZWxlY3RlZEVsZW1lbnRzKCk7XHJcbiAgICBpZiAoc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggPT09IDAgfHwgIXRoaXMuZ2V0RWxlbWVudHNGbiB8fCAhdGhpcy51cGRhdGVFbGVtZW50c0ZuKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgYWxsRWxlbWVudHMgPSB0aGlzLmdldEVsZW1lbnRzRm4oKTtcclxuICAgIGNvbnN0IG1heFpJbmRleCA9IE1hdGgubWF4KC4uLmFsbEVsZW1lbnRzLm1hcCgoZWw6IFdoaXRlYm9hcmRFbGVtZW50KSA9PiBlbC56SW5kZXggfHwgMCkpO1xyXG5cclxuICAgIGNvbnN0IHVwZGF0ZXMgPSBzZWxlY3RlZEVsZW1lbnRzLm1hcCgoZWxlbWVudCwgaW5kZXgpID0+ICh7XHJcbiAgICAgIGlkOiBlbGVtZW50LmlkLFxyXG4gICAgICB6SW5kZXg6IG1heFpJbmRleCArIGluZGV4ICsgMSxcclxuICAgIH0pKTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzRm4odXBkYXRlcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBCcmluZyBzZWxlY3RlZCBlbGVtZW50cyBmb3J3YXJkIGJ5IG9uZSBsZXZlbFxyXG4gICAqL1xyXG4gIGJyaW5nRm9yd2FyZCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkRWxlbWVudHMgPSB0aGlzLmdldFNlbGVjdGVkRWxlbWVudHMoKTtcclxuICAgIGlmIChzZWxlY3RlZEVsZW1lbnRzLmxlbmd0aCA9PT0gMCB8fCAhdGhpcy5nZXRFbGVtZW50c0ZuIHx8ICF0aGlzLnVwZGF0ZUVsZW1lbnRzRm4pIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBhbGxFbGVtZW50cyA9IHRoaXMuZ2V0RWxlbWVudHNGbigpO1xyXG5cclxuICAgIC8vIFNvcnQgYWxsIGVsZW1lbnRzIGJ5IHotaW5kZXhcclxuICAgIGNvbnN0IHNvcnRlZEVsZW1lbnRzID0gWy4uLmFsbEVsZW1lbnRzXS5zb3J0KChhLCBiKSA9PiAoYS56SW5kZXggfHwgMCkgLSAoYi56SW5kZXggfHwgMCkpO1xyXG4gICAgY29uc3QgdXBkYXRlczogKFBhcnRpYWw8V2hpdGVib2FyZEVsZW1lbnQ+ICYgeyBpZDogc3RyaW5nIH0pW10gPSBbXTtcclxuXHJcbiAgICBzZWxlY3RlZEVsZW1lbnRzLmZvckVhY2goKHNlbGVjdGVkRWxlbWVudCkgPT4ge1xyXG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBzb3J0ZWRFbGVtZW50cy5maW5kSW5kZXgoKGVsKSA9PiBlbC5pZCA9PT0gc2VsZWN0ZWRFbGVtZW50LmlkKTtcclxuXHJcbiAgICAgIC8vIEZpbmQgdGhlIG5leHQgbm9uLXNlbGVjdGVkIGVsZW1lbnQgYWhlYWQgb2YgdGhpcyBvbmVcclxuICAgICAgbGV0IHRhcmdldEluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcclxuICAgICAgd2hpbGUgKFxyXG4gICAgICAgIHRhcmdldEluZGV4IDwgc29ydGVkRWxlbWVudHMubGVuZ3RoICYmXHJcbiAgICAgICAgc2VsZWN0ZWRFbGVtZW50cy5zb21lKChzZWwpID0+IHNlbC5pZCA9PT0gc29ydGVkRWxlbWVudHNbdGFyZ2V0SW5kZXhdLmlkKVxyXG4gICAgICApIHtcclxuICAgICAgICB0YXJnZXRJbmRleCsrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBJZiB0aGVyZSdzIGFuIGVsZW1lbnQgdG8gc3dhcCB3aXRoXHJcbiAgICAgIGlmICh0YXJnZXRJbmRleCA8IHNvcnRlZEVsZW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBzb3J0ZWRFbGVtZW50c1t0YXJnZXRJbmRleF07XHJcbiAgICAgICAgdXBkYXRlcy5wdXNoKHtcclxuICAgICAgICAgIGlkOiBzZWxlY3RlZEVsZW1lbnQuaWQsXHJcbiAgICAgICAgICB6SW5kZXg6IHRhcmdldEVsZW1lbnQuekluZGV4LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHVwZGF0ZXMucHVzaCh7XHJcbiAgICAgICAgICBpZDogdGFyZ2V0RWxlbWVudC5pZCxcclxuICAgICAgICAgIHpJbmRleDogc2VsZWN0ZWRFbGVtZW50LnpJbmRleCxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHVwZGF0ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzRm4odXBkYXRlcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZW5kIHNlbGVjdGVkIGVsZW1lbnRzIGJhY2t3YXJkIGJ5IG9uZSBsZXZlbFxyXG4gICAqL1xyXG4gIHNlbmRCYWNrd2FyZCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkRWxlbWVudHMgPSB0aGlzLmdldFNlbGVjdGVkRWxlbWVudHMoKTtcclxuICAgIGlmIChzZWxlY3RlZEVsZW1lbnRzLmxlbmd0aCA9PT0gMCB8fCAhdGhpcy5nZXRFbGVtZW50c0ZuIHx8ICF0aGlzLnVwZGF0ZUVsZW1lbnRzRm4pIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBhbGxFbGVtZW50cyA9IHRoaXMuZ2V0RWxlbWVudHNGbigpO1xyXG5cclxuICAgIC8vIFNvcnQgYWxsIGVsZW1lbnRzIGJ5IHotaW5kZXhcclxuICAgIGNvbnN0IHNvcnRlZEVsZW1lbnRzID0gWy4uLmFsbEVsZW1lbnRzXS5zb3J0KChhLCBiKSA9PiAoYS56SW5kZXggfHwgMCkgLSAoYi56SW5kZXggfHwgMCkpO1xyXG4gICAgY29uc3QgdXBkYXRlczogKFBhcnRpYWw8V2hpdGVib2FyZEVsZW1lbnQ+ICYgeyBpZDogc3RyaW5nIH0pW10gPSBbXTtcclxuXHJcbiAgICBzZWxlY3RlZEVsZW1lbnRzLmZvckVhY2goKHNlbGVjdGVkRWxlbWVudCkgPT4ge1xyXG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBzb3J0ZWRFbGVtZW50cy5maW5kSW5kZXgoKGVsKSA9PiBlbC5pZCA9PT0gc2VsZWN0ZWRFbGVtZW50LmlkKTtcclxuXHJcbiAgICAgIC8vIEZpbmQgdGhlIHByZXZpb3VzIG5vbi1zZWxlY3RlZCBlbGVtZW50IGJlaGluZCB0aGlzIG9uZVxyXG4gICAgICBsZXQgdGFyZ2V0SW5kZXggPSBjdXJyZW50SW5kZXggLSAxO1xyXG4gICAgICB3aGlsZSAodGFyZ2V0SW5kZXggPj0gMCAmJiBzZWxlY3RlZEVsZW1lbnRzLnNvbWUoKHNlbCkgPT4gc2VsLmlkID09PSBzb3J0ZWRFbGVtZW50c1t0YXJnZXRJbmRleF0uaWQpKSB7XHJcbiAgICAgICAgdGFyZ2V0SW5kZXgtLTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgdGhlcmUncyBhbiBlbGVtZW50IHRvIHN3YXAgd2l0aFxyXG4gICAgICBpZiAodGFyZ2V0SW5kZXggPj0gMCkge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBzb3J0ZWRFbGVtZW50c1t0YXJnZXRJbmRleF07XHJcbiAgICAgICAgdXBkYXRlcy5wdXNoKHtcclxuICAgICAgICAgIGlkOiBzZWxlY3RlZEVsZW1lbnQuaWQsXHJcbiAgICAgICAgICB6SW5kZXg6IHRhcmdldEVsZW1lbnQuekluZGV4LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHVwZGF0ZXMucHVzaCh7XHJcbiAgICAgICAgICBpZDogdGFyZ2V0RWxlbWVudC5pZCxcclxuICAgICAgICAgIHpJbmRleDogc2VsZWN0ZWRFbGVtZW50LnpJbmRleCxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHVwZGF0ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzRm4odXBkYXRlcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZW5kIHNlbGVjdGVkIGVsZW1lbnRzIHRvIGJhY2tcclxuICAgKi9cclxuICBzZW5kVG9CYWNrKCk6IHZvaWQge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRFbGVtZW50cyA9IHRoaXMuZ2V0U2VsZWN0ZWRFbGVtZW50cygpO1xyXG4gICAgaWYgKHNlbGVjdGVkRWxlbWVudHMubGVuZ3RoID09PSAwIHx8ICF0aGlzLmdldEVsZW1lbnRzRm4gfHwgIXRoaXMudXBkYXRlRWxlbWVudHNGbikgcmV0dXJuO1xyXG5cclxuICAgIC8vIFN0YXJ0IGZyb20gei1pbmRleCAxIGFuZCBhc3NpZ24gc2VxdWVudGlhbCB2YWx1ZXNcclxuICAgIGNvbnN0IHVwZGF0ZXMgPSBzZWxlY3RlZEVsZW1lbnRzLm1hcCgoZWxlbWVudCwgaW5kZXgpID0+ICh7XHJcbiAgICAgIGlkOiBlbGVtZW50LmlkLFxyXG4gICAgICB6SW5kZXg6IGluZGV4ICsgMSxcclxuICAgIH0pKTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzRm4odXBkYXRlcyk7XHJcblxyXG4gICAgLy8gU2hpZnQgYWxsIG90aGVyIGVsZW1lbnRzIHVwIHRvIG1ha2Ugcm9vbVxyXG4gICAgY29uc3QgYWxsRWxlbWVudHMgPSB0aGlzLmdldEVsZW1lbnRzRm4oKTtcclxuICAgIGNvbnN0IG90aGVyRWxlbWVudHMgPSBhbGxFbGVtZW50cy5maWx0ZXIoXHJcbiAgICAgIChlbDogV2hpdGVib2FyZEVsZW1lbnQpID0+ICFzZWxlY3RlZEVsZW1lbnRzLnNvbWUoKHNlbGVjdGVkKSA9PiBzZWxlY3RlZC5pZCA9PT0gZWwuaWQpXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IG90aGVyVXBkYXRlcyA9IG90aGVyRWxlbWVudHMubWFwKChlbGVtZW50OiBXaGl0ZWJvYXJkRWxlbWVudCwgaW5kZXg6IG51bWJlcikgPT4gKHtcclxuICAgICAgaWQ6IGVsZW1lbnQuaWQsXHJcbiAgICAgIHpJbmRleDogc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggKyBpbmRleCArIDEsXHJcbiAgICB9KSk7XHJcblxyXG4gICAgaWYgKG90aGVyVXBkYXRlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlRWxlbWVudHNGbihvdGhlclVwZGF0ZXMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gR1JPVVBJTkcgT1BFUkFUSU9OU1xyXG5cclxuICAvKipcclxuICAgKiBHcm91cCBzZWxlY3RlZCBlbGVtZW50c1xyXG4gICAqL1xyXG4gIGdyb3VwU2VsZWN0ZWRFbGVtZW50cygpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkRWxlbWVudHMgPSB0aGlzLmdldFNlbGVjdGVkRWxlbWVudHMoKTtcclxuICAgIGlmIChzZWxlY3RlZEVsZW1lbnRzLmxlbmd0aCA8IDIgfHwgIXRoaXMudXBkYXRlRWxlbWVudHNGbikgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGdyb3VwSWQgPSBgZ3JvdXBfJHtEYXRlLm5vdygpfWA7XHJcbiAgICBjb25zdCB1cGRhdGVzID0gc2VsZWN0ZWRFbGVtZW50cy5tYXAoKGVsZW1lbnQpID0+ICh7XHJcbiAgICAgIGlkOiBlbGVtZW50LmlkLFxyXG4gICAgICBncm91cElkOiBncm91cElkLFxyXG4gICAgfSkpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlRWxlbWVudHNGbih1cGRhdGVzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVuZ3JvdXAgc2VsZWN0ZWQgZWxlbWVudHNcclxuICAgKi9cclxuICB1bmdyb3VwU2VsZWN0ZWRFbGVtZW50cygpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkRWxlbWVudHMgPSB0aGlzLmdldFNlbGVjdGVkRWxlbWVudHMoKTtcclxuICAgIGlmIChzZWxlY3RlZEVsZW1lbnRzLmxlbmd0aCA9PT0gMCB8fCAhdGhpcy5nZXRFbGVtZW50c0ZuIHx8ICF0aGlzLnVwZGF0ZUVsZW1lbnRzRm4pIHJldHVybjtcclxuXHJcbiAgICAvLyBGaW5kIGVsZW1lbnRzIHRoYXQgYmVsb25nIHRvIHRoZSBzYW1lIGdyb3VwIGFzIHNlbGVjdGVkIGVsZW1lbnRzXHJcbiAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnRzV2l0aEdyb3VwcyA9IHNlbGVjdGVkRWxlbWVudHMuZmlsdGVyKChlbCkgPT4gZWwuZ3JvdXBJZCAhPT0gdW5kZWZpbmVkICYmIGVsLmdyb3VwSWQgIT09IG51bGwpO1xyXG4gICAgaWYgKHNlbGVjdGVkRWxlbWVudHNXaXRoR3JvdXBzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgIC8vIEdldCBhbGwgZ3JvdXAgSURzIGZyb20gc2VsZWN0ZWQgZWxlbWVudHNcclxuICAgIGNvbnN0IGdyb3VwSWRzID0gWy4uLm5ldyBTZXQoc2VsZWN0ZWRFbGVtZW50c1dpdGhHcm91cHMubWFwKChlbCkgPT4gZWwuZ3JvdXBJZCkuZmlsdGVyKEJvb2xlYW4pKV07XHJcblxyXG4gICAgLy8gRmluZCBhbGwgZWxlbWVudHMgdGhhdCBiZWxvbmcgdG8gdGhlc2UgZ3JvdXBzXHJcbiAgICBjb25zdCBhbGxFbGVtZW50cyA9IHRoaXMuZ2V0RWxlbWVudHNGbigpO1xyXG4gICAgY29uc3QgZWxlbWVudHNUb1VuZ3JvdXAgPSBhbGxFbGVtZW50cy5maWx0ZXIoKGVsOiBXaGl0ZWJvYXJkRWxlbWVudCkgPT4ge1xyXG4gICAgICByZXR1cm4gZWwuZ3JvdXBJZCAhPT0gdW5kZWZpbmVkICYmIGVsLmdyb3VwSWQgIT09IG51bGwgJiYgZ3JvdXBJZHMuaW5jbHVkZXMoZWwuZ3JvdXBJZCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBSZW1vdmUgZ3JvdXAgSUQgZnJvbSBhbGwgZWxlbWVudHMgaW4gdGhlIGdyb3Vwc1xyXG4gICAgY29uc3QgdXBkYXRlcyA9IGVsZW1lbnRzVG9Vbmdyb3VwLm1hcCgoZWxlbWVudCkgPT4gKHtcclxuICAgICAgaWQ6IGVsZW1lbnQuaWQsXHJcbiAgICAgIGdyb3VwSWQ6IHVuZGVmaW5lZCxcclxuICAgIH0pKTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzRm4odXBkYXRlcyk7XHJcbiAgfVxyXG5cclxuICAvLyBMT0NLSU5HIE9QRVJBVElPTlNcclxuXHJcbiAgLyoqXHJcbiAgICogTG9jayBzZWxlY3RlZCBlbGVtZW50c1xyXG4gICAqL1xyXG4gIGxvY2tFbGVtZW50cygpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkRWxlbWVudHMgPSB0aGlzLmdldFNlbGVjdGVkRWxlbWVudHMoKTtcclxuICAgIGlmIChzZWxlY3RlZEVsZW1lbnRzLmxlbmd0aCA9PT0gMCB8fCAhdGhpcy51cGRhdGVFbGVtZW50c0ZuKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgdXBkYXRlcyA9IHNlbGVjdGVkRWxlbWVudHMubWFwKChlbGVtZW50KSA9PiAoe1xyXG4gICAgICBpZDogZWxlbWVudC5pZCxcclxuICAgICAgbG9ja2VkOiB0cnVlLFxyXG4gICAgfSkpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlRWxlbWVudHNGbih1cGRhdGVzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVubG9jayBzZWxlY3RlZCBlbGVtZW50c1xyXG4gICAqL1xyXG4gIHVubG9ja0VsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRFbGVtZW50cyA9IHRoaXMuZ2V0U2VsZWN0ZWRFbGVtZW50cygpO1xyXG4gICAgaWYgKHNlbGVjdGVkRWxlbWVudHMubGVuZ3RoID09PSAwIHx8ICF0aGlzLnVwZGF0ZUVsZW1lbnRzRm4pIHJldHVybjtcclxuXHJcbiAgICBjb25zdCB1cGRhdGVzID0gc2VsZWN0ZWRFbGVtZW50cy5tYXAoKGVsZW1lbnQpID0+ICh7XHJcbiAgICAgIGlkOiBlbGVtZW50LmlkLFxyXG4gICAgICBsb2NrZWQ6IGZhbHNlLFxyXG4gICAgfSkpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlRWxlbWVudHNGbih1cGRhdGVzKTtcclxuICB9XHJcblxyXG4gIC8vIEFMSUdOTUVOVCBPUEVSQVRJT05TXHJcblxyXG4gIC8qKlxyXG4gICAqIEFsaWduIHNlbGVjdGVkIGVsZW1lbnRzXHJcbiAgICovXHJcbiAgYWxpZ25FbGVtZW50cyhhbGlnbm1lbnQ6IEFsaWdubWVudFR5cGUpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkRWxlbWVudHMgPSB0aGlzLmdldFNlbGVjdGVkRWxlbWVudHMoKTtcclxuICAgIGlmIChzZWxlY3RlZEVsZW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgIGlmICghdGhpcy51cGRhdGVFbGVtZW50c0ZuKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignVXBkYXRlIGVsZW1lbnRzIGZ1bmN0aW9uIG5vdCBhdmFpbGFibGUnKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHVwZGF0ZXMgPSB0aGlzLmNhbGN1bGF0ZUFsaWdubWVudFVwZGF0ZXMoc2VsZWN0ZWRFbGVtZW50cywgYWxpZ25tZW50KTtcclxuICAgIGlmICh1cGRhdGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy51cGRhdGVFbGVtZW50c0ZuKHVwZGF0ZXMsIHRydWUpO1xyXG4gICAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEaXN0cmlidXRlIHNlbGVjdGVkIGVsZW1lbnRzIGhvcml6b250YWxseSB3aXRoIGVxdWFsIHNwYWNpbmdcclxuICAgKi9cclxuICBkaXN0cmlidXRlSG9yaXpvbnRhbGx5KCk6IHZvaWQge1xyXG4gICAgdGhpcy5hbGlnbkVsZW1lbnRzKEFsaWdubWVudFR5cGUuRGlzdHJpYnV0ZUhvcml6b250YWxseSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEaXN0cmlidXRlIHNlbGVjdGVkIGVsZW1lbnRzIHZlcnRpY2FsbHkgd2l0aCBlcXVhbCBzcGFjaW5nXHJcbiAgICovXHJcbiAgZGlzdHJpYnV0ZVZlcnRpY2FsbHkoKTogdm9pZCB7XHJcbiAgICB0aGlzLmFsaWduRWxlbWVudHMoQWxpZ25tZW50VHlwZS5EaXN0cmlidXRlVmVydGljYWxseSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxjdWxhdGUgYWxpZ25tZW50IHVwZGF0ZXMgZm9yIHNlbGVjdGVkIGVsZW1lbnRzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjYWxjdWxhdGVBbGlnbm1lbnRVcGRhdGVzKFxyXG4gICAgZWxlbWVudHM6IFdoaXRlYm9hcmRFbGVtZW50W10sXHJcbiAgICBhbGlnbm1lbnQ6IEFsaWdubWVudFR5cGVcclxuICApOiAoUGFydGlhbDxXaGl0ZWJvYXJkRWxlbWVudD4gJiB7IGlkOiBzdHJpbmcgfSlbXSB7XHJcbiAgICBpZiAoZWxlbWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XHJcblxyXG4gICAgY29uc3QgdXBkYXRlczogKFBhcnRpYWw8V2hpdGVib2FyZEVsZW1lbnQ+ICYgeyBpZDogc3RyaW5nIH0pW10gPSBbXTtcclxuICAgIGNvbnN0IGJvdW5kcyA9IGVsZW1lbnRzLm1hcCgoZWxlbWVudCkgPT4gKHtcclxuICAgICAgZWxlbWVudCxcclxuICAgICAgYm91bmRzOiBnZXRFbGVtZW50Qm91bmRzKGVsZW1lbnQpLFxyXG4gICAgfSkpO1xyXG5cclxuICAgIC8vIEZvciBzaW5nbGUgZWxlbWVudCwgYWxpZ24gdG8gdmlzaWJsZSB2aWV3cG9ydFxyXG4gICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICBjb25zdCB2aXNpYmxlQm91bmRzID0gdGhpcy5jYW52YXNTZXJ2aWNlLmdldFZpc2libGVCb3VuZHMoKTtcclxuICAgICAgY29uc3QgZWxlbWVudEJvdW5kcyA9IGJvdW5kc1swXS5ib3VuZHM7XHJcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBib3VuZHNbMF0uZWxlbWVudDtcclxuXHJcbiAgICAgIHN3aXRjaCAoYWxpZ25tZW50KSB7XHJcbiAgICAgICAgY2FzZSBBbGlnbm1lbnRUeXBlLkxlZnQ6IHtcclxuICAgICAgICAgIGNvbnN0IG9mZnNldFggPSB2aXNpYmxlQm91bmRzLmxlZnQgLSBlbGVtZW50Qm91bmRzLm1pblg7XHJcbiAgICAgICAgICBpZiAob2Zmc2V0WCAhPT0gMCkge1xyXG4gICAgICAgICAgICB1cGRhdGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgIGlkOiBlbGVtZW50LmlkLFxyXG4gICAgICAgICAgICAgIHg6IGVsZW1lbnQueCArIG9mZnNldFgsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYXNlIEFsaWdubWVudFR5cGUuQ2VudGVyOiB7XHJcbiAgICAgICAgICBjb25zdCB2aWV3cG9ydENlbnRlclggPSAodmlzaWJsZUJvdW5kcy5sZWZ0ICsgdmlzaWJsZUJvdW5kcy5yaWdodCkgLyAyO1xyXG4gICAgICAgICAgY29uc3QgZWxlbWVudENlbnRlclggPSBlbGVtZW50Qm91bmRzLm1pblggKyBlbGVtZW50Qm91bmRzLndpZHRoIC8gMjtcclxuICAgICAgICAgIGNvbnN0IG9mZnNldFggPSB2aWV3cG9ydENlbnRlclggLSBlbGVtZW50Q2VudGVyWDtcclxuICAgICAgICAgIGlmIChvZmZzZXRYICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHVwZGF0ZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgaWQ6IGVsZW1lbnQuaWQsXHJcbiAgICAgICAgICAgICAgeDogZWxlbWVudC54ICsgb2Zmc2V0WCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhc2UgQWxpZ25tZW50VHlwZS5SaWdodDoge1xyXG4gICAgICAgICAgY29uc3Qgb2Zmc2V0WCA9IHZpc2libGVCb3VuZHMucmlnaHQgLSBlbGVtZW50Qm91bmRzLm1heFg7XHJcbiAgICAgICAgICBpZiAob2Zmc2V0WCAhPT0gMCkge1xyXG4gICAgICAgICAgICB1cGRhdGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgIGlkOiBlbGVtZW50LmlkLFxyXG4gICAgICAgICAgICAgIHg6IGVsZW1lbnQueCArIG9mZnNldFgsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYXNlIEFsaWdubWVudFR5cGUuVG9wOiB7XHJcbiAgICAgICAgICBjb25zdCBvZmZzZXRZID0gdmlzaWJsZUJvdW5kcy50b3AgLSBlbGVtZW50Qm91bmRzLm1pblk7XHJcbiAgICAgICAgICBpZiAob2Zmc2V0WSAhPT0gMCkge1xyXG4gICAgICAgICAgICB1cGRhdGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgIGlkOiBlbGVtZW50LmlkLFxyXG4gICAgICAgICAgICAgIHk6IGVsZW1lbnQueSArIG9mZnNldFksXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYXNlIEFsaWdubWVudFR5cGUuTWlkZGxlOiB7XHJcbiAgICAgICAgICBjb25zdCB2aWV3cG9ydENlbnRlclkgPSAodmlzaWJsZUJvdW5kcy50b3AgKyB2aXNpYmxlQm91bmRzLmJvdHRvbSkgLyAyO1xyXG4gICAgICAgICAgY29uc3QgZWxlbWVudENlbnRlclkgPSBlbGVtZW50Qm91bmRzLm1pblkgKyBlbGVtZW50Qm91bmRzLmhlaWdodCAvIDI7XHJcbiAgICAgICAgICBjb25zdCBvZmZzZXRZID0gdmlld3BvcnRDZW50ZXJZIC0gZWxlbWVudENlbnRlclk7XHJcbiAgICAgICAgICBpZiAob2Zmc2V0WSAhPT0gMCkge1xyXG4gICAgICAgICAgICB1cGRhdGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgIGlkOiBlbGVtZW50LmlkLFxyXG4gICAgICAgICAgICAgIHk6IGVsZW1lbnQueSArIG9mZnNldFksXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYXNlIEFsaWdubWVudFR5cGUuQm90dG9tOiB7XHJcbiAgICAgICAgICBjb25zdCBvZmZzZXRZID0gdmlzaWJsZUJvdW5kcy5ib3R0b20gLSBlbGVtZW50Qm91bmRzLm1heFk7XHJcbiAgICAgICAgICBpZiAob2Zmc2V0WSAhPT0gMCkge1xyXG4gICAgICAgICAgICB1cGRhdGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgIGlkOiBlbGVtZW50LmlkLFxyXG4gICAgICAgICAgICAgIHk6IGVsZW1lbnQueSArIG9mZnNldFksXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgY29uc29sZS53YXJuKCdVbnN1cHBvcnRlZCBhbGlnbm1lbnQgdHlwZSBmb3Igc2luZ2xlIGVsZW1lbnQ6JywgYWxpZ25tZW50KTtcclxuICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHVwZGF0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRm9yIG11bHRpcGxlIGVsZW1lbnRzLCBhbGlnbiB0byBlYWNoIG90aGVyXHJcbiAgICBzd2l0Y2ggKGFsaWdubWVudCkge1xyXG4gICAgICBjYXNlIEFsaWdubWVudFR5cGUuTGVmdDoge1xyXG4gICAgICAgIGNvbnN0IGxlZnRNb3N0ID0gTWF0aC5taW4oLi4uYm91bmRzLm1hcCgoYikgPT4gYi5ib3VuZHMubWluWCkpO1xyXG4gICAgICAgIGJvdW5kcy5mb3JFYWNoKCh7IGVsZW1lbnQsIGJvdW5kczogZWxlbWVudEJvdW5kcyB9KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBvZmZzZXRYID0gbGVmdE1vc3QgLSBlbGVtZW50Qm91bmRzLm1pblg7XHJcbiAgICAgICAgICBpZiAob2Zmc2V0WCAhPT0gMCkge1xyXG4gICAgICAgICAgICB1cGRhdGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgIGlkOiBlbGVtZW50LmlkLFxyXG4gICAgICAgICAgICAgIHg6IGVsZW1lbnQueCArIG9mZnNldFgsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjYXNlIEFsaWdubWVudFR5cGUuQ2VudGVyOiB7XHJcbiAgICAgICAgY29uc3QgY2VudGVyWCA9IGJvdW5kcy5yZWR1Y2UoKGFjYywgYikgPT4gYWNjICsgKGIuYm91bmRzLm1pblggKyBiLmJvdW5kcy53aWR0aCAvIDIpLCAwKSAvIGJvdW5kcy5sZW5ndGg7XHJcbiAgICAgICAgYm91bmRzLmZvckVhY2goKHsgZWxlbWVudCwgYm91bmRzOiBlbGVtZW50Qm91bmRzIH0pID0+IHtcclxuICAgICAgICAgIGNvbnN0IGVsZW1lbnRDZW50ZXJYID0gZWxlbWVudEJvdW5kcy5taW5YICsgZWxlbWVudEJvdW5kcy53aWR0aCAvIDI7XHJcbiAgICAgICAgICBjb25zdCBvZmZzZXRYID0gY2VudGVyWCAtIGVsZW1lbnRDZW50ZXJYO1xyXG4gICAgICAgICAgaWYgKG9mZnNldFggIT09IDApIHtcclxuICAgICAgICAgICAgdXBkYXRlcy5wdXNoKHtcclxuICAgICAgICAgICAgICBpZDogZWxlbWVudC5pZCxcclxuICAgICAgICAgICAgICB4OiBlbGVtZW50LnggKyBvZmZzZXRYLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgY2FzZSBBbGlnbm1lbnRUeXBlLlJpZ2h0OiB7XHJcbiAgICAgICAgY29uc3QgcmlnaHRNb3N0ID0gTWF0aC5tYXgoLi4uYm91bmRzLm1hcCgoYikgPT4gYi5ib3VuZHMubWF4WCkpO1xyXG4gICAgICAgIGJvdW5kcy5mb3JFYWNoKCh7IGVsZW1lbnQsIGJvdW5kczogZWxlbWVudEJvdW5kcyB9KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBvZmZzZXRYID0gcmlnaHRNb3N0IC0gZWxlbWVudEJvdW5kcy5tYXhYO1xyXG4gICAgICAgICAgaWYgKG9mZnNldFggIT09IDApIHtcclxuICAgICAgICAgICAgdXBkYXRlcy5wdXNoKHtcclxuICAgICAgICAgICAgICBpZDogZWxlbWVudC5pZCxcclxuICAgICAgICAgICAgICB4OiBlbGVtZW50LnggKyBvZmZzZXRYLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgY2FzZSBBbGlnbm1lbnRUeXBlLlRvcDoge1xyXG4gICAgICAgIGNvbnN0IHRvcE1vc3QgPSBNYXRoLm1pbiguLi5ib3VuZHMubWFwKChiKSA9PiBiLmJvdW5kcy5taW5ZKSk7XHJcbiAgICAgICAgYm91bmRzLmZvckVhY2goKHsgZWxlbWVudCwgYm91bmRzOiBlbGVtZW50Qm91bmRzIH0pID0+IHtcclxuICAgICAgICAgIGNvbnN0IG9mZnNldFkgPSB0b3BNb3N0IC0gZWxlbWVudEJvdW5kcy5taW5ZO1xyXG4gICAgICAgICAgaWYgKG9mZnNldFkgIT09IDApIHtcclxuICAgICAgICAgICAgdXBkYXRlcy5wdXNoKHtcclxuICAgICAgICAgICAgICBpZDogZWxlbWVudC5pZCxcclxuICAgICAgICAgICAgICB5OiBlbGVtZW50LnkgKyBvZmZzZXRZLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgY2FzZSBBbGlnbm1lbnRUeXBlLk1pZGRsZToge1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSBib3VuZHMucmVkdWNlKChhY2MsIGIpID0+IGFjYyArIChiLmJvdW5kcy5taW5ZICsgYi5ib3VuZHMuaGVpZ2h0IC8gMiksIDApIC8gYm91bmRzLmxlbmd0aDtcclxuICAgICAgICBib3VuZHMuZm9yRWFjaCgoeyBlbGVtZW50LCBib3VuZHM6IGVsZW1lbnRCb3VuZHMgfSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgZWxlbWVudENlbnRlclkgPSBlbGVtZW50Qm91bmRzLm1pblkgKyBlbGVtZW50Qm91bmRzLmhlaWdodCAvIDI7XHJcbiAgICAgICAgICBjb25zdCBvZmZzZXRZID0gY2VudGVyWSAtIGVsZW1lbnRDZW50ZXJZO1xyXG4gICAgICAgICAgaWYgKG9mZnNldFkgIT09IDApIHtcclxuICAgICAgICAgICAgdXBkYXRlcy5wdXNoKHtcclxuICAgICAgICAgICAgICBpZDogZWxlbWVudC5pZCxcclxuICAgICAgICAgICAgICB5OiBlbGVtZW50LnkgKyBvZmZzZXRZLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgY2FzZSBBbGlnbm1lbnRUeXBlLkJvdHRvbToge1xyXG4gICAgICAgIGNvbnN0IGJvdHRvbU1vc3QgPSBNYXRoLm1heCguLi5ib3VuZHMubWFwKChiKSA9PiBiLmJvdW5kcy5tYXhZKSk7XHJcbiAgICAgICAgYm91bmRzLmZvckVhY2goKHsgZWxlbWVudCwgYm91bmRzOiBlbGVtZW50Qm91bmRzIH0pID0+IHtcclxuICAgICAgICAgIGNvbnN0IG9mZnNldFkgPSBib3R0b21Nb3N0IC0gZWxlbWVudEJvdW5kcy5tYXhZO1xyXG4gICAgICAgICAgaWYgKG9mZnNldFkgIT09IDApIHtcclxuICAgICAgICAgICAgdXBkYXRlcy5wdXNoKHtcclxuICAgICAgICAgICAgICBpZDogZWxlbWVudC5pZCxcclxuICAgICAgICAgICAgICB5OiBlbGVtZW50LnkgKyBvZmZzZXRZLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgY2FzZSBBbGlnbm1lbnRUeXBlLkRpc3RyaWJ1dGVIb3Jpem9udGFsbHk6IHtcclxuICAgICAgICBpZiAoZWxlbWVudHMubGVuZ3RoIDwgMykgcmV0dXJuIFtdOyAvLyBOZWVkIGF0IGxlYXN0IDMgZWxlbWVudHMgdG8gZGlzdHJpYnV0ZVxyXG5cclxuICAgICAgICAvLyBTb3J0IGVsZW1lbnRzIGJ5IHRoZWlyIGxlZnQgcG9zaXRpb25cclxuICAgICAgICBjb25zdCBzb3J0ZWRCeVggPSBib3VuZHMuc29ydCgoYSwgYikgPT4gYS5ib3VuZHMubWluWCAtIGIuYm91bmRzLm1pblgpO1xyXG4gICAgICAgIGNvbnN0IGxlZnRtb3N0WCA9IHNvcnRlZEJ5WFswXS5ib3VuZHMubWluWDtcclxuICAgICAgICBjb25zdCByaWdodG1vc3RYID0gc29ydGVkQnlYW3NvcnRlZEJ5WC5sZW5ndGggLSAxXS5ib3VuZHMubWF4WDtcclxuICAgICAgICBjb25zdCB0b3RhbFdpZHRoID0gcmlnaHRtb3N0WCAtIGxlZnRtb3N0WDtcclxuXHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRvdGFsIHdpZHRoIG9mIGFsbCBlbGVtZW50c1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnRzV2lkdGggPSBzb3J0ZWRCeVgucmVkdWNlKChhY2MsIGIpID0+IGFjYyArIGIuYm91bmRzLndpZHRoLCAwKTtcclxuICAgICAgICBjb25zdCBhdmFpbGFibGVTcGFjZUggPSB0b3RhbFdpZHRoIC0gZWxlbWVudHNXaWR0aDtcclxuICAgICAgICBjb25zdCBzcGFjaW5nSCA9IGF2YWlsYWJsZVNwYWNlSCAvIChzb3J0ZWRCeVgubGVuZ3RoIC0gMSk7XHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50WCA9IGxlZnRtb3N0WDtcclxuICAgICAgICBzb3J0ZWRCeVguZm9yRWFjaCgoeyBlbGVtZW50LCBib3VuZHM6IGVsZW1lbnRCb3VuZHMgfSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgICAvLyBLZWVwIHRoZSBsZWZ0bW9zdCBlbGVtZW50IGluIHBsYWNlXHJcbiAgICAgICAgICAgIGN1cnJlbnRYICs9IGVsZW1lbnRCb3VuZHMud2lkdGg7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSBzb3J0ZWRCeVgubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAvLyBLZWVwIHRoZSByaWdodG1vc3QgZWxlbWVudCBpbiBwbGFjZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBQb3NpdGlvbiBtaWRkbGUgZWxlbWVudHMgd2l0aCBlcXVhbCBzcGFjaW5nXHJcbiAgICAgICAgICAgIGN1cnJlbnRYICs9IHNwYWNpbmdIO1xyXG4gICAgICAgICAgICBjb25zdCBvZmZzZXRYID0gY3VycmVudFggLSBlbGVtZW50Qm91bmRzLm1pblg7XHJcbiAgICAgICAgICAgIGlmIChvZmZzZXRYICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgdXBkYXRlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGlkOiBlbGVtZW50LmlkLFxyXG4gICAgICAgICAgICAgICAgeDogZWxlbWVudC54ICsgb2Zmc2V0WCxcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdXJyZW50WCArPSBlbGVtZW50Qm91bmRzLndpZHRoO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjYXNlIEFsaWdubWVudFR5cGUuRGlzdHJpYnV0ZVZlcnRpY2FsbHk6IHtcclxuICAgICAgICBpZiAoZWxlbWVudHMubGVuZ3RoIDwgMykgcmV0dXJuIFtdOyAvLyBOZWVkIGF0IGxlYXN0IDMgZWxlbWVudHMgdG8gZGlzdHJpYnV0ZVxyXG5cclxuICAgICAgICAvLyBTb3J0IGVsZW1lbnRzIGJ5IHRoZWlyIHRvcCBwb3NpdGlvblxyXG4gICAgICAgIGNvbnN0IHNvcnRlZEJ5WSA9IGJvdW5kcy5zb3J0KChhLCBiKSA9PiBhLmJvdW5kcy5taW5ZIC0gYi5ib3VuZHMubWluWSk7XHJcbiAgICAgICAgY29uc3QgdG9wbW9zdFkgPSBzb3J0ZWRCeVlbMF0uYm91bmRzLm1pblk7XHJcbiAgICAgICAgY29uc3QgYm90dG9tbW9zdFkgPSBzb3J0ZWRCeVlbc29ydGVkQnlZLmxlbmd0aCAtIDFdLmJvdW5kcy5tYXhZO1xyXG4gICAgICAgIGNvbnN0IHRvdGFsSGVpZ2h0ID0gYm90dG9tbW9zdFkgLSB0b3Btb3N0WTtcclxuXHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRvdGFsIGhlaWdodCBvZiBhbGwgZWxlbWVudHNcclxuICAgICAgICBjb25zdCBlbGVtZW50c0hlaWdodCA9IHNvcnRlZEJ5WS5yZWR1Y2UoKGFjYywgYikgPT4gYWNjICsgYi5ib3VuZHMuaGVpZ2h0LCAwKTtcclxuICAgICAgICBjb25zdCBhdmFpbGFibGVTcGFjZVYgPSB0b3RhbEhlaWdodCAtIGVsZW1lbnRzSGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IHNwYWNpbmdWID0gYXZhaWxhYmxlU3BhY2VWIC8gKHNvcnRlZEJ5WS5sZW5ndGggLSAxKTtcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnRZID0gdG9wbW9zdFk7XHJcbiAgICAgICAgc29ydGVkQnlZLmZvckVhY2goKHsgZWxlbWVudCwgYm91bmRzOiBlbGVtZW50Qm91bmRzIH0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcclxuICAgICAgICAgICAgLy8gS2VlcCB0aGUgdG9wbW9zdCBlbGVtZW50IGluIHBsYWNlXHJcbiAgICAgICAgICAgIGN1cnJlbnRZICs9IGVsZW1lbnRCb3VuZHMuaGVpZ2h0O1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gc29ydGVkQnlZLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgLy8gS2VlcCB0aGUgYm90dG9tbW9zdCBlbGVtZW50IGluIHBsYWNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFBvc2l0aW9uIG1pZGRsZSBlbGVtZW50cyB3aXRoIGVxdWFsIHNwYWNpbmdcclxuICAgICAgICAgICAgY3VycmVudFkgKz0gc3BhY2luZ1Y7XHJcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldFkgPSBjdXJyZW50WSAtIGVsZW1lbnRCb3VuZHMubWluWTtcclxuICAgICAgICAgICAgaWYgKG9mZnNldFkgIT09IDApIHtcclxuICAgICAgICAgICAgICB1cGRhdGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaWQ6IGVsZW1lbnQuaWQsXHJcbiAgICAgICAgICAgICAgICB5OiBlbGVtZW50LnkgKyBvZmZzZXRZLFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN1cnJlbnRZICs9IGVsZW1lbnRCb3VuZHMuaGVpZ2h0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGNvbnNvbGUud2FybignVW5zdXBwb3J0ZWQgYWxpZ25tZW50IHR5cGU6JywgYWxpZ25tZW50KTtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHVwZGF0ZXM7XHJcbiAgfVxyXG5cclxuICAvLyBUUkFOU0ZPUk0gT1BFUkFUSU9OU1xyXG5cclxuICAvKipcclxuICAgKiBGbGlwIHNlbGVjdGVkIGVsZW1lbnRzIGhvcml6b250YWxseVxyXG4gICAqL1xyXG4gIGZsaXBIb3Jpem9udGFsKCk6IHZvaWQge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRFbGVtZW50cyA9IHRoaXMuZ2V0U2VsZWN0ZWRFbGVtZW50cygpO1xyXG4gICAgaWYgKHNlbGVjdGVkRWxlbWVudHMubGVuZ3RoID09PSAwIHx8ICF0aGlzLnVwZGF0ZUVsZW1lbnRzRm4pIHJldHVybjtcclxuXHJcbiAgICBjb25zdCB1cGRhdGVzID0gc2VsZWN0ZWRFbGVtZW50cy5tYXAoKGVsZW1lbnQpID0+IHtcclxuICAgICAgLy8gVG9nZ2xlIGhvcml6b250YWwgZmxpcCBieSBpbnZlcnRpbmcgc2NhbGVYXHJcbiAgICAgIGNvbnN0IGN1cnJlbnRTY2FsZVggPSBlbGVtZW50LnNjYWxlWCA/PyAxO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGlkOiBlbGVtZW50LmlkLFxyXG4gICAgICAgIHNjYWxlWDogLWN1cnJlbnRTY2FsZVgsXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzRm4odXBkYXRlcywgdHJ1ZSk7XHJcbiAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGbGlwIHNlbGVjdGVkIGVsZW1lbnRzIHZlcnRpY2FsbHlcclxuICAgKi9cclxuICBmbGlwVmVydGljYWwoKTogdm9pZCB7XHJcbiAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnRzID0gdGhpcy5nZXRTZWxlY3RlZEVsZW1lbnRzKCk7XHJcbiAgICBpZiAoc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggPT09IDAgfHwgIXRoaXMudXBkYXRlRWxlbWVudHNGbikgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHVwZGF0ZXMgPSBzZWxlY3RlZEVsZW1lbnRzLm1hcCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICAvLyBUb2dnbGUgdmVydGljYWwgZmxpcCBieSBpbnZlcnRpbmcgc2NhbGVZXHJcbiAgICAgIGNvbnN0IGN1cnJlbnRTY2FsZVkgPSBlbGVtZW50LnNjYWxlWSA/PyAxO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGlkOiBlbGVtZW50LmlkLFxyXG4gICAgICAgIHNjYWxlWTogLWN1cnJlbnRTY2FsZVksXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzRm4odXBkYXRlcywgdHJ1ZSk7XHJcbiAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHNlbGVjdGVkIGVsZW1lbnRzIGJ5IGEgZ2l2ZW4gb2Zmc2V0XHJcbiAgICovXHJcbiAgbW92ZVNlbGVjdGVkRWxlbWVudHMoZHg6IG51bWJlciwgZHk6IG51bWJlcik6IHZvaWQge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRFbGVtZW50cyA9IHRoaXMuZ2V0U2VsZWN0ZWRFbGVtZW50cygpO1xyXG4gICAgaWYgKHNlbGVjdGVkRWxlbWVudHMubGVuZ3RoID09PSAwIHx8ICF0aGlzLnVwZGF0ZUVsZW1lbnRzRm4pIHJldHVybjtcclxuXHJcbiAgICBjb25zdCB1cGRhdGVzID0gc2VsZWN0ZWRFbGVtZW50cy5tYXAoKGVsZW1lbnQpID0+ICh7XHJcbiAgICAgIGlkOiBlbGVtZW50LmlkLFxyXG4gICAgICB4OiBlbGVtZW50LnggKyBkeCxcclxuICAgICAgeTogZWxlbWVudC55ICsgZHksXHJcbiAgICB9KSk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVFbGVtZW50c0ZuKHVwZGF0ZXMsIHRydWUpO1xyXG4gICAgdGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUm90YXRlIHNlbGVjdGVkIGVsZW1lbnRzIGJ5IGEgZ2l2ZW4gYW5nbGUgKGluIGRlZ3JlZXMpXHJcbiAgICovXHJcbiAgcm90YXRlU2VsZWN0ZWRFbGVtZW50cyhhbmdsZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnRzID0gdGhpcy5nZXRTZWxlY3RlZEVsZW1lbnRzKCk7XHJcbiAgICBpZiAoc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggPT09IDAgfHwgIXRoaXMudXBkYXRlRWxlbWVudHNGbikgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHVwZGF0ZXMgPSBzZWxlY3RlZEVsZW1lbnRzLm1hcCgoZWxlbWVudCkgPT4gKHtcclxuICAgICAgaWQ6IGVsZW1lbnQuaWQsXHJcbiAgICAgIHJvdGF0aW9uOiAoZWxlbWVudC5yb3RhdGlvbiB8fCAwKSArIGFuZ2xlLFxyXG4gICAgfSkpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlRWxlbWVudHNGbih1cGRhdGVzLCB0cnVlKTtcclxuICAgIHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNjYWxlIHNlbGVjdGVkIGVsZW1lbnRzIGJ5IGEgZ2l2ZW4gZmFjdG9yXHJcbiAgICovXHJcbiAgc2NhbGVTZWxlY3RlZEVsZW1lbnRzKGZhY3RvcjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnRzID0gdGhpcy5nZXRTZWxlY3RlZEVsZW1lbnRzKCk7XHJcbiAgICBpZiAoc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggPT09IDAgfHwgIXRoaXMudXBkYXRlRWxlbWVudHNGbikgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHVwZGF0ZXMgPSBzZWxlY3RlZEVsZW1lbnRzXHJcbiAgICAgIC5tYXAoKGVsZW1lbnQpID0+IHtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgIGNvbnN0IHVwZGF0ZTogYW55ID0geyBpZDogZWxlbWVudC5pZCB9O1xyXG5cclxuICAgICAgICAvLyBTY2FsZSB3aWR0aCBhbmQgaGVpZ2h0IGlmIHRoZXkgZXhpc3QgKHVzZSAnaW4nIG9wZXJhdG9yIGZvciB0eXBlIGNoZWNraW5nKVxyXG4gICAgICAgIGlmICgnd2lkdGgnIGluIGVsZW1lbnQgJiYgZWxlbWVudC53aWR0aCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICB1cGRhdGUud2lkdGggPSBlbGVtZW50LndpZHRoICogZmFjdG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJ2hlaWdodCcgaW4gZWxlbWVudCAmJiBlbGVtZW50LmhlaWdodCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICB1cGRhdGUuaGVpZ2h0ID0gZWxlbWVudC5oZWlnaHQgKiBmYWN0b3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTY2FsZSBzdHJva2Ugd2lkdGggaWYgaXQgZXhpc3RzXHJcbiAgICAgICAgaWYgKGVsZW1lbnQuc3R5bGU/LnN0cm9rZVdpZHRoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHVwZGF0ZS5zdHlsZSA9IHtcclxuICAgICAgICAgICAgLi4uZWxlbWVudC5zdHlsZSxcclxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IGVsZW1lbnQuc3R5bGUuc3Ryb2tlV2lkdGggKiBmYWN0b3IsXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRm9yIHJlY3RhbmdsZXMgYW5kIGVsbGlwc2VzLCBhbHNvIHNjYWxlIHJhZGlpIGlmIHRoZXkgZXhpc3RcclxuICAgICAgICBpZiAoJ3J4JyBpbiBlbGVtZW50ICYmIGVsZW1lbnQucnggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgdXBkYXRlLnJ4ID0gZWxlbWVudC5yeCAqIGZhY3RvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCdyeScgaW4gZWxlbWVudCAmJiBlbGVtZW50LnJ5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHVwZGF0ZS5yeSA9IGVsZW1lbnQucnkgKiBmYWN0b3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdXBkYXRlO1xyXG4gICAgICB9KVxyXG4gICAgICAuZmlsdGVyKCh1cGRhdGUpID0+IE9iamVjdC5rZXlzKHVwZGF0ZSkubGVuZ3RoID4gMSk7IC8vIE9ubHkgaW5jbHVkZSB1cGRhdGVzIHdpdGggbW9yZSB0aGFuIGp1c3QgaWRcclxuXHJcbiAgICBpZiAodXBkYXRlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlRWxlbWVudHNGbih1cGRhdGVzLCB0cnVlKTtcclxuICAgICAgdGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=