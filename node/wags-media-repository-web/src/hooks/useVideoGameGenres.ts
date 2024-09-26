import { useQuery } from '@tanstack/react-query';

import { Api } from '@lib/api';

import { VideoGameGenre } from '@models/VideoGame';

const useVideoGameGenres = () => {
    const {
        data,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['video-game-genres'],
        queryFn: async () => {
            const [data, error] = await await Api.Get<VideoGameGenre[]>('video-game/genre');

            if (error) {
                return Promise.reject(new Error(error));
            }

            return data;
        },
        staleTime: 3600000,
    });

    return {
        videoGameGenres: data,
        error,
        isLoading,
    };
};

export default useVideoGameGenres;
