import {createContext, useContext, useMemo, useState} from "react";

export const FilterParamsContext = createContext({
    year: 0,
    month: 0,
    country: null,
    timePeriod: null,
    setYear: () => console.log('set year'),
    setMonth: () => console.log('set month'),
    setCountry: () => console.log('set country'),
    setTimePeriod: () => console.log('set time period')
});

export function FilterParamsProvider({children}) {
    const [year, setYear] = useState(0);
    const [month, setMonth] = useState(0);
    const [country, setCountry] = useState("");
    const [timePeriod, setTimePeriod] = useState("");

    const value = useMemo(() => ({
        year,
        month,
        country,
        timePeriod,
        setYear,
        setMonth,
        setCountry,
        setTimePeriod
    }), [year, month, country, timePeriod]);

    return (
        <FilterParamsContext.Provider value={value}>{children}</FilterParamsContext.Provider>
    );
}

export function useFilterParams() {
    return useContext(FilterParamsContext);
}
