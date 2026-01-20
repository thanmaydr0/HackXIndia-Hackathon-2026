import { useState, useMemo } from 'react'
import { useTaskOperations } from './useTaskOperations'
import TaskCard from './TaskCard'
import AddTaskModal from './AddTaskModal'
import { Plus, ListFilter } from 'lucide-react'

export default function TaskManager() {
    const { tasks, loading, error, addTask, updateStatus, deleteTask } = useTaskOperations()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all')

    const { activeTasks, pendingTasks, completedTasks } = useMemo(() => {
        return {
            activeTasks: tasks.filter(t => t.status === 'active'),
            pendingTasks: tasks.filter(t => t.status === 'pending'),
            completedTasks: tasks.filter(t => t.status === 'completed'),
        }
    }, [tasks])

    if (loading) return <div className="p-8 flex-center h-full"><span className="animate-spin text-[--color-primary] text-4xl">⟳</span></div>
    if (error) return <div className="p-8 text-[--color-danger] flex-center h-full">System Glitch: Protocol Failed</div>

    return (
        <div className="animate-fade-in relative h-full flex flex-col">
            {/* Header */}
            <div className="flex-between mb-8 items-end">
                <div>
                    <h1 className="font-2xl font-bold text-gradient mb-2">Protocol Manager</h1>
                    <p className="text-muted">Manage your objectives and cognitive resources.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="glass-button bg-[--color-primary]/10 border-[--color-primary] text-[--color-primary]"
                >
                    <Plus size={18} /> New Objective
                </button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">

                {/* Left Panel: Active & High Priority (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden">
                    <div className="glass-panel p-6 flex-1 flex flex-col min-h-[400px]">
                        <div className="flex-between mb-4">
                            <h2 className="font-xl font-bold text-[--color-secondary] flex items-center gap-2">
                                <span className="animate-pulse">⚡</span> Active Protocols
                            </h2>
                            <span className="text-xs text-muted font-mono">{activeTasks.length} RUNNING</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                            {activeTasks.length === 0 ? (
                                <div className="col-span-full flex-center flex-col py-12 text-muted border border-dashed border-white/10 rounded-xl">
                                    <p>No active protocols.</p>
                                    <button onClick={() => setIsModalOpen(true)} className="text-[--color-primary] text-sm mt-2 hover:underline">Start a new task</button>
                                </div>
                            ) : (
                                activeTasks.map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onStatusChange={updateStatus}
                                        onDelete={deleteTask}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Pending Queue (Horizontal Scroll) */}
                    <div className="glass-panel p-4">
                        <h3 className="text-sm text-muted font-bold mb-3 uppercase tracking-wider">Pending Queue</h3>
                        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                            {pendingTasks.map(task => (
                                <div key={task.id} className="min-w-[280px]">
                                    <TaskCard
                                        task={task}
                                        onStatusChange={updateStatus}
                                        onDelete={deleteTask}
                                    />
                                </div>
                            ))}
                            {pendingTasks.length === 0 && <span className="text-muted text-xs italic py-2">Queue empty. System idle.</span>}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Side Queue & Completed (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">
                    {/* System Recommendations (Bento-style card) */}
                    <div className="glass-card bg-gradient-to-br from-[--glass-bg-subtle] to-[--glass-bg-medium]">
                        <h3 className="font-bold flex items-center gap-2 mb-2">
                            <span>🧠</span> AI Recommendation
                        </h3>
                        <p className="text-sm text-muted">
                            Based on your recent 90% focus score, tackle a <strong>High Difficulty</strong> task next.
                        </p>
                    </div>

                    {/* Completed Log */}
                    <div className="glass-panel p-4 flex-1 flex flex-col overflow-hidden">
                        <div className="flex-between mb-4">
                            <h3 className="font-bold text-[--color-success]">Completed Log</h3>
                            <button className="text-xs text-muted hover:text-white" title="Filter"><ListFilter size={14} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {completedTasks.map(task => (
                                <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg bg-[--glass-bg-subtle] border border-[--glass-border-subtle] opacity-70 hover:opacity-100 transition-opacity">
                                    <div className="mt-1 text-[--color-success]"><CheckCircleIcon /></div>
                                    <div>
                                        <p className="line-through text-sm text-muted">{task.title}</p>
                                        <p className="text-[10px] text-muted">{new Date(task.completed_at || '').toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                            {completedTasks.length === 0 && <p className="text-center text-xs text-muted py-4">No completed tasks yet.</p>}
                        </div>
                    </div>
                </div>
            </div>

            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={addTask}
            />
        </div>
    )
}

function CheckCircleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    )
}
