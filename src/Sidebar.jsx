import React, {useState} from 'react';

const Sidebar = () => {
    const [openSection, setOpenSection] = useState('first');

    const toggleAccordion = (section) => {
        setOpenSection((prev) => (prev === section ? null : section));
    };

    return (
        <div className="sidebar">
            <div className="accordion">
                <div className="accordion-item">
                    <button className={`accordion-button ${openSection === 'first' ? 'active' : ''}`}
                            onClick={() => toggleAccordion('first')}>
                        Поширені запитання
                    </button>
                    <div className={`accordion-body ${openSection === 'first' ? 'open' : ''}`}>
                        <dl className="faq-dl">
                            <dt>Чому одні кружки сині, а інші червоні?</dt>
                            <dd>Кожен кружок має число - це кількість затримань.
                                Якщо число більше 100, то він червоний, якщо меньше то синій.
                            </dd>
                            <dt>Звідки всі ці дані?</dt>
                            <dd>З відкритого єдиного державного <a href="https://reyestr.court.gov.ua/">реєстру</a> судових рішень.</dd>
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
                            <dt>Чи всі затримання позначено на карті?</dt>
                            <dd>Ні. Тексти деяких судових рішень не мають достатньо інформації щоб визначити місце хоча б приблизно. До того ж не відомо
                                чи по всім затриманням складається протокол, чи всі протоколи потрапляють до суду, чи всі рішення суду оприлюднюються.
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
                <div className="accordion-item">
                    <button className={`accordion-button ${openSection === 'second' ? 'active' : ''}`}
                            onClick={() => toggleAccordion('second')}>
                        Посилання
                    </button>
                    <div className={`accordion-body ${openSection === 'second' ? 'open' : ''}`}>
                        <div className="icons">
                            <a href="data/спроби_перетинання_кордону.xlsx" target="_blank" rel="nofollow" download>
                                Excel файл з усіма даними
                            </a>
                            <a href="data/text.zip" target="_blank" rel="nofollow" download>
                                Тексти всіх судових рішень
                            </a>
                            <a href="data/arrests.kmz" target="_blank" rel="nofollow" download>
                                KML файл з останніми даннимі для завантаження на іншу карту
                            </a>
                            <a href="data/arrests-kml.zip" target="_blank" rel="nofollow" download>
                                Всі KML файли для завантаження на іншу карту
                            </a>
                            <a href="https://github.com/profwernstrom?tab=repositories" target="_blank" rel="nofollow">
                                Подивитись код на GitHub
                            </a>
                            <a href="https://t.me/profwernstrom" target="_blank" rel="nofollow">
                                Звʼязатися з автором по Telegram
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
