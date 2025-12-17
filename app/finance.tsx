import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { colors } from '@/styles/colors';
import { Loan } from '@/types';
import { DollarSign, Calendar, TrendingDown, ArrowLeft, Wallet, CreditCard, Package, Users, IndianRupee, CheckCircle, Plus, Edit } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function FinanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    data: loans,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['loans'],
    queryFn: api.finance.getLoans,
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.indigo, colors.purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 20, paddingBottom: 40 }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.subtitle}>Financial Overview</Text>
            <Text style={styles.title}>My Finances</Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.manualEntryButton}
              onPress={() => router.push('/finance/manual-entry' as any)}
            >
              <Plus size={20} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <Wallet size={28} color="#fff" strokeWidth={2.5} />
            </View>
          </View>
        </View>
      </LinearGradient>

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.indigo} />
        </View>
      )}

      {error && (
        <View style={styles.centerContainer}>
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>Failed to load financial data</Text>
            <Text style={styles.errorSubtext}>Please try again later</Text>
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: Math.max(insets.bottom, 24) + 24 }]}
      >

        {loans?.map((loan: Loan) => (
          <View key={loan.id} style={styles.loanCard}>
            <View style={styles.loanHeader}>
              <LinearGradient
                colors={[colors.indigo, colors.purple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.loanIconContainer}
              >
                <CreditCard size={26} color="#fff" strokeWidth={2.5} />
              </LinearGradient>
              <View style={styles.loanHeaderInfo}>
                <Text style={styles.loanId}>Loan ID: {loan.id}</Text>
                <Text style={styles.loanAmount}>
                  ₹{loan.amount.toLocaleString('en-IN')}
                </Text>
                <Text style={styles.loanSubtitle}>Loan Sanctioned</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.loanDetails}>
              <View style={styles.detailRowWithIcon}>
                <View style={styles.detailIconBadge}>
                  <IndianRupee size={16} color={colors.green} strokeWidth={2.5} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Amount Received</Text>
                  <Text style={styles.detailValue}>
                    ₹{loan.disbursed.toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>

              {loan.assetsDeployed && (
                <View style={styles.detailRowWithIcon}>
                  <View style={styles.detailIconBadge}>
                    <Package size={16} color={colors.purple} strokeWidth={2.5} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Assets Deployed</Text>
                    <Text style={styles.detailValue}>{loan.assetsDeployed}</Text>
                  </View>
                </View>
              )}

              {loan.manpowerUtilized !== undefined && (
                <View style={styles.detailRowWithIcon}>
                  <View style={styles.detailIconBadge}>
                    <Users size={16} color={colors.indigo} strokeWidth={2.5} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Manpower Utilized</Text>
                    <Text style={styles.detailValue}>{loan.manpowerUtilized} Members</Text>
                  </View>
                </View>
              )}

              {loan.salaryPaid !== undefined && (
                <View style={styles.detailRowWithIcon}>
                  <View style={styles.detailIconBadge}>
                    <Wallet size={16} color={colors.cyan} strokeWidth={2.5} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Salary Paid to Members</Text>
                    <Text style={styles.detailValue}>
                      ₹{loan.salaryPaid.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.detailRowWithIcon}>
                <View style={styles.detailIconBadge}>
                  <TrendingDown size={16} color={colors.indigo} strokeWidth={2.5} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Balance Loan</Text>
                  <Text style={styles.detailValueHighlight}>
                    ₹{loan.balance.toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRowWithIcon}>
                <View style={styles.detailIconBadge}>
                  <DollarSign size={16} color={colors.warning} strokeWidth={2.5} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Monthly EMI</Text>
                  <Text style={styles.detailValue}>
                    ₹{loan.emi.toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>

              {loan.bankLinked !== undefined && (
                <View style={styles.bankStatusRow}>
                  <View style={styles.detailIconBadge}>
                    <CreditCard size={16} color={loan.bankLinked ? colors.success : colors.error} strokeWidth={2.5} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Bank Linked</Text>
                    <View style={styles.bankStatusContainer}>
                      <Text style={[styles.detailValue, { color: loan.bankLinked ? colors.success : colors.error }]}>
                        {loan.bankLinked ? 'Yes' : 'No'}
                      </Text>
                      <View style={[styles.statusDot, { backgroundColor: loan.bankLinked ? colors.success : colors.error }]} />
                    </View>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.nextDue}>
              <Calendar size={16} color={colors.warningText} strokeWidth={2.5} />
              <Text style={styles.nextDueText}>
                Next Due: {new Date(loan.nextDueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>

            {loan.repaymentSchedule && loan.repaymentSchedule.length > 0 && (
              <TouchableOpacity
                style={styles.viewScheduleButton}
                onPress={() => {
                  // Navigate to repayment schedule detail
                  alert('View detailed repayment schedule');
                }}
              >
                <Text style={styles.viewScheduleText}>View Repayment Schedule</Text>
                <TrendingDown size={16} color={colors.indigo} strokeWidth={2.5} />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {loans?.length === 0 && !isLoading && (
          <View style={styles.emptyContainer}>
            <Wallet size={48} color={colors.textLight} strokeWidth={2} />
            <Text style={styles.emptyText}>No loans found</Text>
            <Text style={styles.emptySubtext}>Your loan information will appear here</Text>
          </View>
        )}

        {loans && loans.length > 0 && (
          <View style={styles.repaymentSection}>
            <Text style={styles.sectionTitle}>Repayment Schedule</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <TrendingDown size={22} color={colors.indigo} strokeWidth={2} />
              </View>
              <Text style={styles.infoText}>
                View your complete repayment schedule and transaction history in the portal
              </Text>
            </View>
          </View>
        )}
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
    // borderBottomLeftRadius: 32,
    // borderBottomRightRadius: 32,
    shadowColor: colors.indigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  manualEntryButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginBottom: 4,
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textLight,
  },
  loanCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  loanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loanIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  loanHeaderInfo: {
    flex: 1,
  },
  loanId: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
    marginBottom: 4,
  },
  loanAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  loanSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 16,
  },
  loanDetails: {
    gap: 14,
  },
  detailRowWithIcon: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  detailContent: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
  },
  bankStatusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingTop: 6,
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
  viewScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: colors.indigoLight,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.indigo,
  },
  viewScheduleText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.indigo,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    flexWrap: 'wrap',
  },
  detailValueHighlight: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.indigo,
  },
  nextDue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    paddingTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.warningBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  nextDueText: {
    fontSize: 14,
    color: colors.warningText,
    fontWeight: '600',
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
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
  },
  repaymentSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.indigoLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
