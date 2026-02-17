/**
 * Lightweight blog/resources data. No CMS — static content for SEO-friendly structure.
 */
export const blogPosts = [
  {
    id: 'employee-verification-guide',
    slug: 'employee-verification-guide',
    title: 'How Employee Verification Builds Trust in Hiring',
    excerpt: 'Learn why verified work history and employer feedback matter for safer hiring decisions and better team integrity.',
    content: `
      <p>Employee verification is the gold standard for reducing hiring risk. When employers can confirm past roles, tenure, and performance through a trusted platform, they make better decisions and protect their company reputation.</p>
      <h3>Why verification matters</h3>
      <p>Resumes can be inaccurate. Verification through HireShield gives employers a single source of truth: HR-verified employment data and structured feedback from previous employers.</p>
      <h3>How HireShield helps</h3>
      <p>We connect companies and employees in a secure loop: companies submit verified reviews and documents, and employees can access their own trust score and reputation report. Everyone benefits from transparency.</p>
    `,
    author: 'HireShield Team',
    date: '2026-01-15',
    category: 'Hiring',
    image: null,
  },
  {
    id: 'shield-score-explained',
    slug: 'shield-score-explained',
    title: 'Understanding Your Shield Score',
    excerpt: 'What your Trust Score means, how it’s calculated, and how you can improve it over time.',
    content: `
      <p>Your Shield Score is a trust indicator based on verified employment history and employer feedback. It helps employers quickly assess credibility while giving you a clear view of your professional standing.</p>
      <h3>What we measure</h3>
      <p>We look at verified tenure, role accuracy, document verification status, and structured reviews from past employers. The result is a simple percentage that reflects your professional integrity.</p>
      <h3>Improving your score</h3>
      <p>Keep your profile updated, ensure your documents are verified, and encourage past employers to submit honest reviews. Consistency and transparency are key.</p>
    `,
    author: 'HireShield Team',
    date: '2026-01-10',
    category: 'For Employees',
    image: null,
  },
  {
    id: 'company-best-practices',
    slug: 'company-best-practices',
    title: 'Best Practices for Companies Using HireShield',
    excerpt: 'Tips for getting the most out of verified reviews, document uploads, and employee search.',
    content: `
      <p>Companies that use HireShield effectively see better hiring outcomes and fewer mis-hires. Here are practical steps to get the most from the platform.</p>
      <h3>Submit timely reviews</h3>
      <p>When an employee leaves or at review cycles, submit structured feedback. This keeps the ecosystem accurate and helps other employers.</p>
      <h3>Verify documents</h3>
      <p>Use the document verification flow to confirm identity and past employment. The more verified data in the system, the more useful it is for everyone.</p>
      <h3>Search before you hire</h3>
      <p>Before making an offer, search for the candidate on HireShield. A verified profile and positive reviews can give you confidence; gaps or concerns are worth discussing.</p>
    `,
    author: 'HireShield Team',
    date: '2026-01-05',
    category: 'For Companies',
    image: null,
  },
];

export function getPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug) || null;
}

export function getAllSlugs() {
  return blogPosts.map((p) => p.slug);
}
