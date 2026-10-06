import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["CANDIDATE", "COMPANY"]),
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
});
export type CompanyValues = z.infer<typeof companySchema>;

export const addMemberSchema = z.object({
  email: z.string().email("Enter a valid email"),
  permissionLevel: z.enum(["CREATOR", "EVALUATOR"]),
});
export type AddMemberValues = z.infer<typeof addMemberSchema>;

export const problemSchema = z
  .object({
    type: z.enum(["MCQ", "CODING", "WRITTEN"]),
    title: z.string().min(3, "Title must be at least 3 characters"),
    statement: z.string().min(10, "Statement must be at least 10 characters"),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    tags: z.string().optional(),
    points: z.coerce.number().int().min(0, "Points must be 0 or more"),
    // MCQ
    options: z.array(z.object({ value: z.string().min(1, "Option cannot be empty") })).optional(),
    correctAnswer: z.string().optional(),
    // CODING
    languageId: z.coerce.number().int().optional(),
    testCases: z
      .array(
        z.object({
          input: z.string(),
          expectedOutput: z.string().min(1, "Expected output is required"),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "MCQ") {
      if (!data.options || data.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Add at least 2 options for MCQ",
        });
      }
      if (!data.correctAnswer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["correctAnswer"],
          message: "Select the correct answer",
        });
      }
    }
    if (data.type === "CODING" && (!data.testCases || data.testCases.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["testCases"],
        message: "Add at least one test case for coding problems",
      });
    }
  });
export type ProblemValues = z.infer<typeof problemSchema>;

export const assessmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  durationMinutes: z.coerce
    .number()
    .int()
    .min(1, "Duration must be at least 1 minute")
    .max(180, "Duration cannot exceed 180 minutes"),
  passingScore: z.coerce
    .number()
    .int()
    .min(0, "Passing score cannot be negative")
    .max(100, "Passing score cannot exceed 100"),
});
export type AssessmentValues = z.infer<typeof assessmentSchema>;

export const inviteSchema = z.object({
  emails: z
    .string()
    .min(1, "Enter at least one email")
    .refine(
      (val) =>
        val
          .split(/[,\s]+/)
          .map((e) => e.trim())
          .filter(Boolean)
          .every((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)),
      "One or more emails are invalid",
    ),
});
export type InviteValues = z.infer<typeof inviteSchema>;

export const evaluateSchema = z.object({
  manualScore: z.coerce
    .number()
    .int()
    .min(0, "Score cannot be negative")
    .max(1000, "Score is too high"),
});
export type EvaluateValues = z.infer<typeof evaluateSchema>;

export const buyCreditsSchema = z.object({
  credits: z.coerce
    .number()
    .int()
    .min(1, "Buy at least 1 credit")
    .max(1000, "Max 1000 credits at once"),
});
export type BuyCreditsValues = z.infer<typeof buyCreditsSchema>;

export const addProblemToAssessmentSchema = z.object({
  problemId: z.string().min(1, "Select a problem"),
  order: z.coerce.number().int().min(1, "Order must be at least 1"),
  points: z.coerce.number().int().min(0, "Points must be 0 or more"),
});
export type AddProblemValues = z.infer<typeof addProblemToAssessmentSchema>;
