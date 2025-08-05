import React, { InputHTMLAttributes, useRef } from "react";
import MaskedInput, { Mask } from "react-text-mask";
import "./_style.scss";
import { NumberFormatBase } from "react-number-format";
interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  preppend?: string | React.ReactNode;
  append?: string | React.ReactNode;
  mask?: Mask;
  inputClassName?: string;
  label?: React.ReactNode;
  error?: string;
  currency?: boolean;
  noError?: boolean;
  required?: boolean;
  guide?: boolean;
  inputWrapperRef?: React.RefObject<HTMLDivElement>;
}

function currencyFormatter(value: string) {
  if (!value) return "";

  const number = Number(value);

  const amount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
    .format(number / 100)
    .replace("R$", "")
    .trim();

  return `${amount}`;
}

const Input = React.forwardRef<HTMLInputElement, IProps>(
  (
    {
      append,
      noError,
      mask,
      preppend,
      inputClassName,
      currency,
      label,
      error,
      guide,
      placeholder,
      required,
      inputWrapperRef,
      ...props
    }: IProps,
    ref
  ) => {
    const currencyInputRef = useRef<HTMLInputElement>(null);

    const moveCursorToEnd = () => {
      const el = currencyInputRef.current;
      if (el) {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      }
    };

    const handleCurrencyChange: React.ChangeEventHandler<HTMLInputElement> = (
      e
    ) => {
      props.onChange?.(e);
      setTimeout(moveCursorToEnd, 0);
    };

    const handleCurrencyFocus: React.FocusEventHandler<HTMLInputElement> = (
      e
    ) => {
      props.onFocus?.(e);
      setTimeout(moveCursorToEnd, 0);
    };

    return (
      <div
        className={
          "component-input " + (error ? "error " : "") + (props.className ?? "")
        }
      >
        {label && (
          <span className="input-label">
            {label}
            {required ? <span className="asterisk">*</span> : ""}
          </span>
        )}
        <div ref={inputWrapperRef} className="input-wrapper">
          {!!preppend && <div className="preppend">{preppend}</div>}
          <div className="outer-input">
            {currency ? (
              <NumberFormatBase
                onKeyUp={props.onKeyUp}
                format={currencyFormatter}
                value={props.value as number}
                onChange={handleCurrencyChange}
                onClick={moveCursorToEnd}
                maxLength={props.maxLength}
                onBlur={props.onBlur}
                placeholder={placeholder}
                onFocus={handleCurrencyFocus}
                getInputRef={(input: HTMLInputElement) => {
                  (
                    currencyInputRef as React.MutableRefObject<HTMLInputElement | null>
                  ).current = input;
                  if (ref) {
                    if (typeof ref === "function") ref(input);
                    else ref.current = input;
                  }
                }}
                className={inputClassName ?? ""}
              />
            ) : mask ? (
              <MaskedInput
                {...props}
                placeholder={placeholder}
                className={"inner-input " + (inputClassName ?? "")}
                mask={mask}
                guide={guide}
                render={(innerRef, innerProps) => (
                  <input
                    ref={(node) => {
                      if (node) {
                        innerRef(node);
                        if (ref) {
                          if (typeof ref === "function") {
                            ref(node);
                          } else if (ref) {
                            ref.current = node;
                          }
                        }
                      }
                    }}
                    {...innerProps}
                  />
                )}
              />
            ) : (
              <input
                {...props}
                placeholder={placeholder}
                ref={ref}
                className={"inner-input " + (inputClassName ?? "")}
              />
            )}
          </div>
          {!!append && <div className="append">{append}</div>}
        </div>
        {!noError && <small className="error">{error}</small>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
