import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/colors';
import { Scheme } from '@/types';
import { validate } from '@/utils/validation';
import * as DocumentPicker from 'expo-document-picker';
import { Upload, X, CheckCircle, FileText, User, Phone, MapPin, CreditCard, Award, ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ApplySchemeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    aadhaar: user?.aadhaar || '',
    address: user?.address || '',
  });

  const [documents, setDocuments] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    data: schemes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['schemes'],
    queryFn: api.schemes.getList,
  });

  const handleApplyClick = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setShowApplicationForm(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const nameError = validate.required(formData.name, 'Name');
    if (nameError) newErrors.name = nameError;

    const phoneError = validate.phone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const aadhaarError = validate.aadhaar(formData.aadhaar);
    if (aadhaarError) newErrors.aadhaar = aadhaarError;

    const addressError = validate.required(formData.address, 'Address');
    if (addressError) newErrors.address = addressError;

    if (documents.length === 0) {
      newErrors.documents = 'Please upload at least one document';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets) {
        setDocuments((prev) => [...prev, result.assets[0]]);
        if (errors.documents) {
          setErrors((prev) => ({ ...prev, documents: '' }));
        }
      }
    } catch (error) {
      console.error('Document picker error:', error);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('schemeId', selectedScheme?.id || '');
      formDataToSend.append('schemeName', selectedScheme?.name || '');
      formDataToSend.append('applicantName', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('aadhaar', formData.aadhaar);
      formDataToSend.append('address', formData.address);

      documents.forEach((doc, index) => {
        formDataToSend.append(`document_${index}`, {
          uri: doc.uri,
          name: doc.name,
          type: doc.mimeType || 'application/octet-stream',
        } as any);
      });

      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    
      setSubmitted(true);
      setShowApplicationForm(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.successContainer}>
          <LinearGradient
            colors={[colors.successBg, colors.backgroundLight]}
            style={styles.successCard}
          >
            <View style={styles.successIconContainer}>
              <CheckCircle size={64} color={colors.success} strokeWidth={2} />
            </View>
            <Text style={styles.successTitle}>Application Submitted!</Text>
            <Text style={styles.successMessage}>
              Your application for "{selectedScheme?.name}" has been submitted successfully. You will be
              notified about the status soon.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSubmitted(false);
                setSelectedScheme(null);
                setFormData({
                  name: user?.name || '',
                  phone: user?.phone || '',
                  aadhaar: user?.aadhaar || '',
                  address: user?.address || '',
                });
                setDocuments([]);
                setErrors({});
              }}
            >
              <LinearGradient
                colors={[colors.indigo, colors.purple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Back to Schemes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.indigo, colors.purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.subtitle}>Government Programs</Text>
            <Text style={styles.headerTitle}>Available Schemes</Text>
          </View>
          <View style={styles.schemeIconContainer}>
            <Award size={28} color="#fff" strokeWidth={2.5} />
          </View>
        </View>
      </LinearGradient>

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.indigo} />
          <Text style={styles.loadingText}>Loading schemes...</Text>
        </View>
      )}

      {error && (
        <View style={styles.centerContainer}>
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>Failed to load schemes</Text>
            <Text style={styles.errorSubtext}>Please try again later</Text>
          </View>
        </View>
      )}

      {!isLoading && !error && (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 24 }]}
        >
          {schemes?.map((scheme: Scheme) => (
            <View key={scheme.id} style={styles.schemeCard}>
              <View style={styles.schemeHeader}>
                <LinearGradient
                  colors={[colors.indigo, colors.purple]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.schemeIconBadge}
                >
                  <FileText size={24} color="#fff" strokeWidth={2.5} />
                </LinearGradient>
                <View style={styles.schemeHeaderInfo}>
                  <Text style={styles.schemeName}>{scheme.name}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{scheme.category}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.schemeDescription} numberOfLines={3}>
                {scheme.description}
              </Text>

              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsLabel}>Benefits:</Text>
                <Text style={styles.benefitsText}>{scheme.benefits}</Text>
              </View>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => handleApplyClick(scheme)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.indigo, colors.purple]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.applyButtonGradient}
                >
                  <Text style={styles.applyButtonText}>Apply Now</Text>
                  <ArrowRight size={20} color="#fff" strokeWidth={2.5} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ))}

          {schemes?.length === 0 && (
            <View style={styles.emptyContainer}>
              <Award size={48} color={colors.textLight} strokeWidth={2} />
              <Text style={styles.emptyText}>No schemes available</Text>
              <Text style={styles.emptySubtext}>Check back later for new schemes</Text>
            </View>
          )}
        </ScrollView>
      )}

      <Modal
        visible={showApplicationForm}
        transparent
        animationType="slide"
        onRequestClose={() => setShowApplicationForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Apply for Scheme</Text>
                <Text style={styles.modalSubtitle}>{selectedScheme?.name}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowApplicationForm(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color={colors.text} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>

                <View style={styles.inputCard}>
            <View style={styles.iconLabelContainer}>
              <View style={styles.inputIconContainer}>
                <User size={18} color={colors.indigo} />
              </View>
              <Text style={styles.label}>Full Name *</Text>
            </View>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textLight}
              accessibilityLabel="Full name input"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputCard}>
            <View style={styles.iconLabelContainer}>
              <View style={styles.inputIconContainer}>
                <Phone size={18} color={colors.indigo} />
              </View>
              <Text style={styles.label}>Phone Number *</Text>
            </View>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              placeholder="Enter phone number"
              placeholderTextColor={colors.textLight}
              keyboardType="phone-pad"
              maxLength={10}
              accessibilityLabel="Phone number input"
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>

          <View style={styles.inputCard}>
            <View style={styles.iconLabelContainer}>
              <View style={styles.inputIconContainer}>
                <CreditCard size={18} color={colors.indigo} />
              </View>
              <Text style={styles.label}>Aadhaar Number *</Text>
            </View>
            <TextInput
              style={[styles.input, errors.aadhaar && styles.inputError]}
              value={formData.aadhaar}
              onChangeText={(text) => handleInputChange('aadhaar', text)}
              placeholder="Enter 12-digit Aadhaar number"
              placeholderTextColor={colors.textLight}
              keyboardType="number-pad"
              maxLength={12}
              accessibilityLabel="Aadhaar number input"
            />
            {errors.aadhaar && (
              <Text style={styles.errorText}>{errors.aadhaar}</Text>
            )}
          </View>

          <View style={styles.inputCard}>
            <View style={styles.iconLabelContainer}>
              <View style={styles.inputIconContainer}>
                <MapPin size={18} color={colors.indigo} />
              </View>
              <Text style={styles.label}>Address *</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.address && styles.inputError,
              ]}
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              placeholder="Enter your complete address"
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={4}
              accessibilityLabel="Address input"
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents *</Text>
          <View style={styles.documentsCard}>
            <Text style={styles.helperText}>
              Upload required documents (Aadhaar, Income certificate, etc.)
            </Text>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickDocument}
            >
              <Upload size={20} color={colors.indigo} />
              <Text style={styles.uploadButtonText}>Choose Document</Text>
            </TouchableOpacity>

            {errors.documents && (
              <Text style={styles.errorText}>{errors.documents}</Text>
            )}

            {documents.map((doc, index) => (
              <View key={index} style={styles.documentItem}>
                <View style={styles.documentIconContainer}>
                  <FileText size={18} color={colors.indigo} />
                </View>
                <Text style={styles.documentName} numberOfLines={1}>
                  {doc.name}
                </Text>
                <TouchableOpacity 
                  onPress={() => removeDocument(index)}
                  style={styles.removeButton}
                >
                  <X size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={[colors.indigo, colors.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit Application</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 32,
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
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  schemeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginTop: -16,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  warningBanner: {
    backgroundColor: colors.warningBg,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  warningText: {
    color: colors.warningText,
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.text,
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: `${colors.indigo}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    fontSize: 16,
    color: '#000',
    padding: 12,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  documentsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  helperText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
    lineHeight: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.indigo}10`,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: `${colors.indigo}30`,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: colors.indigo,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e8ecff',
  },
  documentIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${colors.indigo}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentName: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${colors.error}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: colors.indigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successCard: {
    width: width - 40,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${colors.success}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 15,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textLight,
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
  },
  schemeCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  schemeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  schemeIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  schemeHeaderInfo: {
    flex: 1,
  },
  schemeName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: `${colors.indigo}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.indigo,
  },
  schemeDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 16,
  },
  benefitsContainer: {
    backgroundColor: '#f8f9ff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.indigo,
  },
  benefitsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  benefitsText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },
  applyButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.indigo,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  applyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#f0f4ff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecff',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
});
