"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Settings,
  Globe,
  Palette,
  Bell,
  Shield,
  Database,
  Link,
  Users,
  FileText,
  Save,
  Sun,
  Moon,
  Monitor,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"
import { useTheme } from "next-themes"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/lib/i18n/context"
import { Language } from "@/lib/i18n/translations"
import { toast } from "sonner"
import { checkSmartCityConnection } from "@/lib/api"

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

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [smartCityUrl, setSmartCityUrl] = useState("https://umniygorod.vercel.app")
  const [apiKey, setApiKey] = useState("gai-secret-key-2025")
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "checking" | "success" | "error">("idle")

  const handleSave = () => {
    localStorage.setItem("smartCityUrl", smartCityUrl)
    localStorage.setItem("gaiApiKey", apiKey)
    toast.success("Настройки сохранены", {
      description: "Изменения успешно применены",
    })
  }

  const handleTestConnection = async () => {
    setConnectionStatus("checking")
    toast.info("Проверка подключения", {
      description: "Подключение к Умному городу проверяется...",
    })

    const result = await checkSmartCityConnection()

    if (result.success) {
      setConnectionStatus("success")
      toast.success("Подключение успешно", {
        description: "Связь с Умным городом установлена",
      })
    } else {
      setConnectionStatus("error")
      toast.error("Ошибка подключения", {
        description: result.error || "Не удалось подключиться к Умному городу",
      })
    }
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
          <h1 className="text-3xl font-bold">{t.settings.title}</h1>
          <p className="text-muted-foreground">{t.settings.subtitle}</p>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="general" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">{t.settings.general}</span>
              </TabsTrigger>
              <TabsTrigger value="integration" className="gap-2">
                <Link className="h-4 w-4" />
                <span className="hidden sm:inline">{t.settings.integration}</span>
              </TabsTrigger>
              <TabsTrigger value="violations" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">{t.settings.violations}</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">{t.settings.users}</span>
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">{t.settings.audit}</span>
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {t.settings.language}
                  </CardTitle>
                  <CardDescription>
                    Выберите язык интерфейса системы
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="uz">O&apos;zbekcha</SelectItem>
                      <SelectItem value="kk">Қарақалпақша</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    {t.settings.theme}
                  </CardTitle>
                  <CardDescription>
                    Выберите тему оформления интерфейса
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 max-w-md">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className="flex flex-col gap-2 h-auto py-4"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="h-5 w-5" />
                      <span className="text-xs">{t.settings.themes.light}</span>
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className="flex flex-col gap-2 h-auto py-4"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="h-5 w-5" />
                      <span className="text-xs">{t.settings.themes.dark}</span>
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      className="flex flex-col gap-2 h-auto py-4"
                      onClick={() => setTheme("system")}
                    >
                      <Monitor className="h-5 w-5" />
                      <span className="text-xs">{t.settings.themes.system}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Уведомления
                  </CardTitle>
                  <CardDescription>
                    Настройки уведомлений и оповещений
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Новые приказы от хокимията</p>
                      <p className="text-sm text-muted-foreground">Получать уведомления о новых приказах</p>
                    </div>
                    <Button variant="outline" size="sm">Включено</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Камеры не в сети</p>
                      <p className="text-sm text-muted-foreground">Оповещать при отключении камер</p>
                    </div>
                    <Button variant="outline" size="sm">Включено</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Звуковые уведомления</p>
                      <p className="text-sm text-muted-foreground">Воспроизводить звук при уведомлениях</p>
                    </div>
                    <Button variant="outline" size="sm">Выключено</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integration Settings */}
            <TabsContent value="integration" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Подключение к Умному городу
                  </CardTitle>
                  <CardDescription>
                    Настройки API для связи с системой "Ақыллы Нөкис"
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="smartCityUrl">URL сервера Умного города</Label>
                    <Input
                      id="smartCityUrl"
                      value={smartCityUrl}
                      onChange={(e) => setSmartCityUrl(e.target.value)}
                      placeholder="http://localhost:3000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API ключ</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Введите API ключ"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button onClick={handleTestConnection} variant="outline" disabled={connectionStatus === "checking"}>
                      {connectionStatus === "checking" ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Проверить подключение
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Сохранить
                    </Button>
                    {connectionStatus === "success" && (
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Подключено
                      </Badge>
                    )}
                    {connectionStatus === "error" && (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Ошибка
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-1">API ключи для интеграции:</p>
                    <p className="text-xs text-muted-foreground">GAI → Smart City: <code className="bg-muted px-1 rounded">gai-secret-key-2025</code></p>
                    <p className="text-xs text-muted-foreground">Smart City → GAI: <code className="bg-muted px-1 rounded">smart-city-secret-key-2025</code></p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Синхронизация данных
                  </CardTitle>
                  <CardDescription>
                    Настройки автоматической синхронизации с Умным городом
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Автоматическая отправка штрафов</p>
                      <p className="text-sm text-muted-foreground">Отправлять штрафы сразу после создания</p>
                    </div>
                    <Button variant="outline" size="sm">Включено</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Синхронизация штрафстоянки</p>
                      <p className="text-sm text-muted-foreground">Отправлять данные об эвакуированных ТС</p>
                    </div>
                    <Button variant="outline" size="sm">Включено</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Получение приказов</p>
                      <p className="text-sm text-muted-foreground">Автоматически получать приказы от хокимията</p>
                    </div>
                    <Button variant="outline" size="sm">Включено</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Violations Settings */}
            <TabsContent value="violations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Справочник нарушений</CardTitle>
                  <CardDescription>
                    Типы нарушений и суммы штрафов
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: "Превышение скорости до 20 км/ч", amount: 300000 },
                      { type: "Превышение скорости 20-40 км/ч", amount: 500000 },
                      { type: "Превышение скорости более 40 км/ч", amount: 1000000 },
                      { type: "Проезд на красный свет", amount: 750000 },
                      { type: "Неправильная парковка", amount: 300000 },
                      { type: "Использование телефона", amount: 400000 },
                      { type: "Без ремня безопасности", amount: 200000 },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span>{item.type}</span>
                        <span className="font-medium">{item.amount.toLocaleString()} сум</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Settings */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Пользователи системы</CardTitle>
                  <CardDescription>
                    Управление пользователями и ролями
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "А. Юсупов", role: "Администратор", email: "yusupov@gai.uz" },
                      { name: "Б. Каримов", role: "Инспектор", email: "karimov@gai.uz" },
                      { name: "С. Мырзабаев", role: "Оператор камер", email: "myrzabaev@gai.uz" },
                      { name: "Д. Айтмуратов", role: "Диспетчер", email: "aytmuratov@gai.uz" },
                    ].map((user, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Button variant="outline" size="sm">{user.role}</Button>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-4">
                    <Users className="h-4 w-4 mr-2" />
                    Добавить пользователя
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit Log */}
            <TabsContent value="audit" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Журнал аудита</CardTitle>
                  <CardDescription>
                    История действий пользователей в системе
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: "Создан штраф F005", user: "Б. Каримов", time: "10:30" },
                      { action: "Приказ ORD001 принят", user: "А. Юсупов", time: "09:45" },
                      { action: "Эвакуирован ТС IMP003", user: "С. Мырзабаев", time: "08:20" },
                      { action: "Вход в систему", user: "А. Юсупов", time: "08:00" },
                      { action: "Изменены настройки", user: "А. Юсупов", time: "вчера 18:30" },
                    ].map((log, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-muted-foreground">{log.user}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </MainLayout>
  )
}
