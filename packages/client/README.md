# JavaScript Client for the Contento API

The official JavaScript and Typescript client for [Contento](https://contento.io).

## Installation

```bash
npm install @gocontento/client
```

## Basic usage

In most scenarios you will want to create a [client](#object-contentoclient) once for the whole application, then re-use it whenever you make calls to the Contento API.

To assist in that, we have a [`createContentoClient()`](#function-createcontentoclientconfig) function that you can use:

```javascript
import { createContentoClient } from "@gocontento/client";

// Create the client
const client =  createContentoClient({
    apiURL: "CONTENTO_API_URL",
    apiKey: "CONTENTO_API_KEY",
    siteId: "CONTENTO_SITE_ID",
    isPreview: false,
});
```

Once you have the client instance, you can start fetching data. For example, you can use the ID of a page with the [`getContentById()`](#getcontentbyidid) method like so:

```javascript
// Fetch a content object using the ID
const page = await client.getContentById("CONTENT_HASH_ID");
```

Or, you can fetch a list of content using [`getContentByType()`](#getcontentbytypeoptions) 

```javascript
// Fetch some content by type
const contentResponse = await client.getContentByType({
    contentType: "CONTENT_TYPE_HANDLE"
});

// Get the array of objects from the response
const contentData = contentResponse.content;

// Or, fetch the next page in the list
const nextPageResponse = await contentResponse.nextPage();
```


## Documentation

TODO summary


### Function `createContentoClient(config)`
Return a new Contento client object.

Parameters:

- `ContentoClientConfig` - object with the following properties:
  - `apiURL` - string - the url of the Contento API
  - `apiKey` - string - the api key of the Contento API
  - `siteId` - string - the site id of the Contento API
  - `isPreview` - boolean - if true, the client will fetch the preview version of the content


example:

```javascript
import {Client} from "@gocontento/next";

// create client
 const client =  Client.createContentoClient({
    apiURL: "CONTENTO_API_URL",
    apiKey: "CONTENTO_API_KEY",
    siteId: "CONTENTO_SITE_ID",
    isPreview: true,
  });

```

## Object `ContentoClient`

The Contento client object.

### Methods:

#### `getContentById(id)`

fetch content by id

##### parameters:
- id - string - the `hash_id` property of the content object 

##### returns - `Promise<ContentoContent>` - the content object

example:

```javascript
 const page = await client.getContentById("CONTENT_HASH_ID");

```

#### `getContentBySlug(slug, content_type)`

Fetch content by slug.

##### parameters:
- slug - string - the `slug` property of the content to be returned.
- content_type - string - slugs are unique only within a content type, so we must pass `content_type` to ensure we target the correct content object.

##### returns - `Promise<ContentoContent>` - the content object

example:

```javascript

 const content = await client.getContentBySlug("blog_post", 'my-first-blog-post');
 ```

#### `getContentByType(options)`

Fetch content by content type. Options you be an object with at least the `contentType` key.

##### options:
- contentType - string - required - the `content_type` property of the content to be returned.
- limit - number - the amount of content objects per page, defaults to 20, max is 100.
- sortBy - string - the property to sort by. Defaults to `published_at`.
- sortDirection - 'asc' | 'desc' - the direction to sort by. Defaults to `desc`.

##### returns - `Promise<ContentAPIResponse>` 
Returns a promise that resolves to a `ContentAPIResponse` object. The `ContentAPIResponse` object has the following properties:

- `content` - array of `ContentoContent` objects
- `nextPage()?` - async function. Returns a `ContentAPIResponse` object for the next page of content.

examples:

get single page of content

```javascript

 const singlePageOfContent = await client.getContentByType({
     contentType: "blog_post"
 });
 const contentData = singlePageOfContent.content;
 ```
Get all pages content of type

```javascript
 let contentResponse = await client.getContentByType({
    contentType: "blog_post",
    sortBy: "published_at",
    sortDirection: "desc"
 })
 let content = [...contentResponse.content];

 // build array of content until there are no more pages
 while(contentResponse.nextPage){
   contentResponse = await contentResponse.nextPage();
   content = content.concat(contentResponse.content);
 }

```

#### `getContent(params)`

Generic method to fetch content. See params documented in the [contento docs](https://www.contento.io/docs/content-api/v1/endpoints#list-all-content).

##### parameters:
- params - object - the params to pass to the Contento API

##### returns - `Promise<ContentAPIResponse>`
Returns a promise that resolves to a `ContentAPIResponse` object. The `ContentAPIResponse` object has the following properties:

- `content` - array of `ContentoContent` objects
- `nextPage()?` - async function. Returns a `ContentAPIResponse` object for the next page of content.

examples:

get single page of content

```javascript

 const params = {
    content_type: 'blog_post',
    sort_by: 'published_at',
    sort_direction: 'desc',
    author: 'John Doe'
 }
 const singlePageOfContent = await client.getContent(params);
 const contentData = singlePageOfContent.content;
 ```
Get all pages content of type

```javascript
 const params = {
  content_type: 'blog_post',
  sort_by: 'published_at',
  sort_direction: 'desc',
  author: 'John Doe'
} 

let contentResponse = await client.getContent(params)
 let content = [...contentResponse.content];

 // build array of content until there are no more pages
 while(contentResponse.nextPage){
   contentResponse = await contentResponse.nextPage();
   content = content.concat(contentResponse.content);
 }

```



