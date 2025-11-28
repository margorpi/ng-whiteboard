import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { EventBusService } from '../event-bus/event-bus.service';
import * as i0 from "@angular/core";
import * as i1 from "../config/config.service";
import * as i2 from "../event-bus/event-bus.service";
/**
 * Manages canvas panning operations including pan by delta, pan to position,
 * pan constraints, and bounds checking.
 */
export class PanService {
    configService;
    eventBusService;
    DEFAULT_PAN_BOUNDS = { x: -Infinity, y: -Infinity, width: Infinity, height: Infinity };
    panBounds = this.DEFAULT_PAN_BOUNDS;
    constructor(configService, eventBusService) {
        this.configService = configService;
        this.eventBusService = eventBusService;
    }
    getConfig() {
        return this.configService.getConfig();
    }
    /**
     * Pan the canvas by delta amounts.
     */
    pan(dx, dy) {
        const config = this.getConfig();
        const { x, y } = config;
        const newX = x + dx;
        const newY = y + dy;
        // Apply pan constraints
        const constrainedPosition = this.constrainPanPosition(newX, newY);
        this.setCanvasPosition(constrainedPosition.x, constrainedPosition.y);
    }
    /**
     * Pan to specific position.
     */
    panTo(x, y) {
        const constrainedPosition = this.constrainPanPosition(x, y);
        this.setCanvasPosition(constrainedPosition.x, constrainedPosition.y);
    }
    setCanvasPosition(x, y) {
        this.configService.updateConfig({ x, y });
    }
    /**
     * Get current pan position.
     */
    getPanPosition() {
        const config = this.getConfig();
        return { x: config.x, y: config.y };
    }
    /**
     * Reset pan to origin.
     */
    resetPan() {
        this.setCanvasPosition(0, 0);
    }
    /**
     * Set pan bounds to constrain panning within specific area.
     */
    setPanBounds(bounds) {
        this.panBounds = bounds;
    }
    /**
     * Reset pan bounds to unlimited.
     */
    resetPanBounds() {
        this.panBounds = this.DEFAULT_PAN_BOUNDS;
    }
    /**
     * Get current pan bounds.
     */
    getPanBounds() {
        return { ...this.panBounds };
    }
    constrainPanPosition(x, y) {
        if (this.panBounds === this.DEFAULT_PAN_BOUNDS) {
            return { x, y };
        }
        const constrainedX = Math.max(this.panBounds.x, Math.min(this.panBounds.x + this.panBounds.width, x));
        const constrainedY = Math.max(this.panBounds.y, Math.min(this.panBounds.y + this.panBounds.height, y));
        return { x: constrainedX, y: constrainedY };
    }
    /**
     * Check if position is within pan bounds.
     */
    isPositionWithinBounds(x, y) {
        if (this.panBounds === this.DEFAULT_PAN_BOUNDS) {
            return true;
        }
        return (x >= this.panBounds.x &&
            x <= this.panBounds.x + this.panBounds.width &&
            y >= this.panBounds.y &&
            y <= this.panBounds.y + this.panBounds.height);
    }
    /**
     * Get distance to pan bounds from current position.
     */
    getDistanceToBounds() {
        const { x, y } = this.getPanPosition();
        if (this.panBounds === this.DEFAULT_PAN_BOUNDS) {
            return { left: Infinity, top: Infinity, right: Infinity, bottom: Infinity };
        }
        return {
            left: x - this.panBounds.x,
            top: y - this.panBounds.y,
            right: this.panBounds.x + this.panBounds.width - x,
            bottom: this.panBounds.y + this.panBounds.height - y,
        };
    }
    /**
     * Pan with easing animation.
     */
    panWithEasing(targetX, targetY) {
        this.panTo(targetX, targetY);
    }
    /**
     * Pan by delta with momentum.
     */
    panWithMomentum(dx, dy) {
        this.pan(dx, dy);
    }
    /**
     * Extension point for custom pan constraints validation.
     */
    validatePanOperation(x, y, dx, dy) {
        return this.isPositionWithinBounds(x + dx, y + dy);
    }
    /**
     * Extension point for custom pan acceleration.
     */
    applyPanAcceleration(dx, dy) {
        return { dx, dy };
    }
    /**
     * Extension point for pan state change callback.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onPanChange(_oldPosition, _newPosition) {
        // Override in derived classes for custom behavior
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PanService, deps: [{ token: i1.ConfigService }, { token: i2.EventBusService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PanService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PanService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.ConfigService }, { type: i2.EventBusService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFuLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy13aGl0ZWJvYXJkL3NyYy9saWIvY29yZS92aWV3cG9ydC9wYW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7Ozs7QUFHakU7OztHQUdHO0FBRUgsTUFBTSxPQUFPLFVBQVU7SUFJRDtJQUFzQztJQUh6QyxrQkFBa0IsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLENBQUM7SUFDaEcsU0FBUyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztJQUU1QyxZQUFvQixhQUE0QixFQUFVLGVBQWdDO1FBQXRFLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVUsb0JBQWUsR0FBZixlQUFlLENBQWlCO0lBQUcsQ0FBQztJQUV0RixTQUFTO1FBQ2YsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFRDs7T0FFRztJQUNILEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBVTtRQUN4QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUM7UUFFeEIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNwQixNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXBCLHdCQUF3QjtRQUN4QixNQUFN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O1FBQ3pFLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRDs7T0FFRztJQUNPLG9CQUFvQixDQUFDLEVBQVUsRUFBRSxFQUFVO1FBQ25ELE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsNkRBQTZEO0lBQ25ELFdBQVcsQ0FBQyxZQUFzQyxFQUFFLFlBQXNDO1FBQ2xHLGtEQUFrRDtJQUNwRCxDQUFDO3dHQTFKVSxVQUFVOzRHQUFWLFVBQVUsY0FERyxNQUFNOzs0RkFDbkIsVUFBVTtrQkFEdEIsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbmZpZ1NlcnZpY2UgfSBmcm9tICcuLi9jb25maWcvY29uZmlnLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBFdmVudEJ1c1NlcnZpY2UgfSBmcm9tICcuLi9ldmVudC1idXMvZXZlbnQtYnVzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBXaGl0ZWJvYXJkQ29uZmlnIH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5cclxuLyoqXHJcbiAqIE1hbmFnZXMgY2FudmFzIHBhbm5pbmcgb3BlcmF0aW9ucyBpbmNsdWRpbmcgcGFuIGJ5IGRlbHRhLCBwYW4gdG8gcG9zaXRpb24sXHJcbiAqIHBhbiBjb25zdHJhaW50cywgYW5kIGJvdW5kcyBjaGVja2luZy5cclxuICovXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBQYW5TZXJ2aWNlIHtcclxuICBwcml2YXRlIHJlYWRvbmx5IERFRkFVTFRfUEFOX0JPVU5EUyA9IHsgeDogLUluZmluaXR5LCB5OiAtSW5maW5pdHksIHdpZHRoOiBJbmZpbml0eSwgaGVpZ2h0OiBJbmZpbml0eSB9O1xyXG4gIHByaXZhdGUgcGFuQm91bmRzID0gdGhpcy5ERUZBVUxUX1BBTl9CT1VORFM7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnU2VydmljZTogQ29uZmlnU2VydmljZSwgcHJpdmF0ZSBldmVudEJ1c1NlcnZpY2U6IEV2ZW50QnVzU2VydmljZSkge31cclxuXHJcbiAgcHJpdmF0ZSBnZXRDb25maWcoKTogV2hpdGVib2FyZENvbmZpZyB7XHJcbiAgICByZXR1cm4gdGhpcy5jb25maWdTZXJ2aWNlLmdldENvbmZpZygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGFuIHRoZSBjYW52YXMgYnkgZGVsdGEgYW1vdW50cy5cclxuICAgKi9cclxuICBwYW4oZHg6IG51bWJlciwgZHk6IG51bWJlcik6IHZvaWQge1xyXG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXRDb25maWcoKTtcclxuICAgIGNvbnN0IHsgeCwgeSB9ID0gY29uZmlnO1xyXG5cclxuICAgIGNvbnN0IG5ld1ggPSB4ICsgZHg7XHJcbiAgICBjb25zdCBuZXdZID0geSArIGR5O1xyXG5cclxuICAgIC8vIEFwcGx5IHBhbiBjb25zdHJhaW50c1xyXG4gICAgY29uc3QgY29uc3RyYWluZWRQb3NpdGlvbiA9IHRoaXMuY29uc3RyYWluUGFuUG9zaXRpb24obmV3WCwgbmV3WSk7XHJcblxyXG4gICAgdGhpcy5zZXRDYW52YXNQb3NpdGlvbihjb25zdHJhaW5lZFBvc2l0aW9uLngsIGNvbnN0cmFpbmVkUG9zaXRpb24ueSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYW4gdG8gc3BlY2lmaWMgcG9zaXRpb24uXHJcbiAgICovXHJcbiAgcGFuVG8oeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGNvbnN0IGNvbnN0cmFpbmVkUG9zaXRpb24gPSB0aGlzLmNvbnN0cmFpblBhblBvc2l0aW9uKHgsIHkpO1xyXG4gICAgdGhpcy5zZXRDYW52YXNQb3NpdGlvbihjb25zdHJhaW5lZFBvc2l0aW9uLngsIGNvbnN0cmFpbmVkUG9zaXRpb24ueSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldENhbnZhc1Bvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLmNvbmZpZ1NlcnZpY2UudXBkYXRlQ29uZmlnKHsgeCwgeSB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBjdXJyZW50IHBhbiBwb3NpdGlvbi5cclxuICAgKi9cclxuICBnZXRQYW5Qb3NpdGlvbigpOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0ge1xyXG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXRDb25maWcoKTtcclxuICAgIHJldHVybiB7IHg6IGNvbmZpZy54LCB5OiBjb25maWcueSB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzZXQgcGFuIHRvIG9yaWdpbi5cclxuICAgKi9cclxuICByZXNldFBhbigpOiB2b2lkIHtcclxuICAgIHRoaXMuc2V0Q2FudmFzUG9zaXRpb24oMCwgMCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgcGFuIGJvdW5kcyB0byBjb25zdHJhaW4gcGFubmluZyB3aXRoaW4gc3BlY2lmaWMgYXJlYS5cclxuICAgKi9cclxuICBzZXRQYW5Cb3VuZHMoYm91bmRzOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9KTogdm9pZCB7XHJcbiAgICB0aGlzLnBhbkJvdW5kcyA9IGJvdW5kcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc2V0IHBhbiBib3VuZHMgdG8gdW5saW1pdGVkLlxyXG4gICAqL1xyXG4gIHJlc2V0UGFuQm91bmRzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5wYW5Cb3VuZHMgPSB0aGlzLkRFRkFVTFRfUEFOX0JPVU5EUztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBjdXJyZW50IHBhbiBib3VuZHMuXHJcbiAgICovXHJcbiAgZ2V0UGFuQm91bmRzKCk6IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH0ge1xyXG4gICAgcmV0dXJuIHsgLi4udGhpcy5wYW5Cb3VuZHMgfTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY29uc3RyYWluUGFuUG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0ge1xyXG4gICAgaWYgKHRoaXMucGFuQm91bmRzID09PSB0aGlzLkRFRkFVTFRfUEFOX0JPVU5EUykge1xyXG4gICAgICByZXR1cm4geyB4LCB5IH07XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY29uc3RyYWluZWRYID0gTWF0aC5tYXgodGhpcy5wYW5Cb3VuZHMueCwgTWF0aC5taW4odGhpcy5wYW5Cb3VuZHMueCArIHRoaXMucGFuQm91bmRzLndpZHRoLCB4KSk7XHJcblxyXG4gICAgY29uc3QgY29uc3RyYWluZWRZID0gTWF0aC5tYXgodGhpcy5wYW5Cb3VuZHMueSwgTWF0aC5taW4odGhpcy5wYW5Cb3VuZHMueSArIHRoaXMucGFuQm91bmRzLmhlaWdodCwgeSkpO1xyXG5cclxuICAgIHJldHVybiB7IHg6IGNvbnN0cmFpbmVkWCwgeTogY29uc3RyYWluZWRZIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBwb3NpdGlvbiBpcyB3aXRoaW4gcGFuIGJvdW5kcy5cclxuICAgKi9cclxuICBpc1Bvc2l0aW9uV2l0aGluQm91bmRzKHg6IG51bWJlciwgeTogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICBpZiAodGhpcy5wYW5Cb3VuZHMgPT09IHRoaXMuREVGQVVMVF9QQU5fQk9VTkRTKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIHggPj0gdGhpcy5wYW5Cb3VuZHMueCAmJlxyXG4gICAgICB4IDw9IHRoaXMucGFuQm91bmRzLnggKyB0aGlzLnBhbkJvdW5kcy53aWR0aCAmJlxyXG4gICAgICB5ID49IHRoaXMucGFuQm91bmRzLnkgJiZcclxuICAgICAgeSA8PSB0aGlzLnBhbkJvdW5kcy55ICsgdGhpcy5wYW5Cb3VuZHMuaGVpZ2h0XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGRpc3RhbmNlIHRvIHBhbiBib3VuZHMgZnJvbSBjdXJyZW50IHBvc2l0aW9uLlxyXG4gICAqL1xyXG4gIGdldERpc3RhbmNlVG9Cb3VuZHMoKTogeyBsZWZ0OiBudW1iZXI7IHRvcDogbnVtYmVyOyByaWdodDogbnVtYmVyOyBib3R0b206IG51bWJlciB9IHtcclxuICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRQYW5Qb3NpdGlvbigpO1xyXG5cclxuICAgIGlmICh0aGlzLnBhbkJvdW5kcyA9PT0gdGhpcy5ERUZBVUxUX1BBTl9CT1VORFMpIHtcclxuICAgICAgcmV0dXJuIHsgbGVmdDogSW5maW5pdHksIHRvcDogSW5maW5pdHksIHJpZ2h0OiBJbmZpbml0eSwgYm90dG9tOiBJbmZpbml0eSB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGxlZnQ6IHggLSB0aGlzLnBhbkJvdW5kcy54LFxyXG4gICAgICB0b3A6IHkgLSB0aGlzLnBhbkJvdW5kcy55LFxyXG4gICAgICByaWdodDogdGhpcy5wYW5Cb3VuZHMueCArIHRoaXMucGFuQm91bmRzLndpZHRoIC0geCxcclxuICAgICAgYm90dG9tOiB0aGlzLnBhbkJvdW5kcy55ICsgdGhpcy5wYW5Cb3VuZHMuaGVpZ2h0IC0geSxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYW4gd2l0aCBlYXNpbmcgYW5pbWF0aW9uLlxyXG4gICAqL1xyXG4gIHBhbldpdGhFYXNpbmcodGFyZ2V0WDogbnVtYmVyLCB0YXJnZXRZOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMucGFuVG8odGFyZ2V0WCwgdGFyZ2V0WSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYW4gYnkgZGVsdGEgd2l0aCBtb21lbnR1bS5cclxuICAgKi9cclxuICBwYW5XaXRoTW9tZW50dW0oZHg6IG51bWJlciwgZHk6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy5wYW4oZHgsIGR5KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4dGVuc2lvbiBwb2ludCBmb3IgY3VzdG9tIHBhbiBjb25zdHJhaW50cyB2YWxpZGF0aW9uLlxyXG4gICAqL1xyXG4gIHByb3RlY3RlZCB2YWxpZGF0ZVBhbk9wZXJhdGlvbih4OiBudW1iZXIsIHk6IG51bWJlciwgZHg6IG51bWJlciwgZHk6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNQb3NpdGlvbldpdGhpbkJvdW5kcyh4ICsgZHgsIHkgKyBkeSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gcG9pbnQgZm9yIGN1c3RvbSBwYW4gYWNjZWxlcmF0aW9uLlxyXG4gICAqL1xyXG4gIHByb3RlY3RlZCBhcHBseVBhbkFjY2VsZXJhdGlvbihkeDogbnVtYmVyLCBkeTogbnVtYmVyKTogeyBkeDogbnVtYmVyOyBkeTogbnVtYmVyIH0ge1xyXG4gICAgcmV0dXJuIHsgZHgsIGR5IH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gcG9pbnQgZm9yIHBhbiBzdGF0ZSBjaGFuZ2UgY2FsbGJhY2suXHJcbiAgICovXHJcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xyXG4gIHByb3RlY3RlZCBvblBhbkNoYW5nZShfb2xkUG9zaXRpb246IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSwgX25ld1Bvc2l0aW9uOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pOiB2b2lkIHtcclxuICAgIC8vIE92ZXJyaWRlIGluIGRlcml2ZWQgY2xhc3NlcyBmb3IgY3VzdG9tIGJlaGF2aW9yXHJcbiAgfVxyXG59XHJcbiJdfQ==