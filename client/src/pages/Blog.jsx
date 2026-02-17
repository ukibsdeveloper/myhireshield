import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageMeta from '../components/PageMeta';
import { blogPosts } from '../data/blogPosts';
import { useAuth } from '../context/AuthContext';

const Blog = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-[#fcfaf9] text-[#496279] font-sans antialiased">
      <PageMeta
        title="Blog & Resources"
        description="Guides and resources on employee verification, Shield Score, and best practices for hiring and building trust."
        canonical="/blog"
      />
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <Navbar scrolled={true} isAuthenticated={isAuthenticated} user={user} />

      <main id="main-content" className="container mx-auto px-4 sm:px-6 pt-28 pb-32 sm:pb-24 max-w-4xl">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#496279] mb-4">
            Blog & <span className="text-[#4c8051]">Resources</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm max-w-xl">
            Guides on employee verification, trust scores, and best practices for employers and employees.
          </p>
        </header>

        <ul className="space-y-10" aria-label="Blog posts">
          {blogPosts.map((post) => (
            <li key={post.id}>
              <article className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">
                  <span>{post.category}</span>
                  <span aria-hidden>·</span>
                  <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                </div>
                <h2 className="text-xl font-black text-[#496279] mb-2 leading-tight">
                  <Link to={`/blog/${post.slug}`} className="hover:text-[#4c8051] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4c8051] focus:ring-offset-2 rounded">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-[#4c8051] font-bold text-xs tracking-widest uppercase hover:underline"
                >
                  Read more <i className="fas fa-arrow-right text-xs" />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
