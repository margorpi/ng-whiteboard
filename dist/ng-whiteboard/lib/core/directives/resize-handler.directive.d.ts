import { ChangeDetectorRef, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';
import * as i0 from "@angular/core";
export declare class ResizeHandlerDirective implements OnInit, OnDestroy {
    private elementRef;
    private apiService;
    private _cd;
    private resizeObserver;
    constructor(elementRef: ElementRef, apiService: ApiService, _cd: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ResizeHandlerDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ResizeHandlerDirective, "[resizeHandler]", never, {}, {}, never, never, true, never>;
}
