import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { colors } from '@/styles/colors';
import { Scheme } from '@/types';
import { useRouter } from 'expo-router';
import { X, CheckCircle, FileText, Award, Sparkles } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SchemesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const {
    data: schemes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['schemes'],
    queryFn: api.schemes.getList,
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
            <Text style={styles.title}>Schemes</Text>
          </View>
          <View style={styles.schemeCountBadge}>
            <Award size={18} color={colors.indigo} />
            <Text style={styles.schemeCountText}>
              {schemes?.length || 0}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* {isLoading && (
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
      )} */}

      {!isLoading && !error && (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.contentContainer, { paddingBottom: Math.max(insets.bottom + 90, 100) }]}
        >
        {schemes?.map((scheme: Scheme) => (
          <TouchableOpacity
            key={scheme.id}
            style={styles.schemeCard}
            onPress={() => setSelectedScheme(scheme)}
            activeOpacity={0.7}
          >
            <View style={styles.schemeCardContent}>
              <View style={styles.schemeHeader}>
                <View style={styles.schemeIconContainer}>
                  <LinearGradient
                    colors={[colors.indigo, colors.purple]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.schemeIconGradient}
                  >
                    <FileText size={24} color="#fff" strokeWidth={2.5} />
                  </LinearGradient>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{scheme.category}</Text>
                </View>
              </View>
              <Text style={styles.schemeName}>{scheme.name}</Text>
              <Text style={styles.schemeDescription} numberOfLines={2}>
                {scheme.description}
              </Text>
              <View style={styles.viewMoreContainer}>
                <Text style={styles.viewMore}>View Details</Text>
                <Text style={styles.arrow}>→</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {schemes?.length === 0 && (
          <View style={styles.emptyContainer}>
            <Award size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>No schemes available</Text>
            <Text style={styles.emptySubtext}>Check back later for new programs</Text>
          </View>
        )}
        </ScrollView>
      )}

      <Modal
        visible={!!selectedScheme}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedScheme(null)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#ffffff', colors.backgroundLight]}
            style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Scheme Details</Text>
              <TouchableOpacity 
                onPress={() => setSelectedScheme(null)}
                style={styles.closeIconButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedScheme && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalSchemeHeader}>
                  <LinearGradient
                    colors={[colors.indigo, colors.purple]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.modalSchemeIcon}
                  >
                    <FileText size={32} color="#fff" strokeWidth={2.5} />
                  </LinearGradient>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>
                      {selectedScheme.category}
                    </Text>
                  </View>
                </View>
                <Text style={styles.modalSchemeName}>
                  {selectedScheme.name}
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedScheme.description}
                </Text>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
                  <View style={styles.eligibilityContainer}>
                    {selectedScheme.eligibility.map((item, index) => (
                      <View key={index} style={styles.listItem}>
                        <View style={styles.checkIconContainer}>
                          <CheckCircle size={16} color={colors.green} />
                        </View>
                        <Text style={styles.listText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Benefits</Text>
                  <View style={styles.benefitsCard}>
                    <Text style={styles.benefitsText}>
                      {selectedScheme.benefits}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  setSelectedScheme(null);
                  router.push({
                    pathname: '/schemes/apply' as any,
                    params: { schemeId: selectedScheme?.id },
                  });
                }}
              >
                <LinearGradient
                  colors={[colors.indigo, colors.purple]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.applyButtonGradient}
                >
                  <Text style={styles.applyButtonText}>Apply Now</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setSelectedScheme(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
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
    padding: 24,
    paddingBottom: 28,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  schemeCountBadge: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  schemeCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.indigo,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingTop: 20,
  },
  // centerContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   paddingVertical: 40,
  // },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  errorCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  errorSubtext: {
    color: colors.textLight,
    fontSize: 14,
  },
  schemeCard: {
    marginBottom: 16,
    borderRadius: 24,
    shadowColor: colors.indigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: '#fff',
  },
  schemeCardContent: {
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.15)',
    borderRadius: 24,
  },
  schemeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  schemeIconContainer: {
    shadowColor: colors.indigo,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  schemeIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: colors.indigoLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.indigo,
  },
  categoryText: {
    color: colors.indigo,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  schemeName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  schemeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  viewMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    gap: 6,
  },
  viewMore: {
    fontSize: 14,
    color: colors.indigo,
    fontWeight: '700',
  },
  arrow: {
    fontSize: 18,
    color: colors.indigo,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
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
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeIconButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    marginBottom: 16,
  },
  modalSchemeHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalSchemeIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalSchemeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  eligibilityContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkIconContainer: {
    marginTop: 2,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  benefitsCard: {
    backgroundColor: colors.successBg,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.success + '40',
  },
  benefitsText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  modalActions: {
    gap: 12,
  },
  applyButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.indigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  applyButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: colors.backgroundLight,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
});
