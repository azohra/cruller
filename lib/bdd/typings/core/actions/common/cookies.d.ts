export function setCookie(name: string, value: string | number): Promise<any>;
export function setCookies(data: any): Promise<[any, any, any, any, any, any, any, any, any, any]>;
export function getCookie(name: string, value: string | number): Promise<void>;
export function getCookies(data: any): Promise<[any, any, any, any, any, any, any, any, any, any]>;
export function deleteCookie(name: string): Promise<any>;
export function deleteCookies(data: any): Promise<[any, any, any, any, any, any, any, any, any, any]>;
