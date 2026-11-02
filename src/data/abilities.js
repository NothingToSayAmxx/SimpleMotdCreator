// Параметры перенесены из конфига плагина. Пустая конфигурация означает, что способность не задана.
const config = (knifeOnly, value) => ({ enabled: true, knifeOnly: Boolean(knifeOnly), value })
const forKnives = (knifeOnly, value, ids = [0, 1, 2, 3]) => Object.fromEntries(ids.map((id) => [id, config(knifeOnly, value)]))

export const abilities = [
  { id: 'footstep', name: 'Тихий шаг', shortName: 'Тихий шаг', description: 'Бесшумные шаги.', icon: '»', configs: forKnives(false, '1', [0]) },
  { id: 'damage', name: 'Дополнительный урон', shortName: 'Урон', description: 'Дополнительный урон ножа в процентах.', icon: '✦', configs: forKnives(false, '5%', [0]) },
  { id: 'absor_damage', name: 'Поглощение урона', shortName: 'Погл. урона', description: 'Уменьшение получаемого урона.', icon: '◈', configs: forKnives(true, '100%', [0]) },
  { id: 'no_damage_fall', name: 'Защита от падения', shortName: 'Защита от пад.', description: 'Поглощение урона при падении.', icon: '↓', configs: forKnives(true, '1', [0]) },
  { id: 'invisible', name: 'Невидимость', shortName: 'Невидимость', description: 'Процент видимости игрока. Значение в конфиге не задано.', icon: '◌', configs: {} },
  { id: 'speed', name: 'Скорость', shortName: 'Скорость', description: 'Дополнительная скорость в процентах.', icon: '»', configs: forKnives(true, '30%', [0]) },
  { id: 'gravity', name: 'Гравитация', shortName: 'Гравитация', description: 'Множитель гравитации.', icon: '↓', configs: forKnives(true, '0.7', [0]) },
  { id: 'rege_hp', name: 'Регенерация здоровья', shortName: 'Реген. HP', description: 'Интервал / количество / максимум HP.', icon: '+', configs: forKnives(true, '1с/+7/100', [0]) },
  { id: 'rege_ap', name: 'Регенерация брони', shortName: 'Реген. брони', description: 'Интервал / количество / максимум брони.', icon: '+', configs: forKnives(true, '1с/+7/100') },
  { id: 'silent_defuse', name: 'Тихое разминирование', shortName: 'Тих. разминир.', description: 'Бесшумное разминирование бомбы.', icon: '◉', configs: forKnives(true, '1') },
  { id: 'time_defuse', name: 'Скорость разминирования', shortName: 'Время разминир.', description: 'Значение конфига: 5 секунд.', icon: '◷', configs: forKnives(true, '5с') },
  { id: 'bomb_plant_time', name: 'Время установки бомбы', shortName: 'Уст. бомбы', description: 'Время до установки бомбы.', icon: '◷', configs: forKnives(true, '1.5с') },
  { id: 'vampire', name: 'Вампиризм', shortName: 'Вампиризм', description: 'Получение HP / максимальное количество HP.', icon: '♥', configs: forKnives(true, '10/110') },
  { id: 'throw_knife', name: 'Бросок ножа', shortName: 'Бросок ножа', description: 'Количество / урон / сила толчка.', icon: '↗', configs: forKnives(true, '1/55/1000') },
  { id: 'anew', name: 'Бонус за убийство', shortName: 'Бонус убийства', description: 'Дополнительный бонус за убийство.', icon: '+', configs: forKnives(true, '5') },
  { id: 'anti_flash', name: 'Защита от ослепления', shortName: 'Анти-флеш', description: 'Длительность эффекта после начала раунда.', icon: '◉', configs: forKnives(true, '99с') },
  { id: 'zeus', name: 'Молния', shortName: 'Молния', description: 'Шанс / дополнительный урон молнии.', icon: 'ϟ', configs: forKnives(true, '100%/100') },
  { id: 'add_jumps', name: 'Дополнительные прыжки', shortName: 'Доп. прыжки', description: 'Количество прыжков / сила прыжка.', icon: '↑', configs: forKnives(true, '1/265') },
  { id: 'farm', name: 'Накопление бонуса', shortName: 'Фарм', description: 'Количество / время игры.', icon: '+', configs: forKnives(true, '5/10') },
  { id: 'damage_knife', name: 'Урон ножом', shortName: 'Урон ножом', description: 'Дополнительный урон ножом в процентах.', icon: '✦', configs: forKnives(true, '5%') },
]
