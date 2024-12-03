import { supabase } from '../lib/supabase';

interface PushSubscription {
  id?: string;
  endpoint: string;
  auth: string;
  p256dh: string;
}

export const pushNotificationService = {
  async saveSubscription(subscription: PushSubscriptionJSON) {
    const { endpoint, keys } = subscription;
    
    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert({
        endpoint,
        auth: keys.auth,
        p256dh: keys.p256dh
      }, {
        onConflict: 'endpoint'
      });

    if (error) throw error;
    return data;
  },

  async getAllSubscriptions() {
    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (error) throw error;
    return data as PushSubscription[];
  },

  async sendNotification(title: string, body: string) {
    const { error } = await supabase.functions.invoke('send-push-notification', {
      body: { title, body }
    });

    if (error) throw error;
  }
};