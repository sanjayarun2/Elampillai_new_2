import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import type { BlogPost } from '../../types';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';

export function BlogEditor() {
  const { data: posts, loading, error, refetch } = useSupabaseQuery<BlogPost[]>(
    () => blogService.getAll()
  );
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost.title?.trim()) return;

    try {
      if (currentPost.id) {
        await blogService.update(currentPost.id, currentPost);
      } else {
        await blogService.create({
          title: currentPost.title,
          content: currentPost.content || '',
          date: new Date().toISOString().split('T')[0],
          author: 'Admin',
          image: currentPost.image
        });
      }
      setCurrentPost({});
      refetch();
    } catch (error) {
      console.error('Error saving blog post:', error);
    }
  };

  const deletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await blogService.delete(id);
        refetch();
      } catch (error) {
        console.error('Error deleting blog post:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading posts: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text"
              value={currentPost.title || ''}
              onChange={e => setCurrentPost({ ...currentPost, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={currentPost.content || ''}
              onChange={e => setCurrentPost({ ...currentPost, content: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              value={currentPost.image || ''}
              onChange={e => setCurrentPost({ ...currentPost, image: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            {currentPost.id ? 'Update Post' : 'Add Post'}
          </button>
        </div>
      </form>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Existing Posts</h3>
        <div className="space-y-4">
          {posts?.map(post => (
            <div key={post.id} className="flex items-center justify-between p-4 border rounded">
              <div>
                <h4 className="font-medium">{post.title}</h4>
                <p className="text-sm text-gray-600">{post.date}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setCurrentPost(post)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}