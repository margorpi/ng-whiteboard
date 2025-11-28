import { PointerInfo, ToolType } from '../types';
import { BaseTool } from './base-tool';
import { CursorType } from '../types/cursors';
export declare class TextTool extends BaseTool {
    type: ToolType;
    baseCursor: CursorType;
    private textElement;
    private textInput;
    handlePointerDown(event: PointerInfo): void;
    handlePointerUp(): void;
    private createTextElement;
    private createTextInput;
    private handleTextInput;
    private finishTextInput;
    private getElementStyle;
}
