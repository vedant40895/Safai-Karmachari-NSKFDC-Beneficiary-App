import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/colors';
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
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { pendingCount, isSyncing } = useOfflineSync();
  const insets = useSafeAreaInsets();

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
      color: colors.indigo,
      bgColor: colors.indigoLight,
    },
    {
      icon: Briefcase,
      label: 'My Projects',
      route: '/projects',
      color: colors.purple,
      bgColor: colors.purpleLight,
    },
    {
      icon: FileText,
      label: 'Apply Scheme',
      route: '/schemes/apply',
      color: colors.pink,
      bgColor: colors.pinkLight,
    },
    {
      icon: MessageSquare,
      label: 'Raise Voice',
      route: '/complaints/new',
      color: colors.amber,
      bgColor: colors.amberLight,
    },
    {
      icon: DollarSign,
      label: 'My Finances',
      route: '/finance',
      color: colors.green,
      bgColor: colors.greenLight,
    },
    {
      icon: GraduationCap,
      label: 'Training',
      route: '/training',
      color: colors.cyan,
      bgColor: colors.cyanLight,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with Gradient Background */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/notifications' as any)}
          >
            <View style={styles.notificationIconContainer}>
              <Bell size={22} color={colors.white} strokeWidth={2} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: Math.max(insets.bottom + 90, 100) },
        ]}
      >
        {/* Sync Alert */}
        {pendingCount > 0 && (
          <View style={styles.syncAlert}>
            <View style={styles.syncIconContainer}>
              <CloudOff size={18} color="#f59e0b" />
            </View>
            <Text style={styles.syncAlertText}>
              {isSyncing
                ? 'Syncing pending items...'
                : `${pendingCount} items pending sync`}
            </Text>
          </View>
        )}

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={['#1e293b', '#334155', '#475569']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroDecoration}>
              <Sparkles size={40} color="#fbbf24" style={styles.sparkle1} />
              <Sparkles size={24} color="#f59e0b" style={styles.sparkle2} />
            </View>
            <Text style={styles.heroTitle}>
              Safai Karmachari NSKFDC
            </Text>
            <Text style={styles.heroSubtitle}>Beneficiary Portal</Text>
            <Text style={styles.heroDescription}>
              Access schemes, track projects, and manage your benefits seamlessly
            </Text>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <Text style={styles.sectionSubtitle}>Choose a service</Text>
            </View>
          </View>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.actionCard,
                  {
                    shadowColor: action.color,
                  },
                ]}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[action.bgColor, colors.white]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionCardGradient}
                >
                  <View
                    style={[
                      styles.actionIconContainer,
                      { 
                        backgroundColor: action.bgColor,
                        borderColor: action.color + '60',
                      },
                    ]}
                  >
                    <action.icon size={32} color={action.color} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  {/* <View style={[styles.actionIndicator, { backgroundColor: action.color }]} /> */}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Latest Announcements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Updates</Text>
            <TouchableOpacity onPress={() => router.push('/notifications' as any)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {notifications && notifications.length > 0 ? (
            notifications.slice(0, 3).map((notif: any) => (
              <TouchableOpacity
                key={notif.id}
                style={styles.announcementCard}
                onPress={() => router.push('/notifications' as any)}
                activeOpacity={0.7}
              >
                <View style={styles.announcementLeft}>
                  <View
                    style={[
                      styles.announcementIcon,
                      {
                        backgroundColor:
                          notif.type === 'success'
                            ? colors.successBg
                            : notif.type === 'warning'
                            ? colors.warningBg
                            : colors.infoBg,
                      },
                    ]}
                  >
                    <Bell
                      size={16}
                      color={
                        notif.type === 'success'
                          ? colors.success
                          : notif.type === 'warning'
                          ? colors.warning
                          : colors.info
                      }
                    />
                  </View>
                  <View style={styles.announcementContent}>
                    <Text style={styles.announcementTitle} numberOfLines={1}>
                      {notif.title}
                    </Text>
                    <Text style={styles.announcementMessage} numberOfLines={2}>
                      {notif.message}
                    </Text>
                    <Text style={styles.announcementTime}>
                      {new Date(notif.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={18} color="#9ca3af" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Bell size={40} color="#d1d5db" />
              <Text style={styles.emptyText}>No updates available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  headerGradient: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 4,
    fontWeight: '500',
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
  },
  notificationButton: {
    padding: 4,
  },
  notificationIconContainer: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#fbbf24',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  syncAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningBg,
    padding: 14,
    marginHorizontal: 16,
    marginTop: -10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.alertWarning,
  },
  syncIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.alertWarning,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  syncAlertText: {
    flex: 1,
    fontSize: 13,
    color: colors.warningText,
    fontWeight: '600',
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: colors.indigo,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  heroGradient: {
    padding: 28,
    minHeight: 180,
    justifyContent: 'center',
    position: 'relative',
  },
  heroDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
  },
  sparkle1: {
    position: 'absolute',
    top: 20,
    right: 30,
    opacity: 0.8,
  },
  sparkle2: {
    position: 'absolute',
    top: 50,
    right: 60,
    opacity: 0.6,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.white,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fbbf24',
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 14,
    color: colors.white,
    lineHeight: 20,
    fontWeight: '400',
    opacity: 0.9,
  },
  section: {
    marginTop: 28,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.indigo,
    fontWeight: '600',
    marginTop: 2,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.indigo,
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginTop: 8,
  },
  actionCard: {
    width: (width - 64) / 2,
    margin: 8,
    borderRadius: 24,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  actionCardGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 24,
  },
  actionIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 2.5,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 18,
  },
  actionIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  announcementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  announcementLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  announcementIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  announcementContent: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  announcementMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  announcementTime: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 12,
    fontWeight: '500',
  },
});
