module.exports = {
  name: 'ToolNexa',
  domain: 'toolnexa.com',
  url: process.env.SITE_URL || 'https://toolnexa.com',
  tagline: 'Find the right AI, SaaS & email marketing tools — faster.',
  description: 'Independent reviews, side-by-side comparisons and buying guides for AI tools, SaaS platforms and email marketing software.',
  email: 'hello@toolnexa.com',
  social: {
    x: '',
    linkedin: '',
    youtube: ''
  },
  // Optional: Google Analytics 4 measurement ID, e.g. 'G-XXXXXXX'
  gaId: process.env.GA_ID || '',
  year: new Date().getFullYear()
};
