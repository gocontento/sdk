'use client';

import { useRouter } from 'next/navigation';
import usePreviewBridge from './usePreviewBridge';

interface PreviewBridgeProps {
    draftMode: boolean;
}

export function PreviewBridge({ draftMode }: PreviewBridgeProps) {
    const router = useRouter();
    usePreviewBridge(draftMode, router);
    return <></>;
}
