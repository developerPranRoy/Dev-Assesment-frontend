// ===== Enums (mirror backend Prisma enums) =====
export type Role = "CANDIDATE" | "COMPANY" | "ADMIN";
export type AuthProvider = "LOCAL" | "GOOGLE";
export type PermissionLevel = "OWNER" | "CREATOR" | "EVALUATOR";
export type ProblemType = "CODING" | "MCQ" | "WRITTEN";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type AssessmentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED";
export type AttemptStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "EVALUATED"
  | "EXPIRED";
export type SubmissionStatus = "PENDING" | "EVALUATED";
export type PaymentProvider = "SSLCOMMERZ" | "BKASH" | "STRIPE";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

// ===== API response wrappers =====
export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: unknown[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ===== Auth / User =====
export interface User {
  id: string;
  email: string;
  provider?: AuthProvider;
  googleId?: string | null;
  role: Role;
  name: string;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  resumeUrl?: string | null;
  skills: string[];
  experienceLevel?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Extract<Role, "CANDIDATE" | "COMPANY">;
}

export interface UpdateProfileInput {
  name?: string;
  avatarUrl?: string;
}

// ===== Company =====
export interface Company {
  id: string;
  name: string;
  ownerId: string;
  credits: number;
  createdAt?: string;
  updatedAt?: string;
  members?: CompanyMember[];
}

export interface CompanyMember {
  id: string;
  companyId: string;
  userId: string;
  permissionLevel: PermissionLevel;
  createdAt?: string;
  user?: Pick<User, "id" | "name" | "email" | "avatarUrl">;
}

export interface CreateCompanyInput {
  name: string;
}

export interface AddMemberInput {
  email: string;
  permissionLevel: Exclude<PermissionLevel, "OWNER">;
}

// ===== Problem =====
export interface Problem {
  id: string;
  companyId: string;
  type: ProblemType;
  title: string;
  statement: string;
  difficulty: Difficulty;
  tags: string[];
  points: number;
  testCases?: TestCase[] | null;
  options?: string[] | null;
  correctAnswer?: string | null;
  createdById: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface CreateProblemInput {
  type: ProblemType;
  title: string;
  statement: string;
  difficulty: Difficulty;
  tags?: string[];
  points?: number;
  testCases?: TestCase[];
  options?: string[];
  correctAnswer?: string;
}

export type UpdateProblemInput = Partial<CreateProblemInput>;

export interface ProblemListParams {
  page?: number;
  limit?: number;
  type?: ProblemType;
  difficulty?: Difficulty;
}

// ===== Assessment =====
export interface Assessment {
  id: string;
  companyId: string;
  title: string;
  description?: string | null;
  status: AssessmentStatus;
  durationMinutes: number;
  passingScore: number;
  createdById: string;
  createdAt?: string;
  updatedAt?: string;
  problems?: AssessmentProblem[];
  attempts?: Attempt[];
}

export interface AssessmentProblem {
  id: string;
  assessmentId: string;
  problemId: string;
  order: number;
  points: number;
  problem?: Problem;
}

export interface CreateAssessmentInput {
  title: string;
  description?: string;
  durationMinutes: number;
  passingScore: number;
}

export type UpdateAssessmentInput = Partial<CreateAssessmentInput>;

export interface AddProblemToAssessmentInput {
  problemId: string;
  order: number;
  points: number;
}

export interface AssessmentListParams {
  page?: number;
  limit?: number;
  status?: AssessmentStatus;
}

// ===== Invitation =====
export interface Invitation {
  id: string;
  assessmentId: string;
  candidateEmail: string;
  token: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt?: string;
}

export interface InviteCandidatesInput {
  emails: string[];
}

// ===== Attempt =====
export interface Attempt {
  id: string;
  assessmentId: string;
  candidateId: string;
  status: AttemptStatus;
  startedAt?: string | null;
  submittedAt?: string | null;
  score?: number | null;
  flaggedEvents?: FlaggedEvent[] | null;
  createdAt?: string;
  updatedAt?: string;
  assessment?: Assessment;
  submissions?: Submission[];
}

export interface FlaggedEvent {
  event: string;
  timestamp: string;
}

// ===== Submission =====
export interface Submission {
  id: string;
  attemptId: string;
  problemId: string;
  answer: unknown;
  status: SubmissionStatus;
  autoScore?: number | null;
  manualScore?: number | null;
  evaluatedById?: string | null;
  evaluatedAt?: string | null;
  createdAt?: string;
  problem?: Problem;
}

export interface SubmitAnswerInput {
  problemId: string;
  answer: string;
  languageId?: number;
}

export interface AttemptScore {
  status: AttemptStatus;
  score: number;
}

export interface EvaluateSubmissionInput {
  manualScore: number;
}

// ===== Payment =====
export interface Payment {
  id: string;
  companyId: string;
  provider: PaymentProvider;
  transactionId: string;
  amount: number;
  currency: string;
  creditsGranted?: number | null;
  status: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface InitiatePaymentInput {
  credits: number;
}

export interface InitiatePaymentResponse {
  payment: Payment;
  checkoutUrl: string;
}

// ===== Admin =====
export interface AdminDashboardStats {
  totalUsers: number;
  totalCompanies: number;
  totalAssessments: number;
  totalAttempts: number;
  completedPayments: number;
}

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  role?: Role;
}

export interface AuditLog {
  id: string;
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  actor?: Pick<User, "id" | "name" | "email"> | null;
}

export interface ChangeUserRoleInput {
  role: Role;
}

// ===== Generic paginated list =====
export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}
