"use client";

import { DateRange } from "react-date-range";
import { srLatn, enUS } from "date-fns/locale";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const Calendar = ({
  value,
  onChange,
  disabledDates,
  readonly = false,
  locale,
  customDayRenderer = undefined,
}) => {
  return (
    <DateRange
      className={readonly ? "readonly-date-range" : ""}
      rangeColors={["#383838"]}
      ranges={[value]}
      date={new Date()}
      onChange={onChange}
      direction="vertical"
      showDateDisplay={false}
      minDate={new Date()}
      disabledDates={disabledDates}
      locale={locale === "sr" ? srLatn : enUS}
      dayContentRenderer={customDayRenderer}
    />
  );
};

export default Calendar;
