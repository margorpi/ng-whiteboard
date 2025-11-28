import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export interface ContextMenuEvent {
    x: number;
    y: number;
    originalEvent: MouseEvent;
}
export declare class ContextMenuDirective implements OnInit, OnDestroy {
    private elementRef;
    contextMenuTriggered: EventEmitter<ContextMenuEvent>;
    contextMenuHidden: EventEmitter<void>;
    private contextMenuListener?;
    private clickListener?;
    private keydownListener?;
    ngOnInit(): void;
    ngOnDestroy(): void;
    private setupEventListeners;
    private removeEventListeners;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContextMenuDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ContextMenuDirective, "[contextMenuCapture]", never, {}, { "contextMenuTriggered": "contextMenuTriggered"; "contextMenuHidden": "contextMenuHidden"; }, never, never, true, never>;
}
