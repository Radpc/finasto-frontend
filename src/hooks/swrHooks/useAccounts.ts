import { Option } from "@/components/Select";
import { AccountService } from "@/services/account";
import { Account } from "@/types/apiTypes";
import { useCallback, useMemo } from "react";
import useSWR from "swr";

interface IOptions {
  pageSize?: number;
  page?: number;
  searchBy?: string;
}

export const useAccounts = (filters?: IOptions) => {
  const fetchAccounts = useCallback(async () => {
    const result = await AccountService.getAccounts({
      page: filters?.page || 1,
      pageSize: filters?.pageSize || 10,
      name: filters?.searchBy,
    });

    return result.data.data;
  }, [filters]);

  const swrKey = useMemo(() => {
    return "/accounts/?" + JSON.stringify(filters);
  }, [filters]);

  const swr = useSWR(swrKey, fetchAccounts);

  const options: Option<Account>[] = useMemo(() => {
    return (
      swr.data?.items.map((account) => ({
        label: account.name,
        value: account,
      })) || []
    );
  }, [swr.data]);

  return {
    ...swr,
    options,
  };
};
