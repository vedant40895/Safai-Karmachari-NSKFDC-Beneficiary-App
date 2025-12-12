import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import {
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  DollarSign,
  GraduationCap,
  Clock,
  Bell,
  CloudOff,
} from 'lucide-react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { pendingCount, isSyncing } = useOfflineSync();

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: api.notifications.getList,
  });

  const unreadCount = notifications?.filter((n: any) => !n.read).length || 0;

  const quickActions = [
    {
      icon: Users,
      label: 'My SHG',
      route: '/shg',
    },
    {
      icon: Briefcase,
      label: 'My Projects',
      route: '/projects',
    },
    {
      icon: FileText,
      label: 'Apply Scheme',
      route: '/schemes/apply',
    },
    {
      icon: MessageSquare,
      label: 'Raise Voice',
      route: '/complaints/new',
    },
    {
      icon: DollarSign,
      label: 'My Finances',
      route: '/finance',
    },
    {
      icon: GraduationCap,
      label: 'Training',
      route: '/training',
    },
    {
      icon: Clock,
      label: 'Attendance',
      route: '/attendance',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.push('/notifications' as any)}
        >
          <Bell size={24} color="#000" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {pendingCount > 0 && (
          <View style={styles.syncAlert}>
            <CloudOff size={20} color="#ff9800" />
            <Text style={styles.syncAlertText}>
              {isSyncing
                ? 'Syncing pending items...'
                : `${pendingCount} items pending sync`}
            </Text>
          </View>
        )}

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>
            Safai Karmachari NSKFDC Beneficiary App
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Access schemes, track projects, and manage your benefits
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
            >
              <action.icon size={28} color="#000" strokeWidth={1.5} />
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.announcementsSection}>
          <Text style={styles.sectionTitle}>Latest Announcements</Text>
          {notifications?.slice(0, 3).map((notif: any) => (
            <View key={notif.id} style={styles.announcementCard}>
              <Text style={styles.announcementTitle}>{notif.title}</Text>
              <Text style={styles.announcementMessage} numberOfLines={2}>
                {notif.message}
              </Text>
              <Text style={styles.announcementTime}>
                {new Date(notif.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))}
          {(!notifications || notifications.length === 0) && (
            <Text style={styles.emptyText}>No announcements available</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  notificationButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#000',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  syncAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  syncAlertText: {
    flex: 1,
    fontSize: 13,
    color: '#856404',
    fontWeight: '500',
  },
  welcomeCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginTop: 8,
    textAlign: 'center',
  },
  announcementsSection: {
    marginBottom: 24,
  },
  announcementCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  announcementMessage: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  announcementTime: {
    fontSize: 11,
    color: '#999',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
});
