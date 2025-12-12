import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { Loan } from '@/types';
import { DollarSign, Calendar, TrendingDown } from 'lucide-react-native';

export default function FinanceScreen() {
  const {
    data: loans,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['loans'],
    queryFn: api.finance.getLoans,
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'My Finances', headerShown: true }} />

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}

      {error && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load financial data</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Loans & Disbursements</Text>

        {loans?.map((loan: Loan) => (
          <View key={loan.id} style={styles.loanCard}>
            <View style={styles.loanHeader}>
              <View style={styles.iconContainer}>
                <DollarSign size={24} color="#000" />
              </View>
              <View style={styles.loanHeaderInfo}>
                <Text style={styles.loanId}>Loan ID: {loan.id}</Text>
                <Text style={styles.loanAmount}>
                  ₹{loan.amount.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.loanDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Disbursed Amount</Text>
                <Text style={styles.detailValue}>
                  ₹{loan.disbursed.toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Outstanding Balance</Text>
                <Text style={styles.detailValueHighlight}>
                  ₹{loan.balance.toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Interest Rate</Text>
                <Text style={styles.detailValue}>{loan.interestRate}% p.a.</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Monthly EMI</Text>
                <Text style={styles.detailValue}>
                  ₹{loan.emi.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            <View style={styles.nextDue}>
              <Calendar size={16} color="#666" />
              <Text style={styles.nextDueText}>
                Next Due: {new Date(loan.nextDueDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}

        {loans?.length === 0 && !isLoading && (
          <Text style={styles.emptyText}>No loans found</Text>
        )}

        <View style={styles.repaymentSection}>
          <Text style={styles.sectionTitle}>Repayment Schedule</Text>
          <View style={styles.infoCard}>
            <TrendingDown size={24} color="#666" />
            <Text style={styles.infoText}>
              View your complete repayment schedule and transaction history in
              the portal
            </Text>
          </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  loanCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  loanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  loanHeaderInfo: {
    flex: 1,
  },
  loanId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  loanAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  loanDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  detailValueHighlight: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  nextDue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  nextDueText: {
    fontSize: 13,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 24,
  },
  repaymentSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});
