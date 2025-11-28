import { RendererFactory2, Signal } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { WhiteboardConfig } from '../types';
import * as i0 from "@angular/core";
export declare class CanvasService {
    private configService;
    private eventBusService;
    private renderer;
    private svgContainer;
    private transform;
    constructor(configService: ConfigService, eventBusService: EventBusService, rendererFactory: RendererFactory2);
    initializeCanvas(svgContainer: SVGSVGElement): void;
    getCanvas(): SVGSVGElement;
    isCanvasInitialized(): boolean;
    getConfig(): WhiteboardConfig;
    setCanvasDimensions(width: number, height: number): void;
    setCanvasPosition(x: number, y: number): void;
    getCanvasDimensions(): {
        width: number;
        height: number;
    };
    getCanvasPosition(): {
        x: number;
        y: number;
    };
    getContainerDimensions(): {
        width: number;
        height: number;
    };
    fullScreen(): void;
    exitFullScreen(defaultWidth?: number, defaultHeight?: number): void;
    centerCanvas(): void;
    resetCanvas(): void;
    toggleGrid(): void;
    setGridVisible(visible: boolean): void;
    setGridSize(size: number): void;
    toggleSnapToGrid(): void;
    getTransform(): Signal<string>;
    getTransformString(): string;
    screenToCanvas(screenX: number, screenY: number): {
        x: number;
        y: number;
    };
    canvasToScreen(canvasX: number, canvasY: number): {
        x: number;
        y: number;
    };
    getVisibleBounds(): {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    isPointVisible(x: number, y: number): boolean;
    isRectVisible(x: number, y: number, width: number, height: number): boolean;
    getCanvasDimensionsProvider(): () => {
        width: number;
        height: number;
    };
    getContainerDimensionsProvider(): () => {
        width: number;
        height: number;
    };
    protected transformCoordinates(x: number, y: number): {
        x: number;
        y: number;
    };
    protected validateZoom(zoom: number): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<CanvasService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CanvasService>;
}
