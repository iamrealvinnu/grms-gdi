import React from "react";
import "./styles/chatbot.css";

const Message = ({ sender, text }) => {
    return (
        <div className={`message ${sender === "user" ? "user" : "bot"}`}>
            {text}
        </div>
    );
};

export default Message;
