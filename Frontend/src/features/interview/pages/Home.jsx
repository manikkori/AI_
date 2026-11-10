import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview';
import Layout from '../../../components/Layout';
import {
    Sparkles,
    Briefcase,
    FileText,
    UploadCloud,
    CheckCircle,
    X,
    AlertCircle,
    ArrowRight,
    Loader2,
    Search,
    Download,
    Trash2,
    TrendingUp,
    Clock,
    Zap,
    ExternalLink
} from 'lucide-react';
import '../style/home.scss';

// Pre-defined sample job descriptions for quick 1-click testing
const SAMPLE_JDS = [
    {
        label: "Fullstack Engineer",
        role: "Senior Fullstack Engineer (React & Node.js)",
        text: `We are looking for a Senior Full Stack Engineer with 4+ years of experience in React, TypeScript, Node.js, Express, and MongoDB or PostgreSQL. The ideal candidate will design scalable RESTful and GraphQL APIs, optimize frontend web performance, implement robust JWT authentication, containerize microservices using Docker, and collaborate on CI/CD pipelines. Strong understanding of system design, caching strategies (Redis), and automated unit/integration testing (Jest/Playwright) is required.`
    },
    {
        label: "Frontend Specialist",
        role: "Frontend Engineer (React / Next.js)",
        text: `Seeking a skilled Frontend Engineer proficient in modern React, Next.js (App Router), TypeScript, Tailwind CSS, and state management (Zustand or Redux Toolkit). You will be responsible for creating pixel-perfect, accessible (WCAG AA), responsive UIs, optimizing Core Web Vitals, and integrating REST/WebSocket APIs. Experience with SSR/SSG, testing with React Testing Library, and headless CMS integrations is highly preferred.`
    },
    {
        label: "Backend Engineer",
        role: "Backend Engineer (Node.js & Cloud)",
        text: `We are hiring a Backend Engineer to build distributed backend systems capable of processing millions of events daily. Requirements include deep proficiency in Node.js/TypeScript, relational & NoSQL databases (MongoDB, PostgreSQL), message brokers (RabbitMQ/Kafka), AWS services (S3, Lambda, ECS), and API security. You will write clean, well-documented, test-driven code and participate in on-call rotations.`
    }
];

const Home = () => {
    const {
        loading,
        generateReport,
        reports,
        getResumePdf,
        downloadingResume,
        handleDeleteReport
    } = useInterview();

    const navigate = useNavigate();

    const [jobDescription, setJobDescription] = useState('');
    const [selfDescription, setSelfDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDeletingId, setActiveDeletingId] = useState(null);
    const [activeDownloadingId, setActiveDownloadingId] = useState(null);

    const fileInputRef = useRef(null);

    // Drag and drop handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file) => {
        setValidationError('');
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            setValidationError('Only PDF resumes are supported. Please upload a .pdf file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setValidationError('File size exceeds the 5MB limit. Please upload a smaller file.');
            return;
        }
        setSelectedFile(file);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleLoadSample = (sample) => {
        setJobDescription(sample.text);
        setValidationError('');
    };

    const handleGenerate = async () => {
        setValidationError('');
        if (!jobDescription.trim()) {
            setValidationError('Please paste a target Job Description to begin analysis.');
            return;
        }
        if (!selectedFile && !selfDescription.trim()) {
            setValidationError('Please upload a PDF resume or provide your experience in the self-description.');
            return;
        }

        try {
            const data = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile: selectedFile
            });
            if (data?._id) {
                navigate(`/interview/${data._id}`);
            }
        } catch (err) {
            setValidationError(err.response?.data?.message || 'Failed to generate interview report. Please try again.');
        }
    };

    const onDownloadResume = async (e, reportId) => {
        e.stopPropagation();
        setActiveDownloadingId(reportId);
        try {
            await getResumePdf(reportId);
        } catch (err) {
            console.error('Download error:', err);
        } finally {
            setActiveDownloadingId(null);
        }
    };

    const onDelete = async (e, reportId) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this interview report?')) {
            setActiveDeletingId(reportId);
            try {
                await handleDeleteReport(reportId);
            } catch (err) {
                console.error('Delete error:', err);
            } finally {
                setActiveDeletingId(null);
            }
        }
    };

    // Filter reports
    const filteredReports = reports.filter(r =>
        (r.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const averageMatch = reports.length > 0
        ? Math.round(reports.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / reports.length)
        : 0;

    return (
        <Layout>
            <div className="home-dashboard">
                {/* Hero Header */}
                <header className="hero-banner">
                    <div className="hero-badge">
                        <Zap size={14} className="badge-icon" />
                        <span>High-Speed Groq Llama 3.3 Engine</span>
                    </div>
                    <h1>
                        Identify Skill Gaps. Master the Interview.<br />
                        Generate <span className="gradient-text">ATS-Proof Resumes</span>.
                    </h1>
                    <p className="hero-subtitle">
                        Paste any job description and benchmark your background. Get actionable gap analysis,
                        a 7-day preparation roadmap with real interview questions, and a customized ATS-tailored resume.
                    </p>

                    {/* Quick Stats Banner */}
                    <div className="hero-stats">
                        <div className="stat-card">
                            <span className="stat-value">{reports.length}</span>
                            <span className="stat-label">Analyses Saved</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-card">
                            <span className="stat-value">{averageMatch}%</span>
                            <span className="stat-label">Avg. Match Score</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-card">
                            <span className="stat-value">~10s</span>
                            <span className="stat-label">Groq AI Inference</span>
                        </div>
                    </div>
                </header>

                {/* Main Workspace Card */}
                <section className="workspace-card" id="job-description">
                    {/* Workspace Header */}
                    <div className="workspace-header">
                        <div className="header-title">
                            <Briefcase size={20} className="icon-blue" />
                            <h2>New Career Gap Analysis & Resume Architect</h2>
                        </div>
                        {/* Sample Quick-fill buttons */}
                        <div className="sample-presets">
                            <span className="preset-label">Quick Test:</span>
                            {SAMPLE_JDS.map((sample, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleLoadSample(sample)}
                                    className="preset-btn"
                                >
                                    + {sample.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error Banner */}
                    {validationError && (
                        <div className="validation-alert">
                            <AlertCircle size={18} />
                            <span>{validationError}</span>
                        </div>
                    )}

                    {/* Split Input Grid */}
                    <div className="workspace-grid">
                        {/* Left Column: Target Job Description */}
                        <div className="grid-col col-left">
                            <div className="col-header">
                                <label htmlFor="jd-textarea">Target Job Description</label>
                                <span className="badge badge-required">Required</span>
                            </div>
                            <div className="textarea-container">
                                <textarea
                                    id="jd-textarea"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder={`Paste the complete job description here...\n\nExample:\n• Requirements & Tech Stack (React, Node.js, AWS, etc.)\n• Roles & Responsibilities\n• Desired seniority level`}
                                    maxLength={5000}
                                />
                                <div className="char-badge">
                                    {jobDescription.length} / 5000 chars
                                </div>
                            </div>
                        </div>

                        {/* Middle Vertical Divider */}
                        <div className="grid-divider"></div>

                        {/* Right Column: Candidate Profile & Resume */}
                        <div className="grid-col col-right">
                            <div className="col-header">
                                <label>Your Candidate Profile</label>
                                <span className="badge badge-recommended">PDF for Best ATS Fit</span>
                            </div>

                            {/* Dropzone or Uploaded File Preview */}
                            {!selectedFile ? (
                                <div
                                    className={`dropzone ${dragActive ? 'dropzone--active' : ''}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        onChange={handleFileInputChange}
                                        style={{ display: 'none' }}
                                    />
                                    <div className="dropzone-icon">
                                        <UploadCloud size={32} />
                                    </div>
                                    <p className="dropzone-title">Upload your current Resume (PDF)</p>
                                    <p className="dropzone-sub">Drag & drop here or browse from computer (Max 5MB)</p>
                                </div>
                            ) : (
                                <div className="uploaded-file-card">
                                    <div className="file-info">
                                        <div className="file-icon">
                                            <FileText size={24} />
                                        </div>
                                        <div className="file-meta">
                                            <span className="file-name">{selectedFile.name}</span>
                                            <span className="file-size">
                                                {(selectedFile.size / 1024).toFixed(1)} KB • Ready for AI extraction
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="remove-file-btn"
                                        title="Remove file"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            )}

                            {/* OR Divider */}
                            <div className="or-separator">
                                <span>OR ADD SUPPLEMENTARY DETAILS</span>
                            </div>

                            {/* Self Description Input */}
                            <div className="self-desc-container">
                                <label htmlFor="self-description" className="sub-label">
                                    Quick Summary / Additional Highlights
                                </label>
                                <textarea
                                    id="self-description"
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    placeholder="Add any extra projects, years of experience, or skills not listed in your resume..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Workspace Footer Action Bar */}
                    <div className="workspace-footer">
                        <div className="footer-tip">
                            <CheckCircle size={15} className="tip-icon" />
                            <span>ATS-tailored resume PDF automatically created with report</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={loading}
                            className="button primary-button generate-btn"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Groq AI Generating Strategy...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    <span>Run Gap Analysis & Build Resume</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </section>

                {/* Saved Reports / History Section */}
                <section className="saved-reports-section" id="recent-reports">
                    <div className="section-header">
                        <div className="header-left">
                            <FileText size={22} className="icon-blue" />
                            <div>
                                <h2>My Saved Interview Analyses & Resumes</h2>
                                <p className="section-subtitle">
                                    Access your previous job match evaluations, preparation roadmaps, and download tailored resumes.
                                </p>
                            </div>
                        </div>

                        {/* Search Filter */}
                        {reports.length > 0 && (
                            <div className="search-bar">
                                <Search size={16} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search by job title..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="clear-search"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Reports Grid */}
                    {reports.length === 0 ? (
                        <div className="empty-reports-card">
                            <Briefcase size={40} className="empty-icon" />
                            <h3>No Analyses Generated Yet</h3>
                            <p>
                                Paste a target job description and upload your resume above to create your first comprehensive
                                interview prep strategy and ATS-friendly resume!
                            </p>
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div className="empty-search-card">
                            <p>No reports match "<strong>{searchTerm}</strong>"</p>
                            <button onClick={() => setSearchTerm('')} className="button secondary-button">
                                Clear Search
                            </button>
                        </div>
                    ) : (
                        <div className="reports-grid">
                            {filteredReports.map((reportItem) => {
                                const score = reportItem.matchScore ?? 0;
                                const scoreClass =
                                    score >= 80 ? 'score-high' :
                                    score >= 60 ? 'score-mid' : 'score-low';

                                return (
                                    <div
                                        key={reportItem._id}
                                        className="report-card"
                                        onClick={() => navigate(`/interview/${reportItem._id}`)}
                                    >
                                        <div className="card-top">
                                            <div className="title-area">
                                                <h3 className="report-title">{reportItem.title || 'Untitled Target Position'}</h3>
                                                <div className="report-meta">
                                                    <Clock size={13} />
                                                    <span>{new Date(reportItem.createdAt).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}</span>
                                                </div>
                                            </div>

                                            {/* Match Score Badge */}
                                            <div className={`score-badge ${scoreClass}`} title="Profile Match Rate">
                                                <span className="score-num">{score}%</span>
                                                <span className="score-text">Match</span>
                                            </div>
                                        </div>

                                        <p className="card-hint">
                                            Click to review technical questions, STAR behavioral responses, and day-by-day roadmap.
                                        </p>

                                        {/* Card Actions */}
                                        <div className="card-actions">
                                            <button
                                                type="button"
                                                onClick={(e) => onDownloadResume(e, reportItem._id)}
                                                disabled={activeDownloadingId === reportItem._id}
                                                className="action-btn download-btn"
                                                title="Download ATS-Optimized Resume PDF"
                                            >
                                                {activeDownloadingId === reportItem._id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <Download size={14} />
                                                )}
                                                <span>{activeDownloadingId === reportItem._id ? 'Generating PDF...' : 'Download Resume'}</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={(e) => onDelete(e, reportItem._id)}
                                                disabled={activeDeletingId === reportItem._id}
                                                className="action-btn delete-btn"
                                                title="Delete this analysis"
                                            >
                                                {activeDeletingId === reportItem._id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={14} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </Layout>
    );
};

export default Home;
