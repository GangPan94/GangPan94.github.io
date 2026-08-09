---
title: "Labor Productivity and Firm Strategic Response: Evidence from Sports Betting Legalization"
collection: publications
category: working_papers
layout: paper
inline_content: true
event_study: true
main_figure: event_study
main_table_data: sports-betting-productivity
mindmap_data: sports-betting
permalink: /publication/2025-07-01-sports-betting-productivity
date: 2025-07-01
published: true
paper_status: "Working paper"
paper_authors: 'Zhiru Lin (DePauw University), **Gang (Ernest) Pan** (The University of Akron), Mengmeng Wang (UNC Greensboro)'
research_question: "What happens to worker productivity when a state legalizes online sports betting?"
excerpt: 'Exploiting the staggered launch of legal sports betting across U.S. states, we find that employee productivity declines following the launch. The effect is stronger among firms whose work relies more heavily on cognitive effort and employee skill, consistent with an attention-allocation mechanism: expanded access to sports betting increases at-work distraction, diverting cognitive resources away from productive tasks. We also find that firm hiring and attrition both rise following the launch, increasing employee churn, and R&D and capital expenditures increase as well, with some evidence that this investment response, though not the hiring pattern, is driven by the productivity decline. Our findings show that the costs of speculative market liberalization extend beyond the bettors themselves: firms bear an economically significant productivity cost through their workers'' attention and respond by adjusting labor and investment inputs.'
abstract: "Exploiting the staggered launch of legal online sports betting across U.S. states, we find that employee productivity declines following the launch. The effect is stronger among firms whose work relies more heavily on cognitive effort and employee skill, consistent with an attention-allocation mechanism: expanded access to sports betting increases at-work distraction, diverting cognitive resources away from productive tasks. We also find that firm hiring and attrition both rise following the launch, increasing employee churn, and R&D and capital expenditure intensity increase as well, with some evidence that this investment response, though not the hiring pattern, is driven by the productivity decline. Our findings show that the costs of speculative market liberalization extend beyond the bettors themselves: firms bear an economically significant productivity cost through their workers'' attention and respond by adjusting labor and investment inputs."
keywords: "Sports betting legalization, employee productivity, attention allocation, staggered difference-in-differences, firm labor decisions"
identification: >
  Cohort-stacked difference-in-differences design exploiting the staggered
  state-level launch of legal online sports betting from 2018 to 2021. Compares
  treated firms (in states that launched betting) vs. not-yet-treated controls,
  with year-before-launch (t = −1) as the base period. Parallel trends
  supported: pre-launch coefficients (t = −3, t = −2) are jointly
  insignificant. The staggered timing provides identifying variation from
  state-level policy shocks — the Supreme Court's 2018 Murphy v. NCAA decision
  struck down PASPA, letting states legalize betting.
key_findings:
  - "Employee productivity at treated firms is **3.0% lower** than controls following launch (Table 3)."
  - "The decline appears in the launch year and **persists** through the end of the event window."
  - "The effect is **larger at firms with higher cognitive task intensity and greater skill reliance** (Table 4) — consistent with an attention-allocation mechanism."
  - "Firm **hiring rates and employee attrition both rise** significantly, increasing workforce churn (Table 5)."
  - "**R&D intensity rises by 0.4 percentage points** of lagged assets (coef = 0.004, t = 2.507); capex moves in the same direction but is small and not always significant."
  - "2SLS reverse-direction test: the productivity decline does **not** drive hiring/attrition/churn — those reflect local labor market conditions; the **R&D and capex response IS driven by the productivity decline** (Table 6)."
  - "The effect is **negative across all four launch cohorts** (2018–2021), stable in magnitude (Table 7)."
  - "Robust to alternative productivity measures — log(sales/SG&A) and TFP (Table 8) — and to controlling for the **opioid crisis and COVID-19 pandemic** (Table 9)."
data_sources:
  - source: "Compustat"
    period: "2015–2024"
    unit: "Firm-year (fundamentals, employment)"
  - source: "State-level sports betting legalization dates"
    period: "2018–2021 launch cohorts"
    unit: "State × year"
  - source: "U.S. Bureau of Economic Analysis"
    period: "2015–2024"
    unit: "State GDP and personal consumption growth"
  - source: "U.S. Bureau of Labor Statistics"
    period: "2015–2024"
    unit: "State unemployment"
  - source: "Revelio Labs"
    period: "Matching sample window"
    unit: "Firm-year (hiring, attrition, churn)"
  - source: "O*NET (Acemoglu & Autor 2011; Deming 2017)"
    period: "Cross-sectional"
    unit: "Occupation-level cognitive task intensity and skill reliance"
robustness:
  - title: "Parallel trends"
    description: "Pre-launch coefficients (t = −3, t = −2) are jointly insignificant, supporting the parallel trends assumption."
  - title: "Alternative productivity measures"
    description: "Results robust to log(sales/SG&A) and total factor productivity (TFP) as dependent variables (Table 8)."
  - title: "Confound controls"
    description: "Treatment effect stable when controlling for the opioid crisis (state-level overdose mortality) and COVID-19 pandemic (period indicators, state COVID severity) (Table 9)."
  - title: "Cohort-by-cohort stability"
    description: "The productivity decline is negative across all four launch cohorts (2018–2021) and stable in magnitude (Table 7)."
  - title: "2SLS reverse-direction test"
    description: "Instrumenting productivity with the launch indicator shows the productivity decline drives R&D and capex responses but not hiring/attrition/churn, which reflect local labor market conditions (Table 6)."
ssrn_url: ""
email: "gpan@uakron.edu"
citation: "Lin, Zhiru, Gang (Ernest) Pan, and Mengmeng Wang. 2025. \"Labor Productivity and Firm Strategic Response: Evidence from Sports Betting Legalization.\" Working Paper."
data_availability: "Data from Compustat are available through WRDS with an institutional subscription. Revelio Labs data are available via institutional license. State-level legalization dates are publicly available. Replication code will be made available upon publication."
bibtex: |
  @unpublished{lin2025sportsbetting,
    author  = {Lin, Zhiru and Pan, Gang (Ernest) and Wang, Mengmeng},
    title   = {Labor Productivity and Firm Strategic Response: Evidence from Sports Betting Legalization},
    year    = {2025},
    note    = {Working paper}
  }
---

## Introduction

Following the Supreme Court's 2018 decision in *Murphy v. NCAA*, states moved quickly to legalize sports betting. As of February 27, 2025, 32 states allow online sports betting and 37 permit retail sports betting (American Gaming Association 2024). In 2024, commercial sports betting revenue increased by 24.8 percent to reach $13.78 billion (American Gaming Association 2025), with Americans legally placing a total of $149.90 billion in wagers throughout the year 2024. The activity's growing salience is also evident within prediction markets: Kalshi, one of the largest prediction-market platforms, reports that sports markets account for roughly 70-80% of its total trading volume (McQuillan 2025). This scale raises the stakes of potential costs, with critics arguing that prediction contracts amount to gambling in disguise and may exacerbate problem gambling, prompting calls for policymakers to treat gambling as a public health issue (Smith 2025). Prior work documents negative consequences of sports betting across households, financial markets, and social domains (Baker et al. 2024; Douidar et al. 2024; Hollenbeck et al. 2025; Matsuzawa and Arnesen 2024; Taylor et al. 2025). However, little is known about whether these effects extend to the workplace, translating into real productivity and economic consequences for local firms.

### Mechanism: Attention Allocation and Cognitive Distraction

This study examines how legalized sports betting affects employee productivity. Modern sports betting, whether conducted through retail sportsbooks or online platforms, can affect employee productivity primarily by diverting attention away from work tasks and increasing cognitive load. First, sports betting is time-consuming (Fleming et al. 2024) and attention-demanding, often occurring during work hours rather than being confined to leisure time. Placing and following bets requires monitoring games, tracking teams and players, and continuously processing information to evaluate potential outcomes, which interrupts sustained work effort and fragments attention. Task interruptions and divided attention impair cognitive performance and reduce productivity (e.g., Loewenstein and Wojtowicz 2025). Second, sports betting can distract attention through emotional volatility and financial pressure. Betting outcomes generate short-term emotional fluctuations, and gambling losses can induce financial stress, both of which draw cognitive resources away from task-relevant activities and impair concentration, judgment, and decision quality (e.g., Kaur et al. 2025). Third, expanded access to sports betting may exacerbate mental health risks, including problem gambling, anxiety, and stress, which are closely linked to impaired attentional control, absenteeism, and reduced job functioning (e.g., Deady et al. 2022). Taken together, these three channels support an attention-allocation mechanism through which sports betting increases at-work distraction and reduces employee productivity.

### Link to Behavioral Economics

Behavioral economics emphasizes that agents do not process information or allocate attention frictionlessly. A large literature on limited attention and cognitive constraints primarily studies how attention frictions affect the behavior of investors and shareholders and, in turn, asset prices and corporate outcomes (Barber and Odean 2008; Hendershott et al. 2022; Hirshleifer and Teoh 2003; Hirshleifer et al. 2009). In contrast, large-sample causal evidence linking attention or distraction directly to labor productivity is scarce. Two recent papers move in this direction, but in more specific settings. Andres et al. (2025) show that speculative takeover rumors trigger anxiety and distraction and are associated with temporary declines in firm and employee productivity; their setting features firm-specific, information-driven, episodic shocks that operate through heightened career concerns, and the effect is temporary. Aslan (2022) documents that negative personal wealth shocks generate financial distress that diverts analysts' attention from work-related activities, reducing analysts' productivity; the mechanism operates through idiosyncratic wealth fluctuations and financial pressure within a narrow, high-skill occupation. Unlike episodic firm-specific events (e.g., takeover rumors) or idiosyncratic personal shocks (e.g., wealth changes), the launch of legal sports betting lowers participation barriers and increases exposure to persistent, low-intensity demands on attention that can overlap with work hours, affecting a broad segment of the population on an ongoing basis. The mechanism we study therefore captures a general form of at-work attention distraction, including time diverted to betting, fragmented attention, emotional or financial strain, and anxiety or mental health impairments, with potential implications for labor productivity in the broader economy.

### Why the Effect Is Not Obvious Ex Ante

However, the effect of sports betting on employee productivity is not obvious ex-ante. Participation in sports betting may be limited to a subset of individuals, muting any aggregate productivity impact. At the same time, the launch of sports betting can boost the local economy and generate tax revenue often used to fund education and other public services, which could improve local households' financial conditions and workforce quality and offset potential productivity losses. Accordingly, whether the launch of sports betting affects employee productivity is ultimately an empirical question.

### Empirical Approach and Main Findings

Using staggered state-level launch of legal sports betting from 2018 to 2021 and focusing on a three-year window before and after each state's sports betting launch (SBL) (Appendix 1 provides a timeline of SBL across states), we document a statistically and economically significant decline in employee productivity following the launch. Specifically, we find that following sports betting launch, treated firms (i.e., firms headquartered in states that launched sports betting) exhibit employee-level productivity that is 5.9 percent lower than that of the control firms following SBL. After controlling for fixed effects, local economic conditions, and firm characteristics including firm employment size, our results suggest that this productivity decline is incremental to shifts in labor demand or supply and other changes in local economic conditions following the launch.

{% include paper-inline-table.html table_key="summary_stats" %}

### Mechanism Test

To test the mechanism of at-work attention distraction that causes the productivity decline, we use cognitive task intensity and skill reliance to capture the attentional demands placed on a firm's workforce. We find that the productivity decline is stronger among firms with higher cognitive task intensity and greater reliance on employee skill. These findings suggest that the productivity decline following the launch of sports betting is driven by employee attention distraction, consistent with the attention-allocation mechanism outlined above.

<hr class="paper__inline-separator">
{% include sports-betting-event-study.html %}
<hr class="paper__inline-separator">

{% include paper-inline-table.html table_key="main_table" %}

{% include paper-inline-table.html table_key="heterogeneity" %}

### Firm Labor and Investment Responses

We further explore the impact of sports betting on firm labor inputs or costs and other investment decisions. A decline in employee productivity could, in principle, coincide with changes in firms' labor inputs, either driven by shifts in local labor market or by firms adjusting labor input choices, such as expanding labor quantity through higher hiring or replacement of incumbent employees (e.g., Acemoglu and Restrepo 2018; Curtis et al. 2021; Hubmer and Restrepo 2025), which raises labor related costs through recruiting, onboarding, and training expenses and disrupts firm-specific human capital. Firms may alternatively respond to productivity loss by increasing capital or R&D investment, which could complement or substitute for labor input depending on resource constraints. We therefore examine how firms' input decisions evolve following the launch of legal sports betting, and whether any observed changes are attributable to the productivity decline itself or instead reflect other confounding factors.

We find that following the launch, treated firms experience significantly higher hiring rates and employee attrition, resulting in increased workforce churn. We also find increases in R&D expenditures and SG&A expenses, though the increase in capital expenditures is not statistically significant. To assess whether these patterns are attributable to the decline in productivity itself, we implement a two-stage least squares approach in which employee productivity, predicted from the SBL indicator (i.e., Treat x Post) in the first stage, is used to explain the concurrent and the subsequent-year hiring, attrition, churn, R&D, and capital expenditures, and SG&A in the second stage. Predicted productivity is not significantly related to hiring, attrition, or churn in period, consistent with the notion that the SBL induced firm-level productivity decline does not drive labor market changes and more plausibly reflects broader shifts in local labor markets following the launch. In contrast, predicted productivity is significantly related to R&D, and capital expenditure, and SG&A, particularly in the subsequent year of the productivity drop, consistent with these increases being attributable, at least in part, to the productivity loss. We also conduct a reverse-direction test to rule out the possibility that the productivity decline is itself a consequence of these input changes rather than their cause. In the first stage, hiring, attrition, churn, R&D, and capital expenditures, and SG&A are each regressed on the SBL indicator. In the second stage, the following year's employee productivity is regressed on the values predicted from the first stage. No significant relation is found in the second stage, indicating that the productivity decline precedes rather than follows changes in firm input. Taken together, these results indicate that the rise in hiring, attrition, and churn more plausibly reflects local labor market conditions, while the increases in R&D and capital expenditures represent a firm response to the productivity loss.

{% include paper-inline-table.html table_key="firm_responses" %}

### Contributions

Our study contributes to three strands of literature. First, it extends the behavioral economics literature on limited attention and cognitive constraints by linking attention frictions to real workplace performance and firm labor costs. While a large body of research examines how limited attention affects investors and shareholders and, in turn, asset prices and corporate outcomes (Barber and Odean 2008; Hirshleifer and Teoh 2003; Hirshleifer et al. 2009; Hendershott et al. 2022), evidence on how attention constraints operate in employees' day-to-day work activities remains scarce. We fill this gap by showing that a policy-induced expansion in attention-demanding activities can impair employee productivity in a broad labor market setting and lead to higher labor costs for firms.

Second, our study contributes to the growing literature on the real effects of sports betting legalization. Prior research primarily examines household-level outcomes and broader social consequences, such as financial distress, consumption, and credit behavior (Baker et al. 2024, Douidar et al. 2024, Hollenbeck et al. 2025, Matsuzawa and Arnesen 2024, Taylor et al. 2025). We extend this literature by providing novel evidence on the workplace outcomes of sports betting legalization, showing that it affects employee productivity and firms' input decisions. The research is also relevant to policymakers weighing tax-revenue gains from legalizing prediction markets against social costs.

Third, our study contributes to productivity and labor economics literature by identifying a novel, policy-induced distraction shock. Prior research on policy shocks and labor market outcomes, such as minimum wage reforms, right-to-work laws, or recreation marijuana legalization, primarily emphasizes channels operating through wages, employment conditions, or physical characteristics (e.g., Card and Krueger 1994, Chava et al. 2020, Pan 2025b). In contrast, we show that sports betting legalization affects productivity through attention diversion and increased cognitive load, highlighting a behavioral channel through which policy changes can influence workplace efficiency.
