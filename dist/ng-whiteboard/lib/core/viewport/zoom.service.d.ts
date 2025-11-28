import { OnDestroy } from '@angular/core';
import { WhiteboardElement } from '../types';
import * as i0 from "@angular/core";
/**
 * Manages zoom operations for the whiteboard canvas including zoom in/out,
 * zoom to fit, zoom to selection, and zoom bounds management.
 */
export declare class ZoomService implements OnDestroy {
    private canvasService;
    private elementsService;
    private selectionService;
    private configService;
    private eventBusService;
    private readonly DEFAULT_FIT_MARGIN;
    private zoomSubscription;
    constructor();
    ngOnDestroy(): void;
    private emitZoomChangeEvent;
    private getConfig;
    private centerCanvas;
    /**
     * Set zoom level with optional animation.
     */
    zoom(zoom: number, animated?: boolean, duration?: number): void;
    /**
     * Zoom in by step amount.
     */
    zoomIn(animated?: boolean, duration?: number): void;
    /**
     * Zoom out by step amount.
     */
    zoomOut(animated?: boolean, duration?: number): void;
    /**
     * Reset zoom to 100%.
     */
    resetZoom(animated?: boolean, duration?: number): void;
    /**
     * Get current zoom level.
     */
    getZoomLevel(): number;
    /**
     * Get current zoom level as percentage.
     */
    getZoomPercentage(): number;
    /**
     * Zoom to fit all elements in the viewport.
     */
    zoomToFit(margin?: number, animated?: boolean, duration?: number): void;
    /**
     * Zoom to fit selected elements.
     */
    zoomToSelection(margin?: number, animated?: boolean, duration?: number): void;
    /**
     * Zoom to fit specific elements.
     */
    zoomToElements(elements: WhiteboardElement[], margin?: number, animated?: boolean, duration?: number): void;
    /**
     * Zoom to fit a specific rectangular area.
     */
    zoomToArea(x: number, y: number, width: number, height: number, margin?: number, animated?: boolean, duration?: number): void;
    /**
     * Get optimal zoom level for given dimensions.
     */
    getOptimalZoom(contentWidth: number, contentHeight: number, margin?: number): number;
    /**
     * Clamp zoom value to valid range.
     */
    clampZoom(zoom: number): number;
    /**
     * Check if zoom level is valid.
     */
    isValidZoom(zoom: number): boolean;
    /**
     * Get zoom limits.
     */
    getZoomLimits(): {
        min: number;
        max: number;
    };
    private easeInOutCubic;
    private setInstant;
    private animateToTarget;
    static ɵfac: i0.ɵɵFactoryDeclaration<ZoomService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ZoomService>;
}
