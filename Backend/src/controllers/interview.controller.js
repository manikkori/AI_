const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume, and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({
                message: "Target job description is required."
            });
        }

        let resumeText = "";

        if (req.file) {
            try {
                const parser = new pdfParse.PDFParse({ data: req.file.buffer });
                const parsed = await parser.getText();
                resumeText = parsed?.text || "";
                if (typeof parser.destroy === "function") {
                    await parser.destroy();
                }
            } catch (pdfErr) {
                console.error("PDF parsing error:", pdfErr);
                return res.status(400).json({
                    message: "Failed to extract text from the uploaded PDF resume. Please ensure it is a valid, readable PDF."
                });
            }
        }

        if (!resumeText.trim() && (!selfDescription || !selfDescription.trim())) {
            return res.status(400).json({
                message: "Please upload your resume PDF or provide a self-description."
            });
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription,
            ...interViewReportByAi
        });

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });
    } catch (err) {
        console.error("Error in generateInterViewReportController:", err);
        return res.status(500).json({
            message: "Failed to generate interview report. Please try again.",
            error: err.message
        });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        return res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });
    } catch (err) {
        console.error("Error in getInterviewReportByIdController:", err);
        return res.status(500).json({
            message: "Failed to fetch interview report.",
            error: err.message
        });
    }
}

/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        return res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        });
    } catch (err) {
        console.error("Error in getAllInterviewReportsController:", err);
        return res.status(500).json({
            message: "Failed to fetch interview reports.",
            error: err.message
        });
    }
}

/**
 * @description Controller to delete an interview report.
 */
async function deleteInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params;

        const deletedReport = await interviewReportModel.findOneAndDelete({
            _id: interviewId,
            user: req.user.id
        });

        if (!deletedReport) {
            return res.status(404).json({
                message: "Interview report not found or access denied."
            });
        }

        return res.status(200).json({
            message: "Interview report deleted successfully.",
            id: interviewId
        });
    } catch (err) {
        console.error("Error in deleteInterviewReportController:", err);
        return res.status(500).json({
            message: "Failed to delete interview report.",
            error: err.message
        });
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume, and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;

        // Security check: IDOR protection - user can only generate resume for their own report
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found or access denied."
            });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;

        const pdfBuffer = await generateResumePdf({
            resume,
            jobDescription,
            selfDescription
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        });

        return res.send(pdfBuffer);
    } catch (err) {
        console.error("Error in generateResumePdfController:", err);
        return res.status(500).json({
            message: "Failed to generate resume PDF.",
            error: err.message
        });
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    deleteInterviewReportController,
    generateResumePdfController
};
