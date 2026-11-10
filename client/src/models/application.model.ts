export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Selected' | 'Rejected';

export interface StatusHistoryItem {
  status: ApplicationStatus;
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  comments?: string;
  timestamp: string;
}

export interface ApplicationDocument {
  originalName: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  uploadedAt: string;
}

export interface Application {
  _id: string;
  applicant: string | { _id: string; name: string; email: string };
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  guardianName: string;
  tenthBoard: string;
  tenthPercentage: number;
  twelfthBoard: string;
  twelfthPercentage: number;
  entranceScore?: number;
  department: string;
  document: ApplicationDocument;
  status: ApplicationStatus;
  statusHistory: StatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  total: number;
  statusCounts: {
    Submitted: number;
    'Under Review': number;
    Selected: number;
    Rejected: number;
  };
  departmentCounts: Record<string, number>;
  averages: {
    avgTenth: number;
    avgTwelfth: number;
  };
}

