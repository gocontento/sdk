'use client';

import { usePreviewBridge } from './usePreviewBridge';
import styled from 'styled-components';

interface PreviewBridgeProps {
    draftMode: boolean;
    exitDraftModeUrl?: string;
}

const PreviewToolbar = styled.a`
    box-sizing: border-box;
    font-size: 14px;
    line-height: 1;
    color: #ffffff;
    font-family: Inter, sans-serif;
    position: fixed;
    bottom: 10px;
    left: 10px;
    border-radius: calc(infinity * 1px);
    padding: 10px;
    background: #2b2b29;
    border: solid 2px #1b1b1b;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

    &:hover {
        background: #1b1b1b;
    }

    * {
        box-sizing: border-box;
    }
`;

const TextContainer = styled.span`
    padding-left: 10px;
    padding-right: 10px;
`;

export function PreviewBridge({
    draftMode,
    exitDraftModeUrl = '/api/disable-draft',
}: PreviewBridgeProps) {
    const showPreviewToolbar = usePreviewBridge();
    return draftMode && showPreviewToolbar ? (
        <PreviewToolbar href={exitDraftModeUrl}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#00D6B5"
                height="20"
                viewBox="0 0 143.3 146.9"
            >
                <path d="M93.1 1.7c27.6 5.4 54.5 31.5 49.6 54.8-2.6 12.7-15.4 24.2-31.6 25.2C75.8 84 77.7 65.2 61 61.9 48.5 59.5 30.6 63 25.5 83.1c-7.9 31 24.9 53.1 53.1 52.7 46-.7 58.1-19.2 58.1-19.2-8.3 14.4-38 36.4-76.5 28.8C21 137.7-7 99.8 1.5 58.8 10.1 17.6 48.9-7 93.1 1.7" />
            </svg>
            <TextContainer>Click to exit preview mode</TextContainer>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#ffffff"
                height="16"
                viewBox="0 0 512 512"
            >
                <path d="M443.6 387.1 312.4 255.4l131.5-130c5.4-5.4 5.4-14.2 0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4-3.7 0-7.2 1.5-9.8 4L256 197.8 124.9 68.3c-2.6-2.6-6.1-4-9.8-4-3.7 0-7.2 1.5-9.8 4L68 105.9c-5.4 5.4-5.4 14.2 0 19.6l131.5 130L68.4 387.1c-2.6 2.6-4.1 6.1-4.1 9.8 0 3.7 1.4 7.2 4.1 9.8l37.4 37.6c2.7 2.7 6.2 4.1 9.8 4.1 3.5 0 7.1-1.3 9.8-4.1L256 313.1l130.7 131.1c2.7 2.7 6.2 4.1 9.8 4.1 3.5 0 7.1-1.3 9.8-4.1l37.4-37.6c2.6-2.6 4.1-6.1 4.1-9.8-.1-3.6-1.6-7.1-4.2-9.7z" />
            </svg>
        </PreviewToolbar>
    ) : null;
}
