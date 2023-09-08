interface ContentoClientConfig {
    apiKey: string;
    apiURL: string;
    siteId: string;
    previewSecret: string;
}

export interface ContentoClient {
    getContentBySlug: (slug: string, draft?: boolean) => Promise<any>;
    getContentByType: (contentType: string, draft?: boolean) => Promise<any>;
    getPathsForType: (contentType: string, draft?: boolean) => Promise<any>;
}

function ContentoClient({
    baseUrl,
    headers,
    previewSecret,
}: {
    baseUrl: String;
    headers: Headers;
    previewSecret: string;
}): ContentoClient {
    interface GetContentArgs {
        params: URLSearchParams;
    }
    async function getContent({ params }: GetContentArgs) {
        const response = await fetch(`${baseUrl}/content?${params}`, {
            method: 'GET',
            headers,
        });
        const json = await response.json();
        if (json.data) {
            return json.data;
        }
        return json;
    }

    async function getContentBySlug(slug: string, draft = false) {
        const params: URLSearchParams = new URLSearchParams({
            slug,
            limit: '1',
        });
        // if(draft) {
        //   params['draft'] = draft;
        params.append('draft', 'true');
        // }
        // const { data } = await axios('/content', {
        //   method: 'GET',
        //   params,
        // });

        // const response = await fetch(baseUrl + '/content?' + params, {});
        // return data.data[0];

        return getContent({ params });
    }

    async function getContentByType(contentType: string, draft = false) {
        // const { data: responseData } = await axios('/content', {
        //     method: 'GET',
        //     params: {
        //         content_type: contentType,
        //         draft: draft,
        //     },
        // });
        //
        // return responseData.data;
        const params = new URLSearchParams({
            content_type: contentType,
            draft: draft ? 'true' : 'false',
        });
        return getContent({ params });
    }

    async function getPathsForType(contentType: string, draft = false) {
        const content = await getContentByType(contentType, draft);
        return content.map((item: any) => item.slug);
    }

    return {
        getContentBySlug,
        getContentByType,
        getPathsForType,
    };
}

//test comment

export function createContentoClient(contentoConfig: ContentoClientConfig) {
    console.log('createContentoClient XXX');
    // const axiosInstance = axios.create({
    //   baseURL: contentoConfig.apiURL,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + contentoConfig.apiKey,
    //     'X-CONTENTO-SITE': contentoConfig.siteId,
    //   },
    // });
    const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + contentoConfig.apiKey,
        'X-CONTENTO-SITE': contentoConfig.siteId,
    });
    return ContentoClient({
        baseUrl: contentoConfig.apiURL,
        headers,
        previewSecret: contentoConfig.previewSecret,
    });
}
