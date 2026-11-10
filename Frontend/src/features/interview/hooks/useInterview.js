import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf, deleteInterviewReport } from "../services/interview.api";
import { useContext, useEffect, useState } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;
    const [downloadingResume, setDownloadingResume] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        setErrorMessage("");
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            if (response?.interviewReport) {
                setReport(response.interviewReport);
                // Prepend to reports list
                setReports(prev => [response.interviewReport, ...prev]);
                return response.interviewReport;
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Failed to generate report.";
            setErrorMessage(msg);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getReportById = async (id) => {
        setLoading(true);
        setErrorMessage("");
        try {
            const response = await getInterviewReportById(id);
            setReport(response.interviewReport);
            return response.interviewReport;
        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Failed to fetch report.";
            setErrorMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    const getReports = async () => {
        setLoading(true);
        try {
            const response = await getAllInterviewReports();
            setReports(response.interviewReports || []);
            return response.interviewReports;
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const getResumePdf = async (interviewReportId) => {
        setDownloadingResume(true);
        setErrorMessage("");
        try {
            const response = await generateResumePdf({ interviewReportId });
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `ATS_Resume_${interviewReportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to generate resume PDF.";
            setErrorMessage(msg);
            throw error;
        } finally {
            setDownloadingResume(false);
        }
    };

    const handleDeleteReport = async (id) => {
        try {
            await deleteInterviewReport(id);
            setReports(prev => prev.filter(r => r._id !== id));
            if (report && report._id === id) {
                setReport(null);
            }
            return true;
        } catch (error) {
            console.error("Delete report error:", error);
            throw error;
        }
    };

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        } else {
            getReports();
        }
    }, [interviewId]);

    return {
        loading,
        downloadingResume,
        errorMessage,
        setErrorMessage,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf,
        handleDeleteReport
    };
};
