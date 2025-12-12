export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  aadhaar?: string;
  shgId?: string;
  address?: string;
  bankLinked: boolean;
}

export interface SHGMember {
  id: string;
  name: string;
  phone: string;
  role: string;
  joinedDate: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'pending';
  loanSanctioned: number;
  disbursed: number;
  startDate: string;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibility: string[];
  benefits: string;
  category: string;
}

export interface SchemeApplication {
  schemeId: string;
  applicantName: string;
  phone: string;
  aadhaar: string;
  documents: any[];
}

export interface Loan {
  id: string;
  amount: number;
  disbursed: number;
  balance: number;
  interestRate: number;
  emi: number;
  nextDueDate: string;
}

export interface Complaint {
  id: string;
  category: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  anonymous: boolean;
  createdAt: string;
  updatedAt: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  media?: string[];
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: string;
  completed: boolean;
  certificateUrl?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  workType: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface PendingSync {
  id: string;
  type: 'attendance' | 'complaint';
  data: any;
  timestamp: string;
}
