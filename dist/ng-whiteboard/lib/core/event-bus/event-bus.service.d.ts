import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { WhiteboardEvent, WhiteboardEventPayloads } from '../types';
import * as i0 from "@angular/core";
interface WhiteboardEventPayload<T extends WhiteboardEvent> {
    type: T;
    payload: WhiteboardEventPayloads[T];
    timestamp: number;
}
interface DebounceConfig<T = unknown> {
    debounceTime: number;
    distinctUntilChanged?: boolean;
    comparator?: (prev: T, curr: T) => boolean;
}
export declare class EventBusService implements OnDestroy {
    private eventSubject;
    private readonly eventSignals;
    private readonly lastEventInternal;
    readonly lastEvent: import("@angular/core").Signal<WhiteboardEventPayload<WhiteboardEvent> | undefined>;
    private readonly defaultDebounceConfigs;
    ngOnDestroy(): void;
    emit<T extends WhiteboardEvent>(type: T, payload?: WhiteboardEventPayloads[T]): void;
    listen(): Observable<WhiteboardEventPayload<WhiteboardEvent>>;
    getEventSignal<T extends WhiteboardEvent>(eventType: T): import("@angular/core").Signal<WhiteboardEventPayloads[T] | undefined>;
    getAllEventsSignal(): import("@angular/core").Signal<WhiteboardEventPayload<WhiteboardEvent> | undefined>;
    on<T extends WhiteboardEvent>(eventType: T, debounceConfig?: DebounceConfig<WhiteboardEventPayloads[T]>): Observable<WhiteboardEventPayloads[T]>;
    listenToMultiple<T extends WhiteboardEvent>(events: T[]): Observable<{
        type: T;
        payload: WhiteboardEventPayloads[T];
        timestamp: number;
    }>;
    destroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EventBusService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EventBusService>;
}
export {};
