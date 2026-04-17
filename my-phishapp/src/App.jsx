import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Frontend/loginPage";
import AdminDashboard from "./components/Frontend/adminDashboard";
import EmployeeDashboard from "./components/Frontend/employeeDashboard";
import Gemini from './components/Frontend/chatBot'
import Home from "./components/Frontend/homePage";
import FeedBack from "./components/Frontend/feedBack";
import AboutPage from "./components/Frontend/aboutPage";
import FeaturePage from "./components/Frontend/featurePage";
import logoImg from "./components/Resource/log.jpg";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logoImg} className="img img-fluid" style={{ width: "80px", height: "50px", borderRadius: "24px" }} alt="logo" />
            <i className="bi bi-shield-lock-fill me-2"></i>
            PhishAware
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><Link className="nav-link active" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/features">Features</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
              <li className="nav-item ms-lg-3">
                <Link className="btn btn-primary" to="/login">Login to Portal</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/gemini" element={<Gemini />} />
          <Route path="/feedback/:id" element={<FeedBack />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturePage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
