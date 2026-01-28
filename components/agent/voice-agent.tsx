"use client"

import {
    LiveKitRoom,
    RoomAudioRenderer,
    BarVisualizer,
    ControlBar,
    AgentState,
    useRoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { Track } from "livekit-client";

export function VoiceAgent({ token, url }: { token: string; url: string }) {
    return (
        <LiveKitRoom
            token={token}
            serverUrl={url}
            connect={true}
            audio={true}
            video={false}
            className="flex flex-col items-center justify-center gap-4 min-h-[400px] w-full bg-muted/50 rounded-lg border p-4"
        >
            <div className="flex flex-col items-center gap-2">
                <div className="text-lg font-semibold">Voice Agent Active</div>
                <div className="text-sm text-muted-foreground">Listening...</div>
            </div>

            <div className="flex h-32 w-full items-center justify-center">
                <BarVisualizer
                    state="listening"
                    barCount={7}
                    trackRef={{
                        publication: undefined,
                        source: Track.Source.Microphone,
                    }}
                    className="h-full w-full"
                />
            </div>

            <RoomAudioRenderer />
            <ControlBar />
        </LiveKitRoom>
    );
}
