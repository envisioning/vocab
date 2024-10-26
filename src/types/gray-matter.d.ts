declare module 'gray-matter' {
    function matter(input: string): {
        data: { [key: string]: any };
        content: string;
    };
    export default matter;
}