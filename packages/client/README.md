# JavaScript Client for the Contento API

The official JavaScript and Typescript client for [Contento](https://www.contento.io).

## Installation

```bash
npm install @gocontento/client
```

## Basic usage

In most scenarios you will want to create a [client](https://www.contento.io/docs/sdk/client#contento-client) once for the whole application, then
re-use it whenever you make calls to the Contento API.

To assist in that, we have a [`createContentoClient()`](https://www.contento.io/docs/sdk/client#creating-a-client-instance) function that you can use:

```javascript
import { createContentoClient } from "@gocontento/client";

// Create the client
const client =  createContentoClient({
    apiURL: "https://app.contento.io/api/v1",
    apiKey: "your_api_key",
    siteId: "your_site_id",
    isPreview: false,
});
```

Once you have the client instance, you can start fetching data. For example, you can use the ID of a page with the
[`getContentById()`](https://www.contento.io/docs/sdk/client#get-content-by-id) method like so:

```javascript
// Fetch a content object using the ID
const page = await client.getContentById("some_content_id");
```

Or, you can fetch a list of content using [`getContentByType()`](https://www.contento.io/docs/sdk/client#get-content-by-type)

```javascript
// Fetch some content by type
const response = await client.getContentByType({
    contentType: "content_type_handle"
});

// Get the array of objects from the response
const contentData = response.content;

// Or, fetch the next page in the list
const nextPageResponse = await response.nextPage();
```

## Documentation

For full documentation please go to [https://www.contento.io/docs/sdk/client](https://www.contento.io/docs/sdk/client).


## Support

If you have a bug or feature request then please [submit an issue](https://github.com/gocontento/sdk/issues/new).

If you have questions about Contento, or need help in some other way, then you can reach out to us via
[email](mailto:josh@contento.io) or join our [Discord server](https://discord.gg/dZERPfBV).
