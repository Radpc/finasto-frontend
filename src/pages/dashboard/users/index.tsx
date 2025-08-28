import Pagination from "@/components/Pagination";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { IUserForm, ModalCreateUser } from "./components/modalCreateUser";
import { Button } from "@/components/Button";
import { UserService } from "@/services/user";

interface IPagination {
  page: number;
  pageSize: number;
}

interface IFilters {
  searchBy: string;
}

export const PageUsers = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10,
  });
  const [filters] = useState<IFilters>({
    searchBy: "",
  });

  const usersSWRKey = useMemo(() => {
    return `/users/${JSON.stringify(filters)}&${JSON.stringify(pagination)}`;
  }, [filters, pagination]);

  const fetchUsers = useCallback(
    async (pagination: IPagination, filters: IFilters) => {
      console.log(filters);
      const { data } = await UserService.getUsers({
        page: pagination.page,
        pageSize: pagination.pageSize,
      });

      const res = data.data;
      setTotalItems(res.pagination.total);

      return res.items;
    },
    []
  );

  const usersSWR = useSWR(usersSWRKey, () => fetchUsers(pagination, filters));

  const [modalCreate, setModalCreate] = useState<{ visible: boolean }>({
    visible: false,
  });

  const onCreateUser = async (form: IUserForm) => {
    try {
      await UserService.createUser({
        familyId: form.family.id,
        email: form.email,
        name: form.name,
        password: form.password,
        role: form.role,
      });
      setModalCreate({ visible: false });
      usersSWR.mutate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page users">
      <ModalCreateUser
        visible={modalCreate.visible}
        onClose={() => setModalCreate({ visible: false })}
        onSubmit={onCreateUser}
      />
      <h1>Users</h1>
      <Button onClick={() => setModalCreate({ visible: true })}>
        Criar usuário
      </Button>
      <main>
        <table className="default-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usersSWR.isLoading ? (
              <tr>Is loading</tr>
            ) : usersSWR.error || !usersSWR.data ? (
              <tr>Error</tr>
            ) : (
              usersSWR.data.map((c) => (
                <tr key={"user_" + c.id}>
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
