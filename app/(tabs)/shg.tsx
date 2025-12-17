import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
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
import { SHGMember } from '@/types';
import { Search, X, Phone, Calendar, Users, Mail, User, CreditCard, GraduationCap, Wallet, UserCircle, Edit, Plus, Trash2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Color palette for member avatars
const avatarColors = [
  ['#8b5cf6', '#6366f1'], // Purple to Indigo
  ['#ec4899', '#f97316'], // Pink to Orange
  ['#10b981', '#06b6d4'], // Green to Cyan
  ['#f59e0b', '#ef4444'], // Amber to Red
  ['#6366f1', '#8b5cf6'], // Indigo to Purple
];

export default function SHGScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<SHGMember | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    role: 'Member',
    age: '',
    gender: 'Male',
  });

  const {
    data: members,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['shg-members'],
    queryFn: api.shg.getMembers,
  });

  const filteredMembers = members?.filter((member: SHGMember) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <View style={{ flex: 1 }}>
            <Text style={styles.subtitle}>Self Help Group</Text>
            <Text style={styles.title}>My SHG Members</Text>
          </View>
          <View style={styles.headerActions}>
            {/* <View style={styles.memberCountBadge}>
              <Users size={18} color={colors.indigo} />
              <Text style={styles.memberCountText}>
                {filteredMembers?.length || 0}
              </Text>
            </View> */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditMode(!editMode)}
            >
              <Edit size={20} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
        {editMode && (
          <TouchableOpacity
            style={styles.addMemberButton}
            onPress={() => setShowAddMemberModal(true)}
          >
            <Plus size={20} color="#fff" strokeWidth={2.5} />
            <Text style={styles.addMemberText}>Add Member</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search members..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search members"
          />
        </View>
      </View>

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.indigo} />
        </View>
      )}

      {error && (
        <View style={styles.centerContainer}>
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>Failed to load members</Text>
            <Text style={styles.errorSubtext}>Please try again later</Text>
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 90, 100) }}
      >
        {filteredMembers?.map((member: SHGMember, index: number) => {
          const colorIndex = index % avatarColors.length;
          return (
            <TouchableOpacity
              key={member.id}
              style={styles.memberCard}
              onPress={() => !editMode && setSelectedMember(member)}
              activeOpacity={0.7}
              disabled={editMode}
            >
              <LinearGradient
                colors={avatarColors[colorIndex] as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.memberAvatar}
              >
                <Text style={styles.memberInitial}>
                  {member.name.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <View style={styles.roleContainer}>
                  <View style={[styles.roleBadge, { backgroundColor: colors.pinkLight }]}>
                    <Text style={[styles.roleBadgeText, { color: colors.pink }]}>
                      {member.role}
                    </Text>
                  </View>
                </View>
                <View style={styles.memberContact}>
                  <Phone size={12} color={colors.textLight} />
                  <Text style={styles.memberPhone}>{member.phone}</Text>
                </View>
              </View>
              {editMode ? (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    // Handle delete member
                    alert(`Delete ${member.name}?`);
                  }}
                >
                  <Trash2 size={20} color={colors.error} strokeWidth={2.5} />
                </TouchableOpacity>
              ) : (
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>›</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {filteredMembers?.length === 0 && !isLoading && (
          <View style={styles.emptyContainer}>
            <Users size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>No members found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search term' : 'No SHG members available'}
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={!!selectedMember}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedMember(null)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#ffffff', colors.backgroundLight]}
            style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Member Details</Text>
              <TouchableOpacity 
                onPress={() => setSelectedMember(null)}
                style={styles.closeIconButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedMember && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <LinearGradient
                  colors={avatarColors[(members?.findIndex((m: SHGMember) => m.id === selectedMember.id) ?? 0) % avatarColors.length] as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.largeAvatar}
                >
                  <Text style={styles.largeInitial}>
                    {selectedMember.name.charAt(0).toUpperCase()}
                  </Text>
                </LinearGradient>

                <Text style={styles.detailName}>{selectedMember.name}</Text>

                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconContainer}>
                      <User size={18} color={colors.indigo} />
                    </View>
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Name</Text>
                      <Text style={styles.detailValue}>{selectedMember.name}</Text>
                    </View>
                  </View>

                  {selectedMember.age && (
                    <View style={styles.detailRow}>
                      <View style={styles.detailIconContainer}>
                        <UserCircle size={18} color={colors.indigo} />
                      </View>
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Age</Text>
                        <Text style={styles.detailValue}>{selectedMember.age} years</Text>
                      </View>
                    </View>
                  )}

                  {selectedMember.gender && (
                    <View style={styles.detailRow}>
                      <View style={styles.detailIconContainer}>
                        <Users size={18} color={colors.indigo} />
                      </View>
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Gender</Text>
                        <Text style={styles.detailValue}>{selectedMember.gender}</Text>
                      </View>
                    </View>
                  )}

                  {selectedMember.caste && (
                    <View style={styles.detailRow}>
                      <View style={styles.detailIconContainer}>
                        <Mail size={18} color={colors.indigo} />
                      </View>
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Caste</Text>
                        <Text style={styles.detailValue}>{selectedMember.caste}</Text>
                      </View>
                    </View>
                  )}

                  {selectedMember.aadhaar && (
                    <View style={styles.detailRow}>
                      <View style={styles.detailIconContainer}>
                        <CreditCard size={18} color={colors.indigo} />
                      </View>
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Aadhaar</Text>
                        <Text style={styles.detailValue}>
                          XXXX XXXX {selectedMember.aadhaar.slice(-4)}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.detailRow}>
                    <View style={styles.detailIconContainer}>
                      <Users size={18} color={colors.indigo} />
                    </View>
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Role in SHG</Text>
                      <Text style={styles.detailValue}>{selectedMember.role}</Text>
                    </View>
                  </View>

                  {selectedMember.trainingStatus && (
                    <View style={styles.detailRow}>
                      <View style={styles.detailIconContainer}>
                        <GraduationCap size={18} color={colors.indigo} />
                      </View>
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Training Status</Text>
                        <Text style={[styles.detailValue, {
                          color: selectedMember.trainingStatus === 'Completed' ? colors.success : 
                                 selectedMember.trainingStatus === 'In Progress' ? colors.warning : colors.textLight
                        }]}>
                          {selectedMember.trainingStatus}
                        </Text>
                      </View>
                    </View>
                  )}

                  {selectedMember.bankAccountLinked !== undefined && (
                    <View style={styles.detailRow}>
                      <View style={styles.detailIconContainer}>
                        <Wallet size={18} color={colors.indigo} />
                      </View>
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Bank Account Linked</Text>
                        <View style={styles.bankStatusContainer}>
                          <Text style={[styles.detailValue, {
                            color: selectedMember.bankAccountLinked ? colors.success : colors.error
                          }]}>
                            {selectedMember.bankAccountLinked ? 'Yes' : 'No'}
                          </Text>
                          <View style={[styles.statusDot, {
                            backgroundColor: selectedMember.bankAccountLinked ? colors.success : colors.error
                          }]} />
                        </View>
                      </View>
                    </View>
                  )}

                  <View style={styles.detailRow}>
                    <View style={styles.detailIconContainer}>
                      <Phone size={18} color={colors.indigo} />
                    </View>
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Phone</Text>
                      <Text style={styles.detailValue}>{selectedMember.phone}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailIconContainer}>
                      <Calendar size={18} color={colors.indigo} />
                    </View>
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Joined Date</Text>
                      <Text style={styles.detailValue}>
                        {new Date(selectedMember.joinedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedMember(null)}
            >
              <LinearGradient
                colors={[colors.indigo, colors.purple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.closeButtonGradient}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        visible={showAddMemberModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddMemberModal(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#ffffff', colors.backgroundLight]}
            style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Member</Text>
              <TouchableOpacity 
                onPress={() => setShowAddMemberModal(false)}
                style={styles.closeIconButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.addMemberForm} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={newMember.name}
                  onChangeText={(text) => setNewMember({...newMember, name: text})}
                  placeholder="Enter member name"
                  placeholderTextColor={colors.textLight}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.formInput}
                  value={newMember.phone}
                  onChangeText={(text) => setNewMember({...newMember, phone: text})}
                  placeholder="Enter phone number"
                  placeholderTextColor={colors.textLight}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Age</Text>
                <TextInput
                  style={styles.formInput}
                  value={newMember.age}
                  onChangeText={(text) => setNewMember({...newMember, age: text})}
                  placeholder="Enter age"
                  placeholderTextColor={colors.textLight}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Gender</Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    style={[styles.genderButton, newMember.gender === 'Male' && styles.genderButtonActive]}
                    onPress={() => setNewMember({...newMember, gender: 'Male'})}
                  >
                    <Text style={[styles.genderButtonText, newMember.gender === 'Male' && styles.genderButtonTextActive]}>
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.genderButton, newMember.gender === 'Female' && styles.genderButtonActive]}
                    onPress={() => setNewMember({...newMember, gender: 'Female'})}
                  >
                    <Text style={[styles.genderButtonText, newMember.gender === 'Female' && styles.genderButtonTextActive]}>
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Role in SHG</Text>
                <View style={styles.roleChipsContainer}>
                  {['President', 'Secretary', 'Treasurer', 'Member'].map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[styles.roleChip, newMember.role === role && styles.roleChipActive]}
                      onPress={() => setNewMember({...newMember, role})}
                    >
                      <Text style={[styles.roleChipText, newMember.role === role && styles.roleChipTextActive]}>
                        {role}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => {
                  setShowAddMemberModal(false);
                  setNewMember({ name: '', phone: '', role: 'Member', age: '', gender: 'Male' });
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  // Handle add member
                  if (newMember.name && newMember.phone) {
                    alert('Member added successfully!');
                    setShowAddMemberModal(false);
                    setNewMember({ name: '', phone: '', role: 'Member', age: '', gender: 'Male' });
                  } else {
                    alert('Please fill in required fields');
                  }
                }}
              >
                <LinearGradient
                  colors={[colors.indigo, colors.purple]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalButtonGradient}
                >
                  <Plus size={20} color="#fff" strokeWidth={2.5} />
                  <Text style={styles.modalButtonText}>Add Member</Text>
                </LinearGradient>
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
    backgroundColor: colors.backgroundLight,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 16,
    gap: 8,
    marginBottom: 14,
  },
  addMemberText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
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
  memberCountBadge: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  memberCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.indigo,
  },
  searchWrapper: {
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: colors.indigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
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
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: colors.indigo,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  memberInitial: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  memberName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  memberContact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberPhone: {
    fontSize: 13,
    color: colors.textLight,
  },
  arrowContainer: {
    marginLeft: 8,
  },
  arrow: {
    fontSize: 28,
    color: colors.textLight,
    fontWeight: '300',
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.errorBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
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
  largeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  largeInitial: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  detailName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%',
    gap: 16,
  },
  detailRow: {
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
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
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
    padding: 18,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  bankStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  addMemberForm: {
    flex: 1,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  formInput: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: colors.text,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: colors.indigoLight,
    borderColor: colors.indigo,
  },
  genderButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textLight,
  },
  genderButtonTextActive: {
    color: colors.indigo,
    fontWeight: '700',
  },
  roleChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  roleChip: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  roleChipActive: {
    backgroundColor: colors.indigoLight,
    borderColor: colors.indigo,
  },
  roleChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
  },
  roleChipTextActive: {
    color: colors.indigo,
    fontWeight: '700',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cancelModalButton: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  modalButtonGradient: {
    flexDirection: 'row',
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
