# 🚀 java-dsa-tracker

> **An AI-Powered Java & Data Structures & Algorithms (DSA) Adaptive Learning Platform, Study Roadmap Planner, and Spaced Repetition System.**

![Version](https://img.shields.io/badge/version-1.0.0-orange.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini_AI-2.5_%7C_3.6-8E75B2?style=for-the-badge&logo=googlecloud&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Offline First](https://img.shields.io/badge/Offline--First-LocalStorage-success?style=for-the-badge)
![Last Updated](https://img.shields.io/badge/last_updated-July_2026-informational.svg?style=for-the-badge)

---

## 📋 Table of Contents

- [📌 Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🖼️ Application Screenshots](#️-application-screenshots)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Folder Structure](#-folder-structure)
- [⚡ Quick Start & Installation Guide](#-quick-start--installation-guide)
- [🔑 Environment Variables & API Key Configuration](#-environment-variables--api-key-configuration)
- [📖 Detailed User Guide & Workflow](#-detailed-user-guide--workflow)
- [🤖 AI Mentor Architecture & Prompt Engineering](#-ai-mentor-architecture--prompt-engineering)
- [🚀 Performance Optimizations](#-performance-optimizations)
- [🔒 Security & Data Privacy](#-security--data-privacy)
- [📱 Mobile & Responsive Support](#-mobile--responsive-support)
- [🌐 Browser Compatibility](#-browser-compatibility)
- [🔮 Future Roadmap](#-future-roadmap)
- [⚠️ Known Limitations](#️-known-limitations)
- [🤝 Contributing Guide](#-contributing-guide)
- [📜 License](#-license)
- [❓ Frequently Asked Questions (FAQ)](#-frequently-asked-questions-faq)
- [🛠️ Troubleshooting Guide](#️-troubleshooting-guide)
- [🙏 Credits & Acknowledgements](#-credits--acknowledgements)
- [📬 Contact & Author](#-contact--author)

---

## 📌 Project Overview

### What is `java-dsa-tracker`?
`java-dsa-tracker` is a comprehensive, full-stack web application designed to help developers, computer science students, and interview candidates systematically master **Java, Data Structures, and Algorithms**. 

Unlike generic course platforms or static problem lists, `java-dsa-tracker` combines **adaptive algorithmic scheduling**, **spaced repetition memory science**, and **Google Gemini AI guidance** to deliver an individualized study journey tailored to your deadline and daily study hours.

### Why Does It Exist?
Preparing for technical coding interviews (LeetCode, placement exams, software engineering roles) is notoriously difficult due to:
1. **Unstructured Learning Curves**: Jumping straight into hard graph or DP problems without solid Java OOP & Collections fundamentals.
2. **Forgetting Curves**: Reviewing a topic once and forgetting key edge cases or Big-O complexities 3 weeks later.
3. **Rigid Schedule Failure**: Falling behind by a few days and abandoning the entire study plan because static schedules don't auto-adjust.
4. **Vague AI Feedback**: Relying on raw chat LLMs that provide generic, non-compilable code snippets or lack DSA-specific pedagogical structure.

`java-dsa-tracker` solves all of these problems in a single, privacy-focused, offline-first dashboard.

---

## ✨ Key Features

### 1. 🗓️ Dynamic Adaptive Roadmap Generator
- **Customizable Duration**: Select 30-day crash courses, 60-day interview prep, 90-day mastery, or custom target dates.
- **Intelligent Pacing**: Adjust daily study hours (1h Light, 2h Balanced, 4h Intensive) with automatic daily topic allocation.
- **Auto-Carry Forward**: Skipped or incomplete days automatically reschedule remaining topics without breaking future deadlines.

### 2. 📚 Comprehensive Syllabus Explorer
- **8 Core Categories**: Java Basics, Object-Oriented Programming (OOP), Collections Framework, Basic DSA, Linear Data Structures, Non-Linear Data Structures, Algorithms, and Advanced DSA.
- **Prerequisite Validation**: Dynamic visual dependency trees ensuring prerequisite topics (e.g. Arrays → Two Pointers → Sliding Window) are mastered in order.
- **Compilable Blueprints**: Built-in Java code snippets, interview tips, formulas, and mastery state management (*Reading*, *Understood*, *Practiced*, *Mastered*).

### 3. 🎯 Interactive Practice Arena
- **Curated Problem Sets**: Filter problems by topic, difficulty (Easy, Medium, Hard), and status (*Unsolved*, *Solved*, *Revision*).
- **Direct Platform Links**: Deep link integrations to LeetCode, GeeksforGeeks, and syllabus problems.
- **Solution Notes & Hints**: Store custom Java code solutions, time taken in minutes, attempt history, and personal notes.

### 4. 🧠 SM-2 Spaced Repetition Revision Queue
- **Automated Memory Audit**: Flags weak topics based on last studied date, review count, and difficulty rating.
- **Priority Categorization**: Ranks upcoming revisions into *High*, *Medium*, and *Low* priority queues.
- **Retention Guard**: Prevents knowledge decay right before campus placements or technical interviews.

### 5. 🤖 5-in-1 Google Gemini AI Mentor System
Connect your own Google Gemini API Key in Settings to unlock 5 dedicated AI modules:
- **Conversational Mentor**: General-purpose Java & DSA tutor for broad doubts, JVM memory internals (Stack vs Heap, Metaspace, GC), and code syntax walkthroughs.
- **Concept Comparer**: Technical comparison engine generating side-by-side matrices (e.g. `ArrayList` vs `LinkedList`, `HashMap` vs `TreeMap`) evaluating operational Big-O bounds, JVM pointer overhead, and CPU cache locality.
- **Smart Notes Generator**: Produces pristine study notes blueprints with core definitions, real-world analogies, compilable Java templates, and exam checklists.
- **Practice Guide & Hints**: Step-by-step problem guide offering pattern recognition, progressive clues (Hint 1, 2, 3), Floyd's cycle detection strategies, and compilable code skeletons.
- **CS Architecture Advisor**: Strategic planner for node architectures, graph state traversals, and multi-week study roadmaps.

### 6. 📊 Recharts Analytics & Progress Dashboard
- **Visual Velocity Metrics**: Weekly study hours, completion percentages, solved problem counters, and category mastery radars.
- **Streak Tracking**: Displays current study streaks and longest active streaks to maintain motivation.
- **Calendar Heatmap**: Visual calendar mapping daily completion history (*Completed*, *Skipped*, *Partial*).

### 7. 💾 Offline-First Architecture & Sync Engine
- **Local Storage Supremacy**: 100% functional offline without mandatory cloud sign-ins.
- **JSON Backup Import/Export**: Export full user profiles, roadmap progress, notes, and problem statuses into encrypted JSON backups.
- **Simulated Multi-Device Sync**: Inspect trusted devices, sync states, and local backup integrity.

---

## 🖼️ Application Screenshots

> *Note: Place your screenshot images inside the `/public/screenshots/` directory.*

| View | Screenshot Placeholder |
| :--- | :--- |
| **Dashboard** | `![Dashboard](/screenshots/dashboard.png)` |
| **AI Mentor (Conversational)** | `![AI Mentor](/screenshots/ai_mentor.png)` |
| **Concept Comparer** | `![Concept Comparer](/screenshots/concept_comparer.png)` |
| **Syllabus Explorer** | `![Syllabus Explorer](/screenshots/syllabus.png)` |
| **Spaced Repetition Queue** | `![Revision Queue](/screenshots/revision_queue.png)` |
| **Analytics & Heatmap** | `![Analytics](/screenshots/analytics.png)` |
| **Settings & API Config** | `![Settings](/screenshots/settings.png)` |

---

## 🛠️ Tech Stack

### Frontend Core
- **Framework**: [React 19.0](https://react.dev/) (Functional components, custom hooks, static imports for zero view layout thrashing)
- **Language**: [TypeScript 5.8](https://www.typescriptlang.org/) (Strict type-checking, complete interface contracts)
- **State Management**: React `useState`, `useEffect`, `useRef`, custom local storage hooks, and sync services
- **Styling**: [Tailwind CSS v4.1](https://tailwindcss.com/) (Custom dark/light mode palette, glassmorphism, responsive grid layouts)
- **Icons**: [Lucide React v0.546](https://lucide.dev/) (Modern vector icons)
- **Charts & Data Visualization**: [Recharts v3.9](https://recharts.org/) (Responsive bar, area, pie, and radar charts)
- **Animations**: [Motion v12.23](https://motion.dev/) (Smooth page transitions, modal slides, micro-interactions)

### Backend & Server Infrastructure
- **Server Environment**: [Node.js](https://nodejs.org/) with [Express v4.21](https://expressjs.com/)
- **Execution & Bundling**: [`tsx`](https://github.com/privatenumber/tsx) (Dev server), [`esbuild`](https://esbuild.github.io/) (Production CJS bundle compilation)
- **Dev & Build Tooling**: [Vite v6.2](https://vitejs.dev/)

### Artificial Intelligence
- **SDK**: [`@google/genai` v2.4](https://www.npmjs.com/package/@google/genai)
- **Model Cascade**: Google Gemini 2.5 Flash, Gemini 3.6 Flash, Gemini 3.5 Flash, Gemini Flash Latest, Gemini Flash Lite Latest, Gemini 2.0 Flash
- **API Key Security**: Per-user client-side header pass-through (`X-Gemini-API-Key`) with offline domain knowledge fallbacks

### Mobile & Cross-Platform
- **Framework**: [Capacitor v8.4 Core & Android](https://capacitorjs.com/)

---

## 📁 Folder Structure

```text
java-dsa-tracker/
├── .env                       # Local environment configuration
├── .gitignore                 # Excluded git tracking rules
├── DSC.bat                    # Windows rapid launcher batch script
├── capacitor.config.json      # Capacitor cross-platform configuration
├── index.html                 # HTML5 entry point with Google Fonts
├── package.json               # NPM dependencies, scripts, and engine specs
├── README.md                  # Comprehensive GitHub documentation
├── server.ts                  # Express backend & Gemini AI API proxy server
├── tsconfig.json              # TypeScript compiler configuration
├── tsconfig.node.json         # Node-specific TypeScript rules
├── vite.config.ts             # Vite build & dev server plugin config
├── android/                   # Capacitor Android native studio project files
├── public/                    # Static assets & public icons
└── src/
    ├── App.tsx                # Main view router, global state & theme controller
    ├── index.css              # Custom scrollbars, font imports & Tailwind directives
    ├── main.tsx               # React DOM root entry point
    ├── types.ts               # Complete TypeScript interfaces & domain models
    ├── components/
    │   ├── AIMentorView.tsx       # 5-in-1 AI Mentor interface with custom Markdown renderer
    │   ├── AnalyticsView.tsx      # Recharts velocity, streak & category radar charts
    │   ├── CalendarView.tsx       # Daily visual planner heatmap & schedule inspector
    │   ├── Dashboard.tsx          # Main high-level overview, quick actions & metrics
    │   ├── ErrorBoundary.tsx      # React error boundary catching view render errors
    │   ├── HistoryView.tsx        # Activity audit log & historical completion records
    │   ├── OnboardingWizard.tsx   # Initial setup modal for track, duration & daily goals
    │   ├── ProblemsView.tsx       # LeetCode/GFG problem arena & code solution logger
    │   ├── RecommendationsView.tsx# Smart AI recommendations & weak area suggestions
    │   ├── RevisionView.tsx       # SM-2 Spaced repetition priority queue manager
    │   ├── RoadmapView.tsx        # Dynamic daily timeline & topic completion toggle
    │   ├── SettingsView.tsx       # Gemini API key connection, data export/import & theme settings
    │   ├── Sidebar.tsx            # Responsive navigation drawer & syllabus progress indicator
    │   └── TopicsView.tsx         # Syllabus Explorer, category filters & compilable code templates
    ├── data/
    │   ├── initialData.ts         # Pre-populated Java DSA syllabus topics & metadata
    │   ├── programsData.ts        # Compilable Java programs catalog & solution code
    │   ├── syllabusContent.ts     # Deep explanations, formulas & interview tips
    │   └── thingsToLearn.ts       # Essential Java concept cheat sheets
    └── lib/
        ├── api.ts             # API client helper, header injection & local key storage
        └── syncService.ts     # Backup JSON export/import & sync engine simulations
```

---

## ⚡ Quick Start & Installation Guide

Follow these steps to run `java-dsa-tracker` locally on your machine.

### 📋 Prerequisites
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **NPM**: `v9.0.0` or higher (Bundled with Node.js)
- **Git**: Installed on your system ([Download Git](https://git-scm.com/))
- **Google Gemini API Key**: Optional, but required to use live AI features ([Get Free Key](https://aistudio.google.com/app/apikey))

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/java-dsa-tracker.git
cd java-dsa-tracker
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables (Optional)
Create a `.env` file in the project root:
```bash
cp .env.example .env
```
Add your optional server fallback API key to `.env`:
```env
PORT=3000
GEMINI_API_KEY=your_optional_gemini_api_key_here
```

### Step 4: Run the Development Server
```bash
npm run dev
```
The application will launch automatically at:
👉 `http://localhost:3000/`

---

### 📦 Production Build & Execution

To test the compiled production-ready bundle:
```bash
# 1. Typecheck TypeScript
npm run lint

# 2. Build Frontend & Express Server
npm run build

# 3. Start Production Node Server
npm start
```

---

## 🔑 Environment Variables & API Key Configuration

`java-dsa-tracker` uses a dual-layer security model for Google Gemini API key handling:

### 1. User-Level Connection (Recommended)
You do **NOT** need to configure backend environment variables to use AI features! 
1. Open the application at `http://localhost:3000/`.
2. Navigate to **Settings** → **Gemini API Key**.
3. Paste your Gemini API Key (`AQ...` or `AIza...`).
4. Click **Save Key**. The app will test the connection and display a green **Status Connected** badge.
5. Your key is stored strictly in your browser's private `localStorage` and sent directly to the local server proxy via custom header `X-Gemini-API-Key`.

### 2. Server-Level Fallback Key (Optional for Maintainers)
If you deploy this app for a team or shared environment, you can specify a default server key in `.env`:
```env
PORT=3000
GEMINI_API_KEY=AIzaSy...YourServerKeyHere
```

---

## 📖 Detailed User Guide & Workflow

### 1. Initial Setup (Onboarding)
Upon launching the application for the first time, the **Onboarding Wizard** will guide you through customizing your learning track:
- **Track**: `Java + DSA`
- **Target Deadline**: 30 Days (Crash Course), 60 Days (Balanced), 90 Days (Mastery), or Custom Date.
- **Daily Hours Goal**: 1 Hour (Light), 2 Hours (Balanced), or 4 Hours (Intensive).
- **Current Level**: Complete Beginner, Intermediate, or Placement Candidate.

### 2. Daily Roadmap Execution
- Open **Study Roadmap** to view today's assigned topic and problem quotas.
- Mark topics as *Completed* as you finish reading them.
- If you miss a day, click **Re-adjust Schedule** to redistribute pending topics smoothly over remaining days.

### 3. Syllabus & Program Mastery
- Open **Syllabus Explorer** to browse Java Basics, OOP, Collections, Trees, Graphs, and DP.
- Click any topic to view its detailed breakdown, interview traps, Big-O formulas, and compilable Java code blueprints.

### 4. Leveraging the AI Mentor
- Open **AI Mentor** from the sidebar menu.
- **Conversational Mentor**: Type queries like *"Explain Java HashMap internal collision resolution with LinkedList vs Red-Black Tree."*
- **Concept Comparer**: Select `ArrayList` and `LinkedList`, then click **Analyze Differences** to receive a side-by-side Big-O and memory layout comparison report.
- **Smart Notes Generator**: Select `Binary Search Trees` and click **Generate Template** to generate a complete study sheet.
- **Practice Guide & Hints**: Select `Linked List Cycle Detection` and click **Ask Hints** to view progressive clues and Floyd's cycle detection code.

### 5. Managing Spaced Repetition Revisions
- Check **Revision Queue** daily. Topics marked as *Revision Due* will appear in order of priority (*High*, *Medium*, *Low*).
- Complete a quick review and mark the topic as *Mastered* to update its retention interval.

---

## 🚀 Performance Optimizations

1. **Static View Routing**: Replaced dynamic `React.lazy()` chunking with static component imports in `src/App.tsx`, eliminating layout flash and state destruction during rapid navigation.
2. **Local Memory Caching**: Custom hooks cache roadmap states and local settings in browser `localStorage`, ensuring instantaneous load times ($< 50\text{ms}$).
3. **Custom Markdown & Math Engine**: Pure React inline regex parser (`parseMarkdownToReact`) replaces heavy external Markdown AST libraries, formatting LaTeX expressions ($\times$, $\le$, $O(N)$) with minimal runtime overhead.
4. **Debounced API Execution**: Prevents concurrent duplicate AI requests when switching tabs or submitting queries quickly.

---

## 🔒 Security & Data Privacy

- **Client-Side Key Ownership**: Your Gemini API key is stored strictly in your local browser storage (`localStorage.gemini_api_key`) and passed to the backend via encrypted HTTPS/HTTP headers. It is **never stored on disk** or logged in server console output.
- **Zero Third-Party Tracking**: `java-dsa-tracker` contains zero invasive analytics scripts, tracking pixels, or third-party cookies.
- **CORS Protection**: Express backend headers strictly constrain allowed headers (`X-Gemini-API-Key`, `Authorization`).

---

## 📱 Mobile & Responsive Support

`java-dsa-tracker` is built with responsive mobile-first Tailwind design:
- **Desktop / Laptops**: Full split-pane view with persistent sidebar navigation and high-density analytics cards.
- **Tablets**: Auto-collapsing sidebar drawer with touch-friendly tap targets.
- **Mobile Browsers & Android**: Fully compatible with Capacitor Android webview (`@capacitor/android`), providing native touch scrolling and floating menu toggles.

---

## 🌐 Browser Compatibility

| Browser | Version | Compatibility |
| :--- | :--- | :--- |
| **Google Chrome** | v100+ | ✅ Fully Supported |
| **Mozilla Firefox** | v100+ | ✅ Fully Supported |
| **Microsoft Edge** | v100+ | ✅ Fully Supported |
| **Apple Safari** | v15+ | ✅ Fully Supported |
| **Brave / Opera** | Latest | ✅ Fully Supported |

---

## 🔮 Future Roadmap

- [ ] **Interactive Java Code Runner**: In-browser WebAssembly (Wasm) or Judge0 sandbox integration for compiling Java code live.
- [ ] **Custom Topic Creator**: Ability for users to add custom engineering modules (e.g. System Design, SQL, Spring Boot).
- [ ] **Multi-Language Support**: Expand syllabus tracks to Python, C++, and Go.
- [ ] **Cloud Backup Sync**: Optional Firebase/Supabase user auth and encrypted cloud progress backup.
- [ ] **LeetCode Sync Extension**: Chrome Extension to automatically sync solved LeetCode problems into `java-dsa-tracker`.

---

## ⚠️ Known Limitations

- **Google AI Studio Free Tier Quota**: Free-tier Gemini API keys (`AQ...`) have a limit of 15 requests per minute and 20 requests per day per specific model. The app automatically cascades to alternate Gemini models if quota limits are encountered.
- **Offline Code Execution**: The app displays compilable Java code templates, but does not currently include a native local Java compiler binary.

---

## 🤝 Contributing Guide

Contributions are welcome! Follow these steps to contribute to `java-dsa-tracker`:

### 1. Branch Naming Conventions
- `feature/feature-name` (for new features)
- `bugfix/issue-description` (for bug fixes)
- `docs/readme-update` (for documentation updates)

### 2. Pull Request Process
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: Add dynamic progress badge'`).
4. Ensure TypeScript typecheck passes cleanly (`npm run lint`).
5. Push to the branch (`git push origin feature/amazing-feature`).
6. Open a detailed Pull Request explaining your changes.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

```text
MIT License

Copyright (c) 2026 Sri Aravind / java-dsa-tracker Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## ❓ Frequently Asked Questions (FAQ)

1. **Do I need to pay for a Gemini API Key?**  
   No! Google AI Studio provides a free-tier Gemini API key with generous daily quotas. You can generate a free key at [aistudio.google.com](https://aistudio.google.com/app/apikey).

2. **Is my API key saved securely?**  
   Yes. Your API key is stored only in your private browser `localStorage` and passed to your local server over HTTP headers. It is never transmitted to external servers other than official Google Gemini endpoints.

3. **Can I use this application completely offline?**  
   Yes! All core features (Roadmap tracking, Syllabus Explorer, Practice Arena, Revision Queue, and Recharts Analytics) function 100% offline. Only live AI Mentor responses require an active internet connection.

4. **What happens if I miss a few days of my study roadmap?**  
   The app includes an automatic carry-forward engine. Click "Re-adjust Schedule" on the Study Roadmap page, and all uncompleted topics will be dynamically redistributed across your remaining target days.

5. **How do I back up my study progress?**  
   Navigate to **Settings** → **Data Management** → **Export Backup JSON**. You can save your progress file and restore it anytime using **Import Backup JSON**.

6. **What version of Java does the syllabus focus on?**  
   The syllabus covers Java 17+ and Java 21 LTS features, object-oriented principles, JVM memory management, and modern Collections Framework implementations.

7. **How are Spaced Repetition revisions calculated?**  
   Revisions are calculated based on your last studied date, review count, and topic difficulty rating using an SM-2 inspired spacing algorithm.

8. **Can I run this on my Android phone?**  
   Yes! The repository includes built-in Capacitor Android configuration (`@capacitor/android`). You can open the project in Android Studio and build an APK directly.

9. **Which AI models does the app use?**  
   The app cascades through Google Gemini 2.5 Flash, Gemini 3.6 Flash, Gemini 3.5 Flash, Gemini Flash Latest, Gemini Flash Lite Latest, and Gemini 2.0 Flash.

10. **How do I report a bug or feature request?**  
    Please open an issue on the official GitHub repository under the Issues tab.

11. **Can I change my target study goal after starting?**  
    Yes! Go to Settings → Learning Profile to adjust your target date, daily hours goal, or learning pace anytime.

12. **Are LeetCode and GeeksforGeeks problems included?**  
    Yes! The Practice Arena contains curated problems with direct links to LeetCode and GeeksforGeeks.

13. **How does the Concept Comparer work?**  
    It takes two Java/DSA concepts (e.g. `HashMap` vs `Hashtable`) and compiles a detailed markdown report analyzing Big-O time complexity, thread safety, null key support, and memory layout.

14. **Why are static imports used instead of React.lazy()?**  
    Static imports ensure instantaneous view switching without component unmounting or white layout flashes during navigation.

15. **Is Tailwind CSS v4 supported?**  
    Yes! The project uses Tailwind CSS v4 configured via `@tailwindcss/vite`.

16. **What port does the Express server run on?**  
    By default, the server runs on port `3000`. You can change this by modifying the `PORT` variable in `.env`.

17. **How does the offline AI fallback work?**  
    If the Gemini API encounters rate limits or offline network states, `server.ts` uses prompt keyword parsing to generate an offline Computer Science solution breakdown.

18. **Can I add my own problems to the Practice Arena?**  
    Yes! You can bookmark, add custom solution notes, and record time taken for any practice problem.

19. **How do I reset my progress to start over?**  
    Go to Settings → Danger Zone → Reset All Data to clear your local storage and launch the Onboarding Wizard.

20. **Is `java-dsa-tracker` free and open source?**  
    Yes! It is 100% free and open-source under the MIT License.

---

## 🛠️ Troubleshooting Guide

### 1. Server Fails to Start (Port 3000 Already in Use)
**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`  
**Solution**:
- On Windows: `npx kill-port 3000`
- On Linux/macOS: `fuser -k 3000/tcp` or `kill -9 $(lsof -t -i:3000)`

### 2. Gemini API Return 429 Quota Error
**Problem**: `Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests`  
**Solution**:
The app automatically cascades to alternate models (`gemini-3.6-flash`, `gemini-3.5-flash`). If all daily free quotas are exhausted, wait for the 24-hour cycle reset or enter a new key in Settings.

### 3. TypeScript Typecheck Error (`npx tsc --noEmit`)
**Problem**: `Cannot find module '@google/genai'`  
**Solution**: Run `npm install` to ensure all type definitions and dependencies are installed.

---

## 🙏 Credits & Acknowledgements

- **Google DeepMind & AI Studio** for the Gemini API and `@google/genai` SDK.
- **Lucide Icons** for clean UI icons.
- **Recharts Team** for responsive data visualization components.
- **Tailwind CSS Team** for the styling framework.
- **LeetCode & GeeksforGeeks** for algorithmic problem references.

---

## 📬 Contact & Author

- **Author**: Sri Aravind
- **GitHub**: [@your-username](https://github.com/your-username)
- **LinkedIn**: [Sri Aravind on LinkedIn](https://linkedin.com/in/your-profile)
- **Project Link**: [https://github.com/your-username/java-dsa-tracker](https://github.com/your-username/java-dsa-tracker)

---

### ⭐ Star the Repository!
If you found `java-dsa-tracker` helpful for your Java DSA journey or interview preparation, please consider giving this repository a **Star** ⭐️! It helps other students discover the project.
