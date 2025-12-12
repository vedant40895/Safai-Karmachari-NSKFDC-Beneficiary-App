import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { Complaint } from '@/types';
import { Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react-native';

export default function TrackComplaintScreen() {
  const queryClient = useQueryClient();

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
        return <CheckCircle size={20} color="#4caf50" />;
      case 'in-progress':
        return <Clock size={20} color="#2196f3" />;
      default:
        return <AlertCircle size={20} color="#ff9800" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return '#4caf50';
      case 'in-progress':
        return '#2196f3';
      default:
        return '#ff9800';
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
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Track Complaints', headerShown: true }} />

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}

      {error && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load complaints</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Complaints</Text>

        {complaints?.map((complaint: Complaint) => (
          <View key={complaint.id} style={styles.complaintCard}>
            <View style={styles.complaintHeader}>
              <View style={styles.statusBadge}>
                {getStatusIcon(complaint.status)}
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(complaint.status) },
                  ]}
                >
                  {complaint.status.replace('-', ' ').toUpperCase()}
                </Text>
              </View>
              <Text style={styles.complaintDate}>
                {new Date(complaint.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{complaint.category}</Text>
            </View>

            <Text style={styles.complaintDescription} numberOfLines={3}>
              {complaint.description}
            </Text>

            {complaint.anonymous && (
              <Text style={styles.anonymousLabel}>Anonymous</Text>
            )}

            <View style={styles.complaintMeta}>
              <Text style={styles.metaText}>
                ID: {complaint.id.slice(0, 8)}
              </Text>
              <Text style={styles.metaText}>
                Updated: {new Date(complaint.updatedAt).toLocaleDateString()}
              </Text>
            </View>

            {canEscalate(complaint) && (
              <TouchableOpacity
                style={styles.escalateButton}
                onPress={() => handleEscalate(complaint.id)}
                disabled={escalateMutation.isPending}
              >
                <TrendingUp size={16} color="#f00" />
                <Text style={styles.escalateButtonText}>Escalate</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {complaints?.length === 0 && !isLoading && (
          <View style={styles.emptyContainer}>
            <AlertCircle size={48} color="#ccc" />
            <Text style={styles.emptyText}>No complaints found</Text>
            <Text style={styles.emptySubtext}>
              Submit a complaint to track its status here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#f00',
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  complaintCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  complaintDate: {
    fontSize: 12,
    color: '#666',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  complaintDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  anonymousLabel: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  complaintMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  metaText: {
    fontSize: 11,
    color: '#999',
  },
  escalateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f00',
  },
  escalateButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f00',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 8,
  },
});
