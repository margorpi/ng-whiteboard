import { LineCap, LineJoin } from './types';
import { StrokeOptions } from '../utils/drawing/stroke-types';
/** Predefined pen configurations for different drawing styles. */
/** Available pen types. */
export declare enum PenType {
    Pen = "pen",
    Marker = "marker",
    Highlighter = "highlighter",
    Brush = "brush",
    Pencil = "pencil"
}
/** Pen thickness options. */
export declare enum PenThickness {
    ExtraFine = "extra-fine",// 1px
    Fine = "fine",// 2px
    Medium = "medium",// 4px
    Thick = "thick",// 8px
    ExtraThick = "extra-thick"
}
/** Complete pen preset configuration. */
export interface PenPreset {
    id: string;
    name: string;
    type: PenType;
    thickness: PenThickness;
    strokeColor?: string;
    strokeWidth?: number;
    lineCap?: LineCap;
    lineJoin?: LineJoin;
    dasharray?: string;
    dashoffset?: number;
    opacity?: number;
    strokeOptions: StrokeOptions;
    display: {
        description: string;
        icon?: string;
        preview?: string;
    };
}
/** Size mappings for different thickness levels. */
export declare const THICKNESS_SIZES: Record<PenThickness, number>;
/** Stroke width mappings for different thickness levels. */
export declare const THICKNESS_STROKE_WIDTHS: Record<PenThickness, number>;
/** Predefined pen presets. */
export declare const PEN_PRESETS_MAP: Record<string, PenPreset>;
/** Array version for backward compatibility. */
export declare const PEN_PRESETS: PenPreset[];
export declare const PEN_PRESETS_BY_TYPE_THICKNESS: Record<string, PenPreset>;
/** Default pen preset. */
export declare const DEFAULT_PEN_PRESET: PenPreset;
/** Get preset by type and thickness combination. */
export declare function getPenPresetByTypeAndThickness(type: PenType, thickness: PenThickness): PenPreset | undefined;
/** Get first available preset for a pen type with preferred thickness. */
export declare function getPresetForType(type: PenType, preferredThickness?: PenThickness): PenPreset;
