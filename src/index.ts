import { HistoricalDates } from './HistoricalDates/HistoricalDates';
import { TimePeriod } from './HistoricalDates/types';
import './HistoricalDates/styles.scss';

const mockData: TimePeriod[] = [
  {
    id: 1,
    title: 'Технологии',
    startYear: 2010,
    endYear: 2014,
    events: [
      { year: 2010, description: 'Выход iPhone 4, изменившего индустрию смартфонов.' },
      { year: 2012, description: 'Марсоход Curiosity успешно приземлился на поверхность Марса.' },
      { year: 2014, description: 'Запуск миссии Rosetta по посадке на комету.' }
    ]
  },
  {
    id: 2,
    title: 'Кино',
    startYear: 2015,
    endYear: 2022,
    events: [
      { year: 2015, description: 'Премьера фильма "Безумный Макс: Дорога ярости".' },
      { year: 2019, description: 'Завершение саги "Мстители: Финал".' },
      { year: 2022, description: 'Выход долгожданного сиквела "Аватар: Путь воды".' }
    ]
  },
  // Можно добавить до 6 объектов
];

document.addEventListener('DOMContentLoaded', () => {
  new HistoricalDates('#historical-dates-container', mockData);
});