import { useState } from "react";
import styles from "./RegionModal.module.scss";

const regions: { slug: string; name: string }[] = [
  { slug: "moskva", name: "Москва" },
  { slug: "spb", name: "Санкт-Петербург" },
  { slug: "rostov", name: "Ростов-на-Дону" },
  { slug: "ekaterinburg", name: "Екатеринбург" },
  { slug: "krasnodar", name: "Краснодар" },
  { slug: "makhachkala", name: "Махачкала" },
  { slug: "novosibirsk", name: "Новосибирск" },
  { slug: "nnovgorod", name: "Нижний Новгород" },
  { slug: "tyumen", name: "Тюмень" },
  { slug: "samara", name: "Самара" },
  { slug: "kazan", name: "Казань" },
  { slug: "sochi", name: "Сочи" },
  { slug: "kaluga", name: "Калуга" },
  { slug: "grozny", name: "Грозный" },
  { slug: "ufa", name: "Уфа" },
  { slug: "voronezh", name: "Воронеж" },
  { slug: "chelyabinsk", name: "Челябинск" },
  { slug: "krasnoyarsk", name: "Красноярск" },
  { slug: "omsk", name: "Омск" },
  { slug: "volgograd", name: "Волгоград" },
  { slug: "orenburg", name: "Оренбург" },
  { slug: "perm", name: "Пермь" },
  { slug: "saratov", name: "Саратов" },
  { slug: "togliatti", name: "Тольятти" },
  { slug: "barnaul", name: "Барнаул" },
  { slug: "izhevsk", name: "Ижевск" },
  { slug: "khabarovsk", name: "Хабаровск" },
  { slug: "ulyanovsk", name: "Ульяновск" },
  { slug: "irkutsk", name: "Иркутск" },
  { slug: "vladivostok", name: "Владивосток" },
  { slug: "yaroslavl", name: "Ярославль" },
  { slug: "stavropol", name: "Ставрополь" },
  { slug: "sevastopol", name: "Севастополь" },
  { slug: "nabchelny", name: "Набережные Челны" },
  { slug: "tomsk", name: "Томск" },
  { slug: "balashikha", name: "Балашиха" },
  { slug: "kemerovo", name: "Кемерово" },
  { slug: "novokuznetsk", name: "Новокузнецк" },
  { slug: "ryazan", name: "Рязань" },
  { slug: "cheboksary", name: "Чебоксары" },
  { slug: "kaliningrad", name: "Калининград" },
  { slug: "penza", name: "Пенза" },
  { slug: "lipetsk", name: "Липецк" },
  { slug: "kirov", name: "Киров" },
  { slug: "astrakhan", name: "Астрахань" },
  { slug: "tula", name: "Тула" },
  { slug: "ulanude", name: "Улан-Удэ" },
  { slug: "kursk", name: "Курск" },
  { slug: "surgut", name: "Сургут" },
  { slug: "tver", name: "Тверь" },
  { slug: "magnitogorsk", name: "Магнитогорск" },
  { slug: "yakutsk", name: "Якутск" },
  { slug: "bryansk", name: "Брянск" },
  { slug: "ivanovo", name: "Иваново" },
  { slug: "vladimir", name: "Владимир" },
  { slug: "chita", name: "Чита" },
  { slug: "belgorod", name: "Белгород" },
  { slug: "podolsk", name: "Подольск" },
  { slug: "volzhsky", name: "Волжский" },
  { slug: "vologda", name: "Вологда" },
  { slug: "smolensk", name: "Смоленск" },
  { slug: "saransk", name: "Саранск" },
  { slug: "kurgan", name: "Курган" },
  { slug: "cherepovets", name: "Череповец" },
  { slug: "arkhangelsk", name: "Архангельск" },
  { slug: "vladikavkaz", name: "Владикавказ" },
  { slug: "orel", name: "Орёл" },
  { slug: "yoshkarola", name: "Йошкар-Ола" },
  { slug: "sterlitamak", name: "Стерлитамак" },
  { slug: "kostroma", name: "Кострома" },
  { slug: "murmansk", name: "Мурманск" },
  { slug: "novorossiysk", name: "Новороссийск" },
  { slug: "tambov", name: "Тамбов" },
  { slug: "taganrog", name: "Таганрог" },
  { slug: "blagoveshchensk", name: "Благовещенск" },
  { slug: "vnovgorod", name: "Великий Новгород" },
  { slug: "shakhty", name: "Шахты" },
  { slug: "syktyvkar", name: "Сыктывкар" },
  { slug: "pskov", name: "Псков" },
  { slug: "orsk", name: "Орск" },
  { slug: "khantymansiysk", name: "Ханты-Мансийск" },
  { slug: "nazran", name: "Назрань" },
  { slug: "derbent", name: "Дербент" },
  { slug: "nizhnevartovsk", name: "Нижневартовск" },
  { slug: "novyurengoy", name: "Новый Уренгой" },
  { slug: "gatchina", name: "Гатчина" },
  { slug: "kyzyl", name: "Кызыл" },
  { slug: "nalchik", name: "Нальчик" },
  { slug: "elista", name: "Элиста" },
  { slug: "magadan", name: "Магадан" },
  { slug: "pkamchatsky", name: "Петропавловск-Камчатский" },
  { slug: "domodedovo", name: "Домодедово" },
  { slug: "khimki", name: "Химки" },
  { slug: "mytishchi", name: "Мытищи" },
  { slug: "lyubertsy", name: "Люберцы" },
  { slug: "hasavyurt", name: "Хасавюрт" },
  { slug: "kaspiysk", name: "Каспийск" },
  { slug: "kizlyar", name: "Кизляр" },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (slug: string) => void;
};

const RegionModal = ({ isOpen, onClose, onSelect }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredRegions = regions.filter((region) =>
    region.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Выберите ваш регион</h2>

        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="Поиск региона..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className={styles.regionList}>
          {filteredRegions.map((region) => (
            <button
              key={region.slug}
              className={styles.regionButton}
              onClick={() => onSelect(region.slug)}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegionModal;
