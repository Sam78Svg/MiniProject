import React, { useState } from "react";
import '../Styling/login.css';

function SignUp({ setView, setError, error }) {
    const [userType, setUserType] = useState("employee");

    // employee fields
    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [emEmail, setEmEmail] = useState("");
    const [emPassword, setEmPassword] = useState("");
    const [confirmEmPassword, setConfirmEmPassword] = useState("");
    const [joiningDate, setJoiningDate] = useState("");

    // admin fields
    const [adminId, setAdminId] = useState("");
    const [username, setUsername] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [role, setRole] = useState("Select Role");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [confirmAdminPassword, setConfirmAdminPassword] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");

        if (userType === "admin" && adminPassword !== confirmAdminPassword) {
            setError("Passwords do not match!");
            return;
        }


        if (userType === "employee" && emPassword !== confirmEmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            let bodyData = {};

            if (userType === "employee") {
                bodyData = {
                    type: "employee",
                    name,
                    department,
                    designation,
                    email: emEmail,
                    password: emPassword,
                    joining_date: joiningDate
                };
            } else {
                bodyData = {
                    type: "admin",
                    admin_id: adminId,
                    username,
                    company_name: companyName,
                    role,
                    email: adminEmail,
                    password: adminPassword
                };
            }

            const res = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData)
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert("Sign up successful! Please login.");
                setView("login");
            } else {
                setError(data.message || "Sign up failed.");
            }
        } catch (err) {
            setError("Server error. Please try again.");
        }
    };

    return (
        <div className="card-body2">
            <h3 className="text-center mb-4">Sign Up</h3>

            {/* User Type Selection */}
            <div className="mb-3 d-flex justify-content-around">
                <label>
                    <input
                        type="radio"
                        name="userType"
                        value="employee"
                        checked={userType === "employee"}
                        onChange={() => setUserType("employee")}
                    /> Employee
                </label>
                <label>
                    <input
                        type="radio"
                        name="userType"
                        value="admin"
                        checked={userType === "admin"}
                        onChange={() => setUserType("admin")}
                    /> Admin
                </label>
            </div>

            <form onSubmit={handleSignUp}>

                {userType === "employee" && (
                    <>
                        <input className="form-control mb-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                        <input className="form-control mb-2" placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} />
                        <input className="form-control mb-2" placeholder="Designation" value={designation} onChange={e => setDesignation(e.target.value)} />
                        <input className="form-control mb-2" type="email" placeholder="Email" value={emEmail} onChange={e => setEmEmail(e.target.value)} required />
                        <input className="form-control mb-2" type="password" placeholder="Password" value={emPassword} onChange={e => setEmPassword(e.target.value)} required />
                        <input className="form-control mb-2" type="password" placeholder="Confirm Password" value={confirmEmPassword} onChange={e => setConfirmEmPassword(e.target.value)} required />
                        <input className="form-control mb-3" type="date" value={joiningDate} onChange={e => setJoiningDate(e.target.value)} />
                    </>
                )}

                {userType === "admin" && (
                    <>
                        <input className="form-control mb-2" placeholder="Admin ID" value={adminId} onChange={e => setAdminId(e.target.value)} required />
                        <input className="form-control mb-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                        <input className="form-control mb-2" placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} />

                        <select className="form-control mb-2" value={role} onChange={e => setRole(e.target.value)}>
                            <option value="...">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="hr">HR</option>
                        </select>

                        <input className="form-control mb-2" type="email" placeholder="Email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required />
                        <input className="form-control mb-2" type="password" placeholder="Password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required />
                        <input className="form-control mb-3" type="password" placeholder="Confirm Password" value={confirmAdminPassword} onChange={e => setConfirmAdminPassword(e.target.value)} required />
                    </>
                )}

                {error && <div className="alert alert-danger py-1">{error}</div>}

                <button type="submit" className="btn btn-primary w-100">Sign Up</button>
            </form>

            <div className="mt-3 text-center d-flex justify-content-between">
                <a href="#" className="forgetPass" onClick={e => { e.preventDefault(); setView("forget"); }}>Forgot Password?</a>
                <a href="#" onClick={e => { e.preventDefault(); setView("login"); }}>Login</a>
            </div>
        </div>
    );
}

export default SignUp;
