'use client';

import { usePreviewBridge } from './usePreviewBridge';
import styled from 'styled-components';

interface PreviewBridgeProps {
    draftMode: boolean;
}

const PreviewBubble = styled.a`
    position: fixed;
    bottom: 10px;
    left: 10px;
    //transform: translate(-50%, -50%);
    width: 200px;
    border-radius: 20px;
    height: 40px;
    background: #f1efec;
    border: solid 1px #00d6b5;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export function PreviewBridge({ draftMode }: PreviewBridgeProps) {
    const isInContentoIframe = usePreviewBridge(draftMode);
    return draftMode && !isInContentoIframe ? (
        <PreviewBubble href="/api/disable-draft">Exit draft mode</PreviewBubble>
    ) : null;
}
