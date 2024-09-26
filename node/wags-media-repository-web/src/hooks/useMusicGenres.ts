import { useQuery } from "@tanstack/react-query";

import { Api } from "@lib/api";

import { MusicGenre } from "@models/Music";

const useMusicGenres = () => {
    const {
        data,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['music-genres'],
        queryFn: async () => {
            const [data, error] = await await Api.Get<MusicGenre[]>('music/genre');

            if (error) {
                return Promise.reject(new Error(error));
            }

            return data;
        },
        staleTime: 3600000,
    });

    return {
        musicGenres: data,
        error,
        isLoading,
    };
};

export default useMusicGenres;
