import {createContext, useContext, useMemo, useState} from "react";

export const FilterParamsContext = createContext({
    year: 0,
    month: 0,
    country: null,
    timePeriod: null,
    text: null,
    setYear: () => console.log('set year'),
    setMonth: () => console.log('set month'),
    setCountry: () => console.log('set country'),
    setTimePeriod: () => console.log('set time period'),
    setText: () => console.log('set text')
});

export function FilterParamsProvider({children}) {
    const [year, setYear] = useState(0);
    const [month, setMonth] = useState(0);
    const [country, setCountry] = useState("");
    const [timePeriod, setTimePeriod] = useState("");
    const [text, setText] = useState("")

    const value = useMemo(() => ({
        year,
        month,
        country,
        timePeriod,
        text,
        setYear,
        setMonth,
        setCountry,
        setTimePeriod,
        setText
    }), [year, month, country, timePeriod, text]);

    return (
        <FilterParamsContext.Provider value={value}>{children}</FilterParamsContext.Provider>
    );
}

export function useFilterParams() {
    return useContext(FilterParamsContext);
}
