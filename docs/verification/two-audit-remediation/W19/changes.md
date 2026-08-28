# W19 — live UI and route sweep

Дата: 2026-08-28

## Что проверено

- production package `49300/49301` поднят через `package:local:upgrade` с новым full-local backup;
- 43 канонических маршрута и 205 ссылок, обнаруженных в DOM опубликованных экранов;
- desktop 1440×900 и compact 390×844;
- vertical scroll владельца `.fel-main`, отсутствие horizontal overflow и возврат состояния фильтров;
- path projection с 81 станцией и runtime pickers;
- RU/EN для списка и detail-карточки вопроса;
- light/dark theme и dock-положение Navigator.

## Исправления в Vue

`31b63569f11c5e824b8b9741a0de083f3f78dea6` сохраняет locale-consistent learner copy: стандартные next-action, execution mode, mastery state и уровень не показываются сырыми enum-значениями или языком другой projection.

Контрольные элементы filters имеют минимум 44px, а compact shell семантически сообщает collapsed navigation и не оставляет скрытый contextual rail в accessibility tree.

## Результат

Все обнаруженные ссылки либо открыли контент, либо штатно канонизировались/показали предусмотренный recovery boundary. Неожиданных recovery-экранов, console errors, alert-ошибок, overflow и наложений не обнаружено.

Открытый продуктовый gap не маскируется: для полного строгого release всё ещё требуется опубликованный remote для Vue (`local-only` в workspace manifest). Это provenance-ограничение, не live UI failure.
