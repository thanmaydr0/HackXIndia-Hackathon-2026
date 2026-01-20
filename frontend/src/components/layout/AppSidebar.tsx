import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, ListTodo, LogOut, Settings } from "lucide-react"
import { useAuth } from "@/features/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AppSidebar() {
    const location = useLocation()
    const { signOut } = useAuth()

    const navItems = [
        { icon: LayoutDashboard, label: "Mission Control", path: "/" },
        { icon: ListTodo, label: "Protocols", path: "/tasks" },
    ]

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-background/50 backdrop-blur-xl p-4 hidden md:flex flex-col gap-6 z-40">
            <div className="flex items-center gap-2 px-2 mt-2">
                <div className="h-8 w-8 rounded-full bg-primary animate-pulse shadow-[0_0_15px_var(--primary)]" />
                <span className="text-xl font-bold tracking-wider text-gradient">SkillOS</span>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link key={item.path} to={item.path}>
                            <Button
                                variant={isActive ? "neon" : "ghost"}
                                className={cn("w-full justify-start gap-3", isActive ? "bg-primary/10" : "")}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Button>
                        </Link>
                    )
                })}
            </nav>

            <div className="space-y-2 border-t border-border pt-4">
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                    <Settings size={18} />
                    System Config
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => signOut()}
                >
                    <LogOut size={18} />
                    Disconnect
                </Button>
            </div>
        </aside>
    )
}
