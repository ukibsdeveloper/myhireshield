import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageMeta from '../components/PageMeta';
import { getPostBySlug } from '../data/blogPosts';
import { useAuth } from '../context/AuthContext';

const BlogPost = () => {
  const { slug } = useParams();
  const { isAuthenticated, user } = useAuth();
  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-[#fcfaf9] text-[#496279] font-sans antialiased">
      <PageMeta
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
      />
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <Navbar scrolled={true} isAuthenticated={isAuthenticated} user={user} />

      <main id="main-content" className="container mx-auto px-4 sm:px-6 pt-28 pb-32 sm:pb-24 max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm">
            <li><Link to="/" className="text-slate-500 hover:text-[#496279]">Home</Link></li>
            <li aria-hidden className="text-slate-300">/</li>
            <li><Link to="/blog" className="text-slate-500 hover:text-[#496279]">Blog</Link></li>
            <li aria-hidden className="text-slate-300">/</li>
            <li className="text-[#496279] font-bold truncate max-w-[200px]" aria-current="page">{post.title}</li>
          </ol>
        </nav>

        <article>
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-400 tracking-widest uppercase mb-4">
              <span>{post.category}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              <span aria-hidden>·</span>
              <span>{post.author}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#496279] leading-tight">
              {post.title}
            </h1>
          </header>

          <div
            className="blog-content text-[#496279]/90 font-medium leading-relaxed space-y-6 [&_h3]:text-lg [&_h3]:font-black [&_h3]:text-[#496279] [&_h3]:mt-8 [&_h3]:mb-2 [&_p]:text-slate-600 [&_p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <p className="mt-12">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#4c8051] font-bold text-sm hover:underline">
            <i className="fas fa-arrow-left" /> Back to Blog & Resources
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
