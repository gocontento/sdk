import { ContentData } from './types';

interface ContentoClientConfig {
    apiKey: string;
    apiURL: string;
    siteId: string;
    isPreview: boolean;
    language?: string;
    fetchOptions?: object;
}

interface GetContentArgs {
    params: Record<string, string | string[]>;
}

interface GetContentByTypeArgs {
    contentType: string;
    limit?: number;
    sortBy?: sortBy;
    sortDirection?: sortDirection;
}

export interface ContentoClient {
    getContent: (args: GetContentArgs) => Promise<ContentAPIResponse>;

    getContentBySlug: (
        slug: string,
        contentType: string
    ) => Promise<ContentData>;

    getContentById: (id: string) => Promise<ContentData>;

    getContentByType: (
        args: GetContentByTypeArgs
    ) => Promise<ContentAPIResponse>;
}

export interface ContentAPIResponse {
    content: ContentData[];
    nextPage?: any;
}

export type sortBy = 'published_at' | 'created_at' | 'updated_at' | 'name';
export type sortDirection = 'asc' | 'desc';

function ContentoClient({
    baseUrl,
    headers,
    fetchOptions,
}: {
    baseUrl: string;
    headers: Headers;
    fetchOptions: object;
}): ContentoClient {
    async function get(url: string) {
        try {
            const response = await fetch(url, {
                ...fetchOptions,
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                switch (response.status) {
                    case 401:
                        throw new Error('Unauthorized');
                    case 404:
                        throw new Error('Not found');
                    case 429:
                        throw new Error('Too many requests');
                    case 500:
                        throw new Error('Internal server error');
                }
            }

            return response.json();
        } catch {
            throw new Error(`Fetch failed`);
        }
    }

    /**
     * Process the params object to convert any array values into a format that the API expects
     * See docs for more info: https://www.contento.io/docs/content-api/v1/endpoints#list-all-content
     * @param params
     */
    function processParams(
        params: Record<string, string | string[]>
    ): Record<string, string> {
        for (const property in params) {
            if (Array.isArray(params[property])) {
                const arr = params[property] as string[];
                delete params[property];
                arr.forEach((value, index) => {
                    params[`${property}[${index}]`] = value;
                });
            }
        }

        return params as Record<string, string>;
    }

    async function getContent({
        params,
    }: GetContentArgs): Promise<ContentAPIResponse> {
        const json = await get(
            `${baseUrl}/content?${new URLSearchParams(processParams(params))}`
        );

        // the content endpoint can return an array (in form json.data) if more than one item returned, or single object (just json)
        // if the request return only one item.
        // We will normalise this to always return an array
        if (!json.data) {
            return {
                content: [json],
            };
        }

        const result: ContentAPIResponse = {
            content: json.data,
        };

        if (json.links.next) {
            result.nextPage = async () =>
                getContent({
                    params: {
                        ...params,
                        cursor: json.meta.next_cursor,
                    },
                });
        }

        return result;
    }

    async function getContentBySlug(
        slug: string,
        contentType: string
    ): Promise<ContentData> {
        const params = {
            content_type: contentType,
            slug,
            limit: '1',
        };

        const contentResponse: ContentAPIResponse = await getContent({
            params,
        });
        return contentResponse.content[0];
    }

    async function getContentById(id: string): Promise<ContentData> {
        return await get(`${baseUrl}/content/${id}`);
    }

    async function getContentByType({
        contentType,
        limit = 10,
        sortBy = 'published_at',
        sortDirection = 'desc',
    }: GetContentByTypeArgs): Promise<ContentAPIResponse> {
        const params = {
            content_type: contentType,
            sort: `${sortBy}:${sortDirection}`,
            limit: limit.toString(),
        };
        return getContent({ params });
    }

    return {
        getContent,
        getContentBySlug,
        getContentByType,
        getContentById,
    };
}

export function createContentoClient({
    apiKey,
    apiURL,
    siteId,
    isPreview = false,
    language,
    fetchOptions = {},
}: ContentoClientConfig) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
        'X-CONTENTO-SITE': siteId,
    });
    if (isPreview) {
        headers.append('X-CONTENTO-PREVIEW', 'true');
    }
    if (language) {
        headers.append('X-CONTENTO-LANGUAGE', language);
    }

    return ContentoClient({
        baseUrl: apiURL,
        headers,
        fetchOptions,
    });
}
