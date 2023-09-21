export type AssetApiData = {
    id: string;
    name: string;
    description: string | null;
    path: string;
    url: string;
    extension: string;
    size: string;
    mime_type: string;
    is_image: boolean;
    width: string | null;
    height: string | null;
};
export type BlockApiData = {
    name: string;
    sort: number;
    fields: any;
    content_type: ContentTypeApiData;
};
export type ContentApiData = {
    id: string;
    published_at: string | null;
    slug: string | null;
    name: string;
    uri: string | null;
    url: string | null;
    created_at: string;
    updated_at: string;
    author: UserApiData;
    content_type: ContentTypeApiData;
    seo: SeoApiData;
    fields: any;
};
export type ContentLinkApiData = {
    id: string;
    published_at: string | null;
    name: string;
    slug: string | null;
    uri: string | null;
    url: string | null;
    fields: any | null;
};
export type ContentTypeApiData = {
    id: string;
    name: string;
    handle: string;
    object_type: string;
};
export type FieldApiData = {
    id: string;
    name: string;
    handle: string;
    help_text: string | null;
    type: string;
    text: any | string | null;
    assets: any | Array<any>;
    blocks: any | Array<any>;
    content_links: any | Array<any>;
    date: any | string | null;
    number: any | string | number | null;
    list: any | Array<any>;
    is_on: any | boolean | null;
    selected_option: any | Array<any>;
};
export type SeoApiData = {
    title: string | null;
    description: string | null;
    robots: string | null;
    canonical_url: string | null;
    open_graph: SeoOpenGraphApiData;
};
export type SeoOpenGraphApiData = {
    title: string | null;
    description: string | null;
    image_secure_url: string | null;
    image_width: string | null;
    image_height: string | null;
    image_alt: string | null;
    url: string;
};
export type UserApiData = {
    id: string;
    name: string;
    email: string;
    profile_photo_url: string;
};