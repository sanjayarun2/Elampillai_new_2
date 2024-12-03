import { supabase } from '../lib/supabase';
import type { BlogPost } from '../types';

export const blogService = {
  async getAll() {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as BlogPost[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as BlogPost;
  },

  async create(post: Omit<BlogPost, 'id'>) {
    const { data, error } = await supabase
      .from('blogs')
      .insert([post])
      .select()
      .single();

    if (error) throw error;
    return data as BlogPost;
  },

  async update(id: string, post: Partial<BlogPost>) {
    const { data, error } = await supabase
      .from('blogs')
      .update(post)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as BlogPost;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};