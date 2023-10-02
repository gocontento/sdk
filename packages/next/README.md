# @gocontento/client

Utilities to easily integrate Contento with your Next.js website.

- Enable previews from the Contento Editor

## Installation

```bash
npm install @gocontento/next
```

NOTE: This package currently only supports Next.js 13 apps using the App router.

## Usage

### Create client

We recommend creating a factory function to create the client. This allows for client config to be defined in one place then reused in both server and client components of the Next app.

For example: create a `contento.js` file with following content in your Next  project:

```javascript
import {Client} from "@gocontento/next";

export function createClient(isPreview: boolean = false){
  return Client.createContentoClient({
    apiURL: process.env.CONTENTO_API_URL,
    apiKey: process.env.CONTENTO_API_KEY,
    siteId: process.env.CONTENTO_SITE_ID,
    isPreview: isPreview,
  })
}
```

See full client documentation here: [Client documentation](./packages/client)

### Set up preview mode

Contento uses Next.js 13's new [draft mode](https://nextjs.org/docs/app/building-your-application/configuring/draft-mode) to enable previewing content from the Contento Editor.

create an api route called `draft`. 
in the route.ts/js file, add the following code:

```javascript
import {createClient} from "YOUR_CLIENT_FACTORY_FUNCTION";
import {enableDraftAndRedirect} from "@gocontento/next";
import {draftMode} from "next/headers";


export async function GET(request: Request){
  const client = createClient(draftMode().isEnabled);
  return enableDraftAndRedirect(client, request, "YOUR_PREVIEW_Secret_KEY");
}
```

Here we are using the `enableDraftAndRedirect` function to enable next.js draft mode and redirect to the page we want to preview.

This route will be called by the Contento Editor when previewing content.
The preview secret key can be found in the site setting from the contento app.


### Preview Bridge

To allow Contento refresh the preview page when content is updated, we need to add the PreviewBridge component to your apps root layout file.
For example

```javascript

import {PreviewBridge} from "@gocontento/next";
import {draftMode} from "next/headers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isEnabled } = draftMode()

  return (
    <html>
      <body>
        <PreviewBridge draftMode={isEnabled} />
        {children}
      </body>
    </html>
  )
}

```

The draftMode prop must be passed to ensure the PreviewBridge component is only active in draft mode.


### Fetch Content

To fetch content from Contento, simply create a client instance in you page component. 
See [Client documentation](./packages/client) for more details.

For example, your index page might look something like this:

```typescript jsx
export default async function Page() {
  const client = createClient();
  let contentResponse = await client.getContentByType('blog_post', 'published_at', 'desc')
  let content = [...contentResponse.content];
  while(contentResponse.nextPage){
    contentResponse = await contentResponse.nextPage();
    content = content.concat(contentResponse.content);
  }


  return (
    <div className="container mx-auto px-5">
      {content.map((contentItem) => (
        // render each content item
      ))}
    </div>
  )
}

``



