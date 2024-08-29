import DataTable from "./DataTable.jsx";
import {useState} from "react";

function Sidebar({arrests, selectedArrest, onSelectArrest, period, onSelectPeriod}) {

    const [country, setCountry] = useState("PL")

    return (
        <div className="sidebar">
            <form>
                <select value={country} onChange={e => setCountry(e.target.value)}>
                    <option value="PL">Польща</option>
                    <option value="SK">Словаччина</option>
                    <option value="HU">Угорщина</option>
                    <option value="RO">Румунія</option>
                    <option value="MD">Молдова</option>
                    <option value="BY">Білорусь</option>
                    <option value="?">невизначено</option>
                </select>
                <select value={period} onChange={e => onSelectPeriod(parseInt(e.target.value))}>
                    <option value="12">Останні 12 місяців</option>
                    <option value="6">Останні 6 місяців</option>
                    <option value="2">Останні 2 місяці</option>
                </select>
            </form>
            <div className="table-container">
                <DataTable country={country} period={period} arrests={arrests} selectedArrest={selectedArrest}
                           onSelectArrest={onSelectArrest}/>
            </div>
        </div>
    );
}

export default Sidebar



