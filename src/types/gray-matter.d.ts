declare module 'gray-matter' {
    function matter(input: string): {
        data: {
            [key: string]: string | number | boolean | Date | Array<unknown> | Record<string, unknown>
        };
        content: string;
    };
    export default matter;
}
