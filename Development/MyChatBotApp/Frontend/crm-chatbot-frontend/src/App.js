import React, { useState } from 'react';
import ChatbotUI from './components/ChatbotUI'; // Adjust path

const App = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen((prev) => !prev);
    };

    return (
        <div className="App">
            <ChatbotUI closeChat={toggleChat} isChatOpen={isChatOpen} />
        </div>
    );
};

export default App;