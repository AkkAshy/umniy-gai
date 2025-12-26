"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Camera,
  Search,
  MoreHorizontal,
  Eye,
  Settings,
  MapPin,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wrench,
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
import { mockCameras, formatDateTime } from "@/lib/mock-data"
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

export default function CamerasPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredCameras = mockCameras.filter((camera) => {
    const matchesSearch =
      camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.location.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || camera.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockCameras.length,
    active: mockCameras.filter((c) => c.status === "active").length,
    maintenance: mockCameras.filter((c) => c.status === "maintenance").length,
    offline: mockCameras.filter((c) => c.status === "offline").length,
    violationsToday: mockCameras.reduce((sum, c) => sum + c.violationsToday, 0),
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { icon: React.ReactNode; className: string }> = {
      active: {
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
        className: "bg-green-500 text-white"
      },
      maintenance: {
        icon: <Wrench className="h-3 w-3 mr-1" />,
        className: "bg-yellow-500 text-white"
      },
      offline: {
        icon: <XCircle className="h-3 w-3 mr-1" />,
        className: "bg-red-500 text-white"
      },
    }
    const { icon, className } = config[status] || { icon: null, className: "" }
    return (
      <Badge className={`${className} flex items-center`}>
        {icon}
        {t.cameras.statuses[status as keyof typeof t.cameras.statuses]}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant="outline">
        {t.cameras.types[type as keyof typeof t.cameras.types]}
      </Badge>
    )
  }

  const handleViewCamera = (cameraId: string) => {
    toast.info("Просмотр камеры", {
      description: `Открытие потока камеры ${cameraId}...`,
    })
  }

  const handleSettings = (cameraId: string) => {
    toast.info("Настройки камеры", {
      description: `Открытие настроек камеры ${cameraId}...`,
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
          <h1 className="text-3xl font-bold">{t.cameras.title}</h1>
          <p className="text-muted-foreground">{t.cameras.subtitle}</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-sm text-muted-foreground">{t.cameras.totalCameras}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-500/50 bg-green-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-green-500">{stats.active}</div>
                  <p className="text-sm text-muted-foreground">{t.cameras.activeCameras}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold text-yellow-500">{stats.maintenance}</div>
                  <p className="text-sm text-muted-foreground">{t.cameras.maintenanceCameras}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-2xl font-bold text-red-500">{stats.offline}</div>
                  <p className="text-sm text-muted-foreground">{t.cameras.offlineCameras}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-blue-500">{stats.violationsToday}</div>
                  <p className="text-sm text-muted-foreground">{t.cameras.violationsToday}</p>
                </div>
              </div>
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
                    placeholder={`${t.common.search} (название, адрес, ID)`}
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
                    {Object.entries(t.cameras.statuses).map(([key, label]) => (
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

        {/* Offline Alert */}
        {stats.offline > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="border-red-500 bg-red-500/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-red-500">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {stats.offline} {stats.offline === 1 ? "камера не работает" : "камер не работают"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Требуется техническое обслуживание
                    </p>
                  </div>
                  <Button variant="destructive">
                    Создать заявку
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
                <Camera className="h-5 w-5" />
                {t.cameras.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>{t.cameras.location}</TableHead>
                    <TableHead>{t.cameras.type}</TableHead>
                    <TableHead>{t.cameras.speedLimit}</TableHead>
                    <TableHead>{t.cameras.violationsToday}</TableHead>
                    <TableHead>{t.cameras.violationsMonth}</TableHead>
                    <TableHead>{t.common.status}</TableHead>
                    <TableHead className="text-right">{t.common.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCameras.map((camera) => (
                    <TableRow key={camera.id}>
                      <TableCell className="font-mono text-sm">{camera.id}</TableCell>
                      <TableCell className="font-medium">{camera.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate max-w-[200px]">{camera.location.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(camera.type)}</TableCell>
                      <TableCell>
                        {camera.speedLimit ? `${camera.speedLimit} км/ч` : "—"}
                      </TableCell>
                      <TableCell>
                        <span className={camera.violationsToday > 0 ? "font-medium text-blue-500" : ""}>
                          {camera.violationsToday}
                        </span>
                      </TableCell>
                      <TableCell>{camera.violationsMonth}</TableCell>
                      <TableCell>{getStatusBadge(camera.status)}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewCamera(camera.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Смотреть поток
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Activity className="h-4 w-4 mr-2" />
                              Статистика
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSettings(camera.id)}>
                              <Settings className="h-4 w-4 mr-2" />
                              Настройки
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredCameras.length === 0 && (
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
