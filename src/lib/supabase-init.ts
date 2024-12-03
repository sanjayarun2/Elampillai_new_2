import { supabase } from './supabase';

export async function initializeDatabase() {
  try {
    // Create settings table if it doesn't exist
    await supabase.rpc('create_settings_table', {});

    // Check if settings record exists
    const { data: settingsData, error: settingsError } = await supabase
      .from('settings')
      .select('id')
      .eq('id', '1')
      .single();

    if (!settingsData) {
      // Create initial settings record
      const { error } = await supabase
        .from('settings')
        .insert([
          {
            id: '1',
            whatsapp_link: '',
            updated_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Error creating initial settings:', error);
      }
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}