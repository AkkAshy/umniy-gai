// API клиент для ГАИ Нөкис
// Работает с Django бэкендом и интеграцией с Умным городом

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gay.saribek.uz"
const SMART_CITY_URL = process.env.NEXT_PUBLIC_SMART_CITY_URL || "https://umniygorod.vercel.app"
const GAI_API_KEY = process.env.NEXT_PUBLIC_GAI_API_KEY || "gai-secret-key-2025"

// Хранилище токенов
let accessToken: string | null = null
let refreshToken: string | null = null

// Интерфейсы
interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

interface PaginatedResponse<T> {
  count: number
  total_pages: number
  current_page: number
  page_size: number
  next: string | null
  previous: string | null
  results: T[]
}

interface LoginResponse {
  access: string
  refresh: string
  user: User
}

interface User {
  id: string
  email: string
  name: string
  role: string
  department: string
  phone: string
  avatar: string | null
  is_active: boolean
  created_at: string
  last_login: string
}

// Инициализация токенов из localStorage
export function initAuth(): void {
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem("access_token")
    refreshToken = localStorage.getItem("refresh_token")
  }
}

// Сохранение токенов
function saveTokens(access: string, refresh: string): void {
  accessToken = access
  refreshToken = refresh
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", access)
    localStorage.setItem("refresh_token", refresh)
  }
}

// Очистка токенов
export function clearAuth(): void {
  accessToken = null
  refreshToken = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
  }
}

// Получение заголовков авторизации
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`
  }
  return headers
}

// Обновление access токена
async function refreshAccessToken(): Promise<boolean> {
  if (!refreshToken) return false

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (response.ok) {
      const data = await response.json()
      accessToken = data.access
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", data.access)
      }
      return true
    }
  } catch (error) {
    console.error("Error refreshing token:", error)
  }

  clearAuth()
  return false
}

// Универсальный API запрос
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BACKEND_URL}${endpoint}`

  try {
    let response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    })

    // Если 401 — пробуем обновить токен
    if (response.status === 401 && refreshToken) {
      const refreshed = await refreshAccessToken()
      if (refreshed) {
        response = await fetch(url, {
          ...options,
          headers: {
            ...getAuthHeaders(),
            ...(options.headers || {}),
          },
        })
      }
    }

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.message || JSON.stringify(data),
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error)
    return {
      success: false,
      error: "Ошибка подключения к серверу",
    }
  }
}

// ==================== AUTH API ====================

export async function login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
  const result = await apiRequest<LoginResponse>("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })

  if (result.success && result.data) {
    saveTokens(result.data.access, result.data.refresh)
  }

  return result
}

export async function logout(): Promise<void> {
  clearAuth()
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return apiRequest<User>("/api/auth/me/")
}

export async function updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
  return apiRequest<User>("/api/auth/me/", {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<ApiResponse> {
  return apiRequest("/api/auth/change-password/", {
    method: "POST",
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  })
}

// ==================== FINES API ====================

export async function getFines(params?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<any>>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return apiRequest(`/api/fines/${query}`)
}

export async function getFine(id: string): Promise<ApiResponse<any>> {
  return apiRequest(`/api/fines/${id}/`)
}

export async function createFine(data: any): Promise<ApiResponse<any>> {
  return apiRequest("/api/fines/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateFine(id: string, data: any): Promise<ApiResponse<any>> {
  return apiRequest(`/api/fines/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteFine(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/fines/${id}/`, { method: "DELETE" })
}

export async function sendFineToSmartCity(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/fines/${id}/send_to_smart_city/`, { method: "POST" })
}

export async function markFinePaid(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/fines/${id}/mark_paid/`, { method: "POST" })
}

// ==================== CAMERAS API ====================

export async function getCameras(params?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<any>>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return apiRequest(`/api/cameras/${query}`)
}

export async function getCamera(id: string): Promise<ApiResponse<any>> {
  return apiRequest(`/api/cameras/${id}/`)
}

export async function createCamera(data: any): Promise<ApiResponse<any>> {
  return apiRequest("/api/cameras/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateCamera(id: string, data: any): Promise<ApiResponse<any>> {
  return apiRequest(`/api/cameras/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteCamera(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/cameras/${id}/`, { method: "DELETE" })
}

// ==================== IMPOUND API ====================

export async function getImpoundedVehicles(params?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<any>>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return apiRequest(`/api/impound/${query}`)
}

export async function getImpoundedVehicle(id: string): Promise<ApiResponse<any>> {
  return apiRequest(`/api/impound/${id}/`)
}

export async function createImpoundedVehicle(data: any): Promise<ApiResponse<any>> {
  return apiRequest("/api/impound/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateImpoundedVehicle(id: string, data: any): Promise<ApiResponse<any>> {
  return apiRequest(`/api/impound/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function releaseVehicle(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/impound/${id}/release/`, { method: "POST" })
}

// ==================== PARKING API ====================

export async function getParkingZones(params?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<any>>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return apiRequest(`/api/parking/zones/${query}`)
}

export async function getParkingSessions(params?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<any>>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return apiRequest(`/api/parking/sessions/${query}`)
}

export async function getParkingViolations(params?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<any>>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return apiRequest(`/api/parking/violations/${query}`)
}

// ==================== ORDERS API ====================

export async function getOrders(params?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<any>>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return apiRequest(`/api/orders/${query}`)
}

export async function getOrder(id: string): Promise<ApiResponse<any>> {
  return apiRequest(`/api/orders/${id}/`)
}

export async function acceptOrder(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/orders/${id}/accept/`, { method: "POST" })
}

export async function completeOrder(id: string, report: string): Promise<ApiResponse> {
  return apiRequest(`/api/orders/${id}/complete/`, {
    method: "POST",
    body: JSON.stringify({ report }),
  })
}

// ==================== CLOSURES API ====================

export async function getClosures(params?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<any>>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return apiRequest(`/api/closures/${query}`)
}

export async function getClosure(id: string): Promise<ApiResponse<any>> {
  return apiRequest(`/api/closures/${id}/`)
}

export async function createClosure(data: any): Promise<ApiResponse<any>> {
  return apiRequest("/api/closures/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateClosure(id: string, data: any): Promise<ApiResponse<any>> {
  return apiRequest(`/api/closures/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteClosure(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/closures/${id}/`, { method: "DELETE" })
}

// ==================== PATROLS API ====================

export async function getPatrols(params?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<any>>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return apiRequest(`/api/patrols/${query}`)
}

export async function getPatrol(id: string): Promise<ApiResponse<any>> {
  return apiRequest(`/api/patrols/${id}/`)
}

export async function createPatrol(data: any): Promise<ApiResponse<any>> {
  return apiRequest("/api/patrols/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updatePatrol(id: string, data: any): Promise<ApiResponse<any>> {
  return apiRequest(`/api/patrols/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function updatePatrolLocation(
  id: string,
  lat: number,
  lng: number
): Promise<ApiResponse> {
  return apiRequest(`/api/patrols/${id}/update_location/`, {
    method: "POST",
    body: JSON.stringify({ lat, lng }),
  })
}

// ==================== REPORTS API ====================

export async function getReports(params?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<any>>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return apiRequest(`/api/reports/${query}`)
}

export async function getReport(id: string): Promise<ApiResponse<any>> {
  return apiRequest(`/api/reports/${id}/`)
}

export async function generateReport(data: any): Promise<ApiResponse<any>> {
  return apiRequest("/api/reports/generate/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// ==================== AUDIT API ====================

export async function getAuditLogs(params?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<any>>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return apiRequest(`/api/audit/${query}`)
}

// ==================== DASHBOARD API ====================

export async function getDashboardStats(): Promise<ApiResponse<any>> {
  return apiRequest("/api/dashboard/stats/")
}

export async function getViolationsChart(params?: Record<string, any>): Promise<ApiResponse<any>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return apiRequest(`/api/dashboard/violations-chart/${query}`)
}

export async function getViolationsByType(): Promise<ApiResponse<any>> {
  return apiRequest("/api/dashboard/violations-by-type/")
}

// ==================== SMART CITY INTEGRATION ====================

// Отправка штрафов в Умный город (через бэкенд)
export async function sendFinesToSmartCity(fines: any[]): Promise<ApiResponse> {
  try {
    const response = await fetch(`${SMART_CITY_URL}/api/gai/fines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": GAI_API_KEY,
      },
      body: JSON.stringify({ fines }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to send fines",
      }
    }

    return {
      success: true,
      message: data.message,
      data: data,
    }
  } catch (error) {
    console.error("Error sending fines to Smart City:", error)
    return {
      success: false,
      error: "Connection failed. Check if Smart City is running.",
    }
  }
}

// Отправка данных штрафстоянки в Умный город
export async function sendImpoundToSmartCity(vehicles: any[]): Promise<ApiResponse> {
  try {
    const response = await fetch(`${SMART_CITY_URL}/api/gai/impound`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": GAI_API_KEY,
      },
      body: JSON.stringify({ vehicles }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to send impound data",
      }
    }

    return {
      success: true,
      message: data.message,
      data: data,
    }
  } catch (error) {
    console.error("Error sending impound data to Smart City:", error)
    return {
      success: false,
      error: "Connection failed. Check if Smart City is running.",
    }
  }
}

// Отправка данных камер в Умный город
export async function sendCameraDataToSmartCity(cameras: any[]): Promise<ApiResponse> {
  try {
    const response = await fetch(`${SMART_CITY_URL}/api/gai/cameras`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": GAI_API_KEY,
      },
      body: JSON.stringify({ cameras }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to send camera data",
      }
    }

    return {
      success: true,
      message: data.message,
      data: data,
    }
  } catch (error) {
    console.error("Error sending camera data to Smart City:", error)
    return {
      success: false,
      error: "Connection failed. Check if Smart City is running.",
    }
  }
}

// Проверка подключения к серверу
export async function checkBackendConnection(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/dashboard/stats/`, {
      headers: getAuthHeaders(),
    })

    if (response.ok || response.status === 401) {
      return {
        success: true,
        message: "Backend is reachable",
      }
    }

    return {
      success: false,
      error: "Backend connection failed",
    }
  } catch (error) {
    return {
      success: false,
      error: "Backend is not reachable",
    }
  }
}

// Проверка подключения к Умному городу
export async function checkSmartCityConnection(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${SMART_CITY_URL}/api/gai/fines`, {
      method: "GET",
      headers: {
        "x-api-key": GAI_API_KEY,
      },
    })

    if (response.ok) {
      return {
        success: true,
        message: "Connection successful",
      }
    }

    return {
      success: false,
      error: "Connection failed",
    }
  } catch (error) {
    return {
      success: false,
      error: "Smart City is not reachable",
    }
  }
}

// Инициализация при загрузке
if (typeof window !== "undefined") {
  initAuth()
}
