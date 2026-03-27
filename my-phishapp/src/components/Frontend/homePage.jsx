import '../Styling/homePage.css';
import LoginPage from './loginPage.jsx';
import logImg from '../Resource/log.jpg';
import { Link, Routes, Route } from 'react-router-dom';

function HomePage() {
    return (
        <>
            <header className="hero-section text-center">
                <div className="container">
                    <h1 className="display-4 fw-bold mb-3">Defend Against Cyber Frauds</h1>
                    <p className="lead mb-4">
                        Empowering employees with the skills to identify and report phishing attempts through
                        realistic simulations and instant feedback.
                    </p>
                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                        <Link to="/login" className="btn btn-primary btn-lg px-4 gap-3">
                            Access Dashboard
                        </Link>
                        <a href="#features" className="btn btn-outline-light btn-lg px-4">
                            Learn More
                        </a>
                    </div>
                </div>
            </header>

            <Routes>
                <Route path="/login" element={<LoginPage />} />
            </Routes>

            <section id="features" className="py-5 bg-light">
                <div className="container">
                    <div className="row text-center mb-5">
                        <div className="col-lg-8 mx-auto">
                            <h2 className="fw-bold">System Features</h2>
                            <p className="text-muted">
                                Designed to improve cybersecurity posture by identifying vulnerabilities and
                                reinforcing awareness.
                            </p>
                        </div>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-4 text-center">
                                <div className="feature-icon">
                                    <i className="bi bi-envelope-exclamation"></i>
                                </div>
                                <h4 className="card-title">Realistic Simulations</h4>
                                <p className="card-text">
                                    Admins can create and send customized phishing emails that mimic real-world
                                    cyber threats to test employee vigilance.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-4 text-center">
                                <div className="feature-icon">
                                    <i className="bi bi-lightning-charge"></i>
                                </div>
                                <h4 className="card-title">Instant Feedback</h4>
                                <p className="card-text">
                                    Employees receive immediate educational tips if they fall for a simulation,
                                    turning a mistake into a learning opportunity.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-4 text-center">
                                <div className="feature-icon">
                                    <i className="bi bi-graph-up-arrow"></i>
                                </div>
                                <h4 className="card-title">Actionable Reports</h4>
                                <p className="card-text">
                                    HR and Admins can track responses (opens, clicks, data submission) to
                                    evaluate awareness levels across the organization.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about" className="py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h2 className="fw-bold mb-3">About the Project</h2>
                            <p className="lead">Bridging the gap between theory and real-world defense.</p>
                            <p>
                                The Phishing Awareness and Simulation Web Application is an academic initiative designed to
                                tackle the growing threat of social engineering attacks. By simulating these attacks in a safe
                                environment, organizations can proactively train their workforce.
                            </p>
                            <p>
                                Developed by MCA students at <strong>Institute of Management and Career Courses (IMCC),
                                    Pune</strong>.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <img src={logImg} alt="About Us" className="img-fluid rounded-3 shadow" />
                        </div>
                    </div>
                </div>
            </section>

            <footer className="imcc-footer">
                <div className="container">
                    <p className="mb-0">&copy; 2025 PhishAware. Maharashtra Education Society's</p>
                </div>
            </footer>
        </>
    );
}

export default HomePage;