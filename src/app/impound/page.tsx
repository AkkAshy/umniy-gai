"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Car,
  Plus,
  Search,
  MoreHorizontal,
  Send,
  Eye,
  CreditCard,
  LogOut,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Truck,
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
import { mockImpoundedVehicles, formatCurrency, formatDateTime } from "@/lib/mock-data"
import { toast } from "sonner"
import { ImpoundStatus, ImpoundReason } from "@/types"

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

export default function ImpoundPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredVehicles = mockImpoundedVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockImpoundedVehicles.length,
    impounded: mockImpoundedVehicles.filter((v) => v.status === "impounded").length,
    pending: mockImpoundedVehicles.filter((v) => v.status === "pending_payment").length,
    ready: mockImpoundedVehicles.filter((v) => v.status === "ready_for_release").length,
    totalAmount: mockImpoundedVehicles.reduce((sum, v) => sum + v.totalAmount, 0),
  }

  const getStatusBadge = (status: ImpoundStatus) => {
    const variants: Record<ImpoundStatus, { variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
      impounded: { variant: "default", className: "bg-orange-500" },
      pending_payment: { variant: "outline" },
      ready_for_release: { variant: "secondary", className: "bg-green-500 text-white" },
      released: { variant: "secondary" },
    }
    const { variant, className } = variants[status]
    return (
      <Badge variant={variant} className={className}>
        {t.impound.statuses[status]}
      </Badge>
    )
  }

  const handleSendToSmartCity = (vehicleId: string) => {
    toast.success("Отправлено в Умный город", {
      description: `Данные о ТС ${vehicleId} отправлены в систему Умный город`,
    })
  }

  const handleMarkPaid = (vehicleId: string) => {
    toast.success(t.impound.markPaid, {
      description: `Оплата за ТС ${vehicleId} подтверждена`,
    })
  }

  const handleRelease = (vehicleId: string) => {
    toast.success(t.impound.release, {
      description: `ТС ${vehicleId} выдано владельцу`,
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
            <h1 className="text-3xl font-bold">{t.impound.title}</h1>
            <p className="text-muted-foreground">{t.impound.subtitle}</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t.impound.registerVehicle}
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">{t.common.all}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-500">{stats.impounded}</div>
              <p className="text-sm text-muted-foreground">{t.impound.statuses.impounded}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
              <p className="text-sm text-muted-foreground">{t.impound.statuses.pending_payment}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">{stats.ready}</div>
              <p className="text-sm text-muted-foreground">{t.impound.statuses.ready_for_release}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
              <p className="text-sm text-muted-foreground">{t.common.total}</p>
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
                    placeholder={`${t.common.search} (${t.impound.plateNumber}, ID)`}
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
                    {Object.entries(t.impound.statuses).map(([key, label]) => (
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

        {/* Table */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                {t.impound.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{t.impound.plateNumber}</TableHead>
                    <TableHead>{t.impound.vehicleMake}/{t.impound.vehicleModel}</TableHead>
                    <TableHead>{t.impound.reason}</TableHead>
                    <TableHead>{t.impound.impoundedAt}</TableHead>
                    <TableHead>{t.impound.daysOnLot}</TableHead>
                    <TableHead>{t.impound.totalAmount}</TableHead>
                    <TableHead>{t.common.status}</TableHead>
                    <TableHead className="text-center">
                      <span title="Умный город"><Send className="h-4 w-4 mx-auto" /></span>
                    </TableHead>
                    <TableHead className="text-right">{t.common.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-mono text-sm">{vehicle.id}</TableCell>
                      <TableCell className="font-medium">{vehicle.plateNumber}</TableCell>
                      <TableCell>
                        <div>
                          <span>{vehicle.vehicleMake} {vehicle.vehicleModel}</span>
                          <span className="text-sm text-muted-foreground ml-2">({vehicle.vehicleColor})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {t.impound.reasons[vehicle.reason as ImpoundReason]}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDateTime(vehicle.impoundedAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{vehicle.totalDays}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(vehicle.totalAmount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                      <TableCell className="text-center">
                        {vehicle.sentToSmartCity ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleSendToSmartCity(vehicle.id)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
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
                            {vehicle.status === "pending_payment" && (
                              <DropdownMenuItem onClick={() => handleMarkPaid(vehicle.id)}>
                                <CreditCard className="h-4 w-4 mr-2" />
                                {t.impound.markPaid}
                              </DropdownMenuItem>
                            )}
                            {vehicle.status === "ready_for_release" && (
                              <DropdownMenuItem onClick={() => handleRelease(vehicle.id)}>
                                <LogOut className="h-4 w-4 mr-2" />
                                {t.impound.release}
                              </DropdownMenuItem>
                            )}
                            {!vehicle.sentToSmartCity && (
                              <DropdownMenuItem onClick={() => handleSendToSmartCity(vehicle.id)}>
                                <Send className="h-4 w-4 mr-2" />
                                Отправить в Умный город
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredVehicles.length === 0 && (
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
