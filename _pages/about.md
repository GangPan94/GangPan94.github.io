---
permalink: /
title: "Ernest (Gang) Pan"
author_profile: true
---

Welcome to my website!

My name is Ernest (Gang) Pan/潘刚. I am an Assistant Professor at the University of Akron, holding a Ph.D. in Accounting from the Olin Business School, Washington University.

My research examines the efficiency implications of corporate tax and accounting practices through the lens of neo-classical economics. I adopt an encouraging approach to teaching, blending real-world practices with academic insights.

I am enthusiastic about applying my analytical skills and academic expertise in a dynamic and challenging environment. Please explore my site or contact me directly for more details about my work, research interests, and academic journey.

{% assign cutoff = site.time | date_add: -180 | date: '%s' | plus: 0 %}
## Recent Work
{% assign recent_news = site.news | sort: "date" | reverse %}
{% for item in recent_news %}
{% assign item_epoch = item.date | date: '%s' | plus: 0 %}
{% if item_epoch >= cutoff %}
* **{{ item.date | date: '%b %Y' }}** — {{ item.content | strip_newlines | strip }}
{% endif %}
{% endfor %}
{% if recent_news.size == 0 %}
*No recent news.*
{% endif %}
