import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, inject, } from '@angular/core';
import { ApiService } from './core/api';
import { CanvasService, InstanceService } from './core/canvas';
import { WhiteboardCanvasComponent } from './core/components/canvas/whiteboard-canvas.component';
import { ContextMenuComponent } from './core/components/context-menu/context-menu.component';
import { ContextMenuService } from './core/components/context-menu/context-menu.service';
import { ConfigService } from './core/config/config.service';
import { ElementsService, LayerManagementService, SelectionService } from './core/elements';
import { EventBusService } from './core/event-bus/event-bus.service';
import { HistoryService } from './core/history';
import { ClipboardService, DragDropService, IOService, KeyboardShortcutService } from './core/input';
import { SvgService } from './core/svg/svg.service';
import { ToolsService } from './core/tools';
import { ToolFactory } from './core/tools/tool-factory.service';
import { ToolType } from './core/types';
import { WhiteboardEvent } from './core/types/events';
import { PanService, WheelHandlerService, ZoomService } from './core/viewport';
import * as i0 from "@angular/core";
/**
 * Main whiteboard component providing a canvas with drawing tools and configuration options.
 *
 * Handles whiteboard initialization, event management, and configuration updates.
 */
export class NgWhiteboardComponent {
    configService = inject(ConfigService);
    apiService = inject(ApiService);
    toolsService = inject(ToolsService);
    eventBusService = inject(EventBusService);
    cd = inject(ChangeDetectorRef);
    instanceService = inject(InstanceService);
    /**
     * Unique identifier for this whiteboard instance.
     * Auto-generated if not provided.
     */
    boardId = crypto.randomUUID();
    /**
     * Whiteboard configuration options.
     */
    set config(value) {
        this.configService.updateConfig(value, false);
    }
    get config() {
        return this.configService.getConfig();
    }
    /**
     * Whiteboard data elements.
     */
    set data(data) {
        if (data && data !== this.apiService.getElements()) {
            this.apiService.setElements(data);
        }
    }
    /**
     * Active drawing tool.
     */
    set selectedTool(tool) {
        if (tool && this.toolsService.getActiveToolType() !== tool) {
            this.toolsService.setActiveTool(tool);
        }
    }
    /**
     * Emitted when the whiteboard component is ready.
     */
    ready = new EventEmitter();
    /**
     * Emitted when the whiteboard is destroyed.
     */
    destroyed = new EventEmitter();
    /**
     * Emitted when the user starts drawing.
     */
    drawStart = new EventEmitter();
    /**
     * Emitted while the user is drawing.
     */
    drawing = new EventEmitter();
    /**
     * Emitted when the user stops drawing.
     */
    drawEnd = new EventEmitter();
    /**
     * Emitted when elements are added.
     */
    elementsAdded = new EventEmitter();
    /**
     * Emitted when elements are updated.
     */
    elementsUpdated = new EventEmitter();
    /**
     * Emitted when elements are selected or deselected.
     */
    elementsSelected = new EventEmitter();
    /**
     * Emitted when elements are removed.
     */
    elementsRemoved = new EventEmitter();
    /**
     * Emitted when an element is double-clicked.
     */
    elementDoubleClicked = new EventEmitter();
    /**
     * Emitted when an undo action is triggered.
     */
    undo = new EventEmitter();
    /**
     * Emitted when a redo action is triggered.
     */
    redo = new EventEmitter();
    /**
     * Emitted when the whiteboard is cleared.
     */
    clear = new EventEmitter();
    /**
     * Emitted when the whiteboard data changes.
     */
    dataChange = new EventEmitter();
    /**
     * Emitted when the whiteboard content is saved.
     */
    save = new EventEmitter();
    /**
     * Emitted when an image is added.
     */
    imageAdded = new EventEmitter();
    /**
     * Emitted when the selected drawing tool changes.
     */
    selectedToolChange = new EventEmitter();
    /**
     * Emitted when the configuration changes.
     */
    configChange = new EventEmitter();
    /**
     * Emitted when zoom-related configuration changes.
     */
    zoomChange = new EventEmitter();
    eventsMap = {
        [WhiteboardEvent.Ready]: this.ready,
        [WhiteboardEvent.Destroyed]: this.destroyed,
        [WhiteboardEvent.DrawStart]: this.drawStart,
        [WhiteboardEvent.Drawing]: this.drawing,
        [WhiteboardEvent.DrawEnd]: this.drawEnd,
        [WhiteboardEvent.ElementsAdded]: this.elementsAdded,
        [WhiteboardEvent.ElementsUpdated]: this.elementsUpdated,
        [WhiteboardEvent.ElementsSelected]: this.elementsSelected,
        [WhiteboardEvent.ElementsRemoved]: this.elementsRemoved,
        [WhiteboardEvent.ElementDoubleClicked]: this.elementDoubleClicked,
        [WhiteboardEvent.Undo]: this.undo,
        [WhiteboardEvent.Redo]: this.redo,
        [WhiteboardEvent.Clear]: this.clear,
        [WhiteboardEvent.DataChange]: this.dataChange,
        [WhiteboardEvent.Save]: this.save,
        [WhiteboardEvent.ImageAdded]: this.imageAdded,
        [WhiteboardEvent.ToolChange]: this.selectedToolChange,
        [WhiteboardEvent.ConfigChange]: this.configChange,
        [WhiteboardEvent.ZoomChange]: this.zoomChange,
    };
    /*
      private readonly forwardEventsEffect = effect(() => {
        const whiteboardEvent = this.eventBusService.getAllEventsSignal();
        const last = whiteboardEvent();
        if (!last) return;
        const emitter = this.eventsMap[last.type] as EventEmitter<unknown> | undefined;
        if (!emitter) return;
        if (last.payload !== undefined) {
          emitter.emit(last.payload as unknown);
        } else {
          emitter.emit();
        }
        this.cd.markForCheck();
      });
    */
    eventsSubscription = null;
    ngOnInit() {
        this.instanceService.register(this.boardId, this.apiService);
        this.eventsSubscription = this.eventBusService.listen().subscribe((event) => {
            const emitter = this.eventsMap[event.type];
            if (emitter) {
                if (event.payload != null) {
                    emitter.emit(event.payload);
                }
                else if (event.payload === undefined) {
                    emitter.emit();
                }
                // 确保变更检测能捕获到 output 的变化
                this.cd.markForCheck();
            }
        });
    }
    ngOnDestroy() {
        this.instanceService.unregister(this.boardId);
        this.eventBusService.emit(WhiteboardEvent.Destroyed);
        if (this.eventsSubscription) {
            this.eventsSubscription.unsubscribe();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NgWhiteboardComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NgWhiteboardComponent, isStandalone: true, selector: "ng-whiteboard", inputs: { boardId: "boardId", config: "config", data: "data", selectedTool: "selectedTool" }, outputs: { ready: "ready", destroyed: "destroyed", drawStart: "drawStart", drawing: "drawing", drawEnd: "drawEnd", elementsAdded: "elementsAdded", elementsUpdated: "elementsUpdated", elementsSelected: "elementsSelected", elementsRemoved: "elementsRemoved", elementDoubleClicked: "elementDoubleClicked", undo: "undo", redo: "redo", clear: "clear", dataChange: "dataChange", save: "save", imageAdded: "imageAdded", selectedToolChange: "selectedToolChange", configChange: "configChange", zoomChange: "zoomChange" }, providers: [
            SvgService,
            ApiService,
            ElementsService,
            CanvasService,
            IOService,
            ZoomService,
            PanService,
            SelectionService,
            ClipboardService,
            ToolsService,
            ToolFactory,
            EventBusService,
            ConfigService,
            KeyboardShortcutService,
            LayerManagementService,
            HistoryService,
            ContextMenuService,
            DragDropService,
            WheelHandlerService,
        ], ngImport: i0, template: `
    <div style="width: 100%; height: 100%; position: relative;">
      <ng-whiteboard-canvas></ng-whiteboard-canvas>
      <wb-context-menu></wb-context-menu>
    </div>
  `, isInline: true, styles: [":host{display:block;width:inherit;height:inherit;min-width:inherit;min-height:inherit;max-width:inherit;max-height:inherit}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "component", type: WhiteboardCanvasComponent, selector: "ng-whiteboard-canvas" }, { kind: "component", type: ContextMenuComponent, selector: "wb-context-menu" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NgWhiteboardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ng-whiteboard', standalone: true, imports: [CommonModule, WhiteboardCanvasComponent, ContextMenuComponent], template: `
    <div style="width: 100%; height: 100%; position: relative;">
      <ng-whiteboard-canvas></ng-whiteboard-canvas>
      <wb-context-menu></wb-context-menu>
    </div>
  `, providers: [
                        SvgService,
                        ApiService,
                        ElementsService,
                        CanvasService,
                        IOService,
                        ZoomService,
                        PanService,
                        SelectionService,
                        ClipboardService,
                        ToolsService,
                        ToolFactory,
                        EventBusService,
                        ConfigService,
                        KeyboardShortcutService,
                        LayerManagementService,
                        HistoryService,
                        ContextMenuService,
                        DragDropService,
                        WheelHandlerService,
                    ], changeDetection: ChangeDetectionStrategy.OnPush, styles: [":host{display:block;width:inherit;height:inherit;min-width:inherit;min-height:inherit;max-width:inherit;max-height:inherit}\n"] }]
        }], propDecorators: { boardId: [{
                type: Input
            }], config: [{
                type: Input
            }], data: [{
                type: Input
            }], selectedTool: [{
                type: Input
            }], ready: [{
                type: Output
            }], destroyed: [{
                type: Output
            }], drawStart: [{
                type: Output
            }], drawing: [{
                type: Output
            }], drawEnd: [{
                type: Output
            }], elementsAdded: [{
                type: Output
            }], elementsUpdated: [{
                type: Output
            }], elementsSelected: [{
                type: Output
            }], elementsRemoved: [{
                type: Output
            }], elementDoubleClicked: [{
                type: Output
            }], undo: [{
                type: Output
            }], redo: [{
                type: Output
            }], clear: [{
                type: Output
            }], dataChange: [{
                type: Output
            }], save: [{
                type: Output
            }], imageAdded: [{
                type: Output
            }], selectedToolChange: [{
                type: Output
            }], configChange: [{
                type: Output
            }], zoomChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctd2hpdGVib2FyZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy13aGl0ZWJvYXJkL3NyYy9saWIvbmctd2hpdGVib2FyZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFDTixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN4QyxPQUFPLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMvRCxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx1REFBdUQsQ0FBQztBQUM3RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUN6RixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDN0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxzQkFBc0IsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzVGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDckcsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3BELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxjQUFjLENB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Z0IsdUJBQXVCLENBQUMsTUFBTTs4QkFjdEMsT0FBTztzQkFBZixLQUFLO2dCQUtPLE1BQU07c0JBQWxCLEtBQUs7Z0JBV08sSUFBSTtzQkFBaEIsS0FBSztnQkFTTyxZQUFZO3NCQUF4QixLQUFLO2dCQVNJLEtBQUs7c0JBQWQsTUFBTTtnQkFLRyxTQUFTO3NCQUFsQixNQUFNO2dCQUtHLFNBQVM7c0JBQWxCLE1BQU07Z0JBS0csT0FBTztzQkFBaEIsTUFBTTtnQkFLRyxPQUFPO3NCQUFoQixNQUFNO2dCQUtHLGFBQWE7c0JBQXRCLE1BQU07Z0JBS0csZUFBZTtzQkFBeEIsTUFBTTtnQkFLRyxnQkFBZ0I7c0JBQXpCLE1BQU07Z0JBS0csZUFBZTtzQkFBeEIsTUFBTTtnQkFLRyxvQkFBb0I7c0JBQTdCLE1BQU07Z0JBS0csSUFBSTtzQkFBYixNQUFNO2dCQUtHLElBQUk7c0JBQWIsTUFBTTtnQkFLRyxLQUFLO3NCQUFkLE1BQU07Z0JBS0csVUFBVTtzQkFBbkIsTUFBTTtnQkFLRyxJQUFJO3NCQUFiLE1BQU07Z0JBS0csVUFBVTtzQkFBbkIsTUFBTTtnQkFLRyxrQkFBa0I7c0JBQTNCLE1BQU07Z0JBS0csWUFBWTtzQkFBckIsTUFBTTtnQkFLRyxVQUFVO3NCQUFuQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDaGFuZ2VEZXRlY3RvclJlZixcclxuICBDb21wb25lbnQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIElucHV0LFxyXG4gIE9uRGVzdHJveSxcclxuICBPbkluaXQsXHJcbiAgT3V0cHV0LFxyXG4gIGluamVjdCxcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQXBpU2VydmljZSB9IGZyb20gJy4vY29yZS9hcGknO1xyXG5pbXBvcnQgeyBDYW52YXNTZXJ2aWNlLCBJbnN0YW5jZVNlcnZpY2UgfSBmcm9tICcuL2NvcmUvY2FudmFzJztcclxuaW1wb3J0IHsgV2hpdGVib2FyZENhbnZhc0NvbXBvbmVudCB9IGZyb20gJy4vY29yZS9jb21wb25lbnRzL2NhbnZhcy93aGl0ZWJvYXJkLWNhbnZhcy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDb250ZXh0TWVudUNvbXBvbmVudCB9IGZyb20gJy4vY29yZS9jb21wb25lbnRzL2NvbnRleHQtbWVudS9jb250ZXh0LW1lbnUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29udGV4dE1lbnVTZXJ2aWNlIH0gZnJvbSAnLi9jb3JlL2NvbXBvbmVudHMvY29udGV4dC1tZW51L2NvbnRleHQtbWVudS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29uZmlnU2VydmljZSB9IGZyb20gJy4vY29yZS9jb25maWcvY29uZmlnLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBFbGVtZW50c1NlcnZpY2UsIExheWVyTWFuYWdlbWVudFNlcnZpY2UsIFNlbGVjdGlvblNlcnZpY2UgfSBmcm9tICcuL2NvcmUvZWxlbWVudHMnO1xyXG5pbXBvcnQgeyBFdmVudEJ1c1NlcnZpY2UgfSBmcm9tICcuL2NvcmUvZXZlbnQtYnVzL2V2ZW50LWJ1cy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSGlzdG9yeVNlcnZpY2UgfSBmcm9tICcuL2NvcmUvaGlzdG9yeSc7XHJcbmltcG9ydCB7IENsaXBib2FyZFNlcnZpY2UsIERyYWdEcm9wU2VydmljZSwgSU9TZXJ2aWNlLCBLZXlib2FyZFNob3J0Y3V0U2VydmljZSB9IGZyb20gJy4vY29yZS9pbnB1dCc7XHJcbmltcG9ydCB7IFN2Z1NlcnZpY2UgfSBmcm9tICcuL2NvcmUvc3ZnL3N2Zy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVG9vbHNTZXJ2aWNlIH0gZnJvbSAnLi9jb3JlL3Rvb2xzJztcclxuaW1wb3J0IHsgVG9vbEZhY3RvcnkgfSBmcm9tICcuL2NvcmUvdG9vbHMvdG9vbC1mYWN0b3J5LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBUb29sVHlwZSwgV2hpdGVib2FyZENvbmZpZywgV2hpdGVib2FyZEVsZW1lbnQgfSBmcm9tICcuL2NvcmUvdHlwZXMnO1xyXG5pbXBvcnQgeyBXaGl0ZWJvYXJkRXZlbnQgfSBmcm9tICcuL2NvcmUvdHlwZXMvZXZlbnRzJztcclxuaW1wb3J0IHsgUGFuU2VydmljZSwgV2hlZWxIYW5kbGVyU2VydmljZSwgWm9vbVNlcnZpY2UgfSBmcm9tICcuL2NvcmUvdmlld3BvcnQnO1xyXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKlxyXG4gKiBNYWluIHdoaXRlYm9hcmQgY29tcG9uZW50IHByb3ZpZGluZyBhIGNhbnZhcyB3aXRoIGRyYXdpbmcgdG9vbHMgYW5kIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cclxuICpcclxuICogSGFuZGxlcyB3aGl0ZWJvYXJkIGluaXRpYWxpemF0aW9uLCBldmVudCBtYW5hZ2VtZW50LCBhbmQgY29uZmlndXJhdGlvbiB1cGRhdGVzLlxyXG4gKi9cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZy13aGl0ZWJvYXJkJyxcclxuICBzdGFuZGFsb25lOiB0cnVlLFxyXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFdoaXRlYm9hcmRDYW52YXNDb21wb25lbnQsIENvbnRleHRNZW51Q29tcG9uZW50XSxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGRpdiBzdHlsZT1cIndpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IHBvc2l0aW9uOiByZWxhdGl2ZTtcIj5cclxuICAgICAgPG5nLXdoaXRlYm9hcmQtY2FudmFzPjwvbmctd2hpdGVib2FyZC1jYW52YXM+XHJcbiAgICAgIDx3Yi1jb250ZXh0LW1lbnU+PC93Yi1jb250ZXh0LW1lbnU+XHJcbiAgICA8L2Rpdj5cclxuICBgLFxyXG4gIHN0eWxlczogW1xyXG4gICAgYFxyXG4gICAgICA6aG9zdCB7XHJcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgd2lkdGg6IGluaGVyaXQ7XHJcbiAgICAgICAgaGVpZ2h0OiBpbmhlcml0O1xyXG4gICAgICAgIG1pbi13aWR0aDogaW5oZXJpdDtcclxuICAgICAgICBtaW4taGVpZ2h0OiBpbmhlcml0O1xyXG4gICAgICAgIG1heC13aWR0aDogaW5oZXJpdDtcclxuICAgICAgICBtYXgtaGVpZ2h0OiBpbmhlcml0O1xyXG4gICAgICB9XHJcbiAgICBgLFxyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICBTdmdTZXJ2aWNlLFxyXG4gICAgQXBpU2VydmljZSxcclxuICAgIEVsZW1lbnRzU2VydmljZSxcclxuICAgIENhbnZhc1NlcnZpY2UsXHJcbiAgICBJT1NlcnZpY2UsXHJcbiAgICBab29tU2VydmljZSxcclxuICAgIFBhblNlcnZpY2UsXHJcbiAgICBTZWxlY3Rpb25TZXJ2aWNlLFxyXG4gICAgQ2xpcGJvYXJkU2VydmljZSxcclxuICAgIFRvb2xzU2VydmljZSxcclxuICAgIFRvb2xGYWN0b3J5LFxyXG4gICAgRXZlbnRCdXNTZXJ2aWNlLFxyXG4gICAgQ29uZmlnU2VydmljZSxcclxuICAgIEtleWJvYXJkU2hvcnRjdXRTZXJ2aWNlLFxyXG4gICAgTGF5ZXJNYW5hZ2VtZW50U2VydmljZSxcclxuICAgIEhpc3RvcnlTZXJ2aWNlLFxyXG4gICAgQ29udGV4dE1lbnVTZXJ2aWNlLFxyXG4gICAgRHJhZ0Ryb3BTZXJ2aWNlLFxyXG4gICAgV2hlZWxIYW5kbGVyU2VydmljZSxcclxuICBdLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmdXaGl0ZWJvYXJkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xyXG4gIHByaXZhdGUgY29uZmlnU2VydmljZSA9IGluamVjdChDb25maWdTZXJ2aWNlKTtcclxuICBwcml2YXRlIGFwaVNlcnZpY2UgPSBpbmplY3QoQXBpU2VydmljZSk7XHJcbiAgcHJpdmF0ZSB0b29sc1NlcnZpY2UgPSBpbmplY3QoVG9vbHNTZXJ2aWNlKTtcclxuICBwcml2YXRlIGV2ZW50QnVzU2VydmljZSA9IGluamVjdChFdmVudEJ1c1NlcnZpY2UpO1xyXG4gIHByaXZhdGUgY2QgPSBpbmplY3QoQ2hhbmdlRGV0ZWN0b3JSZWYpO1xyXG4gIHByaXZhdGUgaW5zdGFuY2VTZXJ2aWNlID0gaW5qZWN0KEluc3RhbmNlU2VydmljZSk7XHJcblxyXG4gIC8qKlxyXG4gICAqIFVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGlzIHdoaXRlYm9hcmQgaW5zdGFuY2UuXHJcbiAgICogQXV0by1nZW5lcmF0ZWQgaWYgbm90IHByb3ZpZGVkLlxyXG4gICAqL1xyXG4gIEBJbnB1dCgpIGJvYXJkSWQ6IHN0cmluZyA9IGNyeXB0by5yYW5kb21VVUlEKCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIFdoaXRlYm9hcmQgY29uZmlndXJhdGlvbiBvcHRpb25zLlxyXG4gICAqL1xyXG4gIEBJbnB1dCgpIHNldCBjb25maWcodmFsdWU6IFBhcnRpYWw8V2hpdGVib2FyZENvbmZpZz4pIHtcclxuICAgIHRoaXMuY29uZmlnU2VydmljZS51cGRhdGVDb25maWcodmFsdWUsIGZhbHNlKTtcclxuICB9XHJcblxyXG4gIGdldCBjb25maWcoKTogV2hpdGVib2FyZENvbmZpZyB7XHJcbiAgICByZXR1cm4gdGhpcy5jb25maWdTZXJ2aWNlLmdldENvbmZpZygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogV2hpdGVib2FyZCBkYXRhIGVsZW1lbnRzLlxyXG4gICAqL1xyXG4gIEBJbnB1dCgpIHNldCBkYXRhKGRhdGE6IFdoaXRlYm9hcmRFbGVtZW50W10pIHtcclxuICAgIGlmIChkYXRhICYmIGRhdGEgIT09IHRoaXMuYXBpU2VydmljZS5nZXRFbGVtZW50cygpKSB7XHJcbiAgICAgIHRoaXMuYXBpU2VydmljZS5zZXRFbGVtZW50cyhkYXRhKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFjdGl2ZSBkcmF3aW5nIHRvb2wuXHJcbiAgICovXHJcbiAgQElucHV0KCkgc2V0IHNlbGVjdGVkVG9vbCh0b29sOiBUb29sVHlwZSkge1xyXG4gICAgaWYgKHRvb2wgJiYgdGhpcy50b29sc1NlcnZpY2UuZ2V0QWN0aXZlVG9vbFR5cGUoKSAhPT0gdG9vbCkge1xyXG4gICAgICB0aGlzLnRvb2xzU2VydmljZS5zZXRBY3RpdmVUb29sKHRvb2wpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHRlZCB3aGVuIHRoZSB3aGl0ZWJvYXJkIGNvbXBvbmVudCBpcyByZWFkeS5cclxuICAgKi9cclxuICBAT3V0cHV0KCkgcmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIEVtaXR0ZWQgd2hlbiB0aGUgd2hpdGVib2FyZCBpcyBkZXN0cm95ZWQuXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIGRlc3Ryb3llZCA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHRlZCB3aGVuIHRoZSB1c2VyIHN0YXJ0cyBkcmF3aW5nLlxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBkcmF3U3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfT4oKTtcclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHRlZCB3aGlsZSB0aGUgdXNlciBpcyBkcmF3aW5nLlxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBkcmF3aW5nID0gbmV3IEV2ZW50RW1pdHRlcjx7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0+KCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIEVtaXR0ZWQgd2hlbiB0aGUgdXNlciBzdG9wcyBkcmF3aW5nLlxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBkcmF3RW5kID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0dGVkIHdoZW4gZWxlbWVudHMgYXJlIGFkZGVkLlxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBlbGVtZW50c0FkZGVkID0gbmV3IEV2ZW50RW1pdHRlcjxXaGl0ZWJvYXJkRWxlbWVudFtdPigpO1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0dGVkIHdoZW4gZWxlbWVudHMgYXJlIHVwZGF0ZWQuXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIGVsZW1lbnRzVXBkYXRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8V2hpdGVib2FyZEVsZW1lbnRbXT4oKTtcclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHRlZCB3aGVuIGVsZW1lbnRzIGFyZSBzZWxlY3RlZCBvciBkZXNlbGVjdGVkLlxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBlbGVtZW50c1NlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxXaGl0ZWJvYXJkRWxlbWVudFtdPigpO1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0dGVkIHdoZW4gZWxlbWVudHMgYXJlIHJlbW92ZWQuXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIGVsZW1lbnRzUmVtb3ZlZCA9IG5ldyBFdmVudEVtaXR0ZXI8V2hpdGVib2FyZEVsZW1lbnRbXT4oKTtcclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHRlZCB3aGVuIGFuIGVsZW1lbnQgaXMgZG91YmxlLWNsaWNrZWQuXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIGVsZW1lbnREb3VibGVDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjx7IHRhcmdldDogRXZlbnRUYXJnZXQgfCBudWxsOyBjbGllbnRYOiBudW1iZXI7IGNsaWVudFk6IG51bWJlciB9PigpO1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0dGVkIHdoZW4gYW4gdW5kbyBhY3Rpb24gaXMgdHJpZ2dlcmVkLlxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSB1bmRvID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0dGVkIHdoZW4gYSByZWRvIGFjdGlvbiBpcyB0cmlnZ2VyZWQuXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIHJlZG8gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIEVtaXR0ZWQgd2hlbiB0aGUgd2hpdGVib2FyZCBpcyBjbGVhcmVkLlxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBjbGVhciA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHRlZCB3aGVuIHRoZSB3aGl0ZWJvYXJkIGRhdGEgY2hhbmdlcy5cclxuICAgKi9cclxuICBAT3V0cHV0KCkgZGF0YUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8V2hpdGVib2FyZEVsZW1lbnRbXT4oKTtcclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHRlZCB3aGVuIHRoZSB3aGl0ZWJvYXJkIGNvbnRlbnQgaXMgc2F2ZWQuXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIHNhdmUgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHRlZCB3aGVuIGFuIGltYWdlIGlzIGFkZGVkLlxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBpbWFnZUFkZGVkID0gbmV3IEV2ZW50RW1pdHRlcjxGaWxlPigpO1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0dGVkIHdoZW4gdGhlIHNlbGVjdGVkIGRyYXdpbmcgdG9vbCBjaGFuZ2VzLlxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKSBzZWxlY3RlZFRvb2xDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFRvb2xUeXBlPigpO1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0dGVkIHdoZW4gdGhlIGNvbmZpZ3VyYXRpb24gY2hhbmdlcy5cclxuICAgKi9cclxuICBAT3V0cHV0KCkgY29uZmlnQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxQYXJ0aWFsPFdoaXRlYm9hcmRDb25maWc+PigpO1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0dGVkIHdoZW4gem9vbS1yZWxhdGVkIGNvbmZpZ3VyYXRpb24gY2hhbmdlcy5cclxuICAgKi9cclxuICBAT3V0cHV0KCkgem9vbUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8e1xyXG4gICAgem9vbTogbnVtYmVyO1xyXG4gICAgY2VudGVyOiBib29sZWFuO1xyXG4gICAgY2FudmFzV2lkdGg6IG51bWJlcjtcclxuICAgIGNhbnZhc0hlaWdodDogbnVtYmVyO1xyXG4gIH0+KCk7XHJcblxyXG4gIHByaXZhdGUgcmVhZG9ubHkgZXZlbnRzTWFwID0ge1xyXG4gICAgW1doaXRlYm9hcmRFdmVudC5SZWFkeV06IHRoaXMucmVhZHksXHJcbiAgICBbV2hpdGVib2FyZEV2ZW50LkRlc3Ryb3llZF06IHRoaXMuZGVzdHJveWVkLFxyXG4gICAgW1doaXRlYm9hcmRFdmVudC5EcmF3U3RhcnRdOiB0aGlzLmRyYXdTdGFydCxcclxuICAgIFtXaGl0ZWJvYXJkRXZlbnQuRHJhd2luZ106IHRoaXMuZHJhd2luZyxcclxuICAgIFtXaGl0ZWJvYXJkRXZlbnQuRHJhd0VuZF06IHRoaXMuZHJhd0VuZCxcclxuICAgIFtXaGl0ZWJvYXJkRXZlbnQuRWxlbWVudHNBZGRlZF06IHRoaXMuZWxlbWVudHNBZGRlZCxcclxuICAgIFtXaGl0ZWJvYXJkRXZlbnQuRWxlbWVudHNVcGRhdGVkXTogdGhpcy5lbGVtZW50c1VwZGF0ZWQsXHJcbiAgICBbV2hpdGVib2FyZEV2ZW50LkVsZW1lbnRzU2VsZWN0ZWRdOiB0aGlzLmVsZW1lbnRzU2VsZWN0ZWQsXHJcbiAgICBbV2hpdGVib2FyZEV2ZW50LkVsZW1lbnRzUmVtb3ZlZF06IHRoaXMuZWxlbWVudHNSZW1vdmVkLFxyXG4gICAgW1doaXRlYm9hcmRFdmVudC5FbGVtZW50RG91YmxlQ2xpY2tlZF06IHRoaXMuZWxlbWVudERvdWJsZUNsaWNrZWQsXHJcbiAgICBbV2hpdGVib2FyZEV2ZW50LlVuZG9dOiB0aGlzLnVuZG8sXHJcbiAgICBbV2hpdGVib2FyZEV2ZW50LlJlZG9dOiB0aGlzLnJlZG8sXHJcbiAgICBbV2hpdGVib2FyZEV2ZW50LkNsZWFyXTogdGhpcy5jbGVhcixcclxuICAgIFtXaGl0ZWJvYXJkRXZlbnQuRGF0YUNoYW5nZV06IHRoaXMuZGF0YUNoYW5nZSxcclxuICAgIFtXaGl0ZWJvYXJkRXZlbnQuU2F2ZV06IHRoaXMuc2F2ZSxcclxuICAgIFtXaGl0ZWJvYXJkRXZlbnQuSW1hZ2VBZGRlZF06IHRoaXMuaW1hZ2VBZGRlZCxcclxuICAgIFtXaGl0ZWJvYXJkRXZlbnQuVG9vbENoYW5nZV06IHRoaXMuc2VsZWN0ZWRUb29sQ2hhbmdlLFxyXG4gICAgW1doaXRlYm9hcmRFdmVudC5Db25maWdDaGFuZ2VdOiB0aGlzLmNvbmZpZ0NoYW5nZSxcclxuICAgIFtXaGl0ZWJvYXJkRXZlbnQuWm9vbUNoYW5nZV06IHRoaXMuem9vbUNoYW5nZSxcclxuICB9O1xyXG4vKlxyXG4gIHByaXZhdGUgcmVhZG9ubHkgZm9yd2FyZEV2ZW50c0VmZmVjdCA9IGVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCB3aGl0ZWJvYXJkRXZlbnQgPSB0aGlzLmV2ZW50QnVzU2VydmljZS5nZXRBbGxFdmVudHNTaWduYWwoKTtcclxuICAgIGNvbnN0IGxhc3QgPSB3aGl0ZWJvYXJkRXZlbnQoKTtcclxuICAgIGlmICghbGFzdCkgcmV0dXJuO1xyXG4gICAgY29uc3QgZW1pdHRlciA9IHRoaXMuZXZlbnRzTWFwW2xhc3QudHlwZV0gYXMgRXZlbnRFbWl0dGVyPHVua25vd24+IHwgdW5kZWZpbmVkO1xyXG4gICAgaWYgKCFlbWl0dGVyKSByZXR1cm47XHJcbiAgICBpZiAobGFzdC5wYXlsb2FkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgZW1pdHRlci5lbWl0KGxhc3QucGF5bG9hZCBhcyB1bmtub3duKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVtaXR0ZXIuZW1pdCgpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcclxuICB9KTtcclxuKi9cclxuXHJcbiAgcHJpdmF0ZSBldmVudHNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiB8IG51bGwgPSBudWxsO1xyXG4gIFxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbnN0YW5jZVNlcnZpY2UucmVnaXN0ZXIodGhpcy5ib2FyZElkLCB0aGlzLmFwaVNlcnZpY2UpO1xyXG4gICAgdGhpcy5ldmVudHNTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50QnVzU2VydmljZS5saXN0ZW4oKS5zdWJzY3JpYmUoKGV2ZW50KSA9PiB7XHJcbiAgICAgIGNvbnN0IGVtaXR0ZXIgPSB0aGlzLmV2ZW50c01hcFtldmVudC50eXBlXTtcclxuICAgICAgaWYgKGVtaXR0ZXIpIHtcclxuICAgICAgICBpZiAoZXZlbnQucGF5bG9hZCAhPSBudWxsKSB7IFxyXG4gICAgICAgICAgICAoZW1pdHRlciBhcyBhbnkpLmVtaXQoZXZlbnQucGF5bG9hZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGV2ZW50LnBheWxvYWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBlbWl0dGVyLmVtaXQoKTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOehruS/neWPmOabtOajgOa1i+iDveaNleiOt+WIsCBvdXRwdXQg55qE5Y+Y5YyWXHJcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHRoaXMuaW5zdGFuY2VTZXJ2aWNlLnVucmVnaXN0ZXIodGhpcy5ib2FyZElkKTtcclxuICAgIHRoaXMuZXZlbnRCdXNTZXJ2aWNlLmVtaXQoV2hpdGVib2FyZEV2ZW50LkRlc3Ryb3llZCk7XHJcbiAgICBpZiAodGhpcy5ldmVudHNTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5ldmVudHNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19