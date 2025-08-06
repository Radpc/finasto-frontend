import "./_style.scss";

interface IProps {
  colSpan?: number;
}
export const ErrorTable = ({ colSpan }: IProps) => {
  return (
    <tr className="component error-table">
      <td colSpan={colSpan}>
        <div className="content">
          <h1>Ocorreu um erro</h1>
        </div>
      </td>
    </tr>
  );
};
