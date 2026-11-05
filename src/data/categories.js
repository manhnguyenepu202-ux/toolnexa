// Top-level verticals and sub-categories used across the site.
module.exports = [
  {
    slug: 'ai-tools',
    name: 'AI Tools',
    short: 'AI',
    icon: 'sparkles',
    color: '#7C3AED',
    description: 'Chatbots, AI writers, image, video and voice generators — tested on real work, not demos.',
    subcategories: [
      { slug: 'ai-chatbots', name: 'AI Chatbots & Assistants' },
      { slug: 'ai-writing', name: 'AI Writing' },
      { slug: 'ai-image', name: 'AI Image' },
      { slug: 'ai-video', name: 'AI Video' },
      { slug: 'ai-voice', name: 'AI Voice & Audio' },
      { slug: 'ai-seo', name: 'AI SEO' }
    ]
  },
  {
    slug: 'saas',
    name: 'SaaS & Productivity',
    short: 'SaaS',
    icon: 'layers',
    color: '#2563EB',
    description: 'Project management, CRM, automation, design and SEO platforms for growing teams.',
    subcategories: [
      { slug: 'project-management', name: 'Project Management' },
      { slug: 'crm', name: 'CRM' },
      { slug: 'automation', name: 'Automation' },
      { slug: 'design', name: 'Design' },
      { slug: 'seo-marketing', name: 'SEO & Marketing' },
      { slug: 'website-builder', name: 'Website Builders' }
    ]
  },
  {
    slug: 'email-marketing',
    name: 'Email Marketing',
    short: 'Email',
    icon: 'mail',
    color: '#EA580C',
    description: 'Newsletters, automation and e-commerce email platforms compared on deliverability, features and price.',
    subcategories: [
      { slug: 'email-platforms', name: 'Email Platforms' },
      { slug: 'newsletters', name: 'Newsletter Platforms' },
      { slug: 'ecommerce-email', name: 'E-commerce Email' },
      { slug: 'email-verification', name: 'Email Verification' }
    ]
  }
];
