import React, {useState} from 'react';
import DataTable from "./DataTable.jsx";

const Sidebar = ({arrests, selectedArrest, onSelectArrest, period, onSelectPeriod}) => {
    const [country, setCountry] = useState("PL")

    return (
        <div className="sidebar">
            <div className="icons">
                <a href="data/спроби_перетинання_кордону.xlsx" target="_blank" rel="nofollow" download><img
                    src="excel-32x32.png" alt="excel" width="32" height="32"/></a>
                <a href="data/arrests.kml" target="_blank" rel="nofollow" download><img
                    src="kml-32x32.png" alt="kml" width="32" height="32"/></a>
                <a href="https://github.com/profwernstrom/noescape" target="_blank" rel="nofollow"><img
                    src="github-mark-32x32.png" alt="github" width="32" height="32"/></a>
                <a href="https://t.me/profwernstrom" target="_blank" rel="nofollow"><img
                    src="telegram-32x32.png" alt="github" width="32" height="32"/></a>
            </div>
            <form>
                <select value={country} onChange={e => setCountry(e.target.value)}>
                    <option value="PL">Польща</option>
                    <option value="SK">Словаччина</option>
                    <option value="HU">Угорщина</option>
                    <option value="RO">Румунія</option>
                    <option value="MD">Молдова</option>
                    <option value="BY">Білорусь</option>
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
};

export default Sidebar;
