/**
 * Srishanth Gunday — Software Engineering Portfolio
 * Architecture Inspector, Project Filtering, Accessible Navigation & Contact Validation
 */

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("js-ready");
  initNavigation();
  initScrollReveal();
  initProjectFiltering();
  initProjectModal();
  initContactForm();
});

/* ==========================================================================
   Subtle Scroll Reveal via IntersectionObserver
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   Navigation, Responsive Drawer & Scroll Spy
   ========================================================================== */
function initNavigation() {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("primary-nav");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  function updateMobileMenuState(isOpen) {
    if (!menuToggle || !navMenu) return;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      navMenu.classList.add("open");
      navMenu.removeAttribute("aria-hidden");
      navMenu.removeAttribute("inert");
    } else {
      navMenu.classList.remove("open");
      if (window.innerWidth <= 850) {
        navMenu.setAttribute("aria-hidden", "true");
        navMenu.setAttribute("inert", "");
      } else {
        navMenu.removeAttribute("aria-hidden");
        navMenu.removeAttribute("inert");
      }
    }
  }

  // Handle window resize to avoid inert states on desktop view
  window.addEventListener("resize", () => {
    if (window.innerWidth > 850 && navMenu) {
      navMenu.removeAttribute("aria-hidden");
      navMenu.removeAttribute("inert");
      navMenu.classList.remove("open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    } else if (window.innerWidth <= 850 && navMenu && !navMenu.classList.contains("open")) {
      navMenu.setAttribute("aria-hidden", "true");
      navMenu.setAttribute("inert", "");
    }
  });

  // Initial setup for current viewport
  if (window.innerWidth <= 850 && navMenu) {
    navMenu.setAttribute("aria-hidden", "true");
    navMenu.setAttribute("inert", "");
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isCurrentlyOpen = navMenu.classList.contains("open");
      updateMobileMenuState(!isCurrentlyOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 850) {
          updateMobileMenuState(false);
          menuToggle.focus();
        }
      });
    });
  }

  // Active section scroll spy via IntersectionObserver
  const sectionIds = ["hero", "projects", "experience", "skills", "about", "education", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        const target = link.getAttribute("href")?.replace("#", "");
        link.classList.toggle("active", target === visible.target.id);
      });
    },
    { rootMargin: "-20% 0px -60% 0px", threshold: [0.1, 0.3, 0.6] }
  );

  sections.forEach((sec) => observer.observe(sec));
}

/* ==========================================================================
   Project Category Filtering
   ========================================================================== */
function initProjectFiltering() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const secondaryDivider = document.querySelector(".secondary-projects-header");

  // Dynamically compute and display filter counts from actual DOM cards
  function updateFilterCounts() {
    filterButtons.forEach((btn) => {
      const filter = btn.getAttribute("data-filter");
      let count = 0;
      if (filter === "all") {
        count = projectCards.length;
      } else {
        projectCards.forEach((card) => {
          const categories = (card.getAttribute("data-category") || "").split(" ");
          if (categories.includes(filter)) count++;
        });
      }
      const countSpan = btn.querySelector(".count");
      if (countSpan) countSpan.textContent = `(${count})`;
    });
  }

  updateFilterCounts();

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      let visibleSecondaryCount = 0;

      projectCards.forEach((card) => {
        const categories = (card.getAttribute("data-category") || "").split(" ");
        const isMatch = filter === "all" || categories.includes(filter);

        if (isMatch) {
          card.style.display = "flex";
          card.removeAttribute("aria-hidden");
          card.removeAttribute("inert");
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 10);

          const cardId = card.getAttribute("data-id");
          if (cardId === "jd-analyst" || cardId === "hr-interviewer") {
            visibleSecondaryCount++;
          }
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(8px)";
          card.style.display = "none";
          card.setAttribute("aria-hidden", "true");
          card.setAttribute("inert", "");
        }
      });

      // Show secondary heading only when secondary cards are visible
      if (secondaryDivider) {
        if (visibleSecondaryCount > 0) {
          secondaryDivider.style.display = "flex";
          secondaryDivider.removeAttribute("aria-hidden");
        } else {
          secondaryDivider.style.display = "none";
          secondaryDivider.setAttribute("aria-hidden", "true");
        }
      }
    });
  });
}

/* ==========================================================================
   Project Dossiers Data (Strictly Verified Claims & Factual Architecture)
   ========================================================================== */
const PROJECT_DOSSIERS = {
  "lucky-exotica": {
    title: "Lucky Exotica — Full-Stack Booking Platform",
    category: "Full Stack • Booking Platform",
    status: "Full-Stack Project • Vercel Deployment",
    tagline: "Vacation rental booking application with calendar availability checking, administrative property management, and PostgreSQL data persistence.",
    problemAndContext: `
      Vacation rental properties require a dependable reservation interface where guests can view live property details,
      verify available dates on a calendar, and submit bookings without conflicting reservations. Property administrators
      need an internal view to manage property details, review guest feedback, and inspect booking schedules.
    `,
    implementedFeatures: [
      "Built responsive React user interface with TypeScript for property listings, detail pages, and calendar date selection.",
      "Implemented pre-submission availability verification checking selected date intervals against reserved calendar dates in PostgreSQL.",
      "Modeled relational database tables in PostgreSQL via Supabase to store property attributes, booking requests, and guest reviews.",
      "Configured Supabase authentication flows separating administrative property updates from public guest booking requests.",
      "Configured automated deployments via GitHub CI/CD integration with Vercel for web hosting."
    ],
    architectureDataFlow: `
      1. Host: Vercel CDN delivers static React and TypeScript client bundles to visitor browsers.
      2. Client Interface: Users interact with booking calendars, selecting requested check-in and check-out dates.
      3. Availability Check: Client calls Supabase API to query existing booking intervals for conflicts on selected dates.
      4. Reservation Submission: Validated booking payloads are written to the PostgreSQL database with status tracking.
      5. Admin Controls: Authenticated administrators access views to update property data and manage guest reviews.
    `,
    technicalDecisions: [
      "Supabase & PostgreSQL: Selected for relational database schema linking property IDs, booking time intervals, and reviews with foreign key integrity.",
      "TypeScript Interface Definitions: Provides static type checking across booking state, calendar parameters, and property objects.",
      "Vercel Deployment: Chosen for straightforward static hosting and automatic GitHub pull request deployments."
    ],
    challengesAndTradeoffs: [
      "Pre-Check vs Distributed Locks: Date availability is checked prior to booking submission rather than relying on distributed transactional locks.",
      "Offline Capability: Because availability is verified against the database, the booking workflow requires an active network connection."
    ],
    testingAndLimitations: [
      "Tested manually across date selection workflows, form validations, and admin dashboard updates.",
      "Current Scope: The booking system validates dates and records reservation requests; automated payment gateway processing and automated SMS notifications are planned for future iterations.",
      "Deployment Status: Project is developed as a client application. Repository is private."
    ],
    links: {
      type: "private",
      label: "Private Client Repository",
      notice: "Client repository is private. Live demo link pending deployment confirmation."
    }
  },

  "student-portal": {
    title: "Cloud-Based Student Portal",
    category: "Backend & Cloud • Java / Spring Boot",
    status: "Coursework / Cloud Project • Open Source",
    tagline: "Academic records and course management platform built with Java Spring Boot RESTful services, MySQL database, and AWS cloud distribution.",
    problemAndContext: `
      Universities require organized systems to maintain student academic records, department catalogs, and course enrollment workflows.
      The objective was to build a clean backend service layer in Java with Spring Boot, structured relational persistence in MySQL,
      and an integrated React user interface supported by cloud infrastructure.
    `,
    implementedFeatures: [
      "Developed backend REST API controllers and service components in Java using Spring Boot for university data workflows.",
      "Designed normalized MySQL relational database schema for student profiles, course registrations, and department data.",
      "Built clean JSON-based request and response contracts for frontend integration with React.js.",
      "Integrated authentication logic for secure access to student profiles and academic records.",
      "Deployed application components leveraging AWS services including S3, Amplify, CloudFront, Lambda, and API Gateway."
    ],
    architectureDataFlow: `
      1. Client Interface: React single-page application hosted and delivered via AWS static distribution components (S3, Amplify, CloudFront).
      2. API Routing: Frontend dispatches HTTP requests to RESTful backend endpoints.
      3. Business Logic: Java Spring Boot service layer handles validation, student data manipulation, and enrollment workflows.
      4. Persistence: Spring Data accesses the MySQL relational database to read and update academic entities.
    `,
    technicalDecisions: [
      "Java & Spring Boot: Chosen for structured layered architecture (Controller -> Service -> Repository) and reliable REST API conventions.",
      "Decoupled Frontend & Backend: React interface communicates strictly through standard JSON REST APIs, allowing independent development and testing.",
      "MySQL Relational Storage: Relational database ensures referential integrity across student records, departments, and course enrollments."
    ],
    challengesAndTradeoffs: [
      "Synchronous Processing: Enrollment and record updates execute synchronously; high-volume batch processing would benefit from asynchronous queuing in future versions.",
      "Cloud Components: AWS Lambda and API Gateway are used alongside the Spring Boot service for cloud integration and static distribution."
    ],
    testingAndLimitations: [
      "Tested backend endpoints using Postman API collections to verify CRUD workflows, authentication checks, and database updates.",
      "Current Scope: Handles core university record operations; advanced features like automated degree audit planning remain in development.",
      "Open Source: Public repository available on GitHub."
    ],
    links: {
      type: "github",
      url: "https://github.com/Srishanth24/Vignan-Student-Portal-app",
      label: "View Repository on GitHub"
    }
  },

  "agentic-agency": {
    title: "AI Software Development Agency — Agentic AI System",
    category: "Agentic AI • Multi-Agent Graph",
    status: "Multi-Agent Workflow • LangGraph",
    tagline: "Coordinated multi-agent workflow in Python using LangGraph to convert natural-language software requirements into structured architecture and development plans.",
    problemAndContext: `
      Generating software development plans from natural-language descriptions often produces incomplete architectures or missed
      relational constraints when handled by a single prompt. This project organizes the planning process into discrete, specialized
      agent stages coordinated through a structured workflow.
    `,
    implementedFeatures: [
      "Constructed a multi-agent state graph using LangGraph in Python with conditional routing.",
      "Implemented specialized agent stages: requirement analysis, project classification, architecture design, backend planning, database schema drafting, and QA review.",
      "Engineered conditional workflow routing where plans are passed between stages based on project classification and review outcomes.",
      "Included a validation-oriented QA and review node to inspect generated specifications for inconsistencies before finalizing."
    ],
    architectureDataFlow: `
      1. Input: Natural-language software requirements are ingested by the workflow.
      2. Requirement Analysis: An analysis node extracts primary functional requirements and user roles.
      3. Project Classification: Routes workflow conditionally based on application type.
      4. Architecture & Design Nodes: Generate proposed technical stack, backend endpoints, and database schema drafts.
      5. QA & Review Node: Evaluates drafted specifications against requirements to highlight gaps or inconsistent fields.
      6. Output: Delivers a structured implementation blueprint with technical milestones.
    `,
    technicalDecisions: [
      "LangGraph State Machine: Chosen to enable conditional state transitions and routing between distinct agent nodes rather than a rigid linear pipeline.",
      "Specialized Agent Roles: Dividing tasks into analysis, architecture, backend, and QA keeps individual prompts focused and easier to debug.",
      "Dedicated Review Stage: Acts as an automated validation step to check that proposed database models align with API routes."
    ],
    challengesAndTradeoffs: [
      "Review Agent Limitations: The QA node uses language model evaluation to identify inconsistencies; it assists review but does not provide formal correctness proofs or compile code.",
      "Execution Latency: Sequential multi-agent passes require multiple model calls, trading speed for structured detail."
    ],
    testingAndLimitations: [
      "Evaluated across various software requirement prompts (e-commerce, task managers, booking APIs) to verify routing behavior and output consistency.",
      "Current Scope: Generates architectural specifications and development plans; does not autonomously write or deploy production code."
    ],
    links: {
      type: "notice",
      label: "Architecture Workflow",
      notice: "Multi-agent LangGraph architecture workflow. Source code available for review upon request."
    }
  },

  "legal-rag": {
    title: "Expert Legal Document Analyzer — RAG Application",
    category: "Generative AI • RAG Pipeline",
    status: "RAG Pipeline • Document Analysis",
    tagline: "Retrieval-Augmented Generation application for querying uploaded legal documents using Qdrant vector storage and context-grounded LLM responses.",
    problemAndContext: `
      Searching and interpreting dense legal contracts and statutory documents is challenging because key terms and clauses are
      often scattered across long files. This application builds a Retrieval-Augmented Generation (RAG) pipeline to index document
      passages and retrieve relevant sections for question answering.
    `,
    implementedFeatures: [
      "Built document parsing pipeline to ingest text and PDF files and divide them into recursive chunks with overlap.",
      "Generated high-dimensional dense vector embeddings using OpenAI embedding models.",
      "Indexed document vectors in a Qdrant vector database collection using cosine similarity search.",
      "Constructed prompt templates that supply retrieved document passages to the LLM to ground answers in source text.",
      "Added explicit guidance instructing the model to cite relevant excerpts and indicate when requested details are not present in the document."
    ],
    architectureDataFlow: `
      1. Ingestion: Document text is parsed and segmented into overlapping text chunks.
      2. Embedding: Dense vector representations are computed for each chunk.
      3. Indexing: Vectors and text payloads are stored in Qdrant.
      4. Query: User questions are converted to embeddings and matched against indexed chunks via cosine similarity search.
      5. Generation: Retrieved top passages are inserted into a grounded prompt for the language model to synthesize an answer.
    `,
    technicalDecisions: [
      "Qdrant Vector Database: Selected for similarity search and payload metadata storage (document titles, page references, section headers).",
      "Context Grounding: Prompts instruct the model to base answers strictly on retrieved passages to limit speculative responses."
    ],
    challengesAndTradeoffs: [
      "Chunk Boundary Trade-offs: Splitting text into fixed chunks can occasionally divide relevant clauses; overlap parameters help mitigate this.",
      "Informational Scope: Designed strictly for document analysis and informational retrieval; does not provide legal advice or guarantee factual correctness."
    ],
    testingAndLimitations: [
      "Tested with sample agreements and contracts to evaluate passage retrieval relevance and prompt grounding across specific queries.",
      "Current Scope: Supports text and readable PDFs; scanned image documents require pre-processed OCR text."
    ],
    links: {
      type: "notice",
      label: "RAG Pipeline Implementation",
      notice: "Document analysis pipeline and vector store configuration available for review upon request."
    }
  },

  "jd-analyst": {
    title: "JD Analyst Agent — Multi-Agent Interview Preparation System",
    category: "Agentic AI • Parsing & Prep",
    status: "Multi-Agent Workflow • Interview Prep",
    tagline: "Specialized multi-agent system analyzing unstructured job descriptions to generate structured skill breakdowns and interview practice questions.",
    problemAndContext: `
      Job descriptions frequently contain unstructured requirements, blending technical keywords, seniority expectations,
      and behavioral responsibilities into dense text. This project automates the extraction of core competencies and creates
      targeted interview preparation questions.
    `,
    implementedFeatures: [
      "Developed multi-agent workflow in Python using LangGraph and LangChain.",
      "Configured distinct agent roles for job description analysis, skill extraction, experience mapping, behavioral question drafting, and technical drills.",
      "Utilized shared LangGraph state to coordinate data flow between extraction nodes and question generators."
    ],
    architectureDataFlow: `
      1. Input: Unstructured job description text is passed to the analysis agent.
      2. Extraction: Key skills, required technologies, experience level, and core duties are parsed into structured state.
      3. Question Generation: Behavioral and technical interview agents reference extracted keywords to generate practice questions.
      4. Output: Produces an interview preparation summary with categorized questions and focus areas.
    `,
    technicalDecisions: [
      "Modular Agent Roles: Separating extraction from interview question generation keeps individual prompts focused and easier to tune.",
      "Shared Graph State: Downstream agents access extracted skills from state without repeating extraction steps."
    ],
    challengesAndTradeoffs: [
      "Job Posting Variance: Quality of generated preparation depends on the specificity of the source posting; generic postings produce broader questions."
    ],
    testingAndLimitations: [
      "Tested on standard software engineering job postings to evaluate extraction coverage and question relevance.",
      "Current Scope: Generates preparation materials; does not evaluate live spoken audio."
    ],
    links: {
      type: "notice",
      label: "Multi-Agent Workflow",
      notice: "Multi-agent LangGraph workflow. Architecture details available upon request."
    }
  },

  "hr-interviewer": {
    title: "Professional HR Interviewer — LangChain Agent",
    category: "Conversational AI • Session State",
    status: "Conversational Agent • In-Memory Session",
    tagline: "Multi-turn interview simulation agent evaluating responses, providing constructive feedback, and maintaining in-memory session checkpointing.",
    problemAndContext: `
      Practicing for behavioral interviews requires dynamic dialogue where answers are evaluated for clarity, structure,
      and relevance, followed by contextual follow-up questions.
    `,
    implementedFeatures: [
      "Implemented multi-turn conversational interview agent using LangChain and Google Gemini.",
      "Designed sequential conversational logic with evaluation criteria to review candidate responses and provide constructive feedback.",
      "Utilized in-memory session checkpointing to preserve conversational context across interview turns during an active session."
    ],
    architectureDataFlow: `
      1. Turn Input: Candidate enters an answer to the current behavioral interview question.
      2. State Update: In-memory session checkpointer appends the user turn to active conversation memory.
      3. Response Review: Agent evaluates the response for completeness and structure.
      4. Follow-up: Agent presents constructive feedback and asks the next relevant question.
    `,
    technicalDecisions: [
      "In-Memory Checkpointing: Selected for lightweight local execution without requiring external database configuration during testing.",
      "Sequential Evaluation: Generates constructive observations on answer structure before advancing to the next question."
    ],
    challengesAndTradeoffs: [
      "Session Ephemerality: Because state is held in memory, terminating or restarting the application resets the active interview session."
    ],
    testingAndLimitations: [
      "Tested across multi-turn behavioral interview sessions to verify question progression and conversational coherence.",
      "Current Scope: Focuses on text-based behavioral practice; does not replace human evaluation."
    ],
    links: {
      type: "notice",
      label: "Conversational Agent",
      notice: "Conversational simulation agent. Implementation details available upon request."
    }
  }
};

/* ==========================================================================
   Accessible Project Modal & Focus Management
   ========================================================================== */
function initProjectModal() {
  const modal = document.getElementById("project-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const modalType = document.getElementById("modal-project-type");
  const modalStatus = document.getElementById("modal-project-status");
  const modalBody = document.getElementById("modal-project-body");
  const modalFooter = document.getElementById("modal-project-footer");

  if (!modal || !closeBtn || !modalBody) return;

  let lastFocusedTrigger = null;

  function openModal(projectId, triggerElement) {
    const data = PROJECT_DOSSIERS[projectId];
    if (!data) return;

    lastFocusedTrigger = triggerElement || document.activeElement;

    modalType.textContent = data.category;
    modalStatus.textContent = data.status;

    // Helper to safely format lists
    const implementedList = data.implementedFeatures
      .map((item) => `<li>${item}</li>`)
      .join("");

    const decisionsList = data.technicalDecisions
      .map((item) => `<li>${item}</li>`)
      .join("");

    const tradeoffsList = data.challengesAndTradeoffs
      .map((item) => `<li>${item}</li>`)
      .join("");

    const testingList = data.testingAndLimitations
      .map((item) => `<li>${item}</li>`)
      .join("");

    // Ordered strictly per guidelines:
    // 1. Problem and context
    // 2. What I implemented
    // 3. Architecture and data flow
    // 4. Important technical decisions
    // 5. Challenges and trade-offs
    // 6. Testing and current limitations
    // 7. Repository or demo links
    modalBody.innerHTML = `
      <div>
        <h3 class="modal-title" id="modal-project-title">${data.title}</h3>
        <p class="modal-text" style="margin-top: 0.5rem; color: var(--text-secondary); font-weight: 500;">
          ${data.tagline}
        </p>
      </div>

      <div>
        <h4 class="modal-section-title">1. Problem &amp; Context</h4>
        <p class="modal-text">${data.problemAndContext.trim()}</p>
      </div>

      <div class="modal-info-box">
        <h4 style="color: var(--text-primary); font-size: 0.95rem; margin-bottom: 0.75rem;">2. What I Implemented</h4>
        <ul>${implementedList}</ul>
      </div>

      <div>
        <h4 class="modal-section-title">3. Architecture &amp; Data Flow</h4>
        <div class="modal-diagram-container">
          <pre style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-primary); white-space: pre-wrap; line-height: 1.6;">${data.architectureDataFlow.trim()}</pre>
        </div>
      </div>

      <div class="modal-grid">
        <div class="modal-info-box">
          <h4 style="color: var(--text-primary); font-size: 0.95rem; margin-bottom: 0.75rem;">4. Important Technical Decisions</h4>
          <ul>${decisionsList}</ul>
        </div>

        <div class="modal-info-box">
          <h4 style="color: var(--text-primary); font-size: 0.95rem; margin-bottom: 0.75rem;">5. Challenges &amp; Trade-offs</h4>
          <ul>${tradeoffsList}</ul>
        </div>
      </div>

      <div class="modal-info-box">
        <h4 style="color: var(--text-primary); font-size: 0.95rem; margin-bottom: 0.75rem;">6. Testing &amp; Current Limitations</h4>
        <ul>${testingList}</ul>
      </div>
    `;

    // 7. Repository or demo links in footer
    let actionBtnHtml = "";
    if (data.links.type === "github") {
      actionBtnHtml = `
        <a href="${data.links.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          ${data.links.label}
        </a>
      `;
    } else {
      actionBtnHtml = `
        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5;">
          ${data.links.notice}
        </span>
      `;
    }

    modalFooter.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
        ${actionBtnHtml}
      </div>
      <button type="button" class="btn btn-subtle" id="modal-inner-close">Close Dossier</button>
    `;

    document.getElementById("modal-inner-close")?.addEventListener("click", closeModal);

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Restore focus to triggering button
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
      lastFocusedTrigger.focus();
    }
  }

  // Trigger bindings
  document.querySelectorAll("[data-action='open-modal']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      if (id) openModal(id, btn);
    });
  });

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Accessible keyboard trap and Escape handler
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      return;
    }

    if (e.key === "Tab") {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
}

/* ==========================================================================
   Honest Contact Email Preparation with Validation & Honeypot
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  if (!form || !feedback) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Check honeypot field for bot spam prevention
    const honeypot = document.getElementById("website-field")?.value;
    if (honeypot) {
      feedback.className = "form-feedback error";
      feedback.textContent = "Submission rejected.";
      return;
    }

    const name = form.elements["name"]?.value.trim();
    const email = form.elements["email"]?.value.trim();
    const topic = form.elements["topic"]?.value || "General Technical Inquiry";
    const message = form.elements["message"]?.value.trim();

    // Validate inputs
    if (!name || !email || !message) {
      feedback.className = "form-feedback error";
      feedback.textContent = "Please fill in all required fields (Name, Email, Message).";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedback.className = "form-feedback error";
      feedback.textContent = "Please provide a valid email address.";
      return;
    }

    // Safely construct mailto parameters without direct HTML injection
    const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${topic} — ${name}`);
    const mailtoBody = encodeURIComponent(`From: ${name} (${email})\nInquiry Area: ${topic}\n\nMessage:\n${message}`);
    const mailtoUrl = `mailto:gundaysrishanth@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    feedback.className = "form-feedback success";
    feedback.innerHTML = "";

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "0.6rem";

    const titleEl = document.createElement("strong");
    titleEl.textContent = `Draft Prepared for ${name}`;
    container.appendChild(titleEl);

    const descEl = document.createElement("p");
    descEl.style.fontSize = "0.88rem";
    descEl.style.color = "var(--text-secondary)";
    descEl.style.lineHeight = "1.5";
    descEl.textContent =
      "Your inquiry details have been formatted. Click below to open your email client and send the message directly to gundaysrishanth@gmail.com:";
    container.appendChild(descEl);

    const linkEl = document.createElement("a");
    linkEl.href = mailtoUrl;
    linkEl.className = "btn btn-primary";
    linkEl.style.marginTop = "0.25rem";
    linkEl.style.fontSize = "0.85rem";
    linkEl.style.width = "fit-content";
    linkEl.textContent = "Open in Email Client to Send";
    container.appendChild(linkEl);

    feedback.appendChild(container);
    form.reset();
  });
}
