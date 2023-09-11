'use client';

import { useRouter } from 'next/navigation';
// import { useRouter as usePagesRouter } from 'next/router';

import usePreviewBridge from './usePreviewBridge';

interface PreviewBridgeProps {
    draftMode: boolean;
}

export function PreviewBridge({ draftMode }: PreviewBridgeProps) {
    // try {
    //     const router = usePagesRouter();
    //     usePreviewBridge(draftMode, router);
    // } catch (e) {
    //     console.log('hello from pre bridge', e);
    const router = useRouter();
    usePreviewBridge(draftMode, router);
    // }
    return <div>Hello</div>;
}
