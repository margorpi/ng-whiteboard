import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ToolType, WhiteboardConfig, WhiteboardElement } from './core/types';
import * as i0 from "@angular/core";
/**
 * Main whiteboard component providing a canvas with drawing tools and configuration options.
 *
 * Handles whiteboard initialization, event management, and configuration updates.
 */
export declare class NgWhiteboardComponent implements OnInit, OnDestroy {
    private configService;
    private apiService;
    private toolsService;
    private eventBusService;
    private cd;
    private instanceService;
    /**
     * Unique identifier for this whiteboard instance.
     * Auto-generated if not provided.
     */
    boardId: string;
    /**
     * Whiteboard configuration options.
     */
    set config(value: Partial<WhiteboardConfig>);
    get config(): WhiteboardConfig;
    /**
     * Whiteboard data elements.
     */
    set data(data: WhiteboardElement[]);
    /**
     * Active drawing tool.
     */
    set selectedTool(tool: ToolType);
    /**
     * Emitted when the whiteboard component is ready.
     */
    ready: EventEmitter<void>;
    /**
     * Emitted when the whiteboard is destroyed.
     */
    destroyed: EventEmitter<void>;
    /**
     * Emitted when the user starts drawing.
     */
    drawStart: EventEmitter<{
        x: number;
        y: number;
    }>;
    /**
     * Emitted while the user is drawing.
     */
    drawing: EventEmitter<{
        x: number;
        y: number;
    }>;
    /**
     * Emitted when the user stops drawing.
     */
    drawEnd: EventEmitter<void>;
    /**
     * Emitted when elements are added.
     */
    elementsAdded: EventEmitter<WhiteboardElement[]>;
    /**
     * Emitted when elements are updated.
     */
    elementsUpdated: EventEmitter<WhiteboardElement[]>;
    /**
     * Emitted when elements are selected or deselected.
     */
    elementsSelected: EventEmitter<WhiteboardElement[]>;
    /**
     * Emitted when elements are removed.
     */
    elementsRemoved: EventEmitter<WhiteboardElement[]>;
    /**
     * Emitted when an element is double-clicked.
     */
    elementDoubleClicked: EventEmitter<{
        target: EventTarget | null;
        clientX: number;
        clientY: number;
    }>;
    /**
     * Emitted when an undo action is triggered.
     */
    undo: EventEmitter<void>;
    /**
     * Emitted when a redo action is triggered.
     */
    redo: EventEmitter<void>;
    /**
     * Emitted when the whiteboard is cleared.
     */
    clear: EventEmitter<void>;
    /**
     * Emitted when the whiteboard data changes.
     */
    dataChange: EventEmitter<WhiteboardElement[]>;
    /**
     * Emitted when the whiteboard content is saved.
     */
    save: EventEmitter<string>;
    /**
     * Emitted when an image is added.
     */
    imageAdded: EventEmitter<File>;
    /**
     * Emitted when the selected drawing tool changes.
     */
    selectedToolChange: EventEmitter<ToolType>;
    /**
     * Emitted when the configuration changes.
     */
    configChange: EventEmitter<Partial<WhiteboardConfig>>;
    /**
     * Emitted when zoom-related configuration changes.
     */
    zoomChange: EventEmitter<{
        zoom: number;
        center: boolean;
        canvasWidth: number;
        canvasHeight: number;
    }>;
    private readonly eventsMap;
    private eventsSubscription;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgWhiteboardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgWhiteboardComponent, "ng-whiteboard", never, { "boardId": { "alias": "boardId"; "required": false; }; "config": { "alias": "config"; "required": false; }; "data": { "alias": "data"; "required": false; }; "selectedTool": { "alias": "selectedTool"; "required": false; }; }, { "ready": "ready"; "destroyed": "destroyed"; "drawStart": "drawStart"; "drawing": "drawing"; "drawEnd": "drawEnd"; "elementsAdded": "elementsAdded"; "elementsUpdated": "elementsUpdated"; "elementsSelected": "elementsSelected"; "elementsRemoved": "elementsRemoved"; "elementDoubleClicked": "elementDoubleClicked"; "undo": "undo"; "redo": "redo"; "clear": "clear"; "dataChange": "dataChange"; "save": "save"; "imageAdded": "imageAdded"; "selectedToolChange": "selectedToolChange"; "configChange": "configChange"; "zoomChange": "zoomChange"; }, never, never, true, never>;
}
