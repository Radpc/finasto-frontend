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

interface Coords {
  x: number;
  y: number;
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
  const buttonRef = useRef<HTMLButtonElement>(
    null as unknown as HTMLButtonElement,
  );

  const [buttonCoords, setButtonCoords] = useState<Coords>({ x: 0, y: 0 });

  const updateButtonCoords = useCallback(() => {
    const rect = buttonRef.current.getBoundingClientRect();
    const coords = {
      x: rect.left,
      y: rect.bottom + window.scrollY,
    };
    setButtonCoords(coords);
  }, [buttonRef]);

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("scroll", updateButtonCoords, true);
      window.addEventListener("resize", updateButtonCoords, true);
    }

    return () => {
      document.removeEventListener("scroll", updateButtonCoords, true);
      window.removeEventListener("resize", updateButtonCoords, true);
    };
  }, [dropdownOpen, updateButtonCoords]);

  const handleDropdownToggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      updateButtonCoords();
      setDropdownOpen(true);
    },
    [updateButtonCoords],
  );

  const customButton = from({
    onClick: handleDropdownToggle,
    ref: buttonRef,
    isOpen: dropdownOpen,
  });

  return (
    <div className={"component dropdown-team "}>
      {customButton}
      {dropdownOpen &&
        ReactDOM.createPortal(
          <DropdownMenu
            buttonCoords={buttonCoords}
            className={className}
            buttons={buttons}
            fromElemRef={buttonRef.current!}
            onCloseDropdown={() => setDropdownOpen(false)}
            closeOnClick={closeOnDropdownClick}
          >
            {children}
          </DropdownMenu>,
          document.getElementById("root") as HTMLElement,
        )}
    </div>
  );
};

interface IDropdownMenuProps {
  children: React.ReactNode;
  onCloseDropdown: () => void;
  fromElemRef: HTMLButtonElement;
  className?: string;
  buttons?: boolean;
  buttonCoords: Coords;
  closeOnClick?: boolean;
}

const DropdownMenu = (props: IDropdownMenuProps) => {
  const {
    className,
    closeOnClick,
    buttonCoords,
    buttons,
    children,
    onCloseDropdown,
  } = props;

  const dropdownRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);

  // const [dropdownHeight, setDropdownHeight] = useState(0);

  // useEffect(() => {
  //   if (dropdownRef.current !== null) {
  //     const height = dropdownRef.current.getBoundingClientRect().height;
  //     setDropdownHeight(height);
  //   }
  // }, [dropdownRef]);

  useOutsideClick(dropdownRef, () => {
    onCloseDropdown();
  });

  return (
    <div
      onClick={(e) => {
        if (closeOnClick) onCloseDropdown();
      }}
      className={
        "component dropdown " + (buttons ? "buttons " : "") + (className ?? "")
      }
      style={{ left: buttonCoords.x, top: buttonCoords.y }}
      ref={dropdownRef}
    >
      {children}
    </div>
  );
};
