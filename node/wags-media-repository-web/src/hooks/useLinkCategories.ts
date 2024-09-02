import { useQuery } from "@tanstack/react-query";

import { Api } from "@lib/api";

import { LinkCategory } from "@models/Link";

const useLinkCategories = () => {
    const {
        data,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['link-categories'],
        queryFn: async () => {
            const [data, error] = await await Api.Get<LinkCategory[]>('links/categories');

            if (error) {
                return Promise.reject(new Error(error));
            }

            return data;
        },
        staleTime: 3600000,
    });

    return {
        linkCategories: data,
        error,
        isLoading,
    };
};

export default useLinkCategories;
