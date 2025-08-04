import { User } from "@/types/apiTypes";
import "./_style.scss";
import { useRedux } from "@/hooks/reduxHooks";
interface IProps {
  user: User;
  className?: string;
}

export const Topbar = ({ user, className }: IProps) => {
  const selectedFamily = useRedux((s) => s.session.selectedFamily);

  return (
    <div className={"component topbar " + (className ?? "")}>
      <div>Bem vindo: {user.name}</div>
      <div>Familia: {selectedFamily?.id}</div>
    </div>
  );
};
