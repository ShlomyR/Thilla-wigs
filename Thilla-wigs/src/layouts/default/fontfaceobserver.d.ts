declare module 'fontfaceobserver' {
    class FontFaceObserver {
        constructor(family: string, options?: FontFaceObserver.FontFaceObserverOptions);
        load(): Promise<void>;
    }

    namespace FontFaceObserver {
        interface FontFaceObserverOptions {
            weight?: string | number;
            style?: string;
            stretch?: string;
            unicodeRange?: string;
        }
    }

    export = FontFaceObserver;
}
