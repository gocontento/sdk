'use client';

import { useRouter } from 'next/navigation';
import usePreviewBridge from './usePreviewBridge';

interface PreviewBridgeProps {
    draftMode: boolean;
}

export default function PreviewBridge({ draftMode }: PreviewBridgeProps) {
    usePreviewBridge(draftMode, useRouter());
    return null;
}
