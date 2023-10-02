import { ContentData } from './types';

interface ContentoClientConfig {
    apiKey: string;
    apiURL: string;
    siteId: string;
    isPreview: boolean;
}

interface GetContentArgs {
    params: Record<string, string>;
}

export interface ContentoClient {
    getContent: (args: GetContentArgs) => Promise<ContentAPIResponse>;

    getContentBySlug: (
        slug: string,
        contentType: string
    ) => Promise<ContentData>;

    getContentById: (id: string) => Promise<ContentData>;

    getContentByType: (
        contentType: string,
        sortBy?: sortBy,
        sortDirection?: sortDirection
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
}: {
    baseUrl: string;
    headers: Headers;
}): ContentoClient {
    async function get(url: string) {
        try {
            const response = await fetch(url, {
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

    async function getContent({
        params,
    }: GetContentArgs): Promise<ContentAPIResponse> {
        const json = await get(
            `${baseUrl}/content?${new URLSearchParams(params)}`
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

    async function getContentByType(
        contentType: string,
        sortBy: sortBy = 'published_at',
        sortDirection: sortDirection = 'desc'
    ): Promise<ContentAPIResponse> {
        const params = {
            content_type: contentType,
            sort: `${sortBy}:${sortDirection}`,
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
}: ContentoClientConfig) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
        'X-CONTENTO-SITE': siteId,
    });
    if (isPreview) {
        headers.append('X-CONTENTO-PREVIEW', 'true');
    }

    return ContentoClient({
        baseUrl: apiURL,
        headers,
    });
}
