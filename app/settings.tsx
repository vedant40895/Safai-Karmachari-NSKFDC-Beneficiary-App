import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { useQueryClient } from '@tanstack/react-query';
import { Globe, LogOut, Info, Database, Trash2 } from 'lucide-react-native';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const lang = await storage.settings.getLanguage();
    setSelectedLanguage(lang);

    const pending = await storage.sync.getPending();
    setPendingSyncCount(pending.length);
  };

  const handleLanguageChange = async (langCode: string) => {
    setSelectedLanguage(langCode);
    await storage.settings.setLanguage(langCode);
    Alert.alert('Success', 'Language preference updated');
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            queryClient.clear();
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleClearPendingSync = async () => {
    Alert.alert(
      'Clear Pending Sync',
      'Are you sure you want to clear all pending sync items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await storage.sync.clearPending();
            setPendingSyncCount(0);
            Alert.alert('Success', 'Pending sync items cleared');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          queryClient.clear();
          router.replace('/auth/phone');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Settings', headerShown: true }} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <View style={styles.optionGroup}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={styles.optionButton}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <View style={styles.optionContent}>
                  <Globe size={20} color="#666" />
                  <Text style={styles.optionText}>{lang.name}</Text>
                </View>
                {selectedLanguage === lang.code && (
                  <View style={styles.selectedDot} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>

          {pendingSyncCount > 0 && (
            <View style={styles.syncAlert}>
              <Database size={20} color="#ff9800" />
              <View style={styles.syncAlertContent}>
                <Text style={styles.syncAlertTitle}>
                  {pendingSyncCount} items pending sync
                </Text>
                <Text style={styles.syncAlertMessage}>
                  These items will be synced when you're online
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleClearCache}
          >
            <View style={styles.optionContent}>
              <Trash2 size={20} color="#666" />
              <Text style={styles.optionText}>Clear Cache</Text>
            </View>
          </TouchableOpacity>

          {pendingSyncCount > 0 && (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleClearPendingSync}
            >
              <View style={styles.optionContent}>
                <Trash2 size={20} color="#666" />
                <Text style={styles.optionText}>
                  Clear Pending Sync ({pendingSyncCount})
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoCard}>
            <Info size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Safai Karmachari NSKFDC Beneficiary App
              </Text>
              <Text style={styles.infoText}>Version 1.0.0</Text>
              <Text style={styles.infoText}>
                This app helps beneficiaries access schemes, track projects, and
                manage benefits efficiently.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#f00" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionGroup: {
    gap: 1,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionText: {
    fontSize: 15,
    color: '#000',
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
  },
  syncAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  syncAlertContent: {
    flex: 1,
  },
  syncAlertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  syncAlertMessage: {
    fontSize: 13,
    color: '#856404',
    lineHeight: 18,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f00',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f00',
  },
});
