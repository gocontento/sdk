import { ContentData } from './types';

interface ContentoClientConfig {
    apiKey: string;
    apiURL: string;
    siteId: string;
    isPreview?: boolean;
    simplePagination?: boolean;
    language?: string | undefined;
    fetchOptions?: RequestInit | undefined;
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
    nextPage?: () => Promise<ContentAPIResponse>;
    prevPage?: () => Promise<ContentAPIResponse>;
    pagination?: SimplePaginationResponse;
}

export interface SimplePaginationResponse {
    first: Record<string, string | string[]> | null;
    last: Record<string, string | string[]> | null;
    prev: Record<string, string | string[]> | null;
    next: Record<string, string | string[]> | null;
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
    fetchOptions: RequestInit;
}): ContentoClient {
    async function get(url: string) {
        try {
            // Merge in any headers passed through in fetchOptions - we use
            // Headers.set() here to allow overrides
            if (fetchOptions.headers) {
                Object.entries(fetchOptions.headers).forEach((header) => {
                    headers.set(header[0], header[1]);
                });
            }

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

        // The content endpoint can return an array (in form json.data) if more than one item returned, or single object
        // if the request returns only one item. We will normalise this to always return an array.
        if (!json.data) {
            return {
                content: [json],
            };
        }

        const result: ContentAPIResponse = {
            content: json.data,
        };

        // Check the headers to see if we’re dealing with cursor or simple / classic pagination
        const simplePaginationHeader = headers.get(
            'X-CONTENTO-SIMPLE-PAGINATION'
        );

        // Process simple pagination response
        if (simplePaginationHeader && simplePaginationHeader === 'true') {
            // For this style of pagination we figure out the complete set of params including the page number from the
            // links array - we do this for all 4 potential links, and then send back params objects for those as well
            // as setting the convenience methods
            result.pagination = {
                first: json.links.first
                    ? {
                          ...params,
                          page: new URL(json.links.first).searchParams.get(
                              'page'
                          ) as string,
                      }
                    : null,
                last: json.links.last
                    ? {
                          ...params,
                          page: new URL(json.links.last).searchParams.get(
                              'page'
                          ) as string,
                      }
                    : null,
                prev: json.links.prev
                    ? {
                          ...params,
                          page: new URL(json.links.prev).searchParams.get(
                              'page'
                          ) as string,
                      }
                    : null,
                next: json.links.next
                    ? {
                          ...params,
                          page: new URL(json.links.next).searchParams.get(
                              'page'
                          ) as string,
                      }
                    : null,
            } as SimplePaginationResponse;

            const { next } = result.pagination;
            if (next) {
                result.nextPage = async () =>
                    getContent({
                        params: next,
                    });
            }

            const { prev } = result.pagination;
            if (prev) {
                result.prevPage = async () =>
                    getContent({
                        params: prev,
                    });
            }
        } else {
            // Process the default cursor based pagination
            if (json.meta.next_cursor) {
                result.nextPage = async () =>
                    getContent({
                        params: {
                            ...params,
                            cursor: json.meta.next_cursor,
                        },
                    });
            }

            if (json.meta.prev_cursor) {
                result.prevPage = async () =>
                    getContent({
                        params: {
                            ...params,
                            cursor: json.meta.prev_cursor,
                        },
                    });
            }
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
    simplePagination = false,
    language,
    fetchOptions = {},
}: ContentoClientConfig) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
        'X-CONTENTO-SITE': siteId,
    });

    if (isPreview) {
        headers.set('X-CONTENTO-PREVIEW', 'true');
    }

    if (simplePagination) {
        headers.set('X-CONTENTO-SIMPLE-PAGINATION', 'true');
    }

    if (language) {
        headers.set('X-CONTENTO-LANGUAGE', language);
    }

    return ContentoClient({
        baseUrl: apiURL,
        headers,
        fetchOptions,
    });
}
