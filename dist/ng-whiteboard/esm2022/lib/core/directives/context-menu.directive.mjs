import { Directive, ElementRef, EventEmitter, inject, Output } from '@angular/core';
import * as i0 from "@angular/core";
export class ContextMenuDirective {
    elementRef = inject(ElementRef);
    contextMenuTriggered = new EventEmitter();
    contextMenuHidden = new EventEmitter();
    contextMenuListener;
    clickListener;
    keydownListener;
    ngOnInit() {
        this.setupEventListeners();
    }
    ngOnDestroy() {
        this.removeEventListeners();
    }
    setupEventListeners() {
        const element = this.elementRef.nativeElement;
        this.contextMenuListener = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.contextMenuTriggered.emit({
                x: event.clientX,
                y: event.clientY,
                originalEvent: event,
            });
        };
        this.clickListener = (event) => {
            if (event.button === 0) {
                this.contextMenuHidden.emit();
            }
        };
        this.keydownListener = (event) => {
            if (event.key === 'Escape') {
                this.contextMenuHidden.emit();
            }
        };
        element.addEventListener('contextmenu', this.contextMenuListener);
        element.addEventListener('click', this.clickListener);
        document.addEventListener('keydown', this.keydownListener);
    }
    removeEventListeners() {
        const element = this.elementRef.nativeElement;
        if (this.contextMenuListener) {
            element.removeEventListener('contextmenu', this.contextMenuListener);
        }
        if (this.clickListener) {
            element.removeEventListener('click', this.clickListener);
        }
        if (this.keydownListener) {
            document.removeEventListener('keydown', this.keydownListener);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ContextMenuDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: ContextMenuDirective, isStandalone: true, selector: "[contextMenuCapture]", outputs: { contextMenuTriggered: "contextMenuTriggered", contextMenuHidden: "contextMenuHidden" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ContextMenuDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[contextMenuCapture]',
                    standalone: true,
                }]
        }], propDecorators: { contextMenuTriggered: [{
                type: Output
            }], contextMenuHidden: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLXdoaXRlYm9hcmQvc3JjL2xpYi9jb3JlL2RpcmVjdGl2ZXMvY29udGV4dC1tZW51LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFxQixNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBWXZHLE1BQU0sT0FBTyxvQkFBb0I7SUFDdkIsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUU5QixvQkFBb0IsR0FBRyxJQUFJLFlBQVksRUFBb0IsQ0FBQztJQUM1RCxpQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO0lBRS9DLG1CQUFtQixDQUErQjtJQUNsRCxhQUFhLENBQStCO0lBQzVDLGVBQWUsQ0FBa0M7SUFFekQsUUFBUTtRQUNOLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVPLG1CQUFtQjtRQUN6QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUU5QyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxLQUFpQixFQUFFLEVBQUU7WUFDL0MsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUV4QixJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDO2dCQUM3QixDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU87Z0JBQ2hCLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTztnQkFDaEIsYUFBYSxFQUFFLEtBQUs7YUFDckIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUN6QyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLEtBQW9CLEVBQUUsRUFBRTtZQUM5QyxJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssUUFBUSxFQUFFLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNsRSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN0RCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRU8sb0JBQW9CO1FBQzFCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBRTlDLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDN0IsT0FBTyxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUN2RSxDQUFDO1FBQ0QsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDdkIsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3pCLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7SUFDSCxDQUFDO3dHQTdEVSxvQkFBb0I7NEZBQXBCLG9CQUFvQjs7NEZBQXBCLG9CQUFvQjtrQkFKaEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxVQUFVLEVBQUUsSUFBSTtpQkFDakI7OEJBSVcsb0JBQW9CO3NCQUE3QixNQUFNO2dCQUNHLGlCQUFpQjtzQkFBMUIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBpbmplY3QsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29udGV4dE1lbnVFdmVudCB7XHJcbiAgeDogbnVtYmVyO1xyXG4gIHk6IG51bWJlcjtcclxuICBvcmlnaW5hbEV2ZW50OiBNb3VzZUV2ZW50O1xyXG59XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICBzZWxlY3RvcjogJ1tjb250ZXh0TWVudUNhcHR1cmVdJyxcclxuICBzdGFuZGFsb25lOiB0cnVlLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XHJcbiAgcHJpdmF0ZSBlbGVtZW50UmVmID0gaW5qZWN0KEVsZW1lbnRSZWYpO1xyXG5cclxuICBAT3V0cHV0KCkgY29udGV4dE1lbnVUcmlnZ2VyZWQgPSBuZXcgRXZlbnRFbWl0dGVyPENvbnRleHRNZW51RXZlbnQ+KCk7XHJcbiAgQE91dHB1dCgpIGNvbnRleHRNZW51SGlkZGVuID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG5cclxuICBwcml2YXRlIGNvbnRleHRNZW51TGlzdGVuZXI/OiAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHZvaWQ7XHJcbiAgcHJpdmF0ZSBjbGlja0xpc3RlbmVyPzogKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB2b2lkO1xyXG4gIHByaXZhdGUga2V5ZG93bkxpc3RlbmVyPzogKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkO1xyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuc2V0dXBFdmVudExpc3RlbmVycygpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XHJcblxyXG4gICAgdGhpcy5jb250ZXh0TWVudUxpc3RlbmVyID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgdGhpcy5jb250ZXh0TWVudVRyaWdnZXJlZC5lbWl0KHtcclxuICAgICAgICB4OiBldmVudC5jbGllbnRYLFxyXG4gICAgICAgIHk6IGV2ZW50LmNsaWVudFksXHJcbiAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmNsaWNrTGlzdGVuZXIgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gMCkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVIaWRkZW4uZW1pdCgpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMua2V5ZG93bkxpc3RlbmVyID0gKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudUhpZGRlbi5lbWl0KCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIHRoaXMuY29udGV4dE1lbnVMaXN0ZW5lcik7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbGlja0xpc3RlbmVyKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleWRvd25MaXN0ZW5lcik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCkge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xyXG5cclxuICAgIGlmICh0aGlzLmNvbnRleHRNZW51TGlzdGVuZXIpIHtcclxuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIHRoaXMuY29udGV4dE1lbnVMaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5jbGlja0xpc3RlbmVyKSB7XHJcbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsaWNrTGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMua2V5ZG93bkxpc3RlbmVyKSB7XHJcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleWRvd25MaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==