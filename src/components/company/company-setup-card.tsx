"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2, Building2 } from "lucide-react";
import { companySchema, type CompanyValues } from "@/lib/validations";
import { companyApi, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function CompanySetupCard() {
  const setCompanyId = useAuthStore((s) => s.setCompanyId);
  const [loading, setLoading] = useState(false);

  const form = useForm<CompanyValues>({
    resolver: zodResolver(companySchema),
    defaultValues: { name: "" },
  });

  async function onSubmit(values: CompanyValues) {
    setLoading(true);
    try {
      const company = await companyApi.create(values);
      setCompanyId(company.id);
      toast.success(`Created ${company.name}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to create company"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Create your company</CardTitle>
        <CardDescription>
          You don&apos;t have a company yet. Create one to start building assessments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id="company-setup" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button form="company-setup" type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create company"}
        </Button>
      </CardFooter>
    </Card>
  );
}
