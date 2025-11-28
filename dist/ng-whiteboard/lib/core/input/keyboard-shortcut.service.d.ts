import * as i0 from "@angular/core";
export declare class KeyboardShortcutService {
    private configService;
    private apiService;
    toggleKeyboardShortcuts(): void;
    handleKeyDown(event: KeyboardEvent): void;
    handleKeyUp(event: KeyboardEvent): void;
    private isInputFocused;
    private handleKeyDownShortcuts;
    static ɵfac: i0.ɵɵFactoryDeclaration<KeyboardShortcutService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<KeyboardShortcutService>;
}
