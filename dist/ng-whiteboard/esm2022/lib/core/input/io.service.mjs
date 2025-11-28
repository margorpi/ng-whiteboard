import { Injectable } from '@angular/core';
import { createElement } from '../elements/element.utils';
import { EventBusService } from '../event-bus/event-bus.service';
import { ElementType, FormatType } from '../types';
import { WhiteboardEvent } from '../types/events';
import { downloadFile } from '../utils/common';
import { svgToBase64 } from '../utils/svg';
import { CanvasService } from '../canvas/canvas.service';
import { ElementsService } from '../elements/elements.service';
import { SelectionService } from '../elements/selection.service';
import { PanService } from '../viewport/pan.service';
import { ZoomService } from '../viewport/zoom.service';
import { LayerManagementService } from '../elements/layer-management.service';
import { ConfigService } from '../config/config.service';
import * as i0 from "@angular/core";
import * as i1 from "../elements/elements.service";
import * as i2 from "../canvas/canvas.service";
import * as i3 from "../viewport/zoom.service";
import * as i4 from "../viewport/pan.service";
import * as i5 from "../event-bus/event-bus.service";
import * as i6 from "../elements/selection.service";
import * as i7 from "../elements/layer-management.service";
import * as i8 from "../config/config.service";
/**
 * Handles import/export operations for the whiteboard including images, state serialization, and various export formats.
 */
export class IOService {
    elementsService;
    canvasService;
    zoomService;
    panService;
    eventBusService;
    selectionService;
    layerManagementService;
    configService;
    constructor(elementsService, canvasService, zoomService, panService, eventBusService, selectionService, layerManagementService, configService) {
        this.elementsService = elementsService;
        this.canvasService = canvasService;
        this.zoomService = zoomService;
        this.panService = panService;
        this.eventBusService = eventBusService;
        this.selectionService = selectionService;
        this.layerManagementService = layerManagementService;
        this.configService = configService;
    }
    addImage(imageInfo) {
        const tempImg = new Image();
        tempImg.onload = () => {
            const { canvasHeight } = this.canvasService.getConfig();
            const imageWidth = tempImg.width;
            const imageHeight = tempImg.height;
            const aspectRatio = tempImg.width / tempImg.height;
            const height = imageHeight > canvasHeight ? canvasHeight - 40 : imageHeight;
            const width = height === canvasHeight - 40 ? (canvasHeight - 40) * aspectRatio : imageWidth;
            let x = imageInfo.x || 0;
            let y = imageInfo.y || 0;
            if (x < 0)
                x = 0;
            if (y < 0)
                y = 0;
            const element = createElement(ElementType.Image, {
                src: imageInfo.image,
                width,
                height,
                x,
                y,
                zIndex: this.elementsService.getNextZIndex(),
            });
            this.elementsService.addElements([element]);
            if (element.selectAfterDraw) {
                this.selectionService.selectElements([element.id]);
            }
            this.eventBusService.emit(WhiteboardEvent.ImageAdded, element.src);
        };
        tempImg.onerror = () => {
            console.error('Failed to load image');
        };
        tempImg.src = imageInfo.image;
    }
    importImageFile(file, x, y) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('Invalid file type. Only images are supported.'));
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result;
                if (result) {
                    this.addImage({
                        image: result,
                        x,
                        y,
                    });
                    resolve();
                }
                else {
                    reject(new Error('Failed to read file'));
                }
            };
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            reader.readAsDataURL(file);
        });
    }
    async importImageFromUrl(url, x, y) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = event.target?.result;
                    if (result) {
                        this.addImage({
                            image: result,
                            x,
                            y,
                        });
                        resolve();
                    }
                    else {
                        reject(new Error('Failed to process URL'));
                    }
                };
                reader.onerror = () => {
                    reject(new Error('Failed to process URL'));
                };
                reader.readAsDataURL(blob);
            });
        }
        catch (error) {
            throw new Error(`Failed to load image from URL: ${error}`);
        }
    }
    async save(format = FormatType.Base64, name = 'New board') {
        const canvas = this.canvasService.getCanvas();
        const svgElement = canvas.getElementById('svgcontent');
        if (!svgElement) {
            throw new Error('SVG content not found');
        }
        const svgClone = this.prepareSvgForExport(svgElement);
        const svgString = new XMLSerializer().serializeToString(svgClone);
        const { canvasWidth, canvasHeight } = this.canvasService.getConfig();
        try {
            const imageString = await svgToBase64(svgString, canvasWidth, canvasHeight, format);
            switch (format) {
                case FormatType.Base64:
                    this.eventBusService.emit(WhiteboardEvent.Save, imageString);
                    break;
                case FormatType.Svg: {
                    const imgSrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
                    this.downloadFile(imgSrc, name, 'svg');
                    this.eventBusService.emit(WhiteboardEvent.Save, imgSrc);
                    break;
                }
                default:
                    this.downloadFile(imageString, name, this.getFileExtension(format));
                    this.eventBusService.emit(WhiteboardEvent.Save, imageString);
                    break;
            }
            return imageString;
        }
        catch (error) {
            console.error('Failed to save whiteboard:', error);
            throw error;
        }
    }
    async exportAsPng(name = 'whiteboard') {
        return this.save(FormatType.Png, name);
    }
    async exportAsJpeg(name = 'whiteboard') {
        return this.save(FormatType.Jpeg, name);
    }
    async exportAsSvg(name = 'whiteboard') {
        return this.save(FormatType.Svg, name);
    }
    async exportAsBase64() {
        return this.save(FormatType.Base64);
    }
    exportData() {
        const elements = this.elementsService.getElements();
        const canvasConfig = this.canvasService.getConfig();
        const layerState = this.layerManagementService.exportLayerState();
        const editorConfig = this.configService.getEditorConfig();
        const exportData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            elements: elements,
            layers: layerState,
            canvas: {
                width: canvasConfig.canvasWidth,
                height: canvasConfig.canvasHeight,
                backgroundColor: canvasConfig.backgroundColor,
                fullScreen: canvasConfig.fullScreen,
                center: canvasConfig.center,
            },
            viewport: {
                zoom: canvasConfig.zoom,
                x: canvasConfig.x,
                y: canvasConfig.y,
                canvasX: canvasConfig.canvasX,
                canvasY: canvasConfig.canvasY,
            },
            drawing: {
                strokeColor: canvasConfig.strokeColor,
                strokeWidth: canvasConfig.strokeWidth,
                fill: canvasConfig.fill,
                lineJoin: canvasConfig.lineJoin,
                lineCap: canvasConfig.lineCap,
                dasharray: canvasConfig.dasharray,
                dashoffset: canvasConfig.dashoffset,
                penType: canvasConfig.penType,
            },
            grid: {
                enabled: canvasConfig.enableGrid,
                size: canvasConfig.gridSize,
                snapToGrid: canvasConfig.snapToGrid,
            },
            text: {
                fontFamily: canvasConfig.fontFamily,
                fontSize: canvasConfig.fontSize,
            },
            editor: editorConfig,
            settings: {
                drawingEnabled: canvasConfig.drawingEnabled,
                keyboardShortcutsEnabled: canvasConfig.keyboardShortcutsEnabled,
            },
        };
        return JSON.stringify(exportData, null, 2);
    }
    exportDataAsFile(filename = 'whiteboard-export') {
        const jsonData = this.exportData();
        const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonData);
        this.downloadFile(dataUrl, filename, 'json');
        this.eventBusService.emit(WhiteboardEvent.Save, jsonData);
    }
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (!data.elements || !Array.isArray(data.elements)) {
                throw new Error('Invalid data format: elements array not found');
            }
            this.elementsService.clear();
            if (data.layers) {
                this.layerManagementService.importLayerState(data.layers);
            }
            this.elementsService.setElements(data.elements);
            if (data.canvas) {
                const { canvas } = data;
                if (canvas.width && canvas.height) {
                    this.canvasService.setCanvasDimensions(canvas.width, canvas.height);
                }
                if (canvas.backgroundColor !== undefined) {
                    this.configService.updateConfig({ backgroundColor: canvas.backgroundColor }, false);
                }
                if (canvas.fullScreen !== undefined) {
                    this.configService.updateConfig({ fullScreen: canvas.fullScreen }, false);
                }
                if (canvas.center !== undefined) {
                    this.configService.updateConfig({ center: canvas.center }, false);
                }
            }
            if (data.viewport) {
                const { viewport } = data;
                if (viewport.zoom !== undefined) {
                    this.zoomService.zoom(viewport.zoom);
                }
                if (viewport.x !== undefined && viewport.y !== undefined) {
                    this.panService.panTo(viewport.x, viewport.y);
                }
                if (viewport.canvasX !== undefined && viewport.canvasY !== undefined) {
                    this.configService.updateConfig({
                        canvasX: viewport.canvasX,
                        canvasY: viewport.canvasY,
                    }, false);
                }
            }
            if (data.drawing) {
                const { drawing } = data;
                const drawingConfig = {};
                if (drawing.strokeColor !== undefined)
                    drawingConfig.strokeColor = drawing.strokeColor;
                if (drawing.strokeWidth !== undefined)
                    drawingConfig.strokeWidth = drawing.strokeWidth;
                if (drawing.fill !== undefined)
                    drawingConfig.fill = drawing.fill;
                if (drawing.lineJoin !== undefined)
                    drawingConfig.lineJoin = drawing.lineJoin;
                if (drawing.lineCap !== undefined)
                    drawingConfig.lineCap = drawing.lineCap;
                if (drawing.dasharray !== undefined)
                    drawingConfig.dasharray = drawing.dasharray;
                if (drawing.dashoffset !== undefined)
                    drawingConfig.dashoffset = drawing.dashoffset;
                if (drawing.penType !== undefined)
                    drawingConfig.penType = drawing.penType;
                this.configService.updateConfig(drawingConfig, false);
            }
            if (data.grid) {
                const { grid } = data;
                const gridConfig = {};
                if (grid.enabled !== undefined)
                    gridConfig.enableGrid = grid.enabled;
                if (grid.size !== undefined)
                    gridConfig.gridSize = grid.size;
                if (grid.snapToGrid !== undefined)
                    gridConfig.snapToGrid = grid.snapToGrid;
                this.configService.updateConfig(gridConfig, false);
            }
            if (data.text) {
                const { text } = data;
                const textConfig = {};
                if (text.fontFamily !== undefined)
                    textConfig.fontFamily = text.fontFamily;
                if (text.fontSize !== undefined)
                    textConfig.fontSize = text.fontSize;
                this.configService.updateConfig(textConfig, false);
            }
            if (data.editor) {
                const editorKeys = Object.keys(data.editor);
                editorKeys.forEach((key) => {
                    this.configService.updateEditorConfigValue(key, data.editor[key]);
                });
            }
            if (data.settings) {
                const { settings } = data;
                const settingsConfig = {};
                if (settings.drawingEnabled !== undefined)
                    settingsConfig.drawingEnabled = settings.drawingEnabled;
                if (settings.keyboardShortcutsEnabled !== undefined) {
                    settingsConfig.keyboardShortcutsEnabled = settings.keyboardShortcutsEnabled;
                }
                this.configService.updateConfig(settingsConfig, false);
            }
            this.configService.updateConfig({}, true);
            this.eventBusService.emit(WhiteboardEvent.ElementsAdded, data.elements);
        }
        catch (error) {
            console.error('Failed to import data:', error);
            throw new Error(`Failed to import data: ${error}`);
        }
    }
    importDataFromFile(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.includes('json')) {
                reject(new Error('Invalid file type. Only JSON files are supported.'));
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result;
                if (result && typeof result === 'string') {
                    try {
                        this.importData(result);
                        resolve();
                    }
                    catch (error) {
                        reject(error);
                    }
                }
                else {
                    reject(new Error('Failed to read file'));
                }
            };
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            reader.readAsText(file);
        });
    }
    downloadFile(dataUrl, name, extension) {
        const fileName = `${name}.${extension}`;
        downloadFile(dataUrl, fileName);
    }
    getFileExtension(format) {
        switch (format) {
            case FormatType.Png:
                return 'png';
            case FormatType.Jpeg:
                return 'jpg';
            case FormatType.Svg:
                return 'svg';
            case FormatType.Base64:
                return 'txt';
            default:
                return 'png';
        }
    }
    prepareSvgForExport(svgElement) {
        const svgClone = svgElement.cloneNode(true);
        const selectorParentGroup = svgClone.querySelector('#selectorParentGroup');
        if (selectorParentGroup) {
            selectorParentGroup.remove();
        }
        const contentBackground = svgClone.querySelector('#contentBackground');
        if (contentBackground) {
            contentBackground.removeAttribute('opacity');
        }
        svgClone.setAttribute('x', '0');
        svgClone.setAttribute('y', '0');
        return svgClone;
    }
    async importMultipleImages(files, spacing = 50) {
        const promises = [];
        let currentX = 0;
        let currentY = 0;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            promises.push(this.importImageFile(file, currentX, currentY));
            currentX += 200 + spacing;
            if (currentX > 800) {
                currentX = 0;
                currentY += 200 + spacing;
            }
        }
        await Promise.all(promises);
    }
    processImage(imageData) {
        return imageData;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: IOService, deps: [{ token: i1.ElementsService }, { token: i2.CanvasService }, { token: i3.ZoomService }, { token: i4.PanService }, { token: i5.EventBusService }, { token: i6.SelectionService }, { token: i7.LayerManagementService }, { token: i8.ConfigService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: IOService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: IOService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.ElementsService }, { type: i2.CanvasService }, { type: i3.ZoomService }, { type: i4.PanService }, { type: i5.EventBusService }, { type: i6.SelectionService }, { type: i7.LayerManagementService }, { type: i8.ConfigService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW8uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLXdoaXRlYm9hcmQvc3JjL2xpYi9jb3JlL2lucHV0L2lvLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ2pFLE9BQU8sRUFBWSxXQUFXLEVBQUUsVUFBVSxFQUFrQyxNQUFNLFVBQVUsQ0FBQztBQUM3RixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDckQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzlFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7Ozs7OztBQUV6RDs7R0FFRztBQUVILE1BQU0sT0FBTyxTQUFTO0lBRVY7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQVJWLFlBQ1UsZUFBZ0MsRUFDaEMsYUFBNEIsRUFDNUIsV0FBd0IsRUFDeEIs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VUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tICcuLi9lbGVtZW50cy9lbGVtZW50LnV0aWxzJztcclxuaW1wb3J0IHsgRXZlbnRCdXNTZXJ2aWNlIH0gZnJvbSAnLi4vZXZlbnQtYnVzL2V2ZW50LWJ1cy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQWRkSW1hZ2UsIEVsZW1lbnRUeXBlLCBGb3JtYXRUeXBlLCBXaGl0ZWJvYXJkQ29uZmlnLCBFZGl0b3JDb25maWcgfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCB7IFdoaXRlYm9hcmRFdmVudCB9IGZyb20gJy4uL3R5cGVzL2V2ZW50cyc7XHJcbmltcG9ydCB7IGRvd25sb2FkRmlsZSB9IGZyb20gJy4uL3V0aWxzL2NvbW1vbic7XHJcbmltcG9ydCB7IHN2Z1RvQmFzZTY0IH0gZnJvbSAnLi4vdXRpbHMvc3ZnJztcclxuaW1wb3J0IHsgQ2FudmFzU2VydmljZSB9IGZyb20gJy4uL2NhbnZhcy9jYW52YXMuc2VydmljZSc7XHJcbmltcG9ydCB7IEVsZW1lbnRzU2VydmljZSB9IGZyb20gJy4uL2VsZW1lbnRzL2VsZW1lbnRzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTZWxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi4vZWxlbWVudHMvc2VsZWN0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQYW5TZXJ2aWNlIH0gZnJvbSAnLi4vdmlld3BvcnQvcGFuLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBab29tU2VydmljZSB9IGZyb20gJy4uL3ZpZXdwb3J0L3pvb20uc2VydmljZSc7XHJcbmltcG9ydCB7IExheWVyTWFuYWdlbWVudFNlcnZpY2UgfSBmcm9tICcuLi9lbGVtZW50cy9sYXllci1tYW5hZ2VtZW50LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb25maWdTZXJ2aWNlIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZy5zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKiBIYW5kbGVzIGltcG9ydC9leHBvcnQgb3BlcmF0aW9ucyBmb3IgdGhlIHdoaXRlYm9hcmQgaW5jbHVkaW5nIGltYWdlcywgc3RhdGUgc2VyaWFsaXphdGlvbiwgYW5kIHZhcmlvdXMgZXhwb3J0IGZvcm1hdHMuXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgSU9TZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgZWxlbWVudHNTZXJ2aWNlOiBFbGVtZW50c1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIGNhbnZhc1NlcnZpY2U6IENhbnZhc1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIHpvb21TZXJ2aWNlOiBab29tU2VydmljZSxcclxuICAgIHByaXZhdGUgcGFuU2VydmljZTogUGFuU2VydmljZSxcclxuICAgIHByaXZhdGUgZXZlbnRCdXNTZXJ2aWNlOiBFdmVudEJ1c1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIHNlbGVjdGlvblNlcnZpY2U6IFNlbGVjdGlvblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGxheWVyTWFuYWdlbWVudFNlcnZpY2U6IExheWVyTWFuYWdlbWVudFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGNvbmZpZ1NlcnZpY2U6IENvbmZpZ1NlcnZpY2VcclxuICApIHt9XHJcblxyXG4gIGFkZEltYWdlKGltYWdlSW5mbzogQWRkSW1hZ2UpOiB2b2lkIHtcclxuICAgIGNvbnN0IHRlbXBJbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICB0ZW1wSW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgY29uc3QgeyBjYW52YXNIZWlnaHQgfSA9IHRoaXMuY2FudmFzU2VydmljZS5nZXRDb25maWcoKTtcclxuICAgICAgY29uc3QgaW1hZ2VXaWR0aCA9IHRlbXBJbWcud2lkdGg7XHJcbiAgICAgIGNvbnN0IGltYWdlSGVpZ2h0ID0gdGVtcEltZy5oZWlnaHQ7XHJcbiAgICAgIGNvbnN0IGFzcGVjdFJhdGlvID0gdGVtcEltZy53aWR0aCAvIHRlbXBJbWcuaGVpZ2h0O1xyXG5cclxuICAgICAgY29uc3QgaGVpZ2h0ID0gaW1hZ2VIZWlnaHQgPiBjYW52YXNIZWlnaHQgPyBjYW52YXNIZWlnaHQgLSA0MCA6IGltYWdlSGVpZ2h0O1xyXG4gICAgICBjb25zdCB3aWR0aCA9IGhlaWdodCA9PT0gY2FudmFzSGVpZ2h0IC0gNDAgPyAoY2FudmFzSGVpZ2h0IC0gNDApICogYXNwZWN0UmF0aW8gOiBpbWFnZVdpZHRoO1xyXG5cclxuICAgICAgbGV0IHggPSBpbWFnZUluZm8ueCB8fCAwO1xyXG4gICAgICBsZXQgeSA9IGltYWdlSW5mby55IHx8IDA7XHJcblxyXG4gICAgICBpZiAoeCA8IDApIHggPSAwO1xyXG4gICAgICBpZiAoeSA8IDApIHkgPSAwO1xyXG5cclxuICAgICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoRWxlbWVudFR5cGUuSW1hZ2UsIHtcclxuICAgICAgICBzcmM6IGltYWdlSW5mby5pbWFnZSxcclxuICAgICAgICB3aWR0aCxcclxuICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgeCxcclxuICAgICAgICB5LFxyXG4gICAgICAgIHpJbmRleDogdGhpcy5lbGVtZW50c1NlcnZpY2UuZ2V0TmV4dFpJbmRleCgpLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuZWxlbWVudHNTZXJ2aWNlLmFkZEVsZW1lbnRzKFtlbGVtZW50XSk7XHJcblxyXG4gICAgICBpZiAoZWxlbWVudC5zZWxlY3RBZnRlckRyYXcpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0RWxlbWVudHMoW2VsZW1lbnQuaWRdKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5ldmVudEJ1c1NlcnZpY2UuZW1pdChXaGl0ZWJvYXJkRXZlbnQuSW1hZ2VBZGRlZCwgZWxlbWVudC5zcmMpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0ZW1wSW1nLm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBsb2FkIGltYWdlJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRlbXBJbWcuc3JjID0gaW1hZ2VJbmZvLmltYWdlIGFzIHN0cmluZztcclxuICB9XHJcblxyXG4gIGltcG9ydEltYWdlRmlsZShmaWxlOiBGaWxlLCB4PzogbnVtYmVyLCB5PzogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBpZiAoIWZpbGUudHlwZS5zdGFydHNXaXRoKCdpbWFnZS8nKSkge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ0ludmFsaWQgZmlsZSB0eXBlLiBPbmx5IGltYWdlcyBhcmUgc3VwcG9ydGVkLicpKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG4gICAgICByZWFkZXIub25sb2FkID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZXZlbnQudGFyZ2V0Py5yZXN1bHQ7XHJcbiAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgdGhpcy5hZGRJbWFnZSh7XHJcbiAgICAgICAgICAgIGltYWdlOiByZXN1bHQsXHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHksXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignRmFpbGVkIHRvIHJlYWQgZmlsZScpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZWFkZXIub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICByZWplY3QobmV3IEVycm9yKCdGYWlsZWQgdG8gcmVhZCBmaWxlJykpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGltcG9ydEltYWdlRnJvbVVybCh1cmw6IHN0cmluZywgeD86IG51bWJlciwgeT86IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xyXG4gICAgICBjb25zdCBibG9iID0gYXdhaXQgcmVzcG9uc2UuYmxvYigpO1xyXG5cclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuICAgICAgICByZWFkZXIub25sb2FkID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSBldmVudC50YXJnZXQ/LnJlc3VsdDtcclxuICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRJbWFnZSh7XHJcbiAgICAgICAgICAgICAgaW1hZ2U6IHJlc3VsdCxcclxuICAgICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdGYWlsZWQgdG8gcHJvY2VzcyBVUkwnKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdGYWlsZWQgdG8gcHJvY2VzcyBVUkwnKSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoYmxvYik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gbG9hZCBpbWFnZSBmcm9tIFVSTDogJHtlcnJvcn1gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIHNhdmUoZm9ybWF0OiBGb3JtYXRUeXBlID0gRm9ybWF0VHlwZS5CYXNlNjQsIG5hbWUgPSAnTmV3IGJvYXJkJyk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmNhbnZhc1NlcnZpY2UuZ2V0Q2FudmFzKCk7XHJcbiAgICBjb25zdCBzdmdFbGVtZW50ID0gY2FudmFzLmdldEVsZW1lbnRCeUlkKCdzdmdjb250ZW50JykgYXMgU1ZHU1ZHRWxlbWVudDtcclxuXHJcbiAgICBpZiAoIXN2Z0VsZW1lbnQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTVkcgY29udGVudCBub3QgZm91bmQnKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdmdDbG9uZSA9IHRoaXMucHJlcGFyZVN2Z0ZvckV4cG9ydChzdmdFbGVtZW50KTtcclxuICAgIGNvbnN0IHN2Z1N0cmluZyA9IG5ldyBYTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcoc3ZnQ2xvbmUpO1xyXG5cclxuICAgIGNvbnN0IHsgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCB9ID0gdGhpcy5jYW52YXNTZXJ2aWNlLmdldENvbmZpZygpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGltYWdlU3RyaW5nID0gYXdhaXQgc3ZnVG9CYXNlNjQoc3ZnU3RyaW5nLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0LCBmb3JtYXQpO1xyXG5cclxuICAgICAgc3dpdGNoIChmb3JtYXQpIHtcclxuICAgICAgICBjYXNlIEZvcm1hdFR5cGUuQmFzZTY0OlxyXG4gICAgICAgICAgdGhpcy5ldmVudEJ1c1NlcnZpY2UuZW1pdChXaGl0ZWJvYXJkRXZlbnQuU2F2ZSwgaW1hZ2VTdHJpbmcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgRm9ybWF0VHlwZS5Tdmc6IHtcclxuICAgICAgICAgIGNvbnN0IGltZ1NyYyA9ICdkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LCcgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzdmdTdHJpbmcpKSk7XHJcbiAgICAgICAgICB0aGlzLmRvd25sb2FkRmlsZShpbWdTcmMsIG5hbWUsICdzdmcnKTtcclxuICAgICAgICAgIHRoaXMuZXZlbnRCdXNTZXJ2aWNlLmVtaXQoV2hpdGVib2FyZEV2ZW50LlNhdmUsIGltZ1NyYyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICB0aGlzLmRvd25sb2FkRmlsZShpbWFnZVN0cmluZywgbmFtZSwgdGhpcy5nZXRGaWxlRXh0ZW5zaW9uKGZvcm1hdCkpO1xyXG4gICAgICAgICAgdGhpcy5ldmVudEJ1c1NlcnZpY2UuZW1pdChXaGl0ZWJvYXJkRXZlbnQuU2F2ZSwgaW1hZ2VTdHJpbmcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBpbWFnZVN0cmluZztcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzYXZlIHdoaXRlYm9hcmQ6JywgZXJyb3IpO1xyXG4gICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGV4cG9ydEFzUG5nKG5hbWUgPSAnd2hpdGVib2FyZCcpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIHRoaXMuc2F2ZShGb3JtYXRUeXBlLlBuZywgbmFtZSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBleHBvcnRBc0pwZWcobmFtZSA9ICd3aGl0ZWJvYXJkJyk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICByZXR1cm4gdGhpcy5zYXZlKEZvcm1hdFR5cGUuSnBlZywgbmFtZSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBleHBvcnRBc1N2ZyhuYW1lID0gJ3doaXRlYm9hcmQnKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIHJldHVybiB0aGlzLnNhdmUoRm9ybWF0VHlwZS5TdmcsIG5hbWUpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZXhwb3J0QXNCYXNlNjQoKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIHJldHVybiB0aGlzLnNhdmUoRm9ybWF0VHlwZS5CYXNlNjQpO1xyXG4gIH1cclxuXHJcbiAgZXhwb3J0RGF0YSgpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzU2VydmljZS5nZXRFbGVtZW50cygpO1xyXG4gICAgY29uc3QgY2FudmFzQ29uZmlnID0gdGhpcy5jYW52YXNTZXJ2aWNlLmdldENvbmZpZygpO1xyXG4gICAgY29uc3QgbGF5ZXJTdGF0ZSA9IHRoaXMubGF5ZXJNYW5hZ2VtZW50U2VydmljZS5leHBvcnRMYXllclN0YXRlKCk7XHJcbiAgICBjb25zdCBlZGl0b3JDb25maWcgPSB0aGlzLmNvbmZpZ1NlcnZpY2UuZ2V0RWRpdG9yQ29uZmlnKCk7XHJcblxyXG4gICAgY29uc3QgZXhwb3J0RGF0YSA9IHtcclxuICAgICAgdmVyc2lvbjogJzEuMCcsXHJcbiAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxyXG4gICAgICBlbGVtZW50czogZWxlbWVudHMsXHJcbiAgICAgIGxheWVyczogbGF5ZXJTdGF0ZSxcclxuICAgICAgY2FudmFzOiB7XHJcbiAgICAgICAgd2lkdGg6IGNhbnZhc0NvbmZpZy5jYW52YXNXaWR0aCxcclxuICAgICAgICBoZWlnaHQ6IGNhbnZhc0NvbmZpZy5jYW52YXNIZWlnaHQsXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjYW52YXNDb25maWcuYmFja2dyb3VuZENvbG9yLFxyXG4gICAgICAgIGZ1bGxTY3JlZW46IGNhbnZhc0NvbmZpZy5mdWxsU2NyZWVuLFxyXG4gICAgICAgIGNlbnRlcjogY2FudmFzQ29uZmlnLmNlbnRlcixcclxuICAgICAgfSxcclxuICAgICAgdmlld3BvcnQ6IHtcclxuICAgICAgICB6b29tOiBjYW52YXNDb25maWcuem9vbSxcclxuICAgICAgICB4OiBjYW52YXNDb25maWcueCxcclxuICAgICAgICB5OiBjYW52YXNDb25maWcueSxcclxuICAgICAgICBjYW52YXNYOiBjYW52YXNDb25maWcuY2FudmFzWCxcclxuICAgICAgICBjYW52YXNZOiBjYW52YXNDb25maWcuY2FudmFzWSxcclxuICAgICAgfSxcclxuICAgICAgZHJhd2luZzoge1xyXG4gICAgICAgIHN0cm9rZUNvbG9yOiBjYW52YXNDb25maWcuc3Ryb2tlQ29sb3IsXHJcbiAgICAgICAgc3Ryb2tlV2lkdGg6IGNhbnZhc0NvbmZpZy5zdHJva2VXaWR0aCxcclxuICAgICAgICBmaWxsOiBjYW52YXNDb25maWcuZmlsbCxcclxuICAgICAgICBsaW5lSm9pbjogY2FudmFzQ29uZmlnLmxpbmVKb2luLFxyXG4gICAgICAgIGxpbmVDYXA6IGNhbnZhc0NvbmZpZy5saW5lQ2FwLFxyXG4gICAgICAgIGRhc2hhcnJheTogY2FudmFzQ29uZmlnLmRhc2hhcnJheSxcclxuICAgICAgICBkYXNob2Zmc2V0OiBjYW52YXNDb25maWcuZGFzaG9mZnNldCxcclxuICAgICAgICBwZW5UeXBlOiBjYW52YXNDb25maWcucGVuVHlwZSxcclxuICAgICAgfSxcclxuICAgICAgZ3JpZDoge1xyXG4gICAgICAgIGVuYWJsZWQ6IGNhbnZhc0NvbmZpZy5lbmFibGVHcmlkLFxyXG4gICAgICAgIHNpemU6IGNhbnZhc0NvbmZpZy5ncmlkU2l6ZSxcclxuICAgICAgICBzbmFwVG9HcmlkOiBjYW52YXNDb25maWcuc25hcFRvR3JpZCxcclxuICAgICAgfSxcclxuICAgICAgdGV4dDoge1xyXG4gICAgICAgIGZvbnRGYW1pbHk6IGNhbnZhc0NvbmZpZy5mb250RmFtaWx5LFxyXG4gICAgICAgIGZvbnRTaXplOiBjYW52YXNDb25maWcuZm9udFNpemUsXHJcbiAgICAgIH0sXHJcbiAgICAgIGVkaXRvcjogZWRpdG9yQ29uZmlnLFxyXG4gICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgIGRyYXdpbmdFbmFibGVkOiBjYW52YXNDb25maWcuZHJhd2luZ0VuYWJsZWQsXHJcbiAgICAgICAga2V5Ym9hcmRTaG9ydGN1dHNFbmFibGVkOiBjYW52YXNDb25maWcua2V5Ym9hcmRTaG9ydGN1dHNFbmFibGVkLFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZXhwb3J0RGF0YSwgbnVsbCwgMik7XHJcbiAgfVxyXG5cclxuICBleHBvcnREYXRhQXNGaWxlKGZpbGVuYW1lID0gJ3doaXRlYm9hcmQtZXhwb3J0Jyk6IHZvaWQge1xyXG4gICAgY29uc3QganNvbkRhdGEgPSB0aGlzLmV4cG9ydERhdGEoKTtcclxuICAgIGNvbnN0IGRhdGFVcmwgPSAnZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgsJyArIGVuY29kZVVSSUNvbXBvbmVudChqc29uRGF0YSk7XHJcbiAgICB0aGlzLmRvd25sb2FkRmlsZShkYXRhVXJsLCBmaWxlbmFtZSwgJ2pzb24nKTtcclxuICAgIHRoaXMuZXZlbnRCdXNTZXJ2aWNlLmVtaXQoV2hpdGVib2FyZEV2ZW50LlNhdmUsIGpzb25EYXRhKTtcclxuICB9XHJcblxyXG4gIGltcG9ydERhdGEoanNvbkRhdGE6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UoanNvbkRhdGEpO1xyXG5cclxuICAgICAgaWYgKCFkYXRhLmVsZW1lbnRzIHx8ICFBcnJheS5pc0FycmF5KGRhdGEuZWxlbWVudHMpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGRhdGEgZm9ybWF0OiBlbGVtZW50cyBhcnJheSBub3QgZm91bmQnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5lbGVtZW50c1NlcnZpY2UuY2xlYXIoKTtcclxuXHJcbiAgICAgIGlmIChkYXRhLmxheWVycykge1xyXG4gICAgICAgIHRoaXMubGF5ZXJNYW5hZ2VtZW50U2VydmljZS5pbXBvcnRMYXllclN0YXRlKGRhdGEubGF5ZXJzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5lbGVtZW50c1NlcnZpY2Uuc2V0RWxlbWVudHMoZGF0YS5lbGVtZW50cyk7XHJcblxyXG4gICAgICBpZiAoZGF0YS5jYW52YXMpIHtcclxuICAgICAgICBjb25zdCB7IGNhbnZhcyB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKGNhbnZhcy53aWR0aCAmJiBjYW52YXMuaGVpZ2h0KSB7XHJcbiAgICAgICAgICB0aGlzLmNhbnZhc1NlcnZpY2Uuc2V0Q2FudmFzRGltZW5zaW9ucyhjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNhbnZhcy5iYWNrZ3JvdW5kQ29sb3IgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgdGhpcy5jb25maWdTZXJ2aWNlLnVwZGF0ZUNvbmZpZyh7IGJhY2tncm91bmRDb2xvcjogY2FudmFzLmJhY2tncm91bmRDb2xvciB9LCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2FudmFzLmZ1bGxTY3JlZW4gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgdGhpcy5jb25maWdTZXJ2aWNlLnVwZGF0ZUNvbmZpZyh7IGZ1bGxTY3JlZW46IGNhbnZhcy5mdWxsU2NyZWVuIH0sIGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjYW52YXMuY2VudGVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHRoaXMuY29uZmlnU2VydmljZS51cGRhdGVDb25maWcoeyBjZW50ZXI6IGNhbnZhcy5jZW50ZXIgfSwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGRhdGEudmlld3BvcnQpIHtcclxuICAgICAgICBjb25zdCB7IHZpZXdwb3J0IH0gPSBkYXRhO1xyXG5cclxuICAgICAgICBpZiAodmlld3BvcnQuem9vbSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb21TZXJ2aWNlLnpvb20odmlld3BvcnQuem9vbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmlld3BvcnQueCAhPT0gdW5kZWZpbmVkICYmIHZpZXdwb3J0LnkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgdGhpcy5wYW5TZXJ2aWNlLnBhblRvKHZpZXdwb3J0LngsIHZpZXdwb3J0LnkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZpZXdwb3J0LmNhbnZhc1ggIT09IHVuZGVmaW5lZCAmJiB2aWV3cG9ydC5jYW52YXNZICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHRoaXMuY29uZmlnU2VydmljZS51cGRhdGVDb25maWcoXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBjYW52YXNYOiB2aWV3cG9ydC5jYW52YXNYLFxyXG4gICAgICAgICAgICAgIGNhbnZhc1k6IHZpZXdwb3J0LmNhbnZhc1ksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZhbHNlXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGRhdGEuZHJhd2luZykge1xyXG4gICAgICAgIGNvbnN0IHsgZHJhd2luZyB9ID0gZGF0YTtcclxuICAgICAgICBjb25zdCBkcmF3aW5nQ29uZmlnOiBQYXJ0aWFsPFdoaXRlYm9hcmRDb25maWc+ID0ge307XHJcblxyXG4gICAgICAgIGlmIChkcmF3aW5nLnN0cm9rZUNvbG9yICE9PSB1bmRlZmluZWQpIGRyYXdpbmdDb25maWcuc3Ryb2tlQ29sb3IgPSBkcmF3aW5nLnN0cm9rZUNvbG9yO1xyXG4gICAgICAgIGlmIChkcmF3aW5nLnN0cm9rZVdpZHRoICE9PSB1bmRlZmluZWQpIGRyYXdpbmdDb25maWcuc3Ryb2tlV2lkdGggPSBkcmF3aW5nLnN0cm9rZVdpZHRoO1xyXG4gICAgICAgIGlmIChkcmF3aW5nLmZpbGwgIT09IHVuZGVmaW5lZCkgZHJhd2luZ0NvbmZpZy5maWxsID0gZHJhd2luZy5maWxsO1xyXG4gICAgICAgIGlmIChkcmF3aW5nLmxpbmVKb2luICE9PSB1bmRlZmluZWQpIGRyYXdpbmdDb25maWcubGluZUpvaW4gPSBkcmF3aW5nLmxpbmVKb2luO1xyXG4gICAgICAgIGlmIChkcmF3aW5nLmxpbmVDYXAgIT09IHVuZGVmaW5lZCkgZHJhd2luZ0NvbmZpZy5saW5lQ2FwID0gZHJhd2luZy5saW5lQ2FwO1xyXG4gICAgICAgIGlmIChkcmF3aW5nLmRhc2hhcnJheSAhPT0gdW5kZWZpbmVkKSBkcmF3aW5nQ29uZmlnLmRhc2hhcnJheSA9IGRyYXdpbmcuZGFzaGFycmF5O1xyXG4gICAgICAgIGlmIChkcmF3aW5nLmRhc2hvZmZzZXQgIT09IHVuZGVmaW5lZCkgZHJhd2luZ0NvbmZpZy5kYXNob2Zmc2V0ID0gZHJhd2luZy5kYXNob2Zmc2V0O1xyXG4gICAgICAgIGlmIChkcmF3aW5nLnBlblR5cGUgIT09IHVuZGVmaW5lZCkgZHJhd2luZ0NvbmZpZy5wZW5UeXBlID0gZHJhd2luZy5wZW5UeXBlO1xyXG5cclxuICAgICAgICB0aGlzLmNvbmZpZ1NlcnZpY2UudXBkYXRlQ29uZmlnKGRyYXdpbmdDb25maWcsIGZhbHNlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGRhdGEuZ3JpZCkge1xyXG4gICAgICAgIGNvbnN0IHsgZ3JpZCB9ID0gZGF0YTtcclxuICAgICAgICBjb25zdCBncmlkQ29uZmlnOiBQYXJ0aWFsPFdoaXRlYm9hcmRDb25maWc+ID0ge307XHJcblxyXG4gICAgICAgIGlmIChncmlkLmVuYWJsZWQgIT09IHVuZGVmaW5lZCkgZ3JpZENvbmZpZy5lbmFibGVHcmlkID0gZ3JpZC5lbmFibGVkO1xyXG4gICAgICAgIGlmIChncmlkLnNpemUgIT09IHVuZGVmaW5lZCkgZ3JpZENvbmZpZy5ncmlkU2l6ZSA9IGdyaWQuc2l6ZTtcclxuICAgICAgICBpZiAoZ3JpZC5zbmFwVG9HcmlkICE9PSB1bmRlZmluZWQpIGdyaWRDb25maWcuc25hcFRvR3JpZCA9IGdyaWQuc25hcFRvR3JpZDtcclxuXHJcbiAgICAgICAgdGhpcy5jb25maWdTZXJ2aWNlLnVwZGF0ZUNvbmZpZyhncmlkQ29uZmlnLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChkYXRhLnRleHQpIHtcclxuICAgICAgICBjb25zdCB7IHRleHQgfSA9IGRhdGE7XHJcbiAgICAgICAgY29uc3QgdGV4dENvbmZpZzogUGFydGlhbDxXaGl0ZWJvYXJkQ29uZmlnPiA9IHt9O1xyXG5cclxuICAgICAgICBpZiAodGV4dC5mb250RmFtaWx5ICE9PSB1bmRlZmluZWQpIHRleHRDb25maWcuZm9udEZhbWlseSA9IHRleHQuZm9udEZhbWlseTtcclxuICAgICAgICBpZiAodGV4dC5mb250U2l6ZSAhPT0gdW5kZWZpbmVkKSB0ZXh0Q29uZmlnLmZvbnRTaXplID0gdGV4dC5mb250U2l6ZTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25maWdTZXJ2aWNlLnVwZGF0ZUNvbmZpZyh0ZXh0Q29uZmlnLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChkYXRhLmVkaXRvcikge1xyXG4gICAgICAgIGNvbnN0IGVkaXRvcktleXMgPSBPYmplY3Qua2V5cyhkYXRhLmVkaXRvcikgYXMgQXJyYXk8a2V5b2YgRWRpdG9yQ29uZmlnPjtcclxuICAgICAgICBlZGl0b3JLZXlzLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jb25maWdTZXJ2aWNlLnVwZGF0ZUVkaXRvckNvbmZpZ1ZhbHVlKGtleSwgZGF0YS5lZGl0b3Jba2V5XSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChkYXRhLnNldHRpbmdzKSB7XHJcbiAgICAgICAgY29uc3QgeyBzZXR0aW5ncyB9ID0gZGF0YTtcclxuICAgICAgICBjb25zdCBzZXR0aW5nc0NvbmZpZzogUGFydGlhbDxXaGl0ZWJvYXJkQ29uZmlnPiA9IHt9O1xyXG5cclxuICAgICAgICBpZiAoc2V0dGluZ3MuZHJhd2luZ0VuYWJsZWQgIT09IHVuZGVmaW5lZCkgc2V0dGluZ3NDb25maWcuZHJhd2luZ0VuYWJsZWQgPSBzZXR0aW5ncy5kcmF3aW5nRW5hYmxlZDtcclxuICAgICAgICBpZiAoc2V0dGluZ3Mua2V5Ym9hcmRTaG9ydGN1dHNFbmFibGVkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHNldHRpbmdzQ29uZmlnLmtleWJvYXJkU2hvcnRjdXRzRW5hYmxlZCA9IHNldHRpbmdzLmtleWJvYXJkU2hvcnRjdXRzRW5hYmxlZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29uZmlnU2VydmljZS51cGRhdGVDb25maWcoc2V0dGluZ3NDb25maWcsIGZhbHNlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jb25maWdTZXJ2aWNlLnVwZGF0ZUNvbmZpZyh7fSwgdHJ1ZSk7XHJcbiAgICAgIHRoaXMuZXZlbnRCdXNTZXJ2aWNlLmVtaXQoV2hpdGVib2FyZEV2ZW50LkVsZW1lbnRzQWRkZWQsIGRhdGEuZWxlbWVudHMpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGltcG9ydCBkYXRhOicsIGVycm9yKTtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gaW1wb3J0IGRhdGE6ICR7ZXJyb3J9YCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbXBvcnREYXRhRnJvbUZpbGUoZmlsZTogRmlsZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgaWYgKCFmaWxlLnR5cGUuaW5jbHVkZXMoJ2pzb24nKSkge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ0ludmFsaWQgZmlsZSB0eXBlLiBPbmx5IEpTT04gZmlsZXMgYXJlIHN1cHBvcnRlZC4nKSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuICAgICAgcmVhZGVyLm9ubG9hZCA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGV2ZW50LnRhcmdldD8ucmVzdWx0O1xyXG4gICAgICAgIGlmIChyZXN1bHQgJiYgdHlwZW9mIHJlc3VsdCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1wb3J0RGF0YShyZXN1bHQpO1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdGYWlsZWQgdG8gcmVhZCBmaWxlJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ0ZhaWxlZCB0byByZWFkIGZpbGUnKSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkb3dubG9hZEZpbGUoZGF0YVVybDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGV4dGVuc2lvbjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCBmaWxlTmFtZSA9IGAke25hbWV9LiR7ZXh0ZW5zaW9ufWA7XHJcbiAgICBkb3dubG9hZEZpbGUoZGF0YVVybCwgZmlsZU5hbWUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRGaWxlRXh0ZW5zaW9uKGZvcm1hdDogRm9ybWF0VHlwZSk6IHN0cmluZyB7XHJcbiAgICBzd2l0Y2ggKGZvcm1hdCkge1xyXG4gICAgICBjYXNlIEZvcm1hdFR5cGUuUG5nOlxyXG4gICAgICAgIHJldHVybiAncG5nJztcclxuICAgICAgY2FzZSBGb3JtYXRUeXBlLkpwZWc6XHJcbiAgICAgICAgcmV0dXJuICdqcGcnO1xyXG4gICAgICBjYXNlIEZvcm1hdFR5cGUuU3ZnOlxyXG4gICAgICAgIHJldHVybiAnc3ZnJztcclxuICAgICAgY2FzZSBGb3JtYXRUeXBlLkJhc2U2NDpcclxuICAgICAgICByZXR1cm4gJ3R4dCc7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuICdwbmcnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwcmVwYXJlU3ZnRm9yRXhwb3J0KHN2Z0VsZW1lbnQ6IFNWR1NWR0VsZW1lbnQpOiBTVkdTVkdFbGVtZW50IHtcclxuICAgIGNvbnN0IHN2Z0Nsb25lID0gc3ZnRWxlbWVudC5jbG9uZU5vZGUodHJ1ZSkgYXMgU1ZHU1ZHRWxlbWVudDtcclxuXHJcbiAgICBjb25zdCBzZWxlY3RvclBhcmVudEdyb3VwID0gc3ZnQ2xvbmUucXVlcnlTZWxlY3RvcignI3NlbGVjdG9yUGFyZW50R3JvdXAnKTtcclxuICAgIGlmIChzZWxlY3RvclBhcmVudEdyb3VwKSB7XHJcbiAgICAgIHNlbGVjdG9yUGFyZW50R3JvdXAucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY29udGVudEJhY2tncm91bmQgPSBzdmdDbG9uZS5xdWVyeVNlbGVjdG9yKCcjY29udGVudEJhY2tncm91bmQnKTtcclxuICAgIGlmIChjb250ZW50QmFja2dyb3VuZCkge1xyXG4gICAgICBjb250ZW50QmFja2dyb3VuZC5yZW1vdmVBdHRyaWJ1dGUoJ29wYWNpdHknKTtcclxuICAgIH1cclxuXHJcbiAgICBzdmdDbG9uZS5zZXRBdHRyaWJ1dGUoJ3gnLCAnMCcpO1xyXG4gICAgc3ZnQ2xvbmUuc2V0QXR0cmlidXRlKCd5JywgJzAnKTtcclxuXHJcbiAgICByZXR1cm4gc3ZnQ2xvbmU7XHJcbiAgfVxyXG5cclxuICBhc3luYyBpbXBvcnRNdWx0aXBsZUltYWdlcyhmaWxlczogRmlsZUxpc3QsIHNwYWNpbmcgPSA1MCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgY29uc3QgcHJvbWlzZXM6IFByb21pc2U8dm9pZD5bXSA9IFtdO1xyXG4gICAgbGV0IGN1cnJlbnRYID0gMDtcclxuICAgIGxldCBjdXJyZW50WSA9IDA7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBmaWxlID0gZmlsZXNbaV07XHJcblxyXG4gICAgICBwcm9taXNlcy5wdXNoKHRoaXMuaW1wb3J0SW1hZ2VGaWxlKGZpbGUsIGN1cnJlbnRYLCBjdXJyZW50WSkpO1xyXG5cclxuICAgICAgY3VycmVudFggKz0gMjAwICsgc3BhY2luZztcclxuICAgICAgaWYgKGN1cnJlbnRYID4gODAwKSB7XHJcbiAgICAgICAgY3VycmVudFggPSAwO1xyXG4gICAgICAgIGN1cnJlbnRZICs9IDIwMCArIHNwYWNpbmc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgcHJvY2Vzc0ltYWdlKGltYWdlRGF0YTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBpbWFnZURhdGE7XHJcbiAgfVxyXG59XHJcbiJdfQ==