import Pagination from "@/components/Pagination";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/Button";
import { AccountService } from "@/services/account";
import {
  IAccountForm,
  ModalCreateAccount,
} from "./components/modalCreateAccount";

interface IPagination {
  page: number;
  pageSize: number;
}

interface IFilters {
  searchBy: string;
}

export const PageAccounts = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10,
  });
  const [filters] = useState<IFilters>({
    searchBy: "",
  });

  const accountsSWRKey = useMemo(() => {
    return `/accounts/${JSON.stringify(filters)}&${JSON.stringify(pagination)}`;
  }, [filters, pagination]);

  const fetchAccounts = useCallback(
    async (pagination: IPagination, filters: IFilters) => {
      console.log(filters);
      const { data } = await AccountService.getAccounts({
        page: pagination.page,
        pageSize: pagination.pageSize,
      });

      const res = data.data;
      setTotalItems(res.pagination.total);

      return res.items;
    },
    []
  );

  const accountsSWR = useSWR(accountsSWRKey, () =>
    fetchAccounts(pagination, filters)
  );

  const [modalCreate, setModalCreate] = useState<{ visible: boolean }>({
    visible: false,
  });

  const onCreateAccount = async (form: IAccountForm) => {
    try {
      await AccountService.createAccount({
        familyId: form.family.id,
        name: form.name,
      });
      setModalCreate({ visible: false });
      accountsSWR.mutate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page accounts">
      <ModalCreateAccount
        visible={modalCreate.visible}
        onClose={() => setModalCreate({ visible: false })}
        onSubmit={onCreateAccount}
      />
      <h1>Accounts</h1>
      <Button onClick={() => setModalCreate({ visible: true })}>
        Create account
      </Button>
      <main>
        <table className="default-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Created at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accountsSWR.isLoading ? (
              <tr>Is loading</tr>
            ) : accountsSWR.error || !accountsSWR.data ? (
              <tr>Error</tr>
            ) : (
              accountsSWR.data.map((c) => (
                <tr key={"account_" + c.id}>
                  <td>#{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.createdAt}</td>
                  <td>Actions</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
      <Pagination
        currentPage={pagination.page}
        totalPages={Math.ceil(totalItems / pagination.pageSize)}
        onPageClick={(page) => setPagination((l) => ({ ...l, page }))}
      />
    </div>
  );
};
