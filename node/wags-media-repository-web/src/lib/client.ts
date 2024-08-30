import ApiArguments from '@models/ApiArguments';
import config from '@lib/config';

const { apiUrl } = config;

async function client(endpoint: string, {
    data = null,
    contentType = 'application/json',
    fileUpload = false,
    ...customConfig
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: ApiArguments = {}): Promise<any> {
    const headers: Record<string, string> = {};

    if (contentType !== null) {
        headers['Content-Type'] = contentType;
    }

    let body;
    if (data && data !== null) {
        body = (fileUpload ? data : JSON.stringify(data));
    }

    const config: RequestInit = {
        method: data ? 'POST' : 'GET',
        body,
        mode: 'cors',
        headers,
        ...customConfig,
    };

    return window.fetch(`${apiUrl}/${endpoint}`, config).then(async (response) => {
        if (response.status === 400) {
            const error = await response.text();
            return Promise.reject(error);
        }

        if (response.ok) {
            const responseContentType = response.headers.get('content-type');

            if (responseContentType && responseContentType.indexOf('application/json') !== -1) {
                const responseData = await response.json();
                return responseData;
            }

            if (response.status === 204) {
                return null;
            }

            return {};
        }

        return Promise.reject(new Error('Unknown Error'));
    });
}

const handleApiError = (error: string | Error): string => {
    if (typeof error === 'string') {
        return error;
    }

    if (typeof error.message === 'string') {
        return error.message;
    }

    return 'An error has occurred';
};

export {
    client,
    handleApiError,
};