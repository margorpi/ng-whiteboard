import { ElementRef, OnDestroy, OnInit, Signal } from '@angular/core';
import { ContextMenuService, ContextMenuItem, ContextMenuSection } from './context-menu.service';
import * as i0 from "@angular/core";
export declare class ContextMenuComponent implements OnInit, OnDestroy {
    private contextMenuService;
    contextMenu: ElementRef<HTMLDivElement>;
    isVisible: Signal<boolean>;
    position: Signal<{
        x: number;
        y: number;
    }>;
    sections: Signal<ContextMenuSection[]>;
    containerBounds: Signal<DOMRect | null>;
    focusedItem: Signal<ContextMenuItem | null>;
    hoveredItem: ContextMenuItem | null;
    submenuPosition: {
        left: number;
        top: number;
    };
    private submenuTimeout;
    constructor(contextMenuService: ContextMenuService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    onItemClick(item: ContextMenuItem, event: MouseEvent): void;
    onItemHover(item: ContextMenuItem, event: MouseEvent): void;
    onItemLeave(): void;
    onSubmenuEnter(): void;
    onSubmenuLeave(): void;
    private calculateSubmenuPosition;
    onKeyDown(event: KeyboardEvent): void;
    onDocumentClick(event: MouseEvent): void;
    private adjustPosition;
    isFocused(item: ContextMenuItem): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContextMenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ContextMenuComponent, "wb-context-menu", never, {}, {}, never, never, true, never>;
}
