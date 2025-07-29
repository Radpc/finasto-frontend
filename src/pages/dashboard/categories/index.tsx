import Pagination from "@/components/Pagination";
import { CategoryService } from "@/services/category";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import {
  ICategoryForm,
  ModalCreateCategory,
} from "./components/modalCreateCategory";
import { Button } from "@/components/Button";

interface IPagination {
  page: number;
  pageSize: number;
}

interface IFilters {
  searchBy: string;
}

export const PageCategories = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10,
  });
  const [filters] = useState<IFilters>({
    searchBy: "",
  });

  const categoriesSWRKey = useMemo(() => {
    return `/categories/${JSON.stringify(filters)}&${JSON.stringify(
      pagination
    )}`;
  }, [filters, pagination]);

  const fetchCategories = useCallback(
    async (pagination: IPagination, filters: IFilters) => {
      console.log(filters);
      const { data } = await CategoryService.getCategories({
        page: pagination.page,
        pageSize: pagination.pageSize,
      });

      const res = data.data;
      setTotalItems(res.pagination.total);

      return res.items;
    },
    []
  );

  const categoriesSWR = useSWR(categoriesSWRKey, () =>
    fetchCategories(pagination, filters)
  );

  const [modalCreate, setModalCreate] = useState<{ visible: boolean }>({
    visible: false,
  });

  const onCreateCategory = async (form: ICategoryForm) => {
    try {
      await CategoryService.createCategory({ label: form.label });
      setModalCreate({ visible: false });
      categoriesSWR.mutate();
    } catch (err) {}
  };

  return (
    <div className="page categories">
      <ModalCreateCategory
        visible={modalCreate.visible}
        onClose={() => setModalCreate({ visible: false })}
        onSubmit={onCreateCategory}
      />
      <h1>Categories</h1>
      <Button onClick={() => setModalCreate({ visible: true })}>
        Create category
      </Button>
      <main>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Label</th>
              <th>Created at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoriesSWR.isLoading ? (
              <tr>Is loading</tr>
            ) : categoriesSWR.error || !categoriesSWR.data ? (
              <tr>Error</tr>
            ) : (
              categoriesSWR.data.map((c) => (
                <tr key={"category_" + c.id}>
                  <td>#{c.id}</td>
                  <td>{c.label}</td>
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
