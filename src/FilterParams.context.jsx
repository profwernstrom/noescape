import {createContext, useCallback, useContext, useMemo, useState} from "react";

export const FilterParamsContext = createContext({
    year: null,
    month: null,
    country: null,
    fromTime: null,
    toTime: null,
    text: null,
    setYear: () => console.log('set year'),
    setMonth: () => console.log('set month'),
    setCountry: () => console.log('set country'),
    setText: () => console.log('set text')
});

export function FilterParamsProvider({children}) {
    const [year, setYear] = useState(0);
    const [month, setMonth] = useState(0);
    const [country, setCountry] = useState("");
    const [fromTime, setFromTime] = useState("");
    const [toTime, setToTime] = useState("");
    const [text, setText] = useState("");

    const handleSelectTimePeriod = useCallback((timePeriod) => {
        const split = timePeriod.split('-');
        setFromTime(split[0]);
        setToTime(split[1]);
    }, []);

    const value = useMemo(() => ({
        year,
        month,
        country,
        fromTime,
        toTime,
        text,
        setYear,
        setMonth,
        setCountry,
        setText,
        handleSelectTimePeriod
    }), [year, month, country, fromTime, toTime, text, handleSelectTimePeriod]);

    return (
        <FilterParamsContext.Provider value={value}>{children}</FilterParamsContext.Provider>
    );
}

export function useFilterParams() {
    return useContext(FilterParamsContext);
}
