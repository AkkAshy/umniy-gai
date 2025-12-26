"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ParkingCircle,
  Search,
  MoreHorizontal,
  Eye,
  MapPin,
  Car,
  Clock,
  AlertTriangle,
  CheckCircle,
  Ban,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/lib/i18n/context"
import {
  mockParkingZones,
  mockParkingSessions,
  mockParkingViolations,
  formatCurrency,
  formatDateTime,
} from "@/lib/mock-data"
import { toast } from "sonner"

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

export default function ParkingPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  const totalCapacity = mockParkingZones.reduce((sum, z) => sum + z.capacity, 0)
  const totalOccupied = mockParkingZones.reduce((sum, z) => sum + z.occupied, 0)

  const stats = {
    totalZones: mockParkingZones.length,
    totalSpots: totalCapacity,
    occupiedSpots: totalOccupied,
    freeSpots: totalCapacity - totalOccupied,
    activeSessions: mockParkingSessions.filter((s) => s.status === "active").length,
    violations: mockParkingViolations.length,
  }

  const getZoneStatusBadge = (status: string) => {
    const config: Record<string, { icon: React.ReactNode; className: string; label: string }> = {
      active: {
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
        className: "bg-green-500 text-white",
        label: "Активна",
      },
      full: {
        icon: <Ban className="h-3 w-3 mr-1" />,
        className: "bg-orange-500 text-white",
        label: "Заполнена",
      },
      closed: {
        icon: <Ban className="h-3 w-3 mr-1" />,
        className: "bg-gray-500 text-white",
        label: "Закрыта",
      },
    }
    const { icon, className, label } = config[status] || { icon: null, className: "", label: status }
    return (
      <Badge className={`${className} flex items-center`}>
        {icon}
        {label}
      </Badge>
    )
  }

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const percent = (occupied / capacity) * 100
    if (percent >= 90) return "text-red-500"
    if (percent >= 70) return "text-orange-500"
    return "text-green-500"
  }

  const handleCreateFine = (plateNumber: string) => {
    toast.success("Штраф создан", {
      description: `Штраф для ${plateNumber} создан и будет отправлен в Умный город`,
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
          <h1 className="text-3xl font-bold">{t.parking.title}</h1>
          <p className="text-muted-foreground">{t.parking.subtitle}</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.totalZones}</div>
              <p className="text-sm text-muted-foreground">{t.parking.totalZones}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.totalSpots}</div>
              <p className="text-sm text-muted-foreground">{t.parking.totalSpots}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-500">{stats.occupiedSpots}</div>
              <p className="text-sm text-muted-foreground">{t.parking.occupiedSpots}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">{stats.freeSpots}</div>
              <p className="text-sm text-muted-foreground">{t.parking.freeSpots}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-500">{stats.activeSessions}</div>
              <p className="text-sm text-muted-foreground">{t.parking.sessions}</p>
            </CardContent>
          </Card>
          <Card className="border-red-500/50 bg-red-500/5">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-500">{stats.violations}</div>
              <p className="text-sm text-muted-foreground">{t.parking.violations}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="zones" className="space-y-4">
            <TabsList>
              <TabsTrigger value="zones">{t.parking.zones}</TabsTrigger>
              <TabsTrigger value="sessions">{t.parking.sessions}</TabsTrigger>
              <TabsTrigger value="violations">{t.parking.violations}</TabsTrigger>
            </TabsList>

            {/* Zones Tab */}
            <TabsContent value="zones">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ParkingCircle className="h-5 w-5" />
                    {t.parking.zones}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Название</TableHead>
                        <TableHead>Адрес</TableHead>
                        <TableHead>Тип</TableHead>
                        <TableHead>Заполненность</TableHead>
                        <TableHead>Тариф</TableHead>
                        <TableHead>{t.common.status}</TableHead>
                        <TableHead className="text-right">{t.common.actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockParkingZones.map((zone) => (
                        <TableRow key={zone.id}>
                          <TableCell className="font-mono text-sm">{zone.id}</TableCell>
                          <TableCell className="font-medium">{zone.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {zone.address}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {zone.type === "street" ? "Уличная" : zone.type === "lot" ? "Площадка" : "Подземная"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${zone.occupied / zone.capacity >= 0.9 ? "bg-red-500" : zone.occupied / zone.capacity >= 0.7 ? "bg-orange-500" : "bg-green-500"}`}
                                  style={{ width: `${(zone.occupied / zone.capacity) * 100}%` }}
                                />
                              </div>
                              <span className={`text-sm font-medium ${getOccupancyColor(zone.occupied, zone.capacity)}`}>
                                {zone.occupied}/{zone.capacity}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(zone.hourlyRate)}/ч</TableCell>
                          <TableCell>{getZoneStatusBadge(zone.status)}</TableCell>
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
                                  Подробнее
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MapPin className="h-4 w-4 mr-2" />
                                  На карте
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {t.parking.sessions}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Госномер</TableHead>
                        <TableHead>Зона</TableHead>
                        <TableHead>Начало</TableHead>
                        <TableHead>Длительность</TableHead>
                        <TableHead>{t.common.status}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockParkingSessions.map((session) => {
                        const startTime = new Date(session.startTime)
                        const now = new Date()
                        const duration = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60))
                        const hours = Math.floor(duration / 60)
                        const minutes = duration % 60

                        return (
                          <TableRow key={session.id}>
                            <TableCell className="font-mono text-sm">{session.id}</TableCell>
                            <TableCell className="font-medium">{session.plateNumber}</TableCell>
                            <TableCell>{session.zoneName}</TableCell>
                            <TableCell>{formatDateTime(session.startTime)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                {hours > 0 ? `${hours}ч ${minutes}м` : `${minutes}м`}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-blue-500 text-white">
                                Активна
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  {mockParkingSessions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {t.common.noData}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Violations Tab */}
            <TabsContent value="violations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    {t.parking.violations}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Госномер</TableHead>
                        <TableHead>Зона</TableHead>
                        <TableHead>Тип нарушения</TableHead>
                        <TableHead>Дата/время</TableHead>
                        <TableHead>Штраф</TableHead>
                        <TableHead>{t.common.status}</TableHead>
                        <TableHead className="text-right">{t.common.actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockParkingViolations.map((violation) => (
                        <TableRow key={violation.id}>
                          <TableCell className="font-mono text-sm">{violation.id}</TableCell>
                          <TableCell className="font-medium">{violation.plateNumber}</TableCell>
                          <TableCell>{violation.zoneName}</TableCell>
                          <TableCell>
                            <Badge variant="destructive">
                              {violation.violationType === "no_payment" ? "Без оплаты" :
                               violation.violationType === "overtime" ? "Превышение времени" :
                               violation.violationType === "wrong_spot" ? "Неправильное место" :
                               "Место для инвалидов"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDateTime(violation.datetime)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(violation.fineAmount)}</TableCell>
                          <TableCell>
                            <Badge className={violation.status === "fined" ? "bg-orange-500 text-white" : violation.status === "paid" ? "bg-green-500 text-white" : "bg-blue-500 text-white"}>
                              {violation.status === "fined" ? "Оштрафован" : violation.status === "paid" ? "Оплачен" : "Новый"}
                            </Badge>
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
                                  Подробнее
                                </DropdownMenuItem>
                                {violation.status === "new" && (
                                  <DropdownMenuItem onClick={() => handleCreateFine(violation.plateNumber)}>
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Выписать штраф
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {mockParkingViolations.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {t.common.noData}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </MainLayout>
  )
}
