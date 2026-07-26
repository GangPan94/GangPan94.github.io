---
title: "The Competitive Advantage of Tax Planning"
collection: publications
category: manuscripts
layout: paper
ancova_decomposition: true
main_figure: ancova_decomposition
main_table_data: tax-planning
mindmap_data: tax-planning
permalink: /publication/2024-05-10-tax-planning
date: 2024-05-10
published: true
paper_authors: '**Gang (Ernest) Pan** — The University of Akron and Washington University in St. Louis.'
research_question: "Does corporate tax planning create a substantial competitive advantage, as many believe?"
excerpt: 'Does corporate tax planning create a substantial competitive advantage, as many believe? This paper examines the advantage's existence, magnitude, and persistence. I find that corporate tax planning innovations, proxied by net decreases in effective tax rates, do contribute to excess shareholder returns (returns above the cost of capital), indicating that the advantage exists. However, the absolute magnitude of these excess returns is modest, far smaller than the nominal tax savings. Compared with other indicators of successful business strategies, tax planning innovations have smaller factor loadings and account for less variation in excess returns. Sales growth alone explains more than seven times as much of the variation in excess returns as tax planning does. Even reductions in interest expense, an indicator of capital restructuring that prior research finds difficult to achieve, outperform tax planning. Nor does the advantage persist: firms' cash effective tax rates converge in the long run. Overall, tax planning is an essential part of corporate strategy, but on average not a significant source of competitive advantage.'
identification: >
  Cross-sectional regressions of excess returns (Alpha) on decreases in cash effective
  tax rates (DCETR) with firm and year fixed effects. Two causal tests exploit the
  Tax Cuts and Jobs Act of 2017: (1) an event study of market reactions to TCJA
  legislation events, and (2) a difference-in-differences design examining whether the
  excess-return-to-tax-planning relation erodes after 2017 for firms most exposed to
  cross-border relocation. TCJA's swift legislative process meant little time for
  anticipation, and it did not directly change firms' underlying operations.
key_findings:
  - "Tax planning innovations generate excess returns, confirming the competitive advantage **exists** — but the magnitude is **modest**, far smaller than nominal tax savings."
  - "Sales growth explains **9.3%** of variation in excess returns; tax planning explains only **0.5%** — a **7x gap**."
  - "Even interest-expense reductions (**0.9%**) outperform tax planning in explanatory power."
  - "Tax planning has the **smallest factor loading** among compared strategies in the horserace regression."
  - "The advantage **does not persist** — firms' cash effective tax rates converge in the long run."
  - "Stronger pre-TCJA DCETR-Alpha relations predicted **more negative market reactions** to TCJA legislation events."
  - "DiD: the excess-return-to-tax-planning relation **erodes post-2017** for firms exposed to cross-border relocation."
data_sources:
  - source: "Compustat"
    period: "FY 1993–2022"
    unit: "Firm-year"
  - source: "CRSP"
    period: "Matching sample window"
    unit: "Firm-month (returns)"
  - source: "Audit Analytics"
    period: "Matching sample window"
    unit: "Firm-year (tax fees)"
robustness:
  - title: "Alternative asset pricing models"
    description: "Market model and three-factor model replicate all major results."
  - title: "Alternative DCETR measures"
    description: "Results hold with alternative constructions of the tax-planning proxy."
  - title: "Arellano-Bond dynamics"
    description: "Dynamic panel specification confirms the convergence pattern."
  - title: "Survivor vs. full sample"
    description: "Results robust to including delisting firms, not just survivors."
ssrn_url: "http://dx.doi.org/10.2139/ssrn.4817541"
email: "gpan@uakron.edu"
paper_status: "Working paper"
citation: "Pan, Gang (Ernest). 2024. \"The Competitive Advantage of Tax Planning.\" Working Paper."
data_availability: "Data from Compustat, CRSP, and Audit Analytics are available through WRDS with an institutional subscription. Replication code will be made available upon publication."
replication_url: "http://dx.doi.org/10.2139/ssrn.4817541"
abstract: "Does corporate tax planning create a substantial competitive advantage, as many believe? This paper examines the advantage's existence, magnitude, and persistence. I find that corporate tax planning innovations, proxied by net decreases in effective tax rates, do contribute to excess shareholder returns (returns above the cost of capital), indicating that the advantage exists. However, the absolute magnitude of these excess returns is modest, far smaller than the nominal tax savings. Compared with other indicators of successful business strategies, tax planning innovations have smaller factor loadings and account for less variation in excess returns. Sales growth alone explains more than seven times as much of the variation in excess returns as tax planning does. Even reductions in interest expense, an indicator of capital restructuring that prior research finds difficult to achieve, outperform tax planning. Nor does the advantage persist: firms' cash effective tax rates converge in the long run. Overall, tax planning is an essential part of corporate strategy, but on average not a significant source of competitive advantage."
keywords: "Corporate tax planning, Competitive advantage, Rate of return, Valuation, Tax Cuts and Jobs Act"
bibtex: |
  @unpublished{pan2024taxplanning,
    author  = {Pan, Gang (Ernest)},
    title   = {The Competitive Advantage of Tax Planning},
    year    = {2024},
    note    = {Working paper, SSRN \url{http://dx.doi.org/10.2139/ssrn.4817541}},
    url     = {http://dx.doi.org/10.2139/ssrn.4817541}
  }
---

## Research Question and Motivation

Does corporate tax planning create a substantial competitive advantage? The premise that it does underpins decisions by entrepreneurs and tax practitioners, and it animates public debate about corporate tax avoidance. Advisory firms market tax planning as a source of competitive edge — EY states that "many private companies see tax operations effectiveness as providing a competitive advantage," and PwC claims that "tax-savvy strategies bring a competitive edge." Critics argue the same advantage is substantial and unfairly benefits shareholders, depleting government revenues and widening inequality. Yet Michael Porter's influential *Competitive Advantage* does not count taxes among the determinants of the five competitive forces; it treats taxes as a cost driver and a subcomponent of government policy. The empirical literature offers no direct evidence that taxes generate excess returns, because studies linking tax planning to equity returns rarely separate excess returns from the required rate of return.

This paper asks three questions: Does the competitive advantage of tax planning **exist**? If so, what is its **magnitude**? And does it **persist**?

## The Intuition

The connection between competitive advantage and excess returns is rooted in the well-established conclusion that a fully competitive market yields zero excess returns. Firms with a competitive advantage can earn higher rates of return on investment in excess of the cost of capital relative to their competitors (Porter, 1985). If tax planning innovations — tax strategies new to shareholders — generate such excess returns, the advantage exists. The paper further compares tax planning innovations to other sources of firm competitive advantages to assess their relative importance.

Four major reasons suggest that unlike other competitive advantages, such as those developed through R&D and brand names, the competitive moat surrounding tax-planning strategies appears narrow. First, the barriers to imitating a tax strategy are low because tax knowledge is non-rival, non-excludable, and easily spread — firms often shop tax strategies by consulting with professionals who serve many clients, and tax strategies disseminate through "industry gossip and clever reverse-engineering." Second, widespread adoption of similar tax strategies facilitates competition and diminishes the ability of firms to retain nominal tax savings, as tax benefits are passed on to customers or suppliers. Third, tax planning incurs non-tax costs that reduce net savings. Fourth, tax planning may raise the firm's required rate of return by increasing non-diversifiable risk, and tax authorities are poised to address prevalent techniques promptly. Together, these forces suggest that excess returns from tax planning innovations are likely modest both in absolute terms and relative to other competitive advantages in equilibrium.

## Empirical Approach

The paper analyzes the relation between net decreases in the cash effective tax rate (DCETR) and the contemporaneous common-stock alpha (Alpha). DCETR proxies for innovations in tax planning — the unexpected component of corporate tax-planning activity. For instance, a firm that moves a profitable patent into a low-tax subsidiary and routes the resulting royalties there lowers its cash effective tax rate; if shareholders did not foresee the change, DCETR registers the unexpected reduction. Alpha is the intercept obtained by regressing weekly returns over the fiscal year on the Fama–French three factors plus momentum, capturing realized returns above the required return predicted by the factor model.

This design is distinct from existing literature. Studies that examine price levels rather than excess returns cannot rule out reverse causality, in which information in prices anticipates future tax planning. Research linking tax planning to future returns concerns whether the market efficiently assimilates tax information, not the competitive edge tax planning might offer. Other studies infer tax planning's shareholder gains from market-to-book ratios (which carry noise from book values) or from accounting rates of return such as ROA and ROE (which are distant from economic and excess returns). By focusing on the relation between DCETR and the contemporaneous common-stock alpha, this paper speaks directly to the competitive advantage of tax planning.

To evaluate the **relative importance** of tax planning, the paper conducts "horserace" regressions and analyses of covariance (ANCOVA), pitting tax planning against pretax performance enhancements — sales growth, profit margin increases, COGS reductions, SG&A cuts, and interest-expense reductions — within the same regression. Because Alpha reflects excess returns from any source, other performance improvements can enter as covariates, allowing a direct comparison.

Two tests built on the **Tax Cuts and Jobs Act (TCJA) of 2017** support a causal interpretation. First, the cut in the statutory rate from 35% to 21% shrinks the savings from each dollar shielded from the IRS. As legislative events raised the probability that the reform would pass, the market expected firms whose excess returns were more sensitive to tax planning before the reform to suffer a narrowing of their competitive advantage. Consistent with this prediction, firms with stronger pre-TCJA DCETR–Alpha relations experienced more negative market reactions during TCJA legislation events. Second, the reform's international provisions target cross-border income shifting, the tax-planning channel that hinges on a firm's foreign footprint. In a difference-in-differences design, the excess return to tax planning innovation among firms most exposed to cross-border relocation erodes after 2017. Because TCJA did not directly change firms' underlying operating performance, both results indicate that the DCETR–Alpha relation captures excess returns from tax planning innovations — and underscore how vulnerable this competitive edge is to a single statute.

## Key Findings and Their Significance

The paper finds robust evidence that DCETRs are associated with higher Alpha, confirming that the competitive advantage of tax planning **exists** and that CETRs reflect this advantage in a timely fashion. However, the magnitude is **modest**: a one-percentage-point DCETR correlates with only a 14 to 17 basis-point increase in annualized Alpha. This effect is weaker than expected if the advantage were sustainable — a firm consistently saving one cent on every dollar earned through tax planning without additional risk would generate excess returns of at least 1 percent.

In the horserace, Alpha's relation with DCETRs is weaker than its relation with pretax performance enhancements. Tax planning innovations also fall short of other cost leadership indicators. ANCOVA indicates that tax planning innovations have less explanatory power for Alpha compared to other revenue-boosting and cost-cutting variables. Sales growth and COGS reductions each account for over seven times the variance explained by tax planning innovations. Even reducing interest expenses — an indicator of capital restructuring that prior research finds difficult to achieve — has a stronger effect.

The advantage **does not persist**. The paper investigates the dynamics of firms' tax positions and reveals a strong mean-reversion pattern: firms with initially low CETRs soon experience increases, whereas those with high CETRs tend to shift to more favorable tax conditions rapidly. If the advantage were sustainable, tax positions would separate rather than converge. Compared to CETRs, pretax profit margin and sales do not exhibit rapid mean reversion.

In the cross-section, the competitive advantage is stronger for firms with more opportunities for R&D (which is notably tax-advantaged) and tighter financial constraints, consistent with the view that tax planning acts as an internal financing mechanism. There is no evidence that commonly known tax planning activities — such as purchasing tax services from auditors or using tax havens — affect the DCETR–Alpha relation, consistent with the notion that generic tax planning knowledge does not contribute to excess economic returns.

## Institutional Context

Two institutional features matter for the identification strategy. First, the TCJA moved through Congress in roughly seven weeks (November–December 2017), leaving little time for firms to reposition operations in anticipation. Second, the legislation reduced the federal statutory rate from 35% to 21% and overhauled international provisions — including the Base-Erosion and Anti-Abuse Tax (BEAT) and the Global Intangible Low-Taxed Income (GILTI) provision — but it did not directly alter firms' underlying business activities, making it a plausibly exogenous shock to the *value* of tax planning without simultaneously changing firms' operations.

## Contribution and Implications

This paper stands to the tax literature as Ball and Shivakumar (2008) stands to accounting: just as that work quantified the relative importance of earnings announcements in delivering new information to the stock market, this paper presents comprehensive evidence that tax planning innovations generate excess returns while emphasizing the modest absolute and relative magnitude of the advantage. The findings challenge the narrative that tax planning is merely "corporate greed" and show why assessing its value implications requires appropriate proxies for economic returns. For policymakers, the findings suggest that market forces inherently limit how much shareholders benefit from tax planning — there may be little need for legislators to introduce complex tax codes solely to prevent firms from retaining "unjust" wealth, as new codes could divert entrepreneurs from their core business objectives and create fresh opportunities for savvy tax strategists to exploit.