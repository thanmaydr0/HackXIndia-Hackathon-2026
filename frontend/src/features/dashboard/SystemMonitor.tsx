import { useLayoutEffect, useRef, useMemo } from 'react'
import uPlot from 'uplot'
import 'uplot/dist/uPlot.min.css'
import { useRealtimeStats } from './useRealtimeStats'
import { format } from 'date-fns'

export default function SystemMonitor() {
    const { data, status, latest, refresh } = useRealtimeStats()
    const chartRef = useRef<HTMLDivElement>(null)
    const uplotInst = useRef<uPlot | null>(null)

    // Prepare data arrays for uPlot [time[], series1[], series2[]]
    const plotData = useMemo(() => {
        const times: number[] = []
        const loads: number[] = []
        const energies: number[] = []

        data.forEach(d => {
            times.push(d.time)
            loads.push(d.cognitive_load)
            energies.push(d.energy_level)
        })

        return [times, loads, energies] as [number[], number[], number[]]
    }, [data])

    // Initialize or Update Chart
    useLayoutEffect(() => {
        if (!chartRef.current) return

        if (!uplotInst.current) {
            // Init uPlot
            const opts: uPlot.Options = {
                title: "Real-time System Monitor",
                width: chartRef.current.clientWidth,
                height: 300,
                series: [
                    {},
                    {
                        label: "Cog. Load",
                        stroke: "#ff006e",
                        width: 2,
                        fill: "rgba(255, 0, 110, 0.1)",
                    },
                    {
                        label: "Energy",
                        stroke: "#06ffa5",
                        width: 2,
                        fill: "rgba(6, 255, 165, 0.1)",
                    }
                ],
                axes: [
                    {
                        stroke: "#fff",
                        grid: { stroke: "rgba(255,255,255,0.1)" },
                    },
                    {
                        stroke: "#fff",
                        grid: { stroke: "rgba(255,255,255,0.1)" },
                    }
                ],
                scales: {
                    x: {
                        time: true,
                    },
                    y: {
                        auto: false,
                        range: [0, 100],
                    }
                },
                legend: {
                    show: true
                }
            }

            uplotInst.current = new uPlot(opts, plotData, chartRef.current)
        } else {
            // Update data efficienty
            uplotInst.current.setData(plotData)
        }

        // Resize handler
        const resizeObserver = new ResizeObserver(entries => {
            if (!uplotInst.current) return
            for (let entry of entries) {
                uplotInst.current.setSize({
                    width: entry.contentRect.width,
                    height: 300
                })
            }
        })
        resizeObserver.observe(chartRef.current)

        return () => resizeObserver.disconnect()
    }, [plotData])

    // Status Badge Logic
    const getLoadStatus = (val: number) => {
        if (val > 90) return { text: 'CRITICAL', color: 'text-danger', border: 'var(--color-danger)' }
        if (val > 70) return { text: 'HIGH', color: 'text-warning', border: 'var(--color-warning)' }
        return { text: 'OPTIMAL', color: 'text-success', border: 'var(--color-success)' }
    }

    const loadStatus = getLoadStatus(latest?.cognitive_load || 0)

    return (
        <div className="glass-panel p-6 animate-fade-in flex-column gap-6">
            {/* Header / Stats */}
            <div className="flex-between flex-wrap gap-4">
                <div>
                    <h2 className="font-xl font-bold text-gradient flex items-center gap-2">
                        <span className="text-2xl">📈</span> System Monitor
                    </h2>
                    <div className="flex-center gap-2 mt-2">
                        <span className={`text-xs p-1 px-3 rounded-full border font-mono ${loadStatus.color} bg-[--glass-bg-subtle]`} style={{ borderColor: loadStatus.border }}>
                            {loadStatus.text}
                        </span>
                        <span className="text-muted text-xs font-mono">
                            UPDATED: {latest ? format(new Date(latest.time * 1000), 'HH:mm:ss') : '--:--:--'}
                        </span>
                    </div>
                </div>

                <div className="flex-center gap-8">
                    {/* Visual Gauge for Cognitive Load */}
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 mb-1">
                            <span className="text-muted text-xs font-mono">COGNITIVE LOAD</span>
                            <span className={`font-bold ${loadStatus.color}`}>{latest?.cognitive_load ?? '--'}%</span>
                        </div>
                        <div className="w-32 h-2 bg-[--glass-bg-intense] rounded-full overflow-hidden">
                            <div
                                className="h-full transition-all duration-500 ease-out"
                                style={{
                                    width: `${latest?.cognitive_load ?? 0}%`,
                                    backgroundColor: loadStatus.border,
                                    boxShadow: `0 0 10px ${loadStatus.border}`
                                }}
                            />
                        </div>
                    </div>

                    {/* Visual Gauge for Energy */}
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 mb-1">
                            <span className="text-muted text-xs font-mono">ENERGY</span>
                            <span className="font-bold text-[--color-success]">{latest?.energy_level ?? '--'}%</span>
                        </div>
                        <div className="w-32 h-2 bg-[--glass-bg-intense] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[--color-success] transition-all duration-500 ease-out"
                                style={{
                                    width: `${latest?.energy_level ?? 0}%`,
                                    boxShadow: '0 0 10px var(--color-success)'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={refresh}
                        className="glass-button p-2 rounded-full hover:rotate-180 transition-transform duration-500"
                        title="Refresh Data"
                    >
                        ↻
                    </button>
                </div>
            </div>

            {/* Chart Container */}
            <div className="relative w-full" style={{ minHeight: '300px' }}>
                {status === 'disconnected' && (
                    <div className="absolute top-0 left-0 w-full flex-center bg-glass-subtle z-10 p-2">
                        <span className="text-danger text-xs">⚠ Realtime Disconnected</span>
                    </div>
                )}
                {/* CSS Module or custom styles needed for uPlot dark theme adaptations if defaults aren't enough */}
                <div ref={chartRef} className="uplot-chart-dark" />
            </div>

            {/* Accessibility Table */}
            <details className="text-xs text-muted">
                <summary className="cursor-pointer mb-2">Show Data Table (Accessibility)</summary>
                <div className="overflow-auto max-h-40">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="p-2">Time</th>
                                <th className="p-2">Load</th>
                                <th className="p-2">Energy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((Row, i) => (
                                <tr key={i} className="border-b border-white/10">
                                    <td className="p-2">{format(new Date(Row.time * 1000), 'HH:mm:ss')}</td>
                                    <td className="p-2">{Row.cognitive_load}%</td>
                                    <td className="p-2">{Row.energy_level}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </details>

            {/* Quick override style for uPlot textual elements to be white */}
            <style>{`
                .uplot-chart-dark .u-legend { color: #fff; }
                .uplot-chart-dark .u-title { fill: #fff; }
                .uplot-chart-dark .u-value { color: #eee; }
            `}</style>
        </div>
    )
}
