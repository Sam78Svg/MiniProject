import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
    const [campaignName, setCampaignName] = useState("");
    const [emailTemplate, setEmailTemplate] = useState("Password Expiry Notification");
    const [targetGroup, setTargetGroup] = useState("All Employees");
    const [successLink, setSuccessLink] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [reports, setReports] = useState([]);
    const [activeTab, setActiveTab] = useState("create");
    const [sendMode, setSendMode] = useState("Email"); // New state for send mode
    const [recipients, setRecipients] = useState([]);
    const [recipientInput, setRecipientInput] = useState("");


    // Handle campaign creation form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/save_campaign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    campaign_name: campaignName,
                    email_template: emailTemplate,
                    target_group: targetGroup
                })
            });

            const result = await response.json();

            if (response.ok) {
                const link = window.location.origin + "/feedback";
                setSuccessLink(link);
                setShowSuccess(true);
                // Optionally reset form
                setCampaignName("");
                setEmailTemplate("Password Expiry Notification");
                setTargetGroup("All Employees");
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to the server.');
        }
    };

    // Handle adding a recipient
    const handleAddRecipient = (e) => {
        e.preventDefault();
        if (recipientInput.trim() && !recipients.includes(recipientInput.trim())) {
            setRecipients([...recipients, recipientInput.trim()]);
            setRecipientInput("");
        }
    };

    // Handle removing a recipient
    const handleRemoveRecipient = (index) => {
        setRecipients(recipients.filter((_, i) => i !== index));
    };

    // Handle sending campaign
    const handleSendCampaign = async (e) => {
        e.preventDefault();
        if (recipients.length === 0) {
            alert("Please add at least one recipient.");
            return;
        }
        if (!successLink.trim()) {
            alert("Please enter a link to send.");
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/api/send_campaign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mode: sendMode,
                    recipients: recipients,
                    link: successLink.trim()
                })
            });
            const result = await response.json();
            if (response.ok) {
                alert("Campaign link sent successfully to all recipients!");
                setRecipients([]);
                setSuccessLink("");
            } else {
                alert("Error: " + (result.message || "Failed to send."));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to send campaign.");
        }
    };

    useEffect(() => {
        if (activeTab === "reports") {
            fetchReports();
        }
    }, [activeTab]);

    const fetchReports = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/reports");
            const data = await response.json();
            console.log(data);
            setReports(data);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        }
    };

    // Handle clearing all reports
    const handleClearReports = async () => {
        if (window.confirm("Are you sure you want to delete all reports? This action cannot be undone.")) {
            try {
                const response = await fetch("http://localhost:5000/api/clear_reports", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const result = await response.json();
                if (response.ok) {
                    alert("All reports cleared successfully!");
                    setReports([]);
                } else {
                    alert("Error: " + (result.message || "Failed to clear reports."));
                }
            } catch (error) {
                console.error("Error clearing reports:", error);
                alert("Failed to clear reports.");
            }
        }
    };



    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <span className="navbar-brand">Phishing Simulator Admin</span>
                    <div className="d-flex">
                        <Link to="/login" className="btn btn-outline-light btn-sm">Logout</Link>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <ul className="nav nav-tabs" id="adminTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link${activeTab === "create" ? " active" : ""}`}
                            type="button"
                            onClick={() => setActiveTab("create")}
                        >
                            Create Campaign
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link${activeTab === "reports" ? " active" : ""}`}
                            type="button"
                            onClick={() => setActiveTab("reports")}
                        >
                            Awareness Reports
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link${activeTab === "send" ? " active" : ""}`}
                            type="button"
                            onClick={() => setActiveTab("send")}
                        >
                            Send Campaign
                        </button>
                    </li>
                </ul>
                <div className="tab-content p-3 border border-top-0 rounded-bottom" id="myTabContent">
                    {activeTab === "create" && (
                        <div className="tab-pane fade show active" id="create" role="tabpanel">
                            <h4>Create New Phishing Simulation</h4>
                            <form className="mt-3" onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Campaign Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g., 'Urgent Payroll Update'"
                                        required
                                        value={campaignName}
                                        onChange={e => setCampaignName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email Template</label>
                                    <select
                                        className="form-select"
                                        value={emailTemplate}
                                        onChange={e => setEmailTemplate(e.target.value)}
                                    >
                                        <option>Password Expiry Notification</option>
                                        <option>Urgent Document Shared</option>
                                        <option>Unusual Sign-in Activity</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Target Group</label>
                                    <select
                                        className="form-select"
                                        value={targetGroup}
                                        onChange={e => setTargetGroup(e.target.value)}
                                    >
                                        <option>All Employees</option>
                                        <option>Finance Dept</option>
                                        <option>IT Dept</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-success">Launch Campaign</button>
                            </form>
                            {showSuccess && (
                                <div className="alert alert-success mt-3">
                                    Campaign launched! Simulation link generated: <strong>{successLink}</strong>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "reports" && (
                        <div className="tab-pane fade show active" id="reports" role="tabpanel">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4>Campaign Performance & Awareness Reports</h4>
                                <button className="btn btn-danger" onClick={handleClearReports}>Clear All Reports</button>
                            </div>
                            <table className="table table-striped mt-3">
                                <thead>
                                    <tr>
                                        <th>Campaign Name</th>
                                        <th>Email Template</th>
                                        <th>Target Group</th>
                                        <th>Sent Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report, idx) => (
                                        <tr key={idx}>
                                            <td>{report.campaign_name}</td>
                                            <td>{report.email_template}</td>
                                            <td>{report.target_group}</td>
                                            <td>{report.sent_date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === "send" && (
                        <div className="tab-pane fade show active" id="send" role="tabpanel">
                            <h4>Send Campaign</h4>
                            <form className="mt-3" onSubmit={handleSendCampaign}>
                                <div className="mb-3">
                                    <label className="form-label">Mode to Send</label>
                                    <select
                                        className="form-select"
                                        value={sendMode}
                                        onChange={e => setSendMode(e.target.value)}
                                    >
                                        <option value="Email">Emails</option>
                                        <option value="sms">Mobile</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Link to Send</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        placeholder="Enter the link to send"
                                        value={successLink}
                                        required
                                    />
                                </div>
                                {/* Recipients Section */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        Add {sendMode === "sms" ? "Phone Numbers" : "Emails"}
                                    </label>
                                    <div className="input-group mb-2">
                                        <input
                                            type={sendMode === "sms" ? "tel" : "email"}
                                            className="form-control"
                                            placeholder={sendMode === "sms" ? "Enter phone number" : "Enter email"}
                                            value={recipientInput}
                                            onChange={e => setRecipientInput(e.target.value)}
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={handleAddRecipient}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {recipients.length > 0 && (
                                        <ul className="list-group">
                                            {recipients.map((rec, idx) => (
                                                <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                                    {rec}
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleRemoveRecipient(idx)}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <button type="submit" className="btn btn-primary">Send Campaign</button>
                            </form>
                        </div>
                    )}
                </div >
            </div >
        </>
    );
}

export default AdminDashboard;