/**
 * Vector math utilities for stroke generation.
 */
/** Add vectors. */
export declare function add(A: number[], B: number[]): number[];
/** Subtract vectors. */
export declare function sub(A: number[], B: number[]): number[];
/** Vector multiplication by scalar. */
export declare function mul(A: number[], n: number): number[];
/** Vector division by scalar. */
export declare function div(A: number[], n: number): number[];
/** Length from A to B squared. */
export declare function dist2(A: number[], B: number[]): number;
/** Distance from A to B. */
export declare function dist(A: number[], B: number[]): number;
/** Interpolate vector A to B with a scalar t. */
export declare function lrp(A: number[], B: number[], t: number): number[];
export declare function toPoint(arr: number[]): number[];
export declare function equals(a: number[], b: number[]): boolean;
