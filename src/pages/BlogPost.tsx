import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Trash2 } from 'lucide-react';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';
import { blogService } from '../services/blogService';
import type { BlogPost as BlogPostType } from '../types';
import { Helmet } from 'react-helmet-async';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import ShareButton from '../components/ui/ShareButton';

interface Comment {
  id: string;
  text: string;
  author: string;
  date: string;
}

export default function BlogPost() {
  const { id } = useParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  const { data: post, loading, error } = useSupabaseQuery<BlogPostType>(
    () => blogService.getById(id!),
    [id]
  );

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && commentAuthor.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment,
        author: commentAuthor,
        date: new Date().toLocaleDateString()
      };
      setComments([...comments, comment]);
      setNewComment('');
      setCommentAuthor('');
    }
  };

  const deleteComment = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-red-600">Error loading post. Please try again later.</p>
        <Link to="/blog" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Return to Blog
        </Link>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/blog/${id}`;

  return (
    <>
      <Helmet>
        <title>{`${post.title} - Elampillai Community`}</title>
        <meta name="description" content={post.content.substring(0, 155)} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.substring(0, 155)} />
        <meta property="og:image" content={post.image || ''} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:site_name" content="Elampillai Community" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.content.substring(0, 155)} />
        <meta name="twitter:image" content={post.image || ''} />
        
        {/* WhatsApp specific */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Link to="/blog" className="text-blue-600 hover:text-blue-800">
                ← Back to Blog
              </Link>
              <ShareButton
                title={post.title}
                text={`Check out this post: ${post.title}`}
                url={shareUrl}
              />
            </div>

            {post.image && (
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex items-center space-x-4 text-gray-600 mb-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{post.author}</span>
              </div>
            </div>
            
            <div className="prose max-w-none mb-8">
              <p className="text-gray-600 whitespace-pre-wrap">{post.content}</p>
            </div>

            <div className="flex justify-between items-center">
              <ShareButton
                title={post.title}
                text={`Check out this post: ${post.title}`}
                url={shareUrl}
              />
              <WhatsAppButton />
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>
          
          <form onSubmit={handleCommentSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="mb-4">
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="author"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Post Comment
            </button>
          </form>

          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{comment.author}</h3>
                    <p className="text-sm text-gray-600">{comment.date}</p>
                  </div>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-gray-600">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}