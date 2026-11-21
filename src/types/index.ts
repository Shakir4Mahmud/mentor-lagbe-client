export type Tuition = {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: string;
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: string;
  isActive: boolean;
  createdAt: string;
  ratingAverage?: number;
  ratingCount?: number;
};

export type TuitionListResponse = {
  tuitions: Tuition[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TutorInfo = {
  name: string;
  email: string;
  bio: string;
  image: string;
  plan: string;
  totalTuitions: number;
};

export type Review = {
  _id: string;
  studentName: string;
  studentImage: string;
  rating: number;
  review: string;
  reviewedAt: string;
};

export type RatingSummary = {
  average: number;
  count: number;
  distribution: number[];
};

export type TuitionDetailsResponse = {
  tuition: Tuition;
  tutor: TutorInfo;
  reviews: Review[];
  rating: RatingSummary;
};

export type Application = {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  tutorEmail: string;
  tutorName: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
  status: string;
  appliedAt: string;
  rating?: number;
  review?: string;
  reviewedAt?: string;
};

export type StudentStats = {
  total: number;
  accepted: number;
  pending: number;
  rejected: number;
  plan: string;
};

export type SubjectCount = {
  name: string;
  count: number;
};

export type PublicStats = {
  totalTutors: number;
  totalStudents: number;
  totalTuitions: number;
  totalSubjects: number;
  subjects: SubjectCount[];
};

export type MyTuition = Tuition & {
  applicantCount: number;
};

export type TutorStats = {
  totalPosted: number;
  live: number;
  approved: number;
  pending: number;
  rejected: number;
  totalApplicants: number;
  applicationStatus: {
    pending: number;
    accepted: number;
    rejected: number;
  };
  weekly: { date: string; count: number }[];
  topTuitions: { title: string; count: number }[];
  recent: {
    _id: string;
    studentName: string;
    tuitionTitle: string;
    status: string;
    appliedAt: string;
  }[];
  plan: string;
  postLimit: number | null;
};

export type ReceivedApplication = {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
  status: string;
  appliedAt: string;
  studentImage: string;
};

export type AdminStats = {
  totalUsers: number;
  totalStudents: number;
  totalTutors: number;
  totalAdmins: number;
  proUsers: number;
  approved: number;
  pending: number;
  rejected: number;
  revenue: number;
  transactions: number;
  weekly: { date: string; count: number }[];
  pendingList: {
    _id: string;
    title: string;
    tutorName: string;
    createdAt: string;
  }[];
  recentUsers: {
    _id: string;
    name: string;
    email: string;
    role: string;
    image: string;
    createdAt: string;
  }[];
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  plan: string;
  phone: string;
  createdAt: string;
};

export type Payment = {
  _id: string;
  userEmail: string;
  userName: string;
  userRole: string;
  planName: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: string;
  paidAt: string;
};

export type TransactionsResponse = {
  payments: Payment[];
  totalRevenue: number;
  totalTransactions: number;
  studentCount: number;
  tutorCount: number;
};