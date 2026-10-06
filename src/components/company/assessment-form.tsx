"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { assessmentSchema, type AssessmentValues } from "@/lib/validations";
import { assessmentApi, getApiErrorMessage } from "@/lib/api";
import type { Assessment } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface AssessmentFormProps {
  assessment?: Assessment;
  onSuccess?: (assessment: Assessment) => void;
  onCancel?: () => void;
}

export function AssessmentForm({ assessment, onSuccess, onCancel }: AssessmentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEdit = !!assessment;

  const form = useForm<AssessmentValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: assessment?.title ?? "",
      description: assessment?.description ?? "",
      durationMinutes: assessment?.durationMinutes ?? 30,
      passingScore: assessment?.passingScore ?? 60,
    },
  });

  async function onSubmit(values: AssessmentValues) {
    setLoading(true);
    try {
      if (isEdit && assessment) {
        const updated = await assessmentApi.update(assessment.id, values);
        toast.success("Assessment updated");
        if (onSuccess) onSuccess(updated);
        else router.refresh();
      } else {
        const created = await assessmentApi.create(values);
        toast.success("Assessment created");
        if (onSuccess) onSuccess(created);
        else router.push(`/company/assessments/${created.id}`);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save assessment"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Backend Engineer Screen" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="A short description of the assessment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="durationMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={180} {...field} />
                </FormControl>
                <FormDescription>Candidates get this much time once they start.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passingScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passing score</FormLabel>
                <FormControl>
                  <Input type="number" min={0} max={100} {...field} />
                </FormControl>
                <FormDescription>Out of total points. 0–100.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => (onCancel ? onCancel() : router.back())}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Save changes" : "Create assessment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
