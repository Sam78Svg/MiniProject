import React, { useState } from "react";

function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const clearChat = () => {
        setInput('');
        setMessages([])
    }

    const sendMessage = async () => {
        if (!input) return; // ✅ fixed

        const userText = input;

        // show user message
        setMessages(prev => [...prev, { role: "user", text: userText }]);
        setInput("");

        try {
            const res = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userText })
            });

            const data = await res.json();

            // show bot reply
            setMessages(prev => [...prev, { role: "bot", text: data.reply }]);

        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: "bot", text: "Error getting response" }]);
        }
    };

    return (
        <div className="card mt-4">
            <div className="card-header">🤖 ChatBot</div>

            <div style={{ height: "250px", overflowY: "auto", padding: "10px" }}>
                {messages.map((m, i) => (
                    <div key={i}>
                        <b>{m.role === "user" ? "You: " : "Bot: "}</b>
                        {m.text}
                    </div>
                ))}
            </div>

            <div className="d-flex p-2">
                <input
                    className="form-control me-2"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                    }}
                />
                <button className="btn btn-danger me-1" onClick={clearChat}>
                    Clear
                </button>
                <button className="btn btn-primary" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatBot;