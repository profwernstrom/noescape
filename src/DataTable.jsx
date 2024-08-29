import {useEffect, useState} from "react";
import {formatDate} from "./util.js";


function DataTable({country, arrests, selectedArrest, onSelectArrest}) {

    const [sortBy, setSortBy] = useState('arrestDate');
    const [sortDirection, setSortDirection] = useState(1);

    const filterData = (arrest) => (arrest.country || '?') === country;

    const sortData = (a, b) => {
        let aa = a[sortBy];
        let bb = b[sortBy];
        if (sortBy === 'borderSign' || sortBy === 'fine') {
            aa = aa ? aa.padStart('7') : 'ZZZZZZZ'; // Put unknown to the end
            bb = bb ? bb.padStart('7') : 'ZZZZZZZ';
        }
        return (aa === null) - (bb === null) || +(aa > bb) * sortDirection || -(aa < bb) * sortDirection;
    };

    const scrollToArrest = (arrest) => {
        if (arrest) {
            const tr = document.getElementById('tr-' + arrest.id);
            if (tr) {
                const rect = tr.getBoundingClientRect();
                const isOutsideViewport = rect.top < 0 || rect.bottom > (window.innerHeight || document.documentElement.clientHeight);
                if (isOutsideViewport) {
                    tr.scrollIntoView({block: 'center'});
                }
            }
        }
    }

    const toggleSort = (by) => {
        if (sortBy === by) {
            setSortDirection(-sortDirection);
        } else {
            setSortBy(by);
        }
    };

    useEffect(() => {
        scrollToArrest(selectedArrest);
    }, [sortBy, sortDirection, selectedArrest]);

    return (
        <table>
            <thead>
            <tr>
                <th title="Номер прикордонного знаку" onClick={() => toggleSort('borderSign')}>Знак</th>
                <th title="Дата та час затримання" onClick={() => toggleSort('arrestDate')}>Дата</th>
                <th title="Відстань до кордону" onClick={() => toggleSort('distance')}>Відстань</th>
            </tr>
            </thead>
            <tbody>
            {arrests.filter(filterData).sort(sortData).map((arrest) => (
                <tr key={arrest.id}
                    id={'tr-' + arrest.id}
                    className={arrest === selectedArrest ? 'selected' : ''}
                    onClick={() => onSelectArrest(arrest)}>
                    <td>{arrest.borderSign}</td>
                    <td>{formatDate(arrest.arrestDate)}</td>
                    <td>{arrest.distance || '?'}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default DataTable;