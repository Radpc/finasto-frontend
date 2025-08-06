import React, { useEffect, useRef, useState } from "react";
import ReactDatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale/pt-BR";
import "./_styles.scss";
import { Input } from "../Input";
import { Button } from "../Button";
import SvgCalendar from "@/assets/img/icons/Calendar.svg?react";
import { DateTime } from "luxon";

export enum DateRangeOption {
  Today = "Hoje",
  LastWeek = "Últimos 7 dias",
  LastMonth = "Últimos 30 dias",
  CurrentMonth = "Mês atual",
  // SelectRange = "Selecione um período",
}

interface Props {
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
  value?: (Date | null)[];
  label?: React.ReactNode;
  error?: string;
  required?: boolean;
  noError?: boolean;
  clearable?: boolean;
  defaultRangeSelected?: DateRangeOption;
}

const SelectDatePicker = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      onDateRangeChange,
      error,
      label,
      value,
      noError,
      required,
      clearable = true,
      defaultRangeSelected = DateRangeOption.Today,
    },
    ref
  ) => {
    const datePickerRef = useRef<ReactDatePicker>(null);

    const [rangeSelected, setRangeSelected] =
      useState<DateRangeOption>(defaultRangeSelected);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    useEffect(() => {
      const [start, end] = value || [null, null];

      if (start) {
        if (
          !startDate ||
          !DateTime.fromJSDate(start).hasSame(
            DateTime.fromJSDate(startDate),
            `day`
          )
        ) {
          setStartDate(start);
        }
      }

      if (end) {
        if (
          !endDate ||
          !DateTime.fromJSDate(end).hasSame(DateTime.fromJSDate(endDate), `day`)
        ) {
          setEndDate(end);
        }
      }
    }, [value]);

    const onDateChange = (dates: [Date | null, Date | null]) => {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
    };

    const onClearDate = () => {
      setRangeSelected(DateRangeOption.Today);
      setStartDate(null);
      setEndDate(null);
      setDatePickerOpen(false);
    };

    const setDatePickerOpen = (open: boolean) => {
      datePickerRef.current?.setOpen(open);
    };

    const handleRangeSelectChange = (range: DateRangeOption) => {
      const date = new Date();
      setRangeSelected(range);

      switch (range) {
        case DateRangeOption.Today:
          setStartDate(date);
          setEndDate(date);
          setDatePickerOpen(false);
          break;
        case DateRangeOption.LastWeek:
          setStartDate(new Date(date.setDate(date.getDate() - 7)));
          setEndDate(new Date());
          setDatePickerOpen(false);
          break;
        case DateRangeOption.LastMonth:
          setStartDate(new Date(date.setDate(date.getDate() - 30)));
          setEndDate(new Date());
          setDatePickerOpen(false);
          break;
        case DateRangeOption.CurrentMonth:
          setStartDate(DateTime.now().startOf("month").toJSDate());
          setEndDate(DateTime.now().endOf("month").toJSDate());
          setDatePickerOpen(false);
          break;
        // case DateRangeOption.SelectRange:
        //   setStartDate(startDate ?? null);
        //   setEndDate(endDate ?? null);
        //   break;
        default:
          setStartDate(null);
          setEndDate(null);
          break;
      }
    };

    useEffect(() => {
      onDateRangeChange(startDate, endDate);
    }, [startDate, endDate]);

    const MyContainer = ({
      className,
      children,
    }: {
      className: string;
      children: React.ReactElement;
    }) => {
      return (
        <div className="select-date-picker">
          <div className="left">
            <div className="options">
              {Object.values(DateRangeOption).map((option) => (
                <Button
                  key={option}
                  onClick={() => handleRangeSelectChange(option)}
                  className={`option ${
                    option === rangeSelected ? "selected" : ""
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
            {clearable && (
              <Button
                disabled={!clearable}
                onClick={onClearDate}
                className="clear-button"
              >
                Limpar tudo
              </Button>
            )}
          </div>
          <CalendarContainer className={className}>
            <div>{children}</div>
          </CalendarContainer>
        </div>
      );
    };

    return (
      <div className="component component-select-date-picker">
        <ReactDatePicker
          ref={datePickerRef}
          customInput={
            <Input
              noError={noError}
              label={label}
              preppend={<SvgCalendar />}
              error={error}
              ref={ref}
              readOnly
            />
          }
          calendarClassName="date-picker-select"
          calendarContainer={MyContainer}
          placeholderText="Selecione o período"
          locale={ptBR}
          shouldCloseOnSelect
          required={required}
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={onDateChange}
          maxDate={new Date()}
          showPopperArrow={false}
          formatWeekDay={(day) => day.charAt(0).toUpperCase()}
          dateFormat="dd/MM/yyyy"
          onClickOutside={() => setDatePickerOpen(false)}
        />
      </div>
    );
  }
);

SelectDatePicker.displayName = "select-date-picker";

export { SelectDatePicker };
