import { Outlet } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <AppSidebar />

            {/* Main Content Area */}
            <main className="md:pl-64 min-h-screen flex flex-col transition-all duration-300">
                <div className="flex-1 p-6 md:p-8 animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
