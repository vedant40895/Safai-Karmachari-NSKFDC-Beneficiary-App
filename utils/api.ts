// Mock API with hardcoded data
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data
const mockNotifications = [
  {
    id: '1',
    title: 'New Scheme Available',
    message: 'NSKFDC has launched a new skill development scheme. Check eligibility and apply now.',
    type: 'info' as const,
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'EMI Due Reminder',
    message: 'Your loan EMI of ₹5,000 is due on 15th December 2025.',
    type: 'warning' as const,
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Application Approved',
    message: 'Your scheme application #12345 has been approved. Disbursement will be processed soon.',
    type: 'success' as const,
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const mockProjects = [
  {
    id: '1',
    name: 'Sanitation Equipment Purchase',
    status: 'active' as const,
    loanSanctioned: 200000,
    disbursed: 150000,
    startDate: '2024-06-01',
  },
  {
    id: '2',
    name: 'Waste Management Training',
    status: 'completed' as const,
    loanSanctioned: 50000,
    disbursed: 50000,
    startDate: '2024-01-15',
  },
  {
    id: '3',
    name: 'Community Toilet Facility',
    status: 'pending' as const,
    loanSanctioned: 500000,
    disbursed: 0,
    startDate: '2025-01-01',
  },
];

const mockSchemes = [
  {
    id: '1',
    name: 'Self Employment Scheme',
    description: 'Financial assistance for starting own sanitation-related business',
    eligibility: ['Must be from Safai Karmachari community', 'Age 18-55 years', 'Valid Aadhaar card'],
    benefits: 'Up to ₹5,00,000 loan with subsidized interest rate',
    category: 'Self Employment',
  },
  {
    id: '2',
    name: 'Skill Development Training',
    description: 'Free training in modern sanitation technologies and equipment handling',
    eligibility: ['Member of registered SHG', 'Minimum 8th standard education'],
    benefits: 'Free training, certification, and placement assistance',
    category: 'Training',
  },
  {
    id: '3',
    name: 'Housing Assistance',
    description: 'Financial support for housing construction or renovation',
    eligibility: ['Annual income below ₹3,00,000', 'Does not own pucca house'],
    benefits: 'Up to ₹2,00,000 subsidy',
    category: 'Housing',
  },
];

const mockSHGMembers = [
  {
    id: '1',
    name: 'Raj Verma',
    phone: '9876543210',
    role: 'President',
    joinedDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Sunita Devi',
    phone: '9876543211',
    role: 'Secretary',
    joinedDate: '2023-01-15',
  },
  {
    id: '3',
    name: 'Vijay Singh',
    phone: '9876543212',
    role: 'Treasurer',
    joinedDate: '2023-02-01',
  },
  {
    id: '4',
    name: 'Geeta Sharma',
    phone: '9876543213',
    role: 'Member',
    joinedDate: '2023-03-10',
  },
  {
    id: '5',
    name: 'Nikhil Sharma',
    phone: '9876543214',
    role: 'Member',
    joinedDate: '2023-03-10',
  },
];

const mockLoans = [
  {
    id: 'L001',
    amount: 200000,
    disbursed: 150000,
    balance: 120000,
    interestRate: 4.5,
    emi: 5000,
    nextDueDate: '2025-12-15',
  },
  {
    id: 'L002',
    amount: 50000,
    disbursed: 50000,
    balance: 15000,
    interestRate: 5.0,
    emi: 2500,
    nextDueDate: '2025-12-20',
  },
];

const mockComplaints = [
  {
    id: 'C001',
    category: 'Payment Delay',
    description: 'Salary not received for the last 2 months',
    status: 'in-progress' as const,
    anonymous: false,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'C002',
    category: 'Safety Equipment',
    description: 'Need proper safety gear for sanitation work',
    status: 'resolved' as const,
    anonymous: false,
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const mockTrainingModules = [
  {
    id: 'T001',
    title: 'Introduction to Modern Sanitation',
    description: 'Learn about modern sanitation practices and equipment',
    duration: '45 mins',
    completed: true,
    videoUrl: 'https://example.com/video1',
    certificateUrl: 'https://example.com/cert1',
  },
  {
    id: 'T002',
    title: 'Safety Standards and Protocols',
    description: 'Understanding safety measures and protective equipment',
    duration: '1 hour',
    completed: true,
    videoUrl: 'https://example.com/video2',
  },
  {
    id: 'T003',
    title: 'Financial Literacy',
    description: 'Managing finances and understanding loan processes',
    duration: '30 mins',
    completed: false,
    videoUrl: 'https://example.com/video3',
  },
];

const mockAttendance = [
  {
    id: 'A001',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:00 AM',
    checkOut: '05:00 PM',
    workType: 'Regular Duty',
    location: { latitude: 28.6139, longitude: 77.2090 },
  },
  {
    id: 'A002',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    checkIn: '09:15 AM',
    checkOut: '05:30 PM',
    workType: 'Regular Duty',
    location: { latitude: 28.6139, longitude: 77.2090 },
  },
  {
    id: 'A003',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    checkIn: '09:00 AM',
    checkOut: '05:00 PM',
    workType: 'Overtime',
    location: { latitude: 28.6139, longitude: 77.2090 },
  },
];

export const api = {
  auth: {
    sendOTP: async (phone: string) => {
      await delay(500);
      return { success: true, message: 'OTP sent successfully' };
    },
    verifyOTP: async (phone: string, otp: string) => {
      await delay(500);
      return {
        token: 'mock-token-123',
        user: {
          id: '1',
          name: 'Test User',
          phone,
          email: 'test@example.com',
          bankLinked: true,
        },
      };
    },
  },

  user: {
    getProfile: async () => {
      await delay(300);
      return {
        id: '1',
        name: 'Test User',
        phone: '1234567890',
        email: 'test@example.com',
        address: 'Kolkata',
        bankLinked: true,
      };
    },
    updateProfile: async (data: any) => {
      await delay(500);
      return { success: true, message: 'Profile updated successfully' };
    },
  },

  shg: {
    getMembers: async () => {
      await delay(300);
      return mockSHGMembers;
    },
  },

  projects: {
    getList: async () => {
      await delay(300);
      return mockProjects;
    },
    getDetails: async (id: string) => {
      await delay(300);
      return mockProjects.find(p => p.id === id) || mockProjects[0];
    },
  },

  schemes: {
    getList: async () => {
      await delay(300);
      return mockSchemes;
    },
    apply: async (formData: FormData) => {
      await delay(800);
      return { success: true, applicationId: 'APP' + Date.now(), message: 'Application submitted successfully' };
    },
  },

  finance: {
    getLoans: async () => {
      await delay(300);
      return mockLoans;
    },
    getTransactions: async () => {
      await delay(300);
      return [];
    },
  },

  complaints: {
    submit: async (formData: FormData) => {
      await delay(800);
      return { success: true, complaintId: 'C' + Date.now(), message: 'Complaint submitted successfully' };
    },
    getList: async () => {
      await delay(300);
      return mockComplaints;
    },
    escalate: async (id: string) => {
      await delay(500);
      return { success: true, message: 'Complaint escalated successfully' };
    },
  },

  training: {
    getModules: async () => {
      await delay(300);
      return mockTrainingModules;
    },
    markComplete: async (moduleId: string) => {
      await delay(500);
      return { success: true, message: 'Module marked as complete' };
    },
  },

  attendance: {
    checkIn: async (data: any) => {
      await delay(500);
      return { success: true, message: 'Checked in successfully', record: { id: 'A' + Date.now(), ...data } };
    },
    checkOut: async (data: any) => {
      await delay(500);
      return { success: true, message: 'Checked out successfully' };
    },
    getHistory: async () => {
      await delay(300);
      return mockAttendance;
    },
  },

  notifications: {
    getList: async () => {
      await delay(300);
      return mockNotifications;
    },
    markRead: async (id: string) => {
      await delay(200);
      const notification = mockNotifications.find(n => n.id === id);
      if (notification) {
        notification.read = true;
      }
      return { success: true };
    },
  },
};
