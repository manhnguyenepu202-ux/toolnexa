// "Best X" roundup pages. URL: /best/<slug>
// `picks` is an ordered list: [toolSlug, label]
module.exports = [
  {
    slug: 'ai-chatbots',
    title: 'Best AI Chatbots & Assistants',
    category: 'ai-tools',
    intro: 'We compared the leading AI assistants on reasoning, writing quality, research ability, integrations and value. Here is how they rank for everyday professional work.',
    picks: [['chatgpt', 'Best overall'], ['claude', 'Best for writing & long documents'], ['gemini', 'Best for Google Workspace users'], ['perplexity', 'Best for research with sources']],
    howWeChose: ['Reported quality of answers on everyday work (emails, analysis, summaries, code)', 'Accuracy and willingness to say when unsure', 'Features: files, search, voice, integrations', 'Price and generosity of free plan']
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
    slug: 'ai-3d-model-generators',
    title: 'Best AI 3D Model Generators',
    category: 'ai-tools',
    intro: 'Turn a photo or a sentence into a 3D model in under a minute. We compared the leading AI 3D generators on mesh quality, textures, export formats and what a usable model really costs.',
    picks: [['tripo', 'Best overall value'], ['meshy', 'Best for multicolor 3D printing'], ['rodin', 'Best quality for production assets']],
    howWeChose: ['Mesh quality and topology reported in independent tests', 'Texture quality and PBR maps', 'Export formats for games, AR and 3D printing', 'Real cost per finished model, not the headline credit count']
  },
  {
    slug: 'ai-3d-models-for-3d-printing',
    title: 'Best AI Tools for 3D Printing Models',
    category: 'ai-tools',
    intro: 'Want to print a figurine of your dog, a custom gift or a game miniature without learning CAD? These AI tools turn images into printable STL and 3MF files.',
    picks: [['tripo', 'Best overall for printing'], ['meshy', 'Best for Bambu Lab multicolor prints'], ['rodin', 'Best surface detail for figurines']],
    howWeChose: ['Direct STL and 3MF export', 'Watertight meshes and repair tools', 'Color printing support', 'Cost per printable model']
  },
  {
    slug: 'ai-tools-for-game-developers',
    title: 'Best AI Tools for Indie Game Developers',
    category: 'ai-tools',
    intro: 'Small teams can now generate 3D props, rigged characters, concept art and voice lines with AI. Here are the tools worth adding to an indie game pipeline, and where each one still needs a human.',
    picks: [['tripo', 'Best for 3D props and rigged characters'], ['rodin', 'Best for hero assets with clean topology'], ['meshy', 'Best for fast prototyping and textures'], ['elevenlabs', 'Best for voices and sound'], ['getimg', 'Best for concept art and textures']],
    howWeChose: ['Output that imports cleanly into Unity, Unreal and Godot', 'Commercial-use rights on paid plans', 'Time saved versus manual work', 'Cost for a small team']
  },
  {
    slug: 'ai-meeting-note-takers',
    title: 'Best AI Meeting Note Takers',
    category: 'ai-tools',
    intro: 'AI note takers write up your calls so you can focus on the conversation. We compared bot-free and bot-based tools on note quality, privacy, languages and real cost.',
    picks: [['granola', 'Best bot-free notes'], ['krisp', 'Best for noisy calls'], ['otter', 'Best cheap transcription'], ['fireflies', 'Best for sales teams and CRM'], ['notta', 'Best for many languages']],
    howWeChose: ['Quality of summaries and action items', 'Whether a bot joins the call, and how consent is handled', 'Languages and platforms', 'Price per person on annual and monthly billing']
  },
  {
    slug: 'ai-video-tools-for-creators',
    title: 'Best AI Video Tools for Creators',
    category: 'ai-tools',
    intro: 'From clipping long videos into Shorts to turning a script into a narrated video, these AI tools cut hours of editing. We compared them on output quality, limits and real monthly cost.',
    picks: [['opusclip', 'Best for clipping long videos'], ['submagic', 'Best captions for talking heads'], ['invideo', 'Best all-in-one AI editor'], ['videogen', 'Best for script and slide videos'], ['fliki', 'Best for multilingual voiceover videos'], ['crayo', 'Best for faceless story videos']],
    howWeChose: ['Quality of the finished video with little manual editing', 'Credit and length limits by plan', 'Refund and billing terms', 'Price for a creator posting several times a week']
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
    category: 'email-marketing',
    intro: 'We compared the leading email verifiers on catch-all handling, real cost, user complaints and paperwork. Every benchmark we found was run by a vendor, so test on your own list before you commit.',
    picks: [['zerobounce', 'Best overall'], ['bounceban', 'Best for catch-all lists on a budget'], ['allegrow', 'Best for scaled B2B outbound'], ['millionverifier', 'Cheapest bulk cleaning']],
    howWeChose: ['Handling of catch-all and gateway-protected addresses', 'Real cost at realistic volumes, including credit expiry', 'Recurring user complaints and how recent they are', 'Terms, privacy notices and security reports']
  }
];
