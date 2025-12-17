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
import { Project } from '@/types';
import { X, Calendar, DollarSign, Briefcase, TrendingUp, CheckCircle, ArrowLeft, FileText, Users, Package, IndianRupee, Wallet, MessageSquare } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProjectsScreen() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const insets = useSafeAreaInsets();

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
            <Text style={styles.subtitle}>My Portfolio</Text>
            <Text style={styles.title}>Projects</Text>
          </View>
          <View style={styles.projectCountBadge}>
            <Briefcase size={18} color={colors.indigo} />
            <Text style={styles.projectCountText}>
              {projects?.length || 0}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.indigo} />
          <Text style={styles.loadingText}>Loading projects...</Text>
        </View>
      )}

      {error && (
        <View style={styles.centerContainer}>
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>Failed to load projects</Text>
            <Text style={styles.errorSubtext}>Please try again later</Text>
          </View>
        </View>
      )}

      {!isLoading && !error && (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.contentContainer, { paddingBottom: Math.max(insets.bottom + 90, 100) }]}
        >
        {projects?.map((project: Project) => (
          <TouchableOpacity
            key={project.id}
            style={styles.projectCard}
            onPress={() => setSelectedProject(project)}
            activeOpacity={0.7}
          >
            <View style={styles.projectCardGradient}>
              <View style={styles.projectHeader}>
                <View style={styles.projectIconContainer}>
                  <LinearGradient
                    colors={[colors.indigo, colors.purple]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.projectIconGradient}
                  >
                    <Briefcase size={24} color="#fff" strokeWidth={2.5} />
                  </LinearGradient>
                </View>
                <View style={styles.projectHeaderText}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(project.status) + '20', borderColor: getStatusColor(project.status) },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: getStatusColor(project.status) }]}>
                      {getStatusLabel(project.status)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.projectDetails}>
                <View style={styles.detailItem}>
                  <View style={styles.detailIconContainer}>
                    <DollarSign size={16} color={colors.green} />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>Loan Sanctioned</Text>
                    <Text style={styles.detailValue}>
                      ₹{project.loanSanctioned.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailItem}>
                  <View style={styles.detailIconContainer}>
                    <TrendingUp size={16} color={colors.cyan} />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>Disbursed</Text>
                    <Text style={styles.detailValue}>
                      ₹{project.disbursed.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.viewDetailsContainer}>
                <Text style={styles.viewDetails}>View Full Details</Text>
                <Text style={styles.arrow}>→</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {projects?.length === 0 && (
          <View style={styles.emptyContainer}>
            <Briefcase size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>No projects found</Text>
            <Text style={styles.emptySubtext}>Your projects will appear here</Text>
          </View>
        )}
        </ScrollView>
      )}

      <Modal
        visible={!!selectedProject}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedProject(null)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#ffffff', colors.backgroundLight]}
            style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Project Details</Text>
              <TouchableOpacity 
                onPress={() => setSelectedProject(null)}
                style={styles.closeIconButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedProject && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.modalProjectHeader}>
                  <LinearGradient
                    colors={[colors.indigo, colors.purple]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.modalProjectIcon}
                  >
                    <Briefcase size={32} color="#fff" strokeWidth={2.5} />
                  </LinearGradient>
                  <Text style={styles.modalProjectName}>
                    {selectedProject.name}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: getStatusColor(selectedProject.status) + '20',
                      borderColor: getStatusColor(selectedProject.status),
                      alignSelf: 'flex-start',
                      marginBottom: 24,
                    },
                  ]}
                >
                  <Text style={[styles.statusText, { color: getStatusColor(selectedProject.status) }]}>
                    {getStatusLabel(selectedProject.status)}
                  </Text>
                </View>

                <View style={styles.infoCardsContainer}>
                  {selectedProject.schemeLinked && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIconContainer}>
                        <FileText size={18} color={colors.indigo} />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Scheme Linked</Text>
                        <Text style={styles.infoValue}>
                          {selectedProject.schemeLinked}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <DollarSign size={18} color={colors.green} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Loan Amount Sanctioned</Text>
                      <Text style={styles.infoValue}>
                        ₹{selectedProject.loanSanctioned.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <TrendingUp size={18} color={colors.cyan} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Disbursed Amount</Text>
                      <Text style={styles.infoValue}>
                        ₹{selectedProject.disbursed.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>

                  {selectedProject.workStatus && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIconContainer}>
                        <CheckCircle size={18} color={selectedProject.workStatus === 'Completed' ? colors.success : colors.warning} />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Work Status</Text>
                        <Text style={[styles.infoValue, { color: selectedProject.workStatus === 'Completed' ? colors.success : colors.warning }]}>
                          {selectedProject.workStatus}
                        </Text>
                      </View>
                    </View>
                  )}

                  {selectedProject.assetsDeployed && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIconContainer}>
                        <Package size={18} color={colors.purple} />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Assets Deployed</Text>
                        <Text style={styles.infoValue}>
                          {selectedProject.assetsDeployed}
                        </Text>
                      </View>
                    </View>
                  )}

                  {selectedProject.manpowerUtilized && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIconContainer}>
                        <Users size={18} color={colors.indigo} />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Manpower Utilized</Text>
                        <Text style={styles.infoValue}>
                          {selectedProject.manpowerUtilized} Members
                        </Text>
                      </View>
                    </View>
                  )}

                  {selectedProject.paymentReceived !== undefined && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIconContainer}>
                        <IndianRupee size={18} color={colors.green} />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Payment Received from Govt</Text>
                        <Text style={styles.infoValue}>
                          ₹{selectedProject.paymentReceived.toLocaleString('en-IN')}
                        </Text>
                      </View>
                    </View>
                  )}

                  {selectedProject.salaryPaid !== undefined && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIconContainer}>
                        <Wallet size={18} color={colors.cyan} />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Salary Paid to Members</Text>
                        <Text style={styles.infoValue}>
                          ₹{selectedProject.salaryPaid.toLocaleString('en-IN')}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <Calendar size={18} color={colors.indigo} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Start Date</Text>
                      <Text style={styles.infoValue}>
                        {new Date(selectedProject.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>

                  {selectedProject.remarks && (
                    <View style={[styles.infoRow, styles.remarksRow]}>
                      <View style={styles.infoIconContainer}>
                        <MessageSquare size={18} color={colors.purple} />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Remarks</Text>
                        <Text style={styles.remarksText}>
                          {selectedProject.remarks}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedProject(null)}
            >
              <LinearGradient
                colors={[colors.indigo, colors.purple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.closeButtonGradient}
              >
                <ArrowLeft size={20} color="#fff" strokeWidth={2.5} />
                <Text style={styles.closeButtonText}>Go Back</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    paddingBottom: 32,
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
  projectCountBadge: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  projectCountText: {
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
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
  projectCard: {
    marginBottom: 16,
    borderRadius: 24,
    shadowColor: colors.indigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: '#fff',
  },
  projectCardGradient: {
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.15)',
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  projectIconContainer: {
    marginRight: 14,
  },
  projectIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.indigo,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  projectHeaderText: {
    flex: 1,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  projectDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    padding: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 10,
    // shadowColor: '#ff7171ff',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(248, 243, 243, 0.06)',
  },
  detailLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginBottom: 4,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    gap: 6,
  },
  viewDetails: {
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
    flex: 1,
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
  modalProjectHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalProjectIcon: {
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
  modalProjectName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoCardsContainer: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 4,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.indigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButtonGradient: {
    flexDirection: 'row',
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  remarksRow: {
    alignItems: 'flex-start',
  },
  remarksText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },
});
