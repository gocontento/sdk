'use client';
import { useEffect } from 'react';
import { useRouter as usePagesRouter } from 'next/router';
import { useRouter } from 'next/navigation';
export function usePreviewBridge(draftMode: boolean) {
    // only run client side and in draft mode
    if (typeof window === 'undefined' || !draftMode) {
        return;
    }

    function emitLoadedEvent() {
        if (window?.top) {
            window.top.postMessage('loaded', '*');
        }
    }

    let refresh: () => void;

    // use correct router to refresh depening on if next is
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

    emitLoadedEvent();
    useEffect(() => {
        window.addEventListener('message', refreshPreview);
        // remove event listeners on cleanup
        return () => {
            window.removeEventListener('message', refreshPreview);
        };
    }, []);
}
