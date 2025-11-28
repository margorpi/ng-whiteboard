import { LineCap, LineJoin } from './types';
export interface WhiteboardElementStyle {
    strokeWidth?: number;
    strokeColor?: string;
    fill?: string;
    lineJoin?: LineJoin;
    lineCap?: LineCap;
    fontSize?: number;
    fontFamily?: string;
    fontStyle?: 'normal' | 'italic';
    fontWeight?: 'normal' | 'bold';
    color?: string;
    dasharray?: string;
    dashoffset?: number;
    opacity?: number;
}
export declare const defaultElementStyle: WhiteboardElementStyle;
export declare const defaultTextElementStyle: WhiteboardElementStyle;
