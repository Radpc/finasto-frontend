import { Option } from "@/components/Select";
import { TagService } from "@/services/tag";
import { Tag } from "@/types/apiTypes";
import { useCallback, useMemo } from "react";
import useSWR from "swr";

interface IOptions {
  pageSize?: number;
  page?: number;
  searchBy?: string;
}

export const useTags = (filters?: IOptions) => {
  const fetchTags = useCallback(async () => {
    const result = await TagService.getTags({
      page: filters?.page || 1,
      pageSize: filters?.pageSize || 10,
      searchBy: filters?.searchBy,
    });

    return result.data.data;
  }, [filters]);

  const swrKey = useMemo(() => {
    return "/tags/?" + JSON.stringify(filters);
  }, [filters]);

  const swr = useSWR(swrKey, fetchTags);

  const options: Option<Tag>[] = useMemo(() => {
    return swr.data?.items.map((f) => ({ label: f.label, value: f })) || [];
  }, [swr.data]);

  return {
    ...swr,
    options,
  };
};
