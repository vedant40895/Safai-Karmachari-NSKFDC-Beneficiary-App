import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { colors } from '@/styles/colors';
import { TrainingModule } from '@/types';
import {
  Play,
  CheckCircle,
  Clock,
  Download,
  X,
  Award,
  ArrowLeft,
  GraduationCap,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const MOCK_QUIZ = {
  questions: [
    {
      id: 1,
      question: 'What is the primary goal of this training module?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: 0,
    },
    {
      id: 2,
      question: 'Which safety equipment is mandatory?',
      options: ['Gloves', 'Helmet', 'Boots', 'All of the above'],
      correct: 3,
    },
  ],
};

export default function TrainingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(
    null
  );
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const {
    data: modules,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['training-modules'],
    queryFn: api.training.getModules,
  });

  const completeMutation = useMutation({
    mutationFn: (moduleId: string) => api.training.markComplete(moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-modules'] });
      Alert.alert('Success', 'Module marked as complete!');
    },
  });

  const handleWatch = (module: TrainingModule) => {
    setSelectedModule(module);
  };

  const handleTakeQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizCompleted(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < MOCK_QUIZ.questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => {
        setQuizCompleted(true);
        if (selectedModule) {
          completeMutation.mutate(selectedModule.id);
        }
      }, 300);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === MOCK_QUIZ.questions[index].correct) {
        correct++;
      }
    });
    return (correct / MOCK_QUIZ.questions.length) * 100;
  };

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
          <View>
            <Text style={styles.subtitle}>Skill Development</Text>
            <Text style={styles.title}>Training Modules</Text>
          </View>
          <View style={styles.iconContainer}>
            <GraduationCap size={32} color="#fff" strokeWidth={2.5} />
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
            <Text style={styles.errorText}>Failed to load training modules</Text>
            <Text style={styles.errorSubtext}>Please try again later</Text>
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: Math.max(insets.bottom, 24) + 24 }]}
      >
        {modules?.map((module: TrainingModule) => (
          <View key={module.id} style={styles.moduleCard}>
            <View style={styles.moduleHeader}>
              <View style={styles.moduleStatusIcon}>
                {module.completed ? (
                  <CheckCircle size={26} color={colors.success} strokeWidth={2.5} />
                ) : (
                  <Clock size={26} color={colors.indigo} strokeWidth={2.5} />
                )}
              </View>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleDuration}>{module.duration}</Text>
              </View>
            </View>

            <Text style={styles.moduleDescription} numberOfLines={2}>
              {module.description}
            </Text>

            <View style={styles.moduleActions}>
              {module.videoUrl && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleWatch(module)}
                >
                  <Play size={18} color="#000" />
                  <Text style={styles.actionButtonText}>Watch</Text>
                </TouchableOpacity>
              )}

              {!module.completed && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    setSelectedModule(module);
                    handleTakeQuiz();
                  }}
                >
                  <Award size={18} color="#000" />
                  <Text style={styles.actionButtonText}>Take Quiz</Text>
                </TouchableOpacity>
              )}

              {module.completed && module.certificateUrl && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.downloadButton]}
                  onPress={() => {
                    Alert.alert(
                      'Download',
                      'Certificate download functionality'
                    );
                  }}
                >
                  <Download size={18} color="#fff" />
                  <Text style={[styles.actionButtonText, styles.downloadText]}>
                    Certificate
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {module.completed && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>✓ Completed</Text>
              </View>
            )}
          </View>
        ))}

        {modules?.length === 0 && !isLoading && (
          <Text style={styles.emptyText}>No training modules available</Text>
        )}
      </ScrollView>

      <Modal
        visible={showQuiz}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQuiz(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {!quizCompleted ? (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Quiz</Text>
                  <TouchableOpacity onPress={() => setShowQuiz(false)}>
                    <X size={24} color="#000" />
                  </TouchableOpacity>
                </View>

                <View style={styles.quizProgress}>
                  <Text style={styles.progressText}>
                    Question {currentQuestion + 1} of{' '}
                    {MOCK_QUIZ.questions.length}
                  </Text>
                </View>

                <Text style={styles.questionText}>
                  {MOCK_QUIZ.questions[currentQuestion].question}
                </Text>

                <View style={styles.optionsContainer}>
                  {MOCK_QUIZ.questions[currentQuestion].options.map(
                    (option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.optionButton}
                        onPress={() => handleAnswerSelect(index)}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </>
            ) : (
              <View style={styles.resultContainer}>
                <Award size={64} color="#000" />
                <Text style={styles.resultTitle}>Quiz Completed!</Text>
                <Text style={styles.resultScore}>
                  Score: {calculateScore().toFixed(0)}%
                </Text>
                <Text style={styles.resultMessage}>
                  {calculateScore() >= 70
                    ? 'Congratulations! You passed the quiz.'
                    : 'Please review the module and try again.'}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setShowQuiz(false);
                    setSelectedModule(null);
                  }}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
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
  moduleCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  moduleStatusIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.indigoLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  moduleInfo: {
    flex: 1,
    paddingRight: 100,
  },
  moduleTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  moduleDuration: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  moduleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 16,
  },
  moduleActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: colors.indigoLight,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.indigo,
  },
  downloadButton: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.indigo,
  },
  downloadText: {
    color: '#fff',
  },
  completedBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: colors.success,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  completedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textLight,
    fontSize: 15,
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  quizProgress: {
    marginBottom: 28,
  },
  progressText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  questionText: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 28,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 14,
  },
  optionButton: {
    padding: 18,
    backgroundColor: colors.indigoLight,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.indigo,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  resultContainer: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.success,
    marginBottom: 20,
  },
  resultMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  closeButton: {
    backgroundColor: colors.indigo,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: colors.indigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
