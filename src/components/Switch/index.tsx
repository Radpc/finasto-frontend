import { InputHTMLAttributes } from "react";
import "./_style.scss";

type IProps = InputHTMLAttributes<HTMLInputElement>;

const Switch = (props: IProps) => {
  return (
    <label className="component-switch">
      <input hidden {...props} type="checkbox" className="" />
      <div className={"switch " + (props.className ?? "")}>
        <div className="inside-circle" />
      </div>
    </label>
  );
};

export { Switch };
