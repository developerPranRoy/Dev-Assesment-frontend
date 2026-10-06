import { api, BASE_URL } from "@/lib/api-client";
import type {
  ApiSuccess,
  Assessment,
  AssessmentListParams,
  AssessmentStatus,
  Attempt,
  AttemptScore,
  AuditLog,
  AuthResponse,
  AdminDashboardStats,
  AddMemberInput,
  AddProblemToAssessmentInput,
  ChangeUserRoleInput,
  Company,
  CreateAssessmentInput,
  CreateCompanyInput,
  CreateProblemInput,
  EvaluateSubmissionInput,
  InitiatePaymentInput,
  InitiatePaymentResponse,
  Invitation,
  InviteCandidatesInput,
  Paginated,
  Payment,
  Problem,
  ProblemListParams,
  RegisterInput,
  Submission,
  SubmitAnswerInput,
  UpdateAssessmentInput,
  UpdateProblemInput,
  UpdateProfileInput,
  User,
} from "@/types";

export interface ListResult<T> {
  data: T[];
  meta: Paginated<T>["meta"];
}

function unwrap<T>(res: { data: ApiSuccess<T> }): T {
  return res.data.data;
}

function unwrapList<T>(res: {
  data: ApiSuccess<T[]>;
}): ListResult<T> {
  return { data: res.data.data, meta: res.data.meta ?? { page: 1, limit: 10, total: 0, totalPages: 0 } };
}

// ===== Auth =====
export const authApi = {
  register: (input: RegisterInput) =>
    api.post<ApiSuccess<AuthResponse>>("/auth/register", input).then(unwrap),
  login: (email: string, password: string) =>
    api.post<ApiSuccess<AuthResponse>>("/auth/login", { email, password }).then(unwrap),
  refresh: (refreshToken: string) =>
    api
      .post<ApiSuccess<{ accessToken: string }>>("/auth/refresh-token", { refreshToken })
      .then(unwrap),
  logout: () => api.post<ApiSuccess<null>>("/auth/logout").then(unwrap),
  me: () => api.get<ApiSuccess<User>>("/auth/me").then(unwrap),
  updateProfile: (input: UpdateProfileInput) =>
    api.patch<ApiSuccess<User>>("/auth/me", input).then(unwrap),
  googleLoginUrl: () => `${BASE_URL}/auth/google`,
  exchangeGoogleCode: (code: string) =>
    api.post<ApiSuccess<AuthResponse>>("/auth/google/exchange", { code }).then(unwrap),
};

// ===== Companies =====
export const companyApi = {
  create: (input: CreateCompanyInput) =>
    api.post<ApiSuccess<Company>>("/companies", input).then(unwrap),
  get: (id: string) => api.get<ApiSuccess<Company>>(`/companies/${id}`).then(unwrap),
  addMember: (id: string, input: AddMemberInput) =>
    api.post<ApiSuccess<Company>>(`/companies/${id}/members`, input).then(unwrap),
};

// ===== Problems =====
export const problemApi = {
  create: (input: CreateProblemInput) =>
    api.post<ApiSuccess<Problem>>("/problems", input).then(unwrap),
  list: (params: ProblemListParams = {}) =>
    api
      .get<ApiSuccess<Problem[]>>("/problems", { params })
      .then(unwrapList) as Promise<ListResult<Problem>>,
  search: (q: string) =>
    api
      .get<ApiSuccess<Problem[]>>("/problems/search", { params: { q } })
      .then(unwrapList) as Promise<ListResult<Problem>>,
  get: (id: string) => api.get<ApiSuccess<Problem>>(`/problems/${id}`).then(unwrap),
  update: (id: string, input: UpdateProblemInput) =>
    api.patch<ApiSuccess<Problem>>(`/problems/${id}`, input).then(unwrap),
  delete: (id: string) => api.delete<ApiSuccess<null>>(`/problems/${id}`).then(unwrap),
};

// ===== Assessments =====
export const assessmentApi = {
  create: (input: CreateAssessmentInput) =>
    api.post<ApiSuccess<Assessment>>("/assessments", input).then(unwrap),
  list: (params: AssessmentListParams = {}) =>
    api
      .get<ApiSuccess<Assessment[]>>("/assessments", { params })
      .then(unwrapList) as Promise<ListResult<Assessment>>,
  get: (id: string) =>
    api.get<ApiSuccess<Assessment>>(`/assessments/${id}`).then(unwrap),
  update: (id: string, input: UpdateAssessmentInput) =>
    api.patch<ApiSuccess<Assessment>>(`/assessments/${id}`, input).then(unwrap),
  delete: (id: string) =>
    api.delete<ApiSuccess<null>>(`/assessments/${id}`).then(unwrap),
  addProblem: (id: string, input: AddProblemToAssessmentInput) =>
    api
      .post<ApiSuccess<Assessment>>(`/assessments/${id}/problems`, input)
      .then(unwrap),
  changeStatus: (id: string, status: AssessmentStatus) =>
    api
      .patch<ApiSuccess<Assessment>>(`/assessments/${id}/status`, { status })
      .then(unwrap),
};

// ===== Invitations =====
export const invitationApi = {
  invite: (assessmentId: string, input: InviteCandidatesInput) =>
    api
      .post<ApiSuccess<Invitation[]>>(`/assessments/${assessmentId}/invitations`, input)
      .then(unwrap),
  list: (assessmentId: string) =>
    api
      .get<ApiSuccess<Invitation[]>>(`/assessments/${assessmentId}/invitations`)
      .then(unwrap),
  accept: (token: string) =>
    api.post<ApiSuccess<Invitation>>(`/invitations/${token}/accept`).then(unwrap),
};

// ===== Attempts =====
export const attemptApi = {
  start: (assessmentId: string) =>
    api.post<ApiSuccess<Attempt>>(`/assessments/${assessmentId}/attempts/start`).then(unwrap),
  get: (id: string) => api.get<ApiSuccess<Attempt>>(`/attempts/${id}`).then(unwrap),
  heartbeat: (id: string, event: string) =>
    api.patch<ApiSuccess<null>>(`/attempts/${id}/heartbeat`, { event }).then(unwrap),
  submit: (id: string) =>
    api.post<ApiSuccess<Attempt>>(`/attempts/${id}/submit`).then(unwrap),
  myHistory: () => api.get<ApiSuccess<Attempt[]>>("/attempts/my-history").then(unwrap),
};

// ===== Submissions =====
export const submissionApi = {
  submitAnswer: (attemptId: string, input: SubmitAnswerInput) =>
    api
      .post<ApiSuccess<Submission>>(`/attempts/${attemptId}/submissions`, input)
      .then(unwrap),
  getScore: (attemptId: string) =>
    api.get<ApiSuccess<AttemptScore>>(`/attempts/${attemptId}/score`).then(unwrap),
  evaluate: (id: string, input: EvaluateSubmissionInput) =>
    api.patch<ApiSuccess<Submission>>(`/submissions/${id}/evaluate`, input).then(unwrap),
};

// ===== Payments =====
export const paymentApi = {
  initiate: (input: InitiatePaymentInput) =>
    api.post<ApiSuccess<InitiatePaymentResponse>>("/payments/initiate", input).then(unwrap),
  get: (id: string) => api.get<ApiSuccess<Payment>>(`/payments/${id}`).then(unwrap),
};

// ===== Admin =====
export const adminApi = {
  dashboardStats: () =>
    api.get<ApiSuccess<AdminDashboardStats>>("/admin/dashboard-stats").then(unwrap),
  listUsers: (params: { page?: number; limit?: number; role?: string } = {}) =>
    api
      .get<ApiSuccess<User[]>>("/admin/users", { params })
      .then(unwrapList) as Promise<ListResult<User>>,
  changeUserRole: (id: string, input: ChangeUserRoleInput) =>
    api.patch<ApiSuccess<User>>(`/admin/users/${id}/role`, input).then(unwrap),
  auditLogs: (params: { page?: number; limit?: number } = {}) =>
    api
      .get<ApiSuccess<AuditLog[]>>("/admin/audit-logs", { params })
      .then(unwrapList) as Promise<ListResult<AuditLog>>,
};

// Helper to extract a human-friendly error message from any API error.
import type { AxiosError } from "axios";
import type { ApiError } from "@/types";

export function getApiErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  const axiosErr = err as AxiosError<ApiError>;
  if (axiosErr?.response?.data?.message) return axiosErr.response.data.message;
  if (axiosErr?.message) return axiosErr.message;
  if (err instanceof Error) return err.message;
  return fallback;
}
