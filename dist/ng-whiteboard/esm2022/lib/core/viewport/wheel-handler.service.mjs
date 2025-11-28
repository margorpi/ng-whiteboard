import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { PAN_SENSITIVITY } from '../constants';
import * as i0 from "@angular/core";
/**
 * Handles mouse wheel events for zoom and pan operations.
 */
export class WheelHandlerService {
    apiService = inject(ApiService);
    handleWheel(event) {
        event.preventDefault();
        if (event.ctrlKey) {
            this.handleZoom(event);
        }
        else if (event.shiftKey) {
            this.handleHorizontalPan(event);
        }
        else {
            this.handleVerticalPan(event);
        }
    }
    handleZoom(event) {
        const zoomDirection = event.deltaY < 0 ? 1 : -1;
        if (zoomDirection > 0) {
            this.apiService.zoomIn();
        }
        else {
            this.apiService.zoomOut();
        }
    }
    handleHorizontalPan(event) {
        const config = this.apiService.getConfig();
        const panDelta = (event.deltaY * PAN_SENSITIVITY) / config.zoom;
        this.apiService.pan(panDelta, 0);
    }
    handleVerticalPan(event) {
        const config = this.apiService.getConfig();
        const panDelta = (event.deltaY * PAN_SENSITIVITY) / config.zoom;
        this.apiService.pan(0, panDelta);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: WheelHandlerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: WheelHandlerService });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: WheelHandlerService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2hlZWwtaGFuZGxlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmctd2hpdGVib2FyZC9zcmMvbGliL2NvcmUvdmlld3BvcnQvd2hlZWwtaGFuZGxlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sY0FBYyxDQUFDOztBQUUvQzs7R0FFRztBQUVILE1BQU0sT0FBTyxtQkFBbUI7SUFDdEIsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUV4QyxXQUFXLENBQUMsS0FBaUI7UUFDM0IsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXZCLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsQ0FBQzthQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxDQUFDO2FBQU0sQ0FBQztZQUNOLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQyxDQUFDO0lBQ0gsQ0FBQztJQUVPLFVBQVUsQ0FBQyxLQUFpQjtRQUNsQyxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVoRCxJQUFJLGFBQWEsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzNCLENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM1QixDQUFDO0lBQ0gsQ0FBQztJQUVPLG1CQUFtQixDQUFDLEtBQWlCO1FBQzNDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDM0MsTUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLGVBQWUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFTyxpQkFBaUIsQ0FBQyxLQUFpQjtRQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hFLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO3dHQW5DVSxtQkFBbUI7NEdBQW5CLG1CQUFtQjs7NEZBQW5CLG1CQUFtQjtrQkFEL0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBcGlTZXJ2aWNlIH0gZnJvbSAnLi4vYXBpL2FwaS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUEFOX1NFTlNJVElWSVRZIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcclxuXHJcbi8qKlxyXG4gKiBIYW5kbGVzIG1vdXNlIHdoZWVsIGV2ZW50cyBmb3Igem9vbSBhbmQgcGFuIG9wZXJhdGlvbnMuXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBXaGVlbEhhbmRsZXJTZXJ2aWNlIHtcclxuICBwcml2YXRlIGFwaVNlcnZpY2UgPSBpbmplY3QoQXBpU2VydmljZSk7XHJcblxyXG4gIGhhbmRsZVdoZWVsKGV2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGlmIChldmVudC5jdHJsS2V5KSB7XHJcbiAgICAgIHRoaXMuaGFuZGxlWm9vbShldmVudCk7XHJcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XHJcbiAgICAgIHRoaXMuaGFuZGxlSG9yaXpvbnRhbFBhbihldmVudCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmhhbmRsZVZlcnRpY2FsUGFuKGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgaGFuZGxlWm9vbShldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xyXG4gICAgY29uc3Qgem9vbURpcmVjdGlvbiA9IGV2ZW50LmRlbHRhWSA8IDAgPyAxIDogLTE7XHJcblxyXG4gICAgaWYgKHpvb21EaXJlY3Rpb24gPiAwKSB7XHJcbiAgICAgIHRoaXMuYXBpU2VydmljZS56b29tSW4oKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYXBpU2VydmljZS56b29tT3V0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhhbmRsZUhvcml6b250YWxQYW4oZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkIHtcclxuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuYXBpU2VydmljZS5nZXRDb25maWcoKTtcclxuICAgIGNvbnN0IHBhbkRlbHRhID0gKGV2ZW50LmRlbHRhWSAqIFBBTl9TRU5TSVRJVklUWSkgLyBjb25maWcuem9vbTtcclxuICAgIHRoaXMuYXBpU2VydmljZS5wYW4ocGFuRGVsdGEsIDApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBoYW5kbGVWZXJ0aWNhbFBhbihldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xyXG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5hcGlTZXJ2aWNlLmdldENvbmZpZygpO1xyXG4gICAgY29uc3QgcGFuRGVsdGEgPSAoZXZlbnQuZGVsdGFZICogUEFOX1NFTlNJVElWSVRZKSAvIGNvbmZpZy56b29tO1xyXG4gICAgdGhpcy5hcGlTZXJ2aWNlLnBhbigwLCBwYW5EZWx0YSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==