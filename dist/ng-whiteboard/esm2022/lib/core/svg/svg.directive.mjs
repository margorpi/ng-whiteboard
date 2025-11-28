import { Directive, HostListener, ElementRef, inject } from '@angular/core';
import { SvgService } from './svg.service';
import * as i0 from "@angular/core";
import * as i1 from "./svg.service";
export class SvgDirective {
    svgService;
    elementRef = inject(ElementRef);
    lastX;
    lastY;
    lastClickTime = 0;
    lastClickX = 0;
    lastClickY = 0;
    DOUBLE_CLICK_THRESHOLD = 300;
    DOUBLE_CLICK_DISTANCE = 10;
    constructor(svgService) {
        this.svgService = svgService;
    }
    onPointerDown(event) {
        if (event.button !== 2) {
            event.preventDefault();
        }
        if (event.currentTarget) {
            event.currentTarget.setPointerCapture(event.pointerId);
        }
        if (event.button === 2)
            return;
        const currentTime = Date.now();
        const currentX = event.clientX;
        const currentY = event.clientY;
        if (this.lastClickTime &&
            currentTime - this.lastClickTime < this.DOUBLE_CLICK_THRESHOLD &&
            Math.abs(currentX - this.lastClickX) < this.DOUBLE_CLICK_DISTANCE &&
            Math.abs(currentY - this.lastClickY) < this.DOUBLE_CLICK_DISTANCE) {
            const pointerInfo = this.createPointerInfo(event);
            pointerInfo.isDoubleClick = true;
            this.svgService.onPointerDown(pointerInfo);
            this.lastClickTime = 0;
            return;
        }
        this.lastClickTime = currentTime;
        this.lastClickX = currentX;
        this.lastClickY = currentY;
        const pointerInfo = this.createPointerInfo(event);
        this.svgService.onPointerDown(pointerInfo);
    }
    onPointerMove(event) {
        if (event.clientX === this.lastX && event.clientY === this.lastY)
            return;
        this.lastX = event.clientX;
        this.lastY = event.clientY;
        if (event.buttons & 2)
            return;
        const pointerInfo = this.createPointerInfo(event);
        this.svgService.onPointerMove(pointerInfo);
    }
    onPointerUp(event) {
        this.lastX = event.clientX;
        this.lastY = event.clientY;
        if (event.currentTarget && event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        if (event.button === 2)
            return;
        const pointerInfo = this.createPointerInfo(event);
        this.svgService.onPointerUp(pointerInfo);
    }
    onWheel(event) {
        event.preventDefault();
        this.svgService.onWheel(event);
    }
    onKeyDown(event) {
        event.preventDefault();
        this.svgService.onKeyDown(event);
    }
    onKeyUp(event) {
        this.svgService.onKeyUp(event);
    }
    onDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        this.svgService.onDragOver(event);
    }
    onDragEnter(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    onDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        this.svgService.onDrop(event);
    }
    onContextMenu(event) {
        event.preventDefault();
        const pointerInfo = this.createPointerInfo(event);
        const containerBounds = event.currentTarget.getBoundingClientRect();
        const relativePosition = this.getPointerPosition(event);
        const adjustedPointerInfo = {
            ...pointerInfo,
            clientX: containerBounds.left + relativePosition.x,
            clientY: containerBounds.top + relativePosition.y,
        };
        this.svgService.onContextMenu(adjustedPointerInfo, containerBounds);
    }
    createPointerInfo(event) {
        const { x, y } = this.getPointerPosition(event);
        return {
            x,
            y,
            clientX: event.clientX,
            clientY: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            movementX: event.movementX,
            movementY: event.movementY,
            pressure: event.pressure,
            tangentialPressure: event.tangentialPressure,
            tiltX: event.tiltX,
            tiltY: event.tiltY,
            twist: event.twist,
            width: event.width,
            height: event.height,
            pointerType: event.pointerType,
            pointerId: event.pointerId,
            isPrimary: event.isPrimary,
            button: event.button,
            buttons: event.buttons,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            metaKey: event.metaKey,
            eventType: event.type,
            timeStamp: event.timeStamp,
            target: event.target,
        };
    }
    getPointerPosition(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return { x, y };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SvgDirective, deps: [{ token: i1.SvgService }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: SvgDirective, isStandalone: true, selector: "[svg]", host: { listeners: { "pointerdown": "onPointerDown($event)", "pointermove": "onPointerMove($event)", "pointerup": "onPointerUp($event)", "wheel": "onWheel($event)", "keydown": "onKeyDown($event)", "keyup": "onKeyUp($event)", "dragover": "onDragOver($event)", "dragenter": "onDragEnter($event)", "drop": "onDrop($event)", "contextmenu": "onContextMenu($event)" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SvgDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[svg]',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.SvgService }], propDecorators: { onPointerDown: [{
                type: HostListener,
                args: ['pointerdown', ['$event']]
            }], onPointerMove: [{
                type: HostListener,
                args: ['pointermove', ['$event']]
            }], onPointerUp: [{
                type: HostListener,
                args: ['pointerup', ['$event']]
            }], onWheel: [{
                type: HostListener,
                args: ['wheel', ['$event']]
            }], onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }], onKeyUp: [{
                type: HostListener,
                args: ['keyup', ['$event']]
            }], onDragOver: [{
                type: HostListener,
                args: ['dragover', ['$event']]
            }], onDragEnter: [{
                type: HostListener,
                args: ['dragenter', ['$event']]
            }], onDrop: [{
                type: HostListener,
                args: ['drop', ['$event']]
            }], onContextMenu: [{
                type: HostListener,
                args: ['contextmenu', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ZnLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLXdoaXRlYm9hcmQvc3JjL2xpYi9jb3JlL3N2Zy9zdmcuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBTzNDLE1BQU0sT0FBTyxZQUFZO0lBV0g7SUFWWixVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3hDLEtBQUssQ0FBVTtJQUNmLEtBQUssQ0FBVTtJQUVQLGFBQWEsR0FBRyxDQUFDLENBQUM7SUFDbEIsVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNmLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDTixzQkFBc0IsR0FBRyxHQUFHLENBQUM7SUFDN0IscUJBQXFCLEdBQUcsRUFBRSxDQUFDO0lBRTVDLFlBQW9CLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7SUFBRyxDQUFDO0lBRzlDLGFBQWEsQ0FBQyxLQUFtQjtRQUMvQixJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdkIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3pCLENBQUM7UUFFRCxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsYUFBeUIsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUVELElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQUUsT0FBTztRQUUvQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDL0IsTUFBTSxRQUFRLEdBQUcsS0FBSyxD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QVk7dUJBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBIb3N0TGlzdGVuZXIsIEVsZW1lbnRSZWYsIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdmdTZXJ2aWNlIH0gZnJvbSAnLi9zdmcuc2VydmljZSc7XHJcbmltcG9ydCB7IFBvaW50ZXJJbmZvIH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdbc3ZnXScsXHJcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFN2Z0RpcmVjdGl2ZSB7XHJcbiAgcHJpdmF0ZSBlbGVtZW50UmVmID0gaW5qZWN0KEVsZW1lbnRSZWYpO1xyXG4gIGxhc3RYITogbnVtYmVyO1xyXG4gIGxhc3RZITogbnVtYmVyO1xyXG5cclxuICBwcml2YXRlIGxhc3RDbGlja1RpbWUgPSAwO1xyXG4gIHByaXZhdGUgbGFzdENsaWNrWCA9IDA7XHJcbiAgcHJpdmF0ZSBsYXN0Q2xpY2tZID0gMDtcclxuICBwcml2YXRlIHJlYWRvbmx5IERPVUJMRV9DTElDS19USFJFU0hPTEQgPSAzMDA7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBET1VCTEVfQ0xJQ0tfRElTVEFOQ0UgPSAxMDtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdmdTZXJ2aWNlOiBTdmdTZXJ2aWNlKSB7fVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdwb2ludGVyZG93bicsIFsnJGV2ZW50J10pXHJcbiAgb25Qb2ludGVyRG93bihldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAoZXZlbnQuYnV0dG9uICE9PSAyKSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGV2ZW50LmN1cnJlbnRUYXJnZXQpIHtcclxuICAgICAgKGV2ZW50LmN1cnJlbnRUYXJnZXQgYXMgRWxlbWVudCkuc2V0UG9pbnRlckNhcHR1cmUoZXZlbnQucG9pbnRlcklkKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZXZlbnQuYnV0dG9uID09PSAyKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgY3VycmVudFggPSBldmVudC5jbGllbnRYO1xyXG4gICAgY29uc3QgY3VycmVudFkgPSBldmVudC5jbGllbnRZO1xyXG5cclxuICAgIGlmIChcclxuICAgICAgdGhpcy5sYXN0Q2xpY2tUaW1lICYmXHJcbiAgICAgIGN1cnJlbnRUaW1lIC0gdGhpcy5sYXN0Q2xpY2tUaW1lIDwgdGhpcy5ET1VCTEVfQ0xJQ0tfVEhSRVNIT0xEICYmXHJcbiAgICAgIE1hdGguYWJzKGN1cnJlbnRYIC0gdGhpcy5sYXN0Q2xpY2tYKSA8IHRoaXMuRE9VQkxFX0NMSUNLX0RJU1RBTkNFICYmXHJcbiAgICAgIE1hdGguYWJzKGN1cnJlbnRZIC0gdGhpcy5sYXN0Q2xpY2tZKSA8IHRoaXMuRE9VQkxFX0NMSUNLX0RJU1RBTkNFXHJcbiAgICApIHtcclxuICAgICAgY29uc3QgcG9pbnRlckluZm8gPSB0aGlzLmNyZWF0ZVBvaW50ZXJJbmZvKGV2ZW50KTtcclxuICAgICAgcG9pbnRlckluZm8uaXNEb3VibGVDbGljayA9IHRydWU7XHJcbiAgICAgIHRoaXMuc3ZnU2VydmljZS5vblBvaW50ZXJEb3duKHBvaW50ZXJJbmZvKTtcclxuICAgICAgdGhpcy5sYXN0Q2xpY2tUaW1lID0gMDtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGFzdENsaWNrVGltZSA9IGN1cnJlbnRUaW1lO1xyXG4gICAgdGhpcy5sYXN0Q2xpY2tYID0gY3VycmVudFg7XHJcbiAgICB0aGlzLmxhc3RDbGlja1kgPSBjdXJyZW50WTtcclxuXHJcbiAgICBjb25zdCBwb2ludGVySW5mbyA9IHRoaXMuY3JlYXRlUG9pbnRlckluZm8oZXZlbnQpO1xyXG4gICAgdGhpcy5zdmdTZXJ2aWNlLm9uUG9pbnRlckRvd24ocG9pbnRlckluZm8pO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBbJyRldmVudCddKVxyXG4gIG9uUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKGV2ZW50LmNsaWVudFggPT09IHRoaXMubGFzdFggJiYgZXZlbnQuY2xpZW50WSA9PT0gdGhpcy5sYXN0WSkgcmV0dXJuO1xyXG4gICAgdGhpcy5sYXN0WCA9IGV2ZW50LmNsaWVudFg7XHJcbiAgICB0aGlzLmxhc3RZID0gZXZlbnQuY2xpZW50WTtcclxuXHJcbiAgICBpZiAoZXZlbnQuYnV0dG9ucyAmIDIpIHJldHVybjtcclxuICAgIGNvbnN0IHBvaW50ZXJJbmZvID0gdGhpcy5jcmVhdGVQb2ludGVySW5mbyhldmVudCk7XHJcbiAgICB0aGlzLnN2Z1NlcnZpY2Uub25Qb2ludGVyTW92ZShwb2ludGVySW5mbyk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdwb2ludGVydXAnLCBbJyRldmVudCddKVxyXG4gIG9uUG9pbnRlclVwKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcclxuICAgIHRoaXMubGFzdFggPSBldmVudC5jbGllbnRYO1xyXG4gICAgdGhpcy5sYXN0WSA9IGV2ZW50LmNsaWVudFk7XHJcblxyXG4gICAgaWYgKGV2ZW50LmN1cnJlbnRUYXJnZXQgJiYgKGV2ZW50LmN1cnJlbnRUYXJnZXQgYXMgRWxlbWVudCkuaGFzUG9pbnRlckNhcHR1cmUoZXZlbnQucG9pbnRlcklkKSkge1xyXG4gICAgICAoZXZlbnQuY3VycmVudFRhcmdldCBhcyBFbGVtZW50KS5yZWxlYXNlUG9pbnRlckNhcHR1cmUoZXZlbnQucG9pbnRlcklkKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZXZlbnQuYnV0dG9uID09PSAyKSByZXR1cm47XHJcbiAgICBjb25zdCBwb2ludGVySW5mbyA9IHRoaXMuY3JlYXRlUG9pbnRlckluZm8oZXZlbnQpO1xyXG4gICAgdGhpcy5zdmdTZXJ2aWNlLm9uUG9pbnRlclVwKHBvaW50ZXJJbmZvKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ3doZWVsJywgWyckZXZlbnQnXSlcclxuICBvbldoZWVsKGV2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdGhpcy5zdmdTZXJ2aWNlLm9uV2hlZWwoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bicsIFsnJGV2ZW50J10pXHJcbiAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdGhpcy5zdmdTZXJ2aWNlLm9uS2V5RG93bihldmVudCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdrZXl1cCcsIFsnJGV2ZW50J10pXHJcbiAgb25LZXlVcChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5zdmdTZXJ2aWNlLm9uS2V5VXAoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ292ZXInLCBbJyRldmVudCddKVxyXG4gIG9uRHJhZ092ZXIoZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgdGhpcy5zdmdTZXJ2aWNlLm9uRHJhZ092ZXIoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ2VudGVyJywgWyckZXZlbnQnXSlcclxuICBvbkRyYWdFbnRlcihldmVudDogRHJhZ0V2ZW50KTogdm9pZCB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdkcm9wJywgWyckZXZlbnQnXSlcclxuICBvbkRyb3AoZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgdGhpcy5zdmdTZXJ2aWNlLm9uRHJvcChldmVudCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdjb250ZXh0bWVudScsIFsnJGV2ZW50J10pXHJcbiAgb25Db250ZXh0TWVudShldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc3QgcG9pbnRlckluZm8gPSB0aGlzLmNyZWF0ZVBvaW50ZXJJbmZvKGV2ZW50KTtcclxuICAgIGNvbnN0IGNvbnRhaW5lckJvdW5kcyA9IChldmVudC5jdXJyZW50VGFyZ2V0IGFzIFNWR0VsZW1lbnQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgIGNvbnN0IHJlbGF0aXZlUG9zaXRpb24gPSB0aGlzLmdldFBvaW50ZXJQb3NpdGlvbihldmVudCk7XHJcbiAgICBjb25zdCBhZGp1c3RlZFBvaW50ZXJJbmZvID0ge1xyXG4gICAgICAuLi5wb2ludGVySW5mbyxcclxuICAgICAgY2xpZW50WDogY29udGFpbmVyQm91bmRzLmxlZnQgKyByZWxhdGl2ZVBvc2l0aW9uLngsXHJcbiAgICAgIGNsaWVudFk6IGNvbnRhaW5lckJvdW5kcy50b3AgKyByZWxhdGl2ZVBvc2l0aW9uLnksXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc3ZnU2VydmljZS5vbkNvbnRleHRNZW51KGFkanVzdGVkUG9pbnRlckluZm8sIGNvbnRhaW5lckJvdW5kcyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZVBvaW50ZXJJbmZvKGV2ZW50OiBQb2ludGVyRXZlbnQpOiBQb2ludGVySW5mbyB7XHJcbiAgICBjb25zdCB7IHgsIHkgfSA9IHRoaXMuZ2V0UG9pbnRlclBvc2l0aW9uKGV2ZW50KTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHgsXHJcbiAgICAgIHksXHJcblxyXG4gICAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxyXG4gICAgICBjbGllbnRZOiBldmVudC5jbGllbnRZLFxyXG4gICAgICBwYWdlWDogZXZlbnQucGFnZVgsXHJcbiAgICAgIHBhZ2VZOiBldmVudC5wYWdlWSxcclxuICAgICAgbW92ZW1lbnRYOiBldmVudC5tb3ZlbWVudFgsXHJcbiAgICAgIG1vdmVtZW50WTogZXZlbnQubW92ZW1lbnRZLFxyXG5cclxuICAgICAgcHJlc3N1cmU6IGV2ZW50LnByZXNzdXJlLFxyXG4gICAgICB0YW5nZW50aWFsUHJlc3N1cmU6IGV2ZW50LnRhbmdlbnRpYWxQcmVzc3VyZSxcclxuICAgICAgdGlsdFg6IGV2ZW50LnRpbHRYLFxyXG4gICAgICB0aWx0WTogZXZlbnQudGlsdFksXHJcbiAgICAgIHR3aXN0OiBldmVudC50d2lzdCxcclxuXHJcbiAgICAgIHdpZHRoOiBldmVudC53aWR0aCxcclxuICAgICAgaGVpZ2h0OiBldmVudC5oZWlnaHQsXHJcblxyXG4gICAgICBwb2ludGVyVHlwZTogZXZlbnQucG9pbnRlclR5cGUsXHJcbiAgICAgIHBvaW50ZXJJZDogZXZlbnQucG9pbnRlcklkLFxyXG4gICAgICBpc1ByaW1hcnk6IGV2ZW50LmlzUHJpbWFyeSxcclxuXHJcbiAgICAgIGJ1dHRvbjogZXZlbnQuYnV0dG9uIGFzIC0xIHwgMCB8IDEgfCAyIHwgMyB8IDQsXHJcbiAgICAgIGJ1dHRvbnM6IGV2ZW50LmJ1dHRvbnMsXHJcblxyXG4gICAgICBjdHJsS2V5OiBldmVudC5jdHJsS2V5LFxyXG4gICAgICBzaGlmdEtleTogZXZlbnQuc2hpZnRLZXksXHJcbiAgICAgIGFsdEtleTogZXZlbnQuYWx0S2V5LFxyXG4gICAgICBtZXRhS2V5OiBldmVudC5tZXRhS2V5LFxyXG5cclxuICAgICAgZXZlbnRUeXBlOiBldmVudC50eXBlLFxyXG5cclxuICAgICAgdGltZVN0YW1wOiBldmVudC50aW1lU3RhbXAsXHJcblxyXG4gICAgICB0YXJnZXQ6IGV2ZW50LnRhcmdldCxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFBvaW50ZXJQb3NpdGlvbihldmVudDogUG9pbnRlckV2ZW50KTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9IHtcclxuICAgIGNvbnN0IHJlY3QgPSAoZXZlbnQuY3VycmVudFRhcmdldCBhcyBTVkdFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICBjb25zdCB4ID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcclxuICAgIGNvbnN0IHkgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XHJcblxyXG4gICAgcmV0dXJuIHsgeCwgeSB9O1xyXG4gIH1cclxufVxyXG4iXX0=