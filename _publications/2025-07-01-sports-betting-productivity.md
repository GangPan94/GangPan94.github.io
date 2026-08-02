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

## Setting and Motivation

Following the Supreme Court's 2018 decision in *Murphy v. NCAA*, states moved quickly to legalize sports betting. As of February 2025, 32 states allow online sports betting and 37 permit retail sports betting. In 2024, commercial sports betting revenue increased by 24.8 percent to reach $13.78 billion, with Americans legally placing $149.90 billion in wagers throughout the year. The activity's growing salience is also evident within prediction markets: Kalshi, one of the largest prediction-market platforms, reports that sports markets account for roughly 70–80% of its total trading volume. This scale raises the stakes of potential costs, with critics arguing that prediction contracts amount to gambling in disguise and may exacerbate problem gambling, prompting calls for policymakers to treat gambling as a public health issue.

Prior work documents negative consequences of sports betting across households, financial markets, and social domains — financial distress, declining credit scores, speculative trading spillovers, increased intimate partner violence, and adverse public health outcomes. However, little is known about whether these effects extend to the workplace, translating into real productivity and economic consequences for local firms. This study fills that gap.

## The Mechanism: Attention Allocation and Cognitive Distraction

Modern sports betting, whether conducted through retail sportsbooks or online platforms, can affect employee productivity primarily by diverting attention away from work tasks and increasing cognitive load through three channels.

First, sports betting is time-consuming and attention-demanding, often occurring during work hours rather than being confined to leisure time. Placing and following bets requires monitoring games, tracking teams and players, and continuously processing information to evaluate potential outcomes, which interrupts sustained work effort and fragments attention. Task interruptions and divided attention impair cognitive performance and reduce productivity.

Second, sports betting can distract attention through emotional volatility and financial pressure. Betting outcomes generate short-term emotional fluctuations, and gambling losses can induce financial stress, both of which draw cognitive resources away from task-relevant activities and impair concentration, judgment, and decision quality.

Third, expanded access to sports betting may exacerbate mental health risks, including problem gambling, anxiety, and stress, which are closely linked to impaired attentional control, absenteeism, and reduced job functioning.

## Why the Effect Is Not Obvious Ex Ante

The effect of sports betting on employee productivity is not obvious ex ante. Participation may be limited to a subset of individuals, muting any aggregate productivity impact. At the same time, the launch of sports betting can boost the local economy and generate tax revenue often used to fund education and other public services, which could improve local households' financial conditions and workforce quality and offset potential productivity losses. Accordingly, whether the launch of sports betting affects employee productivity is ultimately an empirical question.

## Empirical Approach

The study exploits the staggered state-level launch of legal online sports betting from 2018 to 2021 in a difference-in-differences framework. Because two-way fixed effects estimators can produce biased estimates when adoption is staggered and effects are heterogeneous, the paper employs a stacked regression design that compares treated states only to "clean" controls — both never-treated states and not-yet-treated states. The analysis focuses on a three-year window before and after each state's online sports betting launch, restricting the primary analysis to the 2018–2021 launch cohorts. The sample ends in 2024: sports-event contracts on federally regulated prediction markets became available nationwide in late 2024, making sports betting effectively accessible in every state and leaving no cleanly untreated control states thereafter.

The primary dependent variable is employee productivity, measured as the logarithm of total sales divided by total employees — a proxy for the revenue-generating efficiency of a firm's human capital relative to its total workforce. Treatment is assigned by the state of a firm's headquarters, and the legal status of sports betting in each state is determined from the American Gaming Association's data. Geolocation technologies that licensed operators use to verify users' real-time locations mitigate concerns about cross-state spillover.

The identification strategy uses a cohort-stacked difference-in-differences design exploiting the staggered state-level launch of legal online sports betting, comparing treated firms (in states that launched betting) vs. not-yet-treated controls, with the year before launch (t = −1) as the base period. The Supreme Court's 2018 Murphy v. NCAA decision struck down PASPA, letting states legalize betting — this staggered timing provides the identifying variation from state-level policy shocks. Pre-launch coefficients (t = −3, t = −2) are jointly insignificant, supporting the parallel trends assumption.

To test the attention-allocation mechanism, the paper uses cognitive task intensity and skill reliance (from O*NET) to capture the attentional demands placed on a firm's workforce. If the productivity decline is driven by attention distraction, it should be stronger among firms whose work relies more heavily on cognitive effort and employee skill.

{% include paper-inline-table.html table_key="summary_stats" %}

## Key Findings

The paper documents a statistically and economically significant decline in employee productivity following the launch. Treated firms — those headquartered in states that launched sports betting — exhibit employee-level productivity that is 3.0 percent lower than control firms. After controlling for fixed effects, local economic conditions, and firm characteristics including employment size, this decline is incremental to shifts in labor demand or supply and other changes in local economic conditions.

<hr class="paper__inline-separator">
{% include sports-betting-event-study.html %}
<hr class="paper__inline-separator">

{% include paper-inline-table.html table_key="main_table" %}

The attention-allocation mechanism is confirmed: the productivity decline is stronger among firms with higher cognitive task intensity and greater reliance on employee skill, consistent with the prediction that expanded access to sports betting increases at-work distraction, diverting cognitive resources away from productive tasks.

{% include paper-inline-table.html table_key="heterogeneity" %}

The paper also finds that firm hiring rates and employee attrition both rise significantly following the launch, resulting in increased workforce churn. R&D intensity increases as well, with some evidence that this investment response is driven by the productivity decline. A two-stage least squares approach reveals an important distinction: predicted productivity is significantly related to R&D and capital expenditure intensity (particularly in the year after the productivity drop), consistent with these increases representing a firm response to the productivity loss. In contrast, predicted productivity is not significantly related to hiring, attrition, or churn, suggesting that labor market changes more plausibly reflect broader shifts in local labor markets following the launch rather than a direct response to the productivity decline. A reverse-direction test confirms that the productivity decline precedes rather than follows changes in firm inputs.

{% include paper-inline-table.html table_key="firm_responses" %}

The productivity decline is negative across all four launch cohorts (2018–2021) and stable in magnitude, mitigating concerns that the effect is driven by a single cohort or time-specific confound.

### Robustness

The baseline result is robust to alternative productivity measures — log(sales/SG&A) and total factor productivity (TFP) — and to controlling for the opioid crisis (state-level overdose mortality) and COVID-19 pandemic (period indicators, state COVID severity). The treatment coefficient remains stable at approximately −0.030 across all specifications.

## Contributions

The study contributes to three strands of literature. First, it extends the behavioral economics literature on limited attention and cognitive constraints by linking attention frictions to real workplace performance and firm labor costs. Second, it contributes to the growing literature on the real effects of sports betting legalization by providing novel evidence on workplace outcomes, showing that the costs of speculative market liberalization extend beyond bettors themselves. Third, it contributes to the productivity and labor economics literature by identifying a novel, policy-induced distraction shock that operates through attention diversion and increased cognitive load rather than through wages, employment conditions, or physical characteristics — highlighting a behavioral channel through which policy changes can influence workplace efficiency.

## Institutional Context

For more than two decades, the Professional and Amateur Sports Protection Act (PASPA) effectively prohibited sports betting in most U.S. states. This regulatory regime ended on May 14, 2018, when the Supreme Court struck down PASPA, returning authority over sports betting regulation to individual states. States rapidly moved to legalize and regulate through legislative action or ballot initiatives. Licensed operators rely on geolocation technologies to verify users' real-time locations and prevent access from outside the state, mitigating concerns that legalization in one state mechanically spills over into neighboring states.