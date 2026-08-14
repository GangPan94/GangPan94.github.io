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


{::nomarkdown}
<div id="protected-section" style="display:none;">
  <div id="decrypted-content"></div>
</div>

<div id="password-gate">
  <div style="max-width: 600px; margin: 2em auto; padding: 2em; text-align: center; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
    <h3>Restricted Content</h3>
    <p>The remaining sections of this guide are password-protected.</p>
    <input type="password" id="gate-password" placeholder="Enter password" style="padding: 0.5em 1em; font-size: 1em; border: 1px solid #ccc; border-radius: 4px; width: 250px;" />
    <br/><br/>
    <button id="gate-submit" onclick="decryptSection()" style="padding: 0.5em 2em; font-size: 1em; cursor: pointer;">Unlock</button>
    <p id="gate-error" style="color: #c0392b; margin-top: 1em; display:none;">Incorrect password. Please try again.</p>
  </div>
</div>

<script src="/assets/js/antigravity-gate.js"></script>
{/:nomarkdown}
