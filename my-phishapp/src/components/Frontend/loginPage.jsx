import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Styling/login.css';
import SignUp from "./signUp";

function LoginPage() {
    const [view, setView] = useState("login");
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [forgetEmail, setForgetEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    //user store logic
    localStorage.setItem("user", JSON.stringify({
        name: loginUsername
    }));

    // Handle login form submit
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: loginUsername,
                    password: loginPassword
                })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                // NEW LOGIC BASED ON TYPE
                if (data.type === "admin") {
                    navigate("/admin");
                    localStorage.setItem("user", JSON.stringify(data));
                } else if (data.type === "employee") {
                    navigate("/employee");
                    localStorage.setItem("user", JSON.stringify(data));
                } else {
                    setError("Unknown user type");
                }
            } else {
                setError(data.message || "Login failed.");
            }
        } catch (err) {
            setError("Server error. Please try again.");
        }
    };

    // Handle forgot password form submit
    const handleForget = (e) => {
        e.preventDefault();
        alert("Password reset link sent (demo only)");
        setView("login");
    };

    return (
        <>
            <main className="mainArea">
                <div className="container">
                    <div className="card login-card">
                        {view === "login" && (
                            <div className="card-body">
                                <h3 className="text-center mb-4">Awareness Portal Login</h3>
                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label htmlFor="login-username" className="form-label">Username / Email</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="login-username"
                                            value={loginUsername}
                                            onChange={e => setLoginUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="login-password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="login-password"
                                            value={loginPassword}
                                            onChange={e => setLoginPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {error && <div className="alert alert-danger py-1">{error}</div>}
                                    <button type="submit" className="btn btn-primary w-100">Login</button>
                                </form>
                                <div className="mt-3 text-center d-flex justify-content-between">
                                    <a href="#" className="forgetPass" onClick={e => { e.preventDefault(); setView("forget"); }}>Forgot Password?</a>
                                    <a href="#" className="ms-3" onClick={e => { e.preventDefault(); setView("signup"); }}>Sign Up</a>
                                </div>
                            </div>
                        )}

                        {view === "signup" && (
                            <SignUp
                                setView={setView}
                                setError={setError}
                                error={error}
                            />
                        )}

                        {view === "forget" && (
                            <div className="card-body3">
                                <h3 className="text-center mb-4">Forgot Password</h3>
                                <form onSubmit={handleForget}>
                                    <div className="mb-3">
                                        <label htmlFor="forget-email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="forget-email"
                                            value={forgetEmail}
                                            onChange={e => setForgetEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Submit</button>
                                </form>
                                <div className="mt-3 text-center d-flex justify-content-between">
                                    <a href="#" className="ms-3" onClick={e => { e.preventDefault(); setView("login"); }}>Login</a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

export default LoginPage;