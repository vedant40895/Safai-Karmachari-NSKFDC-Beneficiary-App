import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { Scheme } from '@/types';
import { useRouter } from 'expo-router';
import { X, CheckCircle } from 'lucide-react-native';

export default function SchemesScreen() {
  const router = useRouter();
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Schemes</Text>
      </View>

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}

      {error && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load schemes</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {schemes?.map((scheme: Scheme) => (
          <TouchableOpacity
            key={scheme.id}
            style={styles.schemeCard}
            onPress={() => setSelectedScheme(scheme)}
          >
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{scheme.category}</Text>
            </View>
            <Text style={styles.schemeName}>{scheme.name}</Text>
            <Text style={styles.schemeDescription} numberOfLines={2}>
              {scheme.description}
            </Text>
            <Text style={styles.viewMore}>View Details →</Text>
          </TouchableOpacity>
        ))}

        {schemes?.length === 0 && !isLoading && (
          <Text style={styles.emptyText}>No schemes available</Text>
        )}
      </ScrollView>

      <Modal
        visible={!!selectedScheme}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedScheme(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Scheme Details</Text>
              <TouchableOpacity onPress={() => setSelectedScheme(null)}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {selectedScheme && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>
                    {selectedScheme.category}
                  </Text>
                </View>
                <Text style={styles.modalSchemeName}>
                  {selectedScheme.name}
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedScheme.description}
                </Text>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
                  {selectedScheme.eligibility.map((item, index) => (
                    <View key={index} style={styles.listItem}>
                      <CheckCircle size={16} color="#000" />
                      <Text style={styles.listText}>{item}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Benefits</Text>
                  <Text style={styles.benefitsText}>
                    {selectedScheme.benefits}
                  </Text>
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
                <Text style={styles.applyButtonText}>Apply Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setSelectedScheme(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
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
  schemeCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  schemeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  schemeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  viewMore: {
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  modalBody: {
    flex: 1,
    marginBottom: 16,
  },
  modalSchemeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  benefitsText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  modalActions: {
    gap: 12,
  },
  applyButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
