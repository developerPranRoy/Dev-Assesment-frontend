"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { companyApi, getApiErrorMessage } from "@/lib/api";
import { SEED_COMPANY_ID } from "@/lib/constants";
import type { CreateCompanyInput } from "@/types";

export function useCompanyId() {
  return useAuthStore((s) => s.companyId) ?? SEED_COMPANY_ID;
}

export function useCompany() {
  const companyId = useCompanyId();
  const setCompanyId = useAuthStore((s) => s.setCompanyId);

  const query = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => companyApi.get(companyId),
    retry: false,
    enabled: !!companyId,
  });

  // If the seed fallback isn't this user's company, they need to create one.
  const needsSetup = !!query.error && !useAuthStore.getState().companyId;

  const createCompany = useMutation({
    mutationFn: (input: CreateCompanyInput) => companyApi.create(input),
    onSuccess: (company) => {
      setCompanyId(company.id);
      toast.success(`Created ${company.name}`);
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to create company")),
  });

  return {
    companyId,
    company: query.data,
    isLoading: query.isLoading,
    isError: !!query.error,
    needsSetup,
    createCompany,
  };
}
