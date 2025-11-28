import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ConfigService } from '../config/config.service';
import { ElementType } from '../types';
import { createElement } from '../elements/element.utils';
import { getCanvasCoordinates } from '../utils/geometry';
import * as i0 from "@angular/core";
import * as i1 from "../api/api.service";
import * as i2 from "../config/config.service";
export class DragDropService {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DragDropService, deps: [{ token: i1.ApiService }, { token: i2.ConfigService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DragDropService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DragDropService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.ApiService }, { type: i2.ConfigService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1kcm9wLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy13aGl0ZWJvYXJkL3NyYy9saWIvY29yZS9pbnB1dC9kcmFnLWRyb3Auc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFxQixXQUFXLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDMUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzFELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDOzs7O0FBR3pELE1BQU0sT0FBTyxlQUFlO0lBQ047SUFBZ0M7SUFBcEQsWUFBb0IsVUFBc0IsRUFBVSxhQUE0QjtRQUE1RCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWU7SUFBRyxDQUFDO0lBRXBGLFdBQVcsQ0FBQyxLQUFlO1FBQ3pCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDakMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO2dCQUNuQyxNQUFNLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO2dCQUNoQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQ3BCLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBZ0IsQ0FBQztvQkFDdkMsSUFBSSxHQUFHLEVBQUUsQ0FBQzt3QkFDUixNQUFNLFlBQVksR0FB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b3JlJztcclxuaW1wb3J0IHsgQXBpU2VydmljZSB9IGZyb20gJy4uL2FwaS9hcGkuc2VydmljZSc7XHJcbmltcG9ydCB7IENvbmZpZ1NlcnZpY2UgfSBmcm9tICcuLi9jb25maWcvY29uZmlnLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBXaGl0ZWJvYXJkRWxlbWVudCwgRWxlbWVudFR5cGUgfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tICcuLi9lbGVtZW50cy9lbGVtZW50LnV0aWxzJztcclxuaW1wb3J0IHsgZ2V0Q2FudmFzQ29vcmRpbmF0ZXMgfSBmcm9tICcuLi91dGlscy9nZW9tZXRyeSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgRHJhZ0Ryb3BTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwaVNlcnZpY2U6IEFwaVNlcnZpY2UsIHByaXZhdGUgY29uZmlnU2VydmljZTogQ29uZmlnU2VydmljZSkge31cclxuXHJcbiAgaGFuZGxlRmlsZXMoZmlsZXM6IEZpbGVMaXN0KTogdm9pZCB7XHJcbiAgICBBcnJheS5mcm9tKGZpbGVzKS5mb3JFYWNoKChmaWxlKSA9PiB7XHJcbiAgICAgIGlmIChmaWxlLnR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UvJykpIHtcclxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgY29uc3Qgc3JjID0gZS50YXJnZXQ/LnJlc3VsdCBhcyBzdHJpbmc7XHJcbiAgICAgICAgICBpZiAoc3JjKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGltYWdlRWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgICAgRWxlbWVudFR5cGUuSW1hZ2UsXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc3JjLFxyXG4gICAgICAgICAgICAgICAgeDogMTAwLFxyXG4gICAgICAgICAgICAgICAgeTogMTAwLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDIwMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogMjAwLFxyXG4gICAgICAgICAgICAgICAgekluZGV4OiB0aGlzLmFwaVNlcnZpY2UuZ2V0TmV4dFpJbmRleCgpLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdGhpcy5hcGlTZXJ2aWNlLmdldEFjdGl2ZUxheWVySWQoKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLmFwaVNlcnZpY2UuYWRkRWxlbWVudHMoW2ltYWdlRWxlbWVudF0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlVGV4dChjb250ZW50OiBzdHJpbmcsIGV2ZW50OiBEcmFnRXZlbnQsIGlzSHRtbCA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICBjb25zdCBjb25maWcgPSB0aGlzLmNvbmZpZ1NlcnZpY2UuZ2V0Q29uZmlnKCk7XHJcbiAgICBjb25zdCB7IHgsIHkgfSA9IGdldENhbnZhc0Nvb3JkaW5hdGVzKGNvbmZpZywge1xyXG4gICAgICB4OiBldmVudC5jbGllbnRYLFxyXG4gICAgICB5OiBldmVudC5jbGllbnRZLFxyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IHRleHQgPSBjb250ZW50O1xyXG4gICAgbGV0IHN0eWxlID0ge1xyXG4gICAgICBjb2xvcjogY29uZmlnLnN0cm9rZUNvbG9yLFxyXG4gICAgICBmb250U2l6ZTogY29uZmlnLmZvbnRTaXplLFxyXG4gICAgICBmb250RmFtaWx5OiBjb25maWcuZm9udEZhbWlseSxcclxuICAgICAgZm9udFdlaWdodDogJ25vcm1hbCcgYXMgJ25vcm1hbCcgfCAnYm9sZCcsXHJcbiAgICAgIGZvbnRTdHlsZTogJ25vcm1hbCcgYXMgJ25vcm1hbCcgfCAnaXRhbGljJyxcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGlzSHRtbCkge1xyXG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XHJcbiAgICAgIGNvbnN0IGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoY29udGVudCwgJ3RleHQvaHRtbCcpO1xyXG4gICAgICBjb25zdCB0ZXh0Q29udGVudCA9IGRvYy5ib2R5LnRleHRDb250ZW50IHx8ICcnO1xyXG4gICAgICB0ZXh0ID0gdGV4dENvbnRlbnQudHJpbSgpO1xyXG5cclxuICAgICAgY29uc3QgZmlyc3RFbGVtZW50ID0gZG9jLmJvZHkuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbiAgICAgIGlmIChmaXJzdEVsZW1lbnQpIHtcclxuICAgICAgICBjb25zdCBjb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZmlyc3RFbGVtZW50KTtcclxuICAgICAgICBzdHlsZSA9IHtcclxuICAgICAgICAgIGNvbG9yOiBjb21wdXRlZFN0eWxlLmNvbG9yIHx8IHN0eWxlLmNvbG9yLFxyXG4gICAgICAgICAgZm9udFNpemU6IHBhcnNlSW50KGNvbXB1dGVkU3R5bGUuZm9udFNpemUpIHx8IHN0eWxlLmZvbnRTaXplLFxyXG4gICAgICAgICAgZm9udEZhbWlseTogY29tcHV0ZWRTdHlsZS5mb250RmFtaWx5IHx8IHN0eWxlLmZvbnRGYW1pbHksXHJcbiAgICAgICAgICBmb250V2VpZ2h0OlxyXG4gICAgICAgICAgICBjb21wdXRlZFN0eWxlLmZvbnRXZWlnaHQgPT09ICdib2xkJyB8fCBwYXJzZUludChjb21wdXRlZFN0eWxlLmZvbnRXZWlnaHQpID49IDcwMCA/ICdib2xkJyA6ICdub3JtYWwnLFxyXG4gICAgICAgICAgZm9udFN0eWxlOiBjb21wdXRlZFN0eWxlLmZvbnRTdHlsZSA9PT0gJ2l0YWxpYycgPyAnaXRhbGljJyA6ICdub3JtYWwnLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGV4dCkge1xyXG4gICAgICBjb25zdCB0ZXh0RWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgRWxlbWVudFR5cGUuVGV4dCxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB4LFxyXG4gICAgICAgICAgeTogeSArIHN0eWxlLmZvbnRTaXplICogMC44LFxyXG4gICAgICAgICAgdGV4dCxcclxuICAgICAgICAgIHN0eWxlLFxyXG4gICAgICAgICAgekluZGV4OiB0aGlzLmFwaVNlcnZpY2UuZ2V0TmV4dFpJbmRleCgpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGhpcy5hcGlTZXJ2aWNlLmdldEFjdGl2ZUxheWVySWQoKVxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLmFwaVNlcnZpY2UuYWRkRWxlbWVudHMoW3RleHRFbGVtZW50XSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoYW5kbGVFbGVtZW50cyhlbGVtZW50czogV2hpdGVib2FyZEVsZW1lbnRbXSwgZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQge1xyXG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5jb25maWdTZXJ2aWNlLmdldENvbmZpZygpO1xyXG4gICAgY29uc3QgZHJvcFBvc2l0aW9uID0gZ2V0Q2FudmFzQ29vcmRpbmF0ZXMoY29uZmlnLCB7XHJcbiAgICAgIHg6IGV2ZW50LmNsaWVudFgsXHJcbiAgICAgIHk6IGV2ZW50LmNsaWVudFksXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBjb3BpZWRFbGVtZW50cyA9IGVsZW1lbnRzLm1hcCgoZWwpID0+ICh7XHJcbiAgICAgIC4uLmVsLFxyXG4gICAgICB4OiBkcm9wUG9zaXRpb24ueCArIChlbC54IHx8IDApLFxyXG4gICAgICB5OiBkcm9wUG9zaXRpb24ueSArIChlbC55IHx8IDApLFxyXG4gICAgICB6SW5kZXg6IHRoaXMuYXBpU2VydmljZS5nZXROZXh0WkluZGV4KCksXHJcbiAgICB9KSk7XHJcblxyXG4gICAgdGhpcy5hcGlTZXJ2aWNlLmFkZEVsZW1lbnRzKGNvcGllZEVsZW1lbnRzKTtcclxuICB9XHJcbn1cclxuIl19