import { useState, useRef, useEffect } from 'react'

interface AddTaskModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (title: string, description: string, difficulty: number) => Promise<void>
}

export default function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [difficulty, setDifficulty] = useState(5)
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        try {
            setIsLoading(true)
            await onAdd(title, description, difficulty)
            setTitle('')
            setDescription('')
            setDifficulty(5)
            onClose()
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-panel p-6 w-full max-w-md animate-slide-in">
                <h2 className="font-xl font-bold text-gradient mb-6">New Mission</h2>

                <form onSubmit={handleSubmit} className="flex-column gap-6">
                    <div>
                        <label className="text-sm text-muted block mb-2">Title</label>
                        <input
                            ref={inputRef}
                            type="text"
                            className="glass-input"
                            placeholder="e.g. Hack the Mainframe"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-muted block mb-2">Description</label>
                        <textarea
                            className="glass-input min-h-[100px] resize-none"
                            placeholder="Protocol parameters..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="flex-between mb-2">
                            <label className="text-sm text-muted">Difficulty Level</label>
                            <span className={`text-xs font-bold ${difficulty > 7 ? 'text-[--color-danger]' : difficulty > 4 ? 'text-[--color-warning]' : 'text-[--color-success]'}`}>
                                {difficulty}/10
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            className="w-full accent-[--color-primary] cursor-pointer"
                            value={difficulty}
                            onChange={(e) => setDifficulty(parseInt(e.target.value))}
                        />
                        <div className="flex-between text-xs text-muted mt-1 px-1">
                            <span>Easy</span>
                            <span>Hard</span>
                        </div>
                    </div>

                    {/* AI Suggestion Mock */}
                    <div className="glass-panel--subtle p-3 flex gap-2 items-start text-xs text-[--color-primary]">
                        <span>🤖</span>
                        <p>Based on current system load (Optimized), you have capacity for a high-difficulty task.</p>
                    </div>

                    <div className="flex gap-4 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="glass-button flex-1 border-transparent hover:bg-white/5 text-muted hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="glass-button flex-1 bg-[--color-primary]/20 border-[--color-primary] hover:bg-[--color-primary]/30"
                        >
                            {isLoading ? 'Processing...' : 'Initialize Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
