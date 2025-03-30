"use client";

import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";

import "react-datepicker/dist/react-datepicker.css";

const CalendarDataTable = ({
    values,
    setValues,
    disabledDates,
    translations,
    title,
    isReadOnly = false
}) => {
  useEffect(() => {
    if (isReadOnly || values.length === 5) {
      return;
    }

    let emptyRows = [];

    for (let i = 0; i < 5 - values.length; i++) {
      emptyRows.push({
        id: Math.random(),
        startDate: undefined,
        endDate: undefined,
      });
    }

    setValues([...values, ...emptyRows]);
  }, []); 

  const handleDateChange = (id, dateInput) => {
    if (isReadOnly) {
      return;
    }

    const [startDate, endDate] = dateInput;

    if (disabledDates !== undefined && disabledDates.some((date) => startDate <= new Date(date) && endDate >= new Date(date))) {
      toast.error(translations.errorWhenDisabledDateIsSelected);
      return;
    }

    setValues(
      values.map((row) =>
        row.id === id
          ? { ...row, startDate: startDate, endDate: endDate }
          : row
      )
    );
  };

  return (
    <div className="pt-4 z-51">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {
              title !== undefined ?
                <th className="border px-4 py-2">{title}</th> :
                <th className="border px-4 py-2">{translations.startDate} - {translations.endDate}</th>
            }
          </tr>
        </thead>
        <tbody>
          {
            values.map((row) => (
              <tr key={row.id} className="border text-center">
                <td colSpan="100%" className="text-center border px-4 py-2">
                  <DatePicker
                    selectsRange
                    isClearable={isReadOnly ? false : true}
                    selected={row.startDate}
                    startDate={row.startDate}
                    endDate={row.endDate}
                    onChange={(date) => { handleDateChange(row.id, date); }}
                    excludeDates={disabledDates?.map((date) => new Date(date)) || []}
                    placeholderText={translations.calendarPlaceHolder}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default CalendarDataTable;