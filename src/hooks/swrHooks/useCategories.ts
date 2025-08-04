import { Option } from "@/components/Select";
import { CategoryService } from "@/services/category";
import { Category } from "@/types/apiTypes";
import { useCallback, useMemo } from "react";
import useSWR from "swr";

interface IOptions {
  pageSize?: number;
  page?: number;
  searchBy?: string;
}

export const useCategories = (filters?: IOptions) => {
  const fetchCategories = useCallback(async () => {
    const result = await CategoryService.getCategories({
      page: filters?.page || 1,
      pageSize: filters?.pageSize || 10,
      searchBy: filters?.searchBy,
    });

    return result.data.data;
  }, [filters]);

  const swrKey = useMemo(() => {
    return "/categories/?" + JSON.stringify(filters);
  }, [filters]);

  const swr = useSWR(swrKey, fetchCategories);

  const options: Option<Category>[] = useMemo(() => {
    return swr.data?.items.map((f) => ({ label: f.label, value: f })) || [];
  }, [swr.data]);

  return {
    ...swr,
    options,
  };
};
