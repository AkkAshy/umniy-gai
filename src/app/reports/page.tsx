"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Receipt,
  Camera,
  Car,
  DollarSign,
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/lib/i18n/context"
import { mockDashboardStats, formatCurrency } from "@/lib/mock-data"
import { toast } from "sonner"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const weeklyData = [
  { day: "Пн", fines: 45, amount: 22500000 },
  { day: "Вт", fines: 52, amount: 26000000 },
  { day: "Ср", fines: 38, amount: 19000000 },
  { day: "Чт", fines: 61, amount: 30500000 },
  { day: "Пт", fines: 55, amount: 27500000 },
  { day: "Сб", fines: 32, amount: 16000000 },
  { day: "Вс", fines: 28, amount: 14000000 },
]

const monthlyData = [
  { month: "Янв", fines: 856 },
  { month: "Фев", fines: 742 },
  { month: "Мар", fines: 891 },
  { month: "Апр", fines: 967 },
  { month: "Май", fines: 1023 },
  { month: "Июн", fines: 1156 },
  { month: "Июл", fines: 1089 },
  { month: "Авг", fines: 978 },
  { month: "Сен", fines: 1034 },
  { month: "Окт", fines: 1112 },
  { month: "Ноя", fines: 945 },
  { month: "Дек", fines: 856 },
]

export default function ReportsPage() {
  const { t } = useLanguage()
  const [reportType, setReportType] = useState("daily")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const stats = mockDashboardStats

  const reportTypes = [
    {
      id: "daily",
      title: t.reports.dailyReport,
      description: "Статистика за текущий день",
      icon: Calendar,
    },
    {
      id: "weekly",
      title: t.reports.weeklyReport,
      description: "Статистика за последнюю неделю",
      icon: BarChart3,
    },
    {
      id: "monthly",
      title: t.reports.monthlyReport,
      description: "Статистика за текущий месяц",
      icon: TrendingUp,
    },
    {
      id: "custom",
      title: t.reports.customReport,
      description: "Выберите произвольный период",
      icon: FileText,
    },
  ]

  const handleGenerateReport = () => {
    toast.success(t.reports.generateReport, {
      description: "Отчёт формируется...",
    })
  }

  const handleExportPdf = () => {
    toast.success(t.reports.exportPdf, {
      description: "Отчёт экспортируется в PDF...",
    })
  }

  const handleExportExcel = () => {
    toast.success(t.reports.exportExcel, {
      description: "Отчёт экспортируется в Excel...",
    })
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
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t.reports.title}</h1>
            <p className="text-muted-foreground">{t.reports.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPdf}>
              <Download className="h-4 w-4 mr-2" />
              {t.reports.exportPdf}
            </Button>
            <Button variant="outline" onClick={handleExportExcel}>
              <Download className="h-4 w-4 mr-2" />
              {t.reports.exportExcel}
            </Button>
          </div>
        </motion.div>

        {/* Report Type Selection */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
          {reportTypes.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all ${reportType === type.id ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"}`}
              onClick={() => setReportType(type.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${reportType === type.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <type.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{type.title}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Custom Date Range */}
        {reportType === "custom" && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Дата начала</label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Дата окончания</label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleGenerateReport}>
                    {t.reports.generateReport}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Summary Stats */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Receipt className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.finesMonth}</div>
                  <p className="text-sm text-muted-foreground">Штрафов за месяц</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{formatCurrency(stats.finesAmountMonth)}</div>
                  <p className="text-sm text-muted-foreground">Сумма за месяц</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Camera className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.camerasActive}/{stats.camerasTotal}</div>
                  <p className="text-sm text-muted-foreground">Активных камер</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Car className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.impoundedVehicles}</div>
                  <p className="text-sm text-muted-foreground">ТС на стоянке</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts */}
        <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
          {/* Weekly Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Штрафы за неделю</CardTitle>
              <CardDescription>Количество штрафов по дням недели</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [
                        typeof value === "number" ? value : 0,
                        "Штрафов",
                      ]}
                    />
                    <Bar dataKey="fines" fill="hsl(221.2 83.2% 53.3%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Динамика за год</CardTitle>
              <CardDescription>Количество штрафов по месяцам</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [typeof value === "number" ? value : 0, "Штрафов"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="fines"
                      stroke="hsl(221.2 83.2% 53.3%)"
                      strokeWidth={2}
                      dot={{ fill: "hsl(221.2 83.2% 53.3%)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Report Preview */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Предпросмотр отчёта</CardTitle>
                <CardDescription>
                  {reportType === "daily" && "Ежедневный отчёт за 26.12.2025"}
                  {reportType === "weekly" && "Недельный отчёт за 20.12 - 26.12.2025"}
                  {reportType === "monthly" && "Месячный отчёт за декабрь 2025"}
                  {reportType === "custom" && "Произвольный период"}
                </CardDescription>
              </div>
              <Button onClick={handleGenerateReport}>
                <FileText className="h-4 w-4 mr-2" />
                {t.reports.generateReport}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-muted/30">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold">ГАИ Нөкис</h2>
                  <p className="text-muted-foreground">Отчёт о деятельности</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-muted-foreground">Выписано штрафов</p>
                    <p className="text-2xl font-bold">{stats.finesToday}</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-muted-foreground">Сумма штрафов</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.finesAmount)}</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-muted-foreground">Эвакуировано ТС</p>
                    <p className="text-2xl font-bold">{stats.impoundedVehicles}</p>
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Сформировано: {new Date().toLocaleDateString("ru-RU")} {new Date().toLocaleTimeString("ru-RU")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  )
}
