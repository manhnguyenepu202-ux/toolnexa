# ToolKenzon.com

Review, comparison & buying-guide website for **AI tools, SaaS and email marketing software** — built with plain **Node.js** (no npm dependencies, Node 18+).

## Run locally

```bash
npm start          # http://localhost:3000
npm run dev        # auto-restart on file changes
npm test           # checks every page + every internal link
npm run build      # static export to dist/ (for shared hosting)
```

## What's inside

| Page | URL |
|---|---|
| Homepage (search, categories, trending, comparisons, guides) | `/` |
| Directory with filters & sorting | `/tools` |
| Category pages | `/category/ai-tools`, `/category/saas`, `/category/email-marketing` |
| Tool reviews (score, pros/cons, pricing, FAQ, alternatives) | `/tools/<slug>` |
| Head-to-head comparisons | `/compare/<a>-vs-<b>` |
| Best-of buying guides | `/best/<slug>` |
| Blog | `/blog`, `/blog/<slug>` |
| Affiliate redirect | `/go/<slug>` |
| About, Affiliate Disclosure, Privacy, Terms, Contact | `/about` … |

SEO: canonical URLs, Open Graph, JSON-LD (Organization, WebSite search, Review, FAQ, Article, Breadcrumb, ItemList), `sitemap.xml`, `robots.txt`.

## Editing content (no code knowledge needed)

| What | File |
|---|---|
| Add / edit a tool, scores, price, **affiliate link** | `src/data/tools.js` |
| Comparisons | `src/data/comparisons.js` |
| Best-of lists | `src/data/bestof.js` |
| Categories | `src/data/categories.js` |
| Blog posts | `content/blog/*.md` (one Markdown file per post) |
| Long review on a tool page | `content/reviews/<tool-slug>.md` |
| Long comparison on a compare page | `content/compare/<a>-vs-<b>.md` |
| Unscored first look with a tracked link | `src/data/firstlooks.js` plus a blog post |
| Site name, URL, email, Google Analytics | `src/config.js` |

**Long articles:** both folders use Markdown with frontmatter: `updated: YYYY-MM-DD` and `evidence: research` or `hands-on` are required, `title` and `description` are optional SEO overrides. A `## FAQ` section with `### question` headings replaces the page's default FAQ and its structured data.

**Affiliate links:** set `affiliateUrl: 'https://…'` on a tool. All "Visit" buttons go through `/go/<slug>`, so you only change the link in one place.

**Before launch:** re-check every `startingPrice` against the vendor's pricing page and update `PRICING_CHECKED` at the top of `tools.js`. Set `pricingChecked: null` on any tool whose price you could not confirm. Scores are editorial — adjust them to your own testing.

The server validates content on startup: a typo in a slug stops it with a clear error.

## Forms

Newsletter and contact submissions are saved to `storage/*.jsonl` on the server. To send subscribers straight to Brevo / MailerLite / Kit, add an API call in `server.js` at the `TODO` line.

See **DEPLOY.md** for GitHub + Hostinger instructions.
