import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { Complaint } from '@/types';
import { colors } from '@/styles/colors';
import { Clock, CheckCircle, AlertCircle, TrendingUp, ClipboardList } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function TrackComplaintScreen() {  const insets = useSafeAreaInsets();  const queryClient = useQueryClient();

  const {
    data: complaints,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['complaints'],
    queryFn: api.complaints.getList,
  });

  const escalateMutation = useMutation({
    mutationFn: (id: string) => api.complaints.escalate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      Alert.alert('Success', 'Complaint has been escalated');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to escalate complaint');
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return { icon: CheckCircle, color: colors.success, bg: colors.successBg };
      case 'in-progress':
        return { icon: Clock, color: colors.info, bg: colors.infoBg };
      default:
        return { icon: AlertCircle, color: colors.warning, bg: colors.warningBg };
    }
  };

  const canEscalate = (complaint: Complaint) => {
    if (complaint.status === 'resolved') return false;
    const hoursSinceCreated =
      (Date.now() - new Date(complaint.createdAt).getTime()) / (1000 * 60 * 60);
    return hoursSinceCreated > 48;
  };

  const handleEscalate = (id: string) => {
    Alert.alert(
      'Escalate Complaint',
      'Are you sure you want to escalate this complaint?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Escalate',
          onPress: () => escalateMutation.mutate(id),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ title: 'Track Complaints', headerShown: false }} />

      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.indigo, colors.purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.subtitle}>Monitor Status</Text>
            <Text style={styles.headerTitle}>Track Complaints</Text>
          </View>
          <View style={styles.trackIconContainer}>
            <ClipboardList size={24} color="#fff" strokeWidth={2.5} />
          </View>
        </View>
      </LinearGradient>

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.indigo} />
        </View>
      )}

      {error && (
        <View style={styles.centerContainer}>
          <View style={styles.errorCard}>
            <AlertCircle size={48} color={colors.error} />
            <Text style={styles.errorText}>Failed to load complaints</Text>
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 24 }]}
      >

        {complaints?.map((complaint: Complaint) => {
          const statusData = getStatusIcon(complaint.status);
          const StatusIcon = statusData.icon;
          
          return (
            <View key={complaint.id} style={styles.complaintCard}>
              <View style={styles.complaintHeader}>
                <View style={[styles.statusBadge, { backgroundColor: statusData.bg }]}>
                  <StatusIcon size={18} color={statusData.color} strokeWidth={2} />
                  <Text style={[styles.statusText, { color: statusData.color }]}>
                    {complaint.status.replace('-', ' ').toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.complaintDate}>
                  {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
              </View>

              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{complaint.category}</Text>
              </View>

              <Text style={styles.complaintDescription} numberOfLines={3}>
                {complaint.description}
              </Text>

              {complaint.anonymous && (
                <View style={styles.anonymousBadge}>
                  <Text style={styles.anonymousLabel}>Anonymous</Text>
                </View>
              )}

              <View style={styles.complaintMeta}>
                <Text style={styles.metaText}>ID: {complaint.id.slice(0, 8)}</Text>
                <Text style={styles.metaText}>
                  Updated: {new Date(complaint.updatedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </Text>
              </View>

              {canEscalate(complaint) && (
                <TouchableOpacity
                  style={styles.escalateButton}
                  onPress={() => handleEscalate(complaint.id)}
                  disabled={escalateMutation.isPending}
                >
                  <TrendingUp size={18} color={colors.error} strokeWidth={2.5} />
                  <Text style={styles.escalateButtonText}>Escalate Complaint</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {complaints?.length === 0 && !isLoading && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconContainer}>
                <AlertCircle size={48} color={colors.indigo} strokeWidth={2} />
              </View>
              <Text style={styles.emptyText}>No complaints found</Text>
              <Text style={styles.emptySubtext}>
                Submit a complaint to track its status here
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  trackIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  errorText: {
    color: colors.error,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  complaintCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  complaintDate: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.indigo,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 14,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  complaintDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 22,
    marginBottom: 14,
  },
  anonymousBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.infoBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  anonymousLabel: {
    fontSize: 11,
    color: colors.info,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  complaintMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0f4ff',
  },
  metaText: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
  },
  escalateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    padding: 14,
    backgroundColor: colors.errorBg,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.error,
  },
  escalateButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.error,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    width: width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${colors.indigo}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});
