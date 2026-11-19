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

export type TuitionDetailsResponse = {
  tuition: Tuition;
  tutor: TutorInfo;
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