/** @description converts ["-tg", "-r", "-f", test, -p folder] to { "-t": '', "-g": '', "-r": '', "-f": 'test', "test": '', "-p": 'folder', "folder": '' } */
export declare const parseArgs: (args: string[]) => Map<string, string>;
