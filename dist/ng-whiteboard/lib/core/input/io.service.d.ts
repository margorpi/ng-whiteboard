import { EventBusService } from '../event-bus/event-bus.service';
import { AddImage, FormatType } from '../types';
import { CanvasService } from '../canvas/canvas.service';
import { ElementsService } from '../elements/elements.service';
import { SelectionService } from '../elements/selection.service';
import { PanService } from '../viewport/pan.service';
import { ZoomService } from '../viewport/zoom.service';
import { LayerManagementService } from '../elements/layer-management.service';
import { ConfigService } from '../config/config.service';
import * as i0 from "@angular/core";
/**
 * Handles import/export operations for the whiteboard including images, state serialization, and various export formats.
 */
export declare class IOService {
    private elementsService;
    private canvasService;
    private zoomService;
    private panService;
    private eventBusService;
    private selectionService;
    private layerManagementService;
    private configService;
    constructor(elementsService: ElementsService, canvasService: CanvasService, zoomService: ZoomService, panService: PanService, eventBusService: EventBusService, selectionService: SelectionService, layerManagementService: LayerManagementService, configService: ConfigService);
    addImage(imageInfo: AddImage): void;
    importImageFile(file: File, x?: number, y?: number): Promise<void>;
    importImageFromUrl(url: string, x?: number, y?: number): Promise<void>;
    save(format?: FormatType, name?: string): Promise<string>;
    exportAsPng(name?: string): Promise<string>;
    exportAsJpeg(name?: string): Promise<string>;
    exportAsSvg(name?: string): Promise<string>;
    exportAsBase64(): Promise<string>;
    exportData(): string;
    exportDataAsFile(filename?: string): void;
    importData(jsonData: string): void;
    importDataFromFile(file: File): Promise<void>;
    private downloadFile;
    private getFileExtension;
    private prepareSvgForExport;
    importMultipleImages(files: FileList, spacing?: number): Promise<void>;
    protected processImage(imageData: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<IOService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IOService>;
}
