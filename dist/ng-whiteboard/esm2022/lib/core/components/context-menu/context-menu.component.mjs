import { Component, computed, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuService } from './context-menu.service';
import * as i0 from "@angular/core";
import * as i1 from "./context-menu.service";
export class ContextMenuComponent {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ContextMenuComponent, deps: [{ token: i1.ContextMenuService }], target: i0.ɵɵFactoryTarget.Component });
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
        }], ctorParameters: () => [{ type: i1.ContextMenuService }], propDecorators: { contextMenu: [{
                type: ViewChild,
                args: ['contextMenu', { static: true }]
            }], onKeyDown: [{
                type: HostListener,
                args: ['document:keydown', ['$event']]
            }], onDocumentClick: [{
                type: HostListener,
                args: ['document:click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLXdoaXRlYm9hcmQvc3JjL2xpYi9jb3JlL2NvbXBvbmVudHMvY29udGV4dC1tZW51L2NvbnRleHQtbWVudS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBNkIsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsa0JBQWtCLEVBQXVDLE1BQU0sd0JBQXdCLENBQUM7OztBQXlTakcsTUFBTSxPQUFPLG9CQUFvQjtJQWFYO0lBWndCLFdBQVcsQ0FBOEI7SUFFckYsU0FBUyxDQUFrQjtJQUMzQixRQUFRLENBQW1DO0lBQzNDLFFBQVEsQ0FBK0I7SUFDdkMsZUFBZSxDQUF5QjtJQUN4QyxXQUFXLENBQWlDO0lBRTVDLFdBQVcsR0FBMkIsSUFBSSxDQUFDO0lBQzNDLGVBQWUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQzlCLGNBQWMsR0FBeUMsSUFBSSxDQUFDO0lBRXBFLFlBQW9CLGtCQUFzQztRQUF0Qyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3hELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDakUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUNqRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQ2pFLElBQUksQ0FBQyxlQUFlLEdB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QUFDLFlBQ2I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFFVDt1RkErTjJDLFdBQVc7c0JBQXRELFNBQVM7dUJBQUMsYUFBYSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkEwSzFDLFNBQVM7c0JBRFIsWUFBWTt1QkFBQyxrQkFBa0IsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkF5QzVDLGVBQWU7c0JBRGQsWUFBWTt1QkFBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgY29tcHV0ZWQsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgT25EZXN0cm95LCBPbkluaXQsIFNpZ25hbCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IENvbnRleHRNZW51U2VydmljZSwgQ29udGV4dE1lbnVJdGVtLCBDb250ZXh0TWVudVNlY3Rpb24gfSBmcm9tICcuL2NvbnRleHQtbWVudS5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnd2ItY29udGV4dC1tZW51JyxcclxuICBzdGFuZGFsb25lOiB0cnVlLFxyXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8ZGl2XHJcbiAgICAgICNjb250ZXh0TWVudVxyXG4gICAgICBjbGFzcz1cImNvbnRleHQtbWVudVwiXHJcbiAgICAgIFtjbGFzcy52aXNpYmxlXT1cImlzVmlzaWJsZSgpXCJcclxuICAgICAgW3N0eWxlLmxlZnQucHhdPVwicG9zaXRpb24oKS54XCJcclxuICAgICAgW3N0eWxlLnRvcC5weF09XCJwb3NpdGlvbigpLnlcIlxyXG4gICAgICAoY2xpY2spPVwiJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXCJcclxuICAgID5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRleHQtbWVudS1jb250ZW50XCI+XHJcbiAgICAgICAgQGZvciAoc2VjdGlvbiBvZiBzZWN0aW9ucygpOyB0cmFjayBzZWN0aW9uLmlkKSB7XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRleHQtbWVudS1zZWN0aW9uXCI+XHJcbiAgICAgICAgICBAZm9yIChpdGVtIG9mIHNlY3Rpb24uaXRlbXM7IHRyYWNrIGl0ZW0uaWQpIHtcclxuICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgY2xhc3M9XCJjb250ZXh0LW1lbnUtaXRlbVwiXHJcbiAgICAgICAgICAgIFtjbGFzcy5kaXNhYmxlZF09XCIhaXRlbS5lbmFibGVkXCJcclxuICAgICAgICAgICAgW2NsYXNzLmRpdmlkZXItYWZ0ZXJdPVwiaXRlbS5kaXZpZGVyXCJcclxuICAgICAgICAgICAgW2NsYXNzLmhhcy1zdWJtZW51XT1cIml0ZW0uc3VibWVudVwiXHJcbiAgICAgICAgICAgIFtjbGFzcy5hY3RpdmVdPVwiaG92ZXJlZEl0ZW0gPT09IGl0ZW1cIlxyXG4gICAgICAgICAgICBbY2xhc3MuZm9jdXNlZF09XCJpc0ZvY3VzZWQoaXRlbSlcIlxyXG4gICAgICAgICAgICAoY2xpY2spPVwib25JdGVtQ2xpY2soaXRlbSwgJGV2ZW50KVwiXHJcbiAgICAgICAgICAgIChtb3VzZWVudGVyKT1cIm9uSXRlbUhvdmVyKGl0ZW0sICRldmVudClcIlxyXG4gICAgICAgICAgICAobW91c2VsZWF2ZSk9XCJvbkl0ZW1MZWF2ZSgpXCJcclxuICAgICAgICAgICAgW2F0dHIudGl0bGVdPVwiaXRlbS5zaG9ydGN1dCB8fCBudWxsXCJcclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIml0ZW0tY29udGVudFwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaXRlbS1sYWJlbFwiPnt7IGl0ZW0ubGFiZWwgfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgQGlmIChpdGVtLnNob3J0Y3V0KSB7XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpdGVtLXNob3J0Y3V0XCI+e3sgaXRlbS5zaG9ydGN1dCB9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICB9IEBpZiAoaXRlbS5zdWJtZW51KSB7XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpdGVtLWFycm93XCI+4oC6PC9zcGFuPlxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIH1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICB9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPCEtLSBTdWJtZW51IHJlbmRlcmVkIHNlcGFyYXRlbHkgb3V0c2lkZSBtYWluIG1lbnUgLS0+XHJcbiAgICBAaWYgKGhvdmVyZWRJdGVtICYmIGhvdmVyZWRJdGVtLnN1Ym1lbnUpIHtcclxuICAgIDxkaXZcclxuICAgICAgY2xhc3M9XCJzdWJtZW51XCJcclxuICAgICAgW3N0eWxlLmxlZnQucHhdPVwic3VibWVudVBvc2l0aW9uLmxlZnRcIlxyXG4gICAgICBbc3R5bGUudG9wLnB4XT1cInN1Ym1lbnVQb3NpdGlvbi50b3BcIlxyXG4gICAgICAobW91c2VlbnRlcik9XCJvblN1Ym1lbnVFbnRlcigpXCJcclxuICAgICAgKG1vdXNlbGVhdmUpPVwib25TdWJtZW51TGVhdmUoKVwiXHJcbiAgICAgIChjbGljayk9XCIkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcIlxyXG4gICAgPlxyXG4gICAgICBAZm9yIChzdWJpdGVtIG9mIGhvdmVyZWRJdGVtLnN1Ym1lbnU7IHRyYWNrIHN1Yml0ZW0uaWQpIHtcclxuICAgICAgPGRpdlxyXG4gICAgICAgIGNsYXNzPVwiY29udGV4dC1tZW51LWl0ZW0gc3VibWVudS1pdGVtXCJcclxuICAgICAgICBbY2xhc3MuZGlzYWJsZWRdPVwiIXN1Yml0ZW0uZW5hYmxlZFwiXHJcbiAgICAgICAgW2NsYXNzLmRpdmlkZXItYWZ0ZXJdPVwic3ViaXRlbS5kaXZpZGVyXCJcclxuICAgICAgICBbY2xhc3MuZm9jdXNlZF09XCJpc0ZvY3VzZWQoc3ViaXRlbSlcIlxyXG4gICAgICAgIChjbGljayk9XCJvbkl0ZW1DbGljayhzdWJpdGVtLCAkZXZlbnQpXCJcclxuICAgICAgICBbYXR0ci50aXRsZV09XCJzdWJpdGVtLnNob3J0Y3V0IHx8IG51bGxcIlxyXG4gICAgICA+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIml0ZW0tY29udGVudFwiPlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJpdGVtLWxhYmVsXCI+e3sgc3ViaXRlbS5sYWJlbCB9fTwvc3Bhbj5cclxuICAgICAgICAgIEBpZiAoc3ViaXRlbS5zaG9ydGN1dCkge1xyXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJpdGVtLXNob3J0Y3V0XCI+e3sgc3ViaXRlbS5zaG9ydGN1dCB9fTwvc3Bhbj5cclxuICAgICAgICAgIH1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIH1cclxuICAgIDwvZGl2PlxyXG4gICAgfVxyXG4gIGAsXHJcbiAgc3R5bGVzOiBbXHJcbiAgICBgXHJcbiAgICAgIC5jb250ZXh0LW1lbnUge1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICB6LWluZGV4OiAxMDAwMDtcclxuICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcclxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTUpO1xyXG4gICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjFzIGVhc2Utb3V0O1xyXG4gICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAuY29udGV4dC1tZW51LnZpc2libGUge1xyXG4gICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcclxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xyXG4gICAgICAgIHBvaW50ZXItZXZlbnRzOiBhdXRvO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAuY29udGV4dC1tZW51LWNvbnRlbnQge1xyXG4gICAgICAgIGJhY2tncm91bmQ6ICNmZmZmZmY7XHJcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2UwZTBlMDtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA2cHg7XHJcbiAgICAgICAgYm94LXNoYWRvdzogMCA0cHggMTJweCByZ2JhKDAsIDAsIDAsIDAuMTUpO1xyXG4gICAgICAgIHBhZGRpbmc6IDRweCAwO1xyXG4gICAgICAgIG1pbi13aWR0aDogMjAwcHg7XHJcbiAgICAgICAgbWF4LXdpZHRoOiAzMDBweDtcclxuICAgICAgICBtYXgtaGVpZ2h0OiA0MDBweDtcclxuICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xyXG4gICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKiBDdXN0b20gc2Nyb2xsYmFyIGZvciBjb250ZXh0IG1lbnUgKi9cclxuICAgICAgLmNvbnRleHQtbWVudS1jb250ZW50Ojotd2Via2l0LXNjcm9sbGJhciB7XHJcbiAgICAgICAgd2lkdGg6IDZweDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLmNvbnRleHQtbWVudS1jb250ZW50Ojotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogI2YxZjFmMTtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiAzcHg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC5jb250ZXh0LW1lbnUtY29udGVudDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xyXG4gICAgICAgIGJhY2tncm91bmQ6ICNjMWMxYzE7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogM3B4O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAuY29udGV4dC1tZW51LWNvbnRlbnQ6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvdmVyIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAjYThhOGE4O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAuY29udGV4dC1tZW51LXNlY3Rpb246bm90KDpsYXN0LWNoaWxkKSB7XHJcbiAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNmMGYwZjA7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogNHB4O1xyXG4gICAgICAgIHBhZGRpbmctYm90dG9tOiA0cHg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC5jb250ZXh0LW1lbnUtaXRlbSB7XHJcbiAgICAgICAgcGFkZGluZzogOHB4IDE2cHg7XHJcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xcyBlYXNlO1xyXG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLmNvbnRleHQtbWVudS1pdGVtOmhvdmVyOm5vdCguZGlzYWJsZWQpIHtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmNWY1O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAuY29udGV4dC1tZW51LWl0ZW0uZm9jdXNlZDpub3QoLmRpc2FibGVkKSB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2UzZjJmZDtcclxuICAgICAgICBvdXRsaW5lOiAycHggc29saWQgIzIxOTZmMztcclxuICAgICAgICBvdXRsaW5lLW9mZnNldDogLTJweDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLmNvbnRleHQtbWVudS1pdGVtLmRpc2FibGVkIHtcclxuICAgICAgICBvcGFjaXR5OiAwLjU7XHJcbiAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLmNvbnRleHQtbWVudS1pdGVtLmRpdmlkZXItYWZ0ZXI6OmFmdGVyIHtcclxuICAgICAgICBjb250ZW50OiAnJztcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgYm90dG9tOiAwO1xyXG4gICAgICAgIGxlZnQ6IDE2cHg7XHJcbiAgICAgICAgcmlnaHQ6IDE2cHg7XHJcbiAgICAgICAgaGVpZ2h0OiAxcHg7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2UwZTBlMDtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiAtNHB4O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAuaXRlbS1jb250ZW50IHtcclxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAuaXRlbS1sYWJlbCB7XHJcbiAgICAgICAgZmxleDogMTtcclxuICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgY29sb3I6ICMzMzM7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLml0ZW0tc2hvcnRjdXQge1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICBjb2xvcjogIzY2NjtcclxuICAgICAgICBtYXJnaW4tbGVmdDogMTZweDtcclxuICAgICAgICBmb250LWZhbWlseTogJ01vbmFjbycsICdNZW5sbycsICdVYnVudHUgTW9ubycsIG1vbm9zcGFjZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLml0ZW0tYXJyb3cge1xyXG4gICAgICAgIG1hcmdpbi1sZWZ0OiA4cHg7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgICAgIGNvbG9yOiAjOTk5O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAuY29udGV4dC1tZW51LWl0ZW0uaGFzLXN1Ym1lbnUge1xyXG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLmNvbnRleHQtbWVudS1pdGVtLmhhcy1zdWJtZW51LmFjdGl2ZSB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjVmNTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLnN1Ym1lbnUge1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xyXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNlMGUwZTA7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNnB4O1xyXG4gICAgICAgIGJveC1zaGFkb3c6IDAgNHB4IDEycHggcmdiYSgwLCAwLCAwLCAwLjE1KTtcclxuICAgICAgICBwYWRkaW5nOiA0cHggMDtcclxuICAgICAgICBtaW4td2lkdGg6IDIwMHB4O1xyXG4gICAgICAgIG1heC13aWR0aDogMzAwcHg7XHJcbiAgICAgICAgdXNlci1zZWxlY3Q6IG5vbmU7XHJcbiAgICAgICAgei1pbmRleDogMTAwMDE7XHJcbiAgICAgICAgb3BhY2l0eTogMTtcclxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xyXG4gICAgICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4xcyBlYXNlLCB0cmFuc2Zvcm0gMC4xcyBlYXNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAuc3VibWVudS1pdGVtIHtcclxuICAgICAgICBwYWRkaW5nOiA4cHggMTZweDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLnN1Ym1lbnUtaXRlbTpob3Zlcjpub3QoLmRpc2FibGVkKSB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjVmNTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLmNvbnRleHQtbWVudS1pdGVtLmRpc2FibGVkIC5pdGVtLWxhYmVsLFxyXG4gICAgICAuY29udGV4dC1tZW51LWl0ZW0uZGlzYWJsZWQgLml0ZW0tc2hvcnRjdXQsXHJcbiAgICAgIC5jb250ZXh0LW1lbnUtaXRlbS5kaXNhYmxlZCAuaXRlbS1hcnJvdyB7XHJcbiAgICAgICAgY29sb3I6ICM5OTk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qIERhcmsgdGhlbWUgc3VwcG9ydCAqL1xyXG4gICAgICBAbWVkaWEgKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKSB7XHJcbiAgICAgICAgLmNvbnRleHQtbWVudS1jb250ZW50LFxyXG4gICAgICAgIC5zdWJtZW51IHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICMyYTJhMmE7XHJcbiAgICAgICAgICBib3JkZXItY29sb3I6ICM0MDQwNDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY29udGV4dC1tZW51LWNvbnRlbnQ6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICMzYTNhM2E7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY29udGV4dC1tZW51LWNvbnRlbnQ6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICM2NjY2NjY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY29udGV4dC1tZW51LWNvbnRlbnQ6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvdmVyIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICM3Nzc3Nzc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY29udGV4dC1tZW51LWl0ZW06aG92ZXI6bm90KC5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzQwNDA0MDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jb250ZXh0LW1lbnUtaXRlbS5mb2N1c2VkOm5vdCguZGlzYWJsZWQpIHtcclxuICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICMxZTNhNWY7XHJcbiAgICAgICAgICBvdXRsaW5lOiAycHggc29saWQgIzE5NzZkMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jb250ZXh0LW1lbnUtaXRlbS5oYXMtc3VibWVudS5hY3RpdmUge1xyXG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzQwNDA0MDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5zdWJtZW51LWl0ZW06aG92ZXI6bm90KC5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzQwNDA0MDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5pdGVtLWxhYmVsIHtcclxuICAgICAgICAgIGNvbG9yOiAjZTBlMGUwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLml0ZW0tc2hvcnRjdXQge1xyXG4gICAgICAgICAgY29sb3I6ICNhMGEwYTA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuaXRlbS1hcnJvdyB7XHJcbiAgICAgICAgICBjb2xvcjogIzY2NjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jb250ZXh0LW1lbnUtaXRlbS5kaXNhYmxlZCAuaXRlbS1sYWJlbCxcclxuICAgICAgICAuY29udGV4dC1tZW51LWl0ZW0uZGlzYWJsZWQgLml0ZW0tc2hvcnRjdXQsXHJcbiAgICAgICAgLmNvbnRleHQtbWVudS1pdGVtLmRpc2FibGVkIC5pdGVtLWFycm93IHtcclxuICAgICAgICAgIGNvbG9yOiAjNjY2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNvbnRleHQtbWVudS1zZWN0aW9uOm5vdCg6bGFzdC1jaGlsZCkge1xyXG4gICAgICAgICAgYm9yZGVyLWJvdHRvbS1jb2xvcjogIzQwNDA0MDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jb250ZXh0LW1lbnUtaXRlbS5kaXZpZGVyLWFmdGVyOjphZnRlciB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNDA0MDQwO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgYCxcclxuICBdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XHJcbiAgQFZpZXdDaGlsZCgnY29udGV4dE1lbnUnLCB7IHN0YXRpYzogdHJ1ZSB9KSBjb250ZXh0TWVudSE6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xyXG5cclxuICBpc1Zpc2libGU6IFNpZ25hbDxib29sZWFuPjtcclxuICBwb3NpdGlvbjogU2lnbmFsPHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfT47XHJcbiAgc2VjdGlvbnM6IFNpZ25hbDxDb250ZXh0TWVudVNlY3Rpb25bXT47XHJcbiAgY29udGFpbmVyQm91bmRzOiBTaWduYWw8RE9NUmVjdCB8IG51bGw+O1xyXG4gIGZvY3VzZWRJdGVtOiBTaWduYWw8Q29udGV4dE1lbnVJdGVtIHwgbnVsbD47XHJcblxyXG4gIGhvdmVyZWRJdGVtOiBDb250ZXh0TWVudUl0ZW0gfCBudWxsID0gbnVsbDtcclxuICBzdWJtZW51UG9zaXRpb24gPSB7IGxlZnQ6IDAsIHRvcDogMCB9O1xyXG4gIHByaXZhdGUgc3VibWVudVRpbWVvdXQ6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29udGV4dE1lbnVTZXJ2aWNlOiBDb250ZXh0TWVudVNlcnZpY2UpIHtcclxuICAgIHRoaXMuaXNWaXNpYmxlID0gdGhpcy5jb250ZXh0TWVudVNlcnZpY2UuZ2V0Q29udGV4dE1lbnVWaXNpYmxlKCk7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5jb250ZXh0TWVudVNlcnZpY2UuZ2V0Q29udGV4dE1lbnVQb3NpdGlvbigpO1xyXG4gICAgdGhpcy5zZWN0aW9ucyA9IHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLmdldENvbnRleHRNZW51U2VjdGlvbnMoKTtcclxuICAgIHRoaXMuY29udGFpbmVyQm91bmRzID0gdGhpcy5jb250ZXh0TWVudVNlcnZpY2UuZ2V0Q29udGFpbmVyQm91bmRzKCk7XHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgY29tcHV0ZWQgc2lnbmFsIHRoYXQgcmV0dXJucyB0aGUgZm9jdXNlZCBpdGVtIGRpcmVjdGx5XHJcbiAgICB0aGlzLmZvY3VzZWRJdGVtID0gY29tcHV0ZWQoKCkgPT4ge1xyXG4gICAgICBjb25zdCBmb2N1c2VkSW5kZXggPSB0aGlzLmNvbnRleHRNZW51U2VydmljZS5nZXRGb2N1c2VkSXRlbUluZGV4KCkoKTtcclxuICAgICAgY29uc3QgYWxsSXRlbXMgPSB0aGlzLmNvbnRleHRNZW51U2VydmljZS5nZXRBbGxNZW51SXRlbXMoKTtcclxuICAgICAgcmV0dXJuIGFsbEl0ZW1zW2ZvY3VzZWRJbmRleF0gfHwgbnVsbDtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gY29tcHV0ZWQoKCkgPT4ge1xyXG4gICAgICBjb25zdCBwb3MgPSB0aGlzLmNvbnRleHRNZW51U2VydmljZS5nZXRDb250ZXh0TWVudVBvc2l0aW9uKCkoKTtcclxuICAgICAgY29uc3QgY29udGFpbmVyQm91bmRzID0gdGhpcy5jb250YWluZXJCb3VuZHMoKTtcclxuXHJcbiAgICAgIGxldCB4ID0gcG9zLng7XHJcbiAgICAgIGxldCB5ID0gcG9zLnk7XHJcblxyXG4gICAgICBpZiAoY29udGFpbmVyQm91bmRzKSB7XHJcbiAgICAgICAgeCA9IHBvcy54IC0gY29udGFpbmVyQm91bmRzLmxlZnQ7XHJcbiAgICAgICAgeSA9IHBvcy55IC0gY29udGFpbmVyQm91bmRzLnRvcDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuYWRqdXN0UG9zaXRpb24oeCwgeSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2UuaGlkZUNvbnRleHRNZW51KCk7XHJcbiAgICBpZiAodGhpcy5zdWJtZW51VGltZW91dCkge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5zdWJtZW51VGltZW91dCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkl0ZW1DbGljayhpdGVtOiBDb250ZXh0TWVudUl0ZW0sIGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAoIWl0ZW0uZW5hYmxlZCkgcmV0dXJuO1xyXG5cclxuICAgIGlmIChpdGVtLnN1Ym1lbnUpIHtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5hY3Rpb24pIHtcclxuICAgICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2UuZXhlY3V0ZUFjdGlvbihpdGVtLmFjdGlvbik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkl0ZW1Ib3ZlcihpdGVtOiBDb250ZXh0TWVudUl0ZW0sIGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5zdWJtZW51VGltZW91dCkge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5zdWJtZW51VGltZW91dCk7XHJcbiAgICAgIHRoaXMuc3VibWVudVRpbWVvdXQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLnN1Ym1lbnUgJiYgaXRlbS5lbmFibGVkKSB7XHJcbiAgICAgIHRoaXMuaG92ZXJlZEl0ZW0gPSBpdGVtO1xyXG4gICAgICBjb25zdCB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICB0aGlzLmNhbGN1bGF0ZVN1Ym1lbnVQb3NpdGlvbih0YXJnZXQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5ob3ZlcmVkSXRlbSA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkl0ZW1MZWF2ZSgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnN1Ym1lbnVUaW1lb3V0KSB7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnN1Ym1lbnVUaW1lb3V0KTtcclxuICAgIH1cclxuICAgIHRoaXMuc3VibWVudVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5ob3ZlcmVkSXRlbSA9IG51bGw7XHJcbiAgICB9LCAxMDApO1xyXG4gIH1cclxuXHJcbiAgb25TdWJtZW51RW50ZXIoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5zdWJtZW51VGltZW91dCkge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5zdWJtZW51VGltZW91dCk7XHJcbiAgICAgIHRoaXMuc3VibWVudVRpbWVvdXQgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25TdWJtZW51TGVhdmUoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5zdWJtZW51VGltZW91dCkge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5zdWJtZW51VGltZW91dCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnN1Ym1lbnVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuaG92ZXJlZEl0ZW0gPSBudWxsO1xyXG4gICAgfSwgMTAwKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2FsY3VsYXRlU3VibWVudVBvc2l0aW9uKGl0ZW1FbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG4gICAgY29uc3QgaXRlbVJlY3QgPSBpdGVtRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIGNvbnN0IGNvbnRhaW5lckJvdW5kcyA9IHRoaXMuY29udGFpbmVyQm91bmRzKCk7XHJcblxyXG4gICAgaWYgKCFjb250YWluZXJCb3VuZHMpIHtcclxuICAgICAgdGhpcy5zdWJtZW51UG9zaXRpb24gPSB7XHJcbiAgICAgICAgbGVmdDogaXRlbVJlY3QucmlnaHQgKyA0LFxyXG4gICAgICAgIHRvcDogaXRlbVJlY3QudG9wIC0gNCxcclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHN1Ym1lbnVXaWR0aCA9IDIwMDtcclxuICAgIGNvbnN0IHBhZGRpbmcgPSA0O1xyXG5cclxuICAgIGNvbnN0IGl0ZW1SZWxhdGl2ZUxlZnQgPSBpdGVtUmVjdC5sZWZ0IC0gY29udGFpbmVyQm91bmRzLmxlZnQ7XHJcbiAgICBjb25zdCBpdGVtUmVsYXRpdmVSaWdodCA9IGl0ZW1SZWN0LnJpZ2h0IC0gY29udGFpbmVyQm91bmRzLmxlZnQ7XHJcbiAgICBjb25zdCBpdGVtUmVsYXRpdmVUb3AgPSBpdGVtUmVjdC50b3AgLSBjb250YWluZXJCb3VuZHMudG9wO1xyXG5cclxuICAgIGNvbnN0IGNvbnRleHRNZW51RWxlbWVudCA9IHRoaXMuY29udGV4dE1lbnU/Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICBjb25zdCBjb250ZXh0TWVudVJlY3QgPSBjb250ZXh0TWVudUVsZW1lbnQ/LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc3QgY29udGV4dE1lbnVUb3AgPSBjb250ZXh0TWVudVJlY3QgPyBjb250ZXh0TWVudVJlY3QudG9wIC0gY29udGFpbmVyQm91bmRzLnRvcCA6IHBhZGRpbmc7XHJcbiAgICBjb25zdCBjb250ZXh0TWVudUJvdHRvbSA9IGNvbnRleHRNZW51UmVjdFxyXG4gICAgICA/IGNvbnRleHRNZW51UmVjdC5ib3R0b20gLSBjb250YWluZXJCb3VuZHMudG9wXHJcbiAgICAgIDogY29udGFpbmVyQm91bmRzLmhlaWdodCAtIHBhZGRpbmc7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGhvcml6b250YWwgcG9zaXRpb25cclxuICAgIGxldCBsZWZ0ID0gaXRlbVJlbGF0aXZlUmlnaHQgKyBwYWRkaW5nO1xyXG5cclxuICAgIGNvbnN0IHNwYWNlT25SaWdodCA9IGNvbnRhaW5lckJvdW5kcy53aWR0aCAtIGl0ZW1SZWxhdGl2ZVJpZ2h0IC0gcGFkZGluZztcclxuICAgIGNvbnN0IHNwYWNlT25MZWZ0ID0gaXRlbVJlbGF0aXZlTGVmdCAtIHBhZGRpbmc7XHJcblxyXG4gICAgaWYgKHNwYWNlT25SaWdodCA8IHN1Ym1lbnVXaWR0aCAmJiBzcGFjZU9uTGVmdCA+IHNwYWNlT25SaWdodCkge1xyXG4gICAgICBsZWZ0ID0gaXRlbVJlbGF0aXZlTGVmdCAtIHN1Ym1lbnVXaWR0aCAtIHBhZGRpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIHZlcnRpY2FsIHBvc2l0aW9uIC0gYWxpZ24gd2l0aCBpdGVtIGluaXRpYWxseVxyXG4gICAgbGV0IHRvcCA9IGl0ZW1SZWxhdGl2ZVRvcDtcclxuXHJcbiAgICAvLyBFc3RpbWF0ZSBzdWJtZW51IGhlaWdodCAod2lsbCBiZSBjYWxjdWxhdGVkIGR5bmFtaWNhbGx5IGJhc2VkIG9uIGl0ZW1zKVxyXG4gICAgY29uc3QgZXN0aW1hdGVkSXRlbUhlaWdodCA9IDMyOyAvLyBBcHByb3hpbWF0ZSBoZWlnaHQgcGVyIGl0ZW1cclxuICAgIGNvbnN0IHN1Ym1lbnVJdGVtQ291bnQgPSB0aGlzLmhvdmVyZWRJdGVtPy5zdWJtZW51Py5sZW5ndGggfHwgMDtcclxuICAgIGNvbnN0IHN1Ym1lbnVIZWlnaHQgPSBzdWJtZW51SXRlbUNvdW50ICogZXN0aW1hdGVkSXRlbUhlaWdodCArIDg7IC8vICs4IGZvciBwYWRkaW5nXHJcblxyXG4gICAgLy8gRW5zdXJlIHN1Ym1lbnUgZG9lc24ndCBleGNlZWQgY29udGV4dCBtZW51IGJvdHRvbVxyXG4gICAgY29uc3Qgc3VibWVudUJvdHRvbSA9IHRvcCArIHN1Ym1lbnVIZWlnaHQ7XHJcbiAgICBpZiAoc3VibWVudUJvdHRvbSA+IGNvbnRleHRNZW51Qm90dG9tKSB7XHJcbiAgICAgIHRvcCA9IGNvbnRleHRNZW51Qm90dG9tIC0gc3VibWVudUhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBFbnN1cmUgc3VibWVudSBkb2Vzbid0IGdvIGFib3ZlIGNvbnRleHQgbWVudSB0b3BcclxuICAgIGlmICh0b3AgPCBjb250ZXh0TWVudVRvcCkge1xyXG4gICAgICB0b3AgPSBjb250ZXh0TWVudVRvcDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGaW5hbCBob3Jpem9udGFsIGJvdW5kcyBjaGVja1xyXG4gICAgaWYgKGxlZnQgPCBwYWRkaW5nKSB7XHJcbiAgICAgIGxlZnQgPSBwYWRkaW5nO1xyXG4gICAgfVxyXG4gICAgaWYgKGxlZnQgKyBzdWJtZW51V2lkdGggPiBjb250YWluZXJCb3VuZHMud2lkdGggLSBwYWRkaW5nKSB7XHJcbiAgICAgIGxlZnQgPSBjb250YWluZXJCb3VuZHMud2lkdGggLSBzdWJtZW51V2lkdGggLSBwYWRkaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3VibWVudVBvc2l0aW9uID0geyBsZWZ0LCB0b3AgfTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmtleWRvd24nLCBbJyRldmVudCddKVxyXG4gIG9uS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmlzVmlzaWJsZSgpKSByZXR1cm47XHJcblxyXG4gICAgc3dpdGNoIChldmVudC5rZXkpIHtcclxuICAgICAgY2FzZSAnRXNjYXBlJzpcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLmhpZGVDb250ZXh0TWVudSgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdBcnJvd0Rvd24nOlxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2UuZm9jdXNOZXh0SXRlbSgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdBcnJvd1VwJzpcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLmZvY3VzUHJldmlvdXNJdGVtKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2Uub3BlbkZvY3VzZWRTdWJtZW51KCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51U2VydmljZS5jbG9zZUZvY3VzZWRTdWJtZW51KCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ0VudGVyJzpcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLmV4ZWN1dGVGb2N1c2VkQWN0aW9uKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ0hvbWUnOlxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2UuZm9jdXNGaXJzdEl0ZW0oKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnRW5kJzpcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLmZvY3VzTGFzdEl0ZW0oKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmNsaWNrJywgWyckZXZlbnQnXSlcclxuICBvbkRvY3VtZW50Q2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmlzVmlzaWJsZSgpICYmIHRoaXMuY29udGV4dE1lbnU/Lm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgY29udGV4dE1lbnVFbGVtZW50ID0gdGhpcy5jb250ZXh0TWVudS5uYXRpdmVFbGVtZW50O1xyXG4gICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgTm9kZTtcclxuXHJcbiAgICAgIGlmICghY29udGV4dE1lbnVFbGVtZW50LmNvbnRhaW5zKHRhcmdldCkpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51U2VydmljZS5oaWRlQ29udGV4dE1lbnUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGp1c3RQb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcik6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB7XHJcbiAgICBpZiAoIXRoaXMuY29udGV4dE1lbnU/Lm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIHsgeCwgeSB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1lbnUgPSB0aGlzLmNvbnRleHRNZW51Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICBjb25zdCBtZW51UmVjdCA9IG1lbnUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBjb25zdCBjb250YWluZXJCb3VuZHMgPSB0aGlzLmNvbnRhaW5lckJvdW5kcygpO1xyXG5cclxuICAgIGlmICghY29udGFpbmVyQm91bmRzKSB7XHJcbiAgICAgIHJldHVybiB7IHgsIHkgfTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYWRqdXN0ZWRYID0geDtcclxuICAgIGxldCBhZGp1c3RlZFkgPSB5O1xyXG5cclxuICAgIGNvbnN0IHBhZGRpbmcgPSAxMDtcclxuICAgIGNvbnN0IG1heE1lbnVIZWlnaHQgPSA0MDA7XHJcblxyXG4gICAgaWYgKHggKyBtZW51UmVjdC53aWR0aCA+IGNvbnRhaW5lckJvdW5kcy53aWR0aCAtIHBhZGRpbmcpIHtcclxuICAgICAgYWRqdXN0ZWRYID0gTWF0aC5tYXgocGFkZGluZywgeCAtIG1lbnVSZWN0LndpZHRoKTtcclxuICAgIH1cclxuICAgIGlmIChhZGp1c3RlZFggPCBwYWRkaW5nKSB7XHJcbiAgICAgIGFkanVzdGVkWCA9IHBhZGRpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYXZhaWxhYmxlSGVpZ2h0ID0gY29udGFpbmVyQm91bmRzLmhlaWdodCAtIHkgLSBwYWRkaW5nO1xyXG4gICAgY29uc3QgcmVxdWlyZWRIZWlnaHQgPSBNYXRoLm1pbihtZW51UmVjdC5oZWlnaHQsIG1heE1lbnVIZWlnaHQpO1xyXG5cclxuICAgIGlmIChyZXF1aXJlZEhlaWdodCA+IGF2YWlsYWJsZUhlaWdodCkge1xyXG4gICAgICBjb25zdCBhdmFpbGFibGVIZWlnaHRBYm92ZSA9IHkgLSBwYWRkaW5nO1xyXG4gICAgICBpZiAocmVxdWlyZWRIZWlnaHQgPD0gYXZhaWxhYmxlSGVpZ2h0QWJvdmUpIHtcclxuICAgICAgICBhZGp1c3RlZFkgPSB5IC0gcmVxdWlyZWRIZWlnaHQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGF2YWlsYWJsZUhlaWdodEFib3ZlID4gYXZhaWxhYmxlSGVpZ2h0KSB7XHJcbiAgICAgICAgICBhZGp1c3RlZFkgPSB5IC0gTWF0aC5taW4ocmVxdWlyZWRIZWlnaHQsIGF2YWlsYWJsZUhlaWdodEFib3ZlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYWRqdXN0ZWRZID0gTWF0aC5tYXgocGFkZGluZywgY29udGFpbmVyQm91bmRzLmhlaWdodCAtIHJlcXVpcmVkSGVpZ2h0IC0gcGFkZGluZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFkanVzdGVkWSA8IHBhZGRpbmcpIHtcclxuICAgICAgYWRqdXN0ZWRZID0gcGFkZGluZztcclxuICAgIH1cclxuICAgIGlmIChhZGp1c3RlZFkgKyByZXF1aXJlZEhlaWdodCA+IGNvbnRhaW5lckJvdW5kcy5oZWlnaHQgLSBwYWRkaW5nKSB7XHJcbiAgICAgIGFkanVzdGVkWSA9IGNvbnRhaW5lckJvdW5kcy5oZWlnaHQgLSByZXF1aXJlZEhlaWdodCAtIHBhZGRpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHsgeDogYWRqdXN0ZWRYLCB5OiBhZGp1c3RlZFkgfTtcclxuICB9XHJcblxyXG4gIGlzRm9jdXNlZChpdGVtOiBDb250ZXh0TWVudUl0ZW0pOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmZvY3VzZWRJdGVtKCkgPT09IGl0ZW07XHJcbiAgfVxyXG59XHJcbiJdfQ==