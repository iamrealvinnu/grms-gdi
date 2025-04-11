import React, { useState, useEffect } from "react";
import "./styles/chatbot.css";

const FloatingBot = ({ toggleChat }) => {
    const [greeting, setGreeting] = useState("");
    const [showGreeting, setShowGreeting] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning! 😊");
        else if (hour < 18) setGreeting("Good Afternoon! 😊");
        else setGreeting("Good Evening! 😊");

        const timer = setTimeout(() => setShowGreeting(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className="floating-bot"
            onClick={toggleChat}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {showGreeting && <div className="greeting">{greeting}</div>}
            <div className="bot-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="white" />
                </svg>
            </div>
            {isHovered && (
                <div className="hover-preview">
                    <span>Click to chat with CRM Assistant!</span>
                </div>
            )}
        </div>
    );
};

export default FloatingBot;