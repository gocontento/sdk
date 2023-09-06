import axios, { AxiosInstance } from 'axios';

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
  axios,
  previewSecret,
}: {
  axios: AxiosInstance;
  previewSecret: string;
}): ContentoClient {
  async function getContentBySlug(slug: string, draft = false) {
    const params: {
      slug: string;
      draft?: boolean;
    } = {
      slug,
    };
    // if(draft) {
    //   params['draft'] = draft;
    params['draft'] = true;
    // }
    const { data } = await axios('/content', {
      method: 'GET',
      params,
    });

    return data.data[0];
  }

  async function getContentByType(contentType: string, draft = false) {
    const { data: responseData } = await axios('/content', {
      method: 'GET',
      params: {
        content_type: contentType,
        draft: draft,
      },
    });

    return responseData.data;
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

export function createContentoClient(contentoConfig: ContentoClientConfig) {
  const axiosInstance = axios.create({
    baseURL: contentoConfig.apiURL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + contentoConfig.apiKey,
      'X-CONTENTO-SITE': contentoConfig.siteId,
    },
  });

  return ContentoClient({
    axios: axiosInstance,
    previewSecret: contentoConfig.previewSecret,
  });
}
