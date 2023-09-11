import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { useEffect } from 'react';

export default function usePreviewBridge(
    draftMode: boolean,
    router: AppRouterInstance | any
) {
    if (typeof window === 'undefined' || !draftMode) {
        return;
    }

    useEffect(() => {
        // maintain scroll pos on refresh
        // this is important for contento preview iframe ux
        const scrollpos = localStorage.getItem('contento-preview-scrollpos');
        if (scrollpos) {
            window.scrollTo(0, Number(scrollpos));
        }

        function saveScrollPos() {
            localStorage.setItem(
                'contento-preview-scrollpos',
                String(window.scrollY)
            );
        }
        function refreshPreview(event: any) {
            if (event.data !== 'contento-refresh-preview') {
                return;
            }
            router.refresh();
        }

        if (!window?.top) {
            return;
        }
        // send message from contento preview iframe
        window.top.postMessage('loaded', '*');

        window.addEventListener('message', refreshPreview);

        // track scroll position
        window.addEventListener('scroll', saveScrollPos);

        // remove event listeners on cleanup
        return () => {
            window.removeEventListener('scroll', saveScrollPos);
            window.removeEventListener('message', refreshPreview);
        };
    }, []);
}
