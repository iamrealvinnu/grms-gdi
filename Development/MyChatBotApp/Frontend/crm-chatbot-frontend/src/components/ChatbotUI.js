import React, { useState } from "react";
import axios from "axios";
import { IoMdSend } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import Message from "./Message";
import "./styles/chatbot.css";

const ChatbotUI = ({ closeChat }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { sender: "user", text: input }];
        setMessages(newMessages);
        setInput("");

        try {
            const response = await axios.post("http://localhost:51644/chat", { message: input });
            setMessages([...newMessages, { sender: "bot", text: response.data.reply }]);
        } catch (error) {
            console.error("Error:", error);
            setMessages([...newMessages, { sender: "bot", text: "Error processing request." }]);
        }
    };


    return (
        <div className="chat-container">
            <div className="chat-header">
                <span>CRM Assistant</span>
                <FaTimes className="close-btn" onClick={closeChat} />
            </div>

            <div className="chat-body">
                {messages.map((msg, index) => (
                    <Message key={index} sender={msg.sender} text={msg.text} />
                ))}
            </div>

            <div className="chat-footer">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <IoMdSend className="send-btn" onClick={sendMessage} />
            </div>
        </div>
    );
};

export default ChatbotUI;