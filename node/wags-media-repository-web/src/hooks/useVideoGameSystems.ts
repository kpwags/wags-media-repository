import { useQuery } from '@tanstack/react-query';

import { Api } from '@lib/api';

import { VideoGameSystem } from '@models/VideoGame';

const useVideoGameSystems = () => {
    const {
        data,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['video-game-systems'],
        queryFn: async () => {
            const [data, error] = await await Api.Get<VideoGameSystem[]>('video-game/system');

            if (error) {
                return Promise.reject(new Error(error));
            }

            return data;
        },
        staleTime: 3600000,
    });

    return {
        videoGameSystems: data,
        error,
        isLoading,
    };
};

export default useVideoGameSystems;
