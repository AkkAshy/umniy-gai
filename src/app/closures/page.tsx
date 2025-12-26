"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Construction,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Route,
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
import { mockClosures, formatDateTime } from "@/lib/mock-data"
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

export default function ClosuresPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredClosures = mockClosures.filter((closure) => {
    const matchesSearch =
      closure.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
      closure.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      closure.reason.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || closure.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockClosures.length,
    planned: mockClosures.filter((c) => c.status === "planned").length,
    active: mockClosures.filter((c) => c.status === "active").length,
    completed: mockClosures.filter((c) => c.status === "completed").length,
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { icon: React.ReactNode; className: string }> = {
      planned: {
        icon: <Clock className="h-3 w-3 mr-1" />,
        className: "bg-blue-500 text-white",
      },
      active: {
        icon: <AlertTriangle className="h-3 w-3 mr-1" />,
        className: "bg-orange-500 text-white",
      },
      completed: {
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
        className: "bg-green-500 text-white",
      },
    }
    const { icon, className } = config[status] || { icon: null, className: "" }
    return (
      <Badge className={`${className} flex items-center`}>
        {icon}
        {t.closures.statuses[status as keyof typeof t.closures.statuses]}
      </Badge>
    )
  }

  const handleActivate = (closureId: string) => {
    toast.success("Перекрытие активировано", {
      description: `Перекрытие ${closureId} теперь активно`,
    })
  }

  const handleComplete = (closureId: string) => {
    toast.success("Перекрытие завершено", {
      description: `Перекрытие ${closureId} отмечено как завершённое`,
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
            <h1 className="text-3xl font-bold">{t.closures.title}</h1>
            <p className="text-muted-foreground">{t.closures.subtitle}</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t.closures.createClosure}
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Construction className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-sm text-muted-foreground">{t.common.all}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-blue-500">{stats.planned}</div>
                  <p className="text-sm text-muted-foreground">{t.closures.plannedClosures}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-500/50 bg-orange-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold text-orange-500">{stats.active}</div>
                  <p className="text-sm text-muted-foreground">{t.closures.activeClosure}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
                  <p className="text-sm text-muted-foreground">{t.closures.statuses.completed}</p>
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
                    placeholder={`${t.common.search} (улица, причина, ID)`}
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
                    {Object.entries(t.closures.statuses).map(([key, label]) => (
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
                <Construction className="h-5 w-5" />
                {t.closures.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{t.closures.street}</TableHead>
                    <TableHead>Участок</TableHead>
                    <TableHead>{t.closures.reason}</TableHead>
                    <TableHead>Период</TableHead>
                    <TableHead>{t.closures.alternatives}</TableHead>
                    <TableHead>{t.common.status}</TableHead>
                    <TableHead className="text-right">{t.common.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClosures.map((closure) => (
                    <TableRow key={closure.id}>
                      <TableCell className="font-mono text-sm">{closure.id}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {closure.street}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {t.closures.from} {closure.fromAddress} {t.closures.to} {closure.toAddress}
                      </TableCell>
                      <TableCell>{closure.reason}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {formatDateTime(closure.startTime)}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDateTime(closure.endTime)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Route className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">
                            {closure.alternativeRoutes.join(", ")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(closure.status)}</TableCell>
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
                            {closure.status === "planned" && (
                              <DropdownMenuItem onClick={() => handleActivate(closure.id)}>
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Активировать
                              </DropdownMenuItem>
                            )}
                            {closure.status === "active" && (
                              <DropdownMenuItem onClick={() => handleComplete(closure.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Завершить
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredClosures.length === 0 && (
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
