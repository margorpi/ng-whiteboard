import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { SvgService } from '../svg/svg.service';
import * as i0 from "@angular/core";
export class GlobalKeyboardDirective {
    configService = inject(ConfigService);
    svgService = inject(SvgService);
    elementRef = inject(ElementRef);
    isHovered = false;
    lastInteractionTime = 0;
    INTERACTION_TIMEOUT = 500;
    static activeDirective = null;
    ngOnInit() {
        const element = this.elementRef.nativeElement;
        element.addEventListener('mouseenter', this.handleMouseEnter);
        element.addEventListener('mouseleave', this.handleMouseLeave);
        element.addEventListener('pointerdown', this.handleInteraction);
        element.addEventListener('pointerup', this.handleInteraction);
    }
    ngOnDestroy() {
        const element = this.elementRef.nativeElement;
        element.removeEventListener('mouseenter', this.handleMouseEnter);
        element.removeEventListener('mouseleave', this.handleMouseLeave);
        element.removeEventListener('pointerdown', this.handleInteraction);
        element.removeEventListener('pointerup', this.handleInteraction);
        if (GlobalKeyboardDirective.activeDirective === this) {
            GlobalKeyboardDirective.activeDirective = null;
        }
    }
    handleMouseEnter = () => {
        this.isHovered = true;
        GlobalKeyboardDirective.activeDirective = this;
    };
    handleMouseLeave = () => {
        this.isHovered = false;
    };
    handleInteraction = () => {
        this.lastInteractionTime = Date.now();
        GlobalKeyboardDirective.activeDirective = this;
    };
    isActiveWhiteboard() {
        const recentlyInteracted = Date.now() - this.lastInteractionTime < this.INTERACTION_TIMEOUT;
        return this.isHovered || recentlyInteracted || GlobalKeyboardDirective.activeDirective === this;
    }
    onGlobalKeyDown(event) {
        if (!this.configService.getConfig().keyboardShortcutsEnabled) {
            return;
        }
        if (!this.isActiveWhiteboard()) {
            return;
        }
        this.svgService.onKeyDown(event);
    }
    onGlobalKeyUp(event) {
        if (!this.configService.getConfig().keyboardShortcutsEnabled) {
            return;
        }
        if (!this.isActiveWhiteboard()) {
            return;
        }
        this.svgService.onKeyUp(event);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: GlobalKeyboardDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: GlobalKeyboardDirective, isStandalone: true, selector: "[globalKeyboard]", host: { listeners: { "window:keydown": "onGlobalKeyDown($event)", "window:keyup": "onGlobalKeyUp($event)" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: GlobalKeyboardDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[globalKeyboard]',
                    standalone: true,
                }]
        }], propDecorators: { onGlobalKeyDown: [{
                type: HostListener,
                args: ['window:keydown', ['$event']]
            }], onGlobalKeyUp: [{
                type: HostListener,
                args: ['window:keyup', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLWtleWJvYXJkLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLXdoaXRlYm9hcmQvc3JjL2xpYi9jb3JlL2RpcmVjdGl2ZXMvZ2xvYmFsLWtleWJvYXJkLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUMvRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDOztBQU1oRCxNQUFNLE9BQU8sdUJBQXVCO0lBQzFCLGFBQWEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdEMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNoQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRWhDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDbEIsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsbUJBQW1CLEdBQUcsR0FBRyxDQUFDO0lBRW5DLE1BQU0sQ0FBQyxlQUFlLEdBQW1DLElBQUksQ0FBQztJQUV0RSxRQUFRO1FBQ04sTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFDOUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM5RCxPQUFPLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlELE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDaEUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsV0FBVztRQUNULE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBQzlDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDakUsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNqRSxPQUFPLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ25FLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFakUsSUFBSSx1QkFBdUIsQ0FBQyxlQUFlLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDckQsdUJBQXVCLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUNqRCxDQUFDO0lBQ0gsQ0FBQztJQUVPLGdCQUFnQixHQUFHLEdBQVMsRUFBRTtRQUNwQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0Qix1QkFBdUIsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0lBQ2pELENBQUMsQ0FBQztJQUVNLGdCQUFnQixHQUFHLEdBQVMsRUFBRTtRQUNwQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUN6QixDQUFDLENBQUM7SUFFTSxpQkFBaUIsR0FBRyxHQUFTLEVBQUU7UUFDckMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN0Qyx1QkFBdUIsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0lBQ2pELENBQUMsQ0FBQztJQUVNLGtCQUFrQjtRQUN4QixNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDO1FBQzVGLE9BQU8sSUFBSSxDQUFDLFNBQVMsSUFBSSxrQkFBa0IsSUFBSSx1QkFBdUIsQ0FBQyxlQUFlLEtBQUssSUFBSSxDQUFDO0lBQ2xHLENBQUM7SUFHRCxlQUFlLENBQUMsS0FBb0I7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztZQUM3RCxPQUFPO1FBQ1QsQ0FBQztRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDO1lBQy9CLE9BQU87UUFDVCxDQUFDO1FBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUdELGFBQWEsQ0FBQyxLQUFvQjtRQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1lBQzdELE9BQU87UUFDVCxDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUM7WUFDL0IsT0FBTztRQUNULENBQUM7UUFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO3dHQTFFVSx1QkFBdUI7NEZBQXZCLHVCQUF1Qjs7NEZBQXZCLHVCQUF1QjtrQkFKbkMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsa0JBQWtCO29CQUM1QixVQUFVLEVBQUUsSUFBSTtpQkFDakI7OEJBb0RDLGVBQWU7c0JBRGQsWUFBWTt1QkFBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFjMUMsYUFBYTtzQkFEWixZQUFZO3VCQUFDLGNBQWMsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBpbmplY3QsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbmZpZ1NlcnZpY2UgfSBmcm9tICcuLi9jb25maWcvY29uZmlnLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdmdTZXJ2aWNlIH0gZnJvbSAnLi4vc3ZnL3N2Zy5zZXJ2aWNlJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnW2dsb2JhbEtleWJvYXJkXScsXHJcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcclxufSlcclxuZXhwb3J0IGNsYXNzIEdsb2JhbEtleWJvYXJkRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xyXG4gIHByaXZhdGUgY29uZmlnU2VydmljZSA9IGluamVjdChDb25maWdTZXJ2aWNlKTtcclxuICBwcml2YXRlIHN2Z1NlcnZpY2UgPSBpbmplY3QoU3ZnU2VydmljZSk7XHJcbiAgcHJpdmF0ZSBlbGVtZW50UmVmID0gaW5qZWN0KEVsZW1lbnRSZWYpO1xyXG5cclxuICBwcml2YXRlIGlzSG92ZXJlZCA9IGZhbHNlO1xyXG4gIHByaXZhdGUgbGFzdEludGVyYWN0aW9uVGltZSA9IDA7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBJTlRFUkFDVElPTl9USU1FT1VUID0gNTAwO1xyXG5cclxuICBwcml2YXRlIHN0YXRpYyBhY3RpdmVEaXJlY3RpdmU6IEdsb2JhbEtleWJvYXJkRGlyZWN0aXZlIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5oYW5kbGVNb3VzZUVudGVyKTtcclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMuaGFuZGxlTW91c2VMZWF2ZSk7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5oYW5kbGVJbnRlcmFjdGlvbik7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuaGFuZGxlSW50ZXJhY3Rpb24pO1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLmhhbmRsZU1vdXNlRW50ZXIpO1xyXG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5oYW5kbGVNb3VzZUxlYXZlKTtcclxuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCB0aGlzLmhhbmRsZUludGVyYWN0aW9uKTtcclxuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdGhpcy5oYW5kbGVJbnRlcmFjdGlvbik7XHJcblxyXG4gICAgaWYgKEdsb2JhbEtleWJvYXJkRGlyZWN0aXZlLmFjdGl2ZURpcmVjdGl2ZSA9PT0gdGhpcykge1xyXG4gICAgICBHbG9iYWxLZXlib2FyZERpcmVjdGl2ZS5hY3RpdmVEaXJlY3RpdmUgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBoYW5kbGVNb3VzZUVudGVyID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgdGhpcy5pc0hvdmVyZWQgPSB0cnVlO1xyXG4gICAgR2xvYmFsS2V5Ym9hcmREaXJlY3RpdmUuYWN0aXZlRGlyZWN0aXZlID0gdGhpcztcclxuICB9O1xyXG5cclxuICBwcml2YXRlIGhhbmRsZU1vdXNlTGVhdmUgPSAoKTogdm9pZCA9PiB7XHJcbiAgICB0aGlzLmlzSG92ZXJlZCA9IGZhbHNlO1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgaGFuZGxlSW50ZXJhY3Rpb24gPSAoKTogdm9pZCA9PiB7XHJcbiAgICB0aGlzLmxhc3RJbnRlcmFjdGlvblRpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgR2xvYmFsS2V5Ym9hcmREaXJlY3RpdmUuYWN0aXZlRGlyZWN0aXZlID0gdGhpcztcclxuICB9O1xyXG5cclxuICBwcml2YXRlIGlzQWN0aXZlV2hpdGVib2FyZCgpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IHJlY2VudGx5SW50ZXJhY3RlZCA9IERhdGUubm93KCkgLSB0aGlzLmxhc3RJbnRlcmFjdGlvblRpbWUgPCB0aGlzLklOVEVSQUNUSU9OX1RJTUVPVVQ7XHJcbiAgICByZXR1cm4gdGhpcy5pc0hvdmVyZWQgfHwgcmVjZW50bHlJbnRlcmFjdGVkIHx8IEdsb2JhbEtleWJvYXJkRGlyZWN0aXZlLmFjdGl2ZURpcmVjdGl2ZSA9PT0gdGhpcztcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzprZXlkb3duJywgWyckZXZlbnQnXSlcclxuICBvbkdsb2JhbEtleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5jb25maWdTZXJ2aWNlLmdldENvbmZpZygpLmtleWJvYXJkU2hvcnRjdXRzRW5hYmxlZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmlzQWN0aXZlV2hpdGVib2FyZCgpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN2Z1NlcnZpY2Uub25LZXlEb3duKGV2ZW50KTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzprZXl1cCcsIFsnJGV2ZW50J10pXHJcbiAgb25HbG9iYWxLZXlVcChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmNvbmZpZ1NlcnZpY2UuZ2V0Q29uZmlnKCkua2V5Ym9hcmRTaG9ydGN1dHNFbmFibGVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuaXNBY3RpdmVXaGl0ZWJvYXJkKCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3ZnU2VydmljZS5vbktleVVwKGV2ZW50KTtcclxuICB9XHJcbn1cclxuIl19