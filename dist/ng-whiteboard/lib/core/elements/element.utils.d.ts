import { ElementByType, ElementType, ElementUtil, WhiteboardElement } from '../types';
export declare function getElementUtil(type: ElementType): ElementUtil<WhiteboardElement>;
export declare function setActiveLayerProvider(provider: () => string): void;
export declare function createElement<T extends ElementType>(type: T, props: Partial<ElementByType<T>>, layerId?: string): ElementByType<T>;
