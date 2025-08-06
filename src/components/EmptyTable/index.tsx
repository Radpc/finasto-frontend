import "./_style.scss";

interface IProps {
  colSpan?: number;
}
export const EmptyTable = ({ colSpan }: IProps) => {
  return (
    <tr className="component empty-table">
      <td colSpan={colSpan}>
        <div className="content">
          <h1>Sem dados</h1>
        </div>
      </td>
    </tr>
  );
};
