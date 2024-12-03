import { supabase } from '../lib/supabase';

interface Settings {
  id: string;
  whatsapp_link: string;
  updated_at: string;
}

export const settingsService = {
  async getSettings(): Promise<Settings> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', '1')
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async updateSettings(whatsappLink: string): Promise<Settings> {
    const { data, error } = await supabase
      .from('settings')
      .update({ 
        whatsapp_link: whatsappLink,
        updated_at: new Date().toISOString()
      })
      .eq('id', '1')
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
};