import { Option } from "@/components/Select";
import { Tag } from "@/types/apiTypes";
import { useCallback, useMemo } from "react";
import useSWR from "swr";
import { useDebounce } from "../useDebounce";
import { TagService } from "@/services/tag";

interface IOptions {
  pageSize?: number;
  page?: number;
  searchBy?: string;
}

export const useTags = (filters?: IOptions) => {
  const debounceSearchBy = useDebounce(filters?.searchBy);

  const fetchTags = useCallback(async () => {
    const result = await TagService.getTags({
      page: filters?.page || 1,
      pageSize: filters?.pageSize || 50,
      searchBy: debounceSearchBy,
    });

    return result.data.data;
  }, [filters, debounceSearchBy]);

  const swrKey = useMemo(() => {
    const filtersKey = { ...filters, searchBy: debounceSearchBy };
    return "/tags/?" + JSON.stringify(filtersKey);
  }, [debounceSearchBy, filters]);

  const swr = useSWR(swrKey, fetchTags, { keepPreviousData: true });

  const dataOptions: Option<Tag>[] = useMemo(() => {
    return swr.data?.items.map((f) => ({ label: f.label, value: f })) || [];
  }, [swr.data]);

  const filteredDataOptions: Option<Tag>[] = useMemo(() => {
    if (!filters?.searchBy || !dataOptions) return dataOptions;
    const searchBy = filters.searchBy;

    return dataOptions.filter(({ label }) => {
      if (typeof label === "string") {
        return label.toLowerCase().indexOf(searchBy.toLowerCase()) >= 0;
      } else {
        return (
          (label
            ?.toString()
            .replace(/\W/g, "")
            .toLowerCase()
            .indexOf(searchBy.toLowerCase()) || 0) >= 0
        );
      }
    });
  }, [dataOptions, filters?.searchBy]);

  return {
    ...swr,
    options: filteredDataOptions,
  };
};
