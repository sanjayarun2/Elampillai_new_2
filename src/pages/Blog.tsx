import React from 'react';
import BlogCard from '../components/BlogCard';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';
import { blogService } from '../services/blogService';
import type { BlogPost } from '../types';
import SEOHead from '../components/SEOHead';

export default function Blog() {
  const { data: posts, loading, error } = useSupabaseQuery<BlogPost[]>(
    () => blogService.getAll()
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">News & Updates</h1>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">News & Updates</h1>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading posts. Please try again later.</p>
        </div>
      </div>
    );
  }

  const postKeywords = posts?.map(post => post.title).join(', ');

  return (
    <>
      <SEOHead
        title="News & Updates from Elampillai"
        description="Stay updated with the latest news, events, and updates from the Elampillai community. Read about local developments, announcements, and community initiatives."
        url={`${window.location.origin}/blog`}
        type="blog"
        keywords={`Elampillai news, Elampillai updates, Elampillai community news, ${postKeywords}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Elampillai Community News & Updates",
          "description": "Latest news and updates from Elampillai",
          "blogPost": posts?.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "articleBody": post.content,
            "datePublished": post.date,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "image": post.image
          }))
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">News & Updates</h1>
        {!posts || posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No posts available yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}