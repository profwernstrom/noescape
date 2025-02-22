import {useFilterParams} from "./FilterParams.context.jsx";

function Filters() {
    const {
        year,
        month,
        country,
        timePeriod,
        setYear,
        setMonth,
        setCountry,
        setTimePeriod
    } = useFilterParams();

    return (
        <div className="filter-container">
            <div className="filter-parameter">
                <div className="inner">
                    <select value={year} onChange={e => setYear(parseInt(e.target.value))}>
                        <option defaultValue="0" value={0}>Останні 12 місяців</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                    </select>
                    <select value={month} onChange={e => setMonth(parseInt(e.target.value))}>
                        <option defaultValue="0" value={0}>Всі місяці</option>
                        <option value="1">Січень</option>
                        <option value="2">Лютий</option>
                        <option value="3">Березень</option>
                        <option value="4">Квітень</option>
                        <option value="5">Травень</option>
                        <option value="6">Червень</option>
                        <option value="7">Липень</option>
                        <option value="8">Серпень</option>
                        <option value="9">Вересень</option>
                        <option value="10">Жовтень</option>
                        <option value="11">Листопад</option>
                        <option value="12">Грудень</option>
                    </select>
                    <select value={timePeriod} onChange={e => setTimePeriod(e.target.value)}>
                        <option defaultValue="null" value="">Будь-який час</option>
                        <option value="22:00-06:00">22:00 - 06:00</option>
                        <option value="06:00-10:00">06:00 - 10:00</option>
                        <option value="10:00-18:00">10:00 - 18:00</option>
                        <option value="18:00-22:00">18:00 - 22:00</option>
                    </select>
                </div>
            </div>
            <div className="filter-parameter">
                <select value={country} onChange={e => setCountry(e.target.value)}>
                    <option defaultValue="null" value="">Всі країни</option>
                    <option value="PL">Польща</option>
                    <option value="SK">Словаччина</option>
                    <option value="HU">Угорщина</option>
                    <option value="RO">Румунія</option>
                    <option value="MD">Молдова</option>
                    <option value="BY">Білорусь</option>
                </select>
            </div>
        </div>
    );
}

export default Filters;
