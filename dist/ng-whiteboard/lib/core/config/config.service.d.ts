import { WhiteboardConfig, EditorConfig } from '../types';
import { EventBusService } from '../event-bus/event-bus.service';
import * as i0 from "@angular/core";
export declare class ConfigService {
    private eventBusService;
    private config;
    private editorConfig;
    constructor(eventBusService: EventBusService);
    getConfig(): Readonly<WhiteboardConfig>;
    getConfigSignal(): import("@angular/core").Signal<WhiteboardConfig>;
    getEditorConfig(): Readonly<EditorConfig>;
    getEditorConfigSignal(): import("@angular/core").Signal<EditorConfig>;
    updateConfig(partialConfig: Partial<WhiteboardConfig>, emitEvent?: boolean): void;
    isConfigDifferent(key: keyof WhiteboardConfig, value: WhiteboardConfig[keyof WhiteboardConfig]): boolean;
    updateConfigValue(key: keyof WhiteboardConfig, value: WhiteboardConfig[keyof WhiteboardConfig]): void;
    updateEditorConfigValue(key: keyof EditorConfig, value: EditorConfig[keyof EditorConfig]): void;
    checkAndUpdateConfig(key: keyof WhiteboardConfig, value: WhiteboardConfig[keyof WhiteboardConfig]): void;
    getConfigValue<K extends keyof WhiteboardConfig>(key: K): WhiteboardConfig[K];
    setConfigValue<K extends keyof WhiteboardConfig>(key: K, value: WhiteboardConfig[K]): void;
    getConfigKeys(): (keyof WhiteboardConfig)[];
    getConfigValues(): WhiteboardConfig[keyof WhiteboardConfig][];
    static ɵfac: i0.ɵɵFactoryDeclaration<ConfigService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ConfigService>;
}
