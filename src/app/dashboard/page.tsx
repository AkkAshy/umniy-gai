"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Receipt,
  Camera,
  Car,
  FileText,
  Users,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  Send,
  Loader2,
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"
import { getDashboardStats, getFines, getOrders } from "@/lib/api"
import {
  violationsChartData,
  violationsByTypeData,
  formatCurrency,
  formatDateTime,
} from "@/lib/mock-data"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface DashboardStats {
  fines_today: number
  fines_amount: string
  fines_month: number
  fines_amount_month: string
  cameras_active: number
  cameras_total: number
  impounded_vehicles: number
  pending_orders: number
  active_closures: number
  patrols_on_duty: number
}

export default function DashboardPage() {
  const { t } = useLanguage()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentFines, setRecentFines] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
      const [statsResult, finesResult, ordersResult] = await Promise.all([
        getDashboardStats(),
        getFines({ page_size: 5 }),
        getOrders({ status: "new", page_size: 5 }),
      ])

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data)
      }
      if (finesResult.success && finesResult.data) {
        setRecentFines(finesResult.data.results)
      }
      if (ordersResult.success && ordersResult.data) {
        setRecentOrders(ordersResult.data.results)
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = stats ? [
    {
      title: t.dashboard.finesToday,
      value: stats.fines_today,
      subvalue: formatCurrency(parseFloat(stats.fines_amount)),
      icon: Receipt,
      trend: "+12%",
      trendUp: true,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: t.dashboard.camerasActive,
      value: `${stats.cameras_active}/${stats.cameras_total}`,
      icon: Camera,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: t.dashboard.impoundedVehicles,
      value: stats.impounded_vehicles,
      icon: Car,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: t.dashboard.pendingOrders,
      value: stats.pending_orders,
      icon: FileText,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      alert: stats.pending_orders > 0,
    },
    {
      title: t.dashboard.patrolsOnDuty,
      value: stats.patrols_on_duty,
      icon: Users,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ] : []

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      new: { label: t.fines.statuses.new, variant: "default" },
      sent: { label: t.fines.statuses.sent, variant: "secondary" },
      pending_payment: { label: t.fines.statuses.pending_payment, variant: "outline" },
      paid: { label: t.fines.statuses.paid, variant: "secondary" },
      appealed: { label: t.fines.statuses.appealed, variant: "destructive" },
      cancelled: { label: t.fines.statuses.cancelled, variant: "destructive" },
    }
    const { label, variant } = variants[status] || { label: status, variant: "default" }
    return <Badge variant={variant}>{label}</Badge>
  }

  const getOrderPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }
    const labels = t.orders.priorities as Record<string, string>
    return (
      <Badge className={colors[priority]}>
        {labels[priority] || priority}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold">{t.dashboard.title}</h1>
          <p className="text-muted-foreground">{t.dashboard.subtitle}</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
        >
          {statCards.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between pb-2 min-h-[56px]">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex-1 pr-2">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    {stat.trend && (
                      <span className={`text-xs flex items-center gap-0.5 ${stat.trendUp ? "text-green-500" : "text-red-500"}`}>
                        {stat.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {stat.trend}
                      </span>
                    )}
                  </div>
                  {stat.subvalue && (
                    <p className="text-sm text-muted-foreground mt-1">{stat.subvalue}</p>
                  )}
                </CardContent>
                {stat.alert && (
                  <div className="absolute top-2 right-2">
                    <AlertCircle className="h-4 w-4 text-destructive animate-pulse" />
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <motion.div
          variants={itemVariants}
          className="grid gap-6 lg:grid-cols-2"
        >
          {/* Violations Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.violationsChart}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={violationsChartData}>
                    <defs>
                      <linearGradient id="colorViolations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(221.2 83.2% 53.3%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(221.2 83.2% 53.3%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="violations"
                      stroke="hsl(221.2 83.2% 53.3%)"
                      strokeWidth={2}
                      fill="url(#colorViolations)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Violations by Type */}
          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.violationsByType}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={violationsByTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {violationsByTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {violationsByTypeData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground truncate">{item.type}</span>
                    <span className="font-medium ml-auto">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Data Row */}
        <motion.div
          variants={itemVariants}
          className="grid gap-6 lg:grid-cols-2"
        >
          {/* Recent Fines */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t.dashboard.recentFines}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/fines"}>
                {t.common.all}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentFines.length > 0 ? recentFines.map((fine) => (
                  <div
                    key={fine.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{fine.plate_number}</span>
                        <span className="text-sm text-muted-foreground">
                          {t.fines.violationTypes[fine.violation_type as keyof typeof t.fines.violationTypes] || fine.violation_type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(parseFloat(fine.amount))}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(fine.datetime)}
                        </div>
                      </div>
                      {getStatusBadge(fine.status)}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {t.common.noData}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t.dashboard.recentOrders}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/orders"}>
                {t.common.all}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-lg border border-primary/20 bg-primary/5"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium">{order.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {order.description}
                          </p>
                        </div>
                        {getOrderPriorityBadge(order.priority)}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-muted-foreground">
                          {t.orders.createdBy}: {order.created_by}
                        </div>
                        <Button size="sm">
                          <Send className="h-4 w-4 mr-1" />
                          {t.orders.accept}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {t.common.noData}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  )
}
