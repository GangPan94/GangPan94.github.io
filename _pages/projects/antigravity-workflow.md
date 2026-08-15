---
layout: single
title: "Agentic Workflows for Accounting Academics"
subtitle: "Google Antigravity as an Example"
permalink: /projects/antigravity-workflow/
author_profile: true
toc: false
---

*Author: Gang (Ernest) Pan &middot; Published: March 7, 2026 &middot; Last Updated: August 15, 2026*

> **Work in Progress**
>
> This guide and the associated Antigravity workflow configurations are actively in development. The patterns described here represent the current frontier of AI-assisted academic research.

# Why This Workflow Exists

The goal of this project is simple: **to help our accounting academic colleagues and friends get started with agentic AI to aid their research as quickly as possible.**

Adopting a new paradigm can be daunting, and it is easy to let the anxiety of complex setups, command-line interfaces, or the "unknowns" of AI lead to procrastination. This guide is designed to:

1. **Dispel Adoption Fear**: Show that agentic AI is accessible, manageable, and highly beneficial, dismantling the intimidation barrier.
2. **Demonstrate Real-World Usage**: Show exactly how these workflows work in practice, showing how agentic AI acts as a tireless, high-quality research assistant.
3. **Provide a Quick Setup Guide**: Offer a clear, zero-friction path to get your own environment running in minutes.

## The Problem with Chat-Based AI

If you've ever done serious academic work — built lecture slides, drafted a research paper, run a data analysis pipeline — you know the pain:

- **Context loss between sessions.** You pick up where you left off in a new chat, but the AI doesn't remember *why* you chose that notation, *what* was approved, or *which* bugs were fixed last time.
- **Quality is inconsistent.** One slide has perfect spacing; the next overflows. Citations compile in one environment but break locally.
- **Review is manual and exhausting.** You proofread 140 slides by hand and miss a typo in an equation. A student or referee catches it.
- **No one checks the math.** Grammar checkers catch "teh" but not a flipped sign in a decomposition theorem or a misspecified regression.

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

## Why use Google Antigravity as an example?

There is no strong technical reason to use Google Antigravity over others. As summarized in [this overview of the agentic coding landscape](https://thenewstack.io/claude-code-vs-cursor-vs-codex-vs-antigravity-2026/):

> "Six months of convergence has settled the shape of the agentic coding tool and turned the next phase into a contest over the harness, the price, and the habits a team builds around one product."

This article is a good summary of the current landscape of agentic coding tools. Currently, Claude Code is more popular among academics. The primary reason we invest the effort in building this setup is to lower the risk that users are hung up to one service provider. By building a highly modular, system-agnostic foundation, you can easily port your rules, memory, and workflows to other providers if needed.

## How It All Works Together

**Skills hide most of the mechanics.** You describe what you want in plain English, Antigravity figures out which skill fits, and the skill runs the right subagents and checks.

**Collaborate via a plan-first approach.** Rather than letting the agent write code immediately, establish a concrete plan first. Iterating back and forth with the agent to refine and improve this plan before execution significantly increases the alignment and quality of the final outcome. Once you align on a solid plan, you can step back and let the agent handle the heavy lifting of execution and verification.

### What You Do vs What the Skill Does

| You Do | The Skill Does (once invoked) |
|---|---|
| Describe what you want | Antigravity selects and runs the right skill. Antigravity will come up with the plan |
| Approve plans | The skill runs the orchestrator pattern internally |
| Review final output | Rules load based on files you touch |
| Say "commit" when ready | Subagents fire on the review cycle |

---

# Full Guide

The complete guide is organized into chapters. Chapter 1 is freely accessible. Chapters 2–9 are password-protected — if you have the password, enter it on any chapter page to unlock all chapters for your session.

<div style="margin: 2em 0;">

| Chapter | Title | Access |
|---|---|---|
| [**01**](/antigravity-guide/chapters/01-why-this-workflow.html) | Why This Workflow Exists | Public |
| [**02**](/antigravity-guide/chapters/02-getting-started.html) | Getting Started | Password-protected |
| [**03**](/antigravity-guide/chapters/03-system-in-action.html) | The System in Action | Password-protected |
| [**04**](/antigravity-guide/chapters/04-building-blocks.html) | The Building Blocks | Password-protected |
| [**05**](/antigravity-guide/chapters/05-workflow-patterns.html) | Workflow Patterns | Password-protected |
| [**06**](/antigravity-guide/chapters/06-ecosystem.html) | The Ecosystem | Password-protected |
| [**07**](/antigravity-guide/chapters/07-customizing.html) | Customizing the Workflow | Password-protected |
| [**08**](/antigravity-guide/chapters/08-appendix.html) | Appendix | Password-protected |
| [**09**](/antigravity-guide/chapters/09-acknowledgments.html) | Acknowledgments | Password-protected |

</div>

You can also browse the [full guide with sidebar navigation](/antigravity-guide/).