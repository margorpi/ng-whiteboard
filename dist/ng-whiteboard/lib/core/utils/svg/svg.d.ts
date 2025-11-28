import { FormatType } from '../../types';
/**
 * Converts an SVG node to a string representation.
 */
export declare function toSvgString(svgNode: SVGSVGElement): string;
/**
 * Converts an SVG string to a Base64 encoded image.
 */
export declare function svgToBase64(svgString: string, width: number, height: number, format?: FormatType): Promise<string>;
