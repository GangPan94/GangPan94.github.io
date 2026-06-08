---
layout: single
title: "Antigravity Academic Workflow"
subtitle: "A Comprehensive Guide to Multi-Workflow Slide Development, Code Review, and Research Automation"
permalink: /projects/antigravity-workflow/
author_profile: true
toc: true
toc_label: "Table of Contents"
toc_icon: "cog"
toc_sticky: true
---

*Author: Gang (Ernest) Pan &middot; Published: March 7, 2026*

---

## 1. Why This Workflow Exists

> **Work in Progress** — This guide and the associated Antigravity workflow configuration are currently actively in development. Workflows, rules, and structures are subject to change.

> **Accessing This Setup** — If you are interested in using this setup, please send me an email. I will provide you with access to my GitHub repository.
>
> Once you have access, you can download the repository directly to your workspace:
>
> ```bash
> git clone https://github.com/[your-github-username]/AntigravitySetup.git
> cd AntigravitySetup
> ```

### 1.1 The Problem with Chat-Type AI Interfaces

If you've ever built lecture slides, reviewed academic papers, or written research replication packages using standard chat-based AI interfaces (like standard web UI chats), you know the challenges:

- **Context loss between sessions.** You pick up where you left off in a new chat, but your AI doesn't remember *why* you chose that notation, *what* the instructor approved, or *which* bugs were fixed last time.
- **Inconsistent Output.** One slide has perfect spacing; the next overflows. Code works in the chat window but breaks when you copy-paste it locally.
- **Manual Review is Exhausting.** You proofread 140 slides by hand. You miss a typo in an equation, and a student catches it during lecture.
- **Execution Limitation.** Standard chat interfaces cannot natively compile your LaTeX or run your full R pipeline to verify it actually works before giving you an answer.

### 1.2 The Solution: Google Antigravity

[Antigravity](https://antigravity.google) solves these issues by acting as an "agent-first" AI-powered Integrated Development Environment (IDE) built by Google DeepMind. Designed as a heavily modified fork of Visual Studio Code, it shifts from traditional AI chat assistance to a system where autonomous agents handle complex tasks with greater independence directly within your workspace.

You simply describe what you want — "translate Lecture 5 to Quarto," "review my paper before submission," or "analyze this dataset and produce publication-ready tables" — and **Antigravity** handles the rest. It plans the approach, implements it, runs specialized workflows, fixes issues, verifies quality, and presents results.

### 1.3 Antigravity Execution Architecture

Antigravity executes its tasks using a combination of two core components:

1. **Skills**: Background intelligence contexts and tool definitions located in `.agents/skills/`.
2. **Workflows**: Explicit, structured markdown checklists located in `.agents/workflows/` that guarantee the agent follows a reproducible, step-by-step sequence.

By combining contextual skills with explicit workflows, Antigravity natively creates `implementation_plan.md` and `task.md` checklists, pausing proactively for user feedback during complex tasks. It also enforces **Built-in Verification**, meaning the agent must compile and check its output (e.g., catching LaTeX `overfull \hbox` warnings) *before* concluding a task.

Furthermore, this setup is uniquely empowered by a **significant token cost advantage**. A major inhibitor of adversarial QA loops (like `/qa-quarto`) or recursive multi-agent reviews in tools like Claude Code is direct, per-token API billing which quickly accumulates immense costs. By operating natively within your environment and leveraging the Google ecosystem, Antigravity avoids this trap. The **Free Tier** provides a generous allowance for daily prompts, while **Google AI Pro** (Google One AI Premium, ~$20/month) unlocks advanced reasoning through models like Gemini Advanced. With a massive 1-million token context window and significantly higher daily message limits (e.g., up to 100-500 prompts per day depending on the tier), subscribers experience almost unlimited capacity. This makes intensive, parallel research workflows incredibly cost-effective.

#### 1.3.1 Current Limitations: Subagents and Teams

While Antigravity natively integrates skills, explicit workflows, and provides an incredible cost advantage, it currently lacks native support for **Agent Teams** and **Subagent Swarms**.

In systems like Claude Code (especially when enhanced with external frameworks), you can spawn multiple independent subagents to tackle parallel tasks — such as sending one agent to format data while another searches documentation. Antigravity currently operates as a single, powerful orchestrator. It executes its verification loops sequentially rather than delegating them to independent, background processes. This means highly parallelizable tasks may take slightly longer to execute autonomously, as the primary agent must process each workflow checklist **one step at a time**.

**Parallel Execution Workaround:** Despite lacking native subagent spawning, you can still achieve parallel execution. Because Antigravity is an AI-first IDE environment, you can open multiple instances of the assistant (e.g., in different editor tabs or chat sessions) and instruct them to work on separate, non-overlapping tasks simultaneously.

#### 1.3.2 Current Limitations: Token Pricing and API Keys

The impressive capabilities of Antigravity come with strict token rate limits built into the ecosystem.

- **Free Tier Limits:** Currently, Antigravity offers a free "Individual" tier with generous rate limits that refresh weekly. However, complex autonomous workflows (like `/deep-audit` or `/qa-quarto`) consume massive amounts of context quickly.
- **Google AI Pro Limits:** Users subscribed to Google AI Pro or Ultra receive significantly higher quotas (up to 1-million token context windows) that refresh much faster (e.g., every five hours).
- **No API Key Support:** *Critically, Antigravity does not currently support bypassing these limits by plugging in a "pay-as-you-go" API key* (like a direct Google AI Studio or Anthropic API key).

If your workflow requires uncapped, pay-as-you-go execution driven by your own billing account, you may need to rely on the terminal-based **Claude Code** workflow.

### 1.4 Transitioning from Claude Code to Antigravity

The previous iteration of this academic setup was built for **Claude Code** — a highly capable, terminal-based AI agent. Claude Code remains a powerful tool for autonomous software engineering. However, for continuous, heavy-duty academic research tasks, Antigravity provides unique structural advantages tailored to our needs.

| Capability | Claude Code | Google Antigravity |
|---|---|---|
| **Workspace Integration** | A powerful CLI tool that uses dynamic python scripts, "hooks", and custom bash commands to steer the AI's boundaries. | Operates natively as an AI-first IDE with safe constraints and direct VS Code integration. |
| **Execution Architecture** | Relies primarily on background skills to determine behavior dynamically. | Integrates BOTH **Skills** (for contextual capability) and explicit **Workflows** (for step-by-step determinism). |
| **Quality Gates** | Uses custom python scripts to block edits or force compilations. | Workflows natively integrate step-by-step verification, instructing the agent to check the output of its execution. |
| **Task UI & Memoirs** | Logs sessions automatically in `.claude/sessions`. | Natively creates and maintains user-visible `task.md` checklists and `implementation_plan.md` artifacts. |
| **Token Cost Structure** | Direct, per-token API billing. | Included in the Google ecosystem. **Free Tier** gives a generous message allowance; **Google AI Pro** unlocks massive 1-million token usage caps. |

---

## 2. Getting Started

You need two things: get access to the repo, and start your first conversation with Antigravity.

> **Day 1 Checklist**
>
> - [ ] Email for repository access and clone it locally.
> - [ ] Open the project directory in your IDE and launch your Antigravity assistant.
> - [ ] Ask Antigravity to do something specific: *"Review my slides"*, *"Translate Lecture 5"*, or *"Create a lecture on [topic]"*.
> - [ ] Antigravity will automatically create an `implementation_plan.md`.
> - [ ] Review and approve the plan, watch it execute skills and workflows, and review the final output.

That's it. Everything else — specialized workflows, verifications, and agentic UI loops — is managed autonomously in the background by Antigravity.

### 2.1 The Starter Prompt

Once you have opened the project in your IDE and launched the Antigravity assistant, paste the following prompt to kick off the configuration process. Fill in the **bolded placeholders** with your project details:

> **Antigravity Starter Prompt**
>
> I am starting to work on **[PROJECT NAME]** in this repo. **[Describe your project in 2–3 sentences — what you're building, who it's for, what tools you use (e.g., LaTeX/Beamer, R, Quarto).]**
>
> I want our collaboration to be structured, precise, and rigorous — even if it takes more time. When creating visuals, everything must be polished and publication-ready. I don't want to repeat myself, so our workflow should be smart about remembering decisions and learning from corrections.
>
> I've set up the Antigravity academic workflow (cloned from the AntigravitySetup repository). The configuration files are already in this repo (`.agents/workflows/`, `.agents/skills/`, templates, scripts). Please use your root directory tools to read them, understand the workflow, and then **update all configuration files to fit my project** — adjust workflows or skills if needed, and propose any customizations specific to my use case.
>
> Use the plan-first workflow for all non-trivial tasks. Once I approve your `implementation_plan.md`, coordinate everything autonomously using your execution mode, following explicit workflow checklists. Only pause to ask for my review via your communication interface when there's ambiguity or a critical decision to make. For our first few tasks, check in with me a bit more often so I can learn how the workflow operates.
>
> Please start by building an `implementation_plan.md` to adapt the workflow configuration to this project.

---

## 3. The System in Action

With the setup covered, here is what the system actually *does*. This section walks through the core mechanisms that make the workflow powerful.

### 3.1 Specialized Workflows Beat One-Size-Fits-All

Consider proofreading a 140-slide lecture deck. You could ask an LLM:
> "Review these slides for grammar, layout, math correctness, code quality, and pedagogical flow."

The agent will skim and miss nuance. Now compare with calling specialized Antigravity workflows:

| Workflow | Focus | What It Catches |
|---|---|---|
| `/proofread` | Grammar only | "principle" vs "principal" |
| `/visual-audit` | Layout only | Text overflow on slide 37 |
| `/pedagogy-review` | Flow only | Missing framing sentence before Theorem 3.1 |
| `/review-r` | Code only | Missing `set.seed()` |

Each workflow instructs the agent to examine a different dimension with full attention. The `/slide-excellence` workflow runs them comprehensively.

### 3.2 The Adversarial QA Loop

The single most powerful pattern in this system is the **adversarial QA loop** for translating formats (e.g., Beamer to Quarto). The `/qa-quarto` workflow institutes a critic-fixer dynamic: the agent reads the generated file, assesses it adversarially (the critic), and then switches contexts to fix the identified bugs (the fixer), repeating until it's identical.

### 3.3 Quality Scoring: The 80/90/95 System

We implement strict quality gates via the `/quality-score` workflow:

| Score | Threshold | Meaning | Action |
|---|---|---|---|
| **80+** | Commit | Safe to save progress | `git commit` allowed |
| **90+** | PR | Ready for deployment | `gh pr create` encouraged |
| **95+** | Excellence | Exceptional quality | Aspirational target |
| **< 80** | Blocked | Critical issues exist | Must fix before committing |

Points are deducted for issues like equation overflow (-20), broken citations (-15), or notation inconsistency (-3).

---

## 4. Core Workflow Patterns

### 4.1 Pattern 1: Plan-First Development

The plan-first pattern ensures that non-trivial tasks begin with thinking, not typing. In Antigravity, always ask the agent to create an `implementation_plan.md` first. Without a plan, the agent starts editing immediately, discovers a dependency, and has to undo work. With a plan, the approach is agreed upon before any edits happen.

### 4.2 Pattern 2: The Multi-Step Creation Workflow

Creating a new lecture from scratch is a massive undertaking. Call the `/create-lecture` workflow to guide Antigravity through:
1. Gathering materials (papers, outlines)
2. Designing slide structure
3. Drafting Beamer slides
4. Generating R figures
5. Polishing and verifying (`/slide-excellence`, `/proofread`)
6. Deploying (`/deploy`)

### 4.3 Pattern 3: Replication-First Coding

When working with empirical papers:
1. **Inventory**: Record "gold standard" numbers from the paper.
2. **Translate**: Match original specification EXACTLY in your new R code.
3. **Verify Match**: Tolerance < 0.01 for estimates. If mismatch, stop and investigate.
4. **Extend**: Only add new estimators after baseline matches.

### 4.4 Pattern 4: "Devil's Advocate"

At any design decision, invoke the `/devils-advocate` workflow. Antigravity will challenge the slide design with 5-7 specific pedagogical questions referencing unstated assumptions, cognitive load issues, and prerequisite gaps.

---

## 5. Available Workflows Directory

You can invoke any of the following by asking Antigravity to run them (or utilizing them as slash commands if available). All workflows are located in `.agents/workflows/`.

### Core CI/CD & Compilation

- **Compile LaTeX** (`/compile-latex`): Runs the strict 3-pass compilation sequence (with `bibtex`) utilizing our `Preambles/` folder.
- **Deploy Slides** (`/deploy`): Renders `.qmd` files and utilizes `scripts/sync_to_docs.sh` to populate the `docs/` folder for GitHub Pages.
- **Quality Score Assessor** (`/quality-score`): Analyzes `.qmd` files for structural and academic integrity.
- **Extract TikZ** (`/extract-tikz`): Compiles TikZ to PDF and converts to SVG for web presentation.

### Review Assistance

- **Pedagogy Review** (`/pedagogy-review`): Checks narrative arc, student prerequisites, math/notation clarity, and pacing.
- **Visual Audit** (`/visual-audit`): Adversarial visual audit checking for overflow, font consistency, box fatigue, and layout issues.
- **Proofread** (`/proofread`): Grammatical and typo checks on LaTeX sources.
- **R Code Review** (`/review-r`): Checks code quality, reproducibility (e.g., `set.seed()`), and domain correctness.
- **Validate Bibliography** (`/validate-bib`): Verifies cross-citations and marks unused entries.

### Research & Idea Generation

- **Data Analysis in R** (`/data-analysis`): End-to-end R data analysis workflow from exploration through regression to publication-ready tables and figures.
- **Literature Review** (`/lit-review`): Structured literature search and synthesis.
- **Research Ideation** (`/research-ideation`): Generate structured research questions, testable hypotheses, and empirical strategies.
- **Interview Me** (`/interview-me`): Interactive interview to formalize a research idea into a structured specification.
- **Review Paper** (`/review-paper`): Comprehensive manuscript review covering argument structure, econometric specification, and potential referee objections.
- **Deep Audit** (`/deep-audit`): Repository infrastructure audit for consistency. Launches 3 parallel specialist agents to find factual errors, count mismatches, and cross-document inconsistencies.

---

## 6. Community & Extensions

This repository is the foundation. Others have extended it for specific workflows in the Claude Code and AI coding spheres, which we are adapting for Antigravity:

- **[clo-author](https://github.com/hsantanna88/clo-author)** by Hugo Sant'Anna (UAB) — Paper-centric research workflows with adversarial worker-critic agent pairs, simulated blind peer review, AEA replication compliance, and full research lifecycle management.
- **[claudeblattman](https://github.com/chrisblattman/claudeblattman)** by Chris Blattman (U Chicago) — Comprehensive guide for non-technical academics: executive assistant workflows, proposal writing, agent debates, and self-improving configuration.
- **[MixtapeTools](https://github.com/scunning1975/MixtapeTools)** by Scott Cunningham (Baylor) — The Rhetoric of Decks: philosophy and practice of beautiful, rhetorically effective academic presentations.

---

## 7. Research Organization and Exploration

Without structure, experimental code scatters across the repository. To combat this, we use the **Exploration Folder Protocol**.

All experimental work goes into `explorations/` first:

```
explorations/
├── [active-project]/
│   ├── README.md           # Goal, hypotheses, status
│   ├── R/                  # Code iterations
│   ├── scripts/            # Test scripts
│   └── output/             # Results
└── ARCHIVE/
```

**Fast-Track vs. Plan-First:** If the work is definitely going into production (e.g., the slides), use the rigorous Plan-First workflow (80/100 quality). If you are testing an idea ("Am I exploring whether IV works here?"), use Fast-Track: you do not need an implementation plan. Work in `explorations/` with lower quality standards until it graduates to `scripts/`.