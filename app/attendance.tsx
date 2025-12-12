import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/utils/api';
import { storage } from '@/utils/storage';
import * as Location from 'expo-location';
import { Clock, MapPin, CheckCircle, LogIn, LogOut } from 'lucide-react-native';

const WORK_TYPES = [
  'Street Cleaning',
  'Waste Collection',
  'Drainage Maintenance',
  'Public Toilet Cleaning',
  'Other',
];

export default function AttendanceScreen() {
  const queryClient = useQueryClient();
  const [location, setLocation] = useState<any>(null);
  const insets = useSafeAreaInsets();
  const [selectedWorkType, setSelectedWorkType] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        captureLocation();
      }
    }
  };

  const captureLocation = async () => {
    try {
      if (Platform.OS !== 'web') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  const { data: history, isLoading } = useQuery({
    queryKey: ['attendance-history'],
    queryFn: api.attendance.getHistory,
  });

  const checkInMutation = useMutation({
    mutationFn: async () => {
      if (!location) {
        throw new Error('Location not available');
      }
      if (!selectedWorkType) {
        throw new Error('Please select work type');
      }

      return api.attendance.checkIn({
        workType: selectedWorkType,
        location,
        timestamp: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      setIsCheckedIn(true);
      setCheckInTime(new Date());
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      Alert.alert('Success', 'Checked in successfully');
    },
    onError: async (error: any) => {
      await storage.sync.addPending({
        type: 'attendance',
        data: {
          action: 'checkin',
          workType: selectedWorkType,
          location,
          timestamp: new Date().toISOString(),
        },
      });
      Alert.alert(
        'Offline',
        'Check-in has been queued and will sync when online'
      );
      setIsCheckedIn(true);
      setCheckInTime(new Date());
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async () => {
      if (!location) {
        throw new Error('Location not available');
      }

      return api.attendance.checkOut({
        location,
        timestamp: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      setIsCheckedIn(false);
      setCheckInTime(null);
      setSelectedWorkType('');
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      Alert.alert('Success', 'Checked out successfully');
    },
    onError: async (error: any) => {
      await storage.sync.addPending({
        type: 'attendance',
        data: {
          action: 'checkout',
          location,
          timestamp: new Date().toISOString(),
        },
      });
      Alert.alert(
        'Offline',
        'Check-out has been queued and will sync when online'
      );
      setIsCheckedIn(false);
      setCheckInTime(null);
    },
  });

  const handleCheckIn = () => {
    if (!selectedWorkType) {
      Alert.alert('Error', 'Please select a work type');
      return;
    }
    checkInMutation.mutate();
  };

  const handleCheckOut = () => {
    Alert.alert('Check Out', 'Are you sure you want to check out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Check Out', onPress: () => checkOutMutation.mutate() },
    ]);
  };

  const calculateDuration = () => {
    if (!checkInTime) return '0h 0m';
    const now = new Date();
    const diff = now.getTime() - checkInTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ title: 'Attendance', headerShown: true }} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Clock size={32} color="#000" />
            <Text style={styles.statusTitle}>
              {isCheckedIn ? 'Currently Working' : 'Not Checked In'}
            </Text>
          </View>

          {isCheckedIn && (
            <View style={styles.durationContainer}>
              <Text style={styles.durationLabel}>Duration</Text>
              <Text style={styles.durationValue}>{calculateDuration()}</Text>
            </View>
          )}

          <View style={styles.locationInfo}>
            <MapPin size={16} color="#666" />
            <Text style={styles.locationText}>
              {location
                ? `Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                : 'Fetching location...'}
            </Text>
          </View>
        </View>

        {!isCheckedIn ? (
          <View style={styles.checkInSection}>
            <Text style={styles.sectionTitle}>Select Work Type</Text>
            <View style={styles.workTypeGrid}>
              {WORK_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.workTypeButton,
                    selectedWorkType === type && styles.workTypeButtonActive,
                  ]}
                  onPress={() => setSelectedWorkType(type)}
                >
                  <Text
                    style={[
                      styles.workTypeText,
                      selectedWorkType === type && styles.workTypeTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.checkInButton,
                checkInMutation.isPending && styles.buttonDisabled,
              ]}
              onPress={handleCheckIn}
              disabled={checkInMutation.isPending || !location}
            >
              {checkInMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <LogIn size={20} color="#fff" />
                  <Text style={styles.checkInButtonText}>Check In</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.checkOutSection}>
            <View style={styles.currentWorkInfo}>
              <Text style={styles.currentWorkLabel}>Current Work Type</Text>
              <Text style={styles.currentWorkValue}>{selectedWorkType}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.checkOutButton,
                checkOutMutation.isPending && styles.buttonDisabled,
              ]}
              onPress={handleCheckOut}
              disabled={checkOutMutation.isPending}
            >
              {checkOutMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <LogOut size={20} color="#fff" />
                  <Text style={styles.checkOutButtonText}>Check Out</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Attendance History</Text>

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#000" />
            </View>
          )}

          {history?.map((record: any) => (
            <View key={record.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDate}>
                  {new Date(record.date).toLocaleDateString()}
                </Text>
                <CheckCircle size={20} color="#4caf50" />
              </View>

              <View style={styles.historyDetails}>
                <View style={styles.historyRow}>
                  <Text style={styles.historyLabel}>Check In</Text>
                  <Text style={styles.historyValue}>{record.checkIn}</Text>
                </View>

                {record.checkOut && (
                  <View style={styles.historyRow}>
                    <Text style={styles.historyLabel}>Check Out</Text>
                    <Text style={styles.historyValue}>{record.checkOut}</Text>
                  </View>
                )}

                <View style={styles.historyRow}>
                  <Text style={styles.historyLabel}>Work Type</Text>
                  <Text style={styles.historyValue}>{record.workType}</Text>
                </View>
              </View>
            </View>
          ))}

          {history?.length === 0 && !isLoading && (
            <Text style={styles.emptyText}>No attendance records found</Text>
          )}
        </View>
      </ScrollView>
    </View>
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
  statusCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  durationContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  durationLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  durationValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
  },
  checkInSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  workTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  workTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  workTypeButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  workTypeText: {
    fontSize: 13,
    color: '#000',
    fontWeight: '500',
  },
  workTypeTextActive: {
    color: '#fff',
  },
  checkInButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  checkOutSection: {
    marginBottom: 24,
  },
  currentWorkInfo: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  currentWorkLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  currentWorkValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  checkOutButton: {
    flexDirection: 'row',
    backgroundColor: '#f00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  historySection: {
    marginBottom: 24,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  historyCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  historyDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  historyDetails: {
    gap: 8,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLabel: {
    fontSize: 13,
    color: '#666',
  },
  historyValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    padding: 20,
  },
});

