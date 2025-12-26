"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Search,
  MoreHorizontal,
  CheckCircle,
  Play,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  FileCheck,
  Eye,
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/lib/i18n/context"
import { mockOrders, formatDateTime } from "@/lib/mock-data"
import { toast } from "sonner"
import { OrderStatus, OrderType } from "@/types"

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

export default function OrdersPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockOrders.length,
    new: mockOrders.filter((o) => o.status === "new").length,
    inProgress: mockOrders.filter((o) => o.status === "in_progress" || o.status === "accepted").length,
    completed: mockOrders.filter((o) => o.status === "completed").length,
  }

  const getStatusBadge = (status: OrderStatus) => {
    const config: Record<OrderStatus, { icon: React.ReactNode; className: string }> = {
      new: { icon: <AlertTriangle className="h-3 w-3 mr-1" />, className: "bg-blue-500 text-white" },
      accepted: { icon: <CheckCircle className="h-3 w-3 mr-1" />, className: "bg-purple-500 text-white" },
      in_progress: { icon: <Play className="h-3 w-3 mr-1" />, className: "bg-yellow-500 text-white" },
      completed: { icon: <CheckCircle className="h-3 w-3 mr-1" />, className: "bg-green-500 text-white" },
      cancelled: { icon: null, className: "bg-gray-500 text-white" },
    }
    const { icon, className } = config[status]
    return (
      <Badge className={`${className} flex items-center`}>
        {icon}
        {t.orders.statuses[status]}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-pulse",
    }
    const labels = t.orders.priorities as Record<string, string>
    return (
      <Badge className={colors[priority]}>
        {priority === "urgent" && <AlertTriangle className="h-3 w-3 mr-1" />}
        {labels[priority]}
      </Badge>
    )
  }

  const getTypeBadge = (type: OrderType) => {
    return (
      <span className="text-sm">
        {t.orders.types[type]}
      </span>
    )
  }

  const handleAccept = (orderId: string) => {
    toast.success(t.orders.accept, {
      description: `Приказ ${orderId} принят к исполнению`,
    })
  }

  const handleComplete = (orderId: string) => {
    toast.success(t.orders.complete, {
      description: `Приказ ${orderId} отмечен как выполненный`,
    })
  }

  const handleSendReport = (orderId: string) => {
    toast.success(t.orders.sendReport, {
      description: `Отчёт по приказу ${orderId} отправлен в Умный город`,
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
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold">{t.orders.title}</h1>
          <p className="text-muted-foreground">{t.orders.subtitle}</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">{t.common.all}</p>
            </CardContent>
          </Card>
          <Card className="border-blue-500/50 bg-blue-500/5">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-500">{stats.new}</div>
              <p className="text-sm text-muted-foreground">{t.orders.newOrders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-500">{stats.inProgress}</div>
              <p className="text-sm text-muted-foreground">{t.orders.inProgress}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
              <p className="text-sm text-muted-foreground">{t.orders.completed}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`${t.common.search} (название, ID)`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder={t.common.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.common.all}</SelectItem>
                    {Object.entries(t.orders.statuses).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* New Orders Alert */}
        {stats.new > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="border-blue-500 bg-blue-500/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-500">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {stats.new} {stats.new === 1 ? "новый приказ" : "новых приказов"} от хокимията
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Требуется принятие к исполнению
                    </p>
                  </div>
                  <Button>
                    Просмотреть все
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Table */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t.orders.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>{t.orders.streets}</TableHead>
                    <TableHead>{t.orders.period}</TableHead>
                    <TableHead>{t.orders.priority}</TableHead>
                    <TableHead>{t.common.status}</TableHead>
                    <TableHead>{t.orders.createdBy}</TableHead>
                    <TableHead className="text-right">{t.common.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className={order.status === "new" ? "bg-blue-500/5" : ""}>
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell>
                        <div className="max-w-[250px]">
                          <p className="font-medium truncate">{order.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{order.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(order.type)}</TableCell>
                      <TableCell>
                        <div className="flex items-start gap-1 text-sm max-w-[200px]">
                          <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="truncate">{order.streets.join(", ")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {formatDateTime(order.startTime)}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDateTime(order.endTime)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate max-w-[100px]">{order.createdBy}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t.common.actions}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              {t.common.view}
                            </DropdownMenuItem>
                            {order.status === "new" && (
                              <DropdownMenuItem onClick={() => handleAccept(order.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {t.orders.accept}
                              </DropdownMenuItem>
                            )}
                            {(order.status === "accepted" || order.status === "in_progress") && (
                              <DropdownMenuItem onClick={() => handleComplete(order.id)}>
                                <Play className="h-4 w-4 mr-2" />
                                {t.orders.complete}
                              </DropdownMenuItem>
                            )}
                            {order.status === "completed" && (
                              <DropdownMenuItem onClick={() => handleSendReport(order.id)}>
                                <FileCheck className="h-4 w-4 mr-2" />
                                {t.orders.sendReport}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredOrders.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {t.common.noData}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  )
}
