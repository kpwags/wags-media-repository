export const getMaxValue = (arr: number[]): number => {
    if (arr.length === 0) {
        return 0;
    }

    return Math.max(...arr);
}