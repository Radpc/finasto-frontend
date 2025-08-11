import { Option } from "@/components/Select";
import { Family } from "@/types/apiTypes";
import { useCallback, useMemo } from "react";
import useSWR from "swr";
import { useDebounce } from "../useDebounce";
import { FamilyService } from "@/services/family";

interface IOptions {
  pageSize?: number;
  page?: number;
  searchBy?: string;
}

export const useFamilies = (filters?: IOptions) => {
  const debounceSearchBy = useDebounce(filters?.searchBy);

  const fetchFamilies = useCallback(async () => {
    const result = await FamilyService.getFamilies({
      page: filters?.page || 1,
      pageSize: filters?.pageSize || 50,
      name: debounceSearchBy,
    });

    return result.data.data;
  }, [filters, debounceSearchBy]);

  const swrKey = useMemo(() => {
    const filtersKey = { ...filters, searchBy: debounceSearchBy };
    return "/families/?" + JSON.stringify(filtersKey);
  }, [debounceSearchBy, filters]);

  const swr = useSWR(swrKey, fetchFamilies, { keepPreviousData: true });

  const dataOptions: Option<Family>[] = useMemo(() => {
    return swr.data?.items.map((f) => ({ label: f.name, value: f })) || [];
  }, [swr.data]);

  const filteredDataOptions: Option<Family>[] = useMemo(() => {
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
