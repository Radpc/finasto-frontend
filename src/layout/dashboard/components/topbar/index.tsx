import { Family, User } from "@/types/apiTypes";
import "./_style.scss";
import { useRedux } from "@/hooks/reduxHooks";
import { Dropdown } from "@/components/Dropdown";
import { useFamilies } from "@/hooks/swrHooks/useFamilies";
import { useDispatch } from "react-redux";
import { setSelectedFamily } from "@/storage/slices/session";
import { useAuthActions } from "@/auth/context";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { useMobile } from "@/hooks/useMobile";
import ReorderIcon from "@mui/icons-material/Reorder";
import { mutate } from "swr";
interface IProps {
  user: User;
  className?: string;
  setOpen: (open: boolean) => void;
  open: boolean;
}

export const Topbar = ({ className, setOpen, open }: IProps) => {
  const isMobile = useMobile();
  return (
    <div className={"component topbar " + (className ?? "")}>
      <div className="left-side">
        {isMobile && (
          <button onClick={() => setOpen(!open)}>
            <p>
              <ReorderIcon />
            </p>
          </button>
        )}
      </div>
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
    // Every request now carries the new family; refetch what is on screen.
    mutate(() => true);
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
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const onLogout = () => {
    signOut();
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
