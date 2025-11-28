import { ApiService } from '../api/api.service';
import { ConfigService } from '../config/config.service';
import { WhiteboardElement } from '../types';
import * as i0 from "@angular/core";
export declare class DragDropService {
    private apiService;
    private configService;
    constructor(apiService: ApiService, configService: ConfigService);
    handleFiles(files: FileList): void;
    handleText(content: string, event: DragEvent, isHtml?: boolean): void;
    handleElements(elements: WhiteboardElement[], event: DragEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DragDropService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DragDropService>;
}
