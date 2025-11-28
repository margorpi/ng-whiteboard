/** CSS Blend Modes. */
export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';
/** Blend mode display information for UI. */
export interface BlendModeOption {
    value: BlendMode;
    label: string;
    description: string;
    category: 'normal' | 'darken' | 'lighten' | 'contrast' | 'component';
}
/** Core Layer Model. */
export interface WhiteboardLayer {
    id: string;
    name: string;
    visible: boolean;
    locked: boolean;
    zIndex: number;
    elements: string[];
    opacity?: number;
    blendMode?: BlendMode;
}
/** Layer Management State. */
export interface LayerState {
    layers: WhiteboardLayer[];
    activeLayerId: string;
}
/** Available blend modes with metadata for UI display. */
export declare const BLEND_MODES: BlendModeOption[];
