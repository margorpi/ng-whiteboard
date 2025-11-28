import { Injectable, signal } from '@angular/core';
import { WhiteboardEvent } from '../types';
import { EventBusService } from '../event-bus/event-bus.service';
import { ConfigService } from '../config/config.service';
import { KeyboardShortcutService } from '../input/keyboard-shortcut.service';
import { ToolsService } from '../tools/tools.service';
import { DragDropService } from '../input/drag-drop.service';
import { WheelHandlerService } from '../viewport/wheel-handler.service';
import { ApiService } from '../api/api.service';
import { ToolType } from '../types/tools';
import { ContextMenuService } from '../components/context-menu';
import { getTargetElement } from '../utils/dom/target';
import * as i0 from "@angular/core";
import * as i1 from "../tools/tools.service";
import * as i2 from "../config/config.service";
import * as i3 from "../event-bus/event-bus.service";
import * as i4 from "../input/keyboard-shortcut.service";
import * as i5 from "../api/api.service";
import * as i6 from "../components/context-menu";
import * as i7 from "../input/drag-drop.service";
import * as i8 from "../viewport/wheel-handler.service";
export class SvgService {
    toolsService;
    configService;
    EventBusService;
    keyboardShortcutService;
    apiService;
    contextMenuService;
    dragDropService;
    wheelHandlerService;
    pointerDownSig = signal(null);
    pointerMoveSig = signal(null);
    pointerUpSig = signal(null);
    isSpaceHeld = false;
    constructor(toolsService, configService, EventBusService, keyboardShortcutService, apiService, contextMenuService, dragDropService, wheelHandlerService) {
        this.toolsService = toolsService;
        this.configService = configService;
        this.EventBusService = EventBusService;
        this.keyboardShortcutService = keyboardShortcutService;
        this.apiService = apiService;
        this.contextMenuService = contextMenuService;
        this.dragDropService = dragDropService;
        this.wheelHandlerService = wheelHandlerService;
    }
    onPointerDown(info) {
        if (info.button === 1) {
            this.toolsService.pushTemporaryTool(ToolType.Hand, 'pan-middle');
            const hand = this.safeGetHandTool();
            hand?.handlePointerDown?.(info);
            return;
        }
        if (info.button === 2) {
            return;
        }
        if (this.toolsService.hasTemporaryOverride())
            return;
        if (!this.canDraw())
            return;
        this.EventBusService.emit(WhiteboardEvent.DrawStart, info);
        const currentTool = this.toolsService.getActiveToolInstance();
        currentTool?.handlePointerDown?.(info);
        if (info.isDoubleClick) {
            this.EventBusService.emit(WhiteboardEvent.ElementDoubleClicked, {
                target: info.target,
                clientX: info.clientX,
                clientY: info.clientY,
            });
        }
        this.pointerDownSig.set(info);
    }
    onPointerMove(info) {
        if (this.toolsService.hasTemporaryOverride()) {
            this.safeGetHandTool()?.handlePointerMove?.(info);
            return;
        }
        if (!this.canDraw())
            return;
        this.EventBusService.emit(WhiteboardEvent.Drawing, info);
        const currentTool = this.toolsService.getActiveToolInstance();
        currentTool?.handlePointerMove?.(info);
        this.pointerMoveSig.set(info);
    }
    onPointerUp(info) {
        if (info.button === 1 && this.toolsService.hasTemporaryOverride()) {
            this.safeGetHandTool()?.handlePointerUp?.(info);
            this.toolsService.popTemporaryTool('pan-middle');
            return;
        }
        if (!this.canDraw())
            return;
        this.EventBusService.emit(WhiteboardEvent.DrawEnd);
        const currentTool = this.toolsService.getActiveToolInstance();
        currentTool?.handlePointerUp?.(info);
        this.pointerUpSig.set(info);
    }
    onKeyDown(event) {
        const target = event.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
            return;
        }
        if (event.code === 'Space' && !this.isSpaceHeld) {
            this.isSpaceHeld = true;
            this.toolsService.pushTemporaryTool(ToolType.Hand, 'pan-space');
            event.preventDefault();
            return;
        }
        const currentTool = this.toolsService.getActiveToolInstance();
        currentTool?.handleKeyDown?.(event);
        if (!this.canUseKeyboardShortcuts())
            return;
        this.keyboardShortcutService.handleKeyDown(event);
    }
    onKeyUp(event) {
        if (event.code === 'Space' && this.isSpaceHeld) {
            this.isSpaceHeld = false;
            this.toolsService.popTemporaryTool('pan-space');
            event.preventDefault();
            return;
        }
        const currentTool = this.toolsService.getActiveToolInstance();
        currentTool?.handleKeyUp?.(event);
        if (!this.canUseKeyboardShortcuts())
            return;
        this.keyboardShortcutService.handleKeyUp(event);
    }
    /**
     * Handles wheel events for zooming and scrolling.
     */
    onWheel(event) {
        if (!this.canDraw())
            return;
        this.wheelHandlerService.handleWheel(event);
    }
    onDragOver(event) {
        if (!this.canDraw())
            return;
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'copy';
        }
    }
    onDrop(event) {
        if (!this.canDraw())
            return;
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.dragDropService.handleFiles(files);
            return;
        }
        const html = event.dataTransfer?.getData('text/html');
        if (html) {
            this.dragDropService.handleText(html, event, true);
            return;
        }
        const text = event.dataTransfer?.getData('text/plain');
        if (text) {
            this.dragDropService.handleText(text, event, false);
            return;
        }
        const json = event.dataTransfer?.getData('application/json');
        if (json) {
            try {
                const elements = JSON.parse(json);
                if (Array.isArray(elements)) {
                    this.dragDropService.handleElements(elements, event);
                }
            }
            catch (e) {
                console.warn('Failed to parse dropped JSON:', e);
            }
        }
    }
    // CONTEXT MENU HANDLING
    onContextMenu(info, containerBounds) {
        if (!this.canDraw())
            return;
        // First, try to detect if we right-clicked on an element
        const targetElement = this.getTargetElementFromPointer(info);
        // Check if we have any selected elements
        const currentSelection = this.apiService.selectedElements();
        const hasSelection = currentSelection.length > 0;
        if (targetElement) {
            const isAlreadySelected = currentSelection.some((el) => el.id === targetElement.id);
            if (!isAlreadySelected) {
                this.apiService.selectElements(targetElement);
            }
        }
        else if (!hasSelection) {
            this.apiService.clearSelection();
        }
        this.contextMenuService.showContextMenu(info.clientX, info.clientY, containerBounds);
    }
    canDraw() {
        return this.configService.getConfig().drawingEnabled;
    }
    canUseKeyboardShortcuts() {
        return this.configService.getConfig().keyboardShortcutsEnabled;
    }
    safeGetHandTool() {
        try {
            return this.toolsService.getToolInstance(ToolType.Hand);
        }
        catch {
            return null;
        }
    }
    /**
     * Get the whiteboard element that was clicked on, if any
     */
    getTargetElementFromPointer(info) {
        const allElements = this.apiService.getElements();
        return getTargetElement(info, allElements);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SvgService, deps: [{ token: i1.ToolsService }, { token: i2.ConfigService }, { token: i3.EventBusService }, { token: i4.KeyboardShortcutService }, { token: i5.ApiService }, { token: i6.ContextMenuService }, { token: i7.DragDropService }, { token: i8.WheelHandlerService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SvgService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SvgService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.ToolsService }, { type: i2.ConfigService }, { type: i3.EventBusService }, { type: i4.KeyboardShortcutService }, { type: i5.ApiService }, { type: i6.ContextMenuService }, { type: i7.DragDropService }, { type: i8.WheelHandlerService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ZnLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy13aGl0ZWJvYXJkL3NyYy9saWIvY29yZS9zdmcvc3ZnLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQWtCLE1BQU0sZUFBZSxDQUFDO0FBQ25FLE9BQU8sRUFBRSxlQUFlLEVBQWUsTUFBTSxVQUFVLENBQUM7QUFDeEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUM3RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzdELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsUUFBUSxFQUFRLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUM7Ozs7Ozs7Ozs7QUFHdkQsTUFBTSxPQUFPLFVBQVU7SUFRWDtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBZE8sY0FBYyxHQUF1QyxNQUFNLENBQXFCLElBQUksQ0FBQyxDQUFDO0lBQ3RGLGNBQWMsR0FBdUMsTUFBTSxDQUFxQixJQUFJLENBQUMsQ0FBQztJQUN0RixZQUFZLEdBQXVDLE1BQU0sQ0FBcUIsSUFBSSxDQUFDLENBQUM7SUFFN0YsV0FB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dkQsQ0FBQztJQUNPLHVCQUF1QjtRQUM3QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsd0JBQXdCLENBQUM7SUFDakUsQ0FBQztJQUVPLGVBQWU7UUFDckIsSUFBSSxDQUFDO1lBQ0gsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUQsQ0FBQztRQUFDLE1BQU0sQ0FBQztZQUNQLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7SUFFRDs7T0FFRztJQUNLLDJCQUEyQixDQUFDLElBQWlCO1FBQ25ELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbEQsT0FBTyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDN0MsQ0FBQzt3R0EvTVUsVUFBVTs0R0FBVixVQUFVLGNBREcsTUFBTTs7NEZBQ25CLFVBQVU7a0JBRHRCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgc2lnbmFsLCBXcml0YWJsZVNpZ25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBXaGl0ZWJvYXJkRXZlbnQsIFBvaW50ZXJJbmZvIH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5pbXBvcnQgeyBFdmVudEJ1c1NlcnZpY2UgfSBmcm9tICcuLi9ldmVudC1idXMvZXZlbnQtYnVzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb25maWdTZXJ2aWNlIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgS2V5Ym9hcmRTaG9ydGN1dFNlcnZpY2UgfSBmcm9tICcuLi9pbnB1dC9rZXlib2FyZC1zaG9ydGN1dC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVG9vbHNTZXJ2aWNlIH0gZnJvbSAnLi4vdG9vbHMvdG9vbHMuc2VydmljZSc7XHJcbmltcG9ydCB7IERyYWdEcm9wU2VydmljZSB9IGZyb20gJy4uL2lucHV0L2RyYWctZHJvcC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgV2hlZWxIYW5kbGVyU2VydmljZSB9IGZyb20gJy4uL3ZpZXdwb3J0L3doZWVsLWhhbmRsZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEFwaVNlcnZpY2UgfSBmcm9tICcuLi9hcGkvYXBpLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBUb29sVHlwZSwgVG9vbCB9IGZyb20gJy4uL3R5cGVzL3Rvb2xzJztcclxuaW1wb3J0IHsgQ29udGV4dE1lbnVTZXJ2aWNlIH0gZnJvbSAnLi4vY29tcG9uZW50cy9jb250ZXh0LW1lbnUnO1xyXG5pbXBvcnQgeyBnZXRUYXJnZXRFbGVtZW50IH0gZnJvbSAnLi4vdXRpbHMvZG9tL3RhcmdldCc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU3ZnU2VydmljZSB7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBwb2ludGVyRG93blNpZzogV3JpdGFibGVTaWduYWw8UG9pbnRlckluZm8gfCBudWxsPiA9IHNpZ25hbDxQb2ludGVySW5mbyB8IG51bGw+KG51bGwpO1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgcG9pbnRlck1vdmVTaWc6IFdyaXRhYmxlU2lnbmFsPFBvaW50ZXJJbmZvIHwgbnVsbD4gPSBzaWduYWw8UG9pbnRlckluZm8gfCBudWxsPihudWxsKTtcclxuICBwcml2YXRlIHJlYWRvbmx5IHBvaW50ZXJVcFNpZzogV3JpdGFibGVTaWduYWw8UG9pbnRlckluZm8gfCBudWxsPiA9IHNpZ25hbDxQb2ludGVySW5mbyB8IG51bGw+KG51bGwpO1xyXG5cclxuICBwcml2YXRlIGlzU3BhY2VIZWxkID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSB0b29sc1NlcnZpY2U6IFRvb2xzU2VydmljZSxcclxuICAgIHByaXZhdGUgY29uZmlnU2VydmljZTogQ29uZmlnU2VydmljZSxcclxuICAgIHByaXZhdGUgRXZlbnRCdXNTZXJ2aWNlOiBFdmVudEJ1c1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIGtleWJvYXJkU2hvcnRjdXRTZXJ2aWNlOiBLZXlib2FyZFNob3J0Y3V0U2VydmljZSxcclxuICAgIHByaXZhdGUgYXBpU2VydmljZTogQXBpU2VydmljZSxcclxuICAgIHByaXZhdGUgY29udGV4dE1lbnVTZXJ2aWNlOiBDb250ZXh0TWVudVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGRyYWdEcm9wU2VydmljZTogRHJhZ0Ryb3BTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSB3aGVlbEhhbmRsZXJTZXJ2aWNlOiBXaGVlbEhhbmRsZXJTZXJ2aWNlXHJcbiAgKSB7fVxyXG5cclxuICBvblBvaW50ZXJEb3duKGluZm86IFBvaW50ZXJJbmZvKSB7XHJcbiAgICBpZiAoaW5mby5idXR0b24gPT09IDEpIHtcclxuICAgICAgdGhpcy50b29sc1NlcnZpY2UucHVzaFRlbXBvcmFyeVRvb2woVG9vbFR5cGUuSGFuZCwgJ3Bhbi1taWRkbGUnKTtcclxuICAgICAgY29uc3QgaGFuZCA9IHRoaXMuc2FmZUdldEhhbmRUb29sKCk7XHJcbiAgICAgIGhhbmQ/LmhhbmRsZVBvaW50ZXJEb3duPy4oaW5mbyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmIChpbmZvLmJ1dHRvbiA9PT0gMikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudG9vbHNTZXJ2aWNlLmhhc1RlbXBvcmFyeU92ZXJyaWRlKCkpIHJldHVybjtcclxuXHJcbiAgICBpZiAoIXRoaXMuY2FuRHJhdygpKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5FdmVudEJ1c1NlcnZpY2UuZW1pdChXaGl0ZWJvYXJkRXZlbnQuRHJhd1N0YXJ0LCBpbmZvKTtcclxuXHJcbiAgICBjb25zdCBjdXJyZW50VG9vbCA9IHRoaXMudG9vbHNTZXJ2aWNlLmdldEFjdGl2ZVRvb2xJbnN0YW5jZSgpO1xyXG4gICAgY3VycmVudFRvb2w/LmhhbmRsZVBvaW50ZXJEb3duPy4oaW5mbyk7XHJcblxyXG4gICAgaWYgKGluZm8uaXNEb3VibGVDbGljaykge1xyXG4gICAgICB0aGlzLkV2ZW50QnVzU2VydmljZS5lbWl0KFdoaXRlYm9hcmRFdmVudC5FbGVtZW50RG91YmxlQ2xpY2tlZCwge1xyXG4gICAgICAgIHRhcmdldDogaW5mby50YXJnZXQsXHJcbiAgICAgICAgY2xpZW50WDogaW5mby5jbGllbnRYLFxyXG4gICAgICAgIGNsaWVudFk6IGluZm8uY2xpZW50WSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wb2ludGVyRG93blNpZy5zZXQoaW5mbyk7XHJcbiAgfVxyXG5cclxuICBvblBvaW50ZXJNb3ZlKGluZm86IFBvaW50ZXJJbmZvKSB7XHJcbiAgICBpZiAodGhpcy50b29sc1NlcnZpY2UuaGFzVGVtcG9yYXJ5T3ZlcnJpZGUoKSkge1xyXG4gICAgICB0aGlzLnNhZmVHZXRIYW5kVG9vbCgpPy5oYW5kbGVQb2ludGVyTW92ZT8uKGluZm8pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmNhbkRyYXcoKSkgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMuRXZlbnRCdXNTZXJ2aWNlLmVtaXQoV2hpdGVib2FyZEV2ZW50LkRyYXdpbmcsIGluZm8pO1xyXG4gICAgY29uc3QgY3VycmVudFRvb2wgPSB0aGlzLnRvb2xzU2VydmljZS5nZXRBY3RpdmVUb29sSW5zdGFuY2UoKTtcclxuICAgIGN1cnJlbnRUb29sPy5oYW5kbGVQb2ludGVyTW92ZT8uKGluZm8pO1xyXG4gICAgdGhpcy5wb2ludGVyTW92ZVNpZy5zZXQoaW5mbyk7XHJcbiAgfVxyXG5cclxuICBvblBvaW50ZXJVcChpbmZvOiBQb2ludGVySW5mbykge1xyXG4gICAgaWYgKGluZm8uYnV0dG9uID09PSAxICYmIHRoaXMudG9vbHNTZXJ2aWNlLmhhc1RlbXBvcmFyeU92ZXJyaWRlKCkpIHtcclxuICAgICAgdGhpcy5zYWZlR2V0SGFuZFRvb2woKT8uaGFuZGxlUG9pbnRlclVwPy4oaW5mbyk7XHJcbiAgICAgIHRoaXMudG9vbHNTZXJ2aWNlLnBvcFRlbXBvcmFyeVRvb2woJ3Bhbi1taWRkbGUnKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5jYW5EcmF3KCkpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLkV2ZW50QnVzU2VydmljZS5lbWl0KFdoaXRlYm9hcmRFdmVudC5EcmF3RW5kKTtcclxuICAgIGNvbnN0IGN1cnJlbnRUb29sID0gdGhpcy50b29sc1NlcnZpY2UuZ2V0QWN0aXZlVG9vbEluc3RhbmNlKCk7XHJcbiAgICBjdXJyZW50VG9vbD8uaGFuZGxlUG9pbnRlclVwPy4oaW5mbyk7XHJcbiAgICB0aGlzLnBvaW50ZXJVcFNpZy5zZXQoaW5mbyk7XHJcbiAgfVxyXG5cclxuICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcclxuICAgIGlmKHRhcmdldCAmJiAodGFyZ2V0LnRhZ05hbWUgPT09ICdJTlBVVCcgfHwgdGFyZ2V0LnRhZ05hbWUgPT09ICdURVhUQVJFQScgfHwgdGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlKSl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKGV2ZW50LmNvZGUgPT09ICdTcGFjZScgJiYgIXRoaXMuaXNTcGFjZUhlbGQpIHtcclxuICAgICAgdGhpcy5pc1NwYWNlSGVsZCA9IHRydWU7XHJcbiAgICAgIHRoaXMudG9vbHNTZXJ2aWNlLnB1c2hUZW1wb3JhcnlUb29sKFRvb2xUeXBlLkhhbmQsICdwYW4tc3BhY2UnKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGN1cnJlbnRUb29sID0gdGhpcy50b29sc1NlcnZpY2UuZ2V0QWN0aXZlVG9vbEluc3RhbmNlKCk7XHJcbiAgICBjdXJyZW50VG9vbD8uaGFuZGxlS2V5RG93bj8uKGV2ZW50KTtcclxuXHJcbiAgICBpZiAoIXRoaXMuY2FuVXNlS2V5Ym9hcmRTaG9ydGN1dHMoKSkgcmV0dXJuO1xyXG4gICAgdGhpcy5rZXlib2FyZFNob3J0Y3V0U2VydmljZS5oYW5kbGVLZXlEb3duKGV2ZW50KTtcclxuICB9XHJcblxyXG4gIG9uS2V5VXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgIGlmIChldmVudC5jb2RlID09PSAnU3BhY2UnICYmIHRoaXMuaXNTcGFjZUhlbGQpIHtcclxuICAgICAgdGhpcy5pc1NwYWNlSGVsZCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLnRvb2xzU2VydmljZS5wb3BUZW1wb3JhcnlUb29sKCdwYW4tc3BhY2UnKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGN1cnJlbnRUb29sID0gdGhpcy50b29sc1NlcnZpY2UuZ2V0QWN0aXZlVG9vbEluc3RhbmNlKCk7XHJcbiAgICBjdXJyZW50VG9vbD8uaGFuZGxlS2V5VXA/LihldmVudCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmNhblVzZUtleWJvYXJkU2hvcnRjdXRzKCkpIHJldHVybjtcclxuICAgIHRoaXMua2V5Ym9hcmRTaG9ydGN1dFNlcnZpY2UuaGFuZGxlS2V5VXAoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlcyB3aGVlbCBldmVudHMgZm9yIHpvb21pbmcgYW5kIHNjcm9sbGluZy5cclxuICAgKi9cclxuICBvbldoZWVsKGV2ZW50OiBXaGVlbEV2ZW50KSB7XHJcbiAgICBpZiAoIXRoaXMuY2FuRHJhdygpKSByZXR1cm47XHJcbiAgICB0aGlzLndoZWVsSGFuZGxlclNlcnZpY2UuaGFuZGxlV2hlZWwoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgb25EcmFnT3ZlcihldmVudDogRHJhZ0V2ZW50KSB7XHJcbiAgICBpZiAoIXRoaXMuY2FuRHJhdygpKSByZXR1cm47XHJcbiAgICBpZiAoZXZlbnQuZGF0YVRyYW5zZmVyKSB7XHJcbiAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ2NvcHknO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25Ecm9wKGV2ZW50OiBEcmFnRXZlbnQpIHtcclxuICAgIGlmICghdGhpcy5jYW5EcmF3KCkpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBmaWxlcyA9IGV2ZW50LmRhdGFUcmFuc2Zlcj8uZmlsZXM7XHJcbiAgICBpZiAoZmlsZXMgJiYgZmlsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLmRyYWdEcm9wU2VydmljZS5oYW5kbGVGaWxlcyhmaWxlcyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBodG1sID0gZXZlbnQuZGF0YVRyYW5zZmVyPy5nZXREYXRhKCd0ZXh0L2h0bWwnKTtcclxuICAgIGlmIChodG1sKSB7XHJcbiAgICAgIHRoaXMuZHJhZ0Ryb3BTZXJ2aWNlLmhhbmRsZVRleHQoaHRtbCwgZXZlbnQsIHRydWUpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGV4dCA9IGV2ZW50LmRhdGFUcmFuc2Zlcj8uZ2V0RGF0YSgndGV4dC9wbGFpbicpO1xyXG4gICAgaWYgKHRleHQpIHtcclxuICAgICAgdGhpcy5kcmFnRHJvcFNlcnZpY2UuaGFuZGxlVGV4dCh0ZXh0LCBldmVudCwgZmFsc2UpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QganNvbiA9IGV2ZW50LmRhdGFUcmFuc2Zlcj8uZ2V0RGF0YSgnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgaWYgKGpzb24pIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBlbGVtZW50cyA9IEpTT04ucGFyc2UoanNvbik7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZWxlbWVudHMpKSB7XHJcbiAgICAgICAgICB0aGlzLmRyYWdEcm9wU2VydmljZS5oYW5kbGVFbGVtZW50cyhlbGVtZW50cywgZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUud2FybignRmFpbGVkIHRvIHBhcnNlIGRyb3BwZWQgSlNPTjonLCBlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gQ09OVEVYVCBNRU5VIEhBTkRMSU5HXHJcbiAgb25Db250ZXh0TWVudShpbmZvOiBQb2ludGVySW5mbywgY29udGFpbmVyQm91bmRzPzogRE9NUmVjdCkge1xyXG4gICAgaWYgKCF0aGlzLmNhbkRyYXcoKSkgcmV0dXJuO1xyXG5cclxuICAgIC8vIEZpcnN0LCB0cnkgdG8gZGV0ZWN0IGlmIHdlIHJpZ2h0LWNsaWNrZWQgb24gYW4gZWxlbWVudFxyXG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IHRoaXMuZ2V0VGFyZ2V0RWxlbWVudEZyb21Qb2ludGVyKGluZm8pO1xyXG5cclxuICAgIC8vIENoZWNrIGlmIHdlIGhhdmUgYW55IHNlbGVjdGVkIGVsZW1lbnRzXHJcbiAgICBjb25zdCBjdXJyZW50U2VsZWN0aW9uID0gdGhpcy5hcGlTZXJ2aWNlLnNlbGVjdGVkRWxlbWVudHMoKTtcclxuICAgIGNvbnN0IGhhc1NlbGVjdGlvbiA9IGN1cnJlbnRTZWxlY3Rpb24ubGVuZ3RoID4gMDtcclxuXHJcbiAgICBpZiAodGFyZ2V0RWxlbWVudCkge1xyXG4gICAgICBjb25zdCBpc0FscmVhZHlTZWxlY3RlZCA9IGN1cnJlbnRTZWxlY3Rpb24uc29tZSgoZWwpID0+IGVsLmlkID09PSB0YXJnZXRFbGVtZW50LmlkKTtcclxuXHJcbiAgICAgIGlmICghaXNBbHJlYWR5U2VsZWN0ZWQpIHtcclxuICAgICAgICB0aGlzLmFwaVNlcnZpY2Uuc2VsZWN0RWxlbWVudHModGFyZ2V0RWxlbWVudCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoIWhhc1NlbGVjdGlvbikge1xyXG4gICAgICB0aGlzLmFwaVNlcnZpY2UuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbnRleHRNZW51U2VydmljZS5zaG93Q29udGV4dE1lbnUoaW5mby5jbGllbnRYLCBpbmZvLmNsaWVudFksIGNvbnRhaW5lckJvdW5kcyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNhbkRyYXcoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5jb25maWdTZXJ2aWNlLmdldENvbmZpZygpLmRyYXdpbmdFbmFibGVkO1xyXG4gIH1cclxuICBwcml2YXRlIGNhblVzZUtleWJvYXJkU2hvcnRjdXRzKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnU2VydmljZS5nZXRDb25maWcoKS5rZXlib2FyZFNob3J0Y3V0c0VuYWJsZWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNhZmVHZXRIYW5kVG9vbCgpOiBUb29sIHwgbnVsbCB7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gdGhpcy50b29sc1NlcnZpY2UuZ2V0VG9vbEluc3RhbmNlKFRvb2xUeXBlLkhhbmQpO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSB3aGl0ZWJvYXJkIGVsZW1lbnQgdGhhdCB3YXMgY2xpY2tlZCBvbiwgaWYgYW55XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRUYXJnZXRFbGVtZW50RnJvbVBvaW50ZXIoaW5mbzogUG9pbnRlckluZm8pIHtcclxuICAgIGNvbnN0IGFsbEVsZW1lbnRzID0gdGhpcy5hcGlTZXJ2aWNlLmdldEVsZW1lbnRzKCk7XHJcbiAgICByZXR1cm4gZ2V0VGFyZ2V0RWxlbWVudChpbmZvLCBhbGxFbGVtZW50cyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==