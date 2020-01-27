export const a11y: {
    createA11yReport: (results: any) => Promise<any>;
    checkPageA11y: () => Promise<any>;
    checkElementA11y: (selector: string) => Promise<any>;
};
export const cookies: {
    setCookie: (name: string, value: string | number) => Promise<any>;
    setCookies: (data: any) => Promise<[any, any, any, any, any, any, any, any, any, any]>;
    getCookie: (name: string, value: string | number) => Promise<void>;
    getCookies: (data: any) => Promise<[any, any, any, any, any, any, any, any, any, any]>;
    deleteCookie: (name: string) => Promise<any>;
    deleteCookies: (data: any) => Promise<[any, any, any, any, any, any, any, any, any, any]>;
};
export const browser: {
    closeBrowser: () => Promise<void>;
    openBrowser: () => Promise<void>;
};
export const element: {
    focusItem: (selector: string) => Promise<any>;
    hoverItem: (selector: string) => Promise<any>;
    clickItem: (selector: string) => Promise<any>;
    hasText: (selector: string, value: string) => Promise<void>;
    clickOnIframeElement: (elSelector: string, iframeSelector: string) => Promise<any>;
};
export const keyboard: {
    pressKeyboardButton: (value: string) => Promise<any>;
    pressTab: () => Promise<any>;
    pressEnter: () => Promise<any>;
    typeText: (value: string, delay?: number) => Promise<any>;
};
export const form: {
    getValue: (selector: string) => Promise<any>;
    hasValue: (selector: string, text: string | number) => Promise<void>;
    fillInFormField: (selector: string, value: string) => Promise<void>;
    emptyFormField: (selector: string) => Promise<void>;
    selectValueFromField: (value: string, selector: string) => Promise<void>;
};
export const page: {
    reloadPage: () => Promise<void>;
    hasPageTitle: (value: string) => Promise<void>;
    waitForPageNavigation: () => Promise<void>;
    goToURL: (value: string, incognito?: boolean) => Promise<any>;
    autoScroll: () => Promise<void>;
};
export const utils: {
    delay: (duration: number) => Promise<any>;
    wait: (timeInSeconds: number) => Promise<void>;
    setBreakpoint: (value: string) => void;
    elementPresent: (selector: string, context: any) => Promise<any>;
    takeScreenshot: (value: string) => Promise<any>;
};
