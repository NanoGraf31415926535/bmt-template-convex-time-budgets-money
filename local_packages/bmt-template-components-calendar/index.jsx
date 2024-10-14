import React from "react";
import PropTypes from "prop-types";
import style from "./CalendarView.module.css";
import { useTranslation } from "react-i18next";

// todo: i18n requirement. Language handling.

const CalendarView = ({ startDate, endDate }) => {
    const { i18n } = useTranslation();
    const lang = i18n.language ?? "en";
    const calendars = createCalendar(startDate, endDate, lang);

    function createCalendar(startDate, endDate, language) {
        const today = new Date();
        const monthsBetweenCount = monthDiff(today, endDate);
        const startMonthIndex = startDate.getMonth();
        const year = startDate.getFullYear();
        let monthIndex = startMonthIndex;

        const calendars = [];

        for (let i = 0; i <= monthsBetweenCount; i++) {
            const days = getDaysInMonth(monthIndex, year);

            // Calculate the number of days to pad at the beginning of the week in a calendar display.
            // If the first day is not Sunday, use the day of the week minus one. Otherwise, pad six days.
            const numOfDaysToPad = days[0].getDay() - 1 !== -1 ? days[0].getDay() - 1 : 6;
            const calendarElem = (
                <div className="max-w-64" key={i}>
                    <div className="px-2 py-1 w-full rounded-t text-center bg-blue-950">
                        <ul>
                            <li className="color-white text-white text-sm whitespace-nowrap overflow-hidden text-ellipsis uppercase tracking-wider">
                                {days[0].toLocaleString(language, { month: "long" })}{" "}
                                <span>{days[0].getFullYear()}</span>
                            </li>
                        </ul>
                    </div>
                    <ul className="w-full bg-gray-100 flex text-sm py-1">
                        {getWeekDays(language).map((day) => (
                            <li className="inline-block w-[calc(100%/7)] text-gray-500 text-center" key={day}>
                                {day.slice(0, 2)}
                            </li>
                        ))}
                    </ul>
                    <ul className="w-full bg-slate-200 rounded-b flex flex-wrap text-sm">
                        {Array(numOfDaysToPad)
                            .fill(1)
                            .map((_, i) => (
                                <li
                                    className="inline-block w-[calc(100%/7)] text-gray-500 text-center"
                                    key={i}
                                ></li>
                            ))}
                        {days.map((day) => {
                            const formattedDay = formatDate(day);
                            let className = "inline-block w-[calc(100%/7)] text-gray-500 text-center ";
                            if (formattedDay === formatDate(startDate)) {
                                className += ` ${style.startDate}`;
                            } else if (formattedDay === formatDate(endDate)) {
                                className += ` ${style.endDate}`;
                            } else if (day < endDate && day > startDate) {
                                className += ` ${style.intermediateDate}`;
                            }
                            if (formattedDay === formatDate(today)) {
                                className += ` ${style.todayDate}`;
                            }
                            return (
                                <li id={formattedDay} className={`${className}`} key={formattedDay}>
                                    {day.getDate()}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );

            calendars.push(calendarElem);
            monthIndex += 1;
        }
        return calendars;
    }

    return (
        <div className="my-4 flex flex-wrap justify-center gap-2 sm:gap-6">
            {calendars}
        </div>
    );
};


// Utilities.
function getDaysInMonth(month, year) {
    const date = new Date(year, month, 1);
    const days = [];

    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

function getWeekDays(locale) {
    const baseDate = new Date(Date.UTC(2017, 0, 2)); // A monday
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        weekDays.push(baseDate.toLocaleDateString(locale, { weekday: "long" }));
        baseDate.setDate(baseDate.getDate() + 1);
    }
    return weekDays;
}

function padDigits(num, padding = 2) {
    return num.toString().padStart(padding, "0");
}

function formatDate(date) {
    return [padDigits(date.getDate()), padDigits(date.getMonth() + 1), date.getFullYear()].join("-");
}

function monthDiff(d1, d2) {
    let months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

// Type checking.
CalendarView.propTypes = {
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
};

// Exports.
export default CalendarView;
