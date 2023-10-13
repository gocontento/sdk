'use client';

import { usePreviewBridge } from './usePreviewBridge';

interface PreviewBridgeProps {
    draftMode: boolean;
}

export function PreviewBridge({ draftMode }: PreviewBridgeProps) {
    usePreviewBridge(draftMode);
    return <></>;
}
