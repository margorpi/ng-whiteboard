import * as i0 from '@angular/core';
import { signal, untracked, Injectable, computed, inject, effect, ElementRef, EventEmitter, Output, Directive, HostListener, ViewChild, Component, Pipe, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { Subject, filter, map, debounceTime, distinctUntilChanged } from 'rxjs';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';

var ActionType;
(function (ActionType) {
    ActionType["Save"] = "save";
    ActionType["Undo"] = "undo";
    ActionType["Redo"] = "redo";
    ActionType["Clear"] = "clear";
    ActionType["AddImage"] = "addImage";
    ActionType["ToggleGrid"] = "toggleGrid";
    ActionType["AddElement"] = "addElement";
    ActionType["UpdateElement"] = "updateElement";
    ActionType["RemoveElements"] = "removeElements";
    ActionType["RemoveSelectedElements"] = "removeSelectedElements";
    ActionType["SelectElements"] = "selectElements";
    ActionType["ToggleSelection"] = "toggleSelection";
    ActionType["DeselectElement"] = "deselectElement";
    ActionType["SelectAll"] = "selectAll";
    ActionType["ClearSelection"] = "clearSelection";
    ActionType["UpdateSelectedElements"] = "updateSelectedElements";
    ActionType["SetActiveTool"] = "setActiveTool";
    ActionType["SetCanvasDimensions"] = "setCanvasDimensions";
    ActionType["SetCanvasPosition"] = "setCanvasPosition";
    ActionType["UpdateGridTranslation"] = "updateGridTranslation";
    ActionType["UpdateElementsTranslation"] = "updateElementsTranslation";
    ActionType["FullScreen"] = "fullScreen";
    ActionType["CenterCanvas"] = "centerCanvas";
    ActionType["ZoomIn"] = "zoomIn";
    ActionType["ZoomOut"] = "zoomOut";
    ActionType["Zoom"] = "zoom";
    ActionType["ZoomToFit"] = "zoomToFit";
    ActionType["ZoomToSelection"] = "zoomToSelection";
    ActionType["ResetZoom"] = "resetZoom";
    ActionType["SetBackgroundColor"] = "setBackgroundColor";
    ActionType["UpdateConfig"] = "updateConfig";
    ActionType["Batch"] = "batch";
    // Layer Management Actions
    ActionType["AddLayer"] = "addLayer";
    ActionType["RemoveLayer"] = "removeLayer";
    ActionType["RenameLayer"] = "renameLayer";
    ActionType["SetActiveLayer"] = "setActiveLayer";
    ActionType["ToggleLayerVisibility"] = "toggleLayerVisibility";
    ActionType["ToggleLayerLock"] = "toggleLayerLock";
    ActionType["SetLayerOpacity"] = "setLayerOpacity";
    ActionType["SetLayerBlendMode"] = "setLayerBlendMode";
    ActionType["MoveLayerUp"] = "moveLayerUp";
    ActionType["MoveLayerDown"] = "moveLayerDown";
})(ActionType || (ActionType = {}));

var ElementType;
(function (ElementType) {
    ElementType["Pen"] = "pen";
    ElementType["Rectangle"] = "rectangle";
    ElementType["Ellipse"] = "ellipse";
    ElementType["Line"] = "line";
    ElementType["Arrow"] = "arrow";
    ElementType["Text"] = "text";
    ElementType["Image"] = "image";
})(ElementType || (ElementType = {}));

/** Event types that can occur in ng-whiteboard. */
var WhiteboardEvent;
(function (WhiteboardEvent) {
    WhiteboardEvent["Ready"] = "ready";
    WhiteboardEvent["Destroyed"] = "destroyed";
    WhiteboardEvent["DrawStart"] = "drawStart";
    WhiteboardEvent["Drawing"] = "drawing";
    WhiteboardEvent["DrawEnd"] = "drawEnd";
    WhiteboardEvent["ElementsAdded"] = "elementsAdded";
    WhiteboardEvent["ElementsUpdated"] = "elementsUpdated";
    WhiteboardEvent["ElementsSelected"] = "elementsSelected";
    WhiteboardEvent["ElementsRemoved"] = "elementsRemoved";
    WhiteboardEvent["ElementDoubleClicked"] = "elementDoubleClicked";
    WhiteboardEvent["Undo"] = "undo";
    WhiteboardEvent["Redo"] = "redo";
    WhiteboardEvent["Clear"] = "clear";
    WhiteboardEvent["DataChange"] = "dataChange";
    WhiteboardEvent["Save"] = "save";
    WhiteboardEvent["ImageAdded"] = "imageAdded";
    WhiteboardEvent["ToolChange"] = "toolChange";
    WhiteboardEvent["ConfigChange"] = "configChange";
    WhiteboardEvent["ZoomChange"] = "zoomChange";
})(WhiteboardEvent || (WhiteboardEvent = {}));

var FormatType;
(function (FormatType) {
    FormatType["Png"] = "png";
    FormatType["Jpeg"] = "jpeg";
    FormatType["Svg"] = "svg";
    FormatType["Base64"] = "base64";
})(FormatType || (FormatType = {}));
var AlignmentType;
(function (AlignmentType) {
    AlignmentType["Left"] = "left";
    AlignmentType["Center"] = "center";
    AlignmentType["Right"] = "right";
    AlignmentType["Top"] = "top";
    AlignmentType["Middle"] = "middle";
    AlignmentType["Bottom"] = "bottom";
    AlignmentType["DistributeHorizontally"] = "distribute-horizontally";
    AlignmentType["DistributeVertically"] = "distribute-vertically";
})(AlignmentType || (AlignmentType = {}));
var LineCap;
(function (LineCap) {
    LineCap["Round"] = "round";
    LineCap["Butt"] = "butt";
    LineCap["Square"] = "square";
})(LineCap || (LineCap = {}));
var LineJoin;
(function (LineJoin) {
    LineJoin["Round"] = "round";
    LineJoin["Miter"] = "miter";
    LineJoin["Bevel"] = "bevel";
    LineJoin["MiterClip"] = "miter-clip";
})(LineJoin || (LineJoin = {}));
var Direction;
(function (Direction) {
    Direction["NW"] = "nw";
    Direction["N"] = "n";
    Direction["NE"] = "ne";
    Direction["E"] = "e";
    Direction["SE"] = "se";
    Direction["S"] = "s";
    Direction["SW"] = "sw";
    Direction["W"] = "w";
})(Direction || (Direction = {}));

/** Predefined pen configurations for different drawing styles. */
/** Available pen types. */
var PenType;
(function (PenType) {
    PenType["Pen"] = "pen";
    PenType["Marker"] = "marker";
    PenType["Highlighter"] = "highlighter";
    PenType["Brush"] = "brush";
    PenType["Pencil"] = "pencil";
})(PenType || (PenType = {}));
/** Pen thickness options. */
var PenThickness;
(function (PenThickness) {
    PenThickness["ExtraFine"] = "extra-fine";
    PenThickness["Fine"] = "fine";
    PenThickness["Medium"] = "medium";
    PenThickness["Thick"] = "thick";
    PenThickness["ExtraThick"] = "extra-thick";
})(PenThickness || (PenThickness = {}));
/** Base stroke options for smooth pen. */
const smoothPenOptions = {
    size: 3,
    thinning: 0.8,
    smoothing: 0.9,
    streamline: 0.8,
    simulatePressure: true,
    easing: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    start: { cap: true, taper: 0.5 },
    end: { cap: true, taper: 0.6 },
};
/** Marker stroke options with uniform thickness. */
const markerOptions = {
    size: 6,
    thinning: 0.0,
    smoothing: 0.2,
    streamline: 0.3,
    simulatePressure: false,
    easing: () => 1.0,
    start: { cap: false, taper: false },
    end: { cap: false, taper: false },
};
/** Highlighter stroke options with wide rectangular shape. */
const highlighterOptions = {
    size: 18,
    thinning: 0.05,
    smoothing: 0.1,
    streamline: 0.1,
    simulatePressure: false,
    easing: (t) => t,
    start: { cap: false, taper: false },
    end: { cap: false, taper: false },
};
/** Brush stroke options with high expressiveness. */
const brushOptions = {
    size: 14,
    thinning: 0.85,
    smoothing: 0.95,
    streamline: 0.9,
    simulatePressure: true,
    easing: (t) => Math.pow(t, 1.8),
    start: { cap: true, taper: 0.7 },
    end: { cap: true, taper: 0.8 },
};
/** Pencil stroke options with rough texture. */
const pencilOptions = {
    size: 1.5,
    thinning: 0.6,
    smoothing: 0.15,
    streamline: 0.1,
    simulatePressure: true,
    easing: (t) => {
        const base = t * 0.7 + 0.3;
        return Math.min(1.0, base + Math.sin(t * 20) * 0.1);
    },
    start: { cap: true, taper: 0.1 },
    end: { cap: true, taper: 0.2 },
};
/** Size mappings for different thickness levels. */
const THICKNESS_SIZES = {
    [PenThickness.ExtraFine]: 1,
    [PenThickness.Fine]: 3,
    [PenThickness.Medium]: 6,
    [PenThickness.Thick]: 12,
    [PenThickness.ExtraThick]: 20,
};
/** Stroke width mappings for different thickness levels. */
const THICKNESS_STROKE_WIDTHS = {
    [PenThickness.ExtraFine]: 0.5,
    [PenThickness.Fine]: 1.5,
    [PenThickness.Medium]: 3,
    [PenThickness.Thick]: 6,
    [PenThickness.ExtraThick]: 10,
};
/** Predefined pen presets. */
const PEN_PRESETS_MAP = {
    'pen-fine': {
        id: 'pen-fine',
        name: 'Fine Pen',
        type: PenType.Pen,
        thickness: PenThickness.Fine,
        strokeColor: '#000000',
        strokeWidth: THICKNESS_STROKE_WIDTHS[PenThickness.Fine],
        lineCap: LineCap.Round,
        lineJoin: LineJoin.Round,
        strokeOptions: {
            ...smoothPenOptions,
            size: THICKNESS_SIZES[PenThickness.Fine],
        },
        display: {
            description: 'Smooth fine pen for detailed drawing',
            icon: '✏️',
        },
    },
    'pen-medium': {
        id: 'pen-medium',
        name: 'Medium Pen',
        type: PenType.Pen,
        thickness: PenThickness.Medium,
        strokeColor: '#000000',
        strokeWidth: THICKNESS_STROKE_WIDTHS[PenThickness.Medium],
        lineCap: LineCap.Round,
        lineJoin: LineJoin.Round,
        strokeOptions: {
            ...smoothPenOptions,
            size: THICKNESS_SIZES[PenThickness.Medium],
        },
        display: {
            description: 'Standard pen for general use',
            icon: '🖊️',
        },
    },
    'pen-thick': {
        id: 'pen-thick',
        name: 'Thick Pen',
        type: PenType.Pen,
        thickness: PenThickness.Thick,
        strokeColor: '#000000',
        strokeWidth: THICKNESS_STROKE_WIDTHS[PenThickness.Thick],
        lineCap: LineCap.Round,
        lineJoin: LineJoin.Round,
        strokeOptions: {
            ...smoothPenOptions,
            size: THICKNESS_SIZES[PenThickness.Thick],
        },
        display: {
            description: 'Thick pen for bold strokes',
            icon: '🖍️',
        },
    },
    'marker-medium': {
        id: 'marker-medium',
        name: 'Medium Marker',
        type: PenType.Marker,
        thickness: PenThickness.Medium,
        strokeColor: '#2563eb',
        strokeWidth: THICKNESS_STROKE_WIDTHS[PenThickness.Medium],
        lineCap: LineCap.Square,
        lineJoin: LineJoin.Miter,
        strokeOptions: {
            ...markerOptions,
            size: THICKNESS_SIZES[PenThickness.Medium],
        },
        display: {
            description: 'Consistent marker for clean lines',
            icon: '🖍️',
        },
    },
    'marker-thick': {
        id: 'marker-thick',
        name: 'Thick Marker',
        type: PenType.Marker,
        thickness: PenThickness.Thick,
        strokeColor: '#dc2626',
        strokeWidth: THICKNESS_STROKE_WIDTHS[PenThickness.Thick],
        lineCap: LineCap.Square,
        lineJoin: LineJoin.Miter,
        strokeOptions: {
            ...markerOptions,
            size: THICKNESS_SIZES[PenThickness.Thick],
        },
        display: {
            description: 'Thick marker for emphasis',
            icon: '🖍️',
        },
    },
    'highlighter-medium': {
        id: 'highlighter-medium',
        name: 'Highlighter',
        type: PenType.Highlighter,
        thickness: PenThickness.Medium,
        strokeColor: '#fefc34',
        strokeWidth: THICKNESS_STROKE_WIDTHS[PenThickness.ExtraThick],
        lineCap: LineCap.Square,
        lineJoin: LineJoin.Miter,
        opacity: 0.4,
        strokeOptions: {
            ...highlighterOptions,
            size: THICKNESS_SIZES[PenThickness.ExtraThick],
        },
        display: {
            description: 'Translucent highlighter for emphasis',
            icon: '🖍️',
        },
    },
    'brush-medium': {
        id: 'brush-medium',
        name: 'Paint Brush',
        type: PenType.Brush,
        thickness: PenThickness.Medium,
        strokeColor: '#059669',
        strokeWidth: THICKNESS_STROKE_WIDTHS[PenThickness.Thick],
        lineCap: LineCap.Round,
        lineJoin: LineJoin.Round,
        strokeOptions: {
            ...brushOptions,
            size: THICKNESS_SIZES[PenThickness.Thick],
        },
        display: {
            description: 'Expressive brush with pressure sensitivity',
            icon: '🖌️',
        },
    },
    'pencil-fine': {
        id: 'pencil-fine',
        name: 'Pencil',
        type: PenType.Pencil,
        thickness: PenThickness.Fine,
        strokeColor: '#374151',
        strokeWidth: THICKNESS_STROKE_WIDTHS[PenThickness.Fine],
        lineCap: LineCap.Round,
        lineJoin: LineJoin.Round,
        strokeOptions: {
            ...pencilOptions,
            size: THICKNESS_SIZES[PenThickness.Fine],
        },
        display: {
            description: 'Natural pencil for sketching',
            icon: '✏️',
        },
    },
};
/** Array version for backward compatibility. */
const PEN_PRESETS = Object.values(PEN_PRESETS_MAP);
const PEN_PRESETS_BY_TYPE_THICKNESS = {};
Object.values(PEN_PRESETS_MAP).forEach((preset) => {
    const key = `${preset.type}-${preset.thickness}`;
    PEN_PRESETS_BY_TYPE_THICKNESS[key] = preset;
});
/** Default pen preset. */
const DEFAULT_PEN_PRESET = PEN_PRESETS_MAP['pen-medium'];
/** Get preset by type and thickness combination. */
function getPenPresetByTypeAndThickness(type, thickness) {
    return PEN_PRESETS_BY_TYPE_THICKNESS[`${type}-${thickness}`];
}
/** Get first available preset for a pen type with preferred thickness. */
function getPresetForType(type, preferredThickness = PenThickness.Medium) {
    const preferred = getPenPresetByTypeAndThickness(type, preferredThickness);
    if (preferred)
        return preferred;
    const fallback = PEN_PRESETS.find((preset) => preset.type === type);
    return fallback || DEFAULT_PEN_PRESET;
}

const defaultElementStyle = {
    strokeWidth: 2,
    strokeColor: '#000000',
    fill: '#000000',
    lineJoin: LineJoin.Round,
    lineCap: LineCap.Round,
    dasharray: '',
    dashoffset: 0,
};
const defaultTextElementStyle = {
    ...defaultElementStyle,
    fontSize: 14,
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: '#000000',
};

var ToolType;
(function (ToolType) {
    ToolType["Hand"] = "hand";
    ToolType["Select"] = "select";
    ToolType["Pen"] = "pen";
    ToolType["Rectangle"] = "rectangle";
    ToolType["Image"] = "image";
    ToolType["Line"] = "line";
    ToolType["Arrow"] = "arrow";
    ToolType["Ellipse"] = "ellipse";
    ToolType["Text"] = "text";
    ToolType["Eraser"] = "eraser";
})(ToolType || (ToolType = {}));

/** Default SVG icons for whiteboard tools. */
const TOOL_ICONS = {
    [ToolType.Hand]: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M402-40q-30 0-56-13.5T303-92L48-465l24-23q19-19 45-22t47 12l116 81v-383q0-17 11.5-28.5T320-840q17 0 28.5 11.5T360-800v537L212-367l157 229q5 8 14 13t19 5h278q33 0 56.5-23.5T760-200v-560q0-17 11.5-28.5T800-800q17 0 28.5 11.5T840-760v560q0 66-47 113T680-40H402Zm38-440v-400q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v400h-80Zm160 0v-360q0-17 11.5-28.5T640-880q17 0 28.5 11.5T680-840v360h-80ZM486-300Z"/></svg>`,
    [ToolType.Select]: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M516-120 402-402 120-516v-56l720-268-268 720h-56Zm26-148 162-436-436 162 196 78 78 196Zm-78-196Z"/></svg>`,
    [ToolType.Pen]: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>`,
    [ToolType.Line]: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M199-199q-9-9-9-21t9-21l520-520q9-9 21-9t21 9q9 9 9 21t-9 21L241-199q-9 9-21 9t-21-9Z"/></svg>`,
    [ToolType.Arrow]: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"/></svg>`,
    [ToolType.Rectangle]: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-200q-33 0-56.5-23.5T120-280v-400q0-33 23.5-56.5T200-760h560q33 0 56.5 23.5T840-680v400q0 33-23.5 56.5T760-200H200Zm0-80h560v-400H200v400Zm0 0v-400 400Z"/></svg>`,
    [ToolType.Ellipse]: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`,
    [ToolType.Text]: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-160v-520H80v-120h520v120H400v520H280Zm360 0v-320H520v-120h360v120H760v320H640Z"/></svg>`,
    [ToolType.Image]: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg>`,
    [ToolType.Eraser]: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M690-240h190v80H610l80-80Zm-500 80-85-85q-23-23-23.5-57t22.5-58l440-456q23-24 56.5-24t56.5 23l199 199q23 23 23 57t-23 57L520-160H190Zm296-80 314-322-198-198-442 456 64 64h262Zm-6-240Z"/></svg>`,
};

/** Available blend modes with metadata for UI display. */
const BLEND_MODES = [
    { value: 'normal', label: 'Normal', description: 'Default blending', category: 'normal' },
    { value: 'multiply', label: 'Multiply', description: 'Darkens by multiplying colors', category: 'darken' },
    { value: 'darken', label: 'Darken', description: 'Keeps darkest colors', category: 'darken' },
    { value: 'color-burn', label: 'Color Burn', description: 'Increases contrast and darkens', category: 'darken' },
    { value: 'screen', label: 'Screen', description: 'Lightens by inverting and multiplying', category: 'lighten' },
    { value: 'lighten', label: 'Lighten', description: 'Keeps lightest colors', category: 'lighten' },
    { value: 'color-dodge', label: 'Color Dodge', description: 'Brightens and reduces contrast', category: 'lighten' },
    { value: 'overlay', label: 'Overlay', description: 'Combines multiply and screen', category: 'contrast' },
    { value: 'soft-light', label: 'Soft Light', description: 'Subtle version of overlay', category: 'contrast' },
    { value: 'hard-light', label: 'Hard Light', description: 'Intense version of overlay', category: 'contrast' },
    { value: 'difference', label: 'Difference', description: 'Subtracts colors', category: 'contrast' },
    {
        value: 'exclusion',
        label: 'Exclusion',
        description: 'Similar to difference but less contrast',
        category: 'contrast',
    },
    { value: 'hue', label: 'Hue', description: 'Uses hue of top layer', category: 'component' },
    { value: 'saturation', label: 'Saturation', description: 'Uses saturation of top layer', category: 'component' },
    { value: 'color', label: 'Color', description: 'Uses hue and saturation of top layer', category: 'component' },
    { value: 'luminosity', label: 'Luminosity', description: 'Uses luminosity of top layer', category: 'component' },
];

/** Standard CSS cursor types and custom SVG cursors for whiteboard tools. */
var CursorType;
(function (CursorType) {
    // Selection & Pointer
    CursorType["Default"] = "default";
    CursorType["Pointer"] = "pointer";
    CursorType["None"] = "none";
    CursorType["ContextMenu"] = "context-menu";
    CursorType["Help"] = "help";
    CursorType["Progress"] = "progress";
    CursorType["Wait"] = "wait";
    // Drawing & Interaction
    CursorType["Crosshair"] = "crosshair";
    CursorType["Cell"] = "cell";
    CursorType["Text"] = "text";
    CursorType["VerticalText"] = "vertical-text";
    // Drag & Move
    CursorType["Grab"] = "grab";
    CursorType["Grabbing"] = "grabbing";
    CursorType["Move"] = "move";
    CursorType["AllScroll"] = "all-scroll";
    // Resize (Directional)
    CursorType["NResize"] = "n-resize";
    CursorType["SResize"] = "s-resize";
    CursorType["EResize"] = "e-resize";
    CursorType["WResize"] = "w-resize";
    CursorType["NEResize"] = "ne-resize";
    CursorType["NWResize"] = "nw-resize";
    CursorType["SEResize"] = "se-resize";
    CursorType["SWResize"] = "sw-resize";
    CursorType["EWResize"] = "ew-resize";
    CursorType["NSResize"] = "ns-resize";
    CursorType["NESWResize"] = "nesw-resize";
    CursorType["NWSEResize"] = "nwse-resize";
    // Action States
    CursorType["Copy"] = "copy";
    CursorType["Alias"] = "alias";
    CursorType["NoDrop"] = "no-drop";
    CursorType["NotAllowed"] = "not-allowed";
    // Zoom
    CursorType["ZoomIn"] = "zoom-in";
    CursorType["ZoomOut"] = "zoom-out";
    // Column & Row Resize
    CursorType["ColResize"] = "col-resize";
    CursorType["RowResize"] = "row-resize";
    // Custom SVG Cursors
    CursorType["Pencil"] = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZmlsbD0iIzAwMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgZD0ibTE2LjMxOCA2LjExLTMuNTM2LTMuNTM1IDEuNDE1LTEuNDE0Yy42My0uNjMgMi4wNzMtLjc1NSAyLjgyOCAwbC43MDcuNzA3Yy43NTUuNzU1LjYzMSAyLjE5OCAwIDIuODI5TDE2LjMxOCA2LjExem0tMS40MTQgMS40MTUtOS45IDkuOS00LjU5NiAxLjA2IDEuMDYtNC41OTYgOS45LTkuOSAzLjUzNiAzLjUzNnoiLz48L3N2Zz4=') 0 24, auto";
    CursorType["Brush"] = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDAwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBkPSJNNyAxNGMtMS42NiAwLTMgMS4zNC0zIDMgMCAxLjMxLTEuMTYgMi0yIDIgLjkyIDEuMjIgMi40OSAyIDQgMiAyLjIxIDAgNC0xLjc5IDQtNCAwLTEuNjYtMS4zNC0zLTMtM3ptMTMuNzEtOS4zN2wtMS4zNC0xLjM0YS45OTYuOTk2IDAgMCAwLTEuNDEgMEw5IDEyLjI1IDExLjc1IDE1bDguOTYtOC45NmEuOTk2Ljk5NiAwIDAgMCAwLTEuNDF6Ii8+PC9zdmc+') 0 24, auto";
    CursorType["Eraser"] = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDAwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBkPSJNMTYuMjQgMy41Nmw0Ljk1IDQuOTRjLjc4Ljc5Ljc4IDIuMDUgMCAyLjg0TDEyIDIwLjUzYTQuMDA4IDQuMDA4IDAgMCAxLTUuNjYgMEwyLjgxIDE3Yy0uNzgtLjc5LS43OC0yLjA1IDAtMi44NGwxMC42LTEwLjZjLjc5LS43OCAyLjA1LS43OCAyLjgzIDBNNC4yMiAxNS41OGwzLjU0IDMuNTNjLjc4Ljc5IDIuMDQuNzkgMi44MyAwbDMuNTMtMy41My00Ljk1LTQuOTUtNC45NSA0Ljk1eiIvPjwvc3ZnPg==') 12 12, auto";
    CursorType["Highlighter"] = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cmVjdCB4PSI0IiB5PSIxMCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjgiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPjxwYXRoIGQ9Ik0yIDIwaDIwdjNIMnoiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuOCIvPjwvc3ZnPg==') 12 24, auto";
    CursorType["TextCursor"] = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDAwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBkPSJNNSA0djNoNS41djEyaDNWN0gxOVY0SDV6Ii8+PC9zdmc+') 12 0, text";
    CursorType["Shape"] = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==') 12 12, crosshair";
    CursorType["Arrow"] = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDAwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBkPSJNMyAzbDcuMDcgMTYuOTcgMi41MS03LjM5IDcuMzktMi41MUwzIDN6Ii8+PC9zdmc+') 0 0, default";
    CursorType["Hand"] = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDAwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBkPSJNMTMgNnY1aDNMMTIgMTdsLTQtNmgzVjZjMC0xLjEuOS0yIDItMnMyIC5IDIgMnptOCAwdjVoLTJWNmMwLTIuMjEtMS43OS00LTQtNGgtMkMxMC43OSAyIDkgMy43OSA5IDZ2NUg3VjZjMC0zLjMxIDIuNjktNiA2LTZoMmMzLjMxIDAgNiAyLjY5IDYgNnoiLz48L3N2Zz4=') 12 12, grab";
    CursorType["Rotate"] = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDAwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBkPSJNMTIgNnYzbDQtNC00LTR2M2MtNC40MiAwLTggMy41OC04IDggMCAxLjU3LjQ2IDMuMDMgMS4yNCA0LjI2TDYuNyAxNC44Yy0uNDUtLjgzLS43LTEuNzktLjctMi44IDAtMy4zMSAyLjY5LTYgNi02em02Ljc2IDEuNzRMMTcuMyA5LjJjLjQ0Ljg0LjcgMS43OS43IDIuOCAwIDMuMzEtMi42OSA2LTYgNnYtM2wtNCA0IDQgNHYtM2M0LjQyIDAgOC0zLjU4IDgtOCAwLTEuNTctLjQ2LTMuMDMtMS4yNC00LjI2eiIvPjwvc3ZnPg==') 12 12, grab";
    CursorType["Eyedropper"] = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDAwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBkPSJNMjAuNzEgNS42M2wtMi4zNC0yLjM0Yy0uMzktLjM5LTEuMDItLjM5LTEuNDEgMGwtMy4xMiAzLjEyLTEuOTMtMS45MS0xLjQxIDEuNDEgMS40MiAxLjQyTDMgMTYuMjVWMjFoNC43NWw4LjkyLTguOTIgMS40MiAxLjQyIDEuNDEtMS40MS0xLjkyLTEuOTIgMy4xMy0zLjEyYy4zOS0uMzkuMzktMS4wMiAwLTEuNDJ6Ii8+PC9zdmc+') 0 24, crosshair";
    CursorType["LaserPointer"] = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSIjMDAwIiBvcGFjaXR5PSIwLjgiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI2IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+') 12 12, none";
    CursorType["Image"] = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiIGZpbGw9IiMwMDAiLz48cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAxNSA5IDkgMTUgNiAxMiAzIDE1IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==') 12 12, crosshair";
    CursorType["Dot"] = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIyIiBmaWxsPSIjMDAwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==') 10 10, crosshair";
    CursorType["Plus"] = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDAwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBkPSJNMTkgMTNoLTZ2NmgtMnYtNkg1di0yaDZWNWgydjZoNnYyeiIvPjwvc3ZnPg==') 12 12, crosshair";
    CursorType["Line"] = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48bGluZSB4MT0iMyIgeTE9IjIxIiB4Mj0iMjEiIHkyPSIzIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGNpcmNsZSBjeD0iMyIgY3k9IjIxIiByPSIyIiBmaWxsPSIjMDAwIi8+PGNpcmNsZSBjeD0iMjEiIGN5PSIzIiByPSIyIiBmaWxsPSIjMDAwIi8+PC9zdmc+') 12 12, crosshair";
})(CursorType || (CursorType = {}));

class EventBusService {
    eventSubject = new Subject();
    eventSignals = {
        [WhiteboardEvent.Ready]: signal(undefined),
        [WhiteboardEvent.Destroyed]: signal(undefined),
        [WhiteboardEvent.DrawStart]: signal(undefined),
        [WhiteboardEvent.Drawing]: signal(undefined),
        [WhiteboardEvent.DrawEnd]: signal(undefined),
        [WhiteboardEvent.ElementsAdded]: signal(undefined),
        [WhiteboardEvent.ElementsUpdated]: signal(undefined),
        [WhiteboardEvent.ElementsSelected]: signal(undefined),
        [WhiteboardEvent.ElementsRemoved]: signal(undefined),
        [WhiteboardEvent.ElementDoubleClicked]: signal(undefined),
        [WhiteboardEvent.Undo]: signal(undefined),
        [WhiteboardEvent.Redo]: signal(undefined),
        [WhiteboardEvent.Clear]: signal(undefined),
        [WhiteboardEvent.DataChange]: signal(undefined),
        [WhiteboardEvent.Save]: signal(undefined),
        [WhiteboardEvent.ImageAdded]: signal(undefined),
        [WhiteboardEvent.ToolChange]: signal(undefined),
        [WhiteboardEvent.ConfigChange]: signal(undefined),
        [WhiteboardEvent.ZoomChange]: signal(undefined),
    };
    lastEventInternal = signal(undefined);
    lastEvent = this.lastEventInternal.asReadonly();
    defaultDebounceConfigs = {
        [WhiteboardEvent.ElementsAdded]: {
            debounceTime: 100,
            distinctUntilChanged: true,
        },
        [WhiteboardEvent.Drawing]: {
            debounceTime: 16,
            distinctUntilChanged: false,
        },
    };
    ngOnDestroy() {
        this.destroy();
    }
    emit(type, payload) {
        const eventPayload = {
            type,
            payload: payload,
            timestamp: Date.now(),
        };
        this.eventSubject.next(eventPayload);
        untracked(() => {
            this.eventSignals[type].set(eventPayload.payload);
            this.lastEventInternal.set(eventPayload);
        });
    }
    listen() {
        return this.eventSubject.asObservable();
    }
    getEventSignal(eventType) {
        return this.eventSignals[eventType].asReadonly();
    }
    getAllEventsSignal() {
        return this.lastEvent;
    }
    on(eventType, debounceConfig) {
        let stream = this.eventSubject.pipe(filter((event) => event.type === eventType), map((event) => event.payload));
        const config = debounceConfig || this.defaultDebounceConfigs[eventType];
        if (!config)
            return stream;
        if (config.debounceTime > 0) {
            stream = stream.pipe(debounceTime(config.debounceTime));
        }
        if (config.distinctUntilChanged) {
            const compareFn = config.comparator;
            stream = stream.pipe(distinctUntilChanged(compareFn));
        }
        return stream;
    }
    listenToMultiple(events) {
        return this.eventSubject.pipe(filter((event) => events.includes(event.type)), map((event) => ({
            type: event.type,
            payload: event.payload,
            timestamp: event.timestamp,
        })));
    }
    destroy() {
        this.eventSubject.complete();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: EventBusService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: EventBusService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: EventBusService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

class ConfigService {
    eventBusService;
    config = signal({
        drawingEnabled: true,
        canvasWidth: 800,
        canvasHeight: 600,
        fullScreen: true,
        center: true,
        canvasX: 0,
        canvasY: 0,
        strokeColor: '#333333',
        strokeWidth: 2,
        backgroundColor: '#F8F9FA',
        lineJoin: LineJoin.Round,
        lineCap: LineCap.Round,
        fill: 'transparent',
        zoom: 1,
        x: 0,
        y: 0,
        fontFamily: 'sans-serif',
        fontSize: 24,
        dasharray: '',
        dashoffset: 0,
        enableGrid: false,
        gridSize: 10,
        snapToGrid: true,
        keyboardShortcutsEnabled: true,
        penType: PenType.Pen,
    });
    editorConfig = signal({
        title: 'Whiteboard',
        enableEditor: true,
        // Core panels / features
        showTitle: true,
        showZoom: true,
        showLayers: true,
        showTools: true,
        showGrid: true,
        showBackground: true,
        showStroke: true,
        showFill: true,
        showOpacity: true,
        showFont: true,
        showDash: true,
        showEraser: true,
        showUndo: true,
        showRedo: true,
        showClear: true,
        showSave: true,
        showLoad: false,
        showExport: true,
        showImport: false,
        showShare: false,
        showSettings: false,
        showHelp: false,
        showAbout: false,
        showFeedback: false,
        showSupport: false,
        showContact: false,
        showPrivacy: false,
        showTerms: false,
        showLicense: false,
        showAttribution: false,
        showCredits: false,
        showChangelog: false,
        showReleaseNotes: false,
        showRoadmap: false,
        showBlog: false,
        showForum: false,
        showCommunity: false,
        showEvents: false,
        showWebinars: false,
        showWorkshops: false,
        showTutorials: false,
        showDocumentation: false,
        showAPI: false,
        showSDK: false,
        showCLI: false,
        showPlugins: false,
        showExtensions: false,
        showIntegrations: false,
        showAddons: false,
        showThemes: false,
        showTemplates: false,
        showSnippets: false,
        showExamples: true,
        showDemos: true,
        showSamples: false,
        showShowcases: false,
        showPortfolios: false,
        showCaseStudies: false,
        showSuccessStories: false,
        showTestimonials: false,
        showReviews: false,
        showRatings: false,
        showComparisons: false,
        showAlternatives: false,
        showInsights: false,
    });
    constructor(eventBusService) {
        this.eventBusService = eventBusService;
    }
    getConfig() {
        return this.config();
    }
    getConfigSignal() {
        return this.config.asReadonly();
    }
    getEditorConfig() {
        return this.editorConfig();
    }
    getEditorConfigSignal() {
        return this.editorConfig.asReadonly();
    }
    updateConfig(partialConfig, emitEvent = true) {
        this.config.update((current) => ({ ...current, ...partialConfig }));
        const hasZoomRelatedChanges = 'zoom' in partialConfig;
        if (hasZoomRelatedChanges) {
            const config = this.config();
            this.eventBusService.emit(WhiteboardEvent.ZoomChange, {
                zoom: config.zoom,
            });
        }
        if (emitEvent) {
            this.eventBusService.emit(WhiteboardEvent.ConfigChange, this.config());
        }
    }
    isConfigDifferent(key, value) {
        return this.config()[key] !== value;
    }
    updateConfigValue(key, value) {
        this.config.update((current) => ({ ...current, [key]: value }));
        this.eventBusService.emit(WhiteboardEvent.ConfigChange, this.config());
    }
    updateEditorConfigValue(key, value) {
        this.editorConfig.update((current) => ({ ...current, [key]: value }));
    }
    checkAndUpdateConfig(key, value) {
        if (this.isConfigDifferent(key, value)) {
            this.updateConfigValue(key, value);
        }
    }
    getConfigValue(key) {
        return this.config()[key];
    }
    setConfigValue(key, value) {
        this.config.update((current) => ({ ...current, [key]: value }));
        this.eventBusService.emit(WhiteboardEvent.ConfigChange, this.config());
    }
    getConfigKeys() {
        return Object.keys(this.config());
    }
    getConfigValues() {
        return Object.values(this.config());
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ConfigService, deps: [{ token: EventBusService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ConfigService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ConfigService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: EventBusService }] });

class CanvasService {
    configService;
    eventBusService;
    renderer;
    svgContainer = null;
    transform = computed(() => {
        const { zoom, x, y } = this.getConfig();
        return `translate(${x}, ${y}) scale(${zoom})`;
    });
    constructor(configService, eventBusService, rendererFactory) {
        this.configService = configService;
        this.eventBusService = eventBusService;
        this.renderer = rendererFactory.createRenderer(null, null);
    }
    initializeCanvas(svgContainer) {
        this.svgContainer = svgContainer;
        const { fullScreen, center } = this.getConfig();
        if (!fullScreen && center) {
            setTimeout(() => {
                this.centerCanvas();
            }, 0);
        }
        this.eventBusService.emit(WhiteboardEvent.Ready);
    }
    getCanvas() {
        if (!this.svgContainer) {
            throw new Error('SVG container not initialized');
        }
        return this.svgContainer;
    }
    isCanvasInitialized() {
        return this.svgContainer !== null;
    }
    getConfig() {
        return this.configService.getConfig();
    }
    setCanvasDimensions(width, height) {
        this.configService.updateConfig({ canvasWidth: width, canvasHeight: height });
    }
    setCanvasPosition(x, y) {
        this.configService.updateConfig({ x, y });
    }
    getCanvasDimensions() {
        const config = this.getConfig();
        return {
            width: config.canvasWidth,
            height: config.canvasHeight,
        };
    }
    getCanvasPosition() {
        const config = this.getConfig();
        return { x: config.x, y: config.y };
    }
    getContainerDimensions() {
        if (!this.svgContainer) {
            return { width: 0, height: 0 };
        }
        return {
            width: this.svgContainer.clientWidth || 0,
            height: this.svgContainer.clientHeight || 0,
        };
    }
    fullScreen() {
        const { width, height } = this.getContainerDimensions();
        this.setCanvasDimensions(width, height);
        this.configService.updateConfig({ fullScreen: true });
        this.centerCanvas();
    }
    exitFullScreen(defaultWidth = 800, defaultHeight = 600) {
        this.setCanvasDimensions(defaultWidth, defaultHeight);
        this.configService.updateConfig({
            fullScreen: false,
            zoom: 1,
        });
        this.centerCanvas();
    }
    centerCanvas() {
        const { fullScreen } = this.getConfig();
        if (fullScreen) {
            this.configService.updateConfig({ x: 0, y: 0, canvasX: 0, canvasY: 0 });
        }
        else {
            const { canvasWidth, canvasHeight, zoom, center } = this.getConfig();
            const { width: containerWidth, height: containerHeight } = this.getContainerDimensions();
            const scaledWidth = canvasWidth * zoom;
            const scaledHeight = canvasHeight * zoom;
            const canvasX = (containerWidth - scaledWidth) / 2;
            const canvasY = (containerHeight - scaledHeight) / 2;
            const x = center ? canvasWidth / 2 : 0;
            const y = center ? canvasHeight / 2 : 0;
            this.configService.updateConfig({ x, y, canvasX, canvasY });
        }
    }
    resetCanvas() {
        this.configService.updateConfig({
            x: 0,
            y: 0,
            zoom: 1,
            canvasX: 0,
            canvasY: 0,
        });
    }
    toggleGrid() {
        const { enableGrid } = this.getConfig();
        this.configService.updateConfig({ enableGrid: !enableGrid });
    }
    setGridVisible(visible) {
        this.configService.updateConfig({ enableGrid: visible });
    }
    setGridSize(size) {
        this.configService.updateConfig({ gridSize: size });
    }
    toggleSnapToGrid() {
        const { snapToGrid } = this.getConfig();
        this.configService.updateConfig({ snapToGrid: !snapToGrid });
    }
    getTransform() {
        return this.transform;
    }
    getTransformString() {
        return this.transform();
    }
    screenToCanvas(screenX, screenY) {
        const { zoom, x, y } = this.getConfig();
        return {
            x: (screenX - x) / zoom,
            y: (screenY - y) / zoom,
        };
    }
    canvasToScreen(canvasX, canvasY) {
        const { zoom, x, y } = this.getConfig();
        return {
            x: canvasX * zoom + x,
            y: canvasY * zoom + y,
        };
    }
    getVisibleBounds() {
        const { zoom, x, y } = this.getConfig();
        const { width, height } = this.getContainerDimensions();
        return {
            left: -x / zoom,
            top: -y / zoom,
            right: (-x + width) / zoom,
            bottom: (-y + height) / zoom,
        };
    }
    isPointVisible(x, y) {
        const bounds = this.getVisibleBounds();
        return x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
    }
    isRectVisible(x, y, width, height) {
        const bounds = this.getVisibleBounds();
        return !(x + width < bounds.left || x > bounds.right || y + height < bounds.top || y > bounds.bottom);
    }
    getCanvasDimensionsProvider() {
        return () => this.getCanvasDimensions();
    }
    getContainerDimensionsProvider() {
        return () => this.getContainerDimensions();
    }
    transformCoordinates(x, y) {
        return { x, y };
    }
    validateZoom(zoom) {
        return Math.max(0.1, Math.min(10, zoom));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: CanvasService, deps: [{ token: ConfigService }, { token: EventBusService }, { token: i0.RendererFactory2 }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: CanvasService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: CanvasService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: ConfigService }, { type: EventBusService }, { type: i0.RendererFactory2 }] });

class HistoryService {
    undoStack = [];
    redoStack = [];
    MAX_HISTORY = 50;
    // Signals
    canUndoSignal = signal(false);
    canRedoSignal = signal(false);
    undoDescriptionSignal = signal(undefined);
    redoDescriptionSignal = signal(undefined);
    batching = false;
    batchDepth = 0;
    batchBeforeSnapshot = null;
    batchDescription = 'Batch operation';
    pendingBatchAfter = null;
    getCanUndoSignal() {
        return this.canUndoSignal.asReadonly();
    }
    getCanRedoSignal() {
        return this.canRedoSignal.asReadonly();
    }
    getUndoDescriptionSignal() {
        return this.undoDescriptionSignal.asReadonly();
    }
    getRedoDescriptionSignal() {
        return this.redoDescriptionSignal.asReadonly();
    }
    recordChange(before, after, description) {
        if (this.batching) {
            return;
        }
        if (!this.snapshotsEqual(before, after)) {
            this.pushHistory({
                before: this.cloneElements(before),
                after: this.cloneElements(after),
                description,
                timestamp: Date.now(),
            });
        }
    }
    recordElementCreation(before, after) {
        this.recordChange(before, after, 'Create element');
    }
    recordElementUpdate(before, after) {
        this.recordChange(before, after, 'Update element');
    }
    recordElementDeletion(before, after) {
        this.recordChange(before, after, 'Delete element');
    }
    recordClear(before, after) {
        this.recordChange(before, after, 'Clear whiteboard');
    }
    startBatch(description, beforeSnapshot) {
        if (this.batchDepth === 0) {
            this.batchBeforeSnapshot = this.cloneElements(beforeSnapshot);
            this.batchDescription = description;
            this.batching = true;
        }
        this.batchDepth++;
        return {
            execute: () => this.finishBatchCommit(),
            clear: () => this.cancelBatch(),
        };
    }
    completeBatch(afterSnapshot) {
        if (!this.batching)
            return;
        this.pendingBatchAfter = this.cloneElements(afterSnapshot);
    }
    finishBatchCommit() {
        this.batchDepth = Math.max(0, this.batchDepth - 1);
        if (this.batchDepth > 0)
            return;
        if (!this.batching || !this.batchBeforeSnapshot) {
            this.resetBatchState();
            return;
        }
        const after = this.pendingBatchAfter ?? this.batchBeforeSnapshot;
        if (!this.snapshotsEqual(this.batchBeforeSnapshot, after)) {
            this.pushHistory({
                before: this.batchBeforeSnapshot,
                after,
                description: this.batchDescription,
                timestamp: Date.now(),
            });
        }
        this.resetBatchState();
    }
    cancelBatch() {
        this.batchDepth = 0;
        this.resetBatchState();
    }
    resetBatchState() {
        this.batching = false;
        this.batchBeforeSnapshot = null;
        this.batchDescription = 'Batch operation';
    }
    undo() {
        return this.performUndo();
    }
    redo() {
        return this.performRedo();
    }
    clearHistory() {
        this.undoStack = [];
        this.redoStack = [];
        this.updateSignals();
    }
    performUndo() {
        if (this.undoStack.length === 0)
            return null;
        const entry = this.undoStack.pop();
        if (!entry)
            return null;
        this.redoStack.push(entry);
        this.updateSignals();
        return this.cloneElements(entry.before);
    }
    performRedo() {
        if (this.redoStack.length === 0)
            return null;
        const entry = this.redoStack.pop();
        if (!entry)
            return null;
        this.undoStack.push(entry);
        this.updateSignals();
        return this.cloneElements(entry.after);
    }
    pushHistory(entry) {
        this.undoStack.push(entry);
        if (this.undoStack.length > this.MAX_HISTORY)
            this.undoStack.shift();
        this.redoStack = [];
        this.updateSignals();
    }
    updateSignals() {
        this.canUndoSignal.set(this.undoStack.length > 0);
        this.canRedoSignal.set(this.redoStack.length > 0);
        this.undoDescriptionSignal.set(this.undoStack[this.undoStack.length - 1]?.description);
        this.redoDescriptionSignal.set(this.redoStack[this.redoStack.length - 1]?.description);
    }
    cloneElements(elements) {
        return elements.map((el) => {
            const cloned = { ...el };
            const maybePoints = el.points;
            if (Array.isArray(maybePoints)) {
                cloned.points = maybePoints.map((pt) => [...pt]);
            }
            return cloned;
        });
    }
    snapshotsEqual(a, b) {
        if (a.length !== b.length)
            return false;
        const byIdA = new Map(a.map((e) => [e.id, e]));
        for (const el of b) {
            const prev = byIdA.get(el.id);
            if (!prev)
                return false;
            if (JSON.stringify(prev) !== JSON.stringify(el))
                return false;
        }
        return true;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: HistoryService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: HistoryService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: HistoryService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/**
 * Initiates the download of a file from a given URL.
 */
function downloadFile(url, name) {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('visibility', 'hidden');
    link.download = name || 'new white-board';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
/**
 * Creates a debounced function that delays invoking the provided function until after a specified wait time.
 */
function debounce(func, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

/**
 * Generates a unique identifier with a consistent length.
 */
function generateId() {
    const randomStr = Math.random().toString(36).substring(2);
    return randomStr.padEnd(12, '0').substring(0, 12);
}

const SELECTOR_GROUP_ID = 'selectorGroup';
const SVG_ROOT_ID = 'svgroot';
const ITEM_PREFIX = 'item_';
const SELECTOR_BOX = 'selectorBox';
const SELECTOR_GRIP_PREFIX = 'selectorGrip_';
const SELECTOR_GRIP_RESIZE = 'selectorGrip_resize';
const SELECTOR_GRIP_ROTATE = 'selectorGrip_rotate';
const MAX_STACK_SIZE = 1000;
const DATA_ID = 'data-wb-id';
const PRIORITY_WEIGHTS = {
    high: 3,
    normal: 2,
    low: 1,
};
const ZOOM_STEP = 0.25;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5.0;
const DEFAULT_ZOOM = 1.0;
const PAN_SENSITIVITY = 0.5;

/** Geometric computation utilities for angle calculations, line operations, collision detection, and vector math. */
/** Epsilon value for floating-point comparisons. */
const EPSILON = 0.000001;
/** Calculates the angle in degrees between a center point and a target point. */
function calculateAngle(center, point) {
    return Math.atan2(point.y - center.y, point.x - center.x) * (180 / Math.PI);
}
/** Normalizes an angle to the range [0, 360) degrees. */
function normalizeAngle(angle) {
    angle = angle % 360;
    return angle < 0 ? angle + 360 : angle;
}
/** Returns a constrained movement offset (horizontal or vertical only). */
function getSnappedOffset(dx, dy) {
    return Math.abs(dx) > Math.abs(dy) ? { x: dx, y: 0 } : { x: 0, y: dy };
}
/** Calculates the shortest distance from a point to a line segment. */
function pointToLineDistance(px, py, lineStart, lineEnd) {
    const x1 = lineStart.x;
    const y1 = lineStart.y;
    const x2 = lineEnd.x;
    const y2 = lineEnd.y;
    const lineLengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (lineLengthSquared === 0) {
        return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    }
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lineLengthSquared;
    t = Math.max(0, Math.min(1, t));
    const closestX = x1 + t * (x2 - x1);
    const closestY = y1 + t * (y2 - y1);
    return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);
}
/** Tests whether two line segments intersect. */
function lineSegmentsIntersect(p1, p2, q1, q2, threshold = EPSILON) {
    const cross = (v1, v2) => v1.x * v2.y - v1.y * v2.x;
    const subtract = (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y });
    const r = subtract(p2, p1);
    const s = subtract(q2, q1);
    const qp = subtract(q1, p1);
    const rsCross = cross(r, s);
    const qpCrossR = cross(qp, r);
    if (Math.abs(rsCross) < threshold) {
        if (Math.abs(qpCrossR) >= threshold) {
            return false;
        }
        const rdotr = r.x * r.x + r.y * r.y;
        const t0 = (qp.x * r.x + qp.y * r.y) / rdotr;
        const s_qp = subtract(q2, p1);
        const t1 = (s_qp.x * r.x + s_qp.y * r.y) / rdotr;
        return (t0 >= 0 && t0 <= 1) || (t1 >= 0 && t1 <= 1) || (t0 < 0 && t1 > 1) || (t0 > 1 && t1 < 0);
    }
    const t = qpCrossR / rsCross;
    const u = cross(qp, s) / rsCross;
    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}
/** Tests if an element's bounding box intersects with a selection box. */
function isElementInSelectionBox(bounds, selectionBox) {
    return (bounds.minX <= selectionBox.x + selectionBox.width &&
        bounds.maxX >= selectionBox.x &&
        bounds.minY <= selectionBox.y + selectionBox.height &&
        bounds.maxY >= selectionBox.y);
}
/** Calculates the rotated direction based on rotation angle. */
function getRotatedDirection(direction, rotation) {
    const normalizedRotation = Math.round(normalizeAngle(rotation) / 45) % 8;
    const directionValues = Object.values(Direction);
    const currentIndex = directionValues.indexOf(direction);
    const newIndex = (currentIndex + normalizedRotation) % 8;
    return directionValues[newIndex];
}

/** Tests if a line segment intersects with a bounding box. */
function hitTestBoundingBox(bounds, pointA, pointB, threshold) {
    const edges = [
        [
            { x: bounds.minX, y: bounds.minY },
            { x: bounds.maxX, y: bounds.minY },
        ],
        [
            { x: bounds.maxX, y: bounds.minY },
            { x: bounds.maxX, y: bounds.maxY },
        ],
        [
            { x: bounds.maxX, y: bounds.maxY },
            { x: bounds.minX, y: bounds.maxY },
        ],
        [
            { x: bounds.minX, y: bounds.maxY },
            { x: bounds.minX, y: bounds.minY },
        ],
    ];
    for (const [edgeStart, edgeEnd] of edges) {
        if (lineSegmentsIntersect(pointA, pointB, edgeStart, edgeEnd, threshold)) {
            return true;
        }
    }
    return false;
}
/** Tests if a line segment intersects with an ellipse. */
function hitTestEllipse(cx, cy, rx, ry, pointA, pointB, threshold) {
    return pointToLineDistance(cx, cy, pointA, pointB) <= Math.max(rx, ry) + threshold;
}
/** Tests if a line segment intersects with another line segment. */
function hitTestLine(x1, y1, x2, y2, pointA, pointB, threshold) {
    const lineStart = { x: x1, y: y1 };
    const lineEnd = { x: x2, y: y2 };
    return (pointToLineDistance(pointA.x, pointA.y, lineStart, lineEnd) <= threshold ||
        pointToLineDistance(pointB.x, pointB.y, lineStart, lineEnd) <= threshold);
}
/** Tests if a line segment intersects with a pen stroke. */
function hitTestPen(points, pointA, pointB, threshold) {
    for (let i = 0; i < points.length - 1; i++) {
        const segmentStart = { x: points[i][0], y: points[i][1] };
        const segmentEnd = { x: points[i + 1][0], y: points[i + 1][1] };
        if (pointToLineDistance(pointA.x, pointA.y, segmentStart, segmentEnd) <= threshold ||
            pointToLineDistance(pointB.x, pointB.y, segmentStart, segmentEnd) <= threshold) {
            return true;
        }
    }
    return false;
}

/**
 * Vector math utilities for stroke generation.
 */
/** Add vectors. */
function add(A, B) {
    return [A[0] + B[0], A[1] + B[1]];
}
/** Subtract vectors. */
function sub(A, B) {
    return [A[0] - B[0], A[1] - B[1]];
}
/** Vector multiplication by scalar. */
function mul(A, n) {
    return [A[0] * n, A[1] * n];
}
/** Vector division by scalar. */
function div(A, n) {
    return [A[0] / n, A[1] / n];
}
/** Length of the vector squared. */
function len2(A) {
    return A[0] * A[0] + A[1] * A[1];
}
/** Length from A to B squared. */
function dist2(A, B) {
    return len2(sub(A, B));
}
/** Distance from A to B. */
function dist(A, B) {
    return Math.hypot(A[1] - B[1], A[0] - B[0]);
}
/** Interpolate vector A to B with a scalar t. */
function lrp(A, B, t) {
    return add(A, mul(sub(B, A), t));
}
function toPoint(arr) {
    const x = arr[0] !== undefined ? arr[0] : 0;
    const y = arr[1] !== undefined ? arr[1] : 0;
    const pressure = arr[2] !== undefined ? arr[2] : 1;
    return [x, y, pressure];
}
function equals(a, b) {
    return Math.abs(a[0] - b[0]) < 0.0001 && Math.abs(a[1] - b[1]) < 0.0001;
}

class ArrowElementUtil {
    create(props) {
        return {
            type: ElementType.Arrow,
            id: generateId(),
            x: 0,
            y: 0,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            rotation: 0,
            opacity: 100,
            zIndex: 1, // Default zIndex, will be overridden by tools
            selectAfterDraw: true, // Arrows should be selected after drawing by default
            ...props,
            style: {
                ...defaultElementStyle,
                ...props.style,
            },
        };
    }
    resize(element, direction, dx, dy) {
        if (direction.includes(Direction.N))
            element.y2 += dy;
        if (direction.includes(Direction.S))
            element.y1 += dy;
        if (direction.includes(Direction.W))
            element.x1 += dx;
        if (direction.includes(Direction.E))
            element.x2 += dx;
        return element;
    }
    getBounds(element) {
        const x1 = element.x1 + element.x;
        const y1 = element.y1 + element.y;
        const x2 = element.x2 + element.x;
        const y2 = element.y2 + element.y;
        return {
            minX: Math.min(x1, x2),
            minY: Math.min(y1, y2),
            maxX: Math.max(x1, x2),
            maxY: Math.max(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
        };
    }
    hitTest(element, pointA, pointB, threshold) {
        const { x1, y1, x2, y2 } = element;
        return hitTestLine(x1, y1, x2, y2, pointA, pointB, threshold);
    }
}

class EllipseElementUtil {
    create(props) {
        return {
            type: ElementType.Ellipse,
            id: generateId(),
            x: 0,
            y: 0,
            cx: 0,
            cy: 0,
            rx: 1,
            ry: 1,
            rotation: 0,
            opacity: 100,
            zIndex: 1, // Default zIndex, will be overridden by tools
            selectAfterDraw: true, // Ellipses should be selected after drawing by default
            ...props,
            style: {
                ...defaultElementStyle,
                ...props.style,
            },
        };
    }
    resize(element, direction, dx, dy) {
        if (direction.includes(Direction.N)) {
            const newRy = element.ry - dy / 2;
            if (newRy > 0) {
                element.ry = newRy;
                element.cy += dy / 2;
            }
        }
        if (direction.includes(Direction.S)) {
            const newRy = element.ry + dy / 2;
            if (newRy > 0) {
                element.ry = newRy;
                element.cy += dy / 2;
            }
        }
        if (direction.includes(Direction.W)) {
            const newRx = element.rx - dx / 2;
            if (newRx > 0) {
                element.rx = newRx;
                element.cx += dx / 2;
            }
        }
        if (direction.includes(Direction.E)) {
            const newRx = element.rx + dx / 2;
            if (newRx > 0) {
                element.rx = newRx;
                element.cx += dx / 2;
            }
        }
        return element;
    }
    getBounds(element) {
        const globalCx = element.cx + element.x;
        const globalCy = element.cy + element.y;
        return {
            minX: globalCx - element.rx,
            minY: globalCy - element.ry,
            maxX: globalCx + element.rx,
            maxY: globalCy + element.ry,
            width: element.rx * 2,
            height: element.ry * 2,
        };
    }
    hitTest(element, pointA, pointB, threshold) {
        const { cx, cy, rx, ry } = element;
        return hitTestEllipse(cx, cy, rx, ry, pointA, pointB, threshold);
    }
}

class ImageElementUtil {
    create(props) {
        return {
            type: ElementType.Image,
            id: generateId(),
            x: 0,
            y: 0,
            width: 1,
            height: 1,
            src: '',
            rotation: 0,
            opacity: 100,
            zIndex: 1, // Default zIndex, will be overridden by tools
            selectAfterDraw: true, // Images should be selected after drawing by default
            ...props,
            style: {
                ...defaultElementStyle,
                ...props.style,
            },
        };
    }
    resize(element, direction, dx, dy) {
        if (direction.includes(Direction.N)) {
            const newHeight = element.height - dy;
            if (newHeight > 0) {
                element.y += dy;
                element.height = newHeight;
            }
        }
        if (direction.includes(Direction.S)) {
            const newHeight = element.height + dy;
            if (newHeight > 0) {
                element.height = newHeight;
            }
        }
        if (direction.includes(Direction.W)) {
            const newWidth = element.width - dx;
            if (newWidth > 0) {
                element.x += dx;
                element.width = newWidth;
            }
        }
        if (direction.includes(Direction.E)) {
            const newWidth = element.width + dx;
            if (newWidth > 0) {
                element.width = newWidth;
            }
        }
        return element;
    }
    getBounds(element) {
        return {
            minX: element.x,
            minY: element.y,
            maxX: element.x + element.width,
            maxY: element.y + element.height,
            width: element.width,
            height: element.height,
        };
    }
    hitTest(element, pointA, pointB, threshold) {
        const bounds = this.getBounds(element);
        return hitTestBoundingBox(bounds, pointA, pointB, threshold);
    }
}

class LineElementUtil {
    create(props) {
        return {
            type: ElementType.Line,
            id: generateId(),
            x: 0,
            y: 0,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            rotation: 0,
            opacity: 100,
            zIndex: 1, // Default zIndex, will be overridden by tools
            selectAfterDraw: true, // Lines should be selected after drawing by default
            ...props,
            style: {
                ...defaultElementStyle,
                ...props.style,
            },
        };
    }
    resize(element, direction, dx, dy) {
        if (direction.includes(Direction.N))
            element.y1 += dy;
        if (direction.includes(Direction.S))
            element.y2 += dy;
        if (direction.includes(Direction.W))
            element.x1 += dx;
        if (direction.includes(Direction.E))
            element.x2 += dx;
        return element;
    }
    getBounds(element) {
        const x1 = element.x1 + element.x;
        const y1 = element.y1 + element.y;
        const x2 = element.x2 + element.x;
        const y2 = element.y2 + element.y;
        return {
            minX: Math.min(x1, x2),
            minY: Math.min(y1, y2),
            maxX: Math.max(x1, x2),
            maxY: Math.max(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
        };
    }
    hitTest(element, pointA, pointB, threshold) {
        const { x1, y1, x2, y2 } = element;
        return hitTestLine(x1, y1, x2, y2, pointA, pointB, threshold);
    }
}

/** Utilities for working with axis-aligned bounding boxes (AABB). */
/** Calculates the axis-aligned bounding box for a set of 2D points. */
function calculateBoundingBox(points) {
    if (points.length === 0) {
        throw new Error('Cannot calculate bounding box for empty points array');
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const [x, y] of points) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    }
    return {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX,
        height: maxY - minY,
    };
}
/** Checks if two axis-aligned bounding boxes intersect or overlap. */
function doBoundingBoxesIntersect(box1, box2) {
    return box1.minX <= box2.maxX && box1.maxX >= box2.minX && box1.minY <= box2.maxY && box1.maxY >= box2.minY;
}
/** Converts a box representation (x, y, width, height) to a Bounds object. */
function boxToBounds(box) {
    return {
        minX: box.x,
        minY: box.y,
        maxX: box.x + box.width,
        maxY: box.y + box.height,
        width: box.width,
        height: box.height,
    };
}
/** Tests if a point is contained within a bounding box. */
function isPointInBounds(bounds, point) {
    return point.x >= bounds.minX && point.x <= bounds.maxX && point.y >= bounds.minY && point.y <= bounds.maxY;
}
/** Calculates the center point of a bounding box. */
function getBoundsCenter(bounds) {
    return {
        x: bounds.minX + bounds.width / 2,
        y: bounds.minY + bounds.height / 2,
    };
}
/** Tests if a line segment potentially intersects with a bounding box. */
function isBoundsIntersect(bounds, p1, p2, margin) {
    return (bounds.minX - margin <= Math.max(p1.x, p2.x) &&
        bounds.maxX + margin >= Math.min(p1.x, p2.x) &&
        bounds.minY - margin <= Math.max(p1.y, p2.y) &&
        bounds.maxY + margin >= Math.min(p1.y, p2.y));
}

class PenElementUtil {
    create(props) {
        return {
            type: ElementType.Pen,
            id: generateId(),
            x: 0,
            y: 0,
            points: [],
            rotation: 0,
            opacity: 100,
            zIndex: 1, // Default zIndex, will be overridden by tools
            selectAfterDraw: false, // Pen strokes should NOT be selected after drawing by default
            ...props,
            style: {
                ...defaultElementStyle,
                ...props.style,
            },
        };
    }
    resize(element, direction, dx, dy) {
        const bounds = calculateBoundingBox(element.points);
        const { points, position } = this.getScaleFactors(direction, bounds, dx, dy);
        const centerX = bounds.minX + bounds.width / 2;
        const centerY = bounds.minY + bounds.height / 2;
        const [scaleX, scaleY] = points;
        if (bounds.width * scaleX < 10 || bounds.height * scaleY < 10) {
            return element;
        }
        element.x += position.x;
        element.y += position.y;
        element.points = element.points.map((point) => [
            centerX + (point[0] - centerX) * scaleX,
            centerY + (point[1] - centerY) * scaleY,
        ]);
        return element;
    }
    getScaleFactors(direction, bounds, dx, dy) {
        const points = [1, 1];
        const position = { x: 0, y: 0 };
        if (direction.includes('w')) {
            points[0] = (bounds.width - dx) / bounds.width;
            position.x += dx / 2;
        }
        if (direction.includes('n')) {
            points[1] = (bounds.height - dy) / bounds.height;
            position.y += dy / 2;
        }
        if (direction.includes('e')) {
            points[0] = (bounds.width + dx) / bounds.width;
            position.x += dx / 2;
        }
        if (direction.includes('s')) {
            points[1] = (bounds.height + dy) / bounds.height;
            position.y += dy / 2;
        }
        return { points, position };
    }
    getBounds(element) {
        const { minX, minY, maxX, maxY, width, height } = calculateBoundingBox(element.points);
        return {
            minX: minX + element.x,
            minY: minY + element.y,
            maxX: maxX + element.x,
            maxY: maxY + element.y,
            width,
            height,
        };
    }
    hitTest(element, pointA, pointB, threshold) {
        return hitTestPen(element.points, pointA, pointB, threshold);
    }
}

class RectangleElementUtil {
    create(props) {
        return {
            type: ElementType.Rectangle,
            id: generateId(),
            x: 0,
            y: 0,
            width: 1,
            height: 1,
            rx: 5,
            rotation: 0,
            opacity: 100,
            zIndex: 1, // Default zIndex, will be overridden by tools
            selectAfterDraw: true, // Rectangles should be selected after drawing by default
            ...props,
            style: {
                ...defaultElementStyle,
                ...props.style,
            },
        };
    }
    resize(element, direction, dx, dy) {
        if (direction.includes(Direction.N)) {
            const newHeight = element.height - dy;
            if (newHeight > 0) {
                element.y += dy;
                element.height = newHeight;
            }
        }
        if (direction.includes(Direction.S)) {
            const newHeight = element.height + dy;
            if (newHeight > 0) {
                element.height = newHeight;
            }
        }
        if (direction.includes(Direction.W)) {
            const newWidth = element.width - dx;
            if (newWidth > 0) {
                element.x += dx;
                element.width = newWidth;
            }
        }
        if (direction.includes(Direction.E)) {
            const newWidth = element.width + dx;
            if (newWidth > 0) {
                element.width = newWidth;
            }
        }
        return element;
    }
    getBounds(element) {
        return {
            minX: element.x,
            minY: element.y,
            maxX: element.x + element.width,
            maxY: element.y + element.height,
            width: element.width,
            height: element.height,
        };
    }
    hitTest(element, pointA, pointB, threshold) {
        const bounds = this.getBounds(element);
        return hitTestBoundingBox(bounds, pointA, pointB, threshold);
    }
}

class TextElementUtil {
    create(props) {
        return {
            type: ElementType.Text,
            id: generateId(),
            x: 0,
            y: 0,
            text: '',
            rotation: 0,
            opacity: 100,
            zIndex: 1, // Default zIndex, will be overridden by tools
            selectAfterDraw: true, // Text should be selected after drawing by default
            scaleX: 1,
            scaleY: 1,
            ...props,
            style: {
                ...defaultTextElementStyle,
                ...props.style,
            },
        };
    }
    resize(element, direction, dx, dy) {
        const MIN_SCALE = 0.1;
        const SCALE_FACTOR = 0.016;
        const scaleXChange = dx * SCALE_FACTOR;
        const scaleYChange = dy * SCALE_FACTOR;
        switch (direction) {
            case Direction.NW:
                element.x += dx;
                element.y += dy;
                element.scaleX = Math.max(MIN_SCALE, element.scaleX - scaleXChange);
                element.scaleY = Math.max(MIN_SCALE, element.scaleY - scaleYChange);
                break;
            case Direction.N:
                element.y += dy;
                element.scaleY = Math.max(MIN_SCALE, element.scaleY - scaleYChange);
                break;
            case Direction.NE:
                element.y += dy;
                element.scaleX = Math.max(MIN_SCALE, element.scaleX + scaleXChange);
                element.scaleY = Math.max(MIN_SCALE, element.scaleY - scaleYChange);
                break;
            case Direction.E:
                element.scaleX = Math.max(MIN_SCALE, element.scaleX + scaleXChange);
                break;
            case Direction.SE:
                element.scaleX = Math.max(MIN_SCALE, element.scaleX + scaleXChange);
                element.scaleY = Math.max(MIN_SCALE, element.scaleY + scaleYChange);
                break;
            case Direction.S:
                element.scaleY = Math.max(MIN_SCALE, element.scaleY + scaleYChange);
                break;
            case Direction.SW:
                element.x += dx;
                element.scaleX = Math.max(MIN_SCALE, element.scaleX - scaleXChange);
                element.scaleY = Math.max(MIN_SCALE, element.scaleY + scaleYChange);
                break;
            case Direction.W:
                element.x += dx;
                element.scaleX = Math.max(MIN_SCALE, element.scaleX - scaleXChange);
                break;
        }
        return element;
    }
    getBounds(element) {
        const { text, x, y, scaleX, scaleY, style } = element;
        const fontSize = style.fontSize ?? defaultTextElementStyle.fontSize ?? 16;
        const lineHeight = fontSize * 1.2; // Match the line-height from rendering
        const approximateCharWidth = fontSize * 0.6; // Slightly more accurate char width
        const lines = text.split('\n');
        const maxChars = lines.reduce((max, line) => Math.max(max, line.length), 0);
        // Calculate actual width and height
        const width = approximateCharWidth * maxChars * scaleX || fontSize * scaleX; // Minimum width
        const height = lineHeight * lines.length * scaleY || fontSize * scaleY; // Minimum height
        // SVG text y coordinate is at the baseline, so we need to offset upward
        // The first line starts approximately 0.8 * fontSize above the baseline
        const baselineOffset = fontSize * 0.8 * scaleY;
        return {
            minX: x,
            minY: y - baselineOffset,
            maxX: x + width,
            maxY: y - baselineOffset + height,
            width,
            height,
        };
    }
    hitTest(element, pointA, pointB, threshold) {
        const bounds = this.getBounds(element);
        return hitTestBoundingBox(bounds, pointA, pointB, threshold);
    }
}

const elementUtilsMap = {
    [ElementType.Arrow]: new ArrowElementUtil(),
    [ElementType.Ellipse]: new EllipseElementUtil(),
    [ElementType.Image]: new ImageElementUtil(),
    [ElementType.Line]: new LineElementUtil(),
    [ElementType.Pen]: new PenElementUtil(),
    [ElementType.Rectangle]: new RectangleElementUtil(),
    [ElementType.Text]: new TextElementUtil(),
};
function getElementUtil(type) {
    return elementUtilsMap[type];
}
// Global active layer provider (set by EditorStateService)
let getActiveLayerId = null;
function setActiveLayerProvider(provider) {
    getActiveLayerId = provider;
}
function createElement(type, props, layerId) {
    const targetLayerId = layerId || (getActiveLayerId ? getActiveLayerId() : '');
    const elementProps = { ...props, layerId: targetLayerId };
    return elementUtilsMap[type].create(elementProps);
}

/** Get the bounding box of an element from the DOM. */
function getElementBbox(svgContainer, element) {
    const elementId = `${ITEM_PREFIX}${element.id}`;
    const el = svgContainer.querySelector(`#${elementId}`);
    if (el) {
        return el.getBBox();
    }
    throw new Error(`Element with id ${elementId} not found`);
}
/** Get the bounds of an element. */
function getElementBounds(element) {
    return getElementUtil(element.type).getBounds(element);
}

/** Get the target element from a pointer event. */
function getTargetElement(info, data) {
    const mouseTarget = getMouseTarget(info);
    if (mouseTarget) {
        if (mouseTarget.id === SELECTOR_GROUP_ID) {
            return null;
        }
        const id = mouseTarget.getAttribute(DATA_ID);
        const element = data.find((el) => el.id === id);
        return element || null;
    }
    return null;
}
/** Get the mouse target element from a pointer event. */
function getMouseTarget(info) {
    if (!info?.target) {
        return null;
    }
    let mouseTarget = info.target;
    while (mouseTarget) {
        if (mouseTarget.id === SVG_ROOT_ID) {
            return null;
        }
        if (mouseTarget.id.includes(ITEM_PREFIX) ||
            mouseTarget.id.includes(SELECTOR_GRIP_PREFIX) ||
            mouseTarget.id.includes(SELECTOR_BOX)) {
            return mouseTarget;
        }
        if (mouseTarget.parentNode) {
            mouseTarget = mouseTarget.parentNode;
        }
        else {
            break;
        }
    }
    return null;
}

/** Coordinate transformation utilities for screen ↔ canvas conversion with zoom, pan, and grid snapping. */
/** Converts screen coordinates to canvas coordinates accounting for zoom and pan. */
function getCanvasCoordinates(config, point) {
    const { zoom, x, y, canvasX, canvasY, fullScreen } = config;
    if (fullScreen) {
        const realX = point.x / zoom - x;
        const realY = point.y / zoom - y;
        return { x: realX, y: realY };
    }
    const relativeToInnerX = point.x - canvasX;
    const relativeToInnerY = point.y - canvasY;
    const realX = relativeToInnerX / zoom - x;
    const realY = relativeToInnerY / zoom - y;
    return { x: realX, y: realY };
}
/** Snaps a point to the closest 45-degree angle relative to an origin point. */
function snapToAngle(x1, y1, x2, y2) {
    const SNAP_ANGLE = Math.PI / 4;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const snappedAngle = Math.round(angle / SNAP_ANGLE) * SNAP_ANGLE;
    const x = x1 + distance * Math.cos(snappedAngle);
    const y = y1 + distance * Math.sin(snappedAngle);
    return { x, y, a: snappedAngle };
}
/** Snaps a single numeric value to the nearest grid point. */
function snapToGrid(n, gridSize) {
    return Math.round(n / gridSize) * gridSize;
}
/** Snaps a 2D point to the nearest grid intersection. */
function snapPointToGrid(point, gridSize) {
    return {
        x: snapToGrid(point.x, gridSize),
        y: snapToGrid(point.y, gridSize),
    };
}

/**
 * Utilities for geometric transformations and bounding box calculations.
 */
/**
 * Calculates the screen-space bounding box for an element, accounting for rotation.
 */
function getElementScreenBounds(element) {
    const globalBounds = getElementBounds(element);
    if (!element.rotation || element.rotation === 0) {
        return globalBounds;
    }
    const localCenterX = globalBounds.width / 2;
    const localCenterY = globalBounds.height / 2;
    const localCorners = [
        { x: 0, y: 0 },
        { x: globalBounds.width, y: 0 },
        { x: globalBounds.width, y: globalBounds.height },
        { x: 0, y: globalBounds.height },
    ];
    const rotation = (element.rotation || 0) * (Math.PI / 180);
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const rotatedCorners = localCorners.map((corner) => {
        const dx = corner.x - localCenterX;
        const dy = corner.y - localCenterY;
        const rotatedX = dx * cos - dy * sin;
        const rotatedY = dx * sin + dy * cos;
        return {
            x: rotatedX + localCenterX,
            y: rotatedY + localCenterY,
        };
    });
    const globalCorners = rotatedCorners.map((corner) => ({
        x: corner.x + element.x,
        y: corner.y + element.y,
    }));
    const xs = globalCorners.map((p) => p.x);
    const ys = globalCorners.map((p) => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    return {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX,
        height: maxY - minY,
    };
}
/**
 * Calculates the combined bounding box for multiple elements in screen space.
 */
function getCombinedScreenBounds(elements) {
    if (elements.length === 0) {
        return null;
    }
    const allBounds = elements.map((el) => getElementScreenBounds(el));
    const minX = Math.min(...allBounds.map((b) => b.minX));
    const minY = Math.min(...allBounds.map((b) => b.minY));
    const maxX = Math.max(...allBounds.map((b) => b.maxX));
    const maxY = Math.max(...allBounds.map((b) => b.maxY));
    return {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX,
        height: maxY - minY,
    };
}
/**
 * Rotates a point around a center point by a given angle.
 */
function rotatePointAroundCenter(point, center, angleDegrees) {
    const angleRadians = angleDegrees * (Math.PI / 180);
    const cos = Math.cos(angleRadians);
    const sin = Math.sin(angleRadians);
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    return {
        x: center.x + dx * cos - dy * sin,
        y: center.y + dx * sin + dy * cos,
    };
}

// Utility modules

class LayerManagementService {
    // Core state signals
    _layers = signal([]);
    _activeLayerId = signal('');
    // Public readonly signals
    layers = this._layers.asReadonly();
    activeLayerId = this._activeLayerId.asReadonly();
    // Computed selectors
    activeLayer = computed(() => {
        const layers = this._layers();
        const activeId = this._activeLayerId();
        return layers.find((layer) => layer.id === activeId) || layers[0];
    });
    sortedLayers = computed(() => {
        return [...this._layers()].sort((a, b) => a.zIndex - b.zIndex);
    });
    visibleLayers = computed(() => {
        return this._layers().filter((layer) => layer.visible);
    });
    unlockedLayers = computed(() => {
        return this._layers().filter((layer) => !layer.locked);
    });
    constructor() {
        this.initializeDefaultLayer();
    }
    /**
     * Add a new layer
     */
    addLayer(name) {
        const layers = this._layers();
        const newZIndex = Math.max(...layers.map((l) => l.zIndex), 0) + 1;
        const layerCount = layers.length + 1;
        const newLayer = {
            id: this.generateLayerId(),
            name: name || `Layer ${layerCount}`,
            visible: true,
            locked: false,
            zIndex: newZIndex,
            elements: [],
            opacity: 1,
            blendMode: 'normal',
        };
        // Make all other layers invisible
        const updatedLayers = layers.map((layer) => ({
            ...layer,
            visible: false,
        }));
        this._layers.set([...updatedLayers, newLayer]);
        this.setActiveLayer(newLayer.id);
        return newLayer;
    }
    /**
     * Remove a layer (prevents deletion of last layer)
     */
    removeLayer(id) {
        const layers = this._layers();
        // Prevent deletion of last remaining layer
        if (layers.length <= 1) {
            console.warn('Cannot delete the last remaining layer');
            return false;
        }
        const layerToRemove = layers.find((l) => l.id === id);
        if (!layerToRemove) {
            console.warn(`Layer with id ${id} not found`);
            return false;
        }
        // Remove layer
        const updatedLayers = layers.filter((l) => l.id !== id);
        this._layers.set(updatedLayers);
        // If active layer was removed, set new active layer
        if (this._activeLayerId() === id) {
            const newActiveLayer = updatedLayers[Math.max(0, updatedLayers.length - 1)];
            this.setActiveLayer(newActiveLayer.id);
        }
        return true;
    }
    /**
     * Rename a layer
     */
    renameLayer(id, name) {
        const layers = this._layers();
        const layerIndex = layers.findIndex((l) => l.id === id);
        if (layerIndex === -1) {
            console.warn(`Layer with id ${id} not found`);
            return false;
        }
        // Prevent renaming locked layers
        if (layers[layerIndex].locked) {
            console.warn(`Cannot rename locked layer: ${layers[layerIndex].name}`);
            return false;
        }
        const updatedLayers = [...layers];
        updatedLayers[layerIndex] = {
            ...updatedLayers[layerIndex],
            name: name.trim() || `Layer ${layerIndex + 1}`,
        };
        this._layers.set(updatedLayers);
        return true;
    }
    /**
     * Reorder layer by changing zIndex
     */
    reorderLayer(id, newZIndex) {
        const layers = this._layers();
        const layerIndex = layers.findIndex((l) => l.id === id);
        if (layerIndex === -1) {
            console.warn(`Layer with id ${id} not found`);
            return false;
        }
        // Prevent reordering locked layers
        if (layers[layerIndex].locked) {
            console.warn(`Cannot reorder locked layer: ${layers[layerIndex].name}`);
            return false;
        }
        const updatedLayers = [...layers];
        updatedLayers[layerIndex] = {
            ...updatedLayers[layerIndex],
            zIndex: newZIndex,
        };
        this._layers.set(updatedLayers);
        return true;
    }
    /**
     * Move layer up in z-order
     */
    moveLayerUp(id) {
        const layers = this.sortedLayers();
        const currentIndex = layers.findIndex((l) => l.id === id);
        if (currentIndex === -1 || currentIndex === layers.length - 1) {
            return false; // Layer not found or already at top
        }
        const currentLayer = layers[currentIndex];
        // Prevent moving locked layers
        if (currentLayer.locked) {
            console.warn(`Cannot move locked layer: ${currentLayer.name}`);
            return false;
        }
        const nextLayer = layers[currentIndex + 1];
        // Swap z-indices
        return this.reorderLayer(currentLayer.id, nextLayer.zIndex) && this.reorderLayer(nextLayer.id, currentLayer.zIndex);
    }
    /**
     * Move layer down in z-order
     */
    moveLayerDown(id) {
        const layers = this.sortedLayers();
        const currentIndex = layers.findIndex((l) => l.id === id);
        if (currentIndex === -1 || currentIndex === 0) {
            return false; // Layer not found or already at bottom
        }
        const currentLayer = layers[currentIndex];
        // Prevent moving locked layers
        if (currentLayer.locked) {
            console.warn(`Cannot move locked layer: ${currentLayer.name}`);
            return false;
        }
        const prevLayer = layers[currentIndex - 1];
        // Swap z-indices
        return this.reorderLayer(currentLayer.id, prevLayer.zIndex) && this.reorderLayer(prevLayer.id, currentLayer.zIndex);
    }
    /**
     * Reorder layers by moving a layer from one position to another
     * This properly reassigns zIndex values based on the new order
     *
     * @param previousIndex - Current index in the layers array
     * @param currentIndex - Target index in the layers array
     * @returns true if successful, false otherwise
     */
    reorderLayersByIndex(previousIndex, currentIndex) {
        const layers = this._layers();
        if (previousIndex === currentIndex) {
            return false; // No change needed
        }
        if (previousIndex < 0 || previousIndex >= layers.length || currentIndex < 0 || currentIndex >= layers.length) {
            console.warn('Invalid layer indices for reordering');
            return false;
        }
        const layerToMove = layers[previousIndex];
        // Prevent moving locked layers
        if (layerToMove.locked) {
            console.warn(`Cannot reorder locked layer: ${layerToMove.name}`);
            return false;
        }
        // Create new array with the layer moved to its new position
        const reorderedLayers = [...layers];
        reorderedLayers.splice(previousIndex, 1); // Remove from old position
        reorderedLayers.splice(currentIndex, 0, layerToMove); // Insert at new position
        // Reassign zIndex values based on new array order
        // Lower index = higher zIndex (renders on top)
        const updatedLayers = reorderedLayers.map((layer, index) => ({
            ...layer,
            zIndex: reorderedLayers.length - 1 - index, // Reverse: first item gets highest zIndex
        }));
        this._layers.set(updatedLayers);
        return true;
    }
    /**
     * Toggle layer visibility
     */
    toggleLayerVisibility(id) {
        return this.updateLayerProperty(id, 'visible', (current) => !current);
    }
    /**
     * Toggle layer lock state
     *
     * Behavior:
     * - Allows locking/unlocking any layer including the active layer
     * - When active layer is locked, drawing will be disabled but layer remains active
     */
    toggleLayerLock(id) {
        const layers = this._layers();
        const layer = layers.find((l) => l.id === id);
        if (!layer) {
            console.warn(`Layer with id ${id} not found`);
            return false;
        }
        return this.updateLayerProperty(id, 'locked', (current) => !current);
    }
    /**
     * Set layer opacity
     */
    setLayerOpacity(id, opacity) {
        const layers = this._layers();
        const layer = layers.find((l) => l.id === id);
        if (!layer) {
            console.warn(`Layer with id ${id} not found`);
            return false;
        }
        // Prevent changing opacity of locked layers
        if (layer.locked) {
            console.warn(`Cannot change opacity of locked layer: ${layer.name}`);
            return false;
        }
        const clampedOpacity = Math.max(0, Math.min(1, opacity));
        return this.updateLayerProperty(id, 'opacity', () => clampedOpacity);
    }
    /**
     * Set layer blend mode
     */
    setLayerBlendMode(id, blendMode) {
        const layers = this._layers();
        const layer = layers.find((l) => l.id === id);
        if (!layer) {
            console.warn(`Layer with id ${id} not found`);
            return false;
        }
        // Prevent changing blend mode of locked layers
        if (layer.locked) {
            console.warn(`Cannot change blend mode of locked layer: ${layer.name}`);
            return false;
        }
        // Validate blend mode
        const validBlendModes = BLEND_MODES.map((mode) => mode.value);
        if (!validBlendModes.includes(blendMode)) {
            console.warn(`Invalid blend mode: ${blendMode}. Using 'normal' instead.`);
            return this.updateLayerProperty(id, 'blendMode', () => 'normal');
        }
        return this.updateLayerProperty(id, 'blendMode', () => blendMode);
    }
    /**
     * Set the active layer
     *
     * Behavior:
     * - Allows activating any layer including locked layers
     * - When a locked layer is active, drawing will be disabled
     * - Makes all other layers invisible when a layer is activated
     * - This ensures only the active layer is visible
     */
    setActiveLayer(id) {
        const layers = this._layers();
        const layer = layers.find((l) => l.id === id);
        if (!layer) {
            console.warn(`Layer with id ${id} not found`);
            return false;
        }
        // Make all layers invisible except the one being activated
        const updatedLayers = layers.map((l) => ({
            ...l,
            visible: l.id === id,
        }));
        this._layers.set(updatedLayers);
        this._activeLayerId.set(id);
        return true;
    }
    /**
     * Get the active layer ID
     */
    getActiveLayerId() {
        return this._activeLayerId();
    }
    /**
     * Check if the active layer is in a valid drawing state
     * Valid means: exists, visible, and unlocked
     */
    isActiveLayerValid() {
        const active = this.activeLayer();
        return !!active && active.visible && !active.locked;
    }
    /**
     * Get any issues with the current active layer
     * Returns empty array if no issues
     */
    getActiveLayerIssues() {
        const active = this.activeLayer();
        if (!active)
            return ['No active layer'];
        const issues = [];
        if (!active.visible)
            issues.push('Active layer is hidden');
        if (active.locked)
            issues.push('Active layer is locked');
        return issues;
    }
    // ELEMENT ASSOCIATION
    /**
     * Assign element to active layer
     */
    assignElementToActiveLayer(elementId) {
        const activeLayerId = this._activeLayerId();
        return this.assignElementToLayer(elementId, activeLayerId);
    }
    /**
     * Assign element to specific layer
     */
    assignElementToLayer(elementId, layerId) {
        const layers = this._layers();
        const layerIndex = layers.findIndex((l) => l.id === layerId);
        if (layerIndex === -1) {
            console.warn(`Layer with id ${layerId} not found`);
            return false;
        }
        // Prevent assigning elements to locked layers
        if (layers[layerIndex].locked) {
            console.warn(`Cannot assign elements to locked layer: ${layers[layerIndex].name}`);
            return false;
        }
        // Remove element from all other layers first
        this.removeElementFromAllLayers(elementId);
        // Add to target layer - get fresh layers after removal
        const freshLayers = this._layers();
        const freshLayerIndex = freshLayers.findIndex((l) => l.id === layerId);
        const updatedLayers = [...freshLayers];
        const updatedElements = [...updatedLayers[freshLayerIndex].elements];
        if (!updatedElements.includes(elementId)) {
            updatedElements.push(elementId);
            updatedLayers[freshLayerIndex] = {
                ...updatedLayers[freshLayerIndex],
                elements: updatedElements,
            };
            this._layers.set(updatedLayers);
        }
        return true;
    }
    /**
     * Remove element from all layers
     */
    removeElementFromAllLayers(elementId) {
        const layers = this._layers();
        const updatedLayers = layers.map((layer) => ({
            ...layer,
            elements: layer.elements.filter((id) => id !== elementId),
        }));
        this._layers.set(updatedLayers);
    }
    /**
     * Get layer containing element
     */
    getElementLayer(elementId) {
        const layers = this._layers();
        return layers.find((layer) => layer.elements.includes(elementId)) || null;
    }
    // RENDERING HELPERS
    /**
     * Get elements from visible layers only
     */
    getVisibleElements(allElements) {
        const visibleLayers = this.visibleLayers();
        const visibleElementIds = new Set(visibleLayers.flatMap((layer) => layer.elements));
        return allElements.filter((element) => visibleElementIds.has(element.id));
    }
    /**
     * Get elements from unlocked layers only (for editing)
     */
    getEditableElements(allElements) {
        const unlockedLayers = this.unlockedLayers();
        const editableElementIds = new Set(unlockedLayers.flatMap((layer) => layer.elements));
        return allElements.filter((element) => editableElementIds.has(element.id));
    }
    /**
     * Get elements sorted by layer z-index
     */
    getSortedElements(allElements) {
        const sortedLayers = this.sortedLayers();
        const elementLayerMap = new Map();
        // Map each element to its layer's z-index
        sortedLayers.forEach((layer) => {
            layer.elements.forEach((elementId) => {
                elementLayerMap.set(elementId, layer.zIndex);
            });
        });
        return allElements.sort((a, b) => {
            const aZIndex = elementLayerMap.get(a.id) ?? 0;
            const bZIndex = elementLayerMap.get(b.id) ?? 0;
            return aZIndex - bZIndex;
        });
    }
    // EXPORT/IMPORT SUPPORT
    /**
     * Serialize layer state for saving
     */
    exportLayerState() {
        return {
            layers: this._layers(),
            activeLayerId: this._activeLayerId(),
        };
    }
    /**
     * Restore layer state from saved data
     */
    importLayerState(state) {
        if (!state.layers || state.layers.length === 0) {
            console.warn('Invalid layer state provided');
            this.initializeDefaultLayer();
            return;
        }
        this._layers.set(state.layers);
        // Validate active layer
        const activeLayer = state.layers.find((l) => l.id === state.activeLayerId);
        this._activeLayerId.set(activeLayer ? state.activeLayerId : state.layers[0].id);
    }
    /**
     * Reset to default state
     */
    reset() {
        this.initializeDefaultLayer();
    }
    // PRIVATE HELPERS
    initializeDefaultLayer() {
        const defaultLayer = {
            id: 'default',
            name: 'Layer 1',
            visible: true,
            locked: false,
            zIndex: 0,
            elements: [],
            opacity: 1,
            blendMode: 'normal',
        };
        this._layers.set([defaultLayer]);
        this._activeLayerId.set(defaultLayer.id);
    }
    generateLayerId() {
        return `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    updateLayerProperty(id, property, updater) {
        const layers = this._layers();
        const layerIndex = layers.findIndex((l) => l.id === id);
        if (layerIndex === -1) {
            console.warn(`Layer with id ${id} not found`);
            return false;
        }
        const updatedLayers = [...layers];
        const currentValue = updatedLayers[layerIndex][property];
        updatedLayers[layerIndex] = {
            ...updatedLayers[layerIndex],
            [property]: updater(currentValue),
        };
        this._layers.set(updatedLayers);
        return true;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: LayerManagementService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: LayerManagementService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: LayerManagementService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class ElementsService {
    eventBus;
    historyService = inject(HistoryService);
    layerManagement = inject(LayerManagementService);
    // Signal-based state management
    _elements = signal([]);
    _draftElements = signal([]);
    _maxZIndex = signal(0);
    _locks = signal(new Map());
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    elements = this._elements.asReadonly();
    /**
     * Signal containing all draft (temporary) elements
     */
    draftElements = this._draftElements.asReadonly();
    /**
     * Computed signal containing all elements (persistent + draft)
     */
    allElements = computed(() => [...this._elements(), ...this._draftElements()]);
    /**
     * Computed signal for elements count
     */
    elementsCount = computed(() => this._elements().length);
    /**
     * Computed signal checking if elements exist
     */
    hasElements = computed(() => this.elementsCount() > 0);
    /**
     * Computed signal for unique element types
     */
    elementTypes = computed(() => {
        const types = this._elements().map((el) => el.type);
        return [...new Set(types)];
    });
    /**
     * Computed signal for elements by type
     */
    elementsByType = computed(() => {
        const elements = this._elements();
        const byType = new Map();
        elements.forEach((element) => {
            const type = element.type;
            if (!byType.has(type)) {
                byType.set(type, []);
            }
            const typeArray = byType.get(type);
            if (typeArray) {
                typeArray.push(element);
            }
        });
        return byType;
    });
    /**
     * Computed signal for max z-index
     */
    maxZIndex = computed(() => this._maxZIndex());
    /**
     * Computed signal for elements sorted by z-index
     */
    elementsByZIndex = computed(() => {
        return [...this._elements()].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    });
    /**
     * Computed signal for locked elements
     */
    lockedElements = computed(() => {
        return this._elements().filter((element) => element.locked === true);
    });
    /**
     * Computed signal for unlocked elements
     */
    unlockedElements = computed(() => {
        return this._elements().filter((element) => element.locked !== true);
    });
    /**
     * Computed signal for locked elements count
     */
    lockedElementsCount = computed(() => this.lockedElements().length);
    /**
     * Computed signal checking if any elements are locked
     */
    hasLockedElements = computed(() => this.lockedElementsCount() > 0);
    /**
     * Computed signal for lock statistics
     */
    lockStats = computed(() => {
        const total = this.elementsCount();
        const locked = this.lockedElementsCount();
        const unlocked = total - locked;
        const lockPercentage = total > 0 ? Math.round((locked / total) * 100) : 0;
        return {
            total,
            locked,
            unlocked,
            lockPercentage,
            allLocked: total > 0 && locked === total,
            noneLocked: locked === 0,
        };
    });
    /**
     * Signal containing element locks
     */
    locks = this._locks.asReadonly();
    /**
     * Get current persistent elements snapshot
     */
    getElements() {
        return [...this._elements()];
    }
    /**
     * Get current draft elements snapshot
     */
    getDraftElements() {
        return [...this._draftElements()];
    }
    /**
     * Get all elements (persistent + draft) snapshot
     */
    getAllElements() {
        return this.allElements();
    }
    // ---------- Element Management ----------
    /**
     * Add elements to persistent storage
     */
    addElements(elements) {
        if (!elements?.length)
            return;
        const activeLayerId = this.layerManagement.getActiveLayerId();
        const elementsWithZIndex = elements.map((element) => ({
            ...element,
            zIndex: element.zIndex ?? this.getNextZIndex(),
            layerId: element.layerId ?? activeLayerId, // Auto-assign to active layer
        }));
        this.updateMaxZIndex(elementsWithZIndex);
        const currentElements = this._elements();
        const newElements = [...currentElements, ...elementsWithZIndex];
        this._elements.set(newElements);
        // Register elements with layer management
        elementsWithZIndex.forEach((element) => {
            if (element.layerId) {
                this.layerManagement.assignElementToLayer(element.id, element.layerId);
            }
        });
        this.historyService.recordElementCreation(currentElements, newElements);
        // Emit granular event for elements addition
        this.eventBus.emit(WhiteboardEvent.ElementsAdded, elementsWithZIndex);
        // Emit data change event
        this.eventBus.emit(WhiteboardEvent.DataChange, newElements);
    }
    /**
     * Update existing elements (respects lock status)
     */
    updateElements(updates, ignoreLock = false) {
        if (!updates?.length)
            return;
        const currentElements = this._elements();
        const updatesMap = new Map(updates.map((update) => [update.id, update]));
        const updatedElements = [];
        const newElements = currentElements.map((element) => {
            const update = updatesMap.get(element.id);
            if (!update)
                return element;
            // Check if element is locked and operation doesn't ignore lock
            if (!ignoreLock && element.locked && !this.isLockOperation(update)) {
                console.warn(`Attempted to modify locked element: ${element.id}`);
                return element; // Return unchanged element
            }
            // Check if element's layer is locked
            if (!ignoreLock && element.layerId) {
                const elementLayer = this.layerManagement.getElementLayer(element.id);
                if (elementLayer?.locked) {
                    console.warn(`Attempted to modify element on locked layer: ${elementLayer.name}`);
                    return element; // Return unchanged element
                }
            }
            const updatedElement = { ...element, ...update };
            // Update max z-index if necessary
            if (updatedElement.zIndex != null) {
                this._maxZIndex.update((current) => Math.max(current, updatedElement.zIndex));
            }
            updatedElements.push(updatedElement);
            return updatedElement;
        });
        this._elements.set(newElements);
        if (updatedElements.length > 0) {
            this.historyService.recordElementUpdate(currentElements, newElements);
        }
        if (updatedElements.length > 0) {
            this.eventBus.emit(WhiteboardEvent.ElementsUpdated, updatedElements);
            // Emit data change event
            this.eventBus.emit(WhiteboardEvent.DataChange, newElements);
        }
    }
    /**
     * Remove elements by IDs (respects lock status)
     */
    removeElementsByIds(elementIds, ignoreLock = false) {
        if (!elementIds?.length)
            return;
        const idsToRemove = new Set(elementIds);
        const currentElements = this._elements();
        // Filter out locked elements unless ignoreLock is true
        const validElementsToRemove = currentElements.filter((element) => {
            if (!idsToRemove.has(element.id))
                return false;
            if (!ignoreLock && element.locked) {
                console.warn(`Attempted to remove locked element: ${element.id}`);
                return false;
            }
            // Check if element's layer is locked
            if (!ignoreLock && element.layerId) {
                const elementLayer = this.layerManagement.getElementLayer(element.id);
                if (elementLayer?.locked) {
                    console.warn(`Attempted to remove element from locked layer: ${elementLayer.name}`);
                    return false;
                }
            }
            return true;
        });
        if (validElementsToRemove.length === 0)
            return;
        const removeIds = new Set(validElementsToRemove.map((el) => el.id));
        const newElements = currentElements.filter((element) => !removeIds.has(element.id));
        this._elements.set(newElements);
        // Remove elements from layers
        validElementsToRemove.forEach((element) => {
            this.layerManagement.removeElementFromAllLayers(element.id);
        });
        // Record history for undo/redo
        this.historyService.recordElementDeletion(currentElements, newElements);
        // Emit events
        this.eventBus.emit(WhiteboardEvent.ElementsRemoved, validElementsToRemove);
        this.eventBus.emit(WhiteboardEvent.DataChange, newElements);
    }
    /**
     * Remove elements (simplified interface, respects lock status)
     */
    removeElements(elements, ignoreLock = false) {
        const elementIds = elements.map((element) => element.id);
        this.removeElementsByIds(elementIds, ignoreLock);
    }
    /**
     * Clear all persistent elements
     */
    clear() {
        const currentElements = this._elements();
        this._elements.set([]);
        this._maxZIndex.set(0);
        // Clear all elements from layers
        currentElements.forEach((element) => {
            this.layerManagement.removeElementFromAllLayers(element.id);
        });
        // Record history for undo/redo
        this.historyService.recordClear(currentElements, []);
        // Emit data change event
        this.eventBus.emit(WhiteboardEvent.DataChange, []);
    }
    /**
     * Set all persistent elements (replaces current elements)
     */
    setElements(elements) {
        const elementsWithZIndex = elements.map((element) => ({
            ...element,
            zIndex: element.zIndex ?? this.getNextZIndex(),
        }));
        this.updateMaxZIndex(elementsWithZIndex);
        this._elements.set([...elementsWithZIndex]);
        // Emit data change event
        this.eventBus.emit(WhiteboardEvent.DataChange, elementsWithZIndex);
    }
    // ---------- Draft Element Management ----------
    /**
     * Add elements to draft storage (temporary elements)
     */
    addDraftElements(elements) {
        if (!elements?.length)
            return;
        // Check if active layer is locked
        const activeLayer = this.layerManagement.activeLayer();
        if (activeLayer?.locked) {
            console.warn(`Cannot draw on locked layer: ${activeLayer.name}`);
            return;
        }
        const elementsWithZIndex = elements.map((element) => ({
            ...element,
            zIndex: element.zIndex ?? this.getNextZIndex(),
        }));
        this.updateMaxZIndex(elementsWithZIndex);
        const currentDraftElements = this._draftElements();
        const newDraftElements = [...currentDraftElements, ...elementsWithZIndex];
        this._draftElements.set(newDraftElements);
    }
    /**
     * Update draft elements
     */
    updateDraftElements(updates) {
        if (!updates?.length)
            return;
        const currentDraftElements = this._draftElements();
        const updatesMap = new Map(updates.map((update) => [update.id, update]));
        const updatedElements = [];
        const newDraftElements = currentDraftElements.map((element) => {
            const update = updatesMap.get(element.id);
            if (update) {
                const updatedElement = { ...element, ...update };
                updatedElements.push(updatedElement);
                return updatedElement;
            }
            return element;
        });
        this._draftElements.set(newDraftElements);
    }
    /**
     * Remove draft elements by IDs
     */
    removeDraftElements(elementIds) {
        if (!elementIds?.length)
            return;
        const idsToRemove = new Set(elementIds);
        const currentDraftElements = this._draftElements();
        const newDraftElements = currentDraftElements.filter((element) => !idsToRemove.has(element.id));
        this._draftElements.set(newDraftElements);
    }
    /**
     * Clear all draft elements
     */
    clearDraftElements() {
        this._draftElements.set([]);
    }
    /**
     * Move elements from draft to persistent storage
     */
    commitDraftElements(elementIds) {
        const draftElements = this._draftElements();
        const elementsToCommit = elementIds ? draftElements.filter((el) => elementIds.includes(el.id)) : draftElements;
        if (elementsToCommit.length === 0)
            return [];
        // Check if active layer is locked before committing
        const activeLayer = this.layerManagement.activeLayer();
        if (activeLayer?.locked) {
            console.warn(`Cannot commit elements to locked layer: ${activeLayer.name}`);
            // Clear draft elements since they can't be committed
            this._draftElements.set([]);
            return [];
        }
        // Add to persistent storage
        this.addElements(elementsToCommit);
        // Remove from draft storage
        const remainingDrafts = elementIds ? draftElements.filter((el) => !elementIds.includes(el.id)) : [];
        this._draftElements.set(remainingDrafts);
        // Return the committed elements for potential selection
        return elementsToCommit;
    }
    // ---------- Z-Index Management ----------
    /**
     * Get the next available z-index
     */
    getNextZIndex() {
        this._maxZIndex.update((current) => current + 1);
        return this._maxZIndex();
    }
    /**
     * Bring elements to front (respects lock status)
     */
    bringToFront(elementIds, ignoreLock = false) {
        if (!elementIds?.length)
            return;
        const newZIndex = this.getNextZIndex();
        const updates = elementIds.map((id) => ({ id, zIndex: newZIndex }));
        this.updateElements(updates, ignoreLock);
    }
    /**
     * Send elements to back (respects lock status)
     */
    sendToBack(elementIds, ignoreLock = false) {
        if (!elementIds?.length)
            return;
        const updates = elementIds.map((id) => ({ id, zIndex: 0 }));
        this.updateElements(updates, ignoreLock);
    }
    // ---------- Lock Management ----------
    /**
     * Lock elements to prevent modifications
     */
    lockElements(elementIds) {
        if (!elementIds?.length)
            return;
        const lockInfo = {
            timestamp: Date.now(),
            reason: 'User locked',
        };
        const locks = this._locks();
        const newLocks = new Map(locks);
        const updates = elementIds.map((id) => {
            newLocks.set(id, lockInfo);
            return { id, locked: true };
        });
        this._locks.set(newLocks);
        this.updateElements(updates, true); // Ignore lock status for locking operation
    }
    /**
     * Unlock elements to allow modifications
     */
    unlockElements(elementIds) {
        if (!elementIds?.length)
            return;
        const locks = this._locks();
        const newLocks = new Map(locks);
        const updates = elementIds.map((id) => {
            newLocks.delete(id);
            return { id, locked: false };
        });
        this._locks.set(newLocks);
        this.updateElements(updates, true); // Ignore lock status for unlocking operation
    }
    /**
     * Toggle lock status of elements
     */
    toggleElementsLock(elementIds) {
        if (!elementIds?.length)
            return;
        const elementsToLock = [];
        const elementsToUnlock = [];
        elementIds.forEach((id) => {
            const element = this.getElementById(id);
            if (element) {
                if (element.locked) {
                    elementsToUnlock.push(id);
                }
                else {
                    elementsToLock.push(id);
                }
            }
        });
        if (elementsToLock.length > 0) {
            this.lockElements(elementsToLock);
        }
        if (elementsToUnlock.length > 0) {
            this.unlockElements(elementsToUnlock);
        }
    }
    /**
     * Lock all elements
     */
    lockAllElements() {
        const allIds = this._elements().map((el) => el.id);
        this.lockElements(allIds);
    }
    /**
     * Unlock all elements
     */
    unlockAllElements() {
        const allIds = this._elements().map((el) => el.id);
        this.unlockElements(allIds);
    }
    /**
     * Check if an element is locked
     */
    isElementLocked(elementId) {
        const element = this.getElementById(elementId);
        return Boolean(element?.locked);
    }
    /**
     * Get locked element IDs
     */
    getLockedElementIds() {
        return this.lockedElements().map((el) => el.id);
    }
    /**
     * Get unlocked element IDs
     */
    getUnlockedElementIds() {
        return this.unlockedElements().map((el) => el.id);
    }
    // ---------- Layer Management ----------
    /**
     * Move elements to a specific layer (respects lock status)
     */
    moveToLayer(elementIds, layerId, ignoreLock = false) {
        if (!elementIds?.length)
            return;
        const updates = elementIds.map((id) => ({ id, layerId }));
        this.updateElements(updates, ignoreLock);
    }
    /**
     * Get elements by layer
     */
    getElementsByLayer(layerId) {
        return this._elements().filter((el) => el.layerId === layerId);
    }
    // ---------- Search and Query ----------
    /**
     * Find element by ID in both persistent and draft elements
     */
    getElementById(id) {
        // Search in persistent elements first
        const persistentElement = this._elements().find((el) => el.id === id);
        if (persistentElement)
            return persistentElement;
        // Search in draft elements
        return this._draftElements().find((el) => el.id === id);
    }
    /**
     * Find elements by IDs
     */
    getElementsByIds(ids) {
        const idsSet = new Set(ids);
        const allElements = this.allElements();
        return allElements.filter((el) => idsSet.has(el.id));
    }
    /**
     * Get elements by type
     */
    getElementsByType(type) {
        return this._elements().filter((el) => el.type === type);
    }
    /**
     * Search elements with multiple criteria
     */
    searchElements(criteria) {
        let results = this._elements();
        if (criteria.type) {
            results = results.filter((el) => el.type === criteria.type);
        }
        if (criteria.layerId) {
            results = results.filter((el) => el.layerId === criteria.layerId);
        }
        if (criteria.locked !== undefined) {
            results = results.filter((el) => Boolean(el.locked) === criteria.locked);
        }
        if (criteria.textContent) {
            const searchText = criteria.textContent.toLowerCase();
            results = results.filter((el) => {
                const textElement = el;
                const text = (textElement.text || textElement.content || '').toLowerCase();
                return text.includes(searchText);
            });
        }
        if (criteria.zIndexRange) {
            const { min, max } = criteria.zIndexRange;
            results = results.filter((el) => {
                const zIndex = el.zIndex || 0;
                return zIndex >= min && zIndex <= max;
            });
        }
        if (criteria.bounds) {
            results = this.findElementsInBounds(criteria.bounds).filter((el) => results.some((r) => r.id === el.id));
        }
        return results;
    }
    /**
     * Find elements by text content
     */
    findElementsByText(searchText) {
        return this.searchElements({ textContent: searchText });
    }
    /**
     * Get elements within a radius of a point
     */
    getElementsInRadius(centerX, centerY, radius) {
        return this._elements().filter((element) => {
            const dx = element.x - centerX;
            const dy = element.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= radius;
        });
    }
    /**
     * Get nearest element to a point
     */
    getNearestElement(x, y) {
        const elements = this._elements();
        if (elements.length === 0)
            return undefined;
        let nearestElement = elements[0];
        let minDistance = this.getDistanceToElement(x, y, nearestElement);
        for (let i = 1; i < elements.length; i++) {
            const distance = this.getDistanceToElement(x, y, elements[i]);
            if (distance < minDistance) {
                minDistance = distance;
                nearestElement = elements[i];
            }
        }
        return nearestElement;
    }
    // ---------- State Management ----------
    /**
     * Create a snapshot of current state
     */
    createSnapshot() {
        return {
            elements: [...this._elements()],
            draftElements: [...this._draftElements()],
            maxZIndex: this._maxZIndex(),
            timestamp: Date.now(),
        };
    }
    /**
     * Restore state from snapshot
     */
    restoreSnapshot(snapshot) {
        this._elements.set([...snapshot.elements]);
        this._draftElements.set([...snapshot.draftElements]);
        this._maxZIndex.set(snapshot.maxZIndex);
    }
    // ---------- Utility Methods ----------
    /**
     * Find elements intersecting with a boundary
     */
    findElementsInBounds(bounds) {
        return this._elements().filter((element) => {
            const elementWidth = element.width || 50;
            const elementHeight = element.height || 50;
            return (element.x < bounds.x + bounds.width &&
                element.x + elementWidth > bounds.x &&
                element.y < bounds.y + bounds.height &&
                element.y + elementHeight > bounds.y);
        });
    }
    /**
     * Calculate combined bounds of multiple elements
     */
    calculateElementsBounds(elements) {
        if (elements.length === 0) {
            return null;
        }
        const allBounds = elements.map(getElementBounds);
        const minX = Math.min(...allBounds.map((b) => b.minX));
        const minY = Math.min(...allBounds.map((b) => b.minY));
        const maxX = Math.max(...allBounds.map((b) => b.maxX));
        const maxY = Math.max(...allBounds.map((b) => b.maxY));
        const width = maxX - minX;
        const height = maxY - minY;
        return {
            x: minX,
            y: minY,
            width,
            height,
            centerX: minX + width / 2,
            centerY: minY + height / 2,
        };
    }
    /**
     * Get elements count (use computed signal for reactivity)
     */
    getElementsCount() {
        return this.elementsCount();
    }
    /**
     * Get unique element types (use computed signal for reactivity)
     */
    getElementTypes() {
        return this.elementTypes();
    }
    /**
     * Normalize z-indices to sequential integers
     */
    normalizeZIndices() {
        const elements = [...this._elements()].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        const updates = elements.map((element, index) => ({
            id: element.id,
            zIndex: index + 1,
        }));
        this._maxZIndex.set(elements.length);
        this.updateElements(updates, true);
    }
    // ---------- Convenience Methods ----------
    /**
     * Add a single element (convenience method)
     */
    addElement(element) {
        this.addElements([element]);
    }
    /**
     * Update a single element (convenience method, respects lock status)
     */
    updateElement(update, ignoreLock = false) {
        this.updateElements([update], ignoreLock);
    }
    /**
     * Remove a single element (convenience method, respects lock status)
     */
    removeElement(element, ignoreLock = false) {
        this.removeElementsByIds([element.id], ignoreLock);
    }
    /**
     * Check if a specific element exists
     */
    elementExists(id) {
        return this.getElementById(id) !== undefined;
    }
    /**
     * Get elements within a specific z-index range
     */
    getElementsByZIndexRange(min, max) {
        return this._elements().filter((el) => {
            const zIndex = el.zIndex || 0;
            return zIndex >= min && zIndex <= max;
        });
    }
    /**
     * Get elements with specific properties
     */
    getElementsByProperty(property, value) {
        return this._elements().filter((el) => el[property] === value);
    }
    /**
     * Lock a single element
     */
    lockElement(elementId) {
        this.lockElements([elementId]);
    }
    /**
     * Unlock a single element
     */
    unlockElement(elementId) {
        this.unlockElements([elementId]);
    }
    /**
     * Toggle lock status of a single element
     */
    toggleElementLock(elementId) {
        this.toggleElementsLock([elementId]);
    }
    /**
     * Get modifiable elements (unlocked elements)
     */
    getModifiableElements() {
        return this.unlockedElements();
    }
    /**
     * Check if any of the given elements are locked
     */
    hasLockedElementsInSelection(elementIds) {
        return elementIds.some((id) => this.isElementLocked(id));
    }
    /**
     * Filter out locked elements from a selection
     */
    filterUnlockedElements(elementIds) {
        return elementIds.filter((id) => !this.isElementLocked(id));
    }
    /**
     * Get elements that can be safely modified (respects lock status)
     */
    getModifiableElementsFromIds(elementIds) {
        const unlocked = this.filterUnlockedElements(elementIds);
        return this.getElementsByIds(unlocked);
    }
    /**
     * Safely update multiple elements (warns about locked elements)
     */
    safeUpdateElements(updates) {
        const locked = [];
        const updated = [];
        const safeUpdates = updates.filter((update) => {
            if (this.isElementLocked(update.id)) {
                locked.push(update.id);
                return false;
            }
            else {
                updated.push(update.id);
                return true;
            }
        });
        if (safeUpdates.length > 0) {
            this.updateElements(safeUpdates, false);
        }
        return { updated, locked };
    }
    // ---------- Private Helper Methods ----------
    /**
     * Check if an update operation is a lock-related operation
     */
    isLockOperation(update) {
        return 'locked' in update;
    }
    /**
     * Update the maximum z-index based on elements
     */
    updateMaxZIndex(elements) {
        const maxZ = Math.max(...elements.map((el) => el.zIndex || 0));
        this._maxZIndex.update((current) => Math.max(current, maxZ));
    }
    /**
     * Get distance from point to element
     */
    getDistanceToElement(x, y, element) {
        const elementWidth = element.width || 50;
        const elementHeight = element.height || 50;
        const centerX = element.x + elementWidth / 2;
        const centerY = element.y + elementHeight / 2;
        const dx = x - centerX;
        const dy = y - centerY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ElementsService, deps: [{ token: EventBusService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ElementsService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ElementsService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: EventBusService }] });

/**
 * Manages canvas panning operations including pan by delta, pan to position,
 * pan constraints, and bounds checking.
 */
class PanService {
    configService;
    eventBusService;
    DEFAULT_PAN_BOUNDS = { x: -Infinity, y: -Infinity, width: Infinity, height: Infinity };
    panBounds = this.DEFAULT_PAN_BOUNDS;
    constructor(configService, eventBusService) {
        this.configService = configService;
        this.eventBusService = eventBusService;
    }
    getConfig() {
        return this.configService.getConfig();
    }
    /**
     * Pan the canvas by delta amounts.
     */
    pan(dx, dy) {
        const config = this.getConfig();
        const { x, y } = config;
        const newX = x + dx;
        const newY = y + dy;
        // Apply pan constraints
        const constrainedPosition = this.constrainPanPosition(newX, newY);
        this.setCanvasPosition(constrainedPosition.x, constrainedPosition.y);
    }
    /**
     * Pan to specific position.
     */
    panTo(x, y) {
        const constrainedPosition = this.constrainPanPosition(x, y);
        this.setCanvasPosition(constrainedPosition.x, constrainedPosition.y);
    }
    setCanvasPosition(x, y) {
        this.configService.updateConfig({ x, y });
    }
    /**
     * Get current pan position.
     */
    getPanPosition() {
        const config = this.getConfig();
        return { x: config.x, y: config.y };
    }
    /**
     * Reset pan to origin.
     */
    resetPan() {
        this.setCanvasPosition(0, 0);
    }
    /**
     * Set pan bounds to constrain panning within specific area.
     */
    setPanBounds(bounds) {
        this.panBounds = bounds;
    }
    /**
     * Reset pan bounds to unlimited.
     */
    resetPanBounds() {
        this.panBounds = this.DEFAULT_PAN_BOUNDS;
    }
    /**
     * Get current pan bounds.
     */
    getPanBounds() {
        return { ...this.panBounds };
    }
    constrainPanPosition(x, y) {
        if (this.panBounds === this.DEFAULT_PAN_BOUNDS) {
            return { x, y };
        }
        const constrainedX = Math.max(this.panBounds.x, Math.min(this.panBounds.x + this.panBounds.width, x));
        const constrainedY = Math.max(this.panBounds.y, Math.min(this.panBounds.y + this.panBounds.height, y));
        return { x: constrainedX, y: constrainedY };
    }
    /**
     * Check if position is within pan bounds.
     */
    isPositionWithinBounds(x, y) {
        if (this.panBounds === this.DEFAULT_PAN_BOUNDS) {
            return true;
        }
        return (x >= this.panBounds.x &&
            x <= this.panBounds.x + this.panBounds.width &&
            y >= this.panBounds.y &&
            y <= this.panBounds.y + this.panBounds.height);
    }
    /**
     * Get distance to pan bounds from current position.
     */
    getDistanceToBounds() {
        const { x, y } = this.getPanPosition();
        if (this.panBounds === this.DEFAULT_PAN_BOUNDS) {
            return { left: Infinity, top: Infinity, right: Infinity, bottom: Infinity };
        }
        return {
            left: x - this.panBounds.x,
            top: y - this.panBounds.y,
            right: this.panBounds.x + this.panBounds.width - x,
            bottom: this.panBounds.y + this.panBounds.height - y,
        };
    }
    /**
     * Pan with easing animation.
     */
    panWithEasing(targetX, targetY) {
        this.panTo(targetX, targetY);
    }
    /**
     * Pan by delta with momentum.
     */
    panWithMomentum(dx, dy) {
        this.pan(dx, dy);
    }
    /**
     * Extension point for custom pan constraints validation.
     */
    validatePanOperation(x, y, dx, dy) {
        return this.isPositionWithinBounds(x + dx, y + dy);
    }
    /**
     * Extension point for custom pan acceleration.
     */
    applyPanAcceleration(dx, dy) {
        return { dx, dy };
    }
    /**
     * Extension point for pan state change callback.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onPanChange(_oldPosition, _newPosition) {
        // Override in derived classes for custom behavior
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PanService, deps: [{ token: ConfigService }, { token: EventBusService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PanService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PanService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: ConfigService }, { type: EventBusService }] });

/**
 * Manages clipboard operations for whiteboard elements with localStorage persistence.
 */
class ClipboardService {
    elementsService;
    CLIPBOARD_KEY = 'whiteboard-clipboard';
    OFFSET_INCREMENT = 20;
    constructor(elementsService) {
        this.elementsService = elementsService;
    }
    copy(elements) {
        if (elements.length === 0)
            return;
        const clipboardData = {
            elements: elements,
            timestamp: Date.now(),
        };
        try {
            localStorage.setItem(this.CLIPBOARD_KEY, JSON.stringify(clipboardData));
        }
        catch (error) {
            console.error('Failed to copy elements to clipboard:', error);
        }
    }
    cut(elements) {
        this.copy(elements);
    }
    paste() {
        const clipboardData = this.getData();
        if (!clipboardData?.elements.length) {
            return [];
        }
        const pastedElements = this.duplicateElementsWithOffset(clipboardData.elements, this.OFFSET_INCREMENT, this.OFFSET_INCREMENT);
        this.elementsService.addElements(pastedElements);
        return pastedElements;
    }
    clear() {
        try {
            localStorage.removeItem(this.CLIPBOARD_KEY);
        }
        catch (error) {
            console.error('Failed to clear clipboard:', error);
        }
    }
    hasData() {
        const data = this.getData();
        return data !== null && data.elements.length > 0;
    }
    getData() {
        try {
            const data = localStorage.getItem(this.CLIPBOARD_KEY);
            return data ? JSON.parse(data) : null;
        }
        catch (error) {
            console.error('Failed to read clipboard data:', error);
            return null;
        }
    }
    duplicateElements(elements, offsetX = this.OFFSET_INCREMENT, offsetY = this.OFFSET_INCREMENT) {
        if (elements.length === 0) {
            return [];
        }
        const duplicatedElements = this.duplicateElementsWithOffset(elements, offsetX, offsetY);
        this.elementsService.addElements(duplicatedElements);
        return duplicatedElements;
    }
    createDuplicates(elements, offsetX = this.OFFSET_INCREMENT, offsetY = this.OFFSET_INCREMENT) {
        return this.duplicateElementsWithOffset(elements, offsetX, offsetY);
    }
    getClipboardInfo() {
        const data = this.getData();
        if (!data)
            return null;
        return {
            elementCount: data.elements.length,
            timestamp: data.timestamp,
        };
    }
    isDataFresh(maxAgeMs = 5 * 60 * 1000) {
        const data = this.getData();
        if (!data)
            return false;
        return Date.now() - data.timestamp <= maxAgeMs;
    }
    getClipboardElementTypes() {
        const data = this.getData();
        if (!data)
            return [];
        const types = data.elements.map((el) => el.type);
        return [...new Set(types)];
    }
    duplicateElementsWithOffset(elements, offsetX, offsetY) {
        return elements.map((element) => ({
            ...element,
            id: `${element.id}_copy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            x: element.x + offsetX,
            y: element.y + offsetY,
        }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ClipboardService, deps: [{ token: ElementsService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ClipboardService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ClipboardService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: ElementsService }] });

class BaseTool {
    apiService;
    active = false;
    // Base cursor for this tool (used when tool becomes active)
    baseCursor = CursorType.Default;
    constructor(apiService) {
        this.apiService = apiService;
    }
    get whiteboardConfig() {
        return this.apiService?.getConfig();
    }
    getPointerPosition({ x, y }) {
        return getCanvasCoordinates(this.apiService.getConfig(), { x, y });
    }
    activate() {
        this.active = true;
        this.onActivate?.();
    }
    deactivate() {
        this.active = false;
        this.onDeactivate?.();
    }
    setCursor(cursor) {
        this.apiService.setCursor(cursor);
    }
    resetCursor() {
        this.apiService.resetCursor();
    }
    get isActive() {
        return this.active;
    }
}

class ArrowTool extends BaseTool {
    type = ToolType.Arrow;
    baseCursor = CursorType.Crosshair;
    element = null;
    startPoint = null;
    lastX = 0;
    lastY = 0;
    MIN_LENGTH = 2;
    handlePointerDown(event) {
        if (!this.active)
            return;
        const coordinates = this.getPointerPosition(event);
        let { x, y } = coordinates;
        const { snapToGrid: allowedSnap } = this.whiteboardConfig;
        if (allowedSnap) {
            const { gridSize } = this.whiteboardConfig;
            x = snapToGrid(x, gridSize);
            y = snapToGrid(y, gridSize);
        }
        this.startPoint = { x, y };
        this.lastX = x;
        this.lastY = y;
        this.element = createElement(ElementType.Arrow, {
            x1: x,
            y1: y,
            x2: x,
            y2: y,
            style: this.getElementStyle(),
            zIndex: this.apiService.getNextZIndex(),
        }, this.apiService.getActiveLayerId());
        this.apiService.addDraftElements([this.element]);
    }
    handlePointerMove(event) {
        if (!this.active || !this.element)
            return;
        const coordinates = this.getPointerPosition(event);
        let x2 = coordinates.x;
        let y2 = coordinates.y;
        const { snapToGrid: allowedSnap } = this.whiteboardConfig;
        if (allowedSnap) {
            const { gridSize } = this.whiteboardConfig;
            x2 = snapToGrid(x2, gridSize);
            y2 = snapToGrid(y2, gridSize);
        }
        if (event.shiftKey) {
            const x1 = this.element.x1;
            const y1 = this.element.y1;
            const { x, y } = snapToAngle(x1, y1, x2, y2);
            x2 = x;
            y2 = y;
        }
        if (Math.abs(x2 - this.lastX) > this.MIN_LENGTH || Math.abs(y2 - this.lastY) > this.MIN_LENGTH) {
            this.apiService.updateDraftElements([{ id: this.element.id, x2, y2 }]);
            this.lastX = x2;
            this.lastY = y2;
        }
    }
    handlePointerUp() {
        if (!this.active)
            return;
        if (this.element && this.startPoint) {
            const element = this.element;
            this.apiService.commitDraftElements();
            if (element.selectAfterDraw) {
                this.apiService.selectElements([element.id]);
            }
            this.startPoint = null;
            this.element = null;
        }
        this.lastX = 0;
        this.lastY = 0;
    }
    getElementStyle() {
        return {
            strokeColor: this.whiteboardConfig.strokeColor,
            strokeWidth: this.whiteboardConfig.strokeWidth,
            lineCap: this.whiteboardConfig.lineCap,
            dasharray: this.whiteboardConfig.dasharray,
            dashoffset: this.whiteboardConfig.dashoffset,
        };
    }
}

class EllipseTool extends BaseTool {
    type = ToolType.Ellipse;
    baseCursor = CursorType.Crosshair;
    element = null;
    startPoint = null;
    handlePointerDown(event) {
        if (!this.active)
            return;
        let { x, y } = this.getPointerPosition(event);
        const { snapToGrid: allowedSnap } = this.whiteboardConfig;
        if (allowedSnap) {
            const { gridSize } = this.whiteboardConfig;
            x = snapToGrid(x, gridSize);
            y = snapToGrid(y, gridSize);
        }
        this.startPoint = { x, y };
        this.element = createElement(ElementType.Ellipse, {
            cx: x,
            cy: y,
            style: this.getElementStyle(),
            zIndex: this.apiService.getNextZIndex(),
        }, this.apiService.getActiveLayerId());
        this.apiService.addDraftElements([this.element]);
    }
    handlePointerMove(event) {
        if (!this.active || !this.element || !this.startPoint)
            return;
        const { x, y } = this.getPointerPosition(event);
        const { x: startX, y: startY } = this.startPoint;
        let cx, cy, rx, ry;
        if (event.altKey) {
            // Draw from center
            cx = startX;
            cy = startY;
            rx = Math.abs(x - cx);
            ry = event.shiftKey ? rx : Math.abs(y - cy);
        }
        else {
            // Draw from corner
            cx = (startX + x) / 2;
            cy = (startY + y) / 2;
            rx = Math.abs(startX - x) / 2;
            ry = event.shiftKey ? rx : Math.abs(startY - y) / 2;
            if (event.shiftKey) {
                cy = y > startY ? startY + rx : startY - rx;
            }
        }
        this.apiService.updateDraftElements([{ id: this.element.id, rx, ry, cx, cy }]);
    }
    handlePointerUp() {
        if (!this.active)
            return;
        if (this.element && this.startPoint) {
            const element = this.element;
            this.apiService.commitDraftElements();
            // Handle selection based on element's selectAfterDraw property
            if (element.selectAfterDraw) {
                this.apiService.selectElements([element.id]);
            }
            this.startPoint = null;
            this.element = null;
        }
    }
    getElementStyle() {
        return {
            strokeColor: this.whiteboardConfig.strokeColor,
            strokeWidth: this.whiteboardConfig.strokeWidth,
            fill: this.whiteboardConfig.fill,
            dasharray: this.whiteboardConfig.dasharray,
            dashoffset: this.whiteboardConfig.dashoffset,
        };
    }
}

class EraserTool extends BaseTool {
    type = ToolType.Eraser;
    baseCursor = CursorType.Eraser;
    isErasing = false;
    hoveredElementIds = new Set();
    lastPosition = null;
    handlePointerDown(event) {
        if (!this.active)
            return;
        this.hoveredElementIds.clear();
        const position = this.getPointerPosition(event);
        this.isErasing = true;
        this.eraseElementsAt(position, position);
        this.lastPosition = position;
    }
    handlePointerMove(event) {
        if (!this.active || !this.isErasing || !this.lastPosition)
            return;
        const position = this.getPointerPosition(event);
        this.eraseElementsAt(this.lastPosition, position, event.altKey);
        this.lastPosition = position;
    }
    handlePointerUp() {
        if (!this.active)
            return;
        if (this.hoveredElementIds.size > 0) {
            const elementsToRemoveIds = Array.from(this.hoveredElementIds);
            const expandedIds = this.expandToIncludeGroups(elementsToRemoveIds);
            const elementsToRemove = this.apiService.getElements().filter((el) => expandedIds.includes(el.id));
            elementsToRemove.forEach((el) => {
                el.isDeleting = false;
            });
            this.apiService.updateElements(elementsToRemove);
            this.apiService.removeElements(elementsToRemove);
        }
        this.hoveredElementIds.clear();
        this.isErasing = false;
        this.lastPosition = null;
    }
    eraseElementsAt(lastPosition, position, isAltPressed = false) {
        const elements = this.apiService.getElements();
        const zoom = this.apiService.getConfig()?.zoom || 1;
        const distance = Math.hypot(position.x - lastPosition.x, position.y - lastPosition.y);
        const baseThreshold = 10 / zoom;
        const speedFactor = Math.log2(distance + 1) * 0.5;
        const dynamicThreshold = baseThreshold + distance * speedFactor;
        for (const element of elements) {
            const bounds = getElementUtil(element.type).getBounds(element);
            if (!isBoundsIntersect(bounds, lastPosition, position, dynamicThreshold))
                continue;
            if (this.isPointInElement(element, lastPosition, position, dynamicThreshold)) {
                if (isAltPressed) {
                    const groupedIds = this.expandToIncludeGroups([element.id]);
                    groupedIds.forEach((id) => {
                        this.hoveredElementIds.delete(id);
                        const el = elements.find((e) => e.id === id);
                        if (el)
                            el.isDeleting = false;
                    });
                }
                if (!isAltPressed && !this.hoveredElementIds.has(element.id)) {
                    const groupedIds = this.expandToIncludeGroups([element.id]);
                    groupedIds.forEach((id) => {
                        this.hoveredElementIds.add(id);
                        const el = elements.find((e) => e.id === id);
                        if (el)
                            el.isDeleting = true;
                    });
                }
                const affectedIds = this.expandToIncludeGroups([element.id]);
                const affectedElements = elements.filter((el) => affectedIds.includes(el.id));
                this.apiService.updateElements(affectedElements);
            }
        }
    }
    isPointInElement(element, lastPosition, position, threshold) {
        return getElementUtil(element.type).hitTest(element, lastPosition, position, threshold);
    }
    expandToIncludeGroups(elementIds) {
        const allElements = this.apiService.getElements();
        const elementsToExpand = allElements.filter((el) => elementIds.includes(el.id));
        const groupIds = new Set(elementsToExpand
            .map((el) => el.groupId)
            .filter((groupId) => groupId !== undefined && groupId !== null));
        if (groupIds.size === 0) {
            return elementIds;
        }
        const expandedElements = allElements.filter((el) => {
            return elementIds.includes(el.id) || (el.groupId && groupIds.has(el.groupId));
        });
        return expandedElements.map((el) => el.id);
    }
}

class HandTool extends BaseTool {
    type = ToolType.Hand;
    baseCursor = CursorType.Grab;
    isDragging = false;
    startX = 0;
    startY = 0;
    handlePointerDown(event) {
        this.isDragging = true;
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.setCursor(CursorType.Grabbing);
    }
    handlePointerMove(event) {
        if (!this.isDragging)
            return;
        const { zoom } = this.whiteboardConfig;
        const mouseDX = (event.clientX - this.startX) / zoom;
        const mouseDY = (event.clientY - this.startY) / zoom;
        this.apiService.pan(mouseDX, mouseDY);
        this.startX = event.clientX;
        this.startY = event.clientY;
    }
    handlePointerUp() {
        this.isDragging = false;
        this.resetCursor();
    }
}

class ImageTool extends BaseTool {
    type = ToolType.Image;
    baseCursor = CursorType.Image;
    handlePointerDown(event) {
        const { x, y } = this.getPointerPosition(event);
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const files = e.target.files;
            if (files) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const image = e.target.result;
                    this.apiService.addImage({ image, x, y });
                };
                reader.readAsDataURL(files[0]);
            }
        };
        input.click();
    }
}

class LineTool extends BaseTool {
    type = ToolType.Line;
    baseCursor = CursorType.Crosshair;
    element = null;
    startPoint = null;
    lastX = 0;
    lastY = 0;
    MIN_LENGTH = 2;
    handlePointerDown(event) {
        if (!this.active)
            return;
        let { x, y } = this.getPointerPosition(event);
        const { snapToGrid: allowedSnap } = this.whiteboardConfig;
        if (allowedSnap) {
            const { gridSize } = this.whiteboardConfig;
            x = snapToGrid(x, gridSize);
            y = snapToGrid(y, gridSize);
        }
        this.startPoint = { x, y };
        this.lastX = x;
        this.lastY = y;
        this.element = createElement(ElementType.Line, {
            x1: x,
            y1: y,
            x2: x,
            y2: y,
            style: this.getElementStyle(),
            zIndex: this.apiService.getNextZIndex(),
        }, this.apiService.getActiveLayerId());
        this.apiService.addDraftElements([this.element]);
    }
    handlePointerMove(event) {
        if (!this.active || !this.element)
            return;
        const coords = this.getPointerPosition(event);
        let x2 = coords.x;
        let y2 = coords.y;
        const { snapToGrid: allowedSnap } = this.whiteboardConfig;
        if (allowedSnap) {
            const { gridSize } = this.whiteboardConfig;
            x2 = snapToGrid(x2, gridSize);
            y2 = snapToGrid(y2, gridSize);
        }
        if (event.shiftKey) {
            const x1 = this.element.x1;
            const y1 = this.element.y1;
            const { x, y } = snapToAngle(x1, y1, x2, y2);
            [x2, y2] = [x, y];
        }
        // Only update if the movement is significant
        if (Math.abs(x2 - this.lastX) > this.MIN_LENGTH || Math.abs(y2 - this.lastY) > this.MIN_LENGTH) {
            this.apiService.updateDraftElements([{ id: this.element.id, x2, y2 }]);
            this.lastX = x2;
            this.lastY = y2;
        }
    }
    handlePointerUp() {
        if (!this.active)
            return;
        if (this.element && this.startPoint) {
            const element = this.element;
            this.apiService.commitDraftElements();
            // Handle selection based on element's selectAfterDraw property
            if (element.selectAfterDraw) {
                this.apiService.selectElements([element.id]);
            }
            this.startPoint = null;
            this.element = null;
        }
        this.lastX = 0;
        this.lastY = 0;
    }
    getElementStyle() {
        return {
            strokeColor: this.whiteboardConfig.strokeColor,
            strokeWidth: this.whiteboardConfig.strokeWidth,
            lineCap: this.whiteboardConfig.lineCap,
            dasharray: this.whiteboardConfig.dasharray,
            dashoffset: this.whiteboardConfig.dashoffset,
        };
    }
}

class PenTool extends BaseTool {
    type = ToolType.Pen;
    baseCursor = CursorType.Crosshair;
    element = null;
    constructor(apiService) {
        super(apiService);
    }
    getCurrentPathOptions() {
        const penType = this.whiteboardConfig.penType;
        const preset = getPresetForType(penType, PenThickness.Medium);
        const strokeOptions = preset.strokeOptions;
        return {
            smoothing: strokeOptions.smoothing || 0.5,
            streamline: strokeOptions.streamline || 0.5,
            thinning: strokeOptions.thinning || 0.5,
            simulatePressure: strokeOptions.simulatePressure !== undefined ? strokeOptions.simulatePressure : true,
            size: strokeOptions.size || 16,
            easing: strokeOptions.easing || ((t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)),
            start: strokeOptions.start || { cap: true, taper: 0.3 },
            end: strokeOptions.end || { cap: true, taper: 0.4 },
        };
    }
    handlePointerDown(event) {
        if (!this.active)
            return;
        const point = this.getPointerPosition(event);
        const currentPathOptions = this.getCurrentPathOptions();
        const initialPoints = [[point.x, point.y]];
        this.element = createElement(ElementType.Pen, {
            points: initialPoints,
            pathOptions: currentPathOptions,
            isComplete: false,
            style: this.getElementStyle(),
            zIndex: this.apiService.getNextZIndex(),
        }, this.apiService.getActiveLayerId());
        this.apiService.addDraftElements([this.element]);
    }
    handlePointerMove(event) {
        if (!this.active || !this.element)
            return;
        const { x, y } = this.getPointerPosition(event);
        const points = [...this.element.points, [x, y]];
        this.element.points = points;
        this.apiService.updateDraftElements([
            {
                id: this.element.id,
                points,
            },
        ]);
    }
    handlePointerUp() {
        if (!this.active)
            return;
        if (this.element) {
            const element = this.element;
            this.apiService.updateDraftElements([
                {
                    id: element.id,
                    isComplete: true,
                },
            ]);
            this.apiService.commitDraftElements();
            if (element.selectAfterDraw) {
                this.apiService.selectElements([element.id]);
            }
            this.element = null;
        }
    }
    getElementStyle() {
        const penType = this.whiteboardConfig.penType;
        const preset = getPresetForType(penType, PenThickness.Medium);
        return {
            strokeColor: this.whiteboardConfig.strokeColor,
            strokeWidth: this.whiteboardConfig.strokeWidth,
            lineCap: this.whiteboardConfig.lineCap,
            lineJoin: this.whiteboardConfig.lineJoin,
            dasharray: this.whiteboardConfig.dasharray,
            dashoffset: this.whiteboardConfig.dashoffset,
            opacity: preset.opacity,
        };
    }
}

class RectangleTool extends BaseTool {
    type = ToolType.Rectangle;
    baseCursor = CursorType.Crosshair;
    element = null;
    startPoint = null;
    handlePointerDown(event) {
        if (!this.active)
            return;
        let { x, y } = this.getPointerPosition(event);
        const { snapToGrid: allowedSnap } = this.whiteboardConfig;
        if (allowedSnap) {
            const { gridSize } = this.whiteboardConfig;
            x = snapToGrid(x, gridSize);
            y = snapToGrid(y, gridSize);
        }
        this.startPoint = { x, y };
        this.element = createElement(ElementType.Rectangle, {
            x,
            y,
            style: this.getElementStyle(),
            zIndex: this.apiService.getNextZIndex(),
        }, this.apiService.getActiveLayerId());
        this.apiService.addDraftElements([this.element]);
    }
    handlePointerMove(event) {
        if (!this.active || !this.element || !this.startPoint)
            return;
        const { x, y } = this.getPointerPosition(event);
        const start_x = this.startPoint.x;
        const start_y = this.startPoint.y;
        let w = Math.abs(x - start_x);
        let h = Math.abs(y - start_y);
        let new_x = null;
        let new_y = null;
        if (event.shiftKey) {
            w = h = Math.max(w, h);
            new_x = start_x < x ? start_x : start_x - w;
            new_y = start_y < y ? start_y : start_y - h;
        }
        else {
            new_x = Math.min(start_x, x);
            new_y = Math.min(start_y, y);
        }
        if (event.altKey) {
            w *= 2;
            h *= 2;
            new_x = start_x - w / 2;
            new_y = start_y - h / 2;
        }
        const { snapToGrid: allowedSnap } = this.whiteboardConfig;
        if (allowedSnap) {
            const { gridSize } = this.whiteboardConfig;
            w = snapToGrid(w, gridSize);
            h = snapToGrid(h, gridSize);
            new_x = snapToGrid(new_x, gridSize);
            new_y = snapToGrid(new_y, gridSize);
        }
        this.apiService.updateDraftElements([{ id: this.element.id, width: w, height: h, x: new_x, y: new_y }]);
    }
    handlePointerUp() {
        if (!this.active)
            return;
        if (this.element && this.startPoint) {
            const element = this.element;
            this.apiService.commitDraftElements();
            // Handle selection based on element's selectAfterDraw property
            if (element.selectAfterDraw) {
                this.apiService.selectElements([element.id]);
            }
            this.startPoint = null;
            this.element = null;
        }
    }
    getElementStyle() {
        return {
            strokeColor: this.whiteboardConfig.strokeColor,
            strokeWidth: this.whiteboardConfig.strokeWidth,
            lineJoin: this.whiteboardConfig.lineJoin,
            fill: this.whiteboardConfig.fill,
            dasharray: this.whiteboardConfig.dasharray,
            dashoffset: this.whiteboardConfig.dashoffset,
        };
    }
}

var SelectAction;
(function (SelectAction) {
    SelectAction[SelectAction["None"] = 0] = "None";
    SelectAction[SelectAction["Select"] = 1] = "Select";
    SelectAction[SelectAction["Move"] = 2] = "Move";
    SelectAction[SelectAction["Resize"] = 3] = "Resize";
    SelectAction[SelectAction["Rotate"] = 4] = "Rotate";
    SelectAction[SelectAction["BoxSelect"] = 5] = "BoxSelect";
})(SelectAction || (SelectAction = {}));
class SelectTool extends BaseTool {
    type = ToolType.Select;
    baseCursor = CursorType.Default;
    currentAction = SelectAction.None;
    startPoint = null;
    currentHandle = null;
    rotateStartAngle = null;
    selectionCenter = null;
    initialBoundingBox = null;
    initialElementRotations = new Map();
    initialElementStates = new Map();
    rafId = null;
    pendingPointerEvent = null;
    getCurrentAction() {
        return this.currentAction;
    }
    getStartPoint() {
        return this.startPoint;
    }
    getCurrentHandle() {
        return this.currentHandle;
    }
    onDeactivate() {
        this.apiService.clearSelection();
    }
    handlePointerDown(event) {
        const target = getMouseTarget(event);
        const targetId = target?.id ?? '';
        this.startPoint = this.getPointerPosition(event);
        if (targetId.includes(ITEM_PREFIX)) {
            const elementId = target?.getAttribute(DATA_ID) ?? null;
            this.handleElementSelect(elementId, event.shiftKey);
            this.currentAction = SelectAction.Move;
        }
        else if (targetId.includes(SELECTOR_GRIP_RESIZE)) {
            this.currentHandle = this.getResizeDirection(targetId);
            this.initializeResize();
            this.currentAction = SelectAction.Resize;
        }
        else if (targetId.includes(SELECTOR_GRIP_ROTATE)) {
            this.initializeRotation(event);
            this.currentAction = SelectAction.Rotate;
        }
        else if (targetId.includes(SELECTOR_BOX)) {
            this.currentAction = SelectAction.Move;
        }
        else {
            this.initializeBoxSelect(event);
            this.currentAction = SelectAction.BoxSelect;
        }
    }
    handlePointerMove(event) {
        this.pendingPointerEvent = event;
        if (this.rafId === null) {
            this.rafId = requestAnimationFrame(() => {
                this.rafId = null;
                if (!this.pendingPointerEvent || !this.startPoint) {
                    return;
                }
                const event = this.pendingPointerEvent;
                const currentPoint = this.getPointerPosition(event);
                switch (this.currentAction) {
                    case SelectAction.Move:
                        this.handleMove(currentPoint, event.shiftKey);
                        break;
                    case SelectAction.Resize:
                        this.handleResize(currentPoint, event.shiftKey);
                        break;
                    case SelectAction.Rotate:
                        this.handleRotate(currentPoint, event.ctrlKey);
                        break;
                    case SelectAction.BoxSelect:
                        this.handleBoxSelect(currentPoint, event.shiftKey);
                        break;
                }
            });
        }
    }
    handlePointerUp() {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.pendingPointerEvent = null;
        if (this.currentAction === SelectAction.BoxSelect) {
            this.apiService.clearSelectionBox();
        }
        if (this.currentAction === SelectAction.Rotate) {
            this.initialElementRotations.clear();
            this.apiService.updateBoundingBox();
        }
        this.initialElementStates.clear();
        this.currentAction = SelectAction.None;
        this.startPoint = null;
        this.currentHandle = null;
        this.rotateStartAngle = null;
        this.selectionCenter = null;
        this.initialBoundingBox = null;
    }
    handleElementSelect(elementId, isMultiSelect) {
        if (!elementId)
            return;
        const element = this.apiService.getElementById(elementId);
        if (!element)
            return;
        if (element.locked) {
            return;
        }
        if (isMultiSelect) {
            this.apiService.toggleSelection(element);
        }
        else {
            this.apiService.selectElements([element]);
        }
    }
    handleMove(currentPoint, shiftKey) {
        if (!this.startPoint)
            return;
        const dx = currentPoint.x - this.startPoint.x;
        const dy = currentPoint.y - this.startPoint.y;
        let snappedX = dx;
        let snappedY = dy;
        if (shiftKey) {
            const snapped = getSnappedOffset(dx, dy);
            snappedX = snapped.x;
            snappedY = snapped.y;
        }
        this.apiService.transformSelectedElements((elements) => elements.map((element) => {
            if (element.locked) {
                return element;
            }
            return {
                ...element,
                x: element.x + snappedX,
                y: element.y + snappedY,
            };
        }));
        this.startPoint = currentPoint;
    }
    handleResize(currentPoint, shiftKey) {
        if (!this.startPoint || this.currentHandle === null || !this.initialBoundingBox)
            return;
        const handle = this.currentHandle;
        const selectedElements = this.apiService.getSelectedElements();
        if (!selectedElements.length)
            return;
        if (selectedElements.length === 1) {
            const element = selectedElements[0];
            const initialElement = this.initialElementStates.get(element.id);
            if (!initialElement)
                return;
            const dx = currentPoint.x - this.startPoint.x;
            const dy = currentPoint.y - this.startPoint.y;
            let localDx = dx;
            let localDy = dy;
            if (element.rotation && element.rotation !== 0) {
                const angleRad = (-element.rotation * Math.PI) / 180;
                const cos = Math.cos(angleRad);
                const sin = Math.sin(angleRad);
                localDx = dx * cos - dy * sin;
                localDy = dx * sin + dy * cos;
            }
            let snappedX = localDx;
            let snappedY = localDy;
            if (shiftKey) {
                const snapped = getSnappedOffset(localDx, localDy);
                snappedX = snapped.x;
                snappedY = snapped.y;
            }
            this.apiService.transformSelectedElements((elements) => elements.map((el) => {
                if (el.locked) {
                    return el;
                }
                const initial = this.initialElementStates.get(el.id);
                if (!initial)
                    return el;
                let anchorPointBefore = null;
                if (initial.rotation && initial.rotation !== 0) {
                    const initialAny = initial;
                    const width = initialAny['width'] || initialAny['rx'] * 2 || 0;
                    const height = initialAny['height'] || initialAny['ry'] * 2 || 0;
                    let anchorLocalX = 0, anchorLocalY = 0;
                    if (handle.includes(Direction.N))
                        anchorLocalY = height;
                    else if (handle.includes(Direction.S))
                        anchorLocalY = 0;
                    else
                        anchorLocalY = height / 2;
                    if (handle.includes(Direction.W))
                        anchorLocalX = width;
                    else if (handle.includes(Direction.E))
                        anchorLocalX = 0;
                    else
                        anchorLocalX = width / 2;
                    const angleRad = (initial.rotation * Math.PI) / 180;
                    const cos = Math.cos(angleRad);
                    const sin = Math.sin(angleRad);
                    anchorPointBefore = {
                        x: initial.x + (anchorLocalX * cos - anchorLocalY * sin),
                        y: initial.y + (anchorLocalX * sin + anchorLocalY * cos),
                    };
                }
                const elementUtil = getElementUtil(initial.type);
                const resized = elementUtil.resize({ ...initial }, handle, snappedX, snappedY);
                if (initial.rotation && initial.rotation !== 0 && anchorPointBefore) {
                    const resizedAny = resized;
                    const width = resizedAny['width'] || resizedAny['rx'] * 2 || 0;
                    const height = resizedAny['height'] || resizedAny['ry'] * 2 || 0;
                    let anchorLocalX = 0, anchorLocalY = 0;
                    if (handle.includes(Direction.N))
                        anchorLocalY = height;
                    else if (handle.includes(Direction.S))
                        anchorLocalY = 0;
                    else
                        anchorLocalY = height / 2;
                    if (handle.includes(Direction.W))
                        anchorLocalX = width;
                    else if (handle.includes(Direction.E))
                        anchorLocalX = 0;
                    else
                        anchorLocalX = width / 2;
                    const rotation = resized.rotation ?? 0;
                    const angleRad = (rotation * Math.PI) / 180;
                    const cos = Math.cos(angleRad);
                    const sin = Math.sin(angleRad);
                    const anchorPointAfter = {
                        x: resized.x + (anchorLocalX * cos - anchorLocalY * sin),
                        y: resized.y + (anchorLocalX * sin + anchorLocalY * cos),
                    };
                    resized.x += anchorPointBefore.x - anchorPointAfter.x;
                    resized.y += anchorPointBefore.y - anchorPointAfter.y;
                }
                return resized;
            }));
            return;
        }
        const initialBounds = this.initialBoundingBox;
        const dx = currentPoint.x - this.startPoint.x;
        const dy = currentPoint.y - this.startPoint.y;
        let anchorX, anchorY;
        let newWidth, newHeight;
        switch (handle) {
            case Direction.N:
                anchorX = initialBounds.x;
                anchorY = initialBounds.y + initialBounds.height;
                newWidth = initialBounds.width;
                newHeight = initialBounds.height - dy;
                break;
            case Direction.S:
                anchorX = initialBounds.x;
                anchorY = initialBounds.y;
                newWidth = initialBounds.width;
                newHeight = initialBounds.height + dy;
                break;
            case Direction.E:
                anchorX = initialBounds.x;
                anchorY = initialBounds.y;
                newWidth = initialBounds.width + dx;
                newHeight = initialBounds.height;
                break;
            case Direction.W:
                anchorX = initialBounds.x + initialBounds.width;
                anchorY = initialBounds.y;
                newWidth = initialBounds.width - dx;
                newHeight = initialBounds.height;
                break;
            case Direction.NE:
                anchorX = initialBounds.x;
                anchorY = initialBounds.y + initialBounds.height;
                newWidth = initialBounds.width + dx;
                newHeight = initialBounds.height - dy;
                break;
            case Direction.NW:
                anchorX = initialBounds.x + initialBounds.width;
                anchorY = initialBounds.y + initialBounds.height;
                newWidth = initialBounds.width - dx;
                newHeight = initialBounds.height - dy;
                break;
            case Direction.SE:
                anchorX = initialBounds.x;
                anchorY = initialBounds.y;
                newWidth = initialBounds.width + dx;
                newHeight = initialBounds.height + dy;
                break;
            case Direction.SW:
                anchorX = initialBounds.x + initialBounds.width;
                anchorY = initialBounds.y;
                newWidth = initialBounds.width - dx;
                newHeight = initialBounds.height + dy;
                break;
            default:
                return;
        }
        if (newWidth <= 0 || newHeight <= 0)
            return;
        const scaleX = newWidth / initialBounds.width;
        const scaleY = newHeight / initialBounds.height;
        let finalScaleX = scaleX;
        let finalScaleY = scaleY;
        if (shiftKey) {
            const uniformScale = Math.min(Math.abs(scaleX), Math.abs(scaleY)) * Math.sign(scaleX) * Math.sign(scaleY);
            finalScaleX = uniformScale;
            finalScaleY = uniformScale;
        }
        this.apiService.transformSelectedElements((elements) => elements.map((element) => {
            if (element.locked) {
                return element;
            }
            const initialElement = this.initialElementStates.get(element.id);
            if (!initialElement) {
                return element;
            }
            const relX = initialElement.x - anchorX;
            const relY = initialElement.y - anchorY;
            const newRelX = relX * finalScaleX;
            const newRelY = relY * finalScaleY;
            const scaledX = anchorX + newRelX;
            const scaledY = anchorY + newRelY;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updates = {
                ...element,
                x: scaledX,
                y: scaledY,
            };
            if ('width' in initialElement && initialElement.width !== undefined) {
                updates.width = initialElement.width * Math.abs(finalScaleX);
            }
            if ('height' in initialElement && initialElement.height !== undefined) {
                updates.height = initialElement.height * Math.abs(finalScaleY);
            }
            if (initialElement.style?.strokeWidth) {
                const avgScale = (Math.abs(finalScaleX) + Math.abs(finalScaleY)) / 2;
                updates.style = {
                    ...element.style,
                    strokeWidth: initialElement.style.strokeWidth * avgScale,
                };
            }
            updates.rotation = initialElement.rotation;
            return updates;
        }));
    }
    handleRotate(currentPoint, ctrlKey) {
        if (!this.startPoint || !this.selectionCenter || this.rotateStartAngle === null)
            return;
        const selectedElements = this.apiService.getSelectedElements();
        if (selectedElements.length === 0)
            return;
        const currentAngle = calculateAngle(this.selectionCenter, currentPoint);
        let deltaAngle = currentAngle - this.rotateStartAngle;
        if (deltaAngle > 180)
            deltaAngle -= 360;
        if (deltaAngle < -180)
            deltaAngle += 360;
        if (ctrlKey) {
            deltaAngle = Math.round(deltaAngle / 15) * 15;
        }
        if (selectedElements.length > 1) {
            const selectionCenter = this.selectionCenter;
            this.apiService.transformSelectedElements((elements) => elements.map((element) => {
                if (element.locked) {
                    return element;
                }
                const initialElement = this.initialElementStates.get(element.id);
                if (!initialElement) {
                    return element;
                }
                const initialRotation = this.initialElementRotations.get(element.id) ?? initialElement.rotation ?? 0;
                const elementUtil = getElementUtil(initialElement.type);
                const bounds = elementUtil.getBounds(initialElement);
                const elementCenter = {
                    x: (bounds.minX + bounds.maxX) / 2,
                    y: (bounds.minY + bounds.maxY) / 2,
                };
                const newCenter = rotatePointAroundCenter(elementCenter, selectionCenter, deltaAngle);
                const centerOffsetX = elementCenter.x - initialElement.x;
                const centerOffsetY = elementCenter.y - initialElement.y;
                const newX = newCenter.x - centerOffsetX;
                const newY = newCenter.y - centerOffsetY;
                const newRotation = normalizeAngle(initialRotation + deltaAngle);
                return {
                    ...element,
                    x: newX,
                    y: newY,
                    rotation: newRotation,
                };
            }));
        }
        else {
            const element = selectedElements[0];
            const initialRotation = this.initialElementRotations.get(element.id) ?? element.rotation ?? 0;
            let newRotation = initialRotation + deltaAngle;
            newRotation = normalizeAngle(newRotation);
            this.apiService.transformSelectedElements((elements) => elements.map((el) => {
                if (el.locked) {
                    return el;
                }
                return {
                    ...el,
                    rotation: newRotation,
                };
            }));
        }
    }
    handleBoxSelect(currentPoint, shiftKey) {
        if (!this.startPoint)
            return;
        const selectionBox = {
            x: Math.min(this.startPoint.x, currentPoint.x),
            y: Math.min(this.startPoint.y, currentPoint.y),
            width: Math.abs(currentPoint.x - this.startPoint.x),
            height: Math.abs(currentPoint.y - this.startPoint.y),
            visible: true,
        };
        this.apiService.setSelectionBox(selectionBox);
        const allElements = this.apiService.getElements();
        const elementsInBox = allElements.filter((element) => this.checkElementInSelectionBox(element, selectionBox) && !element.locked);
        this.apiService.selectElements(elementsInBox, shiftKey);
        this.apiService.updateBoundingBox();
    }
    initializeBoxSelect(event) {
        if (!event.shiftKey) {
            this.apiService.clearSelection();
        }
        const { x, y } = this.getPointerPosition(event);
        const selectionBox = {
            x,
            y,
            width: 0,
            height: 0,
            visible: true,
        };
        this.apiService.setSelectionBox(selectionBox);
    }
    initializeResize() {
        const selectedElements = this.apiService.getSelectedElements();
        if (selectedElements.length === 0)
            return;
        this.initialElementStates.clear();
        selectedElements.forEach((element) => {
            this.initialElementStates.set(element.id, { ...element });
        });
        const allBounds = selectedElements.map((el) => getElementBounds(el));
        const minX = Math.min(...allBounds.map((b) => b.minX));
        const minY = Math.min(...allBounds.map((b) => b.minY));
        const maxX = Math.max(...allBounds.map((b) => b.maxX));
        const maxY = Math.max(...allBounds.map((b) => b.maxY));
        this.initialBoundingBox = {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    }
    initializeRotation(event) {
        const bboxOrSignal = this.apiService.getBoundingBoxSignal();
        const maybeFn = bboxOrSignal;
        const bbox = typeof maybeFn === 'function' ? maybeFn() : bboxOrSignal;
        if (!bbox)
            return;
        this.selectionCenter = {
            x: bbox.x + bbox.width / 2,
            y: bbox.y + bbox.height / 2,
        };
        const point = this.getPointerPosition(event);
        this.rotateStartAngle = calculateAngle(this.selectionCenter, point);
        const selectedElements = this.apiService.getSelectedElements();
        this.initialElementRotations.clear();
        this.initialElementStates.clear();
        selectedElements.forEach((element) => {
            this.initialElementRotations.set(element.id, element.rotation || 0);
            this.initialElementStates.set(element.id, { ...element });
        });
        this.apiService.setBoundingBox(null);
    }
    checkElementInSelectionBox(element, selectionBox) {
        const elementUtil = getElementUtil(element.type);
        const bounds = elementUtil.getBounds(element);
        return isElementInSelectionBox(bounds, selectionBox);
    }
    getResizeDirection(handleId) {
        const staticDirectionStr = handleId.split('_')[2];
        let baseDirection = Direction.N;
        if (Object.values(Direction).includes(staticDirectionStr)) {
            baseDirection = staticDirectionStr;
        }
        const selectedElements = this.apiService.getSelectedElements();
        if (selectedElements.length > 0) {
            const rotation = selectedElements[0].rotation || 0;
            return getRotatedDirection(baseDirection, rotation);
        }
        return baseDirection;
    }
}

class TextTool extends BaseTool {
    type = ToolType.Text;
    baseCursor = CursorType.Text;
    textElement = null;
    textInput = null;
    handlePointerDown(event) {
        if (!this.active)
            return;
        if (this.textInput) {
            this.finishTextInput();
            return;
        }
        const targetElement = getTargetElement(event, this.apiService.getElements());
        if (targetElement && targetElement.type === ElementType.Text) {
            this.textElement = targetElement;
            this.createTextInput(targetElement.x, targetElement.y, targetElement.text);
            return;
        }
        const { x, y } = this.getPointerPosition(event);
        const fontSize = this.whiteboardConfig.fontSize || 16;
        const adjustedY = y + fontSize * 0.8;
        this.textElement = this.createTextElement(x, adjustedY);
        this.createTextInput(x, adjustedY, '', event);
    }
    handlePointerUp() {
        if (this.textInput) {
            this.textInput.addEventListener('blur', () => this.finishTextInput());
            this.textInput.focus();
        }
    }
    createTextElement(x, y) {
        const { snapToGrid: allowedSnap, gridSize } = this.whiteboardConfig;
        return createElement(ElementType.Text, {
            x: allowedSnap ? snapToGrid(x, gridSize) : x,
            y: allowedSnap ? snapToGrid(y, gridSize) : y,
            text: '',
            style: this.getElementStyle(),
            zIndex: this.apiService.getNextZIndex(),
        }, this.apiService.getActiveLayerId());
    }
    createTextInput(x, y, initialValue = '', event) {
        const borderOffset = 1;
        const fontSize = this.textElement?.style?.fontSize || 16;
        const baselineOffset = fontSize * 0.8;
        const svgElement = this.apiService.getCanvas();
        const container = svgElement.parentElement;
        if (!container) {
            console.error('Cannot find whiteboard container');
            return;
        }
        const containerRect = container.getBoundingClientRect();
        let calculatedLeft;
        let calculatedTop;
        if (event) {
            calculatedLeft = event.clientX - containerRect.left - borderOffset;
            calculatedTop = event.clientY - containerRect.top - borderOffset;
        }
        else {
            const config = this.whiteboardConfig;
            calculatedLeft = config.canvasX + (x + config.x) * config.zoom - borderOffset;
            calculatedTop = config.canvasY + (y + config.y) * config.zoom - borderOffset - baselineOffset * config.zoom;
        }
        const textarea = document.createElement('textarea');
        textarea.id = 'whiteboard-text-input';
        textarea.setAttribute('aria-label', 'Text input');
        textarea.style.position = 'absolute';
        textarea.style.left = `${calculatedLeft}px`;
        textarea.style.top = `${calculatedTop}px`;
        textarea.style.fontSize = `${this.textElement?.style?.fontSize || 16}px`;
        textarea.style.fontFamily = this.textElement?.style?.fontFamily || 'Arial';
        textarea.style.color = this.textElement?.style?.color || '#000000';
        textarea.style.fontWeight = this.textElement?.style?.fontWeight || 'normal';
        textarea.style.fontStyle = this.textElement?.style?.fontStyle || 'normal';
        textarea.style.border = '1px dashed #000';
        textarea.style.background = 'white';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.overflow = 'hidden';
        textarea.style.lineHeight = '1.2';
        textarea.style.whiteSpace = 'pre-wrap';
        textarea.style.margin = '0';
        textarea.style.padding = '2px';
        textarea.style.boxSizing = 'border-box';
        textarea.style.zIndex = '10000';
        textarea.style.pointerEvents = 'auto';
        textarea.value = initialValue;
        textarea.rows = 1;
        textarea.addEventListener('input', () => this.handleTextInput(textarea));
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                this.finishTextInput();
            }
            else if (e.key === 'Escape') {
                e.preventDefault();
                this.finishTextInput();
            }
        });
        if (container) {
            container.appendChild(textarea);
        }
        else {
            document.body.appendChild(textarea);
        }
        textarea.focus();
        this.textInput = textarea;
        this.handleTextInput(textarea);
    }
    handleTextInput(input) {
        const lines = input.value.split('\n');
        const maxLineLength = lines.reduce((max, line) => Math.max(max, line.length), 0);
        input.style.width = `${Math.max(maxLineLength, 10)}ch`;
        input.rows = Math.max(lines.length, 1);
        if (this.textElement) {
            this.textElement.text = input.value;
            this.apiService.updateElements([this.textElement]);
        }
    }
    finishTextInput() {
        if (this.textInput && this.textElement) {
            if (this.textInput.value.trim()) {
                if (!this.apiService.elementExists(this.textElement.id)) {
                    this.apiService.addElements([this.textElement]);
                    if (this.textElement.selectAfterDraw) {
                        this.apiService.selectElements([this.textElement.id]);
                    }
                }
            }
            else {
                this.apiService.removeElements([this.textElement]);
            }
            try {
                if (this.textInput.parentElement) {
                    this.textInput.parentElement.removeChild(this.textInput);
                }
            }
            catch {
                // Textarea already removed
            }
            this.textInput = null;
            this.textElement = null;
        }
    }
    getElementStyle() {
        return {
            color: this.whiteboardConfig.strokeColor,
            fontSize: this.whiteboardConfig.fontSize,
            fontFamily: this.whiteboardConfig.fontFamily,
            lineJoin: this.whiteboardConfig.lineJoin,
            lineCap: this.whiteboardConfig.lineCap,
            dasharray: this.whiteboardConfig.dasharray,
            dashoffset: this.whiteboardConfig.dashoffset,
            strokeColor: this.whiteboardConfig.fill,
            strokeWidth: 0,
        };
    }
}

class ToolFactory {
    createTool(toolType, apiService) {
        switch (toolType) {
            case ToolType.Arrow:
                return new ArrowTool(apiService);
            case ToolType.Ellipse:
                return new EllipseTool(apiService);
            case ToolType.Eraser:
                return new EraserTool(apiService);
            case ToolType.Hand:
                return new HandTool(apiService);
            case ToolType.Image:
                return new ImageTool(apiService);
            case ToolType.Line:
                return new LineTool(apiService);
            case ToolType.Pen:
                return new PenTool(apiService);
            case ToolType.Rectangle:
                return new RectangleTool(apiService);
            case ToolType.Select:
                return new SelectTool(apiService);
            case ToolType.Text:
                return new TextTool(apiService);
            default:
                throw new Error(`Unknown tool type: ${toolType}`);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ToolFactory, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ToolFactory, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ToolFactory, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

const DEFAULT_TOOLS = [
    {
        id: 'hand',
        type: ToolType.Hand,
        name: 'Hand',
        description: 'Pan and navigate the canvas',
        icon: TOOL_ICONS[ToolType.Hand],
        enabled: true,
        order: 0,
    },
    {
        id: 'select',
        type: ToolType.Select,
        name: 'Select',
        description: 'Select and manipulate elements',
        icon: TOOL_ICONS[ToolType.Select],
        enabled: true,
        order: 1,
    },
    {
        id: 'pen',
        type: ToolType.Pen,
        name: 'Pen',
        description: 'Draw freehand lines',
        icon: TOOL_ICONS[ToolType.Pen],
        enabled: true,
        order: 2,
    },
    {
        id: 'line',
        type: ToolType.Line,
        name: 'Line',
        description: 'Draw straight lines',
        icon: TOOL_ICONS[ToolType.Line],
        enabled: true,
        order: 3,
    },
    {
        id: 'arrow',
        type: ToolType.Arrow,
        name: 'Arrow',
        description: 'Draw arrow lines',
        icon: TOOL_ICONS[ToolType.Arrow],
        enabled: true,
        order: 4,
    },
    {
        id: 'rectangle',
        type: ToolType.Rectangle,
        name: 'Rectangle',
        description: 'Draw rectangles',
        icon: TOOL_ICONS[ToolType.Rectangle],
        enabled: true,
        order: 5,
    },
    {
        id: 'ellipse',
        type: ToolType.Ellipse,
        name: 'Ellipse',
        description: 'Draw ellipses and circles',
        icon: TOOL_ICONS[ToolType.Ellipse],
        enabled: true,
        order: 6,
    },
    {
        id: 'text',
        type: ToolType.Text,
        name: 'Text',
        description: 'Add text annotations',
        icon: TOOL_ICONS[ToolType.Text],
        enabled: true,
        order: 7,
    },
    {
        id: 'image',
        type: ToolType.Image,
        name: 'Image',
        description: 'Add images',
        icon: TOOL_ICONS[ToolType.Image],
        enabled: true,
        order: 8,
    },
    {
        id: 'eraser',
        type: ToolType.Eraser,
        name: 'Eraser',
        description: 'Remove elements',
        icon: TOOL_ICONS[ToolType.Eraser],
        enabled: true,
        order: 9,
    },
];
class ToolsService {
    eventBusService = inject(EventBusService);
    toolFactory = inject(ToolFactory);
    _apiServiceCache = signal(undefined);
    _selectedTool = signal(ToolType.Pen);
    _toolConfigs = signal(new Map());
    _currentToolInstance = signal(null);
    _cursor = signal(CursorType.Default);
    _temporaryOverrides = signal([]);
    toolInstanceCache = new Map();
    selectedTool = this._selectedTool.asReadonly();
    currentTool = this._currentToolInstance.asReadonly();
    cursor = this._cursor.asReadonly();
    temporaryOverrides = this._temporaryOverrides.asReadonly();
    effectiveTool = computed(() => {
        const overrides = this._temporaryOverrides();
        return overrides.length > 0 ? overrides[overrides.length - 1].tool : this._selectedTool();
    });
    availableTools = computed(() => {
        const configs = this._toolConfigs();
        return Array.from(configs.values())
            .filter((tool) => tool.enabled)
            .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    });
    constructor() {
        this.initializeDefaultTools();
        effect(() => {
            const toolType = this.effectiveTool();
            const apiService = this._apiServiceCache();
            // Only update tool instance after ApiService is initialized
            if (apiService) {
                this.updateCurrentToolInstance(toolType);
            }
        }, { allowSignalWrites: true });
        effect(() => {
            // Only update cursor after tool instance is available
            if (this._currentToolInstance()) {
                this.updateCursorForActiveTool();
            }
        }, { allowSignalWrites: true });
    }
    initializeDefaultTools() {
        const configMap = new Map();
        DEFAULT_TOOLS.forEach((config) => {
            configMap.set(config.id, { ...config });
        });
        this._toolConfigs.set(configMap);
    }
    updateCurrentToolInstance(toolType) {
        const currentTool = this._currentToolInstance();
        if (currentTool && currentTool.type !== toolType) {
            currentTool.deactivate();
        }
        const newTool = this.getToolInstance(toolType);
        newTool.activate();
        this._currentToolInstance.set(newTool);
        if (!this.hasTemporaryOverride()) {
            this.eventBusService.emit(WhiteboardEvent.ToolChange, toolType);
        }
    }
    updateCursorForActiveTool() {
        const tool = this._currentToolInstance();
        if (tool && 'baseCursor' in tool) {
            this._cursor.set(tool.baseCursor);
        }
        else {
            this._cursor.set(CursorType.Default);
        }
    }
    getActiveToolType() {
        return this.effectiveTool();
    }
    getActiveToolInstance() {
        const tool = this._currentToolInstance();
        if (!tool) {
            throw new Error('No active tool instance found.');
        }
        return tool;
    }
    setActiveTool(tool) {
        if (this._selectedTool() !== tool) {
            this._selectedTool.set(tool);
        }
    }
    isToolActive(tool) {
        return this.effectiveTool() === tool;
    }
    getToolInstance(toolType) {
        const isRegistered = Array.from(this._toolConfigs().values()).some((config) => config.type === toolType);
        if (!isRegistered) {
            throw new Error(`Tool type '${toolType}' is not registered.`);
        }
        if (!this.toolInstanceCache.has(toolType)) {
            const apiService = this._apiServiceCache();
            if (!apiService) {
                throw new Error('ApiService not set. Call setApiService() first.');
            }
            const tool = this.toolFactory.createTool(toolType, apiService);
            this.toolInstanceCache.set(toolType, tool);
        }
        const tool = this.toolInstanceCache.get(toolType);
        if (!tool) {
            throw new Error(`Failed to create or retrieve tool instance for type: ${toolType}`);
        }
        return tool;
    }
    getRegisteredToolTypes() {
        return Array.from(this._toolConfigs().values())
            .map((config) => config.type)
            .filter((type, index, array) => array.indexOf(type) === index);
    }
    isToolRegistered(toolType) {
        return Array.from(this._toolConfigs().values()).some((config) => config.type === toolType);
    }
    resetToDefaultTool() {
        this.setActiveTool(ToolType.Pen);
    }
    registerTool(config) {
        const currentConfigs = this._toolConfigs();
        const updatedConfigs = new Map(currentConfigs);
        updatedConfigs.set(config.id, { ...config });
        this._toolConfigs.set(updatedConfigs);
    }
    registerTools(configs) {
        const currentConfigs = this._toolConfigs();
        const updatedConfigs = new Map(currentConfigs);
        configs.forEach((config) => {
            updatedConfigs.set(config.id, { ...config });
        });
        this._toolConfigs.set(updatedConfigs);
    }
    unregisterTool(toolId) {
        const currentConfigs = this._toolConfigs();
        if (!currentConfigs.has(toolId)) {
            return false;
        }
        const toolConfig = currentConfigs.get(toolId);
        const updatedConfigs = new Map(currentConfigs);
        updatedConfigs.delete(toolId);
        this._toolConfigs.set(updatedConfigs);
        if (this._selectedTool() === toolConfig?.type) {
            this.resetToDefaultTool();
        }
        return true;
    }
    getToolConfig(toolId) {
        return this._toolConfigs().get(toolId);
    }
    getToolConfigs() {
        return Array.from(this._toolConfigs().values());
    }
    setToolEnabled(toolId, enabled) {
        const config = this.getToolConfig(toolId);
        if (!config)
            return false;
        this.registerTool({ ...config, enabled });
        if (!enabled && this._selectedTool() === config.type) {
            this.resetToDefaultTool();
        }
        return true;
    }
    setToolEnabledByType(toolType, enabled) {
        const config = Array.from(this._toolConfigs().values()).find((c) => c.type === toolType);
        if (!config)
            return false;
        return this.setToolEnabled(config.id, enabled);
    }
    setEnabledTools(toolTypes) {
        const enabledSet = new Set(toolTypes);
        const currentConfigs = this._toolConfigs();
        const updatedConfigs = new Map();
        currentConfigs.forEach((config, id) => {
            updatedConfigs.set(id, {
                ...config,
                enabled: enabledSet.has(config.type),
            });
        });
        this._toolConfigs.set(updatedConfigs);
        if (!enabledSet.has(this._selectedTool())) {
            const firstEnabled = toolTypes[0] || ToolType.Pen;
            this.setActiveTool(firstEnabled);
        }
    }
    pushTemporaryTool(tool, reason = `temp-${Date.now()}`) {
        const overrides = this._temporaryOverrides();
        if (overrides.some((override) => override.reason === reason)) {
            return;
        }
        const newOverride = {
            tool,
            reason,
            timestamp: Date.now(),
        };
        this._temporaryOverrides.update((overrides) => [...overrides, newOverride]);
    }
    popTemporaryTool(reason) {
        const overrides = this._temporaryOverrides();
        if (overrides.length === 0)
            return;
        let newOverrides;
        if (reason) {
            newOverrides = overrides.filter((override) => override.reason !== reason);
        }
        else {
            newOverrides = overrides.slice(0, -1);
        }
        if (newOverrides.length !== overrides.length) {
            this._temporaryOverrides.set(newOverrides);
        }
    }
    clearTemporaryTools() {
        this._temporaryOverrides.set([]);
    }
    hasTemporaryOverride() {
        return this._temporaryOverrides().length > 0;
    }
    setCursor(cursor) {
        this._cursor.set(cursor);
    }
    resetCursor() {
        this.updateCursorForActiveTool();
    }
    destroy() {
        const currentTool = this._currentToolInstance();
        if (currentTool) {
            currentTool.deactivate();
        }
        this.toolInstanceCache.clear();
        this.clearTemporaryTools();
    }
    setApiService(apiService) {
        this._apiServiceCache.set(apiService);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ToolsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ToolsService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ToolsService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });

class SelectionService {
    eventBus;
    clipboardService;
    elementsService;
    toolsService;
    canvasService;
    OFFSET_INCREMENT = 20;
    // Selection state
    selectedElementIdsSignal = signal(new Set());
    selectionBoxSignal = signal({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        visible: false,
    });
    boundingBoxSignal = signal(null);
    // Derived signals
    selectedIdsSignal = computed(() => Array.from(this.selectedElementIdsSignal()));
    hasSelectionSignal = computed(() => this.selectedElementIdsSignal().size > 0);
    getElementsFn;
    updateElementsFn;
    removeElementsFn;
    constructor(eventBus, clipboardService, elementsService, toolsService, canvasService) {
        this.eventBus = eventBus;
        this.clipboardService = clipboardService;
        this.elementsService = elementsService;
        this.toolsService = toolsService;
        this.canvasService = canvasService;
        this.initializeDataProviders();
    }
    initializeDataProviders() {
        this.getElementsFn = () => this.elementsService.getElements();
        this.updateElementsFn = (updates) => this.elementsService.updateElements(updates);
        this.removeElementsFn = (elements, history) => this.elementsService.removeElements(elements, history);
    }
    cutElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0)
            return;
        this.clipboardService.cut(selectedElements);
        this.deleteSelectedElements();
    }
    copyElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0)
            return;
        this.clipboardService.copy(selectedElements);
    }
    pasteElements() {
        const pastedElements = this.clipboardService.paste();
        if (pastedElements.length > 0) {
            this.selectElements(pastedElements);
        }
    }
    duplicateElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0)
            return;
        const duplicatedElements = this.clipboardService.duplicateElements(selectedElements);
        if (duplicatedElements.length > 0) {
            this.selectElements(duplicatedElements);
        }
    }
    deleteSelectedElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.removeElementsFn)
            return;
        this.removeElementsFn(selectedElements, true);
        this.clearSelection();
        // Emit granular event for elements removal
        this.eventBus.emit(WhiteboardEvent.ElementsRemoved, selectedElements);
        // Emit data change event
        this.eventBus.emit(WhiteboardEvent.DataChange, this.elementsService.getElements());
    }
    getSelectedIds() {
        return this.selectedIdsSignal();
    }
    /**
     * Get currently selected elements
     */
    getSelectedElements() {
        if (!this.getElementsFn) {
            console.warn('Element data provider not set');
            return [];
        }
        const ids = this.getSelectedIds();
        return this.getElementsFn().filter((el) => ids.includes(el.id));
    }
    getSelectedElementsSignal() {
        return computed(() => this.getSelectedElements());
    }
    /**
     * Check if element is selected
     */
    isSelected(elementOrId) {
        const id = typeof elementOrId === 'string' ? elementOrId : elementOrId.id;
        return this.selectedElementIdsSignal().has(id);
    }
    /**
     * Get selection count
     */
    getSelectionCount() {
        return this.selectedElementIdsSignal().size;
    }
    /**
     * Check if any elements are selected
     */
    hasSelection() {
        return this.getSelectionCount() > 0;
    }
    // SELECTION OPERATIONS
    /**
     * Select elements by reference or ID, with option to append to existing selection
     */
    selectElements(elementsOrIds, append = false) {
        const incoming = Array.isArray(elementsOrIds) ? elementsOrIds : [elementsOrIds];
        const selectedIds = incoming.map((el) => (typeof el === 'string' ? el : el.id));
        // Expand selection to include all grouped elements
        const expandedIds = this.expandSelectionToIncludeGroups(selectedIds);
        const currentSelection = Array.from(this.selectedElementIdsSignal());
        const newSelection = append ? [...new Set([...currentSelection, ...expandedIds])] : expandedIds;
        this.selectedElementIdsSignal.set(new Set(newSelection));
        if (newSelection.length > 0) {
            this.toolsService.setActiveTool(ToolType.Select);
        }
        // Get the updated selection elements after group expansion
        const fullSelectionElements = this.getSelectedElements();
        this.updateBoundingBoxFromElements(fullSelectionElements);
        this.eventBus.emit(WhiteboardEvent.ElementsSelected, fullSelectionElements);
    }
    /**
     * Deselect specific element
     */
    deselectElement(elementOrId) {
        const id = typeof elementOrId === 'string' ? elementOrId : elementOrId.id;
        const current = new Set(this.selectedElementIdsSignal());
        if (current.has(id)) {
            // Expand deselection to include all grouped elements
            const expandedIds = this.expandSelectionToIncludeGroups([id]);
            expandedIds.forEach((expandedId) => {
                current.delete(expandedId);
            });
            this.selectedElementIdsSignal.set(current);
            this.updateBoundingBox();
            const selectedElements = this.getSelectedElements();
            this.eventBus.emit(WhiteboardEvent.ElementsSelected, selectedElements);
        }
    }
    /**
     * Toggle selection of element
     */
    toggleSelection(elementOrId) {
        const id = typeof elementOrId === 'string' ? elementOrId : elementOrId.id;
        const current = new Set(this.selectedElementIdsSignal());
        const wasSelected = current.has(id);
        // Expand to include all grouped elements
        const expandedIds = this.expandSelectionToIncludeGroups([id]);
        if (wasSelected) {
            // Deselect all elements in the group
            expandedIds.forEach((expandedId) => {
                current.delete(expandedId);
            });
        }
        else {
            // Select all elements in the group
            expandedIds.forEach((expandedId) => {
                current.add(expandedId);
            });
            // Automatically activate select tool when an element gets selected
            this.toolsService.setActiveTool(ToolType.Select);
        }
        this.selectedElementIdsSignal.set(current);
        this.updateBoundingBox();
        const selectedElements = this.getSelectedElements();
        this.eventBus.emit(WhiteboardEvent.ElementsSelected, selectedElements);
    }
    /**
     * Clear all selection
     */
    clearSelection() {
        this.selectedElementIdsSignal.set(new Set());
        this.clearBoundingBox();
        this.eventBus.emit(WhiteboardEvent.ElementsSelected, []);
    }
    /**
     * Select all elements
     */
    selectAll() {
        if (!this.getElementsFn) {
            console.warn('Element data provider not set');
            return;
        }
        const allElements = this.getElementsFn();
        const ids = new Set(allElements.map((el) => el.id));
        this.selectedElementIdsSignal.set(ids);
        // Automatically activate select tool when elements are selected
        if (allElements.length > 0) {
            this.toolsService.setActiveTool(ToolType.Select);
        }
        this.updateBoundingBox();
        this.eventBus.emit(WhiteboardEvent.ElementsSelected, allElements);
    }
    /**
     * Select elements within a rectangular area
     */
    selectElementsInArea(area) {
        if (!this.getElementsFn) {
            console.warn('Element data provider not set');
            return;
        }
        const allElements = this.getElementsFn();
        const selectedIds = [];
        allElements.forEach((element) => {
            const bounds = getElementBounds(element);
            // Check if element intersects with selection area
            const intersects = !(bounds.maxX < area.x ||
                bounds.minX > area.x + area.width ||
                bounds.maxY < area.y ||
                bounds.minY > area.y + area.height);
            if (intersects) {
                selectedIds.push(element.id);
            }
        });
        if (selectedIds.length > 0) {
            // Expand to include grouped elements - this will be handled by selectElements
            this.selectElements(selectedIds);
        }
    }
    // SELECTION BOX (drag selection rectangle)
    /**
     * Set selection box state
     */
    setSelectionBox(box) {
        this.selectionBoxSignal.set(box);
    }
    /**
     * Get current selection box
     */
    getSelectionBox() {
        return this.selectionBoxSignal();
    }
    /**
     * Get selection box signal
     */
    getSelectionBoxSignal() {
        return this.selectionBoxSignal.asReadonly();
    }
    /**
     * Clear selection box
     */
    clearSelectionBox() {
        this.selectionBoxSignal.set({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            visible: false,
        });
    }
    // BOUNDING BOX (transform handles around selection)
    /**
     * Update bounding box based on current selection
     */
    updateBoundingBox() {
        const selectedElements = this.getSelectedElements();
        this.updateBoundingBoxFromElements(selectedElements);
    }
    /**
     * Get current bounding box
     */
    getBoundingBox() {
        return this.boundingBoxSignal();
    }
    /**
     * Get bounding box signal
     */
    getBoundingBoxSignal() {
        return this.boundingBoxSignal.asReadonly();
    }
    /**
     * Clear bounding box
     */
    clearBoundingBox() {
        this.boundingBoxSignal.set(null);
    }
    /**
     * Set bounding box directly (useful for dynamic updates during rotation)
     */
    setBoundingBox(bbox) {
        this.boundingBoxSignal.set(bbox);
    }
    // INTERNAL HELPERS
    /**
     * Get all elements that belong to the same groups as the provided elements
     */
    expandSelectionToIncludeGroups(elementIds) {
        if (!this.getElementsFn)
            return elementIds;
        const allElements = this.getElementsFn();
        const elementsToExpand = allElements.filter((el) => elementIds.includes(el.id));
        const groupIds = new Set(elementsToExpand
            .map((el) => el.groupId)
            .filter((groupId) => groupId !== undefined && groupId !== null));
        if (groupIds.size === 0) {
            return elementIds; // No groups, return original selection
        }
        // Find all elements that belong to any of these groups
        const expandedElements = allElements.filter((el) => {
            return (elementIds.includes(el.id) || // Original selection
                (el.groupId && groupIds.has(el.groupId)) // Elements in the same groups
            );
        });
        return expandedElements.map((el) => el.id);
    }
    calculateBoundingBox(elements) {
        let bounds;
        let rotation = 0;
        if (elements.length === 1) {
            // For single element, the bounding box should match the element's non-rotated bounds
            // The bounding box will rotate with the element via SVG transform
            const element = elements[0];
            rotation = element.rotation || 0;
            // Get bounds in local space (relative to element origin)
            // For rectangles, this returns {minX: element.x, minY: element.y, width, height}
            bounds = getElementBounds(element);
        }
        else {
            // For multiple elements, use screen-space bounds that account for rotation
            const combinedBounds = getCombinedScreenBounds(elements);
            if (!combinedBounds) {
                throw new Error('Cannot calculate bounding box for empty element list');
            }
            bounds = combinedBounds;
            rotation = 0; // No rotation for multi-selection
        }
        const { minX, minY, maxX, maxY, width, height } = bounds;
        const centerX = minX + width / 2;
        const handleOffset = 20;
        return {
            x: minX,
            y: minY,
            width,
            height,
            handles: {
                topLeft: { x: minX, y: minY },
                topRight: { x: maxX, y: minY },
                bottomLeft: { x: minX, y: maxY },
                bottomRight: { x: maxX, y: maxY },
                rotateHandle: { x: centerX, y: minY - handleOffset },
            },
            rotation,
        };
    }
    updateBoundingBoxFromElements(elements) {
        if (!elements || elements.length === 0) {
            this.clearBoundingBox();
            return;
        }
        this.boundingBoxSignal.set(this.calculateBoundingBox(elements));
    }
    // SELECTION TRANSFORMATION HELPERS
    /**
     * Update all selected elements with partial data
     */
    updateSelectedElements(partial, updateElementsFn) {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0)
            return;
        // Prefer provided updater, otherwise use internal elementsService updater
        const updater = updateElementsFn || this.updateElementsFn;
        if (!updater)
            return; // Nothing to do if no updater available
        // Create update patches for all selected elements
        const updates = selectedElements.map((element) => ({
            ...partial,
            id: element.id,
        }));
        // Apply updates through the provided function
        updater(updates, true);
        // Update bounding box to reflect changes
        this.updateBoundingBox();
        // Emit selection event to update UI
        const updatedElements = this.getSelectedElements();
        this.eventBus.emit(WhiteboardEvent.ElementsSelected, updatedElements);
    }
    /**
     * Transform selected elements using a transformation function
     */
    transformSelectedElements(transformFn, updateElementsFn) {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0)
            return;
        const updater = updateElementsFn || this.updateElementsFn;
        if (!updater)
            return;
        const transformedElements = transformFn(selectedElements);
        // Apply updates through the provided function
        const updates = transformedElements.map((el) => ({ ...el, id: el.id }));
        updater(updates, true);
        // Update bounding box to reflect changes
        this.updateBoundingBox();
        // Emit selection event to update UI
        const updatedElements = this.getSelectedElements();
        this.eventBus.emit(WhiteboardEvent.ElementsSelected, updatedElements);
    }
    // SELECTION UTILITIES
    /**
     * Get selection bounds (combined bounds of all selected elements)
     */
    getSelectionBounds() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0) {
            return null;
        }
        const allBounds = selectedElements.map(getElementBounds);
        return {
            minX: Math.min(...allBounds.map((b) => b.minX)),
            minY: Math.min(...allBounds.map((b) => b.minY)),
            maxX: Math.max(...allBounds.map((b) => b.maxX)),
            maxY: Math.max(...allBounds.map((b) => b.maxY)),
        };
    }
    /**
     * Check if selection contains specific element type
     */
    selectionContainsType(elementType) {
        return this.getSelectedElements().some((el) => el.type === elementType);
    }
    /**
     * Get unique element types in current selection
     */
    getSelectedElementTypes() {
        const types = this.getSelectedElements().map((el) => el.type);
        return [...new Set(types)];
    }
    /**
     * Remove selected elements
     */
    removeSelectedElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0) {
            return;
        }
        if (this.removeElementsFn) {
            this.removeElementsFn(selectedElements, true);
            this.clearSelection();
        }
    }
    // Z-INDEX OPERATIONS
    /**
     * Bring selected elements to front
     */
    bringToFront() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.getElementsFn || !this.updateElementsFn)
            return;
        const allElements = this.getElementsFn();
        const maxZIndex = Math.max(...allElements.map((el) => el.zIndex || 0));
        const updates = selectedElements.map((element, index) => ({
            id: element.id,
            zIndex: maxZIndex + index + 1,
        }));
        this.updateElementsFn(updates);
    }
    /**
     * Bring selected elements forward by one level
     */
    bringForward() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.getElementsFn || !this.updateElementsFn)
            return;
        const allElements = this.getElementsFn();
        // Sort all elements by z-index
        const sortedElements = [...allElements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        const updates = [];
        selectedElements.forEach((selectedElement) => {
            const currentIndex = sortedElements.findIndex((el) => el.id === selectedElement.id);
            // Find the next non-selected element ahead of this one
            let targetIndex = currentIndex + 1;
            while (targetIndex < sortedElements.length &&
                selectedElements.some((sel) => sel.id === sortedElements[targetIndex].id)) {
                targetIndex++;
            }
            // If there's an element to swap with
            if (targetIndex < sortedElements.length) {
                const targetElement = sortedElements[targetIndex];
                updates.push({
                    id: selectedElement.id,
                    zIndex: targetElement.zIndex,
                });
                updates.push({
                    id: targetElement.id,
                    zIndex: selectedElement.zIndex,
                });
            }
        });
        if (updates.length > 0) {
            this.updateElementsFn(updates);
        }
    }
    /**
     * Send selected elements backward by one level
     */
    sendBackward() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.getElementsFn || !this.updateElementsFn)
            return;
        const allElements = this.getElementsFn();
        // Sort all elements by z-index
        const sortedElements = [...allElements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        const updates = [];
        selectedElements.forEach((selectedElement) => {
            const currentIndex = sortedElements.findIndex((el) => el.id === selectedElement.id);
            // Find the previous non-selected element behind this one
            let targetIndex = currentIndex - 1;
            while (targetIndex >= 0 && selectedElements.some((sel) => sel.id === sortedElements[targetIndex].id)) {
                targetIndex--;
            }
            // If there's an element to swap with
            if (targetIndex >= 0) {
                const targetElement = sortedElements[targetIndex];
                updates.push({
                    id: selectedElement.id,
                    zIndex: targetElement.zIndex,
                });
                updates.push({
                    id: targetElement.id,
                    zIndex: selectedElement.zIndex,
                });
            }
        });
        if (updates.length > 0) {
            this.updateElementsFn(updates);
        }
    }
    /**
     * Send selected elements to back
     */
    sendToBack() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.getElementsFn || !this.updateElementsFn)
            return;
        // Start from z-index 1 and assign sequential values
        const updates = selectedElements.map((element, index) => ({
            id: element.id,
            zIndex: index + 1,
        }));
        this.updateElementsFn(updates);
        // Shift all other elements up to make room
        const allElements = this.getElementsFn();
        const otherElements = allElements.filter((el) => !selectedElements.some((selected) => selected.id === el.id));
        const otherUpdates = otherElements.map((element, index) => ({
            id: element.id,
            zIndex: selectedElements.length + index + 1,
        }));
        if (otherUpdates.length > 0) {
            this.updateElementsFn(otherUpdates);
        }
    }
    // GROUPING OPERATIONS
    /**
     * Group selected elements
     */
    groupSelectedElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length < 2 || !this.updateElementsFn)
            return;
        const groupId = `group_${Date.now()}`;
        const updates = selectedElements.map((element) => ({
            id: element.id,
            groupId: groupId,
        }));
        this.updateElementsFn(updates);
    }
    /**
     * Ungroup selected elements
     */
    ungroupSelectedElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.getElementsFn || !this.updateElementsFn)
            return;
        // Find elements that belong to the same group as selected elements
        const selectedElementsWithGroups = selectedElements.filter((el) => el.groupId !== undefined && el.groupId !== null);
        if (selectedElementsWithGroups.length === 0)
            return;
        // Get all group IDs from selected elements
        const groupIds = [...new Set(selectedElementsWithGroups.map((el) => el.groupId).filter(Boolean))];
        // Find all elements that belong to these groups
        const allElements = this.getElementsFn();
        const elementsToUngroup = allElements.filter((el) => {
            return el.groupId !== undefined && el.groupId !== null && groupIds.includes(el.groupId);
        });
        // Remove group ID from all elements in the groups
        const updates = elementsToUngroup.map((element) => ({
            id: element.id,
            groupId: undefined,
        }));
        this.updateElementsFn(updates);
    }
    // LOCKING OPERATIONS
    /**
     * Lock selected elements
     */
    lockElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.updateElementsFn)
            return;
        const updates = selectedElements.map((element) => ({
            id: element.id,
            locked: true,
        }));
        this.updateElementsFn(updates);
    }
    /**
     * Unlock selected elements
     */
    unlockElements() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.updateElementsFn)
            return;
        const updates = selectedElements.map((element) => ({
            id: element.id,
            locked: false,
        }));
        this.updateElementsFn(updates);
    }
    // ALIGNMENT OPERATIONS
    /**
     * Align selected elements
     */
    alignElements(alignment) {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0)
            return;
        if (!this.updateElementsFn) {
            console.warn('Update elements function not available');
            return;
        }
        const updates = this.calculateAlignmentUpdates(selectedElements, alignment);
        if (updates.length > 0) {
            this.updateElementsFn(updates, true);
            this.updateBoundingBox();
        }
    }
    /**
     * Distribute selected elements horizontally with equal spacing
     */
    distributeHorizontally() {
        this.alignElements(AlignmentType.DistributeHorizontally);
    }
    /**
     * Distribute selected elements vertically with equal spacing
     */
    distributeVertically() {
        this.alignElements(AlignmentType.DistributeVertically);
    }
    /**
     * Calculate alignment updates for selected elements
     */
    calculateAlignmentUpdates(elements, alignment) {
        if (elements.length === 0)
            return [];
        const updates = [];
        const bounds = elements.map((element) => ({
            element,
            bounds: getElementBounds(element),
        }));
        // For single element, align to visible viewport
        if (elements.length === 1) {
            const visibleBounds = this.canvasService.getVisibleBounds();
            const elementBounds = bounds[0].bounds;
            const element = bounds[0].element;
            switch (alignment) {
                case AlignmentType.Left: {
                    const offsetX = visibleBounds.left - elementBounds.minX;
                    if (offsetX !== 0) {
                        updates.push({
                            id: element.id,
                            x: element.x + offsetX,
                        });
                    }
                    break;
                }
                case AlignmentType.Center: {
                    const viewportCenterX = (visibleBounds.left + visibleBounds.right) / 2;
                    const elementCenterX = elementBounds.minX + elementBounds.width / 2;
                    const offsetX = viewportCenterX - elementCenterX;
                    if (offsetX !== 0) {
                        updates.push({
                            id: element.id,
                            x: element.x + offsetX,
                        });
                    }
                    break;
                }
                case AlignmentType.Right: {
                    const offsetX = visibleBounds.right - elementBounds.maxX;
                    if (offsetX !== 0) {
                        updates.push({
                            id: element.id,
                            x: element.x + offsetX,
                        });
                    }
                    break;
                }
                case AlignmentType.Top: {
                    const offsetY = visibleBounds.top - elementBounds.minY;
                    if (offsetY !== 0) {
                        updates.push({
                            id: element.id,
                            y: element.y + offsetY,
                        });
                    }
                    break;
                }
                case AlignmentType.Middle: {
                    const viewportCenterY = (visibleBounds.top + visibleBounds.bottom) / 2;
                    const elementCenterY = elementBounds.minY + elementBounds.height / 2;
                    const offsetY = viewportCenterY - elementCenterY;
                    if (offsetY !== 0) {
                        updates.push({
                            id: element.id,
                            y: element.y + offsetY,
                        });
                    }
                    break;
                }
                case AlignmentType.Bottom: {
                    const offsetY = visibleBounds.bottom - elementBounds.maxY;
                    if (offsetY !== 0) {
                        updates.push({
                            id: element.id,
                            y: element.y + offsetY,
                        });
                    }
                    break;
                }
                default:
                    console.warn('Unsupported alignment type for single element:', alignment);
                    return [];
            }
            return updates;
        }
        // For multiple elements, align to each other
        switch (alignment) {
            case AlignmentType.Left: {
                const leftMost = Math.min(...bounds.map((b) => b.bounds.minX));
                bounds.forEach(({ element, bounds: elementBounds }) => {
                    const offsetX = leftMost - elementBounds.minX;
                    if (offsetX !== 0) {
                        updates.push({
                            id: element.id,
                            x: element.x + offsetX,
                        });
                    }
                });
                break;
            }
            case AlignmentType.Center: {
                const centerX = bounds.reduce((acc, b) => acc + (b.bounds.minX + b.bounds.width / 2), 0) / bounds.length;
                bounds.forEach(({ element, bounds: elementBounds }) => {
                    const elementCenterX = elementBounds.minX + elementBounds.width / 2;
                    const offsetX = centerX - elementCenterX;
                    if (offsetX !== 0) {
                        updates.push({
                            id: element.id,
                            x: element.x + offsetX,
                        });
                    }
                });
                break;
            }
            case AlignmentType.Right: {
                const rightMost = Math.max(...bounds.map((b) => b.bounds.maxX));
                bounds.forEach(({ element, bounds: elementBounds }) => {
                    const offsetX = rightMost - elementBounds.maxX;
                    if (offsetX !== 0) {
                        updates.push({
                            id: element.id,
                            x: element.x + offsetX,
                        });
                    }
                });
                break;
            }
            case AlignmentType.Top: {
                const topMost = Math.min(...bounds.map((b) => b.bounds.minY));
                bounds.forEach(({ element, bounds: elementBounds }) => {
                    const offsetY = topMost - elementBounds.minY;
                    if (offsetY !== 0) {
                        updates.push({
                            id: element.id,
                            y: element.y + offsetY,
                        });
                    }
                });
                break;
            }
            case AlignmentType.Middle: {
                const centerY = bounds.reduce((acc, b) => acc + (b.bounds.minY + b.bounds.height / 2), 0) / bounds.length;
                bounds.forEach(({ element, bounds: elementBounds }) => {
                    const elementCenterY = elementBounds.minY + elementBounds.height / 2;
                    const offsetY = centerY - elementCenterY;
                    if (offsetY !== 0) {
                        updates.push({
                            id: element.id,
                            y: element.y + offsetY,
                        });
                    }
                });
                break;
            }
            case AlignmentType.Bottom: {
                const bottomMost = Math.max(...bounds.map((b) => b.bounds.maxY));
                bounds.forEach(({ element, bounds: elementBounds }) => {
                    const offsetY = bottomMost - elementBounds.maxY;
                    if (offsetY !== 0) {
                        updates.push({
                            id: element.id,
                            y: element.y + offsetY,
                        });
                    }
                });
                break;
            }
            case AlignmentType.DistributeHorizontally: {
                if (elements.length < 3)
                    return []; // Need at least 3 elements to distribute
                // Sort elements by their left position
                const sortedByX = bounds.sort((a, b) => a.bounds.minX - b.bounds.minX);
                const leftmostX = sortedByX[0].bounds.minX;
                const rightmostX = sortedByX[sortedByX.length - 1].bounds.maxX;
                const totalWidth = rightmostX - leftmostX;
                // Calculate total width of all elements
                const elementsWidth = sortedByX.reduce((acc, b) => acc + b.bounds.width, 0);
                const availableSpaceH = totalWidth - elementsWidth;
                const spacingH = availableSpaceH / (sortedByX.length - 1);
                let currentX = leftmostX;
                sortedByX.forEach(({ element, bounds: elementBounds }, index) => {
                    if (index === 0) {
                        // Keep the leftmost element in place
                        currentX += elementBounds.width;
                    }
                    else if (index === sortedByX.length - 1) {
                        // Keep the rightmost element in place
                        return;
                    }
                    else {
                        // Position middle elements with equal spacing
                        currentX += spacingH;
                        const offsetX = currentX - elementBounds.minX;
                        if (offsetX !== 0) {
                            updates.push({
                                id: element.id,
                                x: element.x + offsetX,
                            });
                        }
                        currentX += elementBounds.width;
                    }
                });
                break;
            }
            case AlignmentType.DistributeVertically: {
                if (elements.length < 3)
                    return []; // Need at least 3 elements to distribute
                // Sort elements by their top position
                const sortedByY = bounds.sort((a, b) => a.bounds.minY - b.bounds.minY);
                const topmostY = sortedByY[0].bounds.minY;
                const bottommostY = sortedByY[sortedByY.length - 1].bounds.maxY;
                const totalHeight = bottommostY - topmostY;
                // Calculate total height of all elements
                const elementsHeight = sortedByY.reduce((acc, b) => acc + b.bounds.height, 0);
                const availableSpaceV = totalHeight - elementsHeight;
                const spacingV = availableSpaceV / (sortedByY.length - 1);
                let currentY = topmostY;
                sortedByY.forEach(({ element, bounds: elementBounds }, index) => {
                    if (index === 0) {
                        // Keep the topmost element in place
                        currentY += elementBounds.height;
                    }
                    else if (index === sortedByY.length - 1) {
                        // Keep the bottommost element in place
                        return;
                    }
                    else {
                        // Position middle elements with equal spacing
                        currentY += spacingV;
                        const offsetY = currentY - elementBounds.minY;
                        if (offsetY !== 0) {
                            updates.push({
                                id: element.id,
                                y: element.y + offsetY,
                            });
                        }
                        currentY += elementBounds.height;
                    }
                });
                break;
            }
            default:
                console.warn('Unsupported alignment type:', alignment);
                return [];
        }
        return updates;
    }
    // TRANSFORM OPERATIONS
    /**
     * Flip selected elements horizontally
     */
    flipHorizontal() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.updateElementsFn)
            return;
        const updates = selectedElements.map((element) => {
            // Toggle horizontal flip by inverting scaleX
            const currentScaleX = element.scaleX ?? 1;
            return {
                id: element.id,
                scaleX: -currentScaleX,
            };
        });
        this.updateElementsFn(updates, true);
        this.updateBoundingBox();
    }
    /**
     * Flip selected elements vertically
     */
    flipVertical() {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.updateElementsFn)
            return;
        const updates = selectedElements.map((element) => {
            // Toggle vertical flip by inverting scaleY
            const currentScaleY = element.scaleY ?? 1;
            return {
                id: element.id,
                scaleY: -currentScaleY,
            };
        });
        this.updateElementsFn(updates, true);
        this.updateBoundingBox();
    }
    /**
     * Move selected elements by a given offset
     */
    moveSelectedElements(dx, dy) {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.updateElementsFn)
            return;
        const updates = selectedElements.map((element) => ({
            id: element.id,
            x: element.x + dx,
            y: element.y + dy,
        }));
        this.updateElementsFn(updates, true);
        this.updateBoundingBox();
    }
    /**
     * Rotate selected elements by a given angle (in degrees)
     */
    rotateSelectedElements(angle) {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.updateElementsFn)
            return;
        const updates = selectedElements.map((element) => ({
            id: element.id,
            rotation: (element.rotation || 0) + angle,
        }));
        this.updateElementsFn(updates, true);
        this.updateBoundingBox();
    }
    /**
     * Scale selected elements by a given factor
     */
    scaleSelectedElements(factor) {
        const selectedElements = this.getSelectedElements();
        if (selectedElements.length === 0 || !this.updateElementsFn)
            return;
        const updates = selectedElements
            .map((element) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const update = { id: element.id };
            // Scale width and height if they exist (use 'in' operator for type checking)
            if ('width' in element && element.width !== undefined) {
                update.width = element.width * factor;
            }
            if ('height' in element && element.height !== undefined) {
                update.height = element.height * factor;
            }
            // Scale stroke width if it exists
            if (element.style?.strokeWidth !== undefined) {
                update.style = {
                    ...element.style,
                    strokeWidth: element.style.strokeWidth * factor,
                };
            }
            // For rectangles and ellipses, also scale radii if they exist
            if ('rx' in element && element.rx !== undefined) {
                update.rx = element.rx * factor;
            }
            if ('ry' in element && element.ry !== undefined) {
                update.ry = element.ry * factor;
            }
            return update;
        })
            .filter((update) => Object.keys(update).length > 1); // Only include updates with more than just id
        if (updates.length > 0) {
            this.updateElementsFn(updates, true);
            this.updateBoundingBox();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SelectionService, deps: [{ token: EventBusService }, { token: ClipboardService }, { token: ElementsService }, { token: ToolsService }, { token: CanvasService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SelectionService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SelectionService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: EventBusService }, { type: ClipboardService }, { type: ElementsService }, { type: ToolsService }, { type: CanvasService }] });

/**
 * Manages zoom operations for the whiteboard canvas including zoom in/out,
 * zoom to fit, zoom to selection, and zoom bounds management.
 */
class ZoomService {
    canvasService = inject(CanvasService);
    elementsService = inject(ElementsService);
    selectionService = inject(SelectionService);
    configService = inject(ConfigService);
    eventBusService = inject(EventBusService);
    DEFAULT_FIT_MARGIN = 0.9;
    zoomSubscription;
    constructor() {
        this.zoomSubscription = this.eventBusService.on(WhiteboardEvent.ZoomChange).subscribe(() => {
            const { center, fullScreen, zoom } = this.getConfig();
            if (center && !fullScreen) {
                this.centerCanvas(zoom);
            }
        });
    }
    ngOnDestroy() {
        this.zoomSubscription?.unsubscribe();
    }
    emitZoomChangeEvent() {
        const { zoom } = this.getConfig();
        this.eventBusService.emit(WhiteboardEvent.ZoomChange, {
            zoom,
        });
    }
    getConfig() {
        return this.configService.getConfig();
    }
    centerCanvas(zoom) {
        const { canvasWidth, canvasHeight } = this.getConfig();
        const containerDimensions = this.canvasService.getContainerDimensions();
        const newCanvasX = (containerDimensions.width - canvasWidth * zoom) / 2;
        const newCanvasY = (containerDimensions.height - canvasHeight * zoom) / 2;
        this.configService.updateConfig({ canvasX: newCanvasX, canvasY: newCanvasY }, false);
        return { x: newCanvasX, y: newCanvasY };
    }
    /**
     * Set zoom level with optional animation.
     */
    zoom(zoom, animated = true, duration = 300) {
        if (zoom <= 0) {
            return;
        }
        const roundedZoom = Math.round(this.clampZoom(zoom) * 100) / 100;
        if (animated) {
            this.animateToTarget(roundedZoom, duration);
        }
        else {
            this.setInstant(roundedZoom);
        }
    }
    /**
     * Zoom in by step amount.
     */
    zoomIn(animated = true, duration = 300) {
        const { zoom } = this.getConfig();
        const newZoom = Math.round((zoom + ZOOM_STEP) * 100) / 100;
        if (newZoom <= MAX_ZOOM) {
            this.zoom(newZoom, animated, duration);
        }
    }
    /**
     * Zoom out by step amount.
     */
    zoomOut(animated = true, duration = 300) {
        const { zoom } = this.getConfig();
        const newZoom = Math.round((zoom - ZOOM_STEP) * 100) / 100;
        if (newZoom >= MIN_ZOOM) {
            this.zoom(newZoom, animated, duration);
        }
    }
    /**
     * Reset zoom to 100%.
     */
    resetZoom(animated = true, duration = 300) {
        if (animated) {
            this.animateToTarget(DEFAULT_ZOOM, duration);
        }
        else {
            this.setInstant(DEFAULT_ZOOM);
        }
    }
    /**
     * Get current zoom level.
     */
    getZoomLevel() {
        return this.getConfig().zoom;
    }
    /**
     * Get current zoom level as percentage.
     */
    getZoomPercentage() {
        return Math.round(this.getConfig().zoom * 100);
    }
    /**
     * Zoom to fit all elements in the viewport.
     */
    zoomToFit(margin = this.DEFAULT_FIT_MARGIN, animated = true, duration = 300) {
        const elements = this.elementsService.getElements();
        if (elements.length === 0) {
            // No elements to fit, reset zoom
            this.resetZoom(animated, duration);
            return;
        }
        this.zoomToElements(elements, margin, animated, duration);
    }
    /**
     * Zoom to fit selected elements.
     */
    zoomToSelection(margin = this.DEFAULT_FIT_MARGIN, animated = true, duration = 300) {
        const selectedElements = this.selectionService.getSelectedElements();
        if (selectedElements.length === 0) {
            return;
        }
        this.zoomToElements(selectedElements, margin, animated, duration);
    }
    /**
     * Zoom to fit specific elements.
     */
    zoomToElements(elements, margin = this.DEFAULT_FIT_MARGIN, animated = true, duration = 300) {
        if (elements.length === 0) {
            return;
        }
        const bounds = this.elementsService.calculateElementsBounds(elements);
        if (!bounds) {
            return;
        }
        const { fullScreen } = this.getConfig();
        const dimensions = fullScreen
            ? this.canvasService.getContainerDimensions()
            : this.canvasService.getCanvasDimensions();
        // Calculate zoom level to fit elements with padding
        const zoomX = (dimensions.width * margin) / bounds.width;
        const zoomY = (dimensions.height * margin) / bounds.height;
        const targetZoom = Math.min(zoomX, zoomY);
        if (animated) {
            this.animateToTarget(targetZoom, duration);
        }
        else {
            this.setInstant(targetZoom);
        }
    }
    /**
     * Zoom to fit a specific rectangular area.
     */
    zoomToArea(x, y, width, height, margin = this.DEFAULT_FIT_MARGIN, animated = true, duration = 300) {
        const canvasDimensions = this.canvasService.getCanvasDimensions();
        const zoomX = (canvasDimensions.width * margin) / width;
        const zoomY = (canvasDimensions.height * margin) / height;
        const targetZoom = Math.min(zoomX, zoomY);
        if (animated) {
            this.animateToTarget(targetZoom, duration);
        }
        else {
            this.setInstant(targetZoom);
        }
    }
    /**
     * Get optimal zoom level for given dimensions.
     */
    getOptimalZoom(contentWidth, contentHeight, margin = this.DEFAULT_FIT_MARGIN) {
        const canvasDimensions = this.canvasService.getCanvasDimensions();
        const zoomX = canvasDimensions.width / contentWidth;
        const zoomY = canvasDimensions.height / contentHeight;
        return this.clampZoom(Math.min(zoomX, zoomY) * margin);
    }
    /**
     * Clamp zoom value to valid range.
     */
    clampZoom(zoom) {
        return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
    }
    /**
     * Check if zoom level is valid.
     */
    isValidZoom(zoom) {
        return zoom >= MIN_ZOOM && zoom <= MAX_ZOOM;
    }
    /**
     * Get zoom limits.
     */
    getZoomLimits() {
        return {
            min: MIN_ZOOM,
            max: MAX_ZOOM,
        };
    }
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    setInstant(targetZoom) {
        const { fullScreen, center } = this.getConfig();
        const validatedZoom = this.clampZoom(targetZoom);
        if (!fullScreen && center) {
            this.centerCanvas(validatedZoom);
        }
        this.configService.updateConfig({ zoom: validatedZoom });
        this.emitZoomChangeEvent();
    }
    animateToTarget(targetZoom, duration = 300) {
        const { zoom: startZoom, fullScreen, center } = this.getConfig();
        const validatedZoom = this.clampZoom(targetZoom);
        if (!fullScreen && center) {
            this.centerCanvas(validatedZoom);
        }
        // Animation
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeInOutCubic(progress);
            const currentZoom = startZoom + (validatedZoom - startZoom) * easedProgress;
            this.configService.updateConfig({ zoom: currentZoom });
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
            else {
                this.emitZoomChangeEvent();
            }
        };
        requestAnimationFrame(animate);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ZoomService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ZoomService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ZoomService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });

class DragDropService {
    apiService;
    configService;
    constructor(apiService, configService) {
        this.apiService = apiService;
        this.configService = configService;
    }
    handleFiles(files) {
        Array.from(files).forEach((file) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const src = e.target?.result;
                    if (src) {
                        const imageElement = createElement(ElementType.Image, {
                            src,
                            x: 100,
                            y: 100,
                            width: 200,
                            height: 200,
                            zIndex: this.apiService.getNextZIndex(),
                        }, this.apiService.getActiveLayerId());
                        this.apiService.addElements([imageElement]);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    handleText(content, event, isHtml = false) {
        const config = this.configService.getConfig();
        const { x, y } = getCanvasCoordinates(config, {
            x: event.clientX,
            y: event.clientY,
        });
        let text = content;
        let style = {
            color: config.strokeColor,
            fontSize: config.fontSize,
            fontFamily: config.fontFamily,
            fontWeight: 'normal',
            fontStyle: 'normal',
        };
        if (isHtml) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            const textContent = doc.body.textContent || '';
            text = textContent.trim();
            const firstElement = doc.body.firstElementChild;
            if (firstElement) {
                const computedStyle = window.getComputedStyle(firstElement);
                style = {
                    color: computedStyle.color || style.color,
                    fontSize: parseInt(computedStyle.fontSize) || style.fontSize,
                    fontFamily: computedStyle.fontFamily || style.fontFamily,
                    fontWeight: computedStyle.fontWeight === 'bold' || parseInt(computedStyle.fontWeight) >= 700 ? 'bold' : 'normal',
                    fontStyle: computedStyle.fontStyle === 'italic' ? 'italic' : 'normal',
                };
            }
        }
        if (text) {
            const textElement = createElement(ElementType.Text, {
                x,
                y: y + style.fontSize * 0.8,
                text,
                style,
                zIndex: this.apiService.getNextZIndex(),
            }, this.apiService.getActiveLayerId());
            this.apiService.addElements([textElement]);
        }
    }
    handleElements(elements, event) {
        const config = this.configService.getConfig();
        const dropPosition = getCanvasCoordinates(config, {
            x: event.clientX,
            y: event.clientY,
        });
        const copiedElements = elements.map((el) => ({
            ...el,
            x: dropPosition.x + (el.x || 0),
            y: dropPosition.y + (el.y || 0),
            zIndex: this.apiService.getNextZIndex(),
        }));
        this.apiService.addElements(copiedElements);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DragDropService, deps: [{ token: ApiService }, { token: ConfigService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DragDropService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DragDropService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: ApiService }, { type: ConfigService }] });

/**
 * Converts an SVG node to a string representation.
 */
function toSvgString(svgNode) {
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgNode);
    if (!svgString.includes('xmlns:xlink=')) {
        svgString = svgString.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    svgString = svgString.replace(/(?:NS\d+|ns\d+|xmlns):href/g, 'xlink:href');
    return svgString;
}
/**
 * Converts an SVG string to a Base64 encoded image.
 */
function svgToBase64(svgString, width, height, format = FormatType.Png) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const encodedSvg = encodeURIComponent(svgString);
        img.src = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, width, height);
            const base64 = canvas.toDataURL(`image/${format}`);
            resolve(base64);
        };
        img.onerror = (err) => {
            reject(err);
        };
    });
}

/**
 * Handles import/export operations for the whiteboard including images, state serialization, and various export formats.
 */
class IOService {
    elementsService;
    canvasService;
    zoomService;
    panService;
    eventBusService;
    selectionService;
    layerManagementService;
    configService;
    constructor(elementsService, canvasService, zoomService, panService, eventBusService, selectionService, layerManagementService, configService) {
        this.elementsService = elementsService;
        this.canvasService = canvasService;
        this.zoomService = zoomService;
        this.panService = panService;
        this.eventBusService = eventBusService;
        this.selectionService = selectionService;
        this.layerManagementService = layerManagementService;
        this.configService = configService;
    }
    addImage(imageInfo) {
        const tempImg = new Image();
        tempImg.onload = () => {
            const { canvasHeight } = this.canvasService.getConfig();
            const imageWidth = tempImg.width;
            const imageHeight = tempImg.height;
            const aspectRatio = tempImg.width / tempImg.height;
            const height = imageHeight > canvasHeight ? canvasHeight - 40 : imageHeight;
            const width = height === canvasHeight - 40 ? (canvasHeight - 40) * aspectRatio : imageWidth;
            let x = imageInfo.x || 0;
            let y = imageInfo.y || 0;
            if (x < 0)
                x = 0;
            if (y < 0)
                y = 0;
            const element = createElement(ElementType.Image, {
                src: imageInfo.image,
                width,
                height,
                x,
                y,
                zIndex: this.elementsService.getNextZIndex(),
            });
            this.elementsService.addElements([element]);
            if (element.selectAfterDraw) {
                this.selectionService.selectElements([element.id]);
            }
            this.eventBusService.emit(WhiteboardEvent.ImageAdded, element.src);
        };
        tempImg.onerror = () => {
            console.error('Failed to load image');
        };
        tempImg.src = imageInfo.image;
    }
    importImageFile(file, x, y) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('Invalid file type. Only images are supported.'));
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result;
                if (result) {
                    this.addImage({
                        image: result,
                        x,
                        y,
                    });
                    resolve();
                }
                else {
                    reject(new Error('Failed to read file'));
                }
            };
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            reader.readAsDataURL(file);
        });
    }
    async importImageFromUrl(url, x, y) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = event.target?.result;
                    if (result) {
                        this.addImage({
                            image: result,
                            x,
                            y,
                        });
                        resolve();
                    }
                    else {
                        reject(new Error('Failed to process URL'));
                    }
                };
                reader.onerror = () => {
                    reject(new Error('Failed to process URL'));
                };
                reader.readAsDataURL(blob);
            });
        }
        catch (error) {
            throw new Error(`Failed to load image from URL: ${error}`);
        }
    }
    async save(format = FormatType.Base64, name = 'New board') {
        const canvas = this.canvasService.getCanvas();
        const svgElement = canvas.getElementById('svgcontent');
        if (!svgElement) {
            throw new Error('SVG content not found');
        }
        const svgClone = this.prepareSvgForExport(svgElement);
        const svgString = new XMLSerializer().serializeToString(svgClone);
        const { canvasWidth, canvasHeight } = this.canvasService.getConfig();
        try {
            const imageString = await svgToBase64(svgString, canvasWidth, canvasHeight, format);
            switch (format) {
                case FormatType.Base64:
                    this.eventBusService.emit(WhiteboardEvent.Save, imageString);
                    break;
                case FormatType.Svg: {
                    const imgSrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
                    this.downloadFile(imgSrc, name, 'svg');
                    this.eventBusService.emit(WhiteboardEvent.Save, imgSrc);
                    break;
                }
                default:
                    this.downloadFile(imageString, name, this.getFileExtension(format));
                    this.eventBusService.emit(WhiteboardEvent.Save, imageString);
                    break;
            }
            return imageString;
        }
        catch (error) {
            console.error('Failed to save whiteboard:', error);
            throw error;
        }
    }
    async exportAsPng(name = 'whiteboard') {
        return this.save(FormatType.Png, name);
    }
    async exportAsJpeg(name = 'whiteboard') {
        return this.save(FormatType.Jpeg, name);
    }
    async exportAsSvg(name = 'whiteboard') {
        return this.save(FormatType.Svg, name);
    }
    async exportAsBase64() {
        return this.save(FormatType.Base64);
    }
    exportData() {
        const elements = this.elementsService.getElements();
        const canvasConfig = this.canvasService.getConfig();
        const layerState = this.layerManagementService.exportLayerState();
        const editorConfig = this.configService.getEditorConfig();
        const exportData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            elements: elements,
            layers: layerState,
            canvas: {
                width: canvasConfig.canvasWidth,
                height: canvasConfig.canvasHeight,
                backgroundColor: canvasConfig.backgroundColor,
                fullScreen: canvasConfig.fullScreen,
                center: canvasConfig.center,
            },
            viewport: {
                zoom: canvasConfig.zoom,
                x: canvasConfig.x,
                y: canvasConfig.y,
                canvasX: canvasConfig.canvasX,
                canvasY: canvasConfig.canvasY,
            },
            drawing: {
                strokeColor: canvasConfig.strokeColor,
                strokeWidth: canvasConfig.strokeWidth,
                fill: canvasConfig.fill,
                lineJoin: canvasConfig.lineJoin,
                lineCap: canvasConfig.lineCap,
                dasharray: canvasConfig.dasharray,
                dashoffset: canvasConfig.dashoffset,
                penType: canvasConfig.penType,
            },
            grid: {
                enabled: canvasConfig.enableGrid,
                size: canvasConfig.gridSize,
                snapToGrid: canvasConfig.snapToGrid,
            },
            text: {
                fontFamily: canvasConfig.fontFamily,
                fontSize: canvasConfig.fontSize,
            },
            editor: editorConfig,
            settings: {
                drawingEnabled: canvasConfig.drawingEnabled,
                keyboardShortcutsEnabled: canvasConfig.keyboardShortcutsEnabled,
            },
        };
        return JSON.stringify(exportData, null, 2);
    }
    exportDataAsFile(filename = 'whiteboard-export') {
        const jsonData = this.exportData();
        const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonData);
        this.downloadFile(dataUrl, filename, 'json');
        this.eventBusService.emit(WhiteboardEvent.Save, jsonData);
    }
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (!data.elements || !Array.isArray(data.elements)) {
                throw new Error('Invalid data format: elements array not found');
            }
            this.elementsService.clear();
            if (data.layers) {
                this.layerManagementService.importLayerState(data.layers);
            }
            this.elementsService.setElements(data.elements);
            if (data.canvas) {
                const { canvas } = data;
                if (canvas.width && canvas.height) {
                    this.canvasService.setCanvasDimensions(canvas.width, canvas.height);
                }
                if (canvas.backgroundColor !== undefined) {
                    this.configService.updateConfig({ backgroundColor: canvas.backgroundColor }, false);
                }
                if (canvas.fullScreen !== undefined) {
                    this.configService.updateConfig({ fullScreen: canvas.fullScreen }, false);
                }
                if (canvas.center !== undefined) {
                    this.configService.updateConfig({ center: canvas.center }, false);
                }
            }
            if (data.viewport) {
                const { viewport } = data;
                if (viewport.zoom !== undefined) {
                    this.zoomService.zoom(viewport.zoom);
                }
                if (viewport.x !== undefined && viewport.y !== undefined) {
                    this.panService.panTo(viewport.x, viewport.y);
                }
                if (viewport.canvasX !== undefined && viewport.canvasY !== undefined) {
                    this.configService.updateConfig({
                        canvasX: viewport.canvasX,
                        canvasY: viewport.canvasY,
                    }, false);
                }
            }
            if (data.drawing) {
                const { drawing } = data;
                const drawingConfig = {};
                if (drawing.strokeColor !== undefined)
                    drawingConfig.strokeColor = drawing.strokeColor;
                if (drawing.strokeWidth !== undefined)
                    drawingConfig.strokeWidth = drawing.strokeWidth;
                if (drawing.fill !== undefined)
                    drawingConfig.fill = drawing.fill;
                if (drawing.lineJoin !== undefined)
                    drawingConfig.lineJoin = drawing.lineJoin;
                if (drawing.lineCap !== undefined)
                    drawingConfig.lineCap = drawing.lineCap;
                if (drawing.dasharray !== undefined)
                    drawingConfig.dasharray = drawing.dasharray;
                if (drawing.dashoffset !== undefined)
                    drawingConfig.dashoffset = drawing.dashoffset;
                if (drawing.penType !== undefined)
                    drawingConfig.penType = drawing.penType;
                this.configService.updateConfig(drawingConfig, false);
            }
            if (data.grid) {
                const { grid } = data;
                const gridConfig = {};
                if (grid.enabled !== undefined)
                    gridConfig.enableGrid = grid.enabled;
                if (grid.size !== undefined)
                    gridConfig.gridSize = grid.size;
                if (grid.snapToGrid !== undefined)
                    gridConfig.snapToGrid = grid.snapToGrid;
                this.configService.updateConfig(gridConfig, false);
            }
            if (data.text) {
                const { text } = data;
                const textConfig = {};
                if (text.fontFamily !== undefined)
                    textConfig.fontFamily = text.fontFamily;
                if (text.fontSize !== undefined)
                    textConfig.fontSize = text.fontSize;
                this.configService.updateConfig(textConfig, false);
            }
            if (data.editor) {
                const editorKeys = Object.keys(data.editor);
                editorKeys.forEach((key) => {
                    this.configService.updateEditorConfigValue(key, data.editor[key]);
                });
            }
            if (data.settings) {
                const { settings } = data;
                const settingsConfig = {};
                if (settings.drawingEnabled !== undefined)
                    settingsConfig.drawingEnabled = settings.drawingEnabled;
                if (settings.keyboardShortcutsEnabled !== undefined) {
                    settingsConfig.keyboardShortcutsEnabled = settings.keyboardShortcutsEnabled;
                }
                this.configService.updateConfig(settingsConfig, false);
            }
            this.configService.updateConfig({}, true);
            this.eventBusService.emit(WhiteboardEvent.ElementsAdded, data.elements);
        }
        catch (error) {
            console.error('Failed to import data:', error);
            throw new Error(`Failed to import data: ${error}`);
        }
    }
    importDataFromFile(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.includes('json')) {
                reject(new Error('Invalid file type. Only JSON files are supported.'));
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result;
                if (result && typeof result === 'string') {
                    try {
                        this.importData(result);
                        resolve();
                    }
                    catch (error) {
                        reject(error);
                    }
                }
                else {
                    reject(new Error('Failed to read file'));
                }
            };
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            reader.readAsText(file);
        });
    }
    downloadFile(dataUrl, name, extension) {
        const fileName = `${name}.${extension}`;
        downloadFile(dataUrl, fileName);
    }
    getFileExtension(format) {
        switch (format) {
            case FormatType.Png:
                return 'png';
            case FormatType.Jpeg:
                return 'jpg';
            case FormatType.Svg:
                return 'svg';
            case FormatType.Base64:
                return 'txt';
            default:
                return 'png';
        }
    }
    prepareSvgForExport(svgElement) {
        const svgClone = svgElement.cloneNode(true);
        const selectorParentGroup = svgClone.querySelector('#selectorParentGroup');
        if (selectorParentGroup) {
            selectorParentGroup.remove();
        }
        const contentBackground = svgClone.querySelector('#contentBackground');
        if (contentBackground) {
            contentBackground.removeAttribute('opacity');
        }
        svgClone.setAttribute('x', '0');
        svgClone.setAttribute('y', '0');
        return svgClone;
    }
    async importMultipleImages(files, spacing = 50) {
        const promises = [];
        let currentX = 0;
        let currentY = 0;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            promises.push(this.importImageFile(file, currentX, currentY));
            currentX += 200 + spacing;
            if (currentX > 800) {
                currentX = 0;
                currentY += 200 + spacing;
            }
        }
        await Promise.all(promises);
    }
    processImage(imageData) {
        return imageData;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: IOService, deps: [{ token: ElementsService }, { token: CanvasService }, { token: ZoomService }, { token: PanService }, { token: EventBusService }, { token: SelectionService }, { token: LayerManagementService }, { token: ConfigService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: IOService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: IOService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: ElementsService }, { type: CanvasService }, { type: ZoomService }, { type: PanService }, { type: EventBusService }, { type: SelectionService }, { type: LayerManagementService }, { type: ConfigService }] });

class KeyboardShortcutService {
    configService = inject(ConfigService);
    apiService = inject(ApiService);
    toggleKeyboardShortcuts() {
        const currentConfig = this.configService.getConfig();
        this.configService.updateConfigValue('keyboardShortcutsEnabled', !currentConfig.keyboardShortcutsEnabled);
    }
    handleKeyDown(event) {
        if (this.isInputFocused()) {
            return;
        }
        const key = event.key.toLowerCase();
        const ctrl = event.ctrlKey || event.metaKey;
        const shift = event.shiftKey;
        const alt = event.altKey;
        // Prevent default browser behavior for our shortcuts
        if (this.handleKeyDownShortcuts(key, ctrl, shift, alt)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
    handleKeyUp(event) {
        // No specific keyup shortcuts for now
    }
    isInputFocused() {
        const activeElement = document.activeElement;
        return (activeElement instanceof HTMLInputElement ||
            activeElement instanceof HTMLTextAreaElement ||
            activeElement?.getAttribute('contenteditable') === 'true');
    }
    handleKeyDownShortcuts(key, ctrl, shift, alt) {
        // Tool Shortcuts
        if (!ctrl && !shift && !alt) {
            if (key === 'v') {
                this.apiService.setActiveTool(ToolType.Select);
                return true;
            }
            if (key === 'd') {
                this.apiService.setActiveTool(ToolType.Pen);
                return true;
            }
            if (key === 'e') {
                this.apiService.setActiveTool(ToolType.Eraser);
                return true;
            }
            if (key === 'h') {
                this.apiService.setActiveTool(ToolType.Hand);
                return true;
            }
            if (key === 'r') {
                this.apiService.setActiveTool(ToolType.Rectangle);
                return true;
            }
            if (key === 'o') {
                this.apiService.setActiveTool(ToolType.Ellipse);
                return true;
            }
            if (key === 'a') {
                this.apiService.setActiveTool(ToolType.Arrow);
                return true;
            }
            if (key === 'l') {
                this.apiService.setActiveTool(ToolType.Line);
                return true;
            }
            if (key === 't') {
                this.apiService.setActiveTool(ToolType.Text);
                return true;
            }
        }
        // Undo/Redo
        if (ctrl && key === 'z' && !shift) {
            return this.apiService.undo();
        }
        if (ctrl && (key === 'y' || (key === 'z' && shift))) {
            return this.apiService.redo();
        }
        // Selection
        if (ctrl && key === 'a') {
            this.apiService.selectAll();
            return true;
        }
        if (key === 'escape') {
            this.apiService.clearSelection();
            return true;
        }
        // Clipboard
        if (ctrl && key === 'c') {
            this.apiService.copyElements();
            return true;
        }
        if (ctrl && key === 'x') {
            this.apiService.cutElements();
            return true;
        }
        if (ctrl && key === 'v') {
            this.apiService.pasteElements();
            return true;
        }
        if (ctrl && key === 'd') {
            this.apiService.duplicateElements();
            return true;
        }
        // Delete
        if (key === 'delete' || key === 'backspace') {
            this.apiService.deleteSelectedElements();
            return true;
        }
        // Grouping
        if (ctrl && key === 'g' && !shift) {
            this.apiService.groupSelectedElements();
            return true;
        }
        if (ctrl && key === 'g' && shift) {
            this.apiService.ungroupSelectedElements();
            return true;
        }
        // Layer Order (Z-index)
        if (!ctrl && !shift && !alt && key === ']') {
            this.apiService.bringToFront();
            return true;
        }
        if (alt && !ctrl && !shift && key === ']') {
            this.apiService.bringForward();
            return true;
        }
        if (alt && !ctrl && !shift && key === '[') {
            this.apiService.sendBackward();
            return true;
        }
        if (!ctrl && !shift && !alt && key === '[') {
            this.apiService.sendToBack();
            return true;
        }
        // Flip
        if (shift && !ctrl && !alt && key === 'h') {
            this.apiService.flipHorizontal();
            return true;
        }
        if (shift && !ctrl && !alt && key === 'v') {
            this.apiService.flipVertical();
            return true;
        }
        // Alignment
        if (alt && !ctrl && !shift && key === 'w') {
            this.apiService.alignElements(AlignmentType.Top);
            return true;
        }
        if (alt && !ctrl && !shift && key === 'v') {
            this.apiService.alignElements(AlignmentType.Middle);
            return true;
        }
        if (alt && !ctrl && !shift && key === 's') {
            this.apiService.alignElements(AlignmentType.Bottom);
            return true;
        }
        if (alt && !ctrl && !shift && key === 'a') {
            this.apiService.alignElements(AlignmentType.Left);
            return true;
        }
        if (alt && !ctrl && !shift && key === 'h') {
            this.apiService.alignElements(AlignmentType.Center);
            return true;
        }
        if (alt && !ctrl && !shift && key === 'd') {
            this.apiService.alignElements(AlignmentType.Right);
            return true;
        }
        // Zoom
        if ((ctrl && key === '=') || (ctrl && key === '+')) {
            this.apiService.zoomIn();
            return true;
        }
        if (ctrl && key === '-') {
            this.apiService.zoomOut();
            return true;
        }
        if (shift && !ctrl && !alt && key === '0') {
            this.apiService.resetZoom(); // Zoom to 100%
            return true;
        }
        if (shift && !ctrl && !alt && key === '1') {
            this.apiService.zoomToFit(); // Zoom to fit
            return true;
        }
        if (shift && !ctrl && !alt && key === '2') {
            this.apiService.zoomToSelection(); // Zoom to selection
            return true;
        }
        // Grid
        if (ctrl && key === "'" && !shift) {
            this.apiService.toggleGrid();
            return true;
        }
        if (ctrl && key === ';' && shift) {
            this.apiService.toggleSnapToGrid();
            return true;
        }
        // Arrow key navigation for moving selected elements
        if (!ctrl &&
            !shift &&
            !alt &&
            (key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright')) {
            // Move selected elements by 1 pixel
            const dx = key === 'arrowright' ? 1 : key === 'arrowleft' ? -1 : 0;
            const dy = key === 'arrowdown' ? 1 : key === 'arrowup' ? -1 : 0;
            this.apiService.moveSelectedElements(dx, dy);
            return true;
        }
        // Arrow key navigation for moving selected elements faster
        if (!ctrl &&
            shift &&
            !alt &&
            (key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright')) {
            // Move selected elements by 10 pixels
            const dx = key === 'arrowright' ? 10 : key === 'arrowleft' ? -10 : 0;
            const dy = key === 'arrowdown' ? 10 : key === 'arrowup' ? -10 : 0;
            this.apiService.moveSelectedElements(dx, dy);
            return true;
        }
        return false;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: KeyboardShortcutService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: KeyboardShortcutService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: KeyboardShortcutService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

class ApiService {
    elementsService = inject(ElementsService);
    canvasService = inject(CanvasService);
    selectionService = inject(SelectionService);
    toolsService = inject(ToolsService);
    ioService = inject(IOService);
    historyService = inject(HistoryService);
    zoomService = inject(ZoomService);
    panService = inject(PanService);
    layerService = inject(LayerManagementService);
    configService = inject(ConfigService);
    clipboardService = inject(ClipboardService);
    eventBusService = inject(EventBusService);
    elements = this.elementsService.elements;
    draftElements = this.elementsService.draftElements;
    allElements = this.elementsService.allElements;
    selectedElements = this.selectionService.getSelectedElementsSignal();
    config = computed(() => this.configService.getConfig());
    elementsCount = this.elementsService.elementsCount;
    hasElements = this.elementsService.hasElements;
    selectedTool = this.toolsService.selectedTool;
    availableTools = this.toolsService.availableTools;
    layers = this.layerService.layers;
    activeLayerId = this.layerService.activeLayerId;
    activeLayer = this.layerService.activeLayer;
    setElements(elements) {
        this.elementsService.setElements(elements);
    }
    getElements() {
        return this.elementsService.getElements();
    }
    addElements(elements) {
        this.elementsService.addElements(elements);
    }
    updateElements(elements) {
        const updates = elements.map((el) => ({ ...el, id: el.id }));
        this.elementsService.updateElements(updates);
    }
    removeElements(elements) {
        this.elementsService.removeElements(elements);
    }
    clear() {
        this.elementsService.clear();
    }
    clearAll() {
        this.elementsService.clear();
        this.selectionService.clearSelection();
    }
    addElement(element) {
        this.addElements([element]);
    }
    updateElement(element) {
        this.updateElements([element]);
    }
    removeElementsByIds(elementIds) {
        this.elementsService.removeElementsByIds(elementIds);
    }
    getElementById(id) {
        return this.elementsService.getElementById(id);
    }
    getElementsByIds(ids) {
        return this.elementsService.getElementsByIds(ids);
    }
    getNextZIndex() {
        return this.elementsService.getNextZIndex();
    }
    getAllElements() {
        return this.elementsService.getElements();
    }
    getDraftElements() {
        return this.elementsService.getDraftElements();
    }
    addDraftElements(elements) {
        this.elementsService.addDraftElements(elements);
    }
    updateDraftElements(elements) {
        this.elementsService.updateDraftElements(elements);
    }
    removeDraftElements(elementIds) {
        this.elementsService.removeDraftElements(elementIds);
    }
    commitDraftElements() {
        this.elementsService.commitDraftElements();
    }
    elementExists(elementId) {
        return this.elementsService.elementExists(elementId);
    }
    selectElements(elementsOrIds, append = false) {
        this.selectionService.selectElements(elementsOrIds, append);
    }
    deselectElement(elementOrId) {
        this.selectionService.deselectElement(elementOrId);
    }
    toggleSelection(elementOrId) {
        this.selectionService.toggleSelection(elementOrId);
    }
    clearSelection() {
        this.selectionService.clearSelection();
    }
    selectAll() {
        this.selectionService.selectAll();
    }
    getSelectedElements() {
        return this.selectionService.getSelectedElements();
    }
    updateSelectedElements(partialElement) {
        this.selectionService.updateSelectedElements(partialElement);
    }
    removeSelectedElements() {
        this.selectionService.removeSelectedElements();
    }
    isSelected(elementOrId) {
        return this.selectionService.isSelected(elementOrId);
    }
    clearSelectionBox() {
        this.selectionService.clearSelectionBox();
    }
    transformSelectedElements(transformFn) {
        this.selectionService.transformSelectedElements(transformFn);
    }
    setSelectionBox(selectionBox) {
        this.selectionService.setSelectionBox(selectionBox);
    }
    updateBoundingBox() {
        this.selectionService.updateBoundingBox();
    }
    getBoundingBox() {
        return this.selectionService.getBoundingBox();
    }
    setBoundingBox(bbox) {
        this.selectionService.setBoundingBox(bbox);
    }
    getClipboardInfo() {
        return this.clipboardService.getClipboardInfo();
    }
    copyElements() {
        this.selectionService.copyElements();
    }
    cutElements() {
        this.selectionService.cutElements();
    }
    pasteElements() {
        this.selectionService.pasteElements();
    }
    duplicateElements() {
        this.selectionService.duplicateElements();
    }
    deleteSelectedElements() {
        this.selectionService.deleteSelectedElements();
    }
    bringToFront() {
        this.selectionService.bringToFront();
    }
    bringForward() {
        this.selectionService.bringForward();
    }
    sendBackward() {
        this.selectionService.sendBackward();
    }
    sendToBack() {
        this.selectionService.sendToBack();
    }
    groupSelectedElements() {
        this.selectionService.groupSelectedElements();
    }
    ungroupSelectedElements() {
        this.selectionService.ungroupSelectedElements();
    }
    lockElements() {
        this.selectionService.lockElements();
    }
    unlockElements() {
        this.selectionService.unlockElements();
    }
    alignElements(alignment) {
        this.selectionService.alignElements(alignment);
    }
    distributeHorizontally() {
        this.selectionService.distributeHorizontally();
    }
    distributeVertically() {
        this.selectionService.distributeVertically();
    }
    flipHorizontal() {
        this.selectionService.flipHorizontal();
    }
    flipVertical() {
        this.selectionService.flipVertical();
    }
    moveSelectedElements(dx, dy) {
        this.selectionService.moveSelectedElements(dx, dy);
    }
    rotateSelectedElements(angle) {
        this.selectionService.rotateSelectedElements(angle);
    }
    scaleSelectedElements(factor) {
        this.selectionService.scaleSelectedElements(factor);
    }
    initializeWhiteboard(svgContainer) {
        this.canvasService.initializeCanvas(svgContainer);
        this.toolsService.setApiService(this);
    }
    getCanvas() {
        return this.canvasService.getCanvas();
    }
    setCanvasDimensions(width, height) {
        this.canvasService.setCanvasDimensions(width, height);
    }
    centerCanvas() {
        this.canvasService.centerCanvas();
    }
    fullScreen() {
        this.canvasService.fullScreen();
    }
    exitFullScreen(defaultWidth, defaultHeight) {
        this.canvasService.exitFullScreen(defaultWidth, defaultHeight);
    }
    resetCanvas() {
        this.canvasService.resetCanvas();
    }
    setZoom(zoom) {
        this.zoomService.zoom(zoom);
    }
    zoomIn() {
        this.zoomService.zoomIn();
    }
    zoomOut() {
        this.zoomService.zoomOut();
    }
    resetZoom() {
        this.zoomService.resetZoom();
    }
    zoomToFit() {
        this.zoomService.zoomToFit();
    }
    zoomToSelection() {
        this.zoomService.zoomToSelection();
    }
    pan(dx, dy) {
        this.panService.pan(dx, dy);
    }
    panTo(x, y) {
        this.panService.panTo(x, y);
    }
    resetPan() {
        this.panService.resetPan();
    }
    async save(format = FormatType.Base64, name = 'whiteboard') {
        return this.ioService.save(format, name);
    }
    addImage(imageInfo) {
        this.ioService.addImage(imageInfo);
    }
    async importImageFile(file, x, y) {
        return this.ioService.importImageFile(file, x, y);
    }
    exportData() {
        return this.ioService.exportData();
    }
    importData(jsonData) {
        this.ioService.importData(jsonData);
    }
    async exportAsPNG(name = 'whiteboard') {
        return this.ioService.exportAsPng(name);
    }
    async exportAsSVG(name = 'whiteboard') {
        return this.ioService.exportAsSvg(name);
    }
    exportAsJSON(name = 'whiteboard') {
        const jsonData = this.ioService.exportData();
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
    undo() {
        const elements = this.historyService.undo();
        if (elements) {
            this.elementsService.setElements(elements);
            this.selectionService.clearSelection();
            this.eventBusService.emit(WhiteboardEvent.Undo, undefined);
            return true;
        }
        return false;
    }
    redo() {
        const elements = this.historyService.redo();
        if (elements) {
            this.elementsService.setElements(elements);
            this.selectionService.clearSelection();
            this.eventBusService.emit(WhiteboardEvent.Redo, undefined);
            return true;
        }
        return false;
    }
    getCanUndoSignal() {
        return this.historyService.getCanUndoSignal();
    }
    getCanRedoSignal() {
        return this.historyService.getCanRedoSignal();
    }
    clearHistory() {
        this.historyService.clearHistory();
    }
    recordElementCreation(before, after) {
        this.historyService.recordElementCreation(before, after);
    }
    recordElementUpdate(before, after) {
        this.historyService.recordElementUpdate(before, after);
    }
    recordElementDeletion(before, after) {
        this.historyService.recordElementDeletion(before, after);
    }
    recordClear(before, after) {
        this.historyService.recordClear(before, after);
    }
    recordChange(before, after, description) {
        this.historyService.recordChange(before, after, description);
    }
    getConfig() {
        return this.configService.getConfig();
    }
    updateConfig(config) {
        this.configService.updateConfig(config);
    }
    updateConfigValue(key, value) {
        this.configService.updateConfigValue(key, value);
    }
    addLayer(name) {
        return this.layerService.addLayer(name);
    }
    removeLayer(id) {
        return this.layerService.removeLayer(id);
    }
    setActiveLayer(id) {
        return this.layerService.setActiveLayer(id);
    }
    getActiveLayerId() {
        return this.layerService.getActiveLayerId();
    }
    toggleLayerVisibility(id) {
        return this.layerService.toggleLayerVisibility(id);
    }
    toggleLayerLock(id) {
        return this.layerService.toggleLayerLock(id);
    }
    renameLayer(id, name) {
        return this.layerService.renameLayer(id, name);
    }
    setLayerOpacity(id, opacity) {
        return this.layerService.setLayerOpacity(id, opacity);
    }
    setLayerBlendMode(id, blendMode) {
        return this.layerService.setLayerBlendMode(id, blendMode);
    }
    moveLayerUp(id) {
        return this.layerService.moveLayerUp(id);
    }
    moveLayerDown(id) {
        return this.layerService.moveLayerDown(id);
    }
    reorderLayersByIndex(previousIndex, currentIndex) {
        return this.layerService.reorderLayersByIndex(previousIndex, currentIndex);
    }
    toggleGrid() {
        this.canvasService.toggleGrid();
    }
    toggleSnapToGrid() {
        this.canvasService.toggleSnapToGrid();
    }
    setGridSize(size) {
        this.canvasService.setGridSize(size);
    }
    setActiveTool(tool) {
        this.toolsService.setActiveTool(tool);
    }
    getActiveTool() {
        return this.toolsService.getActiveToolType();
    }
    setToolEnabled(toolType, enabled) {
        return this.toolsService.setToolEnabledByType(toolType, enabled);
    }
    setEnabledTools(toolTypes) {
        this.toolsService.setEnabledTools(toolTypes);
    }
    setCursor(cursor) {
        this.toolsService.setCursor(cursor);
    }
    resetCursor() {
        this.toolsService.resetCursor();
    }
    screenToCanvas(screenX, screenY) {
        return this.canvasService.screenToCanvas(screenX, screenY);
    }
    canvasToScreen(canvasX, canvasY) {
        return this.canvasService.canvasToScreen(canvasX, canvasY);
    }
    getSelectionBoxSignal() {
        return this.selectionService.getSelectionBoxSignal();
    }
    getBoundingBoxSignal() {
        return this.selectionService.getBoundingBoxSignal();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ApiService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ApiService });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ApiService, decorators: [{
            type: Injectable
        }] });

class InstanceService {
    instances = new Map();
    _activeId = signal(null);
    activeId = this._activeId.asReadonly();
    _registryVersion = signal(0);
    registryVersion = this._registryVersion.asReadonly();
    register(id, instance) {
        if (!id || id.trim().length === 0) {
            throw new Error('Whiteboard instance ID cannot be empty.');
        }
        if (!(instance instanceof ApiService)) {
            throw new Error('Instance must be an ApiService instance.');
        }
        this.instances.set(id, instance);
        this._registryVersion.update((v) => v + 1);
    }
    unregister(id) {
        const result = this.instances.delete(id);
        if (result) {
            if (this._activeId() === id) {
                this._activeId.set(null);
            }
            this._registryVersion.update((v) => v + 1);
        }
        return result;
    }
    getInstance(id) {
        return this.instances.get(id);
    }
    hasInstance(id) {
        return this.instances.has(id);
    }
    getAllInstanceIds() {
        return Array.from(this.instances.keys());
    }
    getInstanceCount() {
        return this.instances.size;
    }
    setActive(id) {
        if (!this.hasInstance(id)) {
            throw new Error(`Whiteboard with ID "${id}" not found in registry. Cannot set as active.`);
        }
        this._activeId.set(id);
    }
    clearActive() {
        this._activeId.set(null);
    }
    getActiveInstance() {
        const id = this._activeId();
        return id ? this.instances.get(id) : undefined;
    }
    clearAll() {
        this.instances.clear();
        this._activeId.set(null);
        this._registryVersion.update((v) => v + 1);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: InstanceService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: InstanceService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: InstanceService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/**
 * Service providing a clean API for interacting with whiteboard instances.
 *
 * Key concepts:
 * - Each whiteboard component has a unique boardId
 * - Methods accept an optional boardId parameter to target a specific board
 * - Use signals(boardId) to get reactive signals for a specific board
 *
 * @example
 * ```typescript
 * class MyComponent {
 *   boardId = 'my-board';
 *   layers = this.whiteboardService.signals(this.boardId).layers;
 *   elements = this.whiteboardService.signals(this.boardId).elements;
 *
 *   clear() {
 *     this.whiteboardService.clear(this.boardId);
 *   }
 * }
 * ```
 */
class NgWhiteboardService {
    instanceService = inject(InstanceService);
    activeBoardId = signal(null);
    /**
     * Set the active board. Methods without boardId parameter will use this board.
     * @param boardId - The ID of the board to make active, or null to clear active board
     */
    setActiveBoard(boardId) {
        this.activeBoardId.set(boardId);
    }
    /**
     * Get the currently active board ID
     */
    getActiveBoard() {
        return this.activeBoardId();
    }
    /**
     * Get the API instance for a specific board, or the active board if no boardId provided.
     * @param boardId - Optional board ID. If not provided, uses the active board.
     * @throws Error if boardId is not provided and no active board is set.
     * @throws Error if the specified board is not found.
     */
    getApi(boardId) {
        const targetBoardId = boardId || this.activeBoardId();
        if (!targetBoardId) {
            throw new Error('NgWhiteboardService: No boardId provided and no active board set. Call setActiveBoard() first or pass boardId parameter.');
        }
        const instance = this.instanceService.getInstance(targetBoardId);
        if (!instance) {
            throw new Error(`NgWhiteboardService: Board "${targetBoardId}" not found. Ensure the whiteboard component is initialized.`);
        }
        return instance;
    }
    /**
     * Get reactive signals for a specific board.
     * These signals are bound to the specified board and will update when that board's data changes.
     * Signals are lazy and won't throw errors until actually accessed.
     *
     * @param boardId - The unique identifier of the whiteboard
     * @returns Object containing all reactive signals for the board
     *
     * @example
     * ```typescript
     * class MyComponent {
     *   boardId = 'my-board';
     *   private signals = this.whiteboardService.signals(this.boardId);
     *   layers = this.signals.layers;
     *   elements = this.signals.elements;
     * }
     * ```
     */
    signals(boardId) {
        return {
            elements: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.elements() : [];
            }),
            selectedElements: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.selectedElements() : [];
            }),
            config: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.config() : {};
            }),
            elementsCount: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.elementsCount() : 0;
            }),
            hasElements: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.hasElements() : false;
            }),
            selectedTool: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.selectedTool() : ToolType.Pen;
            }),
            availableTools: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.availableTools() : [];
            }),
            layers: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.layers() : [];
            }),
            activeLayerId: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.activeLayerId() : null;
            }),
            activeLayer: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.activeLayer() : null;
            }),
            canUndo: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.getCanUndoSignal()() : false;
            }),
            canRedo: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.getCanRedoSignal()() : false;
            }),
            selectionBox: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.getSelectionBoxSignal()() : { x: 0, y: 0, width: 0, height: 0 };
            }),
            boundingBox: computed(() => {
                this.instanceService.registryVersion();
                const api = this.instanceService.getInstance(boardId);
                return api ? api.getBoundingBoxSignal()() : null;
            }),
        };
    }
    /**
     * Get all registered whiteboard instance IDs.
     */
    getAllBoards() {
        return this.instanceService.getAllInstanceIds();
    }
    /**
     * Get the total number of registered whiteboard instances.
     */
    getBoardCount() {
        return this.instanceService.getInstanceCount();
    }
    /**
     * Check if a whiteboard with the given ID exists.
     */
    hasBoard(boardId) {
        return this.instanceService.hasInstance(boardId);
    }
    /**
     * Set elements for the whiteboard.
     */
    setElements(elements) {
        const instance = this.getApi();
        instance.setElements(elements);
    }
    /**
     * Get all elements from the whiteboard.
     */
    getElements() {
        const instance = this.getApi();
        return instance.getElements();
    }
    /**
     * Add new elements to the whiteboard.
     */
    addElements(elements) {
        const instance = this.getApi();
        instance.addElements(elements);
    }
    /**
     * Update multiple elements.
     */
    updateElements(elements) {
        const instance = this.getApi();
        instance.updateElements(elements);
    }
    /**
     * Remove elements from the whiteboard.
     */
    removeElements(elements) {
        const instance = this.getApi();
        instance.removeElements(elements);
    }
    /**
     * Clear all elements from the whiteboard.
     */
    clear() {
        const instance = this.getApi();
        instance.clear();
    }
    /**
     * Clear all elements and selection.
     */
    clearAll() {
        const instance = this.getApi();
        instance.clearAll();
    }
    /**
     * Add a single element to the whiteboard.
     */
    addElement(element) {
        const instance = this.getApi();
        instance.addElement(element);
    }
    /**
     * Update an existing element.
     */
    updateElement(element) {
        const instance = this.getApi();
        instance.updateElement(element);
    }
    /**
     * Remove elements by their IDs.
     */
    removeElementsByIds(elementIds) {
        const instance = this.getApi();
        instance.removeElementsByIds(elementIds);
    }
    /**
     * Get element by ID.
     */
    getElementById(id) {
        const instance = this.getApi();
        return instance.getElementById(id);
    }
    /**
     * Get multiple elements by their IDs.
     */
    getElementsByIds(ids) {
        const instance = this.getApi();
        return instance.getElementsByIds(ids);
    }
    /**
     * Get next available Z-index.
     */
    getNextZIndex() {
        const instance = this.getApi();
        return instance.getNextZIndex();
    }
    /**
     * Check if an element exists.
     */
    elementExists(elementId) {
        const instance = this.getApi();
        return instance.elementExists(elementId);
    }
    /**
     * Select elements on the whiteboard.
     */
    selectElements(elementsOrIds, append = false) {
        const instance = this.getApi();
        instance.selectElements(elementsOrIds, append);
    }
    /**
     * Deselect an element.
     */
    deselectElement(elementOrId) {
        const instance = this.getApi();
        instance.deselectElement(elementOrId);
    }
    /**
     * Toggle element selection.
     */
    toggleSelection(elementOrId) {
        const instance = this.getApi();
        instance.toggleSelection(elementOrId);
    }
    /**
     * Clear the selection.
     */
    clearSelection() {
        const instance = this.getApi();
        instance.clearSelection();
    }
    /**
     * Select all elements.
     */
    selectAll() {
        const instance = this.getApi();
        instance.selectAll();
    }
    /**
     * Get currently selected elements.
     */
    getSelectedElements() {
        const instance = this.getApi();
        return instance.getSelectedElements();
    }
    /**
     * Update selected elements with partial properties.
     */
    updateSelectedElements(partialElement) {
        const instance = this.getApi();
        instance.updateSelectedElements(partialElement);
    }
    /**
     * Remove selected elements.
     */
    removeSelectedElements() {
        const instance = this.getApi();
        instance.removeSelectedElements();
    }
    /**
     * Check if an element is selected.
     */
    isSelected(elementOrId) {
        const instance = this.getApi();
        return instance.isSelected(elementOrId);
    }
    /**
     * Clear the selection box.
     */
    clearSelectionBox() {
        const instance = this.getApi();
        instance.clearSelectionBox();
    }
    /**
     * Transform selected elements using a transformation function.
     */
    transformSelectedElements(transformFn) {
        const instance = this.getApi();
        instance.transformSelectedElements(transformFn);
    }
    /**
     * Set the selection box.
     */
    setSelectionBox(selectionBox) {
        const instance = this.getApi();
        instance.setSelectionBox(selectionBox);
    }
    /**
     * Update bounding box for selected elements.
     */
    updateBoundingBox() {
        const instance = this.getApi();
        instance.updateBoundingBox();
    }
    /**
     * Get clipboard information.
     */
    getClipboardInfo() {
        const instance = this.getApi();
        return instance.getClipboardInfo();
    }
    /**
     * Copy selected elements to clipboard.
     */
    copyElements() {
        const instance = this.getApi();
        instance.copyElements();
    }
    /**
     * Cut selected elements.
     */
    cutElements() {
        const instance = this.getApi();
        instance.cutElements();
    }
    /**
     * Paste elements from clipboard.
     */
    pasteElements() {
        const instance = this.getApi();
        instance.pasteElements();
    }
    /**
     * Duplicate selected elements.
     */
    duplicateElements() {
        const instance = this.getApi();
        instance.duplicateElements();
    }
    /**
     * Delete selected elements.
     */
    deleteSelectedElements() {
        const instance = this.getApi();
        instance.deleteSelectedElements();
    }
    /**
     * Bring selected elements to front.
     */
    bringToFront() {
        const instance = this.getApi();
        instance.bringToFront();
    }
    /**
     * Bring selected elements forward by one level.
     */
    bringForward() {
        const instance = this.getApi();
        instance.bringForward();
    }
    /**
     * Send selected elements backward by one level.
     */
    sendBackward() {
        const instance = this.getApi();
        instance.sendBackward();
    }
    /**
     * Send selected elements to back.
     */
    sendToBack() {
        const instance = this.getApi();
        instance.sendToBack();
    }
    /**
     * Group selected elements.
     */
    groupSelectedElements() {
        const instance = this.getApi();
        instance.groupSelectedElements();
    }
    /**
     * Ungroup selected elements.
     */
    ungroupSelectedElements() {
        const instance = this.getApi();
        instance.ungroupSelectedElements();
    }
    /**
     * Lock selected elements.
     */
    lockElements() {
        const instance = this.getApi();
        instance.lockElements();
    }
    /**
     * Unlock selected elements.
     */
    unlockElements() {
        const instance = this.getApi();
        instance.unlockElements();
    }
    /**
     * Align selected elements.
     */
    alignElements(alignment) {
        const instance = this.getApi();
        instance.alignElements(alignment);
    }
    /**
     * Get the canvas SVG element.
     */
    getCanvas() {
        const instance = this.getApi();
        return instance.getCanvas();
    }
    /**
     * Set canvas dimensions.
     */
    setCanvasDimensions(width, height) {
        const instance = this.getApi();
        instance.setCanvasDimensions(width, height);
    }
    /**
     * Center the canvas.
     */
    centerCanvas() {
        const instance = this.getApi();
        instance.centerCanvas();
    }
    /**
     * Toggle fullscreen mode.
     */
    fullScreen() {
        const instance = this.getApi();
        instance.fullScreen();
    }
    /**
     * Exit fullscreen mode.
     */
    exitFullScreen(defaultWidth, defaultHeight) {
        const instance = this.getApi();
        instance.exitFullScreen(defaultWidth, defaultHeight);
    }
    /**
     * Reset canvas to default state.
     */
    resetCanvas() {
        const instance = this.getApi();
        instance.resetCanvas();
    }
    /**
     * Set zoom level.
     */
    setZoom(zoom) {
        const instance = this.getApi();
        instance.setZoom(zoom);
    }
    /**
     * Zoom in.
     */
    zoomIn() {
        const instance = this.getApi();
        instance.zoomIn();
    }
    /**
     * Zoom out.
     */
    zoomOut() {
        const instance = this.getApi();
        instance.zoomOut();
    }
    /**
     * Reset zoom to default.
     */
    resetZoom() {
        const instance = this.getApi();
        instance.resetZoom();
    }
    /**
     * Zoom to fit all elements.
     */
    zoomToFit() {
        const instance = this.getApi();
        instance.zoomToFit();
    }
    /**
     * Zoom to fit selected elements.
     */
    zoomToSelection() {
        const instance = this.getApi();
        instance.zoomToSelection();
    }
    /**
     * Pan the canvas by delta values.
     */
    pan(dx, dy) {
        const instance = this.getApi();
        instance.pan(dx, dy);
    }
    /**
     * Pan to a specific position.
     */
    panTo(x, y) {
        const instance = this.getApi();
        instance.panTo(x, y);
    }
    /**
     * Reset pan to default.
     */
    resetPan() {
        const instance = this.getApi();
        instance.resetPan();
    }
    /**
     * Save the whiteboard in the specified format.
     */
    async save(format = FormatType.Base64, name = 'whiteboard') {
        const instance = this.getApi();
        return instance.save(format, name);
    }
    /**
     * Add an image to the whiteboard.
     */
    addImage(imageInfo) {
        const instance = this.getApi();
        instance.addImage(imageInfo);
    }
    /**
     * Import an image from a file.
     */
    async importImageFile(file, x, y) {
        const instance = this.getApi();
        return instance.importImageFile(file, x, y);
    }
    /**
     * Export whiteboard data as JSON.
     */
    exportData() {
        const instance = this.getApi();
        return instance.exportData();
    }
    /**
     * Import whiteboard data from JSON.
     */
    importData(jsonData) {
        const instance = this.getApi();
        instance.importData(jsonData);
    }
    /**
     * Undo the last action.
     */
    undo() {
        const instance = this.getApi();
        return instance.undo();
    }
    /**
     * Redo the last undone action.
     */
    redo() {
        const instance = this.getApi();
        return instance.redo();
    }
    /**
     * Get signal for undo availability.
     */
    getCanUndoSignal() {
        const instance = this.getApi();
        return instance.getCanUndoSignal();
    }
    /**
     * Get signal for redo availability.
     */
    getCanRedoSignal() {
        const instance = this.getApi();
        return instance.getCanRedoSignal();
    }
    /**
     * Clear undo/redo history.
     */
    clearHistory() {
        const instance = this.getApi();
        instance.clearHistory();
    }
    /**
     * Get current whiteboard configuration.
     */
    getConfig() {
        const instance = this.getApi();
        return instance.getConfig();
    }
    /**
     * Update whiteboard configuration.
     */
    updateConfig(config) {
        const instance = this.getApi();
        instance.updateConfig(config);
    }
    /**
     * Update a single configuration value.
     */
    updateConfigValue(key, value) {
        const instance = this.getApi();
        instance.updateConfigValue(key, value);
    }
    /**
     * Add a new layer.
     */
    addLayer(name) {
        const instance = this.getApi();
        instance.addLayer(name);
    }
    /**
     * Remove a layer by ID.
     */
    removeLayer(id) {
        const instance = this.getApi();
        return instance.removeLayer(id);
    }
    /**
     * Set the active layer.
     */
    setActiveLayer(id) {
        const instance = this.getApi();
        return instance.setActiveLayer(id);
    }
    /**
     * Get the active layer ID.
     */
    getActiveLayerId() {
        const instance = this.getApi();
        return instance.getActiveLayerId();
    }
    /**
     * Toggle layer visibility.
     */
    toggleLayerVisibility(id) {
        const instance = this.getApi();
        return instance.toggleLayerVisibility(id);
    }
    /**
     * Toggle layer lock state.
     */
    toggleLayerLock(id) {
        const instance = this.getApi();
        return instance.toggleLayerLock(id);
    }
    /**
     * Rename a layer.
     */
    renameLayer(id, name) {
        const instance = this.getApi();
        return instance.renameLayer(id, name);
    }
    /**
     * Set layer opacity (0-1).
     */
    setLayerOpacity(id, opacity) {
        const instance = this.getApi();
        return instance.setLayerOpacity(id, opacity);
    }
    /**
     * Set layer blend mode.
     */
    setLayerBlendMode(id, blendMode) {
        const instance = this.getApi();
        return instance.setLayerBlendMode(id, blendMode);
    }
    /**
     * Move layer up in z-order.
     */
    moveLayerUp(id) {
        const instance = this.getApi();
        return instance.moveLayerUp(id);
    }
    /**
     * Move layer down in z-order.
     */
    moveLayerDown(id) {
        const instance = this.getApi();
        return instance.moveLayerDown(id);
    }
    /**
     * Reorder layers by index position.
     *
     * @example
     * ```typescript
     * this.whiteboardService.reorderLayersByIndex(2, 0);
     * ```
     */
    reorderLayersByIndex(previousIndex, currentIndex) {
        const instance = this.getApi();
        return instance.reorderLayersByIndex(previousIndex, currentIndex);
    }
    /**
     * Toggle grid visibility.
     */
    toggleGrid() {
        const instance = this.getApi();
        instance.toggleGrid();
    }
    /**
     * Toggle snap to grid.
     */
    toggleSnapToGrid() {
        const instance = this.getApi();
        instance.toggleSnapToGrid();
    }
    /**
     * Set grid size.
     */
    setGridSize(size) {
        const instance = this.getApi();
        instance.setGridSize(size);
    }
    /**
     * Set the active drawing tool.
     */
    setActiveTool(tool) {
        const instance = this.getApi();
        instance.setActiveTool(tool);
    }
    /**
     * Get the currently active tool.
     */
    getActiveTool() {
        const instance = this.getApi();
        return instance.getActiveTool();
    }
    /**
     * Enable or disable a specific tool.
     */
    setToolEnabled(toolType, enabled) {
        const instance = this.getApi();
        return instance.setToolEnabled(toolType, enabled);
    }
    /**
     * Set which tools should be enabled.
     */
    setEnabledTools(toolTypes) {
        const instance = this.getApi();
        instance.setEnabledTools(toolTypes);
    }
    /**
     * Set cursor explicitly.
     */
    setCursor(cursor) {
        const instance = this.getApi();
        instance.setCursor(cursor);
    }
    /**
     * Reset cursor to default.
     */
    resetCursor() {
        const instance = this.getApi();
        instance.resetCursor();
    }
    /**
     * Convert screen coordinates to canvas coordinates.
     */
    screenToCanvas(screenX, screenY) {
        const instance = this.getApi();
        return instance.screenToCanvas(screenX, screenY);
    }
    /**
     * Convert canvas coordinates to screen coordinates.
     */
    canvasToScreen(canvasX, canvasY) {
        const instance = this.getApi();
        return instance.canvasToScreen(canvasX, canvasY);
    }
    /**
     * Get selection box signal.
     */
    getSelectionBoxSignal() {
        const instance = this.getApi();
        return instance.getSelectionBoxSignal();
    }
    /**
     * Get bounding box signal.
     */
    getBoundingBoxSignal() {
        const instance = this.getApi();
        return instance.getBoundingBoxSignal();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NgWhiteboardService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NgWhiteboardService });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NgWhiteboardService, decorators: [{
            type: Injectable
        }] });

class ContextMenuDirective {
    elementRef = inject(ElementRef);
    contextMenuTriggered = new EventEmitter();
    contextMenuHidden = new EventEmitter();
    contextMenuListener;
    clickListener;
    keydownListener;
    ngOnInit() {
        this.setupEventListeners();
    }
    ngOnDestroy() {
        this.removeEventListeners();
    }
    setupEventListeners() {
        const element = this.elementRef.nativeElement;
        this.contextMenuListener = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.contextMenuTriggered.emit({
                x: event.clientX,
                y: event.clientY,
                originalEvent: event,
            });
        };
        this.clickListener = (event) => {
            if (event.button === 0) {
                this.contextMenuHidden.emit();
            }
        };
        this.keydownListener = (event) => {
            if (event.key === 'Escape') {
                this.contextMenuHidden.emit();
            }
        };
        element.addEventListener('contextmenu', this.contextMenuListener);
        element.addEventListener('click', this.clickListener);
        document.addEventListener('keydown', this.keydownListener);
    }
    removeEventListeners() {
        const element = this.elementRef.nativeElement;
        if (this.contextMenuListener) {
            element.removeEventListener('contextmenu', this.contextMenuListener);
        }
        if (this.clickListener) {
            element.removeEventListener('click', this.clickListener);
        }
        if (this.keydownListener) {
            document.removeEventListener('keydown', this.keydownListener);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ContextMenuDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: ContextMenuDirective, isStandalone: true, selector: "[contextMenuCapture]", outputs: { contextMenuTriggered: "contextMenuTriggered", contextMenuHidden: "contextMenuHidden" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ContextMenuDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[contextMenuCapture]',
                    standalone: true,
                }]
        }], propDecorators: { contextMenuTriggered: [{
                type: Output
            }], contextMenuHidden: [{
                type: Output
            }] } });

class ResizeHandlerDirective {
    elementRef;
    apiService;
    _cd;
    resizeObserver;
    constructor(elementRef, apiService, _cd) {
        this.elementRef = elementRef;
        this.apiService = apiService;
        this._cd = _cd;
    }
    ngOnInit() {
        this.resizeObserver = new ResizeObserver(([entry]) => {
            if (entry.target === this.elementRef.nativeElement) {
                const { fullScreen, center } = this.apiService.getConfig();
                setTimeout(() => {
                    if (fullScreen) {
                        this.apiService.fullScreen();
                    }
                    if (center && !fullScreen) {
                        this.apiService.centerCanvas();
                    }
                    this._cd.detectChanges();
                }, 0);
            }
        });
        this.resizeObserver.observe(this.elementRef.nativeElement);
    }
    ngOnDestroy() {
        this.resizeObserver?.disconnect();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ResizeHandlerDirective, deps: [{ token: i0.ElementRef }, { token: ApiService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: ResizeHandlerDirective, isStandalone: true, selector: "[resizeHandler]", ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ResizeHandlerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[resizeHandler]',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: ApiService }, { type: i0.ChangeDetectorRef }] });

/**
 * Handles mouse wheel events for zoom and pan operations.
 */
class WheelHandlerService {
    apiService = inject(ApiService);
    handleWheel(event) {
        event.preventDefault();
        if (event.ctrlKey) {
            this.handleZoom(event);
        }
        else if (event.shiftKey) {
            this.handleHorizontalPan(event);
        }
        else {
            this.handleVerticalPan(event);
        }
    }
    handleZoom(event) {
        const zoomDirection = event.deltaY < 0 ? 1 : -1;
        if (zoomDirection > 0) {
            this.apiService.zoomIn();
        }
        else {
            this.apiService.zoomOut();
        }
    }
    handleHorizontalPan(event) {
        const config = this.apiService.getConfig();
        const panDelta = (event.deltaY * PAN_SENSITIVITY) / config.zoom;
        this.apiService.pan(panDelta, 0);
    }
    handleVerticalPan(event) {
        const config = this.apiService.getConfig();
        const panDelta = (event.deltaY * PAN_SENSITIVITY) / config.zoom;
        this.apiService.pan(0, panDelta);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: WheelHandlerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: WheelHandlerService });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: WheelHandlerService, decorators: [{
            type: Injectable
        }] });

const CONTEXT_MENU_ICONS = {
    // Clipboard
    cut: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3.5 2.5a.5.5 0 0 0-1 0v11a.5.5 0 0 0 1 0v-11Zm9 0a.5.5 0 0 0-1 0v11a.5.5 0 0 0 1 0v-11ZM5 1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1h.5A1.5 1.5 0 0 1 13 3.5V12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3.5A1.5 1.5 0 0 1 4.5 2H5V1Zm1 0v1h4V1H6Z"/></svg>',
    copy: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/></svg>',
    paste: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-7Zm-1.5.5A1.5 1.5 0 0 1 4.5 2h7A1.5 1.5 0 0 1 13 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 12.5v-9ZM6 1a1 1 0 0 0-1 1h6a1 1 0 0 0-1-1H6Z"/></svg>',
    duplicate: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M11 2a2 2 0 0 1 2 2v6.5a.5.5 0 0 1-1 0V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h6.5a.5.5 0 0 1 0 1H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7Zm4.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0Z"/></svg>',
    // Selection
    'select-all': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13ZM1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5V13a.5.5 0 0 1-.5.5h-13A.5.5 0 0 1 1 13V3.5Z"/></svg>',
    delete: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/></svg>',
    // Order
    order: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H6a.5.5 0 0 1 0-1h1.5V3.5A.5.5 0 0 1 8 3Zm0 7a.5.5 0 0 1 .5.5V12H10a.5.5 0 0 1 0 1H8a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 8 10Zm-5-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>',
    'bring-to-front': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 0a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm6 9v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H9Z"/></svg>',
    'bring-forward': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2Zm1 0v4h6V2H2Zm6 6v6a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1Zm6-6v4a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1Zm-1 0H9v4h5V2Z"/></svg>',
    'send-backward': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M0 2a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2Zm1 0v4h5V2H1Zm0 6v6a1 1 0 0 1 1 1h6a1 1 0 0 1-1-1V8a1 1 0 0 1-1-1H1Zm8-6v4a1 1 0 0 1 1 1h5a1 1 0 0 1 1-1V2a1 1 0 0 1-1-1H9a1 1 0 0 1 1 1Z"/></svg>',
    'send-to-back': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M0 2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2Zm8 7h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9Z"/></svg>',
    // Align
    align: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 14.5 0h-13ZM1 1.5a.5.5 0 0 1 .5-.5H4v3.5H1V1.5ZM5 4.5h6V1H5v3.5ZM12 5h3v6h-3V5Zm-1 6H5V5h6v6Zm-7-6H1v6h3V5Z"/></svg>',
    'align-left': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1.5 1a.5.5 0 0 0-1 0v14a.5.5 0 0 0 1 0V1Zm3 0a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V1Zm0 7a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8Z"/></svg>',
    'align-center': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13A.5.5 0 0 0 8 1ZM2 4.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-1Zm2 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1Z"/></svg>',
    'align-right': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M14.5 1a.5.5 0 0 1 1 0v14a.5.5 0 0 1-1 0V1Zm-2.5 0a.5.5 0 0 1 .5-.5H5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h7a.5.5 0 0 1-.5-.5V1Zm0 7a.5.5 0 0 1 .5-.5H2a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h10a.5.5 0 0 1-.5-.5V8Z"/></svg>',
    'align-top': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 1.5a.5.5 0 0 0 1 0V1h13v.5a.5.5 0 0 0 1 0V1a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v.5Zm4 1a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-1 0V3a.5.5 0 0 1 .5-.5Zm6 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V3a.5.5 0 0 1 .5-.5Z"/></svg>',
    'align-middle': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 8a.5.5 0 0 0 .5.5H15a.5.5 0 0 0 0-1H1.5A.5.5 0 0 0 1 8Zm3.5-5a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-1 0v-9a.5.5 0 0 1 .5-.5Zm7 0a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-1 0v-9a.5.5 0 0 1 .5-.5Z"/></svg>',
    'align-bottom': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 14.5a.5.5 0 0 1 1 0V15h13v-.5a.5.5 0 0 1 1 0V15a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-.5Zm4-1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-1 0v10a.5.5 0 0 0 .5.5Zm6 0a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-1 0v7a.5.5 0 0 0 .5.5Z"/></svg>',
    // Distribute
    distribute: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 1.5a.5.5 0 0 1 1 0v13a.5.5 0 0 1-1 0v-13Zm14 0a.5.5 0 0 0-1 0v13a.5.5 0 0 0 1 0v-13ZM5 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5Z"/></svg>',
    'distribute-horizontal': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 1.5a.5.5 0 0 1 1 0v13a.5.5 0 0 1-1 0v-13Zm14 0a.5.5 0 0 0-1 0v13a.5.5 0 0 0 1 0v-13ZM4 5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm5 0a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V5Z"/></svg>',
    'distribute-vertical': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1.5 1a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1h-13Zm0 14a.5.5 0 0 1 0-1h13a.5.5 0 0 1 0 1h-13ZM5 4a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5Zm0 5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H5Z"/></svg>',
    // Flip
    flip: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-1 0V.5A.5.5 0 0 1 8 0ZM2.5 2A1.5 1.5 0 0 0 1 3.5v9A1.5 1.5 0 0 0 2.5 14h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h4a.5.5 0 0 0 0-1h-4Zm7 0a.5.5 0 0 0 0 1h4a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-4a.5.5 0 0 0 0 1h4a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 13.5 2h-4Z"/></svg>',
    'flip-horizontal': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-1 0V.5A.5.5 0 0 1 8 0ZM2.5 2A1.5 1.5 0 0 0 1 3.5v9A1.5 1.5 0 0 0 2.5 14h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h4a.5.5 0 0 0 0-1h-4Zm7 0a.5.5 0 0 0 0 1h4a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-4a.5.5 0 0 0 0 1h4a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 13.5 2h-4Z"/></svg>',
    'flip-vertical': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M.5 8a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 0-1H1A.5.5 0 0 0 .5 8ZM2 2.5A1.5 1.5 0 0 1 3.5 1h9A1.5 1.5 0 0 1 14 2.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4Zm0 11v-4a.5.5 0 0 1 1 0v4a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 1 0v4a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5Z"/></svg>',
    // Group
    group: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1.5 3A1.5 1.5 0 0 0 0 4.5v7A1.5 1.5 0 0 0 1.5 13H7a.5.5 0 0 0 0-1H1.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5H7a.5.5 0 0 0 0-1H1.5ZM9 4a.5.5 0 0 0 0 1h5.5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H9a.5.5 0 0 0 0 1h5.5a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 14.5 3H9Z"/></svg>',
    ungroup: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h5A1.5 1.5 0 0 1 8 1.5V7H1.5A1.5 1.5 0 0 1 0 5.5v-4Zm8 0V7h6.5A1.5 1.5 0 0 0 16 5.5v-4A1.5 1.5 0 0 0 14.5 0h-5A1.5 1.5 0 0 0 8 1.5Zm-8 8A1.5 1.5 0 0 1 1.5 8H8v6.5A1.5 1.5 0 0 1 6.5 16h-5A1.5 1.5 0 0 1 0 14.5v-5Zm8 0V16h6a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 14 8H8Z"/></svg>',
    lock: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/></svg>',
    unlock: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z"/></svg>',
    // Submenu arrow
    'arrow-right': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>',
};
class ContextMenuService {
    apiService;
    contextMenuVisibleSignal = signal(false);
    contextMenuPositionSignal = signal({ x: 0, y: 0 });
    containerBoundsSignal = signal(null);
    // Keyboard navigation state
    focusedItemIndexSignal = signal(-1);
    focusedSubmenuIdSignal = signal(null);
    constructor(apiService) {
        this.apiService = apiService;
    }
    // Computed cache of all menu items for keyboard navigation
    allMenuItemsCache = computed(() => {
        const sections = this.getContextMenuSections()();
        const allItems = [];
        sections.forEach((section) => {
            section.items.forEach((item) => {
                allItems.push(item);
                if (item.submenu && this.focusedSubmenuIdSignal() === item.id) {
                    item.submenu.forEach((subItem) => {
                        allItems.push(subItem);
                    });
                }
            });
        });
        return allItems;
    });
    // Getters for context menu state
    getContextMenuVisible() {
        return this.contextMenuVisibleSignal.asReadonly();
    }
    getContextMenuPosition() {
        return this.contextMenuPositionSignal.asReadonly();
    }
    getContainerBounds() {
        return this.containerBoundsSignal.asReadonly();
    }
    getFocusedItemIndex() {
        return this.focusedItemIndexSignal.asReadonly();
    }
    getFocusedSubmenuId() {
        return this.focusedSubmenuIdSignal.asReadonly();
    }
    // Context menu control methods
    showContextMenu(x, y, containerBounds) {
        this.contextMenuPositionSignal.set({ x, y });
        this.containerBoundsSignal.set(containerBounds || null);
        this.contextMenuVisibleSignal.set(true);
        this.focusedItemIndexSignal.set(-1);
        this.focusedSubmenuIdSignal.set(null);
    }
    hideContextMenu() {
        this.contextMenuVisibleSignal.set(false);
        this.focusedItemIndexSignal.set(-1);
        this.focusedSubmenuIdSignal.set(null);
    }
    // Get context menu sections with dynamic enable/disable logic
    getContextMenuSections() {
        return computed(() => {
            const selectedElements = this.apiService.getSelectedElements();
            const hasSelection = selectedElements.length > 0;
            const hasMultipleSelection = selectedElements.length > 1;
            const canDistribute = selectedElements.length > 2;
            const clipboardInfo = this.apiService.getClipboardInfo();
            const hasClipboardData = clipboardInfo !== null && clipboardInfo.elementCount > 0;
            const hasGroupedElements = hasSelection && selectedElements.some((el) => el.groupId);
            const hasLockedElements = hasSelection && selectedElements.some((el) => el.locked);
            const hasUnlockedElements = hasSelection && selectedElements.some((el) => !el.locked);
            const sections = [
                // 📋 CLIPBOARD
                {
                    id: 'clipboard',
                    items: [
                        {
                            id: 'cut',
                            label: 'Cut',
                            shortcut: 'Ctrl+X',
                            enabled: hasSelection,
                            visible: hasSelection,
                            action: () => this.apiService.cutElements(),
                        },
                        {
                            id: 'copy',
                            label: 'Copy',
                            shortcut: 'Ctrl+C',
                            enabled: hasSelection,
                            visible: hasSelection,
                            action: () => this.apiService.copyElements(),
                        },
                        {
                            id: 'paste',
                            label: 'Paste',
                            shortcut: 'Ctrl+V',
                            enabled: hasClipboardData,
                            visible: hasClipboardData,
                            action: () => this.apiService.pasteElements(),
                        },
                        {
                            id: 'duplicate',
                            label: 'Duplicate',
                            shortcut: 'Ctrl+D',
                            enabled: hasSelection,
                            visible: hasSelection,
                            divider: true,
                            action: () => this.apiService.duplicateElements(),
                        },
                    ],
                },
                // 🎯 SELECTION
                {
                    id: 'selection',
                    items: [
                        {
                            id: 'select-all',
                            label: 'Select All',
                            shortcut: 'Ctrl+A',
                            enabled: true,
                            visible: true,
                            action: () => this.apiService.selectAll(),
                        },
                        {
                            id: 'delete',
                            label: 'Delete',
                            shortcut: 'Del',
                            enabled: hasSelection,
                            visible: hasSelection,
                            divider: true,
                            action: () => this.apiService.deleteSelectedElements(),
                        },
                    ],
                },
                // 🎨 ARRANGE
                {
                    id: 'arrange',
                    items: [
                        {
                            id: 'order',
                            label: 'Order',
                            enabled: hasSelection,
                            visible: hasSelection,
                            submenu: [
                                {
                                    id: 'bring-to-front',
                                    label: 'Bring to Front',
                                    shortcut: 'Ctrl+Shift+]',
                                    enabled: true,
                                    visible: true,
                                    action: () => this.apiService.bringToFront(),
                                },
                                {
                                    id: 'bring-forward',
                                    label: 'Bring Forward',
                                    shortcut: 'Ctrl+]',
                                    enabled: true,
                                    visible: true,
                                    action: () => this.apiService.bringForward(),
                                },
                                {
                                    id: 'send-backward',
                                    label: 'Send Backward',
                                    shortcut: 'Ctrl+[',
                                    enabled: true,
                                    visible: true,
                                    action: () => this.apiService.sendBackward(),
                                },
                                {
                                    id: 'send-to-back',
                                    label: 'Send to Back',
                                    shortcut: 'Ctrl+Shift+[',
                                    enabled: true,
                                    visible: true,
                                    action: () => this.apiService.sendToBack(),
                                },
                            ],
                        },
                        {
                            id: 'transform',
                            label: 'Transform',
                            enabled: hasSelection,
                            visible: hasSelection,
                            submenu: [
                                {
                                    id: 'align-left',
                                    label: 'Align Left',
                                    enabled: true,
                                    visible: true,
                                    action: () => this.apiService.alignElements(AlignmentType.Left),
                                },
                                {
                                    id: 'align-center',
                                    label: 'Align Center',
                                    enabled: true,
                                    visible: true,
                                    action: () => this.apiService.alignElements(AlignmentType.Center),
                                },
                                {
                                    id: 'align-right',
                                    label: 'Align Right',
                                    enabled: true,
                                    visible: true,
                                    divider: true,
                                    action: () => this.apiService.alignElements(AlignmentType.Right),
                                },
                                {
                                    id: 'align-top',
                                    label: 'Align Top',
                                    enabled: true,
                                    visible: true,
                                    action: () => this.apiService.alignElements(AlignmentType.Top),
                                },
                                {
                                    id: 'align-middle',
                                    label: 'Align Middle',
                                    enabled: true,
                                    visible: true,
                                    action: () => this.apiService.alignElements(AlignmentType.Middle),
                                },
                                {
                                    id: 'align-bottom',
                                    label: 'Align Bottom',
                                    enabled: true,
                                    visible: true,
                                    divider: true,
                                    action: () => this.apiService.alignElements(AlignmentType.Bottom),
                                },
                                {
                                    id: 'distribute-horizontal',
                                    label: 'Distribute Horizontally',
                                    enabled: canDistribute,
                                    visible: canDistribute,
                                    action: () => this.apiService.distributeHorizontally(),
                                },
                                {
                                    id: 'distribute-vertical',
                                    label: 'Distribute Vertically',
                                    enabled: canDistribute,
                                    visible: canDistribute,
                                    divider: true,
                                    action: () => this.apiService.distributeVertically(),
                                },
                                {
                                    id: 'flip-horizontal',
                                    label: 'Flip Horizontal',
                                    enabled: true,
                                    visible: true,
                                    action: () => this.apiService.flipHorizontal(),
                                },
                                {
                                    id: 'flip-vertical',
                                    label: 'Flip Vertical',
                                    enabled: true,
                                    visible: true,
                                    action: () => this.apiService.flipVertical(),
                                },
                            ],
                        },
                    ],
                },
                // � OBJECT
                {
                    id: 'object',
                    items: [
                        {
                            id: 'group',
                            label: 'Group',
                            shortcut: 'Ctrl+G',
                            enabled: hasMultipleSelection,
                            visible: hasMultipleSelection,
                            action: () => this.apiService.groupSelectedElements(),
                        },
                        {
                            id: 'ungroup',
                            label: 'Ungroup',
                            shortcut: 'Ctrl+Shift+G',
                            enabled: hasGroupedElements,
                            visible: hasGroupedElements,
                            action: () => this.apiService.ungroupSelectedElements(),
                        },
                        {
                            id: 'lock',
                            label: 'Lock',
                            shortcut: 'Ctrl+L',
                            enabled: hasUnlockedElements,
                            visible: hasUnlockedElements,
                            action: () => this.apiService.lockElements(),
                        },
                        {
                            id: 'unlock',
                            label: 'Unlock',
                            shortcut: 'Ctrl+Shift+L',
                            enabled: hasLockedElements,
                            visible: hasLockedElements,
                            action: () => this.apiService.unlockElements(),
                        },
                    ],
                },
            ];
            // Filter out empty sections (sections with no visible items)
            const filteredSections = sections
                .map((section) => ({
                ...section,
                items: section.items.filter((item) => item.visible),
            }))
                .filter((section) => section.items.length > 0);
            return filteredSections;
        });
    }
    // Execute action and hide menu
    executeAction(action) {
        try {
            action();
        }
        catch (error) {
            console.error('Error executing context menu action:', error);
        }
        finally {
            this.hideContextMenu();
        }
    }
    // Keyboard navigation methods
    focusNextItem() {
        const allItems = this.allMenuItemsCache();
        const enabledItems = allItems.filter((item) => item.enabled);
        if (enabledItems.length === 0)
            return;
        const currentIndex = this.focusedItemIndexSignal();
        const currentItem = currentIndex >= 0 ? allItems[currentIndex] : null;
        const currentEnabledIndex = currentItem ? enabledItems.indexOf(currentItem) : -1;
        const nextEnabledIndex = (currentEnabledIndex + 1) % enabledItems.length;
        const nextItem = enabledItems[nextEnabledIndex];
        const nextIndex = allItems.indexOf(nextItem);
        this.focusedItemIndexSignal.set(nextIndex);
    }
    focusPreviousItem() {
        const allItems = this.allMenuItemsCache();
        const enabledItems = allItems.filter((item) => item.enabled);
        if (enabledItems.length === 0)
            return;
        const currentIndex = this.focusedItemIndexSignal();
        const currentItem = currentIndex >= 0 ? allItems[currentIndex] : null;
        const currentEnabledIndex = currentItem ? enabledItems.indexOf(currentItem) : -1;
        const prevEnabledIndex = currentEnabledIndex <= 0 ? enabledItems.length - 1 : currentEnabledIndex - 1;
        const prevItem = enabledItems[prevEnabledIndex];
        const prevIndex = allItems.indexOf(prevItem);
        this.focusedItemIndexSignal.set(prevIndex);
    }
    focusFirstItem() {
        const allItems = this.allMenuItemsCache();
        const enabledItems = allItems.filter((item) => item.enabled);
        if (enabledItems.length === 0)
            return;
        const firstItem = enabledItems[0];
        const firstIndex = allItems.indexOf(firstItem);
        this.focusedItemIndexSignal.set(firstIndex);
    }
    focusLastItem() {
        const allItems = this.allMenuItemsCache();
        const enabledItems = allItems.filter((item) => item.enabled);
        if (enabledItems.length === 0)
            return;
        const lastItem = enabledItems[enabledItems.length - 1];
        const lastIndex = allItems.indexOf(lastItem);
        this.focusedItemIndexSignal.set(lastIndex);
    }
    openFocusedSubmenu() {
        const allItems = this.allMenuItemsCache();
        const currentIndex = this.focusedItemIndexSignal();
        if (currentIndex < 0 || currentIndex >= allItems.length)
            return;
        const item = allItems[currentIndex];
        if (item.submenu && item.enabled) {
            this.focusedSubmenuIdSignal.set(item.id);
        }
    }
    closeFocusedSubmenu() {
        this.focusedSubmenuIdSignal.set(null);
    }
    executeFocusedAction() {
        const allItems = this.allMenuItemsCache();
        const currentIndex = this.focusedItemIndexSignal();
        if (currentIndex < 0 || currentIndex >= allItems.length)
            return;
        const item = allItems[currentIndex];
        if (item.enabled && item.action) {
            this.executeAction(item.action);
        }
        else if (item.submenu && item.enabled) {
            this.openFocusedSubmenu();
        }
    }
    // Get icon SVG
    getIcon(iconName) {
        if (!iconName)
            return '';
        return CONTEXT_MENU_ICONS[iconName] || '';
    }
    // Get all menu items (for keyboard navigation)
    getAllMenuItems() {
        return this.allMenuItemsCache();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ContextMenuService, deps: [{ token: ApiService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ContextMenuService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ContextMenuService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: ApiService }] });

class ContextMenuComponent {
    contextMenuService;
    contextMenu;
    isVisible;
    position;
    sections;
    containerBounds;
    focusedItem;
    hoveredItem = null;
    submenuPosition = { left: 0, top: 0 };
    submenuTimeout = null;
    constructor(contextMenuService) {
        this.contextMenuService = contextMenuService;
        this.isVisible = this.contextMenuService.getContextMenuVisible();
        this.position = this.contextMenuService.getContextMenuPosition();
        this.sections = this.contextMenuService.getContextMenuSections();
        this.containerBounds = this.contextMenuService.getContainerBounds();
        // Create a computed signal that returns the focused item directly
        this.focusedItem = computed(() => {
            const focusedIndex = this.contextMenuService.getFocusedItemIndex()();
            const allItems = this.contextMenuService.getAllMenuItems();
            return allItems[focusedIndex] || null;
        });
    }
    ngOnInit() {
        this.position = computed(() => {
            const pos = this.contextMenuService.getContextMenuPosition()();
            const containerBounds = this.containerBounds();
            let x = pos.x;
            let y = pos.y;
            if (containerBounds) {
                x = pos.x - containerBounds.left;
                y = pos.y - containerBounds.top;
            }
            return this.adjustPosition(x, y);
        });
    }
    ngOnDestroy() {
        this.contextMenuService.hideContextMenu();
        if (this.submenuTimeout) {
            clearTimeout(this.submenuTimeout);
        }
    }
    onItemClick(item, event) {
        if (!item.enabled)
            return;
        if (item.submenu) {
            event.stopPropagation();
            return;
        }
        if (item.action) {
            this.contextMenuService.executeAction(item.action);
        }
    }
    onItemHover(item, event) {
        if (this.submenuTimeout) {
            clearTimeout(this.submenuTimeout);
            this.submenuTimeout = null;
        }
        if (item.submenu && item.enabled) {
            this.hoveredItem = item;
            const target = event.currentTarget;
            this.calculateSubmenuPosition(target);
        }
        else {
            this.hoveredItem = null;
        }
    }
    onItemLeave() {
        if (this.submenuTimeout) {
            clearTimeout(this.submenuTimeout);
        }
        this.submenuTimeout = setTimeout(() => {
            this.hoveredItem = null;
        }, 100);
    }
    onSubmenuEnter() {
        if (this.submenuTimeout) {
            clearTimeout(this.submenuTimeout);
            this.submenuTimeout = null;
        }
    }
    onSubmenuLeave() {
        if (this.submenuTimeout) {
            clearTimeout(this.submenuTimeout);
        }
        this.submenuTimeout = setTimeout(() => {
            this.hoveredItem = null;
        }, 100);
    }
    calculateSubmenuPosition(itemElement) {
        const itemRect = itemElement.getBoundingClientRect();
        const containerBounds = this.containerBounds();
        if (!containerBounds) {
            this.submenuPosition = {
                left: itemRect.right + 4,
                top: itemRect.top - 4,
            };
            return;
        }
        const submenuWidth = 200;
        const padding = 4;
        const itemRelativeLeft = itemRect.left - containerBounds.left;
        const itemRelativeRight = itemRect.right - containerBounds.left;
        const itemRelativeTop = itemRect.top - containerBounds.top;
        const contextMenuElement = this.contextMenu?.nativeElement;
        const contextMenuRect = contextMenuElement?.getBoundingClientRect();
        const contextMenuTop = contextMenuRect ? contextMenuRect.top - containerBounds.top : padding;
        const contextMenuBottom = contextMenuRect
            ? contextMenuRect.bottom - containerBounds.top
            : containerBounds.height - padding;
        // Calculate horizontal position
        let left = itemRelativeRight + padding;
        const spaceOnRight = containerBounds.width - itemRelativeRight - padding;
        const spaceOnLeft = itemRelativeLeft - padding;
        if (spaceOnRight < submenuWidth && spaceOnLeft > spaceOnRight) {
            left = itemRelativeLeft - submenuWidth - padding;
        }
        // Calculate vertical position - align with item initially
        let top = itemRelativeTop;
        // Estimate submenu height (will be calculated dynamically based on items)
        const estimatedItemHeight = 32; // Approximate height per item
        const submenuItemCount = this.hoveredItem?.submenu?.length || 0;
        const submenuHeight = submenuItemCount * estimatedItemHeight + 8; // +8 for padding
        // Ensure submenu doesn't exceed context menu bottom
        const submenuBottom = top + submenuHeight;
        if (submenuBottom > contextMenuBottom) {
            top = contextMenuBottom - submenuHeight;
        }
        // Ensure submenu doesn't go above context menu top
        if (top < contextMenuTop) {
            top = contextMenuTop;
        }
        // Final horizontal bounds check
        if (left < padding) {
            left = padding;
        }
        if (left + submenuWidth > containerBounds.width - padding) {
            left = containerBounds.width - submenuWidth - padding;
        }
        this.submenuPosition = { left, top };
    }
    onKeyDown(event) {
        if (!this.isVisible())
            return;
        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                this.contextMenuService.hideContextMenu();
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.contextMenuService.focusNextItem();
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.contextMenuService.focusPreviousItem();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.contextMenuService.openFocusedSubmenu();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.contextMenuService.closeFocusedSubmenu();
                break;
            case 'Enter':
                event.preventDefault();
                this.contextMenuService.executeFocusedAction();
                break;
            case 'Home':
                event.preventDefault();
                this.contextMenuService.focusFirstItem();
                break;
            case 'End':
                event.preventDefault();
                this.contextMenuService.focusLastItem();
                break;
        }
    }
    onDocumentClick(event) {
        if (this.isVisible() && this.contextMenu?.nativeElement) {
            const contextMenuElement = this.contextMenu.nativeElement;
            const target = event.target;
            if (!contextMenuElement.contains(target)) {
                this.contextMenuService.hideContextMenu();
            }
        }
    }
    adjustPosition(x, y) {
        if (!this.contextMenu?.nativeElement) {
            return { x, y };
        }
        const menu = this.contextMenu.nativeElement;
        const menuRect = menu.getBoundingClientRect();
        const containerBounds = this.containerBounds();
        if (!containerBounds) {
            return { x, y };
        }
        let adjustedX = x;
        let adjustedY = y;
        const padding = 10;
        const maxMenuHeight = 400;
        if (x + menuRect.width > containerBounds.width - padding) {
            adjustedX = Math.max(padding, x - menuRect.width);
        }
        if (adjustedX < padding) {
            adjustedX = padding;
        }
        const availableHeight = containerBounds.height - y - padding;
        const requiredHeight = Math.min(menuRect.height, maxMenuHeight);
        if (requiredHeight > availableHeight) {
            const availableHeightAbove = y - padding;
            if (requiredHeight <= availableHeightAbove) {
                adjustedY = y - requiredHeight;
            }
            else {
                if (availableHeightAbove > availableHeight) {
                    adjustedY = y - Math.min(requiredHeight, availableHeightAbove);
                }
                else {
                    adjustedY = Math.max(padding, containerBounds.height - requiredHeight - padding);
                }
            }
        }
        if (adjustedY < padding) {
            adjustedY = padding;
        }
        if (adjustedY + requiredHeight > containerBounds.height - padding) {
            adjustedY = containerBounds.height - requiredHeight - padding;
        }
        return { x: adjustedX, y: adjustedY };
    }
    isFocused(item) {
        return this.focusedItem() === item;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ContextMenuComponent, deps: [{ token: ContextMenuService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.3.12", type: ContextMenuComponent, isStandalone: true, selector: "wb-context-menu", host: { listeners: { "document:keydown": "onKeyDown($event)", "document:click": "onDocumentClick($event)" } }, viewQueries: [{ propertyName: "contextMenu", first: true, predicate: ["contextMenu"], descendants: true, static: true }], ngImport: i0, template: `
    <div
      #contextMenu
      class="context-menu"
      [class.visible]="isVisible()"
      [style.left.px]="position().x"
      [style.top.px]="position().y"
      (click)="$event.stopPropagation()"
    >
      <div class="context-menu-content">
        @for (section of sections(); track section.id) {
        <div class="context-menu-section">
          @for (item of section.items; track item.id) {
          <div
            class="context-menu-item"
            [class.disabled]="!item.enabled"
            [class.divider-after]="item.divider"
            [class.has-submenu]="item.submenu"
            [class.active]="hoveredItem === item"
            [class.focused]="isFocused(item)"
            (click)="onItemClick(item, $event)"
            (mouseenter)="onItemHover(item, $event)"
            (mouseleave)="onItemLeave()"
            [attr.title]="item.shortcut || null"
          >
            <div class="item-content">
              <span class="item-label">{{ item.label }}</span>
              @if (item.shortcut) {
              <span class="item-shortcut">{{ item.shortcut }}</span>
              } @if (item.submenu) {
              <span class="item-arrow">›</span>
              }
            </div>
          </div>
          }
        </div>
        }
      </div>
    </div>

    <!-- Submenu rendered separately outside main menu -->
    @if (hoveredItem && hoveredItem.submenu) {
    <div
      class="submenu"
      [style.left.px]="submenuPosition.left"
      [style.top.px]="submenuPosition.top"
      (mouseenter)="onSubmenuEnter()"
      (mouseleave)="onSubmenuLeave()"
      (click)="$event.stopPropagation()"
    >
      @for (subitem of hoveredItem.submenu; track subitem.id) {
      <div
        class="context-menu-item submenu-item"
        [class.disabled]="!subitem.enabled"
        [class.divider-after]="subitem.divider"
        [class.focused]="isFocused(subitem)"
        (click)="onItemClick(subitem, $event)"
        [attr.title]="subitem.shortcut || null"
      >
        <div class="item-content">
          <span class="item-label">{{ subitem.label }}</span>
          @if (subitem.shortcut) {
          <span class="item-shortcut">{{ subitem.shortcut }}</span>
          }
        </div>
      </div>
      }
    </div>
    }
  `, isInline: true, styles: [".context-menu{position:absolute;z-index:10000;opacity:0;visibility:hidden;transform:scale(.95);transition:all .1s ease-out;pointer-events:none}.context-menu.visible{opacity:1;visibility:visible;transform:scale(1);pointer-events:auto}.context-menu-content{background:#fff;border:1px solid #e0e0e0;border-radius:6px;box-shadow:0 4px 12px #00000026;padding:4px 0;min-width:200px;max-width:300px;max-height:400px;overflow-y:auto;-webkit-user-select:none;user-select:none}.context-menu-content::-webkit-scrollbar{width:6px}.context-menu-content::-webkit-scrollbar-track{background:#f1f1f1;border-radius:3px}.context-menu-content::-webkit-scrollbar-thumb{background:#c1c1c1;border-radius:3px}.context-menu-content::-webkit-scrollbar-thumb:hover{background:#a8a8a8}.context-menu-section:not(:last-child){border-bottom:1px solid #f0f0f0;margin-bottom:4px;padding-bottom:4px}.context-menu-item{padding:8px 16px;cursor:pointer;transition:background-color .1s ease;position:relative}.context-menu-item:hover:not(.disabled){background-color:#f5f5f5}.context-menu-item.focused:not(.disabled){background-color:#e3f2fd;outline:2px solid #2196f3;outline-offset:-2px}.context-menu-item.disabled{opacity:.5;cursor:not-allowed}.context-menu-item.divider-after:after{content:\"\";position:absolute;bottom:0;left:16px;right:16px;height:1px;background-color:#e0e0e0;margin-bottom:-4px}.item-content{display:flex;align-items:center;justify-content:space-between;width:100%}.item-label{flex:1;font-size:14px;color:#333;font-weight:400}.item-shortcut{font-size:12px;color:#666;margin-left:16px;font-family:Monaco,Menlo,Ubuntu Mono,monospace}.item-arrow{margin-left:8px;font-size:16px;color:#999}.context-menu-item.has-submenu{position:relative}.context-menu-item.has-submenu.active{background-color:#f5f5f5}.submenu{position:absolute;background:#fff;border:1px solid #e0e0e0;border-radius:6px;box-shadow:0 4px 12px #00000026;padding:4px 0;min-width:200px;max-width:300px;-webkit-user-select:none;user-select:none;z-index:10001;opacity:1;transform:scale(1);transition:opacity .1s ease,transform .1s ease}.submenu-item{padding:8px 16px}.submenu-item:hover:not(.disabled){background-color:#f5f5f5}.context-menu-item.disabled .item-label,.context-menu-item.disabled .item-shortcut,.context-menu-item.disabled .item-arrow{color:#999}@media (prefers-color-scheme: dark){.context-menu-content,.submenu{background:#2a2a2a;border-color:#404040}.context-menu-content::-webkit-scrollbar-track{background:#3a3a3a}.context-menu-content::-webkit-scrollbar-thumb{background:#666}.context-menu-content::-webkit-scrollbar-thumb:hover{background:#777}.context-menu-item:hover:not(.disabled){background-color:#404040}.context-menu-item.focused:not(.disabled){background-color:#1e3a5f;outline:2px solid #1976d2}.context-menu-item.has-submenu.active{background-color:#404040}.submenu-item:hover:not(.disabled){background-color:#404040}.item-label{color:#e0e0e0}.item-shortcut{color:#a0a0a0}.item-arrow,.context-menu-item.disabled .item-label,.context-menu-item.disabled .item-shortcut,.context-menu-item.disabled .item-arrow{color:#666}.context-menu-section:not(:last-child){border-bottom-color:#404040}.context-menu-item.divider-after:after{background-color:#404040}}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ContextMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: 'wb-context-menu', standalone: true, imports: [CommonModule], template: `
    <div
      #contextMenu
      class="context-menu"
      [class.visible]="isVisible()"
      [style.left.px]="position().x"
      [style.top.px]="position().y"
      (click)="$event.stopPropagation()"
    >
      <div class="context-menu-content">
        @for (section of sections(); track section.id) {
        <div class="context-menu-section">
          @for (item of section.items; track item.id) {
          <div
            class="context-menu-item"
            [class.disabled]="!item.enabled"
            [class.divider-after]="item.divider"
            [class.has-submenu]="item.submenu"
            [class.active]="hoveredItem === item"
            [class.focused]="isFocused(item)"
            (click)="onItemClick(item, $event)"
            (mouseenter)="onItemHover(item, $event)"
            (mouseleave)="onItemLeave()"
            [attr.title]="item.shortcut || null"
          >
            <div class="item-content">
              <span class="item-label">{{ item.label }}</span>
              @if (item.shortcut) {
              <span class="item-shortcut">{{ item.shortcut }}</span>
              } @if (item.submenu) {
              <span class="item-arrow">›</span>
              }
            </div>
          </div>
          }
        </div>
        }
      </div>
    </div>

    <!-- Submenu rendered separately outside main menu -->
    @if (hoveredItem && hoveredItem.submenu) {
    <div
      class="submenu"
      [style.left.px]="submenuPosition.left"
      [style.top.px]="submenuPosition.top"
      (mouseenter)="onSubmenuEnter()"
      (mouseleave)="onSubmenuLeave()"
      (click)="$event.stopPropagation()"
    >
      @for (subitem of hoveredItem.submenu; track subitem.id) {
      <div
        class="context-menu-item submenu-item"
        [class.disabled]="!subitem.enabled"
        [class.divider-after]="subitem.divider"
        [class.focused]="isFocused(subitem)"
        (click)="onItemClick(subitem, $event)"
        [attr.title]="subitem.shortcut || null"
      >
        <div class="item-content">
          <span class="item-label">{{ subitem.label }}</span>
          @if (subitem.shortcut) {
          <span class="item-shortcut">{{ subitem.shortcut }}</span>
          }
        </div>
      </div>
      }
    </div>
    }
  `, styles: [".context-menu{position:absolute;z-index:10000;opacity:0;visibility:hidden;transform:scale(.95);transition:all .1s ease-out;pointer-events:none}.context-menu.visible{opacity:1;visibility:visible;transform:scale(1);pointer-events:auto}.context-menu-content{background:#fff;border:1px solid #e0e0e0;border-radius:6px;box-shadow:0 4px 12px #00000026;padding:4px 0;min-width:200px;max-width:300px;max-height:400px;overflow-y:auto;-webkit-user-select:none;user-select:none}.context-menu-content::-webkit-scrollbar{width:6px}.context-menu-content::-webkit-scrollbar-track{background:#f1f1f1;border-radius:3px}.context-menu-content::-webkit-scrollbar-thumb{background:#c1c1c1;border-radius:3px}.context-menu-content::-webkit-scrollbar-thumb:hover{background:#a8a8a8}.context-menu-section:not(:last-child){border-bottom:1px solid #f0f0f0;margin-bottom:4px;padding-bottom:4px}.context-menu-item{padding:8px 16px;cursor:pointer;transition:background-color .1s ease;position:relative}.context-menu-item:hover:not(.disabled){background-color:#f5f5f5}.context-menu-item.focused:not(.disabled){background-color:#e3f2fd;outline:2px solid #2196f3;outline-offset:-2px}.context-menu-item.disabled{opacity:.5;cursor:not-allowed}.context-menu-item.divider-after:after{content:\"\";position:absolute;bottom:0;left:16px;right:16px;height:1px;background-color:#e0e0e0;margin-bottom:-4px}.item-content{display:flex;align-items:center;justify-content:space-between;width:100%}.item-label{flex:1;font-size:14px;color:#333;font-weight:400}.item-shortcut{font-size:12px;color:#666;margin-left:16px;font-family:Monaco,Menlo,Ubuntu Mono,monospace}.item-arrow{margin-left:8px;font-size:16px;color:#999}.context-menu-item.has-submenu{position:relative}.context-menu-item.has-submenu.active{background-color:#f5f5f5}.submenu{position:absolute;background:#fff;border:1px solid #e0e0e0;border-radius:6px;box-shadow:0 4px 12px #00000026;padding:4px 0;min-width:200px;max-width:300px;-webkit-user-select:none;user-select:none;z-index:10001;opacity:1;transform:scale(1);transition:opacity .1s ease,transform .1s ease}.submenu-item{padding:8px 16px}.submenu-item:hover:not(.disabled){background-color:#f5f5f5}.context-menu-item.disabled .item-label,.context-menu-item.disabled .item-shortcut,.context-menu-item.disabled .item-arrow{color:#999}@media (prefers-color-scheme: dark){.context-menu-content,.submenu{background:#2a2a2a;border-color:#404040}.context-menu-content::-webkit-scrollbar-track{background:#3a3a3a}.context-menu-content::-webkit-scrollbar-thumb{background:#666}.context-menu-content::-webkit-scrollbar-thumb:hover{background:#777}.context-menu-item:hover:not(.disabled){background-color:#404040}.context-menu-item.focused:not(.disabled){background-color:#1e3a5f;outline:2px solid #1976d2}.context-menu-item.has-submenu.active{background-color:#404040}.submenu-item:hover:not(.disabled){background-color:#404040}.item-label{color:#e0e0e0}.item-shortcut{color:#a0a0a0}.item-arrow,.context-menu-item.disabled .item-label,.context-menu-item.disabled .item-shortcut,.context-menu-item.disabled .item-arrow{color:#666}.context-menu-section:not(:last-child){border-bottom-color:#404040}.context-menu-item.divider-after:after{background-color:#404040}}\n"] }]
        }], ctorParameters: () => [{ type: ContextMenuService }], propDecorators: { contextMenu: [{
                type: ViewChild,
                args: ['contextMenu', { static: true }]
            }], onKeyDown: [{
                type: HostListener,
                args: ['document:keydown', ['$event']]
            }], onDocumentClick: [{
                type: HostListener,
                args: ['document:click', ['$event']]
            }] } });

class SvgService {
    toolsService;
    configService;
    EventBusService;
    keyboardShortcutService;
    apiService;
    contextMenuService;
    dragDropService;
    wheelHandlerService;
    pointerDownSig = signal(null);
    pointerMoveSig = signal(null);
    pointerUpSig = signal(null);
    isSpaceHeld = false;
    constructor(toolsService, configService, EventBusService, keyboardShortcutService, apiService, contextMenuService, dragDropService, wheelHandlerService) {
        this.toolsService = toolsService;
        this.configService = configService;
        this.EventBusService = EventBusService;
        this.keyboardShortcutService = keyboardShortcutService;
        this.apiService = apiService;
        this.contextMenuService = contextMenuService;
        this.dragDropService = dragDropService;
        this.wheelHandlerService = wheelHandlerService;
    }
    onPointerDown(info) {
        if (info.button === 1) {
            this.toolsService.pushTemporaryTool(ToolType.Hand, 'pan-middle');
            const hand = this.safeGetHandTool();
            hand?.handlePointerDown?.(info);
            return;
        }
        if (info.button === 2) {
            return;
        }
        if (this.toolsService.hasTemporaryOverride())
            return;
        if (!this.canDraw())
            return;
        this.EventBusService.emit(WhiteboardEvent.DrawStart, info);
        const currentTool = this.toolsService.getActiveToolInstance();
        currentTool?.handlePointerDown?.(info);
        if (info.isDoubleClick) {
            this.EventBusService.emit(WhiteboardEvent.ElementDoubleClicked, {
                target: info.target,
                clientX: info.clientX,
                clientY: info.clientY,
            });
        }
        this.pointerDownSig.set(info);
    }
    onPointerMove(info) {
        if (this.toolsService.hasTemporaryOverride()) {
            this.safeGetHandTool()?.handlePointerMove?.(info);
            return;
        }
        if (!this.canDraw())
            return;
        this.EventBusService.emit(WhiteboardEvent.Drawing, info);
        const currentTool = this.toolsService.getActiveToolInstance();
        currentTool?.handlePointerMove?.(info);
        this.pointerMoveSig.set(info);
    }
    onPointerUp(info) {
        if (info.button === 1 && this.toolsService.hasTemporaryOverride()) {
            this.safeGetHandTool()?.handlePointerUp?.(info);
            this.toolsService.popTemporaryTool('pan-middle');
            return;
        }
        if (!this.canDraw())
            return;
        this.EventBusService.emit(WhiteboardEvent.DrawEnd);
        const currentTool = this.toolsService.getActiveToolInstance();
        currentTool?.handlePointerUp?.(info);
        this.pointerUpSig.set(info);
    }
    onKeyDown(event) {
        const target = event.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
            return;
        }
        if (event.code === 'Space' && !this.isSpaceHeld) {
            this.isSpaceHeld = true;
            this.toolsService.pushTemporaryTool(ToolType.Hand, 'pan-space');
            event.preventDefault();
            return;
        }
        const currentTool = this.toolsService.getActiveToolInstance();
        currentTool?.handleKeyDown?.(event);
        if (!this.canUseKeyboardShortcuts())
            return;
        this.keyboardShortcutService.handleKeyDown(event);
    }
    onKeyUp(event) {
        if (event.code === 'Space' && this.isSpaceHeld) {
            this.isSpaceHeld = false;
            this.toolsService.popTemporaryTool('pan-space');
            event.preventDefault();
            return;
        }
        const currentTool = this.toolsService.getActiveToolInstance();
        currentTool?.handleKeyUp?.(event);
        if (!this.canUseKeyboardShortcuts())
            return;
        this.keyboardShortcutService.handleKeyUp(event);
    }
    /**
     * Handles wheel events for zooming and scrolling.
     */
    onWheel(event) {
        if (!this.canDraw())
            return;
        this.wheelHandlerService.handleWheel(event);
    }
    onDragOver(event) {
        if (!this.canDraw())
            return;
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'copy';
        }
    }
    onDrop(event) {
        if (!this.canDraw())
            return;
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.dragDropService.handleFiles(files);
            return;
        }
        const html = event.dataTransfer?.getData('text/html');
        if (html) {
            this.dragDropService.handleText(html, event, true);
            return;
        }
        const text = event.dataTransfer?.getData('text/plain');
        if (text) {
            this.dragDropService.handleText(text, event, false);
            return;
        }
        const json = event.dataTransfer?.getData('application/json');
        if (json) {
            try {
                const elements = JSON.parse(json);
                if (Array.isArray(elements)) {
                    this.dragDropService.handleElements(elements, event);
                }
            }
            catch (e) {
                console.warn('Failed to parse dropped JSON:', e);
            }
        }
    }
    // CONTEXT MENU HANDLING
    onContextMenu(info, containerBounds) {
        if (!this.canDraw())
            return;
        // First, try to detect if we right-clicked on an element
        const targetElement = this.getTargetElementFromPointer(info);
        // Check if we have any selected elements
        const currentSelection = this.apiService.selectedElements();
        const hasSelection = currentSelection.length > 0;
        if (targetElement) {
            const isAlreadySelected = currentSelection.some((el) => el.id === targetElement.id);
            if (!isAlreadySelected) {
                this.apiService.selectElements(targetElement);
            }
        }
        else if (!hasSelection) {
            this.apiService.clearSelection();
        }
        this.contextMenuService.showContextMenu(info.clientX, info.clientY, containerBounds);
    }
    canDraw() {
        return this.configService.getConfig().drawingEnabled;
    }
    canUseKeyboardShortcuts() {
        return this.configService.getConfig().keyboardShortcutsEnabled;
    }
    safeGetHandTool() {
        try {
            return this.toolsService.getToolInstance(ToolType.Hand);
        }
        catch {
            return null;
        }
    }
    /**
     * Get the whiteboard element that was clicked on, if any
     */
    getTargetElementFromPointer(info) {
        const allElements = this.apiService.getElements();
        return getTargetElement(info, allElements);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SvgService, deps: [{ token: ToolsService }, { token: ConfigService }, { token: EventBusService }, { token: KeyboardShortcutService }, { token: ApiService }, { token: ContextMenuService }, { token: DragDropService }, { token: WheelHandlerService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SvgService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SvgService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: ToolsService }, { type: ConfigService }, { type: EventBusService }, { type: KeyboardShortcutService }, { type: ApiService }, { type: ContextMenuService }, { type: DragDropService }, { type: WheelHandlerService }] });

class GlobalKeyboardDirective {
    configService = inject(ConfigService);
    svgService = inject(SvgService);
    elementRef = inject(ElementRef);
    isHovered = false;
    lastInteractionTime = 0;
    INTERACTION_TIMEOUT = 500;
    static activeDirective = null;
    ngOnInit() {
        const element = this.elementRef.nativeElement;
        element.addEventListener('mouseenter', this.handleMouseEnter);
        element.addEventListener('mouseleave', this.handleMouseLeave);
        element.addEventListener('pointerdown', this.handleInteraction);
        element.addEventListener('pointerup', this.handleInteraction);
    }
    ngOnDestroy() {
        const element = this.elementRef.nativeElement;
        element.removeEventListener('mouseenter', this.handleMouseEnter);
        element.removeEventListener('mouseleave', this.handleMouseLeave);
        element.removeEventListener('pointerdown', this.handleInteraction);
        element.removeEventListener('pointerup', this.handleInteraction);
        if (GlobalKeyboardDirective.activeDirective === this) {
            GlobalKeyboardDirective.activeDirective = null;
        }
    }
    handleMouseEnter = () => {
        this.isHovered = true;
        GlobalKeyboardDirective.activeDirective = this;
    };
    handleMouseLeave = () => {
        this.isHovered = false;
    };
    handleInteraction = () => {
        this.lastInteractionTime = Date.now();
        GlobalKeyboardDirective.activeDirective = this;
    };
    isActiveWhiteboard() {
        const recentlyInteracted = Date.now() - this.lastInteractionTime < this.INTERACTION_TIMEOUT;
        return this.isHovered || recentlyInteracted || GlobalKeyboardDirective.activeDirective === this;
    }
    onGlobalKeyDown(event) {
        if (!this.configService.getConfig().keyboardShortcutsEnabled) {
            return;
        }
        if (!this.isActiveWhiteboard()) {
            return;
        }
        this.svgService.onKeyDown(event);
    }
    onGlobalKeyUp(event) {
        if (!this.configService.getConfig().keyboardShortcutsEnabled) {
            return;
        }
        if (!this.isActiveWhiteboard()) {
            return;
        }
        this.svgService.onKeyUp(event);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: GlobalKeyboardDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: GlobalKeyboardDirective, isStandalone: true, selector: "[globalKeyboard]", host: { listeners: { "window:keydown": "onGlobalKeyDown($event)", "window:keyup": "onGlobalKeyUp($event)" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: GlobalKeyboardDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[globalKeyboard]',
                    standalone: true,
                }]
        }], propDecorators: { onGlobalKeyDown: [{
                type: HostListener,
                args: ['window:keydown', ['$event']]
            }], onGlobalKeyUp: [{
                type: HostListener,
                args: ['window:keyup', ['$event']]
            }] } });

// Context menu functionality

class SvgDirective {
    svgService;
    elementRef = inject(ElementRef);
    lastX;
    lastY;
    lastClickTime = 0;
    lastClickX = 0;
    lastClickY = 0;
    DOUBLE_CLICK_THRESHOLD = 300;
    DOUBLE_CLICK_DISTANCE = 10;
    constructor(svgService) {
        this.svgService = svgService;
    }
    onPointerDown(event) {
        if (event.button !== 2) {
            event.preventDefault();
        }
        if (event.currentTarget) {
            event.currentTarget.setPointerCapture(event.pointerId);
        }
        if (event.button === 2)
            return;
        const currentTime = Date.now();
        const currentX = event.clientX;
        const currentY = event.clientY;
        if (this.lastClickTime &&
            currentTime - this.lastClickTime < this.DOUBLE_CLICK_THRESHOLD &&
            Math.abs(currentX - this.lastClickX) < this.DOUBLE_CLICK_DISTANCE &&
            Math.abs(currentY - this.lastClickY) < this.DOUBLE_CLICK_DISTANCE) {
            const pointerInfo = this.createPointerInfo(event);
            pointerInfo.isDoubleClick = true;
            this.svgService.onPointerDown(pointerInfo);
            this.lastClickTime = 0;
            return;
        }
        this.lastClickTime = currentTime;
        this.lastClickX = currentX;
        this.lastClickY = currentY;
        const pointerInfo = this.createPointerInfo(event);
        this.svgService.onPointerDown(pointerInfo);
    }
    onPointerMove(event) {
        if (event.clientX === this.lastX && event.clientY === this.lastY)
            return;
        this.lastX = event.clientX;
        this.lastY = event.clientY;
        if (event.buttons & 2)
            return;
        const pointerInfo = this.createPointerInfo(event);
        this.svgService.onPointerMove(pointerInfo);
    }
    onPointerUp(event) {
        this.lastX = event.clientX;
        this.lastY = event.clientY;
        if (event.currentTarget && event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        if (event.button === 2)
            return;
        const pointerInfo = this.createPointerInfo(event);
        this.svgService.onPointerUp(pointerInfo);
    }
    onWheel(event) {
        event.preventDefault();
        this.svgService.onWheel(event);
    }
    onKeyDown(event) {
        event.preventDefault();
        this.svgService.onKeyDown(event);
    }
    onKeyUp(event) {
        this.svgService.onKeyUp(event);
    }
    onDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        this.svgService.onDragOver(event);
    }
    onDragEnter(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    onDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        this.svgService.onDrop(event);
    }
    onContextMenu(event) {
        event.preventDefault();
        const pointerInfo = this.createPointerInfo(event);
        const containerBounds = event.currentTarget.getBoundingClientRect();
        const relativePosition = this.getPointerPosition(event);
        const adjustedPointerInfo = {
            ...pointerInfo,
            clientX: containerBounds.left + relativePosition.x,
            clientY: containerBounds.top + relativePosition.y,
        };
        this.svgService.onContextMenu(adjustedPointerInfo, containerBounds);
    }
    createPointerInfo(event) {
        const { x, y } = this.getPointerPosition(event);
        return {
            x,
            y,
            clientX: event.clientX,
            clientY: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            movementX: event.movementX,
            movementY: event.movementY,
            pressure: event.pressure,
            tangentialPressure: event.tangentialPressure,
            tiltX: event.tiltX,
            tiltY: event.tiltY,
            twist: event.twist,
            width: event.width,
            height: event.height,
            pointerType: event.pointerType,
            pointerId: event.pointerId,
            isPrimary: event.isPrimary,
            button: event.button,
            buttons: event.buttons,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            metaKey: event.metaKey,
            eventType: event.type,
            timeStamp: event.timeStamp,
            target: event.target,
        };
    }
    getPointerPosition(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return { x, y };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SvgDirective, deps: [{ token: SvgService }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: SvgDirective, isStandalone: true, selector: "[svg]", host: { listeners: { "pointerdown": "onPointerDown($event)", "pointermove": "onPointerMove($event)", "pointerup": "onPointerUp($event)", "wheel": "onWheel($event)", "keydown": "onKeyDown($event)", "keyup": "onKeyUp($event)", "dragover": "onDragOver($event)", "dragenter": "onDragEnter($event)", "drop": "onDrop($event)", "contextmenu": "onContextMenu($event)" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SvgDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[svg]',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: SvgService }], propDecorators: { onPointerDown: [{
                type: HostListener,
                args: ['pointerdown', ['$event']]
            }], onPointerMove: [{
                type: HostListener,
                args: ['pointermove', ['$event']]
            }], onPointerUp: [{
                type: HostListener,
                args: ['pointerup', ['$event']]
            }], onWheel: [{
                type: HostListener,
                args: ['wheel', ['$event']]
            }], onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }], onKeyUp: [{
                type: HostListener,
                args: ['keyup', ['$event']]
            }], onDragOver: [{
                type: HostListener,
                args: ['dragover', ['$event']]
            }], onDragEnter: [{
                type: HostListener,
                args: ['dragenter', ['$event']]
            }], onDrop: [{
                type: HostListener,
                args: ['drop', ['$event']]
            }], onContextMenu: [{
                type: HostListener,
                args: ['contextmenu', ['$event']]
            }] } });

const CURSOR_NW_RESIZE = 'nw-resize';
const CURSOR_NE_RESIZE = 'ne-resize';
const CURSOR_NS_RESIZE = 'ns-resize';
const CURSOR_EW_RESIZE = 'ew-resize';
const CURSOR_GRAB = 'grab';
const CURSOR_DEFAULT = 'default';
const MIN_ANGLE_THRESHOLD = 45;
const MAX_ANGLE_THRESHOLD = 135;
const ROTATE_IDENTIFIER = 'rotate';
class GripCursorPipe {
    cornerGrips = ['nw', 'ne', 'se', 'sw'];
    sideGrips = ['n', 's', 'e', 'w'];
    transform(grip, rotation) {
        if (grip.includes(ROTATE_IDENTIFIER)) {
            return CURSOR_GRAB;
        }
        const isHorizontalOrientation = this.isHorizontalOrientation(rotation);
        if (this.cornerGrips.includes(grip)) {
            return this.getCornerCursor(grip, isHorizontalOrientation);
        }
        if (this.sideGrips.includes(grip)) {
            return this.getSideCursor(grip, isHorizontalOrientation);
        }
        return CURSOR_DEFAULT;
    }
    isHorizontalOrientation(rotation) {
        const normalizedRotation = rotation % 180;
        return normalizedRotation < MIN_ANGLE_THRESHOLD || normalizedRotation > MAX_ANGLE_THRESHOLD;
    }
    getCornerCursor(grip, isHorizontal) {
        const isNwOrSe = grip === 'nw' || grip === 'se';
        if (isNwOrSe) {
            return isHorizontal ? CURSOR_NW_RESIZE : CURSOR_NE_RESIZE;
        }
        return isHorizontal ? CURSOR_NE_RESIZE : CURSOR_NW_RESIZE;
    }
    getSideCursor(grip, isHorizontal) {
        const isNorthOrSouth = grip === 'n' || grip === 's';
        if (isNorthOrSouth) {
            return isHorizontal ? CURSOR_NS_RESIZE : CURSOR_EW_RESIZE;
        }
        return isHorizontal ? CURSOR_EW_RESIZE : CURSOR_NS_RESIZE;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: GripCursorPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: GripCursorPipe, isStandalone: true, name: "gripCursor" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: GripCursorPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'gripCursor',
                    standalone: true,
                }]
        }] });

class ElementOpacityPipe {
    /**
     * Calculate the effective opacity combining element, style, and layer opacity.
     */
    transform(element, layers) {
        if (element.isDeleting) {
            return 0.1;
        }
        let opacity = (element.opacity || 100) / 100;
        if (element.style?.opacity !== undefined) {
            opacity *= element.style.opacity;
        }
        if (element.layerId) {
            const layer = layers.find((l) => l.id === element.layerId);
            if (layer && layer.opacity !== undefined) {
                opacity *= layer.opacity;
            }
        }
        return opacity;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ElementOpacityPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: ElementOpacityPipe, isStandalone: true, name: "elementOpacity" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ElementOpacityPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'elementOpacity',
                    standalone: true,
                }]
        }] });

const MIN_START_PRESSURE = 0.025;
const MIN_END_PRESSURE = 0.01;
/**
 * Processes raw input points into optimized stroke points for rendering.
 * Applies streamlining, pressure simulation, and point filtering.
 */
function getStrokePoints(rawInputPoints, options = {}) {
    const { streamline = 0.5, size = 16, simulatePressure = false } = options;
    if (rawInputPoints.length === 0)
        return [];
    const t = 0.15 + (1 - streamline) * 0.85;
    let pts = [...rawInputPoints];
    let pointsRemovedFromNearEnd = 0;
    if (!simulatePressure) {
        let pt = pts[0];
        while (pt) {
            if (pt[2] >= MIN_START_PRESSURE)
                break;
            pts.shift();
            pt = pts[0];
        }
    }
    if (!simulatePressure) {
        let pt = pts[pts.length - 1];
        while (pt) {
            if (pt[2] >= MIN_END_PRESSURE)
                break;
            pts.pop();
            pt = pts[pts.length - 1];
        }
    }
    if (pts.length === 0) {
        const firstPoint = rawInputPoints[0];
        if (firstPoint &&
            typeof firstPoint[0] === 'number' &&
            typeof firstPoint[1] === 'number' &&
            !isNaN(firstPoint[0]) &&
            !isNaN(firstPoint[1])) {
            return [toPoint(firstPoint)];
        }
        return [];
    }
    let pt = pts[1];
    while (pt) {
        if (dist2(pt, pts[0]) > (size / 3) ** 2)
            break;
        pts[0][2] = Math.max(pts[0][2], pt[2]);
        pts.splice(1, 1);
        pt = pts[1];
    }
    const lastPoint = pts.pop();
    if (!lastPoint) {
        return [];
    }
    const last = lastPoint;
    pt = pts[pts.length - 1];
    while (pt) {
        if (dist2(pt, last) > (size / 3) ** 2)
            break;
        pts.pop();
        pt = pts[pts.length - 1];
        pointsRemovedFromNearEnd++;
    }
    pts.push(last);
    const isComplete = options.last ||
        !options.simulatePressure ||
        (pts.length > 1 && dist2(pts[pts.length - 1], pts[pts.length - 2]) < size ** 2) ||
        pointsRemovedFromNearEnd > 0;
    if (pts.length === 2 && options.simulatePressure) {
        const last = pts[1];
        pts = pts.slice(0, -1);
        for (let i = 1; i < 5; i++) {
            const next = lrp(pts[0], last, i / 4);
            next[2] = ((pts[0][2] + (last[2] - pts[0][2])) * i) / 4;
            pts.push(next);
        }
    }
    const strokePoints = [pts[0]];
    let totalLength = 0;
    let prevPoint = strokePoints[0];
    let point, distance;
    if (isComplete && streamline > 0) {
        pts.push(pts[pts.length - 1]);
    }
    for (let i = 1, n = pts.length; i < n; i++) {
        point = !t || (options.last && i === n - 1) ? pts[i] : lrp(pts[i], prevPoint, 1 - t);
        if (equals(prevPoint, point))
            continue;
        distance = dist(point, prevPoint);
        totalLength += distance;
        if (i < 4 && totalLength < size) {
            continue;
        }
        prevPoint = point;
        strokePoints.push(point);
    }
    return strokePoints;
}

/** Generates SVG path data from a set of stroke points. */
function getSvgPathFromStroke(points, closed = false) {
    const len = points.length;
    if (len === 0) {
        return '';
    }
    if (len === 1) {
        const point = points[0];
        if (!point || point.length < 2 || isNaN(point[0]) || isNaN(point[1])) {
            return '';
        }
        const r = 2;
        return `M ${point[0]} ${point[1]} m -${r}, 0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`;
    }
    let a = points[0];
    let b = points[1];
    if (len === 2) {
        // If only two points, just draw a line
        return `M${precise(a)}L${precise(b)}`;
    }
    let result = '';
    for (let i = 2, max = len - 1; i < max; i++) {
        a = points[i];
        b = points[i + 1];
        result += average(a, b);
    }
    if (closed) {
        // If closed, draw a curve from the last point to the first
        return `M${average(points[0], points[1])}Q${precise(points[1])}${average(points[1], points[2])}T${result}${average(points[len - 1], points[0])}${average(points[0], points[1])}Z`;
    }
    else {
        // If not closed, draw a curve starting at the first point and
        // ending at the midpoint of the last and second-last point, then
        // complete the curve with a line segment to the last point.
        return `M${precise(points[0])}Q${precise(points[1])}${average(points[1], points[2])}${points.length > 3 ? 'T' : ''}${result}L${precise(points[len - 1])}`;
    }
}
function precise(A) {
    return `${toDomPrecision(A[0])},${toDomPrecision(A[1])} `;
}
function average(A, B) {
    return `${toDomPrecision((A[0] + B[0]) / 2)},${toDomPrecision((A[1] + B[1]) / 2)} `;
}
function toDomPrecision(v) {
    return Math.round(v * 1e4) / 1e4;
}

class PointsToPathPipe {
    /**
     * Converts an array of points to an SVG path string.
     */
    transform(points, options) {
        if (!points || points.length === 0) {
            return '';
        }
        const stroke = getStrokePoints(points, options);
        return getSvgPathFromStroke(stroke);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PointsToPathPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: PointsToPathPipe, isStandalone: true, name: "pointsToPath" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PointsToPathPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'pointsToPath',
                    standalone: true,
                }]
        }] });

class WhiteboardCanvasComponent {
    svgContainer;
    apiService = inject(ApiService);
    configService = inject(ConfigService);
    toolsService = inject(ToolsService);
    selectionService = inject(SelectionService);
    canvasService = inject(CanvasService);
    svgService = inject(SvgService);
    config = this.configService.getConfigSignal();
    elements = this.apiService.allElements;
    layers = this.apiService.layers;
    selectedToolSignal = this.toolsService.selectedTool;
    selectionBoxSignal = this.selectionService.getSelectionBoxSignal();
    boundingBoxSignal = this.selectionService.getBoundingBoxSignal();
    transform = this.canvasService.getTransform();
    filteredElements = computed(() => {
        const layers = this.layers();
        const elements = this.elements();
        const sortElements = (arr) => arr.slice().sort((a, b) => {
            const layerA = a.layerId ? layers.find((l) => l.id === a.layerId) : undefined;
            const layerB = b.layerId ? layers.find((l) => l.id === b.layerId) : undefined;
            const zA = (layerA?.zIndex ?? 0) * 1000 + (a.zIndex ?? 0);
            const zB = (layerB?.zIndex ?? 0) * 1000 + (b.zIndex ?? 0);
            return zA - zB;
        });
        const visibleLayerIds = layers.filter((l) => l.visible).map((l) => l.id);
        if (visibleLayerIds.length === 0) {
            return [];
        }
        const filtered = elements.filter((el) => !el.layerId || visibleLayerIds.includes(el.layerId));
        const sorted = sortElements(filtered);
        // Add computed properties for rendering
        return sorted.map((el) => ({
            ...el,
            transform: this.buildTransform(el),
            isLocked: this.computeIsLocked(el, layers),
            blendMode: this.computeBlendMode(el, layers),
        }));
    });
    buildTransform(element) {
        const scaleX = element.scaleX ?? 1;
        const scaleY = element.scaleY ?? 1;
        return `translate(${element.x},${element.y}) rotate(${element.rotation}) scale(${scaleX},${scaleY})`;
    }
    computeIsLocked(element, layers) {
        if (!element.layerId)
            return false;
        const layer = layers.find((l) => l.id === element.layerId);
        return layer?.locked || false;
    }
    computeBlendMode(element, layers) {
        if (!element.layerId)
            return 'normal';
        const layer = layers.find((l) => l.id === element.layerId);
        return layer?.blendMode || 'normal';
    }
    canvasWidth = computed(() => this.config().canvasWidth);
    canvasHeight = computed(() => this.config().canvasHeight);
    zoom = computed(() => this.config().zoom);
    x = computed(() => this.config().x);
    y = computed(() => this.config().y);
    canvasX = computed(() => this.config().canvasX);
    canvasY = computed(() => this.config().canvasY);
    gridSize = computed(() => this.config().gridSize);
    backgroundColor = computed(() => this.config().backgroundColor);
    enableGrid = computed(() => this.config().enableGrid);
    fullScreen = computed(() => this.config().fullScreen);
    svgDimensions = computed(() => {
        const fullScreen = this.fullScreen();
        const canvasWidth = this.canvasWidth();
        const canvasHeight = this.canvasHeight();
        const zoom = this.zoom();
        return fullScreen
            ? { width: '100%', height: '100%' }
            : { width: `${canvasWidth * zoom}px`, height: `${canvasHeight * zoom}px` };
    });
    svgViewBox = computed(() => {
        if (this.fullScreen()) {
            const viewWidth = this.canvasWidth() / this.zoom();
            const viewHeight = this.canvasHeight() / this.zoom();
            return `0 0 ${viewWidth} ${viewHeight}`;
        }
        else {
            return `0 0 ${this.canvasWidth()} ${this.canvasHeight()}`;
        }
    });
    contentTransform = computed(() => {
        const x = this.x();
        const y = this.y();
        return `translate(${x}, ${y})`;
    });
    gridConfig = computed(() => {
        const x = this.x();
        const y = this.y();
        const zoom = this.zoom();
        const offsetX = x % 100;
        const offsetY = y % 100;
        return {
            transform: `translate(${offsetX}, ${offsetY})`,
            width: (this.canvasWidth() + 100) / zoom,
            height: (this.canvasHeight() + 100) / zoom,
        };
    });
    cursor = computed(() => this.toolsService.cursor());
    types = ElementType;
    tools = ToolType;
    ngAfterViewInit() {
        this.apiService.initializeWhiteboard(this.svgContainer.nativeElement);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: WhiteboardCanvasComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.3.12", type: WhiteboardCanvasComponent, isStandalone: true, selector: "ng-whiteboard-canvas", viewQueries: [{ propertyName: "svgContainer", first: true, predicate: ["svgContainer"], descendants: true }], ngImport: i0, template: "<svg\r\n  #svgContainer\r\n  id=\"svgroot\"\r\n  [class]=\"'svgroot ' + selectedToolSignal()\"\r\n  xmlns=\"http://www.w3.org/2000/svg\"\r\n  xmlns:xlink=\"http://www.w3.org/1999/xlink\"\r\n  tabindex=\"0\"\r\n  svg\r\n  resizeHandler\r\n  globalKeyboard\r\n  [style.cursor]=\"cursor()\"\r\n>\r\n  <svg\r\n    id=\"svgcontent\"\r\n    [attr.width]=\"svgDimensions().width\"\r\n    [attr.height]=\"svgDimensions().height\"\r\n    [attr.viewBox]=\"svgViewBox()\"\r\n    [attr.x]=\"canvasX()\"\r\n    [attr.y]=\"canvasY()\"\r\n  >\r\n    <defs>\r\n      <!-- Grid -->\r\n      <pattern id=\"smallGrid\" [attr.width]=\"gridSize()\" [attr.height]=\"gridSize()\" patternUnits=\"userSpaceOnUse\">\r\n        <path\r\n          [attr.d]=\"'M ' + gridSize() + ' 0 H 0 V ' + gridSize() + ''\"\r\n          fill=\"none\"\r\n          stroke=\"gray\"\r\n          stroke-width=\"0.5\"\r\n        />\r\n      </pattern>\r\n      <pattern id=\"grid\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\">\r\n        <rect width=\"100\" height=\"100\" fill=\"url(#smallGrid)\" />\r\n        <path d=\"M 100 0 H 0 V 100\" fill=\"none\" stroke=\"gray\" stroke-width=\"2\" />\r\n      </pattern>\r\n\r\n      <!-- Arrowhead -->\r\n      <marker\r\n        id=\"arrow\"\r\n        refX=\"3\"\r\n        refY=\"3\"\r\n        markerWidth=\"6\"\r\n        markerHeight=\"6\"\r\n        stroke=\"context-stroke\"\r\n        fill=\"none\"\r\n        orient=\"auto\"\r\n      >\r\n        <path d=\"M 0 0 L 3 3 L 0 6\"></path>\r\n      </marker>\r\n    </defs>\r\n\r\n    <rect width=\"100%\" height=\"100%\" [attr.fill]=\"backgroundColor()\"></rect>\r\n\r\n    @if (enableGrid()) {\r\n    <g [attr.transform]=\"gridConfig().transform\">\r\n      <rect\r\n        x=\"-100\"\r\n        y=\"-100\"\r\n        [attr.width]=\"gridConfig().width + 200\"\r\n        [attr.height]=\"gridConfig().height + 200\"\r\n        fill=\"url(#grid)\"\r\n      ></rect>\r\n    </g>\r\n    }\r\n\r\n    <g [attr.transform]=\"contentTransform()\" style=\"pointer-events: all\">\r\n      @for (item of filteredElements(); track item.id) {\r\n      <g\r\n        class=\"wb_element\"\r\n        [id]=\"'item_' + item.id\"\r\n        [attr.data-wb-id]=\"item.id\"\r\n        [attr.transform]=\"item.transform\"\r\n        [attr.opacity]=\"item | elementOpacity : layers()\"\r\n        [style.pointer-events]=\"item.isLocked ? 'none' : 'auto'\"\r\n        [style.mix-blend-mode]=\"item.blendMode\"\r\n        transform-origin=\"center\"\r\n      >\r\n        @switch (item.type) { @case (types.Pen) {\r\n        <g>\r\n          <path\r\n            fill=\"none\"\r\n            [attr.d]=\"item.points | pointsToPath : item.pathOptions\"\r\n            [attr.stroke-width]=\"item.style.strokeWidth\"\r\n            [attr.stroke-linecap]=\"item.style.lineCap\"\r\n            [attr.stroke-linejoin]=\"item.style.lineJoin\"\r\n            [attr.stroke]=\"item.style.strokeColor\"\r\n            [attr.stroke-dasharray]=\"item.style.dasharray\"\r\n            [attr.stroke-dashoffset]=\"item.style.dashoffset\"\r\n          ></path>\r\n        </g>\r\n        } @case (types.Image) {\r\n        <g>\r\n          <image\r\n            [attr.height]=\"item.height\"\r\n            [attr.width]=\"item.width\"\r\n            preserveAspectRatio=\"none\"\r\n            [attr.xlink:href]=\"item.src\"\r\n            [attr.href]=\"item.src\"\r\n            [attr.stroke-width]=\"item.style.strokeWidth\"\r\n            [attr.fill]=\"item.style.fill\"\r\n            [attr.stroke]=\"item.style.strokeColor\"\r\n            [attr.stroke-dasharray]=\"item.style.dasharray\"\r\n            [attr.stroke-dashoffset]=\"item.style.dashoffset\"\r\n          ></image>\r\n        </g>\r\n        } @case (types.Line) {\r\n\r\n        <g>\r\n          <line\r\n            [attr.x1]=\"item.x1\"\r\n            [attr.y1]=\"item.y1\"\r\n            [attr.x2]=\"item.x2\"\r\n            [attr.y2]=\"item.y2\"\r\n            [attr.stroke-dasharray]=\"item.style.dasharray\"\r\n            [attr.stroke-dashoffset]=\"item.style.dashoffset\"\r\n            [attr.stroke-width]=\"item.style.strokeWidth\"\r\n            [attr.stroke-linecap]=\"item.style.lineCap\"\r\n            [attr.stroke]=\"item.style.strokeColor\"\r\n          ></line>\r\n        </g>\r\n        } @case (types.Arrow) {\r\n        <g>\r\n          <line\r\n            [attr.x1]=\"item.x1\"\r\n            [attr.y1]=\"item.y1\"\r\n            [attr.x2]=\"item.x2\"\r\n            [attr.y2]=\"item.y2\"\r\n            [attr.stroke-dasharray]=\"item.style.dasharray\"\r\n            [attr.stroke-dashoffset]=\"item.style.dashoffset\"\r\n            [attr.stroke-width]=\"item.style.strokeWidth\"\r\n            [attr.stroke-linecap]=\"item.style.lineCap\"\r\n            [attr.stroke]=\"item.style.strokeColor\"\r\n            [attr.fill]=\"item.style.strokeColor\"\r\n            marker-end=\"url(#arrow)\"\r\n          ></line>\r\n        </g>\r\n        } @case (types.Rectangle) {\r\n        <g>\r\n          <rect\r\n            [attr.rx]=\"item.rx\"\r\n            [attr.width]=\"item.width\"\r\n            [attr.height]=\"item.height\"\r\n            [attr.stroke-dasharray]=\"item.style.dasharray\"\r\n            [attr.stroke-dashoffset]=\"item.style.dashoffset\"\r\n            [attr.stroke-width]=\"item.style.strokeWidth\"\r\n            [attr.fill]=\"item.style.fill\"\r\n            [attr.stroke]=\"item.style.strokeColor\"\r\n            [attr.stroke-linejoin]=\"item.style.lineJoin\"\r\n          ></rect>\r\n        </g>\r\n        } @case (types.Ellipse) {\r\n        <g>\r\n          <ellipse\r\n            [attr.cx]=\"item.cx\"\r\n            [attr.cy]=\"item.cy\"\r\n            [attr.rx]=\"item.rx\"\r\n            [attr.ry]=\"item.ry\"\r\n            [attr.stroke-dasharray]=\"item.style.dasharray\"\r\n            [attr.stroke-dashoffset]=\"item.style.dashoffset\"\r\n            [attr.stroke-width]=\"item.style.strokeWidth\"\r\n            [attr.stroke]=\"item.style.strokeColor\"\r\n            [attr.fill]=\"item.style.fill\"\r\n          ></ellipse>\r\n        </g>\r\n        } @case (types.Text) {\r\n        <g>\r\n          <text\r\n            text-anchor=\"start\"\r\n            [attr.font-size]=\"item.style.fontSize\"\r\n            [attr.font-family]=\"item.style.fontFamily\"\r\n            [attr.fill]=\"item.style.color\"\r\n            [attr.font-style]=\"item.style.fontStyle\"\r\n            [attr.font-weight]=\"item.style.fontWeight\"\r\n            alignment-baseline=\"before-edge\"\r\n            [attr.stroke-linecap]=\"item.style.lineCap\"\r\n            [attr.stroke-linejoin]=\"item.style.lineJoin\"\r\n            [attr.stroke-dasharray]=\"item.style.dasharray\"\r\n            [attr.stroke-dashoffset]=\"item.style.dashoffset\"\r\n            [attr.stroke]=\"item.style.strokeColor\"\r\n            [attr.stroke-width]=\"item.style.strokeWidth\"\r\n          >\r\n            @for (line of item.text.split('\\n'); track $index) {\r\n            <tspan [attr.x]=\"0\" [attr.dy]=\"$index === 0 ? 0 : (item.style.fontSize || 16) * 1.2\">{{ line }}</tspan>\r\n            }\r\n          </text>\r\n        </g>\r\n        } }\r\n      </g>\r\n      } @if (selectionBoxSignal(); as box) {\r\n      <rect\r\n        [attr.x]=\"box.x\"\r\n        [attr.y]=\"box.y\"\r\n        [attr.width]=\"box.width\"\r\n        [attr.height]=\"box.height\"\r\n        stroke=\"blue\"\r\n        stroke-dasharray=\"5,5\"\r\n        fill=\"transparent\"\r\n      />\r\n      } @if (boundingBoxSignal(); as box) {\r\n      <g\r\n        id=\"selectorParentGroup\"\r\n        [attr.transform]=\"\r\n          'rotate(' + box.rotation + ',' + (box.x + box.width / 2) + ',' + (box.y + box.height / 2) + ')'\r\n        \"\r\n      >\r\n        <rect\r\n          id=\"selectorBox\"\r\n          [attr.x]=\"box.x\"\r\n          [attr.y]=\"box.y\"\r\n          [attr.width]=\"box.width\"\r\n          [attr.height]=\"box.height\"\r\n          fill=\"transparent\"\r\n          stroke=\"dodgerblue\"\r\n          stroke-width=\"1\"\r\n          cursor=\"move\"\r\n          pointer-events=\"all\"\r\n        ></rect>\r\n\r\n        <!-- Side Resize Lines -->\r\n        <ng-container *ngFor=\"let side of ['n', 's', 'e', 'w']\">\r\n          <rect\r\n            [attr.id]=\"'selectorGrip_resize_' + side\"\r\n            [attr.x]=\"side === 'n' || side === 's' ? box.x : side === 'e' ? box.x + box.width - 5 : box.x - 5\"\r\n            [attr.y]=\"side === 'n' ? box.y - 5 : side === 's' ? box.y + box.height - 5 : box.y\"\r\n            [attr.width]=\"side === 'n' || side === 's' ? box.width : 10\"\r\n            [attr.height]=\"side === 'n' || side === 's' ? 10 : box.height\"\r\n            fill=\"transparent\"\r\n            stroke=\"transparent\"\r\n            [attr.cursor]=\"side | gripCursor : box.rotation\"\r\n            pointer-events=\"all\"\r\n          ></rect>\r\n        </ng-container>\r\n\r\n        <!-- Corner Resize Grips -->\r\n        <ng-container *ngFor=\"let grip of ['nw', 'ne', 'se', 'sw']\">\r\n          <rect\r\n            [attr.id]=\"'selectorGrip_resize_' + grip\"\r\n            [attr.x]=\"box.x + (grip === 'ne' || grip === 'se' ? box.width : 0) - 5\"\r\n            [attr.y]=\"box.y + (grip === 'se' || grip === 'sw' ? box.height : 0) - 5\"\r\n            width=\"10\"\r\n            height=\"10\"\r\n            fill=\"white\"\r\n            stroke=\"dodgerblue\"\r\n            stroke-width=\"1\"\r\n            [attr.cursor]=\"grip | gripCursor : box.rotation\"\r\n          ></rect>\r\n        </ng-container>\r\n\r\n        <circle\r\n          id=\"selectorGrip_rotate_n\"\r\n          [attr.cx]=\"box.handles.rotateHandle.x\"\r\n          [attr.cy]=\"box.handles.rotateHandle.y\"\r\n          r=\"6\"\r\n          fill=\"white\"\r\n          stroke=\"green\"\r\n          stroke-width=\"1\"\r\n          cursor=\"grab\"\r\n        ></circle>\r\n\r\n        <!-- Corner Rotate Grips -->\r\n        <ng-container *ngFor=\"let grip of ['nw', 'ne', 'se', 'sw']\">\r\n          <circle\r\n            [attr.id]=\"'selectorGrip_rotate_' + grip\"\r\n            [attr.cx]=\"box.x + (grip === 'ne' || grip === 'se' ? box.width : -20) + 10\"\r\n            [attr.cy]=\"box.y + (grip === 'se' || grip === 'sw' ? box.height : -20) + 10\"\r\n            r=\"6\"\r\n            fill=\"none\"\r\n            stroke=\"none\"\r\n            stroke-width=\"1\"\r\n            [attr.cursor]=\"'rotate_' + grip | gripCursor : box.rotation\"\r\n          ></circle>\r\n        </ng-container>\r\n      </g>\r\n      }\r\n    </g>\r\n  </svg>\r\n</svg>\r\n", styles: [":host{width:inherit;height:inherit;min-width:inherit;min-height:inherit;max-width:inherit;max-height:inherit}:host .svgroot{position:absolute;inset:0;-webkit-user-select:none;user-select:none;outline:none}:host .svgroot:focus{outline:none}:host .svgroot{width:inherit;height:inherit;min-width:inherit;min-height:inherit;max-width:inherit;max-height:inherit;background-size:cover;background-position:50%;background-repeat:no-repeat;touch-action:none}:host .svgroot .wb_element,:host .svgroot .selectorGroup{transform-box:fill-box;transform-origin:center}:host .svgroot .text{font-family:Arial,Helvetica,sans-serif}:host .svgroot .handlers{display:none}:host .svgroot .onMove{cursor:move}:host .svgroot .onMove .handlers{display:block}:host .select .wb_element{cursor:pointer}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "pipe", type: GripCursorPipe, name: "gripCursor" }, { kind: "pipe", type: ElementOpacityPipe, name: "elementOpacity" }, { kind: "pipe", type: PointsToPathPipe, name: "pointsToPath" }, { kind: "directive", type: SvgDirective, selector: "[svg]" }, { kind: "directive", type: ResizeHandlerDirective, selector: "[resizeHandler]" }, { kind: "directive", type: GlobalKeyboardDirective, selector: "[globalKeyboard]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: WhiteboardCanvasComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ng-whiteboard-canvas', standalone: true, imports: [
                        CommonModule,
                        GripCursorPipe,
                        ElementOpacityPipe,
                        PointsToPathPipe,
                        SvgDirective,
                        ResizeHandlerDirective,
                        GlobalKeyboardDirective,
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: "<svg\r\n  #svgContainer\r\n  id=\"svgroot\"\r\n  [class]=\"'svgroot ' + selectedToolSignal()\"\r\n  xmlns=\"http://www.w3.org/2000/svg\"\r\n  xmlns:xlink=\"http://www.w3.org/1999/xlink\"\r\n  tabindex=\"0\"\r\n  svg\r\n  resizeHandler\r\n  globalKeyboard\r\n  [style.cursor]=\"cursor()\"\r\n>\r\n  <svg\r\n    id=\"svgcontent\"\r\n    [attr.width]=\"svgDimensions().width\"\r\n    [attr.height]=\"svgDimensions().height\"\r\n    [attr.viewBox]=\"svgViewBox()\"\r\n    [attr.x]=\"canvasX()\"\r\n    [attr.y]=\"canvasY()\"\r\n  >\r\n    <defs>\r\n      <!-- Grid -->\r\n      <pattern id=\"smallGrid\" [attr.width]=\"gridSize()\" [attr.height]=\"gridSize()\" patternUnits=\"userSpaceOnUse\">\r\n        <path\r\n          [attr.d]=\"'M ' + gridSize() + ' 0 H 0 V ' + gridSize() + ''\"\r\n          fill=\"none\"\r\n          stroke=\"gray\"\r\n          stroke-width=\"0.5\"\r\n        />\r\n      </pattern>\r\n      <pattern id=\"grid\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\">\r\n        <rect width=\"100\" height=\"100\" fill=\"url(#smallGrid)\" />\r\n        <path d=\"M 100 0 H 0 V 100\" fill=\"none\" stroke=\"gray\" stroke-width=\"2\" />\r\n      </pattern>\r\n\r\n      <!-- Arrowhead -->\r\n      <marker\r\n        id=\"arrow\"\r\n        refX=\"3\"\r\n        refY=\"3\"\r\n        markerWidth=\"6\"\r\n        markerHeight=\"6\"\r\n        stroke=\"context-stroke\"\r\n        fill=\"none\"\r\n        orient=\"auto\"\r\n      >\r\n        <path d=\"M 0 0 L 3 3 L 0 6\"></path>\r\n      </marker>\r\n    </defs>\r\n\r\n    <rect width=\"100%\" height=\"100%\" [attr.fill]=\"backgroundColor()\"></rect>\r\n\r\n    @if (enableGrid()) {\r\n    <g [attr.transform]=\"gridConfig().transform\">\r\n      <rect\r\n        x=\"-100\"\r\n        y=\"-100\"\r\n        [attr.width]=\"gridConfig().width + 200\"\r\n        [attr.height]=\"gridConfig().height + 200\"\r\n        fill=\"url(#grid)\"\r\n      ></rect>\r\n    </g>\r\n    }\r\n\r\n    <g [attr.transform]=\"contentTransform()\" style=\"pointer-events: all\">\r\n      @for (item of filteredElements(); track item.id) {\r\n      <g\r\n        class=\"wb_element\"\r\n        [id]=\"'item_' + item.id\"\r\n        [attr.data-wb-id]=\"item.id\"\r\n        [attr.transform]=\"item.transform\"\r\n        [attr.opacity]=\"item | elementOpacity : layers()\"\r\n        [style.pointer-events]=\"item.isLocked ? 'none' : 'auto'\"\r\n        [style.mix-blend-mode]=\"item.blendMode\"\r\n        transform-origin=\"center\"\r\n      >\r\n        @switch (item.type) { @case (types.Pen) {\r\n        <g>\r\n          <path\r\n            fill=\"none\"\r\n            [attr.d]=\"item.points | pointsToPath : item.pathOptions\"\r\n            [attr.stroke-width]=\"item.style.strokeWidth\"\r\n            [attr.stroke-linecap]=\"item.style.lineCap\"\r\n            [attr.stroke-linejoin]=\"item.style.lineJoin\"\r\n            [attr.stroke]=\"item.style.strokeColor\"\r\n            [attr.stroke-dasharray]=\"item.style.dasharray\"\r\n            [attr.stroke-dashoffset]=\"item.style.dashoffset\"\r\n          ></path>\r\n        </g>\r\n        } @case (types.Image) {\r\n        <g>\r\n          <image\r\n            [attr.height]=\"item.height\"\r\n            [attr.width]=\"item.width\"\r\n            preserveAspectRatio=\"none\"\r\n            [attr.xlink:href]=\"item.src\"\r\n            [attr.href]=\"item.src\"\r\n            [attr.stroke-width]=\"item.style.strokeWidth\"\r\n            [attr.fill]=\"item.style.fill\"\r\n            [attr.stroke]=\"item.style.strokeColor\"\r\n            [attr.stroke-dasharray]=\"item.style.dasharray\"\r\n            [attr.stroke-dashoffset]=\"item.style.dashoffset\"\r\n          ></image>\r\n        </g>\r\n        } @case (types.Line) {\r\n\r\n        <g>\r\n          <line\r\n            [attr.x1]=\"item.x1\"\r\n            [attr.y1]=\"item.y1\"\r\n            [attr.x2]=\"item.x2\"\r\n            [attr.y2]=\"item.y2\"\r\n            [attr.stroke-dasharray]=\"item.style.dasharray\"\r\n            [attr.stroke-dashoffset]=\"item.style.dashoffset\"\r\n            [attr.stroke-width]=\"item.style.strokeWidth\"\r\n            [attr.stroke-linecap]=\"item.style.lineCap\"\r\n            [attr.stroke]=\"item.style.strokeColor\"\r\n          ></line>\r\n        </g>\r\n        } @case (types.Arrow) {\r\n        <g>\r\n          <line\r\n            [attr.x1]=\"item.x1\"\r\n            [attr.y1]=\"item.y1\"\r\n            [attr.x2]=\"item.x2\"\r\n            [attr.y2]=\"item.y2\"\r\n            [attr.stroke-dasharray]=\"item.style.dasharray\"\r\n            [attr.stroke-dashoffset]=\"item.style.dashoffset\"\r\n            [attr.stroke-width]=\"item.style.strokeWidth\"\r\n            [attr.stroke-linecap]=\"item.style.lineCap\"\r\n            [attr.stroke]=\"item.style.strokeColor\"\r\n            [attr.fill]=\"item.style.strokeColor\"\r\n            marker-end=\"url(#arrow)\"\r\n          ></line>\r\n        </g>\r\n        } @case (types.Rectangle) {\r\n        <g>\r\n          <rect\r\n            [attr.rx]=\"item.rx\"\r\n            [attr.width]=\"item.width\"\r\n            [attr.height]=\"item.height\"\r\n            [attr.stroke-dasharray]=\"item.style.dasharray\"\r\n            [attr.stroke-dashoffset]=\"item.style.dashoffset\"\r\n            [attr.stroke-width]=\"item.style.strokeWidth\"\r\n            [attr.fill]=\"item.style.fill\"\r\n            [attr.stroke]=\"item.style.strokeColor\"\r\n            [attr.stroke-linejoin]=\"item.style.lineJoin\"\r\n          ></rect>\r\n        </g>\r\n        } @case (types.Ellipse) {\r\n        <g>\r\n          <ellipse\r\n            [attr.cx]=\"item.cx\"\r\n            [attr.cy]=\"item.cy\"\r\n            [attr.rx]=\"item.rx\"\r\n            [attr.ry]=\"item.ry\"\r\n            [attr.stroke-dasharray]=\"item.style.dasharray\"\r\n            [attr.stroke-dashoffset]=\"item.style.dashoffset\"\r\n            [attr.stroke-width]=\"item.style.strokeWidth\"\r\n            [attr.stroke]=\"item.style.strokeColor\"\r\n            [attr.fill]=\"item.style.fill\"\r\n          ></ellipse>\r\n        </g>\r\n        } @case (types.Text) {\r\n        <g>\r\n          <text\r\n            text-anchor=\"start\"\r\n            [attr.font-size]=\"item.style.fontSize\"\r\n            [attr.font-family]=\"item.style.fontFamily\"\r\n            [attr.fill]=\"item.style.color\"\r\n            [attr.font-style]=\"item.style.fontStyle\"\r\n            [attr.font-weight]=\"item.style.fontWeight\"\r\n            alignment-baseline=\"before-edge\"\r\n            [attr.stroke-linecap]=\"item.style.lineCap\"\r\n            [attr.stroke-linejoin]=\"item.style.lineJoin\"\r\n            [attr.stroke-dasharray]=\"item.style.dasharray\"\r\n            [attr.stroke-dashoffset]=\"item.style.dashoffset\"\r\n            [attr.stroke]=\"item.style.strokeColor\"\r\n            [attr.stroke-width]=\"item.style.strokeWidth\"\r\n          >\r\n            @for (line of item.text.split('\\n'); track $index) {\r\n            <tspan [attr.x]=\"0\" [attr.dy]=\"$index === 0 ? 0 : (item.style.fontSize || 16) * 1.2\">{{ line }}</tspan>\r\n            }\r\n          </text>\r\n        </g>\r\n        } }\r\n      </g>\r\n      } @if (selectionBoxSignal(); as box) {\r\n      <rect\r\n        [attr.x]=\"box.x\"\r\n        [attr.y]=\"box.y\"\r\n        [attr.width]=\"box.width\"\r\n        [attr.height]=\"box.height\"\r\n        stroke=\"blue\"\r\n        stroke-dasharray=\"5,5\"\r\n        fill=\"transparent\"\r\n      />\r\n      } @if (boundingBoxSignal(); as box) {\r\n      <g\r\n        id=\"selectorParentGroup\"\r\n        [attr.transform]=\"\r\n          'rotate(' + box.rotation + ',' + (box.x + box.width / 2) + ',' + (box.y + box.height / 2) + ')'\r\n        \"\r\n      >\r\n        <rect\r\n          id=\"selectorBox\"\r\n          [attr.x]=\"box.x\"\r\n          [attr.y]=\"box.y\"\r\n          [attr.width]=\"box.width\"\r\n          [attr.height]=\"box.height\"\r\n          fill=\"transparent\"\r\n          stroke=\"dodgerblue\"\r\n          stroke-width=\"1\"\r\n          cursor=\"move\"\r\n          pointer-events=\"all\"\r\n        ></rect>\r\n\r\n        <!-- Side Resize Lines -->\r\n        <ng-container *ngFor=\"let side of ['n', 's', 'e', 'w']\">\r\n          <rect\r\n            [attr.id]=\"'selectorGrip_resize_' + side\"\r\n            [attr.x]=\"side === 'n' || side === 's' ? box.x : side === 'e' ? box.x + box.width - 5 : box.x - 5\"\r\n            [attr.y]=\"side === 'n' ? box.y - 5 : side === 's' ? box.y + box.height - 5 : box.y\"\r\n            [attr.width]=\"side === 'n' || side === 's' ? box.width : 10\"\r\n            [attr.height]=\"side === 'n' || side === 's' ? 10 : box.height\"\r\n            fill=\"transparent\"\r\n            stroke=\"transparent\"\r\n            [attr.cursor]=\"side | gripCursor : box.rotation\"\r\n            pointer-events=\"all\"\r\n          ></rect>\r\n        </ng-container>\r\n\r\n        <!-- Corner Resize Grips -->\r\n        <ng-container *ngFor=\"let grip of ['nw', 'ne', 'se', 'sw']\">\r\n          <rect\r\n            [attr.id]=\"'selectorGrip_resize_' + grip\"\r\n            [attr.x]=\"box.x + (grip === 'ne' || grip === 'se' ? box.width : 0) - 5\"\r\n            [attr.y]=\"box.y + (grip === 'se' || grip === 'sw' ? box.height : 0) - 5\"\r\n            width=\"10\"\r\n            height=\"10\"\r\n            fill=\"white\"\r\n            stroke=\"dodgerblue\"\r\n            stroke-width=\"1\"\r\n            [attr.cursor]=\"grip | gripCursor : box.rotation\"\r\n          ></rect>\r\n        </ng-container>\r\n\r\n        <circle\r\n          id=\"selectorGrip_rotate_n\"\r\n          [attr.cx]=\"box.handles.rotateHandle.x\"\r\n          [attr.cy]=\"box.handles.rotateHandle.y\"\r\n          r=\"6\"\r\n          fill=\"white\"\r\n          stroke=\"green\"\r\n          stroke-width=\"1\"\r\n          cursor=\"grab\"\r\n        ></circle>\r\n\r\n        <!-- Corner Rotate Grips -->\r\n        <ng-container *ngFor=\"let grip of ['nw', 'ne', 'se', 'sw']\">\r\n          <circle\r\n            [attr.id]=\"'selectorGrip_rotate_' + grip\"\r\n            [attr.cx]=\"box.x + (grip === 'ne' || grip === 'se' ? box.width : -20) + 10\"\r\n            [attr.cy]=\"box.y + (grip === 'se' || grip === 'sw' ? box.height : -20) + 10\"\r\n            r=\"6\"\r\n            fill=\"none\"\r\n            stroke=\"none\"\r\n            stroke-width=\"1\"\r\n            [attr.cursor]=\"'rotate_' + grip | gripCursor : box.rotation\"\r\n          ></circle>\r\n        </ng-container>\r\n      </g>\r\n      }\r\n    </g>\r\n  </svg>\r\n</svg>\r\n", styles: [":host{width:inherit;height:inherit;min-width:inherit;min-height:inherit;max-width:inherit;max-height:inherit}:host .svgroot{position:absolute;inset:0;-webkit-user-select:none;user-select:none;outline:none}:host .svgroot:focus{outline:none}:host .svgroot{width:inherit;height:inherit;min-width:inherit;min-height:inherit;max-width:inherit;max-height:inherit;background-size:cover;background-position:50%;background-repeat:no-repeat;touch-action:none}:host .svgroot .wb_element,:host .svgroot .selectorGroup{transform-box:fill-box;transform-origin:center}:host .svgroot .text{font-family:Arial,Helvetica,sans-serif}:host .svgroot .handlers{display:none}:host .svgroot .onMove{cursor:move}:host .svgroot .onMove .handlers{display:block}:host .select .wb_element{cursor:pointer}\n"] }]
        }], propDecorators: { svgContainer: [{
                type: ViewChild,
                args: ['svgContainer', { static: false }]
            }] } });

/**
 * Main whiteboard component providing a canvas with drawing tools and configuration options.
 *
 * Handles whiteboard initialization, event management, and configuration updates.
 */
class NgWhiteboardComponent {
    configService = inject(ConfigService);
    apiService = inject(ApiService);
    toolsService = inject(ToolsService);
    eventBusService = inject(EventBusService);
    cd = inject(ChangeDetectorRef);
    instanceService = inject(InstanceService);
    /**
     * Unique identifier for this whiteboard instance.
     * Auto-generated if not provided.
     */
    boardId = crypto.randomUUID();
    /**
     * Whiteboard configuration options.
     */
    set config(value) {
        this.configService.updateConfig(value, false);
    }
    get config() {
        return this.configService.getConfig();
    }
    /**
     * Whiteboard data elements.
     */
    set data(data) {
        if (data && data !== this.apiService.getElements()) {
            this.apiService.setElements(data);
        }
    }
    /**
     * Active drawing tool.
     */
    set selectedTool(tool) {
        if (tool && this.toolsService.getActiveToolType() !== tool) {
            this.toolsService.setActiveTool(tool);
        }
    }
    /**
     * Emitted when the whiteboard component is ready.
     */
    ready = new EventEmitter();
    /**
     * Emitted when the whiteboard is destroyed.
     */
    destroyed = new EventEmitter();
    /**
     * Emitted when the user starts drawing.
     */
    drawStart = new EventEmitter();
    /**
     * Emitted while the user is drawing.
     */
    drawing = new EventEmitter();
    /**
     * Emitted when the user stops drawing.
     */
    drawEnd = new EventEmitter();
    /**
     * Emitted when elements are added.
     */
    elementsAdded = new EventEmitter();
    /**
     * Emitted when elements are updated.
     */
    elementsUpdated = new EventEmitter();
    /**
     * Emitted when elements are selected or deselected.
     */
    elementsSelected = new EventEmitter();
    /**
     * Emitted when elements are removed.
     */
    elementsRemoved = new EventEmitter();
    /**
     * Emitted when an element is double-clicked.
     */
    elementDoubleClicked = new EventEmitter();
    /**
     * Emitted when an undo action is triggered.
     */
    undo = new EventEmitter();
    /**
     * Emitted when a redo action is triggered.
     */
    redo = new EventEmitter();
    /**
     * Emitted when the whiteboard is cleared.
     */
    clear = new EventEmitter();
    /**
     * Emitted when the whiteboard data changes.
     */
    dataChange = new EventEmitter();
    /**
     * Emitted when the whiteboard content is saved.
     */
    save = new EventEmitter();
    /**
     * Emitted when an image is added.
     */
    imageAdded = new EventEmitter();
    /**
     * Emitted when the selected drawing tool changes.
     */
    selectedToolChange = new EventEmitter();
    /**
     * Emitted when the configuration changes.
     */
    configChange = new EventEmitter();
    /**
     * Emitted when zoom-related configuration changes.
     */
    zoomChange = new EventEmitter();
    eventsMap = {
        [WhiteboardEvent.Ready]: this.ready,
        [WhiteboardEvent.Destroyed]: this.destroyed,
        [WhiteboardEvent.DrawStart]: this.drawStart,
        [WhiteboardEvent.Drawing]: this.drawing,
        [WhiteboardEvent.DrawEnd]: this.drawEnd,
        [WhiteboardEvent.ElementsAdded]: this.elementsAdded,
        [WhiteboardEvent.ElementsUpdated]: this.elementsUpdated,
        [WhiteboardEvent.ElementsSelected]: this.elementsSelected,
        [WhiteboardEvent.ElementsRemoved]: this.elementsRemoved,
        [WhiteboardEvent.ElementDoubleClicked]: this.elementDoubleClicked,
        [WhiteboardEvent.Undo]: this.undo,
        [WhiteboardEvent.Redo]: this.redo,
        [WhiteboardEvent.Clear]: this.clear,
        [WhiteboardEvent.DataChange]: this.dataChange,
        [WhiteboardEvent.Save]: this.save,
        [WhiteboardEvent.ImageAdded]: this.imageAdded,
        [WhiteboardEvent.ToolChange]: this.selectedToolChange,
        [WhiteboardEvent.ConfigChange]: this.configChange,
        [WhiteboardEvent.ZoomChange]: this.zoomChange,
    };
    /*
      private readonly forwardEventsEffect = effect(() => {
        const whiteboardEvent = this.eventBusService.getAllEventsSignal();
        const last = whiteboardEvent();
        if (!last) return;
        const emitter = this.eventsMap[last.type] as EventEmitter<unknown> | undefined;
        if (!emitter) return;
        if (last.payload !== undefined) {
          emitter.emit(last.payload as unknown);
        } else {
          emitter.emit();
        }
        this.cd.markForCheck();
      });
    */
    eventsSubscription = null;
    ngOnInit() {
        this.instanceService.register(this.boardId, this.apiService);
        this.eventsSubscription = this.eventBusService.listen().subscribe((event) => {
            const emitter = this.eventsMap[event.type];
            if (emitter) {
                if (event.payload != null) {
                    emitter.emit(event.payload);
                }
                else if (event.payload === undefined) {
                    emitter.emit();
                }
                // 确保变更检测能捕获到 output 的变化
                this.cd.markForCheck();
            }
        });
    }
    ngOnDestroy() {
        this.instanceService.unregister(this.boardId);
        this.eventBusService.emit(WhiteboardEvent.Destroyed);
        if (this.eventsSubscription) {
            this.eventsSubscription.unsubscribe();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NgWhiteboardComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NgWhiteboardComponent, isStandalone: true, selector: "ng-whiteboard", inputs: { boardId: "boardId", config: "config", data: "data", selectedTool: "selectedTool" }, outputs: { ready: "ready", destroyed: "destroyed", drawStart: "drawStart", drawing: "drawing", drawEnd: "drawEnd", elementsAdded: "elementsAdded", elementsUpdated: "elementsUpdated", elementsSelected: "elementsSelected", elementsRemoved: "elementsRemoved", elementDoubleClicked: "elementDoubleClicked", undo: "undo", redo: "redo", clear: "clear", dataChange: "dataChange", save: "save", imageAdded: "imageAdded", selectedToolChange: "selectedToolChange", configChange: "configChange", zoomChange: "zoomChange" }, providers: [
            SvgService,
            ApiService,
            ElementsService,
            CanvasService,
            IOService,
            ZoomService,
            PanService,
            SelectionService,
            ClipboardService,
            ToolsService,
            ToolFactory,
            EventBusService,
            ConfigService,
            KeyboardShortcutService,
            LayerManagementService,
            HistoryService,
            ContextMenuService,
            DragDropService,
            WheelHandlerService,
        ], ngImport: i0, template: `
    <div style="width: 100%; height: 100%; position: relative;">
      <ng-whiteboard-canvas></ng-whiteboard-canvas>
      <wb-context-menu></wb-context-menu>
    </div>
  `, isInline: true, styles: [":host{display:block;width:inherit;height:inherit;min-width:inherit;min-height:inherit;max-width:inherit;max-height:inherit}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "component", type: WhiteboardCanvasComponent, selector: "ng-whiteboard-canvas" }, { kind: "component", type: ContextMenuComponent, selector: "wb-context-menu" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NgWhiteboardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ng-whiteboard', standalone: true, imports: [CommonModule, WhiteboardCanvasComponent, ContextMenuComponent], template: `
    <div style="width: 100%; height: 100%; position: relative;">
      <ng-whiteboard-canvas></ng-whiteboard-canvas>
      <wb-context-menu></wb-context-menu>
    </div>
  `, providers: [
                        SvgService,
                        ApiService,
                        ElementsService,
                        CanvasService,
                        IOService,
                        ZoomService,
                        PanService,
                        SelectionService,
                        ClipboardService,
                        ToolsService,
                        ToolFactory,
                        EventBusService,
                        ConfigService,
                        KeyboardShortcutService,
                        LayerManagementService,
                        HistoryService,
                        ContextMenuService,
                        DragDropService,
                        WheelHandlerService,
                    ], changeDetection: ChangeDetectionStrategy.OnPush, styles: [":host{display:block;width:inherit;height:inherit;min-width:inherit;min-height:inherit;max-width:inherit;max-height:inherit}\n"] }]
        }], propDecorators: { boardId: [{
                type: Input
            }], config: [{
                type: Input
            }], data: [{
                type: Input
            }], selectedTool: [{
                type: Input
            }], ready: [{
                type: Output
            }], destroyed: [{
                type: Output
            }], drawStart: [{
                type: Output
            }], drawing: [{
                type: Output
            }], drawEnd: [{
                type: Output
            }], elementsAdded: [{
                type: Output
            }], elementsUpdated: [{
                type: Output
            }], elementsSelected: [{
                type: Output
            }], elementsRemoved: [{
                type: Output
            }], elementDoubleClicked: [{
                type: Output
            }], undo: [{
                type: Output
            }], redo: [{
                type: Output
            }], clear: [{
                type: Output
            }], dataChange: [{
                type: Output
            }], save: [{
                type: Output
            }], imageAdded: [{
                type: Output
            }], selectedToolChange: [{
                type: Output
            }], configChange: [{
                type: Output
            }], zoomChange: [{
                type: Output
            }] } });

/*
 * Public API Surface of ng-whiteboard
 */
// Main component and service

/**
 * Generated bundle index. Do not edit.
 */

export { ActionType, AlignmentType, ApiService, BLEND_MODES, ConfigService, CursorType, DEFAULT_PEN_PRESET, Direction, ElementType, FormatType, LineCap, LineJoin, NgWhiteboardComponent, NgWhiteboardService, PEN_PRESETS, PEN_PRESETS_BY_TYPE_THICKNESS, PEN_PRESETS_MAP, PenThickness, PenType, THICKNESS_SIZES, THICKNESS_STROKE_WIDTHS, TOOL_ICONS, ToolType, WhiteboardEvent, defaultElementStyle, defaultTextElementStyle, getPenPresetByTypeAndThickness, getPresetForType };
//# sourceMappingURL=ng-whiteboard.mjs.map
