---
title: "The Competitive Advantage of Tax Planning"
collection: publications
category: manuscripts
layout: paper
inline_content: true
ancova_decomposition: true
main_figure: ancova_decomposition
main_table_data: tax-planning
mindmap_data: tax-planning
permalink: /publication/2024-05-10-tax-planning
date: 2024-05-10
published: true
paper_authors: '**Gang (Ernest) Pan** — The University of Akron and Washington University in St. Louis.'
research_question: "Does corporate tax planning create a substantial competitive advantage, as many believe?"
excerpt: "Does corporate tax planning create a substantial competitive advantage, as many believe? This paper examines the advantage's existence, magnitude, and persistence. I find that corporate tax planning innovations, proxied by net decreases in effective tax rates, do contribute to excess shareholder returns (returns above the cost of capital), indicating that the advantage exists. However, the absolute magnitude of these excess returns is modest, far smaller than the nominal tax savings. Compared with other indicators of successful business strategies, tax planning innovations have smaller factor loadings and account for less variation in excess returns. Sales growth alone explains more than seven times as much of the variation in excess returns as tax planning does. Even reductions in interest expense, an indicator of capital restructuring that prior research finds difficult to achieve, outperform tax planning. Nor does the advantage persist: firms' cash effective tax rates converge in the long run. Overall, tax planning is an essential part of corporate strategy, but on average not a significant source of competitive advantage."
identification: >
  Cross-sectional regressions of excess returns (Alpha) on decreases in cash effective
  tax rates (DCETR) with firm and year fixed effects. Two causal tests exploit the
  Tax Cuts and Jobs Act of 2017: (1) an event study of market reactions to TCJA
  legislation events, and (2) a difference-in-differences design examining whether the
  excess-return-to-tax-planning relation erodes after 2017 for firms most exposed to
  cross-border relocation. TCJA's swift legislative process meant little time for
  anticipation, and it did not directly change firms' underlying operations.
myth_busters:
  - myth: "Tax planning creates a large competitive advantage."
    reality: "It exists — but the magnitude is economically modest."
    implication: "The nominal tax saving from a strategy and the competitive advantage it creates can differ dramatically. Managers should not equate the dollar amount sheltered through a tax strategy with the economic edge it generates. Nor should the manager compare the nominal tax saving with savings from other strategies."
  - myth: "Tax planning is a relatively substitutional source of competitive advantage."
    reality: "Tax planning has the smallest factor loading among compared strategies."
    implication: "Managers should avoid overinvesting attention in tax planning relative to innovations in the firm's core business; however, tax planning remains a necessary cost of staying competitive, and firms that neglect it fall behind even when its contribution is modest relative to other corporate strategies."
  - myth: "Tax planning advantages persist over time."
    reality: "Tax positions converge — the advantage erodes through competition and imitation."
    implication: "The paper documents that tax positions converge, not that firms should abandon tax planning. This reflects market competition — imitation erodes the edge, as with any competitive advantage."
  - myth: "Generic tax strategies (tax havens, buying auditor tax services) create excess returns."
    reality: "No evidence that commonly known tax planning activities affect the link between tax planning and excess returns. Generic, widely-known strategies don't generate excess economic returns."
    implication: "The finding highlights that it is novel, firm-specific tax innovations — not commoditized strategies — that are associated with excess returns. Tax planning still matters; the distinction is between generic and innovative approaches."
  - myth: "Tax planning is just corporate greed benefiting shareholders unfairly."
    reality: "Market forces inherently limit shareholder benefits — the moat is narrow because tax knowledge is non-rival, non-excludable, and easily imitated."
    implication: "The paper does not take a normative stance on corporate tax planning. Market forces already constrain shareholder benefits; policymakers may not need complex codes to prevent unjust wealth retention, and complex anti-avoidance codes may create unintended consequences."
key_findings:
  - "Tax planning innovations generate excess returns, confirming the competitive advantage **exists** — but the magnitude is **modest**, far smaller than nominal tax savings."
  - "Sales growth explains **9.3%** of variation in excess returns; tax planning explains only **0.5%**."
  - "Even interest-expense reductions (**0.9%**) outperform tax planning in explanatory power."
  - "Tax planning has the **smallest factor loading** among compared strategies in the horserace regression."
  - "The advantage **does not persist** — firms' cash effective tax rates converge in the long run."
  - "Firms that benefited most from tax planning saw the **biggest stock-price drops** when the 2017 tax law (TCJA) was being debated — the market recognized their edge was at risk."
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

## Introduction

This paper shows that corporate tax planning innovations constitute a competitive advantage by documenting their ability to generate *excess* returns. I follow Dyreng, Lin, and Lindsey (2008) and Hanlon and Heitzman (2010) and define tax planning broadly as all transactions that reduce explicit taxes. The connection between competitive advantage and excess returns is rooted in the well-established conclusion that a fully competitive market yields zero excess returns. Firms with a competitive advantage can earn higher rates of return on investment in excess of the cost of capital relative to their competitors (Porter, 1985). I further compare tax planning innovations to other sources of firm competitive advantages and find that tax planning's competitive edge is relatively modest. Adhering to the shareholder value maximization principle (Friedman, 1970), I focus on the *excess* returns accrued to shareholders. Thus, in this context, tax planning innovations refer to tax strategies new to shareholders. In this paper, I use the term "innovation" analogously to time-series analysis: an innovation is the difference between an observed value and its best prediction, aligning with the common understanding of innovation. Schumpeter (1934) centers innovation on "new combinations" of materials and productive means, including the "new organization of any industry." In the context of tax planning, innovation therefore is a new combination of contractual features that lowers the explicit tax burden.

### The Debate

Whether, and to what extent, tax planning generates competitive advantage has received considerable attention from multiple groups. The premise of such an advantage underpins many decisions by entrepreneurs and tax practitioners. A recent EY article states, "many private companies see tax operations effectiveness as providing a competitive advantage" (EY, 2023). Similarly, PwC (2025) claims, "Tax-savvy strategies bring a competitive edge." Many view this advantage as substantial and as unfairly benefiting shareholders, raising concerns about government funding and social fairness. For instance, Alstadsater et al. (2023), in a high-profile report on global tax avoidance, asserts that "It depletes government revenues, and if not accompanied by egalitarian measures, it risks increasing inequality by boosting the after-tax profits of shareholders, who tend to be towards the top of the income distribution."

### Porter's Framework

On the other hand, Michael E. Porter's influential work -- *Competitive Advantage: Creating and Sustaining Superior Performance* -- does not elevate tax planning as one of the primary determinants of the five competitive forces. Rather, taxes are treated as a major cost driver and as a subcomponent of government policy. The empirical literature likewise does not provide direct evidence of excess returns attributable to taxes -- i.e., returns exceeding the cost of equity capital -- because studies that relate tax planning to equity returns typically do not separate excess returns from the required rate of return.

### Empirical Approach

To examine the presence, magnitude, and persistence of tax planning's competitive advantage, I analyze the relation between negative changes in the cash effective tax rate -- i.e., changes in CETR multiplied by -1 (hereafter, NegDeltaCETR) -- and the *contemporaneous* common-stock alpha (ALPHA). NegDeltaCETR proxies for innovations in tax planning (i.e., unexpected corporate tax planning activities). This measure assumes that, holding other covariates constant, CETR follows a random-walk process, so the year-to-year difference captures unexpected tax planning. ALPHA is the intercept obtained by regressing weekly returns over the fiscal year on the Fama-French three factors plus momentum. It reflects excess returns to shareholders by capturing realized returns above the required return predicted by the factor model. A stronger positive correlation between NegDeltaCETR and ALPHA indicates a more substantial competitive edge from marginal tax-planning efforts, which can directly enhance shareholder payoffs or support future firm investments.

The examination of the relation between tax planning innovations and excess returns is distinct from existing literature. Previous studies focusing on levels of prices instead of excess returns do not preclude the explanation that the information embedded in prices predicts changes in tax planning proxies (i.e., prices lead taxes). Research linking tax planning to *future* returns primarily addresses market efficiency in assimilating tax information, not the competitive edge tax planning might offer. Examining market-to-book ratios further complicates the issue by introducing noise from the book values. Some studies use accounting rates of returns, such as ROA and ROE, which are distant from economic and excess returns (Fisher and McGowan, 1983; Penman, 2021; Green et al., 2022). By focusing on the relation between NegDeltaCETR and the *contemporary* common equity alpha, this paper speaks to the competitive advantage of tax planning, circumvents the measurement issues of accounting-based return measures, and sheds light on the *relative* importance of tax planning, an area not extensively covered in existing literature.

### Findings

I find robust evidence that NegDeltaCETRs are associated with higher ALPHA, suggesting that the competitive advantage of tax planning exists and CETRs reflect such an advantage in a timely fashion. However, the magnitude of the association seems modest. Specifically, a one percent NegDeltaCETRs correlates with a 14 to 17 basis-point increase in annualized ALPHA. This effect is weaker than expected if tax planning competitive advantage were viewed as sustainable. For instance, if a firm could consistently save one cent on every dollar earned through tax planning without incurring additional risks, the resultant excess return would be at least 1 percent.

{% include paper-inline-table.html table_key="summary_stats" %}

### Why the Competitive Moat Is Narrow

Four major reasons suggest that unlike other competitive advantages, such as those developed through R&D and brand names, the competitive moat surrounding tax-planning strategies appears narrow. First, firms cannot maintain an information advantage of tax planning because tax knowledge is non-rival, non-exclusive, and easily spread. Firms often shop tax strategies by consulting with professionals who serve many clients (Cook et al., 2020; McGuire et al., 2012) or even with their lenders (Gallemore et al., 2019). Additionally, tax strategies are also disseminated through "industry gossip and clever reverse-engineering" (Novack, 1998).

Second, the widespread adoption of similar tax strategies facilitates competition and diminishes the ability of firms to retain nominal tax savings. The tax benefits will be passed on to customers (in competitive product markets) or suppliers (facing a downward demand curve). Consider the scenario where many manufacturers exploit tax advantages from semiconductor-related investments. The prices of the inputs -- including materials necessary to build foundries, engineering talents, etc. -- will increase due to the heightened demand. Meanwhile, the prices of semiconductor outputs will decrease due to the increased supply. Consequently, the competition among tax planners reduces the pretax returns, transferring real tax savings to suppliers and customers rather than retaining them for shareholders (Scholes et al., 2014; Stiglitz, 2015; Dyreng et al., 2022).

Tax planning also incurs various costs, including direct administrative costs (Scholes et al., 2014), agency issues (Desai et al., 2006; Desai et al., 2009), conflicts between financial and tax objectives (Mills and Newberry, 1998), and potential enforcement or political repercussions (Zimmerman, 1983). In addition, tax authorities and legislative entities are aware of prevalent tax-planning techniques and are poised to address them promptly.

Moreover, tax planning may increase the firm's risk exposure. These risks encompass tax audits and enforcement actions (Zimmerman, 1983; Mills and Newberry, 1998), increased firm complexity and opacity (Desai et al., 2006), the ambiguity inherent in tax codes and the challengeable legitimacy of claimed tax benefits (Frischmann, 2008), and future legislative or regulatory events.

From a valuation perspective, the aforementioned reasons collectively suggest that tax planning innovations might (1) have a negative impact on pretax cash flows, (2) lack persistence, and (3) result in increased risks and, consequently, higher required returns. Therefore, excess returns from tax planning innovations are likely modest both in absolute terms and when compared to other competitive advantages in equilibrium.

### Relative Importance

To evaluate the relative importance of tax planning innovations in generating excess returns, I conduct "horserace" regressions and analyses of covariance (ANCOVA). I find that ALPHA's relation with NegDeltaCETRs is weaker than its relation with pretax performance enhancements, such as sales growth and profit margin increases. Tax planning innovations also fall short compared to other cost leadership indicators, such as cuts in COGS (costs of goods sold) or SG&A (selling, general and administrative expenses). Analyses of covariance further indicate that tax planning innovations have less explanatory power for ALPHA compared to other revenue-boosting and cost-cutting variables. Remarkably, sales growth and COGS reductions each account for over seven times the variance explained by tax planning innovations in some specifications. Even reducing interest expenses has a stronger effect than tax planning innovations. This finding is surprising considering the difficulties inherent in adjusting capital structures (Flannery et al., 2006; Lemmon et al., 2008; Kim et al., 2019). These analyses suggest that tax planning is not an efficient avenue for gaining competitive advantages. They also address the limitation of studying tax-planning innovations in isolation: because we observe only marginal changes in tax planning, its absolute importance may be understated. Focusing on relative importance obviates the need for a counterfactual scenario with no tax planning.

{% include ancova-decomposition.html %}

{% include paper-inline-table.html table_key="main_table" %}

{% include paper-inline-table.html table_key="horserace" %}

### Persistence of the Advantage

I further investigate the dynamics of firms' tax positions to evaluate the validity of the random walk assumption in tax planning and to provide evidence on the sustainability of the tax planning competitive advantage. Porter (2008) notes that *sustainable competitive advantage* is the "fundamental basis" for long-term excess returns. I apply the method of Lemmon et al. (2008) to examine the time-series properties of CETRs. My analysis reveals a strong mean-reversion pattern: Firms with initially low CETRs soon experience increases, whereas those with high CETRs tend to shift to more favorable tax conditions rapidly. These findings suggest that first, companies can easily use tax planning to transition out of disadvantageous tax positions. Second, firms do not maintain their tax position in the long run, challenging the notion that tax planning provides a sustainable competitive edge. Compared to CETRs, pretax profit margin and sales do not exhibit rapid mean reversion.

The mean-reverting nature of CETRs suggests that tax planning does not strictly follow a random-walk process, and some changes in CETRs are anticipated. However, this does not imply that the random-walk assumption is an inappropriate empirical approximation. First, the anticipated changes in CETRs do not fundamentally alter the conclusions regarding the existence of a competitive advantage from tax planning. In an efficient market, these anticipated changes should not affect current and future returns but instead represent classical measurement errors, leading to an attenuation bias that typically biases coefficients toward zero. Second, I employ dynamic panel data analysis techniques and control for the anticipated portion of decreases in CETRs. Evidence indicates that the attenuation bias is not substantial and does not affect the overall inferences.

### Cross-Sectional Evidence

In the cross-section, I find that a stronger relation between decreases in CETRs and ALPHA predicts more favorable future tax outcomes, such as reduced tax payments and delayed settlements with tax authorities. Potential determinants of the competitive advantage of tax planning include more opportunities for R&D, which is notably tax-advantaged, and tighter financial constraints, consistent with the view that tax planning acts as an internal financing mechanism (Edwards et al., 2016). Additionally, firms with high ASSET4 community scores (a component of the social pillar that includes "tax controversies") show a weaker association between decreases in CETRs and ALPHA, suggesting concerns over the negative societal views on tax planning. I find no evidence that commonly known tax planning activities, such as purchasing outside tax consulting services or using tax havens, affect the correlation. These results align with the notion that generic tax planning knowledge does not contribute to excess economic returns (Stigler, 1963).

### Contribution and Implications

The importance of this paper to the tax literature parallels the importance of the seminal work by Ball and Shivakumar (2008) in the accounting literature. Ball and Shivakumar (2008) provides systematic evidence that quantifies the relative importance of earnings announcements in delivering new information to the stock market, shedding light on the primary role of financial accounting. Similarly, this paper presents comprehensive evidence that tax planning innovations generate excess returns while emphasizing the modest absolute and relative magnitude of the competitive advantage derived from tax planning. Thus, my paper contributes to the ongoing debate regarding the extent to which firms and shareholders achieve "real gains" from tax planning. These findings challenge the narrative that tax planning is merely an expression of "corporate greed." In addition, these findings underscore the importance of choosing appropriate proxies for economic returns when assessing the value implications of tax planning.

My paper also contributes to valuation literature by showing that investors seem to understand that nominal tax savings do not necessarily contribute to excess returns, which respond more strongly to other firm performance improvements. The documented mean-reverting properties of CETRs are useful for market participants to forecast firm tax burdens. Meanwhile, the moderate value implications of tax planning innovations raise doubts about the need for complex and costly forecasting methods for future ETRs.

For policymakers, my findings suggest that market forces inherently constrain the extent to which shareholders can benefit from tax planning. Therefore, there may be little need for legislators to introduce complex tax codes solely to prevent firms and their shareholders from retaining "unjust" wealth. In fact, implementing new tax codes could divert entrepreneurs from their core business objectives (Schumpeter, 1942) and create additional opportunities for savvy tax strategists to temporarily exploit new potential loopholes, undermining the original intentions of such tax reforms.
