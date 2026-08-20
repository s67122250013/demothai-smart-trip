import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  Sparkles, 
  Heart,
  ArrowLeft,
  LogIn,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    authPromptReason,
    setAuthPromptReason,
    setUser, 
    t, 
    lang,
    showToast 
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      if (authModalMode === 'login') {
        const res = await api.login(email);
        setUser(res.user);
        showToast(
          lang === 'th' ? `ยินดีต้อนรับกลับ, ${res.user.name}!` : lang === 'zh' ? `欢迎回来，${res.user.name}！` : `Welcome back, ${res.user.name}!`,
          'success'
        );
      } else {
        const res = await api.register(name || email.split('@')[0], email);
        setUser(res.user);
        showToast(
          lang === 'th' ? `สร้างบัญชีสำเร็จ! ยินดีต้อนรับคุณ ${res.user.name}` : lang === 'zh' ? `账号创建成功！欢迎您，${res.user.name}` : `Account created! Welcome, ${res.user.name}!`,
          'success'
        );
      }
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error('Auth error', err);
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'admin' | 'user') => {
    const demoEmail = role === 'admin' ? 'admin@thaismarttrip.com' : 'user@thaismarttrip.com';
    setLoading(true);
    try {
      const res = await api.login(demoEmail);
      setUser(res.user);
      showToast(
        lang === 'th' 
          ? `เข้าสู่ระบบสำเร็จในฐานะ ${role === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'สมาชิก (User)'}`
          : lang === 'zh'
          ? `已成功以 ${role === 'admin' ? '管理员 (Admin)' : '旅行者 (User)'} 身份登录`
          : `Logged in as ${role === 'admin' ? 'System Admin' : 'Explorer User'}`,
        'success'
      );
      setIsAuthModalOpen(false);
    } catch (err) {
      console.error('Demo auth failed', err);
    } finally {
      setLoading(false);
    }
  };

  const isFavoritePrompt = authModalMode === 'favorite_prompt';

  return (
    <AnimatePresence>
      <div 
        id="auth-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 space-y-6"
        >
          {/* Close Button [ × ] */}
          <button
            id="auth-modal-close-btn"
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* VIEW MODE 1: FAVORITE REQUIREMENT PROMPT */}
          {isFavoritePrompt ? (
            <div id="favorite-auth-prompt" className="space-y-6 text-center pt-2">
              {/* Heart Icon Badge */}
              <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
                <Heart className="w-8 h-8 fill-rose-500 stroke-rose-600" />
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h2 id="favorite-modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {t('auth.favorite_modal_title')}
                </h2>
                <p id="favorite-modal-desc" className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {t('auth.favorite_modal_desc')}
                </p>
              </div>

              {/* Action Buttons: Login & Register & Close */}
              <div className="space-y-3 pt-2">
                <button
                  id="favorite-prompt-login-btn"
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('auth.login_btn')}</span>
                </button>

                <button
                  id="favorite-prompt-register-btn"
                  type="button"
                  onClick={() => setAuthModalMode('register')}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-800 border border-slate-300 font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                  <span>{t('auth.register_btn')}</span>
                </button>

                <button
                  id="favorite-prompt-close-btn"
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 px-6 rounded-2xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-medium text-xs transition-colors"
                >
                  {t('auth.close_btn')}
                </button>
              </div>

              {/* Quick Demo 1-Click login */}
              <div className="pt-2 border-t border-slate-100">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                    <span>{t('auth.demo_accounts')}</span>
                    <span className="text-[10px] text-emerald-700 font-bold">1-Click</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('admin')}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>Admin</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('user')}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>User</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* VIEW MODE 2: LOGIN / REGISTER FORMS */
            <>
              {/* Back Button if navigated from favorite prompt */}
              {authPromptReason === 'favorite' && (
                <button
                  type="button"
                  onClick={() => setAuthModalMode('favorite_prompt')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 font-semibold transition-colors -mb-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('auth.back_to_prompt')}</span>
                </button>
              )}

              {/* Header */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Thai Smart Trip Explorer</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {authModalMode === 'login' ? t('auth.login_title') : t('auth.register_title')}
                </h2>
                <p className="text-xs text-slate-500">
                  {authModalMode === 'login' 
                    ? (lang === 'th' ? 'เข้าสู่ระบบเพื่อบันทึกสถานที่โปรดและร่วมเขียนรีวิว' : lang === 'zh' ? '登录以保存收藏景点并发表真实评价' : 'Sign in to save favorite destinations and write reviews')
                    : (lang === 'th' ? 'สร้างบัญชีเพื่อเข้าร่วมชุมชนท่องเที่ยวไทย' : lang === 'zh' ? '注册账号加入泰国旅游社区' : 'Create an account to join the Thai travel community')}
                </p>
              </div>

              {/* Quick Demo Switcher Buttons */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-700 font-semibold">
                  <span>{t('auth.demo_accounts')}</span>
                  <span className="text-[10px] text-slate-500">1-Click Sign In</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('admin')}
                    className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Admin Mode</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('user')}
                    className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <UserIcon className="w-4 h-4 text-emerald-600" />
                    <span>User Mode</span>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {authModalMode === 'register' && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">{t('auth.name')}</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Somchai Explorer"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">{t('auth.email')}</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">{t('auth.password')}</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : (authModalMode === 'login' ? t('auth.login_btn') : t('auth.register_btn'))}
                </button>
              </form>

              {/* Toggle Mode */}
              <div className="text-center pt-2 border-t border-slate-100">
                {authModalMode === 'login' ? (
                  <p className="text-xs text-slate-500">
                    {t('auth.no_account')}{' '}
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('register')}
                      className="text-emerald-700 hover:underline font-bold"
                    >
                      {t('auth.register_title')}
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    {t('auth.have_account')}{' '}
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('login')}
                      className="text-emerald-700 hover:underline font-bold"
                    >
                      {t('auth.login_title')}
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
