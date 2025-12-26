# ГАИ Нөкис — Система управления дорожным движением

## Обзор проекта

Админ-панель для управления дорожным движением города Нукус. Работает в связке с проектом "Ақыллы Нөкис" (Умный город) через API.

## Связь с проектом "Умный город"

### Исходящие данные (ГАИ → Умный город)
- **Штрафы** — все штрафы создаются в ГАИ и отправляются в Умный город
- **Нарушения** — данные о нарушениях ПДД
- **Штрафстоянка** — информация об эвакуированных ТС
- **Парковки** — данные о парковочных сессиях и нарушениях
- **Камеры** — статистика с камер фиксации

### Входящие данные (Умный город → ГАИ)
- **Приказы** — распоряжения от хокимията (перекрытие улиц, мероприятия)
- **События** — уведомления о праздниках, ремонтах, ЧС

## Стек технологий

- **Next.js 14** — App Router
- **TypeScript** — типизация
- **shadcn/ui** — UI компоненты
- **Tailwind CSS** — стилизация
- **Recharts** — графики и диаграммы
- **Framer Motion** — анимации
- **Lucide React** — иконки
- **next-themes** — переключение тем
- **Sonner** — toast уведомления

## Запуск проекта

```bash
cd gai-nokis
npm install
npm run dev
```

Открыть http://localhost:3000 (или 3001 если Умный город уже запущен на 3000)

## Структура проекта

```
src/
├── app/                        # Страницы (App Router)
│   ├── layout.tsx              # Корневой layout с темой
│   ├── page.tsx                # Редирект на /dashboard
│   ├── dashboard/              # Главный дашборд
│   ├── fines/                  # Штрафы
│   ├── cameras/                # Камеры фиксации
│   ├── impound/                # Штрафстоянка
│   ├── parking/                # Парковки
│   ├── orders/                 # Приказы от хокимията
│   ├── closures/               # Перекрытия улиц
│   ├── patrols/                # Патрули
│   ├── reports/                # Отчёты
│   └── settings/               # Настройки
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx         # Боковое меню
│   │   ├── header.tsx          # Шапка
│   │   └── main-layout.tsx     # Обёртка страниц
│   ├── ui/                     # shadcn компоненты
│   └── theme-provider.tsx      # Провайдер темы
├── lib/
│   ├── utils.ts                # Утилиты (cn)
│   ├── mock-data.ts            # Мок-данные
│   └── i18n/
│       ├── translations.ts     # Переводы
│       └── context.tsx         # Контекст языка
└── types/
    └── index.ts                # TypeScript типы
```

## Модули системы (10)

| # | Модуль | URL | Описание |
|---|--------|-----|----------|
| 1 | Дашборд | `/dashboard` | Сводка, графики, приказы |
| 2 | Штрафы | `/fines` | Создание и управление штрафами |
| 3 | Камеры | `/cameras` | Мониторинг камер фиксации |
| 4 | Штрафстоянка | `/impound` | Эвакуированные ТС |
| 5 | Парковки | `/parking` | Парковочные зоны и нарушения |
| 6 | Приказы | `/orders` | Входящие приказы от хокимията |
| 7 | Перекрытия | `/closures` | Временное перекрытие улиц |
| 8 | Патрули | `/patrols` | Управление экипажами |
| 9 | Отчёты | `/reports` | Формирование отчётности |
| 10 | Настройки | `/settings` | Конфигурация системы |

## Мок-данные

Все данные в файле `src/lib/mock-data.ts`:

### Типы данных
- `TrafficFine` — штрафы за нарушения
- `TrafficCamera` — камеры видеофиксации
- `ImpoundedVehicle` — эвакуированные ТС
- `ParkingZone` — парковочные зоны
- `ParkingSession` — парковочные сессии
- `ParkingViolation` — нарушения парковки
- `HokimiyatOrder` — приказы от хокимията
- `StreetClosure` — перекрытия улиц
- `PatrolUnit` — патрульные экипажи
- `DashboardStats` — статистика дашборда

## Дизайн-система

### Цветовая схема
- **Primary** — Синий (#3b82f6) — официальный, государственный
- **Destructive** — Красный для ошибок
- **Success** — Зелёный для успеха

### Темы
- Светлая тема (по умолчанию)
- Тёмная тема

### Языки
- Русский (основной)
- Узбекский
- Каракалпакский

## API интеграция

### Отправка данных в Умный город

```typescript
// POST /api/smart-city/fines
interface FinePayload {
  id: string
  plateNumber: string
  violationType: string
  amount: number
  location: { address: string; coordinates?: [number, number] }
  datetime: string
  status: 'pending' | 'paid' | 'cancelled'
}

// POST /api/smart-city/impound
interface ImpoundPayload {
  id: string
  plateNumber: string
  vehicleMake: string
  vehicleModel: string
  reason: string
  status: 'impounded' | 'ready' | 'released'
}
```

### Получение приказов

```typescript
// Webhook: /api/webhooks/orders
interface OrderPayload {
  id: string
  type: 'street_closure' | 'traffic_restriction' | 'escort' | 'emergency'
  title: string
  description: string
  streets: string[]
  startTime: string
  endTime: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}
```

## Роли пользователей

| Роль | Права |
|------|-------|
| Администратор | Полный доступ |
| Начальник отдела | Просмотр, утверждение |
| Инспектор | Создание штрафов |
| Оператор камер | Просмотр камер |
| Диспетчер | Управление патрулями |

## Конвенции кода

### Именование
- Файлы: kebab-case (`traffic-fines`)
- Компоненты: PascalCase (`FinesPage`)
- Функции: camelCase (`handlePayment`)
- Типы: PascalCase (`TrafficFine`)

### Форматирование валюты
```tsx
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("uz-UZ").format(amount) + " сум"
}
```

### Toast уведомления
```tsx
import { toast } from "sonner"

toast.success("Успешно", { description: "Данные сохранены" })
toast.error("Ошибка", { description: "Что-то пошло не так" })
```

## Добавление нового модуля

1. Создать директорию `src/app/[module-name]/`
2. Создать `page.tsx` с компонентом страницы
3. Обернуть в `<MainLayout>`
4. Добавить типы в `src/types/index.ts`
5. Добавить мок-данные в `src/lib/mock-data.ts`
6. Добавить переводы в `src/lib/i18n/translations.ts`
7. Добавить пункт меню в `src/components/layout/sidebar.tsx`

## Известные ограничения

1. **Нет бэкенда** — все данные статичные (мок)
2. **Нет авторизации** — прототип без системы входа
3. **Карты-заглушки** — места для интеграции карт

## Roadmap

- [ ] Интеграция с бэкендом (API)
- [ ] Авторизация и роли
- [ ] Интеграция карт
- [ ] Экспорт отчётов (PDF, Excel)
- [ ] Реальная связь с Умным городом
- [ ] Мобильное приложение для инспекторов

---

**Автор:** iMax IT Company © 2025
