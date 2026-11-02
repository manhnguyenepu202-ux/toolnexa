// Loads and indexes all site content once at startup.
const fs = require('fs');
const path = require('path');
const { render, parseFrontmatter } = require('./markdown');

const categories = require('../data/categories');
const tools = require('../data/tools');
const comparisons = require('../data/comparisons');
const bestof = require('../data/bestof');

const toolMap = Object.fromEntries(tools.map((t) => [t.slug, t]));
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
  categories, tools, comparisons, bestof, posts,
  toolMap, catMap, subMap, compareMap, bestMap, postMap,
  toolsIn, comparisonsFor
};
