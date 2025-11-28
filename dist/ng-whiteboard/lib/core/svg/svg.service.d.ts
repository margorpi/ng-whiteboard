import { PointerInfo } from '../types';
import { EventBusService } from '../event-bus/event-bus.service';
import { ConfigService } from '../config/config.service';
import { KeyboardShortcutService } from '../input/keyboard-shortcut.service';
import { ToolsService } from '../tools/tools.service';
import { DragDropService } from '../input/drag-drop.service';
import { WheelHandlerService } from '../viewport/wheel-handler.service';
import { ApiService } from '../api/api.service';
import { ContextMenuService } from '../components/context-menu';
import * as i0 from "@angular/core";
export declare class SvgService {
    private toolsService;
    private configService;
    private EventBusService;
    private keyboardShortcutService;
    private apiService;
    private contextMenuService;
    private dragDropService;
    private wheelHandlerService;
    private readonly pointerDownSig;
    private readonly pointerMoveSig;
    private readonly pointerUpSig;
    private isSpaceHeld;
    constructor(toolsService: ToolsService, configService: ConfigService, EventBusService: EventBusService, keyboardShortcutService: KeyboardShortcutService, apiService: ApiService, contextMenuService: ContextMenuService, dragDropService: DragDropService, wheelHandlerService: WheelHandlerService);
    onPointerDown(info: PointerInfo): void;
    onPointerMove(info: PointerInfo): void;
    onPointerUp(info: PointerInfo): void;
    onKeyDown(event: KeyboardEvent): void;
    onKeyUp(event: KeyboardEvent): void;
    /**
     * Handles wheel events for zooming and scrolling.
     */
    onWheel(event: WheelEvent): void;
    onDragOver(event: DragEvent): void;
    onDrop(event: DragEvent): void;
    onContextMenu(info: PointerInfo, containerBounds?: DOMRect): void;
    private canDraw;
    private canUseKeyboardShortcuts;
    private safeGetHandTool;
    /**
     * Get the whiteboard element that was clicked on, if any
     */
    private getTargetElementFromPointer;
    static ɵfac: i0.ɵɵFactoryDeclaration<SvgService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SvgService>;
}
