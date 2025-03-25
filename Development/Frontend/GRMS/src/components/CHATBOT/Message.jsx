import React from "react";
import "./styles/Message.css"; // Ensure this matches your CSS structure

const Message = ({ sender, text, showFeedback, messageId, onFeedback, feedbackMessage }) => {
    return (
        <div className={`message ${sender === "user" ? "user-message" : "bot-message"}`}>
            <div className="message-content">
                <strong>{sender === "user" ? "You" : "CRM Assistant"}:</strong> {text}
                {feedbackMessage && <div className="feedback-response">{feedbackMessage}</div>}
            </div>
            {showFeedback && (
                <div className="feedback-buttons">
                    <button onClick={() => onFeedback(messageId, true)}>👍</button>
                    <button onClick={() => onFeedback(messageId, false)}>👎</button>
                </div>
            )}
        </div>
    );
};

export default Message;