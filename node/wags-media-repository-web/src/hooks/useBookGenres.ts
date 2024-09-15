import { useQuery } from '@tanstack/react-query';

import { Api } from '@lib/api';

import { BookGenre } from '@models/Book';

const useBookGenres = () => {
    const {
        data,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['book-genres'],
        queryFn: async () => {
            const [data, error] = await await Api.Get<BookGenre[]>('book/genre');

            if (error) {
                return Promise.reject(new Error(error));
            }

            return data;
        },
        staleTime: 3600000,
    });

    return {
        bookGenres: data,
        error,
        isLoading,
    };
};

export default useBookGenres;
