'use client';
import { useEffect, useState } from 'react';
import type { ContentData } from '@client';
import { useRouter } from 'next/navigation';
export function usePreviewBridge({
    content: initialContent,
}: {
    content: ContentData;
}) {
    const [content, setContentValue] = useState(initialContent);

    if (typeof window === 'undefined') {
        return { content };
    }

    const router = useRouter();

    function emitLoadedEvent() {
        if (window?.top) {
            window.top.postMessage('loaded', '*');
        }
    }

    function refreshPreview() {
        // refresh current route
        router.refresh();
    }

    function updateContent(content: ContentData) {
        setContentValue(content);
        emitLoadedEvent();
    }

    function onMessage(event: MessageEvent) {
        switch (event.data.message) {
            case 'contento-update-content':
                updateContent(JSON.parse(event.data.content));
                break;
            case 'contento-refresh-preview':
                refreshPreview();
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
        //watch initialContent so effect fires on next router refresh
    }, [initialContent]);

    return { content };
}
