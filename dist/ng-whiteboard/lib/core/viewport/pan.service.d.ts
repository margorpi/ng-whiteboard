import { ConfigService } from '../config/config.service';
import { EventBusService } from '../event-bus/event-bus.service';
import * as i0 from "@angular/core";
/**
 * Manages canvas panning operations including pan by delta, pan to position,
 * pan constraints, and bounds checking.
 */
export declare class PanService {
    private configService;
    private eventBusService;
    private readonly DEFAULT_PAN_BOUNDS;
    private panBounds;
    constructor(configService: ConfigService, eventBusService: EventBusService);
    private getConfig;
    /**
     * Pan the canvas by delta amounts.
     */
    pan(dx: number, dy: number): void;
    /**
     * Pan to specific position.
     */
    panTo(x: number, y: number): void;
    private setCanvasPosition;
    /**
     * Get current pan position.
     */
    getPanPosition(): {
        x: number;
        y: number;
    };
    /**
     * Reset pan to origin.
     */
    resetPan(): void;
    /**
     * Set pan bounds to constrain panning within specific area.
     */
    setPanBounds(bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): void;
    /**
     * Reset pan bounds to unlimited.
     */
    resetPanBounds(): void;
    /**
     * Get current pan bounds.
     */
    getPanBounds(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    private constrainPanPosition;
    /**
     * Check if position is within pan bounds.
     */
    isPositionWithinBounds(x: number, y: number): boolean;
    /**
     * Get distance to pan bounds from current position.
     */
    getDistanceToBounds(): {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    /**
     * Pan with easing animation.
     */
    panWithEasing(targetX: number, targetY: number): void;
    /**
     * Pan by delta with momentum.
     */
    panWithMomentum(dx: number, dy: number): void;
    /**
     * Extension point for custom pan constraints validation.
     */
    protected validatePanOperation(x: number, y: number, dx: number, dy: number): boolean;
    /**
     * Extension point for custom pan acceleration.
     */
    protected applyPanAcceleration(dx: number, dy: number): {
        dx: number;
        dy: number;
    };
    /**
     * Extension point for pan state change callback.
     */
    protected onPanChange(_oldPosition: {
        x: number;
        y: number;
    }, _newPosition: {
        x: number;
        y: number;
    }): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PanService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PanService>;
}
