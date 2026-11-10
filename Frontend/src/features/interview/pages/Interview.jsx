import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { useInterview } from '../hooks/useInterview';
import Layout from '../../../components/Layout';
import {
    ArrowLeft,
    Download,
    CheckCircle,
    CheckCircle2,
    Circle,
    Code,
    MessageSquare,
    Calendar,
    AlertTriangle,
    FileText,
    Copy,
    Check,
    Search,
    Loader2,
    Clock,
    Sparkles,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Zap,
    Briefcase
} from 'lucide-react';
import '../style/interview.scss';

const Interview = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const {
        report,
        getReportById,
        loading,
        getResumePdf,
        downloadingResume
    } = useInterview();

    const [activeTab, setActiveTab] = useState('technical');
    const [searchQuery, setSearchQuery] = useState('');
    const [openQuestions, setOpenQuestions] = useState({});
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [completedTasks, setCompletedTasks] = useState({});
    const [practicedQuestions, setPracticedQuestions] = useState({});

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        }
    }, [interviewId]);

    // Toggle question accordion
    const toggleQuestion = (id) => {
        setOpenQuestions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Copy to clipboard helper
    const handleCopy = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(key);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Toggle task in roadmap
    const toggleTask = (dayIndex, taskIndex) => {
        const key = `${dayIndex}-${taskIndex}`;
        setCompletedTasks(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Toggle practiced question
    const togglePracticed = (questionId) => {
        setPracticedQuestions(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    if (loading || !report) {
        return (
            <Layout>
                <div className="interview-loading-container">
                    <Loader2 size={36} className="animate-spin loader-icon" />
                    <h2>Loading your customized career strategy...</h2>
                    <p>Retrieving Groq AI analysis, questions, and ATS resume data.</p>
                </div>
            </Layout>
        );
    }

    const score = report.matchScore ?? 0;
    const scoreColorClass =
        score >= 80 ? 'score-high' :
        score >= 60 ? 'score-mid' : 'score-low';

    // Calculate roadmap progress
    const totalTasks = report.preparationPlan?.reduce((acc, curr) => acc + (curr.tasks?.length || 0), 0) || 0;
    const completedTasksCount = Object.values(completedTasks).filter(Boolean).length;
    const roadmapProgressPct = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

    // Filter questions by search query
    const filteredTechQuestions = (report.technicalQuestions || []).filter(q =>
        q.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredBehavioralQuestions = (report.behavioralQuestions || []).filter(q =>
        q.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="interview-page-wrapper">
                {/* ── Top Navigation Bar / Breadcrumb ── */}
                <div className="interview-topbar">
                    <div className="topbar-left">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="back-btn"
                            title="Back to Dashboard"
                        >
                            <ArrowLeft size={16} />
                            <span>Dashboard</span>
                        </button>
                        <div className="breadcrumb-divider">/</div>
                        <div className="job-title-pill">
                            <Briefcase size={14} className="pill-icon" />
                            <span className="pill-text">{report.title || 'Role Analysis'}</span>
                        </div>
                    </div>

                    <div className="topbar-right">
                        <button
                            type="button"
                            onClick={() => getResumePdf(interviewId)}
                            disabled={downloadingResume}
                            className="button primary-button download-resume-btn"
                        >
                            {downloadingResume ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Rendering ATS Resume...</span>
                                </>
                            ) : (
                                <>
                                    <Download size={16} />
                                    <span>Download ATS Resume (PDF)</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* ── Main Two-Column Layout ── */}
                <div className="interview-layout-container">
                    {/* ── Left Sidebar Navigation ── */}
                    <aside className="interview-sidebar-nav">
                        {/* Match Score Card */}
                        <div className={`score-card ${scoreColorClass}`}>
                            <div className="score-header">
                                <span className="score-title">Job Match Score</span>
                                <span className="score-tag">
                                    {score >= 80 ? 'Strong Fit' : score >= 60 ? 'Moderate Fit' : 'Skills Gap'}
                                </span>
                            </div>
                            <div className="score-display">
                                <span className="score-number">{score}</span>
                                <span className="score-pct">%</span>
                            </div>
                            <div className="score-bar-bg">
                                <div
                                    className="score-bar-fill"
                                    style={{ width: `${score}%` }}
                                ></div>
                            </div>
                            <p className="score-subtext">
                                {score >= 80
                                    ? 'Your background strongly aligns with this job description.'
                                    : score >= 60
                                    ? 'Good baseline fit. Review the identified skill gaps to boost interview chances.'
                                    : 'Significant skills gap identified. Focus on the 7-day preparation roadmap below.'}
                            </p>
                        </div>

                        {/* Navigation Tabs */}
                        <nav className="nav-menu">
                            <span className="menu-label">Strategy Sections</span>

                            <button
                                type="button"
                                className={`nav-menu-item ${activeTab === 'technical' ? 'active' : ''}`}
                                onClick={() => setActiveTab('technical')}
                            >
                                <Code size={16} className="menu-icon" />
                                <span className="menu-text">Technical Questions</span>
                                <span className="menu-badge">{report.technicalQuestions?.length || 0}</span>
                            </button>

                            <button
                                type="button"
                                className={`nav-menu-item ${activeTab === 'behavioral' ? 'active' : ''}`}
                                onClick={() => setActiveTab('behavioral')}
                            >
                                <MessageSquare size={16} className="menu-icon" />
                                <span className="menu-text">Behavioral Questions</span>
                                <span className="menu-badge">{report.behavioralQuestions?.length || 0}</span>
                            </button>

                            <button
                                type="button"
                                className={`nav-menu-item ${activeTab === 'roadmap' ? 'active' : ''}`}
                                onClick={() => setActiveTab('roadmap')}
                            >
                                <Calendar size={16} className="menu-icon" />
                                <span className="menu-text">7-Day Prep Roadmap</span>
                                <span className="menu-badge">{roadmapProgressPct}%</span>
                            </button>

                            <button
                                type="button"
                                className={`nav-menu-item ${activeTab === 'skillGaps' ? 'active' : ''}`}
                                onClick={() => setActiveTab('skillGaps')}
                            >
                                <AlertTriangle size={16} className="menu-icon" />
                                <span className="menu-text">Identified Skill Gaps</span>
                                <span className="menu-badge">{report.skillGaps?.length || 0}</span>
                            </button>

                            <button
                                type="button"
                                className={`nav-menu-item ${activeTab === 'resume' ? 'active' : ''}`}
                                onClick={() => setActiveTab('resume')}
                            >
                                <FileText size={16} className="menu-icon" />
                                <span className="menu-text">ATS Resume Hub</span>
                                <span className="menu-badge highlight-badge">PDF</span>
                            </button>
                        </nav>

                        {/* Quick Resume CTA in sidebar */}
                        <div className="sidebar-cta-card">
                            <div className="cta-icon">
                                <Sparkles size={18} />
                            </div>
                            <h4>Targeted ATS Resume</h4>
                            <p>Includes keywords extracted from this specific job description.</p>
                            <button
                                type="button"
                                onClick={() => getResumePdf(interviewId)}
                                disabled={downloadingResume}
                                className="button primary-button sidebar-cta-btn"
                            >
                                <Download size={14} />
                                <span>Get Resume PDF</span>
                            </button>
                        </div>
                    </aside>

                    {/* ── Main Content Area ── */}
                    <main className="interview-main-content">
                        {/* ── Tab 1: Technical Questions ── */}
                        {activeTab === 'technical' && (
                            <section className="content-section">
                                <div className="section-topbar">
                                    <div>
                                        <h2>Technical Interview Questions</h2>
                                        <p className="section-desc">
                                            Realistic questions tailored to this role's requirements, covering architectural trade-offs, algorithms, and deep domain knowledge.
                                        </p>
                                    </div>
                                    <div className="search-input-box">
                                        <Search size={15} />
                                        <input
                                            type="text"
                                            placeholder="Search questions or keywords..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="cards-stack">
                                    {filteredTechQuestions.map((q, idx) => {
                                        const isOpen = openQuestions[`tech-${idx}`] ?? (idx === 0);
                                        const isPracticed = practicedQuestions[`tech-${idx}`];

                                        return (
                                            <div
                                                key={idx}
                                                className={`qa-card ${isPracticed ? 'qa-card--practiced' : ''}`}
                                            >
                                                <div
                                                    className="qa-card-header"
                                                    onClick={() => toggleQuestion(`tech-${idx}`)}
                                                >
                                                    <div className="qa-header-left">
                                                        <span className="qa-num">Q{idx + 1}</span>
                                                        <h3 className="qa-question-text">{q.question}</h3>
                                                    </div>

                                                    <div className="qa-header-right">
                                                        <button
                                                            type="button"
                                                            className={`practice-check-btn ${isPracticed ? 'practiced' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                togglePracticed(`tech-${idx}`);
                                                            }}
                                                            title={isPracticed ? "Marked as practiced" : "Mark as practiced"}
                                                        >
                                                            {isPracticed ? (
                                                                <CheckCircle2 size={16} className="check-done" />
                                                            ) : (
                                                                <Circle size={16} />
                                                            )}
                                                            <span className="practice-label">
                                                                {isPracticed ? 'Practiced' : 'Mark Practiced'}
                                                            </span>
                                                        </button>

                                                        <span className="chevron-toggle">
                                                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                        </span>
                                                    </div>
                                                </div>

                                                {isOpen && (
                                                    <div className="qa-card-body">
                                                        {/* Interviewer's Intention */}
                                                        <div className="qa-block intention-block">
                                                            <div className="block-label">
                                                                <Zap size={14} />
                                                                <span>Interviewer's Evaluation Goal</span>
                                                            </div>
                                                            <p className="block-content">{q.intention}</p>
                                                        </div>

                                                        {/* Model Answer */}
                                                        <div className="qa-block answer-block">
                                                            <div className="block-header">
                                                                <div className="block-label">
                                                                    <CheckCircle size={14} />
                                                                    <span>Recommended Model Answer & Key Points</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="copy-btn"
                                                                    onClick={() => handleCopy(q.answer, `tech-${idx}`)}
                                                                >
                                                                    {copiedIndex === `tech-${idx}` ? (
                                                                        <>
                                                                            <Check size={14} className="copied-icon" />
                                                                            <span>Copied!</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Copy size={14} />
                                                                            <span>Copy Answer</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <div className="model-answer-text">
                                                                {q.answer}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* ── Tab 2: Behavioral Questions ── */}
                        {activeTab === 'behavioral' && (
                            <section className="content-section">
                                <div className="section-topbar">
                                    <div>
                                        <h2>Behavioral & Situational Questions</h2>
                                        <p className="section-desc">
                                            Role-specific behavioral scenarios designed to evaluate cross-functional collaboration, ownership, and conflict resolution using the STAR method.
                                        </p>
                                    </div>
                                    <div className="search-input-box">
                                        <Search size={15} />
                                        <input
                                            type="text"
                                            placeholder="Search questions..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="cards-stack">
                                    {filteredBehavioralQuestions.map((q, idx) => {
                                        const isOpen = openQuestions[`beh-${idx}`] ?? (idx === 0);
                                        const isPracticed = practicedQuestions[`beh-${idx}`];

                                        return (
                                            <div
                                                key={idx}
                                                className={`qa-card ${isPracticed ? 'qa-card--practiced' : ''}`}
                                            >
                                                <div
                                                    className="qa-card-header"
                                                    onClick={() => toggleQuestion(`beh-${idx}`)}
                                                >
                                                    <div className="qa-header-left">
                                                        <span className="qa-num qa-num--beh">B{idx + 1}</span>
                                                        <h3 className="qa-question-text">{q.question}</h3>
                                                    </div>

                                                    <div className="qa-header-right">
                                                        <button
                                                            type="button"
                                                            className={`practice-check-btn ${isPracticed ? 'practiced' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                togglePracticed(`beh-${idx}`);
                                                            }}
                                                        >
                                                            {isPracticed ? (
                                                                <CheckCircle2 size={16} className="check-done" />
                                                            ) : (
                                                                <Circle size={16} />
                                                            )}
                                                            <span className="practice-label">
                                                                {isPracticed ? 'Practiced' : 'Mark Practiced'}
                                                            </span>
                                                        </button>

                                                        <span className="chevron-toggle">
                                                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                        </span>
                                                    </div>
                                                </div>

                                                {isOpen && (
                                                    <div className="qa-card-body">
                                                        <div className="qa-block intention-block">
                                                            <div className="block-label">
                                                                <Zap size={14} />
                                                                <span>Core Competency Evaluated</span>
                                                            </div>
                                                            <p className="block-content">{q.intention}</p>
                                                        </div>

                                                        <div className="qa-block answer-block">
                                                            <div className="block-header">
                                                                <div className="block-label">
                                                                    <CheckCircle size={14} />
                                                                    <span>STAR Structure (Situation, Task, Action, Result)</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="copy-btn"
                                                                    onClick={() => handleCopy(q.answer, `beh-${idx}`)}
                                                                >
                                                                    {copiedIndex === `beh-${idx}` ? (
                                                                        <>
                                                                            <Check size={14} className="copied-icon" />
                                                                            <span>Copied!</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Copy size={14} />
                                                                            <span>Copy Answer</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <div className="model-answer-text">
                                                                {q.answer}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* ── Tab 3: 7-Day Roadmap ── */}
                        {activeTab === 'roadmap' && (
                            <section className="content-section">
                                <div className="section-topbar">
                                    <div>
                                        <h2>7-Day Targeted Preparation Roadmap</h2>
                                        <p className="section-desc">
                                            A structured, day-by-day sprint to systematically close skill gaps, practice interview problems, and peak before your interview.
                                        </p>
                                    </div>
                                    <div className="roadmap-progress-badge">
                                        <span className="progress-text">{completedTasksCount} / {totalTasks} Tasks Completed</span>
                                        <span className="progress-pct">{roadmapProgressPct}%</span>
                                    </div>
                                </div>

                                <div className="roadmap-progress-bar-container">
                                    <div
                                        className="roadmap-progress-bar-fill"
                                        style={{ width: `${roadmapProgressPct}%` }}
                                    ></div>
                                </div>

                                <div className="roadmap-days-list">
                                    {(report.preparationPlan || []).map((dayPlan, dayIdx) => (
                                        <div key={dayPlan.day || dayIdx} className="roadmap-day-card">
                                            <div className="day-header">
                                                <div className="day-pill">
                                                    <span>Day {dayPlan.day || dayIdx + 1}</span>
                                                </div>
                                                <h3 className="day-focus-title">{dayPlan.focus}</h3>
                                            </div>

                                            <div className="day-tasks-list">
                                                {(dayPlan.tasks || []).map((task, taskIdx) => {
                                                    const isChecked = !!completedTasks[`${dayIdx}-${taskIdx}`];

                                                    return (
                                                        <div
                                                            key={taskIdx}
                                                            className={`task-row ${isChecked ? 'task-row--done' : ''}`}
                                                            onClick={() => toggleTask(dayIdx, taskIdx)}
                                                        >
                                                            <div className="task-checkbox">
                                                                {isChecked ? (
                                                                    <CheckCircle2 size={18} className="icon-checked" />
                                                                ) : (
                                                                    <Circle size={18} className="icon-unchecked" />
                                                                )}
                                                            </div>
                                                            <span className="task-text">{task}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ── Tab 4: Skill Gaps ── */}
                        {activeTab === 'skillGaps' && (
                            <section className="content-section">
                                <div className="section-topbar">
                                    <div>
                                        <h2>Identified Skill Gaps & Deficiencies</h2>
                                        <p className="section-desc">
                                            Specific technologies, paradigms, or qualifications mentioned in the job description that were absent or understated in your profile.
                                        </p>
                                    </div>
                                </div>

                                <div className="gaps-container">
                                    {(report.skillGaps || []).map((gap, idx) => {
                                        const severity = gap.severity?.toLowerCase() || 'medium';
                                        const severityBadge =
                                            severity === 'high' ? 'High Impact' :
                                            severity === 'medium' ? 'Moderate' : 'Low Impact';

                                        return (
                                            <div key={idx} className={`gap-card gap-${severity}`}>
                                                <div className="gap-top">
                                                    <div className="gap-title-group">
                                                        <AlertTriangle size={18} className="gap-icon" />
                                                        <h3 className="gap-skill-name">{gap.skill}</h3>
                                                    </div>
                                                    <span className={`severity-tag severity-${severity}`}>
                                                        {severityBadge}
                                                    </span>
                                                </div>

                                                <p className="gap-advice">
                                                    {severity === 'high'
                                                        ? 'Critical qualification for this job. Likely to be heavily probed in technical rounds. Prioritize building a quick demo or deep-diving into syntax and fundamentals.'
                                                        : severity === 'medium'
                                                        ? 'Recommended competence. Expect conceptual questions or scenario testing around trade-offs.'
                                                        : 'Secondary/nice-to-have skill. Familiarity with core concepts will be sufficient.'}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* ── Tab 5: ATS Resume Hub ── */}
                        {activeTab === 'resume' && (
                            <section className="content-section resume-hub-section">
                                <div className="section-topbar">
                                    <div>
                                        <h2>ATS-Compliant Resume Architect</h2>
                                        <p className="section-desc">
                                            A tailored resume generated by Groq AI designed to bypass automated Applicant Tracking Systems (ATS) while reading naturally to human hiring managers.
                                        </p>
                                    </div>
                                </div>

                                <div className="resume-features-card">
                                    <div className="features-grid">
                                        <div className="feature-item">
                                            <div className="feature-icon">
                                                <CheckCircle size={18} />
                                            </div>
                                            <div>
                                                <h4>Keyword Alignment</h4>
                                                <p>Injected core skills and phrases directly from the target job description.</p>
                                            </div>
                                        </div>

                                        <div className="feature-item">
                                            <div className="feature-icon">
                                                <CheckCircle size={18} />
                                            </div>
                                            <div>
                                                <h4>Single / Two-Page ATS Format</h4>
                                                <p>Semantic HTML hierarchy without tables or non-standard fonts that cause parser drops.</p>
                                            </div>
                                        </div>

                                        <div className="feature-item">
                                            <div className="feature-icon">
                                                <CheckCircle size={18} />
                                            </div>
                                            <div>
                                                <h4>Impact-Driven Bullet Points</h4>
                                                <p>Formatted using action verbs and quantifiable metrics rather than generic duties.</p>
                                            </div>
                                        </div>

                                        <div className="feature-item">
                                            <div className="feature-icon">
                                                <CheckCircle size={18} />
                                            </div>
                                            <div>
                                                <h4>Puppeteer PDF Engine</h4>
                                                <p>Direct vector PDF compilation ensures crisp text selection and print formatting.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="resume-download-box">
                                        <div className="download-info">
                                            <FileText size={32} className="pdf-icon" />
                                            <div>
                                                <h3>Tailored_Resume_{report.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'Job'}.pdf</h3>
                                                <p>Standard A4 Print Dimensions • High-Resolution Vector Typography</p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => getResumePdf(interviewId)}
                                            disabled={downloadingResume}
                                            className="button primary-button download-main-btn"
                                        >
                                            {downloadingResume ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    <span>Compiling PDF Document...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Download size={18} />
                                                    <span>Download Tailored Resume PDF</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}
                    </main>
                </div>
            </div>
        </Layout>
    );
};

export default Interview;
