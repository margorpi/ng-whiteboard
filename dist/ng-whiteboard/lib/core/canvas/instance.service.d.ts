import { Signal } from '@angular/core';
import { ApiService } from '../api/api.service';
import * as i0 from "@angular/core";
export declare class InstanceService {
    private readonly instances;
    private readonly _activeId;
    readonly activeId: Signal<string | null>;
    private readonly _registryVersion;
    readonly registryVersion: Signal<number>;
    register(id: string, instance: ApiService): void;
    unregister(id: string): boolean;
    getInstance(id: string): ApiService | undefined;
    hasInstance(id: string): boolean;
    getAllInstanceIds(): ReadonlyArray<string>;
    getInstanceCount(): number;
    setActive(id: string): void;
    clearActive(): void;
    getActiveInstance(): ApiService | undefined;
    clearAll(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<InstanceService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<InstanceService>;
}
