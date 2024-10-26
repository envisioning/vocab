declare module 'marked' {
    export class Marked {
        parse(markdown: string): string;
    }
    
    export const marked: {
        parse(markdown: string): string;
    };
}