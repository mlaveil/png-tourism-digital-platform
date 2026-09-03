/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { auth } from '../../services/firebase';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'verification'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationEmail, setVerificationEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
        
        // If a user logs in and their email is not verified, block access and show the same verification screen
        if (!userCredential.user.emailVerified) {
          try {
            await sendEmailVerification(userCredential.user);
          } catch {
            // Ignore potential rate-limiting errors for repeat sends
          }
          await signOut(auth);
          setVerificationEmail(trimmedEmail);
          setMode('verification');
          return;
        }

        if (onAuthSuccess) onAuthSuccess();
      } else {
        // User registration
        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        // Send verification email
        await sendEmailVerification(userCredential.user);
        // Do not sign them in automatically - sign out immediately
        await signOut(auth);
        setVerificationEmail(trimmedEmail);
        setMode('verification');
      }
    } catch (err: any) {
      const errorCode = err?.code || '';

      if (mode === 'signin') {
        // Specific requirement: "If credentials are incorrect, show: 'Email or password is incorrect'"
        setErrorMessage('Email or password is incorrect');
      } else {
        // Specific requirement: "If the email already exists, show: 'User already exists. Please sign in'"
        if (errorCode === 'auth/email-already-in-use') {
          setErrorMessage('User already exists. Please sign in');
        } else if (errorCode === 'auth/weak-password') {
          setErrorMessage('Password should be at least 6 characters');
        } else if (errorCode === 'auth/invalid-email') {
          setErrorMessage('Please enter a valid email address');
        } else {
          setErrorMessage(err?.message || 'Failed to create account. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#002b1d] to-[#001710] flex flex-col justify-center items-center px-4 py-12 text-slate-100 font-['Inter'] relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00472F]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D9A100]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative z-10">
        {/* Header Branding */}
        <div className="bg-[#00472F] p-6 text-white text-center relative border-b-4 border-[#D9A100]">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#D9A100] text-[#003624] font-black text-base shadow-md mb-3 font-mono tracking-wider">
            PNG
          </div>
          <h1 className="text-xl font-bold font-['Outfit'] tracking-tight">
            PNG Tourism Digital Platform
          </h1>
          <p className="text-xs text-emerald-200/90 mt-1">
            Tourism Promotion Authority Authentication Portal
          </p>
        </div>

        {/* Verification Screen */}
        {mode === 'verification' ? (
          <div className="p-6 sm:p-8 text-center space-y-5" id="email-verification-screen">
            <div className="w-16 h-16 bg-emerald-50 text-[#00472F] rounded-full mx-auto flex items-center justify-center border-2 border-emerald-200 shadow-inner">
              <Mail className="w-8 h-8 text-[#00472F]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold font-['Outfit'] text-slate-900">
                Verify Your Email
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                We have sent you a verification email to <span className="font-semibold text-slate-900 underline decoration-[#D9A100] underline-offset-2">{verificationEmail}</span>. Please verify it and log in.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                id="btn-verification-login"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                  setPassword('');
                }}
                className="w-full py-3 px-4 bg-[#00472F] hover:bg-[#003624] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4 text-[#D9A100]" />
              </button>
            </div>

            {/* Hint / Resend Link */}
            <div className="pt-3 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-500">
                Didn&apos;t receive the email? Check your spam folder or try logging in to trigger a new link.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Tab Toggle: Sign In vs Sign Up */}
            <div className="flex border-b border-slate-200 bg-slate-50">
              <button
                type="button"
                id="tab-auth-signin"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-3 text-xs font-bold transition-colors text-center ${
                  mode === 'signin'
                    ? 'bg-white text-[#00472F] border-b-2 border-[#00472F] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                id="tab-auth-signup"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-3 text-xs font-bold transition-colors text-center ${
                  mode === 'signup'
                    ? 'bg-white text-[#00472F] border-b-2 border-[#00472F] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8">
              {/* Error Message Alert */}
              {errorMessage && (
                <div
                  id="auth-error-message"
                  className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 animate-shake"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <div className="flex-1">{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="auth-email-input">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="auth-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="officer@tpa.gov.pg or operator@png.travel"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00472F]/20 focus:border-[#00472F] text-slate-900 transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="auth-password-input">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="auth-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00472F]/20 focus:border-[#00472F] text-slate-900 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  id="btn-auth-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 bg-[#00472F] hover:bg-[#003624] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D9A100]" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'signin' ? 'Sign In to Platform' : 'Create New Account'}</span>
                      <ArrowRight className="w-4 h-4 text-[#D9A100]" />
                    </>
                  )}
                </button>

                {/* Quick Switch Mode Link */}
                <div className="text-center pt-2">
                  {mode === 'signin' ? (
                    <button
                      type="button"
                      id="btn-switch-to-signup"
                      onClick={() => {
                        setMode('signup');
                        setErrorMessage(null);
                      }}
                      className="text-xs text-slate-600 hover:text-[#00472F] font-semibold transition-colors"
                    >
                      Need an account? <span className="text-[#00472F] underline underline-offset-2">Create new account</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      id="btn-switch-to-signin"
                      onClick={() => {
                        setMode('signin');
                        setErrorMessage(null);
                      }}
                      className="text-xs text-slate-600 hover:text-[#00472F] font-semibold transition-colors"
                    >
                      Already have an account? <span className="text-[#00472F] underline underline-offset-2">Sign in</span>
                    </button>
                  )}
                </div>
              </form>

              {/* Quick Demo Helper Hint */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                  <span>Protected by Firebase Authentication</span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer text */}
      <div className="mt-8 text-center text-xs text-slate-400">
        <p>© 2026 Papua New Guinea Tourism Promotion Authority</p>
      </div>
    </div>
  );
};
