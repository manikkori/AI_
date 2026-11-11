import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview';
import { useAuth } from '../../auth/hooks/useAuth';
import Layout from '../../../components/Layout';
import {
    Sparkles,
    UploadCloud,
    FileText,
    X,
    ArrowUpRight,
    Loader2,
    CheckCircle2,
    Clock,
    Download,
    Trash2,
    Search,
    AlertCircle,
    Cpu,
    Target,
    Layers,
    FileCode
} from 'lucide-react';

const PRESET_ROLES = [
    {
        name: "Fullstack Eng",
        title: "Senior Full Stack Engineer (React + Node)",
        text: `We are looking for a Senior Full Stack Engineer proficient in React, TypeScript, Node.js, Express, and MongoDB/PostgreSQL. Responsibilities include building scalable REST and GraphQL APIs, optimizing client-side performance, implementing robust JWT authentication, containerization with Docker, and designing event-driven microservices.`
    },
    {
        name: "Frontend React",
        title: "Lead Frontend Engineer (React/Next.js)",
        text: `Seeking a Lead Frontend Engineer with deep expertise in modern React 19, Next.js App Router, TypeScript, Tailwind CSS, and state management (Zustand/Redux). You will lead component architecture, Core Web Vitals optimization, accessibility (WCAG AA), and headless API integration.`
    },
    {
        name: "Backend Cloud",
        title: "Backend Platform Engineer (Node.js/AWS)",
        text: `Hiring a Backend Platform Engineer to architect high-throughput distributed systems. Requirements include Node.js, TypeScript, PostgreSQL, Redis caching, message brokers (Kafka/RabbitMQ), and AWS cloud services (S3, Lambda, ECS) with test-driven development.`
    },
    {
        name: "System Design",
        title: "Staff Software Architect",
        text: `Looking for a Software Architect to drive technical strategy across distributed microservices, database sharding, fault tolerance, API gateways, low-latency caching, CI/CD observability, and cross-team engineering standards.`
    }
];

const Home = () => {
    const {
        loading,
        generateReport,
        reports,
        getResumePdf,
        handleDeleteReport
    } = useInterview();

    const { user } = useAuth();
    const navigate = useNavigate();

    const [jobDescription, setJobDescription] = useState('');
    const [selfDescription, setSelfDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [downloadingId, setDownloadingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [showSelfDesc, setShowSelfDesc] = useState(false);

    const fileInputRef = useRef(null);

    // Drag and drop handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleValidateFile(e.dataTransfer.files[0]);
        }
    };

    const handleValidateFile = (file) => {
        setErrorMsg('');
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            setErrorMsg('Only PDF resumes are supported. Please upload a .pdf file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setErrorMsg('File size exceeds the 5MB limit.');
            return;
        }
        setSelectedFile(file);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSelectPreset = (preset) => {
        setJobDescription(preset.text);
        setErrorMsg('');
    };

    const handleGenerate = async () => {
        setErrorMsg('');
        if (!jobDescription.trim()) {
            setErrorMsg('Please paste a target Job Description to benchmark against.');
            return;
        }
        if (!selectedFile && !selfDescription.trim()) {
            setErrorMsg('Please upload a PDF resume or type your experience highlights.');
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
            setErrorMsg(err.response?.data?.message || 'Failed to generate report. Please try again.');
        }
    };

    const onDownloadResume = async (e, id) => {
        e.stopPropagation();
        setDownloadingId(id);
        try {
            await getResumePdf(id);
        } catch (err) {
            console.error('Download error:', err);
        } finally {
            setDownloadingId(null);
        }
    };

    const onDeleteReport = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this report?')) {
            setDeletingId(id);
            try {
                await handleDeleteReport(id);
            } catch (err) {
                console.error('Delete error:', err);
            } finally {
                setDeletingId(null);
            }
        }
    };

    const filteredReports = reports.filter(r =>
        (r.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8 flex flex-col gap-10">
                {/* ── Main Bento Grid: Left Column + Right Column ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* ── Left Column: Candidate & Resume Profile Pod (Directly modeled after reference card) ── */}
                    <div className="lg:col-span-4 bg-[#121214] border border-white/5 rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-2xl relative overflow-hidden">
                        {/* Top: Brand mark + Live Availability Badge */}
                        <div className="flex items-center justify-between">
                            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-orange-500">
                                <Sparkles size={16} />
                            </div>
                            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-neutral-300">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>ATS Analyzer Active</span>
                            </div>
                        </div>

                        {/* Center Visual Frame: Glowing Amber/Coral Lighting (Like reference image portrait frame) */}
                        <div className="w-full rounded-2xl bg-gradient-to-br from-[#e03816] via-[#b32607] to-[#1c0804] p-6 relative overflow-hidden shadow-2xl border border-orange-500/30 flex flex-col justify-between min-h-[260px]">
                            {/* Ambient flare */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/30 rounded-full blur-2xl pointer-events-none"></div>

                            <div className="relative z-10">
                                <span className="text-xs font-mono font-bold tracking-widest text-orange-200 uppercase opacity-95">
                                    • Candidate Profile Matrix
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                                    {user?.username ? user.username : "Your Career"}
                                </h3>
                                <p className="text-sm text-orange-100/90 mt-1 font-normal">
                                    Targeting High-Growth Engineering Roles
                                </p>
                            </div>

                            {/* Dropzone inside or overlay */}
                            <div className="relative z-10 mt-4">
                                {!selectedFile ? (
                                    <div
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`w-full py-5 px-3 rounded-xl border border-white/30 bg-black/40 backdrop-blur-md cursor-pointer transition-all flex flex-col items-center justify-center text-center ${
                                            dragActive ? 'bg-black/60 border-white ring-2 ring-white/50' : 'hover:bg-black/50'
                                        }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,application/pdf"
                                            onChange={(e) => e.target.files?.[0] && handleValidateFile(e.target.files[0])}
                                            className="hidden"
                                        />
                                        <UploadCloud size={24} className="text-orange-300 mb-1.5" />
                                        <span className="text-sm font-semibold text-white">
                                            Drop PDF Resume Here
                                        </span>
                                        <span className="text-xs text-orange-100/90 mt-0.5 font-mono">
                                            Max 5MB • Instant Vector Parsing
                                        </span>
                                    </div>
                                ) : (
                                    <div className="w-full p-3.5 rounded-xl border border-emerald-500/40 bg-black/60 backdrop-blur-md flex items-center justify-between">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <FileText size={22} className="text-emerald-400 shrink-0" />
                                            <div className="truncate">
                                                <p className="text-sm font-semibold text-white truncate">
                                                    {selectedFile.name}
                                                </p>
                                                <p className="text-xs text-emerald-300 font-mono">
                                                    {(selectedFile.size / 1024).toFixed(0)} KB • Ready for Groq AI
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleRemoveFile}
                                            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10"
                                            title="Remove"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Stylized Signature / Script Branding */}
                            <div className="relative z-10 flex items-end justify-between pt-2">
                                <span className="font-serif italic text-2xl tracking-wide text-white/95">
                                    ResumeForge
                                </span>
                                <span className="text-xs font-mono font-medium text-orange-200 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                                    ATS v2.4
                                </span>
                            </div>
                        </div>

                        {/* Candidate Details & Status */}
                        <div className="flex flex-col items-center text-center gap-1">
                            <span className="text-base font-medium text-neutral-200">
                                {user?.email || "candidate.portfolio@gmail.com"}
                            </span>
                            <span className="text-xs text-neutral-400 font-mono">
                                Powered by Groq Ultra-Low Latency Inference
                            </span>
                        </div>

                        {/* Social / Specs Mini Pills Row */}
                        <div className="flex items-center justify-center gap-2">
                            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/5 text-xs text-neutral-300 font-mono">
                                PDF Native
                            </span>
                            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/5 text-xs text-neutral-300 font-mono">
                                Zero Hallucination
                            </span>
                            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/5 text-xs text-neutral-300 font-mono">
                                A4 Print Ready
                            </span>
                        </div>

                        {/* Primary Action Button (Matches the reference "Get Started ↗" pill) */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full flex items-center justify-between p-2.5 pl-6 rounded-full bg-white text-black font-semibold text-base hover:bg-neutral-200 transition-all shadow-xl group disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <span>
                                {loading ? "Evaluating With Groq AI..." : "Run Career Gap Analysis"}
                            </span>
                            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin text-orange-400" />
                                ) : (
                                    <ArrowUpRight size={20} />
                                )}
                            </div>
                        </button>
                    </div>

                    {/* ── Right Column: Minimalist Headline, Chips, JD Input & Bottom Bento Cards ── */}
                    <div className="lg:col-span-8 flex flex-col justify-between gap-6">
                        {/* Upper Section: Introduction & Headline */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-neutral-400 text-sm font-mono">
                                <span>•</span>
                                <span>AI Career Intelligence & ATS Synthesis</span>
                            </div>

                            {/* Big Bold Headline directly matching reference style */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white leading-[1.15]">
                                Making Your Next Career Move a Pain Free Experience
                            </h1>

                            <p className="text-neutral-300 text-base md:text-lg font-light max-w-2xl leading-relaxed mt-1">
                                Benchmark your background against real job requirements. Uncover missing tech competencies,
                                master tailored interview questions, and export a recruiter-ready ATS resume.
                            </p>

                            {/* Preset Role Tag Chips (Directly styled like reference image pills: Branding, Art Direction, UI Design...) */}
                            <div className="flex flex-wrap items-center gap-2.5 pt-2">
                                <span className="text-sm text-neutral-400 font-mono mr-1">Load Preset JD:</span>
                                {PRESET_ROLES.map((role, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleSelectPreset(role)}
                                        className="px-4 py-2 rounded-full bg-[#18181c] border border-white/5 text-sm text-neutral-300 hover:text-white hover:border-white/20 transition-all font-medium"
                                    >
                                        {role.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Error Alert if any */}
                        {errorMsg && (
                            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                                <AlertCircle size={16} className="shrink-0" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        {/* Job Description Dark Card */}
                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-5 md:p-6 flex flex-col gap-3">
                            <div className="flex items-center justify-between text-sm text-neutral-300">
                                <div className="flex items-center gap-2">
                                    <Target size={16} className="text-orange-500" />
                                    <span className="text-white font-medium">Target Job Description</span>
                                </div>
                                <span className="font-mono text-xs text-neutral-400">
                                    {jobDescription.length} / 5000 chars
                                </span>
                            </div>

                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the target job description here (requirements, qualifications, responsibilities)..."
                                className="w-full h-32 md:h-36 bg-[#09090b] border border-white/5 rounded-2xl p-4 text-base text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-white/20 transition-colors resize-none leading-relaxed"
                                maxLength={5000}
                            />

                            {/* Optional supplementary self description accordion */}
                            <div className="pt-1 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setShowSelfDesc(!showSelfDesc)}
                                    className="text-sm text-neutral-400 hover:text-neutral-200 underline font-mono"
                                >
                                    {showSelfDesc ? "Hide Extra Highlights" : "+ Add Experience Highlights / Self-Description"}
                                </button>
                                {jobDescription && (
                                    <button
                                        type="button"
                                        onClick={() => setJobDescription('')}
                                        className="text-sm text-neutral-400 hover:text-neutral-300 font-mono"
                                    >
                                        Clear Text
                                    </button>
                                )}
                            </div>

                            {showSelfDesc && (
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    placeholder="Add any extra accomplishments, metrics, or technologies not listed in your PDF..."
                                    className="w-full h-24 bg-[#09090b] border border-white/5 rounded-xl p-3.5 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white/20 transition-colors resize-none"
                                />
                            )}
                        </div>

                        {/* ── Bottom Bento Metric Cards (Matching reference image: Net Worth 20M+ & Success Rate 98%) ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Bento Card 1: ATS Compatibility */}
                            <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 flex flex-col justify-between gap-4">
                                <span className="text-sm text-neutral-400 font-mono">
                                    • ATS Compatibility Rate
                                </span>
                                <div className="text-5xl font-light tracking-tight text-white font-mono">
                                    99%
                                </div>
                                <p className="text-sm text-neutral-300 font-light leading-relaxed">
                                    Clean semantic formatting passes automated applicant trackers with zero parsing drops.
                                </p>
                            </div>

                            {/* Bento Card 2: 7-Day Sprint */}
                            <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 flex flex-col justify-between gap-4">
                                <span className="text-sm text-neutral-400 font-mono">
                                    • Preparation Sprint
                                </span>
                                <div className="text-5xl font-light tracking-tight text-white font-mono">
                                    7 Days
                                </div>
                                <p className="text-sm text-neutral-300 font-light leading-relaxed">
                                    Day-by-day technical curriculum closing critical gaps before your first technical screen.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Saved Reports History Section ── */}
                <section id="recent-reports" className="pt-8 border-t border-white/[0.06] flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-neutral-400 text-sm font-mono mb-1">
                                <span>•</span>
                                <span>Archive</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
                                Saved Interview Strategies & Resumes
                            </h2>
                        </div>

                        {reports.length > 0 && (
                            <div className="relative w-full sm:w-72">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by job title..."
                                    className="w-full pl-9 pr-4 py-2.5 bg-[#121214] border border-white/5 rounded-full text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-white/20"
                                />
                            </div>
                        )}
                    </div>

                    {reports.length === 0 ? (
                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center gap-3">
                            <Layers size={36} className="text-neutral-600" />
                            <h3 className="text-lg font-medium text-neutral-200">
                                No Career Strategies Generated Yet
                            </h3>
                            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
                                Paste a target job description and upload your resume above to create your first deep gap analysis and custom ATS resume.
                            </p>
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 text-center text-sm text-neutral-400">
                            No reports matching "{searchTerm}".
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredReports.map((reportItem) => {
                                const score = reportItem.matchScore ?? 0;
                                const isDownloading = downloadingId === reportItem._id;
                                const isDeleting = deletingId === reportItem._id;

                                return (
                                    <div
                                        key={reportItem._id}
                                        onClick={() => navigate(`/interview/${reportItem._id}`)}
                                        className="bg-[#121214] border border-white/5 hover:border-white/20 rounded-3xl p-6 flex flex-col justify-between gap-5 cursor-pointer transition-all hover:-translate-y-0.5 shadow-lg group"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between text-sm text-neutral-400 font-mono">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={14} />
                                                    {new Date(reportItem.createdAt).toLocaleDateString([], {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/5 text-xs font-semibold text-orange-400">
                                                    {score}% Match
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-semibold text-white tracking-tight line-clamp-2 mt-1">
                                                {reportItem.title || "Untitled Engineering Role"}
                                            </h3>

                                            <p className="text-sm text-neutral-300 line-clamp-2 font-light leading-relaxed">
                                                Click to review technical question bank, STAR behavioral answers, and 7-day preparation roadmap.
                                            </p>
                                        </div>

                                        {/* Card Actions */}
                                        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                                            <button
                                                type="button"
                                                onClick={(e) => onDownloadResume(e, reportItem._id)}
                                                disabled={isDownloading}
                                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-sm font-medium text-neutral-200 transition"
                                            >
                                                {isDownloading ? (
                                                    <Loader2 size={14} className="animate-spin text-orange-400" />
                                                ) : (
                                                    <Download size={14} />
                                                )}
                                                <span>{isDownloading ? "Generating..." : "Resume PDF"}</span>
                                            </button>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={(e) => onDeleteReport(e, reportItem._id)}
                                                    disabled={isDeleting}
                                                    className="p-2 rounded-full text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition"
                                                    title="Delete report"
                                                >
                                                    {isDeleting ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={15} />
                                                    )}
                                                </button>

                                                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-105 transition-transform">
                                                    <ArrowUpRight size={16} />
                                                </div>
                                            </div>
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
