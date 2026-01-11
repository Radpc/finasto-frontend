import React, { useCallback, useEffect, useRef, useState } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import "./_style.scss";
import ReactDOM from "react-dom";

interface FromProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown;
  ref: React.Ref<HTMLButtonElement>;
  isOpen?: boolean;
}

interface IProps {
  className?: string;
  children?: React.ReactNode;
  from: (fromProps: FromProps) => React.ReactNode;
  closeOnDropdownClick?: boolean;
  buttons?: boolean;
}

export const Dropdown = ({
  from,
  children,
  className,
  closeOnDropdownClick = true,
  buttons,
}: IProps) => {
  // Dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
  const buttonRef = useRef<HTMLButtonElement>(
    null as unknown as HTMLButtonElement,
  );

  const handleDropdownToggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setDropdownOpen((prev) => !prev);
    },
    [],
  );

  const customButton = from({
    onClick: handleDropdownToggle,
    ref: buttonRef,
    isOpen: dropdownOpen,
  });

  useOutsideClick(dropdownRef, () => {
    setDropdownOpen(false);
  });

  const measuredRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      const height = node.getBoundingClientRect().height;
      setDropdownHeight(height);
    }
  }, []);

  const [coords, setCoords] = useState<{
    left?: number;
    top?: number;
    // right?: number;
    bottom?: number;
  }>({ left: 0, top: 0, bottom: 0 });

  const updateDropdownCoords = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    const spaceBelow = window.innerHeight - (rect?.bottom || 0);
    const spaceAbove = rect?.top || 0;

    if (rect) {
      const opensDown = spaceBelow > dropdownHeight || spaceBelow >= spaceAbove;
      setCoords({
        left: rect.left,
        // right: rect.width,
        top: opensDown ? rect.bottom + window.scrollY + 2 : undefined,
        bottom: !opensDown
          ? window.innerHeight - rect.top - window.scrollY + 12
          : undefined,
      });
    }
  }, [dropdownHeight, buttonRef]);

  useEffect(() => {
    if (dropdownOpen) {
      updateDropdownCoords();
      document.addEventListener("scroll", updateDropdownCoords, true);
      window.addEventListener("resize", updateDropdownCoords, true);
    }

    return () => {
      document.removeEventListener("scroll", updateDropdownCoords, true);
      window.removeEventListener("resize", updateDropdownCoords, true);
    };
  }, [updateDropdownCoords, dropdownOpen]);

  return (
    <div
      ref={dropdownRef}
      onClick={() => setDropdownOpen((d) => !d)}
      className={"component dropdown-team "}
    >
      {customButton}
      {dropdownOpen &&
        ReactDOM.createPortal(
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (closeOnDropdownClick) setDropdownOpen(false);
            }}
            className={
              "component dropdown " +
              (dropdownOpen ? "" : "hidden ") +
              (buttons ? "buttons " : "") +
              (className ?? "")
            }
            style={{ ...coords }}
            ref={measuredRef}
          >
            {children}
          </div>,
          document.getElementById("root") as HTMLElement,
        )}
    </div>
  );
};
