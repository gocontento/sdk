'use client';
import { useEffect, useState } from 'react';
import { useRouter as usePagesRouter } from 'next/router';
import { useRouter } from 'next/navigation';
export function usePreviewBridge(draftMode: boolean) {
    // only run client side and in draft mode
    if (typeof window === 'undefined' || !draftMode) {
        return;
    }

    const [isInContentoIframe, setIsInContentoIframe] = useState(false);

    function emitLoadedEvent() {
        if (window?.top) {
            window.top.postMessage('loaded', '*');
        }
    }

    let refresh: () => void;

    // use correct router to refresh depending on if next is
    // using app router or pages router
    try {
        const router = usePagesRouter();
        refresh = () =>
            router.replace(router.asPath, undefined, { scroll: false });
    } catch {
        const router = useRouter();
        refresh = () => router.refresh();
    }

    function refreshPreview(event: MessageEvent) {
        if (event.data.message !== 'contento-refresh-preview') {
            return;
        }
        refresh();
    }

    function onMessage(event: MessageEvent) {
        switch (event.data.message) {
            case 'contento-refresh-preview':
                refreshPreview(event);
        }
    }

    useEffect(() => {
        emitLoadedEvent();
        window.addEventListener('message', onMessage);

        setIsInContentoIframe(window?.top !== window?.self);

        // remove event listeners on cleanup
        return () => {
            window.removeEventListener('message', refreshPreview);
        };
    }, []);

    return isInContentoIframe;
}
