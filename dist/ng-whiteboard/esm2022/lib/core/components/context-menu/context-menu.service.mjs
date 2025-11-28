import { Injectable, computed, signal } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { AlignmentType } from '../../types';
import * as i0 from "@angular/core";
import * as i1 from "../../api/api.service";
export const CONTEXT_MENU_ICONS = {
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
export class ContextMenuService {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ContextMenuService, deps: [{ token: i1.ApiService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ContextMenuService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ContextMenuService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.ApiService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy13aGl0ZWJvYXJkL3NyYy9saWIvY29yZS9jb21wb25lbnRzL2NvbnRleHQtbWVudS9jb250ZXh0LW1lbnUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFVLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxhQUFhLENBQUM7OztBQUU1QyxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBMkI7SUFDeEQsWUFBWTtJQUNaLEdBQUcsRUFBRSxnU0FBZ1M7SUFDclMsSUFBSSxFQUFFLHlUQUF5VDtJQUMvVCxLQUFLLEVBQ0gsK1JBQStSO0lBQ2pTLFNBQVMsRUFDUCwwVUFBMFU7SUFFNVUsWUFBWTtJQUNaLFlBQVksRUFDViw4UEFBOFA7SUFDaFEsTUFBTSxFQUNKLHNkQUFzZDtJQUV4ZCxRQUFRO0lBQ1IsS0FBSyxFQUNILG9VQUFvVTtJQUN0VSxnQkFBZ0IsRUFDZCw4TEFBOEw7SUFDaE0sZUFBZSxFQUNiLDJTQUEyUztJQUM3UyxlQUFlLEVBQ2IsK1FBQStRO0lBQ2pSLGNBQWMsRUFDWiw4TEFBOEw7SUFFaE0sUUFBUTtJQUNSLEtBQUssRUFDSCwwUUFBMFE7SUFDNVEsWUFBWSxFQUNWLDBRQUEwUTtJQUM1USxjQUFjLEVBQ1osaVNBQWlTO0lBQ25TLGFBQWEsRUFDWCw4UUFBOFE7SUFDaFIsV0FBVyxFQUNULG9RQUFvUTtJQUN0USxjQUFjLEVBQ1osaVBBQWlQO0lBQ25QLGNBQWMsRUFDWix5UUFBeVE7SUFFM1EsYUFBYTtJQUNiLFVBQVUsRUFDUiw2TkFBNk47SUFDL04sdUJBQXVCLEVBQ3JCLG1TQUFtUztJ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RSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgU2lnbmFsLCBjb21wdXRlZCwgc2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFwaVNlcnZpY2UgfSBmcm9tICcuLi8uLi9hcGkvYXBpLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBbGlnbm1lbnRUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IENPTlRFWFRfTUVOVV9JQ09OUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcclxuICAvLyBDbGlwYm9hcmRcclxuICBjdXQ6ICc8c3ZnIHZpZXdCb3g9XCIwIDAgMTYgMTZcIiBmaWxsPVwiY3VycmVudENvbG9yXCI+PHBhdGggZD1cIk0zLjUgMi41YS41LjUgMCAwIDAtMSAwdjExYS41LjUgMCAwIDAgMSAwdi0xMVptOSAwYS41LjUgMCAwIDAtMSAwdjExYS41LjUgMCAwIDAgMSAwdi0xMVpNNSAxYTEgMSAwIDAgMSAxLTFoNGExIDEgMCAwIDEgMSAxdjFoLjVBMS41IDEuNSAwIDAgMSAxMyAzLjVWMTJhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWMy41QTEuNSAxLjUgMCAwIDEgNC41IDJINVYxWm0xIDB2MWg0VjFINlpcIi8+PC9zdmc+JyxcclxuICBjb3B5OiAnPHN2ZyB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiPjxwYXRoIGQ9XCJNNCAyYTIgMiAwIDAgMSAyLTJoOGEyIDIgMCAwIDEgMiAydjhhMiAyIDAgMCAxLTIgMkg2YTIgMiAwIDAgMS0yLTJWMlptMi0xYTEgMSAwIDAgMC0xIDF2OGExIDEgMCAwIDAgMSAxaDhhMSAxIDAgMCAwIDEtMVYyYTEgMSAwIDAgMC0xLTFINlpNMiA1YTEgMSAwIDAgMC0xIDF2OGExIDEgMCAwIDAgMSAxaDhhMSAxIDAgMCAwIDEtMXYtMWgxdjFhMiAyIDAgMCAxLTIgMkgyYTIgMiAwIDAgMS0yLTJWNmEyIDIgMCAwIDEgMi0yaDF2MUgyWlwiLz48L3N2Zz4nLFxyXG4gIHBhc3RlOlxyXG4gICAgJzxzdmcgdmlld0JveD1cIjAgMCAxNiAxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIj48cGF0aCBkPVwiTTQuNSAzYS41LjUgMCAwIDAtLjUuNXY5YS41LjUgMCAwIDAgLjUuNWg3YS41LjUgMCAwIDAgLjUtLjV2LTlhLjUuNSAwIDAgMC0uNS0uNWgtN1ptLTEuNS41QTEuNSAxLjUgMCAwIDEgNC41IDJoN0ExLjUgMS41IDAgMCAxIDEzIDMuNXY5YTEuNSAxLjUgMCAwIDEtMS41IDEuNWgtN0ExLjUgMS41IDAgMCAxIDMgMTIuNXYtOVpNNiAxYTEgMSAwIDAgMC0xIDFoNmExIDEgMCAwIDAtMS0xSDZaXCIvPjwvc3ZnPicsXHJcbiAgZHVwbGljYXRlOlxyXG4gICAgJzxzdmcgdmlld0JveD1cIjAgMCAxNiAxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIj48cGF0aCBkPVwiTTExIDJhMiAyIDAgMCAxIDIgMnY2LjVhLjUuNSAwIDAgMS0xIDBWNGExIDEgMCAwIDAtMS0xSDRhMSAxIDAgMCAwLTEgMXY3YTEgMSAwIDAgMCAxIDFoNi41YS41LjUgMCAwIDEgMCAxSDRhMiAyIDAgMCAxLTItMlY0YTIgMiAwIDAgMSAyLTJoN1ptNC44NTQgNS4xNDZhLjUuNSAwIDAgMSAwIC43MDhsLTMgM2EuNS41IDAgMCAxLS43MDggMGwtMS41LTEuNWEuNS41IDAgMCAxIC43MDgtLjcwOEwxMi41IDkuNzkzbDIuNjQ2LTIuNjQ3YS41LjUgMCAwIDEgLjcwOCAwWlwiLz48L3N2Zz4nLFxyXG5cclxuICAvLyBTZWxlY3Rpb25cclxuICAnc2VsZWN0LWFsbCc6XHJcbiAgICAnPHN2ZyB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiPjxwYXRoIGQ9XCJNMS41IDJBMS41IDEuNSAwIDAgMCAwIDMuNXY5QTEuNSAxLjUgMCAwIDAgMS41IDE0aDEzYTEuNSAxLjUgMCAwIDAgMS41LTEuNXYtOUExLjUgMS41IDAgMCAwIDE0LjUgMmgtMTNaTTEgMy41YS41LjUgMCAwIDEgLjUtLjVoMTNhLjUuNSAwIDAgMSAuNS41VjEzYS41LjUgMCAwIDEtLjUuNWgtMTNBLjUuNSAwIDAgMSAxIDEzVjMuNVpcIi8+PC9zdmc+JyxcclxuICBkZWxldGU6XHJcbiAgICAnPHN2ZyB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiPjxwYXRoIGQ9XCJNNS41IDUuNUEuNS41IDAgMCAxIDYgNnY2YS41LjUgMCAwIDEtMSAwVjZhLjUuNSAwIDAgMSAuNS0uNVptMi41IDBhLjUuNSAwIDAgMSAuNS41djZhLjUuNSAwIDAgMS0xIDBWNmEuNS41IDAgMCAxIC41LS41Wm0zIC41YS41LjUgMCAwIDAtMSAwdjZhLjUuNSAwIDAgMCAxIDBWNlpcIi8+PHBhdGggZD1cIk0xNC41IDNhMSAxIDAgMCAxLTEgMUgxM3Y5YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yVjRoLS41YTEgMSAwIDAgMS0xLTFWMmExIDEgMCAwIDEgMS0xSDZhMSAxIDAgMCAxIDEtMWgyYTEgMSAwIDAgMSAxIDFoMy41YTEgMSAwIDAgMSAxIDF2MVpNNC4xMTggNCA0IDQuMDU5VjEzYTEgMSAwIDAgMCAxIDFoNmExIDEgMCAwIDAgMS0xVjQuMDU5TDExLjg4MiA0SDQuMTE4Wk0yLjUgM2gxMVYyaC0xMXYxWlwiLz48L3N2Zz4nLFxyXG5cclxuICAvLyBPcmRlclxyXG4gIG9yZGVyOlxyXG4gICAgJzxzdmcgdmlld0JveD1cIjAgMCAxNiAxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIj48cGF0aCBkPVwiTTggM2EuNS41IDAgMCAxIC41LjV2MmEuNS41IDAgMCAxLS41LjVINmEuNS41IDAgMCAxIDAtMWgxLjVWMy41QS41LjUgMCAwIDEgOCAzWm0wIDdhLjUuNSAwIDAgMSAuNS41VjEySDEwYS41LjUgMCAwIDEgMCAxSDhhLjUuNSAwIDAgMS0uNS0uNXYtMkEuNS41IDAgMCAxIDggMTBabS01LTNhMSAxIDAgMSAwIDAtMiAxIDEgMCAwIDAgMCAyWm01IDBhMSAxIDAgMSAwIDAtMiAxIDEgMCAwIDAgMCAyWm01IDBhMSAxIDAgMSAwIDAtMiAxIDEgMCAwIDAgMCAyWlwiLz48L3N2Zz4nLFxyXG4gICdicmluZy10by1mcm9udCc6XHJcbiAgICAnPHN2ZyB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiPjxwYXRoIGQ9XCJNMiAwYTIgMiAwIDAgMC0yIDJ2NGEyIDIgMCAwIDAgMiAyaDRhMiAyIDAgMCAwIDItMlYyYTIgMiAwIDAgMC0yLTJIMlptNiA5djVhMiAyIDAgMCAwIDIgMmg0YTIgMiAwIDAgMCAyLTJ2LTRhMiAyIDAgMCAwLTItMkg5WlwiLz48L3N2Zz4nLFxyXG4gICdicmluZy1mb3J3YXJkJzpcclxuICAgICc8c3ZnIHZpZXdCb3g9XCIwIDAgMTYgMTZcIiBmaWxsPVwiY3VycmVudENvbG9yXCI+PHBhdGggZD1cIk0xIDJhMSAxIDAgMCAxIDEtMWg2YTEgMSAwIDAgMSAxIDF2NGExIDEgMCAwIDEtMSAxSDJhMSAxIDAgMCAxLTEtMVYyWm0xIDB2NGg2VjJIMlptNiA2djZhMSAxIDAgMCAxLTEgMUgxYTEgMSAwIDAgMS0xLTFWOGExIDEgMCAwIDEgMS0xaDZhMSAxIDAgMCAxIDEgMVptNi02djRhMSAxIDAgMCAxLTEgMUg5YTEgMSAwIDAgMS0xLTFWMmExIDEgMCAwIDEgMS0xaDVhMSAxIDAgMCAxIDEgMVptLTEgMEg5djRoNVYyWlwiLz48L3N2Zz4nLFxyXG4gICdzZW5kLWJhY2t3YXJkJzpcclxuICAgICc8c3ZnIHZpZXdCb3g9XCIwIDAgMTYgMTZcIiBmaWxsPVwiY3VycmVudENvbG9yXCI+PHBhdGggZD1cIk0wIDJhMSAxIDAgMCAxIDEtMWg1YTEgMSAwIDAgMSAxIDF2NGExIDEgMCAwIDEtMSAxSDFhMSAxIDAgMCAxLTEtMVYyWm0xIDB2NGg1VjJIMVptMCA2djZhMSAxIDAgMCAxIDEgMWg2YTEgMSAwIDAgMS0xLTFWOGExIDEgMCAwIDEtMS0xSDFabTgtNnY0YTEgMSAwIDAgMSAxIDFoNWExIDEgMCAwIDEgMS0xVjJhMSAxIDAgMCAxLTEtMUg5YTEgMSAwIDAgMSAxIDFaXCIvPjwvc3ZnPicsXHJcbiAgJ3NlbmQtdG8tYmFjayc6XHJcbiAgICAnPHN2ZyB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiPjxwYXRoIGQ9XCJNMCAyYTIgMiAwIDAgMSAyLTJoNGEyIDIgMCAwIDEgMiAydjRhMiAyIDAgMCAxLTIgMkgyYTIgMiAwIDAgMS0yLTJWMlptOCA3aDZhMiAyIDAgMCAxIDIgMnY0YTIgMiAwIDAgMS0yIDJoLTRhMiAyIDAgMCAxLTItMlY5WlwiLz48L3N2Zz4nLFxyXG5cclxuICAvLyBBbGlnblxyXG4gIGFsaWduOlxyXG4gICAgJzxzdmcgdmlld0JveD1cIjAgMCAxNiAxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIj48cGF0aCBkPVwiTTEuNSAwQTEuNSAxLjUgMCAwIDAgMCAxLjV2MTNBMS41IDEuNSAwIDAgMCAxLjUgMTZoMTNhMS41IDEuNSAwIDAgMCAxLjUtMS41di0xM0ExLjUgMS41IDAgMCAwIDE0LjUgMGgtMTNaTTEgMS41YS41LjUgMCAwIDEgLjUtLjVINHYzLjVIMVYxLjVaTTUgNC41aDZWMUg1djMuNVpNMTIgNWgzdjZoLTNWNVptLTEgNkg1VjVoNnY2Wm0tNy02SDF2NmgzVjVaXCIvPjwvc3ZnPicsXHJcbiAgJ2FsaWduLWxlZnQnOlxyXG4gICAgJzxzdmcgdmlld0JveD1cIjAgMCAxNiAxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIj48cGF0aCBkPVwiTTEuNSAxYS41LjUgMCAwIDAtMSAwdjE0YS41LjUgMCAwIDAgMSAwVjFabTMgMGEuNS41IDAgMCAxIC41LS41aDdhLjUuNSAwIDAgMSAuNS41djNhLjUuNSAwIDAgMS0uNS41SDVhLjUuNSAwIDAgMS0uNS0uNVYxWm0wIDdhLjUuNSAwIDAgMSAuNS0uNWgxMGEuNS41IDAgMCAxIC41LjV2M2EuNS41IDAgMCAxLS41LjVINWEuNS41IDAgMCAxLS41LS41VjhaXCIvPjwvc3ZnPicsXHJcbiAgJ2FsaWduLWNlbnRlcic6XHJcbiAgICAnPHN2ZyB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiPjxwYXRoIGQ9XCJNOCAxYS41LjUgMCAwIDAtLjUuNXYxM2EuNS41IDAgMCAwIDEgMHYtMTNBLjUuNSAwIDAgMCA4IDFaTTIgNC41YS41LjUgMCAwIDEgLjUtLjVoMTFhLjUuNSAwIDAgMSAuNS41djFhLjUuNSAwIDAgMS0uNS41aC0xMWEuNS41IDAgMCAxLS41LS41di0xWm0yIDVhLjUuNSAwIDAgMSAuNS0uNWg3YS41LjUgMCAwIDEgLjUuNXYxYS41LjUgMCAwIDEtLjUuNWgtN2EuNS41IDAgMCAxLS41LS41di0xWlwiLz48L3N2Zz4nLFxyXG4gICdhbGlnbi1yaWdodCc6XHJcbiAgICAnPHN2ZyB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiPjxwYXRoIGQ9XCJNMTQuNSAxYS41LjUgMCAwIDEgMSAwdjE0YS41LjUgMCAwIDEtMSAwVjFabS0yLjUgMGEuNS41IDAgMCAxIC41LS41SDVhLjUuNSAwIDAgMSAuNS41djNhLjUuNSAwIDAgMS0uNS41aDdhLjUuNSAwIDAgMS0uNS0uNVYxWm0wIDdhLjUuNSAwIDAgMSAuNS0uNUgyYS41LjUgMCAwIDEgLjUuNXYzYS41LjUgMCAwIDEtLjUuNWgxMGEuNS41IDAgMCAxLS41LS41VjhaXCIvPjwvc3ZnPicsXHJcbiAgJ2FsaWduLXRvcCc6XHJcbiAgICAnPHN2ZyB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiPjxwYXRoIGQ9XCJNMSAxLjVhLjUuNSAwIDAgMCAxIDBWMWgxM3YuNWEuNS41IDAgMCAwIDEgMFYxYTEgMSAwIDAgMC0xLTFIMmExIDEgMCAwIDAtMSAxdi41Wm00IDFhLjUuNSAwIDAgMSAuNS41djEwYS41LjUgMCAwIDEtMSAwVjNhLjUuNSAwIDAgMSAuNS0uNVptNiAwYS41LjUgMCAwIDEgLjUuNXY3YS41LjUgMCAwIDEtMSAwVjNhLjUuNSAwIDAgMSAuNS0uNVpcIi8+PC9zdmc+JyxcclxuICAnYWxpZ24tbWlkZGxlJzpcclxuICAgICc8c3ZnIHZpZXdCb3g9XCIwIDAgMTYgMTZcIiBmaWxsPVwiY3VycmVudENvbG9yXCI+PHBhdGggZD1cIk0xIDhhLjUuNSAwIDAgMCAuNS41SDE1YS41LjUgMCAwIDAgMC0xSDEuNUEuNS41IDAgMCAwIDEgOFptMy41LTVhLjUuNSAwIDAgMSAuNS41djlhLjUuNSAwIDAgMS0xIDB2LTlhLjUuNSAwIDAgMSAuNS0uNVptNyAwYS41LjUgMCAwIDEgLjUuNXY5YS41LjUgMCAwIDEtMSAwdi05YS41LjUgMCAwIDEgLjUtLjVaXCIvPjwvc3ZnPicsXHJcbiAgJ2FsaWduLWJvdHRvbSc6XHJcbiAgICAnPHN2ZyB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiPjxwYXRoIGQ9XCJNMSAxNC41YS41LjUgMCAwIDEgMSAwVjE1aDEzdi0uNWEuNS41IDAgMCAxIDEgMFYxNWExIDEgMCAwIDEtMSAxSDJhMSAxIDAgMCAxLTEtMXYtLjVabTQtMWEuNS41IDAgMCAwIC41LS41VjNhLjUuNSAwIDAgMC0xIDB2MTBhLjUuNSAwIDAgMCAuNS41Wm02IDBhLjUuNSAwIDAgMCAuNS0uNVY2YS41LjUgMCAwIDAtMSAwdjdhLjUuNSAwIDAgMCAuNS41WlwiLz48L3N2Zz4nLFxyXG5cclxuICAvLyBEaXN0cmlidXRlXHJcbiAgZGlzdHJpYnV0ZTpcclxuICAgICc8c3ZnIHZpZXdCb3g9XCIwIDAgMTYgMTZcIiBmaWxsPVwiY3VycmVudENvbG9yXCI+PHBhdGggZD1cIk0xIDEuNWEuNS41IDAgMCAxIDEgMHYxM2EuNS41IDAgMCAxLTEgMHYtMTNabTE0IDBhLjUuNSAwIDAgMC0xIDB2MTNhLjUuNSAwIDAgMCAxIDB2LTEzWk01IDVhMSAxIDAgMCAxIDEtMWg0YTEgMSAwIDAgMSAxIDF2NmExIDEgMCAwIDEtMSAxSDZhMSAxIDAgMCAxLTEtMVY1WlwiLz48L3N2Zz4nLFxyXG4gICdkaXN0cmlidXRlLWhvcml6b250YWwnOlxyXG4gICAgJzxzdmcgdmlld0JveD1cIjAgMCAxNiAxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIj48cGF0aCBkPVwiTTEgMS41YS41LjUgMCAwIDEgMSAwdjEzYS41LjUgMCAwIDEtMSAwdi0xM1ptMTQgMGEuNS41IDAgMCAwLTEgMHYxM2EuNS41IDAgMCAwIDEgMHYtMTNaTTQgNWExIDEgMCAwIDEgMS0xaDFhMSAxIDAgMCAxIDEgMXY2YTEgMSAwIDAgMS0xIDFINWExIDEgMCAwIDEtMS0xVjVabTUgMGExIDEgMCAwIDEgMS0xaDFhMSAxIDAgMCAxIDEgMXY2YTEgMSAwIDAgMS0xIDFoLTFhMSAxIDAgMCAxLTEtMVY1WlwiLz48L3N2Zz4nLFxyXG4gICdkaXN0cmlidXRlLXZlcnRpY2FsJzpcclxuICAgICc8c3ZnIHZpZXdCb3g9XCIwIDAgMTYgMTZcIiBmaWxsPVwiY3VycmVudENvbG9yXCI+PHBhdGggZD1cIk0xLjUgMWEuNS41IDAgMCAwIDAgMWgxM2EuNS41IDAgMCAwIDAtMWgtMTNabTAgMTRhLjUuNSAwIDAgMSAwLTFoMTNhLjUuNSAwIDAgMSAwIDFoLTEzWk01IDRhMSAxIDAgMCAwLTEgMXYxYTEgMSAwIDAgMCAxIDFoNmExIDEgMCAwIDAgMS0xVjVhMSAxIDAgMCAwLTEtMUg1Wm0wIDVhMSAxIDAgMCAwLTEgMXYxYTEgMSAwIDAgMCAxIDFoNmExIDEgMCAwIDAgMS0xdi0xYTEgMSAwIDAgMC0xLTFINVpcIi8+PC9zdmc+JyxcclxuXHJcbiAgLy8gRmxpcFxyXG4gIGZsaXA6ICc8c3ZnIHZpZXdCb3g9XCIwIDAgMTYgMTZcIiBmaWxsPVwiY3VycmVudENvbG9yXCI+PHBhdGggZD1cIk04IDBhLjUuNSAwIDAgMSAuNS41djE1YS41LjUgMCAwIDEtMSAwVi41QS41LjUgMCAwIDEgOCAwWk0yLjUgMkExLjUgMS41IDAgMCAwIDEgMy41djlBMS41IDEuNSAwIDAgMCAyLjUgMTRoNGEuNS41IDAgMCAwIDAtMWgtNGEuNS41IDAgMCAxLS41LS41di05YS41LjUgMCAwIDEgLjUtLjVoNGEuNS41IDAgMCAwIDAtMWgtNFptNyAwYS41LjUgMCAwIDAgMCAxaDRhLjUuNSAwIDAgMSAuNS41djlhLjUuNSAwIDAgMS0uNS41aC00YS41LjUgMCAwIDAgMCAxaDRhMS41IDEuNSAwIDAgMCAxLjUtMS41di05QTEuNSAxLjUgMCAwIDAgMTMuNSAyaC00WlwiLz48L3N2Zz4nLFxyXG4gICdmbGlwLWhvcml6b250YWwnOlxyXG4gICAgJzxzdmcgdmlld0JveD1cIjAgMCAxNiAxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIj48cGF0aCBkPVwiTTggMGEuNS41IDAgMCAxIC41LjV2MTVhLjUuNSAwIDAgMS0xIDBWLjVBLjUuNSAwIDAgMSA4IDBaTTIuNSAyQTEuNSAxLjUgMCAwIDAgMSAzLjV2OUExLjUgMS41IDAgMCAwIDIuNSAxNGg0YS41LjUgMCAwIDAgMC0xaC00YS41LjUgMCAwIDEtLjUtLjV2LTlhLjUuNSAwIDAgMSAuNS0uNWg0YS41LjUgMCAwIDAgMC0xaC00Wm03IDBhLjUuNSAwIDAgMCAwIDFoNGEuNS41IDAgMCAxIC41LjV2OWEuNS41IDAgMCAxLS41LjVoLTRhLjUuNSAwIDAgMCAwIDFoNGExLjUgMS41IDAgMCAwIDEuNS0xLjV2LTlBMS41IDEuNSAwIDAgMCAxMy41IDJoLTRaXCIvPjwvc3ZnPicsXHJcbiAgJ2ZsaXAtdmVydGljYWwnOlxyXG4gICAgJzxzdmcgdmlld0JveD1cIjAgMCAxNiAxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIj48cGF0aCBkPVwiTS41IDhhLjUuNSAwIDAgMCAuNS41aDE1YS41LjUgMCAwIDAgMC0xSDFBLjUuNSAwIDAgMCAuNSA4Wk0yIDIuNUExLjUgMS41IDAgMCAxIDMuNSAxaDlBMS41IDEuNSAwIDAgMSAxNCAyLjV2NGEuNS41IDAgMCAxLTEgMHYtNGEuNS41IDAgMCAwLS41LS41aC05YS41LjUgMCAwIDAtLjUuNXY0YS41LjUgMCAwIDEtMSAwdi00Wm0wIDExdi00YS41LjUgMCAwIDEgMSAwdjRhLjUuNSAwIDAgMCAuNS41aDlhLjUuNSAwIDAgMCAuNS0uNXYtNGEuNS41IDAgMCAxIDEgMHY0YTEuNSAxLjUgMCAwIDEtMS41IDEuNWgtOUExLjUgMS41IDAgMCAxIDIgMTMuNVpcIi8+PC9zdmc+JyxcclxuXHJcbiAgLy8gR3JvdXBcclxuICBncm91cDpcclxuICAgICc8c3ZnIHZpZXdCb3g9XCIwIDAgMTYgMTZcIiBmaWxsPVwiY3VycmVudENvbG9yXCI+PHBhdGggZD1cIk0xLjUgM0ExLjUgMS41IDAgMCAwIDAgNC41djdBMS41IDEuNSAwIDAgMCAxLjUgMTNIN2EuNS41IDAgMCAwIDAtMUgxLjVhLjUuNSAwIDAgMS0uNS0uNXYtN2EuNS41IDAgMCAxIC41LS41SDdhLjUuNSAwIDAgMCAwLTFIMS41Wk05IDRhLjUuNSAwIDAgMCAwIDFoNS41YS41LjUgMCAwIDEgLjUuNXY3YS41LjUgMCAwIDEtLjUuNUg5YS41LjUgMCAwIDAgMCAxaDUuNWExLjUgMS41IDAgMCAwIDEuNS0xLjV2LTdBMS41IDEuNSAwIDAgMCAxNC41IDNIOVpcIi8+PC9zdmc+JyxcclxuICB1bmdyb3VwOlxyXG4gICAgJzxzdmcgdmlld0JveD1cIjAgMCAxNiAxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIj48cGF0aCBkPVwiTTAgMS41QTEuNSAxLjUgMCAwIDEgMS41IDBoNUExLjUgMS41IDAgMCAxIDggMS41VjdIMS41QTEuNSAxLjUgMCAwIDEgMCA1LjV2LTRabTggMFY3aDYuNUExLjUgMS41IDAgMCAwIDE2IDUuNXYtNEExLjUgMS41IDAgMCAwIDE0LjUgMGgtNUExLjUgMS41IDAgMCAwIDggMS41Wm0tOCA4QTEuNSAxLjUgMCAwIDEgMS41IDhIOHY2LjVBMS41IDEuNSAwIDAgMSA2LjUgMTZoLTVBMS41IDEuNSAwIDAgMSAwIDE0LjV2LTVabTggMFYxNmg2YTEuNSAxLjUgMCAwIDAgMS41LTEuNXYtNUExLjUgMS41IDAgMCAwIDE0IDhIOFpcIi8+PC9zdmc+JyxcclxuICBsb2NrOiAnPHN2ZyB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiPjxwYXRoIGQ9XCJNOCAxYTIgMiAwIDAgMSAyIDJ2NEg2VjNhMiAyIDAgMCAxIDItMnptMyA2VjNhMyAzIDAgMCAwLTYgMHY0YTIgMiAwIDAgMC0yIDJ2NWEyIDIgMCAwIDAgMiAyaDZhMiAyIDAgMCAwIDItMlY5YTIgMiAwIDAgMC0yLTJ6TTUgOGg2YTEgMSAwIDAgMSAxIDF2NWExIDEgMCAwIDEtMSAxSDVhMSAxIDAgMCAxLTEtMVY5YTEgMSAwIDAgMSAxLTF6XCIvPjwvc3ZnPicsXHJcbiAgdW5sb2NrOlxyXG4gICAgJzxzdmcgdmlld0JveD1cIjAgMCAxNiAxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIj48cGF0aCBkPVwiTTExIDFhMiAyIDAgMCAwLTIgMnY0YTIgMiAwIDAgMSAyIDJ2NWEyIDIgMCAwIDEtMiAySDNhMiAyIDAgMCAxLTItMlY5YTIgMiAwIDAgMSAyLTJoNVYzYTMgMyAwIDAgMSA2IDB2NGEuNS41IDAgMCAxLTEgMFYzYTIgMiAwIDAgMC0yLTJ6TTMgOGExIDEgMCAwIDAtMSAxdjVhMSAxIDAgMCAwIDEgMWg2YTEgMSAwIDAgMCAxLTFWOWExIDEgMCAwIDAtMS0xSDN6XCIvPjwvc3ZnPicsXHJcblxyXG4gIC8vIFN1Ym1lbnUgYXJyb3dcclxuICAnYXJyb3ctcmlnaHQnOlxyXG4gICAgJzxzdmcgdmlld0JveD1cIjAgMCAxNiAxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIj48cGF0aCBkPVwiTTQuNjQ2IDEuNjQ2YS41LjUgMCAwIDEgLjcwOCAwbDYgNmEuNS41IDAgMCAxIDAgLjcwOGwtNiA2YS41LjUgMCAwIDEtLjcwOC0uNzA4TDEwLjI5MyA4IDQuNjQ2IDIuMzU0YS41LjUgMCAwIDEgMC0uNzA4elwiLz48L3N2Zz4nLFxyXG59O1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb250ZXh0TWVudUl0ZW0ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgbGFiZWw6IHN0cmluZztcclxuICBpY29uPzogc3RyaW5nO1xyXG4gIHNob3J0Y3V0Pzogc3RyaW5nO1xyXG4gIGVuYWJsZWQ6IGJvb2xlYW47XHJcbiAgdmlzaWJsZTogYm9vbGVhbjtcclxuICBhY3Rpb24/OiAoKSA9PiB2b2lkO1xyXG4gIGRpdmlkZXI/OiBib29sZWFuO1xyXG4gIHN1Ym1lbnU/OiBDb250ZXh0TWVudUl0ZW1bXTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb250ZXh0TWVudVNlY3Rpb24ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgaXRlbXM6IENvbnRleHRNZW51SXRlbVtdO1xyXG59XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnVTZXJ2aWNlIHtcclxuICBwcml2YXRlIHJlYWRvbmx5IGNvbnRleHRNZW51VmlzaWJsZVNpZ25hbCA9IHNpZ25hbChmYWxzZSk7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBjb250ZXh0TWVudVBvc2l0aW9uU2lnbmFsID0gc2lnbmFsKHsgeDogMCwgeTogMCB9KTtcclxuICBwcml2YXRlIHJlYWRvbmx5IGNvbnRhaW5lckJvdW5kc1NpZ25hbCA9IHNpZ25hbDxET01SZWN0IHwgbnVsbD4obnVsbCk7XHJcblxyXG4gIC8vIEtleWJvYXJkIG5hdmlnYXRpb24gc3RhdGVcclxuICBwcml2YXRlIHJlYWRvbmx5IGZvY3VzZWRJdGVtSW5kZXhTaWduYWwgPSBzaWduYWw8bnVtYmVyPigtMSk7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBmb2N1c2VkU3VibWVudUlkU2lnbmFsID0gc2lnbmFsPHN0cmluZyB8IG51bGw+KG51bGwpO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwaVNlcnZpY2U6IEFwaVNlcnZpY2UpIHt9XHJcblxyXG4gIC8vIENvbXB1dGVkIGNhY2hlIG9mIGFsbCBtZW51IGl0ZW1zIGZvciBrZXlib2FyZCBuYXZpZ2F0aW9uXHJcbiAgcHJpdmF0ZSByZWFkb25seSBhbGxNZW51SXRlbXNDYWNoZSA9IGNvbXB1dGVkKCgpID0+IHtcclxuICAgIGNvbnN0IHNlY3Rpb25zID0gdGhpcy5nZXRDb250ZXh0TWVudVNlY3Rpb25zKCkoKTtcclxuICAgIGNvbnN0IGFsbEl0ZW1zOiBDb250ZXh0TWVudUl0ZW1bXSA9IFtdO1xyXG4gICAgc2VjdGlvbnMuZm9yRWFjaCgoc2VjdGlvbikgPT4ge1xyXG4gICAgICBzZWN0aW9uLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICBhbGxJdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIGlmIChpdGVtLnN1Ym1lbnUgJiYgdGhpcy5mb2N1c2VkU3VibWVudUlkU2lnbmFsKCkgPT09IGl0ZW0uaWQpIHtcclxuICAgICAgICAgIGl0ZW0uc3VibWVudS5mb3JFYWNoKChzdWJJdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGFsbEl0ZW1zLnB1c2goc3ViSXRlbSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gYWxsSXRlbXM7XHJcbiAgfSk7XHJcblxyXG4gIC8vIEdldHRlcnMgZm9yIGNvbnRleHQgbWVudSBzdGF0ZVxyXG4gIGdldENvbnRleHRNZW51VmlzaWJsZSgpOiBTaWduYWw8Ym9vbGVhbj4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGV4dE1lbnVWaXNpYmxlU2lnbmFsLmFzUmVhZG9ubHkoKTtcclxuICB9XHJcblxyXG4gIGdldENvbnRleHRNZW51UG9zaXRpb24oKTogU2lnbmFsPHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGV4dE1lbnVQb3NpdGlvblNpZ25hbC5hc1JlYWRvbmx5KCk7XHJcbiAgfVxyXG5cclxuICBnZXRDb250YWluZXJCb3VuZHMoKTogU2lnbmFsPERPTVJlY3QgfCBudWxsPiB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXJCb3VuZHNTaWduYWwuYXNSZWFkb25seSgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Rm9jdXNlZEl0ZW1JbmRleCgpOiBTaWduYWw8bnVtYmVyPiB7XHJcbiAgICByZXR1cm4gdGhpcy5mb2N1c2VkSXRlbUluZGV4U2lnbmFsLmFzUmVhZG9ubHkoKTtcclxuICB9XHJcblxyXG4gIGdldEZvY3VzZWRTdWJtZW51SWQoKTogU2lnbmFsPHN0cmluZyB8IG51bGw+IHtcclxuICAgIHJldHVybiB0aGlzLmZvY3VzZWRTdWJtZW51SWRTaWduYWwuYXNSZWFkb25seSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29udGV4dCBtZW51IGNvbnRyb2wgbWV0aG9kc1xyXG4gIHNob3dDb250ZXh0TWVudSh4OiBudW1iZXIsIHk6IG51bWJlciwgY29udGFpbmVyQm91bmRzPzogRE9NUmVjdCk6IHZvaWQge1xyXG4gICAgdGhpcy5jb250ZXh0TWVudVBvc2l0aW9uU2lnbmFsLnNldCh7IHgsIHkgfSk7XHJcbiAgICB0aGlzLmNvbnRhaW5lckJvdW5kc1NpZ25hbC5zZXQoY29udGFpbmVyQm91bmRzIHx8IG51bGwpO1xyXG4gICAgdGhpcy5jb250ZXh0TWVudVZpc2libGVTaWduYWwuc2V0KHRydWUpO1xyXG4gICAgdGhpcy5mb2N1c2VkSXRlbUluZGV4U2lnbmFsLnNldCgtMSk7XHJcbiAgICB0aGlzLmZvY3VzZWRTdWJtZW51SWRTaWduYWwuc2V0KG51bGwpO1xyXG4gIH1cclxuXHJcbiAgaGlkZUNvbnRleHRNZW51KCk6IHZvaWQge1xyXG4gICAgdGhpcy5jb250ZXh0TWVudVZpc2libGVTaWduYWwuc2V0KGZhbHNlKTtcclxuICAgIHRoaXMuZm9jdXNlZEl0ZW1JbmRleFNpZ25hbC5zZXQoLTEpO1xyXG4gICAgdGhpcy5mb2N1c2VkU3VibWVudUlkU2lnbmFsLnNldChudWxsKTtcclxuICB9XHJcblxyXG4gIC8vIEdldCBjb250ZXh0IG1lbnUgc2VjdGlvbnMgd2l0aCBkeW5hbWljIGVuYWJsZS9kaXNhYmxlIGxvZ2ljXHJcbiAgZ2V0Q29udGV4dE1lbnVTZWN0aW9ucygpOiBTaWduYWw8Q29udGV4dE1lbnVTZWN0aW9uW10+IHtcclxuICAgIHJldHVybiBjb21wdXRlZCgoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGVkRWxlbWVudHMgPSB0aGlzLmFwaVNlcnZpY2UuZ2V0U2VsZWN0ZWRFbGVtZW50cygpO1xyXG4gICAgICBjb25zdCBoYXNTZWxlY3Rpb24gPSBzZWxlY3RlZEVsZW1lbnRzLmxlbmd0aCA+IDA7XHJcbiAgICAgIGNvbnN0IGhhc011bHRpcGxlU2VsZWN0aW9uID0gc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggPiAxO1xyXG4gICAgICBjb25zdCBjYW5EaXN0cmlidXRlID0gc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggPiAyO1xyXG4gICAgICBjb25zdCBjbGlwYm9hcmRJbmZvID0gdGhpcy5hcGlTZXJ2aWNlLmdldENsaXBib2FyZEluZm8oKTtcclxuICAgICAgY29uc3QgaGFzQ2xpcGJvYXJkRGF0YSA9IGNsaXBib2FyZEluZm8gIT09IG51bGwgJiYgY2xpcGJvYXJkSW5mby5lbGVtZW50Q291bnQgPiAwO1xyXG4gICAgICBjb25zdCBoYXNHcm91cGVkRWxlbWVudHMgPSBoYXNTZWxlY3Rpb24gJiYgc2VsZWN0ZWRFbGVtZW50cy5zb21lKChlbCkgPT4gZWwuZ3JvdXBJZCk7XHJcbiAgICAgIGNvbnN0IGhhc0xvY2tlZEVsZW1lbnRzID0gaGFzU2VsZWN0aW9uICYmIHNlbGVjdGVkRWxlbWVudHMuc29tZSgoZWwpID0+IGVsLmxvY2tlZCk7XHJcbiAgICAgIGNvbnN0IGhhc1VubG9ja2VkRWxlbWVudHMgPSBoYXNTZWxlY3Rpb24gJiYgc2VsZWN0ZWRFbGVtZW50cy5zb21lKChlbCkgPT4gIWVsLmxvY2tlZCk7XHJcblxyXG4gICAgICBjb25zdCBzZWN0aW9uczogQ29udGV4dE1lbnVTZWN0aW9uW10gPSBbXHJcbiAgICAgICAgLy8g8J+TiyBDTElQQk9BUkRcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ2NsaXBib2FyZCcsXHJcbiAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgaWQ6ICdjdXQnLFxyXG4gICAgICAgICAgICAgIGxhYmVsOiAnQ3V0JyxcclxuICAgICAgICAgICAgICBzaG9ydGN1dDogJ0N0cmwrWCcsXHJcbiAgICAgICAgICAgICAgZW5hYmxlZDogaGFzU2VsZWN0aW9uLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IGhhc1NlbGVjdGlvbixcclxuICAgICAgICAgICAgICBhY3Rpb246ICgpID0+IHRoaXMuYXBpU2VydmljZS5jdXRFbGVtZW50cygpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgaWQ6ICdjb3B5JyxcclxuICAgICAgICAgICAgICBsYWJlbDogJ0NvcHknLFxyXG4gICAgICAgICAgICAgIHNob3J0Y3V0OiAnQ3RybCtDJyxcclxuICAgICAgICAgICAgICBlbmFibGVkOiBoYXNTZWxlY3Rpb24sXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogaGFzU2VsZWN0aW9uLFxyXG4gICAgICAgICAgICAgIGFjdGlvbjogKCkgPT4gdGhpcy5hcGlTZXJ2aWNlLmNvcHlFbGVtZW50cygpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgaWQ6ICdwYXN0ZScsXHJcbiAgICAgICAgICAgICAgbGFiZWw6ICdQYXN0ZScsXHJcbiAgICAgICAgICAgICAgc2hvcnRjdXQ6ICdDdHJsK1YnLFxyXG4gICAgICAgICAgICAgIGVuYWJsZWQ6IGhhc0NsaXBib2FyZERhdGEsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogaGFzQ2xpcGJvYXJkRGF0YSxcclxuICAgICAgICAgICAgICBhY3Rpb246ICgpID0+IHRoaXMuYXBpU2VydmljZS5wYXN0ZUVsZW1lbnRzKCksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBpZDogJ2R1cGxpY2F0ZScsXHJcbiAgICAgICAgICAgICAgbGFiZWw6ICdEdXBsaWNhdGUnLFxyXG4gICAgICAgICAgICAgIHNob3J0Y3V0OiAnQ3RybCtEJyxcclxuICAgICAgICAgICAgICBlbmFibGVkOiBoYXNTZWxlY3Rpb24sXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogaGFzU2VsZWN0aW9uLFxyXG4gICAgICAgICAgICAgIGRpdmlkZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgYWN0aW9uOiAoKSA9PiB0aGlzLmFwaVNlcnZpY2UuZHVwbGljYXRlRWxlbWVudHMoKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g8J+OryBTRUxFQ1RJT05cclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3NlbGVjdGlvbicsXHJcbiAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgaWQ6ICdzZWxlY3QtYWxsJyxcclxuICAgICAgICAgICAgICBsYWJlbDogJ1NlbGVjdCBBbGwnLFxyXG4gICAgICAgICAgICAgIHNob3J0Y3V0OiAnQ3RybCtBJyxcclxuICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgYWN0aW9uOiAoKSA9PiB0aGlzLmFwaVNlcnZpY2Uuc2VsZWN0QWxsKCksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBpZDogJ2RlbGV0ZScsXHJcbiAgICAgICAgICAgICAgbGFiZWw6ICdEZWxldGUnLFxyXG4gICAgICAgICAgICAgIHNob3J0Y3V0OiAnRGVsJyxcclxuICAgICAgICAgICAgICBlbmFibGVkOiBoYXNTZWxlY3Rpb24sXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogaGFzU2VsZWN0aW9uLFxyXG4gICAgICAgICAgICAgIGRpdmlkZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgYWN0aW9uOiAoKSA9PiB0aGlzLmFwaVNlcnZpY2UuZGVsZXRlU2VsZWN0ZWRFbGVtZW50cygpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDwn46oIEFSUkFOR0VcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ2FycmFuZ2UnLFxyXG4gICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGlkOiAnb3JkZXInLFxyXG4gICAgICAgICAgICAgIGxhYmVsOiAnT3JkZXInLFxyXG4gICAgICAgICAgICAgIGVuYWJsZWQ6IGhhc1NlbGVjdGlvbixcclxuICAgICAgICAgICAgICB2aXNpYmxlOiBoYXNTZWxlY3Rpb24sXHJcbiAgICAgICAgICAgICAgc3VibWVudTogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBpZDogJ2JyaW5nLXRvLWZyb250JyxcclxuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdCcmluZyB0byBGcm9udCcsXHJcbiAgICAgICAgICAgICAgICAgIHNob3J0Y3V0OiAnQ3RybCtTaGlmdCtdJyxcclxuICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgYWN0aW9uOiAoKSA9PiB0aGlzLmFwaVNlcnZpY2UuYnJpbmdUb0Zyb250KCksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBpZDogJ2JyaW5nLWZvcndhcmQnLFxyXG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ0JyaW5nIEZvcndhcmQnLFxyXG4gICAgICAgICAgICAgICAgICBzaG9ydGN1dDogJ0N0cmwrXScsXHJcbiAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGFjdGlvbjogKCkgPT4gdGhpcy5hcGlTZXJ2aWNlLmJyaW5nRm9yd2FyZCgpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgaWQ6ICdzZW5kLWJhY2t3YXJkJyxcclxuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdTZW5kIEJhY2t3YXJkJyxcclxuICAgICAgICAgICAgICAgICAgc2hvcnRjdXQ6ICdDdHJsK1snLFxyXG4gICAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBhY3Rpb246ICgpID0+IHRoaXMuYXBpU2VydmljZS5zZW5kQmFja3dhcmQoKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIGlkOiAnc2VuZC10by1iYWNrJyxcclxuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdTZW5kIHRvIEJhY2snLFxyXG4gICAgICAgICAgICAgICAgICBzaG9ydGN1dDogJ0N0cmwrU2hpZnQrWycsXHJcbiAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGFjdGlvbjogKCkgPT4gdGhpcy5hcGlTZXJ2aWNlLnNlbmRUb0JhY2soKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGlkOiAndHJhbnNmb3JtJyxcclxuICAgICAgICAgICAgICBsYWJlbDogJ1RyYW5zZm9ybScsXHJcbiAgICAgICAgICAgICAgZW5hYmxlZDogaGFzU2VsZWN0aW9uLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IGhhc1NlbGVjdGlvbixcclxuICAgICAgICAgICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIGlkOiAnYWxpZ24tbGVmdCcsXHJcbiAgICAgICAgICAgICAgICAgIGxhYmVsOiAnQWxpZ24gTGVmdCcsXHJcbiAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGFjdGlvbjogKCkgPT4gdGhpcy5hcGlTZXJ2aWNlLmFsaWduRWxlbWVudHMoQWxpZ25tZW50VHlwZS5MZWZ0KSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIGlkOiAnYWxpZ24tY2VudGVyJyxcclxuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdBbGlnbiBDZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBhY3Rpb246ICgpID0+IHRoaXMuYXBpU2VydmljZS5hbGlnbkVsZW1lbnRzKEFsaWdubWVudFR5cGUuQ2VudGVyKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIGlkOiAnYWxpZ24tcmlnaHQnLFxyXG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ0FsaWduIFJpZ2h0JyxcclxuICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgZGl2aWRlcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgYWN0aW9uOiAoKSA9PiB0aGlzLmFwaVNlcnZpY2UuYWxpZ25FbGVtZW50cyhBbGlnbm1lbnRUeXBlLlJpZ2h0KSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIGlkOiAnYWxpZ24tdG9wJyxcclxuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdBbGlnbiBUb3AnLFxyXG4gICAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBhY3Rpb246ICgpID0+IHRoaXMuYXBpU2VydmljZS5hbGlnbkVsZW1lbnRzKEFsaWdubWVudFR5cGUuVG9wKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIGlkOiAnYWxpZ24tbWlkZGxlJyxcclxuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdBbGlnbiBNaWRkbGUnLFxyXG4gICAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBhY3Rpb246ICgpID0+IHRoaXMuYXBpU2VydmljZS5hbGlnbkVsZW1lbnRzKEFsaWdubWVudFR5cGUuTWlkZGxlKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIGlkOiAnYWxpZ24tYm90dG9tJyxcclxuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdBbGlnbiBCb3R0b20nLFxyXG4gICAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBkaXZpZGVyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBhY3Rpb246ICgpID0+IHRoaXMuYXBpU2VydmljZS5hbGlnbkVsZW1lbnRzKEFsaWdubWVudFR5cGUuQm90dG9tKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIGlkOiAnZGlzdHJpYnV0ZS1ob3Jpem9udGFsJyxcclxuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdEaXN0cmlidXRlIEhvcml6b250YWxseScsXHJcbiAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGNhbkRpc3RyaWJ1dGUsXHJcbiAgICAgICAgICAgICAgICAgIHZpc2libGU6IGNhbkRpc3RyaWJ1dGUsXHJcbiAgICAgICAgICAgICAgICAgIGFjdGlvbjogKCkgPT4gdGhpcy5hcGlTZXJ2aWNlLmRpc3RyaWJ1dGVIb3Jpem9udGFsbHkoKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIGlkOiAnZGlzdHJpYnV0ZS12ZXJ0aWNhbCcsXHJcbiAgICAgICAgICAgICAgICAgIGxhYmVsOiAnRGlzdHJpYnV0ZSBWZXJ0aWNhbGx5JyxcclxuICAgICAgICAgICAgICAgICAgZW5hYmxlZDogY2FuRGlzdHJpYnV0ZSxcclxuICAgICAgICAgICAgICAgICAgdmlzaWJsZTogY2FuRGlzdHJpYnV0ZSxcclxuICAgICAgICAgICAgICAgICAgZGl2aWRlcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgYWN0aW9uOiAoKSA9PiB0aGlzLmFwaVNlcnZpY2UuZGlzdHJpYnV0ZVZlcnRpY2FsbHkoKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIGlkOiAnZmxpcC1ob3Jpem9udGFsJyxcclxuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdGbGlwIEhvcml6b250YWwnLFxyXG4gICAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBhY3Rpb246ICgpID0+IHRoaXMuYXBpU2VydmljZS5mbGlwSG9yaXpvbnRhbCgpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgaWQ6ICdmbGlwLXZlcnRpY2FsJyxcclxuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdGbGlwIFZlcnRpY2FsJyxcclxuICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgYWN0aW9uOiAoKSA9PiB0aGlzLmFwaVNlcnZpY2UuZmxpcFZlcnRpY2FsKCksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIO+/vSBPQkpFQ1RcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ29iamVjdCcsXHJcbiAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgaWQ6ICdncm91cCcsXHJcbiAgICAgICAgICAgICAgbGFiZWw6ICdHcm91cCcsXHJcbiAgICAgICAgICAgICAgc2hvcnRjdXQ6ICdDdHJsK0cnLFxyXG4gICAgICAgICAgICAgIGVuYWJsZWQ6IGhhc011bHRpcGxlU2VsZWN0aW9uLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IGhhc011bHRpcGxlU2VsZWN0aW9uLFxyXG4gICAgICAgICAgICAgIGFjdGlvbjogKCkgPT4gdGhpcy5hcGlTZXJ2aWNlLmdyb3VwU2VsZWN0ZWRFbGVtZW50cygpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgaWQ6ICd1bmdyb3VwJyxcclxuICAgICAgICAgICAgICBsYWJlbDogJ1VuZ3JvdXAnLFxyXG4gICAgICAgICAgICAgIHNob3J0Y3V0OiAnQ3RybCtTaGlmdCtHJyxcclxuICAgICAgICAgICAgICBlbmFibGVkOiBoYXNHcm91cGVkRWxlbWVudHMsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogaGFzR3JvdXBlZEVsZW1lbnRzLFxyXG4gICAgICAgICAgICAgIGFjdGlvbjogKCkgPT4gdGhpcy5hcGlTZXJ2aWNlLnVuZ3JvdXBTZWxlY3RlZEVsZW1lbnRzKCksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBpZDogJ2xvY2snLFxyXG4gICAgICAgICAgICAgIGxhYmVsOiAnTG9jaycsXHJcbiAgICAgICAgICAgICAgc2hvcnRjdXQ6ICdDdHJsK0wnLFxyXG4gICAgICAgICAgICAgIGVuYWJsZWQ6IGhhc1VubG9ja2VkRWxlbWVudHMsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogaGFzVW5sb2NrZWRFbGVtZW50cyxcclxuICAgICAgICAgICAgICBhY3Rpb246ICgpID0+IHRoaXMuYXBpU2VydmljZS5sb2NrRWxlbWVudHMoKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGlkOiAndW5sb2NrJyxcclxuICAgICAgICAgICAgICBsYWJlbDogJ1VubG9jaycsXHJcbiAgICAgICAgICAgICAgc2hvcnRjdXQ6ICdDdHJsK1NoaWZ0K0wnLFxyXG4gICAgICAgICAgICAgIGVuYWJsZWQ6IGhhc0xvY2tlZEVsZW1lbnRzLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IGhhc0xvY2tlZEVsZW1lbnRzLFxyXG4gICAgICAgICAgICAgIGFjdGlvbjogKCkgPT4gdGhpcy5hcGlTZXJ2aWNlLnVubG9ja0VsZW1lbnRzKCksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF07XHJcblxyXG4gICAgICAvLyBGaWx0ZXIgb3V0IGVtcHR5IHNlY3Rpb25zIChzZWN0aW9ucyB3aXRoIG5vIHZpc2libGUgaXRlbXMpXHJcbiAgICAgIGNvbnN0IGZpbHRlcmVkU2VjdGlvbnMgPSBzZWN0aW9uc1xyXG4gICAgICAgIC5tYXAoKHNlY3Rpb24pID0+ICh7XHJcbiAgICAgICAgICAuLi5zZWN0aW9uLFxyXG4gICAgICAgICAgaXRlbXM6IHNlY3Rpb24uaXRlbXMuZmlsdGVyKChpdGVtKSA9PiBpdGVtLnZpc2libGUpLFxyXG4gICAgICAgIH0pKVxyXG4gICAgICAgIC5maWx0ZXIoKHNlY3Rpb24pID0+IHNlY3Rpb24uaXRlbXMubGVuZ3RoID4gMCk7XHJcblxyXG4gICAgICByZXR1cm4gZmlsdGVyZWRTZWN0aW9ucztcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gRXhlY3V0ZSBhY3Rpb24gYW5kIGhpZGUgbWVudVxyXG4gIGV4ZWN1dGVBY3Rpb24oYWN0aW9uOiAoKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBhY3Rpb24oKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGV4ZWN1dGluZyBjb250ZXh0IG1lbnUgYWN0aW9uOicsIGVycm9yKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMuaGlkZUNvbnRleHRNZW51KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBLZXlib2FyZCBuYXZpZ2F0aW9uIG1ldGhvZHNcclxuICBmb2N1c05leHRJdGVtKCk6IHZvaWQge1xyXG4gICAgY29uc3QgYWxsSXRlbXMgPSB0aGlzLmFsbE1lbnVJdGVtc0NhY2hlKCk7XHJcbiAgICBjb25zdCBlbmFibGVkSXRlbXMgPSBhbGxJdGVtcy5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0uZW5hYmxlZCk7XHJcbiAgICBpZiAoZW5hYmxlZEl0ZW1zLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHRoaXMuZm9jdXNlZEl0ZW1JbmRleFNpZ25hbCgpO1xyXG4gICAgY29uc3QgY3VycmVudEl0ZW0gPSBjdXJyZW50SW5kZXggPj0gMCA/IGFsbEl0ZW1zW2N1cnJlbnRJbmRleF0gOiBudWxsO1xyXG4gICAgY29uc3QgY3VycmVudEVuYWJsZWRJbmRleCA9IGN1cnJlbnRJdGVtID8gZW5hYmxlZEl0ZW1zLmluZGV4T2YoY3VycmVudEl0ZW0pIDogLTE7XHJcblxyXG4gICAgY29uc3QgbmV4dEVuYWJsZWRJbmRleCA9IChjdXJyZW50RW5hYmxlZEluZGV4ICsgMSkgJSBlbmFibGVkSXRlbXMubGVuZ3RoO1xyXG4gICAgY29uc3QgbmV4dEl0ZW0gPSBlbmFibGVkSXRlbXNbbmV4dEVuYWJsZWRJbmRleF07XHJcbiAgICBjb25zdCBuZXh0SW5kZXggPSBhbGxJdGVtcy5pbmRleE9mKG5leHRJdGVtKTtcclxuXHJcbiAgICB0aGlzLmZvY3VzZWRJdGVtSW5kZXhTaWduYWwuc2V0KG5leHRJbmRleCk7XHJcbiAgfVxyXG5cclxuICBmb2N1c1ByZXZpb3VzSXRlbSgpOiB2b2lkIHtcclxuICAgIGNvbnN0IGFsbEl0ZW1zID0gdGhpcy5hbGxNZW51SXRlbXNDYWNoZSgpO1xyXG4gICAgY29uc3QgZW5hYmxlZEl0ZW1zID0gYWxsSXRlbXMuZmlsdGVyKChpdGVtKSA9PiBpdGVtLmVuYWJsZWQpO1xyXG4gICAgaWYgKGVuYWJsZWRJdGVtcy5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBjdXJyZW50SW5kZXggPSB0aGlzLmZvY3VzZWRJdGVtSW5kZXhTaWduYWwoKTtcclxuICAgIGNvbnN0IGN1cnJlbnRJdGVtID0gY3VycmVudEluZGV4ID49IDAgPyBhbGxJdGVtc1tjdXJyZW50SW5kZXhdIDogbnVsbDtcclxuICAgIGNvbnN0IGN1cnJlbnRFbmFibGVkSW5kZXggPSBjdXJyZW50SXRlbSA/IGVuYWJsZWRJdGVtcy5pbmRleE9mKGN1cnJlbnRJdGVtKSA6IC0xO1xyXG5cclxuICAgIGNvbnN0IHByZXZFbmFibGVkSW5kZXggPSBjdXJyZW50RW5hYmxlZEluZGV4IDw9IDAgPyBlbmFibGVkSXRlbXMubGVuZ3RoIC0gMSA6IGN1cnJlbnRFbmFibGVkSW5kZXggLSAxO1xyXG4gICAgY29uc3QgcHJldkl0ZW0gPSBlbmFibGVkSXRlbXNbcHJldkVuYWJsZWRJbmRleF07XHJcbiAgICBjb25zdCBwcmV2SW5kZXggPSBhbGxJdGVtcy5pbmRleE9mKHByZXZJdGVtKTtcclxuXHJcbiAgICB0aGlzLmZvY3VzZWRJdGVtSW5kZXhTaWduYWwuc2V0KHByZXZJbmRleCk7XHJcbiAgfVxyXG5cclxuICBmb2N1c0ZpcnN0SXRlbSgpOiB2b2lkIHtcclxuICAgIGNvbnN0IGFsbEl0ZW1zID0gdGhpcy5hbGxNZW51SXRlbXNDYWNoZSgpO1xyXG4gICAgY29uc3QgZW5hYmxlZEl0ZW1zID0gYWxsSXRlbXMuZmlsdGVyKChpdGVtKSA9PiBpdGVtLmVuYWJsZWQpO1xyXG4gICAgaWYgKGVuYWJsZWRJdGVtcy5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBmaXJzdEl0ZW0gPSBlbmFibGVkSXRlbXNbMF07XHJcbiAgICBjb25zdCBmaXJzdEluZGV4ID0gYWxsSXRlbXMuaW5kZXhPZihmaXJzdEl0ZW0pO1xyXG4gICAgdGhpcy5mb2N1c2VkSXRlbUluZGV4U2lnbmFsLnNldChmaXJzdEluZGV4KTtcclxuICB9XHJcblxyXG4gIGZvY3VzTGFzdEl0ZW0oKTogdm9pZCB7XHJcbiAgICBjb25zdCBhbGxJdGVtcyA9IHRoaXMuYWxsTWVudUl0ZW1zQ2FjaGUoKTtcclxuICAgIGNvbnN0IGVuYWJsZWRJdGVtcyA9IGFsbEl0ZW1zLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5lbmFibGVkKTtcclxuICAgIGlmIChlbmFibGVkSXRlbXMubGVuZ3RoID09PSAwKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgbGFzdEl0ZW0gPSBlbmFibGVkSXRlbXNbZW5hYmxlZEl0ZW1zLmxlbmd0aCAtIDFdO1xyXG4gICAgY29uc3QgbGFzdEluZGV4ID0gYWxsSXRlbXMuaW5kZXhPZihsYXN0SXRlbSk7XHJcbiAgICB0aGlzLmZvY3VzZWRJdGVtSW5kZXhTaWduYWwuc2V0KGxhc3RJbmRleCk7XHJcbiAgfVxyXG5cclxuICBvcGVuRm9jdXNlZFN1Ym1lbnUoKTogdm9pZCB7XHJcbiAgICBjb25zdCBhbGxJdGVtcyA9IHRoaXMuYWxsTWVudUl0ZW1zQ2FjaGUoKTtcclxuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHRoaXMuZm9jdXNlZEl0ZW1JbmRleFNpZ25hbCgpO1xyXG4gICAgaWYgKGN1cnJlbnRJbmRleCA8IDAgfHwgY3VycmVudEluZGV4ID49IGFsbEl0ZW1zLmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGl0ZW0gPSBhbGxJdGVtc1tjdXJyZW50SW5kZXhdO1xyXG4gICAgaWYgKGl0ZW0uc3VibWVudSAmJiBpdGVtLmVuYWJsZWQpIHtcclxuICAgICAgdGhpcy5mb2N1c2VkU3VibWVudUlkU2lnbmFsLnNldChpdGVtLmlkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNsb3NlRm9jdXNlZFN1Ym1lbnUoKTogdm9pZCB7XHJcbiAgICB0aGlzLmZvY3VzZWRTdWJtZW51SWRTaWduYWwuc2V0KG51bGwpO1xyXG4gIH1cclxuXHJcbiAgZXhlY3V0ZUZvY3VzZWRBY3Rpb24oKTogdm9pZCB7XHJcbiAgICBjb25zdCBhbGxJdGVtcyA9IHRoaXMuYWxsTWVudUl0ZW1zQ2FjaGUoKTtcclxuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHRoaXMuZm9jdXNlZEl0ZW1JbmRleFNpZ25hbCgpO1xyXG4gICAgaWYgKGN1cnJlbnRJbmRleCA8IDAgfHwgY3VycmVudEluZGV4ID49IGFsbEl0ZW1zLmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGl0ZW0gPSBhbGxJdGVtc1tjdXJyZW50SW5kZXhdO1xyXG4gICAgaWYgKGl0ZW0uZW5hYmxlZCAmJiBpdGVtLmFjdGlvbikge1xyXG4gICAgICB0aGlzLmV4ZWN1dGVBY3Rpb24oaXRlbS5hY3Rpb24pO1xyXG4gICAgfSBlbHNlIGlmIChpdGVtLnN1Ym1lbnUgJiYgaXRlbS5lbmFibGVkKSB7XHJcbiAgICAgIHRoaXMub3BlbkZvY3VzZWRTdWJtZW51KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgaWNvbiBTVkdcclxuICBnZXRJY29uKGljb25OYW1lPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmICghaWNvbk5hbWUpIHJldHVybiAnJztcclxuICAgIHJldHVybiBDT05URVhUX01FTlVfSUNPTlNbaWNvbk5hbWVdIHx8ICcnO1xyXG4gIH1cclxuXHJcbiAgLy8gR2V0IGFsbCBtZW51IGl0ZW1zIChmb3Iga2V5Ym9hcmQgbmF2aWdhdGlvbilcclxuICBnZXRBbGxNZW51SXRlbXMoKTogQ29udGV4dE1lbnVJdGVtW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuYWxsTWVudUl0ZW1zQ2FjaGUoKTtcclxuICB9XHJcbn1cclxuIl19