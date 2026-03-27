import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function EmployeeDashboard() {


    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const fetchUser = async () => {
        fetch("http://localhost:5000/api/userExists", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: user })
        })
            .then(response => response.json())
            .then(data => {
                setUser(data.user);
            });
    };

    fetchUser();

    const [mails, setMails] = useState([]);

    if (!user) {
        return <div className="text-center mt-5">Loading user...</div>;
    }
    else {
        return (
            <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>

                {/* HEADER */}
                <div className="bg-dark text-white p-3 d-flex justify-content-between">
                    <h5>Employee Portal</h5>
                    {user && <span>Welcome, {user.name}</span>}
                    <Link to="/login" className="btn btn-outline-light btn-sm" >Logout</Link>
                </div>

                <div className="container mt-4">

                    <div className="row">

                        {/* PROFILE */}
                        <div className="col-md-4">
                            <div className="card shadow-sm mb-4">
                                <div className="card-body text-center">
                                    <h5>{user.name}</h5>
                                    <p className="text-muted">{user.email}</p>
                                    <span className="badge bg-primary">{user.department}</span>
                                </div>
                            </div>

                            {/* SECURITY STATUS */}
                            <div className="card shadow-sm">
                                <div className="card-body text-center">
                                    <h6>Security Awareness</h6>
                                    <h3 style={{ color: "#16a34a" }}>Safe</h3>
                                    <small className="text-muted">No recent breaches</small>
                                </div>
                            </div>
                        </div>

                        {/* MAILBOX */}
                        <div className="col-md-8">
                            <div className="card shadow-sm">
                                <div className="card-header d-flex justify-content-between">
                                    <span>📥 Inbox</span>
                                    <span>{mails.length} messages</span>
                                </div>

                                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                                    {mails.length === 0 ? (
                                        <p className="p-3 text-muted">No messages</p>
                                    ) : (
                                        mails.map((mail, i) => (
                                            <div key={i} className="border-bottom p-3">
                                                <h6>{mail.subject}</h6>
                                                <p className="mb-1">{mail.message}</p>
                                                <small className="text-muted">
                                                    {new Date(mail.received_at).toLocaleString()}
                                                </small>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default EmployeeDashboard;