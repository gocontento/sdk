import { useEffect } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
export default function usePreviewBridge(
    draftMode: boolean,
    router: AppRouterInstance
) {
    console.log('usePreviewBridge');

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
            console.log('refreshPreview');
            if (event.data !== 'contento-refresh-preview') {
                return;
            }
            router.refresh();
        }

        window.addEventListener('message', refreshPreview);
        // remove event listeners on cleanup
        return () => {
            // window.removeEventListener('scroll', saveScrollPos);
            window.removeEventListener('message', refreshPreview);
        };
    }, []);
}
