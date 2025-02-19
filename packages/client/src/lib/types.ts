/**
 * Types for models returned by the API
 */

export type AssetData = {
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
export type BlockData = {
    name: string;
    sort: number;
    fields: Record<string, FieldData>;
    content_type: ContentTypeData;
};
export type ContentData = {
    id: string;
    published_at: string | null;
    slug: string | null;
    name: string;
    uri: string | null;
    url: string | null;
    created_at: string;
    updated_at: string;
    author: UserData;
    content_type: ContentTypeData;
    seo: SeoData;
    fields: Record<string, FieldData>;
};
export type ContentLinkData = {
    id: string;
    published_at: string | null;
    name: string;
    slug: string | null;
    uri: string | null;
    url: string | null;
    fields: Record<string, FieldData>;
};
export type ContentTypeData = {
    id: string;
    name: string;
    handle: string;
    object_type: string;
};
export type SelectedDropdownOption = {
    label: string;
    value: string;
};
export type ListItem = {
    sort: number;
    text: string | null;
};
export type FieldData = {
    id: string;
    name: string;
    handle: string;
    help_text: string | null;
    type: string;
    text: any | string | null;
    assets:
        | Array<{
              sort: number;
              asset: AssetData;
          }>
        | any;
    blocks: BlockData[] | any;
    content_links:
        | Array<string>
        | Array<{
              sort: number;
              content_link: ContentLinkData;
          }>
        | any;
    date: any | string | null;
    number: any | string | number | null;
    list: ListItem[] | any;
    is_on: any | boolean | null;
    selected_option: SelectedDropdownOption | any;
};
export type SeoData = {
    title: string | null;
    description: string | null;
    robots: string | null;
    canonical_url: string | null;
    open_graph: SeoOpenGraphData;
};
export type SeoOpenGraphData = {
    title: string | null;
    description: string | null;
    image_secure_url: string | null;
    image_width: string | null;
    image_height: string | null;
    image_alt: string | null;
    url: string;
};
export type UserData = {
    id: string;
    name: string;
    email: string;
    profile_photo_url: string;
};
