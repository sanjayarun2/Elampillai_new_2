import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { pushNotificationService } from '../services/pushNotificationService';

export default function PushNotificationButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(reg => {
        setRegistration(reg);
        reg.pushManager.getSubscription().then(sub => {
          setIsSubscribed(!!sub);
        });
      });
    }
  }, []);

  const subscribeUser = async () => {
    try {
      if (!registration) return;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
      });

      await pushNotificationService.saveSubscription(subscription.toJSON());
      setIsSubscribed(true);
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  };

  const unsubscribeUser = async () => {
    try {
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
    }
  };

  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null;
  }

  return (
    <button
      onClick={isSubscribed ? unsubscribeUser : subscribeUser}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      {isSubscribed ? (
        <>
          <BellOff className="h-5 w-5 mr-2" />
          Unsubscribe from Notifications
        </>
      ) : (
        <>
          <Bell className="h-5 w-5 mr-2" />
          Subscribe to Notifications
        </>
      )}
    </button>
  );
}