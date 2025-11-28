import { HistoryService } from '../history/history.service';
import { computed, inject, Injectable, signal } from '@angular/core';
import { EventBusService } from '../event-bus';
import { WhiteboardEvent } from '../types';
import { getElementBounds } from '../utils';
import { LayerManagementService } from './layer-management.service';
import * as i0 from "@angular/core";
import * as i1 from "../event-bus";
export class ElementsService {
    eventBus;
    historyService = inject(HistoryService);
    layerManagement = inject(LayerManagementService);
    // Signal-based state management
    _elements = signal([]);
    _draftElements = signal([]);
    _maxZIndex = signal(0);
    _locks = signal(new Map());
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    elements = this._elements.asReadonly();
    /**
     * Signal containing all draft (temporary) elements
     */
    draftElements = this._draftElements.asReadonly();
    /**
     * Computed signal containing all elements (persistent + draft)
     */
    allElements = computed(() => [...this._elements(), ...this._draftElements()]);
    /**
     * Computed signal for elements count
     */
    elementsCount = computed(() => this._elements().length);
    /**
     * Computed signal checking if elements exist
     */
    hasElements = computed(() => this.elementsCount() > 0);
    /**
     * Computed signal for unique element types
     */
    elementTypes = computed(() => {
        const types = this._elements().map((el) => el.type);
        return [...new Set(types)];
    });
    /**
     * Computed signal for elements by type
     */
    elementsByType = computed(() => {
        const elements = this._elements();
        const byType = new Map();
        elements.forEach((element) => {
            const type = element.type;
            if (!byType.has(type)) {
                byType.set(type, []);
            }
            const typeArray = byType.get(type);
            if (typeArray) {
                typeArray.push(element);
            }
        });
        return byType;
    });
    /**
     * Computed signal for max z-index
     */
    maxZIndex = computed(() => this._maxZIndex());
    /**
     * Computed signal for elements sorted by z-index
     */
    elementsByZIndex = computed(() => {
        return [...this._elements()].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    });
    /**
     * Computed signal for locked elements
     */
    lockedElements = computed(() => {
        return this._elements().filter((element) => element.locked === true);
    });
    /**
     * Computed signal for unlocked elements
     */
    unlockedElements = computed(() => {
        return this._elements().filter((element) => element.locked !== true);
    });
    /**
     * Computed signal for locked elements count
     */
    lockedElementsCount = computed(() => this.lockedElements().length);
    /**
     * Computed signal checking if any elements are locked
     */
    hasLockedElements = computed(() => this.lockedElementsCount() > 0);
    /**
     * Computed signal for lock statistics
     */
    lockStats = computed(() => {
        const total = this.elementsCount();
        const locked = this.lockedElementsCount();
        const unlocked = total - locked;
        const lockPercentage = total > 0 ? Math.round((locked / total) * 100) : 0;
        return {
            total,
            locked,
            unlocked,
            lockPercentage,
            allLocked: total > 0 && locked === total,
            noneLocked: locked === 0,
        };
    });
    /**
     * Signal containing element locks
     */
    locks = this._locks.asReadonly();
    /**
     * Get current persistent elements snapshot
     */
    getElements() {
        return [...this._elements()];
    }
    /**
     * Get current draft elements snapshot
     */
    getDraftElements() {
        return [...this._draftElements()];
    }
    /**
     * Get all elements (persistent + draft) snapshot
     */
    getAllElements() {
        return this.allElements();
    }
    // ---------- Element Management ----------
    /**
     * Add elements to persistent storage
     */
    addElements(elements) {
        if (!elements?.length)
            return;
        const activeLayerId = this.layerManagement.getActiveLayerId();
        const elementsWithZIndex = elements.map((element) => ({
            ...element,
            zIndex: element.zIndex ?? this.getNextZIndex(),
            layerId: element.layerId ?? activeLayerId, // Auto-assign to active layer
        }));
        this.updateMaxZIndex(elementsWithZIndex);
        const currentElements = this._elements();
        const newElements = [...currentElements, ...elementsWithZIndex];
        this._elements.set(newElements);
        // Register elements with layer management
        elementsWithZIndex.forEach((element) => {
            if (element.layerId) {
                this.layerManagement.assignElementToLayer(element.id, element.layerId);
            }
        });
        this.historyService.recordElementCreation(currentElements, newElements);
        // Emit granular event for elements addition
        this.eventBus.emit(WhiteboardEvent.ElementsAdded, elementsWithZIndex);
        // Emit data change event
        this.eventBus.emit(WhiteboardEvent.DataChange, newElements);
    }
    /**
     * Update existing elements (respects lock status)
     */
    updateElements(updates, ignoreLock = false) {
        if (!updates?.length)
            return;
        const currentElements = this._elements();
        const updatesMap = new Map(updates.map((update) => [update.id, update]));
        const updatedElements = [];
        const newElements = currentElements.map((element) => {
            const update = updatesMap.get(element.id);
            if (!update)
                return element;
            // Check if element is locked and operation doesn't ignore lock
            if (!ignoreLock && element.locked && !this.isLockOperation(update)) {
                console.warn(`Attempted to modify locked element: ${element.id}`);
                return element; // Return unchanged element
            }
            // Check if element's layer is locked
            if (!ignoreLock && element.layerId) {
                const elementLayer = this.layerManagement.getElementLayer(element.id);
                if (elementLayer?.locked) {
                    console.warn(`Attempted to modify element on locked layer: ${elementLayer.name}`);
                    return element; // Return unchanged element
                }
            }
            const updatedElement = { ...element, ...update };
            // Update max z-index if necessary
            if (updatedElement.zIndex != null) {
                this._maxZIndex.update((current) => Math.max(current, updatedElement.zIndex));
            }
            updatedElements.push(updatedElement);
            return updatedElement;
        });
        this._elements.set(newElements);
        if (updatedElements.length > 0) {
            this.historyService.recordElementUpdate(currentElements, newElements);
        }
        if (updatedElements.length > 0) {
            this.eventBus.emit(WhiteboardEvent.ElementsUpdated, updatedElements);
            // Emit data change event
            this.eventBus.emit(WhiteboardEvent.DataChange, newElements);
        }
    }
    /**
     * Remove elements by IDs (respects lock status)
     */
    removeElementsByIds(elementIds, ignoreLock = false) {
        if (!elementIds?.length)
            return;
        const idsToRemove = new Set(elementIds);
        const currentElements = this._elements();
        // Filter out locked elements unless ignoreLock is true
        const validElementsToRemove = currentElements.filter((element) => {
            if (!idsToRemove.has(element.id))
                return false;
            if (!ignoreLock && element.locked) {
                console.warn(`Attempted to remove locked element: ${element.id}`);
                return false;
            }
            // Check if element's layer is locked
            if (!ignoreLock && element.layerId) {
                const elementLayer = this.layerManagement.getElementLayer(element.id);
                if (elementLayer?.locked) {
                    console.warn(`Attempted to remove element from locked layer: ${elementLayer.name}`);
                    return false;
                }
            }
            return true;
        });
        if (validElementsToRemove.length === 0)
            return;
        const removeIds = new Set(validElementsToRemove.map((el) => el.id));
        const newElements = currentElements.filter((element) => !removeIds.has(element.id));
        this._elements.set(newElements);
        // Remove elements from layers
        validElementsToRemove.forEach((element) => {
            this.layerManagement.removeElementFromAllLayers(element.id);
        });
        // Record history for undo/redo
        this.historyService.recordElementDeletion(currentElements, newElements);
        // Emit events
        this.eventBus.emit(WhiteboardEvent.ElementsRemoved, validElementsToRemove);
        this.eventBus.emit(WhiteboardEvent.DataChange, newElements);
    }
    /**
     * Remove elements (simplified interface, respects lock status)
     */
    removeElements(elements, ignoreLock = false) {
        const elementIds = elements.map((element) => element.id);
        this.removeElementsByIds(elementIds, ignoreLock);
    }
    /**
     * Clear all persistent elements
     */
    clear() {
        const currentElements = this._elements();
        this._elements.set([]);
        this._maxZIndex.set(0);
        // Clear all elements from layers
        currentElements.forEach((element) => {
            this.layerManagement.removeElementFromAllLayers(element.id);
        });
        // Record history for undo/redo
        this.historyService.recordClear(currentElements, []);
        // Emit data change event
        this.eventBus.emit(WhiteboardEvent.DataChange, []);
    }
    /**
     * Set all persistent elements (replaces current elements)
     */
    setElements(elements) {
        const elementsWithZIndex = elements.map((element) => ({
            ...element,
            zIndex: element.zIndex ?? this.getNextZIndex(),
        }));
        this.updateMaxZIndex(elementsWithZIndex);
        this._elements.set([...elementsWithZIndex]);
        // Emit data change event
        this.eventBus.emit(WhiteboardEvent.DataChange, elementsWithZIndex);
    }
    // ---------- Draft Element Management ----------
    /**
     * Add elements to draft storage (temporary elements)
     */
    addDraftElements(elements) {
        if (!elements?.length)
            return;
        // Check if active layer is locked
        const activeLayer = this.layerManagement.activeLayer();
        if (activeLayer?.locked) {
            console.warn(`Cannot draw on locked layer: ${activeLayer.name}`);
            return;
        }
        const elementsWithZIndex = elements.map((element) => ({
            ...element,
            zIndex: element.zIndex ?? this.getNextZIndex(),
        }));
        this.updateMaxZIndex(elementsWithZIndex);
        const currentDraftElements = this._draftElements();
        const newDraftElements = [...currentDraftElements, ...elementsWithZIndex];
        this._draftElements.set(newDraftElements);
    }
    /**
     * Update draft elements
     */
    updateDraftElements(updates) {
        if (!updates?.length)
            return;
        const currentDraftElements = this._draftElements();
        const updatesMap = new Map(updates.map((update) => [update.id, update]));
        const updatedElements = [];
        const newDraftElements = currentDraftElements.map((element) => {
            const update = updatesMap.get(element.id);
            if (update) {
                const updatedElement = { ...element, ...update };
                updatedElements.push(updatedElement);
                return updatedElement;
            }
            return element;
        });
        this._draftElements.set(newDraftElements);
    }
    /**
     * Remove draft elements by IDs
     */
    removeDraftElements(elementIds) {
        if (!elementIds?.length)
            return;
        const idsToRemove = new Set(elementIds);
        const currentDraftElements = this._draftElements();
        const newDraftElements = currentDraftElements.filter((element) => !idsToRemove.has(element.id));
        this._draftElements.set(newDraftElements);
    }
    /**
     * Clear all draft elements
     */
    clearDraftElements() {
        this._draftElements.set([]);
    }
    /**
     * Move elements from draft to persistent storage
     */
    commitDraftElements(elementIds) {
        const draftElements = this._draftElements();
        const elementsToCommit = elementIds ? draftElements.filter((el) => elementIds.includes(el.id)) : draftElements;
        if (elementsToCommit.length === 0)
            return [];
        // Check if active layer is locked before committing
        const activeLayer = this.layerManagement.activeLayer();
        if (activeLayer?.locked) {
            console.warn(`Cannot commit elements to locked layer: ${activeLayer.name}`);
            // Clear draft elements since they can't be committed
            this._draftElements.set([]);
            return [];
        }
        // Add to persistent storage
        this.addElements(elementsToCommit);
        // Remove from draft storage
        const remainingDrafts = elementIds ? draftElements.filter((el) => !elementIds.includes(el.id)) : [];
        this._draftElements.set(remainingDrafts);
        // Return the committed elements for potential selection
        return elementsToCommit;
    }
    // ---------- Z-Index Management ----------
    /**
     * Get the next available z-index
     */
    getNextZIndex() {
        this._maxZIndex.update((current) => current + 1);
        return this._maxZIndex();
    }
    /**
     * Bring elements to front (respects lock status)
     */
    bringToFront(elementIds, ignoreLock = false) {
        if (!elementIds?.length)
            return;
        const newZIndex = this.getNextZIndex();
        const updates = elementIds.map((id) => ({ id, zIndex: newZIndex }));
        this.updateElements(updates, ignoreLock);
    }
    /**
     * Send elements to back (respects lock status)
     */
    sendToBack(elementIds, ignoreLock = false) {
        if (!elementIds?.length)
            return;
        const updates = elementIds.map((id) => ({ id, zIndex: 0 }));
        this.updateElements(updates, ignoreLock);
    }
    // ---------- Lock Management ----------
    /**
     * Lock elements to prevent modifications
     */
    lockElements(elementIds) {
        if (!elementIds?.length)
            return;
        const lockInfo = {
            timestamp: Date.now(),
            reason: 'User locked',
        };
        const locks = this._locks();
        const newLocks = new Map(locks);
        const updates = elementIds.map((id) => {
            newLocks.set(id, lockInfo);
            return { id, locked: true };
        });
        this._locks.set(newLocks);
        this.updateElements(updates, true); // Ignore lock status for locking operation
    }
    /**
     * Unlock elements to allow modifications
     */
    unlockElements(elementIds) {
        if (!elementIds?.length)
            return;
        const locks = this._locks();
        const newLocks = new Map(locks);
        const updates = elementIds.map((id) => {
            newLocks.delete(id);
            return { id, locked: false };
        });
        this._locks.set(newLocks);
        this.updateElements(updates, true); // Ignore lock status for unlocking operation
    }
    /**
     * Toggle lock status of elements
     */
    toggleElementsLock(elementIds) {
        if (!elementIds?.length)
            return;
        const elementsToLock = [];
        const elementsToUnlock = [];
        elementIds.forEach((id) => {
            const element = this.getElementById(id);
            if (element) {
                if (element.locked) {
                    elementsToUnlock.push(id);
                }
                else {
                    elementsToLock.push(id);
                }
            }
        });
        if (elementsToLock.length > 0) {
            this.lockElements(elementsToLock);
        }
        if (elementsToUnlock.length > 0) {
            this.unlockElements(elementsToUnlock);
        }
    }
    /**
     * Lock all elements
     */
    lockAllElements() {
        const allIds = this._elements().map((el) => el.id);
        this.lockElements(allIds);
    }
    /**
     * Unlock all elements
     */
    unlockAllElements() {
        const allIds = this._elements().map((el) => el.id);
        this.unlockElements(allIds);
    }
    /**
     * Check if an element is locked
     */
    isElementLocked(elementId) {
        const element = this.getElementById(elementId);
        return Boolean(element?.locked);
    }
    /**
     * Get locked element IDs
     */
    getLockedElementIds() {
        return this.lockedElements().map((el) => el.id);
    }
    /**
     * Get unlocked element IDs
     */
    getUnlockedElementIds() {
        return this.unlockedElements().map((el) => el.id);
    }
    // ---------- Layer Management ----------
    /**
     * Move elements to a specific layer (respects lock status)
     */
    moveToLayer(elementIds, layerId, ignoreLock = false) {
        if (!elementIds?.length)
            return;
        const updates = elementIds.map((id) => ({ id, layerId }));
        this.updateElements(updates, ignoreLock);
    }
    /**
     * Get elements by layer
     */
    getElementsByLayer(layerId) {
        return this._elements().filter((el) => el.layerId === layerId);
    }
    // ---------- Search and Query ----------
    /**
     * Find element by ID in both persistent and draft elements
     */
    getElementById(id) {
        // Search in persistent elements first
        const persistentElement = this._elements().find((el) => el.id === id);
        if (persistentElement)
            return persistentElement;
        // Search in draft elements
        return this._draftElements().find((el) => el.id === id);
    }
    /**
     * Find elements by IDs
     */
    getElementsByIds(ids) {
        const idsSet = new Set(ids);
        const allElements = this.allElements();
        return allElements.filter((el) => idsSet.has(el.id));
    }
    /**
     * Get elements by type
     */
    getElementsByType(type) {
        return this._elements().filter((el) => el.type === type);
    }
    /**
     * Search elements with multiple criteria
     */
    searchElements(criteria) {
        let results = this._elements();
        if (criteria.type) {
            results = results.filter((el) => el.type === criteria.type);
        }
        if (criteria.layerId) {
            results = results.filter((el) => el.layerId === criteria.layerId);
        }
        if (criteria.locked !== undefined) {
            results = results.filter((el) => Boolean(el.locked) === criteria.locked);
        }
        if (criteria.textContent) {
            const searchText = criteria.textContent.toLowerCase();
            results = results.filter((el) => {
                const textElement = el;
                const text = (textElement.text || textElement.content || '').toLowerCase();
                return text.includes(searchText);
            });
        }
        if (criteria.zIndexRange) {
            const { min, max } = criteria.zIndexRange;
            results = results.filter((el) => {
                const zIndex = el.zIndex || 0;
                return zIndex >= min && zIndex <= max;
            });
        }
        if (criteria.bounds) {
            results = this.findElementsInBounds(criteria.bounds).filter((el) => results.some((r) => r.id === el.id));
        }
        return results;
    }
    /**
     * Find elements by text content
     */
    findElementsByText(searchText) {
        return this.searchElements({ textContent: searchText });
    }
    /**
     * Get elements within a radius of a point
     */
    getElementsInRadius(centerX, centerY, radius) {
        return this._elements().filter((element) => {
            const dx = element.x - centerX;
            const dy = element.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= radius;
        });
    }
    /**
     * Get nearest element to a point
     */
    getNearestElement(x, y) {
        const elements = this._elements();
        if (elements.length === 0)
            return undefined;
        let nearestElement = elements[0];
        let minDistance = this.getDistanceToElement(x, y, nearestElement);
        for (let i = 1; i < elements.length; i++) {
            const distance = this.getDistanceToElement(x, y, elements[i]);
            if (distance < minDistance) {
                minDistance = distance;
                nearestElement = elements[i];
            }
        }
        return nearestElement;
    }
    // ---------- State Management ----------
    /**
     * Create a snapshot of current state
     */
    createSnapshot() {
        return {
            elements: [...this._elements()],
            draftElements: [...this._draftElements()],
            maxZIndex: this._maxZIndex(),
            timestamp: Date.now(),
        };
    }
    /**
     * Restore state from snapshot
     */
    restoreSnapshot(snapshot) {
        this._elements.set([...snapshot.elements]);
        this._draftElements.set([...snapshot.draftElements]);
        this._maxZIndex.set(snapshot.maxZIndex);
    }
    // ---------- Utility Methods ----------
    /**
     * Find elements intersecting with a boundary
     */
    findElementsInBounds(bounds) {
        return this._elements().filter((element) => {
            const elementWidth = element.width || 50;
            const elementHeight = element.height || 50;
            return (element.x < bounds.x + bounds.width &&
                element.x + elementWidth > bounds.x &&
                element.y < bounds.y + bounds.height &&
                element.y + elementHeight > bounds.y);
        });
    }
    /**
     * Calculate combined bounds of multiple elements
     */
    calculateElementsBounds(elements) {
        if (elements.length === 0) {
            return null;
        }
        const allBounds = elements.map(getElementBounds);
        const minX = Math.min(...allBounds.map((b) => b.minX));
        const minY = Math.min(...allBounds.map((b) => b.minY));
        const maxX = Math.max(...allBounds.map((b) => b.maxX));
        const maxY = Math.max(...allBounds.map((b) => b.maxY));
        const width = maxX - minX;
        const height = maxY - minY;
        return {
            x: minX,
            y: minY,
            width,
            height,
            centerX: minX + width / 2,
            centerY: minY + height / 2,
        };
    }
    /**
     * Get elements count (use computed signal for reactivity)
     */
    getElementsCount() {
        return this.elementsCount();
    }
    /**
     * Get unique element types (use computed signal for reactivity)
     */
    getElementTypes() {
        return this.elementTypes();
    }
    /**
     * Normalize z-indices to sequential integers
     */
    normalizeZIndices() {
        const elements = [...this._elements()].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        const updates = elements.map((element, index) => ({
            id: element.id,
            zIndex: index + 1,
        }));
        this._maxZIndex.set(elements.length);
        this.updateElements(updates, true);
    }
    // ---------- Convenience Methods ----------
    /**
     * Add a single element (convenience method)
     */
    addElement(element) {
        this.addElements([element]);
    }
    /**
     * Update a single element (convenience method, respects lock status)
     */
    updateElement(update, ignoreLock = false) {
        this.updateElements([update], ignoreLock);
    }
    /**
     * Remove a single element (convenience method, respects lock status)
     */
    removeElement(element, ignoreLock = false) {
        this.removeElementsByIds([element.id], ignoreLock);
    }
    /**
     * Check if a specific element exists
     */
    elementExists(id) {
        return this.getElementById(id) !== undefined;
    }
    /**
     * Get elements within a specific z-index range
     */
    getElementsByZIndexRange(min, max) {
        return this._elements().filter((el) => {
            const zIndex = el.zIndex || 0;
            return zIndex >= min && zIndex <= max;
        });
    }
    /**
     * Get elements with specific properties
     */
    getElementsByProperty(property, value) {
        return this._elements().filter((el) => el[property] === value);
    }
    /**
     * Lock a single element
     */
    lockElement(elementId) {
        this.lockElements([elementId]);
    }
    /**
     * Unlock a single element
     */
    unlockElement(elementId) {
        this.unlockElements([elementId]);
    }
    /**
     * Toggle lock status of a single element
     */
    toggleElementLock(elementId) {
        this.toggleElementsLock([elementId]);
    }
    /**
     * Get modifiable elements (unlocked elements)
     */
    getModifiableElements() {
        return this.unlockedElements();
    }
    /**
     * Check if any of the given elements are locked
     */
    hasLockedElementsInSelection(elementIds) {
        return elementIds.some((id) => this.isElementLocked(id));
    }
    /**
     * Filter out locked elements from a selection
     */
    filterUnlockedElements(elementIds) {
        return elementIds.filter((id) => !this.isElementLocked(id));
    }
    /**
     * Get elements that can be safely modified (respects lock status)
     */
    getModifiableElementsFromIds(elementIds) {
        const unlocked = this.filterUnlockedElements(elementIds);
        return this.getElementsByIds(unlocked);
    }
    /**
     * Safely update multiple elements (warns about locked elements)
     */
    safeUpdateElements(updates) {
        const locked = [];
        const updated = [];
        const safeUpdates = updates.filter((update) => {
            if (this.isElementLocked(update.id)) {
                locked.push(update.id);
                return false;
            }
            else {
                updated.push(update.id);
                return true;
            }
        });
        if (safeUpdates.length > 0) {
            this.updateElements(safeUpdates, false);
        }
        return { updated, locked };
    }
    // ---------- Private Helper Methods ----------
    /**
     * Check if an update operation is a lock-related operation
     */
    isLockOperation(update) {
        return 'locked' in update;
    }
    /**
     * Update the maximum z-index based on elements
     */
    updateMaxZIndex(elements) {
        const maxZ = Math.max(...elements.map((el) => el.zIndex || 0));
        this._maxZIndex.update((current) => Math.max(current, maxZ));
    }
    /**
     * Get distance from point to element
     */
    getDistanceToElement(x, y, element) {
        const elementWidth = element.width || 50;
        const elementHeight = element.height || 50;
        const centerX = element.x + elementWidth / 2;
        const centerY = element.y + elementHeight / 2;
        const dx = x - centerX;
        const dy = y - centerY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ElementsService, deps: [{ token: i1.EventBusService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ElementsService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ElementsService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.EventBusService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudHMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLXdoaXRlYm9hcmQvc3JjL2xpYi9jb3JlL2VsZW1lbnRzL2VsZW1lbnRzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzVELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUMvQyxPQUFPLEVBQXFCLGVBQWUsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDNUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7OztBQTZDcEUsTUFBTSxPQUFPLGVBQWU7SUFVTjtJQVRaLGNBQWMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDeEMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBRXpELGdDQUFnQztJQUNmLFNBQVMsR0FBRyxNQUFNLENBQXNCLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLGNBQWMsR0FBRyxNQUFNLENBQXNCLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELFVBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEdBQUcsRUFBb0IsQ0FBQyxDQUFDO0lBRTlELFlBQW9CLFFBQXlCO1FBQXpCLGFBQVEsR0FBUixRQUFRLENBQWlCO0lBQUcsQ0FBQztJQUV4QyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUVoRDs7T0FFRztJQUNNLGFBQWEsR0FBRyxJQUFJ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QUQzQixVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEhpc3RvcnlTZXJ2aWNlIH0gZnJvbSAnLi4vaGlzdG9yeS9oaXN0b3J5LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBjb21wdXRlZCwgaW5qZWN0LCBJbmplY3RhYmxlLCBzaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRXZlbnRCdXNTZXJ2aWNlIH0gZnJvbSAnLi4vZXZlbnQtYnVzJztcclxuaW1wb3J0IHsgV2hpdGVib2FyZEVsZW1lbnQsIFdoaXRlYm9hcmRFdmVudCB9IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHsgZ2V0RWxlbWVudEJvdW5kcyB9IGZyb20gJy4uL3V0aWxzJztcclxuaW1wb3J0IHsgTGF5ZXJNYW5hZ2VtZW50U2VydmljZSB9IGZyb20gJy4vbGF5ZXItbWFuYWdlbWVudC5zZXJ2aWNlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTG9ja0luZm8ge1xyXG4gIHRpbWVzdGFtcDogbnVtYmVyO1xyXG4gIHJlYXNvbj86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFbGVtZW50c1NuYXBzaG90IHtcclxuICBlbGVtZW50czogV2hpdGVib2FyZEVsZW1lbnRbXTtcclxuICBkcmFmdEVsZW1lbnRzOiBXaGl0ZWJvYXJkRWxlbWVudFtdO1xyXG4gIG1heFpJbmRleDogbnVtYmVyO1xyXG4gIHRpbWVzdGFtcD86IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBMb2NrT3BlcmF0aW9uUmVzdWx0IHtcclxuICB1cGRhdGVkOiBzdHJpbmdbXTtcclxuICBsb2NrZWQ6IHN0cmluZ1tdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExvY2tTdGF0cyB7XHJcbiAgdG90YWw6IG51bWJlcjtcclxuICBsb2NrZWQ6IG51bWJlcjtcclxuICB1bmxvY2tlZDogbnVtYmVyO1xyXG4gIGxvY2tQZXJjZW50YWdlOiBudW1iZXI7XHJcbiAgYWxsTG9ja2VkOiBib29sZWFuO1xyXG4gIG5vbmVMb2NrZWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRWxlbWVudFRyYW5zZm9ybWF0aW9uIHtcclxuICB0cmFuc2xhdGlvbj86IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfTtcclxuICByb3RhdGlvbj86IG51bWJlcjtcclxuICBzY2FsZT86IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfTtcclxuICBvcGFjaXR5PzogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEVsZW1lbnRTZWFyY2hDcml0ZXJpYSB7XHJcbiAgdHlwZT86IHN0cmluZztcclxuICBsYXllcklkPzogc3RyaW5nO1xyXG4gIGxvY2tlZD86IGJvb2xlYW47XHJcbiAgdGV4dENvbnRlbnQ/OiBzdHJpbmc7XHJcbiAgekluZGV4UmFuZ2U/OiB7IG1pbjogbnVtYmVyOyBtYXg6IG51bWJlciB9O1xyXG4gIGJvdW5kcz86IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH07XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBFbGVtZW50c1NlcnZpY2Uge1xyXG4gIHByaXZhdGUgaGlzdG9yeVNlcnZpY2UgPSBpbmplY3QoSGlzdG9yeVNlcnZpY2UpO1xyXG4gIHByaXZhdGUgbGF5ZXJNYW5hZ2VtZW50ID0gaW5qZWN0KExheWVyTWFuYWdlbWVudFNlcnZpY2UpO1xyXG5cclxuICAvLyBTaWduYWwtYmFzZWQgc3RhdGUgbWFuYWdlbWVudFxyXG4gIHByaXZhdGUgcmVhZG9ubHkgX2VsZW1lbnRzID0gc2lnbmFsPFdoaXRlYm9hcmRFbGVtZW50W10+KFtdKTtcclxuICBwcml2YXRlIHJlYWRvbmx5IF9kcmFmdEVsZW1lbnRzID0gc2lnbmFsPFdoaXRlYm9hcmRFbGVtZW50W10+KFtdKTtcclxuICBwcml2YXRlIHJlYWRvbmx5IF9tYXhaSW5kZXggPSBzaWduYWwoMCk7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBfbG9ja3MgPSBzaWduYWwobmV3IE1hcDxzdHJpbmcsIExvY2tJbmZvPigpKTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBldmVudEJ1czogRXZlbnRCdXNTZXJ2aWNlKSB7fVxyXG5cclxuICByZWFkb25seSBlbGVtZW50cyA9IHRoaXMuX2VsZW1lbnRzLmFzUmVhZG9ubHkoKTtcclxuXHJcbiAgLyoqXHJcbiAgICogU2lnbmFsIGNvbnRhaW5pbmcgYWxsIGRyYWZ0ICh0ZW1wb3JhcnkpIGVsZW1lbnRzXHJcbiAgICovXHJcbiAgcmVhZG9ubHkgZHJhZnRFbGVtZW50cyA9IHRoaXMuX2RyYWZ0RWxlbWVudHMuYXNSZWFkb25seSgpO1xyXG5cclxuICAvKipcclxuICAgKiBDb21wdXRlZCBzaWduYWwgY29udGFpbmluZyBhbGwgZWxlbWVudHMgKHBlcnNpc3RlbnQgKyBkcmFmdClcclxuICAgKi9cclxuICByZWFkb25seSBhbGxFbGVtZW50cyA9IGNvbXB1dGVkKCgpID0+IFsuLi50aGlzLl9lbGVtZW50cygpLCAuLi50aGlzLl9kcmFmdEVsZW1lbnRzKCldKTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ29tcHV0ZWQgc2lnbmFsIGZvciBlbGVtZW50cyBjb3VudFxyXG4gICAqL1xyXG4gIHJlYWRvbmx5IGVsZW1lbnRzQ291bnQgPSBjb21wdXRlZCgoKSA9PiB0aGlzLl9lbGVtZW50cygpLmxlbmd0aCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbXB1dGVkIHNpZ25hbCBjaGVja2luZyBpZiBlbGVtZW50cyBleGlzdFxyXG4gICAqL1xyXG4gIHJlYWRvbmx5IGhhc0VsZW1lbnRzID0gY29tcHV0ZWQoKCkgPT4gdGhpcy5lbGVtZW50c0NvdW50KCkgPiAwKTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ29tcHV0ZWQgc2lnbmFsIGZvciB1bmlxdWUgZWxlbWVudCB0eXBlc1xyXG4gICAqL1xyXG4gIHJlYWRvbmx5IGVsZW1lbnRUeXBlcyA9IGNvbXB1dGVkKCgpID0+IHtcclxuICAgIGNvbnN0IHR5cGVzID0gdGhpcy5fZWxlbWVudHMoKS5tYXAoKGVsKSA9PiBlbC50eXBlKTtcclxuICAgIHJldHVybiBbLi4ubmV3IFNldCh0eXBlcyldO1xyXG4gIH0pO1xyXG5cclxuICAvKipcclxuICAgKiBDb21wdXRlZCBzaWduYWwgZm9yIGVsZW1lbnRzIGJ5IHR5cGVcclxuICAgKi9cclxuICByZWFkb25seSBlbGVtZW50c0J5VHlwZSA9IGNvbXB1dGVkKCgpID0+IHtcclxuICAgIGNvbnN0IGVsZW1lbnRzID0gdGhpcy5fZWxlbWVudHMoKTtcclxuICAgIGNvbnN0IGJ5VHlwZSA9IG5ldyBNYXA8c3RyaW5nLCBXaGl0ZWJvYXJkRWxlbWVudFtdPigpO1xyXG5cclxuICAgIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgICAgY29uc3QgdHlwZSA9IGVsZW1lbnQudHlwZTtcclxuICAgICAgaWYgKCFieVR5cGUuaGFzKHR5cGUpKSB7XHJcbiAgICAgICAgYnlUeXBlLnNldCh0eXBlLCBbXSk7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgdHlwZUFycmF5ID0gYnlUeXBlLmdldCh0eXBlKTtcclxuICAgICAgaWYgKHR5cGVBcnJheSkge1xyXG4gICAgICAgIHR5cGVBcnJheS5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gYnlUeXBlO1xyXG4gIH0pO1xyXG5cclxuICAvKipcclxuICAgKiBDb21wdXRlZCBzaWduYWwgZm9yIG1heCB6LWluZGV4XHJcbiAgICovXHJcbiAgcmVhZG9ubHkgbWF4WkluZGV4ID0gY29tcHV0ZWQoKCkgPT4gdGhpcy5fbWF4WkluZGV4KCkpO1xyXG5cclxuICAvKipcclxuICAgKiBDb21wdXRlZCBzaWduYWwgZm9yIGVsZW1lbnRzIHNvcnRlZCBieSB6LWluZGV4XHJcbiAgICovXHJcbiAgcmVhZG9ubHkgZWxlbWVudHNCeVpJbmRleCA9IGNvbXB1dGVkKCgpID0+IHtcclxuICAgIHJldHVybiBbLi4udGhpcy5fZWxlbWVudHMoKV0uc29ydCgoYSwgYikgPT4gKGEuekluZGV4IHx8IDApIC0gKGIuekluZGV4IHx8IDApKTtcclxuICB9KTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ29tcHV0ZWQgc2lnbmFsIGZvciBsb2NrZWQgZWxlbWVudHNcclxuICAgKi9cclxuICByZWFkb25seSBsb2NrZWRFbGVtZW50cyA9IGNvbXB1dGVkKCgpID0+IHtcclxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50cygpLmZpbHRlcigoZWxlbWVudCkgPT4gZWxlbWVudC5sb2NrZWQgPT09IHRydWUpO1xyXG4gIH0pO1xyXG5cclxuICAvKipcclxuICAgKiBDb21wdXRlZCBzaWduYWwgZm9yIHVubG9ja2VkIGVsZW1lbnRzXHJcbiAgICovXHJcbiAgcmVhZG9ubHkgdW5sb2NrZWRFbGVtZW50cyA9IGNvbXB1dGVkKCgpID0+IHtcclxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50cygpLmZpbHRlcigoZWxlbWVudCkgPT4gZWxlbWVudC5sb2NrZWQgIT09IHRydWUpO1xyXG4gIH0pO1xyXG5cclxuICAvKipcclxuICAgKiBDb21wdXRlZCBzaWduYWwgZm9yIGxvY2tlZCBlbGVtZW50cyBjb3VudFxyXG4gICAqL1xyXG4gIHJlYWRvbmx5IGxvY2tlZEVsZW1lbnRzQ291bnQgPSBjb21wdXRlZCgoKSA9PiB0aGlzLmxvY2tlZEVsZW1lbnRzKCkubGVuZ3RoKTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ29tcHV0ZWQgc2lnbmFsIGNoZWNraW5nIGlmIGFueSBlbGVtZW50cyBhcmUgbG9ja2VkXHJcbiAgICovXHJcbiAgcmVhZG9ubHkgaGFzTG9ja2VkRWxlbWVudHMgPSBjb21wdXRlZCgoKSA9PiB0aGlzLmxvY2tlZEVsZW1lbnRzQ291bnQoKSA+IDApO1xyXG5cclxuICAvKipcclxuICAgKiBDb21wdXRlZCBzaWduYWwgZm9yIGxvY2sgc3RhdGlzdGljc1xyXG4gICAqL1xyXG4gIHJlYWRvbmx5IGxvY2tTdGF0cyA9IGNvbXB1dGVkKCgpID0+IHtcclxuICAgIGNvbnN0IHRvdGFsID0gdGhpcy5lbGVtZW50c0NvdW50KCk7XHJcbiAgICBjb25zdCBsb2NrZWQgPSB0aGlzLmxvY2tlZEVsZW1lbnRzQ291bnQoKTtcclxuICAgIGNvbnN0IHVubG9ja2VkID0gdG90YWwgLSBsb2NrZWQ7XHJcbiAgICBjb25zdCBsb2NrUGVyY2VudGFnZSA9IHRvdGFsID4gMCA/IE1hdGgucm91bmQoKGxvY2tlZCAvIHRvdGFsKSAqIDEwMCkgOiAwO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRvdGFsLFxyXG4gICAgICBsb2NrZWQsXHJcbiAgICAgIHVubG9ja2VkLFxyXG4gICAgICBsb2NrUGVyY2VudGFnZSxcclxuICAgICAgYWxsTG9ja2VkOiB0b3RhbCA+IDAgJiYgbG9ja2VkID09PSB0b3RhbCxcclxuICAgICAgbm9uZUxvY2tlZDogbG9ja2VkID09PSAwLFxyXG4gICAgfTtcclxuICB9KTtcclxuXHJcbiAgLyoqXHJcbiAgICogU2lnbmFsIGNvbnRhaW5pbmcgZWxlbWVudCBsb2Nrc1xyXG4gICAqL1xyXG4gIHJlYWRvbmx5IGxvY2tzID0gdGhpcy5fbG9ja3MuYXNSZWFkb25seSgpO1xyXG5cclxuICAvKipcclxuICAgKiBHZXQgY3VycmVudCBwZXJzaXN0ZW50IGVsZW1lbnRzIHNuYXBzaG90XHJcbiAgICovXHJcbiAgZ2V0RWxlbWVudHMoKTogV2hpdGVib2FyZEVsZW1lbnRbXSB7XHJcbiAgICByZXR1cm4gWy4uLnRoaXMuX2VsZW1lbnRzKCldO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGN1cnJlbnQgZHJhZnQgZWxlbWVudHMgc25hcHNob3RcclxuICAgKi9cclxuICBnZXREcmFmdEVsZW1lbnRzKCk6IFdoaXRlYm9hcmRFbGVtZW50W10ge1xyXG4gICAgcmV0dXJuIFsuLi50aGlzLl9kcmFmdEVsZW1lbnRzKCldO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGFsbCBlbGVtZW50cyAocGVyc2lzdGVudCArIGRyYWZ0KSBzbmFwc2hvdFxyXG4gICAqL1xyXG4gIGdldEFsbEVsZW1lbnRzKCk6IFdoaXRlYm9hcmRFbGVtZW50W10ge1xyXG4gICAgcmV0dXJuIHRoaXMuYWxsRWxlbWVudHMoKTtcclxuICB9XHJcblxyXG4gIC8vIC0tLS0tLS0tLS0gRWxlbWVudCBNYW5hZ2VtZW50IC0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICogQWRkIGVsZW1lbnRzIHRvIHBlcnNpc3RlbnQgc3RvcmFnZVxyXG4gICAqL1xyXG4gIGFkZEVsZW1lbnRzKGVsZW1lbnRzOiBXaGl0ZWJvYXJkRWxlbWVudFtdKTogdm9pZCB7XHJcbiAgICBpZiAoIWVsZW1lbnRzPy5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBhY3RpdmVMYXllcklkID0gdGhpcy5sYXllck1hbmFnZW1lbnQuZ2V0QWN0aXZlTGF5ZXJJZCgpO1xyXG5cclxuICAgIGNvbnN0IGVsZW1lbnRzV2l0aFpJbmRleCA9IGVsZW1lbnRzLm1hcCgoZWxlbWVudCkgPT4gKHtcclxuICAgICAgLi4uZWxlbWVudCxcclxuICAgICAgekluZGV4OiBlbGVtZW50LnpJbmRleCA/PyB0aGlzLmdldE5leHRaSW5kZXgoKSxcclxuICAgICAgbGF5ZXJJZDogZWxlbWVudC5sYXllcklkID8/IGFjdGl2ZUxheWVySWQsIC8vIEF1dG8tYXNzaWduIHRvIGFjdGl2ZSBsYXllclxyXG4gICAgfSkpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlTWF4WkluZGV4KGVsZW1lbnRzV2l0aFpJbmRleCk7XHJcblxyXG4gICAgY29uc3QgY3VycmVudEVsZW1lbnRzID0gdGhpcy5fZWxlbWVudHMoKTtcclxuICAgIGNvbnN0IG5ld0VsZW1lbnRzID0gWy4uLmN1cnJlbnRFbGVtZW50cywgLi4uZWxlbWVudHNXaXRoWkluZGV4XTtcclxuXHJcbiAgICB0aGlzLl9lbGVtZW50cy5zZXQobmV3RWxlbWVudHMpO1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIGVsZW1lbnRzIHdpdGggbGF5ZXIgbWFuYWdlbWVudFxyXG4gICAgZWxlbWVudHNXaXRoWkluZGV4LmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgICAgaWYgKGVsZW1lbnQubGF5ZXJJZCkge1xyXG4gICAgICAgIHRoaXMubGF5ZXJNYW5hZ2VtZW50LmFzc2lnbkVsZW1lbnRUb0xheWVyKGVsZW1lbnQuaWQsIGVsZW1lbnQubGF5ZXJJZCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaGlzdG9yeVNlcnZpY2UucmVjb3JkRWxlbWVudENyZWF0aW9uKGN1cnJlbnRFbGVtZW50cywgbmV3RWxlbWVudHMpO1xyXG4gICAgLy8gRW1pdCBncmFudWxhciBldmVudCBmb3IgZWxlbWVudHMgYWRkaXRpb25cclxuICAgIHRoaXMuZXZlbnRCdXMuZW1pdChXaGl0ZWJvYXJkRXZlbnQuRWxlbWVudHNBZGRlZCwgZWxlbWVudHNXaXRoWkluZGV4KTtcclxuICAgIC8vIEVtaXQgZGF0YSBjaGFuZ2UgZXZlbnRcclxuICAgIHRoaXMuZXZlbnRCdXMuZW1pdChXaGl0ZWJvYXJkRXZlbnQuRGF0YUNoYW5nZSwgbmV3RWxlbWVudHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIGV4aXN0aW5nIGVsZW1lbnRzIChyZXNwZWN0cyBsb2NrIHN0YXR1cylcclxuICAgKi9cclxuICB1cGRhdGVFbGVtZW50cyh1cGRhdGVzOiBQYXJ0aWFsPFdoaXRlYm9hcmRFbGVtZW50PiAmIHsgaWQ6IHN0cmluZyB9W10sIGlnbm9yZUxvY2sgPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgaWYgKCF1cGRhdGVzPy5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBjdXJyZW50RWxlbWVudHMgPSB0aGlzLl9lbGVtZW50cygpO1xyXG4gICAgY29uc3QgdXBkYXRlc01hcCA9IG5ldyBNYXAodXBkYXRlcy5tYXAoKHVwZGF0ZSkgPT4gW3VwZGF0ZS5pZCwgdXBkYXRlXSkpO1xyXG4gICAgY29uc3QgdXBkYXRlZEVsZW1lbnRzOiBXaGl0ZWJvYXJkRWxlbWVudFtdID0gW107XHJcblxyXG4gICAgY29uc3QgbmV3RWxlbWVudHMgPSBjdXJyZW50RWxlbWVudHMubWFwKChlbGVtZW50KSA9PiB7XHJcbiAgICAgIGNvbnN0IHVwZGF0ZSA9IHVwZGF0ZXNNYXAuZ2V0KGVsZW1lbnQuaWQpO1xyXG4gICAgICBpZiAoIXVwZGF0ZSkgcmV0dXJuIGVsZW1lbnQ7XHJcblxyXG4gICAgICAvLyBDaGVjayBpZiBlbGVtZW50IGlzIGxvY2tlZCBhbmQgb3BlcmF0aW9uIGRvZXNuJ3QgaWdub3JlIGxvY2tcclxuICAgICAgaWYgKCFpZ25vcmVMb2NrICYmIGVsZW1lbnQubG9ja2VkICYmICF0aGlzLmlzTG9ja09wZXJhdGlvbih1cGRhdGUpKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGBBdHRlbXB0ZWQgdG8gbW9kaWZ5IGxvY2tlZCBlbGVtZW50OiAke2VsZW1lbnQuaWR9YCk7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7IC8vIFJldHVybiB1bmNoYW5nZWQgZWxlbWVudFxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDaGVjayBpZiBlbGVtZW50J3MgbGF5ZXIgaXMgbG9ja2VkXHJcbiAgICAgIGlmICghaWdub3JlTG9jayAmJiBlbGVtZW50LmxheWVySWQpIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50TGF5ZXIgPSB0aGlzLmxheWVyTWFuYWdlbWVudC5nZXRFbGVtZW50TGF5ZXIoZWxlbWVudC5pZCk7XHJcbiAgICAgICAgaWYgKGVsZW1lbnRMYXllcj8ubG9ja2VkKSB7XHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oYEF0dGVtcHRlZCB0byBtb2RpZnkgZWxlbWVudCBvbiBsb2NrZWQgbGF5ZXI6ICR7ZWxlbWVudExheWVyLm5hbWV9YCk7XHJcbiAgICAgICAgICByZXR1cm4gZWxlbWVudDsgLy8gUmV0dXJuIHVuY2hhbmdlZCBlbGVtZW50XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB1cGRhdGVkRWxlbWVudCA9IHsgLi4uZWxlbWVudCwgLi4udXBkYXRlIH07XHJcblxyXG4gICAgICAvLyBVcGRhdGUgbWF4IHotaW5kZXggaWYgbmVjZXNzYXJ5XHJcbiAgICAgIGlmICh1cGRhdGVkRWxlbWVudC56SW5kZXggIT0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMuX21heFpJbmRleC51cGRhdGUoKGN1cnJlbnQpID0+IE1hdGgubWF4KGN1cnJlbnQsIHVwZGF0ZWRFbGVtZW50LnpJbmRleCBhcyBudW1iZXIpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdXBkYXRlZEVsZW1lbnRzLnB1c2godXBkYXRlZEVsZW1lbnQpO1xyXG4gICAgICByZXR1cm4gdXBkYXRlZEVsZW1lbnQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLl9lbGVtZW50cy5zZXQobmV3RWxlbWVudHMpO1xyXG5cclxuICAgIGlmICh1cGRhdGVkRWxlbWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLmhpc3RvcnlTZXJ2aWNlLnJlY29yZEVsZW1lbnRVcGRhdGUoY3VycmVudEVsZW1lbnRzLCBuZXdFbGVtZW50cyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHVwZGF0ZWRFbGVtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHRoaXMuZXZlbnRCdXMuZW1pdChXaGl0ZWJvYXJkRXZlbnQuRWxlbWVudHNVcGRhdGVkLCB1cGRhdGVkRWxlbWVudHMpO1xyXG4gICAgICAvLyBFbWl0IGRhdGEgY2hhbmdlIGV2ZW50XHJcbiAgICAgIHRoaXMuZXZlbnRCdXMuZW1pdChXaGl0ZWJvYXJkRXZlbnQuRGF0YUNoYW5nZSwgbmV3RWxlbWVudHMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIGVsZW1lbnRzIGJ5IElEcyAocmVzcGVjdHMgbG9jayBzdGF0dXMpXHJcbiAgICovXHJcbiAgcmVtb3ZlRWxlbWVudHNCeUlkcyhlbGVtZW50SWRzOiBzdHJpbmdbXSwgaWdub3JlTG9jayA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICBpZiAoIWVsZW1lbnRJZHM/Lmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGlkc1RvUmVtb3ZlID0gbmV3IFNldChlbGVtZW50SWRzKTtcclxuICAgIGNvbnN0IGN1cnJlbnRFbGVtZW50cyA9IHRoaXMuX2VsZW1lbnRzKCk7XHJcblxyXG4gICAgLy8gRmlsdGVyIG91dCBsb2NrZWQgZWxlbWVudHMgdW5sZXNzIGlnbm9yZUxvY2sgaXMgdHJ1ZVxyXG4gICAgY29uc3QgdmFsaWRFbGVtZW50c1RvUmVtb3ZlID0gY3VycmVudEVsZW1lbnRzLmZpbHRlcigoZWxlbWVudCkgPT4ge1xyXG4gICAgICBpZiAoIWlkc1RvUmVtb3ZlLmhhcyhlbGVtZW50LmlkKSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgaWYgKCFpZ25vcmVMb2NrICYmIGVsZW1lbnQubG9ja2VkKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGBBdHRlbXB0ZWQgdG8gcmVtb3ZlIGxvY2tlZCBlbGVtZW50OiAke2VsZW1lbnQuaWR9YCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDaGVjayBpZiBlbGVtZW50J3MgbGF5ZXIgaXMgbG9ja2VkXHJcbiAgICAgIGlmICghaWdub3JlTG9jayAmJiBlbGVtZW50LmxheWVySWQpIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50TGF5ZXIgPSB0aGlzLmxheWVyTWFuYWdlbWVudC5nZXRFbGVtZW50TGF5ZXIoZWxlbWVudC5pZCk7XHJcbiAgICAgICAgaWYgKGVsZW1lbnRMYXllcj8ubG9ja2VkKSB7XHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oYEF0dGVtcHRlZCB0byByZW1vdmUgZWxlbWVudCBmcm9tIGxvY2tlZCBsYXllcjogJHtlbGVtZW50TGF5ZXIubmFtZX1gKTtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHZhbGlkRWxlbWVudHNUb1JlbW92ZS5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcbiAgICBjb25zdCByZW1vdmVJZHMgPSBuZXcgU2V0KHZhbGlkRWxlbWVudHNUb1JlbW92ZS5tYXAoKGVsKSA9PiBlbC5pZCkpO1xyXG4gICAgY29uc3QgbmV3RWxlbWVudHMgPSBjdXJyZW50RWxlbWVudHMuZmlsdGVyKChlbGVtZW50KSA9PiAhcmVtb3ZlSWRzLmhhcyhlbGVtZW50LmlkKSk7XHJcblxyXG4gICAgdGhpcy5fZWxlbWVudHMuc2V0KG5ld0VsZW1lbnRzKTtcclxuXHJcbiAgICAvLyBSZW1vdmUgZWxlbWVudHMgZnJvbSBsYXllcnNcclxuICAgIHZhbGlkRWxlbWVudHNUb1JlbW92ZS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgIHRoaXMubGF5ZXJNYW5hZ2VtZW50LnJlbW92ZUVsZW1lbnRGcm9tQWxsTGF5ZXJzKGVsZW1lbnQuaWQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gUmVjb3JkIGhpc3RvcnkgZm9yIHVuZG8vcmVkb1xyXG4gICAgdGhpcy5oaXN0b3J5U2VydmljZS5yZWNvcmRFbGVtZW50RGVsZXRpb24oY3VycmVudEVsZW1lbnRzLCBuZXdFbGVtZW50cyk7XHJcblxyXG4gICAgLy8gRW1pdCBldmVudHNcclxuICAgIHRoaXMuZXZlbnRCdXMuZW1pdChXaGl0ZWJvYXJkRXZlbnQuRWxlbWVudHNSZW1vdmVkLCB2YWxpZEVsZW1lbnRzVG9SZW1vdmUpO1xyXG4gICAgdGhpcy5ldmVudEJ1cy5lbWl0KFdoaXRlYm9hcmRFdmVudC5EYXRhQ2hhbmdlLCBuZXdFbGVtZW50cyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmUgZWxlbWVudHMgKHNpbXBsaWZpZWQgaW50ZXJmYWNlLCByZXNwZWN0cyBsb2NrIHN0YXR1cylcclxuICAgKi9cclxuICByZW1vdmVFbGVtZW50cyhlbGVtZW50czogV2hpdGVib2FyZEVsZW1lbnRbXSwgaWdub3JlTG9jayA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICBjb25zdCBlbGVtZW50SWRzID0gZWxlbWVudHMubWFwKChlbGVtZW50KSA9PiBlbGVtZW50LmlkKTtcclxuICAgIHRoaXMucmVtb3ZlRWxlbWVudHNCeUlkcyhlbGVtZW50SWRzLCBpZ25vcmVMb2NrKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENsZWFyIGFsbCBwZXJzaXN0ZW50IGVsZW1lbnRzXHJcbiAgICovXHJcbiAgY2xlYXIoKTogdm9pZCB7XHJcbiAgICBjb25zdCBjdXJyZW50RWxlbWVudHMgPSB0aGlzLl9lbGVtZW50cygpO1xyXG4gICAgdGhpcy5fZWxlbWVudHMuc2V0KFtdKTtcclxuICAgIHRoaXMuX21heFpJbmRleC5zZXQoMCk7XHJcblxyXG4gICAgLy8gQ2xlYXIgYWxsIGVsZW1lbnRzIGZyb20gbGF5ZXJzXHJcbiAgICBjdXJyZW50RWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICB0aGlzLmxheWVyTWFuYWdlbWVudC5yZW1vdmVFbGVtZW50RnJvbUFsbExheWVycyhlbGVtZW50LmlkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFJlY29yZCBoaXN0b3J5IGZvciB1bmRvL3JlZG9cclxuICAgIHRoaXMuaGlzdG9yeVNlcnZpY2UucmVjb3JkQ2xlYXIoY3VycmVudEVsZW1lbnRzLCBbXSk7XHJcbiAgICAvLyBFbWl0IGRhdGEgY2hhbmdlIGV2ZW50XHJcbiAgICB0aGlzLmV2ZW50QnVzLmVtaXQoV2hpdGVib2FyZEV2ZW50LkRhdGFDaGFuZ2UsIFtdKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCBhbGwgcGVyc2lzdGVudCBlbGVtZW50cyAocmVwbGFjZXMgY3VycmVudCBlbGVtZW50cylcclxuICAgKi9cclxuICBzZXRFbGVtZW50cyhlbGVtZW50czogV2hpdGVib2FyZEVsZW1lbnRbXSk6IHZvaWQge1xyXG4gICAgY29uc3QgZWxlbWVudHNXaXRoWkluZGV4ID0gZWxlbWVudHMubWFwKChlbGVtZW50KSA9PiAoe1xyXG4gICAgICAuLi5lbGVtZW50LFxyXG4gICAgICB6SW5kZXg6IGVsZW1lbnQuekluZGV4ID8/IHRoaXMuZ2V0TmV4dFpJbmRleCgpLFxyXG4gICAgfSkpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlTWF4WkluZGV4KGVsZW1lbnRzV2l0aFpJbmRleCk7XHJcbiAgICB0aGlzLl9lbGVtZW50cy5zZXQoWy4uLmVsZW1lbnRzV2l0aFpJbmRleF0pO1xyXG4gICAgLy8gRW1pdCBkYXRhIGNoYW5nZSBldmVudFxyXG4gICAgdGhpcy5ldmVudEJ1cy5lbWl0KFdoaXRlYm9hcmRFdmVudC5EYXRhQ2hhbmdlLCBlbGVtZW50c1dpdGhaSW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgLy8gLS0tLS0tLS0tLSBEcmFmdCBFbGVtZW50IE1hbmFnZW1lbnQgLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiBBZGQgZWxlbWVudHMgdG8gZHJhZnQgc3RvcmFnZSAodGVtcG9yYXJ5IGVsZW1lbnRzKVxyXG4gICAqL1xyXG4gIGFkZERyYWZ0RWxlbWVudHMoZWxlbWVudHM6IFdoaXRlYm9hcmRFbGVtZW50W10pOiB2b2lkIHtcclxuICAgIGlmICghZWxlbWVudHM/Lmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgIC8vIENoZWNrIGlmIGFjdGl2ZSBsYXllciBpcyBsb2NrZWRcclxuICAgIGNvbnN0IGFjdGl2ZUxheWVyID0gdGhpcy5sYXllck1hbmFnZW1lbnQuYWN0aXZlTGF5ZXIoKTtcclxuICAgIGlmIChhY3RpdmVMYXllcj8ubG9ja2VkKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihgQ2Fubm90IGRyYXcgb24gbG9ja2VkIGxheWVyOiAke2FjdGl2ZUxheWVyLm5hbWV9YCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBlbGVtZW50c1dpdGhaSW5kZXggPSBlbGVtZW50cy5tYXAoKGVsZW1lbnQpID0+ICh7XHJcbiAgICAgIC4uLmVsZW1lbnQsXHJcbiAgICAgIHpJbmRleDogZWxlbWVudC56SW5kZXggPz8gdGhpcy5nZXROZXh0WkluZGV4KCksXHJcbiAgICB9KSk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVNYXhaSW5kZXgoZWxlbWVudHNXaXRoWkluZGV4KTtcclxuXHJcbiAgICBjb25zdCBjdXJyZW50RHJhZnRFbGVtZW50cyA9IHRoaXMuX2RyYWZ0RWxlbWVudHMoKTtcclxuICAgIGNvbnN0IG5ld0RyYWZ0RWxlbWVudHMgPSBbLi4uY3VycmVudERyYWZ0RWxlbWVudHMsIC4uLmVsZW1lbnRzV2l0aFpJbmRleF07XHJcblxyXG4gICAgdGhpcy5fZHJhZnRFbGVtZW50cy5zZXQobmV3RHJhZnRFbGVtZW50cyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgZHJhZnQgZWxlbWVudHNcclxuICAgKi9cclxuICB1cGRhdGVEcmFmdEVsZW1lbnRzKHVwZGF0ZXM6IFBhcnRpYWw8V2hpdGVib2FyZEVsZW1lbnQ+W10pOiB2b2lkIHtcclxuICAgIGlmICghdXBkYXRlcz8ubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgY3VycmVudERyYWZ0RWxlbWVudHMgPSB0aGlzLl9kcmFmdEVsZW1lbnRzKCk7XHJcbiAgICBjb25zdCB1cGRhdGVzTWFwID0gbmV3IE1hcCh1cGRhdGVzLm1hcCgodXBkYXRlKSA9PiBbdXBkYXRlLmlkLCB1cGRhdGVdKSk7XHJcbiAgICBjb25zdCB1cGRhdGVkRWxlbWVudHM6IFdoaXRlYm9hcmRFbGVtZW50W10gPSBbXTtcclxuXHJcbiAgICBjb25zdCBuZXdEcmFmdEVsZW1lbnRzID0gY3VycmVudERyYWZ0RWxlbWVudHMubWFwKChlbGVtZW50KSA9PiB7XHJcbiAgICAgIGNvbnN0IHVwZGF0ZSA9IHVwZGF0ZXNNYXAuZ2V0KGVsZW1lbnQuaWQpO1xyXG4gICAgICBpZiAodXBkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlZEVsZW1lbnQ6IFdoaXRlYm9hcmRFbGVtZW50ID0geyAuLi5lbGVtZW50LCAuLi51cGRhdGUgfSBhcyBXaGl0ZWJvYXJkRWxlbWVudDtcclxuICAgICAgICB1cGRhdGVkRWxlbWVudHMucHVzaCh1cGRhdGVkRWxlbWVudCk7XHJcbiAgICAgICAgcmV0dXJuIHVwZGF0ZWRFbGVtZW50O1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5fZHJhZnRFbGVtZW50cy5zZXQobmV3RHJhZnRFbGVtZW50cyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmUgZHJhZnQgZWxlbWVudHMgYnkgSURzXHJcbiAgICovXHJcbiAgcmVtb3ZlRHJhZnRFbGVtZW50cyhlbGVtZW50SWRzOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgaWYgKCFlbGVtZW50SWRzPy5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBpZHNUb1JlbW92ZSA9IG5ldyBTZXQoZWxlbWVudElkcyk7XHJcbiAgICBjb25zdCBjdXJyZW50RHJhZnRFbGVtZW50cyA9IHRoaXMuX2RyYWZ0RWxlbWVudHMoKTtcclxuICAgIGNvbnN0IG5ld0RyYWZ0RWxlbWVudHMgPSBjdXJyZW50RHJhZnRFbGVtZW50cy5maWx0ZXIoKGVsZW1lbnQpID0+ICFpZHNUb1JlbW92ZS5oYXMoZWxlbWVudC5pZCkpO1xyXG5cclxuICAgIHRoaXMuX2RyYWZ0RWxlbWVudHMuc2V0KG5ld0RyYWZ0RWxlbWVudHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2xlYXIgYWxsIGRyYWZ0IGVsZW1lbnRzXHJcbiAgICovXHJcbiAgY2xlYXJEcmFmdEVsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5fZHJhZnRFbGVtZW50cy5zZXQoW10pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW92ZSBlbGVtZW50cyBmcm9tIGRyYWZ0IHRvIHBlcnNpc3RlbnQgc3RvcmFnZVxyXG4gICAqL1xyXG4gIGNvbW1pdERyYWZ0RWxlbWVudHMoZWxlbWVudElkcz86IHN0cmluZ1tdKTogV2hpdGVib2FyZEVsZW1lbnRbXSB7XHJcbiAgICBjb25zdCBkcmFmdEVsZW1lbnRzID0gdGhpcy5fZHJhZnRFbGVtZW50cygpO1xyXG4gICAgY29uc3QgZWxlbWVudHNUb0NvbW1pdCA9IGVsZW1lbnRJZHMgPyBkcmFmdEVsZW1lbnRzLmZpbHRlcigoZWwpID0+IGVsZW1lbnRJZHMuaW5jbHVkZXMoZWwuaWQpKSA6IGRyYWZ0RWxlbWVudHM7XHJcblxyXG4gICAgaWYgKGVsZW1lbnRzVG9Db21taXQubGVuZ3RoID09PSAwKSByZXR1cm4gW107XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgYWN0aXZlIGxheWVyIGlzIGxvY2tlZCBiZWZvcmUgY29tbWl0dGluZ1xyXG4gICAgY29uc3QgYWN0aXZlTGF5ZXIgPSB0aGlzLmxheWVyTWFuYWdlbWVudC5hY3RpdmVMYXllcigpO1xyXG4gICAgaWYgKGFjdGl2ZUxheWVyPy5sb2NrZWQpIHtcclxuICAgICAgY29uc29sZS53YXJuKGBDYW5ub3QgY29tbWl0IGVsZW1lbnRzIHRvIGxvY2tlZCBsYXllcjogJHthY3RpdmVMYXllci5uYW1lfWApO1xyXG4gICAgICAvLyBDbGVhciBkcmFmdCBlbGVtZW50cyBzaW5jZSB0aGV5IGNhbid0IGJlIGNvbW1pdHRlZFxyXG4gICAgICB0aGlzLl9kcmFmdEVsZW1lbnRzLnNldChbXSk7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgdG8gcGVyc2lzdGVudCBzdG9yYWdlXHJcbiAgICB0aGlzLmFkZEVsZW1lbnRzKGVsZW1lbnRzVG9Db21taXQpO1xyXG5cclxuICAgIC8vIFJlbW92ZSBmcm9tIGRyYWZ0IHN0b3JhZ2VcclxuICAgIGNvbnN0IHJlbWFpbmluZ0RyYWZ0cyA9IGVsZW1lbnRJZHMgPyBkcmFmdEVsZW1lbnRzLmZpbHRlcigoZWwpID0+ICFlbGVtZW50SWRzLmluY2x1ZGVzKGVsLmlkKSkgOiBbXTtcclxuXHJcbiAgICB0aGlzLl9kcmFmdEVsZW1lbnRzLnNldChyZW1haW5pbmdEcmFmdHMpO1xyXG5cclxuICAgIC8vIFJldHVybiB0aGUgY29tbWl0dGVkIGVsZW1lbnRzIGZvciBwb3RlbnRpYWwgc2VsZWN0aW9uXHJcbiAgICByZXR1cm4gZWxlbWVudHNUb0NvbW1pdDtcclxuICB9XHJcblxyXG4gIC8vIC0tLS0tLS0tLS0gWi1JbmRleCBNYW5hZ2VtZW50IC0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBuZXh0IGF2YWlsYWJsZSB6LWluZGV4XHJcbiAgICovXHJcbiAgZ2V0TmV4dFpJbmRleCgpOiBudW1iZXIge1xyXG4gICAgdGhpcy5fbWF4WkluZGV4LnVwZGF0ZSgoY3VycmVudCkgPT4gY3VycmVudCArIDEpO1xyXG4gICAgcmV0dXJuIHRoaXMuX21heFpJbmRleCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQnJpbmcgZWxlbWVudHMgdG8gZnJvbnQgKHJlc3BlY3RzIGxvY2sgc3RhdHVzKVxyXG4gICAqL1xyXG4gIGJyaW5nVG9Gcm9udChlbGVtZW50SWRzOiBzdHJpbmdbXSwgaWdub3JlTG9jayA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICBpZiAoIWVsZW1lbnRJZHM/Lmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IG5ld1pJbmRleCA9IHRoaXMuZ2V0TmV4dFpJbmRleCgpO1xyXG4gICAgY29uc3QgdXBkYXRlcyA9IGVsZW1lbnRJZHMubWFwKChpZCkgPT4gKHsgaWQsIHpJbmRleDogbmV3WkluZGV4IH0pKTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzKHVwZGF0ZXMsIGlnbm9yZUxvY2spO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2VuZCBlbGVtZW50cyB0byBiYWNrIChyZXNwZWN0cyBsb2NrIHN0YXR1cylcclxuICAgKi9cclxuICBzZW5kVG9CYWNrKGVsZW1lbnRJZHM6IHN0cmluZ1tdLCBpZ25vcmVMb2NrID0gZmFsc2UpOiB2b2lkIHtcclxuICAgIGlmICghZWxlbWVudElkcz8ubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgdXBkYXRlcyA9IGVsZW1lbnRJZHMubWFwKChpZCkgPT4gKHsgaWQsIHpJbmRleDogMCB9KSk7XHJcbiAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzKHVwZGF0ZXMsIGlnbm9yZUxvY2spO1xyXG4gIH1cclxuXHJcbiAgLy8gLS0tLS0tLS0tLSBMb2NrIE1hbmFnZW1lbnQgLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiBMb2NrIGVsZW1lbnRzIHRvIHByZXZlbnQgbW9kaWZpY2F0aW9uc1xyXG4gICAqL1xyXG4gIGxvY2tFbGVtZW50cyhlbGVtZW50SWRzOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgaWYgKCFlbGVtZW50SWRzPy5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBsb2NrSW5mbzogTG9ja0luZm8gPSB7XHJcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcclxuICAgICAgcmVhc29uOiAnVXNlciBsb2NrZWQnLFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBsb2NrcyA9IHRoaXMuX2xvY2tzKCk7XHJcbiAgICBjb25zdCBuZXdMb2NrcyA9IG5ldyBNYXAobG9ja3MpO1xyXG5cclxuICAgIGNvbnN0IHVwZGF0ZXMgPSBlbGVtZW50SWRzLm1hcCgoaWQpID0+IHtcclxuICAgICAgbmV3TG9ja3Muc2V0KGlkLCBsb2NrSW5mbyk7XHJcbiAgICAgIHJldHVybiB7IGlkLCBsb2NrZWQ6IHRydWUgYXMgY29uc3QgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuX2xvY2tzLnNldChuZXdMb2Nrcyk7XHJcbiAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzKHVwZGF0ZXMsIHRydWUpOyAvLyBJZ25vcmUgbG9jayBzdGF0dXMgZm9yIGxvY2tpbmcgb3BlcmF0aW9uXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVbmxvY2sgZWxlbWVudHMgdG8gYWxsb3cgbW9kaWZpY2F0aW9uc1xyXG4gICAqL1xyXG4gIHVubG9ja0VsZW1lbnRzKGVsZW1lbnRJZHM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICBpZiAoIWVsZW1lbnRJZHM/Lmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGxvY2tzID0gdGhpcy5fbG9ja3MoKTtcclxuICAgIGNvbnN0IG5ld0xvY2tzID0gbmV3IE1hcChsb2Nrcyk7XHJcblxyXG4gICAgY29uc3QgdXBkYXRlcyA9IGVsZW1lbnRJZHMubWFwKChpZCkgPT4ge1xyXG4gICAgICBuZXdMb2Nrcy5kZWxldGUoaWQpO1xyXG4gICAgICByZXR1cm4geyBpZCwgbG9ja2VkOiBmYWxzZSBhcyBjb25zdCB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5fbG9ja3Muc2V0KG5ld0xvY2tzKTtcclxuICAgIHRoaXMudXBkYXRlRWxlbWVudHModXBkYXRlcywgdHJ1ZSk7IC8vIElnbm9yZSBsb2NrIHN0YXR1cyBmb3IgdW5sb2NraW5nIG9wZXJhdGlvblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVG9nZ2xlIGxvY2sgc3RhdHVzIG9mIGVsZW1lbnRzXHJcbiAgICovXHJcbiAgdG9nZ2xlRWxlbWVudHNMb2NrKGVsZW1lbnRJZHM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICBpZiAoIWVsZW1lbnRJZHM/Lmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGVsZW1lbnRzVG9Mb2NrOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgY29uc3QgZWxlbWVudHNUb1VubG9jazogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBlbGVtZW50SWRzLmZvckVhY2goKGlkKSA9PiB7XHJcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoZWxlbWVudC5sb2NrZWQpIHtcclxuICAgICAgICAgIGVsZW1lbnRzVG9VbmxvY2sucHVzaChpZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVsZW1lbnRzVG9Mb2NrLnB1c2goaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKGVsZW1lbnRzVG9Mb2NrLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy5sb2NrRWxlbWVudHMoZWxlbWVudHNUb0xvY2spO1xyXG4gICAgfVxyXG4gICAgaWYgKGVsZW1lbnRzVG9VbmxvY2subGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLnVubG9ja0VsZW1lbnRzKGVsZW1lbnRzVG9VbmxvY2spO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9jayBhbGwgZWxlbWVudHNcclxuICAgKi9cclxuICBsb2NrQWxsRWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBhbGxJZHMgPSB0aGlzLl9lbGVtZW50cygpLm1hcCgoZWwpID0+IGVsLmlkKTtcclxuICAgIHRoaXMubG9ja0VsZW1lbnRzKGFsbElkcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVbmxvY2sgYWxsIGVsZW1lbnRzXHJcbiAgICovXHJcbiAgdW5sb2NrQWxsRWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBhbGxJZHMgPSB0aGlzLl9lbGVtZW50cygpLm1hcCgoZWwpID0+IGVsLmlkKTtcclxuICAgIHRoaXMudW5sb2NrRWxlbWVudHMoYWxsSWRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlmIGFuIGVsZW1lbnQgaXMgbG9ja2VkXHJcbiAgICovXHJcbiAgaXNFbGVtZW50TG9ja2VkKGVsZW1lbnRJZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50QnlJZChlbGVtZW50SWQpO1xyXG4gICAgcmV0dXJuIEJvb2xlYW4oZWxlbWVudD8ubG9ja2VkKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBsb2NrZWQgZWxlbWVudCBJRHNcclxuICAgKi9cclxuICBnZXRMb2NrZWRFbGVtZW50SWRzKCk6IHN0cmluZ1tdIHtcclxuICAgIHJldHVybiB0aGlzLmxvY2tlZEVsZW1lbnRzKCkubWFwKChlbCkgPT4gZWwuaWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHVubG9ja2VkIGVsZW1lbnQgSURzXHJcbiAgICovXHJcbiAgZ2V0VW5sb2NrZWRFbGVtZW50SWRzKCk6IHN0cmluZ1tdIHtcclxuICAgIHJldHVybiB0aGlzLnVubG9ja2VkRWxlbWVudHMoKS5tYXAoKGVsKSA9PiBlbC5pZCk7XHJcbiAgfVxyXG5cclxuICAvLyAtLS0tLS0tLS0tIExheWVyIE1hbmFnZW1lbnQgLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIGVsZW1lbnRzIHRvIGEgc3BlY2lmaWMgbGF5ZXIgKHJlc3BlY3RzIGxvY2sgc3RhdHVzKVxyXG4gICAqL1xyXG4gIG1vdmVUb0xheWVyKGVsZW1lbnRJZHM6IHN0cmluZ1tdLCBsYXllcklkOiBzdHJpbmcsIGlnbm9yZUxvY2sgPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgaWYgKCFlbGVtZW50SWRzPy5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCB1cGRhdGVzID0gZWxlbWVudElkcy5tYXAoKGlkKSA9PiAoeyBpZCwgbGF5ZXJJZCB9KSk7XHJcbiAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzKHVwZGF0ZXMsIGlnbm9yZUxvY2spO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGVsZW1lbnRzIGJ5IGxheWVyXHJcbiAgICovXHJcbiAgZ2V0RWxlbWVudHNCeUxheWVyKGxheWVySWQ6IHN0cmluZyk6IFdoaXRlYm9hcmRFbGVtZW50W10ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRzKCkuZmlsdGVyKChlbCkgPT4gZWwubGF5ZXJJZCA9PT0gbGF5ZXJJZCk7XHJcbiAgfVxyXG5cclxuICAvLyAtLS0tLS0tLS0tIFNlYXJjaCBhbmQgUXVlcnkgLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiBGaW5kIGVsZW1lbnQgYnkgSUQgaW4gYm90aCBwZXJzaXN0ZW50IGFuZCBkcmFmdCBlbGVtZW50c1xyXG4gICAqL1xyXG4gIGdldEVsZW1lbnRCeUlkKGlkOiBzdHJpbmcpOiBXaGl0ZWJvYXJkRWxlbWVudCB8IHVuZGVmaW5lZCB7XHJcbiAgICAvLyBTZWFyY2ggaW4gcGVyc2lzdGVudCBlbGVtZW50cyBmaXJzdFxyXG4gICAgY29uc3QgcGVyc2lzdGVudEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50cygpLmZpbmQoKGVsKSA9PiBlbC5pZCA9PT0gaWQpO1xyXG4gICAgaWYgKHBlcnNpc3RlbnRFbGVtZW50KSByZXR1cm4gcGVyc2lzdGVudEVsZW1lbnQ7XHJcblxyXG4gICAgLy8gU2VhcmNoIGluIGRyYWZ0IGVsZW1lbnRzXHJcbiAgICByZXR1cm4gdGhpcy5fZHJhZnRFbGVtZW50cygpLmZpbmQoKGVsKSA9PiBlbC5pZCA9PT0gaWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmluZCBlbGVtZW50cyBieSBJRHNcclxuICAgKi9cclxuICBnZXRFbGVtZW50c0J5SWRzKGlkczogc3RyaW5nW10pOiBXaGl0ZWJvYXJkRWxlbWVudFtdIHtcclxuICAgIGNvbnN0IGlkc1NldCA9IG5ldyBTZXQoaWRzKTtcclxuICAgIGNvbnN0IGFsbEVsZW1lbnRzID0gdGhpcy5hbGxFbGVtZW50cygpO1xyXG4gICAgcmV0dXJuIGFsbEVsZW1lbnRzLmZpbHRlcigoZWwpID0+IGlkc1NldC5oYXMoZWwuaWQpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBlbGVtZW50cyBieSB0eXBlXHJcbiAgICovXHJcbiAgZ2V0RWxlbWVudHNCeVR5cGUodHlwZTogc3RyaW5nKTogV2hpdGVib2FyZEVsZW1lbnRbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudHMoKS5maWx0ZXIoKGVsKSA9PiBlbC50eXBlID09PSB0eXBlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlYXJjaCBlbGVtZW50cyB3aXRoIG11bHRpcGxlIGNyaXRlcmlhXHJcbiAgICovXHJcbiAgc2VhcmNoRWxlbWVudHMoY3JpdGVyaWE6IEVsZW1lbnRTZWFyY2hDcml0ZXJpYSk6IFdoaXRlYm9hcmRFbGVtZW50W10ge1xyXG4gICAgbGV0IHJlc3VsdHMgPSB0aGlzLl9lbGVtZW50cygpO1xyXG5cclxuICAgIGlmIChjcml0ZXJpYS50eXBlKSB7XHJcbiAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcigoZWwpID0+IGVsLnR5cGUgPT09IGNyaXRlcmlhLnR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjcml0ZXJpYS5sYXllcklkKSB7XHJcbiAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcigoZWwpID0+IGVsLmxheWVySWQgPT09IGNyaXRlcmlhLmxheWVySWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjcml0ZXJpYS5sb2NrZWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoKGVsKSA9PiBCb29sZWFuKGVsLmxvY2tlZCkgPT09IGNyaXRlcmlhLmxvY2tlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNyaXRlcmlhLnRleHRDb250ZW50KSB7XHJcbiAgICAgIGNvbnN0IHNlYXJjaFRleHQgPSBjcml0ZXJpYS50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoKGVsKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdGV4dEVsZW1lbnQgPSBlbCBhcyBXaGl0ZWJvYXJkRWxlbWVudCAmIHsgdGV4dD86IHN0cmluZzsgY29udGVudD86IHN0cmluZyB9O1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSAodGV4dEVsZW1lbnQudGV4dCB8fCB0ZXh0RWxlbWVudC5jb250ZW50IHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIHJldHVybiB0ZXh0LmluY2x1ZGVzKHNlYXJjaFRleHQpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY3JpdGVyaWEuekluZGV4UmFuZ2UpIHtcclxuICAgICAgY29uc3QgeyBtaW4sIG1heCB9ID0gY3JpdGVyaWEuekluZGV4UmFuZ2U7XHJcbiAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcigoZWwpID0+IHtcclxuICAgICAgICBjb25zdCB6SW5kZXggPSBlbC56SW5kZXggfHwgMDtcclxuICAgICAgICByZXR1cm4gekluZGV4ID49IG1pbiAmJiB6SW5kZXggPD0gbWF4O1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY3JpdGVyaWEuYm91bmRzKSB7XHJcbiAgICAgIHJlc3VsdHMgPSB0aGlzLmZpbmRFbGVtZW50c0luQm91bmRzKGNyaXRlcmlhLmJvdW5kcykuZmlsdGVyKChlbCkgPT4gcmVzdWx0cy5zb21lKChyKSA9PiByLmlkID09PSBlbC5pZCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHRzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmluZCBlbGVtZW50cyBieSB0ZXh0IGNvbnRlbnRcclxuICAgKi9cclxuICBmaW5kRWxlbWVudHNCeVRleHQoc2VhcmNoVGV4dDogc3RyaW5nKTogV2hpdGVib2FyZEVsZW1lbnRbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5zZWFyY2hFbGVtZW50cyh7IHRleHRDb250ZW50OiBzZWFyY2hUZXh0IH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGVsZW1lbnRzIHdpdGhpbiBhIHJhZGl1cyBvZiBhIHBvaW50XHJcbiAgICovXHJcbiAgZ2V0RWxlbWVudHNJblJhZGl1cyhjZW50ZXJYOiBudW1iZXIsIGNlbnRlclk6IG51bWJlciwgcmFkaXVzOiBudW1iZXIpOiBXaGl0ZWJvYXJkRWxlbWVudFtdIHtcclxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50cygpLmZpbHRlcigoZWxlbWVudCkgPT4ge1xyXG4gICAgICBjb25zdCBkeCA9IGVsZW1lbnQueCAtIGNlbnRlclg7XHJcbiAgICAgIGNvbnN0IGR5ID0gZWxlbWVudC55IC0gY2VudGVyWTtcclxuICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG4gICAgICByZXR1cm4gZGlzdGFuY2UgPD0gcmFkaXVzO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgbmVhcmVzdCBlbGVtZW50IHRvIGEgcG9pbnRcclxuICAgKi9cclxuICBnZXROZWFyZXN0RWxlbWVudCh4OiBudW1iZXIsIHk6IG51bWJlcik6IFdoaXRlYm9hcmRFbGVtZW50IHwgdW5kZWZpbmVkIHtcclxuICAgIGNvbnN0IGVsZW1lbnRzID0gdGhpcy5fZWxlbWVudHMoKTtcclxuICAgIGlmIChlbGVtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1bmRlZmluZWQ7XHJcblxyXG4gICAgbGV0IG5lYXJlc3RFbGVtZW50ID0gZWxlbWVudHNbMF07XHJcbiAgICBsZXQgbWluRGlzdGFuY2UgPSB0aGlzLmdldERpc3RhbmNlVG9FbGVtZW50KHgsIHksIG5lYXJlc3RFbGVtZW50KTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGRpc3RhbmNlID0gdGhpcy5nZXREaXN0YW5jZVRvRWxlbWVudCh4LCB5LCBlbGVtZW50c1tpXSk7XHJcbiAgICAgIGlmIChkaXN0YW5jZSA8IG1pbkRpc3RhbmNlKSB7XHJcbiAgICAgICAgbWluRGlzdGFuY2UgPSBkaXN0YW5jZTtcclxuICAgICAgICBuZWFyZXN0RWxlbWVudCA9IGVsZW1lbnRzW2ldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5lYXJlc3RFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgLy8gLS0tLS0tLS0tLSBTdGF0ZSBNYW5hZ2VtZW50IC0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgc25hcHNob3Qgb2YgY3VycmVudCBzdGF0ZVxyXG4gICAqL1xyXG4gIGNyZWF0ZVNuYXBzaG90KCk6IEVsZW1lbnRzU25hcHNob3Qge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZWxlbWVudHM6IFsuLi50aGlzLl9lbGVtZW50cygpXSxcclxuICAgICAgZHJhZnRFbGVtZW50czogWy4uLnRoaXMuX2RyYWZ0RWxlbWVudHMoKV0sXHJcbiAgICAgIG1heFpJbmRleDogdGhpcy5fbWF4WkluZGV4KCksXHJcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXN0b3JlIHN0YXRlIGZyb20gc25hcHNob3RcclxuICAgKi9cclxuICByZXN0b3JlU25hcHNob3Qoc25hcHNob3Q6IEVsZW1lbnRzU25hcHNob3QpOiB2b2lkIHtcclxuICAgIHRoaXMuX2VsZW1lbnRzLnNldChbLi4uc25hcHNob3QuZWxlbWVudHNdKTtcclxuICAgIHRoaXMuX2RyYWZ0RWxlbWVudHMuc2V0KFsuLi5zbmFwc2hvdC5kcmFmdEVsZW1lbnRzXSk7XHJcbiAgICB0aGlzLl9tYXhaSW5kZXguc2V0KHNuYXBzaG90Lm1heFpJbmRleCk7XHJcbiAgfVxyXG5cclxuICAvLyAtLS0tLS0tLS0tIFV0aWxpdHkgTWV0aG9kcyAtLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIEZpbmQgZWxlbWVudHMgaW50ZXJzZWN0aW5nIHdpdGggYSBib3VuZGFyeVxyXG4gICAqL1xyXG4gIGZpbmRFbGVtZW50c0luQm91bmRzKGJvdW5kczogeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfSk6IFdoaXRlYm9hcmRFbGVtZW50W10ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRzKCkuZmlsdGVyKChlbGVtZW50KSA9PiB7XHJcbiAgICAgIGNvbnN0IGVsZW1lbnRXaWR0aCA9IChlbGVtZW50IGFzIFdoaXRlYm9hcmRFbGVtZW50ICYgeyB3aWR0aD86IG51bWJlciB9KS53aWR0aCB8fCA1MDtcclxuICAgICAgY29uc3QgZWxlbWVudEhlaWdodCA9IChlbGVtZW50IGFzIFdoaXRlYm9hcmRFbGVtZW50ICYgeyBoZWlnaHQ/OiBudW1iZXIgfSkuaGVpZ2h0IHx8IDUwO1xyXG5cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICBlbGVtZW50LnggPCBib3VuZHMueCArIGJvdW5kcy53aWR0aCAmJlxyXG4gICAgICAgIGVsZW1lbnQueCArIGVsZW1lbnRXaWR0aCA+IGJvdW5kcy54ICYmXHJcbiAgICAgICAgZWxlbWVudC55IDwgYm91bmRzLnkgKyBib3VuZHMuaGVpZ2h0ICYmXHJcbiAgICAgICAgZWxlbWVudC55ICsgZWxlbWVudEhlaWdodCA+IGJvdW5kcy55XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGN1bGF0ZSBjb21iaW5lZCBib3VuZHMgb2YgbXVsdGlwbGUgZWxlbWVudHNcclxuICAgKi9cclxuICBjYWxjdWxhdGVFbGVtZW50c0JvdW5kcyhlbGVtZW50czogV2hpdGVib2FyZEVsZW1lbnRbXSk6IHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbiAgICBoZWlnaHQ6IG51bWJlcjtcclxuICAgIGNlbnRlclg6IG51bWJlcjtcclxuICAgIGNlbnRlclk6IG51bWJlcjtcclxuICB9IHwgbnVsbCB7XHJcbiAgICBpZiAoZWxlbWVudHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFsbEJvdW5kcyA9IGVsZW1lbnRzLm1hcChnZXRFbGVtZW50Qm91bmRzKTtcclxuXHJcbiAgICBjb25zdCBtaW5YID0gTWF0aC5taW4oLi4uYWxsQm91bmRzLm1hcCgoYikgPT4gYi5taW5YKSk7XHJcbiAgICBjb25zdCBtaW5ZID0gTWF0aC5taW4oLi4uYWxsQm91bmRzLm1hcCgoYikgPT4gYi5taW5ZKSk7XHJcbiAgICBjb25zdCBtYXhYID0gTWF0aC5tYXgoLi4uYWxsQm91bmRzLm1hcCgoYikgPT4gYi5tYXhYKSk7XHJcbiAgICBjb25zdCBtYXhZID0gTWF0aC5tYXgoLi4uYWxsQm91bmRzLm1hcCgoYikgPT4gYi5tYXhZKSk7XHJcblxyXG4gICAgY29uc3Qgd2lkdGggPSBtYXhYIC0gbWluWDtcclxuICAgIGNvbnN0IGhlaWdodCA9IG1heFkgLSBtaW5ZO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IG1pblgsXHJcbiAgICAgIHk6IG1pblksXHJcbiAgICAgIHdpZHRoLFxyXG4gICAgICBoZWlnaHQsXHJcbiAgICAgIGNlbnRlclg6IG1pblggKyB3aWR0aCAvIDIsXHJcbiAgICAgIGNlbnRlclk6IG1pblkgKyBoZWlnaHQgLyAyLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBlbGVtZW50cyBjb3VudCAodXNlIGNvbXB1dGVkIHNpZ25hbCBmb3IgcmVhY3Rpdml0eSlcclxuICAgKi9cclxuICBnZXRFbGVtZW50c0NvdW50KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50c0NvdW50KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdW5pcXVlIGVsZW1lbnQgdHlwZXMgKHVzZSBjb21wdXRlZCBzaWduYWwgZm9yIHJlYWN0aXZpdHkpXHJcbiAgICovXHJcbiAgZ2V0RWxlbWVudFR5cGVzKCk6IHN0cmluZ1tdIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnRUeXBlcygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTm9ybWFsaXplIHotaW5kaWNlcyB0byBzZXF1ZW50aWFsIGludGVnZXJzXHJcbiAgICovXHJcbiAgbm9ybWFsaXplWkluZGljZXMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBlbGVtZW50cyA9IFsuLi50aGlzLl9lbGVtZW50cygpXS5zb3J0KChhLCBiKSA9PiAoYS56SW5kZXggfHwgMCkgLSAoYi56SW5kZXggfHwgMCkpO1xyXG5cclxuICAgIGNvbnN0IHVwZGF0ZXMgPSBlbGVtZW50cy5tYXAoKGVsZW1lbnQsIGluZGV4KSA9PiAoe1xyXG4gICAgICBpZDogZWxlbWVudC5pZCxcclxuICAgICAgekluZGV4OiBpbmRleCArIDEsXHJcbiAgICB9KSk7XHJcblxyXG4gICAgdGhpcy5fbWF4WkluZGV4LnNldChlbGVtZW50cy5sZW5ndGgpO1xyXG4gICAgdGhpcy51cGRhdGVFbGVtZW50cyh1cGRhdGVzLCB0cnVlKTtcclxuICB9XHJcblxyXG4gIC8vIC0tLS0tLS0tLS0gQ29udmVuaWVuY2UgTWV0aG9kcyAtLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZCBhIHNpbmdsZSBlbGVtZW50IChjb252ZW5pZW5jZSBtZXRob2QpXHJcbiAgICovXHJcbiAgYWRkRWxlbWVudChlbGVtZW50OiBXaGl0ZWJvYXJkRWxlbWVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5hZGRFbGVtZW50cyhbZWxlbWVudF0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIGEgc2luZ2xlIGVsZW1lbnQgKGNvbnZlbmllbmNlIG1ldGhvZCwgcmVzcGVjdHMgbG9jayBzdGF0dXMpXHJcbiAgICovXHJcbiAgdXBkYXRlRWxlbWVudCh1cGRhdGU6IFBhcnRpYWw8V2hpdGVib2FyZEVsZW1lbnQ+ICYgeyBpZDogc3RyaW5nIH0sIGlnbm9yZUxvY2sgPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgdGhpcy51cGRhdGVFbGVtZW50cyhbdXBkYXRlXSwgaWdub3JlTG9jayk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmUgYSBzaW5nbGUgZWxlbWVudCAoY29udmVuaWVuY2UgbWV0aG9kLCByZXNwZWN0cyBsb2NrIHN0YXR1cylcclxuICAgKi9cclxuICByZW1vdmVFbGVtZW50KGVsZW1lbnQ6IFdoaXRlYm9hcmRFbGVtZW50LCBpZ25vcmVMb2NrID0gZmFsc2UpOiB2b2lkIHtcclxuICAgIHRoaXMucmVtb3ZlRWxlbWVudHNCeUlkcyhbZWxlbWVudC5pZF0sIGlnbm9yZUxvY2spO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgaWYgYSBzcGVjaWZpYyBlbGVtZW50IGV4aXN0c1xyXG4gICAqL1xyXG4gIGVsZW1lbnRFeGlzdHMoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudEJ5SWQoaWQpICE9PSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgZWxlbWVudHMgd2l0aGluIGEgc3BlY2lmaWMgei1pbmRleCByYW5nZVxyXG4gICAqL1xyXG4gIGdldEVsZW1lbnRzQnlaSW5kZXhSYW5nZShtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBXaGl0ZWJvYXJkRWxlbWVudFtdIHtcclxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50cygpLmZpbHRlcigoZWwpID0+IHtcclxuICAgICAgY29uc3QgekluZGV4ID0gZWwuekluZGV4IHx8IDA7XHJcbiAgICAgIHJldHVybiB6SW5kZXggPj0gbWluICYmIHpJbmRleCA8PSBtYXg7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBlbGVtZW50cyB3aXRoIHNwZWNpZmljIHByb3BlcnRpZXNcclxuICAgKi9cclxuICBnZXRFbGVtZW50c0J5UHJvcGVydHk8SyBleHRlbmRzIGtleW9mIFdoaXRlYm9hcmRFbGVtZW50PihcclxuICAgIHByb3BlcnR5OiBLLFxyXG4gICAgdmFsdWU6IFdoaXRlYm9hcmRFbGVtZW50W0tdXHJcbiAgKTogV2hpdGVib2FyZEVsZW1lbnRbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudHMoKS5maWx0ZXIoKGVsKSA9PiBlbFtwcm9wZXJ0eV0gPT09IHZhbHVlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIExvY2sgYSBzaW5nbGUgZWxlbWVudFxyXG4gICAqL1xyXG4gIGxvY2tFbGVtZW50KGVsZW1lbnRJZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLmxvY2tFbGVtZW50cyhbZWxlbWVudElkXSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVbmxvY2sgYSBzaW5nbGUgZWxlbWVudFxyXG4gICAqL1xyXG4gIHVubG9ja0VsZW1lbnQoZWxlbWVudElkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMudW5sb2NrRWxlbWVudHMoW2VsZW1lbnRJZF0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVG9nZ2xlIGxvY2sgc3RhdHVzIG9mIGEgc2luZ2xlIGVsZW1lbnRcclxuICAgKi9cclxuICB0b2dnbGVFbGVtZW50TG9jayhlbGVtZW50SWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy50b2dnbGVFbGVtZW50c0xvY2soW2VsZW1lbnRJZF0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IG1vZGlmaWFibGUgZWxlbWVudHMgKHVubG9ja2VkIGVsZW1lbnRzKVxyXG4gICAqL1xyXG4gIGdldE1vZGlmaWFibGVFbGVtZW50cygpOiBXaGl0ZWJvYXJkRWxlbWVudFtdIHtcclxuICAgIHJldHVybiB0aGlzLnVubG9ja2VkRWxlbWVudHMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlmIGFueSBvZiB0aGUgZ2l2ZW4gZWxlbWVudHMgYXJlIGxvY2tlZFxyXG4gICAqL1xyXG4gIGhhc0xvY2tlZEVsZW1lbnRzSW5TZWxlY3Rpb24oZWxlbWVudElkczogc3RyaW5nW10pOiBib29sZWFuIHtcclxuICAgIHJldHVybiBlbGVtZW50SWRzLnNvbWUoKGlkKSA9PiB0aGlzLmlzRWxlbWVudExvY2tlZChpZCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmlsdGVyIG91dCBsb2NrZWQgZWxlbWVudHMgZnJvbSBhIHNlbGVjdGlvblxyXG4gICAqL1xyXG4gIGZpbHRlclVubG9ja2VkRWxlbWVudHMoZWxlbWVudElkczogc3RyaW5nW10pOiBzdHJpbmdbXSB7XHJcbiAgICByZXR1cm4gZWxlbWVudElkcy5maWx0ZXIoKGlkKSA9PiAhdGhpcy5pc0VsZW1lbnRMb2NrZWQoaWQpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBlbGVtZW50cyB0aGF0IGNhbiBiZSBzYWZlbHkgbW9kaWZpZWQgKHJlc3BlY3RzIGxvY2sgc3RhdHVzKVxyXG4gICAqL1xyXG4gIGdldE1vZGlmaWFibGVFbGVtZW50c0Zyb21JZHMoZWxlbWVudElkczogc3RyaW5nW10pOiBXaGl0ZWJvYXJkRWxlbWVudFtdIHtcclxuICAgIGNvbnN0IHVubG9ja2VkID0gdGhpcy5maWx0ZXJVbmxvY2tlZEVsZW1lbnRzKGVsZW1lbnRJZHMpO1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudHNCeUlkcyh1bmxvY2tlZCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTYWZlbHkgdXBkYXRlIG11bHRpcGxlIGVsZW1lbnRzICh3YXJucyBhYm91dCBsb2NrZWQgZWxlbWVudHMpXHJcbiAgICovXHJcbiAgc2FmZVVwZGF0ZUVsZW1lbnRzKHVwZGF0ZXM6IFBhcnRpYWw8V2hpdGVib2FyZEVsZW1lbnQ+ICYgeyBpZDogc3RyaW5nIH1bXSk6IExvY2tPcGVyYXRpb25SZXN1bHQge1xyXG4gICAgY29uc3QgbG9ja2VkOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgY29uc3QgdXBkYXRlZDogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBjb25zdCBzYWZlVXBkYXRlcyA9IHVwZGF0ZXMuZmlsdGVyKCh1cGRhdGUpID0+IHtcclxuICAgICAgaWYgKHRoaXMuaXNFbGVtZW50TG9ja2VkKHVwZGF0ZS5pZCkpIHtcclxuICAgICAgICBsb2NrZWQucHVzaCh1cGRhdGUuaWQpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB1cGRhdGVkLnB1c2godXBkYXRlLmlkKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHNhZmVVcGRhdGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy51cGRhdGVFbGVtZW50cyhzYWZlVXBkYXRlcywgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7IHVwZGF0ZWQsIGxvY2tlZCB9O1xyXG4gIH1cclxuXHJcbiAgLy8gLS0tLS0tLS0tLSBQcml2YXRlIEhlbHBlciBNZXRob2RzIC0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgaWYgYW4gdXBkYXRlIG9wZXJhdGlvbiBpcyBhIGxvY2stcmVsYXRlZCBvcGVyYXRpb25cclxuICAgKi9cclxuICBwcml2YXRlIGlzTG9ja09wZXJhdGlvbih1cGRhdGU6IFBhcnRpYWw8V2hpdGVib2FyZEVsZW1lbnQ+KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gJ2xvY2tlZCcgaW4gdXBkYXRlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIHRoZSBtYXhpbXVtIHotaW5kZXggYmFzZWQgb24gZWxlbWVudHNcclxuICAgKi9cclxuICBwcml2YXRlIHVwZGF0ZU1heFpJbmRleChlbGVtZW50czogV2hpdGVib2FyZEVsZW1lbnRbXSk6IHZvaWQge1xyXG4gICAgY29uc3QgbWF4WiA9IE1hdGgubWF4KC4uLmVsZW1lbnRzLm1hcCgoZWwpID0+IGVsLnpJbmRleCB8fCAwKSk7XHJcbiAgICB0aGlzLl9tYXhaSW5kZXgudXBkYXRlKChjdXJyZW50KSA9PiBNYXRoLm1heChjdXJyZW50LCBtYXhaKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgZGlzdGFuY2UgZnJvbSBwb2ludCB0byBlbGVtZW50XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXREaXN0YW5jZVRvRWxlbWVudCh4OiBudW1iZXIsIHk6IG51bWJlciwgZWxlbWVudDogV2hpdGVib2FyZEVsZW1lbnQpOiBudW1iZXIge1xyXG4gICAgY29uc3QgZWxlbWVudFdpZHRoID0gKGVsZW1lbnQgYXMgV2hpdGVib2FyZEVsZW1lbnQgJiB7IHdpZHRoPzogbnVtYmVyIH0pLndpZHRoIHx8IDUwO1xyXG4gICAgY29uc3QgZWxlbWVudEhlaWdodCA9IChlbGVtZW50IGFzIFdoaXRlYm9hcmRFbGVtZW50ICYgeyBoZWlnaHQ/OiBudW1iZXIgfSkuaGVpZ2h0IHx8IDUwO1xyXG5cclxuICAgIGNvbnN0IGNlbnRlclggPSBlbGVtZW50LnggKyBlbGVtZW50V2lkdGggLyAyO1xyXG4gICAgY29uc3QgY2VudGVyWSA9IGVsZW1lbnQueSArIGVsZW1lbnRIZWlnaHQgLyAyO1xyXG5cclxuICAgIGNvbnN0IGR4ID0geCAtIGNlbnRlclg7XHJcbiAgICBjb25zdCBkeSA9IHkgLSBjZW50ZXJZO1xyXG5cclxuICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG4gIH1cclxufVxyXG4iXX0=