import {
  TrafficFine,
  TrafficCamera,
  ImpoundedVehicle,
  ParkingZone,
  ParkingSession,
  ParkingViolation,
  HokimiyatOrder,
  StreetClosure,
  PatrolUnit,
  DashboardStats,
} from '@/types'

// Штрафы
export const mockFines: TrafficFine[] = [
  {
    id: 'F001',
    plateNumber: '01 A 123 BA',
    vehicleMake: 'Chevrolet',
    vehicleModel: 'Cobalt',
    violationType: 'speeding',
    violationCode: '12.9.2',
    amount: 500000,
    location: {
      address: 'ул. А. Дусумова, 45',
      coordinates: [42.4619, 59.6033],
    },
    datetime: '2025-12-26T09:15:00',
    cameraId: 'CAM001',
    photos: ['/photos/f001_1.jpg'],
    status: 'sent',
    sentToSmartCity: true,
    sentAt: '2025-12-26T09:16:00',
    createdAt: '2025-12-26T09:15:00',
    updatedAt: '2025-12-26T09:16:00',
  },
  {
    id: 'F002',
    plateNumber: '95 B 456 CA',
    vehicleMake: 'Daewoo',
    vehicleModel: 'Nexia',
    violationType: 'red_light',
    violationCode: '12.12.1',
    amount: 750000,
    location: {
      address: 'пер. Т. Шевченко / ул. Гоголя',
      coordinates: [42.4595, 59.6088],
    },
    datetime: '2025-12-26T08:42:00',
    cameraId: 'CAM003',
    photos: ['/photos/f002_1.jpg', '/photos/f002_2.jpg'],
    status: 'pending_payment',
    sentToSmartCity: true,
    sentAt: '2025-12-26T08:43:00',
    createdAt: '2025-12-26T08:42:00',
    updatedAt: '2025-12-26T08:43:00',
  },
  {
    id: 'F003',
    plateNumber: '01 C 789 DA',
    vehicleMake: 'Chevrolet',
    vehicleModel: 'Malibu',
    violationType: 'wrong_parking',
    violationCode: '12.19.2',
    amount: 300000,
    location: {
      address: 'ул. Бердаха, 12',
    },
    datetime: '2025-12-26T10:30:00',
    inspectorId: 'INS001',
    inspectorName: 'А. Юсупов',
    photos: ['/photos/f003_1.jpg'],
    status: 'new',
    sentToSmartCity: false,
    createdAt: '2025-12-26T10:30:00',
    updatedAt: '2025-12-26T10:30:00',
  },
  {
    id: 'F004',
    plateNumber: '95 D 111 EA',
    vehicleMake: 'Kia',
    vehicleModel: 'K5',
    violationType: 'phone_usage',
    violationCode: '12.36.1',
    amount: 400000,
    location: {
      address: 'пр. Независимости, 78',
    },
    datetime: '2025-12-25T16:20:00',
    inspectorId: 'INS002',
    inspectorName: 'Б. Каримов',
    photos: [],
    status: 'paid',
    paidAt: '2025-12-25T18:00:00',
    sentToSmartCity: true,
    sentAt: '2025-12-25T16:21:00',
    createdAt: '2025-12-25T16:20:00',
    updatedAt: '2025-12-25T18:00:00',
  },
  {
    id: 'F005',
    plateNumber: '01 E 222 FA',
    vehicleMake: 'Hyundai',
    vehicleModel: 'Sonata',
    violationType: 'speeding',
    violationCode: '12.9.3',
    amount: 1000000,
    location: {
      address: 'трасса Нукус-Кунград, 15 км',
      coordinates: [42.4700, 59.5500],
    },
    datetime: '2025-12-25T14:55:00',
    cameraId: 'CAM005',
    photos: ['/photos/f005_1.jpg'],
    status: 'appealed',
    sentToSmartCity: true,
    sentAt: '2025-12-25T14:56:00',
    notes: 'Владелец подал апелляцию',
    createdAt: '2025-12-25T14:55:00',
    updatedAt: '2025-12-26T09:00:00',
  },
]

// Камеры
export const mockCameras: TrafficCamera[] = [
  {
    id: 'CAM001',
    name: 'Камера #1 - Дусумова',
    location: {
      address: 'ул. А. Дусумова, 45',
      coordinates: [42.4619, 59.6033],
    },
    type: 'speed',
    status: 'active',
    speedLimit: 60,
    lastViolation: '2025-12-26T09:15:00',
    violationsToday: 12,
    violationsMonth: 342,
    installedAt: '2024-03-15',
  },
  {
    id: 'CAM002',
    name: 'Камера #2 - пр. Независимости',
    location: {
      address: 'пр. Независимости, 100',
      coordinates: [42.4580, 59.6100],
    },
    type: 'combined',
    status: 'active',
    speedLimit: 50,
    lastViolation: '2025-12-26T08:30:00',
    violationsToday: 8,
    violationsMonth: 256,
    installedAt: '2024-05-20',
  },
  {
    id: 'CAM003',
    name: 'Камера #3 - Шевченко/Гоголя',
    location: {
      address: 'пер. Т. Шевченко / ул. Гоголя',
      coordinates: [42.4595, 59.6088],
    },
    type: 'red_light',
    status: 'active',
    lastViolation: '2025-12-26T08:42:00',
    violationsToday: 5,
    violationsMonth: 178,
    installedAt: '2024-06-10',
  },
  {
    id: 'CAM004',
    name: 'Камера #4 - Бердаха',
    location: {
      address: 'ул. Бердаха, 50',
      coordinates: [42.4550, 59.6150],
    },
    type: 'speed',
    status: 'maintenance',
    speedLimit: 40,
    violationsToday: 0,
    violationsMonth: 198,
    installedAt: '2024-04-01',
  },
  {
    id: 'CAM005',
    name: 'Камера #5 - трасса Кунград',
    location: {
      address: 'трасса Нукус-Кунград, 15 км',
      coordinates: [42.4700, 59.5500],
    },
    type: 'speed',
    status: 'active',
    speedLimit: 90,
    lastViolation: '2025-12-25T14:55:00',
    violationsToday: 3,
    violationsMonth: 89,
    installedAt: '2024-07-15',
  },
  {
    id: 'CAM006',
    name: 'Камера #6 - Центральный рынок',
    location: {
      address: 'ул. Муста Кильбая, 1',
      coordinates: [42.4610, 59.6020],
    },
    type: 'combined',
    status: 'offline',
    speedLimit: 40,
    violationsToday: 0,
    violationsMonth: 145,
    installedAt: '2024-02-28',
  },
]

// Штрафстоянка
export const mockImpoundedVehicles: ImpoundedVehicle[] = [
  {
    id: 'IMP001',
    plateNumber: '01 F 333 GA',
    vehicleMake: 'Chevrolet',
    vehicleModel: 'Spark',
    vehicleColor: 'Белый',
    reason: 'wrong_parking',
    location: 'ул. Гоголя, 15 (у больницы)',
    impoundedAt: '2025-12-25T08:30:00',
    photos: ['/photos/imp001_1.jpg'],
    towTruckId: 'TT001',
    towTruckDriver: 'М. Сейтов',
    dailyRate: 50000,
    totalDays: 2,
    totalAmount: 200000,
    status: 'pending_payment',
    ownerName: 'Қ. Реймов',
    ownerPhone: '+998 91 123 45 67',
    sentToSmartCity: true,
  },
  {
    id: 'IMP002',
    plateNumber: '95 G 444 HA',
    vehicleMake: 'Daewoo',
    vehicleModel: 'Matiz',
    vehicleColor: 'Серебристый',
    reason: 'no_documents',
    location: 'пр. Независимости, 45',
    impoundedAt: '2025-12-24T15:00:00',
    photos: ['/photos/imp002_1.jpg', '/photos/imp002_2.jpg'],
    towTruckId: 'TT002',
    towTruckDriver: 'А. Тажибаев',
    dailyRate: 50000,
    totalDays: 3,
    totalAmount: 250000,
    status: 'impounded',
    sentToSmartCity: true,
  },
  {
    id: 'IMP003',
    plateNumber: '01 H 555 JA',
    vehicleMake: 'Hyundai',
    vehicleModel: 'Accent',
    vehicleColor: 'Чёрный',
    reason: 'accident',
    location: 'ул. Бердаха / ул. Дусумова',
    impoundedAt: '2025-12-26T06:45:00',
    photos: ['/photos/imp003_1.jpg'],
    towTruckId: 'TT001',
    towTruckDriver: 'М. Сейтов',
    dailyRate: 50000,
    totalDays: 1,
    totalAmount: 100000,
    status: 'impounded',
    sentToSmartCity: false,
  },
  {
    id: 'IMP004',
    plateNumber: '01 J 666 KA',
    vehicleMake: 'Chevrolet',
    vehicleModel: 'Cobalt',
    vehicleColor: 'Синий',
    reason: 'wrong_parking',
    location: 'ул. Муста Кильбая (у рынка)',
    impoundedAt: '2025-12-23T11:20:00',
    photos: ['/photos/imp004_1.jpg'],
    towTruckId: 'TT003',
    towTruckDriver: 'Б. Утемуратов',
    dailyRate: 50000,
    totalDays: 4,
    totalAmount: 300000,
    status: 'ready_for_release',
    ownerName: 'А. Жуманиязов',
    ownerPhone: '+998 90 987 65 43',
    paidAt: '2025-12-26T09:00:00',
    sentToSmartCity: true,
  },
]

// Парковочные зоны
export const mockParkingZones: ParkingZone[] = [
  {
    id: 'PZ001',
    name: 'Центральный рынок',
    address: 'ул. Муста Кильбая, 1',
    coordinates: [42.4610, 59.6020],
    capacity: 100,
    occupied: 78,
    hourlyRate: 3000,
    type: 'lot',
    status: 'active',
  },
  {
    id: 'PZ002',
    name: 'Больница №1',
    address: 'ул. Гоголя, 15',
    coordinates: [42.4590, 59.6050],
    capacity: 50,
    occupied: 50,
    hourlyRate: 2000,
    type: 'lot',
    status: 'full',
  },
  {
    id: 'PZ003',
    name: 'пр. Независимости',
    address: 'пр. Независимости, 50-100',
    coordinates: [42.4580, 59.6100],
    capacity: 30,
    occupied: 15,
    hourlyRate: 2500,
    type: 'street',
    status: 'active',
  },
]

// Парковочные сессии
export const mockParkingSessions: ParkingSession[] = [
  {
    id: 'PS001',
    zoneId: 'PZ001',
    zoneName: 'Центральный рынок',
    plateNumber: '01 K 777 LA',
    startTime: '2025-12-26T08:00:00',
    status: 'active',
  },
  {
    id: 'PS002',
    zoneId: 'PZ003',
    zoneName: 'пр. Независимости',
    plateNumber: '95 L 888 MA',
    startTime: '2025-12-26T09:30:00',
    status: 'active',
  },
]

// Нарушения парковки
export const mockParkingViolations: ParkingViolation[] = [
  {
    id: 'PV001',
    plateNumber: '01 M 999 NA',
    zoneId: 'PZ001',
    zoneName: 'Центральный рынок',
    violationType: 'no_payment',
    datetime: '2025-12-26T07:45:00',
    fineAmount: 100000,
    status: 'fined',
    fineId: 'F006',
  },
]

// Приказы от хокимията
export const mockOrders: HokimiyatOrder[] = [
  {
    id: 'ORD001',
    type: 'street_closure',
    title: 'Перекрытие для новогоднего мероприятия',
    description: 'Перекрыть улицу Бердаха для проведения новогодней ёлки и праздничного концерта',
    streets: ['ул. Бердаха (от пр. Независимости до ул. Гоголя)'],
    startTime: '2025-12-31T16:00:00',
    endTime: '2026-01-01T02:00:00',
    priority: 'high',
    status: 'new',
    createdBy: 'Хокимият г. Нукус',
    createdAt: '2025-12-26T08:00:00',
  },
  {
    id: 'ORD002',
    type: 'traffic_restriction',
    title: 'Ограничение движения для ремонта дороги',
    description: 'Ограничить движение по ул. Дусумова в связи с ремонтом дорожного покрытия',
    streets: ['ул. А. Дусумова (участок 30-60)'],
    startTime: '2025-12-27T08:00:00',
    endTime: '2025-12-29T18:00:00',
    priority: 'medium',
    status: 'accepted',
    createdBy: 'Хокимият г. Нукус',
    createdAt: '2025-12-25T14:00:00',
    acceptedAt: '2025-12-25T15:00:00',
    acceptedBy: 'Начальник ГАИ',
  },
  {
    id: 'ORD003',
    type: 'escort',
    title: 'Сопровождение делегации',
    description: 'Обеспечить сопровождение официальной делегации из аэропорта до хокимията',
    streets: ['Аэропорт - пр. Независимости - Хокимият'],
    startTime: '2025-12-28T10:00:00',
    endTime: '2025-12-28T11:00:00',
    priority: 'urgent',
    status: 'in_progress',
    createdBy: 'Хокимият Каракалпакстана',
    createdAt: '2025-12-26T07:00:00',
    acceptedAt: '2025-12-26T07:15:00',
    acceptedBy: 'Начальник ГАИ',
  },
]

// Перекрытия улиц
export const mockClosures: StreetClosure[] = [
  {
    id: 'CL001',
    orderId: 'ORD002',
    street: 'ул. А. Дусумова',
    fromAddress: 'дом 30',
    toAddress: 'дом 60',
    reason: 'Ремонт дорожного покрытия',
    startTime: '2025-12-27T08:00:00',
    endTime: '2025-12-29T18:00:00',
    alternativeRoutes: ['ул. Гоголя', 'ул. Бердаха'],
    status: 'planned',
    createdBy: 'А. Юсупов',
    createdAt: '2025-12-25T15:30:00',
  },
]

// Патрули
export const mockPatrols: PatrolUnit[] = [
  {
    id: 'PAT001',
    callSign: 'Нукус-1',
    vehiclePlate: '01 GAI 001',
    officers: [
      { id: 'OFF001', name: 'А. Юсупов', rank: 'Капитан' },
      { id: 'OFF002', name: 'Б. Каримов', rank: 'Лейтенант' },
    ],
    status: 'on_patrol',
    currentLocation: {
      address: 'пр. Независимости, 80',
      coordinates: [42.4580, 59.6100],
    },
    assignedArea: 'Центр',
    shiftStart: '2025-12-26T08:00:00',
    shiftEnd: '2025-12-26T20:00:00',
  },
  {
    id: 'PAT002',
    callSign: 'Нукус-2',
    vehiclePlate: '01 GAI 002',
    officers: [
      { id: 'OFF003', name: 'С. Мырзабаев', rank: 'Старший лейтенант' },
      { id: 'OFF004', name: 'Д. Айтмуратов', rank: 'Сержант' },
    ],
    status: 'on_call',
    currentLocation: {
      address: 'ул. Бердаха, 25',
      coordinates: [42.4560, 59.6140],
    },
    assignedArea: 'Север',
    shiftStart: '2025-12-26T08:00:00',
    shiftEnd: '2025-12-26T20:00:00',
  },
  {
    id: 'PAT003',
    callSign: 'Нукус-3',
    vehiclePlate: '01 GAI 003',
    officers: [
      { id: 'OFF005', name: 'Е. Жуманов', rank: 'Лейтенант' },
      { id: 'OFF006', name: 'Ф. Утепов', rank: 'Сержант' },
    ],
    status: 'available',
    currentLocation: {
      address: 'База ГАИ',
      coordinates: [42.4650, 59.5980],
    },
    assignedArea: 'Юг',
    shiftStart: '2025-12-26T08:00:00',
    shiftEnd: '2025-12-26T20:00:00',
  },
  {
    id: 'PAT004',
    callSign: 'Нукус-4',
    vehiclePlate: '01 GAI 004',
    officers: [
      { id: 'OFF007', name: 'Г. Худайбергенов', rank: 'Капитан' },
      { id: 'OFF008', name: 'Х. Сапаров', rank: 'Лейтенант' },
    ],
    status: 'off_duty',
    shiftStart: '2025-12-26T20:00:00',
    shiftEnd: '2025-12-27T08:00:00',
  },
]

// Статистика для дашборда
export const mockDashboardStats: DashboardStats = {
  finesToday: 28,
  finesAmount: 14500000,
  finesMonth: 856,
  finesAmountMonth: 428000000,
  camerasActive: 4,
  camerasTotal: 6,
  impoundedVehicles: 4,
  pendingOrders: 1,
  activeClosures: 0,
  patrolsOnDuty: 3,
}

// Данные для графиков
export const violationsChartData = [
  { date: '20.12', violations: 32, amount: 16000000 },
  { date: '21.12', violations: 28, amount: 14000000 },
  { date: '22.12', violations: 35, amount: 17500000 },
  { date: '23.12', violations: 41, amount: 20500000 },
  { date: '24.12', violations: 38, amount: 19000000 },
  { date: '25.12', violations: 25, amount: 12500000 },
  { date: '26.12', violations: 28, amount: 14500000 },
]

export const violationsByTypeData = [
  { type: 'Превышение скорости', count: 145, color: 'var(--pie-blue)' },
  { type: 'Проезд на красный', count: 67, color: 'var(--pie-red)' },
  { type: 'Неправильная парковка', count: 89, color: 'var(--pie-orange)' },
  { type: 'Использование телефона', count: 34, color: 'var(--pie-purple)' },
  { type: 'Без ремня', count: 28, color: 'var(--pie-cyan)' },
  { type: 'Другое', count: 12, color: 'var(--pie-amber)' },
]

// Функции для форматирования
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' сум'
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(dateString: string): string {
  return `${formatDate(dateString)} ${formatTime(dateString)}`
}
