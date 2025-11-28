import { EventBusService } from '../event-bus';
import { WhiteboardElement } from '../types';
import * as i0 from "@angular/core";
export interface LockInfo {
    timestamp: number;
    reason?: string;
}
export interface ElementsSnapshot {
    elements: WhiteboardElement[];
    draftElements: WhiteboardElement[];
    maxZIndex: number;
    timestamp?: number;
}
export interface LockOperationResult {
    updated: string[];
    locked: string[];
}
export interface LockStats {
    total: number;
    locked: number;
    unlocked: number;
    lockPercentage: number;
    allLocked: boolean;
    noneLocked: boolean;
}
export interface ElementTransformation {
    translation?: {
        x: number;
        y: number;
    };
    rotation?: number;
    scale?: {
        x: number;
        y: number;
    };
    opacity?: number;
}
export interface ElementSearchCriteria {
    type?: string;
    layerId?: string;
    locked?: boolean;
    textContent?: string;
    zIndexRange?: {
        min: number;
        max: number;
    };
    bounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
export declare class ElementsService {
    private eventBus;
    private historyService;
    private layerManagement;
    private readonly _elements;
    private readonly _draftElements;
    private readonly _maxZIndex;
    private readonly _locks;
    constructor(eventBus: EventBusService);
    readonly elements: import("@angular/core").Signal<WhiteboardElement[]>;
    /**
     * Signal containing all draft (temporary) elements
     */
    readonly draftElements: import("@angular/core").Signal<WhiteboardElement[]>;
    /**
     * Computed signal containing all elements (persistent + draft)
     */
    readonly allElements: import("@angular/core").Signal<WhiteboardElement[]>;
    /**
     * Computed signal for elements count
     */
    readonly elementsCount: import("@angular/core").Signal<number>;
    /**
     * Computed signal checking if elements exist
     */
    readonly hasElements: import("@angular/core").Signal<boolean>;
    /**
     * Computed signal for unique element types
     */
    readonly elementTypes: import("@angular/core").Signal<import("../types").ElementType[]>;
    /**
     * Computed signal for elements by type
     */
    readonly elementsByType: import("@angular/core").Signal<Map<string, WhiteboardElement[]>>;
    /**
     * Computed signal for max z-index
     */
    readonly maxZIndex: import("@angular/core").Signal<number>;
    /**
     * Computed signal for elements sorted by z-index
     */
    readonly elementsByZIndex: import("@angular/core").Signal<WhiteboardElement[]>;
    /**
     * Computed signal for locked elements
     */
    readonly lockedElements: import("@angular/core").Signal<WhiteboardElement[]>;
    /**
     * Computed signal for unlocked elements
     */
    readonly unlockedElements: import("@angular/core").Signal<WhiteboardElement[]>;
    /**
     * Computed signal for locked elements count
     */
    readonly lockedElementsCount: import("@angular/core").Signal<number>;
    /**
     * Computed signal checking if any elements are locked
     */
    readonly hasLockedElements: import("@angular/core").Signal<boolean>;
    /**
     * Computed signal for lock statistics
     */
    readonly lockStats: import("@angular/core").Signal<{
        total: number;
        locked: number;
        unlocked: number;
        lockPercentage: number;
        allLocked: boolean;
        noneLocked: boolean;
    }>;
    /**
     * Signal containing element locks
     */
    readonly locks: import("@angular/core").Signal<Map<string, LockInfo>>;
    /**
     * Get current persistent elements snapshot
     */
    getElements(): WhiteboardElement[];
    /**
     * Get current draft elements snapshot
     */
    getDraftElements(): WhiteboardElement[];
    /**
     * Get all elements (persistent + draft) snapshot
     */
    getAllElements(): WhiteboardElement[];
    /**
     * Add elements to persistent storage
     */
    addElements(elements: WhiteboardElement[]): void;
    /**
     * Update existing elements (respects lock status)
     */
    updateElements(updates: Partial<WhiteboardElement> & {
        id: string;
    }[], ignoreLock?: boolean): void;
    /**
     * Remove elements by IDs (respects lock status)
     */
    removeElementsByIds(elementIds: string[], ignoreLock?: boolean): void;
    /**
     * Remove elements (simplified interface, respects lock status)
     */
    removeElements(elements: WhiteboardElement[], ignoreLock?: boolean): void;
    /**
     * Clear all persistent elements
     */
    clear(): void;
    /**
     * Set all persistent elements (replaces current elements)
     */
    setElements(elements: WhiteboardElement[]): void;
    /**
     * Add elements to draft storage (temporary elements)
     */
    addDraftElements(elements: WhiteboardElement[]): void;
    /**
     * Update draft elements
     */
    updateDraftElements(updates: Partial<WhiteboardElement>[]): void;
    /**
     * Remove draft elements by IDs
     */
    removeDraftElements(elementIds: string[]): void;
    /**
     * Clear all draft elements
     */
    clearDraftElements(): void;
    /**
     * Move elements from draft to persistent storage
     */
    commitDraftElements(elementIds?: string[]): WhiteboardElement[];
    /**
     * Get the next available z-index
     */
    getNextZIndex(): number;
    /**
     * Bring elements to front (respects lock status)
     */
    bringToFront(elementIds: string[], ignoreLock?: boolean): void;
    /**
     * Send elements to back (respects lock status)
     */
    sendToBack(elementIds: string[], ignoreLock?: boolean): void;
    /**
     * Lock elements to prevent modifications
     */
    lockElements(elementIds: string[]): void;
    /**
     * Unlock elements to allow modifications
     */
    unlockElements(elementIds: string[]): void;
    /**
     * Toggle lock status of elements
     */
    toggleElementsLock(elementIds: string[]): void;
    /**
     * Lock all elements
     */
    lockAllElements(): void;
    /**
     * Unlock all elements
     */
    unlockAllElements(): void;
    /**
     * Check if an element is locked
     */
    isElementLocked(elementId: string): boolean;
    /**
     * Get locked element IDs
     */
    getLockedElementIds(): string[];
    /**
     * Get unlocked element IDs
     */
    getUnlockedElementIds(): string[];
    /**
     * Move elements to a specific layer (respects lock status)
     */
    moveToLayer(elementIds: string[], layerId: string, ignoreLock?: boolean): void;
    /**
     * Get elements by layer
     */
    getElementsByLayer(layerId: string): WhiteboardElement[];
    /**
     * Find element by ID in both persistent and draft elements
     */
    getElementById(id: string): WhiteboardElement | undefined;
    /**
     * Find elements by IDs
     */
    getElementsByIds(ids: string[]): WhiteboardElement[];
    /**
     * Get elements by type
     */
    getElementsByType(type: string): WhiteboardElement[];
    /**
     * Search elements with multiple criteria
     */
    searchElements(criteria: ElementSearchCriteria): WhiteboardElement[];
    /**
     * Find elements by text content
     */
    findElementsByText(searchText: string): WhiteboardElement[];
    /**
     * Get elements within a radius of a point
     */
    getElementsInRadius(centerX: number, centerY: number, radius: number): WhiteboardElement[];
    /**
     * Get nearest element to a point
     */
    getNearestElement(x: number, y: number): WhiteboardElement | undefined;
    /**
     * Create a snapshot of current state
     */
    createSnapshot(): ElementsSnapshot;
    /**
     * Restore state from snapshot
     */
    restoreSnapshot(snapshot: ElementsSnapshot): void;
    /**
     * Find elements intersecting with a boundary
     */
    findElementsInBounds(bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): WhiteboardElement[];
    /**
     * Calculate combined bounds of multiple elements
     */
    calculateElementsBounds(elements: WhiteboardElement[]): {
        x: number;
        y: number;
        width: number;
        height: number;
        centerX: number;
        centerY: number;
    } | null;
    /**
     * Get elements count (use computed signal for reactivity)
     */
    getElementsCount(): number;
    /**
     * Get unique element types (use computed signal for reactivity)
     */
    getElementTypes(): string[];
    /**
     * Normalize z-indices to sequential integers
     */
    normalizeZIndices(): void;
    /**
     * Add a single element (convenience method)
     */
    addElement(element: WhiteboardElement): void;
    /**
     * Update a single element (convenience method, respects lock status)
     */
    updateElement(update: Partial<WhiteboardElement> & {
        id: string;
    }, ignoreLock?: boolean): void;
    /**
     * Remove a single element (convenience method, respects lock status)
     */
    removeElement(element: WhiteboardElement, ignoreLock?: boolean): void;
    /**
     * Check if a specific element exists
     */
    elementExists(id: string): boolean;
    /**
     * Get elements within a specific z-index range
     */
    getElementsByZIndexRange(min: number, max: number): WhiteboardElement[];
    /**
     * Get elements with specific properties
     */
    getElementsByProperty<K extends keyof WhiteboardElement>(property: K, value: WhiteboardElement[K]): WhiteboardElement[];
    /**
     * Lock a single element
     */
    lockElement(elementId: string): void;
    /**
     * Unlock a single element
     */
    unlockElement(elementId: string): void;
    /**
     * Toggle lock status of a single element
     */
    toggleElementLock(elementId: string): void;
    /**
     * Get modifiable elements (unlocked elements)
     */
    getModifiableElements(): WhiteboardElement[];
    /**
     * Check if any of the given elements are locked
     */
    hasLockedElementsInSelection(elementIds: string[]): boolean;
    /**
     * Filter out locked elements from a selection
     */
    filterUnlockedElements(elementIds: string[]): string[];
    /**
     * Get elements that can be safely modified (respects lock status)
     */
    getModifiableElementsFromIds(elementIds: string[]): WhiteboardElement[];
    /**
     * Safely update multiple elements (warns about locked elements)
     */
    safeUpdateElements(updates: Partial<WhiteboardElement> & {
        id: string;
    }[]): LockOperationResult;
    /**
     * Check if an update operation is a lock-related operation
     */
    private isLockOperation;
    /**
     * Update the maximum z-index based on elements
     */
    private updateMaxZIndex;
    /**
     * Get distance from point to element
     */
    private getDistanceToElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<ElementsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ElementsService>;
}
