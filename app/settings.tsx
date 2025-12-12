import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { useQueryClient } from '@tanstack/react-query';
import { colors } from '@/styles/colors';
import { Globe, LogOut, Info, Database, Trash2, Settings, ChevronRight, Check, ArrowLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ title: 'Settings', headerShown: false }} />
      
      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.indigo, colors.purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.subtitle}>App Preferences</Text>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>
          <View style={styles.settingsIconContainer}>
            <Settings size={24} color="#fff" strokeWidth={2.5} />
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 24 }]}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language Preferences</Text>
          <View style={styles.card}>
            {LANGUAGES.map((lang, index) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.optionButton,
                  index !== LANGUAGES.length - 1 && styles.optionBorderBottom
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionIconContainer}>
                    <Globe size={20} color={colors.indigo} />
                  </View>
                  <Text style={styles.optionText}>{lang.name}</Text>
                </View>
                {selectedLanguage === lang.code && (
                  <View style={styles.selectedBadge}>
                    <Check size={16} color="#fff" strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>

          {pendingSyncCount > 0 && (
            <View style={styles.syncAlert}>
              <View style={styles.syncAlertIconContainer}>
                <Database size={20} color={colors.warning} />
              </View>
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

          <View style={styles.card}>
            <TouchableOpacity
              style={[styles.optionButton, pendingSyncCount > 0 && styles.optionBorderBottom]}
              onPress={handleClearCache}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionIconContainer}>
                  <Trash2 size={20} color={colors.indigo} />
                </View>
                <Text style={styles.optionText}>Clear Cache</Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>

            {pendingSyncCount > 0 && (
              <TouchableOpacity
                style={styles.optionButton}
                onPress={handleClearPendingSync}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionIconContainer}>
                    <Trash2 size={20} color={colors.indigo} />
                  </View>
                  <View>
                    <Text style={styles.optionText}>Clear Pending Sync</Text>
                    <Text style={styles.optionSubtext}>{pendingSyncCount} items</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Info size={24} color={colors.indigo} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Safai Karmachari NSKFDC
              </Text>
              <Text style={styles.infoSubtitle}>Beneficiary Portal</Text>
              <Text style={styles.infoVersion}>Version 1.0.0</Text>
              <Text style={styles.infoText}>
                This app helps beneficiaries access schemes, track projects, and
                manage benefits efficiently.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={['#fee2e2', '#fecaca']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logoutGradient}
            >
              <View style={styles.logoutIconContainer}>
                <LogOut size={20} color={colors.error} strokeWidth={2.5} />
              </View>
              <Text style={styles.logoutText}>Logout from Account</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <View style={styles.backButtonContent}>
              <ArrowLeft size={20} color={colors.indigo} strokeWidth={2.5} />
              <Text style={styles.backButtonText}>Go Back</Text>
            </View>
          </TouchableOpacity>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    // borderBottomLeftRadius: 32,
    // borderBottomRightRadius: 32,
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
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  settingsIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginTop: 0,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  optionBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4ff',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${colors.indigo}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  optionSubtext: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: colors.warningBg,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  syncAlertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${colors.warning}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  syncAlertContent: {
    flex: 1,
  },
  syncAlertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.warningText,
    marginBottom: 4,
  },
  syncAlertMessage: {
    fontSize: 13,
    color: colors.warningText,
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: `${colors.indigo}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  infoSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.indigo,
    marginBottom: 8,
  },
  infoVersion: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 12,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 20,
  },
  logoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.error,
    borderRadius: 16,
  },
  logoutIconContainer: {
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.indigo,
    shadowColor: colors.indigo,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.indigo,
    marginLeft: 10,
  },
});
