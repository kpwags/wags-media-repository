import { useQuery } from "@tanstack/react-query";

import { Api } from "@lib/api";

import { PodcastCategory } from "@models/Podcast";

const usePodcastCategories = () => {
    const {
        data,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['podcast-categories'],
        queryFn: async () => {
            const [data, error] = await await Api.Get<PodcastCategory[]>('podcast/category');

            if (error) {
                return Promise.reject(new Error(error));
            }

            return data;
        },
        staleTime: 3600000,
    });

    return {
        podcastCategories: data,
        error,
        isLoading,
    };
};

export default usePodcastCategories;
