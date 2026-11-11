import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useInterview } from '../hooks/useInterview';
import Layout from '../../../components/Layout';
import {
    ArrowLeft,
    Download,
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
    ChevronDown,
    ChevronUp,
    Briefcase,
    ArrowUpRight
} from 'lucide-react';

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
    const copyTimeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
        };
    }, []);

    // Persist completed roadmap tasks in localStorage across page refreshes
    const [completedTasks, setCompletedTasks] = useState(() => {
        try {
            const saved = localStorage.getItem(`interview_${interviewId}_tasks`);
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    // Persist practiced questions in localStorage across page refreshes
    const [practicedQuestions, setPracticedQuestions] = useState(() => {
        try {
            const saved = localStorage.getItem(`interview_${interviewId}_practiced`);
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
            // Sync saved checks from localStorage
            try {
                const savedTasks = localStorage.getItem(`interview_${interviewId}_tasks`);
                if (savedTasks) setCompletedTasks(JSON.parse(savedTasks));
                const savedPracticed = localStorage.getItem(`interview_${interviewId}_practiced`);
                if (savedPracticed) setPracticedQuestions(JSON.parse(savedPracticed));
            } catch (e) {
                console.error("Failed to load stored roadmap state:", e);
            }
        }
    }, [interviewId]);

    const toggleQuestion = (id) => {
        setOpenQuestions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleCopy = (text, key) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedIndex(key);
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Toggle task in roadmap and save to localStorage
    const toggleTask = (dayIndex, taskIndex) => {
        const key = `${dayIndex}-${taskIndex}`;
        setCompletedTasks(prev => {
            const updated = { ...prev, [key]: !prev[key] };
            try {
                localStorage.setItem(`interview_${interviewId}_tasks`, JSON.stringify(updated));
            } catch (e) {
                console.error("Failed to save roadmap state:", e);
            }
            return updated;
        });
    };

    // Toggle practiced question and save to localStorage
    const togglePracticed = (id) => {
        setPracticedQuestions(prev => {
            const updated = { ...prev, [id]: !prev[id] };
            try {
                localStorage.setItem(`interview_${interviewId}_practiced`, JSON.stringify(updated));
            } catch (e) {
                console.error("Failed to save practiced state:", e);
            }
            return updated;
        });
    };

    if (loading || !report) {
        return (
            <Layout>
                <div className="min-h-[65vh] flex flex-col items-center justify-center gap-4 text-neutral-400">
                    <Loader2 size={40} className="animate-spin text-orange-500" />
                    <h2 className="text-2xl font-semibold text-white">Generating Preparation Strategy...</h2>
                    <p className="text-sm text-neutral-400">Loading interview questions, skill gaps, and preparation plan...</p>
                </div>
            </Layout>
        );
    }

    const score = report.matchScore ?? 0;
    const totalTasks = useMemo(() => {
        return report.preparationPlan?.reduce((acc, curr) => acc + (curr.tasks?.length || 0), 0) || 0;
    }, [report.preparationPlan]);

    const completedTasksCount = useMemo(() => {
        return Object.values(completedTasks).filter(Boolean).length;
    }, [completedTasks]);

    const roadmapProgressPct = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

    const filteredTechQuestions = useMemo(() => {
        const query = (searchQuery || '').trim().toLowerCase();
        if (!query) return report.technicalQuestions || [];
        return (report.technicalQuestions || []).filter(q =>
            q.question?.toLowerCase().includes(query) ||
            q.answer?.toLowerCase().includes(query)
        );
    }, [report.technicalQuestions, searchQuery]);

    const filteredBehavioralQuestions = useMemo(() => {
        const query = (searchQuery || '').trim().toLowerCase();
        if (!query) return report.behavioralQuestions || [];
        return (report.behavioralQuestions || []).filter(q =>
            q.question?.toLowerCase().includes(query) ||
            q.answer?.toLowerCase().includes(query)
        );
    }, [report.behavioralQuestions, searchQuery]);

    return (
        <Layout>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 flex flex-col gap-8">
                {/* ── Top Navigation Bar ── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3.5 flex-wrap">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-sm font-medium text-neutral-200 transition"
                        >
                            <ArrowLeft size={16} />
                            <span>Dashboard</span>
                        </button>
                        <span className="text-neutral-500">•</span>
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-300 text-sm font-medium max-w-md truncate">
                            <Briefcase size={15} className="shrink-0" />
                            <span className="truncate">{report.title || "Target Engineering Position"}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => getResumePdf(interviewId)}
                        disabled={downloadingResume}
                        className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition shadow-lg group disabled:opacity-60"
                    >
                        {downloadingResume ? (
                            <>
                                <Loader2 size={16} className="animate-spin text-orange-500" />
                                <span>Compiling ATS PDF...</span>
                            </>
                        ) : (
                            <>
                                <Download size={16} />
                                <span>Download ATS Resume (PDF)</span>
                                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </>
                        )}
                    </button>
                </div>

                {/* ── Two-Column Bento Layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                    {/* ── Left Sidebar Bento Pod ── */}
                    <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-6">
                        {/* Match Score Card */}
                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-7 flex flex-col gap-4 shadow-xl">
                            <div className="flex items-center justify-between text-sm font-mono text-neutral-300">
                                <span>• Match Metric</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    score >= 80 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                                    score >= 60 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                                    'bg-red-500/15 text-red-400 border border-red-500/30'
                                }`}>
                                    {score >= 80 ? 'Strong Alignment' : score >= 60 ? 'Moderate Fit' : 'Skill Deficiencies'}
                                </span>
                            </div>

                            <div className="text-6xl font-light tracking-tight text-white font-mono my-1">
                                {score}%
                            </div>

                            <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${score}%` }}
                                ></div>
                            </div>

                            <p className="text-sm text-neutral-300 font-light leading-relaxed">
                                {score >= 80
                                    ? 'Your background strongly aligns with this job description. Focus on system design trade-offs and leadership.'
                                    : score >= 60
                                    ? 'Solid baseline fit. Review the highlighted gaps to maximize your interview conversion.'
                                    : 'Substantial skill gaps detected. Work through the 7-day preparation roadmap below to prepare thoroughly.'}
                            </p>
                        </div>

                        {/* Navigation Tabs Pill List */}
                        <nav className="bg-[#121214] border border-white/5 rounded-3xl p-4 flex flex-col gap-2 shadow-xl">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 px-3 pt-1 pb-1">
                                Strategy Modules
                            </span>

                            <button
                                type="button"
                                onClick={() => setActiveTab('technical')}
                                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                                    activeTab === 'technical'
                                        ? 'bg-white text-black font-semibold shadow-md'
                                        : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Code size={18} />
                                    <span>Technical Questions</span>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold ${
                                    activeTab === 'technical' ? 'bg-black text-white' : 'bg-white/10 text-neutral-300'
                                }`}>
                                    {report.technicalQuestions?.length || 0}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('behavioral')}
                                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                                    activeTab === 'behavioral'
                                        ? 'bg-white text-black font-semibold shadow-md'
                                        : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <MessageSquare size={18} />
                                    <span>Behavioral (STAR)</span>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold ${
                                    activeTab === 'behavioral' ? 'bg-black text-white' : 'bg-white/10 text-neutral-300'
                                }`}>
                                    {report.behavioralQuestions?.length || 0}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('roadmap')}
                                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                                    activeTab === 'roadmap'
                                        ? 'bg-white text-black font-semibold shadow-md'
                                        : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Calendar size={18} />
                                    <span>7-Day Roadmap</span>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold ${
                                    activeTab === 'roadmap' ? 'bg-black text-white' : 'bg-white/10 text-neutral-300'
                                }`}>
                                    {roadmapProgressPct}%
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('skillGaps')}
                                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                                    activeTab === 'skillGaps'
                                        ? 'bg-white text-black font-semibold shadow-md'
                                        : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <AlertTriangle size={18} />
                                    <span>Skill Gaps</span>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold ${
                                    activeTab === 'skillGaps' ? 'bg-black text-white' : 'bg-white/10 text-neutral-300'
                                }`}>
                                    {report.skillGaps?.length || 0}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('resume')}
                                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                                    activeTab === 'resume'
                                        ? 'bg-white text-black font-semibold shadow-md'
                                        : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <FileText size={18} />
                                    <span>ATS Resume Hub</span>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold ${
                                    activeTab === 'resume' ? 'bg-black text-white' : 'bg-orange-500/20 text-orange-400'
                                }`}>
                                    PDF
                                </span>
                            </button>
                        </nav>
                    </aside>

                    {/* ── Main Content Area Bento ── */}
                    <main className="lg:col-span-8 flex flex-col gap-6">
                        {/* ── Section 1: Technical Questions ── */}
                        {activeTab === 'technical' && (
                            <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                                    <div>
                                        <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-1.5">
                                            <span>• Module 01</span>
                                            <span>• Click questions to view detailed answers</span>
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                                            Technical Questions & Trade-offs
                                        </h2>
                                    </div>

                                    <div className="relative w-full sm:w-64">
                                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search questions or skills..."
                                            className="w-full pl-10 pr-4 py-2 bg-[#09090b] border border-white/10 rounded-full text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {filteredTechQuestions.length === 0 ? (
                                        <div className="py-12 text-center text-neutral-400 text-sm font-light">
                                            No technical questions found matching "{searchQuery}".
                                        </div>
                                    ) : (
                                        filteredTechQuestions.map((q, idx) => {
                                        const isOpen = openQuestions[`tech-${idx}`] ?? (idx === 0);
                                        const isPracticed = practicedQuestions[`tech-${idx}`];

                                        return (
                                            <div
                                                key={idx}
                                                className={`rounded-2xl border transition-all ${
                                                    isPracticed
                                                        ? 'bg-emerald-500/[0.03] border-emerald-500/30 shadow-sm'
                                                        : 'bg-[#09090b] border-white/5 hover:border-white/15'
                                                }`}
                                            >
                                                <div
                                                    onClick={() => toggleQuestion(`tech-${idx}`)}
                                                    className="p-5 flex items-start justify-between gap-4 cursor-pointer"
                                                >
                                                    <div className="flex items-start gap-3.5">
                                                        <span className="px-2.5 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 font-mono text-xs font-bold shrink-0 mt-0.5">
                                                            Q{idx + 1}
                                                        </span>
                                                        <h3 className="text-base sm:text-lg font-medium text-white leading-snug">
                                                            {q.question}
                                                        </h3>
                                                    </div>

                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                togglePracticed(`tech-${idx}`);
                                                            }}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium font-mono transition ${
                                                                isPracticed
                                                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                                                    : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10'
                                                            }`}
                                                        >
                                                            {isPracticed ? (
                                                                <CheckCircle2 size={15} className="text-emerald-400" />
                                                            ) : (
                                                                <Circle size={15} />
                                                            )}
                                                            <span className="hidden sm:inline">
                                                                {isPracticed ? "Practiced" : "Mark Done"}
                                                            </span>
                                                        </button>

                                                        <span className="text-neutral-400">
                                                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                        </span>
                                                    </div>
                                                </div>

                                                {isOpen && (
                                                    <div className="px-5 pb-6 pt-2 flex flex-col gap-4 border-t border-white/[0.06]">
                                                        {/* Intention */}
                                                        <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/5 flex flex-col gap-1.5 text-sm">
                                                            <span className="font-mono text-orange-400 uppercase text-xs font-bold tracking-wider">
                                                                • What Interviewer Is Looking For
                                                            </span>
                                                            <p className="text-neutral-300 leading-relaxed font-light">
                                                                {q.intention}
                                                            </p>
                                                        </div>

                                                        {/* Model Answer */}
                                                        <div className="p-5 rounded-xl bg-[#0e0e11] border border-white/5 flex flex-col gap-3">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-mono text-emerald-400 uppercase text-xs font-bold tracking-wider">
                                                                    • Model Answer & Key Points
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleCopy(q.answer, `tech-${idx}`)}
                                                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-neutral-200 text-xs font-medium transition"
                                                                >
                                                                    {copiedIndex === `tech-${idx}` ? (
                                                                        <>
                                                                            <Check size={14} className="text-emerald-400" />
                                                                            <span className="text-emerald-400 font-mono">Copied</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Copy size={14} />
                                                                            <span className="font-mono">Copy Answer</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed whitespace-pre-line font-light">
                                                                {q.answer}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                                </div>
                            </div>
                        )}

                        {/* ── Section 2: Behavioral Questions ── */}
                        {activeTab === 'behavioral' && (
                            <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                                    <div>
                                        <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-1.5">
                                            <span>• Module 02</span>
                                            <span>• STAR Method (Situation, Task, Action, Result)</span>
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                                            Behavioral & Situational Questions
                                        </h2>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {filteredBehavioralQuestions.length === 0 ? (
                                        <div className="py-12 text-center text-neutral-400 text-sm font-light">
                                            No behavioral questions found matching "{searchQuery}".
                                        </div>
                                    ) : (
                                        filteredBehavioralQuestions.map((q, idx) => {
                                        const isOpen = openQuestions[`beh-${idx}`] ?? (idx === 0);
                                        const isPracticed = practicedQuestions[`beh-${idx}`];

                                        return (
                                            <div
                                                key={idx}
                                                className={`rounded-2xl border transition-all ${
                                                    isPracticed
                                                        ? 'bg-emerald-500/[0.03] border-emerald-500/30 shadow-sm'
                                                        : 'bg-[#09090b] border-white/5 hover:border-white/15'
                                                }`}
                                            >
                                                <div
                                                    onClick={() => toggleQuestion(`beh-${idx}`)}
                                                    className="p-5 flex items-start justify-between gap-4 cursor-pointer"
                                                >
                                                    <div className="flex items-start gap-3.5">
                                                        <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-mono text-xs font-bold shrink-0 mt-0.5">
                                                            B{idx + 1}
                                                        </span>
                                                        <h3 className="text-base sm:text-lg font-medium text-white leading-snug">
                                                            {q.question}
                                                        </h3>
                                                    </div>

                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                togglePracticed(`beh-${idx}`);
                                                            }}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium font-mono transition ${
                                                                isPracticed
                                                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                                                    : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10'
                                                            }`}
                                                        >
                                                            {isPracticed ? (
                                                                <CheckCircle2 size={15} className="text-emerald-400" />
                                                            ) : (
                                                                <Circle size={15} />
                                                            )}
                                                            <span className="hidden sm:inline">
                                                                {isPracticed ? "Practiced" : "Mark Done"}
                                                            </span>
                                                        </button>

                                                        <span className="text-neutral-400">
                                                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                        </span>
                                                    </div>
                                                </div>

                                                {isOpen && (
                                                    <div className="px-5 pb-6 pt-2 flex flex-col gap-4 border-t border-white/[0.06]">
                                                        <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/5 flex flex-col gap-1.5 text-sm">
                                                            <span className="font-mono text-indigo-400 uppercase text-xs font-bold tracking-wider">
                                                                • Core Competency Evaluated
                                                            </span>
                                                            <p className="text-neutral-300 leading-relaxed font-light">
                                                                {q.intention}
                                                            </p>
                                                        </div>

                                                        <div className="p-5 rounded-xl bg-[#0e0e11] border border-white/5 flex flex-col gap-3">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-mono text-emerald-400 uppercase text-xs font-bold tracking-wider">
                                                                    • STAR Response Framework
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleCopy(q.answer, `beh-${idx}`)}
                                                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-neutral-200 text-xs font-medium transition"
                                                                >
                                                                    {copiedIndex === `beh-${idx}` ? (
                                                                        <span className="text-emerald-400 font-mono">Copied</span>
                                                                    ) : (
                                                                        <span className="font-mono">Copy Answer</span>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed whitespace-pre-line font-light">
                                                                {q.answer}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                                </div>
                            </div>
                        )}

                        {/* ── Section 3: 7-Day Roadmap (Saved in LocalStorage) ── */}
                        {activeTab === 'roadmap' && (
                            <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                                    <div>
                                        <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-1.5">
                                            <span>• Module 03</span>
                                            <span>• Progress saved automatically</span>
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                                            7-Day Preparation Sprint
                                        </h2>
                                    </div>

                                    <div className="flex items-center gap-3.5 bg-neutral-900/80 px-4 py-2 rounded-2xl border border-white/5">
                                        <div className="w-28 sm:w-36 h-2 bg-neutral-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                                style={{ width: `${roadmapProgressPct}%` }}
                                            ></div>
                                        </div>
                                        <span className="font-mono text-sm text-neutral-200 font-medium">
                                            {completedTasksCount}/{totalTasks} Done ({roadmapProgressPct}%)
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-5">
                                    {(report.preparationPlan || []).map((dayPlan, dayIdx) => (
                                        <div
                                            key={dayIdx}
                                            className="bg-[#09090b] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider">
                                                    Day {dayPlan.day || dayIdx + 1}
                                                </span>
                                                <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                                                    {dayPlan.focus}
                                                </h3>
                                            </div>

                                            <div className="flex flex-col gap-2.5 mt-1">
                                                {(dayPlan.tasks || []).map((task, taskIdx) => {
                                                    const isChecked = !!completedTasks[`${dayIdx}-${taskIdx}`];

                                                    return (
                                                        <div
                                                            key={taskIdx}
                                                            onClick={() => toggleTask(dayIdx, taskIdx)}
                                                            className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition select-none ${
                                                                isChecked
                                                                    ? 'bg-emerald-500/[0.04] border-emerald-500/30 text-neutral-400'
                                                                    : 'bg-[#121214] border-white/5 hover:border-white/20 text-neutral-200'
                                                            }`}
                                                        >
                                                            <div className="mt-0.5 shrink-0">
                                                                {isChecked ? (
                                                                    <CheckCircle2 size={18} className="text-emerald-400" />
                                                                ) : (
                                                                    <Circle size={18} className="text-neutral-500" />
                                                                )}
                                                            </div>
                                                            <span className={`text-sm sm:text-base leading-relaxed ${isChecked ? 'line-through text-neutral-500' : 'text-neutral-200 font-normal'}`}>
                                                                {task}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Section 4: Skill Gaps ── */}
                        {activeTab === 'skillGaps' && (
                            <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
                                <div className="pb-5 border-b border-white/[0.08]">
                                    <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-1.5">
                                        <span>• Module 04</span>
                                        <span>• Prioritized by hiring impact</span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                                        Identified Skill Deficiencies
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {(report.skillGaps || []).map((gap, idx) => {
                                        const sev = gap.severity?.toLowerCase() || 'medium';
                                        return (
                                            <div
                                                key={idx}
                                                className={`p-6 rounded-2xl border flex flex-col justify-between gap-3.5 ${
                                                    sev === 'high'
                                                        ? 'bg-red-500/[0.04] border-red-500/25'
                                                        : sev === 'medium'
                                                        ? 'bg-amber-500/[0.04] border-amber-500/25'
                                                        : 'bg-blue-500/[0.04] border-blue-500/25'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <h3 className="text-base font-semibold text-white">
                                                        {gap.skill}
                                                    </h3>
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono uppercase font-bold tracking-wider ${
                                                        sev === 'high' ? 'bg-red-500/20 text-red-400' :
                                                        sev === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                        {sev} Impact
                                                    </span>
                                                </div>

                                                <p className="text-sm text-neutral-300 leading-relaxed font-light">
                                                    {sev === 'high'
                                                        ? 'Critical qualification for this role. Expect direct code implementations or architectural grilling.'
                                                        : sev === 'medium'
                                                        ? 'Important competency. Review fundamental concepts and operational trade-offs.'
                                                        : 'Nice-to-have qualification. High-level familiarity will suffice.'}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── Section 5: ATS Resume Hub ── */}
                        {activeTab === 'resume' && (
                            <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
                                <div className="pb-5 border-b border-white/[0.08]">
                                    <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-1.5">
                                        <span>• Module 05</span>
                                        <span>• 99% ATS Pass Rate Standard</span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                                        Applicant Tracking System (ATS) Architecture
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="bg-[#09090b] border border-white/5 rounded-2xl p-6 flex flex-col gap-2.5">
                                        <span className="font-mono text-emerald-400 text-sm font-semibold">✓ Targeted Keyword Alignment</span>
                                        <p className="text-sm text-neutral-300 font-light leading-relaxed">
                                            Extracts matching technologies and technical responsibilities directly from the target JD without awkward keyword stuffing.
                                        </p>
                                    </div>
                                    <div className="bg-[#09090b] border border-white/5 rounded-2xl p-6 flex flex-col gap-2.5">
                                        <span className="font-mono text-emerald-400 text-sm font-semibold">✓ Parser-Safe Single/Dual Hierarchy</span>
                                        <p className="text-sm text-neutral-300 font-light leading-relaxed">
                                            Zero tables, zero graphics, and zero multi-column layouts that confuse Greenhouse, Lever, and Workday ATS parsers.
                                        </p>
                                    </div>
                                </div>

                                {/* Download Resume Bento CTA */}
                                <div className="p-7 rounded-2xl bg-gradient-to-br from-neutral-900 to-[#121214] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5 mt-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-semibold text-white">
                                                Tailored_ATS_Resume.pdf
                                            </h4>
                                            <p className="text-xs text-neutral-400 font-mono mt-0.5">
                                                A4 Vector PDF • Compiled via Headless Chromium
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => getResumePdf(interviewId)}
                                        disabled={downloadingResume}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition shadow-lg disabled:opacity-60"
                                    >
                                        {downloadingResume ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin text-orange-500" />
                                                <span>Rendering PDF...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Download size={16} />
                                                <span>Export Tailored PDF</span>
                                                <ArrowUpRight size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </Layout>
    );
};

export default Interview;
