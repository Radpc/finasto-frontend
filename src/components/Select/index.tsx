import React, {
  ReactElement,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import "./_style.scss";

import SvgCross from "@/assets/img/icons/Cross.svg?react";
import SvgSync from "@/assets/img/icons/Sync.svg?react";
import SvgChevronDown from "@/assets/img/icons/ChevronDown.svg?react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useDebounce } from "@/hooks/useDebounce";
import ReactDOM from "react-dom";

// type Nullabe<T> = T | null;

export interface Option<T> {
  label: string | React.ReactNode;
  optionLabel?: string | React.ReactNode;
  value: T;
  disabled?: boolean;
}

type SingleValue<T> = Option<T> | null;
type MultiValue<T> = readonly Option<T>[];
type SelectedOption<T, IsMulti> = IsMulti extends true
  ? MultiValue<T>
  : SingleValue<T>;
type SelectedValue<T, IsMulti> = IsMulti extends true ? T[] : T;

interface IProps<T, IsMulti extends boolean> {
  placeholder?: string;
  isMulti?: IsMulti;
  clearable?: boolean;
  options?: Option<T>[];
  optionsLoading?: boolean;
  disabled?: boolean;
  value?: SelectedValue<T, IsMulti>;
  small?: boolean;
  isSearchable?: boolean;
  className?: string;
  onChange?: (newValue: SelectedValue<T, IsMulti>) => void;
  customLabel?: (newValue: SelectedOption<T, IsMulti>) => React.ReactNode;
  compareBy?: (firstValue: T, secondValue: T) => boolean;
  label?: React.ReactNode;
  preppend?: string | React.ReactNode;
  onSearch?: (search: string) => unknown | Promise<unknown>;
  required?: boolean;
  error?: string;
  noError?: boolean;
  fallbackLabel?: (item: T) => string | React.ReactNode;
  optionsDirection?: "down" | "up";
  hasCheckbox?: boolean;
  headerContent?: React.ReactNode;
  headerOnClick?: () => void;
  headerContentClassName?: string;
}

enum SelectDirection {
  Down = "down",
  Up = "up",
}

const Select = React.forwardRef(
  <T, IsMulti extends boolean = false>(
    {
      label,
      placeholder = "Selecione",
      options,
      isSearchable,
      disabled,
      small,
      clearable,
      value,
      customLabel,
      isMulti,
      optionsLoading,
      className,
      compareBy,
      onChange,
      preppend,
      onSearch,
      required,
      error,
      fallbackLabel,
      noError,
      hasCheckbox,
      headerContent,
      headerContentClassName,
      optionsDirection,
      headerOnClick,
    }: IProps<T, IsMulti>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const document = useMemo(() => window.document, []);

    const [showMenu, setShowMenu] = useState(false);
    const [cachedOptions, setCachedOptions] = useState<
      SelectedOption<T, IsMulti>
    >((isMulti ? [] : null) as never);
    const [selectedValue, setSelectedValue] = useState<
      SelectedValue<T, IsMulti>
    >((isMulti ? [] : null) as never);
    const [searchValue, setSearchValue] = useState("");
    const [dropdownHeight, setDropdownHeight] = useState(0);
    const searchRef = useRef<HTMLInputElement>(
      null as unknown as HTMLInputElement
    );
    const inputRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);

    const searchDebounce = useDebounce(searchValue);

    const debouncingSearch = useMemo(
      () => searchDebounce.trim() !== searchValue,
      [searchDebounce, searchValue]
    );

    const [coords, setCoords] = useState<{
      left?: number;
      top?: number;
      width?: number;
      bottom?: number;
    }>({ left: 0, top: 0, width: 0 });

    useEffect(() => {
      if (onSearch) emitOnSearch(searchValue);
    }, [searchValue]);

    const emitOnSearch = useCallback(
      (searchBy: string) => {
        if (onSearch) {
          const searchValue = searchBy.trim();
          onSearch(searchValue);
        }
      },
      [onSearch]
    );

    useEffect(() => {
      setSearchValue("");
      if (showMenu && searchRef.current) {
        setTimeout(() => searchRef.current.focus());
      }
    }, [showMenu]);

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);

        if (isMulti) {
          const currentSelectedValues = value as T[];
          const newCacheOptions: Option<T>[] = [];
          const oldCacheOptions = cachedOptions as Option<T>[];

          currentSelectedValues.forEach((v) => {
            const foundInOption = options?.find((o) =>
              compareValues(o.value, v)
            );
            if (foundInOption) {
              newCacheOptions.push(foundInOption);
            } else {
              const foundInCacheOptions = oldCacheOptions.find((o) =>
                compareValues(o.value, v)
              );

              if (foundInCacheOptions)
                newCacheOptions.push(foundInCacheOptions);
            }
          });

          setCachedOptions(
            newCacheOptions as unknown as SelectedOption<T, IsMulti>
          );
        } else {
          const val = value as T;

          const opt = options?.find((o) => compareValues(o.value, val)) || null;
          if (opt)
            setCachedOptions(opt as unknown as SelectedOption<T, IsMulti>);
        }
      } else {
        setSelectedValue((isMulti ? [] : null) as never);
        setCachedOptions((isMulti ? [] : null) as never);
      }
    }, [value, options]);

    useOutsideClick(
      inputRef,
      () => {
        setShowMenu(false);
      },
      "click",
      document
    );

    const handleInputClick = () => {
      if (!disabled) setShowMenu(!showMenu);
    };

    const compareValues = useCallback(
      (value1: T, value2: T) =>
        compareBy ? compareBy(value1, value2) : value1 === value2,
      [compareBy]
    );

    const getDisplay = (): React.ReactNode => {
      const isArray = Array.isArray(selectedValue);

      if (
        selectedValue === null ||
        selectedValue === undefined ||
        selectedValue === "" ||
        (isArray && selectedValue.length === 0)
      ) {
        return <div className="placeholder">{placeholder}</div>;
      } else if (customLabel) {
        return customLabel(getValueOptions(selectedValue));
      } else if (isArray) {
        return (
          <div className="selected-options">
            {selectedValue.slice(0, 1).map((value, index) => (
              <div key={index} className="selected-option">
                <Tag removable onTagRemove={() => onTagRemove(value)}>
                  {getValueOption(value)?.label ??
                    fallbackLabel?.(value) ??
                    value?.toString() ??
                    "-"}
                </Tag>
              </div>
            ))}
            {selectedValue.length > 1 && (
              <span className="plus">+{selectedValue.length - 1}</span>
            )}
          </div>
        );
      } else {
        return (
          <div className="selected-option">
            {getValueOption(selectedValue as T)?.label ??
              fallbackLabel?.(selectedValue as T)}
          </div>
        );
      }
    };

    const getValueOptions = (
      values: SelectedValue<T, IsMulti>
    ): SelectedOption<T, IsMulti> => {
      const isArray = Array.isArray(values);
      if (isArray) {
        return values.map((v) => getValueOption(v)).filter((a) => a) as never;
      } else {
        return getValueOption(values as T) as SelectedOption<T, IsMulti>;
      }
    };

    const getValueOption = (value: T): Option<T> | undefined => {
      if (isMulti) {
        const options = cachedOptions as Option<T>[];
        return (
          options.find((o) => compareValues(o.value, value)) ||
          options?.find((o) => compareValues(o.value, value))
        );
      } else {
        const option = cachedOptions as Option<T>;
        return option && compareValues(option.value, value)
          ? option
          : options?.find((o) => compareValues(o.value, value));
      }
    };

    const removeSelected = useCallback(
      (valueToRemove: T): SelectedValue<T, IsMulti> => {
        return (selectedValue as T[]).filter(
          (o) => !compareValues(o, valueToRemove)
        ) as SelectedValue<T, IsMulti>;
      },
      [compareValues, selectedValue]
    );

    const clearSelection = () => {
      const newSelected = (isMulti ? [] : null) as never;
      const newOptionsSelected = (isMulti ? [] : null) as never;
      setSelectedValue(newSelected);
      setCachedOptions(newOptionsSelected);
      onChange?.(newSelected);
    };

    const isCrossVisible = useMemo((): boolean => {
      const isArray = Array.isArray(selectedValue);
      if (isArray) {
        return selectedValue.length > 1;
      } else {
        return selectedValue !== null;
      }
    }, [selectedValue]);

    const onTagRemove = (value: T) => {
      const newSelected: SelectedValue<T, IsMulti> = removeSelected(value);
      setSelectedValue(newSelected as never);
      onChange?.(newSelected);

      // Remove from option select
      setCachedOptions(
        (oldOptions) =>
          (oldOptions as Option<T>[]).filter(
            (o) => !compareValues(o.value, value)
          ) as unknown as SelectedOption<T, IsMulti>
      );
    };

    const onOptionClick = useCallback(
      (option: Option<T>) => {
        const isArray = Array.isArray(selectedValue);
        let newSelected;

        if (isArray) {
          if (selectedValue.some((o) => compareValues(o, option.value))) {
            newSelected = removeSelected(option.value);
            setCachedOptions(
              (oldOptions) =>
                (oldOptions as Option<T>[]).filter(
                  (o) => !compareValues(o.value, option.value)
                ) as unknown as SelectedOption<T, IsMulti>
            );
          } else {
            newSelected = [...selectedValue, option.value];
            setCachedOptions(
              (oldOptions) =>
                [
                  ...(oldOptions as Option<T>[]),
                  option,
                ] as unknown as SelectedOption<T, IsMulti>
            );
          }
        } else {
          newSelected = option.value;
          setCachedOptions(option as SelectedOption<T, IsMulti>);
        }

        if (!isMulti) {
          setShowMenu(false);
        }

        setSelectedValue(newSelected as SelectedValue<T, IsMulti>);
        onChange?.(newSelected as SelectedValue<T, IsMulti>);
      },
      [compareValues, isMulti, onChange, removeSelected, selectedValue]
    );

    const isSelected = (option: Option<T>) => {
      const isArray = Array.isArray(selectedValue);

      if (isArray) {
        return selectedValue.some((o) => compareValues(o, option.value));
      } else if (!selectedValue) {
        return false;
      } else return compareValues(selectedValue as T, option.value);
    };

    const visibleOptions = useMemo(() => {
      if (!options) return [];

      if (!searchValue || onSearch) {
        return options;
      }

      // Manual filtering
      return options?.filter((option) => {
        const label = option.label;

        if (typeof label === "string") {
          return label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0;
        } else {
          return (
            (label
              ?.toString()
              .replace(/\W/g, "")
              .toLowerCase()
              .indexOf(searchValue.toLowerCase()) || 0) >= 0
          );
        }
      });
    }, [onSearch, options, searchValue]);

    const direction = useMemo(() => {
      const spaceBelow =
        window.innerHeight -
        (inputRef.current?.getBoundingClientRect().bottom || 0);
      return spaceBelow > dropdownHeight
        ? SelectDirection.Down
        : SelectDirection.Up;
    }, [showMenu, dropdownHeight]);

    const measuredRef = useCallback((node: HTMLDivElement) => {
      if (node !== null) {
        const height = node.getBoundingClientRect().height;
        setDropdownHeight(height);
      }
    }, []);

    const updateDropdownCoords = useCallback(() => {
      const rect = inputRef.current?.getBoundingClientRect();
      const spaceBelow = window.innerHeight - (rect?.bottom || 0);
      const spaceAbove = rect?.top || 0;

      if (rect) {
        const opensDown =
          spaceBelow > dropdownHeight || spaceBelow >= spaceAbove;
        setCoords({
          left: rect.left,
          width: rect.width,
          top: opensDown ? rect.bottom + window.scrollY + 2 : undefined,
          bottom: !opensDown
            ? window.innerHeight - rect.top - window.scrollY + 12
            : undefined,
        });
      }
    }, [dropdownHeight, inputRef]);

    useEffect(() => {
      if (showMenu) {
        updateDropdownCoords();
        document.addEventListener("scroll", updateDropdownCoords, true);
        window.addEventListener("resize", updateDropdownCoords, true);
      }

      return () => {
        document.removeEventListener("scroll", updateDropdownCoords, true);
        window.removeEventListener("resize", updateDropdownCoords, true);
      };
    }, [
      updateDropdownCoords,
      showMenu,
      debouncingSearch,
      document,
      selectedValue,
    ]);

    // Accessibility
    const [highlightedOptionIndex, setHighlighterOptionIndex] = useState(0);
    const optionsContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (showMenu) {
        const optionsElements =
          optionsContainerRef.current?.getElementsByClassName("option");
        const optionElement = optionsElements?.item(highlightedOptionIndex);
        optionElement?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }, [highlightedOptionIndex, showMenu]);

    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      setHighlighterOptionIndex(0);
    }, [showMenu, options]);

    useEffect(() => {
      const containerElem = containerRef.current;
      const searchElem = searchRef.current;
      const handler = (elem: HTMLElement) => (e: KeyboardEvent) => {
        if (e.target !== elem) return;
        switch (e.code) {
          case "Enter":
            if (!isMulti || !showMenu) setShowMenu((l) => !l);
            if (showMenu) {
              onOptionClick(visibleOptions[highlightedOptionIndex]);
              if (!isMulti) containerRef.current?.focus();
            }
            break;
          case "ArrowUp":
          case "ArrowDown": {
            if (!showMenu) {
              setShowMenu(true);
              break;
            }
            const newValue =
              highlightedOptionIndex + (e.code === "ArrowDown" ? 1 : -1);
            if (newValue >= 0 && newValue < (visibleOptions?.length || 0)) {
              setHighlighterOptionIndex(newValue);
            }
            break;
          }
        }
      };

      const selectHandler = containerElem ? handler(containerElem) : null;
      const searchHandler = searchElem ? handler(searchElem) : null;

      if (selectHandler)
        containerElem?.addEventListener("keydown", selectHandler);

      if (searchHandler) searchElem?.addEventListener("keydown", searchHandler);

      return () => {
        if (selectHandler)
          containerElem?.removeEventListener("keydown", selectHandler);

        if (searchHandler)
          searchElem?.removeEventListener("keydown", searchHandler);
      };
    }, [
      highlightedOptionIndex,
      visibleOptions,
      showMenu,
      onOptionClick,
      isMulti,
      isSearchable,
    ]);

    const onSelectBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
      const relatedElem = e.relatedTarget;
      if (
        relatedElem !== containerRef.current &&
        relatedElem !== searchRef.current
      ) {
        setShowMenu(false);
      }
    };

    const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab") {
        setShowMenu(false);
        containerRef.current?.focus();
      }
    };

    return (
      <div
        tabIndex={0}
        role="button"
        className={
          "component-select " +
          (disabled ? "unavailable  " : "") +
          (error ? "error  " : "") +
          ("direction-" + direction + " ") +
          (showMenu ? "is-open " : "") +
          (className ?? "")
        }
        ref={containerRef}
        onBlur={onSelectBlur}
      >
        {label && (
          <span className="select-label">
            {label}
            {required ? <span className="asterisk">*</span> : ""}
          </span>
        )}
        <div ref={inputRef} onClick={handleInputClick} className="select-input">
          <div className="content-input">
            {preppend}
            {getDisplay()}
          </div>
          <div className="icons">
            {clearable && isCrossVisible && (
              <SvgCross
                className={"icon cross hoverable "}
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
              />
            )}
            <SvgChevronDown
              className={showMenu ? "icon upside " : "icon hoverable"}
            />
          </div>
        </div>
        {showMenu &&
          ReactDOM.createPortal(
            <div
              ref={measuredRef}
              className={
                "component dropdown " +
                (optionsDirection === SelectDirection.Up ||
                direction === SelectDirection.Up
                  ? "upside "
                  : "") +
                (small ? "small" : "")
              }
              style={{ ...coords }}
            >
              {isSearchable && (
                <div className="search-box">
                  <input
                    onKeyDown={onSearchKeyDown}
                    placeholder="Pesquisar"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setSearchValue(e.target.value)}
                    value={searchValue}
                    ref={searchRef}
                  />
                </div>
              )}

              {headerContent && (
                <div
                  onClick={headerOnClick}
                  className={`select header-content ${
                    headerContentClassName ?? ""
                  }`}
                >
                  {headerContent}
                </div>
              )}

              <div ref={optionsContainerRef} className="options">
                {visibleOptions.length > 0 ? (
                  visibleOptions.map((option, index) => (
                    <div
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        if (hasCheckbox) {
                          e.stopPropagation();
                        } else {
                          e.stopPropagation();
                          onOptionClick(option);
                        }
                      }}
                      key={`${index}_${option.label?.toString() || ""}`}
                      className={
                        `option ${isSelected(option) ? "selected" : ""} ` +
                        (option.disabled ? "disabled" : "") +
                        (index === highlightedOptionIndex ? " highlighted" : "")
                      }
                    >
                      {hasCheckbox ? (
                        <label className="checkbox-team">
                          <input
                            type="checkbox"
                            checked={isSelected(option)}
                            disabled={option.disabled}
                            onChange={() => onOptionClick(option)}
                          />
                          <span>{option.label}</span>
                        </label>
                      ) : (
                        option.label
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-items">
                    <span>Sem resultados</span>
                  </div>
                )}
                {optionsLoading && (
                  <div className="loading">
                    <SvgSync />
                  </div>
                )}
              </div>
            </div>,
            document.getElementById("root") as HTMLElement
          )}
        {!noError && <small className="error">{error}</small>}
      </div>
    );
  }
) as <T, IsMulti extends boolean = false>(
  p: IProps<T, IsMulti> & { ref?: Ref<HTMLDivElement> }
) => ReactElement;

interface TagIProps {
  removable?: boolean;
  onTagRemove?: () => void;
  children?: React.ReactNode;
  noBackground?: boolean;
  plusSymbolTag?: boolean;
}

const Tag = ({
  onTagRemove,
  removable,
  children,
  noBackground = false,
  plusSymbolTag = false,
}: TagIProps) => {
  return (
    <div
      className={
        "component-tag " +
        (noBackground ? "no-background " : "") +
        (plusSymbolTag ? "plus-tag " : "")
      }
    >
      <div className="tag-content">{children}</div>
      {removable && (
        <SvgCross
          className="remove"
          onClick={(e) => {
            e.stopPropagation();
            onTagRemove?.();
          }}
        />
      )}
    </div>
  );
};

export { Select, Tag };
