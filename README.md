# Fyndora — Student Career Discovery & Scholarship Platform

**Fyndora** is a modern, student-focused educational platform that guides high-school students through discovering purpose-driven career pathways, understanding degree and subject prerequisites, and unlocking verified scholarships and educational opportunities worldwide.

---

## 🌟 Key Features

1. **Home Page (`/`)**:
   - Hero: *"Discover Your Future. Find Your Path."*
   - Subtitle: *"Explore careers, discover educational opportunities, and find scholarships that match your goals."*
   - Quick access to Career Explorer, Scholarships Directory, and Career Quiz.
   - Highlights 10 career categories and the 5-step guiding framework.

2. **Career Explorer (`/careers`) & Detail Pages (`/careers/:id`)**:
   - 26+ detailed career pathways across Technology, Engineering, Medicine, Business, Law, Science, Design, Arts & Media, and Education.
   - Daily responsibilities, essential skills, recommended high-school subjects, university degree requirements, and possible workplaces.
   - Interactive fit check and **Student Discussion & Questions section** with replies and upvotes.

3. **Scholarship Directory (`/scholarships`) & Detail Pages (`/scholarships/:id`)**:
   - Multi-faceted filtering by study destination, education level (High school, Undergraduate), funding type (Fully funded, Partially funded), boarding availability, nationality, and keywords.
   - Dynamic deadline badges (*"Closing soon"*, *"Open"*, *"Deadline passed"* calculated relative to the current date).
   - Numbered 5-step application process and verified provider portal links.
   - **Student Discussion & Q&A section** for application tips, essay advice, and peer support.

4. **Extracurricular Opportunities (`/opportunities`)**:
   - Pre-university summer academies, international olympiads, youth conferences, internships, and fellowships.
   - **Interactive Discussion modal** on every opportunity card for peer Q&A and preparation tips.

5. **Community Discussions Hub (`/discussions`)**:
   - Central forum for student questions and mentor advice across all categories (Careers, Scholarships, Opportunities, General Q&A).
   - Search questions, filter by topic, and like/reply to student discussions.

6. **Interactive Career Quiz (`/career-quiz`)**:
   - Multi-step questionnaire assessing interests, favorite school subjects, working style, creativity, leadership, and problem-solving.
   - Transparent scoring algorithm displaying matching categories with % alignment.

7. **Personal Eligibility Matcher (`/matches`)**:
   - Students configure age, nationality, current grade, and study preferences.
   - Eligibility algorithm details why a scholarship matches.

8. **Student Dashboard (`/dashboard`)**:
   - Welcome banner, saved scholarships, active application milestones, recommended careers, and upcoming deadlines.

9. **Saved Scholarships (`/saved`)**:
   - Bookmarked opportunities with customizable personal notes and application statuses (`Interested`, `Preparing`, `Applied`, `Interview`, `Accepted`, `Rejected`).

10. **Application Tracker (`/applications`)**:
    - Track application deadlines, submission dates, notes, and interactive document readiness checklists.

11. **Admin Dashboard (`/admin`)**:
    - Full CRUD management for scholarships, careers, opportunities, and user accounts.

12. **Student Authentication & Profile (`/login`, `/register`, `/forgot-password`, `/profile`)**:
    - Secure sign-in (`admin@fyndora.org`, `selam.haile@fyndora.org`), registration, profile management.

13. **AI Student Mentor (Floating & Expandable Intelligent Chatbot)**:
    - **Global Floating Launcher**: Accessible across all pages on desktop, tablet, and mobile with keyboard shortcut (`Ctrl+/` or `Cmd+/`).
    - **Context Awareness**: Automatically detects current route and page context (e.g. Harvard University profile, Software Engineering career, Mastercard Foundation scholarship) and contextualizes guidance.
    - **Personalization**: Configurable student profile (preferred name, country, grade, academic interests, career goals, weekly available time, financial circumstances) that adapts guidance without repetitive questioning.
    - **Personalized Roadmaps**: Generates realistic weekly, monthly, and multi-year preparation schedules tailored to student grade level and budget.
    - **Ethical Guidance & Trustworthiness**: Strictly adheres to verified data and ethical college guidance principles; never guarantees admission or fabricates scholarships/deadlines.
    - **Modular AI Backend**: Built with OpenAI API integration support + a rich built-in offline intelligence mentor engine with MySQL-backed session persistence.

---

## 🛠 Tech Stack

- **Frontend**:
  - React 19 + Vite
  - React Router v7
  - Tailwind CSS + `@tailwindcss/vite`
  - Lucide React Icons
  - Mobile-responsive design tested across 1440px, 1024px, 768px, and 390px.

- **Backend & Database**:
  - Node.js & Express.js REST API
  - **MAMP MySQL Database** (`pathfinder`)
  - `mysql2/promise` with connection pooling
  - JSON Web Tokens (JWT) & bcrypt password hashing
  - dotenv & cors

---

## 📁 Project Structure

```
/client                      # React frontend
  /src
    /components              # Reusable UI (Cards, Badges, Modals, Navbar, Footer)
    /context                 # AuthContext and ToastContext
    /data                    # Mock & fallback verified datasets
    /pages                   # All application views
    /services                # Centralized API service
/server                      # Express REST API backend
  /config                    # MAMP MySQL Database connection (mampDb.js)
  /routes                    # REST API Route Handlers (auth, careers, scholarships, opportunities, users, applications)
  /middleware                # JWT Auth, Admin Authorization, Error Handling
  /data                      # Seeding definitions
  /scripts                   # MAMP MySQL Seeding script (seedMamp.js)
  server.js                  # Express entry point
```

---

## 🗄️ MAMP MySQL Database Configuration

The backend is connected to your local **MAMP** MySQL database:

- **Host**: `localhost` / `127.0.0.1`
- **Port**: `3306`
- **User**: `root`
- **Password**: `root`
- **Database**: `pathfinder`
- **Tables created**:
  - `users`
  - `careers`
  - `scholarships`
  - `opportunities`
  - `saved_scholarships`
  - `applications`
  - `comments`
  - `universities`
  - `mentor_journeys`
  - `chat_conversations` (New: AI Chatbot session persistence)
  - `chat_messages` (New: AI Chatbot messages & metadata)
  - `chat_student_profiles` (New: Personalization preferences)

### 🤖 AI Student Mentor Configuration (`server/.env`)

```env
# AI Model Configuration
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1

# Optional: Add your live OpenAI API key for real-time model completions.
# If left blank, Fyndora automatically uses its rich, built-in intelligent
# mentorship engine with verified platform guidance!
OPENAI_API_KEY=
```

### View in phpMyAdmin:
Open your browser and navigate to:
👉 **`http://localhost/phpmyadmin/`** or through the MAMP Control Panel to view the `pathfinder` database.

---

## 🚀 Running the Full-Stack Application

### 1. Start Both Frontend and Backend

From the project root:

**In Terminal 1 (Frontend):**
```powershell
npm.cmd run dev
```
Runs at: **`http://localhost:5173`**

**In Terminal 2 (Backend API):**
```powershell
npm.cmd run server
```
Runs at: **`http://localhost:5000`**

---

## 🔑 Demo Accounts in MAMP MySQL

- **Admin Account**:
  - **Email**: `admin@pathfinder.org`
  - **Password**: `admin12345`
  - Access: Full CRUD permissions in `/admin`.
- **Student Account**:
  - **Email**: `selam.haile@pathfinder.org`
  - **Password**: `student12345`
  - Grade: Grade 11, Ethiopia
