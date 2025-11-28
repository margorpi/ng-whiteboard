import { WhiteboardElement, WhiteboardLayer, LayerState, BlendMode } from '../types';
import * as i0 from "@angular/core";
export declare class LayerManagementService {
    private _layers;
    private _activeLayerId;
    readonly layers: import("@angular/core").Signal<WhiteboardLayer[]>;
    readonly activeLayerId: import("@angular/core").Signal<string>;
    readonly activeLayer: import("@angular/core").Signal<WhiteboardLayer>;
    readonly sortedLayers: import("@angular/core").Signal<WhiteboardLayer[]>;
    readonly visibleLayers: import("@angular/core").Signal<WhiteboardLayer[]>;
    readonly unlockedLayers: import("@angular/core").Signal<WhiteboardLayer[]>;
    constructor();
    /**
     * Add a new layer
     */
    addLayer(name?: string): WhiteboardLayer;
    /**
     * Remove a layer (prevents deletion of last layer)
     */
    removeLayer(id: string): boolean;
    /**
     * Rename a layer
     */
    renameLayer(id: string, name: string): boolean;
    /**
     * Reorder layer by changing zIndex
     */
    reorderLayer(id: string, newZIndex: number): boolean;
    /**
     * Move layer up in z-order
     */
    moveLayerUp(id: string): boolean;
    /**
     * Move layer down in z-order
     */
    moveLayerDown(id: string): boolean;
    /**
     * Reorder layers by moving a layer from one position to another
     * This properly reassigns zIndex values based on the new order
     *
     * @param previousIndex - Current index in the layers array
     * @param currentIndex - Target index in the layers array
     * @returns true if successful, false otherwise
     */
    reorderLayersByIndex(previousIndex: number, currentIndex: number): boolean;
    /**
     * Toggle layer visibility
     */
    toggleLayerVisibility(id: string): boolean;
    /**
     * Toggle layer lock state
     *
     * Behavior:
     * - Allows locking/unlocking any layer including the active layer
     * - When active layer is locked, drawing will be disabled but layer remains active
     */
    toggleLayerLock(id: string): boolean;
    /**
     * Set layer opacity
     */
    setLayerOpacity(id: string, opacity: number): boolean;
    /**
     * Set layer blend mode
     */
    setLayerBlendMode(id: string, blendMode: BlendMode): boolean;
    /**
     * Set the active layer
     *
     * Behavior:
     * - Allows activating any layer including locked layers
     * - When a locked layer is active, drawing will be disabled
     * - Makes all other layers invisible when a layer is activated
     * - This ensures only the active layer is visible
     */
    setActiveLayer(id: string): boolean;
    /**
     * Get the active layer ID
     */
    getActiveLayerId(): string;
    /**
     * Check if the active layer is in a valid drawing state
     * Valid means: exists, visible, and unlocked
     */
    isActiveLayerValid(): boolean;
    /**
     * Get any issues with the current active layer
     * Returns empty array if no issues
     */
    getActiveLayerIssues(): string[];
    /**
     * Assign element to active layer
     */
    assignElementToActiveLayer(elementId: string): boolean;
    /**
     * Assign element to specific layer
     */
    assignElementToLayer(elementId: string, layerId: string): boolean;
    /**
     * Remove element from all layers
     */
    removeElementFromAllLayers(elementId: string): void;
    /**
     * Get layer containing element
     */
    getElementLayer(elementId: string): WhiteboardLayer | null;
    /**
     * Get elements from visible layers only
     */
    getVisibleElements(allElements: WhiteboardElement[]): WhiteboardElement[];
    /**
     * Get elements from unlocked layers only (for editing)
     */
    getEditableElements(allElements: WhiteboardElement[]): WhiteboardElement[];
    /**
     * Get elements sorted by layer z-index
     */
    getSortedElements(allElements: WhiteboardElement[]): WhiteboardElement[];
    /**
     * Serialize layer state for saving
     */
    exportLayerState(): LayerState;
    /**
     * Restore layer state from saved data
     */
    importLayerState(state: LayerState): void;
    /**
     * Reset to default state
     */
    reset(): void;
    private initializeDefaultLayer;
    private generateLayerId;
    private updateLayerProperty;
    static ɵfac: i0.ɵɵFactoryDeclaration<LayerManagementService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LayerManagementService>;
}
