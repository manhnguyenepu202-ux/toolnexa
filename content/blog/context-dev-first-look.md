---
title: Context.dev First Look (2026): One API for Web, Brand and People Data
description: Context.dev, formerly Brand.dev, bundles scraping, brand data and enrichment in one credit pool. Here's what credits buy, and why we haven't scored it yet.
date: 2026-11-06
category: ai-tools
author: ToolKenzon Editorial
readTime: 6
tools: claude, chatgpt, zapier
cover: book
---

*Affiliate note: ToolKenzon may earn a commission if you buy through the Context.dev link in this article. It costs you nothing extra and it doesn't change what we say.*

Context.dev is a developer API that gives software and AI agents access to the web. It scrapes pages, crawls sites, pulls logos and brand data, and looks up companies and people, all from one credit balance. Until March 2026, it was called Brand.dev.

We haven't built with it ourselves. We read its pricing page, documentation home, terms and privacy policy, along with several third-party reviews. Checked November 6, 2026.

## Why there's no score yet

Trustpilot shows no reviews at all, and the articles we found are mostly short affiliate-style pieces with conflicting numbers. Speed, success rates on hard sites, and data quality are what matter for a tool like this, and we found no independent measurements. So this is a first look.

## What it does

One API covers several jobs:

- **Web:** scrape a URL to Markdown or HTML, crawl up to 500 pages a call, map a site, search the web.
- **Brand:** logos, colours, fonts and company details from a domain.
- **People and companies:** enrichment and search.
- **Files and monitoring:** parse PDFs and Office files, and watch websites for changes.
- **Answers:** research requests that return structured results.

It's hosted only, so you can't run it yourself. There are SDKs for TypeScript, Python, Ruby, Go and PHP, plus an MCP server for AI agents.

## Pricing

| Plan | Monthly | Credits | Overage per 1,000 | Concurrent |
|---|---|---|---|---|
| Free | $0 | 1,000 | None | 2 |
| Developer | $20 | 10,000 | $3.00 | 10 |
| Pro | $90 | 100,000 | $2.00 | 100 |
| Growth | $300 | 500,000 | $1.50 | 250 |
| Scale | $500 | 1,000,000 | $1.00 | 500 |

Yearly billing gives two months free. Startups and non-profits can get 30% off a yearly plan for 12 months. Third-party sources quote older prices and smaller free allowances, including 500 credits, so check your dashboard for the figure you get.

Here's what the Developer plan's 10,000 credits buy:

| Action | Credits | Calls from 10,000 |
|---|---|---|
| Basic scrape | 1 | 10,000 |
| Scrape with JSON extraction | 5 | 2,000 |
| Brand lookup | 10 | 1,000 |
| Fast Answers request | 10 | 1,000 |
| Person enrichment | 20 per match | 500 |
| Ultra Answers request | 100 | 100 |

That's the thing to plan around. Basic scraping is cheap, but the higher-level calls aren't, so a workflow built on enrichment or Ultra Answers uses credits many times faster. Unused credits don't roll over, and without auto top-up the API stops with an error when you run out.

## The fine print

**Training.** This one's worth reading twice. Unless you use zero data retention, the terms let Context.dev use your content and output to improve its services, including training machine learning models. If you're sending private data, sort this out first.

**Refunds.** Fees are non-refundable, except where required by law or where the company chooses to refund. Billing errors should be reported within 60 days.

**Output.** You own your content, and the terms allow output for any lawful use, including AI applications and model training.

**People data.** The privacy policy says this comes from public sources and licensed providers. Using personal data in your product brings your own legal duties, including under GDPR. The API doesn't take care of that for you.

**Scraping.** Just because an API can fetch a page doesn't mean you're allowed to use the content. Check each site's terms.

The company is Context Dev Inc., a Delaware corporation. Disputes go to binding arbitration in Delaware.

## Who should try it

Try it if you're building an AI agent or product, and want one vendor for scraping and brand data. It's especially convenient if you'd otherwise pay for a logo API and a scraping API separately. Brand.dev users should know existing integrations reportedly keep working.

Skip it if you need self-hosting, or if you mainly need a single job at high volume. A specialist tool may work out cheaper.

## What we'd check next

- Success rates on sites with strong bot protection.
- Accuracy of people and company data.
- Real speed under concurrency.
- How often logos and brand data are out of date.

If you've used it in production, we'd like to hear from you.

If you'd like to try it, here's [Context.dev](/go/context-dev). The free plan needs no card, and 1,000 credits are enough to test your hardest URLs.

## Sources

Pricing checked November 2026.

- [Context.dev pricing](https://context.dev/pricing)
- [Context.dev documentation](https://docs.context.dev/)
- [Context.dev terms](https://context.dev/terms)
- [Context.dev privacy policy](https://context.dev/privacy)
- [Context.dev Brand API page](https://www.context.dev/brand-api)
- [Trustpilot: Context.dev](https://www.trustpilot.com/review/context.dev)
- [Huzzler review](https://huzzler.so/reviews/web-scraping-apis/context-dev)
- [Filip Konecny review](https://filipkonecny.com/blog/context-dev-review/)
