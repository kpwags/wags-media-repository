import { useQuery } from '@tanstack/react-query';

import { Api } from '@lib/api';

import { BookSeries } from '@models/Book';

const useBookSeries = () => {
    const {
        data,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['book-series'],
        queryFn: async () => {
            const [data, error] = await await Api.Get<BookSeries[]>('book/series');

            if (error) {
                return Promise.reject(new Error(error));
            }

            return data;
        },
        staleTime: 3600000,
    });

    return {
        bookSeries: data,
        error,
        isLoading,
    };
};

export default useBookSeries;
