import { Family, User } from "@/types/apiTypes";
import "./_style.scss";
import { useRedux } from "@/hooks/reduxHooks";
import { Dropdown } from "@/components/Dropdown";
import { useFamilies } from "@/hooks/swrHooks/useFamilies";
import { useDispatch } from "react-redux";
import { setSelectedFamily, unsetSession } from "@/storage/slices/session";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
interface IProps {
  user: User;
  className?: string;
}

export const Topbar = ({ user, className }: IProps) => {
  return (
    <div className={"component topbar " + (className ?? "")}>
      <div className="left-side"></div>
      <div className="right-side">
        <FamilySelector />
        <UserDropdown />
      </div>
    </div>
  );
};

const FamilySelector = () => {
  const families = useFamilies();
  const currentFamily = useRedux((s) => s.session.selectedFamily);
  const dispatch = useDispatch();

  const selectFamily = (family: Family) => {
    dispatch(setSelectedFamily({ family }));
  };

  return (
    <div className="component family-selector">
      <Dropdown
        buttons
        from={(props) => (
          <Button type="tertiary" className="btn" {...props}>
            Família: {currentFamily?.name}
          </Button>
        )}
      >
        {families.data?.items.map((f) => (
          <button
            onClick={() => selectFamily(f)}
            key={"button_" + f.id}
            disabled={f.id === currentFamily?.id}
          >
            <input type="radio" checked={f.id === currentFamily?.id} />
            <span>{f.name}</span>
          </button>
        ))}
      </Dropdown>
    </div>
  );
};

const UserDropdown = () => {
  const currentSession = useRedux((s) => s.session);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onLogout = () => {
    dispatch(unsetSession());
    navigate("/auth/login");
  };

  return (
    <div className="component user-dropdown">
      <Dropdown
        from={(props) => (
          <Button type="tertiary" className="btn" {...props}>
            {currentSession.user?.name}
          </Button>
        )}
        buttons
      >
        <button onClick={onLogout}>Logout</button>
      </Dropdown>
    </div>
  );
};
