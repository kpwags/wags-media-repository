import { useQuery } from "@tanstack/react-query";

import { Api } from "@lib/api";

import { VideoService } from "@models/System";

const useVideoServices = () => {
    const {
        data,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['video-services'],
        queryFn: async () => {
            const [data, error] = await await Api.Get<VideoService[]>('system/video-service');

            if (error) {
                return Promise.reject(new Error(error));
            }

            return data;
        },
        staleTime: 3600000,
    });

    return {
        videoServices: data,
        error,
        isLoading,
    };
};

export default useVideoServices;
