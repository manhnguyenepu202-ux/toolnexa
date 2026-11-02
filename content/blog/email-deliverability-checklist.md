---
title: The Email Deliverability Checklist for 2026
description: Authentication, list hygiene and sending habits that keep your emails out of spam — a checklist you can work through in an afternoon.
date: 2026-10-21
category: email-marketing
author: ToolKenzon Editorial
readTime: 7
tools: brevo, mailerlite, activecampaign
cover: shield
---

Great copy is worthless if it lands in spam. Since Gmail and Yahoo tightened their rules for bulk senders in 2024, authentication and low complaint rates are no longer optional. Work through this checklist once, then review it every quarter.

## Authentication (do this first)

- **Send from your own domain**, never a free address like @gmail.com.
- **SPF** — publish a record that authorises your email platform to send for your domain.
- **DKIM** — enable signing in your platform and add the DNS records it gives you.
- **DMARC** — start with a monitoring policy (`p=none`), read the reports, then tighten over time.
- **Align your domains** so the visible From domain matches the authenticated domain.

Most good platforms, including [Brevo](/tools/brevo), [MailerLite](/tools/mailerlite) and [ActiveCampaign](/tools/activecampaign), walk you through these steps.

## Unsubscribes and complaints

- Include a visible unsubscribe link in every marketing email.
- Support **one-click unsubscribe** (your platform's list-unsubscribe header) and process requests quickly.
- Keep your spam complaint rate as low as possible — Google advises staying well under 0.3%, and aiming much lower.

## List hygiene

- Use **confirmed (double) opt-in** for new subscribers where practical.
- Never buy or rent lists.
- Remove hard bounces automatically.
- Run a **re-engagement campaign** for subscribers inactive for 90–180 days, then suppress those who still don't respond.

## Sending habits

- **Warm up** new domains gradually rather than blasting your whole list on day one.
- Keep a **consistent schedule** so subscribers expect you.
- Segment: send the most relevant message to the people most likely to engage.
- Avoid spammy patterns: all caps subject lines, misleading "Re:" prefixes, link shorteners.

## Content checks before every send

1. Plain-text version included
2. Images have alt text and the email still makes sense without them
3. Links point to your own domain where possible
4. A clear reason why the reader is receiving the email

## Monitor

- Register your domain with **Google Postmaster Tools** to watch reputation and spam rate.
- Track opens cautiously (privacy features inflate them); clicks and replies are better health signals.

Deliverability is a habit, not a setting. Get the foundations right, keep your list clean, and the inbox will follow.

Choosing a platform? Read [How to Choose Email Marketing Software](/blog/how-to-choose-email-marketing-software).
