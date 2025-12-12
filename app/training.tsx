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
} from 'react-native';
import { Stack } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { TrainingModule } from '@/types';
import {
  Play,
  CheckCircle,
  Clock,
  Download,
  X,
  Award,
} from 'lucide-react-native';

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
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Training', headerShown: true }} />

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}

      {error && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load training modules</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Training Modules</Text>

        {modules?.map((module: TrainingModule) => (
          <View key={module.id} style={styles.moduleCard}>
            <View style={styles.moduleHeader}>
              <View style={styles.iconContainer}>
                {module.completed ? (
                  <CheckCircle size={24} color="#4caf50" />
                ) : (
                  <Clock size={24} color="#666" />
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
  moduleCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  moduleHeader: {
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
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  moduleDuration: {
    fontSize: 12,
    color: '#666',
  },
  moduleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  moduleActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  downloadButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  downloadText: {
    color: '#fff',
  },
  completedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#4caf50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
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
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    maxHeight: '80%',
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
  quizProgress: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 24,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 15,
    color: '#000',
  },
  resultContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  resultScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  resultMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  closeButton: {
    backgroundColor: '#000',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
