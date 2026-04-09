// import React, { useState, useRef, useEffect } from "react";
// import { Send, Mic } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { RefreshCw } from "lucide-react";
// import api from "@/services";
// interface DIDConfig {
//   key: string;
//   websocketUrl: string;
//   service: "talks" | "clips";
//   elevenlabsKey: string;
// }

// interface StreamingState {
//   peerConnectionState: string;
//   iceConnectionState: string;
//   iceGatheringState: string;
//   signalingState: string;
//   streamingStatus: string;
//   streamEvent: string;
// }

// const AITeacherInterface = () => {
//   const DID_CONFIG: DIDConfig = {
//     key: import.meta.env.VITE_DID_WEBSOCKET_KEY,
//     websocketUrl: import.meta.env.VITE_DID_WEBSOCKET_URL,
//     service: "clips",
//     elevenlabsKey: import.meta.env.VITE_ELEVENLABS_API_KEY,
//   };

//   const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
//   const dataChannelRef = useRef<RTCDataChannel | null>(null);
//   const wsRef = useRef<WebSocket | null>(null);
//   const statsIntervalRef = useRef(null);
//   const streamVideoRef = useRef<HTMLVideoElement>(null);
//   const inactivityTimerRef = useRef(null);
//   const recognitionRef = useRef(null);

//   const [streamingState, setStreamingState] = useState<StreamingState>({
//     peerConnectionState: "",
//     iceConnectionState: "",
//     iceGatheringState: "",
//     signalingState: "",
//     streamingStatus: "empty",
//     streamEvent: "",
//   });
//   const [isConnected, setIsConnected] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [isStreamReady, setIsStreamReady] = useState(false);
//   const [userQuery, setUserQuery] = useState("");
//   const [isStreaming, setIsStreaming] = useState(false);
//   const [streamState, setStreamState] = useState<"idle" | "live">("idle");
//   const [isMicActive, setIsMicActive] = useState(false);
//   const [isListening, setIsListening] = useState(false);

//   const [hasGreeted, setHasGreeted] = useState(false);

//   const streamIdRef = useRef<string>("");
//   const sessionIdRef = useRef<string>("");
//   const lastBytesReceivedRef = useRef<number>(0);

//   const PRESENTER_TYPE = DID_CONFIG.service === "clips" ? "clip" : "talk";
//   const presenterInput =
//     DID_CONFIG.service === "talks"
//       ? {
//           source_url:
//             "https://twindevelopment.s3-accelerate.amazonaws.com/images/twinProfile/1774507605397-blob.png",
//         }
//       : {
//           presenter_id: "v2_private_org_ktXMiGmVkFbbum_FzfXOX@x_yER5p14p",
         
//         };

//   useEffect(() => {
//     const SpeechRecognition =
//       (window as any).SpeechRecognition ||
//       (window as any).webkitSpeechRecognition;
//     if (SpeechRecognition) {
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = false;
//       recognitionRef.current.interimResults = true;
//       recognitionRef.current.lang = "en-US";

//       recognitionRef.current.onresult = (event) => {
//         let interim = "";
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const transcript = event.results[i][0].transcript;
//           if (event.results[i].isFinal) {
//             setUserQuery((prev) => prev + (prev ? " " : "") + transcript);
//           } else {
//             interim += transcript;
//           }
//         }
//       };

//       recognitionRef.current.onerror = (event) => {
//         console.error("Speech recognition error", event.error);
//         setIsListening(false);
//       };

//       recognitionRef.current.onend = () => {
//         setIsListening(false);
//       };
//     }
//   }, []);

//   useEffect(() => {
//     handleConnect();
//     return () => {
//       handleDestroy();
//     };
//   }, []);
//   useEffect(() => {
//     if (isStreamReady && !hasGreeted && wsRef.current && streamIdRef.current) {
//       const sendGreeting = async () => {
//         const greetingMessage =
//         "Hey, Welcome I'm Natasha Graziano, your coach and guide on this transformation journey. I went from broke, homeless, and bedridden to building an eight-figure business, healing my body, and manifesting my dream life using the exact tools I'm about to share with you. Everything you're about to learn is rooted in neuroscience, ancient wisdom, and my own lived experience. Are you ready to become the most powerful version of yourself? Let's begin  because your transformation starts right now";
//         try {
//           let chunks = greetingMessage.split(" ");
//           chunks.push('<break time="1s" />');
//           chunks.push("");

//           chunks.forEach((chunk, index) => {
//             const streamMessage = {
//               type: "stream-text",
//               payload: {
//                 script: {
//                   type: "text",
//                   input: chunk + " ",
//                   provider: {
//                     type: "elevenlabs",
//                     voice_id: "tVWrseTvJcyWahIrevyA",
//                     model_id: "eleven_turbo_v2_5",
//                     access: "external-private",
//                     voice_config: {
//                       stability: 0.5,
//                       similarity_boost: 0.75,
//                     },
//                   },
//                   ssml: true,
//                 },

//                 config: { fluent: false, pad_audio: 0, stitch: true },

//                 apiKeysExternal: {
//                   elevenlabs: { key: import.meta.env.VITE_ELEVENLABS_API_KEY },
//                 },
//                 background: {
//                   color: "#FFFFFF",
//                 },
//                 index,
//                 session_id: sessionIdRef.current,
//                 stream_id: streamIdRef.current,
//                 presenter_type: PRESENTER_TYPE,
//               },
//             };
//             sendMessage(wsRef.current!, streamMessage);
//           });

//           setHasGreeted(true);
//         } catch (error) {
//           console.error("Error sending greeting:", error);
//         }
//       };

//       const greetingTimeout = setTimeout(sendGreeting, 1000);
//       return () => clearTimeout(greetingTimeout);
//     }
//   }, [isStreamReady, hasGreeted]);

//   useEffect(() => {
//     if (!isConnected) return;

//     const resetTimer = () => {
//       if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
//       inactivityTimerRef.current = setTimeout(
//         () => {
//           if (isConnected && !isStreaming) {
//             handleDestroy();
//           }
//         },
//         5 * 60 * 1000
//       );
//     };

//     resetTimer();
//     window.addEventListener("click", resetTimer);
//     window.addEventListener("keydown", resetTimer);

//     return () => {
//       window.removeEventListener("click", resetTimer);
//       window.removeEventListener("keydown", resetTimer);
//     };
//   }, [isConnected, isStreaming]);

//   const connectToWebSocket = (
//     url: string,
//     token: string
//   ): Promise<WebSocket> => {
//     return new Promise((resolve, reject) => {
//       const wsUrl = `${url}?authorization=Basic ${encodeURIComponent(token)}`;
//       const ws = new WebSocket(wsUrl);

//       ws.onopen = () => {
//         console.log("WebSocket connection opened");
//         resolve(ws);
//       };

//       ws.onerror = (err) => {
//         console.error("WebSocket error:", err);
//         reject(err);
//       };

//       ws.onclose = () => {
//         console.log("WebSocket connection closed");
//       };
//     });
//   };

//   const sendMessage = (ws: WebSocket, message: any) => {
//     if (ws.readyState === WebSocket.OPEN) {
//       ws.send(JSON.stringify(message));
//     } else {
//       console.error("WebSocket is not open. Cannot send message.");
//     }
//   };

//   const createPeerConnection = async (
//     offer: RTCSessionDescriptionInit,
//     iceServers: RTCIceServer[]
//   ): Promise<RTCSessionDescription> => {
//     if (!peerConnectionRef.current) {
//       const pc = new RTCPeerConnection({ iceServers });
//       dataChannelRef.current = pc.createDataChannel("JanusDataChannel");
//       dataChannelRef.current.addEventListener("message", onStreamEvent);
//       pc.addEventListener("icegatheringstatechange", onIceGatheringStateChange);
//       pc.addEventListener("icecandidate", onIceCandidate);
//       pc.addEventListener(
//         "iceconnectionstatechange",
//         onIceConnectionStateChange
//       );
//       pc.addEventListener("connectionstatechange", onConnectionStateChange);
//       pc.addEventListener("signalingstatechange", onSignalingStateChange);
//       pc.addEventListener("track", onTrack);
//       peerConnectionRef.current = pc;
//     }

//     const pc = peerConnectionRef.current;
//     await pc.setRemoteDescription(new RTCSessionDescription(offer));
//     console.log("set remote sdp OK");
//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);
//     console.log("set local sdp OK");
//     return answer as any;
//   };

//   const onIceGatheringStateChange = () => {
//     const state = peerConnectionRef.current?.iceGatheringState || "";
//     setStreamingState((prev) => ({ ...prev, iceGatheringState: state }));
//   };

//   const onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
//     if (event.candidate) {
//       const { candidate, sdpMid, sdpMLineIndex } = event.candidate;
//       sendMessage(wsRef.current!, {
//         type: "ice",
//         payload: {
//           session_id: sessionIdRef.current,
//           candidate,
//           sdpMid,
//           sdpMLineIndex,
//           presenter_type: PRESENTER_TYPE,
//         },
//       });
//     } else {
//       sendMessage(wsRef.current!, {
//         type: "ice",
//         payload: {
//           stream_id: streamIdRef.current,
//           session_id: sessionIdRef.current,
//           presenter_type: PRESENTER_TYPE,
//         },
//       });
//     }
//   };

//   const onIceConnectionStateChange = () => {
//     const state = peerConnectionRef.current?.iceConnectionState || "";
//     setStreamingState((prev) => ({ ...prev, iceConnectionState: state }));
//     if (state === "failed" || state === "closed") {
//       stopAllStreams();
//       closePC();
//     }
//   };

//   const onConnectionStateChange = () => {
//     const state = peerConnectionRef.current?.connectionState || "";
//     setStreamingState((prev) => ({ ...prev, peerConnectionState: state }));
//     if (state === "connected") {
//       setIsConnecting(false);
//       setIsConnected(true);
//       setTimeout(() => {
//         if (!isStreamReady) {
//           setIsStreamReady(true);
//           setStreamingState((prev) => ({ ...prev, streamEvent: "ready" }));
//         }
//       }, 5000);
//     }
//   };

//   const onSignalingStateChange = () => {
//     const state = peerConnectionRef.current?.signalingState || "";
//     setStreamingState((prev) => ({ ...prev, signalingState: state }));
//   };

//   const onTrack = (event: RTCTrackEvent) => {
//     if (!event.track) return;

//     if (streamVideoRef.current && event.streams[0]) {
//       streamVideoRef.current.srcObject = event.streams[0];
//       streamVideoRef.current.play().catch(() => {});
//       setStreamState("live");
//       setStreamingState((prev) => ({
//         ...prev,
//         streamingStatus: "streaming",
//       }));
//     }

//     statsIntervalRef.current = setInterval(async () => {
//       if (!peerConnectionRef.current) return;
//       const stats = await peerConnectionRef.current.getStats(event.track);
//       stats.forEach((report) => {
//         if (report.type === "inbound-rtp" && report.kind === "video") {
//           const bytesReceived = report.bytesReceived as number;
//           lastBytesReceivedRef.current = bytesReceived;
//         }
//       });
//     }, 1000);
//   };

//   const onStreamEvent = (event: MessageEvent) => {
//     if (dataChannelRef.current?.readyState === "open") {
//       const [eventType] = event.data.split(":");
//       let status = "dont-care";

//       if (eventType === "stream/started") {
//         status = "started";
//         setStreamState("live");
//       }
//       if (eventType === "stream/done") {
//         status = "done";
//         setIsStreaming(false);
//         setTimeout(() => {
//           setStreamState("idle");
//         }, 1000);
//       }
//       if (eventType === "stream/ready") status = "ready";
//       if (eventType === "stream/error") status = "error";

//       if (status === "ready") {
//         setTimeout(() => {
//           setIsStreamReady(true);
//           setStreamingState((prev) => ({ ...prev, streamEvent: "ready" }));
//         }, 1000);
//       } else {
//         setStreamingState((prev) => ({ ...prev, streamEvent: eventType }));
//       }
//     }
//   };

//   const stopAllStreams = () => {
//     if (streamVideoRef.current?.srcObject) {
//       const tracks = (
//         streamVideoRef.current.srcObject as MediaStream
//       ).getTracks();
//       tracks.forEach((track) => track.stop());
//       streamVideoRef.current.srcObject = null;
//       setStreamState("idle");
//     }
//   };

//   const closePC = () => {
//     const pc = peerConnectionRef.current;
//     if (!pc) return;

//     pc.close();
//     pc.removeEventListener(
//       "icegatheringstatechange",
//       onIceGatheringStateChange
//     );
//     pc.removeEventListener("icecandidate", onIceCandidate);
//     pc.removeEventListener(
//       "iceconnectionstatechange",
//       onIceConnectionStateChange
//     );
//     pc.removeEventListener("connectionstatechange", onConnectionStateChange);
//     pc.removeEventListener("signalingstatechange", onSignalingStateChange);
//     pc.removeEventListener("track", onTrack);

//     if (dataChannelRef.current) {
//       dataChannelRef.current.removeEventListener("message", onStreamEvent);
//     }

//     if (statsIntervalRef.current) {
//       clearInterval(statsIntervalRef.current);
//     }

//     setIsStreamReady(false);
//     setStreamState("idle");
//     setHasGreeted(false);
//     setStreamingState({
//       peerConnectionState: "",
//       iceConnectionState: "",
//       iceGatheringState: "",
//       signalingState: "",
//       streamingStatus: "empty",
//       streamEvent: "",
//     });

//     peerConnectionRef.current = null;
//     dataChannelRef.current = null;
//   };

//   const handleConnect = async () => {
//     if (isConnected || isConnecting) {
//       return;
//     }

//     setIsConnecting(true);
//     stopAllStreams();
//     closePC();

//     try {
//       wsRef.current = await connectToWebSocket(
//         DID_CONFIG.websocketUrl,
//         DID_CONFIG.key
//       );

//       const startStreamMessage = {
//         type: "init-stream",
//         payload: {
//           ...presenterInput,
//           presenter_type: PRESENTER_TYPE,
//         },
//       };

//       sendMessage(wsRef.current, startStreamMessage);

//       wsRef.current.onmessage = async (event) => {
//         const data = JSON.parse(event.data);

//         switch (data.messageType) {
//           case "init-stream":
//             const {
//               id: newStreamId,
//               offer,
//               ice_servers: iceServers,
//               session_id: newSessionId,
//             } = data;
//             streamIdRef.current = newStreamId;
//             sessionIdRef.current = newSessionId;
//             console.log("init-stream", newStreamId, newSessionId);

//             try {
//               const answer = await createPeerConnection(offer, iceServers);
//               const sdpMessage = {
//                 type: "sdp",
//                 payload: {
//                   answer: answer,
//                   session_id: sessionIdRef.current,
//                   presenter_type: PRESENTER_TYPE,
//                 },
//               };
//               sendMessage(wsRef.current!, sdpMessage);
//             } catch (e) {
//               console.error("Error during streaming setup", e);
//               stopAllStreams();
//               closePC();
//               setIsConnecting(false);
//             }
//             break;
//           case "sdp":
//             console.log("SDP message received");
//             break;
//           case "delete-stream":
//             console.log("Stream deleted");
//             break;
//         }
//       };
//     } catch (error) {
//       console.error("Failed to connect:", error);
//       setIsConnecting(false);
//       alert("Failed to connect to D-ID service");
//     }
//   };

//   const handleStreamQuery = async () => {
//     if (!userQuery.trim()) {
//       alert("Please enter a question");
//       return;
//     }

//     if (!wsRef.current || !streamIdRef.current) {
//       alert("AI Teacher is not ready yet. Please wait...");
//       return;
//     }

//     setIsStreaming(true);

//     const payload = {
      
//       userQuery: userQuery,
      
//     };

//     const chatRes = await api.post(`${import.meta.env.VITE_API_BASE_URL}/chat/teacher-response`,
//       payload
//     );
//     const aiResponse = chatRes.data.response;
//     console.log("AI Response:", aiResponse);
//     let chunks = aiResponse.split(" ");
//     chunks.push('<break time="1s" />');
//     chunks.push("");

//     chunks.forEach((chunk, index) => {
//       const streamMessage = {
//         type: "stream-text",
//         payload: {
//           script: {
//             type: "text",
//             input: chunk + " ",
//             provider: {
//               type: "elevenlabs",
//               voice_id: "tVWrseTvJcyWahIrevyA",
//               model_id: "eleven_turbo_v2_5",
//               access: "external-private",
//               voice_config: {
//                 stability: 0.5,
//                 similarity_boost: 0.75,
//               },
//             },
//             ssml: true,
//           },
//           config: { fluent: false, pad_audio: 0, stitch: true },
//           apiKeysExternal: {
//             elevenlabs: { key: import.meta.env.VITE_ELEVENLABS_API_KEY },
//           },
//           background: {
//             color: "#FFFFFF",
//           },
//           index,
//           session_id: sessionIdRef.current,
//           stream_id: streamIdRef.current,
//           presenter_type: PRESENTER_TYPE,
//         },
//       };
//       sendMessage(wsRef.current!, streamMessage);
//     });

//     setUserQuery("");
//   };

//   const handleDestroy = () => {
//     if (wsRef.current && streamIdRef.current) {
//       const streamMessage = {
//         type: "delete-stream",
//         payload: {
//           session_id: sessionIdRef.current,
//           stream_id: streamIdRef.current,
//         },
//       };
//       sendMessage(wsRef.current, streamMessage);
//     }

//     if (wsRef.current) {
//       wsRef.current.close();
//       wsRef.current = null;
//     }

//     stopAllStreams();
//     closePC();
//     setIsConnected(false);
//     setIsConnecting(false);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleStreamQuery();
//     }
//   };

//   const startMicInput = () => {
//     if (recognitionRef.current) {
//       setIsListening(true);
//       setIsMicActive(true);
//       recognitionRef.current.start();
//     }
//   };

//   const stopMicInput = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     }
//   };

//   const toggleMic = () => {
//     if (isListening) {
//       stopMicInput();
//       setIsMicActive(false);
//     } else {
//       startMicInput();
//     }
//   };

//   if (!isConnected && !isConnecting) {
//     return null;
//   }

//   return (
//     <>
//       <h2 className="mt-2">Live Class</h2>
//       <Card className="bg-[#FFFFFF0D] shadow-md mt-6 w-full max-w-full mx-auto border-none rounded-xl min-h-[400px] lg:min-h-[600px]">
//         <div className="flex justify-end p-4 pb-0">
//           <button className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white rounded-full font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95" onClick={()=>window.location.reload()}>
//             <RefreshCw size={14} />
//             Restart
//           </button>
//         </div>
//         <div className="w-full h-full flex flex-col lg:flex-row gap-4 lg:gap-8 items-center justify-between p-4">
//           <div className="flex-1 flex flex-col justify-center gap-4 lg:gap-6 px-2 order-2 lg:order-1 w-full">
//             <div className="flex justify-center mb-4 lg:mb-8">
//               <button
//                 onClick={toggleMic}
//                 disabled={isStreaming}
//                 className={`relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
//                   isMicActive
//                     ? "bg-gradient-to-br from-green-500 to-green-600 shadow-2xl shadow-green-500/50"
//                     : "bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 shadow-xl"
//                 }`}
//               >
//                 {isListening && (
//                   <>
//                     <div className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping"></div>
//                     <div className="absolute inset-0 rounded-full bg-green-400 opacity-50 animate-pulse"></div>
//                   </>
//                 )}

//                 <div className="relative z-10 flex items-center justify-center h-full">
//                   {isMicActive ? (
//                     <Mic size={32} className="text-white sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
//                   ) : (
//                     <Mic size={32} className="text-slate-300 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
//                   )}
//                 </div>
//               </button>
//             </div>

//             <textarea
//               value={userQuery}
//               onChange={(e) => setUserQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Type your question here... (Press Enter to send)"
//               disabled={isStreaming}
//               className="w-full px-4 py-3 sm:px-6 sm:py-4 rounded-2xl bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none disabled:opacity-50 transition-all duration-200 text-base lg:text-lg"
//               rows={3}
//             />

//             <button
//               onClick={handleStreamQuery}
//               disabled={isStreaming || !userQuery.trim()}
//               className="w-full px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 text-white rounded-2xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-[1.02]"
//             >
//               <Send size={20} className="sm:w-6 sm:h-6" />
//               {isStreaming ? "AI is responding..." : "Send Question"}
//             </button>
//           </div>

//           <div className="flex-1 flex items-center justify-center order-1 lg:order-2 w-full">
//             <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl aspect-square rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border-2 sm:border-4 border-slate-700 relative">
//               <div className="relative w-full h-full">
//                 <img
//                   src="https://twindevelopment.s3-accelerate.amazonaws.com/images/twinProfile/1774507605397-blob.png"
//                   alt="Teacher Avatar"
//                   className={`absolute object-top inset-0 object-contain w-full h-full transition-all duration-300 ${
//                     streamState === "live" ? "hidden" : "block"
//                   }`}
//                 />

//                 <video
//                   ref={streamVideoRef}
//                   autoPlay
//                   playsInline
//                   muted={false}
//                   onEnded={() => setStreamState("idle")}
//                   className={`absolute inset-0 object-cover w-full h-full transition-all duration-500 ${
//                     streamState === "live"
//                       ? "block opacity-100"
//                       : "hidden opacity-0"
//                   }`}
//                 />

//                 {isConnecting && (
//                   <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
//                     <div className="text-center">
//                       <div className="animate-spin rounded-full h-20 w-20 border-4 border-white border-t-pink-500 mx-auto mb-6"></div>
//                       <p className="text-white font-bold text-xl">
//                         Loading AI Teacher...
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {isConnected && !isConnecting && (
//                   <div className="absolute top-6 right-6 z-20">
//                     <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md px-5 py-3 rounded-full border-2 border-slate-600 shadow-xl">
//                       <div
//                         className={`w-3 h-3 rounded-full ${
//                           streamState === "live"
//                             ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50"
//                             : "bg-yellow-500 animate-pulse"
//                         }`}
//                       ></div>
//                       <p
//                         className={`font-bold text-sm ${
//                           streamState === "live"
//                             ? "text-green-400"
//                             : "text-yellow-400"
//                         }`}
//                       >
//                         {streamState === "live" ? "LIVE" : "READY"}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </>
//   );
// };

// export default AITeacherInterface;

import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, ArrowLeft, Loader2, VolumeX, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "@/services";
import { apiGetTeacherConfig, AvatarTeacherConfig } from "@/services/chat.api";
interface DIDConfig {
  key: string;
  websocketUrl: string;
  service: "talks" | "clips";
  elevenlabsKey: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface StreamingState {
  peerConnectionState: string;
  iceConnectionState: string;
  iceGatheringState: string;
  signalingState: string;
  streamingStatus: string;
  streamEvent: string;
}

const AITeacherInterface = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedTopic = searchParams.get("topic") || "";

  const [teacherConfig, setTeacherConfig] = useState<AvatarTeacherConfig | null>(null);
  const [teacherLoading, setTeacherLoading] = useState(true);

  const DID_CONFIG: DIDConfig = {
    key: import.meta.env.VITE_DID_WEBSOCKET_KEY,
    websocketUrl: import.meta.env.VITE_DID_WEBSOCKET_URL,
    service: (teacherConfig?.service as "talks" | "clips") || "talks",
    elevenlabsKey: import.meta.env.VITE_ELEVENLABS_API_KEY,
  };

  // Fetch teacher config from DB on mount
  useEffect(() => {
    if (!teacherId) { setTeacherLoading(false); return; }
    apiGetTeacherConfig(teacherId)
      .then((config) => setTeacherConfig(config))
      .catch(() => setTeacherConfig(null))
      .finally(() => setTeacherLoading(false));
  }, [teacherId]);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const statsIntervalRef = useRef(null);
  const streamVideoRef = useRef<HTMLVideoElement>(null);
  const inactivityTimerRef = useRef(null);
  const recognitionRef = useRef(null);

  const [streamingState, setStreamingState] = useState<StreamingState>({
    peerConnectionState: "",
    iceConnectionState: "",
    iceGatheringState: "",
    signalingState: "",
    streamingStatus: "empty",
    streamEvent: "",
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamState, setStreamState] = useState<"idle" | "live">("idle");
  const [isMicActive, setIsMicActive] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [isMuted, setIsMuted] = useState(false); // ADD THIS
  const [hasGreeted, setHasGreeted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const streamIdRef = useRef<string>("");
  const sessionIdRef = useRef<string>("");
  const lastBytesReceivedRef = useRef<number>(0);

  const PRESENTER_TYPE = DID_CONFIG.service === "clips" ? "clip" : "talk";
  const presenterInput =
    teacherConfig?.service === "talks"
      ? { source_url: teacherConfig.sourceUrl || "https://twindevelopment.s3-accelerate.amazonaws.com/images/twinProfile/1774507605397-blob.png" }
      : { presenter_id: teacherConfig?.presenterId || "v2_private_org_ktXMiGmVkFbbum_FzfXOX@x_yER5p14p" };

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setUserQuery((prev) => prev + (prev ? " " : "") + transcript);
          } else {
            interim += transcript;
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    if (teacherLoading || !teacherConfig) return;
    handleConnect();
    return () => {
      handleDestroy();
    };
  }, [teacherLoading, teacherConfig]);

  useEffect(() => {
    if (isStreamReady && !hasGreeted && wsRef.current && streamIdRef.current) {
      const sendGreeting = async () => {
        const greetingMessage =
          // teacherConfig?.name === "Natasha Graziano"
            // ? "Hey, Welcome I'm Natasha Graziano, your coach and guide on this transformation journey. I went from broke, homeless, and bedridden to building an eight-figure business, healing my body, and manifesting my dream life using the exact tools I'm about to share with you. Everything you're about to learn is rooted in neuroscience, ancient wisdom, and my own lived experience. Are you ready to become the most powerful version of yourself? Let's begin  because your transformation starts right now"
            // : 
            `Hey, Welcome I'm ${teacherConfig?.name || "your teacher"}, ${teacherConfig?.description || "your guide on this education journey"}. I'm excited to help you learn about ${selectedTopic || "today's lesson"} today. Are you ready to begin?`;
        try {
          let chunks = greetingMessage.split(" ");
          chunks.push('<break time="1s" />');
          chunks.push("");

          chunks.forEach((chunk, index) => {
            const streamMessage = {
              type: "stream-text",
              payload: {
                script: {
                  type: "text",
                  input: chunk + " ",
                  provider: {
                    type: "elevenlabs",
                    voice_id: teacherConfig?.voiceId || "tVWrseTvJcyWahIrevyA",
                    model_id: "eleven_turbo_v2_5",
                    access: "external-private",
                    voice_config: {
                      stability: 0.5,
                      similarity_boost: 0.75,
                    },
                  },
                  ssml: true,
                },
                config: { fluent: false, pad_audio: 0, stitch: true },
                apiKeysExternal: {
                  elevenlabs: { key: import.meta.env.VITE_ELEVENLABS_API_KEY },
                },
                background: {
                  color: "#FFFFFF",
                },
                index,
                session_id: sessionIdRef.current,
                stream_id: streamIdRef.current,
                presenter_type: PRESENTER_TYPE,
              },
            };
            sendMessage(wsRef.current!, streamMessage);
          });

          setMessages([{ role: "assistant", content: "" }]);
          let currentContent = "";
          const words = greetingMessage.split(" ");
          
          for (let i = 0; i < words.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 80)); // Simulate speech speed
            currentContent += (i === 0 ? "" : " ") + words[i];
            setMessages([{ role: "assistant", content: currentContent }]);
          }

          setHasGreeted(true);
        } catch (error) {
          console.error("Error sending greeting:", error);
        }
      };

      const greetingTimeout = setTimeout(sendGreeting, 1000);
      return () => clearTimeout(greetingTimeout);
    }
  }, [isStreamReady, hasGreeted]);

  useEffect(() => {
    if (!isConnected) return;

    const resetTimer = () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(
        () => {
          if (isConnected && !isStreaming) {
            handleDestroy();
          }
        },
        5 * 60 * 1000
      );
    };

    resetTimer();
    window.addEventListener("click", resetTimer);
    window.addEventListener("keydown", resetTimer);

    return () => {
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [isConnected, isStreaming]);

  const connectToWebSocket = (
    url: string,
    token: string
  ): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      const wsUrl = `${url}?authorization=Basic ${encodeURIComponent(token)}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connection opened");
        resolve(ws);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        reject(err);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
    });
  };

  const sendMessage = (ws: WebSocket, message: any) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open. Cannot send message.");
    }
  };

  const createPeerConnection = async (
    offer: RTCSessionDescriptionInit,
    iceServers: RTCIceServer[]
  ): Promise<RTCSessionDescription> => {
    if (!peerConnectionRef.current) {
      const pc = new RTCPeerConnection({ iceServers });
      dataChannelRef.current = pc.createDataChannel("JanusDataChannel");
      dataChannelRef.current.addEventListener("message", onStreamEvent);
      pc.addEventListener("icegatheringstatechange", onIceGatheringStateChange);
      pc.addEventListener("icecandidate", onIceCandidate);
      pc.addEventListener(
        "iceconnectionstatechange",
        onIceConnectionStateChange
      );
      pc.addEventListener("connectionstatechange", onConnectionStateChange);
      pc.addEventListener("signalingstatechange", onSignalingStateChange);
      pc.addEventListener("track", onTrack);
      peerConnectionRef.current = pc;
    }

    const pc = peerConnectionRef.current;
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    console.log("set remote sdp OK");
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    console.log("set local sdp OK");
    return answer as any;
  };

  const onIceGatheringStateChange = () => {
    const state = peerConnectionRef.current?.iceGatheringState || "";
    setStreamingState((prev) => ({ ...prev, iceGatheringState: state }));
  };

  const onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      const { candidate, sdpMid, sdpMLineIndex } = event.candidate;
      sendMessage(wsRef.current!, {
        type: "ice",
        payload: {
          session_id: sessionIdRef.current,
          candidate,
          sdpMid,
          sdpMLineIndex,
          presenter_type: PRESENTER_TYPE,
        },
      });
    } else {
      sendMessage(wsRef.current!, {
        type: "ice",
        payload: {
          stream_id: streamIdRef.current,
          session_id: sessionIdRef.current,
          presenter_type: PRESENTER_TYPE,
        },
      });
    }
  };

  const onIceConnectionStateChange = () => {
    const state = peerConnectionRef.current?.iceConnectionState || "";
    setStreamingState((prev) => ({ ...prev, iceConnectionState: state }));
    if (state === "failed" || state === "closed") {
      stopAllStreams();
      closePC();
    }
  };

  const onConnectionStateChange = () => {
    const state = peerConnectionRef.current?.connectionState || "";
    setStreamingState((prev) => ({ ...prev, peerConnectionState: state }));
    if (state === "connected") {
      setIsConnecting(false);
      setIsConnected(true);
      setTimeout(() => {
        if (!isStreamReady) {
          setIsStreamReady(true);
          setStreamingState((prev) => ({ ...prev, streamEvent: "ready" }));
        }
      }, 5000);
    }
  };

  const onSignalingStateChange = () => {
    const state = peerConnectionRef.current?.signalingState || "";
    setStreamingState((prev) => ({ ...prev, signalingState: state }));
  };

  // ✅ FIXED: onTrack - start muted, unmute after play succeeds
  const onTrack = (event: RTCTrackEvent) => {
    if (!event.track) return;

    if (streamVideoRef.current && event.streams[0]) {
      streamVideoRef.current.srcObject = event.streams[0];
      streamVideoRef.current.muted = true;
      streamVideoRef.current
        .play()
        .then(() => {
          if (streamVideoRef.current) {
            streamVideoRef.current.muted = false;
          }
          setStreamState("live");
          setStreamingState((prev) => ({
            ...prev,
            streamingStatus: "streaming",
          }));
        })
        .catch((err) => {
          console.error("Video play failed:", err);
        });
    }

    statsIntervalRef.current = setInterval(async () => {
      if (!peerConnectionRef.current) return;
      const stats = await peerConnectionRef.current.getStats(event.track);
      stats.forEach((report) => {
        if (report.type === "inbound-rtp" && report.kind === "video") {
          const bytesReceived = report.bytesReceived as number;
          lastBytesReceivedRef.current = bytesReceived;
        }
      });
    }, 1000);
  };

  const onStreamEvent = (event: MessageEvent) => {
    if (dataChannelRef.current?.readyState === "open") {
      const [eventType] = event.data.split(":");
      let status = "dont-care";

      if (eventType === "stream/started") {
        status = "started";
        setStreamState("live");
      }
      if (eventType === "stream/done") {
        status = "done";
        setIsStreaming(false);
        // ✅ FIXED: increased delay to 3s so video finishes before hiding
        setTimeout(() => {
          setStreamState("idle");
        }, 3000);
      }
      if (eventType === "stream/ready") status = "ready";
      if (eventType === "stream/error") status = "error";

      if (status === "ready") {
        setTimeout(() => {
          setIsStreamReady(true);
          setStreamingState((prev) => ({ ...prev, streamEvent: "ready" }));
        }, 1000);
      } else {
        setStreamingState((prev) => ({ ...prev, streamEvent: eventType }));
      }
    }
  };

  const stopAllStreams = () => {
    if (streamVideoRef.current?.srcObject) {
      const tracks = (
        streamVideoRef.current.srcObject as MediaStream
      ).getTracks();
      tracks.forEach((track) => track.stop());
      streamVideoRef.current.srcObject = null;
      setStreamState("idle");
    }
  };

  const closePC = () => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    pc.close();
    pc.removeEventListener(
      "icegatheringstatechange",
      onIceGatheringStateChange
    );
    pc.removeEventListener("icecandidate", onIceCandidate);
    pc.removeEventListener(
      "iceconnectionstatechange",
      onIceConnectionStateChange
    );
    pc.removeEventListener("connectionstatechange", onConnectionStateChange);
    pc.removeEventListener("signalingstatechange", onSignalingStateChange);
    pc.removeEventListener("track", onTrack);

    if (dataChannelRef.current) {
      dataChannelRef.current.removeEventListener("message", onStreamEvent);
    }

    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
    }

    setIsStreamReady(false);
    setStreamState("idle");
    setHasGreeted(false);
    setStreamingState({
      peerConnectionState: "",
      iceConnectionState: "",
      iceGatheringState: "",
      signalingState: "",
      streamingStatus: "empty",
      streamEvent: "",
    });

    peerConnectionRef.current = null;
    dataChannelRef.current = null;
  };

  const handleConnect = async () => {
    if (isConnected || isConnecting) {
      return;
    }

    setIsConnecting(true);
    stopAllStreams();
    closePC();

    try {
      wsRef.current = await connectToWebSocket(
        DID_CONFIG.websocketUrl,
        DID_CONFIG.key
      );

      const startStreamMessage = {
        type: "init-stream",
        payload: {
          ...presenterInput,
          presenter_type: PRESENTER_TYPE,
        },
      };

      sendMessage(wsRef.current, startStreamMessage);

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        switch (data.messageType) {
          case "init-stream":
            const {
              id: newStreamId,
              offer,
              ice_servers: iceServers,
              session_id: newSessionId,
            } = data;
            streamIdRef.current = newStreamId;
            sessionIdRef.current = newSessionId;
            console.log("init-stream", newStreamId, newSessionId);

            try {
              const answer = await createPeerConnection(offer, iceServers);
              const sdpMessage = {
                type: "sdp",
                payload: {
                  answer: answer,
                  session_id: sessionIdRef.current,
                  presenter_type: PRESENTER_TYPE,
                },
              };
              sendMessage(wsRef.current!, sdpMessage);
            } catch (e) {
              console.error("Error during streaming setup", e);
              stopAllStreams();
              closePC();
              setIsConnecting(false);
            }
            break;
          case "sdp":
            console.log("SDP message received");
            break;
          case "delete-stream":
            console.log("Stream deleted");
            break;
        }
      };
    } catch (error) {
      console.error("Failed to connect:", error);
      setIsConnecting(false);
      alert("Failed to connect to D-ID service");
    }
  };

  const handleStreamQuery = async () => {
    if (!userQuery.trim()) {
      alert("Please enter a question");
      return;
    }

    if (!wsRef.current || !streamIdRef.current) {
      alert("AI Teacher is not ready yet. Please wait...");
      return;
    }

    setIsStreaming(true);
    setMessages((prev) => [...prev, { role: "user", content: userQuery }]);

    const payload = {
      userQuery: userQuery,
      teacherId: teacherId,
      topic: selectedTopic || undefined,
    };

    const chatRes = await api.post(
      `${import.meta.env.VITE_API_BASE_URL}/chat/teacher-response`,
      payload
    );
    const aiResponse = chatRes.data.response;
    console.log("AI Response:", aiResponse);
    
    // Initialize empty assistant message for streaming
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    
    // Simulate streaming text
    const words = aiResponse.split(" ");
    let currentContent = "";
    
    const streamWords = async () => {
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 150)); // Approx 150 words per minute
        currentContent += (i === 0 ? "" : " ") + words[i];
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = currentContent;
          return newMessages;
        });
      }
    };
    
    streamWords();

    let chunks = aiResponse.split(" ");
    chunks.push('<break time="1s" />');
    chunks.push("");

    chunks.forEach((chunk, index) => {
      const streamMessage = {
        type: "stream-text",
        payload: {
          script: {
            type: "text",
            input: chunk + " ",
            provider: {
              type: "elevenlabs",
              voice_id: teacherConfig?.voiceId || "tVWrseTvJcyWahIrevyA",
              model_id: "eleven_turbo_v2_5",
              access: "external-private",
              voice_config: {
                stability: 0.5,
                similarity_boost: 0.75,
              },
            },
            ssml: true,
          },
          config: { fluent: false, pad_audio: 0, stitch: true },
          apiKeysExternal: {
            elevenlabs: { key: import.meta.env.VITE_ELEVENLABS_API_KEY },
          },
          background: {
            color: "#FFFFFF",
          },
          index,
          session_id: sessionIdRef.current,
          stream_id: streamIdRef.current,
          presenter_type: PRESENTER_TYPE,
        },
      };
      sendMessage(wsRef.current!, streamMessage);
    });

    setUserQuery("");
  };

  const handleDestroy = () => {
    if (wsRef.current && streamIdRef.current) {
      const streamMessage = {
        type: "delete-stream",
        payload: {
          session_id: sessionIdRef.current,
          stream_id: streamIdRef.current,
        },
      };
      sendMessage(wsRef.current, streamMessage);
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    stopAllStreams();
    closePC();
    setIsConnected(false);
    setIsConnecting(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleStreamQuery();
    }
  };

  const startMicInput = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setIsMicActive(true);
      recognitionRef.current.start();
    }
  };

  const stopMicInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      stopMicInput();
      setIsMicActive(false);
    } else {
      startMicInput();
    }
  };
  const toggleMute = () => {
    if (streamVideoRef.current) {
      streamVideoRef.current.muted = !streamVideoRef.current.muted;
      setIsMuted((prev) => !prev);
    }
  };
  if (teacherLoading || !teacherConfig ) {
    return (
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mt-2 mb-1">
          <div className="flex items-center gap-3">
            <div className="w-16 h-5 bg-slate-800 rounded-md"></div>
            <div className="w-48 h-8 bg-slate-800 rounded-md"></div>
          </div>
          <div className="w-24 h-10 bg-slate-800 rounded-full"></div>
        </div>

        {/* Main Content Card Skeleton */}
        <Card className="bg-[#FFFFFF0D] shadow-md mt-4 w-full max-w-full mx-auto border-none rounded-xl min-h-[400px] lg:min-h-[600px] p-4">
          <div className="w-full h-full flex flex-col lg:flex-row gap-4 lg:gap-8 items-center justify-between">
            {/* Left Column (Interaction) */}
            <div className="flex-1 flex flex-col justify-center gap-4 lg:gap-8 px-2 order-2 lg:order-1 w-full">
              <div className="flex justify-center mb-4 lg:mb-8">
                <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-slate-800"></div>
              </div>
              <div className="w-full h-32 bg-slate-800/50 rounded-2xl border-2 border-slate-700"></div>
              <div className="w-full h-14 bg-slate-800 rounded-2xl"></div>
            </div>

            {/* Right Column (Video/Avatar) */}
            <div className="flex-1 flex items-center justify-center order-1 lg:order-2 w-full">
              <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl aspect-square rounded-2xl lg:rounded-3xl bg-slate-900 border-2 sm:border-4 border-slate-700 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="animate-spin text-pink-500 mb-4 mx-auto" size={48} />
                  <p className="text-slate-400 font-medium">Initializing AI Teacher...</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mt-2 mb-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/avatar-chat")}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h2 className="text-2xl font-bold">
            Live Class
            {teacherConfig && (
              <span className="text-primary"> · {teacherConfig.name}</span>
            )}
          </h2>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white rounded-full font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={14} />
          Restart
        </button>
      </div>
      <Card className="bg-[#FFFFFF0D] shadow-md mt-4 w-full max-w-full mx-auto border-none rounded-xl min-h-[500px] lg:min-h-[700px] flex flex-col">
        <div className="flex-1 w-full flex flex-col lg:flex-row gap-4 lg:gap-8 items-stretch p-4 overflow-hidden">
          {/* Left Column (Interaction & Chat) */}
          <div className="flex-1 flex flex-col gap-4 order-2 lg:order-1 min-w-0">
            {/* Chat History Area */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 scroll-smooth"
              style={{ maxHeight: 'calc(100vh - 450px)', minHeight: '200px' }}
            >
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm italic">
                  Waiting for connection...
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm lg:text-base leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-blue-600/90 text-white rounded-tr-none shadow-lg' 
                        : 'bg-slate-800/90 text-slate-200 rounded-tl-none border border-slate-700 shadow-lg'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input and Controls Area */}
            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex gap-3 items-end">

              <button
    onClick={toggleMute}
    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
      isMuted
        ? "bg-red-500 shadow-lg shadow-red-500/50 scale-110"
        : "bg-slate-700 hover:bg-slate-600 shadow-md"
    }`}
  >
    {isMuted ? (
      <VolumeX size={20} className="text-white" />
    ) : (
      <Volume2 size={20} className="text-slate-400" />
    )}
  </button>
                <button
                  onClick={toggleMic}
                  disabled={isStreaming}
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isMicActive
                      ? "bg-green-500 shadow-lg shadow-green-500/50 scale-110"
                      : "bg-slate-700 hover:bg-slate-600 shadow-md"
                  }`}
                >
                  {isListening ? (
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-white opacity-75 animate-ping"></div>
                      <Mic size={20} className="text-white relative z-10" />
                    </div>
                  ) : (
                    <Mic size={20} className={isMicActive ? "text-white" : "text-slate-400"} />
                  )}
                </button>
                <textarea
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isStreaming}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all resize-none text-sm lg:text-base h-12 min-h-[48px] max-h-32"
                />
              </div>

              <button
                onClick={handleStreamQuery}
                disabled={isStreaming || !userQuery.trim()}
                className="w-full h-12 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 text-white rounded-xl font-bold text-sm lg:text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform active:scale-95"
              >
                {isStreaming ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
                {isStreaming ? "AI is thinking..." : "Send Message"}
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center order-1 lg:order-2 w-full min-w-0">
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl aspect-square rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border-2 sm:border-4 border-slate-700 relative">
              <div className="relative w-full h-full">
                {/* Static avatar image — shown when not live */}
                <img
                  src={
                    teacherConfig?.imageUrl ||
                    "https://clips-presenters.d-id.com/v2/org_ktXMiGmVkFbbum_FzfXOX/N36sYJb7_p/RGqnBDNjg5/image.png"
                  }
                  alt={teacherConfig?.name || "Teacher Avatar"}
                  className={`absolute object-top inset-0 object-cover w-full h-full transition-all duration-300 ${
                    streamState === "live" ? "opacity-0 -z-10" : "opacity-100 z-10"
                  }`}
                />


                {/* ✅ FIXED: video always in DOM, visibility controlled via opacity/z-index */}
                <video
                  ref={streamVideoRef}
                  autoPlay
                  playsInline
                  muted
                  onEnded={() => setStreamState("idle")}
                  className={`absolute inset-0 object-cover w-full h-full transition-all duration-500 ${
                    streamState === "live"
                      ? "opacity-100 z-10"
                      : "opacity-0 -z-10"
                  }`}
                />

                {isConnecting && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-20 w-20 border-4 border-white border-t-pink-500 mx-auto mb-6"></div>
                      <p className="text-white font-bold text-xl">
                        Loading AI Teacher...
                      </p>
                    </div>
                  </div>
                )}

                {isConnected && !isConnecting && (
                  <div className="absolute top-6 right-6 z-20">
                    <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md px-5 py-3 rounded-full border-2 border-slate-600 shadow-xl">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          streamState === "live"
                            ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50"
                            : "bg-yellow-500 animate-pulse"
                        }`}
                      ></div>
                      <p
                        className={`font-bold text-sm ${
                          streamState === "live"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {streamState === "live" ? "LIVE" : "READY"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default AITeacherInterface;