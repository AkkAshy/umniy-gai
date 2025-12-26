// Типы для модуля Штрафы
export interface TrafficFine {
  id: string
  plateNumber: string
  vehicleMake?: string
  vehicleModel?: string
  violationType: ViolationType
  violationCode: string
  amount: number
  location: {
    address: string
    coordinates?: [number, number]
  }
  datetime: string
  cameraId?: string
  inspectorId?: string
  inspectorName?: string
  photos: string[]
  videoUrl?: string
  status: FineStatus
  paidAt?: string
  sentToSmartCity: boolean
  sentAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export type ViolationType =
  | 'speeding'
  | 'red_light'
  | 'wrong_parking'
  | 'no_seatbelt'
  | 'phone_usage'
  | 'wrong_lane'
  | 'no_documents'
  | 'drunk_driving'
  | 'other'

export type FineStatus =
  | 'new'
  | 'sent'
  | 'pending_payment'
  | 'paid'
  | 'appealed'
  | 'cancelled'

// Типы для камер
export interface TrafficCamera {
  id: string
  name: string
  location: {
    address: string
    coordinates: [number, number]
  }
  type: 'speed' | 'red_light' | 'lane' | 'combined'
  status: 'active' | 'maintenance' | 'offline'
  speedLimit?: number
  lastViolation?: string
  violationsToday: number
  violationsMonth: number
  installedAt: string
}

// Типы для штрафстоянки
export interface ImpoundedVehicle {
  id: string
  plateNumber: string
  vehicleMake: string
  vehicleModel: string
  vehicleColor: string
  reason: ImpoundReason
  location: string
  impoundedAt: string
  photos: string[]
  towTruckId: string
  towTruckDriver: string
  dailyRate: number
  totalDays: number
  totalAmount: number
  status: ImpoundStatus
  ownerName?: string
  ownerPhone?: string
  releasedAt?: string
  paidAt?: string
  sentToSmartCity: boolean
}

export type ImpoundReason =
  | 'wrong_parking'
  | 'no_documents'
  | 'accident'
  | 'drunk_driving'
  | 'police_request'
  | 'other'

export type ImpoundStatus =
  | 'impounded'
  | 'pending_payment'
  | 'ready_for_release'
  | 'released'

// Типы для парковок
export interface ParkingZone {
  id: string
  name: string
  address: string
  coordinates: [number, number]
  capacity: number
  occupied: number
  hourlyRate: number
  type: 'street' | 'lot' | 'underground'
  status: 'active' | 'full' | 'closed'
}

export interface ParkingSession {
  id: string
  zoneId: string
  zoneName: string
  plateNumber: string
  startTime: string
  endTime?: string
  amount?: number
  status: 'active' | 'completed' | 'violation'
}

export interface ParkingViolation {
  id: string
  plateNumber: string
  zoneId: string
  zoneName: string
  violationType: 'no_payment' | 'overtime' | 'wrong_spot' | 'disabled_spot'
  datetime: string
  fineAmount: number
  status: 'new' | 'fined' | 'paid'
  fineId?: string
}

// Типы для приказов от хокимията
export interface HokimiyatOrder {
  id: string
  type: OrderType
  title: string
  description: string
  streets: string[]
  startTime: string
  endTime: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: OrderStatus
  createdBy: string
  createdAt: string
  acceptedAt?: string
  acceptedBy?: string
  completedAt?: string
  report?: string
}

export type OrderType =
  | 'street_closure'
  | 'traffic_restriction'
  | 'escort'
  | 'emergency'
  | 'special_event'

export type OrderStatus =
  | 'new'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

// Типы для перекрытий улиц
export interface StreetClosure {
  id: string
  orderId?: string
  street: string
  fromAddress: string
  toAddress: string
  reason: string
  startTime: string
  endTime: string
  alternativeRoutes: string[]
  status: 'planned' | 'active' | 'completed'
  createdBy: string
  createdAt: string
}

// Типы для патрулей
export interface PatrolUnit {
  id: string
  callSign: string
  vehiclePlate: string
  officers: {
    id: string
    name: string
    rank: string
  }[]
  status: PatrolStatus
  currentLocation?: {
    address: string
    coordinates: [number, number]
  }
  assignedArea?: string
  shiftStart: string
  shiftEnd: string
}

export type PatrolStatus =
  | 'on_patrol'
  | 'on_call'
  | 'available'
  | 'off_duty'
  | 'break'

// Типы для статистики дашборда
export interface DashboardStats {
  finesToday: number
  finesAmount: number
  finesMonth: number
  finesAmountMonth: number
  camerasActive: number
  camerasTotal: number
  impoundedVehicles: number
  pendingOrders: number
  activeClosures: number
  patrolsOnDuty: number
}

// Типы для отчётов
export interface Report {
  id: string
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  title: string
  period: {
    from: string
    to: string
  }
  generatedAt: string
  generatedBy: string
  data: Record<string, unknown>
}

// Типы для пользователей
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
  phone?: string
  avatar?: string
  createdAt: string
  lastLogin?: string
}

export type UserRole =
  | 'admin'
  | 'chief'
  | 'inspector'
  | 'camera_operator'
  | 'dispatcher'
  | 'viewer'

// Типы для журнала аудита
export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  entity: string
  entityId: string
  details?: Record<string, unknown>
  createdAt: string
  ipAddress?: string
}
