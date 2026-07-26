---
layout: single
title: "Agentic Workflows for Accounting Academics"
subtitle: "Google Antigravity as an Example"
permalink: /projects/antigravity-workflow/
author_profile: true
toc: true
toc_label: "Table of Contents"
toc_icon: "cog"
toc_sticky: true
---

*Author: Gang (Ernest) Pan &middot; Published: March 7, 2026 &middot; Last Updated: July 25, 2026*

---

# Why This Workflow Exists

> **Work in Progress**
>
> This guide and the associated Antigravity workflow configurations are actively in development. The patterns described here represent the current frontier of AI-assisted academic research.

## The Goal of This Guide

The goal of this project is simple: **to help our accounting academic colleagues and friends get started with agentic AI to aid their research as quickly as possible.**

Adopting a new paradigm can be daunting, and it is easy to let the anxiety of complex setups, command-line interfaces, or the “unknowns” of AI lead to procrastination. This guide is designed to:

1. **Dispel Adoption Fear**: Show that agentic AI is accessible, manageable, and highly beneficial, dismantling the intimidation barrier.
2. **Demonstrate Real-World Usage**: Show exactly how these workflows work in practice, showing how agentic AI acts as a tireless, high-quality research assistant.
3. **Provide a Quick Setup Guide**: Offer a clear, zero-friction path to get your own environment running in minutes.

## The Problem with Chat-Based AI

If you’ve ever done serious academic work — built lecture slides, drafted a research paper, run a data analysis pipeline — you know the pain:

- **Context loss between sessions.** You pick up where you left off in a new chat, but the AI doesn’t remember *why* you chose that notation, *what* was approved, or *which* bugs were fixed last time.
- **Quality is inconsistent.** One slide has perfect spacing; the next overflows. Citations compile in one environment but break locally.
- **Review is manual and exhausting.** You proofread 140 slides by hand and miss a typo in an equation. A student or referee catches it.
- **No one checks the math.** Grammar checkers catch “teh” but not a flipped sign in a decomposition theorem or a misspecified regression.

## The Solution: Agentic Workflows

To understand how this works, we must distinguish **Agentic AI** from standard AI chatbots:

- **Chatbots:** Passive conversationalists. They wait for prompts, reply with text, and rely on you to manually copy-paste and test the results.
- **Agents:** Active collaborators. They autonomously interact with the environment—reading/editing files, executing commands, and running subagents to verify quality.

These core agentic capabilities enable workflows that traditional chatbots cannot:

| Capability | What It Means for You |
|---|---|
| Read & edit your files | Surgical edits to `.tex`, `.qmd`, `.R`, `.do` files in place |
| Run shell commands | Compile LaTeX, run R scripts, render Quarto — directly |
| Access git history | Commits, PRs, branches — from conversation |
| Persistent memory | `GEMINI.md` + `MEMORY.md` survive across sessions |
| Orchestrator pattern | Skills like `commit`, `qa-quarto`, `review-paper` run an internal verify-review-fix-score loop |
| Native subagent workflows | Specialized subagents for proofreading, layout, pedagogy, code review |
| Quality review | Advisory scoring inside `commit`; targets: 80 commit, 90 PR, 95 excellence |

> **Note**
>
> The only unfamiliar concept to accountants might be Git or GitHub. For now, you don’t have to understand every component of this table, and a more proper, concise introduction of Git and GitHub will follow.

## Why use Google Antigravity as an example?

There is no strong technical reason to use Google Antigravity over others. As summarized in [this overview of the agentic coding landscape](https://thenewstack.io/claude-code-vs-cursor-vs-codex-vs-antigravity-2026/):

> “Six months of convergence has settled the shape of the agentic coding tool and turned the next phase into a contest over the harness, the price, and the habits a team builds around one product.”

This article is a good summary of the current landscape of agentic coding tools. Currently, Claude Code is more popular among academics. The primary reason we invest the effort in building this setup is to lower the risk that users are hung up to one service provider. By building a highly modular, system-agnostic foundation, you can easily port your rules, memory, and workflows to other providers if needed.

> **Note**
>
> Healthy competition drives rapid innovation. We ultimately do not know where the future will go or which agentic coding tool will stand the test of time, but the underlying concepts and principles remain universal.

## How It All Works Together

**Skills hide most of the mechanics.** You describe what you want in plain English, Antigravity figures out which skill fits, and the skill runs the right subagents and checks.

**Collaborate via a plan-first approach.** Rather than letting the agent write code immediately, establish a concrete plan first. Iterating back and forth with the agent to refine and improve this plan before execution significantly increases the alignment and quality of the final outcome. Once you align on a solid plan, you can step back and let the agent handle the heavy lifting of execution and verification.

### What You Do vs What the Skill Does

| You Do | The Skill Does (once invoked) |
|---|---|
| Describe what you want | Antigravity selects and runs the right skill. Antigravity will come up with the plan |
| Approve plans | The skill runs the orchestrator pattern internally |
| Review final output | Rules load based on files you touch |
| Say “commit” when ready | Subagents fire on the review cycle |

> **Concept: What is a “Skill” in Agentic AI?**
>
> In an agentic setting, a **skill** is more than just a prompt; it is a packaged workflow wrapper. While a generic Large Language Model (LLM) knows how to write code, it doesn’t know the specific rules of your project, how to compile Quarto, or how to run your R scripts.
>
> A skill bridges this gap by bundling:
> 1. **Context & Rules:** Specific constraints and guidelines for the task (e.g., formatting styles).
> 2. **Orchestration Patterns:** Coordinating specialized subagents (like a critic and a fixer) to work together.
> 3. **Tool Access:** Executing terminal commands and editing files locally to verify compilation, turning a general-purpose model into a specialized, task-ready executor.

> **Concept: What is a “Commit” and the Safety Layer?**
>
> In software development, **Git** acts as a time machine (version control system) that tracks changes in your files. A **commit** is a saved snapshot of your project at a specific point in history.
>
> In an agentic workflow, the “commit” phase acts as a critical **safety gate**. The agent performs edits in your workspace, but these changes are in a temporary, staged state. They are only permanently written to the repository’s official history when *you* approve them by executing `/commit`. This human-in-the-loop validation ensures you maintain complete control and that files are only finalized with your explicit approval.

### Example: “Convert my slides into LaTeX Beamer”

```
You: "Convert my PowerPoint slides into LaTeX Beamer and make it compliant with
      accessibility requirements, then review my lecture slides and fix all
      issues before tomorrow's class"
     ↓
Antigravity invokes pptx-to-beamer, which internally:
  → Parses PowerPoint slides structure and formats
  → Converts layouts and content to LaTeX Beamer code
  → Runs accessibility-review (color contrast, alt text, structural tags)
  → Runs proofreader (grammar, typos, consistency)
  → Runs visual-audit (overflow, layout, spacing)
  → Synthesizes conversion results and fixes
  → Re-verifies LaTeX compiles successfully
  → Scores against quality gates (accessibility + visual layout)
     ↓
You see: "Done. Converted to Beamer. Applied accessibility fixes.
          Score: 92/100. Ready to commit?"
```

---

# Getting Started

You need two things: access to the repo, and a session with Antigravity.

## Day 1 Checklist

> **Day 1 Checklist**
>
> - [ ] Clone the repo and open it in your IDE
> - [ ] Launch Antigravity in the project directory
> - [ ] Paste the Starter Prompt and fill in your project details
> - [ ] Wait for Antigravity to build an `implementation_plan.md`
> - [ ] Approve the plan
> - [ ] Ask Antigravity to do something: *“Review my slides”* or *“Create a lecture on [topic]”*
> - [ ] At session end, use the `update-memory` skill to persist decisions

## Sample Prompts

To use these prompts, simply copy the text and paste it into your Antigravity chat.

### The Starter Prompt

Paste the following into a fresh Antigravity session. Fill in the **bolded placeholders**:

```
I am starting to work on **[PROJECT NAME]** in this repo.
**[Describe your project in 2–3 sentences — what you're building, who it's for,
what tools you use (e.g., LaTeX/Beamer, R, Quarto, Stata).]**

I want our collaboration to follow the Agentic Workflow paradigm: plan-first,
multi-agent verification, adversarial QA loops, and mandatory compilation checks
before any task is considered complete. I don't want to repeat myself — our
workflow should be smart about remembering decisions and learning from corrections.

The configuration files are in `.agents/skills/`, `.agents/agents/`,
`.agents/rules/`, and `.agents/references/`. Please read them, understand
the workflow, and **update all configuration to fit my project** — fill in
placeholders in `GEMINI.md`, adjust rules if needed, and propose any
customizations specific to my use case.

Use the plan-first workflow for all non-trivial tasks. Once I approve a plan,
act as the Orchestrator: coordinate everything autonomously using subagents where
appropriate, only pausing when there is genuine ambiguity or a decision to make.

Enter plan mode and start by adapting the workflow configuration for this project.
```

### Research Positioning Interview

Use this prompt to align your fuzzy research idea against competitors and validate its contributions.

```
Run the `interview-me` skill, but **OVERRIDE** your default interview phases and final deliverable template with the specific instructions below. 

We are focusing strictly on crystallization and contribution, NOT data or identification.

**Topic:** [Paper Title]
**Core Idea:** [Briefly describe the core idea or thesis]

**Context Files:**
- Manuscript: `[Path]`
- Project plan: `[Path]`
- Requirements spec: `[Path]`

### Custom Interview Phases (Replace default Phases 1-6)
Walk me through these topics (still following your rule to ask one at a time and wait for my reply):
1. **Research Question:** State the RQ in one sentence. Probe on paper type classification and primary audience.
2. **Competitor Differentiation:** Walk me through how we differ from these papers (one by one):
   - [Competitor 1]
   - [Competitor 2]
   - [Competitor 3]
3. **Contribution Pillars:** Validate our contribution to [Field 1], [Field 2], and [Field 3].
4. **Methodology Scope:** Clarify decisions like [insert specific methodological concerns, e.g., formal derivations or specific simulations].

### Custom Deliverable (Replace default Research Specification)
Once the interview is complete, do not use the default spec template. Instead, produce a **Research Positioning Statement** saved to `quality_reports/specs/research_positioning_[Topic_Name].md` with exactly these sections:
1. Final research question (1 sentence)
2. Paper type classification
3. Contribution statement ([Number] pillars)
4. Competitor differentiation matrix (table format)
5. Methodology scope decisions
6. Target venue: [Target Journal/Conference]

*(Note: The skill's mandatory Post-Flight Verification for citations still applies before saving).*
```

## Requirements Specification (For Complex Tasks)

For complex or ambiguous tasks, Antigravity may ask 3-5 clarifying questions before planning. This catches ambiguity early and reduces rework.

After clarifying questions, a specification document is saved to `quality_reports/specs/` with:

- **MUST** have (non-negotiable requirements)
- **SHOULD** have (preferred features)
- **MAY** have (optional enhancements)
- **Clarity status** (CLEAR / ASSUMED / BLOCKED for each aspect)

You approve the spec, then planning begins. This reduces mid-plan pivots significantly.

---

# The System in Action

With setup covered, here is what the system actually *does*. This section walks through the three core mechanisms that make the workflow powerful: specialized agents, adversarial QA, and automatic quality scoring.

## Why Specialized Agents Beat One-Size-Fits-All

Consider proofreading a 140-slide lecture deck. You could ask Gemini:

> “Review these slides for grammar, layout, math correctness, code quality, and pedagogical flow.”

Gemini will skim everything and catch some issues. But it will miss:

- The equation on slide 42 where a subscript changed from $m_t^{d=0}$ to $m_t^0$
- The TikZ diagram where two labels overlap at presentation resolution
- The R script that uses `k=10` covariates but the slide says `k=5`

Now compare with specialized agents:

| Agent | Focus | What It Catches |
|---|---|---|
| `proofreader` | Grammar only | “principle” vs “principal” |
| `slide-auditor` | Layout only | Text overflow on slide 37 |
| `pedagogy-reviewer` | Flow only | Missing framing sentence before Theorem 3.1 |
| `r-reviewer` | Code only | Missing `set.seed()` |
| `domain-reviewer` | Substance | Slide says 10,000 MC reps, code runs 1,000 |

Each agent reads the same file but examines a different dimension with full attention. The `slide-excellence` skill runs them all in parallel.

## The Adversarial Pattern: Critic + Fixer

The single most powerful pattern in this system is the **adversarial QA loop**:

```
+------------------+
|  quarto-critic   |  "I found 12 issues. 3 Critical."
|  (READ-ONLY)     |
+--------+---------+
         |
    +----v----+
    | Verdict |
    +----+----+
     /       \
APPROVED   NEEDS WORK
    |          |
  Done    +----v---------+
          | quarto-fixer |  "Fixed 12/12 issues."
          | (READ-WRITE) |
          +----+---------+
               |
          +----v----------+
          | quarto-critic |  "Re-audit: 2 remaining."
          | (Round 2)     |
          +----+----------+
               |
          ... (up to 5 rounds)
```

**Why it works:** The critic can’t fix files (read-only), so it has no incentive to downplay issues. The fixer can’t approve itself (the critic re-audits). This prevents the common failure of Gemini saying “looks good” about its own work.

> **Closing the visual loop with Native Multimodal Vision**
>
> The critic-fixer loop above is text-only — it compares LaTeX source to Quarto source. It can’t see the *rendered* slides. Google’s **Multimodal Vision** capabilities let Gemini accept rendered slide images (such as PDF slides converted to PNGs) directly into the agent context to verify layouts visually. If you want closed-loop visual QA — “does the rendered slide actually look right?” — this multimodal capability closes the gap.
>
> Optional, not required: `qa-quarto` and `visual-audit` already catch most issues without it. Treat visual verification as an extra rung when text-level audits aren’t enough (e.g., suspecting a TikZ render glitch that the source code looks fine for).

## The Orchestrator: A Pattern, Not a Daemon

Individual agents are specialists. Skills like `slide-excellence` and `qa-quarto` coordinate a few agents for specific tasks. In day-to-day work, you don’t have to think about which agents to run — the right skill runs the right agents for you.

The **orchestrator protocol** (`.agents/rules/orchestrator-protocol.md`) defines the 6-step loop (IMPLEMENT → VERIFY → REVIEW → FIX → RE-VERIFY → SCORE) that skills implement internally. It is **not** a runtime daemon: plan approval does NOT auto-trigger this loop. You invoke a skill (e.g., `create-lecture`, `qa-quarto`, `review-paper --adversarial`) and the skill runs the pattern within its own scope.

What’s mechanically implemented today: `commit` (verifier + quality_score), `qa-quarto` (critic-fixer loop), `review-paper --adversarial` (critic-fixer loop), `slide-excellence` (multi-agent fanout), `review-paper --peer` (editor + 2 referees + cross-artifact). See Pattern 2 for the complete workflow.

## Quality Review: The 80/90/95 System

The quality-gates rule (`quality-gates.md`) defines scoring thresholds that `commit` and review skills apply. Thresholds are **advisory** — enforced inside specific skills, not by a repo-wide git pre-commit hook. A direct `git commit` bypasses the review. Every file gets a quality score from 0 to 100:

| Score | Threshold | Meaning | Action |
|---|---|---|---|
| **80+** | Commit | Safe to save progress | `git commit` allowed |
| **90+** | PR | Ready for deployment | `gh pr create` encouraged |
| **95+** | Excellence | Exceptional quality | Aspirational target |
| **< 80** | Blocked | Critical issues exist | Must fix before committing |

### How Scores Are Calculated

Points are deducted for issues:

| Issue | Deduction | Why Critical |
|---|---|---|
| Equation overflow | -20 | Math cut off = unusable |
| Broken citation | -15 | Academic integrity |
| Equation typo | -10 | Teaches wrong content |
| Text overflow | -5 | Content cut off |
| Label overlap | -5 | Diagram illegible |
| Notation inconsistency | -3 | Student confusion |

### Mandatory Verification

The verification protocol (`.agents/rules/verification-protocol.md`) requires that Gemini compile, render, or otherwise verify every output before reporting a task as complete. Skills that implement the orchestrator pattern enforce this as Step 2: VERIFY. This means Gemini **cannot** say “done” from within those skills without actually checking the output.

> **Don’t Skip Verification**
>
> Verification catches errors that might silently deploy, like broken diagrams or missing intercepts in scripts.

> **Model quality can regress — verification is the only durable defence**
>
> AI providers regularly update model checkpoints and release system changes. These updates can sometimes lead to model-quality drift or subtle regressions on highly specialized tasks. Implication for our workflow: do not treat any given model checkpoint as a stable baseline.
>
> The defences in this template all assume **model quality drifts**:
>
> - **`verify-claims`** with the Chain-of-Verification forked-verifier (the verifier cannot self-confirm even if the orchestrator’s checkpoint regressed).
> - **`audit-reproducibility`** with `passport.yaml` (numeric claims are anchored to specific script output values, not to the model’s recall of the values).
> - **The cross-artifact review rule** (a paper’s claims are checked against the code that produced them, not against the model’s intuition about whether they’re “plausible”).
> - **HIGH-WARN gate-refuse on `commit`** (Pass 3A I) — a fabricated citation or numerical contradiction blocks the commit even if the model “feels confident.”
>
> This is also a useful reminder that running `review-paper --variance N` (Pass 2C E) is the empirical answer to “should I trust this output?” — a single point estimate of model quality on a single task hides variance that the template’s adversarial-review patterns surface.

### Submission-readiness: stacking the verification lenses

For a paper headed to a journal, three orthogonal lenses run together — each catches a different class of failure:

| Lens | Skill | What it catches | Block-`commit` on failure? |
|---|---|---|---|
| **Grammar / overflow** | `proofread` | typos, search-and-replace artifacts, overfull `\hbox`, citation-format inconsistency | No (advisory) |
| **AI-voice tells** (v1.9.0) | `humanize` | boilerplate transitions (“Moreover”, “It is important to note”), AI-cliché lexicon (“delve”, “navigate the complexities”), hedging stacking, sycophancy | No (advisory; author edits manually) |
| **Factual claims** | `verify-claims` | fabricated citations, numerical contradictions, directional contradictions | **Yes — HIGH-WARN gate-refuses** (v1.9.0) |
| **Numeric provenance** | `audit-reproducibility` | manuscript value ≠ script output value within tolerance | Yes via `passport.yaml` (v1.9.0) |

These are *complementary*, not redundant. A paper can pass `proofread` (clean grammar) and fail `humanize` (the prose reads as AI-drafted). It can pass `humanize` (your own voice) and fail `verify-claims` (citation fabricated). It can pass `verify-claims` (citations real) and fail `audit-reproducibility` (Table 2 doesn’t match the code). Run all four before submission; reach for `review-paper --variance N` for the simulated peer-review verdict on top.

**`humanize` design choice**: detect-only, no `--rewrite` mode. Auto-rewriting AI tells degrades prose quality (cross-vendor research finding) and introduces new tells. The author reads the report and edits — that manual step is the price of preserving voice. If the report flags 8+ HIGH-severity tells per 1000 words, rewrite the affected paragraph from scratch rather than patching tell-by-tell.

## Creating Your Own Domain Reviewer

The template includes `domain-reviewer.md` — a skeleton for building a substance reviewer specific to your field.

### The 5-Lens Framework

Every domain can benefit from these five review lenses:

| Lens | What It Checks | Example (Economics) | Example (Political Science) | Example (Physics) |
|---|---|---|---|---|
| **Assumption Audit** | Are stated assumptions sufficient? | Is overlap required for ATT? | Is ignorability defensible given the observed covariates? | Is the adiabatic approximation valid here? |
| **Derivation Check** | Does the math check out? | Do decomposition terms sum? | Do conjoint AMCEs identify under Hainmueller–Hopkins–Yamamoto assumptions? | Do the units balance? |
| **Citation Fidelity** | Do slides match cited papers? | Is the theorem from the right paper? | Is the manipulation-check threshold cited from the original validation study? | Is the experimental setup correctly described? |
| **Code-Theory Alignment** | Does code implement the formula? | R script matches the slide equation? | `cjoint`/`survey::svyglm` weights match the design? | Simulation parameters match theory? |
| **Logic Chain** | Does the reasoning flow? | Can a PhD student follow backwards? | Does the causal claim survive the standard counterfactual challenge? | Are prerequisites established? |

The template ships **two concrete domain-reviewer customizations** in `.agents/agents/domain-reviewer.md`: an econometrics example (assumptions, identification, R/Stata code-theory alignment) and a political-science example (ignorability, conjoint AMCEs, `cjoint`/`survey` package defaults). Both follow the 5-lens structure; either is a viable starting point for your own field.

To customize, open `.agents/agents/domain-reviewer.md` and fill in:

1. Your domain’s common assumption types
2. Typical derivation patterns to verify
3. Key papers and their correct attributions
4. Code-theory alignment checks for your tools
5. Logic chain requirements for your audience

---

# The Building Blocks

Understanding the configuration layers helps you customize the workflow and debug when things go wrong. Antigravity’s power comes from five configuration layers that work together — think of them as the operating system for your academic project.

## GEMINI.md — Your Project’s Constitution

`GEMINI.md` is the single most important file. Gemini reads it at the start of every session. But here is the critical insight: **Gemini reliably follows about 100–150 custom instructions.** Your system prompt already uses ~50, leaving ~100–150 for your project. GEMINI.md and always-on rules share this budget.

This means GEMINI.md should be a **slim constitution** — short directives and pointers, not comprehensive documentation. Aim for ~120 lines:

- **Core principles** — 4–5 bullets (plan-first, verify-after, quality gates, LEARN tags)
- **Folder structure** — where everything lives
- **Commands** — compilation, deployment, key tools
- **Customization tables** — Beamer environments, CSS classes
- **Current state** — what’s done, what’s in progress
- **Skill quick reference** — table of available skills

Move everything else into `.agents/rules/` files (with path-scoping so they only load when relevant).

```
# GEMINI.MD --- My Project

**Project:** [Your Project Name]
**Institution:** [Your Institution]

## Core Principles
1. **Plan-first** — enter plan mode before non-trivial tasks
2. **Verify-after** — compile/render and check before reporting done
3. **Quality gates** — 80 to commit, 90 for PR, 95 for excellence
4. **LEARN tags** — persist corrections in MEMORY.md
5. **Single source of truth** — Beamer is authoritative; derive, don't duplicate

## Quick Reference
| Command | What It Does |
|---------|-------------|
| `compile-latex [file]` | 3-pass XeLaTeX compilation |
| `proofread [file]` | Grammar/typo review |
| `deploy [Lecture]` | Render and deploy to GitHub Pages |
```

> **Keep It Lean**
>
> GEMINI.md loads every session. If it exceeds ~150 lines, Gemini starts ignoring rules silently. Put detailed standards in path-scoped rules (`.agents/rules/`) instead — they only load when Gemini works on matching files, so they don’t compete for attention.

## Rules — Domain Knowledge That Auto-Loads

Rules are markdown files in `.agents/rules/` that Gemini loads automatically. They encode your project’s standards. The key design principle is **path-scoping**: rules with a `paths:` YAML frontmatter only load when Gemini works on matching files.

**Always-on rules** (no `paths:` frontmatter) load every session. Keep these few and focused:

```
.agents/rules/
├── plan-first-workflow.md       # ~83 lines — plan before you build
├── orchestrator-protocol.md     # ~42 lines — contractor mode loop
├── session-logging.md           # ~23 lines — three logging triggers
└── meta-governance.md           # ~251 lines — template vs working project
```

**Path-scoped rules** load only when relevant:

```
.agents/rules/
├── r-code-conventions.md        # paths: ["**/*.R"] — R standards
├── quality-gates.md             # paths: ["*.tex", "*.qmd", "*.R"] — scoring
├── verification-protocol.md     # paths: ["*.tex", "*.qmd", "docs/"] — verify before done
├── replication-protocol.md      # paths: ["scripts/**/*.R"] — replicate first
├── exploration-folder-protocol.md  # paths: ["explorations/**"] — sandbox rules
├── orchestrator-research.md     # paths: ["scripts/**/*.R", "explorations/**"] — simple loop
└── ...20 path-scoped rules total
```

The first three always-on rules total ~148 lines of actionable instructions. `meta-governance` is a reference document for the template’s dual nature (working project vs. public template) and loads passively. Path-scoped rules add rich, domain-specific guidance exactly when Gemini needs it.

**Sync vs. translate:** The `beamer-quarto-sync` rule handles incremental edits — fix a typo in Beamer, same fix goes to Quarto. The `translate-to-quarto` skill is for full initial translation of a new lecture. Translate once, sync thereafter.

**Why rules matter:** Without them, Gemini will use generic defaults. With them, Gemini follows *your* standards consistently across sessions.

### Example: Path-Scoped R Code Conventions Rule

```
---
paths:
  - "**/*.R"
  - "Figures/**/*.R"
  - "scripts/**/*.R"
---
```

```
# R Code Standards

## Reproducibility
- set.seed() called ONCE at top (YYYYMMDD format)
- All packages loaded at top via library()
- All paths relative to repository root

## Visual Identity
primary_blue  <- "#012169"
primary_gold  <- "#f2a900"
```

The `paths:` block means this rule only loads when Gemini reads or edits an `.R` file. When Gemini works on a `.tex` file, this rule doesn’t consume any of the instruction budget.

## Constitutional Governance (Optional)

As your project grows, some decisions become non-negotiable (to maintain quality, reproducibility, or collaboration standards). Others remain flexible.

The `templates/constitutional-governance.md` template helps you distinguish between:

- **Immutable principles** (Articles I-V): Non-negotiable rules that ensure consistency
- **User preferences**: Flexible patterns that can vary by context

### Example Articles You Might Define

- **Article I: Primary Artifact** — Which file is authoritative (e.g., `.tex` vs `.qmd`, `.Rmd` vs `.html`, notebook vs script)
- **Article II: Plan-First Threshold** — When to enter plan mode (e.g., >3 files, >30 min, multi-step workflows)
- **Article III: Quality Gate** — Minimum score to commit (e.g., 80/100, all tests passing)
- **Article IV: Verification Standard** — What must pass before commit (e.g., compile, tests, render)
- **Article V: File Organization** — Where different file types live (prevents scattering)

The template includes examples for LaTeX, R, Python, Jupyter, and multi-language workflows.

Use constitutional governance **after** you’ve established 3-7 recurring patterns that you want to enforce consistently. Don’t create it on day one — let patterns emerge first, then codify them. Skip it for solo projects with evolving standards, or when you prefer case-by-case decisions.

**Template:** `templates/constitutional-governance.md`

## Skills — Reusable Slash Commands

Skills are multi-step workflows invoked with `/command`. Each skill lives in `.agents/skills/[name]/SKILL.md`:

```
---
name: compile-latex
description: Compile LaTeX with 3-pass XeLaTeX + bibtex
argument-hint: "[filename without .tex extension]"
---

# Steps:
1. cd to Slides/
2. Run xelatex pass 1
3. Run bibtex
4. Run xelatex pass 2
5. Run xelatex pass 3
6. Check for errors
7. Report results
```

**Skills you get in the template:**

| Skill | Purpose | When to Use |
|---|---|---|
| `compile-latex` | Build PDF from .tex | After any Beamer edit |
| `deploy` | Render Quarto + sync to docs/ | Before pushing to GitHub Pages |
| `proofread` | Grammar and consistency check | Before every commit |
| `qa-quarto` | Adversarial Quarto QA | After translating Beamer to Quarto |
| `slide-excellence` | Full multi-agent review | Before major milestones |
| `create-lecture` | New lecture from scratch | Starting a new topic |
| `commit` | Stage, commit, PR, merge | After any completed task |

> **Built-In Skills**
>
> Antigravity ships with built-in skills beyond this template’s 41: `/batch` orchestrates parallel refactoring across your codebase (using git worktrees for isolation), `/simplify` runs 3-agent code review and applies fixes, and `/debug` helps troubleshoot sessions. These complement the academic skills above.

## Agents — Specialized Reviewers

Agents are the real power of this system. Each agent is an expert in one dimension of quality:

```
.agents/agents/
+-- proofreader.md        # Grammar, typos, consistency
+-- slide-auditor.md      # Visual layout, overflow, spacing
+-- pedagogy-reviewer.md  # Narrative arc, notation clarity, pacing
+-- r-reviewer.md         # R code quality and reproducibility
+-- tikz-reviewer.md      # TikZ diagram visual quality
+-- quarto-critic.md      # Adversarial Quarto vs Beamer comparison
+-- quarto-fixer.md       # Applies critic's fixes
+-- beamer-translator.md  # Beamer -> Quarto translation
+-- verifier.md           # Task completion verification
+-- domain-reviewer.md    # YOUR domain-specific substance review
+-- project-coordinator.md # Coordinator for theoretical workstreams
+-- prover.md             # Drafts mathematical proofs
+-- literature-reviewer.md # Conducts verified literature reviews
+-- paper-reviewer.md     # Gates workstream completion
+-- coder.md              # Runs computational experiments
+-- lean-prover.md        # Formalizes proofs in Lean 4
```

### Agent Anatomy

Each agent file has YAML frontmatter + detailed instructions:

```
---
name: proofreader
description: Reviews slides for grammar, typos, and consistency
---

# Proofreader Agent

## Role
You are an expert academic proofreader reviewing lecture slides.

## What to Check
1. Grammar and spelling errors
2. Inconsistent notation
3. Missing or broken citations
4. Content overflow (text exceeding slide bounds)

## Report Format
Save findings to: quality_reports/[FILENAME]_report.md

## Severity Levels
- **Critical:** Math errors, broken citations
- **Major:** Grammar errors, overflow
- **Minor:** Style inconsistencies
```

> **Why Specialized Agents?**
>
> A single Gemini prompt trying to check grammar, layout, math, and code simultaneously will do a mediocre job at all of them. Specialized agents focus on one dimension and do it thoroughly. The `slide-excellence` skill runs them all in parallel, then synthesizes results.
>
> Antigravity also offers experimental **Agent Teams** — multiple independent sessions that coordinate, share findings, and challenge each other’s approaches. This is a research preview feature; the orchestrator + subagent pattern described here is more mature for academic workflows.

### Multi-Model Strategy: Cost vs. Quality

> **Current Google Gemini Model Lineup (May 2026)**
>
> In the Antigravity workflow, model selection is optimized around Google’s Gemini models:
>
> - **gemini-3.5-flash (High):** The primary high-tier model for high-judgment, reasoning, and complex coding tasks. Highly capable at complex instruction-following.
> - **gemini-3.1-pro:** The stable mid-tier model in the current lineup. Ideal for review, critique, and general analysis.
> - **gemini-3.5-flash (Low):** The stable, lowest-tier model in the current lineup. Extremely cost-efficient and ideal for mechanical operations, file checks, and routine formatting.

Not all agents need the same model. Each agent file has a `model:` field in its YAML frontmatter. By default, all agents use `model: inherit` (they use whatever model your main session runs). But you can customize this to optimize cost:

| Task Type | Recommended Model | Why | Examples |
|---|---|---|---|
| Complex review / audit | `model: gemini-3.5-flash (High)` | Needs deep reasoning and synthesis | claim-verifier, editor, methods-referee |
| Review / critique | `model: gemini-3.1-pro` | Good balance of reasoning ability and cost | r-reviewer, slide-auditor, proofreader |
| Fast, mechanical work | `model: gemini-3.5-flash (Low)` | Speed and cost efficiency are paramount | quarto-fixer, TikZ extraction |
| Default | `model: inherit` | Uses whatever the main session runs | any unrouted subagent |

**The principle:** Use the highest-tier `gemini-3.5-flash (High)` model for tasks that require holding multiple large contexts in mind simultaneously (translation, adversarial review, claim verification). Route review/critique tasks to `gemini-3.1-pro`, and mechanical tasks to the highly cost-efficient `gemini-3.5-flash (Low)` model. Let everything else inherit.

To change an agent’s model, edit its YAML frontmatter:

```
---
name: quarto-critic
model: gemini-3.5-flash (High)   # was: inherit
---
```

> **Cost Savings**
>
> If you configure model-per-agent, a typical Beamer-to-Quarto translation runs the critic on `gemini-3.5-flash (High)` (2–4 rounds) while the fixer runs on `gemini-3.5-flash (Low)` (same rounds). This can save roughly 50–80% compared to running everything on the highest tier, with no quality loss on the fixing step.

### Advanced Agent Configuration

Beyond model selection, agent definitions support several configuration fields:

| Field | Purpose | Example |
|---|---|---|
| `model` | Force a specific model | `gemini-3.5-flash (Low)`, `gemini-3.1-pro`, `gemini-3.5-flash (High)` |
| `maxTurns` | Limit agent iterations | `10` (prevents runaway loops) |
| `isolation` | Run in a git worktree | `worktree` (see Pattern 12) |
| `effort` | Override reasoning effort | `high` |
| `permissionMode` | Restrict permissions | `plan` (read-only agent) |
| `tools` | Whitelist specific tools | `["Read", "Grep", "Glob"]` |
| `disallowedTools` | Blacklist specific tools | `["Write", "Edit"]` |
| `skills` | Make specific skills available | `["compile-latex"]` |
| `background` | Run concurrently | `true` |

Example: a read-only proofreader that can’t edit files:

```
---
name: proofreader
model: gemini-3.5-flash (High)
maxTurns: 15
tools: ["Read", "Grep", "Glob"]
---
```

Use `maxTurns` to prevent review agents from looping indefinitely, and `tools` to enforce read-only behavior for agents that should only produce reports.

### Cost-Conscious Composition: Caching, Routing, and Diagnostics

Cost is invisible until you look at the monthly invoice. Three levers, in order of impact:

**1. Context caching.** Google’s Context Caching for the Gemini API lets repeated prefix tokens (system instructions, personal memory, large codebase context, and reference documents) bypass active input token costs, running at a fraction of the standard price.

- **Automatic management:** Antigravity handles cache construction and prefix alignment automatically behind the scenes.
- **Default TTL:** Cached context typically persists for a default TTL of 1 hour, making it highly effective for rapid iterative session turns.

**2. Per-agent model routing.** The Multi-Model Strategy table above lists the principle; the **70/20/10 pattern** is the operational form:

| Model | Share of subagent calls | Use for |
|---|---|---|
| **gemini-3.5-flash (Low)** | ~70% | Mechanical work: TikZ extraction, citation reformatting, bib validation, proofread fixes, simple file lookups |
| **gemini-3.1-pro** | ~20% | Review and critique: r-reviewer, slide-auditor, proofreader, humanize-auditor |
| **gemini-3.5-flash (High)** | ~10% | High-judgment work: editor, domain-referee, methods-referee, claim-verifier, manuscript review, quarto-critic |

Set per-agent via `model:` in `.agents/agents/<name>.md` frontmatter. Typical savings vs. all-Pro: **50–80% on routed skills**, with no quality loss on the mechanical tier. This pattern aligns with industry-standard architect/editor splits.

**3. Effort budgeting.** Some Gemini models support customizable reasoning effort levels. Default to `medium` or standard modes for routine reviews and formatting, and reserve higher effort configurations for deep academic audits, comprehensive paper reviews, or complex codebase refactors.

> **Monitoring: Session Stats**
>
> You can monitor session token usage and costs via standard platform developer dashboards. Review your usage after any large `review-paper --peer` pipeline to verify that your Context Caching hit rate is healthy and your model routing is working correctly.

> **Google API Quota Limits**
>
> Headless subprocess runs (`antigravity -p`) and parallel subagent spawning can consume API rate limits (TPM/RPM) and quotas quickly. If your pipeline fails with rate-limiting errors (HTTP 429), configure exponential backoff in your client configuration or request a quota increase in Google AI Studio or GCP Console. See [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) for details.

## Settings — Permissions and Hooks

`.agents/settings.json` controls what Gemini is allowed to do. Here is a simplified excerpt — the template includes additional permission entries for git, R, Quarto, and more:

```
{
  "permissions": {
    "defaultMode": "bypassPermissions",
    "allow": [
      "view_file",
      "create_file",
      "edit_file",
      "run_command",
      "list_directory",
      "search_directory",
      "start_subagent"
    ]
  },
  "hooks": {
    "on_session_end": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 \"$ANTIGRAVITY_PROJECT_DIR\"/.agents/hooks/log-reminder.py",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

**Permission modes.** Antigravity has five permission modes that control how much autonomy Gemini gets:

| Mode | Internal Name | Behavior | When to Use |
|---|---|---|---|
| **Normal** | `default` | Asks before risky actions | Day-to-day work — approve each edit |
| **Auto-accept edits** | `acceptEdits` | Auto-approves file edits | Trusted batch operations (rename across 20 files) |
| **Don’t ask** | `dontAsk` | Auto-denies tools unless pre-approved in allowlist | Restricted environments where only allowlisted tools run |
| **Plan** | `plan` | Read-only — no edits allowed | Exploring code, reviewing before acting |
| **Auto** | `auto` | Classifier-gated; everything runs unless flagged risky (Mar 2026 Week 13; the `--enable-auto-mode` flag is no longer required for Max + gemini-3.5-flash (High) users as of Apr 2026 Week 16) | Long autonomous tasks with safety net — the recommended mode for trusted repos when bypass is too permissive |
| **Bypass** | `bypassPermissions` | Skips all permission prompts | CI/CD pipelines, headless scripts (still prompts on protected paths: `.git`, `.vscode`, `.idea`, `.husky`, `.agents` minus carve-outs `commands`/`agents`/`skills`/`worktrees`) |

Set via CLI flag (`antigravity --permission-mode plan`), the `/config` command, or `permissions.defaultMode` in `settings.json`.

### The Six-Layer Permission Stack

Permission mode is not resolved from a single file. Antigravity honors **six layers**, with later layers overriding earlier ones:

| # | Layer | Location | Key |
|---|---|---|---|
| 1 | VSCode user | `~/Library/Application Support/Code/User/settings.json` (macOS), `~/.config/Code/User/settings.json` (Linux), `%APPDATA%/Code/User/settings.json` (Windows) | `antigravity.initialPermissionMode` |
| 2 | VSCode workspace | `<repo>/.vscode/settings.json` | `antigravity.initialPermissionMode` |
| 3 | CLI user | `~/.agents/settings.json` | `permissions.defaultMode` |
| 4 | CLI project | `<repo>/.agents/settings.json` | `permissions.defaultMode` |
| 5 | CLI project-local (gitignored) | `<repo>/.agents/settings.local.json` | `permissions.defaultMode` |
| 6 | **In-session runtime** | (ephemeral) | toggled via `Shift+Tab` / `/permission-mode` |

**Layer 6 is authoritative** and catches most users off-guard. `initialPermissionMode` only fires at **session start** — if you (or `Shift+Tab`) change modes mid-session, every file-level layer is ignored until the session ends.

### Troubleshooting: Prompts Fire Despite `bypassPermissions`

This is the single most common source of confusion. Work through the checklist in order:

1. **Look at the status line** at the top of the Antigravity panel. With this repo’s `statusLine` configured, it prints `[BYPASS]`, `[PLAN]`, `[AUTO-EDIT]`, or `[PROMPT]` for the four standard modes. Any other mode Antigravity reports (e.g., `dontAsk`) is shown as a bracketed raw name like `[dontAsk]`. If it doesn’t say `[BYPASS]`, you have an in-session override — press `Shift+Tab` to cycle modes until you land on bypass.
2. **Run `permission-check`** to see every layer’s value, the resolved merged state, and any drift (e.g., project says bypass but project-local says default).
3. **Check for stale sessions.** If settings changed recently but the session predates the change, it still runs under the old mode. Reload the window (`Cmd+Shift+P` → “Developer: Reload Window”) and start a new session.
4. **Check `deny` lists.** A match in any layer’s `deny` blocks the tool regardless of `allow` entries elsewhere.
5. **VSCode vs CLI split.** If the VSCode layers say bypass but no CLI layer does, a terminal-launched Antigravity will still prompt. Align them.

### The Plan → Bypass Handoff (Recommended Daily Driver)

Plan mode and bypass permissions sound like opposites, but they chain into a single workflow that gives you a **review-before-execute convenience**: you see the approach before any edits happen, then execution runs without per-tool prompts.

> **Plan approval is not an enforcement boundary**
>
> Approving a plan via `ExitPlanMode` releases the session to your `defaultMode` — typically `bypassPermissions`. Once there, any subsequent tool call (Edit, Write, Bash) executes under the full allowlist in your `settings.json`, not a scope derived from the plan. A mistaken implementation can still edit unrelated files or run destructive shell commands with no second checkpoint.
>
> Treat this flow as a convenience pattern, not a security control. If you need a hard enforcement boundary, keep `defaultMode: "default"` and approve each high-risk tool individually, or run the whole session in `plan` mode and copy actions out manually.

The flow:

```
Start session in plan mode  (Shift+Tab at startup, or antigravity --permission-mode plan)
     |
     | Read-only exploration + planning
     |   Gemini can Read, Grep, run Bash readonly, spawn Explore/Plan agents
     |   Gemini CANNOT edit files (except the plan file itself)
     |
     v
Plan drafted, saved to quality_reports/plans/YYYY-MM-DD_description.md
     |
     v
User approves via ExitPlanMode UI
     |
     v
Antigravity returns the session to defaultMode.
     |
     | If defaultMode = bypassPermissions, execution now runs
     | without approval prompts.
     v
Orchestrator executes the plan end-to-end --- no prompts.
```

**Why this is the recommended daily flow:**

- You always see the approach before any edits happen (plan mode is read-only).
- Once you approve, every downstream action — edits, bash, multi-file refactors — runs without interruption.
- No need to remember to toggle bypass mid-session. The handoff is automatic.
- Fits cleanly with the plan-first rule enforced by this repo.

**Prerequisite:** your `defaultMode` must be `bypassPermissions` in at least one CLI layer (typically the project or project-local layer). Without that, exiting plan mode returns you to `default` and you’re back to per-tool prompts.

### Session Management

A handful of recent Mar–Apr 2026 commands cut friction in the actual editing loop. Worth knowing before you reach for them in a panic:

| Command / shortcut | What it does | When to reach for it |
|---|---|---|
| `/btw <question>` | Asks a side question whose answer appears in a dismissible overlay — never enters conversation history | Quick “what does X do?” / “is this version compatible?” questions you don’t want bloating context |
| `Esc Esc` or `/rewind` | Opens the rewind menu — restore conversation, code, or both to a prior checkpoint | Tried something risky, want to undo cleanly without `git reset` (checkpoints are NOT git — only Gemini-made changes are tracked) |
| `/clear` | Resets the conversation context entirely | Switching to an unrelated task; long session with cluttered context |
| `/compact <instruction>` | Guided summarization of the current conversation | “Compact, focusing on the API changes” — selective preservation before continuing on the same task |
| `Ctrl+G` (in plan mode) | Opens the in-progress plan file in `$EDITOR` for direct editing before approval | You want to surgically tweak the plan without typing instructions back to Gemini |
| `antigravity --continue` / `antigravity --resume` | Resume the most recent conversation (`--continue`) or pick from recent (`--resume`); rename with `/rename` | Picking up a multi-day project — treat sessions like branches |
| `checkpoint <slug>` | Writes a structured state snapshot to `quality_reports/checkpoints/` (this template, not Anthropic’s) | Before stopping or handing off — companion to the narrative session log |
| `/goal <verifiable condition>` | Sets an end-state condition; Gemini keeps working across turns until a fast model confirms it holds (Apr 2026 Week 20, v2.1.139) | “All R scripts pass without errors”, “Figure 3 renders to PDF without overflow” — pair with `commit` quality gates for verified-end-state runs |

**Three patterns that compose well:**

- **Side question without polluting context:** `/btw why does Quarto need ::: for callouts?` — get the answer, dismiss, keep working.
- **Long session, want to switch tasks:** `checkpoint current-work` then `/clear` then start the new task. Resume the first with `antigravity --resume`.
- **Plan mid-edit:** During plan mode, `Ctrl+G` to edit the plan file directly — faster than dictating revisions back to Gemini.

> **Plans Directory**
>
> By default, Gemini saves plans to a global directory (`~/.agents/plans/`), not your project. To keep plans with your project (and in git), add this to `.agents/settings.json`:
>
> ```json
> {
>   "plansDirectory": "quality_reports/plans"
> }
> ```

The **Stop hook** runs a fast Python script after every response. No LLM call, no latency. It checks whether the session log is current and reminds Gemini to update it if not. Behavioral rules like verification and Beamer-Quarto sync are enforced via auto-loaded rules in `.agents/rules/`, which is the right tool for nuanced judgment that Gemini can evaluate in-context.

## Effort Levels — Cost vs. Thoroughness

Antigravity lets you control how deeply it reasons about each task. Higher effort means more “thinking tokens” and better results — but higher cost.

| Level | Thinking Budget | Academic Use Case | Relative Cost |
|---|---|---|---|
| `low` | Minimal | Quick formatting, grep, file renames | $ |
| `medium` | Standard | Most tasks (default for gemini-3.5-flash (High)) | $$ |
| `high` | ~10k tokens | Complex derivations, paper reviews | $$$ |
| `xhigh` | ~20k tokens | **Recommended for gemini-3.5-flash (High) coding** (introduced Apr 2026 Week 16) | $$$ |
| `max` / ultrathink | ~32k tokens | Deep proofs, multi-step analysis | $$$$$ |

**How to set effort:**

- **Per-session:** Type `/effort high` (or `/effort xhigh` for gemini-3.5-flash (High) coding work). Typing `/effort` on its own opens an **interactive slider** (Apr 2026 Week 16).
- **Per-skill:** Add `effort: high` to skill frontmatter (see Skill Frontmatter Reference)
- **Keyboard toggle:** `Option+T` (Mac) / `Alt+T` (Windows/Linux) toggles extended thinking
- **In prompts:** Include “ultrathink” in your prompt to enable extended thinking for that turn. Note: phrases like “think hard” are treated as regular instructions and do *not* allocate extra thinking tokens
- **Environment variable:** `ANTIGRAVITY_CODE_EFFORT_LEVEL=high` for all sessions
- **Hooks can read it:** As of Apr 2026 Week 19, hook input includes `effort.level` and `$ANTIGRAVITY_EFFORT` is set in Bash subprocess env — useful for skipping expensive verification on low-effort runs

> **Composing Effort with Model Choice**
>
> Effort levels compose with model selection for fine-grained cost control. For example, `gemini-3.5-flash (Low) + high effort` costs less than `gemini-3.5-flash (High) + low effort` but may produce comparable results for bounded tasks like formatting. Use `gemini-3.5-flash (High) + max` only for tasks that genuinely require deep multi-step reasoning — complex proofs, intricate data pipeline debugging, or comprehensive paper critique.

## Memory — Cross-Session Persistence

Antigravity has an auto-memory system at `~/.agents/projects/[project]/memory/MEMORY.md`. This file persists across sessions and is loaded into every conversation.

Use it for:
- Key project facts that never change
- Corrections you don’t want repeated (`[LEARN:tag]` format)
- Current plan status

```
# Auto Memory

## Key Facts
- Project uses XeLaTeX, not pdflatex
- Bibliography file: Bibliography_base.bib

## Corrections Log
- [LEARN:r-code] Package X drops obs silently when covariate is missing
- [LEARN:citation] Post-LASSO is Belloni (2013), NOT Belloni (2014)
- [LEARN:workflow] Every Beamer edit must auto-sync to Quarto
```

#### Two-tier memory architecture (`MEMORY.md` vs `personal-memory.md`)

The template splits memory into two tiers (see [`meta-governance.md`](.agents/rules/meta-governance.md)):

- **`MEMORY.md`** (committed, ≤ 200 lines) — generic learnings that help all forkers: workflow patterns, design principles, documentation standards, quality thresholds that transfer across domains.
- **`.agents/state/personal-memory.md`** (gitignored, no size cap) — machine-specific and user-specific learnings: TeX install quirks, file paths, personal effort preferences, tool-version workarounds.

When a fork user does `git clone`, they get the generic `MEMORY.md`. Their own `personal-memory.md` builds up locally as they work.

#### `promote-memory` — graduating learnings (v1.9.0)

The two-tier split poses one question: *who decides which `[LEARN]` entries graduate from `personal-memory.md` to `MEMORY.md`?* The answer is a **five-critic council**.

`promote-memory [filter]` runs five critics in parallel, each reviewing one dimension:

1. **Generality** — would a non-econ forker benefit?
2. **Staleness** — does this contradict current code (`grep` the referenced files)?
3. **Redundancy** — is it already in MEMORY.md, GEMINI.md, or a rule?
4. **Evidence** — does it cite the originating incident / file / why?
5. **Format** — does it follow `[LEARN:category] wrong → right`?

Majority (3+ of 5 YES) recommends promotion; the user approves the final move. Critics run in *isolated forked contexts* — they cannot see each other’s votes — so dimensions are reviewed independently, no groupthink. Critics use Haiku (per [model-routing.md](.agents/rules/model-routing.md)) since the review is mechanical-ish.

When to run: monthly as memory-maintenance, before sharing a fork, after a paper or course cycle ships, or wired as a `/loop` task.

### Plans — Compression-Resistant Task Memory

While MEMORY.md stores long-lived project facts, **plans** store task-specific strategy. Every non-trivial plan is saved to `quality_reports/plans/` with a timestamp. This means:

- Plans survive auto-compression (they are on disk, not just in context)
- Plans survive session boundaries (readable in any future session)
- Plans create an audit trail of design decisions

See Pattern 1 in Workflow Patterns for the full protocol.

### Session Logs — Why-Not-Just-What History (with Automated Reminders)

Git commits record what changed, but not *why*. Session logs fill this gap. Gemini writes to `quality_reports/session_logs/` at three points: right after plan approval, incrementally during implementation (as decisions happen), and at session end. This means the log captures reasoning *as it happens*, before auto-compression can discard it.

Because relying on instructions alone is fragile (Gemini forgets during long sessions), a **Stop hook** (`.agents/hooks/log-reminder.py`) fires after every response. It tracks how many responses have passed since the session log was last updated. After a threshold, it blocks Gemini from stopping until the log is current. This turns a best practice into an enforced behavior.

New sessions can read these logs to understand not just the current state of the project, but the reasoning behind it. See Pattern 1 in Workflow Patterns for the full protocol.

### How It All Fits Together

With GEMINI.md, MEMORY.md, plans, and session logs, the system has four distinct memory layers. Here is what each one does and when it matters:

| Layer | File | Survives Compression? | Updated When | Purpose |
|---|---|---|---|---|
| Project context | `GEMINI.md` | Yes (on disk) | Rarely | Project rules, folder structure, commands |
| Corrections | `MEMORY.md` | Yes (on disk) | On `[LEARN]` tag | Prevent repeating past mistakes |
| Task strategy | `quality_reports/plans/` | Yes (on disk) | Once per task | Plan survives planning-to-implementation handoff |
| Decision reasoning | `quality_reports/session_logs/` | Yes (on disk) | Incrementally | Record *why* decisions were made |
| Conversation | Gemini’s context window | **No** (compressed) | Every response | Current working memory |

The first four layers are your safety net. Anything written to disk survives indefinitely. The conversation context is ephemeral — auto-compression will eventually discard details. The workflow’s design ensures that anything worth keeping is written to one of the four persistent layers before compression can erase it.

### Hooks — Automated Enforcement

The session log reminder above is one example of a broader pattern: using **hooks** to enforce rules that Gemini might otherwise forget during long sessions. Rules live in context and can be compressed away. Hooks live in `.agents/settings.json` and fire every time, regardless of context state.

The template includes hooks for logging, notifications, and context survival:

| Hook | Event | What It Does |
|---|---|---|
| Session log reminder | `Stop` | Reminds about session logs after every response |
| Desktop notification | `Notification` | Desktop alert when Gemini needs attention (macOS/Linux) |
| Context state capture | `PreCompact` | Saves plan state before auto-compaction |
| Context restoration | `SessionStart[compact\|resume]` | Restores context after compaction or resume |
| Context monitor | `PostToolUse[Bash\|Task]` | Progressive warnings at 40%/55%/65%/80%/90% context |
| Verification reminder | `PostToolUse[Write\|Edit]` | Reminds to compile/render before marking done |

Verification and Beamer-Quarto sync are enforced via auto-loaded rules, which are the right tool for nuanced judgment. Hooks are reserved for enforcement that *must* survive context compression.

**Hook handler types.** The examples above use `command` hooks (shell scripts), but Antigravity supports four handler types:

| Type | How It Works | Best For |
|---|---|---|
| **`command`** | Runs a shell script. Exit 0 = allow, exit 2 = block (PreToolUse only) | File protection, state capture, notifications |
| **`prompt`** | Injects text into Gemini’s conversation — no script needed | Soft reminders: “Check that equations compile before saving” |
| **`http`** | POSTs to an external endpoint | CI/CD integration, logging to external services |
| **`agent`** | Spawns a subagent that can use tools to verify conditions | Complex validation requiring multi-step checks |

**PreToolUse input modification.** PreToolUse hooks can now **modify tool inputs**, not just block or allow. Your hook script can return modified JSON to rewrite parameters before the tool executes — for example, auto-correcting file paths or enforcing naming conventions.

> **Hook Design Principle**
>
> Use **command hooks** for fast, mechanical checks (file exists? counter threshold?). Use **prompt hooks** for soft guidance that doesn’t need a script. Use **rules** for nuanced judgment (did Gemini verify correctly?). Avoid prompt hooks that fire on high-frequency events — the injected text adds up in context.

### Context Survival System (Advanced)

When context compaction happens, Gemini loses working memory. The **context survival system** ensures you can recover seamlessly.

#### How It Works

Two hooks work together to preserve and restore state:

```
Session running → context fills up → PreCompact fires
                                           ↓
                                    pre-compact.py saves:
                                    • Active plan path
                                    • Current task
                                    • Recent decisions
                                           ↓
                                    Auto-compaction happens
                                           ↓
                                    SessionStart(compact|resume) fires
                                           ↓
                                    post-compact-restore.py:
                                    • Reads saved state
                                    • Prints context summary
                                    • Gemini knows where it left off
```

#### What Gets Saved

| State | Location | Purpose |
|---|---|---|
| Plan path | Session cache | So Gemini can read the plan file |
| Current task | Session cache | First unchecked `- [ ]` item |
| Recent decisions | Session cache | Last 3 decision-like entries from session log |
| Compaction note | Session log | Timestamp marker for reference |

#### Context Monitoring

The `context-monitor.py` hook tracks approximate context usage and provides progressive warnings:

| Threshold | Message | Purpose |
|---|---|---|
| 40%, 55%, 65% | Suggest `learn` | Capture non-obvious discoveries before compaction |
| 80% | Info message | Auto-compact approaching, no rush |
| 90% | Caution | Complete current task with full quality |

Use `/context-status` to check current session health at any time.

Note: the monitor uses tool call count as a proxy for context usage, so warnings may appear earlier or later than actual compaction.

#### Recovery After Compaction

If compaction happens mid-task, Gemini will automatically see:

1. **Restoration message** — what plan was active, what task was in progress
2. **Recovery actions** — read the plan, check git status, continue

You can also manually point Gemini to the right context:

> “We just had compaction. Read `quality_reports/plans/2026-02-06_translate-lecture5.md` and continue from where we left off.”

#### Distil before compaction: `compress-session` (v1.9.0)

Auto-compaction is *lossy* — it keeps recent turns and drops earlier ones, with no preservation of *what was decided* mid-session. For long pipelines (long debug sessions, multi-decision refactors, end-of-working-day handoffs), `compress-session` is the **distil-not-truncate** alternative: structured note with Active state, Decisions made, Files touched, Open questions, Next actions, and explicitly **Discarded as noise** (failed hypotheses that should NOT carry forward).

`compress-session` and `checkpoint` are companions, not substitutes:

|  | `checkpoint` | `compress-session` |
|---|---|---|
| **When** | Natural stop-points (end of day, model switch, collaborator handoff) | Forced compression (long pipeline, accumulated noise, approaching auto-compact) |
| **What’s preserved** | Active plan, decisions, file pointers, next actions | Same, plus explicit “discarded as noise” line |
| **Output** | `quality_reportscheckpoints/` | `quality_reports/session_logs/YYYY-MM-DD_compression_<slug>.md` |
| **`[LEARN]` proposals** | Optional | Always proposes (distillation is when lessons surface) |

The “Discarded as noise” section is the novel contribution: failed hypotheses and dead-end debugging paths are listed explicitly so they do NOT ghost-haunt future sessions. This defends against [Drew Breunig’s “context poisoning”](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html) failure mode — hallucinated or wrong content from early turns getting quoted by later turns.

> **2026 Feature Coverage**
>
> Now that you understand the building blocks, here’s what’s new: Antigravity has added effort levels for cost control, expanded hook events, skill frontmatter fields for fine-grained skill configuration, permission modes for controlling Gemini’s autonomy, advanced agent configuration, plugins, `/batch` for parallel refactoring, and headless CLI mode. Each is covered in its respective section above.

---

# Workflow Patterns

The first two patterns are **meta-patterns** — they govern how every task flows. Learn these first, then the specific workflows make more sense.

## Pattern 1: Plan-First Development

The plan-first pattern ensures that non-trivial tasks begin with thinking, not typing.

### Why Planning Matters

The most common failure mode in AI-assisted development is not bad code — it is solving the wrong problem, or solving the right problem in a fragile order. Plan-first development forces an explicit design step before any file is touched. Plans are saved to `quality_reports/plans/` on disk, so they survive context compaction.

Without a plan:

- Gemini starts editing immediately, discovers a dependency on slide 3 that changes the approach, and has to undo work
- Context compression discards the reasoning behind a design choice, and Gemini makes a contradictory decision later
- The user and Gemini have different mental models of what “done” looks like

With a plan:

- The approach is agreed upon before any edits happen
- The plan is saved to disk, so it survives compression and session boundaries
- Implementation has a checklist to follow, reducing drift

### The Protocol

```
Non-trivial task arrives
  |
  +-- Step 1: Gemini enters plan mode (automatic, or say "plan this first")
  +-- Step 2: Draft plan (approach, files, verification)
  +-- Step 3: Save to quality_reports/plans/YYYY-MM-DD_description.md
  +-- Step 4: Present plan to user
  +-- Step 5: User approves (or revises)
  +-- Step 6: Save initial session log (capture context while fresh)
  +-- Step 7: Orchestrator takes over (see Pattern 2)
  +-- Step 8: Update session log + plan status to COMPLETED
```

### Context Preservation

Plans are saved to disk specifically so they survive context compression. The rule: **avoid `/clear`** — prefer auto-compression. Use `/clear` only when context is genuinely polluted.

For details on how the system automatically preserves and restores context during compaction, see Context Survival System in the Building Blocks section.

### Session Logging

Session logs (`quality_reports/session_logs/YYYY-MM-DD_description.md`) are a running record of *why* things happened. They have **three distinct behaviors**, each solving a different problem:

**After plan approval** — create the log with the goal, plan summary, and rationale for the chosen approach (including rejected alternatives). This captures decisions while context is richest. If you wait, auto-compression may discard the reasoning.

**During implementation** — append to the log as you work. Every time a design decision is made, a problem is discovered, or the approach deviates from the plan, write a 1-3 line entry immediately. This is the most important behavior: context gets compressed as the session progresses, and decisions that live only in the conversation will be lost.

**At session end** — add a final section with what was accomplished, open questions, and unresolved issues.

> **Why Session Logs Matter**
>
> **Git records what; session logs record why.** A commit message says “Update Lecture 5 TikZ diagrams.” A session log says “Redesigned the TWFE decomposition diagram because the DA challenge revealed students couldn’t trace the path from weights to bias. Considered a table format but chose a flow diagram because it shows directionality.”
>
> **Incremental logging is the key.** A 4-hour session that only logs at the start and end loses everything in the middle. Appending decisions as they happen means auto-compression can never erase them — they are already on disk.

Gemini writes all three log entries automatically — no need to ask.

> **Weekly Reviews**
>
> For multi-project academics, start each week by asking Gemini to read all session logs from the past week and synthesize a status report with priorities and open questions. The session log infrastructure already captures what you need — the weekly review is just a synthesis prompt: *“Read all session logs from this week. Summarize: what was accomplished, what’s blocked, what should I prioritize next?”*

## Pattern 2: Contractor Mode (Orchestrator)

Once a plan is approved, the orchestrator takes over. It is the natural continuation of Pattern 1: the plan says *what*, the orchestrator handles *how* — autonomously.

### The Mental Model

Think of the orchestrator as a **general contractor**. You are the client. You describe what you want. The plan-first protocol is the blueprint phase. Once you approve the blueprint, the contractor takes over: hires the right specialists (agents), inspects their work (verification), sends them back to fix issues (review-fix loop), and only calls you when the job passes inspection (quality gates).

### The Loop

```
User: "Translate Lecture 5 to Quarto"
  |
  |-- Plan-first (Pattern 1): draft plan, save to disk, get approval
  |
  |-- User: "Approved"
  |
  +-- Orchestrator activates:
        |
        Step 1: IMPLEMENT
        |  Execute plan steps (create QMD, translate content, etc.)
        |
        Step 2: VERIFY
        |  Run verifier: render Quarto, check HTML output
        |  If render fails -> fix -> re-render
        |
        Step 3: REVIEW (agents selected by file type)
        |  +--- proofreader ------+
        |  +--- slide-auditor ----+  (parallel)
        |  +--- pedagogy-reviewer +
        |  +--- quarto-critic ----+  (needs others first)
        |
        Step 4: FIX
        |  Apply fixes: Critical -> Major -> Minor
        |  For quarto-critic issues: invoke quarto-fixer
        |
        Step 5: RE-VERIFY
        |  Render again, confirm fixes are clean
        |
        Step 6: SCORE
        |  Apply quality-gates rubric
        |
        +-- Score >= 80?
              YES -> Present summary to user
              NO  -> Loop to Step 3 (max 5 rounds)
```

### Agent Selection

The orchestrator selects agents based on which files were touched:

| Files Modified | Agents Selected |
|---|---|
| `.tex` only | proofreader + slide-auditor + pedagogy-reviewer |
| `.qmd` only | proofreader + slide-auditor + pedagogy-reviewer |
| `.qmd` with matching `.tex` | Above + quarto-critic (parity check) |
| `.R` scripts | r-reviewer |
| TikZ diagrams present | tikz-reviewer |
| Domain content | domain-reviewer (if configured) |
| Multiple formats | verifier for cross-format parity |

Agents that are independent of each other run in parallel. The quarto-critic runs after other agents because it may need their context.

### “Just Do It” Mode

Sometimes you do not want to approve the final result — you just want it done:

> “Translate Lecture 5 to Quarto. Just do it.”

In this mode, the orchestrator still runs the full verify-review-fix loop (quality is non-negotiable), but skips the final approval pause and auto-commits if the score is 80 or above. It still presents the summary so you can see what was done.

### Relationship to Existing Skills

The orchestrator does NOT replace skills. It coordinates them:

- `qa-quarto` remains available as a standalone adversarial QA loop
- `slide-excellence` remains available for comprehensive multi-agent review
- `create-lecture` remains available as a guided creation workflow

The difference: when you invoke a skill directly, it runs its specific workflow. When the orchestrator is active, it decides which agents to invoke based on context. The orchestrator is the default; skills are for targeted use.

> **When to Use Skills vs. the Orchestrator**
>
> **Natural-language task** → Gemini picks a skill: “Translate Lecture 5 to Quarto” → Gemini invokes `translate-to-quarto`, and that skill runs the orchestrator pattern (translate → verify → review → fix → score) internally.
>
> **Explicit skill call:** `qa-quarto Lecture5` — you specifically want the adversarial critic-fixer loop, nothing else.
>
> Both are valid. The natural-language path is the “I trust you, pick the skill” path. Explicit skill calls are the “I know exactly which loop I want” path. Either way, the orchestrator pattern runs *inside* the invoked skill — there is no auto-trigger outside a skill.

## Pattern 3: Creating a New Lecture

The `create-lecture` skill guides you through a structured lecture creation workflow — from gathering source material to deploying polished slides:

```
create-lecture
  |
  +-- Phase 1: Gather materials (papers, outlines)
  +-- Phase 2: Design slide structure
  +-- Phase 3: Draft Beamer slides
  +-- Phase 4: Generate R figures
  +-- Phase 5: Polish and verify
  |     +-- slide-excellence (domain + visual + pedagogy)
  |     +-- proofread (grammar/typos)
  |     +-- visual-audit (layout)
  +-- Phase 6: Deploy
        +-- translate-to-quarto (optional)
        +-- deploy
```

> **TikZ diagrams: start from the gallery, not from scratch**
>
> Writing TikZ from a blank page reliably produces label-over-arrow collisions because the compiler doesn’t warn about them. The template ships three reinforcing layers:
>
> - **[`templates/tikz-snippets/`](https://github.com/pedrohcgs/antigravity-my-workflow/tree/main/templates/tikz-snippets)** — 8 production-ready standalone diagrams (DAG basic, DAG mediation, two-period DiD, event study, timeline, regression scatter, 3-step flowchart, supply-demand). Each embeds the prevention rules (explicit node dimensions, coordinate map, directional edge labels) by construction.
> - **Rules `tikz-prevention.md` + `tikz-measurement.md`** — Upstream authoring rules (P1–P6) and the six-pass collision protocol with formulas (Bézier depth, character widths, 0.4 cm boundary clearance). Adapted from Scott Cunningham’s [MixtapeTools](https://github.com/scunning1975/MixtapeTools).
> - **`new-diagram` skill** — Scaffolds from the gallery, runs the P3/P4 grep pre-check before compiling, invokes `tikz-reviewer` with measurement citations, loops until APPROVED.
>
> For existing diagrams in a Beamer deck, `extract-tikz` runs the same pre-check plus the SVG pipeline.

## Pattern 4: Translating Beamer to Quarto

Translation preserves all content while adapting format, converting TikZ to SVG and ggplot to interactive Plotly charts:

```
translate-to-quarto Lecture5_Topic.tex
  |
  +-- Phase 1-3: Environment mapping + content translation
  +-- Phase 4-5: Figure conversion (TikZ -> SVG)
  +-- Phase 6-7: Interactive charts (ggplot -> plotly)
  +-- Phase 8-9: Render + verify
  +-- Phase 10-11: qa-quarto adversarial QA
        +-- Critic: finds issues
        +-- Fixer: applies fixes
        +-- Critic: re-audits
        +-- ... (until APPROVED or 5 rounds)
```

## Pattern 5: Replication-First Coding

When working with papers that have replication packages:

```
Phase 1: Inventory original code
  +-- Record "gold standard" numbers (Table X, Column Y = Z.ZZ)

Phase 2: Translate (e.g., Stata -> R)
  +-- Match original specification EXACTLY (same covariates, same clustering)

Phase 3: Verify match
  +-- Compare every target: paper value vs. our value
  +-- Tolerance: < 0.01 for estimates, < 0.05 for SEs
  +-- If mismatch: STOP. Investigate before proceeding.

Phase 4: Only then extend
  +-- New estimators, new specifications, course-specific figures
```

> **Never Skip Replication**
>
> In one course, we discovered that a widely-used R package silently produced **incorrect estimates** due to a subtle specification issue. This bug was caught 3 times in different scripts. Without the replication-first protocol, these wrong numbers would have been taught to PhD students.

**Source-language coverage:** The pattern is language-agnostic. The template ships `data-analysis` for R-first projects and `stata-replication` (v1.9.0) for Stata-first projects (mirrors `data-analysis` exactly; same numbered-pipeline shape, different language; executes via the `stata-mcp` MCP server). Python-first projects follow the same convention with the path `scripts/python/_outputs/`. For Stata users, [`stata-code-conventions.md`](.agents/rules/stata-code-conventions.md) (v1.9.0) codifies the header (`version 18`, `clear all`, `set seed`/`set sortseed`), numbered pipeline (00–99), `esttab` for `\input{}` tables, clustering discipline (`reghdfe`), balance via `iebaltab`, and AEA Data Editor compliance.

> **Claims provenance via passport.yaml (v1.9.0)**
>
> Replication-first verifies the *current* state. A separate question: how do we keep manuscript and code in sync over the lifetime of a paper, especially during R&R?
>
> The answer is a per-paper `quality_reports/passports/<paper-slug>.yaml` that records, for each numeric claim in the manuscript, the script + line + output that produced it. Schema includes `tolerance`, `last_verified_on`, `status` (PASS / FAIL / STALE / UNVERIFIED). `audit-reproducibility` reads and rewrites the passport in place; `commit` reads it to block commits when a load-bearing claim is FAIL or STALE.
>
> Starter file: [`templates/passport-template.yaml`](templates/passport-template.yaml). Copy once per paper. Pattern attributed to [Imbad0202/academic-research-skills](https://github.com/Imbad0202/academic-research-skills) “Material Passport” concept (scope-reduced for this template: numeric claims only).

## Pattern 6: Multi-Agent Review

The `slide-excellence` skill runs up to 6 specialized agents in parallel:

```
slide-excellence Lecture5_Topic.tex
  |
  +-- Agent 1: Visual Audit (slide-auditor)
  +-- Agent 2: Pedagogical Review (pedagogy-reviewer)
  +-- Agent 3: Proofreading (proofreader)
  +-- Agent 4: TikZ Review (tikz-reviewer, if applicable)
  +-- Agent 5: Content Parity (if Quarto version exists)
  +-- Agent 6: Substance Review (domain-reviewer)
  |
  +-- Synthesize: Combined quality score + prioritized fix list
```

## Pattern 7: Self-Improvement Loop

There are two levels of self-improvement: **quick corrections** via `[LEARN]` tags and **full skill extraction** via `learn`.

### Quick Corrections: [LEARN] Tags

Every correction gets tagged for future reference in MEMORY.md:

```
## Corrections Log
- [LEARN:notation] T_t = 1{t=2} is deterministic -> use T_i in {1,2}
- [LEARN:citation] Post-LASSO is Belloni (2013), NOT Belloni (2014)
- [LEARN:r-code] Package X: ALWAYS include intercept in design matrix
- [LEARN:workflow] Every Beamer edit must auto-sync to Quarto
```

These tags are searchable and persist across sessions. When Gemini encounters a similar situation, it checks memory first.

### Automated Skill Capture: learn

For discoveries that deserve more than a one-line tag, use `learn` to create a full skill:

```
learn fixest-missing-covariate-handling
```

The `learn` skill guides you through a 4-phase workflow:

```
Phase 1: EVALUATE
  "Was this non-obvious? Would future-me benefit?"
  → If YES to any, continue
         ↓
Phase 2: CHECK EXISTING
  Search .agents/skills/ for related skills
  → Nothing related? Create new. Overlap? Update existing.
         ↓
Phase 3: CREATE SKILL
  Write to .agents/skills/[name]/SKILL.md
  • Problem statement
  • Trigger conditions (exact errors, symptoms)
  • Step-by-step solution
  • Verification steps
         ↓
Phase 4: QUALITY GATE
  • Description has specific triggers?
  • Solution verified to work?
  • Specific enough to be actionable?
  • General enough to be reusable?
```

#### When to Use learn

The context monitor suggests `learn` at 40%, 55%, and 65% context usage. Consider extracting a skill when you encounter:

| Trigger | Example |
|---|---|
| Non-obvious debugging | 10+ minute investigation not in docs |
| Misleading errors | Error message was wrong, found real cause |
| Workarounds | Found limitation with creative solution |
| Undocumented APIs | Tool integration not in official docs |
| Trial-and-error | Multiple attempts before success |
| Repeatable workflows | Multi-step task you’d do again |

#### Skill vs. [LEARN] Tag

| Situation | Use |
|---|---|
| One-liner fix | `[LEARN:category]` tag in MEMORY.md |
| Multi-step workflow | `learn` to create full skill |
| Error + root cause + solution | `learn` if reusable, `[LEARN]` if not |
| Package quirk | `learn` if affects multiple projects |

Skills saved to `.agents/skills/` survive compaction and session boundaries — if you discover something valuable late in a session, extract it with `learn` before compaction erases the details.

## Pattern 8: Devil’s Advocate

At any design decision, invoke the Devil’s Advocate:

> “Create a Devil’s Advocate. Have it challenge this slide design with 5-7 specific pedagogical questions. Work through each challenge and tell me what survives.”

This catches:

- Unstated assumptions
- Alternative orderings that might work better
- Notation that could confuse students
- Missing intuition before formalism
- Cognitive load issues

> **Fresh-Context Critique**
>
> A stronger variant: when Gemini reviews its own work in the same conversation, it suffers **confirmation bias** — it has internalized its own reasoning and will systematically find the work acceptable. The fix: spawn a new agent via the Task tool with NO access to the original conversation. Give it only the artifact and a critique prompt. The fresh agent has no sunk cost in the work and will be ruthless.
>
> > “Spawn a new agent. Have it read only my paper draft — not our conversation. Ask it to find the 5 weakest points and suggest how a hostile referee would attack each one.”
>
> Like handing your draft to a colleague who wasn’t in the room when you wrote it.

## Research Workflows

Patterns 1–8 apply broadly, with course materials as the primary example. The next four patterns are designed for **research projects** — papers, simulations, and empirical analysis — where the rhythm is different: ideas are uncertain, experiments may fail, and code is often written to answer a question rather than to ship. Patterns 13–14 then extend the foundation to reproducibility standards and presentation rhetoric.

### Pattern 9: Parallel Agents for Research Tasks

Antigravity can spawn **multiple agents simultaneously** using the Task tool. This is not limited to review — you can use it for any research or analysis task where independent subtasks can run at the same time.

#### When to Use Parallel Agents

| Scenario | Sequential (slow) | Parallel (fast) |
|---|---|---|
| Reviewing a lecture | Run proofreader, then auditor, then pedagogy | Run all 3 simultaneously |
| Analyzing 3 papers for a new lecture | Read paper 1, then 2, then 3 | Spawn 3 agents, each reading one paper |
| Generating figures | Create plot 1, then plot 2, then plot 3 | Spawn agents for independent plots |
| Comparing estimators | Run simulation 1, then 2, then 3 | Spawn agents for each simulation |
| Debating research design | Consider DiD, then SC, then RDD | 3 agents, each advocating one approach |

#### How It Works

You do not need to manage this manually. Skills that implement the orchestrator pattern (`create-lecture`, `review-paper --peer`, `slide-excellence`, etc.) can recognize independent subtasks within their scope and spawn parallel subagents via `context: fork` — both during implementation (Step 1) and review (Step 3). For example, when `slide-excellence` runs on a deck, it spawns the visual / pedagogy / proofread agents in parallel; when `review-paper --peer` runs, it spawns the two referees in parallel. The parallelism is built into the skill’s logic, not into a repo-wide daemon.

You can also request parallelism explicitly:

> “Read these three papers in parallel. For each, extract the key identification assumption, the main estimator, and whether they have a replication package. Summarize in a table.”

Either way, Gemini spawns up to 3 Task agents, each processing one paper simultaneously, then synthesizes the results.

#### Long-running tasks: Background Tasks and Schedulers

For genuinely long jobs — a 30-minute R fit, an `audit-reproducibility` batch over many tables, a Quarto render of a 200-slide deck — Antigravity allows launching processes as background tasks and scheduling notifications or check-ins. You can run long jobs in the background and let Antigravity notify you or proceed with other work in the meantime. No polling loop, no sleep cycles. Useful inside `data-analysis` for the regression step and inside `audit-reproducibility` when re-running the whole script suite.

#### Watching parallel agents

When several review agents run in parallel (such as the `review-paper --peer` editor and referee subagents, or `slide-excellence`’s visual, pedagogy, and proofread fan-out), you can list and monitor them using the subagent management tools. This allows you to track multiple background sessions on a single screen without opening one terminal per agent.

#### Agent Debates

A powerful variant: give each parallel agent a **distinct methodological perspective** and have them argue. Instead of asking “which estimator should I use?”, spawn 3 agents — one advocates for DiD, one for synthetic control, one for RDD — each arguing why their approach fits your research question best and critiquing the others. Synthesize the debate into a decision matrix. This produces genuinely diverse perspectives that a single conversation cannot, because each agent commits fully to its position.

#### Practical Limits

- **3 agents** is the sweet spot. More than that increases overhead without proportional speedup.
- Agents are **independent** — they cannot see each other’s work. If task B depends on task A’s output, they must run sequentially.
- Each agent consumes its own context window. For very large files, sequential processing may be more reliable.

> **Cost-Conscious Parallelism**
>
> Parallel agents multiply token usage. For cost-sensitive tasks, run the expensive work (Opus agents) sequentially and the cheap work (Sonnet agents) in parallel. The orchestrator already does this: it runs Sonnet-level reviewers in parallel, then the Opus-level critic sequentially.

### Pattern 10: Research Exploration Workflow

The **exploration workflow** provides a structured sandbox for experimental work.

#### The Problem

Without structure, experimental code scatters across the repository: analysis scripts in `scripts/`, test files in root, comparison documents in `quality_reports/`. After a week of exploration, the repo is cluttered with files that may or may not be useful, and nobody remembers which version was the good one.

#### The Solution: Exploration Folder

All experimental work goes into `explorations/` first:

```
explorations/
├── [active-project]/
│   ├── README.md           # Goal, hypotheses, status
│   ├── R/                  # Code iterations (_v1, _v2)
│   ├── scripts/            # Test scripts
│   └── output/             # Results
└── ARCHIVE/
    ├── completed_[name]/   # Graduated to production
    └── abandoned_[name]/   # Documented why stopped
```

#### Fast-Track vs. Plan-First

The decision tree is simple:

| Question | Answer | Workflow |
|---|---|---|
| “Will this ship?” | YES | Plan-First (80/100 quality) |
| “Am I testing an idea?” | YES | Fast-Track (60/100 quality) |
| “Does this improve the project?” | NO | Don’t build it |

Fast-Track explorations skip formal planning. Instead, a 2-minute **research value check** gates the work: “Does this improve the paper/slides/analysis?” If the answer is “maybe”, explore. If “no”, skip. If “yes”, use Plan-First rigor.

#### The Lifecycle

```
Research value check (2 min)
  ↓
Create explorations/[project]/ (5 min)
  ↓
Code without overhead (60/100 quality)
  ↓
Decision point (1-2 hours):
  ├── Graduate → Move to R/, scripts/, tests/ (upgrade to 80/100)
  ├── Keep exploring → Stay in explorations/
  └── Abandon → Archive with brief explanation
```

The **kill switch** is explicit: at any point, you can stop, archive with a one-paragraph explanation, and move on. No guilt, no sunk cost. See `.agents/rules/exploration-folder-protocol.md` and `.agents/rules/exploration-fast-track.md` for the full protocols.

#### Simplified Orchestrator for Research

The full orchestrator (Pattern 2) is designed for course materials with multi-agent review loops. For research projects, the **simple variant** strips this down to: implement → verify → score → done. No multi-round reviews, no parallel agent spawning. This lives in its own path-scoped rule (`.agents/rules/orchestrator-research.md`) that loads only when working on R scripts or explorations.

#### Merge-Only Quality Reporting

In research projects, commits are frequent and incremental. Generating a quality report for each commit creates noise. Instead, quality reports are generated **only at merge time** — a permanent snapshot of what was merged and why. Session logs capture the ongoing reasoning. See `.agents/rules/session-logging.md`.

### Pattern 11: Research Skills

Ten skills support the research workflow (including our mathematical and theoretical proof workflow):

| Skill | What It Does | When to Use |
|---|---|---|
| `lit-review [topic]` | Search, synthesize, and identify gaps in the literature | Starting a new project or section |
| `research-ideation [topic]` | Generate research questions, hypotheses, and empirical strategies | Brainstorming phase |
| `interview-me [topic]` | Interactive interview to formalize a vague idea into a concrete specification | When you have an intuition but not a plan |
| `review-paper [file]` | Full manuscript review with referee objections | Before submission or after a draft |
| `data-analysis [data]` | End-to-end R analysis: explore, regress, produce publication-ready output | Empirical analysis phase |
| `co-math-init` | Initialize a new AI co-mathematician research project | Starting a new theoretical proof paper |
| `co-math-status` | Render the current status of theoretical workstreams | Tracking project progress |
| `math-proof` | Write clear, detailed mathematical proofs | Writing proofs for a paper |
| `gemini-math` | Run Gemini 3.5 Pro as an adversarial co-processor (verify, write, explore modes) | Verifying or exploring complex proof steps |
| `proof-readability` | Audit math proofs for logical flow and readability | Polishing mathematical proofs |

These skills produce structured reports saved to `quality_reports/`. The `data-analysis` skill also generates R scripts (saved to `scripts/R/`) and runs the r-reviewer agent automatically.

> **review-paper --peer [journal] — simulated peer review pipeline**
>
> For submission-ready manuscripts, `review-paper --peer <journal>` runs an **editor + two dispositioned referees + editorial decision**, calibrated to the target journal. Editor calibration reads `.agents/references/journal-profiles.md`; the template ships profiles for **AER, QJE, JPE, ECMA, JoE** (econ) and **APSR, AJPS, JOP** (poli-sci). Other fields: add a profile, ~40 lines each.
>
> The methods-referee is **paper-type-aware** — the same skill picks different sanity checks based on what kind of paper this is:
>
> | Paper type | Methods-referee tilts toward | Sanity checks include |
> |---|---|---|
> | `reduced-form` | identification credibility, parallel-trends defence, robustness range | DiD pre-trends, IV first-stage, overlap, balance |
> | `structural` | model identification, counterfactual credibility, fit | moment-matching, sensitivity to functional form, out-of-sample |
> | `theory+empirics` | model-data correspondence | does the empirical estimand identify the theoretical object? |
> | `descriptive` | measurement validity, generalisability | sampling frame, missingness, comparator choice |
> | `formal-theory` (v1.8.0) | model originality, comparative-static sharpness | equilibrium existence, assumption tractability, robustness to relaxation |
> | `survey-experiment` (v1.8.0) | design, sampling, attrition + manipulation checks | balance, manipulation-check pass rate, attrition asymmetry, sampling-frame validity |
>
> R&R continuation is built in: `--r2` / `--r3` for response-to-referees rounds; `--stress` for a hostile-editor stress test. See `.agents/references/discipline-cards.md` for econ + poli-sci defaults (paper-type frequency, dominant journals, preregistration norms, code conventions). Forkers extend for psych / sociology / public-health.

#### The Research Lifecycle as a Dependency Graph

A research project is not a waterfall — it is a **dependency graph**. Some phases run in parallel; others are strictly sequential:

```
research-ideation ─────┐
                        ├──→ lit-review ──→ data-analysis ──→ review-paper
interview-me ──────────┘         ↑               ↑
                                  │               │
                          (can run in parallel)   │
                                                  │
                          (enter mid-pipeline: ───┘
                           start with data and
                           work backwards)
```

**Enter mid-pipeline.** You do not have to start from ideation. If you already have data, start with `data-analysis` and work backwards to the research question. If you already have a draft, start with `review-paper`. The skills are modular — use what you need, skip what you don’t.

> **For a Production-Grade Paper Pipeline**
>
> For a production-grade paper pipeline, a dedicated fork takes these same skills and wraps them in full research infrastructure: 6 worker-critic agent pairs plus specialized agents (data-engineer, referees, verifier), simulated blind peer review, weighted aggregate scoring, journal targeting, and R&R response routing. If your primary output is research papers, see The Ecosystem for details.

### Pattern 12: Branch Isolation with Git Worktrees (Advanced)

> **Advanced Pattern**
>
> This pattern is optional and primarily useful for major translations, risky refactors, or multi-day projects. Most day-to-day work doesn’t need it.

Git worktrees create a **separate working directory** linked to the same repository. Each directory has its own branch but shares commit history. Subagents can use worktrees via the `isolation: worktree` field (see Advanced Agent Configuration).

```
your-project/                     ← main branch (stays clean)
.worktrees/lecture-06-quarto/     ← isolated branch (Gemini works here)
```

#### Why Use Worktrees?

| Benefit | Example |
|---|---|
| **Safe experimentation** | Translate Lecture 6 to Quarto — if it fails, main is untouched |
| **Clean history** | 50 intermediate commits squash into one clean commit |
| **Easy discard** | Wrong approach? Delete worktree, no trace in main |
| **Multi-session work** | Resume worktree next day, no context loss |
| **Parallel work** | Work on slides (main) while Gemini translates (worktree) |

#### The Workflow

```
1. CREATE WORKTREE
   git worktree add .worktrees/lecture-06-quarto -b quarto/lecture-06
   cd .worktrees/lecture-06-quarto
         ↓
2. IMPLEMENT
   All changes happen in the worktree
   Commit frequently (intermediate commits are OK)
         ↓
3. VERIFY
   Run tests, render, review against worktree only
         ↓
4. SYNC TO MAIN (when ready)
   git checkout main
   git merge --squash quarto/lecture-06
   git commit -m "feat: add Lecture 6 Quarto version"
         ↓
5. CLEANUP
   git worktree remove .worktrees/lecture-06-quarto
   git branch -d quarto/lecture-06
```

#### Commands Reference

```
# Create a worktree with new branch
git worktree add .worktrees/[name] -b [branch-name]

# List active worktrees
git worktree list

# Remove a worktree (after merging or abandoning)
git worktree remove .worktrees/[name]

# Delete the branch (after removal)
git branch -d [branch-name]

# Squash-merge into main
git checkout main
git merge --squash [branch-name]
git commit -m "feat: description of changes"
```

> **worktree.baseRef (Apr 2026 Week 19)**
>
> Antigravity’s `EnterWorktree` tool branches fresh worktrees from a configurable base ref via the `worktree.baseRef` setting in `.agents/settings.json`:
>
> - `fresh` (default) — branch from the **remote default branch** (typically `origin/main`). Safest for clean experimentation.
> - `head` — branch from local `HEAD`. Use when you have uncommitted local work the worktree should inherit.
>
> The default surprises users with uncommitted in-flight edits: a `fresh` worktree won’t see those changes. If your workflow assumes “branch off whatever I’m looking at now,” set `"worktree.baseRef": "head"`.

#### When to Use

| Situation | Use Worktree? |
|---|---|
| Quick fix to one file | No — just edit main |
| New lecture creation | Maybe — if multi-session |
| Beamer → Quarto translation | Yes — many intermediate states |
| Major refactor | Yes — safe rollback |
| Experimenting with new approach | Yes — easy discard |

For example, translating Lecture 5 from Beamer to Quarto involves extracting TikZ diagrams, converting ggplot to plotly, and rewriting environments — dozens of intermediate files over multiple sessions. A worktree keeps main clean while you iterate.

#### Complexity Cost

- Adds ~3 commands to learn
- Adds mental model: “Where am I working?”
- Requires discipline to sync/discard, not leave orphan worktrees

For most novice users, working directly on main with frequent commits is simpler and sufficient. Use worktrees when the benefits of isolation outweigh the added complexity.

## Advanced Patterns: Reproducibility and Presentation Design

The patterns above use slides as the primary example, but the infrastructure is domain-agnostic. The next two patterns address dimensions no existing pattern covers: reproducibility standards and presentation rhetoric.

### Pattern 13: Reproducibility & Replication Compliance

Pattern 5 covers matching *someone else’s* results before extending them. This pattern is the complement: packaging *your own* work so that others — and journal data editors — can verify it.

#### The AEA Data Editor Standard

The [Template README for Social Science Replication Packages](https://social-science-data-editors.github.io/template_README/) is the compliance standard for the AEA, Review of Economic Studies, Economic Journal, and other major journals. It requires eight structured sections:

| Section | What It Covers |
|---|---|
| Overview | What the code does, data sources, software, runtime |
| Data Availability Statements | Provenance, access rights, redistribution permissions for every data source |
| Dataset List | Every data file: source, format, whether provided |
| Computational Requirements | Software versions, packages, random seeds, memory, runtime |
| Description of Programs | Directory structure, execution order, dependencies |
| Instructions to Replicators | Numbered steps — ideally one command |
| Table/Figure Mapping | Every exhibit mapped to the specific program and line that generates it |
| References | Proper bibliographic citations for all data sources |

The **Table/Figure Mapping** row is exactly what `passport.yaml` (v1.9.0) machine-encodes: each numeric claim → script + line + output file + tolerance + verified-on timestamp. The AEA requires the *spreadsheet-style* version; the passport is the *programmatic* version. They’re complementary — generate the AEA spreadsheet from the passport when you submit.

#### Pre-Submission Checklist

> **Replication Package Checklist**
>
> **Documentation:**
>
> - README follows the [template](https://social-science-data-editors.github.io/template_README/) with all 8 sections
> - PDF version of README included in root directory
> - Data citations appear in both README and manuscript
> - LICENSE.txt specifies code license (MIT/BSD) and data license (CC-BY)
>
> **Code:**
>
> - All software listed with exact version numbers
> - Setup script installs all dependencies (`0_setup.R`, `requirements.txt`, etc.)
> - Random seeds set deterministically (not timestamps)
> - Master script runs everything without manual intervention
> - Each table and figure produced by an identifiable, separate script
>
> **Data:**
>
> - Data Availability Statement for every data source, including confidential data
> - Rights certifications: legitimate access + redistribution permission
> - Directory structure separates raw, derived, and output data
>
> **Verification:**
>
> - Package re-executed in a clean environment
> - Results numerically identical to manuscript
> - Runtime and hardware requirements documented

#### Recommended Directory Structure

```
project/
├── README.pdf              # Following AEA template
├── LICENSE.txt             # Code: MIT/BSD; Data: CC-BY
├── data/
│   ├── raw/                # Source data (untouched)
│   └── derived/            # Processed/analysis data
├── code/
│   ├── 00_setup.R          # Install dependencies
│   ├── 01_dataprep/        # Data cleaning
│   ├── 02_analysis/        # Main results
│   └── 03_appendix/        # Appendix results
└── results/                # Output tables, figures
```

These standards load automatically via the path-scoped rule mechanism: when Gemini edits files matching `replication-protocol.md`’s path globs, the rule is injected into context without any manual invocation. Ask Gemini to *“prepare a replication package”* and the rule’s directory structure and checklist above guide the work from the first file touched.

> **Reproducibility as Architecture**
>
> A key principle that maps directly to this workflow: **separate scientific reasoning from computational execution.** Humans design diagnostic templates (what to measure); AI handles execution (how to run it).
>
> This is the template-executor architecture — and you are already using it:
>
> - **Your spec** (requirements specification) = the template. It says *what* must be true.
> - **The orchestrator** = the executor. It handles *how* to make it true.
> - **Plans** = why decisions were made (audit trail)
> - **Session logs** = reasoning documentation
> - **Git** = what changed and when
> - **MEMORY.md** = corrections and accumulated learning
>
> The `learn` skill already implements version-controlled knowledge accumulation: each discovery saved as a SKILL.md file with problem, solution, and verification steps — the same pattern sometimes called “structured knowledge bases.”
>
> Key insight: *“For a fixed pipeline version and fixed inputs, the workflow produces identical numerical outputs and retains a complete audit trail of intermediate artifacts and logs.”*

### Pattern 14: The Rhetoric of Decks

The slide-auditor checks *technical* quality (overflow, spacing). The pedagogy-reviewer checks *teaching* quality (notation density, prerequisites). Neither addresses *rhetorical* quality — whether the slides persuade, whether the argument flows, whether beauty serves function.

The [Rhetoric of Decks](https://github.com/scunning1975/MixtapeTools/tree/main/presentations) framework fills this gap.

#### The Three Laws

**Law 1: Beauty is function.** Beautiful slides are not decorated slides. Beauty is clarity made visible. Every element earns its presence. Nothing distracts from the point. “Decoration without function is noise.”

**Law 2: Cognitive load is the enemy.** One idea per slide. ONE. This is not a guideline — this is the law. The audience has limited working memory. Every unnecessary word, data point, or “just in case” inclusion steals bandwidth from the actual message.

**Law 3: The slide serves the spoken word.** “If your slides can be understood without you speaking, you have written a document and called it a presentation.” The slide is a visual anchor for speech — a focal point for attention, a memory hook for retention.

#### The MB/MC Equivalence

The most original contribution of this framework — applying marginal analysis to slide design:

> Optimal rhetoric equalizes the marginal benefit to marginal cost ratio across all slides: MB₁/MC₁ = MB₂/MC₂ = … = MBₙ/MCₙ

**What this means in practice:**

- **Overloaded slides** (MB/MC too low): text running into footer, competing ideas, audience gives up
- **Underloaded slides** (MB/MC too high): wasted opportunity, attention captured but unused
- **The goal is smoothness** — consistent cognitive load throughout — not maximum density
- **Exception**: deliberate “jump scares” — intentional spikes for rhetorical effect (a striking statistic, a provocative claim)

#### Actionable Principles

| Principle | Why | Anti-Pattern |
|---|---|---|
| Titles are assertions | “Treatment increased distance by 61 miles” carries the argument | “Results” tells the audience nothing |
| Bullets are defeat | A list says “I couldn’t find the structure” | Find the sequence, contrast, hierarchy, or causal chain |
| White space signals confidence | Crowded slides signal fear — fear of silence, fear of forgetting | Filling every pixel with text |
| Direct labels, not legends | Legends force the eye to travel; labels stay with the data | Color-coded legends requiring a key |
| One message per chart | If you can’t explain it in one sentence, it’s too complex | Multi-panel figures with competing stories |
| Min 24pt body, max 2 fonts | Sans-serif for projection; test from the back row | 12pt text, decorative fonts |

#### How Existing Agents Support This

The `slide-excellence` skill already invokes the pedagogy-reviewer and slide-auditor, which enforce many of these principles automatically. To enforce *all* of them — including title-as-assertion and MB/MC smoothness — customize the **domain-reviewer** agent (`.agents/agents/domain-reviewer.md`) with rhetoric-of-decks lenses. The orchestrator will then apply them during every review cycle without manual invocation.

> **The Full Framework**
>
> For the complete philosophical treatment — from Aristotle’s three modes of persuasion through neuroaesthetics and the Netflix analogy — see [The Rhetoric of Decks](https://github.com/scunning1975/MixtapeTools/tree/main/presentations). The repository includes a full essay, example Beamer decks with professional color palettes, a `theme_rhetoric()` ggplot2 theme, and a tested deck generation prompt for Antigravity.

### Pattern 15: Sequential Adversarial Audits

**Principle:** Run N independent audit passes, each focused on ONE dimension. Each auditor sees only the artifact — not previous audits — to prevent groupthink and anchoring bias.

This pattern differs from the parallel multi-agent review in Pattern 6. There, agents run simultaneously and findings are merged. Here, audits run **sequentially**, each producing an independent report. The independence is the point: a citation auditor shouldn’t be influenced by what the prose auditor flagged.

#### The Seven-Audit Protocol (for Papers)

Inspired by [GeminiCodeTools “The Editor”](https://github.com/aspi6246/GeminiCodeTools), this protocol runs seven sequential passes before submission:

1. **Abstract audit** — Does the abstract accurately reflect findings? Is it a compelling “storefront”?
2. **Introduction structure** — Does the intro follow a recognized template (classic, puzzle-first, contribution-first)?
3. **Section-by-section audit** — Data description, identification, results, robustness — each checked independently
4. **Argumentation audit** — Logical gaps, alternative explanations, missing qualifications
5. **Prose quality** — Passive voice, hedging, jargon density, paragraph flow
6. **Citation fidelity** — Every claim has a citation? Every citation is real and correctly referenced?
7. **“So What” test** — Five questions: What’s the question? Why does it matter? What did you find? How do you know? What does it mean?

#### How to Implement

Use `review-paper` for a comprehensive single-pass review. When you need deeper, independent audits (e.g., before journal submission), run each audit as a separate skill invocation with `context: fork` to ensure isolation:

```
You: "Run the seven-audit protocol on my paper"
Gemini: [Runs 7 sequential forked reviews, each blind to the others]
       → Produces 7 independent reports
       → Synthesizes into prioritized revision checklist
```

**Adapting for other artifacts:** The same principle works for replication packages (7 passes: code, data, documentation, licensing, runtime, outputs, README) or grant proposals (significance, approach, innovation, environment, budget).

**For the R&R stage (after referee comments arrive):** Use `respond-to-referees [report] [revised-manuscript]`. It parses each concern, classifies coverage (addressed / partially / deferred / disagreement), points to specific revisions, and drafts the response document using `templates/response-to-referees.md`.

### Pattern 16: Preregistration and Submission Discipline

**Principle:** Lock in your hypotheses, design, and analysis plan **before** you see the realised data. Preregistration is the strongest defence against p-hacking, HARKing, and forking-paths, and it’s increasingly mandatory for credibility in social-science venues. Pair it with `checkpoint` for a verifiable trail of what you committed to and when.

#### When preregistration matters

- **Before launching an experiment** (lab, field, or survey) — the canonical case.
- **Before analysing observational data** on a target population for a specific RQ. “I have the data but haven’t looked at the outcome variable yet” is the right moment.
- **During R&R** when a referee asks for a written preanalysis plan covering robustness specifications.
- **Funding** — NSF, NIH, OSF, AEA grants increasingly require a PAP at submission.

#### Choosing a registry

The template ships three styles via `preregister --style`:

| Registry | Style flag | Field | Length | Editable later? |
|---|---|---|---|---|
| **OSF** ([osf.io/registries](https://osf.io/registries)) | `osf` | Broad social science (default for psych, poli-sci, sociology) | Long-form, ~10–20 pages | Yes, with versioning |
| **AsPredicted** ([aspredicted.org](https://aspredicted.org)) | `aspredicted` | Behavioural / experimental short-form | 9 questions, ~2 pages | Locked once submitted |
| **AEA RCT Registry** ([socialscienceregistry.org](https://socialscienceregistry.org)) | `aea-rct` | Economics field experiments (mandatory for AEA journals since 2018) | Structured fields, ~3–5 pages | Limited fields editable |

For **public health / clinical trials**, use ClinicalTrials.gov or ISRCTN directly — this template’s `preregister` doesn’t cover those formats. They’re on the v2.0-backlog.

#### The workflow

```
interview-me                       preregister --style osf
   ↓                                   ↓
research-spec.md  ─────────────→  preregistration-draft.md
   ↓                                   ↓
(quality_reports/specs/)         (quality_reports/preregistrations/)
                                       ↓
                                  user reviews,
                                  uploads to OSF,
                                  receives registration ID
                                       ↓
                                  checkpoint preregistration-submitted
                                       ↓
                                  data collection begins
```

`preregister` reads your `interview-me` spec frontmatter (the `paper_type:` field flows in from there if you set it) and produces a registry-formatted draft with **MUST / SHOULD / MAY** annotations on every section. Pre-flight checks: directional hypothesis declared, named estimator, ex-ante exclusion rules, sample-size stopping rule.

#### Mandatory fields per registry style

The `--style` flag determines the mandatory section list. The template enforces these via the pre-flight check:

| Field | OSF | AsPredicted | AEA RCT |
|---|---|---|---|
| Directional hypothesis (with sign) | MUST | MUST | MUST |
| Sampling frame + recruitment | MUST | SHOULD | MUST |
| Sample-size / stopping rule | MUST | MUST | MUST |
| Named primary estimator | MUST | MUST | MUST |
| Pre-specified covariate set | SHOULD | MAY | MUST |
| Multiple-comparison adjustment plan | SHOULD | SHOULD | MUST |
| Ex-ante exclusion rules | MUST | MUST | MUST |
| Robustness specifications (named in advance) | SHOULD | MAY | SHOULD |
| Data-sharing plan | SHOULD | MAY | MUST |
| Intervention description (RCTs) | — | — | MUST |

`preregister` refuses to draft a “retrospective preregistration” — if your description contains realised results or post-hoc reasoning, the skill halts and explains why. That refusal is the point.

#### Pairing with `checkpoint`

`checkpoint` is the structured companion to the narrative session-log workflow. For preregistration specifically:

- **Before submitting** to the registry: `checkpoint preregistration-pre-submit` snapshots the draft state, the spec it derives from, and the next-action (“upload to OSF and record registration ID”).
- **After submission**: `checkpoint preregistration-submitted [registration-id]` records the registry ID and the date in the structured snapshot. The plan and session log link to it.
- **On data arrival**: `checkpoint data-arrived` marks the boundary between “things I could legitimately commit to” and “things I learned from looking.” Anything that follows is exploratory unless explicitly anchored in the preregistered plan.

`checkpoint` files live at `quality_reportscheckpoints/YYYY-MM-DD_<slug>.md` (gitignored — they’re session-state, not version-controlled artifacts). Optional `--no-memory` flag suppresses the auto-proposal of `[LEARN]` entries to MEMORY.md.

#### Post-flight verification

Any cited literature in the preregistration runs through `verify-claims` (Chain-of-Verification, forked-verifier context, fresh) before the draft is considered ready. Hallucinated citations are the most common preregistration failure mode and the hardest to fix after submission — gate-refusing them at draft time pays back many-fold.

#### What this pattern protects against

- **HARKing** (Hypothesising After Results are Known) — the preregistered hypothesis pins the directional claim before observation.
- **p-hacking** — the named estimator + named multiple-comparison plan removes the discretion that produces inflated false-positive rates.
- **Forking paths** — every data-dependent choice is either declared MUST or disclosed as exploratory.
- **Selective reporting** — the data-sharing plan + named robustness specifications make selective reporting visible to referees.

For econometrics, see Christensen & Miguel (2018) on transparency in development economics. For political science, see [Monogan (2015)](https://www.cambridge.org/core/journals/ps-political-science-and-politics/article/research-preregistration-in-political-science/) on the political-science case. For psychology, see the OSF Preregistration Guide.

---

# The Ecosystem: What Others Have Built

This repository provides the foundation — the infrastructure patterns (plan-first, orchestrator, quality gates, adversarial review, context survival) that work for any academic task. Others have taken these patterns further, building specialized workflows for specific needs. Here are the principles these projects share and how to apply them:

| Principle | Source | How to Implement Here |
|---|---|---|
| Adversarial review (not self-review) | All | Use fresh-context critique (Pattern 8) or worker-critic pairs |
| Structured intermediate files | Xu & Yang | Save every computed object to disk; agents communicate via files |
| Phase-appropriate rigor | clo-author | Light review for exploration (60/100), full adversarial for submission (95/100) |
| Voice preservation | claudeblattman | Maintain a reference doc with your writing style; load as context |
| Template-executor separation | Xu & Yang | Spec = what to measure, orchestrator = how to execute |
| Self-improving configuration | claudeblattman | Use `learn` to capture discoveries; review MEMORY.md periodically |
| Human judgment, AI execution | Xu & Yang | You design the diagnostic; Gemini runs it |
| Beauty is function | MixtapeTools | Every visual element earns its presence; decoration without function is noise |
| Constraint-based autonomy | autoresearch | Define boundaries in Markdown (what CAN/CANNOT change); let Gemini explore within |
| Sequential independent audits | GeminiCodeTools | Run N blind audit passes; independence prevents groupthink (Pattern 15) |

> **Which Ecosystem Project Should I Start With?**
>
> If you write **papers**: start with clo-author (adversarial review pairs) or GeminiCodeTools (seven-audit protocol, see Pattern 15). If you give **presentations**: MixtapeTools. If you run **computational experiments**: autoresearch. If you’re a **non-technical academic**: claudeblattman. All of them build on the same foundation patterns from this template — the orchestrator, quality gates, and adversarial review.

Here is what each project does and when you should use it.

## barrios-skills: Empirical Economics, Financial Disclosure & Data Stack

**Repository:** [Barrios88/barrios-skills](https://github.com/Barrios88/barrios-skills) **Author:** John Barrios (Washington University in St. Louis / University of Chicago) **Focus:** Empirical economics, accounting research, and financial data tools

A curated collection of 70+ modular agent skills and MCP servers specifically tailored for empirical economics, corporate finance, and accounting research: - **WRDS MCP & Financial APIs:** Built-in Wharton Research Data Services (WRDS) MCP server with SSH tunneling (), SEC EDGAR 10-K/10-Q/8-K filing extractor (), and financial NLP sentiment tools (). - **Modern Python Data Stack:** Specialized econometric and data processing skills including , , , , , , , and explainable AI (). - **Cochrane Writing Craft:** John Cochrane-inspired direct writing and de-fluffing rules (, , ) enforcing short sentences, active voice, concrete magnitudes, and em-dash removal. - **Seminar Talks & Discussant Decks:** for paper-to-talk conversions, conference discussant decks, and timed speaker scripts.

## theorist-toolbox: Mathematical Proofs & Theoretical Architecture

**Repository:** [morankor/theorist-toolbox](https://github.com/morankor/theorist-toolbox) **Author:** Moran Koren (Ben-Gurion University of the Negev) **Focus:** Theoretical economics, game theory, and mathematical proof automation

An AI Co-Mathematician framework modelled on formal theorem proving and academic mathematical rigor: - **Multi-Agent Proof Infrastructure:** Specialist personas for theorem proving (), formal Lean 4 interactive theorem proving (), mathematical simulation (), and paper rigor auditing (). - **Gap-Free Proof Tracking:** and project scaffolding with strict LaTeX tracking macros and reasoning. - **Proof Readability:** skill for refining verified mathematical proofs into publication-ready exposition without altering analytical correctness.

## clo-author: Paper-Centric Research Workflows

**Repository:** [hugosantanna/clo-author](https://github.com/hugosantanna/clo-author) **Author:** Hugo Sant’Anna (UAB) **Built on:** Fork of this repository

clo-author reorients the entire workflow from slides to **research papers**. The paper (`Paper/main.tex`) becomes the single source of truth; talks and supplements derive from it. The key architectural innovation is **adversarial worker-critic agent pairs**: every creative agent is paired with a dedicated critic agent, with strict separation of powers (critics never create, creators never self-score).

**What it adds:**

- **17 specialized agents** organized as 6 worker-critic pairs (Librarian, Explorer, Strategist, Coder, Writer, Storyteller — each with a dedicated critic) plus standalone agents (data-engineer, domain-referee, methods-referee, orchestrator, verifier)
- **Phase-based severity gradient** — critics are encouraging during Discovery, constructive during Strategy, strict during Execution, and adversarial during Peer Review
- **Weighted aggregate scoring** with component minimums: Literature 10%, Data 10%, Identification 25%, Code 15%, Paper 25%, Polish 10%, Replication 5%. Submission gate (≥ 95) requires every component independently ≥ 80
- **Simulated blind peer review** — two independent Referee agents plus an Editor making an editorial decision (Accept / Minor / Major / Reject)
- **Humanizer pass** — identifies and strips 24 AI writing patterns across four categories (structural tics, lexical tells, rhetorical patterns, formatting tells)
- **Domain profile system** — configurable field-specific calibration file read by all agents
- **Full submission pipeline** — journal targeting, R&R response routing (classifies referee comments as NEW ANALYSIS / CLARIFICATION / DISAGREE / MINOR), AEA replication compliance, pre-analysis plans, cover letter generation

**When to use it:** Your primary output is research papers and you want production-grade infrastructure for the full lifecycle — from literature review through journal submission and revise-and-resubmit.

> **clo-author v26.05 (May 2026)**
>
> clo-author has shipped substantial post-v4 architecture. The current release (v26.05, 2026-05-10) adds:
>
> - **MAS v2** — second-generation multi-agent system with clearer worker/critic boundaries and phase-aware severity gradients
> - **Skill-Centric Restructure** — repository reorganised around 13 skills + 18 agents (up from 17 in the v4.x line)
> - **HTML Dashboard** — self-contained visual interface for tracking pipeline state across phases (no server required)
>
> Patterns like `checkpoint` (originally adapted with permission from clo-author v4.2.0) trace to the earlier line; if you’re forking clo-author directly today, you get the MAS v2 / skill-centric layout.

## claudeblattman: Workflows for Non-Technical Academics

**Website:** [claudeblattman.com](https://claudeblattman.com) **Repository:** [chrisblattman/claudeblattman](https://github.com/chrisblattman/claudeblattman) **Author:** Chris Blattman (University of Chicago)

claudeblattman is a comprehensive guide for academics who do not write code, built by a political economist who describes himself as someone who “has never written a line of code.” It demonstrates that Antigravity workflows extend far beyond technical tasks into daily academic life.

**What it adds:**

- **Executive assistant workflows** — morning briefings (weather, calendar, inbox, VIP tracking), smart email triage with 14 phases, daily check-in ritual, schedule queries, todo management
- **Proposal writing** — donor profiles, voice packs (maintain consistent writing style across documents), template gates, resubmission handling with reviewer comment categorization
- **Fresh-context critique** — the intellectual centerpiece: spin up a fresh-context agent to review your work without self-bias (see Pattern 8)
- **Agent debates** — multiple agents with distinct identities argue about research design, producing genuinely novel perspectives (see Pattern 9)
- **Tips pipeline** — self-improving system: capture tips by emailing yourself, `/tips-curate` quality-filters them, `/tips-integrate` converts them into concrete configuration changes
- **Depth calibration** — Light/Standard/Deep thoroughness levels that prevent over-engineering simple requests
- **Graceful degradation** — every skill works with partial infrastructure. Missing MCP integrations produce explanations, not errors
- **Writing style rules** — numbers over adjectives, topic sentences make claims, no throat-clearing, hedge only with a reason or number

**When to use it:** You are new to Antigravity, want practical daily workflows beyond coding, or want to see how an academic non-programmer built a sophisticated system.

## Xu & Yang (2026): Reproducibility as Architecture

**Paper:** Yiqing Xu (Stanford) and Leo Yang Yang (HKBU), “[Scaling Reproducibility: An AI-Assisted Workflow for Large-Scale Reanalysis](https://yiqingxu.org/papers/2026_ai/AI_reproducibility.pdf),” 2026.

This paper formalizes many principles that this workflow uses intuitively. It demonstrates an AI-assisted pipeline that achieved **100% reproducibility** across 92 papers (215 specifications) — conditional on accessible data and code — with each paper processed in under four minutes.

**Key principles:**

- **Template-executor separation** — humans design diagnostic templates (what to measure), AI handles execution (how to run it). Maps to our spec-then-plan workflow.
- **Three-layer architecture** — LLM orchestrator (coordination) → skill descriptions and knowledge bases (contracts and accumulated experience) → deterministic agent code (numerical work). Maps to our orchestrator → skills/rules → agents.
- **Structured intermediate files** — agents communicate through standardized files on disk (JSON, CSV, logs), not hidden state. Ensures every step is inspectable and rerunnable.
- **Version-controlled knowledge accumulation** — SKILL.md files with Context/Problem/Fix/Impact format. Maps to our `learn` skill.
- **Adaptation between runs, not during runs** — fixes are incorporated as version-controlled updates between sessions, never as ad hoc patches within a session. This ensures reproducibility.

**When to reference it:** You are designing a reproducibility workflow, building a replication package, or want to formalize the principles underlying this guide’s architecture.

## MixtapeTools: The Rhetoric of Decks

**Repository:** [scunning1975/MixtapeTools](https://github.com/scunning1975/MixtapeTools) **Author:** Scott Cunningham (Baylor University), author of *Causal Inference: The Mixtape*

MixtapeTools provides the philosophical and practical framework for academic presentation design (see Pattern 14). Beyond the Rhetoric of Decks, it includes:

- **Referee 2** — a systematic 5-audit adversarial protocol for reviewing and replicating empirical work
- **Deck generation prompt** — a tested, customizable multi-agent prompt for creating Beamer decks (builder → rhetoric reviewer → graphics specialist)
- **Example decks** with professional color palettes, custom ggplot2 themes (`theme_rhetoric()`), and complete Beamer templates
- **Zero-warning compilation standard** — even 0.5pt overfull hbox must be fixed

**When to use it:** You want to make your presentations genuinely beautiful and rhetorically effective, or you want a tested deck generation workflow for Antigravity.

## AEA Data Editor Template

**Website:** [social-science-data-editors.github.io/template_README](https://social-science-data-editors.github.io/template_README/) **Repository:** [social-science-data-editors/template_README](https://github.com/social-science-data-editors/template_README) **Maintainer:** Lars Vilhuber (Cornell University) and editors from REStat, EJ, CJE

The compliance standard for replication packages at 5+ major economics journals (see Pattern 13). Available in Markdown, Word, LaTeX, and PDF formats.

**When to use it:** You are preparing a replication package for journal submission and need the exact template that data editors will check against.

## autoresearch: Constraint-Based Autonomous Research

**Repository:** [karpathy/autoresearch](https://github.com/karpathy/autoresearch) **Author:** Andrej Karpathy

An autonomous research agent that runs continuous experiments — modifying code, training models, and evaluating results — without human intervention. The key insight for academic workflows:

- **`program.md` as a constitutional document** — a single Markdown file defines what the agent CAN modify (architecture, hyperparameters), what it CANNOT (data pipeline, evaluation metric), and what success looks like (validation metric, lower is better)
- **Structured results logging** — every experiment is recorded in a TSV file with branch name, metric, and status
- **Time-budgeted iterations** — fixed training windows make experiments comparable

**When to use it:** You are running iterative computational experiments (Monte Carlo simulations, hyperparameter searches, model comparisons) and want Gemini to explore the space semi-autonomously within defined constraints.

**Example:** Adapting the `program.md` pattern for a Monte Carlo study:

```
# program.md — Monte Carlo Experiment Constraints

## What You CAN Modify
- DGP parameters (sample sizes, effect sizes, correlation structures)
- Estimator implementations (new methods, tuning parameters)
- Number of replications (up to 10,000)

## What You CANNOT Modify
- prepare_data.R (data generation is frozen)
- evaluation metric (RMSE of ATT, lower is better)
- Output format (results.tsv with columns: method, n, rmse, coverage)

## Success Metric
RMSE of ATT estimate. Lower is better. Report coverage rate alongside.
```

## stata-mcp: MCP server for Stata execution

**Repository:** [SepineTam/stata-mcp](https://github.com/SepineTam/stata-mcp) **Author:** SepineTam (171+ stars, 91 releases, v1.17.3 as of May 2026)

A mature MCP server that lets Antigravity execute Stata `.do` files via a command-guarded interface — refuses destructive shell ops (`!/shell/erase` etc.), monitors RAM, and pairs with the Stata Language Server. **Install once per user:** `antigravity mcp add stata-mcp --scope user -- uvx stata-mcp` (requires `uv` and a local Stata install).

**Why it matters for this template:** v1.9.0 added `stata-replication` for Stata-first projects, which depends on this MCP server. R-first projects (the original template focus) continue to use `data-analysis`; the two skills are parallel — same pipeline shape, different source language. AEA submissions where the original replication package is in Stata are the canonical use case.

For end-to-end Stata workflows, see [`.agents/rules/stata-code-conventions.md`](.agents/rules/stata-code-conventions.md) (header scaffold, numbered pipeline, esttab tables, clustering discipline, AEA Data Editor compliance).

## GeminiCodeTools: The Editor Persona

**Repository:** [aspi6246/GeminiCodeTools](https://github.com/aspi6246/GeminiCodeTools)

A collection of Antigravity personas, including “The Editor” — a deeply structured academic paper reviewer that runs seven sequential audit passes (see Pattern 15). Notable features:

- **R&R mode** — tracks referee reports and cross-references each concern against revisions
- **Blunt, specific feedback** — “This paragraph is incoherent” not “might benefit from clarity”
- **“So What” litmus test** — five questions every paper must answer clearly

**When to use it:** You want a structured pre-submission paper review, or you’re responding to referee reports and need systematic tracking of which concerns have been addressed.

## Antigravity-Shipped Utilities

These are first-party Antigravity commands you can invoke directly without forking anything. Worth knowing because they fill gaps this template intentionally doesn’t try to fill:

- **`/team-onboarding`** — packages your local Antigravity setup (GEMINI.md, skills, agents, hooks, settings) into a replayable guide. Useful for lab groups: a PI configures the workflow once, the rest of the lab runs `/team-onboarding` and inherits a working copy. Complements but doesn’t replace this template’s “fork + customize” model.
- **`/autofix-pr`** — runs Antigravity on a GitHub PR, applying typical CI-style fixes (lint, types, simple test failures). Pairs well with our `commit` flow if you push a PR and want a follow-up auto-cleanup pass before review.
- **`/powerup`** — interactive lessons that teach Antigravity features (hooks, skills, MCP, plugins) with animated demos. Recommend this to new forkers who want to understand the *primitives* underneath the template’s customizations.
- **Ultraplan** — draft a plan in the cloud from your CLI, review and comment on it in a web editor, then run it remotely or pull it back local. Useful for plans that need stakeholder review (e.g., a co-author signing off on an analysis approach before the actual run).
- **`/loop` self-pacing** — run a prompt or skill on a recurring interval, or omit the interval to let the model self-pace until a stopping condition is met. Useful for status-polling tasks (“check the deploy every 5 minutes”) that pair with background tasks. The alias `/proactive` is also supported.
- **`/goal <verifiable condition>`** — the “keep working until X holds” command. Gemini continues across turns until a fast model confirms the condition is satisfied. Distinct from `/loop` (which is interval-based) and from plan mode (which approves a strategy rather than enforcing an outcome). Pairs naturally with `commit`’s quality gates: `/goal "all sections pass verify-claims with no HIGH-WARN findings"` then commit. Works in interactive, `antigravity -p`, and Remote Control.
- **`antigravity agents`** — one-screen dashboard for all background sessions. Replaces the multi-terminal pattern for parallel review work. Directly aligned with our `review-paper --peer` and `qa-quarto` parallel-reviewer setup; you can launch the referees and watch their progress from a single view.
- **`/fewer-permission-prompts`** — scans recent transcripts for read-only Bash and MCP calls and proposes a project-local allowlist. Sibling to our `permission-check`: `permission-check` *diagnoses* the prompt-fatigue source, `/fewer-permission-prompts` *remediates* it.

These are external to this template — invoke directly, no installation needed. Mention them as off-ramps when this template’s scope doesn’t fit.

## Community Adoption

As of March 2026, **15+ research groups** across multiple disciplines have forked and adapted this workflow for their own projects:

- **Economics** — China innovation policy, mental health and layoffs, AIGC and stock prices, capital/labor shares in healthcare
- **Energy** — Nepal and global energy economics, PV module reliability
- **Teaching** — ECN 152 course development

Each adaptation follows the same pattern: fork the template, fill in `GEMINI.md` placeholders, customize the domain reviewer, and add field-specific skills. The infrastructure (orchestrator, hooks, quality gates) transfers without modification.

---

# Customizing for Your Domain

> **What ships preloaded vs. what you customize**
>
> Two disciplines are already concrete in this template:
>
> - **Economics** — top-4 + top-field journal profiles (AER, QJE, JPE, ECMA, JoE), R-centric `r-code-conventions.md`, econometrics example in domain-reviewer.md.
> - **Political Science** — APSR, AJPS, JOP journal profiles (v1.8.0), `formal-theory` + `survey-experiment` paper types in methods-referee, poli-sci example in domain-reviewer.md.
>
> Both fields are wired into `.agents/references/discipline-cards.md`, which `research-ideation`, `interview-me`, `preregister`, and the editor agent read when you give them a discipline without a target journal. Cards document paper-type frequency, dominant journals, preregistration norms (OSF / AsPredicted / AEA RCT / ClinicalTrials.gov), significance-stars conventions, SE conventions, and dominant code language (R / Stata / Python).
>
> **Forking for psych, sociology, public health, or other fields:** add ~3 journal profiles, 2–3 paper types, 1 discipline card. The infrastructure (orchestrator, hooks, quality gates, peer-review pipeline) is field-agnostic and transfers without modification. The v2.0 backlog (`.agents/references/v2.0-backlog.md`) lists psychology, sociology, and public-health as candidate next breadth additions.

## Step 1: Build Your Knowledge Base

The knowledge base (`.agents/rules/knowledge-base-template.md`) is the most domain-specific component — it’s a path-scoped rule that loads automatically when Gemini works on your content files. It provides skeleton tables for notation conventions, lecture progression, applications, design principles, anti-patterns, and R code pitfalls. Fill them in as you develop your project — you don’t need everything upfront.

### Notation Registry

```
| Symbol | Meaning | Introduced | Anti-Pattern |
|--------|---------|------------|-------------|
| $\beta$ | Regression coefficient | Lecture 1 | Don't use $b$ |
| $\hat{\theta}$ | Estimator | Lecture 2 | Don't use $\hat{\beta}$ for different estimand |
```

### Applications Database

```
| Application | Paper | Dataset | Package | Lecture |
|------------|-------|---------|---------|--------|
| Minimum Wage | Card & Krueger (1994) | NJ/PA fast food | `fixest` | 3 |
```

### Validated Design Principles

```
| Principle | Evidence | Lectures Applied |
|-----------|----------|-----------------|
| Motivation before formalism | DA challenge: "students lost" | All |
| Max 3 new symbols per slide | Pedagogy review caught overload | 2, 4 |
```

## Step 2: Create Your Domain Reviewer

Copy `.agents/agents/domain-reviewer.md` and customize the 5-lens framework for your field. The template provides the structure; you fill in domain-specific checks.

## Step 3: Adapt Your Theme

The template includes matching LaTeX and Quarto palettes. To customize:

1. Edit `Preambles/header.tex` (Beamer/TikZ) **and** `Quarto/theme-template.scss` (Quarto) together — same color names, matching HEX values.
2. Run `./scripts/check-palette-sync.sh` to confirm they agree. The check is also invoked by `./scripts/validate-setup.sh` after any palette edit.
3. Update CSS class names in the SCSS if needed.
4. Modify the `beamer-translator` environment mapping to match your classes.

**Palette contract.** The core palette names (`primary-blue`, `primary-gold`, `highlight-yellow`, `light-bg`, `jet`) must exist on both surfaces. Snippets in `templates/tikz-snippets/` currently inline their colors for standalone compilation, but real lectures that `\input{header}` inherit the palette automatically. See [`Preambles/README.md`](../Preambles/README.md) for the full contract and TikZ style library.

## Step 4: Creating Custom Skills

The guide includes 24 skills for common academic tasks. But if you have repetitive workflows specific to your domain, you can create your own.

### When to Create a Skill

Create a skill when: - You repeatedly explain the same 3+ step workflow to Gemini - You need domain-specific quality checks (citation style, notation consistency, lab protocols) - You enforce field-specific output formats (thesis structure, journal templates) - You coordinate multi-tool workflows (data → analysis → manuscript)

**Don’t create a skill for:** - One-time tasks - Workflows that change frequently - Simple 1-2 step operations

### Skill Structure

Each skill is a directory in `.agents/skills/` with a `SKILL.md` file:

```
---
name: your-skill-name
description: [What it does] + [When to use] + [Key capabilities]
argument-hint: "[brief hint for user]"
allowed-tools: ["Read", "Write", "Edit", "Bash", "Task"]
---

# Your Skill Name

## Instructions
Step 1: [First action with details]
Step 2: [Second action]
...

## Examples
Example 1: [Common scenario]
...

## Troubleshooting
Error: [Common error]
Solution: [How to fix]
```

### Complete Frontmatter Reference

The YAML frontmatter controls how your skill behaves. Here are all available fields:

| Field | Purpose | Example |
|---|---|---|
| `name` | Display name in `/` menu | `compile-latex` |
| `description` | **Most important.** Controls when Gemini auto-loads the skill | `Compile Beamer slides...` |
| `argument-hint` | Placeholder shown after `/skill-name` | `<filename>` |
| `allowed-tools` | Restrict which tools the skill can use | `["Read", "Bash", "Glob"]` |
| `effort` | Override reasoning effort level | `high` |
| `context` | Set to `fork` to run in an isolated subagent | `fork` |
| `agent` | Link to an agent definition in `.agents/agents/` | `proofreader` |
| `hooks` | Skill-specific hooks (same syntax as settings.json) | `{PreToolUse: [...]}` |
| `model` | Force a specific model | `gemini-3.5-flash (Low)` |
| `disable-model-invocation` | Prevent Gemini from auto-triggering | `true` |
| `user-invocable` | Whether it appears in the `/` menu | `true` (default) |

> **Key Design Choices**
>
> - **`effort: high`** is useful for review skills that need deep reasoning (e.g., paper critique). Use `effort: low` for simple formatting skills to save tokens.
> - **`context: fork`** runs the skill in a fresh subagent context, protecting your main conversation from large outputs. Good for skills that produce verbose reports.
> - **`allowed-tools`** prevents skills from accidentally using destructive tools. A read-only review skill should use `["Read", "Grep", "Glob"]`.

### Dynamic Content in Skills

Skills can include dynamic values using string substitutions and live command output:

**String substitutions:**

| Syntax | Expands To | Example Use |
|---|---|---|
| `$ARGUMENTS` | Full argument string after `/skill-name` | `compile-latex Lecture01` → `$ARGUMENTS` = `Lecture01` |
| `$0`, `$1`, `$N` | Positional arguments (0-based, space-separated) | `deploy Lecture01 draft` → `$0` = `Lecture01`, `$1` = `draft` |
| `${ANTIGRAVITY_SESSION_ID}` | Current session identifier | Unique log file names |
| `${ANTIGRAVITY_SKILL_DIR}` | Path to the skill’s directory | Reference supporting files bundled with the skill |

**Dynamic context injection** with ``!command`` syntax:

```
## Context
Current git status: `!git status --short`
Recent changes: `!git log --oneline -5`
Available lectures: `!ls Slides/*.tex`
```

When Gemini loads the skill, it runs these commands and injects the live output into the skill text. This is powerful for skills that need to adapt to the current project state.

### Writing Effective Trigger Descriptions

The `description` field is the single most important thing you write when creating a skill. Gemini reads the description of every available skill on every turn and uses it to decide whether to auto-invoke without the user typing a skill. A vague description means a skill that only runs when the user remembers its name — defeating the point of auto-invocation.

**The gold-standard pattern has three parts:**

1. **Verb + object** — what the skill *does*, in one clause. Start with an action verb (Compile, Review, Generate, Translate).
2. **“Use when:” trigger phrases** — 3–5 phrases the user might *actually* say. Include verbatim quotes (`"proofread"`, `"check the layout"`) and semantic paraphrases (`"does this overflow?"`). Cover both explicit commands and natural-language requests.
3. **Disambiguation from sibling skills** — if your skill lives near others in the same domain (e.g., `proofread`, `visual-audit`, and `pedagogy-review` all operate on slides), explicitly say what it is *not* for, or point at the alternative. This prevents mis-routing.

**Example: refactoring a weak description into an A-grade one.**

Before (weak — the skill exists but Gemini won’t auto-pick it):

```
description: Run the proofreading protocol on lecture files. Checks grammar, typos, overflow, consistency.
```

After (strong — Gemini will match this from cold prompts):

```
description: Read-only proofreading pass over lecture .tex or .qmd files.
  Checks grammar, typos, overflow, terminology consistency, and academic
  writing quality; produces a report without editing. Use when user says
  "proofread", "check for typos", "look for grammar issues", "copy-edit
  this", "any writing errors?", or before a lecture release.
```

**The test:** imagine a teammate who has never seen your skill list types `"can you look for writing errors in Lecture 3?"`. Does your description contain enough lexical overlap that Gemini would match it against competing skills? If not, add more trigger phrases.

**Another good example (disambiguation):**

```
description: Interactive interview that formalizes a fuzzy research idea into
  a structured spec (RQ, hypotheses, identification, data needs, empirical
  strategy). Use when user says "interview me", "help me think through this
  idea", "I have a half-baked idea". Multi-turn Q&A; saves spec to disk.
  NOT for lit review (lit-review) or ideation from scratch (research-ideation).
```

The final sentence — “NOT for X, use /Y instead” — is the disambiguation clause. Two skills with overlapping descriptions will split Gemini’s routing probability; the explicit “not for” resolves the tie.

**Bad (too vague — will never auto-invoke):**

```
description: Helps with citations
```

**Checklist before shipping a new skill:**

- Starts with a verb + object.
- Has a “Use when:” clause with at least 3 trigger phrases.
- Includes at least one verbatim quote a user might literally type.
- Disambiguates from any sibling skills in the same domain.
- Fits in roughly 2–4 lines (longer descriptions get truncated in Gemini’s skill index).

### Domain-Specific Examples

- Econometrics
- Experimental Sciences
- Literature Review

**Regression Output Formatter**

Converts R regression outputs to publication-ready LaTeX tables with proper formatting (standard errors in parentheses, significance stars, fixed effects rows).

**Trigger:** User runs regressions and says “make a table”, “format results”, “export to LaTeX”

**Tools:** `Read`, `Write`, `Bash` (to run R scripts)

**Protocol Validator**

Validates lab protocols against safety and reproducibility standards. Checks for: required sections (materials, procedure, safety), quantitative specifications, controls, and replication details.

**Trigger:** User provides protocol documents, asks “check protocol”, “validate procedure”

**Tools:** `Read`, `Write`

**Citation Cross-Reference Checker**

Cross-references in-text citations against bibliography entries. Identifies missing entries, unused references, and formatting inconsistencies.

**Trigger:** User asks “check citations”, “validate references”, when working on manuscripts

**Tools:** `Read`, `Grep`, `Glob`, `Write`

### Quick Start

1. **Copy the template:**
  `mkdir -p .agents/skills/your-skill-name cp templates/skill-template.md .agents/skills/your-skill-name/SKILL.md`
2. **Customize for your domain:**
  - Replace trigger phrases with your field’s terminology
  - Add domain-specific file types and tools
  - Include field conventions and common errors
3. **Test the skill:**
  - Skills hot-reload automatically — changes are detected without restarting
  - Use one of your trigger phrases
  - Verify the skill loads and produces correct output
4. **Iterate:**
  - If skill doesn’t trigger: Revise description with more specific phrases
  - If instructions unclear: Add more examples
  - If output wrong: Add validation steps

**Full template:** See `templates/skill-template.md` for comprehensive examples from biology, economics, and physics.

## Tips from 6+ Sessions of Iteration

1. **Keep GEMINI.md under 150 lines.** Gemini follows ~150 instructions reliably. A 400-line GEMINI.md means rules get silently ignored. Use path-scoped rules for detailed standards.
2. **Add rules incrementally.** Don’t try to write all rules upfront. Add them when you discover patterns. Use `paths:` frontmatter so they only load when relevant.
3. **Use the [LEARN] format.** Every correction gets tagged and persisted in MEMORY.md. This prevents repeating mistakes across sessions.
4. **Trust the adversarial pattern.** The critic-fixer loop catches things you won’t. Let it run.
5. **Verify everything.** The verification rule exists for a reason. Never skip compilation or rendering checks.
6. **Session logs matter.** Document design decisions, not just what changed. Future-you will thank present-you.
7. **Devil’s Advocate early.** Challenge slide structure before you’ve built 50 slides on a shaky foundation.
8. **Progressive disclosure.** Start with GEMINI.md + 2–3 rules. Add more as your workflow matures. Newcomers should not face 24 rules on day one.
9. **Use `GEMINI.local.md` for personal overrides.** This file is automatically gitignored and loaded alongside `GEMINI.md`. Put machine-specific paths, personal preferences, and local tool versions here — they won’t pollute the shared repo.

> **Extending with MCP Servers**
>
> For capabilities beyond file editing and shell commands — web search during literature review, database queries for replication, or reference manager integration (Zotero, Mendeley) — Antigravity supports [MCP servers](https://modelcontextprotocol.io). Configure them in `.agents/settings.json` under `"mcpServers"`. Start with skills and agents first; add MCP when you need external integrations.
>
> ## Extending with Plugins
>
> Antigravity supports **plugins** — bundled collections of skills, agents, hooks, and MCP servers that can be installed from git repositories. Use `/plugin` to browse and manage plugins (it has a Discover tab for finding new ones). Plugins are a newer extension point; start with skills and rules (which you control entirely) before adopting third-party plugins.

---

# Appendix: File Reference

## All Agents

| Agent | File | Purpose |
|---|---|---|
| Proofreader | `.agents/agents/proofreader.md` | Grammar, typos, consistency |
| Slide Auditor | `.agents/agents/slide-auditor.md` | Visual layout, overflow, spacing |
| Pedagogy Reviewer | `.agents/agents/pedagogy-reviewer.md` | Narrative arc, notation clarity |
| R Reviewer | `.agents/agents/r-reviewer.md` | R code quality, reproducibility |
| TikZ Reviewer | `.agents/agents/tikz-reviewer.md` | Diagram visual quality |
| Beamer Translator | `.agents/agents/beamer-translator.md` | LaTeX to Quarto translation |
| Quarto Critic | `.agents/agents/quarto-critic.md` | Adversarial Quarto QA |
| Quarto Fixer | `.agents/agents/quarto-fixer.md` | Applies critic’s fixes |
| Verifier | `.agents/agents/verifier.md` | Task completion verification |
| Domain Reviewer | `.agents/agents/domain-reviewer.md` | Your domain-specific review |
| Claim Verifier | `.agents/agents/claim-verifier.md` | Chain-of-Verification (fresh-context) fact-checker (v1.7.0) |
| Editor | `.agents/agents/editor.md` | Journal editor for `review-paper --peer` (desk review + referee selection + editorial synthesis, v1.5.0) |
| Domain Referee | `.agents/agents/domain-referee.md` | Disposition-primed substance referee for `review-paper --peer` (v1.5.0) |
| Methods Referee | `.agents/agents/methods-referee.md` | Paper-type-aware methodology referee for `review-paper --peer` (v1.5.0; +formal-theory + survey-experiment in v1.8.0) |
| Humanize Auditor | `.agents/agents/humanize-auditor.md` | Read-only auditor for AI-voice tells in academic prose; invoked by `humanize` (v1.9.0) |
| Promote-Memory Council | `.agents/agents/promote-memory-council.md` | Five-critic council (generality / staleness / redundancy / evidence / format) for `[LEARN]` promotion from personal-memory.md to MEMORY.md; invoked by `promote-memory` (v1.9.0) |
| Project Coordinator | `.agents/agents/project-coordinator.md` | Spawns, steers, and coordinates theoretical workstreams |
| Prover | `.agents/agents/prover.md` | Drafts mathematical proofs under strict no-handwaving constraints |
| Literature Reviewer | `.agents/agents/literature-reviewer.md` | Conducts verified literature reviews and fetches papers |
| Paper Reviewer | `.agents/agents/paper-reviewer.md` | Gates workstream completion through adversarial correctness review |
| Coder | `.agents/agents/coder.md` | Implements computational experiments and golden value verification |
| Lean Prover | `.agents/agents/lean-prover.md` | Formalizes results and theorems in Lean 4 |

## All Skills

| Skill | Directory | Purpose |
|---|---|---|
|  |  | Use when writing recommendation letters, reference letters, or award nominations for … |
|  |  | Draft economics papers with proper structure and academic style |
|  |  | This skill should be used for time series machine learning tasks including classifica… |
|  |  | Fetch economic data from FRED, World Bank, and other APIs |
|  |  | Enforce the replication-protocol.md rule by cross-checking numeric claims in a manusc… |
|  |  | Create academic presentations in Beamer with professional themes |
|  |  | Snapshot the computational environment for a replication package — detects the analys… |
|  |  | Use when writing or reviewing career documents including research statements, teachin… |
|  |  | Save a structured state snapshot before stopping or handing off. Captures the active … |
|  |  | Comprehensive citation management for academic research. Search Google Scholar and Pu… |
|  |  | Initialize a new AI co-mathematician research project. Use when the user wants to sta… |
|  |  | Render a compact status view of an AI co-mathematician research project — goals, acti… |
|  |  | Generate a co-author / collaborator handoff brief for a multi-author, multi-machine p… |
|  |  | OpenAI Codex (gpt-5.5) as an adversarial mathematical co-processor — verify, write, a… |
|  |  | Stage, commit, push, open a PR, and merge to main. Use ONLY on explicit commit intent… |
|  |  | Compile a Beamer LaTeX slide deck with XeLaTeX (3 passes + bibtex). Use when user say… |
|  |  | Distill the current conversation into a structured note (decisions made, open questio… |
|  |  | / Show current context status and session health. Use to check how much context h… |
|  |  | Create a new Beamer lecture `.tex` from source papers and materials, with notation co… |
|  |  | Distributed computing for larger-than-RAM pandas/NumPy workflows. Use when you need t… |
|  |  | End-to-end R data analysis pipeline — exploration → cleaning → regression → publicati… |
|  |  | Draft a funder-compliant Data Management Plan (NSF DMP, NIH DMS Policy 2023, ERC, Hor… |
|  |  | Work with Data Commons, a platform providing programmatic access to public statistica… |
|  |  | / Deep consistency audit of the entire repository infrastructure. Launches 4 para… |
|  |  | Render Quarto `.qmd` slides to HTML and sync to `docs/` for GitHub Pages. Use when us… |
|  |  | Adversarial 5-7 question challenge to a deck’s pedagogical choices — ordering, prereq… |
|  |  | Root-cause a failing or wrong empirical result with a disciplined reproduce → minimis… |
|  |  | Run a staggered difference-in-differences / event-study analysis to the Sant’Anna pra… |
|  |  | Pre-screen analysis outputs (tables, figures, logs) built on restricted or confidenti… |
|  |  | Use when the task involves reading, creating, or editing `.docx` documents, especiall… |
|  |  | Document toolkit (.docx). Create/edit documents, tracked changes, comments, formattin… |
|  |  | Remove AI writing patterns from academic economics, finance, and accounting prose. En… |
|  |  | Supplements the econ-humanizer skill with a more exhaustive and specific rule set for… |
|  |  | Search a curated corpus of ~51k economics papers (NBER working papers, JEL-coded jour… |
|  |  | Pre-submission referee report for economics, finance, and accounting papers — verifie… |
|  |  | Turn an economics, finance, or accounting paper into a professional Beamer talk with … |
|  |  | Create publication-quality charts and graphs for economics papers. |
|  |  | Draft and revise economics, finance, and accounting papers using Cochrane/McCloskey/S… |
|  |  | Supplements economic-writing, econ-humanizer, academic-paper-writer, research-grants,… |
|  |  | Perform comprehensive exploratory data analysis on scientific data files across 200+ … |
|  |  | Extract TikZ diagrams from Beamer `.tex` source, compile each to a standalone PDF, an… |
|  |  | Measure sentiment and stance in financial and economic text — 10-K/10-Q MD&A, earning… |
|  |  | Gemini 3.5 Pro as an adversarial mathematical co-processor — verify, write, and explo… |
|  |  | Python library for working with geospatial vector data including shapefiles, GeoJSON,… |
|  |  | Scaffold a research grant proposal (NSF, NIH, ERC, or foundation) by composing existi… |
|  |  | Read-only audit of `.tex`, `.qmd`, or `.md` text for AI-voice tells — boilerplate tra… |
|  |  | Structured hypothesis formulation from observations. Use when you have experimental o… |
|  |  | Interactive interview that formalizes a fuzzy research idea into a structured spec (R… |
|  |  | Write and typeset economic models in LaTeX with proper notation |
|  |  | Create professional research posters in LaTeX using beamerposter, tikzposter, or bapo… |
|  |  | Generate publication-ready regression tables in LaTeX. |
|  |  | / Extract reusable knowledge from the current session into a persistent skill. Us… |
|  |  | Structured literature search + synthesis with citation extraction, thematic clusterin… |
|  |  | Search, summarize, and synthesize economics literature |
|  |  | Conduct comprehensive, systematic literature reviews using multiple academic database… |
|  |  | Generate comprehensive market research reports (50+ pages) in the style of top consul… |
|  |  | Convert files and office documents to Markdown. Supports PDF, DOCX, PPTX, XLSX, image… |
|  |  | Write clear, detailed mathematical proofs for academic papers. Use when the user as… |
|  |  | Low-level plotting library for full customization. Use when you need fine-grained con… |
|  |  | Comprehensive toolkit for creating, analyzing, and visualizing complex networks and g… |
|  |  | Scaffold a new TikZ diagram from the snippet gallery with prevention rules pre-applie… |
|  |  | Scaffold a new skill that follows this repo’s conventions — interviews for purpose, t… |
|  |  | Research across Notion and synthesize into structured documentation; use when gatheri… |
|  |  | Access and analyze OpenAlex scholarly metadata through the REST API, including works,… |
|  |  | Convert accounting and finance papers into dissemination assets — interactive project… |
|  |  | This skill should be used when converting academic papers into promotional and presen… |
|  |  | PDF manipulation toolkit. Extract text/tables, create PDFs, merge/split, fill forms, … |
|  |  | Holistic pedagogical review of a lecture deck (`.qmd` or `.tex`). Checks narrative ar… |
|  |  | Structured manuscript/grant review with checklist-based evaluation. Use when writing … |
|  |  | Diagnose why Antigravity is (or isn’t) prompting for permission. By default reads onl… |
|  |  | Interactive visualization library. Use when you need hover info, zoom, pan, or web-em… |
|  |  | Fast in-memory DataFrame library for datasets that fit in RAM. Use when pandas is too… |
|  |  | Compute statistical power, required sample size, and minimum detectable effect (MDE) … |
|  |  | Presentation toolkit (.pptx). Create/edit slides, layouts, content, speaker notes, co… |
|  |  | Draft a structured preregistration document (OSF, AsPredicted, or AEA RCT Registry st… |
|  |  | Review candidate `[LEARN]` entries in `.agents/state/personal-memory.md` (gitignored)… |
|  |  | Improve the readability and exposition of mathematical proofs that are already veri… |
|  |  | Read-only proofreading pass over lecture `.tex` or `.qmd` files. Checks grammar, typo… |
|  |  | Fast high-dimensional fixed-effects regression in Python with pyfixest (fixest-like s… |
|  |  | Bayesian modeling with PyMC. Build hierarchical models, MCMC (NUTS), variational infe… |
|  |  | Panel data analysis with Python using linearmodels and pandas. |
|  |  | Adversarial Quarto-vs-Beamer parity QA. A critic agent compares the Quarto HTML rende… |
|  |  | Run IV, DiD, and RDD analyses in R with proper diagnostics |
|  |  | Run the full R package release gate — regenerate docs, run the test suite, run R CMD … |
|  |  | Assemble a submission-ready replication package to the AEA Data and Code Availability… |
|  |  | Generate structured research questions, testable hypotheses, and candidate empirical … |
|  |  | Look up current research information using Perplexity Sonar Pro Search or Sonar Reaso… |
|  |  | Turn student course evaluations (free-text + numeric) into an actionable teaching-imp… |
|  |  | Generate a structured response-to-referees document from a referee report and the rev… |
|  |  | Comprehensive manuscript review with three modes: single-pass (default), –adversaria… |
|  |  | Read-only R code review protocol for `.R` scripts. Checks code quality, reproducibili… |
|  |  | Scaffold a graded problem set with sections, problems, worked solutions, and short “w… |
|  |  | Systematically evaluate scholarly work using the ScholarEval framework, providing str… |
|  |  | Creative research ideation and exploration. Use for open-ended brainstorming sessions… |
|  |  | Evaluate scientific claims and evidence quality. Use for assessing experimental desig… |
|  |  | Create publication-quality scientific diagrams using Nano Banana Pro AI with smart it… |
|  |  | Build slide decks and presentations for research talks. Use this for making PowerPoin… |
|  |  | Core skill for the deep research and writing tool. Write scientific manuscripts in fu… |
|  |  | Machine learning in Python with scikit-learn. Use when working with supervised learni… |
|  |  | Statistical visualization with pandas integration. Use for quick exploration of distr… |
|  |  | Pull SEC EDGAR filings, XBRL financials, and Form 3/4/5 insider trades for accounting… |
|  |  | Mechanize Pattern 15 — the seven-pass adversarial review protocol for academic manusc… |
|  |  | Model interpretability and explainability using SHAP (SHapley Additive exPlanations)…. |
|  |  | Process-based discrete-event simulation framework in Python. Use this skill when buil… |
|  |  | Scaffold and run a reproducible Monte Carlo simulation study in R — parameterized DGP… |
|  |  | Multi-agent comprehensive slide review (visual + pedagogy + proofreading, plus TikZ /… |
|  |  | Create, edit, render, verify, and export PowerPoint slide decks. Use when Codex needs… |
|  |  | Use this skill when a user requests to create, modify, analyze, visualize, or work wi… |
|  |  | > Comprehensive Stata reference for writing correct .do files, data management, e… |
|  |  | >- Develop high-performance C/C++ plugins for Stata using the stplugin.h SDK. Use… |
|  |  | Clean and transform messy data in Stata with reproducible workflows |
|  |  | Run regression analyses in Stata with publication-ready output tables. |
|  |  | End-to-end Stata replication pipeline — scaffolds numbered `.do` files in `scripts/st... \| \| \| \| Guided statistical analysis with test selection and reporting. Use when you need help... \| \| \| \| Statistical models library for Python. Use when you need specific model classes (OLS,... \| \| \| \| Generate the submission-time disclosure block for a manuscript — the AI-use disclosur... \| \| \| \| Build or restructure a course syllabus from a topic list or reading list — course des... \| \| \| \| Use this skill when working with symbolic mathematics in Python. This skill should be... \| \| \| \| Turn a research paper into teaching materials — a lecture outline, the 3-5 results wo... \| \| \| \| Translate a Beamer`.tex`lecture to a Quarto RevealJS`.qmd`mirror. Multi-phase: Ti... \| \| \| \| Triage academic email and calendar (Gmail / Google Calendar via the session's MCP) in... \| \| \| \| UMAP dimensionality reduction. Fast nonlinear manifold learning for 2D/3D visualizati... \| \| \| \| Reminds and assists the user in updating the MEMORY.md file with key decisions, miles... \| \| \| \| Use this skill for processing and analyzing large tabular datasets (billions of rows)... \| \| \| \| Validate bibliography entries against citations in all lecture files. Structural chec... \| \| \| \| Access comprehensive LaTeX templates, formatting requirements, and submission guideli... \| \| \| \| Run Chain-of-Verification (CoVe) on a draft or a block of text with factual claims. S... \| \| \| \| Adversarial visual-layout audit of a Quarto`.qmd`or Beamer`.tex` deck. Flags overf… |
|  |  | > Web scraping skill for economists and applied researchers. Use this skill whene… |
|  |  | This skill should be used when the user asks to “query WRDS”, “access Compustat”, “ge… |
|  |  | Spreadsheet toolkit (.xlsx/.csv). Create/edit with formulas/formatting, analyze data,… |

## All Rules

**Always-on** (load every session):

| Rule | File | Purpose |
|---|---|---|
| Plan-First Workflow | `plan-first-workflow.md` | Plan mode + context preservation |
| Orchestrator Protocol | `orchestrator-protocol.md` | Contractor mode loop |
| Session Logging | `session-logging.md` | Three logging triggers |
| Meta-Governance | `meta-governance.md` | Template vs working project distinctions |

**Path-scoped** (load only when working on matching files):

| Rule | File | Triggers On |
|---|---|---|
| Verification Protocol | `verification-protocol.md` | `.tex`, `.qmd`, `docs/` |
| Single Source of Truth | `single-source-of-truth.md` | `Figures/`, `.tex`, `.qmd` |
| Quality Gates | `quality-gates.md` | `.tex`, `.qmd`, `*.R` |
| R Code Conventions | `r-code-conventions.md` | `*.R` |
| TikZ Quality | `tikz-visual-quality.md` | `.tex` |
| TikZ Prevention | `tikz-prevention.md` | `Slides/**`, `Figures/**`, `Preambles/**` |
| TikZ Measurement | `tikz-measurement.md` | `Slides/**`, `Figures/**`, `Preambles/**`, `scripts/**` |
| Beamer-Quarto Sync | `beamer-quarto-sync.md` | `.tex`, `.qmd` |
| PDF Processing | `pdf-processing.md` | `master_supporting_docs/` |
| Proofreading Protocol | `proofreading-protocol.md` | `.tex`, `.qmd`, `quality_reports/` |
| No Pause | `no-pause-beamer.md` | `.tex` |
| Replication Protocol | `replication-protocol.md` | `*.R` |
| Knowledge Base | `knowledge-base-template.md` | `.tex`, `.qmd`, `*.R` |
| Orchestrator Research | `orchestrator-research.md` | `*.R`, `explorations/` |
| Exploration Folder | `exploration-folder-protocol.md` | `explorations/` |
| Exploration Fast-Track | `exploration-fast-track.md` | `explorations/` |
| Content Invariants | `content-invariants.md` | `.tex`, `.qmd`, `Preambles/`, `scripts/R/**` |
| Cross-Artifact Review | `cross-artifact-review.md` | `master_supporting_docs/`, `.tex`, `.qmd` |
| Summary–Body Parity | `summary-parity.md` | `CHANGELOG.md`, `README.md`, `.qmd`, skill/rule/agent `.md` |
| Post-Flight Verification | `post-flight-verification.md` | skills that generate factual claims (`lit-review`, `research-ideation`, `respond-to-referees`, `review-paper`, `interview-me`) |
| Model Routing | `model-routing.md` | `.agents/agents/**/*.md`, `.agents/skills/**/SKILL.md` — 70/20/10 architect/editor split, per-agent `model:` field guidance (v1.9.0) |
| Stata Code Conventions | `stata-code-conventions.md` | `**/*.do`, `scripts/stata/**` — header scaffold, numbered pipeline, esttab tables, clustering discipline, AEA compliance (v1.9.0) |

## Hooks

| Hook | Type | Configuration |
|---|---|---|
| Session log reminder | Stop (command) | `.agents/hooks/log-reminder.py` |
| Desktop notification | Notification (command) | `.agents/hooks/notify.sh` |
| Context state capture | PreCompact (command) | `.agents/hooks/pre-compact.py` |
| Context restoration | SessionStart[compact\|resume] (command) | `.agents/hooks/post-compact-restore.py` |
| Context monitor | PostToolUse[Bash\|Task] (command) | `.agents/hooks/context-monitor.py` |
| Verification reminder | PostToolUse[Write\|Edit] (command) | `.agents/hooks/verify-reminder.py` |

**Additional hook events** available in Antigravity (not used in this template but available for custom hooks):

| Event | When It Fires | Use Case |
|---|---|---|
| `UserPromptSubmit` | Before user message is processed | Input validation, auto-routing |
| `PermissionRequest` | When permission dialog appears | Auto-approve patterns, logging |
| `PostToolUseFailure` | When a tool call fails | Error tracking, retry logic |
| `SubagentStart` | When a subagent spawns | Resource tracking |
| `SubagentStop` | When a subagent completes | Result aggregation |
| `PostCompact` | After context compaction | Post-compaction cleanup |
| `SessionEnd` | When session closes | Final state saving, cleanup |
| `WorktreeCreate` | When a git worktree is created | Branch tracking |
| `WorktreeRemove` | When a git worktree is removed | Cleanup verification |
| `TaskCompleted` | When a background task finishes | Progress notifications |
| `ConfigChange` | When settings are modified | Audit logging |

## Troubleshooting

### LaTeX Won’t Compile

**Symptom:** `xelatex` errors or missing packages.

**Fix:** 1. Check you have XeLaTeX installed: `which xelatex` 2. Ensure `TEXINPUTS` includes `Preambles/`: the `compile-latex` skill handles this 3. Missing package? Install via TeX Live: `tlmgr install [package]`

### Quarto Won’t Render

**Symptom:** `quarto render` fails or produces broken HTML.

**Fix:** 1. Check Quarto version: `quarto --version` (need 1.3+) 2. Check for syntax errors in YAML frontmatter 3. Missing TikZ SVGs? Run `extract-tikz` first

### Hooks Not Firing

**Symptom:** No context warnings, no verification reminders.

**Fix:** 1. Check hooks are configured: `cat .agents/settings.json | grep hooks` 2. Ensure Python 3 is available: `which python3` 3. Check hook file permissions: `ls -la .agents/hooks/`

### Gemini Ignores Rules

**Symptom:** Gemini doesn’t follow conventions in `.agents/rules/`.

**Fix:** 1. Rules use `paths:` frontmatter — check the path matches your files 2. Too many rules? Gemini follows ~150 instructions reliably. Consolidate. 3. Try: *“Read `.agents/rules/[rule].md` and follow it for this task”*

### Context Lost After Compaction

**Symptom:** Gemini forgets what you were working on.

**Fix:** 1. Point Gemini to the plan: *“Read `quality_reports/plans/[latest].md`”* 2. Check session log: *“Read `quality_reports/session_logs/[latest].md`”* 3. The `post-compact-restore.py` hook should print recovery info automatically

### Quality Score Too Low

**Symptom:** Score stuck below 80, can’t commit.

**Fix:** 1. Run `slide-excellence` to get detailed issue breakdown 2. Fix critical issues first (they cost -10 to -20 points each) 3. Ask Gemini: *“What are the remaining critical issues?”*

### Skills Not Auto-Invoked

**Symptom:** Gemini doesn’t use skills when you describe a task.

**Fix:** 1. Be explicit in your request: *“Review my slides for grammar and layout issues”* 2. Check skill has auto-invocation enabled (no `disable-model-invocation: true`) 3. Skill descriptions help Gemini know when to use them — check they’re clear

### Plans Saved to Wrong Directory

**Symptom:** Plans save to `~/.agents/plans/` instead of your project directory. Can’t track plans in git.

**Fix:** Add to `.agents/settings.json`:

```
{
  "plansDirectory": "quality_reports/plans"
}
```

This tells Antigravity to save plans inside your project where they can be version-controlled.

---

# Standing on Shoulders

This guide builds on the work of many. We are grateful to these projects and their authors.

**Core Infrastructure:**

- [Antigravity SDK](https://ai.google.dev/sdk) by Google — the framework, CLI tool, and extensions that make all of this possible

**Research Workflows:**

- [clo-author](https://github.com/hugosantanna/clo-author) by Hugo Sant’Anna (UAB) — paper-centric research workflows with adversarial agent pairs, simulated peer review, and full research lifecycle management
- [claudeblattman](https://github.com/chrisblattman/claudeblattman) by Chris Blattman (University of Chicago) — comprehensive workflows for non-technical academics: executive assistant, proposal writing, project management, and the fresh-context critique pattern

**Reproducibility & Data Management:**

- Yiqing Xu (Stanford) and Leo Yang Yang (HKBU), “[Scaling Reproducibility: An AI-Assisted Workflow for Large-Scale Reanalysis](https://yiqingxu.org/papers/2026_ai/AI_reproducibility.pdf),” 2026 — the template-executor architecture and principles of reproducible AI-assisted research
- [Template README for Social Science Replication Packages](https://social-science-data-editors.github.io/template_README/) by Lars Vilhuber et al. (Cornell) — the AEA Data Editor compliance standard adopted by major economics journals

**Presentation Design & Tools:**

- [MixtapeTools / The Rhetoric of Decks](https://github.com/scunning1975/MixtapeTools/tree/main/presentations) by Scott Cunningham (Baylor) — the philosophical and practical framework for beautiful, rhetorically effective academic presentations
- Scott Cunningham, *[Causal Inference: The Mixtape](https://mixtape.scunning.com)* — the textbook whose author developed the presentation framework above
- [autoresearch](https://github.com/karpathy/autoresearch) by Andrej Karpathy — constraint-based autonomous research with `program.md` as constitutional document
- [GeminiCodeTools](https://github.com/aspi6246/GeminiCodeTools) — “The Editor” persona for seven-audit sequential paper review

**Origin:**

- This workflow was originally developed by Pedro Sant’Anna for econometrics. The patterns are domain-agnostic and have been extended by others across fields.
