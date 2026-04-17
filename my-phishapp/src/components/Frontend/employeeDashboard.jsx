import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function EmployeeDashboard() {

    const [selectedMail, setSelectedMail] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const fetchUser = async () => {
        fetch("http://localhost:5000/api/userExist", {
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

    const [mails, setMails] = useState([]);

    const fetchUserEmails = async () => {
        if (!user?.name) return;

        fetch("http://localhost:5000/api/fetchEmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: user.name })
        })
            .then(res => res.json())
            .then(data => {
                setMails(data.mails || []);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchUserEmails();
        fetchUser();
    }, [user]);

    const bgColors = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#fd6e96"];
    const getRandomColor = () => bgColors[Math.floor(Math.random() * bgColors.length)];

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
                            <div className="card rounded-3">
                                <div className="card-header d-flex justify-content-between">
                                    <span>📥 Inbox</span>
                                    <span>{mails.length} messages</span>
                                </div>

                                <div className="d-flex" style={{ height: "400px" }}>

                                    {/* LEFT: MAIL LIST */}
                                    <div style={{ width: "40%", borderRight: "1px solid #ddd", overflowY: "auto" }}>
                                        {mails.length === 0 ? (
                                            <p className="p-3 text-muted">No messages</p>
                                        ) : (
                                            mails.map((mail, i) => (
                                                <div
                                                    key={i}
                                                    className="p-3 border-bottom rounded-1 d-flex bg-success bg-opacity-10"
                                                    style={{ cursor: "pointer", background: selectedMail === i ? "#e2e8f0" : "" }}
                                                    onClick={() => setSelectedMail(i)}
                                                >
                                                    <section className="logo d-flex align-items-center justify-content-center rounded-circle border border-2 border-black"
                                                        style={{ width: '40px', height: '40px', marginRight: '10px', backgroundColor: getRandomColor() }}
                                                    >
                                                        <span className="h6 text-dark fs-5">{mail.senderMail.charAt(0).toUpperCase()}</span>
                                                    </section>
                                                    <div className="infoArea"
                                                        style={{ width: '80%' }}
                                                    >
                                                        <strong>{mail.subject.toUpperCase()}</strong>
                                                        <br />
                                                        <small className="text-muted">
                                                            {new Date(mail.received_at).toLocaleString()}
                                                        </small>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* RIGHT: MAIL CONTENT */}
                                    <div style={{ width: "60%", padding: "15px", overflowY: "auto" }}>
                                        {selectedMail === null ? (
                                            <p className="text-muted">Select an email to view</p>
                                        ) : (
                                            <>
                                                <h5 >{mails[selectedMail].subject}</h5>
                                                <hr />
                                                <div style={{ fontFamily: "cursive" }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: mails[selectedMail].message
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>

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