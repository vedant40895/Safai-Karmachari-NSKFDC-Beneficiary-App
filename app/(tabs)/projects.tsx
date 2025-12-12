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
import { Project } from '@/types';
import { X, Calendar, DollarSign } from 'lucide-react-native';

export default function ProjectsScreen() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: api.projects.getList,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4caf50';
      case 'completed':
        return '#2196f3';
      case 'pending':
        return '#ff9800';
      default:
        return '#999';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Projects</Text>
      </View>

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}

      {error && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load projects</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {projects?.map((project: Project) => (
          <TouchableOpacity
            key={project.id}
            style={styles.projectCard}
            onPress={() => setSelectedProject(project)}
          >
            <View style={styles.projectHeader}>
              <Text style={styles.projectName}>{project.name}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(project.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusLabel(project.status)}
                </Text>
              </View>
            </View>

            <View style={styles.projectDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Loan Sanctioned</Text>
                <Text style={styles.detailValue}>
                  ₹{project.loanSanctioned.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Disbursed</Text>
                <Text style={styles.detailValue}>
                  ₹{project.disbursed.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            <Text style={styles.viewDetails}>View Details →</Text>
          </TouchableOpacity>
        ))}

        {projects?.length === 0 && !isLoading && (
          <Text style={styles.emptyText}>No projects found</Text>
        )}
      </ScrollView>

      <Modal
        visible={!!selectedProject}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedProject(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Project Details</Text>
              <TouchableOpacity onPress={() => setSelectedProject(null)}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {selectedProject && (
              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalProjectName}>
                  {selectedProject.name}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: getStatusColor(selectedProject.status),
                      alignSelf: 'flex-start',
                      marginBottom: 24,
                    },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusLabel(selectedProject.status)}
                  </Text>
                </View>

                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <DollarSign size={20} color="#666" />
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Loan Sanctioned</Text>
                      <Text style={styles.infoValue}>
                        ₹{selectedProject.loanSanctioned.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <DollarSign size={20} color="#666" />
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Disbursed Amount</Text>
                      <Text style={styles.infoValue}>
                        ₹{selectedProject.disbursed.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <Calendar size={20} color="#666" />
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Start Date</Text>
                      <Text style={styles.infoValue}>
                        {new Date(selectedProject.startDate).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedProject(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
  projectCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  projectDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  viewDetails: {
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  modalBody: {
    flex: 1,
  },
  modalProjectName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
