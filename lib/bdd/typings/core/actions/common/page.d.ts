export function reloadPage(): Promise<void>;
export function hasPageTitle(value: string): Promise<void>;
export function waitForPageNavigation(): Promise<void>;
export function goToURL(value: string, incognito?: boolean): Promise<any>;
export function autoScroll(): Promise<void>;
