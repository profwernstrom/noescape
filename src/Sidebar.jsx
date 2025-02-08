import React, {useState} from 'react';
import DataTable from "./DataTable.jsx";

const Sidebar = ({arrests, selectedArrest, onSelectArrest, period, onSelectPeriod}) => {
    const [country, setCountry] = useState("PL")
    const [openSection, setOpenSection] = useState("first");

    const toggleAccordion = (section) => {
        setOpenSection((prev) => (prev === section ? null : section));

    };

    return (
        <div className="sidebar">
            <div className="accordion">
                <div className="accordion-item">
                    <button className={`accordion-button ${openSection === 'first' ? 'active' : ''}`}
                            onClick={() => toggleAccordion("first")}>
                        Місця затримань
                    </button>
                    <div className={`accordion-body ${openSection === 'first' ? 'open' : ''}`}>
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
                            <DataTable country={country} arrests={arrests} selectedArrest={selectedArrest}
                                       onSelectArrest={onSelectArrest}/>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <button className={`accordion-button ${openSection === 'second' ? 'active' : ''}`}
                            onClick={() => toggleAccordion("second")}>
                        Посилання
                    </button>
                    <div className={`accordion-body ${openSection === 'second' ? 'open' : ''}`}>
                        <div className="icons">
                            <a href="data/спроби_перетинання_кордону.xlsx" target="_blank" rel="nofollow" download
                               title="Excel файл з усіма даними">
                                <img src="excel-32x32.png" alt="excel" width="32" height="32"/>
                                Excel файл з усіма даними
                            </a>
                            <a href="data/arrests.kml" target="_blank" rel="nofollow" download
                               title="Завантажити у іншу мапу (Google Earth та інші)">
                                <img src="kml-32x32.png" alt="kml" width="32" height="32"/>
                                Завантажити у іншу карту (Google Earth)
                            </a>
                            <a href="https://github.com/profwernstrom/noescape" target="_blank" rel="nofollow"
                               title="Подивитись код на GitHub">
                                <img src="github-mark-32x32.png" alt="github" width="32" height="32"/>
                                Подивитись код на GitHub
                            </a>
                            <a href="https://t.me/profwernstrom" target="_blank" rel="nofollow"
                               title="Зв'язатися з автором по Telegram">
                                <img src="telegram-32x32.png" alt="github" width="32" height="32"/>
                                Зв'язатися з автором по Telegram
                            </a>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <button className={`accordion-button ${openSection === 'third' ? 'active' : ''}`}
                            onClick={() => toggleAccordion("third")}>
                        Поширені запитання
                    </button>
                    <div className={`accordion-body ${openSection === 'third' ? 'open' : ''}`}>
                        <dl className="faq-dl">
                            <dt>Чому одні кружки сині, а інші червоні?</dt>
                            <dd>Кожен кружок має число - це кількість затримань.
                                Якщо число більше середнього значення, то він червоний, якщо меньше то синій.
                            </dd>
                            <dt>Звідки всі ці дані?</dt>
                            <dd>З єдиного державного <a href="https://reyestr.court.gov.ua/">реєстру</a> судових рішень.</dd>
                            <dt>Чому в Чернівцях так мало затримань? Там хапають людей кожен день.</dt>
                            <dd>На цієї карті відмічені тільки затримання ДПСУ. Даних по ТЦК нема.</dd>
                            <dt>Наскільки точна ця карта?</dt>
                            <dd>Тексти судових рішень не містять координат затримання. Тож маркери ставляться по принципу «невідомо де саме, нехай буде десь
                                тут». До того ж, судові рішення можуть мати помилки, або прикордонники можуть вказати інше місце в протоколі.
                            </dd>
                            <dt>Скільки часу проходить з моменту затримання до потрапляння на карту?</dt>
                            <dd>Дуже по-різному. Інколи кілька днів, але зазвичай кілька тижнів.</dd>
                            <dt>Куди подівся маркер? Вчора він тут був!</dt>
                            <dd>На карті відображаються дані за останній час. Якщо затримання стало застаре, воно прибирається з карти.
                                Або координати маркера було уточнено, та він перемістився в інше місце.
                            </dd>
                            <dt>Як знайти прикордонні стовпи на карті?</dt>
                            <dd>Їх можна побачити при великому зумі. Але на карті позначено тільки ті стовпи які згадуються в судових рішеннях.
                                Також треба мати на увазі, що розташування стовпів на кородоні з Беларусією та ПМР не відомо, тож вони позначені дуже
                                приблизно.
                            </dd>
                            <dt>Хто оновлює цю карту?</dt>
                            <dd>Карта оновлюється автоматично за допомогою нейронної мережі та Google Geocode.
                                Це <a href="https://t.me/profwernstrom">мій</a> хобі-проект.
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
