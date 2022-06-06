import { FileType } from "./file-type.enum";
/**
 * {@link generateOutputPath} is used to assemble full file path from a filename and various parameters
 * @param filename The base filename
 * @param params A config object which allows to configure {@link FileType}, base path, filename prefix and filename postfix
 */
export declare const generateOutputPath: (filename: string, params?: {
    type?: FileType | undefined;
    path?: string | undefined;
    prefix?: string | undefined;
    postfix?: string | undefined;
} | undefined) => string;
//# sourceMappingURL=generate-output-path.function.d.ts.map