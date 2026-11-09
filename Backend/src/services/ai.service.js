const Groq = require("groq-sdk");
const puppeteer = require("puppeteer");

function getGroqClient() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY is not defined in the environment variables.");
    }
    return new Groq({ apiKey });
}

/**
 * Helper to safely parse JSON from AI response
 */
function safeJsonParse(text) {
    if (!text) {
        throw new Error("Empty response received from AI model.");
    }
    const trimmed = text.trim();
    // In case model returns markdown code block ```json ... ```
    const cleaned = trimmed.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
    return JSON.parse(cleaned);
}

/**
 * Generate interview report, skill gaps, questions, and preparation plan using Groq AI
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const groq = getGroqClient();
    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

    const prompt = `You are an expert technical interviewer, talent recruiter, and career coach.
Analyze the candidate's profile against the target job description and provide a comprehensive interview preparation report.

Candidate Resume Text:
"""
${resume || "Not provided directly via PDF"}
"""

Candidate Self Description:
"""
${selfDescription || "Not provided"}
"""

Target Job Description:
"""
${jobDescription || "Not provided"}
"""

You MUST respond strictly with a valid JSON object matching this exact schema:
{
  "title": "Exact or inferred Job Title from the Job Description",
  "matchScore": 75, // Integer between 0 and 100 indicating profile match score
  "technicalQuestions": [
    {
      "question": "Realistic technical question based on the job requirements and candidate gaps",
      "intention": "What the interviewer is evaluating with this question",
      "answer": "Structured model answer covering key points, architecture/algorithm approach, and trade-offs"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Behavioral/situational question relevant to this role level",
      "intention": "What behavioral competency, ownership, or leadership is evaluated",
      "answer": "Recommended response structure using STAR methodology (Situation, Task, Action, Result)"
    }
  ],
  "skillGaps": [
    {
      "skill": "Name of the missing or under-represented skill or technology",
      "severity": "high" // Must be one of: "low", "medium", or "high"
    }
  ],
  "preparationPlan": [
    {
      "day": 1, // Integer starting from 1
      "focus": "Topic or core area of focus for this day",
      "tasks": [
        "Concrete actionable task or resource to study",
        "Practice problem or implementation objective"
      ]
    }
  ]
}

Provide at least 4-6 technical questions, 3-4 behavioral questions, all identified skill gaps with correct severity, and a realistic 5-7 day day-by-day preparation roadmap. Return ONLY the JSON object.`;

    const completion = await groq.chat.completions.create({
        model,
        messages: [
            {
                role: "system",
                content: "You are an expert AI career coach and technical evaluator. Output only valid JSON without explanation."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
    });

    const content = completion.choices?.[0]?.message?.content;
    const report = safeJsonParse(content);

    return report;
}

/**
 * Generate PDF buffer from HTML using Puppeteer
 */
async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
        ]
    });

    try {
        const page = await browser.newPage();
        await page.setContent(htmlContent, {
            waitUntil: "networkidle0",
            timeout: 30000
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "15mm",
                bottom: "15mm",
                left: "15mm",
                right: "15mm"
            }
        });

        return pdfBuffer;
    } finally {
        await browser.close();
    }
}

/**
 * Generate an ATS-friendly resume tailored to the target job description
 */
async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const groq = getGroqClient();
    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

    const prompt = `You are a professional resume writer and ATS (Applicant Tracking System) optimization specialist.
Generate a tailored, modern, ATS-friendly single/two-page resume in HTML/CSS based on the candidate's existing background and target job description.

Candidate Profile & Current Resume:
"""
${resume || "See self description"}
"""

Self Description / Highlights:
"""
${selfDescription || "Not provided"}
"""

Target Job Description:
"""
${jobDescription}
"""

Requirements:
1. Optimize keywords naturally for ATS parsing without keyword stuffing.
2. Structure clearly: Header (Name, Contact Details, LinkedIn, GitHub, Portfolio placeholders), Professional Summary, Core Competencies / Technical Skills, Professional Experience (action-driven bullet points with impact & metrics), Education, and Relevant Projects/Certifications.
3. Clean modern typography (sans-serif fonts like Helvetica, Arial, Calibri, sans-serif), elegant dark navy/slate accents, crisp borders, high contrast for readability and ATS scanning.
4. Use standard HTML tags (<header>, <section>, <h1>, <h2>, <h3>, <p>, <ul>, <li>). Do not use complex tables or multi-column layouts that break ATS parsers.
5. Include CSS embedded inside a <style> block within the HTML. Include @media print styles to ensure clean margins and page breaks.
6. The resume must read like authentic human writing, professional and impactful.

You MUST respond strictly with a valid JSON object with a single field:
{
  "html": "<!DOCTYPE html><html><head><style>/* CSS here */</style></head><body>/* Resume content */</body></html>"
}
Return ONLY the JSON object.`;

    const completion = await groq.chat.completions.create({
        model,
        messages: [
            {
                role: "system",
                content: "You are an ATS resume builder expert. Respond strictly with a JSON object containing the 'html' field."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4
    });

    const content = completion.choices?.[0]?.message?.content;
    const jsonContent = safeJsonParse(content);

    if (!jsonContent.html) {
        throw new Error("AI did not return valid resume HTML content.");
    }

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
    return pdfBuffer;
}

module.exports = {
    generateInterviewReport,
    generateResumePdf
};
