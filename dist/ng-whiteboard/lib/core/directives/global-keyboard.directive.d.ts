import { OnDestroy, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class GlobalKeyboardDirective implements OnInit, OnDestroy {
    private configService;
    private svgService;
    private elementRef;
    private isHovered;
    private lastInteractionTime;
    private readonly INTERACTION_TIMEOUT;
    private static activeDirective;
    ngOnInit(): void;
    ngOnDestroy(): void;
    private handleMouseEnter;
    private handleMouseLeave;
    private handleInteraction;
    private isActiveWhiteboard;
    onGlobalKeyDown(event: KeyboardEvent): void;
    onGlobalKeyUp(event: KeyboardEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GlobalKeyboardDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<GlobalKeyboardDirective, "[globalKeyboard]", never, {}, {}, never, never, true, never>;
}
