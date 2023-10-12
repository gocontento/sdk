'use client';
import { useEffect, useState } from 'react';
import type { ContentData } from '@client';
export function useLivePreview({
    content: initialContent,
}: {
    content: ContentData;
}) {
    const [content, setContentValue] = useState(initialContent);

    if (typeof window === 'undefined') {
        return { content };
    }

    function emitLoadedEvent() {
        if (window?.top) {
            window.top.postMessage('loaded', '*');
        }
    }
    function updateContent(content: ContentData) {
        setContentValue(content);
        emitLoadedEvent();
    }

    function onMessage(event: MessageEvent) {
        switch (event.data.message) {
            case 'contento-update-content':
                updateContent(JSON.parse(event.data.content));
        }
    }

    useEffect(() => {
        // send message from contento preview iframe indicating that preview has rendered
        emitLoadedEvent();
        window.addEventListener('message', onMessage);

        // remove event listeners on cleanup
        return () => {
            window.removeEventListener('message', onMessage);
        };
    }, []);

    return { content };
}
