import { NextRequest, NextResponse } from "next/server"

// API ключ от Умного города (в продакшене хранить в env переменных)
const SMART_CITY_API_KEY = "smart-city-secret-key-2025"

// Хранилище приказов от хокимията
const ordersStore: any[] = []

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key")
    if (apiKey !== SMART_CITY_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Invalid API key" },
        { status: 401 }
      )
    }

    const data = await request.json()

    if (!data.orders || !Array.isArray(data.orders)) {
      return NextResponse.json(
        { error: "Bad Request", message: "orders array is required" },
        { status: 400 }
      )
    }

    const timestamp = new Date().toISOString()
    const savedOrders = data.orders.map((order: any, index: number) => ({
      ...order,
      receivedAt: timestamp,
      gaiId: `GAI-ORD-${Date.now()}-${index}`,
      source: "SMART-CITY",
      status: "new",
    }))

    ordersStore.push(...savedOrders)

    console.log(`[GAI API] Received ${savedOrders.length} orders from Smart City`)

    return NextResponse.json({
      success: true,
      message: `Received ${savedOrders.length} orders`,
      receivedAt: timestamp,
      ids: savedOrders.map((o: any) => o.gaiId),
    })
  } catch (error) {
    console.error("[GAI API] Error processing orders:", error)
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to process orders" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key")
  if (apiKey !== SMART_CITY_API_KEY) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Invalid API key" },
      { status: 401 }
    )
  }

  return NextResponse.json({
    success: true,
    count: ordersStore.length,
    orders: ordersStore,
  })
}
