import { ClipboardData, ClipboardInfo, WhiteboardElement } from '../types';
import { ElementsService } from '../elements/elements.service';
import * as i0 from "@angular/core";
/**
 * Manages clipboard operations for whiteboard elements with localStorage persistence.
 */
export declare class ClipboardService {
    private elementsService;
    private readonly CLIPBOARD_KEY;
    private readonly OFFSET_INCREMENT;
    constructor(elementsService: ElementsService);
    copy(elements: WhiteboardElement[]): void;
    cut(elements: WhiteboardElement[]): void;
    paste(): WhiteboardElement[];
    clear(): void;
    hasData(): boolean;
    getData(): ClipboardData | null;
    duplicateElements(elements: WhiteboardElement[], offsetX?: number, offsetY?: number): WhiteboardElement[];
    createDuplicates(elements: WhiteboardElement[], offsetX?: number, offsetY?: number): WhiteboardElement[];
    getClipboardInfo(): ClipboardInfo | null;
    isDataFresh(maxAgeMs?: number): boolean;
    getClipboardElementTypes(): string[];
    private duplicateElementsWithOffset;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClipboardService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClipboardService>;
}
