"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Search,
  MoreHorizontal,
  Eye,
  MapPin,
  Phone,
  Radio,
  Car,
  CheckCircle,
  Clock,
  Coffee,
  AlertTriangle,
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
import { mockPatrols, formatDateTime } from "@/lib/mock-data"
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

export default function PatrolsPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredPatrols = mockPatrols.filter((patrol) => {
    const matchesSearch =
      patrol.callSign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patrol.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patrol.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || patrol.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockPatrols.length,
    onPatrol: mockPatrols.filter((p) => p.status === "on_patrol").length,
    onCall: mockPatrols.filter((p) => p.status === "on_call").length,
    available: mockPatrols.filter((p) => p.status === "available").length,
    offDuty: mockPatrols.filter((p) => p.status === "off_duty").length,
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { icon: React.ReactNode; className: string }> = {
      on_patrol: {
        icon: <Car className="h-3 w-3 mr-1" />,
        className: "bg-blue-500 text-white",
      },
      on_call: {
        icon: <AlertTriangle className="h-3 w-3 mr-1 animate-pulse" />,
        className: "bg-red-500 text-white",
      },
      available: {
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
        className: "bg-green-500 text-white",
      },
      off_duty: {
        icon: <Clock className="h-3 w-3 mr-1" />,
        className: "bg-gray-500 text-white",
      },
      break: {
        icon: <Coffee className="h-3 w-3 mr-1" />,
        className: "bg-yellow-500 text-white",
      },
    }
    const { icon, className } = config[status] || { icon: null, className: "" }
    return (
      <Badge className={`${className} flex items-center`}>
        {icon}
        {t.patrols.statuses[status as keyof typeof t.patrols.statuses]}
      </Badge>
    )
  }

  const handleAssignTask = (patrolId: string) => {
    toast.info("Назначение задачи", {
      description: `Открытие формы назначения задачи для ${patrolId}...`,
    })
  }

  const handleCall = (patrolId: string) => {
    toast.success("Вызов отправлен", {
      description: `Экипаж ${patrolId} получил вызов`,
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
          <h1 className="text-3xl font-bold">{t.patrols.title}</h1>
          <p className="text-muted-foreground">{t.patrols.subtitle}</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-sm text-muted-foreground">{t.common.all}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-500/50 bg-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-blue-500">{stats.onPatrol}</div>
                  <p className="text-sm text-muted-foreground">{t.patrols.onDuty}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-500/50 bg-red-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-2xl font-bold text-red-500">{stats.onCall}</div>
                  <p className="text-sm text-muted-foreground">{t.patrols.onCall}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-green-500">{stats.available}</div>
                  <p className="text-sm text-muted-foreground">{t.patrols.available}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-500">{stats.offDuty}</div>
                  <p className="text-sm text-muted-foreground">{t.patrols.statuses.off_duty}</p>
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
                    placeholder={`${t.common.search} (позывной, номер, ID)`}
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
                    {Object.entries(t.patrols.statuses).map(([key, label]) => (
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
                <Users className="h-5 w-5" />
                {t.patrols.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{t.patrols.callSign}</TableHead>
                    <TableHead>Автомобиль</TableHead>
                    <TableHead>{t.patrols.officers}</TableHead>
                    <TableHead>{t.patrols.currentLocation}</TableHead>
                    <TableHead>{t.patrols.assignedArea}</TableHead>
                    <TableHead>Смена</TableHead>
                    <TableHead>{t.common.status}</TableHead>
                    <TableHead className="text-right">{t.common.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatrols.map((patrol) => (
                    <TableRow key={patrol.id}>
                      <TableCell className="font-mono text-sm">{patrol.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Radio className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{patrol.callSign}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Car className="h-3 w-3 text-muted-foreground" />
                          {patrol.vehiclePlate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {patrol.officers.map((officer, idx) => (
                            <div key={officer.id} className="flex items-center gap-1">
                              <span className="font-medium">{officer.name}</span>
                              <span className="text-muted-foreground">({officer.rank})</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {patrol.currentLocation ? (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[150px]">{patrol.currentLocation.address}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {patrol.assignedArea || <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {formatDateTime(patrol.shiftStart).split(" ")[1]}
                          </div>
                          <div className="text-muted-foreground">
                            до {formatDateTime(patrol.shiftEnd).split(" ")[1]}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(patrol.status)}</TableCell>
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
                            <DropdownMenuItem>
                              <MapPin className="h-4 w-4 mr-2" />
                              На карте
                            </DropdownMenuItem>
                            {patrol.status === "available" && (
                              <DropdownMenuItem onClick={() => handleCall(patrol.callSign)}>
                                <Phone className="h-4 w-4 mr-2" />
                                Отправить вызов
                              </DropdownMenuItem>
                            )}
                            {(patrol.status === "on_patrol" || patrol.status === "available") && (
                              <DropdownMenuItem onClick={() => handleAssignTask(patrol.callSign)}>
                                <Radio className="h-4 w-4 mr-2" />
                                Назначить задачу
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredPatrols.length === 0 && (
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
