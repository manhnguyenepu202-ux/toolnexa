// "Best X" roundup pages. URL: /best/<slug>
// `picks` is an ordered list: [toolSlug, label]
module.exports = [
  {
    slug: 'ai-chatbots',
    title: 'Best AI Chatbots & Assistants',
    category: 'ai-tools',
    intro: 'We compared the leading AI assistants on reasoning, writing quality, research ability, integrations and value. Here is how they rank for everyday professional work.',
    picks: [['chatgpt', 'Best overall'], ['claude', 'Best for writing & long documents'], ['gemini', 'Best for Google Workspace users'], ['perplexity', 'Best for research with sources']],
    howWeChose: ['Quality of answers on real work tasks (emails, analysis, summaries, code)', 'Accuracy and willingness to say when unsure', 'Features: files, search, voice, integrations', 'Price and generosity of free plan']
  },
  {
    slug: 'ai-writing-tools',
    title: 'Best AI Writing Tools',
    category: 'ai-tools',
    intro: 'From polishing emails to producing on-brand marketing content at scale, these are the AI writing tools worth paying for.',
    picks: [['claude', 'Best overall writing quality'], ['jasper', 'Best for marketing teams'], ['grammarly', 'Best for editing everyday writing'], ['copy-ai', 'Best for sales workflows'], ['surfer-seo', 'Best for SEO content']],
    howWeChose: ['Naturalness and accuracy of output', 'Brand voice and team controls', 'Workflow fit (browser, docs, CMS)', 'Value for money']
  },
  {
    slug: 'email-marketing-software',
    title: 'Best Email Marketing Software',
    category: 'email-marketing',
    intro: 'We evaluated email platforms on ease of use, automation, deliverability features, templates and how pricing scales with your list.',
    picks: [['brevo', 'Best value overall'], ['activecampaign', 'Best for automation'], ['mailerlite', 'Best for small budgets'], ['kit', 'Best for creators'], ['klaviyo', 'Best for e-commerce'], ['mailchimp', 'Easiest to start']],
    howWeChose: ['Automation depth and segmentation', 'Deliverability tools (authentication, warm-up guidance, reporting)', 'Editor and templates', 'Price at 1k, 10k and 50k contacts']
  },
  {
    slug: 'free-email-marketing',
    title: 'Best Free Email Marketing Tools',
    category: 'email-marketing',
    intro: 'Just starting your list? These platforms have free plans that are genuinely usable — not just trials.',
    picks: [['mailerlite', 'Best free plan overall'], ['kit', 'Best free plan for creators'], ['brevo', 'Best for large free lists'], ['beehiiv', 'Best free newsletter platform'], ['mailchimp', 'Most familiar free option']],
    howWeChose: ['Subscriber and send limits on the free plan', 'Features included for free (automations, forms, landing pages)', 'Branding requirements', 'Upgrade path pricing']
  },
  {
    slug: 'project-management-software',
    title: 'Best Project Management Software',
    category: 'saas',
    intro: 'Whether you are a five-person startup or a cross-functional department, one of these project management tools will fit how your team works.',
    picks: [['clickup', 'Best value'], ['monday', 'Easiest for non-technical teams'], ['asana', 'Best for structured projects'], ['notion', 'Best docs + projects hybrid']],
    howWeChose: ['Views and planning features', 'Ease of adoption for the whole team', 'Automation and integrations', 'Price per seat']
  },
  {
    slug: 'automation-tools',
    title: 'Best No-Code Automation Tools',
    category: 'saas',
    intro: 'Automate repetitive work between your apps without writing code. These are the platforms we trust.',
    picks: [['zapier', 'Easiest and most integrations'], ['make', 'Best for complex workflows & value']],
    howWeChose: ['Number and quality of integrations', 'Logic: branching, loops, error handling', 'AI capabilities', 'Cost per task/operation']
  },
  {
    slug: 'email-verification-tools',
    title: 'Best Email Verification Tools',
    seoTitle: 'Best Email Verification Tools (2026): Compared & Ranked',
    category: 'email-marketing',
    intro: 'We compared the leading email verifiers on catch-all handling, real cost, user complaints and paperwork. Every benchmark we found was run by a vendor, so test on your own list before you commit.',
    picks: [['zerobounce', 'Best overall'], ['bounceban', 'Best for catch-all lists on a budget'], ['allegrow', 'Best for scaled B2B outbound'], ['millionverifier', 'Cheapest bulk cleaning']],
    howWeChose: ['Handling of catch-all and gateway-protected addresses', 'Real cost at realistic volumes, including credit expiry', 'Recurring user complaints and how recent they are', 'Terms, privacy notices and security reports']
  }
];
