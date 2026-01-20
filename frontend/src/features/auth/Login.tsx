import { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { AUTH_ERRORS } from '@/types/auth'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Login() {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [countdown, setCountdown] = useState(0)
    const [validationError, setValidationError] = useState<string | null>(null)
    const { signInWithOTP, verifyOTP, loading, error, clearError, user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [user, navigate])

    useEffect(() => {
        let timer: number
        if (countdown > 0) {
            timer = window.setInterval(() => setCountdown(c => c - 1), 1000)
        }
        return () => clearInterval(timer)
    }, [countdown])

    const sanitizePhone = (phone: string) => {
        return phone.replace(/[\s\-()]/g, '')
    }

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError()
        setValidationError(null)

        const cleanPhone = sanitizePhone(phoneNumber)

        // E.164 simple validation (starts with +, digits)
        if (!/^\+[1-9]\d{1,14}$/.test(cleanPhone)) {
            setValidationError('Please enter a valid phone number in E.164 format (e.g., +1234567890)')
            return
        }

        const { error } = await signInWithOTP(cleanPhone)
        if (!error) {
            setStep('otp')
            setCountdown(60)
        }
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError()

        const cleanPhone = sanitizePhone(phoneNumber)
        await verifyOTP(cleanPhone, otp)
    }

    const handleResend = () => {
        if (countdown === 0) {
            handleSendOTP({ preventDefault: () => { } } as React.FormEvent)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4 animate-fade-in relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

            <Card className="w-full max-w-md border-primary/50 shadow-[0_0_50px_rgba(0,240,255,0.1)] backdrop-blur-xl bg-black/40">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl glitch-effect" data-text={step === 'phone' ? 'Ident' : 'Verify'}>
                        {step === 'phone' ? 'Identity Protocol' : 'Access Verification'}
                    </CardTitle>
                    <CardDescription className="text-primary/80 font-mono text-xs uppercase tracking-widest">
                        SkillOS Secure Gateway v2.4
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Error Alerts */}
                    {(error || validationError) && (
                        <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-md text-destructive text-sm flex items-center gap-2">
                            <span>⚠</span>
                            {validationError || (error?.message === 'Rate limit exceeded' ? AUTH_ERRORS.RATE_LIMIT : error?.message)}
                        </div>
                    )}

                    {step === 'phone' ? (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-mono text-muted-foreground uppercase">Comm Link (E.164)</Label>
                                <Input
                                    placeholder="+1234567890"
                                    className="font-mono text-lg bg-black/50 border-primary/30 focus-visible:ring-primary/50"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <Button type="submit" className="w-full font-bold tracking-wider" variant="neon" disabled={loading}>
                                {loading ? 'INITIATING...' : 'ESTABLISH LINK'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <div className="space-y-2 text-center">
                                <Label className="text-xs font-mono text-muted-foreground uppercase">One-Time Security Token</Label>
                                <Input
                                    className="font-mono text-3xl text-center tracking-[0.5em] bg-black/50 border-primary/30 focus-visible:ring-primary/50 h-16"
                                    placeholder="000000"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    disabled={loading}
                                />
                            </div>
                            <Button type="submit" className="w-full font-bold tracking-wider" variant="neon" disabled={loading}>
                                {loading ? 'DECRYPTING...' : 'AUTHENTICATE'}
                            </Button>
                            <div className="flex justify-between items-center text-xs text-muted-foreground font-mono">
                                <button type="button" onClick={() => setStep('phone')} className="hover:text-primary transition-colors">← CHANGE FREQ</button>
                                <button type="button" onClick={handleResend} disabled={countdown > 0} className={countdown > 0 ? 'opacity-50' : 'hover:text-primary transition-colors'}>
                                    {countdown > 0 ? `RETRY IN ${countdown}s` : 'RESEND TOKEN'}
                                </button>
                            </div>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="justify-center border-t border-white/5 pt-4">
                    <p className="text-[10px] text-muted-foreground font-mono">SECURE CONNECTION // ENCRYPTED</p>
                </CardFooter>
            </Card>
        </div>
    )
}
