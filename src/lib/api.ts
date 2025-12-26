// API клиент для интеграции с Умным городом

const SMART_CITY_URL = process.env.NEXT_PUBLIC_SMART_CITY_URL || "http://localhost:3000"
const GAI_API_KEY = process.env.NEXT_PUBLIC_GAI_API_KEY || "gai-secret-key-2025"

interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

// Отправка штрафов в Умный город
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
