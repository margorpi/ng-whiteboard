import { SvgService } from './svg.service';
import * as i0 from "@angular/core";
export declare class SvgDirective {
    private svgService;
    private elementRef;
    lastX: number;
    lastY: number;
    private lastClickTime;
    private lastClickX;
    private lastClickY;
    private readonly DOUBLE_CLICK_THRESHOLD;
    private readonly DOUBLE_CLICK_DISTANCE;
    constructor(svgService: SvgService);
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    onWheel(event: WheelEvent): void;
    onKeyDown(event: KeyboardEvent): void;
    onKeyUp(event: KeyboardEvent): void;
    onDragOver(event: DragEvent): void;
    onDragEnter(event: DragEvent): void;
    onDrop(event: DragEvent): void;
    onContextMenu(event: PointerEvent): void;
    private createPointerInfo;
    private getPointerPosition;
    static ɵfac: i0.ɵɵFactoryDeclaration<SvgDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<SvgDirective, "[svg]", never, {}, {}, never, never, true, never>;
}
