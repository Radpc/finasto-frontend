import { InputHTMLAttributes, useRef } from "react";
import "./_style.scss";
import React from "react";

type IProps = InputHTMLAttributes<HTMLInputElement>;

const Switch = React.forwardRef<HTMLInputElement, IProps>((props, ref) => {
  const myRef = useRef<HTMLInputElement | null>(null);
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.code) {
      case "Enter":
      case "Space":
        myRef.current?.click();
        break;
      case "ArrowLeft":
        if (myRef.current?.checked) myRef.current?.click();
        break;
      case "ArrowRight":
        if (!myRef.current?.checked) myRef.current?.click();
        break;
    }
  };

  return (
    <label className="component-switch">
      <input
        hidden
        {...props}
        ref={(node) => {
          myRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        type="checkbox"
        className=""
      />
      <div
        onKeyDown={onKeyDown}
        tabIndex={0}
        className={"switch " + (props.className ?? "")}
      >
        <div className="inside-circle" />
      </div>
    </label>
  );
});

export { Switch };
