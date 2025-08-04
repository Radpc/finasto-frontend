import Pagination from "@/components/Pagination";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { ITagForm, ModalCreateTag } from "./components/modalCreateTag";
import { Button } from "@/components/Button";
import { TagService } from "@/services/tag";

interface IPagination {
  page: number;
  pageSize: number;
}

interface IFilters {
  searchBy: string;
}

export const PageTags = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10,
  });
  const [filters] = useState<IFilters>({
    searchBy: "",
  });

  const tagsSWRKey = useMemo(() => {
    return `/tags/${JSON.stringify(filters)}&${JSON.stringify(pagination)}`;
  }, [filters, pagination]);

  const fetchTags = useCallback(
    async (pagination: IPagination, filters: IFilters) => {
      console.log(filters);
      const { data } = await TagService.getTags({
        page: pagination.page,
        pageSize: pagination.pageSize,
      });

      const res = data.data;
      setTotalItems(res.pagination.total);

      return res.items;
    },
    []
  );

  const tagsSWR = useSWR(tagsSWRKey, () => fetchTags(pagination, filters));

  const [modalCreate, setModalCreate] = useState<{ visible: boolean }>({
    visible: false,
  });

  const onCreateTag = async (form: ITagForm) => {
    try {
      await TagService.createTag({
        label: form.label,
        familyId: form.family.id,
      });
      setModalCreate({ visible: false });
      tagsSWR.mutate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page tags">
      <ModalCreateTag
        visible={modalCreate.visible}
        onClose={() => setModalCreate({ visible: false })}
        onSubmit={onCreateTag}
      />
      <h1>Tags</h1>
      <Button onClick={() => setModalCreate({ visible: true })}>
        Create tag
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
            {tagsSWR.isLoading ? (
              <tr>Is loading</tr>
            ) : tagsSWR.error || !tagsSWR.data ? (
              <tr>Error</tr>
            ) : (
              tagsSWR.data.map((c) => (
                <tr key={"tag_" + c.id}>
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
