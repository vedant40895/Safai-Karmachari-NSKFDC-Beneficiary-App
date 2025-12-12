import { useEffect, useState } from 'react';
import { storage } from '@/utils/storage';
import { api } from '@/utils/api';

export function useOfflineSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    checkPendingItems();
    const interval = setInterval(() => {
      syncPendingItems();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const checkPendingItems = async () => {
    const pending = await storage.sync.getPending();
    setPendingCount(pending.length);
  };

  const syncPendingItems = async () => {
    const pending = await storage.sync.getPending();
    if (pending.length === 0) {
      setPendingCount(0);
      return;
    }

    setIsSyncing(true);
    for (const item of pending) {
      try {
        if (item.type === 'attendance') {
          if (item.data.action === 'checkin') {
            await api.attendance.checkIn(item.data);
          } else if (item.data.action === 'checkout') {
            await api.attendance.checkOut(item.data);
          }
        } else if (item.type === 'complaint') {
          const formData = new FormData();
          formData.append('category', item.data.category);
          formData.append('description', item.data.description);
          formData.append('anonymous', item.data.isAnonymous.toString());

          if (item.data.location) {
            formData.append(
              'latitude',
              item.data.location.latitude.toString()
            );
            formData.append(
              'longitude',
              item.data.location.longitude.toString()
            );
          }

          await api.complaints.submit(formData);
        }

        await storage.sync.removePending(item.id);
      } catch (error) {
        console.error('Sync error:', error);
      }
    }

    setIsSyncing(false);
    checkPendingItems();
  };

  return {
    isSyncing,
    pendingCount,
    syncNow: syncPendingItems,
  };
}
