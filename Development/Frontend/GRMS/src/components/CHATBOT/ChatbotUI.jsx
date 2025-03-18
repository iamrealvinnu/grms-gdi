import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdSend } from "react-icons/io";
import { FaTimes, FaMicrophone } from "react-icons/fa";
import Message from "./Message.jsx";
import "./styles/chatbot.css";

const ChatbotUI = ({ closeChat, isChatOpen, userName }) => {
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hey dude, how can I assist you today?" }]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
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
        { sender: "bot", text: "Speech recognition not supported in this browser. Use Chrome or Edge.", showFeedback: true },
      ]);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleSpeechRecognition = () => {
    if (!recognition) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Speech recognition not supported in this browser.", showFeedback: true },
      ]);
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
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

    try {
      const response = await axios.post("http://localhost:51644/chat", {
        UserId: userName || "user123",
        Message: messageToSend,
      });

      console.log("Backend response:", response.data);
      const botReply = response.data.Reply || response.data.reply || "No response from bot, dude!";
      const showFeedback = response.data.ShowFeedback !== false;
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botReply, showFeedback, messageId: Date.now().toString() },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error processing request: " + error.message, showFeedback: true, messageId: Date.now().toString() },
      ]);
    }
  };

  const handleFeedback = async (messageId, liked) => {
    try {
      await axios.post("http://localhost:51644/feedback", { // Fixed endpoint
        UserId: userName || "user123",
        MessageId: messageId,
        Liked: liked,
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId
            ? { ...msg, showFeedback: false, feedbackMessage: "Thanks for your feedback, dude!" }
            : msg
        )
      );
    } catch (error) {
      console.error("Error sending feedback:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId
            ? { ...msg, showFeedback: false, feedbackMessage: "Error submitting feedback, man." }
            : msg
        )
      );
    }
  };

  return (
    <div className="chat-wrapper">
      {!isChatOpen && (
        <div className="bot-icon" onClick={closeChat}>
          <video autoPlay loop muted className="bot-animation">
            <source src="/botanimation.webm" type="video/webm" />
            Your browser does not support the video tag, dude.
          </video>
        </div>
      )}

      {isChatOpen && (
        <div className={`chat-container ${isChatOpen ? "fade-in" : "fade-out"}`}>
          <div className="chat-header">
            <span>CRM Assistant</span>
            <FaTimes className="close-btn" onClick={closeChat} />
          </div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <Message
                key={index}
                sender={msg.sender}
                text={msg.text}
                showFeedback={msg.showFeedback}
                messageId={msg.messageId}
                onFeedback={handleFeedback}
                feedbackMessage={msg.feedbackMessage}
              />
            ))}
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
        </div>
      )}
    </div>
  );
};

export default ChatbotUI;