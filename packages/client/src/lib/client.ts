import { ContentApiData } from './api-types';

interface ContentoClientConfig {
    apiKey: string;
    apiURL: string;
    siteId: string;
    isPreview: Boolean;
}

interface GetContentArgs {
    params: URLSearchParams;
}

export interface ContentoClient {
    getContent: (args: GetContentArgs) => Promise<any>;
    getContentBySlug: (slug: string, draft?: boolean) => Promise<any>;
    getContentByType: (contentType: string, draft?: boolean) => Promise<any>;
    getPathsForType: (contentType: string, draft?: boolean) => Promise<any>;
}

function ContentoClient({
    baseUrl,
    headers,
}: {
    baseUrl: String;
    headers: Headers;
}): ContentoClient {
    type ContentAPIResponse = ContentApiData[];

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
        let result: ContentApiData[] = [];
        let json = await get(`${baseUrl}/content?${params}`);

        // the content endpoint can return an array (in form json.data) if more than one item returned, or single object (just json)
        // if the request return only one item.
        // We will normalise this to always return an array
        if (!json.data) {
            console.log('json.data is null');
            result.push(json);
            return result;
        }

        // add first page of results
        result = result.concat(json.data);

        console.log('json.links.next', json.links.next);

        // concat all subsequent pages of results
        while (json.links.next) {
            json = await get(json.links.next);
            result = result.concat(json.data);
        }

        console.log('result', result);

        return result;
    }

    async function getContentBySlug(slug: string, draft = false) {
        const params: URLSearchParams = new URLSearchParams({
            slug,
            limit: '1',
        });

        const [post] = await getContent({ params });

        return post;
    }

    async function getContentByType(contentType: string, draft = false) {
        const params = new URLSearchParams({
            content_type: contentType,
        });
        return getContent({ params });
    }

    async function getPathsForType(contentType: string, draft = false) {
        const content = await getContentByType(contentType, draft);
        return content.map((item: any) => item.slug);
    }

    return {
        getContent,
        getContentBySlug,
        getContentByType,
        getPathsForType,
    };
}

//test comment

export function createContentoClient(contentoConfig: ContentoClientConfig) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + contentoConfig.apiKey,
        'X-CONTENTO-SITE': contentoConfig.siteId,
        'X-CONTENTO-PREVIEW': contentoConfig.isPreview.toString(),
    });
    return ContentoClient({
        baseUrl: contentoConfig.apiURL,
        headers,
    });
}
