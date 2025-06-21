/**
 * @description doesn't work with combined flags like "-rf", please use normalizeArgs before
 * @todo please consider using parseArgs from node:utils
 */
export declare const parseArgs: (args: string[]) => Map<string, string>;
