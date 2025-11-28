import { Injectable, signal, computed } from '@angular/core';
import { BLEND_MODES } from '../types';
import * as i0 from "@angular/core";
export class LayerManagementService {
    // Core state signals
    _layers = signal([]);
    _activeLayerId = signal('');
    // Public readonly signals
    layers = this._layers.asReadonly();
    activeLayerId = this._activeLayerId.asReadonly();
    // Computed selectors
    activeLayer = computed(() => {
        const layers = this._layers();
        const activeId = this._activeLayerId();
        return layers.find((layer) => layer.id === activeId) || layers[0];
    });
    sortedLayers = computed(() => {
        return [...this._layers()].sort((a, b) => a.zIndex - b.zIndex);
    });
    visibleLayers = computed(() => {
        return this._layers().filter((layer) => layer.visible);
    });
    unlockedLayers = computed(() => {
        return this._layers().filter((layer) => !layer.locked);
    });
    constructor() {
        this.initializeDefaultLayer();
    }
    /**
     * Add a new layer
     */
    addLayer(name) {
        const layers = this._layers();
        const newZIndex = Math.max(...layers.map((l) => l.zIndex), 0) + 1;
        const layerCount = layers.length + 1;
        const newLayer = {
            id: this.generateLayerId(),
            name: name || `Layer ${layerCount}`,
            visible: true,
            locked: false,
            zIndex: newZIndex,
            elements: [],
            opacity: 1,
            blendMode: 'normal',
        };
        // Make all other layers invisible
        const updatedLayers = layers.map((layer) => ({
            ...layer,
            visible: false,
        }));
        this._layers.set([...updatedLayers, newLayer]);
        this.setActiveLayer(newLayer.id);
        return newLayer;
    }
    /**
     * Remove a layer (prevents deletion of last layer)
     */
    removeLayer(id) {
        const layers = this._layers();
        // Prevent deletion of last remaining layer
        if (layers.length <= 1) {
            console.warn('Cannot delete the last remaining layer');
            return false;
        }
        const layerToRemove = layers.find((l) => l.id === id);
        if (!layerToRemove) {
            console.warn(`Layer with id ${id} not found`);
            return false;
        }
        // Remove layer
        const updatedLayers = layers.filter((l) => l.id !== id);
        this._layers.set(updatedLayers);
        // If active layer was removed, set new active layer
        if (this._activeLayerId() === id) {
            const newActiveLayer = updatedLayers[Math.max(0, updatedLayers.length - 1)];
            this.setActiveLayer(newActiveLayer.id);
        }
        return true;
    }
    /**
     * Rename a layer
     */
    renameLayer(id, name) {
        const layers = this._layers();
        const layerIndex = layers.findIndex((l) => l.id === id);
        if (layerIndex === -1) {
            console.warn(`Layer with id ${id} not found`);
            return false;
        }
        // Prevent renaming locked layers
        if (layers[layerIndex].locked) {
            console.warn(`Cannot rename locked layer: ${layers[layerIndex].name}`);
            return false;
        }
        const updatedLayers = [...layers];
        updatedLayers[layerIndex] = {
            ...updatedLayers[layerIndex],
            name: name.trim() || `Layer ${layerIndex + 1}`,
        };
        this._layers.set(updatedLayers);
        return true;
    }
    /**
     * Reorder layer by changing zIndex
     */
    reorderLayer(id, newZIndex) {
        const layers = this._layers();
        const layerIndex = layers.findIndex((l) => l.id === id);
        if (layerIndex === -1) {
            console.warn(`Layer with id ${id} not found`);
            return false;
        }
        // Prevent reordering locked layers
        if (layers[layerIndex].locked) {
            console.warn(`Cannot reorder locked layer: ${layers[layerIndex].name}`);
            return false;
        }
        const updatedLayers = [...layers];
        updatedLayers[layerIndex] = {
            ...updatedLayers[layerIndex],
            zIndex: newZIndex,
        };
        this._layers.set(updatedLayers);
        return true;
    }
    /**
     * Move layer up in z-order
     */
    moveLayerUp(id) {
        const layers = this.sortedLayers();
        const currentIndex = layers.findIndex((l) => l.id === id);
        if (currentIndex === -1 || currentIndex === layers.length - 1) {
            return false; // Layer not found or already at top
        }
        const currentLayer = layers[currentIndex];
        // Prevent moving locked layers
        if (currentLayer.locked) {
            console.warn(`Cannot move locked layer: ${currentLayer.name}`);
            return false;
        }
        const nextLayer = layers[currentIndex + 1];
        // Swap z-indices
        return this.reorderLayer(currentLayer.id, nextLayer.zIndex) && this.reorderLayer(nextLayer.id, currentLayer.zIndex);
    }
    /**
     * Move layer down in z-order
     */
    moveLayerDown(id) {
        const layers = this.sortedLayers();
        const currentIndex = layers.findIndex((l) => l.id === id);
        if (currentIndex === -1 || currentIndex === 0) {
            return false; // Layer not found or already at bottom
        }
        const currentLayer = layers[currentIndex];
        // Prevent moving locked layers
        if (currentLayer.locked) {
            console.warn(`Cannot move locked layer: ${currentLayer.name}`);
            return false;
        }
        const prevLayer = layers[currentIndex - 1];
        // Swap z-indices
        return this.reorderLayer(currentLayer.id, prevLayer.zIndex) && this.reorderLayer(prevLayer.id, currentLayer.zIndex);
    }
    /**
     * Reorder layers by moving a layer from one position to another
     * This properly reassigns zIndex values based on the new order
     *
     * @param previousIndex - Current index in the layers array
     * @param currentIndex - Target index in the layers array
     * @returns true if successful, false otherwise
     */
    reorderLayersByIndex(previousIndex, currentIndex) {
        const layers = this._layers();
        if (previousIndex === currentIndex) {
            return false; // No change needed
        }
        if (previousIndex < 0 || previousIndex >= layers.length || currentIndex < 0 || currentIndex >= layers.length) {
            console.warn('Invalid layer indices for reordering');
            return false;
        }
        const layerToMove = layers[previousIndex];
        // Prevent moving locked layers
        if (layerToMove.locked) {
            console.warn(`Cannot reorder locked layer: ${layerToMove.name}`);
            return false;
        }
        // Create new array with the layer moved to its new position
        const reorderedLayers = [...layers];
        reorderedLayers.splice(previousIndex, 1); // Remove from old position
        reorderedLayers.splice(currentIndex, 0, layerToMove); // Insert at new position
        // Reassign zIndex values based on new array order
        // Lower index = higher zIndex (renders on top)
        const updatedLayers = reorderedLayers.map((layer, index) => ({
            ...layer,
            zIndex: reorderedLayers.length - 1 - index, // Reverse: first item gets highest zIndex
        }));
        this._layers.set(updatedLayers);
        return true;
    }
    /**
     * Toggle layer visibility
     */
    toggleLayerVisibility(id) {
        return this.updateLayerProperty(id, 'visible', (current) => !current);
    }
    /**
     * Toggle layer lock state
     *
     * Behavior:
     * - Allows locking/unlocking any layer including the active layer
     * - When active layer is locked, drawing will be disabled but layer remains active
     */
    toggleLayerLock(id) {
        const layers = this._layers();
        const layer = layers.find((l) => l.id === id);
        if (!layer) {
            console.warn(`Layer with id ${id} not found`);
            return false;
        }
        return this.updateLayerProperty(id, 'locked', (current) => !current);
    }
    /**
     * Set layer opacity
     */
    setLayerOpacity(id, opacity) {
        const layers = this._layers();
        const layer = layers.find((l) => l.id === id);
        if (!layer) {
            console.warn(`Layer with id ${id} not found`);
            return false;
        }
        // Prevent changing opacity of locked layers
        if (layer.locked) {
            console.warn(`Cannot change opacity of locked layer: ${layer.name}`);
            return false;
        }
        const clampedOpacity = Math.max(0, Math.min(1, opacity));
        return this.updateLayerProperty(id, 'opacity', () => clampedOpacity);
    }
    /**
     * Set layer blend mode
     */
    setLayerBlendMode(id, blendMode) {
        const layers = this._layers();
        const layer = layers.find((l) => l.id === id);
        if (!layer) {
            console.warn(`Layer with id ${id} not found`);
            return false;
        }
        // Prevent changing blend mode of locked layers
        if (layer.locked) {
            console.warn(`Cannot change blend mode of locked layer: ${layer.name}`);
            return false;
        }
        // Validate blend mode
        const validBlendModes = BLEND_MODES.map((mode) => mode.value);
        if (!validBlendModes.includes(blendMode)) {
            console.warn(`Invalid blend mode: ${blendMode}. Using 'normal' instead.`);
            return this.updateLayerProperty(id, 'blendMode', () => 'normal');
        }
        return this.updateLayerProperty(id, 'blendMode', () => blendMode);
    }
    /**
     * Set the active layer
     *
     * Behavior:
     * - Allows activating any layer including locked layers
     * - When a locked layer is active, drawing will be disabled
     * - Makes all other layers invisible when a layer is activated
     * - This ensures only the active layer is visible
     */
    setActiveLayer(id) {
        const layers = this._layers();
        const layer = layers.find((l) => l.id === id);
        if (!layer) {
            console.warn(`Layer with id ${id} not found`);
            return false;
        }
        // Make all layers invisible except the one being activated
        const updatedLayers = layers.map((l) => ({
            ...l,
            visible: l.id === id,
        }));
        this._layers.set(updatedLayers);
        this._activeLayerId.set(id);
        return true;
    }
    /**
     * Get the active layer ID
     */
    getActiveLayerId() {
        return this._activeLayerId();
    }
    /**
     * Check if the active layer is in a valid drawing state
     * Valid means: exists, visible, and unlocked
     */
    isActiveLayerValid() {
        const active = this.activeLayer();
        return !!active && active.visible && !active.locked;
    }
    /**
     * Get any issues with the current active layer
     * Returns empty array if no issues
     */
    getActiveLayerIssues() {
        const active = this.activeLayer();
        if (!active)
            return ['No active layer'];
        const issues = [];
        if (!active.visible)
            issues.push('Active layer is hidden');
        if (active.locked)
            issues.push('Active layer is locked');
        return issues;
    }
    // ELEMENT ASSOCIATION
    /**
     * Assign element to active layer
     */
    assignElementToActiveLayer(elementId) {
        const activeLayerId = this._activeLayerId();
        return this.assignElementToLayer(elementId, activeLayerId);
    }
    /**
     * Assign element to specific layer
     */
    assignElementToLayer(elementId, layerId) {
        const layers = this._layers();
        const layerIndex = layers.findIndex((l) => l.id === layerId);
        if (layerIndex === -1) {
            console.warn(`Layer with id ${layerId} not found`);
            return false;
        }
        // Prevent assigning elements to locked layers
        if (layers[layerIndex].locked) {
            console.warn(`Cannot assign elements to locked layer: ${layers[layerIndex].name}`);
            return false;
        }
        // Remove element from all other layers first
        this.removeElementFromAllLayers(elementId);
        // Add to target layer - get fresh layers after removal
        const freshLayers = this._layers();
        const freshLayerIndex = freshLayers.findIndex((l) => l.id === layerId);
        const updatedLayers = [...freshLayers];
        const updatedElements = [...updatedLayers[freshLayerIndex].elements];
        if (!updatedElements.includes(elementId)) {
            updatedElements.push(elementId);
            updatedLayers[freshLayerIndex] = {
                ...updatedLayers[freshLayerIndex],
                elements: updatedElements,
            };
            this._layers.set(updatedLayers);
        }
        return true;
    }
    /**
     * Remove element from all layers
     */
    removeElementFromAllLayers(elementId) {
        const layers = this._layers();
        const updatedLayers = layers.map((layer) => ({
            ...layer,
            elements: layer.elements.filter((id) => id !== elementId),
        }));
        this._layers.set(updatedLayers);
    }
    /**
     * Get layer containing element
     */
    getElementLayer(elementId) {
        const layers = this._layers();
        return layers.find((layer) => layer.elements.includes(elementId)) || null;
    }
    // RENDERING HELPERS
    /**
     * Get elements from visible layers only
     */
    getVisibleElements(allElements) {
        const visibleLayers = this.visibleLayers();
        const visibleElementIds = new Set(visibleLayers.flatMap((layer) => layer.elements));
        return allElements.filter((element) => visibleElementIds.has(element.id));
    }
    /**
     * Get elements from unlocked layers only (for editing)
     */
    getEditableElements(allElements) {
        const unlockedLayers = this.unlockedLayers();
        const editableElementIds = new Set(unlockedLayers.flatMap((layer) => layer.elements));
        return allElements.filter((element) => editableElementIds.has(element.id));
    }
    /**
     * Get elements sorted by layer z-index
     */
    getSortedElements(allElements) {
        const sortedLayers = this.sortedLayers();
        const elementLayerMap = new Map();
        // Map each element to its layer's z-index
        sortedLayers.forEach((layer) => {
            layer.elements.forEach((elementId) => {
                elementLayerMap.set(elementId, layer.zIndex);
            });
        });
        return allElements.sort((a, b) => {
            const aZIndex = elementLayerMap.get(a.id) ?? 0;
            const bZIndex = elementLayerMap.get(b.id) ?? 0;
            return aZIndex - bZIndex;
        });
    }
    // EXPORT/IMPORT SUPPORT
    /**
     * Serialize layer state for saving
     */
    exportLayerState() {
        return {
            layers: this._layers(),
            activeLayerId: this._activeLayerId(),
        };
    }
    /**
     * Restore layer state from saved data
     */
    importLayerState(state) {
        if (!state.layers || state.layers.length === 0) {
            console.warn('Invalid layer state provided');
            this.initializeDefaultLayer();
            return;
        }
        this._layers.set(state.layers);
        // Validate active layer
        const activeLayer = state.layers.find((l) => l.id === state.activeLayerId);
        this._activeLayerId.set(activeLayer ? state.activeLayerId : state.layers[0].id);
    }
    /**
     * Reset to default state
     */
    reset() {
        this.initializeDefaultLayer();
    }
    // PRIVATE HELPERS
    initializeDefaultLayer() {
        const defaultLayer = {
            id: 'default',
            name: 'Layer 1',
            visible: true,
            locked: false,
            zIndex: 0,
            elements: [],
            opacity: 1,
            blendMode: 'normal',
        };
        this._layers.set([defaultLayer]);
        this._activeLayerId.set(defaultLayer.id);
    }
    generateLayerId() {
        return `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    updateLayerProperty(id, property, updater) {
        const layers = this._layers();
        const layerIndex = layers.findIndex((l) => l.id === id);
        if (layerIndex === -1) {
            console.warn(`Layer with id ${id} not found`);
            return false;
        }
        const updatedLayers = [...layers];
        const currentValue = updatedLayers[layerIndex][property];
        updatedLayers[layerIndex] = {
            ...updatedLayers[layerIndex],
            [property]: updater(currentValue),
        };
        this._layers.set(updatedLayers);
        return true;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: LayerManagementService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: LayerManagementService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: LayerManagementService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXItbWFuYWdlbWVudC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmctd2hpdGVib2FyZC9zcmMvbGliL2NvcmUvZWxlbWVudHMvbGF5ZXItbWFuYWdlbWVudC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQTZELFdBQVcsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7QUFLbEcsTUFBTSxPQUFPLHNCQUFzQjtJQUNqQyxxQkFBcUI7SUFDYixPQUFPLEdBQUcsTUFBTSxDQUFvQixFQUFFLENBQUMsQ0FBQztJQUN4QyxjQUFjLEdBQUcsTUFBTSxDQUFTLEVBQUUsQ0FBQyxDQUFDO0lBRTVDLDBCQUEwQjtJQUNqQixNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNuQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUUxRCxxQkFBcUI7SUFDWixXQUFXLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRTtRQUNuQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDOUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxRQUFRLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQyxDQUFDLENBQUM7SUFFTSxZQUFZLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRTtRQUNwQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENB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QUN6QixFQUFVLEVBQ1YsUUFBVyxFQUNYLE9BQTREO1FBRTVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM5QixNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRXhELElBQUksVUFBVSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDdEIsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUM5QyxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCxNQUFNLGFBQWEsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDbEMsTUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pELGFBQWEsQ0FBQyxVQUFVLENBQUMsR0FBRztZQUMxQixHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUM7WUFDNUIsQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDO1NBQ2xDLENBQUM7UUFFRixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNoQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7d0dBNWpCVSxzQkFBc0I7NEdBQXRCLHNCQUFzQixjQUZyQixNQUFNOzs0RkFFUCxzQkFBc0I7a0JBSGxDLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgc2lnbmFsLCBjb21wdXRlZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBXaGl0ZWJvYXJkRWxlbWVudCwgV2hpdGVib2FyZExheWVyLCBMYXllclN0YXRlLCBCbGVuZE1vZGUsIEJMRU5EX01PREVTIH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290JyxcclxufSlcclxuZXhwb3J0IGNsYXNzIExheWVyTWFuYWdlbWVudFNlcnZpY2Uge1xyXG4gIC8vIENvcmUgc3RhdGUgc2lnbmFsc1xyXG4gIHByaXZhdGUgX2xheWVycyA9IHNpZ25hbDxXaGl0ZWJvYXJkTGF5ZXJbXT4oW10pO1xyXG4gIHByaXZhdGUgX2FjdGl2ZUxheWVySWQgPSBzaWduYWw8c3RyaW5nPignJyk7XHJcblxyXG4gIC8vIFB1YmxpYyByZWFkb25seSBzaWduYWxzXHJcbiAgcmVhZG9ubHkgbGF5ZXJzID0gdGhpcy5fbGF5ZXJzLmFzUmVhZG9ubHkoKTtcclxuICByZWFkb25seSBhY3RpdmVMYXllcklkID0gdGhpcy5fYWN0aXZlTGF5ZXJJZC5hc1JlYWRvbmx5KCk7XHJcblxyXG4gIC8vIENvbXB1dGVkIHNlbGVjdG9yc1xyXG4gIHJlYWRvbmx5IGFjdGl2ZUxheWVyID0gY29tcHV0ZWQoKCkgPT4ge1xyXG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fbGF5ZXJzKCk7XHJcbiAgICBjb25zdCBhY3RpdmVJZCA9IHRoaXMuX2FjdGl2ZUxheWVySWQoKTtcclxuICAgIHJldHVybiBsYXllcnMuZmluZCgobGF5ZXIpID0+IGxheWVyLmlkID09PSBhY3RpdmVJZCkgfHwgbGF5ZXJzWzBdO1xyXG4gIH0pO1xyXG5cclxuICByZWFkb25seSBzb3J0ZWRMYXllcnMgPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgICByZXR1cm4gWy4uLnRoaXMuX2xheWVycygpXS5zb3J0KChhLCBiKSA9PiBhLnpJbmRleCAtIGIuekluZGV4KTtcclxuICB9KTtcclxuXHJcbiAgcmVhZG9ubHkgdmlzaWJsZUxheWVycyA9IGNvbXB1dGVkKCgpID0+IHtcclxuICAgIHJldHVybiB0aGlzLl9sYXllcnMoKS5maWx0ZXIoKGxheWVyKSA9PiBsYXllci52aXNpYmxlKTtcclxuICB9KTtcclxuXHJcbiAgcmVhZG9ubHkgdW5sb2NrZWRMYXllcnMgPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5fbGF5ZXJzKCkuZmlsdGVyKChsYXllcikgPT4gIWxheWVyLmxvY2tlZCk7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5pbml0aWFsaXplRGVmYXVsdExheWVyKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGQgYSBuZXcgbGF5ZXJcclxuICAgKi9cclxuICBhZGRMYXllcihuYW1lPzogc3RyaW5nKTogV2hpdGVib2FyZExheWVyIHtcclxuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2xheWVycygpO1xyXG4gICAgY29uc3QgbmV3WkluZGV4ID0gTWF0aC5tYXgoLi4ubGF5ZXJzLm1hcCgobCkgPT4gbC56SW5kZXgpLCAwKSArIDE7XHJcbiAgICBjb25zdCBsYXllckNvdW50ID0gbGF5ZXJzLmxlbmd0aCArIDE7XHJcblxyXG4gICAgY29uc3QgbmV3TGF5ZXI6IFdoaXRlYm9hcmRMYXllciA9IHtcclxuICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGVMYXllcklkKCksXHJcbiAgICAgIG5hbWU6IG5hbWUgfHwgYExheWVyICR7bGF5ZXJDb3VudH1gLFxyXG4gICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICBsb2NrZWQ6IGZhbHNlLFxyXG4gICAgICB6SW5kZXg6IG5ld1pJbmRleCxcclxuICAgICAgZWxlbWVudHM6IFtdLFxyXG4gICAgICBvcGFjaXR5OiAxLFxyXG4gICAgICBibGVuZE1vZGU6ICdub3JtYWwnLFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBNYWtlIGFsbCBvdGhlciBsYXllcnMgaW52aXNpYmxlXHJcbiAgICBjb25zdCB1cGRhdGVkTGF5ZXJzID0gbGF5ZXJzLm1hcCgobGF5ZXIpID0+ICh7XHJcbiAgICAgIC4uLmxheWVyLFxyXG4gICAgICB2aXNpYmxlOiBmYWxzZSxcclxuICAgIH0pKTtcclxuXHJcbiAgICB0aGlzLl9sYXllcnMuc2V0KFsuLi51cGRhdGVkTGF5ZXJzLCBuZXdMYXllcl0pO1xyXG4gICAgdGhpcy5zZXRBY3RpdmVMYXllcihuZXdMYXllci5pZCk7XHJcblxyXG4gICAgcmV0dXJuIG5ld0xheWVyO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIGEgbGF5ZXIgKHByZXZlbnRzIGRlbGV0aW9uIG9mIGxhc3QgbGF5ZXIpXHJcbiAgICovXHJcbiAgcmVtb3ZlTGF5ZXIoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fbGF5ZXJzKCk7XHJcblxyXG4gICAgLy8gUHJldmVudCBkZWxldGlvbiBvZiBsYXN0IHJlbWFpbmluZyBsYXllclxyXG4gICAgaWYgKGxheWVycy5sZW5ndGggPD0gMSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ0Nhbm5vdCBkZWxldGUgdGhlIGxhc3QgcmVtYWluaW5nIGxheWVyJyk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsYXllclRvUmVtb3ZlID0gbGF5ZXJzLmZpbmQoKGwpID0+IGwuaWQgPT09IGlkKTtcclxuICAgIGlmICghbGF5ZXJUb1JlbW92ZSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oYExheWVyIHdpdGggaWQgJHtpZH0gbm90IGZvdW5kYCk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgbGF5ZXJcclxuICAgIGNvbnN0IHVwZGF0ZWRMYXllcnMgPSBsYXllcnMuZmlsdGVyKChsKSA9PiBsLmlkICE9PSBpZCk7XHJcbiAgICB0aGlzLl9sYXllcnMuc2V0KHVwZGF0ZWRMYXllcnMpO1xyXG5cclxuICAgIC8vIElmIGFjdGl2ZSBsYXllciB3YXMgcmVtb3ZlZCwgc2V0IG5ldyBhY3RpdmUgbGF5ZXJcclxuICAgIGlmICh0aGlzLl9hY3RpdmVMYXllcklkKCkgPT09IGlkKSB7XHJcbiAgICAgIGNvbnN0IG5ld0FjdGl2ZUxheWVyID0gdXBkYXRlZExheWVyc1tNYXRoLm1heCgwLCB1cGRhdGVkTGF5ZXJzLmxlbmd0aCAtIDEpXTtcclxuICAgICAgdGhpcy5zZXRBY3RpdmVMYXllcihuZXdBY3RpdmVMYXllci5pZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW5hbWUgYSBsYXllclxyXG4gICAqL1xyXG4gIHJlbmFtZUxheWVyKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fbGF5ZXJzKCk7XHJcbiAgICBjb25zdCBsYXllckluZGV4ID0gbGF5ZXJzLmZpbmRJbmRleCgobCkgPT4gbC5pZCA9PT0gaWQpO1xyXG5cclxuICAgIGlmIChsYXllckluZGV4ID09PSAtMSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oYExheWVyIHdpdGggaWQgJHtpZH0gbm90IGZvdW5kYCk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQcmV2ZW50IHJlbmFtaW5nIGxvY2tlZCBsYXllcnNcclxuICAgIGlmIChsYXllcnNbbGF5ZXJJbmRleF0ubG9ja2VkKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihgQ2Fubm90IHJlbmFtZSBsb2NrZWQgbGF5ZXI6ICR7bGF5ZXJzW2xheWVySW5kZXhdLm5hbWV9YCk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB1cGRhdGVkTGF5ZXJzID0gWy4uLmxheWVyc107XHJcbiAgICB1cGRhdGVkTGF5ZXJzW2xheWVySW5kZXhdID0ge1xyXG4gICAgICAuLi51cGRhdGVkTGF5ZXJzW2xheWVySW5kZXhdLFxyXG4gICAgICBuYW1lOiBuYW1lLnRyaW0oKSB8fCBgTGF5ZXIgJHtsYXllckluZGV4ICsgMX1gLFxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLl9sYXllcnMuc2V0KHVwZGF0ZWRMYXllcnMpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW9yZGVyIGxheWVyIGJ5IGNoYW5naW5nIHpJbmRleFxyXG4gICAqL1xyXG4gIHJlb3JkZXJMYXllcihpZDogc3RyaW5nLCBuZXdaSW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fbGF5ZXJzKCk7XHJcbiAgICBjb25zdCBsYXllckluZGV4ID0gbGF5ZXJzLmZpbmRJbmRleCgobCkgPT4gbC5pZCA9PT0gaWQpO1xyXG5cclxuICAgIGlmIChsYXllckluZGV4ID09PSAtMSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oYExheWVyIHdpdGggaWQgJHtpZH0gbm90IGZvdW5kYCk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQcmV2ZW50IHJlb3JkZXJpbmcgbG9ja2VkIGxheWVyc1xyXG4gICAgaWYgKGxheWVyc1tsYXllckluZGV4XS5sb2NrZWQpIHtcclxuICAgICAgY29uc29sZS53YXJuKGBDYW5ub3QgcmVvcmRlciBsb2NrZWQgbGF5ZXI6ICR7bGF5ZXJzW2xheWVySW5kZXhdLm5hbWV9YCk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB1cGRhdGVkTGF5ZXJzID0gWy4uLmxheWVyc107XHJcbiAgICB1cGRhdGVkTGF5ZXJzW2xheWVySW5kZXhdID0ge1xyXG4gICAgICAuLi51cGRhdGVkTGF5ZXJzW2xheWVySW5kZXhdLFxyXG4gICAgICB6SW5kZXg6IG5ld1pJbmRleCxcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5fbGF5ZXJzLnNldCh1cGRhdGVkTGF5ZXJzKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW92ZSBsYXllciB1cCBpbiB6LW9yZGVyXHJcbiAgICovXHJcbiAgbW92ZUxheWVyVXAoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5zb3J0ZWRMYXllcnMoKTtcclxuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IGxheWVycy5maW5kSW5kZXgoKGwpID0+IGwuaWQgPT09IGlkKTtcclxuXHJcbiAgICBpZiAoY3VycmVudEluZGV4ID09PSAtMSB8fCBjdXJyZW50SW5kZXggPT09IGxheWVycy5sZW5ndGggLSAxKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTsgLy8gTGF5ZXIgbm90IGZvdW5kIG9yIGFscmVhZHkgYXQgdG9wXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY3VycmVudExheWVyID0gbGF5ZXJzW2N1cnJlbnRJbmRleF07XHJcblxyXG4gICAgLy8gUHJldmVudCBtb3ZpbmcgbG9ja2VkIGxheWVyc1xyXG4gICAgaWYgKGN1cnJlbnRMYXllci5sb2NrZWQpIHtcclxuICAgICAgY29uc29sZS53YXJuKGBDYW5ub3QgbW92ZSBsb2NrZWQgbGF5ZXI6ICR7Y3VycmVudExheWVyLm5hbWV9YCk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBuZXh0TGF5ZXIgPSBsYXllcnNbY3VycmVudEluZGV4ICsgMV07XHJcblxyXG4gICAgLy8gU3dhcCB6LWluZGljZXNcclxuICAgIHJldHVybiB0aGlzLnJlb3JkZXJMYXllcihjdXJyZW50TGF5ZXIuaWQsIG5leHRMYXllci56SW5kZXgpICYmIHRoaXMucmVvcmRlckxheWVyKG5leHRMYXllci5pZCwgY3VycmVudExheWVyLnpJbmRleCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIGxheWVyIGRvd24gaW4gei1vcmRlclxyXG4gICAqL1xyXG4gIG1vdmVMYXllckRvd24oaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5zb3J0ZWRMYXllcnMoKTtcclxuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IGxheWVycy5maW5kSW5kZXgoKGwpID0+IGwuaWQgPT09IGlkKTtcclxuXHJcbiAgICBpZiAoY3VycmVudEluZGV4ID09PSAtMSB8fCBjdXJyZW50SW5kZXggPT09IDApIHtcclxuICAgICAgcmV0dXJuIGZhbHNlOyAvLyBMYXllciBub3QgZm91bmQgb3IgYWxyZWFkeSBhdCBib3R0b21cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjdXJyZW50TGF5ZXIgPSBsYXllcnNbY3VycmVudEluZGV4XTtcclxuXHJcbiAgICAvLyBQcmV2ZW50IG1vdmluZyBsb2NrZWQgbGF5ZXJzXHJcbiAgICBpZiAoY3VycmVudExheWVyLmxvY2tlZCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oYENhbm5vdCBtb3ZlIGxvY2tlZCBsYXllcjogJHtjdXJyZW50TGF5ZXIubmFtZX1gKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHByZXZMYXllciA9IGxheWVyc1tjdXJyZW50SW5kZXggLSAxXTtcclxuXHJcbiAgICAvLyBTd2FwIHotaW5kaWNlc1xyXG4gICAgcmV0dXJuIHRoaXMucmVvcmRlckxheWVyKGN1cnJlbnRMYXllci5pZCwgcHJldkxheWVyLnpJbmRleCkgJiYgdGhpcy5yZW9yZGVyTGF5ZXIocHJldkxheWVyLmlkLCBjdXJyZW50TGF5ZXIuekluZGV4KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlb3JkZXIgbGF5ZXJzIGJ5IG1vdmluZyBhIGxheWVyIGZyb20gb25lIHBvc2l0aW9uIHRvIGFub3RoZXJcclxuICAgKiBUaGlzIHByb3Blcmx5IHJlYXNzaWducyB6SW5kZXggdmFsdWVzIGJhc2VkIG9uIHRoZSBuZXcgb3JkZXJcclxuICAgKlxyXG4gICAqIEBwYXJhbSBwcmV2aW91c0luZGV4IC0gQ3VycmVudCBpbmRleCBpbiB0aGUgbGF5ZXJzIGFycmF5XHJcbiAgICogQHBhcmFtIGN1cnJlbnRJbmRleCAtIFRhcmdldCBpbmRleCBpbiB0aGUgbGF5ZXJzIGFycmF5XHJcbiAgICogQHJldHVybnMgdHJ1ZSBpZiBzdWNjZXNzZnVsLCBmYWxzZSBvdGhlcndpc2VcclxuICAgKi9cclxuICByZW9yZGVyTGF5ZXJzQnlJbmRleChwcmV2aW91c0luZGV4OiBudW1iZXIsIGN1cnJlbnRJbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLl9sYXllcnMoKTtcclxuXHJcbiAgICBpZiAocHJldmlvdXNJbmRleCA9PT0gY3VycmVudEluZGV4KSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTsgLy8gTm8gY2hhbmdlIG5lZWRlZFxyXG4gICAgfVxyXG5cclxuICAgIGlmIChwcmV2aW91c0luZGV4IDwgMCB8fCBwcmV2aW91c0luZGV4ID49IGxheWVycy5sZW5ndGggfHwgY3VycmVudEluZGV4IDwgMCB8fCBjdXJyZW50SW5kZXggPj0gbGF5ZXJzLmxlbmd0aCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ0ludmFsaWQgbGF5ZXIgaW5kaWNlcyBmb3IgcmVvcmRlcmluZycpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbGF5ZXJUb01vdmUgPSBsYXllcnNbcHJldmlvdXNJbmRleF07XHJcblxyXG4gICAgLy8gUHJldmVudCBtb3ZpbmcgbG9ja2VkIGxheWVyc1xyXG4gICAgaWYgKGxheWVyVG9Nb3ZlLmxvY2tlZCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oYENhbm5vdCByZW9yZGVyIGxvY2tlZCBsYXllcjogJHtsYXllclRvTW92ZS5uYW1lfWApO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ3JlYXRlIG5ldyBhcnJheSB3aXRoIHRoZSBsYXllciBtb3ZlZCB0byBpdHMgbmV3IHBvc2l0aW9uXHJcbiAgICBjb25zdCByZW9yZGVyZWRMYXllcnMgPSBbLi4ubGF5ZXJzXTtcclxuICAgIHJlb3JkZXJlZExheWVycy5zcGxpY2UocHJldmlvdXNJbmRleCwgMSk7IC8vIFJlbW92ZSBmcm9tIG9sZCBwb3NpdGlvblxyXG4gICAgcmVvcmRlcmVkTGF5ZXJzLnNwbGljZShjdXJyZW50SW5kZXgsIDAsIGxheWVyVG9Nb3ZlKTsgLy8gSW5zZXJ0IGF0IG5ldyBwb3NpdGlvblxyXG5cclxuICAgIC8vIFJlYXNzaWduIHpJbmRleCB2YWx1ZXMgYmFzZWQgb24gbmV3IGFycmF5IG9yZGVyXHJcbiAgICAvLyBMb3dlciBpbmRleCA9IGhpZ2hlciB6SW5kZXggKHJlbmRlcnMgb24gdG9wKVxyXG4gICAgY29uc3QgdXBkYXRlZExheWVycyA9IHJlb3JkZXJlZExheWVycy5tYXAoKGxheWVyLCBpbmRleCkgPT4gKHtcclxuICAgICAgLi4ubGF5ZXIsXHJcbiAgICAgIHpJbmRleDogcmVvcmRlcmVkTGF5ZXJzLmxlbmd0aCAtIDEgLSBpbmRleCwgLy8gUmV2ZXJzZTogZmlyc3QgaXRlbSBnZXRzIGhpZ2hlc3QgekluZGV4XHJcbiAgICB9KSk7XHJcblxyXG4gICAgdGhpcy5fbGF5ZXJzLnNldCh1cGRhdGVkTGF5ZXJzKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVG9nZ2xlIGxheWVyIHZpc2liaWxpdHlcclxuICAgKi9cclxuICB0b2dnbGVMYXllclZpc2liaWxpdHkoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMudXBkYXRlTGF5ZXJQcm9wZXJ0eShpZCwgJ3Zpc2libGUnLCAoY3VycmVudCkgPT4gIWN1cnJlbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVG9nZ2xlIGxheWVyIGxvY2sgc3RhdGVcclxuICAgKlxyXG4gICAqIEJlaGF2aW9yOlxyXG4gICAqIC0gQWxsb3dzIGxvY2tpbmcvdW5sb2NraW5nIGFueSBsYXllciBpbmNsdWRpbmcgdGhlIGFjdGl2ZSBsYXllclxyXG4gICAqIC0gV2hlbiBhY3RpdmUgbGF5ZXIgaXMgbG9ja2VkLCBkcmF3aW5nIHdpbGwgYmUgZGlzYWJsZWQgYnV0IGxheWVyIHJlbWFpbnMgYWN0aXZlXHJcbiAgICovXHJcbiAgdG9nZ2xlTGF5ZXJMb2NrKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2xheWVycygpO1xyXG4gICAgY29uc3QgbGF5ZXIgPSBsYXllcnMuZmluZCgobCkgPT4gbC5pZCA9PT0gaWQpO1xyXG5cclxuICAgIGlmICghbGF5ZXIpIHtcclxuICAgICAgY29uc29sZS53YXJuKGBMYXllciB3aXRoIGlkICR7aWR9IG5vdCBmb3VuZGApO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMudXBkYXRlTGF5ZXJQcm9wZXJ0eShpZCwgJ2xvY2tlZCcsIChjdXJyZW50KSA9PiAhY3VycmVudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgbGF5ZXIgb3BhY2l0eVxyXG4gICAqL1xyXG4gIHNldExheWVyT3BhY2l0eShpZDogc3RyaW5nLCBvcGFjaXR5OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2xheWVycygpO1xyXG4gICAgY29uc3QgbGF5ZXIgPSBsYXllcnMuZmluZCgobCkgPT4gbC5pZCA9PT0gaWQpO1xyXG5cclxuICAgIGlmICghbGF5ZXIpIHtcclxuICAgICAgY29uc29sZS53YXJuKGBMYXllciB3aXRoIGlkICR7aWR9IG5vdCBmb3VuZGApO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJldmVudCBjaGFuZ2luZyBvcGFjaXR5IG9mIGxvY2tlZCBsYXllcnNcclxuICAgIGlmIChsYXllci5sb2NrZWQpIHtcclxuICAgICAgY29uc29sZS53YXJuKGBDYW5ub3QgY2hhbmdlIG9wYWNpdHkgb2YgbG9ja2VkIGxheWVyOiAke2xheWVyLm5hbWV9YCk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjbGFtcGVkT3BhY2l0eSA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIG9wYWNpdHkpKTtcclxuICAgIHJldHVybiB0aGlzLnVwZGF0ZUxheWVyUHJvcGVydHkoaWQsICdvcGFjaXR5JywgKCkgPT4gY2xhbXBlZE9wYWNpdHkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IGxheWVyIGJsZW5kIG1vZGVcclxuICAgKi9cclxuICBzZXRMYXllckJsZW5kTW9kZShpZDogc3RyaW5nLCBibGVuZE1vZGU6IEJsZW5kTW9kZSk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fbGF5ZXJzKCk7XHJcbiAgICBjb25zdCBsYXllciA9IGxheWVycy5maW5kKChsKSA9PiBsLmlkID09PSBpZCk7XHJcblxyXG4gICAgaWYgKCFsYXllcikge1xyXG4gICAgICBjb25zb2xlLndhcm4oYExheWVyIHdpdGggaWQgJHtpZH0gbm90IGZvdW5kYCk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQcmV2ZW50IGNoYW5naW5nIGJsZW5kIG1vZGUgb2YgbG9ja2VkIGxheWVyc1xyXG4gICAgaWYgKGxheWVyLmxvY2tlZCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oYENhbm5vdCBjaGFuZ2UgYmxlbmQgbW9kZSBvZiBsb2NrZWQgbGF5ZXI6ICR7bGF5ZXIubmFtZX1gKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFZhbGlkYXRlIGJsZW5kIG1vZGVcclxuICAgIGNvbnN0IHZhbGlkQmxlbmRNb2RlcyA9IEJMRU5EX01PREVTLm1hcCgobW9kZSkgPT4gbW9kZS52YWx1ZSk7XHJcbiAgICBpZiAoIXZhbGlkQmxlbmRNb2Rlcy5pbmNsdWRlcyhibGVuZE1vZGUpKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihgSW52YWxpZCBibGVuZCBtb2RlOiAke2JsZW5kTW9kZX0uIFVzaW5nICdub3JtYWwnIGluc3RlYWQuYCk7XHJcbiAgICAgIHJldHVybiB0aGlzLnVwZGF0ZUxheWVyUHJvcGVydHkoaWQsICdibGVuZE1vZGUnLCAoKSA9PiAnbm9ybWFsJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMudXBkYXRlTGF5ZXJQcm9wZXJ0eShpZCwgJ2JsZW5kTW9kZScsICgpID0+IGJsZW5kTW9kZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIGFjdGl2ZSBsYXllclxyXG4gICAqXHJcbiAgICogQmVoYXZpb3I6XHJcbiAgICogLSBBbGxvd3MgYWN0aXZhdGluZyBhbnkgbGF5ZXIgaW5jbHVkaW5nIGxvY2tlZCBsYXllcnNcclxuICAgKiAtIFdoZW4gYSBsb2NrZWQgbGF5ZXIgaXMgYWN0aXZlLCBkcmF3aW5nIHdpbGwgYmUgZGlzYWJsZWRcclxuICAgKiAtIE1ha2VzIGFsbCBvdGhlciBsYXllcnMgaW52aXNpYmxlIHdoZW4gYSBsYXllciBpcyBhY3RpdmF0ZWRcclxuICAgKiAtIFRoaXMgZW5zdXJlcyBvbmx5IHRoZSBhY3RpdmUgbGF5ZXIgaXMgdmlzaWJsZVxyXG4gICAqL1xyXG4gIHNldEFjdGl2ZUxheWVyKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2xheWVycygpO1xyXG4gICAgY29uc3QgbGF5ZXIgPSBsYXllcnMuZmluZCgobCkgPT4gbC5pZCA9PT0gaWQpO1xyXG5cclxuICAgIGlmICghbGF5ZXIpIHtcclxuICAgICAgY29uc29sZS53YXJuKGBMYXllciB3aXRoIGlkICR7aWR9IG5vdCBmb3VuZGApO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTWFrZSBhbGwgbGF5ZXJzIGludmlzaWJsZSBleGNlcHQgdGhlIG9uZSBiZWluZyBhY3RpdmF0ZWRcclxuICAgIGNvbnN0IHVwZGF0ZWRMYXllcnMgPSBsYXllcnMubWFwKChsKSA9PiAoe1xyXG4gICAgICAuLi5sLFxyXG4gICAgICB2aXNpYmxlOiBsLmlkID09PSBpZCxcclxuICAgIH0pKTtcclxuXHJcbiAgICB0aGlzLl9sYXllcnMuc2V0KHVwZGF0ZWRMYXllcnMpO1xyXG5cclxuICAgIHRoaXMuX2FjdGl2ZUxheWVySWQuc2V0KGlkKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBhY3RpdmUgbGF5ZXIgSURcclxuICAgKi9cclxuICBnZXRBY3RpdmVMYXllcklkKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlTGF5ZXJJZCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgaWYgdGhlIGFjdGl2ZSBsYXllciBpcyBpbiBhIHZhbGlkIGRyYXdpbmcgc3RhdGVcclxuICAgKiBWYWxpZCBtZWFuczogZXhpc3RzLCB2aXNpYmxlLCBhbmQgdW5sb2NrZWRcclxuICAgKi9cclxuICBpc0FjdGl2ZUxheWVyVmFsaWQoKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBhY3RpdmUgPSB0aGlzLmFjdGl2ZUxheWVyKCk7XHJcbiAgICByZXR1cm4gISFhY3RpdmUgJiYgYWN0aXZlLnZpc2libGUgJiYgIWFjdGl2ZS5sb2NrZWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgYW55IGlzc3VlcyB3aXRoIHRoZSBjdXJyZW50IGFjdGl2ZSBsYXllclxyXG4gICAqIFJldHVybnMgZW1wdHkgYXJyYXkgaWYgbm8gaXNzdWVzXHJcbiAgICovXHJcbiAgZ2V0QWN0aXZlTGF5ZXJJc3N1ZXMoKTogc3RyaW5nW10ge1xyXG4gICAgY29uc3QgYWN0aXZlID0gdGhpcy5hY3RpdmVMYXllcigpO1xyXG4gICAgaWYgKCFhY3RpdmUpIHJldHVybiBbJ05vIGFjdGl2ZSBsYXllciddO1xyXG5cclxuICAgIGNvbnN0IGlzc3Vlczogc3RyaW5nW10gPSBbXTtcclxuICAgIGlmICghYWN0aXZlLnZpc2libGUpIGlzc3Vlcy5wdXNoKCdBY3RpdmUgbGF5ZXIgaXMgaGlkZGVuJyk7XHJcbiAgICBpZiAoYWN0aXZlLmxvY2tlZCkgaXNzdWVzLnB1c2goJ0FjdGl2ZSBsYXllciBpcyBsb2NrZWQnKTtcclxuICAgIHJldHVybiBpc3N1ZXM7XHJcbiAgfVxyXG5cclxuICAvLyBFTEVNRU5UIEFTU09DSUFUSU9OXHJcblxyXG4gIC8qKlxyXG4gICAqIEFzc2lnbiBlbGVtZW50IHRvIGFjdGl2ZSBsYXllclxyXG4gICAqL1xyXG4gIGFzc2lnbkVsZW1lbnRUb0FjdGl2ZUxheWVyKGVsZW1lbnRJZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBhY3RpdmVMYXllcklkID0gdGhpcy5fYWN0aXZlTGF5ZXJJZCgpO1xyXG4gICAgcmV0dXJuIHRoaXMuYXNzaWduRWxlbWVudFRvTGF5ZXIoZWxlbWVudElkLCBhY3RpdmVMYXllcklkKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFzc2lnbiBlbGVtZW50IHRvIHNwZWNpZmljIGxheWVyXHJcbiAgICovXHJcbiAgYXNzaWduRWxlbWVudFRvTGF5ZXIoZWxlbWVudElkOiBzdHJpbmcsIGxheWVySWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fbGF5ZXJzKCk7XHJcbiAgICBjb25zdCBsYXllckluZGV4ID0gbGF5ZXJzLmZpbmRJbmRleCgobCkgPT4gbC5pZCA9PT0gbGF5ZXJJZCk7XHJcblxyXG4gICAgaWYgKGxheWVySW5kZXggPT09IC0xKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihgTGF5ZXIgd2l0aCBpZCAke2xheWVySWR9IG5vdCBmb3VuZGApO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJldmVudCBhc3NpZ25pbmcgZWxlbWVudHMgdG8gbG9ja2VkIGxheWVyc1xyXG4gICAgaWYgKGxheWVyc1tsYXllckluZGV4XS5sb2NrZWQpIHtcclxuICAgICAgY29uc29sZS53YXJuKGBDYW5ub3QgYXNzaWduIGVsZW1lbnRzIHRvIGxvY2tlZCBsYXllcjogJHtsYXllcnNbbGF5ZXJJbmRleF0ubmFtZX1gKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSBlbGVtZW50IGZyb20gYWxsIG90aGVyIGxheWVycyBmaXJzdFxyXG4gICAgdGhpcy5yZW1vdmVFbGVtZW50RnJvbUFsbExheWVycyhlbGVtZW50SWQpO1xyXG5cclxuICAgIC8vIEFkZCB0byB0YXJnZXQgbGF5ZXIgLSBnZXQgZnJlc2ggbGF5ZXJzIGFmdGVyIHJlbW92YWxcclxuICAgIGNvbnN0IGZyZXNoTGF5ZXJzID0gdGhpcy5fbGF5ZXJzKCk7XHJcbiAgICBjb25zdCBmcmVzaExheWVySW5kZXggPSBmcmVzaExheWVycy5maW5kSW5kZXgoKGwpID0+IGwuaWQgPT09IGxheWVySWQpO1xyXG4gICAgY29uc3QgdXBkYXRlZExheWVycyA9IFsuLi5mcmVzaExheWVyc107XHJcbiAgICBjb25zdCB1cGRhdGVkRWxlbWVudHMgPSBbLi4udXBkYXRlZExheWVyc1tmcmVzaExheWVySW5kZXhdLmVsZW1lbnRzXTtcclxuXHJcbiAgICBpZiAoIXVwZGF0ZWRFbGVtZW50cy5pbmNsdWRlcyhlbGVtZW50SWQpKSB7XHJcbiAgICAgIHVwZGF0ZWRFbGVtZW50cy5wdXNoKGVsZW1lbnRJZCk7XHJcbiAgICAgIHVwZGF0ZWRMYXllcnNbZnJlc2hMYXllckluZGV4XSA9IHtcclxuICAgICAgICAuLi51cGRhdGVkTGF5ZXJzW2ZyZXNoTGF5ZXJJbmRleF0sXHJcbiAgICAgICAgZWxlbWVudHM6IHVwZGF0ZWRFbGVtZW50cyxcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5fbGF5ZXJzLnNldCh1cGRhdGVkTGF5ZXJzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSBlbGVtZW50IGZyb20gYWxsIGxheWVyc1xyXG4gICAqL1xyXG4gIHJlbW92ZUVsZW1lbnRGcm9tQWxsTGF5ZXJzKGVsZW1lbnRJZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLl9sYXllcnMoKTtcclxuICAgIGNvbnN0IHVwZGF0ZWRMYXllcnMgPSBsYXllcnMubWFwKChsYXllcikgPT4gKHtcclxuICAgICAgLi4ubGF5ZXIsXHJcbiAgICAgIGVsZW1lbnRzOiBsYXllci5lbGVtZW50cy5maWx0ZXIoKGlkKSA9PiBpZCAhPT0gZWxlbWVudElkKSxcclxuICAgIH0pKTtcclxuICAgIHRoaXMuX2xheWVycy5zZXQodXBkYXRlZExheWVycyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgbGF5ZXIgY29udGFpbmluZyBlbGVtZW50XHJcbiAgICovXHJcbiAgZ2V0RWxlbWVudExheWVyKGVsZW1lbnRJZDogc3RyaW5nKTogV2hpdGVib2FyZExheWVyIHwgbnVsbCB7XHJcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLl9sYXllcnMoKTtcclxuICAgIHJldHVybiBsYXllcnMuZmluZCgobGF5ZXIpID0+IGxheWVyLmVsZW1lbnRzLmluY2x1ZGVzKGVsZW1lbnRJZCkpIHx8IG51bGw7XHJcbiAgfVxyXG5cclxuICAvLyBSRU5ERVJJTkcgSEVMUEVSU1xyXG5cclxuICAvKipcclxuICAgKiBHZXQgZWxlbWVudHMgZnJvbSB2aXNpYmxlIGxheWVycyBvbmx5XHJcbiAgICovXHJcbiAgZ2V0VmlzaWJsZUVsZW1lbnRzKGFsbEVsZW1lbnRzOiBXaGl0ZWJvYXJkRWxlbWVudFtdKTogV2hpdGVib2FyZEVsZW1lbnRbXSB7XHJcbiAgICBjb25zdCB2aXNpYmxlTGF5ZXJzID0gdGhpcy52aXNpYmxlTGF5ZXJzKCk7XHJcbiAgICBjb25zdCB2aXNpYmxlRWxlbWVudElkcyA9IG5ldyBTZXQodmlzaWJsZUxheWVycy5mbGF0TWFwKChsYXllcikgPT4gbGF5ZXIuZWxlbWVudHMpKTtcclxuXHJcbiAgICByZXR1cm4gYWxsRWxlbWVudHMuZmlsdGVyKChlbGVtZW50KSA9PiB2aXNpYmxlRWxlbWVudElkcy5oYXMoZWxlbWVudC5pZCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGVsZW1lbnRzIGZyb20gdW5sb2NrZWQgbGF5ZXJzIG9ubHkgKGZvciBlZGl0aW5nKVxyXG4gICAqL1xyXG4gIGdldEVkaXRhYmxlRWxlbWVudHMoYWxsRWxlbWVudHM6IFdoaXRlYm9hcmRFbGVtZW50W10pOiBXaGl0ZWJvYXJkRWxlbWVudFtdIHtcclxuICAgIGNvbnN0IHVubG9ja2VkTGF5ZXJzID0gdGhpcy51bmxvY2tlZExheWVycygpO1xyXG4gICAgY29uc3QgZWRpdGFibGVFbGVtZW50SWRzID0gbmV3IFNldCh1bmxvY2tlZExheWVycy5mbGF0TWFwKChsYXllcikgPT4gbGF5ZXIuZWxlbWVudHMpKTtcclxuXHJcbiAgICByZXR1cm4gYWxsRWxlbWVudHMuZmlsdGVyKChlbGVtZW50KSA9PiBlZGl0YWJsZUVsZW1lbnRJZHMuaGFzKGVsZW1lbnQuaWQpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBlbGVtZW50cyBzb3J0ZWQgYnkgbGF5ZXIgei1pbmRleFxyXG4gICAqL1xyXG4gIGdldFNvcnRlZEVsZW1lbnRzKGFsbEVsZW1lbnRzOiBXaGl0ZWJvYXJkRWxlbWVudFtdKTogV2hpdGVib2FyZEVsZW1lbnRbXSB7XHJcbiAgICBjb25zdCBzb3J0ZWRMYXllcnMgPSB0aGlzLnNvcnRlZExheWVycygpO1xyXG4gICAgY29uc3QgZWxlbWVudExheWVyTWFwID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcclxuXHJcbiAgICAvLyBNYXAgZWFjaCBlbGVtZW50IHRvIGl0cyBsYXllcidzIHotaW5kZXhcclxuICAgIHNvcnRlZExheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xyXG4gICAgICBsYXllci5lbGVtZW50cy5mb3JFYWNoKChlbGVtZW50SWQpID0+IHtcclxuICAgICAgICBlbGVtZW50TGF5ZXJNYXAuc2V0KGVsZW1lbnRJZCwgbGF5ZXIuekluZGV4KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gYWxsRWxlbWVudHMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICBjb25zdCBhWkluZGV4ID0gZWxlbWVudExheWVyTWFwLmdldChhLmlkKSA/PyAwO1xyXG4gICAgICBjb25zdCBiWkluZGV4ID0gZWxlbWVudExheWVyTWFwLmdldChiLmlkKSA/PyAwO1xyXG4gICAgICByZXR1cm4gYVpJbmRleCAtIGJaSW5kZXg7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIEVYUE9SVC9JTVBPUlQgU1VQUE9SVFxyXG5cclxuICAvKipcclxuICAgKiBTZXJpYWxpemUgbGF5ZXIgc3RhdGUgZm9yIHNhdmluZ1xyXG4gICAqL1xyXG4gIGV4cG9ydExheWVyU3RhdGUoKTogTGF5ZXJTdGF0ZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBsYXllcnM6IHRoaXMuX2xheWVycygpLFxyXG4gICAgICBhY3RpdmVMYXllcklkOiB0aGlzLl9hY3RpdmVMYXllcklkKCksXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzdG9yZSBsYXllciBzdGF0ZSBmcm9tIHNhdmVkIGRhdGFcclxuICAgKi9cclxuICBpbXBvcnRMYXllclN0YXRlKHN0YXRlOiBMYXllclN0YXRlKTogdm9pZCB7XHJcbiAgICBpZiAoIXN0YXRlLmxheWVycyB8fCBzdGF0ZS5sYXllcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignSW52YWxpZCBsYXllciBzdGF0ZSBwcm92aWRlZCcpO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVEZWZhdWx0TGF5ZXIoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2xheWVycy5zZXQoc3RhdGUubGF5ZXJzKTtcclxuXHJcbiAgICAvLyBWYWxpZGF0ZSBhY3RpdmUgbGF5ZXJcclxuICAgIGNvbnN0IGFjdGl2ZUxheWVyID0gc3RhdGUubGF5ZXJzLmZpbmQoKGwpID0+IGwuaWQgPT09IHN0YXRlLmFjdGl2ZUxheWVySWQpO1xyXG4gICAgdGhpcy5fYWN0aXZlTGF5ZXJJZC5zZXQoYWN0aXZlTGF5ZXIgPyBzdGF0ZS5hY3RpdmVMYXllcklkIDogc3RhdGUubGF5ZXJzWzBdLmlkKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc2V0IHRvIGRlZmF1bHQgc3RhdGVcclxuICAgKi9cclxuICByZXNldCgpOiB2b2lkIHtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZURlZmF1bHRMYXllcigpO1xyXG4gIH1cclxuXHJcbiAgLy8gUFJJVkFURSBIRUxQRVJTXHJcblxyXG4gIHByaXZhdGUgaW5pdGlhbGl6ZURlZmF1bHRMYXllcigpOiB2b2lkIHtcclxuICAgIGNvbnN0IGRlZmF1bHRMYXllcjogV2hpdGVib2FyZExheWVyID0ge1xyXG4gICAgICBpZDogJ2RlZmF1bHQnLFxyXG4gICAgICBuYW1lOiAnTGF5ZXIgMScsXHJcbiAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgIGxvY2tlZDogZmFsc2UsXHJcbiAgICAgIHpJbmRleDogMCxcclxuICAgICAgZWxlbWVudHM6IFtdLFxyXG4gICAgICBvcGFjaXR5OiAxLFxyXG4gICAgICBibGVuZE1vZGU6ICdub3JtYWwnLFxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLl9sYXllcnMuc2V0KFtkZWZhdWx0TGF5ZXJdKTtcclxuICAgIHRoaXMuX2FjdGl2ZUxheWVySWQuc2V0KGRlZmF1bHRMYXllci5pZCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdlbmVyYXRlTGF5ZXJJZCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGBsYXllci0ke0RhdGUubm93KCl9LSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDkpfWA7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZUxheWVyUHJvcGVydHk8SyBleHRlbmRzIGtleW9mIFdoaXRlYm9hcmRMYXllcj4oXHJcbiAgICBpZDogc3RyaW5nLFxyXG4gICAgcHJvcGVydHk6IEssXHJcbiAgICB1cGRhdGVyOiAoY3VycmVudDogV2hpdGVib2FyZExheWVyW0tdKSA9PiBXaGl0ZWJvYXJkTGF5ZXJbS11cclxuICApOiBib29sZWFuIHtcclxuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2xheWVycygpO1xyXG4gICAgY29uc3QgbGF5ZXJJbmRleCA9IGxheWVycy5maW5kSW5kZXgoKGwpID0+IGwuaWQgPT09IGlkKTtcclxuXHJcbiAgICBpZiAobGF5ZXJJbmRleCA9PT0gLTEpIHtcclxuICAgICAgY29uc29sZS53YXJuKGBMYXllciB3aXRoIGlkICR7aWR9IG5vdCBmb3VuZGApO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdXBkYXRlZExheWVycyA9IFsuLi5sYXllcnNdO1xyXG4gICAgY29uc3QgY3VycmVudFZhbHVlID0gdXBkYXRlZExheWVyc1tsYXllckluZGV4XVtwcm9wZXJ0eV07XHJcbiAgICB1cGRhdGVkTGF5ZXJzW2xheWVySW5kZXhdID0ge1xyXG4gICAgICAuLi51cGRhdGVkTGF5ZXJzW2xheWVySW5kZXhdLFxyXG4gICAgICBbcHJvcGVydHldOiB1cGRhdGVyKGN1cnJlbnRWYWx1ZSksXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuX2xheWVycy5zZXQodXBkYXRlZExheWVycyk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuIl19