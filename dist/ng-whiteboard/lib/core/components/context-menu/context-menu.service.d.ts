import { Signal } from '@angular/core';
import { ApiService } from '../../api/api.service';
import * as i0 from "@angular/core";
export declare const CONTEXT_MENU_ICONS: Record<string, string>;
export interface ContextMenuItem {
    id: string;
    label: string;
    icon?: string;
    shortcut?: string;
    enabled: boolean;
    visible: boolean;
    action?: () => void;
    divider?: boolean;
    submenu?: ContextMenuItem[];
}
export interface ContextMenuSection {
    id: string;
    items: ContextMenuItem[];
}
export declare class ContextMenuService {
    private apiService;
    private readonly contextMenuVisibleSignal;
    private readonly contextMenuPositionSignal;
    private readonly containerBoundsSignal;
    private readonly focusedItemIndexSignal;
    private readonly focusedSubmenuIdSignal;
    constructor(apiService: ApiService);
    private readonly allMenuItemsCache;
    getContextMenuVisible(): Signal<boolean>;
    getContextMenuPosition(): Signal<{
        x: number;
        y: number;
    }>;
    getContainerBounds(): Signal<DOMRect | null>;
    getFocusedItemIndex(): Signal<number>;
    getFocusedSubmenuId(): Signal<string | null>;
    showContextMenu(x: number, y: number, containerBounds?: DOMRect): void;
    hideContextMenu(): void;
    getContextMenuSections(): Signal<ContextMenuSection[]>;
    executeAction(action: () => void): void;
    focusNextItem(): void;
    focusPreviousItem(): void;
    focusFirstItem(): void;
    focusLastItem(): void;
    openFocusedSubmenu(): void;
    closeFocusedSubmenu(): void;
    executeFocusedAction(): void;
    getIcon(iconName?: string): string;
    getAllMenuItems(): ContextMenuItem[];
    static ɵfac: i0.ɵɵFactoryDeclaration<ContextMenuService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ContextMenuService>;
}
