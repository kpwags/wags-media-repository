const buildBookTitle = (title: string, subtitle?: string): string => {
    if ((subtitle ?? '').trim().length === 0) {
        return title;
    }

    return `${title}: ${subtitle}`;
};

export default buildBookTitle;
