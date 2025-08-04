import { InputHTMLAttributes } from "react";
import "./_style.scss";
import React from "react";

type IProps = InputHTMLAttributes<HTMLInputElement>;

const Switch = React.forwardRef<HTMLInputElement, IProps>((props, ref) => {
  return (
    <label className="component-switch">
      <input hidden {...props} ref={ref} type="checkbox" className="" />
      <div tabIndex={0} className={"switch " + (props.className ?? "")}>
        <div className="inside-circle" />
      </div>
    </label>
  );
});

export { Switch };
