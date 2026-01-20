import { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { AUTH_ERRORS } from '@/types/auth'
import { useNavigate } from 'react-router-dom'

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
        // Basic sanitization: remove spaces, dashes, parentheses
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

        if (otp.length !== 6) {
            // Show local error or rely on Supabase
        }

        const cleanPhone = sanitizePhone(phoneNumber)
        await verifyOTP(cleanPhone, otp)
        // If successful, useEffect redirects
    }

    const handleResend = () => {
        if (countdown === 0) {
            handleSendOTP({ preventDefault: () => { } } as React.FormEvent)
        }
    }

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem' }}>
            <div className="glass-panel p-6 animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="font-xl font-bold mb-4 text-center text-gradient">
                    {step === 'phone' ? 'Welcome Back' : 'Verify Access'}
                </h2>

                {error && (
                    <div className="glass-panel--intense p-4 mb-4" style={{ borderColor: 'var(--color-danger)', backgroundColor: 'rgba(255, 0, 110, 0.1)' }}>
                        <p className="text-danger text-sm text-center">
                            {error.message === 'Rate limit exceeded' ? AUTH_ERRORS.RATE_LIMIT : error.message}
                        </p>
                    </div>
                )}

                {validationError && (
                    <div className="glass-panel--intense p-4 mb-4" style={{ borderColor: 'var(--color-warning)', backgroundColor: 'rgba(255, 190, 11, 0.1)' }}>
                        <p className="text-warning text-sm text-center">
                            {validationError}
                        </p>
                    </div>
                )}

                {step === 'phone' ? (
                    <form onSubmit={handleSendOTP} className="flex-column flex-gap-4">
                        <div>
                            <label className="text-sm text-muted mb-4 block">Phone Number (E.164)</label>
                            <input
                                type="tel"
                                className="glass-input"
                                placeholder="+1234567890"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="glass-button w-full flex-center"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="flex-column flex-gap-4">
                        <div>
                            <div className="flex-between mb-4">
                                <label className="text-sm text-muted">Enter Code</label>
                                <button
                                    type="button"
                                    onClick={() => { setStep('phone'); clearError(); }}
                                    className="text-primary text-xs"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    Change Number
                                </button>
                            </div>
                            <input
                                type="text"
                                className="glass-input text-center font-lg"
                                placeholder="000000"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                disabled={loading}
                                required
                                style={{ letterSpacing: '0.5em' }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="glass-button animate-glow"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>

                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={countdown > 0 || loading}
                                className="text-xs text-muted"
                                style={{ background: 'none', border: 'none', cursor: countdown > 0 ? 'default' : 'pointer', opacity: countdown > 0 ? 0.5 : 1 }}
                            >
                                {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
