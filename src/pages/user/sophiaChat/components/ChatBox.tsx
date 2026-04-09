import { useState, useEffect, useRef, useCallback } from "react";

import ChatInput from "./ChatInput";
import { useUserStore, useChatStore, useTokenStore } from "@/store";
import { useParams } from "react-router-dom";
import { base64ToBlob } from "@/lib/helpers/base64ToBlob";
import ChatLoader from "@/components/template/ChatLoader";
import Typed from "typed.js";
import api from "@/services";
import { errorMessages, socketErrorMessages } from "@/constants/bot-messages";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, SquarePen, Trash2 } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { useNavigate } from "react-router-dom";
const ChatBox = ({ personality, isImageLoading, onSophiaMessage }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTitleEdit, setIsTitleEdit] = useState(false);
  const { setAudio, setAudioEnabled, wordLimit, llm } = useChatStore();
  const socketRef = useRef(null);
  const { user } = useUserStore();
  const { sessionId } = useParams();
  const messagesEndRef = useRef(null);
  const typedRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const options = {
      strings: [
        'Your AI teacher is here<br><h1 class="text-4xl text-primary">Ask and Learn Live</h1>',
      ],

      typeSpeed: 60,
      startDelay: 600,
      showCursor: false,
    };

    const typed = new Typed(typedRef.current, options);

    return () => {
      typed.destroy();
    };
  }, []);
  // set audio to null
  useEffect(() => {
    setAudio(null);
    setAudioEnabled(true);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("new") === "true" || params.get("select") === "true") {
      setCurrentSessionId(null);
      setMessages([]);
      setIsTitleEdit(false);
      setAudio(null);
      setIsTyping(false);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      connectWebSocket();
      setIsProcessing(false);
    }
  }, [location.search]);

  useEffect(() => {
    if (sessionId) {
      setCurrentSessionId(sessionId);
      const loadChatHistory = async () => {
        const historyMessages = await fetchChatHistory(sessionId);
        setIsTitleEdit(true);
        const formatedData = historyMessages.map((data) => {
          return {
            id: data.id,
            user: data.role === "human" ? "User" : "Sophia",
            text: data.content,
          };
        });
        setMessages(formatedData);
      };
      loadChatHistory();
    }
  }, [sessionId]);

  const fetchChatHistory = async (sessionId) => {
    try {
      const response = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/chat/session-history/${sessionId}`
      );
      const data = response.data.data;
      return data.history;
    } catch (error) {
      return [];
    }
  };

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random()}`;
  };

  const scrollToBottom = useCallback((behavior) => {
    messagesEndRef.current?.scrollIntoView({
      behavior,
      block: "end",
    });
  }, []);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.user === "Sophia" && onSophiaMessage) {
      onSophiaMessage(lastMessage.text);
    }
  }, [messages, onSophiaMessage]);

  const connectWebSocket = () => {
    socketRef.current = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setConnectionStatus("connected");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "response":
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: generateUniqueId(),
              user: "Sophia",
              text: data.message?.response,
            },
          ]);
          setIsTyping(false);
          setIsProcessing(false);
          break;
        case "audio":
          setAudio(base64ToBlob(data.message, "audio/mp3") as Blob);
          break;
        case "character":
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            if (lastMessage && lastMessage.user === "Sophia") {
              const updatedMessage = {
                ...lastMessage,
                text: lastMessage.text + data.message,
              };
              return [...prevMessages.slice(0, -1), updatedMessage];
            } else {
              return [
                ...prevMessages,
                {
                  id: generateUniqueId(),
                  user: "Sophia",
                  text: data.message,
                  hasReference: false,
                },
              ];
            }
          });
          setIsTyping(false);
          // setIsProcessing(false);
          break;
        // case "reference_response":
        //   console.log(data.message.data,170)
        //   setMessages((prevMessages) => {
        //     const updatedMessages = [...prevMessages];
        //     for (let i = updatedMessages.length - 1; i >= 0; i--) {
        //       if (
        //         updatedMessages[i].user === "Sophia" &&
        //         !updatedMessages[i].hasReference
        //       ) {
        //         updatedMessages[i] = {
        //           ...updatedMessages[i],
        //           hasReference: true,
        //           referenceData: data?.message?.data,
        //           chatSessionId:data?.messages?.data?.chatSessionId,
        //           chatId:data?.messages?.data?.chatId
        //         };
        //         break;
        //       }
        //     }

        //     return updatedMessages;
        //   });
        //   setIsTyping(false);
        //   setIsProcessing(false);
        //   break;

        case "end":
          setIsTyping(false);
          setIsProcessing(false);
          break;
        case "error":
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: generateUniqueId(),
              user: "Sophia",
              text: data.message,
            },
          ]);
          setIsTyping(false);
          setIsProcessing(false);
          break;
        default:
          console.warn("Unhandled message type:", data.type);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
      setConnectionStatus("disconnected");
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("error");
      setIsProcessing(false);
    };
  };

  const createNewSession = async () => {
    try {
      const response = await api.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat/create-session`,
        {
          userId: user.userId || user.id,
          personalityId: personality?.personalityId,
        }
      );
      const newUrl = `${window.location.origin}/chat/${personality?.personalityId}/${response?.data?.data?.id}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
      return { sessionId: response.data.data.id, error: null };
    } catch (error) {
      const randomErrorMessage =
        errorMessages[Math.floor(Math.random() * errorMessages.length)];
      return { sessionId: null, error: randomErrorMessage };
    }
  };

  const handleUserMessage = async (message) => {
    if (!message.trim() || isProcessing) return;

    let sessionId = currentSessionId;

    if (!sessionId) {
      const { sessionId: newSessionId, error } = await createNewSession();
      sessionId = newSessionId;
      setCurrentSessionId(sessionId);

      if (error) {
        const userMessage = {
          id: generateUniqueId(),
          user: "User",
          text: message,
        };
        const botErrorMessage = {
          id: generateUniqueId(),
          user: "Sophia",
          text: error,
        };
        setMessages((prevMessages) => [
          ...prevMessages,
          userMessage,
          botErrorMessage,
        ]);
        setIsTyping(false);
        setIsProcessing(false);
        return;
      }
    }

    if (sessionId) {
      const newMessage = {
        id: generateUniqueId(),
        user: "User",
        text: message,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setIsTyping(true);
      setIsProcessing(true);

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        const sendObj = {
          message: newMessage.text,
          type: "query_wa", //audio feature
          sessionId: sessionId,
          userId: user.userId || user.id,
          personalityId: personality?.personalityId,
          wordLimit: wordLimit, // word limit option
          modelName: llm, //llm option
          isTitleEdit: isTitleEdit,
        };
        console.log("socketObj", sendObj);
        socketRef.current.send(JSON.stringify(sendObj));
      } else {
        function getRandomBotErrorMessage() {
          const randomIndex = Math.floor(
            Math.random() * socketErrorMessages.length
          );
          return socketErrorMessages[randomIndex];
        }
        const botErrorMessage = {
          id: generateUniqueId(),
          user: "Sophia",
          text: getRandomBotErrorMessage(),
        };
        console.error("WebSocket is not connected. Unable to send message.");
        setMessages((prevMessages) => [...prevMessages, botErrorMessage]);
        setIsTyping(false);
        setIsProcessing(false);
      }
    }
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleDeleteChat = () => {
    setIsModalOpen(false);
  };

  const renderMessage = (
    <div className="flex flex-col h-full w-full relative">
      <div className="flex flex-col flex-1 w-full overflow-y-auto px-4 pb-4 pt-20 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
        {messages.length == 0 ? (
          <div className="flex-1 flex justify-center items-center text-center w-full px-4">
            <div className="max-w-md">
              <p
                className="tracking-wide text-xl sm:text-2xl text-gray-400 leading-relaxed"
                ref={typedRef}
              ></p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${
                  message.user === "User"
                    ? "self-end ml-4 rounded-3xl rounded-tr-none px-4"
                    : "self-start mr-4 mb-5 rounded-3xl rounded-tl-none px-4"
                } flex flex-col z-[5] w-fit max-w-[85%]`}
              >
                <div className="flex items-center">
                  <p
                    className={`${
                      message.user === "User"
                        ? "self-end bg-primary ml-4 rounded-3xl rounded-tr-none"
                        : "self-start bg-secondary mr-4 mb-1 rounded-3xl rounded-tl-none"
                    } z-[5] py-4 w-fit px-6 shadow-md break-words`}
                  >
                    {message.text}
                  </p>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      className={`${
                        message.user === "User"
                          ? "flex cursor-pointer"
                          : "hidden"
                      }`}
                    >
                      <EllipsisVertical />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className=" w-56 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-600/80 p-4 absolute right-0 top-5">
                      <DropdownMenuItem className="gap-4 px-2 cursor-pointer hover:bg-gray-700">
                        <SquarePen /> Edit Response
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={handleDeleteClick}
                        className="gap-4 px-2 cursor-pointer hover:bg-gray-700"
                      >
                        <Trash2 /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </>
        )}
        {isTyping && <ChatLoader />}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full z-[10] p-4 bg-background/50 backdrop-blur-sm">
        <ChatInput onSubmit={handleUserMessage} disabled={isProcessing} />
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDeleteChat}
      />
    </div>
  );
  return renderMessage;
};

export default ChatBox;
