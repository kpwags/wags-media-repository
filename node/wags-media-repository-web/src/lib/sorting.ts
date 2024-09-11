export const sortByDate = (a: string | undefined, b: string | undefined) => {
    try {
        const date1 = new Date(a ?? '1/1/1900');
        const date2 = new Date(b ?? '1/1/1900');

        return date2.getTime() - date1.getTime();
    } catch {
        return 0;
    }
}

export const sortByTitle = (a: string, b: string) => {
    const articles = ['a', 'an', 'the'],
        re = new RegExp('^(?:(' + articles.join('|') + ') )(.*)$'), // e.g. /^(?:(foo|bar) )(.*)$/
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        replacor = function (_: any, $1: string, $2: string) {
            return $2 + ', ' + $1;
        };
    a = a.toLowerCase().replace(re, replacor);
    b = b.toLowerCase().replace(re, replacor);

    return a === b ? 0 : a < b ? -1 : 1;
}