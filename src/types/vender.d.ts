declare interface IOptions {
  [key: string]: any;
}

declare interface KeyValue {
  [key: string]: string | undefined;
}

declare interface Next {
  (): Promise<any>;
}

declare interface staticFileOptions extends IOptions {
  root?: string;
  location?: string;
  path?: string;
  sendDefault?: boolean;
}
