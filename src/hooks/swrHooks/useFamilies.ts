import { Option } from "@/components/Select";
import { FamilyService } from "@/services/family";
import { Family } from "@/types/apiTypes";
import { useCallback, useMemo } from "react";
import useSWR from "swr";

interface IOptions {
  pageSize?: number;
  page?: number;
  searchBy?: string;
}

export const useFamilies = (filters?: IOptions) => {
  const fetchFamilies = useCallback(async () => {
    const result = await FamilyService.getFamilies({
      page: filters?.page || 1,
      pageSize: filters?.pageSize || 10,
      name: filters?.searchBy,
    });

    return result.data.data;
  }, [filters]);

  const swrKey = useMemo(() => {
    return "/families/?" + JSON.stringify(filters);
  }, [filters]);

  const swr = useSWR(swrKey, fetchFamilies);

  const options: Option<Family>[] = useMemo(() => {
    return swr.data?.items.map((f) => ({ label: f.name, value: f })) || [];
  }, [swr.data]);

  return {
    ...swr,
    options,
  };
};
