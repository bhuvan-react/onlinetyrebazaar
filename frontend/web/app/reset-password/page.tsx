'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router       = useRouter();
    const token        = searchParams.get('token') || '';

    const [password, setPassword]   = useState('');
    const [confirm, setConfirm]     = useState('');
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState('');
    const [success, setSuccess]     = useState(false);

    useEffect(() => {
        if (!token) setError('Invalid or missing reset token. Please request a new link.');
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/v1/auth/dealer/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data?.message || 'Invalid or expired reset link. Please request a new one.');
            } else {
                setSuccess(true);
                setTimeout(() => router.push('/'), 3000);
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg,#f0fdfa 0%,#ccfbf1 100%)',
            fontFamily: 'Inter, Arial, sans-serif',
        }}>
            <div style={{
                background: '#fff', borderRadius: 16, padding: '40px 36px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: 420,
            }}>
                {/* Logo / brand */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <span style={{ fontSize: 32 }}>🔑</span>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0D9488', margin: '8px 0 4px' }}>
                        Reset Password
                    </h1>
                    <p style={{ color: '#6B7280', fontSize: 14 }}>Tyre Bazaar Dealer Portal</p>
                </div>

                {success ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 48 }}>✅</div>
                        <h2 style={{ color: '#0D9488', marginTop: 16 }}>Password Updated!</h2>
                        <p style={{ color: '#6B7280', fontSize: 14 }}>
                            Your password has been changed. Redirecting to home in 3 seconds…
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div style={{
                                background: '#FEE2E2', color: '#DC2626', borderRadius: 8,
                                padding: '10px 14px', fontSize: 13, marginBottom: 16,
                            }}>
                                {error}
                            </div>
                        )}

                        <label style={labelStyle}>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            required
                            style={inputStyle}
                        />

                        <label style={labelStyle}>Confirm Password</label>
                        <input
                            type="password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            placeholder="Re-enter your password"
                            required
                            style={inputStyle}
                        />

                        <button
                            type="submit"
                            disabled={loading || !token}
                            style={{
                                width: '100%', padding: '14px', backgroundColor: '#0D9488',
                                color: '#fff', border: 'none', borderRadius: 8,
                                fontSize: 16, fontWeight: 700, cursor: 'pointer',
                                marginTop: 8, opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? 'Updating…' : 'Set New Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 12px', border: '1px solid #D1D5DB', borderRadius: 8,
    fontSize: 15, marginBottom: 16, boxSizing: 'border-box',
};

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div style={{ textAlign: 'center', marginTop: 100 }}>Loading…</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
