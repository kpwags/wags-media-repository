const calculateProgress = (current: number | undefined, final: number | undefined): number => {
    const currentNumber = current ?? 0;
    const finalNumber = final ?? 0;

    if (finalNumber === 0) {
        return 0;
    }

    return Math.round((currentNumber / finalNumber) * 100);
};

export default calculateProgress;
