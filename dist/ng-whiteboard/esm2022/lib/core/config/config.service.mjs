import { Injectable, signal } from '@angular/core';
import { LineCap, LineJoin, WhiteboardEvent, PenType } from '../types';
import { EventBusService } from '../event-bus/event-bus.service';
import * as i0 from "@angular/core";
import * as i1 from "../event-bus/event-bus.service";
export class ConfigService {
    eventBusService;
    config = signal({
        drawingEnabled: true,
        canvasWidth: 800,
        canvasHeight: 600,
        fullScreen: true,
        center: true,
        canvasX: 0,
        canvasY: 0,
        strokeColor: '#333333',
        strokeWidth: 2,
        backgroundColor: '#F8F9FA',
        lineJoin: LineJoin.Round,
        lineCap: LineCap.Round,
        fill: 'transparent',
        zoom: 1,
        x: 0,
        y: 0,
        fontFamily: 'sans-serif',
        fontSize: 24,
        dasharray: '',
        dashoffset: 0,
        enableGrid: false,
        gridSize: 10,
        snapToGrid: true,
        keyboardShortcutsEnabled: true,
        penType: PenType.Pen,
    });
    editorConfig = signal({
        title: 'Whiteboard',
        enableEditor: true,
        // Core panels / features
        showTitle: true,
        showZoom: true,
        showLayers: true,
        showTools: true,
        showGrid: true,
        showBackground: true,
        showStroke: true,
        showFill: true,
        showOpacity: true,
        showFont: true,
        showDash: true,
        showEraser: true,
        showUndo: true,
        showRedo: true,
        showClear: true,
        showSave: true,
        showLoad: false,
        showExport: true,
        showImport: false,
        showShare: false,
        showSettings: false,
        showHelp: false,
        showAbout: false,
        showFeedback: false,
        showSupport: false,
        showContact: false,
        showPrivacy: false,
        showTerms: false,
        showLicense: false,
        showAttribution: false,
        showCredits: false,
        showChangelog: false,
        showReleaseNotes: false,
        showRoadmap: false,
        showBlog: false,
        showForum: false,
        showCommunity: false,
        showEvents: false,
        showWebinars: false,
        showWorkshops: false,
        showTutorials: false,
        showDocumentation: false,
        showAPI: false,
        showSDK: false,
        showCLI: false,
        showPlugins: false,
        showExtensions: false,
        showIntegrations: false,
        showAddons: false,
        showThemes: false,
        showTemplates: false,
        showSnippets: false,
        showExamples: true,
        showDemos: true,
        showSamples: false,
        showShowcases: false,
        showPortfolios: false,
        showCaseStudies: false,
        showSuccessStories: false,
        showTestimonials: false,
        showReviews: false,
        showRatings: false,
        showComparisons: false,
        showAlternatives: false,
        showInsights: false,
    });
    constructor(eventBusService) {
        this.eventBusService = eventBusService;
    }
    getConfig() {
        return this.config();
    }
    getConfigSignal() {
        return this.config.asReadonly();
    }
    getEditorConfig() {
        return this.editorConfig();
    }
    getEditorConfigSignal() {
        return this.editorConfig.asReadonly();
    }
    updateConfig(partialConfig, emitEvent = true) {
        this.config.update((current) => ({ ...current, ...partialConfig }));
        const hasZoomRelatedChanges = 'zoom' in partialConfig;
        if (hasZoomRelatedChanges) {
            const config = this.config();
            this.eventBusService.emit(WhiteboardEvent.ZoomChange, {
                zoom: config.zoom,
            });
        }
        if (emitEvent) {
            this.eventBusService.emit(WhiteboardEvent.ConfigChange, this.config());
        }
    }
    isConfigDifferent(key, value) {
        return this.config()[key] !== value;
    }
    updateConfigValue(key, value) {
        this.config.update((current) => ({ ...current, [key]: value }));
        this.eventBusService.emit(WhiteboardEvent.ConfigChange, this.config());
    }
    updateEditorConfigValue(key, value) {
        this.editorConfig.update((current) => ({ ...current, [key]: value }));
    }
    checkAndUpdateConfig(key, value) {
        if (this.isConfigDifferent(key, value)) {
            this.updateConfigValue(key, value);
        }
    }
    getConfigValue(key) {
        return this.config()[key];
    }
    setConfigValue(key, value) {
        this.config.update((current) => ({ ...current, [key]: value }));
        this.eventBusService.emit(WhiteboardEvent.ConfigChange, this.config());
    }
    getConfigKeys() {
        return Object.keys(this.config());
    }
    getConfigValues() {
        return Object.values(this.config());
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ConfigService, deps: [{ token: i1.EventBusService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ConfigService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ConfigService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.EventBusService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy13aGl0ZWJvYXJkL3NyYy9saWIvY29yZS9jb25maWcvY29uZmlnLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQW9CLGVBQWUsRUFBZ0IsT0FBTyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3ZHLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQzs7O0FBR2pFLE1BQU0sT0FBTyxhQUFhO0lBb0dKO0lBbkdaLE1BQU0sR0FBRyxNQUFNLENBQW1CO1FBQ3hDLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLFdBQVcsRUFBRSxHQUFHO1FBQ2hCLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLE1BQU0sRUFBRSxJQUFJO1FBQ1osT0FBTyxFQUFFLENBQUM7UUFDVixPQUFPLEVBQUUsQ0FBQztRQUNWLFdBQVcsRUFBRSxTQUFTO1FBQ3RCLFdBQVcsRUFBRSxDQUFDO1FBQ2QsZUFBZSxFQUFFLFNBQVM7UUFDMUIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxLQUFLO1FBQ3hCLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSztRQUN0QixJQUFJLEVBQUUsYUFBYTtRQUNuQixJQUFJLEVBQUUsQ0FBQztRQUNQLENBQUMsRUFBRSxDQUFDO1FBQ0osQ0FBQyxFQUFFLENBQUM7UUFDSixVQUFVLEVBQUUsWUFBWTtRQUN4QixRQUFRLEVBQUUsRUFBRTtRQUNaLFNBQVMsRUFBRSxFQUFFO1FBQ2IsVUFBVSxFQUFFLENBQUM7UUFDYixVQUFVLEVBQUUsS0FBSztRQUNqQixRQUFRLEVBQUUsRUFBRTtRQUNaLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLHdCQUF3QixF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O2tCQUR6QixVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIHNpZ25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBMaW5lQ2FwLCBMaW5lSm9pbiwgV2hpdGVib2FyZENvbmZpZywgV2hpdGVib2FyZEV2ZW50LCBFZGl0b3JDb25maWcsIFBlblR5cGUgfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCB7IEV2ZW50QnVzU2VydmljZSB9IGZyb20gJy4uL2V2ZW50LWJ1cy9ldmVudC1idXMuc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgQ29uZmlnU2VydmljZSB7XHJcbiAgcHJpdmF0ZSBjb25maWcgPSBzaWduYWw8V2hpdGVib2FyZENvbmZpZz4oe1xyXG4gICAgZHJhd2luZ0VuYWJsZWQ6IHRydWUsXHJcbiAgICBjYW52YXNXaWR0aDogODAwLFxyXG4gICAgY2FudmFzSGVpZ2h0OiA2MDAsXHJcbiAgICBmdWxsU2NyZWVuOiB0cnVlLFxyXG4gICAgY2VudGVyOiB0cnVlLFxyXG4gICAgY2FudmFzWDogMCxcclxuICAgIGNhbnZhc1k6IDAsXHJcbiAgICBzdHJva2VDb2xvcjogJyMzMzMzMzMnLFxyXG4gICAgc3Ryb2tlV2lkdGg6IDIsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjRjhGOUZBJyxcclxuICAgIGxpbmVKb2luOiBMaW5lSm9pbi5Sb3VuZCxcclxuICAgIGxpbmVDYXA6IExpbmVDYXAuUm91bmQsXHJcbiAgICBmaWxsOiAndHJhbnNwYXJlbnQnLFxyXG4gICAgem9vbTogMSxcclxuICAgIHg6IDAsXHJcbiAgICB5OiAwLFxyXG4gICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxyXG4gICAgZm9udFNpemU6IDI0LFxyXG4gICAgZGFzaGFycmF5OiAnJyxcclxuICAgIGRhc2hvZmZzZXQ6IDAsXHJcbiAgICBlbmFibGVHcmlkOiBmYWxzZSxcclxuICAgIGdyaWRTaXplOiAxMCxcclxuICAgIHNuYXBUb0dyaWQ6IHRydWUsXHJcbiAgICBrZXlib2FyZFNob3J0Y3V0c0VuYWJsZWQ6IHRydWUsXHJcbiAgICBwZW5UeXBlOiBQZW5UeXBlLlBlbixcclxuICB9KTtcclxuXHJcbiAgcHJpdmF0ZSBlZGl0b3JDb25maWcgPSBzaWduYWw8RWRpdG9yQ29uZmlnPih7XHJcbiAgICB0aXRsZTogJ1doaXRlYm9hcmQnLFxyXG4gICAgZW5hYmxlRWRpdG9yOiB0cnVlLFxyXG4gICAgLy8gQ29yZSBwYW5lbHMgLyBmZWF0dXJlc1xyXG4gICAgc2hvd1RpdGxlOiB0cnVlLFxyXG4gICAgc2hvd1pvb206IHRydWUsXHJcbiAgICBzaG93TGF5ZXJzOiB0cnVlLFxyXG4gICAgc2hvd1Rvb2xzOiB0cnVlLFxyXG4gICAgc2hvd0dyaWQ6IHRydWUsXHJcbiAgICBzaG93QmFja2dyb3VuZDogdHJ1ZSxcclxuICAgIHNob3dTdHJva2U6IHRydWUsXHJcbiAgICBzaG93RmlsbDogdHJ1ZSxcclxuICAgIHNob3dPcGFjaXR5OiB0cnVlLFxyXG4gICAgc2hvd0ZvbnQ6IHRydWUsXHJcbiAgICBzaG93RGFzaDogdHJ1ZSxcclxuICAgIHNob3dFcmFzZXI6IHRydWUsXHJcbiAgICBzaG93VW5kbzogdHJ1ZSxcclxuICAgIHNob3dSZWRvOiB0cnVlLFxyXG4gICAgc2hvd0NsZWFyOiB0cnVlLFxyXG4gICAgc2hvd1NhdmU6IHRydWUsXHJcbiAgICBzaG93TG9hZDogZmFsc2UsXHJcbiAgICBzaG93RXhwb3J0OiB0cnVlLFxyXG4gICAgc2hvd0ltcG9ydDogZmFsc2UsXHJcbiAgICBzaG93U2hhcmU6IGZhbHNlLFxyXG4gICAgc2hvd1NldHRpbmdzOiBmYWxzZSxcclxuICAgIHNob3dIZWxwOiBmYWxzZSxcclxuICAgIHNob3dBYm91dDogZmFsc2UsXHJcbiAgICBzaG93RmVlZGJhY2s6IGZhbHNlLFxyXG4gICAgc2hvd1N1cHBvcnQ6IGZhbHNlLFxyXG4gICAgc2hvd0NvbnRhY3Q6IGZhbHNlLFxyXG4gICAgc2hvd1ByaXZhY3k6IGZhbHNlLFxyXG4gICAgc2hvd1Rlcm1zOiBmYWxzZSxcclxuICAgIHNob3dMaWNlbnNlOiBmYWxzZSxcclxuICAgIHNob3dBdHRyaWJ1dGlvbjogZmFsc2UsXHJcbiAgICBzaG93Q3JlZGl0czogZmFsc2UsXHJcbiAgICBzaG93Q2hhbmdlbG9nOiBmYWxzZSxcclxuICAgIHNob3dSZWxlYXNlTm90ZXM6IGZhbHNlLFxyXG4gICAgc2hvd1JvYWRtYXA6IGZhbHNlLFxyXG4gICAgc2hvd0Jsb2c6IGZhbHNlLFxyXG4gICAgc2hvd0ZvcnVtOiBmYWxzZSxcclxuICAgIHNob3dDb21tdW5pdHk6IGZhbHNlLFxyXG4gICAgc2hvd0V2ZW50czogZmFsc2UsXHJcbiAgICBzaG93V2ViaW5hcnM6IGZhbHNlLFxyXG4gICAgc2hvd1dvcmtzaG9wczogZmFsc2UsXHJcbiAgICBzaG93VHV0b3JpYWxzOiBmYWxzZSxcclxuICAgIHNob3dEb2N1bWVudGF0aW9uOiBmYWxzZSxcclxuICAgIHNob3dBUEk6IGZhbHNlLFxyXG4gICAgc2hvd1NESzogZmFsc2UsXHJcbiAgICBzaG93Q0xJOiBmYWxzZSxcclxuICAgIHNob3dQbHVnaW5zOiBmYWxzZSxcclxuICAgIHNob3dFeHRlbnNpb25zOiBmYWxzZSxcclxuICAgIHNob3dJbnRlZ3JhdGlvbnM6IGZhbHNlLFxyXG4gICAgc2hvd0FkZG9uczogZmFsc2UsXHJcbiAgICBzaG93VGhlbWVzOiBmYWxzZSxcclxuICAgIHNob3dUZW1wbGF0ZXM6IGZhbHNlLFxyXG4gICAgc2hvd1NuaXBwZXRzOiBmYWxzZSxcclxuICAgIHNob3dFeGFtcGxlczogdHJ1ZSxcclxuICAgIHNob3dEZW1vczogdHJ1ZSxcclxuICAgIHNob3dTYW1wbGVzOiBmYWxzZSxcclxuICAgIHNob3dTaG93Y2FzZXM6IGZhbHNlLFxyXG4gICAgc2hvd1BvcnRmb2xpb3M6IGZhbHNlLFxyXG4gICAgc2hvd0Nhc2VTdHVkaWVzOiBmYWxzZSxcclxuICAgIHNob3dTdWNjZXNzU3RvcmllczogZmFsc2UsXHJcbiAgICBzaG93VGVzdGltb25pYWxzOiBmYWxzZSxcclxuICAgIHNob3dSZXZpZXdzOiBmYWxzZSxcclxuICAgIHNob3dSYXRpbmdzOiBmYWxzZSxcclxuICAgIHNob3dDb21wYXJpc29uczogZmFsc2UsXHJcbiAgICBzaG93QWx0ZXJuYXRpdmVzOiBmYWxzZSxcclxuICAgIHNob3dJbnNpZ2h0czogZmFsc2UsXHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZXZlbnRCdXNTZXJ2aWNlOiBFdmVudEJ1c1NlcnZpY2UpIHt9XHJcblxyXG4gIGdldENvbmZpZygpOiBSZWFkb25seTxXaGl0ZWJvYXJkQ29uZmlnPiB7XHJcbiAgICByZXR1cm4gdGhpcy5jb25maWcoKTtcclxuICB9XHJcblxyXG4gIGdldENvbmZpZ1NpZ25hbCgpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbmZpZy5hc1JlYWRvbmx5KCk7XHJcbiAgfVxyXG5cclxuICBnZXRFZGl0b3JDb25maWcoKTogUmVhZG9ubHk8RWRpdG9yQ29uZmlnPiB7XHJcbiAgICByZXR1cm4gdGhpcy5lZGl0b3JDb25maWcoKTtcclxuICB9XHJcblxyXG4gIGdldEVkaXRvckNvbmZpZ1NpZ25hbCgpIHtcclxuICAgIHJldHVybiB0aGlzLmVkaXRvckNvbmZpZy5hc1JlYWRvbmx5KCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVDb25maWcocGFydGlhbENvbmZpZzogUGFydGlhbDxXaGl0ZWJvYXJkQ29uZmlnPiwgZW1pdEV2ZW50ID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgdGhpcy5jb25maWcudXBkYXRlKChjdXJyZW50KSA9PiAoeyAuLi5jdXJyZW50LCAuLi5wYXJ0aWFsQ29uZmlnIH0pKTtcclxuXHJcbiAgICBjb25zdCBoYXNab29tUmVsYXRlZENoYW5nZXMgPSAnem9vbScgaW4gcGFydGlhbENvbmZpZztcclxuXHJcbiAgICBpZiAoaGFzWm9vbVJlbGF0ZWRDaGFuZ2VzKSB7XHJcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuY29uZmlnKCk7XHJcbiAgICAgIHRoaXMuZXZlbnRCdXNTZXJ2aWNlLmVtaXQoV2hpdGVib2FyZEV2ZW50Llpvb21DaGFuZ2UsIHtcclxuICAgICAgICB6b29tOiBjb25maWcuem9vbSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZW1pdEV2ZW50KSB7XHJcbiAgICAgIHRoaXMuZXZlbnRCdXNTZXJ2aWNlLmVtaXQoV2hpdGVib2FyZEV2ZW50LkNvbmZpZ0NoYW5nZSwgdGhpcy5jb25maWcoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpc0NvbmZpZ0RpZmZlcmVudChrZXk6IGtleW9mIFdoaXRlYm9hcmRDb25maWcsIHZhbHVlOiBXaGl0ZWJvYXJkQ29uZmlnW2tleW9mIFdoaXRlYm9hcmRDb25maWddKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5jb25maWcoKVtrZXldICE9PSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUNvbmZpZ1ZhbHVlKGtleToga2V5b2YgV2hpdGVib2FyZENvbmZpZywgdmFsdWU6IFdoaXRlYm9hcmRDb25maWdba2V5b2YgV2hpdGVib2FyZENvbmZpZ10pOiB2b2lkIHtcclxuICAgIHRoaXMuY29uZmlnLnVwZGF0ZSgoY3VycmVudCkgPT4gKHsgLi4uY3VycmVudCwgW2tleV06IHZhbHVlIH0pKTtcclxuICAgIHRoaXMuZXZlbnRCdXNTZXJ2aWNlLmVtaXQoV2hpdGVib2FyZEV2ZW50LkNvbmZpZ0NoYW5nZSwgdGhpcy5jb25maWcoKSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVFZGl0b3JDb25maWdWYWx1ZShrZXk6IGtleW9mIEVkaXRvckNvbmZpZywgdmFsdWU6IEVkaXRvckNvbmZpZ1trZXlvZiBFZGl0b3JDb25maWddKTogdm9pZCB7XHJcbiAgICB0aGlzLmVkaXRvckNvbmZpZy51cGRhdGUoKGN1cnJlbnQpID0+ICh7IC4uLmN1cnJlbnQsIFtrZXldOiB2YWx1ZSB9KSk7XHJcbiAgfVxyXG5cclxuICBjaGVja0FuZFVwZGF0ZUNvbmZpZyhrZXk6IGtleW9mIFdoaXRlYm9hcmRDb25maWcsIHZhbHVlOiBXaGl0ZWJvYXJkQ29uZmlnW2tleW9mIFdoaXRlYm9hcmRDb25maWddKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5pc0NvbmZpZ0RpZmZlcmVudChrZXksIHZhbHVlKSkge1xyXG4gICAgICB0aGlzLnVwZGF0ZUNvbmZpZ1ZhbHVlKGtleSwgdmFsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0Q29uZmlnVmFsdWU8SyBleHRlbmRzIGtleW9mIFdoaXRlYm9hcmRDb25maWc+KGtleTogSyk6IFdoaXRlYm9hcmRDb25maWdbS10ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnKClba2V5XTtcclxuICB9XHJcblxyXG4gIHNldENvbmZpZ1ZhbHVlPEsgZXh0ZW5kcyBrZXlvZiBXaGl0ZWJvYXJkQ29uZmlnPihrZXk6IEssIHZhbHVlOiBXaGl0ZWJvYXJkQ29uZmlnW0tdKTogdm9pZCB7XHJcbiAgICB0aGlzLmNvbmZpZy51cGRhdGUoKGN1cnJlbnQpID0+ICh7IC4uLmN1cnJlbnQsIFtrZXldOiB2YWx1ZSB9KSk7XHJcbiAgICB0aGlzLmV2ZW50QnVzU2VydmljZS5lbWl0KFdoaXRlYm9hcmRFdmVudC5Db25maWdDaGFuZ2UsIHRoaXMuY29uZmlnKCkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29uZmlnS2V5cygpOiAoa2V5b2YgV2hpdGVib2FyZENvbmZpZylbXSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5jb25maWcoKSkgYXMgKGtleW9mIFdoaXRlYm9hcmRDb25maWcpW107XHJcbiAgfVxyXG5cclxuICBnZXRDb25maWdWYWx1ZXMoKTogV2hpdGVib2FyZENvbmZpZ1trZXlvZiBXaGl0ZWJvYXJkQ29uZmlnXVtdIHtcclxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuY29uZmlnKCkpIGFzIFdoaXRlYm9hcmRDb25maWdba2V5b2YgV2hpdGVib2FyZENvbmZpZ11bXTtcclxuICB9XHJcbn1cclxuIl19