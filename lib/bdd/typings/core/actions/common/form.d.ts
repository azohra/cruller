export function getValue(selector: string): Promise<any>;
export function hasValue(selector: string, text: string | number): Promise<void>;
export function fillInFormField(selector: string, value: string): Promise<void>;
export function emptyFormField(selector: string): Promise<void>;
export function selectValueFromField(value: string, selector: string): Promise<void>;
