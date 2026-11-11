# ⚡ ResumeForge (AI Career Intelligence & ATS Resume Synthesis)

An end-to-end full-stack AI platform designed to analyze engineering resumes against target job descriptions, discover critical competency gaps, generate a personalized 7-day interview preparation roadmap, and compile ATS-compliant PDF resumes.

---

## 🌟 Core Features

- **Candidate vs. JD Gap Analysis:** Compares candidate experience against any target job requirements to generate an objective match score.
- **Skill Gap Discovery:** Categorizes missing requirements by impact level (`High`, `Medium`, `Low`) with targeted study suggestions.
- **Interview Question Bank:** Curates customized technical grilling questions, design trade-offs, and STAR behavioral answers.
- **7-Day Preparation Sprint:** Step-by-step roadmap with interactive checklists that persist across browser refreshes via `localStorage`.
- **Single-Click ATS PDF Generator:** Converts AI-tailored resume specifications into clean, standard A4 PDFs via automated headless Chrome Puppeteer.
- **Bento Dark UI:** Minimalist matte black aesthetic inspired by modern design systems, built with pure Tailwind CSS.
- **Dual Authentication:** Dual JWT cookie & Bearer token support with IDOR-protected endpoints and rate limiting.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS (Dark Bento Matte Aesthetic)
- **Icons:** Lucide React
- **HTTP Client:** Axios (Bearer interceptors & resilient 401 handling)
- **Deployment:** Vercel (Configured with `vercel.json` SPA rewrites)

### Backend
- **Runtime:** Node.js + Express
- **Database:** MongoDB via Mongoose
- **AI Engine:** Groq SDK (`llama-3.3-70b-versatile`)
- **PDF Engine:** Puppeteer (Headless Chrome with sandbox bypass)
- **Security:** Helmet, express-rate-limit, bcryptjs, JWT, token blacklisting
- **Deployment:** Render / Railway (`render.yaml` blueprint included)

---

## 🚀 Environment Variables

### Backend (`Backend/.env`)
```env
PORT=3000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/resume_forge?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_here
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
CLIENT_URL=https://your-frontend-app.vercel.app
```

### Frontend (`Frontend/.env`)
```env
VITE_API_URL=https://your-backend-service.onrender.com
```

---

## 📦 Local Development

1. **Clone repository:**
   ```bash
   git clone https://github.com/manikkori/AI_.git
   cd AI_
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

---

## 📄 License
MIT License. Built for modern software engineers aiming for top-tier roles.
