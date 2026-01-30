"use client"

import {
    LiveKitRoom,
    RoomAudioRenderer,
    BarVisualizer,
    ControlBar,
    useVoiceAssistant,
} from "@livekit/components-react";
import "@livekit/components-styles";
;

export interface VoiceAgentProps {
    token: string;
    url: string;
    onDisconnect: () => void;
}

export function VoiceAgent({ token, url, onDisconnect }: VoiceAgentProps) {
    return (
        <LiveKitRoom
            token={token}
            serverUrl={url}
            connect={true}
            audio={true}
            video={false}
            onDisconnected={onDisconnect}
            className="flex flex-col items-center justify-center gap-4 min-h-[400px] w-full bg-muted/50 rounded-lg border p-4"
        >
            <SimpleVoiceAssistant />
            <RoomAudioRenderer />
            <ControlBar />
        </LiveKitRoom>
    );
}

function SimpleVoiceAssistant() {
    const { state, audioTrack } = useVoiceAssistant();

    return (
        <div className="flex flex-col items-center justify-center gap-4 w-full">
            <div className="flex flex-col items-center gap-2">
                <div className="text-lg font-semibold">
                    {state === "speaking" ? "Agent Speaking" : "Agent Listening"}
                </div>
                <div className="text-sm text-muted-foreground capitalize">
                    {state}
                </div>
            </div>

            <div className="flex h-32 w-full items-center justify-center">
                <BarVisualizer
                    state={state}
                    barCount={7}
                    trackRef={audioTrack}
                    className="h-full w-full"
                />
            </div>
        </div>
    );
}
