import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import System from "@/models/system";
import _regeneratorRuntime from "regenerator-runtime";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

const STTProviderContext = createContext();

/**
 * Context provider for STT functionality.
 * Routes to either native browser STT or Deepgram based on user settings.
 */
export function STTProvider({ children }) {
    const [provider, setProvider] = useState("native");
    const [apiKey, setApiKey] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getSTTSettings() {
            // Fetch both the provider and the actual API key
            const { provider: sttProvider, apiKey: sttKey } = await System.getSTTKey();
            setProvider(sttProvider ?? "native");
            setApiKey(sttKey);
            setLoading(false);
        }
        getSTTSettings();
    }, []);

    return (
        <STTProviderContext.Provider
            value={{
                provider,
                apiKey,
                loading,
            }}
        >
            {children}
        </STTProviderContext.Provider>
    );
}

/**
 * Hook to get STT provider settings.
 */
export function useSTTProvider() {
    const context = useContext(STTProviderContext);
    if (!context)
        throw new Error("useSTTProvider must be used within a STTProvider");
    return context;
}

/**
 * Hook for Deepgram real-time STT using WebSocket.
 * Returns the same interface as useSpeechRecognition for compatibility.
 */
export function useDeepgramSTT(apiKey) {
    const [transcript, setTranscript] = useState("");
    const [listening, setListening] = useState(false);
    const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState(true);
    const socketRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    const resetTranscript = useCallback(() => {
        setTranscript("");
    }, []);

    const startListening = useCallback(async () => {
        if (!apiKey) {
            console.error("[DeepgramSTT] No API key configured");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Connect to Deepgram WebSocket
            const socket = new WebSocket(
                "wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&interim_results=true",
                ["token", apiKey]
            );

            socket.onopen = () => {
                console.log("[DeepgramSTT] WebSocket connected");
                setListening(true);

                // Use MediaRecorder to capture audio
                const mediaRecorder = new MediaRecorder(stream, {
                    mimeType: "audio/webm",
                });

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                        socket.send(event.data);
                    }
                };

                mediaRecorder.start(250); // Send audio data every 250ms
                mediaRecorderRef.current = mediaRecorder;
            };

            socket.onmessage = (message) => {
                const data = JSON.parse(message.data);
                const transcriptText = data?.channel?.alternatives?.[0]?.transcript;

                if (transcriptText && data.is_final) {
                    setTranscript((prev) => prev + (prev ? " " : "") + transcriptText);
                }
            };

            socket.onerror = (error) => {
                console.error("[DeepgramSTT] WebSocket error:", error);
            };

            socket.onclose = () => {
                console.log("[DeepgramSTT] WebSocket closed");
                setListening(false);
            };

            socketRef.current = socket;
        } catch (error) {
            console.error("[DeepgramSTT] Error starting:", error);
            setIsMicrophoneAvailable(false);
        }
    }, [apiKey]);

    const stopListening = useCallback(() => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
            mediaRecorderRef.current = null;
        }
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
        setListening(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopListening();
        };
    }, [stopListening]);

    return {
        transcript,
        listening,
        resetTranscript,
        isMicrophoneAvailable,
        startListening,
        stopListening,
        browserSupportsSpeechRecognition: true, // Deepgram works in all browsers
        browserSupportsContinuousListening: true,
    };
}

/**
 * Hook that returns STT functions based on the configured provider.
 * Provides a unified interface for both native and Deepgram STT.
 */
export function useSTT() {
    const { provider, apiKey } = useSTTProvider();

    const nativeSTT = useSpeechRecognition({
        clearTranscriptOnListen: true,
    });

    const deepgramSTT = useDeepgramSTT(apiKey);

    if (provider === "deepgram" && apiKey) {
        return {
            ...deepgramSTT,
            provider: "deepgram",
            startListening: deepgramSTT.startListening,
            stopListening: deepgramSTT.stopListening,
        };
    }

    // Default to native browser STT
    return {
        ...nativeSTT,
        provider: "native",
        startListening: (options) => SpeechRecognition.startListening(options),
        stopListening: () => SpeechRecognition.stopListening(),
    };
}
