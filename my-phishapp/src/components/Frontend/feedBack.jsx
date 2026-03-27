import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import '../Styling/login.css';

function FeedBack() {
    const [breached, setBreached] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();
        // Increment breach count in localStorage
        const prev = Number(localStorage.getItem("breachCount") || 0);
        localStorage.setItem("breachCount", prev + 1);
        setBreached(true);
    };

    return breached ? (
        <main className="mainArea">
            <div className="container">
                <div className="card login-card" style={{ background: "#b71c1c", color: "#fff" }}>
                    <div className="card-body text-center">
                        <h1 className="mb-4">⚠️ Privacy Breached!</h1>
                        <p className="lead mb-3">
                            Your credentials have been captured.<br />
                            This was a phishing simulation.
                        </p>
                        <p style={{ fontWeight: "bold" }}>
                            Never enter your credentials on suspicious pages.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    ) : (
        <main className="mainArea">
            <div className="container">
                <div className="card login-card">
                    <div className="card-body">
                        <h3 className="text-center mb-4">Awareness Portal Login</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="fake-username" className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="fake-username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fake-password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="fake-password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default FeedBack;