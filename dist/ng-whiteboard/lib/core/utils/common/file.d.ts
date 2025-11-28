/**
 * Initiates the download of a file from a given URL.
 */
export declare function downloadFile(url: string, name?: string): void;
/**
 * Creates a debounced function that delays invoking the provided function until after a specified wait time.
 */
export declare function debounce<T extends (...args: unknown[]) => unknown>(func: T, delay: number): (...args: Parameters<T>) => void;
