"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Receipt,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Send,
  Printer,
  Eye,
  XCircle,
  Camera,
  User,
  MapPin,
  Calendar,
  CheckCircle,
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
import { mockFines, formatCurrency, formatDateTime } from "@/lib/mock-data"
import { toast } from "sonner"
import { FineStatus, ViolationType } from "@/types"

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

export default function FinesPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredFines = mockFines.filter((fine) => {
    const matchesSearch =
      fine.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || fine.status === statusFilter
    const matchesType = typeFilter === "all" || fine.violationType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: mockFines.length,
    new: mockFines.filter((f) => f.status === "new").length,
    sent: mockFines.filter((f) => f.sentToSmartCity).length,
    paid: mockFines.filter((f) => f.status === "paid").length,
    totalAmount: mockFines.reduce((sum, f) => sum + f.amount, 0),
  }

  const getStatusBadge = (status: FineStatus) => {
    const variants: Record<FineStatus, { variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
      new: { variant: "default", className: "bg-blue-500" },
      sent: { variant: "secondary" },
      pending_payment: { variant: "outline" },
      paid: { variant: "secondary", className: "bg-green-500 text-white" },
      appealed: { variant: "destructive" },
      cancelled: { variant: "destructive", className: "bg-gray-500" },
    }
    const { variant, className } = variants[status]
    return (
      <Badge variant={variant} className={className}>
        {t.fines.statuses[status]}
      </Badge>
    )
  }

  const handleSendToSmartCity = (fineId: string) => {
    toast.success(t.fines.sendToSmartCity, {
      description: `Штраф ${fineId} отправлен в систему Умный город`,
    })
  }

  const handlePrint = (fineId: string) => {
    toast.info(t.fines.print, {
      description: `Подготовка постановления ${fineId} к печати...`,
    })
  }

  const handleCancel = (fineId: string) => {
    toast.warning(t.fines.cancel, {
      description: `Штраф ${fineId} аннулирован`,
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
            <h1 className="text-3xl font-bold">{t.fines.title}</h1>
            <p className="text-muted-foreground">{t.fines.subtitle}</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t.fines.createFine}
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
              <div className="text-2xl font-bold text-blue-500">{stats.new}</div>
              <p className="text-sm text-muted-foreground">{t.fines.statuses.new}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-500">{stats.sent}</div>
              <p className="text-sm text-muted-foreground">{t.fines.sent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">{stats.paid}</div>
              <p className="text-sm text-muted-foreground">{t.fines.statuses.paid}</p>
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
                    placeholder={`${t.common.search} (${t.fines.plateNumber}, ID)`}
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
                    {Object.entries(t.fines.statuses).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder={t.fines.violationType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.common.all}</SelectItem>
                    {Object.entries(t.fines.violationTypes).map(([key, label]) => (
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
                <Receipt className="h-5 w-5" />
                {t.fines.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{t.fines.plateNumber}</TableHead>
                    <TableHead>{t.fines.violationType}</TableHead>
                    <TableHead>{t.fines.location}</TableHead>
                    <TableHead>{t.fines.datetime}</TableHead>
                    <TableHead>{t.fines.amount}</TableHead>
                    <TableHead>{t.common.status}</TableHead>
                    <TableHead className="text-center">
                      <span title={t.fines.sendToSmartCity}><Send className="h-4 w-4 mx-auto" /></span>
                    </TableHead>
                    <TableHead className="text-right">{t.common.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFines.map((fine) => (
                    <TableRow key={fine.id}>
                      <TableCell className="font-mono text-sm">{fine.id}</TableCell>
                      <TableCell className="font-medium">{fine.plateNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {fine.cameraId ? (
                            <Camera className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <User className="h-4 w-4 text-muted-foreground" />
                          )}
                          {t.fines.violationTypes[fine.violationType as ViolationType]}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate max-w-[200px]">{fine.location.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDateTime(fine.datetime)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(fine.amount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(fine.status)}</TableCell>
                      <TableCell className="text-center">
                        {fine.sentToSmartCity ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleSendToSmartCity(fine.id)}
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
                            {!fine.sentToSmartCity && (
                              <DropdownMenuItem onClick={() => handleSendToSmartCity(fine.id)}>
                                <Send className="h-4 w-4 mr-2" />
                                {t.fines.sendToSmartCity}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handlePrint(fine.id)}>
                              <Printer className="h-4 w-4 mr-2" />
                              {t.fines.print}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleCancel(fine.id)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              {t.fines.cancel}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredFines.length === 0 && (
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
