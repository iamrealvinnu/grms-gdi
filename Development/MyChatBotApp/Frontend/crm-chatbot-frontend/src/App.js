import React, { useState } from "react";
import FloatingBot from "./components/FloatingBot";
import ChatbotUI from "./components/ChatbotUI";

const App = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <div>
            <FloatingBot toggleChat={() => setIsChatOpen(true)} />
            {isChatOpen && <ChatbotUI closeChat={() => setIsChatOpen(false)} />}
        </div>
    );
};

export default App;
