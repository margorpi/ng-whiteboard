import { Injectable } from '@angular/core';
import { ArrowTool, EllipseTool, EraserTool, HandTool, ImageTool, LineTool, PenTool, RectangleTool, SelectTool, TextTool, } from '../tools';
import { ToolType } from '../types';
import * as i0 from "@angular/core";
export class ToolFactory {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbC1mYWN0b3J5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy13aGl0ZWJvYXJkL3NyYy9saWIvY29yZS90b29scy90b29sLWZhY3Rvcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFDTCxTQUFTLEVBQ1QsV0FBVyxFQUNYLFVBQVUsRUFDVixRQUFRLEVBQ1IsU0FBUyxFQUNULFFBQVEsRUFDUixPQUFPLEVBQ1AsYUFBYSxFQUNiLFVBQVUsRUFDVixRQUFRLEdBQ1QsTUFBTSxVQUFVLENBQUM7QUFDbEIsT0FBTyxFQUFRLFFBQVEsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7QUFHMUMsTUFBTSxPQUFPLFdBQVc7SUFDdEIsVUFBVSxDQUFDLFFBQWtCLEVBQUUsVUFBc0I7UUFDbkQsUUFBUSxRQUFRLEVBQUUsQ0FBQztZQUNqQixLQUFLLFFBQVEsQ0FBQyxLQUFLO2dCQUNqQixPQUFPLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ25DLEtBQUssUUFBUSxDQUFDLE9BQU87Z0JBQ25CLE9BQU8sSUFBSSxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDckMsS0FBSyxRQUFRLENBQUMsTUFBTTtnQkFDbEIsT0FBTyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNwQyxLQUFLLFFBQVEsQ0FBQyxJQUFJO2dCQUNoQixPQUFPLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2xDLEtBQUssUUFBUSxDQUFDLEtBQUs7Z0JBQ2pCLE9BQU8sSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbkMsS0FBSyxRQUFRLENBQUMsSUFBSTtnQkFDaEIsT0FBTyxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNsQyxLQUFLLFFBQVEsQ0FBQyxHQUFHO2dCQUNmLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDakMsS0FBSyxRQUFRLENBQUMsU0FBUztnQkFDckIsT0FBTyxJQUFJLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN2QyxLQUFLLFFBQVEsQ0FBQyxNQUFNO2dCQUNsQixPQUFPLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3BDLEtBQUssUUFBUSxDQUFDLElBQUk7Z0JBQ2hCLE9BQU8sSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEM7Z0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN0RCxDQUFDO0lBQ0gsQ0FBQzt3R0ExQlUsV0FBVzs0R0FBWCxXQUFXLGNBREUsTUFBTTs7NEZBQ25CLFdBQVc7a0JBRHZCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBcGlTZXJ2aWNlIH0gZnJvbSAnLi4vYXBpJztcclxuaW1wb3J0IHtcclxuICBBcnJvd1Rvb2wsXHJcbiAgRWxsaXBzZVRvb2wsXHJcbiAgRXJhc2VyVG9vbCxcclxuICBIYW5kVG9vbCxcclxuICBJbWFnZVRvb2wsXHJcbiAgTGluZVRvb2wsXHJcbiAgUGVuVG9vbCxcclxuICBSZWN0YW5nbGVUb29sLFxyXG4gIFNlbGVjdFRvb2wsXHJcbiAgVGV4dFRvb2wsXHJcbn0gZnJvbSAnLi4vdG9vbHMnO1xyXG5pbXBvcnQgeyBUb29sLCBUb29sVHlwZSB9IGZyb20gJy4uL3R5cGVzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBUb29sRmFjdG9yeSB7XHJcbiAgY3JlYXRlVG9vbCh0b29sVHlwZTogVG9vbFR5cGUsIGFwaVNlcnZpY2U6IEFwaVNlcnZpY2UpOiBUb29sIHtcclxuICAgIHN3aXRjaCAodG9vbFR5cGUpIHtcclxuICAgICAgY2FzZSBUb29sVHlwZS5BcnJvdzpcclxuICAgICAgICByZXR1cm4gbmV3IEFycm93VG9vbChhcGlTZXJ2aWNlKTtcclxuICAgICAgY2FzZSBUb29sVHlwZS5FbGxpcHNlOlxyXG4gICAgICAgIHJldHVybiBuZXcgRWxsaXBzZVRvb2woYXBpU2VydmljZSk7XHJcbiAgICAgIGNhc2UgVG9vbFR5cGUuRXJhc2VyOlxyXG4gICAgICAgIHJldHVybiBuZXcgRXJhc2VyVG9vbChhcGlTZXJ2aWNlKTtcclxuICAgICAgY2FzZSBUb29sVHlwZS5IYW5kOlxyXG4gICAgICAgIHJldHVybiBuZXcgSGFuZFRvb2woYXBpU2VydmljZSk7XHJcbiAgICAgIGNhc2UgVG9vbFR5cGUuSW1hZ2U6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbWFnZVRvb2woYXBpU2VydmljZSk7XHJcbiAgICAgIGNhc2UgVG9vbFR5cGUuTGluZTpcclxuICAgICAgICByZXR1cm4gbmV3IExpbmVUb29sKGFwaVNlcnZpY2UpO1xyXG4gICAgICBjYXNlIFRvb2xUeXBlLlBlbjpcclxuICAgICAgICByZXR1cm4gbmV3IFBlblRvb2woYXBpU2VydmljZSk7XHJcbiAgICAgIGNhc2UgVG9vbFR5cGUuUmVjdGFuZ2xlOlxyXG4gICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlVG9vbChhcGlTZXJ2aWNlKTtcclxuICAgICAgY2FzZSBUb29sVHlwZS5TZWxlY3Q6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTZWxlY3RUb29sKGFwaVNlcnZpY2UpO1xyXG4gICAgICBjYXNlIFRvb2xUeXBlLlRleHQ6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUZXh0VG9vbChhcGlTZXJ2aWNlKTtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gdG9vbCB0eXBlOiAke3Rvb2xUeXBlfWApO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=