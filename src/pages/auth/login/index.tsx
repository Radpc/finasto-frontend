import { useReduxDispatch } from "@/hooks/reduxHooks";
import { AuthService } from "@/services/auth";
import { setSession } from "@/storage/slices/session";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface ILoginForm {
  email: string;
  password: string;
}

export const PageLogin = () => {
  const dispatch = useReduxDispatch();
  const navigate = useNavigate();

  const loginForm = useForm<ILoginForm>({
    defaultValues: { email: "", password: "" },
  });

  const onLogin = async () => {
    const {
      data: {
        data: { user, jwt },
      },
    } = await AuthService.login(loginForm.getValues());
    dispatch(setSession({ accessToken: jwt, user }));
    navigate("/dashboard/categories");
  };

  return (
    <div className="page login">
      <h1>Login:</h1>
      <label>
        Email
        <input {...loginForm.register("email")} />
      </label>

      <label>
        Senha
        <input {...loginForm.register("password")} type="password" />
      </label>
      <button onClick={onLogin}>Login</button>
    </div>
  );
};
