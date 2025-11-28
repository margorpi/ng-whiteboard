import { DATA_ID, ITEM_PREFIX, SELECTOR_BOX, SELECTOR_GRIP_RESIZE, SELECTOR_GRIP_ROTATE } from '../constants';
import { getElementUtil } from '../elements/element.utils';
import { Direction, ToolType } from '../types';
import { getMouseTarget } from '../utils/dom';
import { calculateAngle, getRotatedDirection, getSnappedOffset, isElementInSelectionBox, normalizeAngle, rotatePointAroundCenter, } from '../utils/geometry';
import { getElementBounds } from '../utils/dom/element';
import { BaseTool } from './base-tool';
import { CursorType } from '../types/cursors';
export var SelectAction;
(function (SelectAction) {
    SelectAction[SelectAction["None"] = 0] = "None";
    SelectAction[SelectAction["Select"] = 1] = "Select";
    SelectAction[SelectAction["Move"] = 2] = "Move";
    SelectAction[SelectAction["Resize"] = 3] = "Resize";
    SelectAction[SelectAction["Rotate"] = 4] = "Rotate";
    SelectAction[SelectAction["BoxSelect"] = 5] = "BoxSelect";
})(SelectAction || (SelectAction = {}));
export class SelectTool extends BaseTool {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXRvb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy13aGl0ZWJvYXJkL3NyYy9saWIvY29yZS90b29scy9zZWxlY3QtdG9vbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsb0JBQW9CLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDOUcsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzNELE9BQU8sRUFBRSxTQUFTLEVBQXNCLFFBQVEsRUFBcUIsTUFBTSxVQUFVLENBQUM7QUFDdEYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM5QyxPQUFPLEVBQ0wsY0FBYyxFQUNkLG1CQUFtQixFQUNuQixnQkFBZ0IsRUFDaEIsdUJBQXVCLEVBQ3ZCLGNBQWMsRUFDZCx1QkFBdUIsR0FDeEIsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUV4RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU5QyxNQUFNLENBQU4sSUFBWSxZQU9YO0FBUEQsV0FBWSxZQUFZO0lBQ3RCLCtDQUFJLENBQUE7SUFDSixtREFBTSxDQUFBO0lBQ04sK0NBQUksQ0FBQTtJQUNKLG1EQUFNLENBQUE7SUFDTixtREFBTSxDQUFBO0lBQ04seURBQVMsQ0FBQTtBQUNYLENBQUMsRUFQVyxZQUFZLEtBQVosWUFBWSxRQU92QjtBQUVELE1BQU0sT0FBTyxVQUFXLFNBQVEsUUFBUTtJQUN0QyxJQUFJLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztJQUNkLFVBQVUsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDO0lBQ2pD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c291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgREFUQV9JRCwgSVRFTV9QUkVGSVgsIFNFTEVDVE9SX0JPWCwgU0VMRUNUT1JfR1JJUF9SRVNJWkUsIFNFTEVDVE9SX0dSSVBfUk9UQVRFIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcclxuaW1wb3J0IHsgZ2V0RWxlbWVudFV0aWwgfSBmcm9tICcuLi9lbGVtZW50cy9lbGVtZW50LnV0aWxzJztcclxuaW1wb3J0IHsgRGlyZWN0aW9uLCBQb2ludCwgUG9pbnRlckluZm8sIFRvb2xUeXBlLCBXaGl0ZWJvYXJkRWxlbWVudCB9IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHsgZ2V0TW91c2VUYXJnZXQgfSBmcm9tICcuLi91dGlscy9kb20nO1xyXG5pbXBvcnQge1xyXG4gIGNhbGN1bGF0ZUFuZ2xlLFxyXG4gIGdldFJvdGF0ZWREaXJlY3Rpb24sXHJcbiAgZ2V0U25hcHBlZE9mZnNldCxcclxuICBpc0VsZW1lbnRJblNlbGVjdGlvbkJveCxcclxuICBub3JtYWxpemVBbmdsZSxcclxuICByb3RhdGVQb2ludEFyb3VuZENlbnRlcixcclxufSBmcm9tICcuLi91dGlscy9nZW9tZXRyeSc7XHJcbmltcG9ydCB7IGdldEVsZW1lbnRCb3VuZHMgfSBmcm9tICcuLi91dGlscy9kb20vZWxlbWVudCc7XHJcblxyXG5pbXBvcnQgeyBCYXNlVG9vbCB9IGZyb20gJy4vYmFzZS10b29sJztcclxuaW1wb3J0IHsgQ3Vyc29yVHlwZSB9IGZyb20gJy4uL3R5cGVzL2N1cnNvcnMnO1xyXG5cclxuZXhwb3J0IGVudW0gU2VsZWN0QWN0aW9uIHtcclxuICBOb25lLFxyXG4gIFNlbGVjdCxcclxuICBNb3ZlLFxyXG4gIFJlc2l6ZSxcclxuICBSb3RhdGUsXHJcbiAgQm94U2VsZWN0LFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2VsZWN0VG9vbCBleHRlbmRzIEJhc2VUb29sIHtcclxuICB0eXBlID0gVG9vbFR5cGUuU2VsZWN0O1xyXG4gIG92ZXJyaWRlIGJhc2VDdXJzb3IgPSBDdXJzb3JUeXBlLkRlZmF1bHQ7XHJcbiAgcHJpdmF0ZSBjdXJyZW50QWN0aW9uID0gU2VsZWN0QWN0aW9uLk5vbmU7XHJcbiAgcHJpdmF0ZSBzdGFydFBvaW50OiBQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gIHByaXZhdGUgY3VycmVudEhhbmRsZTogRGlyZWN0aW9uIHwgbnVsbCA9IG51bGw7XHJcbiAgcHJpdmF0ZSByb3RhdGVTdGFydEFuZ2xlOiBudW1iZXIgfCBudWxsID0gbnVsbDtcclxuICBwcml2YXRlIHNlbGVjdGlvbkNlbnRlcjogUG9pbnQgfCBudWxsID0gbnVsbDtcclxuICBwcml2YXRlIGluaXRpYWxCb3VuZGluZ0JveDogeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfSB8IG51bGwgPSBudWxsO1xyXG4gIHByaXZhdGUgaW5pdGlhbEVsZW1lbnRSb3RhdGlvbnM6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKCk7XHJcbiAgcHJpdmF0ZSBpbml0aWFsRWxlbWVudFN0YXRlczogTWFwPHN0cmluZywgV2hpdGVib2FyZEVsZW1lbnQ+ID0gbmV3IE1hcCgpO1xyXG4gIHByaXZhdGUgcmFmSWQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xyXG4gIHByaXZhdGUgcGVuZGluZ1BvaW50ZXJFdmVudDogUG9pbnRlckluZm8gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgZ2V0Q3VycmVudEFjdGlvbigpOiBTZWxlY3RBY3Rpb24ge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudEFjdGlvbjtcclxuICB9XHJcblxyXG4gIGdldFN0YXJ0UG9pbnQoKTogUG9pbnQgfCBudWxsIHtcclxuICAgIHJldHVybiB0aGlzLnN0YXJ0UG9pbnQ7XHJcbiAgfVxyXG5cclxuICBnZXRDdXJyZW50SGFuZGxlKCk6IERpcmVjdGlvbiB8IG51bGwge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudEhhbmRsZTtcclxuICB9XHJcblxyXG4gIG92ZXJyaWRlIG9uRGVhY3RpdmF0ZSgpOiB2b2lkIHtcclxuICAgIHRoaXMuYXBpU2VydmljZS5jbGVhclNlbGVjdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgb3ZlcnJpZGUgaGFuZGxlUG9pbnRlckRvd24oZXZlbnQ6IFBvaW50ZXJJbmZvKTogdm9pZCB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSBnZXRNb3VzZVRhcmdldChldmVudCk7XHJcblxyXG4gICAgY29uc3QgdGFyZ2V0SWQgPSB0YXJnZXQ/LmlkID8/ICcnO1xyXG5cclxuICAgIHRoaXMuc3RhcnRQb2ludCA9IHRoaXMuZ2V0UG9pbnRlclBvc2l0aW9uKGV2ZW50KTtcclxuXHJcbiAgICBpZiAodGFyZ2V0SWQuaW5jbHVkZXMoSVRFTV9QUkVGSVgpKSB7XHJcbiAgICAgIGNvbnN0IGVsZW1lbnRJZCA9IHRhcmdldD8uZ2V0QXR0cmlidXRlKERBVEFfSUQpID8/IG51bGw7XHJcbiAgICAgIHRoaXMuaGFuZGxlRWxlbWVudFNlbGVjdChlbGVtZW50SWQsIGV2ZW50LnNoaWZ0S2V5KTtcclxuICAgICAgdGhpcy5jdXJyZW50QWN0aW9uID0gU2VsZWN0QWN0aW9uLk1vdmU7XHJcbiAgICB9IGVsc2UgaWYgKHRhcmdldElkLmluY2x1ZGVzKFNFTEVDVE9SX0dSSVBfUkVTSVpFKSkge1xyXG4gICAgICB0aGlzLmN1cnJlbnRIYW5kbGUgPSB0aGlzLmdldFJlc2l6ZURpcmVjdGlvbih0YXJnZXRJZCk7XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZVJlc2l6ZSgpO1xyXG4gICAgICB0aGlzLmN1cnJlbnRBY3Rpb24gPSBTZWxlY3RBY3Rpb24uUmVzaXplO1xyXG4gICAgfSBlbHNlIGlmICh0YXJnZXRJZC5pbmNsdWRlcyhTRUxFQ1RPUl9HUklQX1JPVEFURSkpIHtcclxuICAgICAgdGhpcy5pbml0aWFsaXplUm90YXRpb24oZXZlbnQpO1xyXG4gICAgICB0aGlzLmN1cnJlbnRBY3Rpb24gPSBTZWxlY3RBY3Rpb24uUm90YXRlO1xyXG4gICAgfSBlbHNlIGlmICh0YXJnZXRJZC5pbmNsdWRlcyhTRUxFQ1RPUl9CT1gpKSB7XHJcbiAgICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IFNlbGVjdEFjdGlvbi5Nb3ZlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pbml0aWFsaXplQm94U2VsZWN0KGV2ZW50KTtcclxuICAgICAgdGhpcy5jdXJyZW50QWN0aW9uID0gU2VsZWN0QWN0aW9uLkJveFNlbGVjdDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG92ZXJyaWRlIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVySW5mbyk6IHZvaWQge1xyXG4gICAgdGhpcy5wZW5kaW5nUG9pbnRlckV2ZW50ID0gZXZlbnQ7XHJcblxyXG4gICAgaWYgKHRoaXMucmFmSWQgPT09IG51bGwpIHtcclxuICAgICAgdGhpcy5yYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yYWZJZCA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5wZW5kaW5nUG9pbnRlckV2ZW50IHx8ICF0aGlzLnN0YXJ0UG9pbnQpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5wZW5kaW5nUG9pbnRlckV2ZW50O1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRQb2ludCA9IHRoaXMuZ2V0UG9pbnRlclBvc2l0aW9uKGV2ZW50KTtcclxuXHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmN1cnJlbnRBY3Rpb24pIHtcclxuICAgICAgICAgIGNhc2UgU2VsZWN0QWN0aW9uLk1vdmU6XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlTW92ZShjdXJyZW50UG9pbnQsIGV2ZW50LnNoaWZ0S2V5KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIFNlbGVjdEFjdGlvbi5SZXNpemU6XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUmVzaXplKGN1cnJlbnRQb2ludCwgZXZlbnQuc2hpZnRLZXkpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgU2VsZWN0QWN0aW9uLlJvdGF0ZTpcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVSb3RhdGUoY3VycmVudFBvaW50LCBldmVudC5jdHJsS2V5KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIFNlbGVjdEFjdGlvbi5Cb3hTZWxlY3Q6XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQm94U2VsZWN0KGN1cnJlbnRQb2ludCwgZXZlbnQuc2hpZnRLZXkpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb3ZlcnJpZGUgaGFuZGxlUG9pbnRlclVwKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMucmFmSWQgIT09IG51bGwpIHtcclxuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWZJZCk7XHJcbiAgICAgIHRoaXMucmFmSWQgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wZW5kaW5nUG9pbnRlckV2ZW50ID0gbnVsbDtcclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50QWN0aW9uID09PSBTZWxlY3RBY3Rpb24uQm94U2VsZWN0KSB7XHJcbiAgICAgIHRoaXMuYXBpU2VydmljZS5jbGVhclNlbGVjdGlvbkJveCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmN1cnJlbnRBY3Rpb24gPT09IFNlbGVjdEFjdGlvbi5Sb3RhdGUpIHtcclxuICAgICAgdGhpcy5pbml0aWFsRWxlbWVudFJvdGF0aW9ucy5jbGVhcigpO1xyXG4gICAgICB0aGlzLmFwaVNlcnZpY2UudXBkYXRlQm91bmRpbmdCb3goKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXRpYWxFbGVtZW50U3RhdGVzLmNsZWFyKCk7XHJcblxyXG4gICAgdGhpcy5jdXJyZW50QWN0aW9uID0gU2VsZWN0QWN0aW9uLk5vbmU7XHJcbiAgICB0aGlzLnN0YXJ0UG9pbnQgPSBudWxsO1xyXG4gICAgdGhpcy5jdXJyZW50SGFuZGxlID0gbnVsbDtcclxuICAgIHRoaXMucm90YXRlU3RhcnRBbmdsZSA9IG51bGw7XHJcbiAgICB0aGlzLnNlbGVjdGlvbkNlbnRlciA9IG51bGw7XHJcbiAgICB0aGlzLmluaXRpYWxCb3VuZGluZ0JveCA9IG51bGw7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhhbmRsZUVsZW1lbnRTZWxlY3QoZWxlbWVudElkOiBzdHJpbmcgfCBudWxsLCBpc011bHRpU2VsZWN0OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBpZiAoIWVsZW1lbnRJZCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmFwaVNlcnZpY2UuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKTtcclxuICAgIGlmICghZWxlbWVudCkgcmV0dXJuO1xyXG5cclxuICAgIGlmIChlbGVtZW50LmxvY2tlZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzTXVsdGlTZWxlY3QpIHtcclxuICAgICAgdGhpcy5hcGlTZXJ2aWNlLnRvZ2dsZVNlbGVjdGlvbihlbGVtZW50KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYXBpU2VydmljZS5zZWxlY3RFbGVtZW50cyhbZWxlbWVudF0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBoYW5kbGVNb3ZlKGN1cnJlbnRQb2ludDogUG9pbnQsIHNoaWZ0S2V5OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuc3RhcnRQb2ludCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGR4ID0gY3VycmVudFBvaW50LnggLSB0aGlzLnN0YXJ0UG9pbnQueDtcclxuICAgIGNvbnN0IGR5ID0gY3VycmVudFBvaW50LnkgLSB0aGlzLnN0YXJ0UG9pbnQueTtcclxuXHJcbiAgICBsZXQgc25hcHBlZFggPSBkeDtcclxuICAgIGxldCBzbmFwcGVkWSA9IGR5O1xyXG5cclxuICAgIGlmIChzaGlmdEtleSkge1xyXG4gICAgICBjb25zdCBzbmFwcGVkID0gZ2V0U25hcHBlZE9mZnNldChkeCwgZHkpO1xyXG4gICAgICBzbmFwcGVkWCA9IHNuYXBwZWQueDtcclxuICAgICAgc25hcHBlZFkgPSBzbmFwcGVkLnk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hcGlTZXJ2aWNlLnRyYW5zZm9ybVNlbGVjdGVkRWxlbWVudHMoKGVsZW1lbnRzKSA9PlxyXG4gICAgICBlbGVtZW50cy5tYXAoKGVsZW1lbnQpID0+IHtcclxuICAgICAgICBpZiAoZWxlbWVudC5sb2NrZWQpIHtcclxuICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgLi4uZWxlbWVudCxcclxuICAgICAgICAgIHg6IGVsZW1lbnQueCArIHNuYXBwZWRYLFxyXG4gICAgICAgICAgeTogZWxlbWVudC55ICsgc25hcHBlZFksXHJcbiAgICAgICAgfTtcclxuICAgICAgfSlcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5zdGFydFBvaW50ID0gY3VycmVudFBvaW50O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBoYW5kbGVSZXNpemUoY3VycmVudFBvaW50OiBQb2ludCwgc2hpZnRLZXk6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5zdGFydFBvaW50IHx8IHRoaXMuY3VycmVudEhhbmRsZSA9PT0gbnVsbCB8fCAhdGhpcy5pbml0aWFsQm91bmRpbmdCb3gpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBoYW5kbGUgPSB0aGlzLmN1cnJlbnRIYW5kbGU7XHJcbiAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnRzID0gdGhpcy5hcGlTZXJ2aWNlLmdldFNlbGVjdGVkRWxlbWVudHMoKTtcclxuICAgIGlmICghc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICBpZiAoc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgY29uc3QgZWxlbWVudCA9IHNlbGVjdGVkRWxlbWVudHNbMF07XHJcblxyXG4gICAgICBjb25zdCBpbml0aWFsRWxlbWVudCA9IHRoaXMuaW5pdGlhbEVsZW1lbnRTdGF0ZXMuZ2V0KGVsZW1lbnQuaWQpO1xyXG4gICAgICBpZiAoIWluaXRpYWxFbGVtZW50KSByZXR1cm47XHJcblxyXG4gICAgICBjb25zdCBkeCA9IGN1cnJlbnRQb2ludC54IC0gdGhpcy5zdGFydFBvaW50Lng7XHJcbiAgICAgIGNvbnN0IGR5ID0gY3VycmVudFBvaW50LnkgLSB0aGlzLnN0YXJ0UG9pbnQueTtcclxuXHJcbiAgICAgIGxldCBsb2NhbER4ID0gZHg7XHJcbiAgICAgIGxldCBsb2NhbER5ID0gZHk7XHJcblxyXG4gICAgICBpZiAoZWxlbWVudC5yb3RhdGlvbiAmJiBlbGVtZW50LnJvdGF0aW9uICE9PSAwKSB7XHJcbiAgICAgICAgY29uc3QgYW5nbGVSYWQgPSAoLWVsZW1lbnQucm90YXRpb24gKiBNYXRoLlBJKSAvIDE4MDtcclxuICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhhbmdsZVJhZCk7XHJcbiAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW4oYW5nbGVSYWQpO1xyXG4gICAgICAgIGxvY2FsRHggPSBkeCAqIGNvcyAtIGR5ICogc2luO1xyXG4gICAgICAgIGxvY2FsRHkgPSBkeCAqIHNpbiArIGR5ICogY29zO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgc25hcHBlZFggPSBsb2NhbER4O1xyXG4gICAgICBsZXQgc25hcHBlZFkgPSBsb2NhbER5O1xyXG5cclxuICAgICAgaWYgKHNoaWZ0S2V5KSB7XHJcbiAgICAgICAgY29uc3Qgc25hcHBlZCA9IGdldFNuYXBwZWRPZmZzZXQobG9jYWxEeCwgbG9jYWxEeSk7XHJcbiAgICAgICAgc25hcHBlZFggPSBzbmFwcGVkLng7XHJcbiAgICAgICAgc25hcHBlZFkgPSBzbmFwcGVkLnk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYXBpU2VydmljZS50cmFuc2Zvcm1TZWxlY3RlZEVsZW1lbnRzKChlbGVtZW50cykgPT5cclxuICAgICAgICBlbGVtZW50cy5tYXAoKGVsKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZWwubG9ja2VkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zdCBpbml0aWFsID0gdGhpcy5pbml0aWFsRWxlbWVudFN0YXRlcy5nZXQoZWwuaWQpO1xyXG4gICAgICAgICAgaWYgKCFpbml0aWFsKSByZXR1cm4gZWw7XHJcblxyXG4gICAgICAgICAgbGV0IGFuY2hvclBvaW50QmVmb3JlOiBQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgICAgaWYgKGluaXRpYWwucm90YXRpb24gJiYgaW5pdGlhbC5yb3RhdGlvbiAhPT0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBpbml0aWFsQW55ID0gaW5pdGlhbCBhcyB1bmtub3duIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xyXG4gICAgICAgICAgICBjb25zdCB3aWR0aCA9IChpbml0aWFsQW55Wyd3aWR0aCddIGFzIG51bWJlcikgfHwgKGluaXRpYWxBbnlbJ3J4J10gYXMgbnVtYmVyKSAqIDIgfHwgMDtcclxuICAgICAgICAgICAgY29uc3QgaGVpZ2h0ID0gKGluaXRpYWxBbnlbJ2hlaWdodCddIGFzIG51bWJlcikgfHwgKGluaXRpYWxBbnlbJ3J5J10gYXMgbnVtYmVyKSAqIDIgfHwgMDtcclxuXHJcbiAgICAgICAgICAgIGxldCBhbmNob3JMb2NhbFggPSAwLFxyXG4gICAgICAgICAgICAgIGFuY2hvckxvY2FsWSA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoaGFuZGxlLmluY2x1ZGVzKERpcmVjdGlvbi5OKSkgYW5jaG9yTG9jYWxZID0gaGVpZ2h0O1xyXG4gICAgICAgICAgICBlbHNlIGlmIChoYW5kbGUuaW5jbHVkZXMoRGlyZWN0aW9uLlMpKSBhbmNob3JMb2NhbFkgPSAwO1xyXG4gICAgICAgICAgICBlbHNlIGFuY2hvckxvY2FsWSA9IGhlaWdodCAvIDI7XHJcblxyXG4gICAgICAgICAgICBpZiAoaGFuZGxlLmluY2x1ZGVzKERpcmVjdGlvbi5XKSkgYW5jaG9yTG9jYWxYID0gd2lkdGg7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGhhbmRsZS5pbmNsdWRlcyhEaXJlY3Rpb24uRSkpIGFuY2hvckxvY2FsWCA9IDA7XHJcbiAgICAgICAgICAgIGVsc2UgYW5jaG9yTG9jYWxYID0gd2lkdGggLyAyO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYW5nbGVSYWQgPSAoaW5pdGlhbC5yb3RhdGlvbiAqIE1hdGguUEkpIC8gMTgwO1xyXG4gICAgICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhhbmdsZVJhZCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKGFuZ2xlUmFkKTtcclxuXHJcbiAgICAgICAgICAgIGFuY2hvclBvaW50QmVmb3JlID0ge1xyXG4gICAgICAgICAgICAgIHg6IGluaXRpYWwueCArIChhbmNob3JMb2NhbFggKiBjb3MgLSBhbmNob3JMb2NhbFkgKiBzaW4pLFxyXG4gICAgICAgICAgICAgIHk6IGluaXRpYWwueSArIChhbmNob3JMb2NhbFggKiBzaW4gKyBhbmNob3JMb2NhbFkgKiBjb3MpLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnN0IGVsZW1lbnRVdGlsID0gZ2V0RWxlbWVudFV0aWwoaW5pdGlhbC50eXBlKTtcclxuICAgICAgICAgIGNvbnN0IHJlc2l6ZWQgPSBlbGVtZW50VXRpbC5yZXNpemUoeyAuLi5pbml0aWFsIH0sIGhhbmRsZSwgc25hcHBlZFgsIHNuYXBwZWRZKTtcclxuXHJcbiAgICAgICAgICBpZiAoaW5pdGlhbC5yb3RhdGlvbiAmJiBpbml0aWFsLnJvdGF0aW9uICE9PSAwICYmIGFuY2hvclBvaW50QmVmb3JlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc2l6ZWRBbnkgPSByZXNpemVkIGFzIHVua25vd24gYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XHJcbiAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gKHJlc2l6ZWRBbnlbJ3dpZHRoJ10gYXMgbnVtYmVyKSB8fCAocmVzaXplZEFueVsncngnXSBhcyBudW1iZXIpICogMiB8fCAwO1xyXG4gICAgICAgICAgICBjb25zdCBoZWlnaHQgPSAocmVzaXplZEFueVsnaGVpZ2h0J10gYXMgbnVtYmVyKSB8fCAocmVzaXplZEFueVsncnknXSBhcyBudW1iZXIpICogMiB8fCAwO1xyXG5cclxuICAgICAgICAgICAgbGV0IGFuY2hvckxvY2FsWCA9IDAsXHJcbiAgICAgICAgICAgICAgYW5jaG9yTG9jYWxZID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChoYW5kbGUuaW5jbHVkZXMoRGlyZWN0aW9uLk4pKSBhbmNob3JMb2NhbFkgPSBoZWlnaHQ7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGhhbmRsZS5pbmNsdWRlcyhEaXJlY3Rpb24uUykpIGFuY2hvckxvY2FsWSA9IDA7XHJcbiAgICAgICAgICAgIGVsc2UgYW5jaG9yTG9jYWxZID0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICAgICAgICAgIGlmIChoYW5kbGUuaW5jbHVkZXMoRGlyZWN0aW9uLlcpKSBhbmNob3JMb2NhbFggPSB3aWR0aDtcclxuICAgICAgICAgICAgZWxzZSBpZiAoaGFuZGxlLmluY2x1ZGVzKERpcmVjdGlvbi5FKSkgYW5jaG9yTG9jYWxYID0gMDtcclxuICAgICAgICAgICAgZWxzZSBhbmNob3JMb2NhbFggPSB3aWR0aCAvIDI7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByb3RhdGlvbiA9IHJlc2l6ZWQucm90YXRpb24gPz8gMDtcclxuICAgICAgICAgICAgY29uc3QgYW5nbGVSYWQgPSAocm90YXRpb24gKiBNYXRoLlBJKSAvIDE4MDtcclxuICAgICAgICAgICAgY29uc3QgY29zID0gTWF0aC5jb3MoYW5nbGVSYWQpO1xyXG4gICAgICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihhbmdsZVJhZCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhbmNob3JQb2ludEFmdGVyID0ge1xyXG4gICAgICAgICAgICAgIHg6IHJlc2l6ZWQueCArIChhbmNob3JMb2NhbFggKiBjb3MgLSBhbmNob3JMb2NhbFkgKiBzaW4pLFxyXG4gICAgICAgICAgICAgIHk6IHJlc2l6ZWQueSArIChhbmNob3JMb2NhbFggKiBzaW4gKyBhbmNob3JMb2NhbFkgKiBjb3MpLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmVzaXplZC54ICs9IGFuY2hvclBvaW50QmVmb3JlLnggLSBhbmNob3JQb2ludEFmdGVyLng7XHJcbiAgICAgICAgICAgIHJlc2l6ZWQueSArPSBhbmNob3JQb2ludEJlZm9yZS55IC0gYW5jaG9yUG9pbnRBZnRlci55O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiByZXNpemVkO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaW5pdGlhbEJvdW5kcyA9IHRoaXMuaW5pdGlhbEJvdW5kaW5nQm94O1xyXG4gICAgY29uc3QgZHggPSBjdXJyZW50UG9pbnQueCAtIHRoaXMuc3RhcnRQb2ludC54O1xyXG4gICAgY29uc3QgZHkgPSBjdXJyZW50UG9pbnQueSAtIHRoaXMuc3RhcnRQb2ludC55O1xyXG5cclxuICAgIGxldCBhbmNob3JYOiBudW1iZXIsIGFuY2hvclk6IG51bWJlcjtcclxuICAgIGxldCBuZXdXaWR0aDogbnVtYmVyLCBuZXdIZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgICBzd2l0Y2ggKGhhbmRsZSkge1xyXG4gICAgICBjYXNlIERpcmVjdGlvbi5OOlxyXG4gICAgICAgIGFuY2hvclggPSBpbml0aWFsQm91bmRzLng7XHJcbiAgICAgICAgYW5jaG9yWSA9IGluaXRpYWxCb3VuZHMueSArIGluaXRpYWxCb3VuZHMuaGVpZ2h0O1xyXG4gICAgICAgIG5ld1dpZHRoID0gaW5pdGlhbEJvdW5kcy53aWR0aDtcclxuICAgICAgICBuZXdIZWlnaHQgPSBpbml0aWFsQm91bmRzLmhlaWdodCAtIGR5O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIERpcmVjdGlvbi5TOlxyXG4gICAgICAgIGFuY2hvclggPSBpbml0aWFsQm91bmRzLng7XHJcbiAgICAgICAgYW5jaG9yWSA9IGluaXRpYWxCb3VuZHMueTtcclxuICAgICAgICBuZXdXaWR0aCA9IGluaXRpYWxCb3VuZHMud2lkdGg7XHJcbiAgICAgICAgbmV3SGVpZ2h0ID0gaW5pdGlhbEJvdW5kcy5oZWlnaHQgKyBkeTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBEaXJlY3Rpb24uRTpcclxuICAgICAgICBhbmNob3JYID0gaW5pdGlhbEJvdW5kcy54O1xyXG4gICAgICAgIGFuY2hvclkgPSBpbml0aWFsQm91bmRzLnk7XHJcbiAgICAgICAgbmV3V2lkdGggPSBpbml0aWFsQm91bmRzLndpZHRoICsgZHg7XHJcbiAgICAgICAgbmV3SGVpZ2h0ID0gaW5pdGlhbEJvdW5kcy5oZWlnaHQ7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgRGlyZWN0aW9uLlc6XHJcbiAgICAgICAgYW5jaG9yWCA9IGluaXRpYWxCb3VuZHMueCArIGluaXRpYWxCb3VuZHMud2lkdGg7XHJcbiAgICAgICAgYW5jaG9yWSA9IGluaXRpYWxCb3VuZHMueTtcclxuICAgICAgICBuZXdXaWR0aCA9IGluaXRpYWxCb3VuZHMud2lkdGggLSBkeDtcclxuICAgICAgICBuZXdIZWlnaHQgPSBpbml0aWFsQm91bmRzLmhlaWdodDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBEaXJlY3Rpb24uTkU6XHJcbiAgICAgICAgYW5jaG9yWCA9IGluaXRpYWxCb3VuZHMueDtcclxuICAgICAgICBhbmNob3JZID0gaW5pdGlhbEJvdW5kcy55ICsgaW5pdGlhbEJvdW5kcy5oZWlnaHQ7XHJcbiAgICAgICAgbmV3V2lkdGggPSBpbml0aWFsQm91bmRzLndpZHRoICsgZHg7XHJcbiAgICAgICAgbmV3SGVpZ2h0ID0gaW5pdGlhbEJvdW5kcy5oZWlnaHQgLSBkeTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBEaXJlY3Rpb24uTlc6XHJcbiAgICAgICAgYW5jaG9yWCA9IGluaXRpYWxCb3VuZHMueCArIGluaXRpYWxCb3VuZHMud2lkdGg7XHJcbiAgICAgICAgYW5jaG9yWSA9IGluaXRpYWxCb3VuZHMueSArIGluaXRpYWxCb3VuZHMuaGVpZ2h0O1xyXG4gICAgICAgIG5ld1dpZHRoID0gaW5pdGlhbEJvdW5kcy53aWR0aCAtIGR4O1xyXG4gICAgICAgIG5ld0hlaWdodCA9IGluaXRpYWxCb3VuZHMuaGVpZ2h0IC0gZHk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgRGlyZWN0aW9uLlNFOlxyXG4gICAgICAgIGFuY2hvclggPSBpbml0aWFsQm91bmRzLng7XHJcbiAgICAgICAgYW5jaG9yWSA9IGluaXRpYWxCb3VuZHMueTtcclxuICAgICAgICBuZXdXaWR0aCA9IGluaXRpYWxCb3VuZHMud2lkdGggKyBkeDtcclxuICAgICAgICBuZXdIZWlnaHQgPSBpbml0aWFsQm91bmRzLmhlaWdodCArIGR5O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIERpcmVjdGlvbi5TVzpcclxuICAgICAgICBhbmNob3JYID0gaW5pdGlhbEJvdW5kcy54ICsgaW5pdGlhbEJvdW5kcy53aWR0aDtcclxuICAgICAgICBhbmNob3JZID0gaW5pdGlhbEJvdW5kcy55O1xyXG4gICAgICAgIG5ld1dpZHRoID0gaW5pdGlhbEJvdW5kcy53aWR0aCAtIGR4O1xyXG4gICAgICAgIG5ld0hlaWdodCA9IGluaXRpYWxCb3VuZHMuaGVpZ2h0ICsgZHk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChuZXdXaWR0aCA8PSAwIHx8IG5ld0hlaWdodCA8PSAwKSByZXR1cm47XHJcblxyXG4gICAgY29uc3Qgc2NhbGVYID0gbmV3V2lkdGggLyBpbml0aWFsQm91bmRzLndpZHRoO1xyXG4gICAgY29uc3Qgc2NhbGVZID0gbmV3SGVpZ2h0IC8gaW5pdGlhbEJvdW5kcy5oZWlnaHQ7XHJcblxyXG4gICAgbGV0IGZpbmFsU2NhbGVYID0gc2NhbGVYO1xyXG4gICAgbGV0IGZpbmFsU2NhbGVZID0gc2NhbGVZO1xyXG4gICAgaWYgKHNoaWZ0S2V5KSB7XHJcbiAgICAgIGNvbnN0IHVuaWZvcm1TY2FsZSA9IE1hdGgubWluKE1hdGguYWJzKHNjYWxlWCksIE1hdGguYWJzKHNjYWxlWSkpICogTWF0aC5zaWduKHNjYWxlWCkgKiBNYXRoLnNpZ24oc2NhbGVZKTtcclxuICAgICAgZmluYWxTY2FsZVggPSB1bmlmb3JtU2NhbGU7XHJcbiAgICAgIGZpbmFsU2NhbGVZID0gdW5pZm9ybVNjYWxlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYXBpU2VydmljZS50cmFuc2Zvcm1TZWxlY3RlZEVsZW1lbnRzKChlbGVtZW50cykgPT5cclxuICAgICAgZWxlbWVudHMubWFwKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQubG9ja2VkKSB7XHJcbiAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluaXRpYWxFbGVtZW50ID0gdGhpcy5pbml0aWFsRWxlbWVudFN0YXRlcy5nZXQoZWxlbWVudC5pZCk7XHJcbiAgICAgICAgaWYgKCFpbml0aWFsRWxlbWVudCkge1xyXG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZWxYID0gaW5pdGlhbEVsZW1lbnQueCAtIGFuY2hvclg7XHJcbiAgICAgICAgY29uc3QgcmVsWSA9IGluaXRpYWxFbGVtZW50LnkgLSBhbmNob3JZO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdSZWxYID0gcmVsWCAqIGZpbmFsU2NhbGVYO1xyXG4gICAgICAgIGNvbnN0IG5ld1JlbFkgPSByZWxZICogZmluYWxTY2FsZVk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNjYWxlZFggPSBhbmNob3JYICsgbmV3UmVsWDtcclxuICAgICAgICBjb25zdCBzY2FsZWRZID0gYW5jaG9yWSArIG5ld1JlbFk7XHJcblxyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAgICAgY29uc3QgdXBkYXRlczogYW55ID0ge1xyXG4gICAgICAgICAgLi4uZWxlbWVudCxcclxuICAgICAgICAgIHg6IHNjYWxlZFgsXHJcbiAgICAgICAgICB5OiBzY2FsZWRZLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICgnd2lkdGgnIGluIGluaXRpYWxFbGVtZW50ICYmIGluaXRpYWxFbGVtZW50LndpZHRoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHVwZGF0ZXMud2lkdGggPSBpbml0aWFsRWxlbWVudC53aWR0aCAqIE1hdGguYWJzKGZpbmFsU2NhbGVYKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCdoZWlnaHQnIGluIGluaXRpYWxFbGVtZW50ICYmIGluaXRpYWxFbGVtZW50LmhlaWdodCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICB1cGRhdGVzLmhlaWdodCA9IGluaXRpYWxFbGVtZW50LmhlaWdodCAqIE1hdGguYWJzKGZpbmFsU2NhbGVZKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbml0aWFsRWxlbWVudC5zdHlsZT8uc3Ryb2tlV2lkdGgpIHtcclxuICAgICAgICAgIGNvbnN0IGF2Z1NjYWxlID0gKE1hdGguYWJzKGZpbmFsU2NhbGVYKSArIE1hdGguYWJzKGZpbmFsU2NhbGVZKSkgLyAyO1xyXG4gICAgICAgICAgdXBkYXRlcy5zdHlsZSA9IHtcclxuICAgICAgICAgICAgLi4uZWxlbWVudC5zdHlsZSxcclxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IGluaXRpYWxFbGVtZW50LnN0eWxlLnN0cm9rZVdpZHRoICogYXZnU2NhbGUsXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXBkYXRlcy5yb3RhdGlvbiA9IGluaXRpYWxFbGVtZW50LnJvdGF0aW9uO1xyXG5cclxuICAgICAgICByZXR1cm4gdXBkYXRlcyBhcyBXaGl0ZWJvYXJkRWxlbWVudDtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhhbmRsZVJvdGF0ZShjdXJyZW50UG9pbnQ6IFBvaW50LCBjdHJsS2V5OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuc3RhcnRQb2ludCB8fCAhdGhpcy5zZWxlY3Rpb25DZW50ZXIgfHwgdGhpcy5yb3RhdGVTdGFydEFuZ2xlID09PSBudWxsKSByZXR1cm47XHJcblxyXG4gICAgY29uc3Qgc2VsZWN0ZWRFbGVtZW50cyA9IHRoaXMuYXBpU2VydmljZS5nZXRTZWxlY3RlZEVsZW1lbnRzKCk7XHJcbiAgICBpZiAoc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBjdXJyZW50QW5nbGUgPSBjYWxjdWxhdGVBbmdsZSh0aGlzLnNlbGVjdGlvbkNlbnRlciwgY3VycmVudFBvaW50KTtcclxuXHJcbiAgICBsZXQgZGVsdGFBbmdsZSA9IGN1cnJlbnRBbmdsZSAtIHRoaXMucm90YXRlU3RhcnRBbmdsZTtcclxuXHJcbiAgICBpZiAoZGVsdGFBbmdsZSA+IDE4MCkgZGVsdGFBbmdsZSAtPSAzNjA7XHJcbiAgICBpZiAoZGVsdGFBbmdsZSA8IC0xODApIGRlbHRhQW5nbGUgKz0gMzYwO1xyXG5cclxuICAgIGlmIChjdHJsS2V5KSB7XHJcbiAgICAgIGRlbHRhQW5nbGUgPSBNYXRoLnJvdW5kKGRlbHRhQW5nbGUgLyAxNSkgKiAxNTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGlvbkNlbnRlciA9IHRoaXMuc2VsZWN0aW9uQ2VudGVyO1xyXG5cclxuICAgICAgdGhpcy5hcGlTZXJ2aWNlLnRyYW5zZm9ybVNlbGVjdGVkRWxlbWVudHMoKGVsZW1lbnRzKSA9PlxyXG4gICAgICAgIGVsZW1lbnRzLm1hcCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQubG9ja2VkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnN0IGluaXRpYWxFbGVtZW50ID0gdGhpcy5pbml0aWFsRWxlbWVudFN0YXRlcy5nZXQoZWxlbWVudC5pZCk7XHJcbiAgICAgICAgICBpZiAoIWluaXRpYWxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnN0IGluaXRpYWxSb3RhdGlvbiA9IHRoaXMuaW5pdGlhbEVsZW1lbnRSb3RhdGlvbnMuZ2V0KGVsZW1lbnQuaWQpID8/IGluaXRpYWxFbGVtZW50LnJvdGF0aW9uID8/IDA7XHJcblxyXG4gICAgICAgICAgY29uc3QgZWxlbWVudFV0aWwgPSBnZXRFbGVtZW50VXRpbChpbml0aWFsRWxlbWVudC50eXBlKTtcclxuICAgICAgICAgIGNvbnN0IGJvdW5kcyA9IGVsZW1lbnRVdGlsLmdldEJvdW5kcyhpbml0aWFsRWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgY29uc3QgZWxlbWVudENlbnRlciA9IHtcclxuICAgICAgICAgICAgeDogKGJvdW5kcy5taW5YICsgYm91bmRzLm1heFgpIC8gMixcclxuICAgICAgICAgICAgeTogKGJvdW5kcy5taW5ZICsgYm91bmRzLm1heFkpIC8gMixcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgY29uc3QgbmV3Q2VudGVyID0gcm90YXRlUG9pbnRBcm91bmRDZW50ZXIoZWxlbWVudENlbnRlciwgc2VsZWN0aW9uQ2VudGVyLCBkZWx0YUFuZ2xlKTtcclxuXHJcbiAgICAgICAgICBjb25zdCBjZW50ZXJPZmZzZXRYID0gZWxlbWVudENlbnRlci54IC0gaW5pdGlhbEVsZW1lbnQueDtcclxuICAgICAgICAgIGNvbnN0IGNlbnRlck9mZnNldFkgPSBlbGVtZW50Q2VudGVyLnkgLSBpbml0aWFsRWxlbWVudC55O1xyXG5cclxuICAgICAgICAgIGNvbnN0IG5ld1ggPSBuZXdDZW50ZXIueCAtIGNlbnRlck9mZnNldFg7XHJcbiAgICAgICAgICBjb25zdCBuZXdZID0gbmV3Q2VudGVyLnkgLSBjZW50ZXJPZmZzZXRZO1xyXG5cclxuICAgICAgICAgIGNvbnN0IG5ld1JvdGF0aW9uID0gbm9ybWFsaXplQW5nbGUoaW5pdGlhbFJvdGF0aW9uICsgZGVsdGFBbmdsZSk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLi4uZWxlbWVudCxcclxuICAgICAgICAgICAgeDogbmV3WCxcclxuICAgICAgICAgICAgeTogbmV3WSxcclxuICAgICAgICAgICAgcm90YXRpb246IG5ld1JvdGF0aW9uLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgZWxlbWVudCA9IHNlbGVjdGVkRWxlbWVudHNbMF07XHJcbiAgICAgIGNvbnN0IGluaXRpYWxSb3RhdGlvbiA9IHRoaXMuaW5pdGlhbEVsZW1lbnRSb3RhdGlvbnMuZ2V0KGVsZW1lbnQuaWQpID8/IGVsZW1lbnQucm90YXRpb24gPz8gMDtcclxuICAgICAgbGV0IG5ld1JvdGF0aW9uID0gaW5pdGlhbFJvdGF0aW9uICsgZGVsdGFBbmdsZTtcclxuXHJcbiAgICAgIG5ld1JvdGF0aW9uID0gbm9ybWFsaXplQW5nbGUobmV3Um90YXRpb24pO1xyXG5cclxuICAgICAgdGhpcy5hcGlTZXJ2aWNlLnRyYW5zZm9ybVNlbGVjdGVkRWxlbWVudHMoKGVsZW1lbnRzKSA9PlxyXG4gICAgICAgIGVsZW1lbnRzLm1hcCgoZWwpID0+IHtcclxuICAgICAgICAgIGlmIChlbC5sb2NrZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLi4uZWwsXHJcbiAgICAgICAgICAgIHJvdGF0aW9uOiBuZXdSb3RhdGlvbixcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgaGFuZGxlQm94U2VsZWN0KGN1cnJlbnRQb2ludDogUG9pbnQsIHNoaWZ0S2V5OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuc3RhcnRQb2ludCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHNlbGVjdGlvbkJveCA9IHtcclxuICAgICAgeDogTWF0aC5taW4odGhpcy5zdGFydFBvaW50LngsIGN1cnJlbnRQb2ludC54KSxcclxuICAgICAgeTogTWF0aC5taW4odGhpcy5zdGFydFBvaW50LnksIGN1cnJlbnRQb2ludC55KSxcclxuICAgICAgd2lkdGg6IE1hdGguYWJzKGN1cnJlbnRQb2ludC54IC0gdGhpcy5zdGFydFBvaW50LngpLFxyXG4gICAgICBoZWlnaHQ6IE1hdGguYWJzKGN1cnJlbnRQb2ludC55IC0gdGhpcy5zdGFydFBvaW50LnkpLFxyXG4gICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmFwaVNlcnZpY2Uuc2V0U2VsZWN0aW9uQm94KHNlbGVjdGlvbkJveCk7XHJcblxyXG4gICAgY29uc3QgYWxsRWxlbWVudHMgPSB0aGlzLmFwaVNlcnZpY2UuZ2V0RWxlbWVudHMoKTtcclxuICAgIGNvbnN0IGVsZW1lbnRzSW5Cb3ggPSBhbGxFbGVtZW50cy5maWx0ZXIoXHJcbiAgICAgIChlbGVtZW50KSA9PiB0aGlzLmNoZWNrRWxlbWVudEluU2VsZWN0aW9uQm94KGVsZW1lbnQsIHNlbGVjdGlvbkJveCkgJiYgIWVsZW1lbnQubG9ja2VkXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuYXBpU2VydmljZS5zZWxlY3RFbGVtZW50cyhlbGVtZW50c0luQm94LCBzaGlmdEtleSk7XHJcbiAgICB0aGlzLmFwaVNlcnZpY2UudXBkYXRlQm91bmRpbmdCb3goKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdGlhbGl6ZUJveFNlbGVjdChldmVudDogUG9pbnRlckluZm8pOiB2b2lkIHtcclxuICAgIGlmICghZXZlbnQuc2hpZnRLZXkpIHtcclxuICAgICAgdGhpcy5hcGlTZXJ2aWNlLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgeyB4LCB5IH0gPSB0aGlzLmdldFBvaW50ZXJQb3NpdGlvbihldmVudCk7XHJcblxyXG4gICAgY29uc3Qgc2VsZWN0aW9uQm94ID0ge1xyXG4gICAgICB4LFxyXG4gICAgICB5LFxyXG4gICAgICB3aWR0aDogMCxcclxuICAgICAgaGVpZ2h0OiAwLFxyXG4gICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmFwaVNlcnZpY2Uuc2V0U2VsZWN0aW9uQm94KHNlbGVjdGlvbkJveCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXRpYWxpemVSZXNpemUoKTogdm9pZCB7XHJcbiAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnRzID0gdGhpcy5hcGlTZXJ2aWNlLmdldFNlbGVjdGVkRWxlbWVudHMoKTtcclxuICAgIGlmIChzZWxlY3RlZEVsZW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMuaW5pdGlhbEVsZW1lbnRTdGF0ZXMuY2xlYXIoKTtcclxuICAgIHNlbGVjdGVkRWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICB0aGlzLmluaXRpYWxFbGVtZW50U3RhdGVzLnNldChlbGVtZW50LmlkLCB7IC4uLmVsZW1lbnQgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBhbGxCb3VuZHMgPSBzZWxlY3RlZEVsZW1lbnRzLm1hcCgoZWwpID0+IGdldEVsZW1lbnRCb3VuZHMoZWwpKTtcclxuICAgIGNvbnN0IG1pblggPSBNYXRoLm1pbiguLi5hbGxCb3VuZHMubWFwKChiKSA9PiBiLm1pblgpKTtcclxuICAgIGNvbnN0IG1pblkgPSBNYXRoLm1pbiguLi5hbGxCb3VuZHMubWFwKChiKSA9PiBiLm1pblkpKTtcclxuICAgIGNvbnN0IG1heFggPSBNYXRoLm1heCguLi5hbGxCb3VuZHMubWFwKChiKSA9PiBiLm1heFgpKTtcclxuICAgIGNvbnN0IG1heFkgPSBNYXRoLm1heCguLi5hbGxCb3VuZHMubWFwKChiKSA9PiBiLm1heFkpKTtcclxuXHJcbiAgICB0aGlzLmluaXRpYWxCb3VuZGluZ0JveCA9IHtcclxuICAgICAgeDogbWluWCxcclxuICAgICAgeTogbWluWSxcclxuICAgICAgd2lkdGg6IG1heFggLSBtaW5YLFxyXG4gICAgICBoZWlnaHQ6IG1heFkgLSBtaW5ZLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdGlhbGl6ZVJvdGF0aW9uKGV2ZW50OiBQb2ludGVySW5mbyk6IHZvaWQge1xyXG4gICAgY29uc3QgYmJveE9yU2lnbmFsID0gdGhpcy5hcGlTZXJ2aWNlLmdldEJvdW5kaW5nQm94U2lnbmFsKCk7XHJcbiAgICBjb25zdCBtYXliZUZuID0gYmJveE9yU2lnbmFsIGFzIHVua25vd247XHJcbiAgICB0eXBlIEJCb3ggPSB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9IHwgbnVsbDtcclxuICAgIGNvbnN0IGJib3g6IEJCb3ggPSB0eXBlb2YgbWF5YmVGbiA9PT0gJ2Z1bmN0aW9uJyA/IChtYXliZUZuIGFzICgpID0+IEJCb3gpKCkgOiAoYmJveE9yU2lnbmFsIGFzIHVua25vd24gYXMgQkJveCk7XHJcbiAgICBpZiAoIWJib3gpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLnNlbGVjdGlvbkNlbnRlciA9IHtcclxuICAgICAgeDogYmJveC54ICsgYmJveC53aWR0aCAvIDIsXHJcbiAgICAgIHk6IGJib3gueSArIGJib3guaGVpZ2h0IC8gMixcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgcG9pbnQgPSB0aGlzLmdldFBvaW50ZXJQb3NpdGlvbihldmVudCk7XHJcblxyXG4gICAgdGhpcy5yb3RhdGVTdGFydEFuZ2xlID0gY2FsY3VsYXRlQW5nbGUodGhpcy5zZWxlY3Rpb25DZW50ZXIsIHBvaW50KTtcclxuXHJcbiAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnRzID0gdGhpcy5hcGlTZXJ2aWNlLmdldFNlbGVjdGVkRWxlbWVudHMoKTtcclxuICAgIHRoaXMuaW5pdGlhbEVsZW1lbnRSb3RhdGlvbnMuY2xlYXIoKTtcclxuICAgIHRoaXMuaW5pdGlhbEVsZW1lbnRTdGF0ZXMuY2xlYXIoKTtcclxuICAgIHNlbGVjdGVkRWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICB0aGlzLmluaXRpYWxFbGVtZW50Um90YXRpb25zLnNldChlbGVtZW50LmlkLCBlbGVtZW50LnJvdGF0aW9uIHx8IDApO1xyXG4gICAgICB0aGlzLmluaXRpYWxFbGVtZW50U3RhdGVzLnNldChlbGVtZW50LmlkLCB7IC4uLmVsZW1lbnQgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFwaVNlcnZpY2Uuc2V0Qm91bmRpbmdCb3gobnVsbCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNoZWNrRWxlbWVudEluU2VsZWN0aW9uQm94KFxyXG4gICAgZWxlbWVudDogV2hpdGVib2FyZEVsZW1lbnQsXHJcbiAgICBzZWxlY3Rpb25Cb3g6IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH1cclxuICApOiBib29sZWFuIHtcclxuICAgIGNvbnN0IGVsZW1lbnRVdGlsID0gZ2V0RWxlbWVudFV0aWwoZWxlbWVudC50eXBlKTtcclxuICAgIGNvbnN0IGJvdW5kcyA9IGVsZW1lbnRVdGlsLmdldEJvdW5kcyhlbGVtZW50KTtcclxuICAgIHJldHVybiBpc0VsZW1lbnRJblNlbGVjdGlvbkJveChib3VuZHMsIHNlbGVjdGlvbkJveCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFJlc2l6ZURpcmVjdGlvbihoYW5kbGVJZDogc3RyaW5nKTogRGlyZWN0aW9uIHtcclxuICAgIGNvbnN0IHN0YXRpY0RpcmVjdGlvblN0ciA9IGhhbmRsZUlkLnNwbGl0KCdfJylbMl07XHJcblxyXG4gICAgbGV0IGJhc2VEaXJlY3Rpb246IERpcmVjdGlvbiA9IERpcmVjdGlvbi5OO1xyXG4gICAgaWYgKE9iamVjdC52YWx1ZXMoRGlyZWN0aW9uKS5pbmNsdWRlcyhzdGF0aWNEaXJlY3Rpb25TdHIgYXMgRGlyZWN0aW9uKSkge1xyXG4gICAgICBiYXNlRGlyZWN0aW9uID0gc3RhdGljRGlyZWN0aW9uU3RyIGFzIERpcmVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnRzID0gdGhpcy5hcGlTZXJ2aWNlLmdldFNlbGVjdGVkRWxlbWVudHMoKTtcclxuICAgIGlmIChzZWxlY3RlZEVsZW1lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgY29uc3Qgcm90YXRpb24gPSBzZWxlY3RlZEVsZW1lbnRzWzBdLnJvdGF0aW9uIHx8IDA7XHJcbiAgICAgIHJldHVybiBnZXRSb3RhdGVkRGlyZWN0aW9uKGJhc2VEaXJlY3Rpb24sIHJvdGF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYmFzZURpcmVjdGlvbjtcclxuICB9XHJcbn1cclxuIl19