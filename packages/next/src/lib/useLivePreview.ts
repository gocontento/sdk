'use client';
import { useEffect, useState } from 'react';
import type { ContentData } from '@client';
export function useLivePreview({
    content: initialContent,
}: {
    content: ContentData;
}) {
    const [content, setContentValue] = useState(initialContent);

    // Only run client side
    if (typeof window === 'undefined') {
        return { content };
    }

    function emitLoadedMessage() {
        if (window?.top) {
            window.top.postMessage('loaded', '*');
        }
    }

    function emitLivePreviewInitMessage() {
        if (window?.top) {
            window.top.postMessage('live-preview-enabled', '*');
        }
    }

    function updateContent(content: ContentData) {
        setContentValue(content);
        emitLoadedMessage();
    }

    function onMessage(event: MessageEvent) {
        switch (event.data.message) {
            case 'contento-update-content':
                updateContent(JSON.parse(event.data.content));
        }
    }

    useEffect(() => {
        // Send message from Contento preview iframe indicating
        // that live preview is ready
        emitLivePreviewInitMessage();
        window.addEventListener('message', onMessage);

        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('message', onMessage);
        };
    }, []);

    return { content };
}
