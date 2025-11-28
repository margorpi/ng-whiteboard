import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class GripCursorPipe implements PipeTransform {
    private readonly cornerGrips;
    private readonly sideGrips;
    transform(grip: string, rotation: number): string;
    private isHorizontalOrientation;
    private getCornerCursor;
    private getSideCursor;
    static ɵfac: i0.ɵɵFactoryDeclaration<GripCursorPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<GripCursorPipe, "gripCursor", true>;
}
