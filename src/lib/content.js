// Loads and indexes all site content once at startup.
const fs = require('fs');
const path = require('path');
const { render, parseFrontmatter } = require('./markdown');

const categories = require('../data/categories');
const tools = require('../data/tools');
const comparisons = require('../data/comparisons');
const bestof = require('../data/bestof');
const firstLooks = require('../data/firstlooks');

const toolMap = Object.fromEntries(tools.map((t) => [t.slug, t]));
const firstLookMap = Object.fromEntries(firstLooks.map((t) => [t.slug, t]));
const catMap = Object.fromEntries(categories.map((c) => [c.slug, c]));
const subMap = {};
categories.forEach((c) => c.subcategories.forEach((s) => { subMap[s.slug] = { ...s, parent: c.slug }; }));

// Validate references early so broken data fails loudly at boot.
const problems = [];
tools.forEach((t) => {
  if (!catMap[t.category]) problems.push(`${t.slug}: unknown category ${t.category}`);
  if (!subMap[t.sub]) problems.push(`${t.slug}: unknown sub ${t.sub}`);
  (t.alternatives || []).forEach((a) => { if (!toolMap[a]) problems.push(`${t.slug}: unknown alternative ${a}`); });
});
comparisons.forEach((c) => { [c.a, c.b].forEach((s) => { if (!toolMap[s]) problems.push(`compare: unknown ${s}`); }); });
bestof.forEach((b) => b.picks.forEach(([s]) => { if (!toolMap[s]) problems.push(`best ${b.slug}: unknown ${s}`); }));
if (problems.length) throw new Error('Content errors:\n' + problems.join('\n'));

comparisons.forEach((c) => { c.slug = `${c.a}-vs-${c.b}`; c.toolA = toolMap[c.a]; c.toolB = toolMap[c.b]; });
const compareMap = Object.fromEntries(comparisons.map((c) => [c.slug, c]));
const bestMap = Object.fromEntries(bestof.map((b) => [b.slug, b]));

// Long articles for tool and comparison pages:
// content/reviews/<tool-slug>.md and content/compare/<a>-vs-<b>.md
function splitFaq(body) {
  const lines = body.split('\n');
  const start = lines.findIndex((l) => /^##\s+(faq|frequently asked questions)\b/i.test(l));
  if (start === -1) return { body, faqs: [] };
  let end = lines.findIndex((l, i) => i > start && /^##\s/.test(l));
  if (end === -1) end = lines.length;
  const parts = lines.slice(start + 1, end).join('\n').split(/^###\s+(.+)$/m);
  const faqs = [];
  for (let i = 1; i < parts.length; i += 2) {
    const answer = parts[i + 1].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
    if (answer) faqs.push([parts[i].trim(), answer]);
  }
  if (!faqs.length) return { body, faqs };
  return { body: [...lines.slice(0, start), ...lines.slice(end)].join('\n'), faqs };
}

function loadArticles(folder, targets) {
  const dir = path.join(__dirname, '..', '..', 'content', folder);
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).filter((f) => f.endsWith('.md')).forEach((f) => {
    const slug = f.replace(/\.md$/, '');
    const name = `content/${folder}/${f}`;
    const { data, body } = parseFrontmatter(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (!targets[slug]) throw new Error(`${name}: no matching page for "${slug}"`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.updated || '')) throw new Error(`${name}: "updated" must be YYYY-MM-DD`);
    if (!['research', 'hands-on'].includes(data.evidence)) throw new Error(`${name}: "evidence" must be research or hands-on`);
    const { body: main, faqs } = splitFaq(body);
    const { html, toc } = render(main, { idPrefix: 'a-' });
    targets[slug].article = {
      title: data.title, description: data.description, updated: data.updated, evidence: data.evidence,
      readTime: Math.max(1, Math.round(main.split(/\s+/).length / 200)), html, toc, faqs
    };
  });
}
loadArticles('reviews', toolMap);
loadArticles('compare', compareMap);

// Blog posts from /content/blog/*.md
const blogDir = path.join(__dirname, '..', '..', 'content', 'blog');
const posts = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md')).map((f) => {
  const { data, body } = parseFrontmatter(fs.readFileSync(path.join(blogDir, f), 'utf8'));
  const { html, toc } = render(body);
  return {
    slug: f.replace(/\.md$/, ''),
    title: data.title,
    description: data.description,
    date: data.date,
    category: data.category,
    author: data.author || 'ToolKenzon Editorial',
    readTime: Number(data.readTime) || 5,
    cover: data.cover || 'book',
    tools: (data.tools || '').split(',').map((s) => s.trim()).filter((s) => toolMap[s]),
    html,
    toc
  };
}).sort((a, b) => (a.date < b.date ? 1 : -1));
const postMap = Object.fromEntries(posts.map((p) => [p.slug, p]));

const toolsIn = (catSlug) => tools.filter((t) => t.category === catSlug).sort((a, b) => b.score - a.score);
const comparisonsFor = (slug) => comparisons.filter((c) => c.a === slug || c.b === slug);

module.exports = {
  categories, tools, comparisons, bestof, posts, firstLooks,
  toolMap, firstLookMap, catMap, subMap, compareMap, bestMap, postMap,
  toolsIn, comparisonsFor
};
