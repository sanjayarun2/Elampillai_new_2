import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, MessageCircle } from 'lucide-react';
import { storage } from '../utils/storage';
import type { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const whatsappLink = storage.get('whatsappLink', '');

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {post.image && (
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h2>
        
        <div className="flex items-center space-x-4 text-gray-600 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>{post.author}</span>
          </div>
        </div>
        
        <p className="text-gray-600 line-clamp-3">{post.content}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <Link 
            to={`/blog/${post.id}`}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Read More →
          </Link>
          
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>Join Community</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}