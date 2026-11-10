import React, { useState, useEffect } from 'react';
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
    Zap,
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
    const [completedTasks, setCompletedTasks] = useState({});
    const [practicedQuestions, setPracticedQuestions] = useState({});

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        }
    }, [interviewId]);

    const toggleQuestion = (id) => {
        setOpenQuestions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleCopy = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(key);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const toggleTask = (dayIndex, taskIndex) => {
        const key = `${dayIndex}-${taskIndex}`;
        setCompletedTasks(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const togglePracticed = (id) => {
        setPracticedQuestions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (loading || !report) {
        return (
            <Layout>
                <div className="min-h-[65vh] flex flex-col items-center justify-center gap-3 text-neutral-400">
                    <Loader2 size={36} className="animate-spin text-orange-500" />
                    <h2 className="text-xl font-medium text-white">Synthesizing Strategy with Groq AI...</h2>
                    <p className="text-xs text-neutral-400">Loading your interview questions, skill gaps, and ATS resume matrix.</p>
                </div>
            </Layout>
        );
    }

    const score = report.matchScore ?? 0;
    const totalTasks = report.preparationPlan?.reduce((acc, curr) => acc + (curr.tasks?.length || 0), 0) || 0;
    const completedTasksCount = Object.values(completedTasks).filter(Boolean).length;
    const roadmapProgressPct = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

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
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8 flex flex-col gap-8">
                {/* ── Top Navigation Bar ── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-neutral-300 transition"
                        >
                            <ArrowLeft size={14} />
                            <span>Dashboard</span>
                        </button>
                        <span className="text-neutral-600">•</span>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-medium max-w-md truncate">
                            <Briefcase size={12} className="shrink-0" />
                            <span className="truncate">{report.title || "Target Engineering Position"}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => getResumePdf(interviewId)}
                        disabled={downloadingResume}
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition shadow-lg group disabled:opacity-60"
                    >
                        {downloadingResume ? (
                            <>
                                <Loader2 size={14} className="animate-spin text-orange-500" />
                                <span>Compiling ATS PDF...</span>
                            </>
                        ) : (
                            <>
                                <Download size={14} />
                                <span>Download ATS Resume (PDF)</span>
                                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </>
                        )}
                    </button>
                </div>

                {/* ── Two-Column Bento Layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* ── Left Sidebar Bento Pod ── */}
                    <aside className="lg:col-span-4 flex flex-col gap-5 sticky top-6">
                        {/* Match Score Card (Directly mirrors reference image 20M+ / 98% bento card) */}
                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 flex flex-col gap-3 shadow-xl">
                            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                                <span>• Match Metric</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono ${
                                    score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                    score >= 60 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                    'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                    {score >= 80 ? 'Strong Alignment' : score >= 60 ? 'Moderate Fit' : 'Skill Deficiencies'}
                                </span>
                            </div>

                            <div className="text-6xl font-light tracking-tight text-white font-mono my-1">
                                {score}%
                            </div>

                            <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${score}%` }}
                                ></div>
                            </div>

                            <p className="text-xs text-neutral-400 font-light leading-relaxed mt-1">
                                {score >= 80
                                    ? 'Your background strongly aligns with this job description. Focus on system design trade-offs.'
                                    : score >= 60
                                    ? 'Solid baseline fit. Review the highlighted gaps to maximize interview conversion.'
                                    : 'Substantial skill gaps detected. Work through the 7-day preparation roadmap below.'}
                            </p>
                        </div>

                        {/* Navigation Tabs Pill List */}
                        <nav className="bg-[#121214] border border-white/5 rounded-3xl p-3 flex flex-col gap-1.5 shadow-xl">
                            <span className="text-[11px] font-mono text-neutral-400 px-3 pt-2 pb-1">
                                Strategy Modules
                            </span>

                            <button
                                type="button"
                                onClick={() => setActiveTab('technical')}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                                    activeTab === 'technical'
                                        ? 'bg-white text-black font-semibold'
                                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Code size={15} />
                                    <span>Technical Questions</span>
                                </div>
                                <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                                    activeTab === 'technical' ? 'bg-black text-white' : 'bg-white/5 text-neutral-400'
                                }`}>
                                    {report.technicalQuestions?.length || 0}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('behavioral')}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                                    activeTab === 'behavioral'
                                        ? 'bg-white text-black font-semibold'
                                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <MessageSquare size={15} />
                                    <span>Behavioral (STAR)</span>
                                </div>
                                <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                                    activeTab === 'behavioral' ? 'bg-black text-white' : 'bg-white/5 text-neutral-400'
                                }`}>
                                    {report.behavioralQuestions?.length || 0}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('roadmap')}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                                    activeTab === 'roadmap'
                                        ? 'bg-white text-black font-semibold'
                                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Calendar size={15} />
                                    <span>7-Day Roadmap</span>
                                </div>
                                <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                                    activeTab === 'roadmap' ? 'bg-black text-white' : 'bg-white/5 text-neutral-400'
                                }`}>
                                    {roadmapProgressPct}%
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('skillGaps')}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                                    activeTab === 'skillGaps'
                                        ? 'bg-white text-black font-semibold'
                                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <AlertTriangle size={15} />
                                    <span>Skill Gaps</span>
                                </div>
                                <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                                    activeTab === 'skillGaps' ? 'bg-black text-white' : 'bg-white/5 text-neutral-400'
                                }`}>
                                    {report.skillGaps?.length || 0}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('resume')}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                                    activeTab === 'resume'
                                        ? 'bg-white text-black font-semibold'
                                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <FileText size={15} />
                                    <span>ATS Resume Hub</span>
                                </div>
                                <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
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
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                                    <div>
                                        <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-1">
                                            <span>• Module 01</span>
                                        </div>
                                        <h2 className="text-2xl font-normal text-white tracking-tight">
                                            Technical Questions & Trade-offs
                                        </h2>
                                    </div>

                                    <div className="relative w-full sm:w-60">
                                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search questions..."
                                            className="w-full pl-9 pr-4 py-1.5 bg-[#09090b] border border-white/5 rounded-full text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white/20"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {filteredTechQuestions.map((q, idx) => {
                                        const isOpen = openQuestions[`tech-${idx}`] ?? (idx === 0);
                                        const isPracticed = practicedQuestions[`tech-${idx}`];

                                        return (
                                            <div
                                                key={idx}
                                                className={`rounded-2xl border transition-all ${
                                                    isPracticed
                                                        ? 'bg-emerald-500/[0.02] border-emerald-500/20'
                                                        : 'bg-[#09090b] border-white/5 hover:border-white/10'
                                                }`}
                                            >
                                                <div
                                                    onClick={() => toggleQuestion(`tech-${idx}`)}
                                                    className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span className="px-2 py-0.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-xs font-semibold shrink-0 mt-0.5">
                                                            Q{idx + 1}
                                                        </span>
                                                        <h3 className="text-sm font-medium text-white leading-relaxed">
                                                            {q.question}
                                                        </h3>
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                togglePracticed(`tech-${idx}`);
                                                            }}
                                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition ${
                                                                isPracticed
                                                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                                    : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
                                                            }`}
                                                        >
                                                            {isPracticed ? (
                                                                <CheckCircle2 size={13} className="text-emerald-400" />
                                                            ) : (
                                                                <Circle size={13} />
                                                            )}
                                                            <span className="hidden sm:inline">
                                                                {isPracticed ? "Practiced" : "Mark"}
                                                            </span>
                                                        </button>

                                                        <span className="text-neutral-400">
                                                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        </span>
                                                    </div>
                                                </div>

                                                {isOpen && (
                                                    <div className="px-4 sm:px-5 pb-5 pt-1 flex flex-col gap-4 border-t border-white/[0.04]">
                                                        {/* Intention */}
                                                        <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-white/5 flex flex-col gap-1 text-xs">
                                                            <span className="font-mono text-orange-400 uppercase text-[10px] tracking-wider">
                                                                • Evaluation Intention
                                                            </span>
                                                            <p className="text-neutral-300 leading-relaxed font-light">
                                                                {q.intention}
                                                            </p>
                                                        </div>

                                                        {/* Model Answer */}
                                                        <div className="p-4 rounded-xl bg-[#0e0e11] border border-white/5 flex flex-col gap-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-mono text-emerald-400 uppercase text-[10px] tracking-wider">
                                                                    • Model Technical Answer
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleCopy(q.answer, `tech-${idx}`)}
                                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 text-[11px] transition"
                                                                >
                                                                    {copiedIndex === `tech-${idx}` ? (
                                                                        <>
                                                                            <Check size={12} className="text-emerald-400" />
                                                                            <span className="text-emerald-400 font-mono">Copied</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Copy size={12} />
                                                                            <span className="font-mono">Copy</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line font-light">
                                                                {q.answer}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── Section 2: Behavioral Questions ── */}
                        {activeTab === 'behavioral' && (
                            <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                                    <div>
                                        <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-1">
                                            <span>• Module 02</span>
                                        </div>
                                        <h2 className="text-2xl font-normal text-white tracking-tight">
                                            Behavioral Scenarios (STAR Model)
                                        </h2>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {filteredBehavioralQuestions.map((q, idx) => {
                                        const isOpen = openQuestions[`beh-${idx}`] ?? (idx === 0);
                                        const isPracticed = practicedQuestions[`beh-${idx}`];

                                        return (
                                            <div
                                                key={idx}
                                                className={`rounded-2xl border transition-all ${
                                                    isPracticed
                                                        ? 'bg-emerald-500/[0.02] border-emerald-500/20'
                                                        : 'bg-[#09090b] border-white/5 hover:border-white/10'
                                                }`}
                                            >
                                                <div
                                                    onClick={() => toggleQuestion(`beh-${idx}`)}
                                                    className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-xs font-semibold shrink-0 mt-0.5">
                                                            B{idx + 1}
                                                        </span>
                                                        <h3 className="text-sm font-medium text-white leading-relaxed">
                                                            {q.question}
                                                        </h3>
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                togglePracticed(`beh-${idx}`);
                                                            }}
                                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition ${
                                                                isPracticed
                                                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                                    : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
                                                            }`}
                                                        >
                                                            {isPracticed ? (
                                                                <CheckCircle2 size={13} className="text-emerald-400" />
                                                            ) : (
                                                                <Circle size={13} />
                                                            )}
                                                            <span className="hidden sm:inline">
                                                                {isPracticed ? "Practiced" : "Mark"}
                                                            </span>
                                                        </button>

                                                        <span className="text-neutral-400">
                                                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        </span>
                                                    </div>
                                                </div>

                                                {isOpen && (
                                                    <div className="px-4 sm:px-5 pb-5 pt-1 flex flex-col gap-4 border-t border-white/[0.04]">
                                                        <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-white/5 flex flex-col gap-1 text-xs">
                                                            <span className="font-mono text-indigo-400 uppercase text-[10px] tracking-wider">
                                                                • Competency Evaluated
                                                            </span>
                                                            <p className="text-neutral-300 leading-relaxed font-light">
                                                                {q.intention}
                                                            </p>
                                                        </div>

                                                        <div className="p-4 rounded-xl bg-[#0e0e11] border border-white/5 flex flex-col gap-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-mono text-emerald-400 uppercase text-[10px] tracking-wider">
                                                                    • STAR Format Recommendation
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleCopy(q.answer, `beh-${idx}`)}
                                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 text-[11px] transition"
                                                                >
                                                                    {copiedIndex === `beh-${idx}` ? (
                                                                        <span className="text-emerald-400 font-mono">Copied</span>
                                                                    ) : (
                                                                        <span className="font-mono">Copy</span>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line font-light">
                                                                {q.answer}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── Section 3: 7-Day Roadmap ── */}
                        {activeTab === 'roadmap' && (
                            <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                                    <div>
                                        <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-1">
                                            <span>• Module 03</span>
                                        </div>
                                        <h2 className="text-2xl font-normal text-white tracking-tight">
                                            7-Day Preparation Roadmap
                                        </h2>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full transition-all"
                                                style={{ width: `${roadmapProgressPct}%` }}
                                            ></div>
                                        </div>
                                        <span className="font-mono text-xs text-neutral-300">
                                            {completedTasksCount}/{totalTasks} Done ({roadmapProgressPct}%)
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-5">
                                    {(report.preparationPlan || []).map((dayPlan, dayIdx) => (
                                        <div
                                            key={dayIdx}
                                            className="bg-[#09090b] border border-white/5 rounded-2xl p-5 flex flex-col gap-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-xs font-semibold">
                                                    Day {dayPlan.day || dayIdx + 1}
                                                </span>
                                                <h3 className="text-sm font-semibold text-white tracking-tight">
                                                    {dayPlan.focus}
                                                </h3>
                                            </div>

                                            <div className="flex flex-col gap-2 mt-1">
                                                {(dayPlan.tasks || []).map((task, taskIdx) => {
                                                    const isChecked = !!completedTasks[`${dayIdx}-${taskIdx}`];

                                                    return (
                                                        <div
                                                            key={taskIdx}
                                                            onClick={() => toggleTask(dayIdx, taskIdx)}
                                                            className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                                                                isChecked
                                                                    ? 'bg-emerald-500/[0.03] border-emerald-500/20 text-neutral-400'
                                                                    : 'bg-[#121214] border-white/5 hover:border-white/15 text-neutral-200'
                                                            }`}
                                                        >
                                                            {isChecked ? (
                                                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                                            ) : (
                                                                <Circle size={16} className="text-neutral-400 shrink-0" />
                                                            )}
                                                            <span className={`text-xs leading-relaxed font-light ${isChecked ? 'line-through' : ''}`}>
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
                                <div className="pb-4 border-b border-white/[0.06]">
                                    <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-1">
                                        <span>• Module 04</span>
                                    </div>
                                    <h2 className="text-2xl font-normal text-white tracking-tight">
                                        Identified Skill Deficiencies
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(report.skillGaps || []).map((gap, idx) => {
                                        const sev = gap.severity?.toLowerCase() || 'medium';
                                        return (
                                            <div
                                                key={idx}
                                                className={`p-5 rounded-2xl border flex flex-col justify-between gap-3 ${
                                                    sev === 'high'
                                                        ? 'bg-red-500/[0.03] border-red-500/20'
                                                        : sev === 'medium'
                                                        ? 'bg-amber-500/[0.03] border-amber-500/20'
                                                        : 'bg-blue-500/[0.03] border-blue-500/20'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="text-sm font-semibold text-white">
                                                        {gap.skill}
                                                    </h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                                                        sev === 'high' ? 'bg-red-500/20 text-red-400' :
                                                        sev === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                        {sev} Impact
                                                    </span>
                                                </div>

                                                <p className="text-xs text-neutral-400 leading-relaxed font-light">
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
                                <div className="pb-4 border-b border-white/[0.06]">
                                    <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-1">
                                        <span>• Module 05</span>
                                    </div>
                                    <h2 className="text-2xl font-normal text-white tracking-tight">
                                        Applicant Tracking System (ATS) Architecture
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-[#09090b] border border-white/5 rounded-2xl p-5 flex flex-col gap-2">
                                        <span className="font-mono text-emerald-400 text-xs">✓ Keyword Injection</span>
                                        <p className="text-xs text-neutral-400 font-light leading-relaxed">
                                            Extracts matching technologies and technical responsibilities directly from the target JD without awkward keyword stuffing.
                                        </p>
                                    </div>
                                    <div className="bg-[#09090b] border border-white/5 rounded-2xl p-5 flex flex-col gap-2">
                                        <span className="font-mono text-emerald-400 text-xs">✓ Parser-Safe Hierarchy</span>
                                        <p className="text-xs text-neutral-400 font-light leading-relaxed">
                                            Zero tables, zero graphics, and zero multi-column layouts that confuse Greenhouse, Lever, and Workday ATS parsers.
                                        </p>
                                    </div>
                                </div>

                                {/* Download Resume Bento CTA */}
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-[#121214] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-white">
                                                Tailored_ATS_Resume.pdf
                                            </h4>
                                            <p className="text-xs text-neutral-400 font-mono">
                                                A4 Vector PDF • Compiled via Headless Chromium
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => getResumePdf(interviewId)}
                                        disabled={downloadingResume}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition shadow-lg disabled:opacity-60"
                                    >
                                        {downloadingResume ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin text-orange-500" />
                                                <span>Rendering PDF...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Download size={14} />
                                                <span>Export Tailored PDF</span>
                                                <ArrowUpRight size={14} />
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
