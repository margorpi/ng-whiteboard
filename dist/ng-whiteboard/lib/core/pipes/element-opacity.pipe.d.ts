import { PipeTransform } from '@angular/core';
import { WhiteboardElement, WhiteboardLayer } from '../types';
import * as i0 from "@angular/core";
export declare class ElementOpacityPipe implements PipeTransform {
    /**
     * Calculate the effective opacity combining element, style, and layer opacity.
     */
    transform(element: WhiteboardElement, layers: WhiteboardLayer[]): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<ElementOpacityPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<ElementOpacityPipe, "elementOpacity", true>;
}
