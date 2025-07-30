import { useReduxDispatch } from "@/hooks/reduxHooks";
import { AuthService } from "@/services/auth";
import { setSession } from "@/storage/slices/session";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./_style.scss";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

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

  const onLogin = loginForm.handleSubmit(async (form) => {
    const {
      data: {
        data: { user, jwt },
      },
    } = await AuthService.login(form);
    dispatch(setSession({ accessToken: jwt, user }));
    navigate("/dashboard/categories");
  });

  return (
    <div className="page login">
      <form onSubmit={onLogin}>
        <h1>Finance IO</h1>
        <Controller
          name="email"
          control={loginForm.control}
          rules={{ required: "Campo necessário" }}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              placeholder="Digite aqui"
              label="E-mail"
              error={error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={loginForm.control}
          rules={{ required: "Campo necessário" }}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              type="password"
              placeholder="*****"
              label="Senha"
              error={error?.message}
            />
          )}
        />
        <Button onClick={onLogin}>Entrar</Button>
      </form>
    </div>
  );
};
