import { useReduxDispatch } from "@/hooks/reduxHooks";
import { AuthService } from "@/services/auth";
import { setSession } from "@/storage/slices/session";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./_style.scss";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useState } from "react";
import { toast } from "react-toastify";
import DollarBackground from "@/assets/img/images/dollars.jpg";

interface ILoginForm {
  email: string;
  password: string;
}

export const PageLogin = () => {
  const dispatch = useReduxDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<ILoginForm>({
    defaultValues: { email: "", password: "" },
  });

  const onLogin = loginForm.handleSubmit(async (form) => {
    setLoading(true);
    try {
      const {
        data: {
          data: { user, jwt },
        },
      } = await AuthService.login(form);
      dispatch(
        setSession({ accessToken: jwt, user, family: user.families?.[0] }),
      );
      navigate("/dashboard/categories");
      toast.success("Bem vindo, " + user.name);
    } catch {
      toast.error("Usuario e/ou senha incorreto.");
      console.error("Login failed");
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="page login">
      <img src={DollarBackground} />

      <div className="container ">
        <form onSubmit={onLogin}>
          <h1>Finance IO</h1>
          <Controller
            name="email"
            control={loginForm.control}
            rules={{ required: "Campo necessário" }}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                disabled={loading}
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
                disabled={loading}
                placeholder="*****"
                label="Senha"
                error={error?.message}
              />
            )}
          />
          <Button buttonType="submit" disabled={loading} onClick={onLogin}>
            Entrar
          </Button>
          {/* Lembrar / Cadastrar */}
        </form>
      </div>
    </div>
  );
};
