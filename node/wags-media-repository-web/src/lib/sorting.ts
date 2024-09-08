export const sortByDate = (a: string | undefined, b: string | undefined) => {
    try {
        const date1 = new Date(a ?? '1/1/1900');
        const date2 = new Date(b ?? '1/1/1900');

        return date2.getTime() - date1.getTime();
    } catch {
        return 0;
    }
}