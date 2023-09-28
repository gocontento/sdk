import { useEffect } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
export default function usePreviewBridge(
    draftMode: boolean,
    router: AppRouterInstance
) {
    // only run client side and in draft mode
    if (typeof window === 'undefined' || !draftMode) {
        return;
    }

    // send message from contento preview iframe indicating that preview has rendered
    if (window.top) {
        window.top.postMessage('loaded', '*');
    }

    useEffect(() => {
        function refreshPreview(event: MessageEvent) {
            if (event.data !== 'contento-refresh-preview') {
                return;
            }
            router.refresh();
        }

        window.addEventListener('message', refreshPreview);
        // remove event listeners on cleanup
        return () => {
            window.removeEventListener('message', refreshPreview);
        };
    }, []);
}
