const esc = (v) => String(v == null ? '' : v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Tagged template that escapes interpolations unless wrapped with raw().
class Raw { constructor(s) { this.s = s; } toString() { return this.s; } }
const raw = (s) => new Raw(s);
const html = (strings, ...vals) => raw(strings.reduce((acc, str, i) => {
  if (i >= vals.length) return acc + str;
  const v = vals[i];
  const out = Array.isArray(v) ? v.map((x) => (x instanceof Raw ? x.s : esc(x))).join('')
    : v instanceof Raw ? v.s
      : v === false || v == null ? '' : esc(v);
  return acc + str + out;
}, ''));

const formatDate = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

module.exports = { esc, raw, html, Raw, formatDate };
