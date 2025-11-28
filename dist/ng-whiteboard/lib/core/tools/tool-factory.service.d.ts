import { ApiService } from '../api';
import { Tool, ToolType } from '../types';
import * as i0 from "@angular/core";
export declare class ToolFactory {
    createTool(toolType: ToolType, apiService: ApiService): Tool;
    static ɵfac: i0.ɵɵFactoryDeclaration<ToolFactory, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ToolFactory>;
}
