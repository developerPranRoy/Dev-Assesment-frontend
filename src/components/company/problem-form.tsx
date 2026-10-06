"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { problemSchema, type ProblemValues } from "@/lib/validations";
import { problemApi, getApiErrorMessage } from "@/lib/api";
import type { CreateProblemInput, Problem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProblemFormProps {
  problem?: Problem;
}

export function ProblemForm({ problem }: ProblemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEdit = !!problem;

  const form = useForm<ProblemValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      type: problem?.type ?? "MCQ",
      title: problem?.title ?? "",
      statement: problem?.statement ?? "",
      difficulty: problem?.difficulty ?? "EASY",
      tags: problem?.tags?.join(", ") ?? "",
      points: problem?.points ?? 0,
      options: (problem?.options ?? ["", ""]).map((v) => ({ value: v })),
      correctAnswer: problem?.correctAnswer ?? "",
      languageId: 63,
      testCases: (problem?.testCases as Array<{ input: string; expectedOutput: string }> | null) ?? [
        { input: "", expectedOutput: "" },
      ],
    },
  });

  const type = form.watch("type");
  const options = useFieldArray({ control: form.control, name: "options" });
  const testCases = useFieldArray({ control: form.control, name: "testCases" });

  async function onSubmit(values: ProblemValues) {
    setLoading(true);
    try {
      const payload: CreateProblemInput = {
        type: values.type,
        title: values.title,
        statement: values.statement,
        difficulty: values.difficulty,
        tags: values.tags
          ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        points: values.points,
      };
      if (values.type === "MCQ") {
        payload.options = (values.options ?? []).map((o) => o.value);
        payload.correctAnswer = values.correctAnswer;
      }
      if (values.type === "CODING") {
        payload.testCases = (values.testCases ?? []).map((tc) => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
        }));
      }

      if (isEdit && problem) {
        await problemApi.update(problem.id, payload);
        toast.success("Problem updated");
      } else {
        await problemApi.create(payload);
        toast.success("Problem created");
      }
      router.push("/company/problems");
      router.refresh();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save problem"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Problem type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MCQ">MCQ (auto-graded)</SelectItem>
                  <SelectItem value="CODING">Coding (Judge0)</SelectItem>
                  <SelectItem value="WRITTEN">Written (manual evaluation)</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="What is a closure?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="statement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statement</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Describe the problem…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="javascript, arrays, closures" {...field} />
                </FormControl>
                <FormDescription>Comma-separated</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="points"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Points</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {type === "MCQ" && (
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <FormLabel>Options</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => options.append({ value: "" })}
              >
                <Plus className="h-4 w-4" /> Add option
              </Button>
            </div>
            {options.fields.map((field, idx) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`options.${idx}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input placeholder={`Option ${idx + 1}`} {...field} />
                        {options.fields.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => options.remove(idx)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="correctAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct answer</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the correct option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(form.watch("options") ?? []).map((o, i) => (
                        <SelectItem key={i} value={o.value}>
                          {o.value || `Option ${i + 1}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {type === "CODING" && (
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <FormLabel>Test cases</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => testCases.append({ input: "", expectedOutput: "" })}
              >
                <Plus className="h-4 w-4" /> Add test case
              </Button>
            </div>
            <FormDescription>
              Used by Judge0 for auto-grading (requires JUDGE0 configured on the backend).
            </FormDescription>
            {testCases.fields.map((field, idx) => (
              <div key={field.id} className="space-y-2 rounded-md border bg-muted/30 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Test case {idx + 1}</span>
                  {testCases.fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => testCases.remove(idx)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </Button>
                  )}
                </div>
                <FormField
                  control={form.control}
                  name={`testCases.${idx}.input`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Input</FormLabel>
                      <FormControl>
                        <Textarea rows={2} placeholder="stdin input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`testCases.${idx}.expectedOutput`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Expected output</FormLabel>
                      <FormControl>
                        <Textarea rows={2} placeholder="expected stdout" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        )}

        {type === "WRITTEN" && (
          <p className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
            Written problems are evaluated manually by your team&apos;s evaluators — no
            additional fields required.
          </p>
        )}

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Save changes" : "Create problem"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
