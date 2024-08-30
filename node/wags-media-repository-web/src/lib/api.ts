import ApiArguments from '@models/ApiArguments';
import { client, handleApiError } from '@lib/client';

class Api {
    static Post<T>(endpoint: string, config: ApiArguments = {}): Promise<[T | null, string | null]> {
        const apiConfig: ApiArguments = {
            method: 'POST',
            ...config,
        };

        return client(endpoint, apiConfig).then(
            (data) => [data, null],
            (error) => {
                return [null, handleApiError(error)];
            },
        );
    }

    static Get<T>(endpoint: string, config: ApiArguments = { params: {} }): Promise<[T | null, string | null]> {
        let url = `${endpoint}?`;

        if (config.params) {
            Object.keys(config.params).forEach((key) => {
                url += `${key}=${config.params[key]}&`;
            });
        }

        url = url.substring(0, url.length - 1);

        return client(url, { method: 'GET' }).then(
            (data) => [data, null],
            (error) => {
                return [null, handleApiError(error)];
            },
        );
    }

    static Delete<T>(endpoint: string, config: ApiArguments = { params: {} }): Promise<[T | null, string | null]> {
        let url = `${endpoint}?`;

        if (config.params) {
            Object.keys(config.params).forEach((key) => {
                url += `${key}=${config.params[key]}&`;
            });
        }

        url = url.substring(0, url.length - 1);

        return client(url, { method: 'DELETE' }).then(
            (data) => [data, null],
            (error) => {
                return [null, handleApiError(error)];
            },
        );
    }

    static Put<T>(endpoint: string, config: ApiArguments = {}): Promise<[T | null, string | null]> {
        const apiConfig: ApiArguments = {
            method: 'PUT',
            ...config,
        };

        return client(endpoint, apiConfig).then(
            (data) => [data, null],
            (error) => {
                return [null, handleApiError(error)];
            },
        );
    }
}

export { Api };