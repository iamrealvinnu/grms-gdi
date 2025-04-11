import React from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import "./styles/Message.css";

const Message = ({ sender, text, showFeedback, messageId, onFeedback, feedbackMessage }) => {
    const isHelpMessage = text.includes("Welcome to CRM Assistant Help");
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return (
        <div className={`message-wrapper ${sender === "user" ? "user-wrapper" : "bot-wrapper"}`}>
            {/* Avatar outside the message bubble */}
            <div className="message-avatar">
                {sender === "user" ? (
                    <span className="avatar user-avatar">👤</span>
                ) : (
                    <span className="avatar bot-avatar">🤖</span>
                )}
            </div>
            {/* Message bubble */}
            <div className={`message ${isHelpMessage ? "help-message" : ""}`}>
                <div className="message-content">
                    {isHelpMessage ? (
                        <div className="help-content">
                            <h3 className="help-title">CRM Assistant Help</h3>
                            {text.split("\n").map((line, index) => {
                                if (line.startsWith("🔍") || line.startsWith("📅") || line.startsWith("👥") || line.startsWith("💡")) {
                                    return <p key={index} className="help-section">{line}</p>;
                                }
                                return <p key={index} className="help-item">{line}</p>;
                            })}
                        </div>
                    ) : (
                        <p>{text}</p>
                    )}
                    <div className="message-meta">
                        <span className="timestamp">{timestamp}</span>
                    </div>
                    {showFeedback && messageId && (
                        <div className="feedback-buttons">
                            <FaThumbsUp
                                className="feedback-icon"
                                onClick={() => onFeedback(messageId, true)}
                            />
                            <FaThumbsDown
                                className="feedback-icon"
                                onClick={() => onFeedback(messageId, false)}
                            />
                        </div>
                    )}
                    {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default Message;