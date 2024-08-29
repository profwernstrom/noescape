import DataTable from "./DataTable.jsx";
import {useState} from "react";

function Sidebar({arrests, selectedArrest, onSelectArrest}) {

    const [country, setCountry] = useState("PL")
    const [year, setYear] = useState("2024")

    return (
        <div className="sidebar">
            <form>
                <label>Кордон:
                    <select value={country} onChange={e => setCountry(e.target.value)}>
                        <option value="PL">Польща</option>
                        <option value="SK">Словаччина</option>
                        <option value="HU">Угорщина</option>
                        <option value="RO">Румунія</option>
                        <option value="MD">Молдова</option>
                        <option value="BY">Білорусь</option>
                        <option value="?">невизначено</option>
                    </select>
                </label>
                <label>Рік:
                    <select value={year} onChange={e => setYear(e.target.value)}>
                        <option value="2024">2024</option>
                    </select>
                </label>
            </form>
            <div className="table-container">
                <DataTable country={country} arrests={arrests} selectedArrest={selectedArrest}
                           onSelectArrest={onSelectArrest}/>
            </div>
        </div>
    );
}

export default Sidebar



