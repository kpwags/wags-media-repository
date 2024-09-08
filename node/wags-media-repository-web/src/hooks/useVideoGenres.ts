import { useQuery } from "@tanstack/react-query";

import { Api } from "@lib/api";

import { VideoGenre } from "@models/System";

const useVideoGenres = () => {
    const {
        data,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['video-genres'],
        queryFn: async () => {
            const [data, error] = await await Api.Get<VideoGenre[]>('system/video-genre');

            if (error) {
                return Promise.reject(new Error(error));
            }

            return data;
        },
        staleTime: 3600000,
    });

    return {
        videoGenres: data,
        error,
        isLoading,
    };
};

export default useVideoGenres;
