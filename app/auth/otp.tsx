import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { storage } from '@/utils/storage';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock, ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react-native';
import { colors } from '@/styles/colors';

export default function OTPVerificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { reloadUser } = useAuth();
  const [otp, setOtp] = useState('123456');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerifyOTP = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      // Mock delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set mock auth token first
      await storage.auth.setToken('mock-token-123');
      // Set mock user data
      await storage.user.setData({
        id: '1',
        name: 'NSKC  User',
        phone: phone || '1234567890',
        email: 'test@example.com',
        address: 'Kolkata',
        bankLinked: true,
      });
      
      // Reload user data in auth context
      await reloadUser();
      
      console.log('OTP verified successfully');
      setIsLoading(false);
      // Use replace to prevent going back
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to set auth data:', error);
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setResending(true);
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setOtp('');
    setResending(false);
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.indigo, colors.purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 20, paddingBottom: 40 }]}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
        
        <View style={styles.iconContainer}>
          <Lock size={32} color="#fff" strokeWidth={2.5} />
        </View>
        <Text style={styles.headerTitle}>Verify OTP</Text>
        <Text style={styles.headerSubtitle}>Enter the code sent to your phone</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 24) }]}
          showsVerticalScrollIndicator={false}
        >
          {/* OTP Card */}
          <View style={styles.card}>
            <View style={styles.phoneInfo}>
              <Text style={styles.phoneLabel}>Code sent to</Text>
              <Text style={styles.phoneNumber}>+91 {phone}</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.label}>Enter OTP</Text>
              <View style={[styles.inputContainer, error ? styles.inputContainerError : null]}>
                <TextInput
                  style={styles.input}
                  placeholder="• • • • • •"
                  placeholderTextColor={colors.textLight}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={(text) => {
                    setOtp(text);
                    setError('');
                  }}
                  editable={!isLoading}
                  accessibilityLabel="OTP input"
                />
              </View>
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={handleVerifyOTP}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.indigo, colors.purple]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <CheckCircle size={20} color="#fff" strokeWidth={2.5} />
                      <Text style={styles.buttonText}>Verify & Continue</Text>
                      <ArrowRight size={20} color="#fff" strokeWidth={2.5} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendOTP}
                disabled={resending}
                activeOpacity={0.7}
              >
                <Text style={styles.resendText}>
                  {resending ? 'Resending...' : "Didn't receive? Resend OTP"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Change Number Link */}
          <TouchableOpacity 
            style={styles.changeNumberButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.changeNumberText}>Change phone number</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    shadowColor: colors.indigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  phoneInfo: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.indigoLight,
    borderRadius: 16,
    marginBottom: 28,
  },
  phoneLabel: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.indigo,
    letterSpacing: 1,
  },
  formContainer: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fafbff',
  },
  inputContainerError: {
    borderColor: colors.error,
    backgroundColor: colors.errorBg,
  },
  input: {
    paddingVertical: 18,
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 12,
  },
  errorContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
    fontWeight: '500',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 20,
    gap: 8,
    shadowColor: colors.indigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  resendButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: colors.indigo,
    fontWeight: '600',
  },
  changeNumberButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  changeNumberText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
