import { ChangeDetectorRef, Directive, ElementRef } from '@angular/core';
import { ApiService } from '../api/api.service';
import * as i0 from "@angular/core";
import * as i1 from "../api/api.service";
export class ResizeHandlerDirective {
    elementRef;
    apiService;
    _cd;
    resizeObserver;
    constructor(elementRef, apiService, _cd) {
        this.elementRef = elementRef;
        this.apiService = apiService;
        this._cd = _cd;
    }
    ngOnInit() {
        this.resizeObserver = new ResizeObserver(([entry]) => {
            if (entry.target === this.elementRef.nativeElement) {
                const { fullScreen, center } = this.apiService.getConfig();
                setTimeout(() => {
                    if (fullScreen) {
                        this.apiService.fullScreen();
                    }
                    if (center && !fullScreen) {
                        this.apiService.centerCanvas();
                    }
                    this._cd.detectChanges();
                }, 0);
            }
        });
        this.resizeObserver.observe(this.elementRef.nativeElement);
    }
    ngOnDestroy() {
        this.resizeObserver?.disconnect();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ResizeHandlerDirective, deps: [{ token: i0.ElementRef }, { token: i1.ApiService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: ResizeHandlerDirective, isStandalone: true, selector: "[resizeHandler]", ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ResizeHandlerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[resizeHandler]',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.ApiService }, { type: i0.ChangeDetectorRef }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplLWhhbmRsZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmctd2hpdGVib2FyZC9zcmMvbGliL2NvcmUvZGlyZWN0aXZlcy9yZXNpemUtaGFuZGxlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQXFCLE1BQU0sZUFBZSxDQUFDO0FBQzVGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQzs7O0FBTWhELE1BQU0sT0FBTyxzQkFBc0I7SUFHYjtJQUFnQztJQUFnQztJQUY1RSxjQUFjLENBQWtCO0lBRXhDLFlBQW9CLFVBQXNCLEVBQVUsVUFBc0IsRUFBVSxHQUFzQjtRQUF0RixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLFFBQUcsR0FBSCxHQUFHLENBQW1CO0lBQUcsQ0FBQztJQUU5RyxRQUFRO1FBQ04sSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRTtZQUNuRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDbkQsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUUzRCxVQUFVLENBQUMsR0FBRyxFQUFFO29CQUNkLElBQUksVUFBVSxFQUFFLENBQUM7d0JBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDL0IsQ0FBQztvQkFDRCxJQUFJLE1BQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO3dCQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUNqQyxDQUFDO29CQUNELElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQzNCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNSLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsY0FBYyxFQUFFLFVBQVUsRUFBRSxDQUFDO0lBQ3BDLENBQUM7d0dBMUJVLHNCQUFzQjs0RkFBdEIsc0JBQXNCOzs0RkFBdEIsc0JBQXNCO2tCQUpsQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdG9yUmVmLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFwaVNlcnZpY2UgfSBmcm9tICcuLi9hcGkvYXBpLnNlcnZpY2UnO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdbcmVzaXplSGFuZGxlcl0nLFxyXG4gIHN0YW5kYWxvbmU6IHRydWUsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBSZXNpemVIYW5kbGVyRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xyXG4gIHByaXZhdGUgcmVzaXplT2JzZXJ2ZXIhOiBSZXNpemVPYnNlcnZlcjtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcml2YXRlIGFwaVNlcnZpY2U6IEFwaVNlcnZpY2UsIHByaXZhdGUgX2NkOiBDaGFuZ2VEZXRlY3RvclJlZikge31cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLnJlc2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKChbZW50cnldKSA9PiB7XHJcbiAgICAgIGlmIChlbnRyeS50YXJnZXQgPT09IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgICAgY29uc3QgeyBmdWxsU2NyZWVuLCBjZW50ZXIgfSA9IHRoaXMuYXBpU2VydmljZS5nZXRDb25maWcoKTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZnVsbFNjcmVlbikge1xyXG4gICAgICAgICAgICB0aGlzLmFwaVNlcnZpY2UuZnVsbFNjcmVlbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGNlbnRlciAmJiAhZnVsbFNjcmVlbikge1xyXG4gICAgICAgICAgICB0aGlzLmFwaVNlcnZpY2UuY2VudGVyQ2FudmFzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLl9jZC5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICAgICAgfSwgMCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgdGhpcy5yZXNpemVPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgdGhpcy5yZXNpemVPYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xyXG4gIH1cclxufVxyXG4iXX0=