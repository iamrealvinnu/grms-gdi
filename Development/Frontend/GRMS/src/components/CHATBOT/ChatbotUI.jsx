import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdSend } from "react-icons/io";
import { FaTimes, FaMicrophone } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Message from "./Message";
import { jwtDecode } from "jwt-decode";
import "./styles/chatbot.css";

const ChatbotUI = ({ closeChat, isChatOpen }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [currentUserId,setCurrentUserId] = useState(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recog = new SpeechRecognition();
            recog.lang = "en-US";
            recog.interimResults = false;
            recog.maxAlternatives = 1;

            recog.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                sendMessage(transcript);
                setIsListening(false);
            };

            recog.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                setMessages((prev) => [
                    ...prev,
                    { sender: "bot", text: `Speech recognition error: ${event.error}`, showFeedback: true },
                ]);
                setIsListening(false);
            };

            recog.onend = () => setIsListening(false);
            setRecognition(recog);
        } else {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Speech recognition not supported.", showFeedback: true },
            ]);
        }
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const name =
                    decodedToken[
                        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                    ] || "User";
                setCurrentUserId(name);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);
    

    const toggleSpeechRecognition = () => {
        if (!recognition) {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Speech recognition not supported.", showFeedback: true },
            ]);
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            setInput("");
            recognition.start();
            setIsListening(true);
        }
    };

    const sendMessage = async (messageToSend = input) => {
        if (!messageToSend.trim()) return;
    
        setMessages((prev) => [...prev, { sender: "user", text: messageToSend }]);
        setInput("");
        setIsTyping(true);
    
        try {
            const token = localStorage.getItem("accessToken");
    
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/intelligence/Chat/session`,
                {
                    request: messageToSend,
                    userId: currentUserId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            const reply = response.data.data?.response;
            const messageId = response.data.data?.id;
    
            if (!reply || typeof reply !== "string") {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: "bot",
                        text: "No response received from the assistant.",
                        showFeedback: true,
                        messageId: messageId || Date.now().toString(),
                    },
                ]);
                return;
            }
    
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: "bot",
                        text: reply,
                        showFeedback: true,
                        messageId: messageId,
                    },
                ]);
                setIsTyping(false);
            }, 1000);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Error: " + (error.message || "Unknown error"),
                    showFeedback: true,
                    messageId: Date.now().toString(),
                },
            ]);
            setIsTyping(false);
        }
    };

    const handleFeedback = async (messageId, liked) => {
        if (!messageId || isNaN(parseInt(messageId))) {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.messageId === messageId
                        ? { ...msg, showFeedback: false, feedbackMessage: "Error: Invalid message ID" }
                        : msg
                )
            );
            return;
        }

        const feedbackPayload = {
            MessageId: parseInt(messageId),
            Liked: liked,
        };

        try {
            await axios.post("http://localhost:51644/chat/feedback", feedbackPayload);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.messageId === messageId
                        ? { ...msg, showFeedback: false, feedbackMessage: "Thanks for your feedback!" }
                        : msg
                )
            );
        } catch (error) {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.messageId === messageId
                        ? { ...msg, showFeedback: false, feedbackMessage: "Error submitting feedback." }
                        : msg
                )
            );
        }
    };

    const toggleChat = () => closeChat && closeChat();

    return (
        <div className="chat-wrapper">
            <AnimatePresence>
                {!isChatOpen && (
                    <motion.div
                        className="bot-icon"
                        onClick={toggleChat}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <video autoPlay loop muted className="bot-animation">
                            <source src="/botanimation.webm" type="video/webm" />
                            Your browser does not support the video tag.
                        </video>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        className="chat-container"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="chat-header">
                            <span>CRM Assistant</span>
                            <FaTimes className="close-btn" onClick={toggleChat} />
                        </div>

                        <div className="chat-body">
                            <AnimatePresence>
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Message
                                            sender={msg.sender}
                                            text={msg.text}
                                            showFeedback={msg.showFeedback}
                                            messageId={msg.messageId}
                                            onFeedback={handleFeedback}
                                            feedbackMessage={msg.feedbackMessage}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {isTyping && (
                                <motion.div
                                    className="typing-indicator"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <span></span><span></span><span></span>
                                </motion.div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="chat-footer">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <FaMicrophone
                                className={`mic-btn ${isListening ? "listening" : ""}`}
                                onClick={toggleSpeechRecognition}
                                title={isListening ? "Stop listening" : "Start voice input"}
                            />
                            <IoMdSend className="send-btn" onClick={() => sendMessage()} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatbotUI;