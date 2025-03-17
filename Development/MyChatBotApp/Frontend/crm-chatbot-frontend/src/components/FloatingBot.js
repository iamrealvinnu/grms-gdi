import React, { useState, useEffect } from "react";
import "./styles/chatbot.css";

const FloatingBot = ({ toggleChat }) => {
    const [greeting, setGreeting] = useState("");
    const [showGreeting, setShowGreeting] = useState(true);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning! ??");
        else if (hour < 18) setGreeting("Good Afternoon! ???");
        else setGreeting("Good Evening! ??");

        setTimeout(() => setShowGreeting(false), 4000); // Hide after 4 sec
    }, []);

    return (
        <div className="floating-bot" onClick={toggleChat}>
            {showGreeting && <div className="greeting">{greeting}</div>}
            <video src="/botanimation.webm" autoPlay loop muted className="bot-icon" />
        </div>
    );
};

export default FloatingBot;
