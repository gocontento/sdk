'use client';
import { useEffect, useState } from 'react';
import { useRouter as usePagesRouter } from 'next/router';
import { useRouter } from 'next/navigation';

function isInIframe() {
    if (typeof window === 'undefined') {
        return false;
    }
    return window.self !== window.top;
}

export function usePreviewBridge(): boolean {
    const [showPreviewToolbar, setShowPreviewToolbar] = useState(false);

    // Only run client side
    if (typeof window === 'undefined') {
        return showPreviewToolbar;
    }

    function emitLoadedEvent() {
        if (window?.top) {
            window.top.postMessage('loaded', '*');
        }
    }

    let refresh: () => void;

    // Use correct router to refresh depending on if next is
    // using app router or pages router
    try {
        const router = usePagesRouter();
        refresh = () => {
            router.replace(router.asPath, undefined, { scroll: false });
            emitLoadedEvent();
        };
    } catch {
        const router = useRouter();
        refresh = () => {
            router.refresh();
            emitLoadedEvent();
        };
    }

    function onMessage(event: MessageEvent) {
        switch (event.data.message) {
            case 'contento-refresh-preview':
                refresh();
        }
    }

    useEffect(() => {
        emitLoadedEvent();
        setShowPreviewToolbar(!isInIframe());
        window.addEventListener('message', onMessage);

        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('message', onMessage);
        };
    }, []);

    return showPreviewToolbar;
}
