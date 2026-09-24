import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle, Sparkles } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'floating' | 'card' }> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Do not show if already running inside standalone PWA mode
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback for browsers without beforeinstallprompt support
      setShowIOSModal(true);
    }
  };

  if (variant === 'header') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform active:scale-95 cursor-pointer border border-amber-300/40"
          title="ติดตั้งแอปลงบนหน้าจอมือถือ (PWA)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">ติดตั้งลงมือถือ</span>
          <span className="sm:hidden">ติดตั้งแอป</span>
          <span className="px-1 py-0.2 text-[9px] bg-slate-950 text-amber-300 font-extrabold rounded">PWA</span>
        </button>

        {showIOSModal && <IOSInstallModal onClose={() => setShowIOSModal(false)} />}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-sm shadow-md hover:brightness-105 active:scale-98 transition cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>ติดตั้งแอปไว้ที่หน้าจอหลัก (Home Screen)</span>
      </button>

      {showIOSModal && <IOSInstallModal onClose={() => setShowIOSModal(false)} />}
    </>
  );
};

// Bottom floating banner specifically optimized for mobile visitors
export const PWAMobileBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isMobile, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('pwa_banner_dismissed') === 'true';
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (isInstalled || dismissed) {
    return null;
  }

  const handleAction = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom duration-300">
        <div className="bg-slate-900/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3.5 shadow-2xl shadow-black/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                <span>Gold & Asset Tracker</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">แอปมือถือ</span>
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                ติดตั้งลงหน้าจอหลัก ใช้งานเร็วเต็มจอ ไม่ต้องโหลดผ่าน Store
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleAction}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md active:scale-95 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ติดตั้ง</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              title="ปิด"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showIOSModal && <IOSInstallModal onClose={() => setShowIOSModal(false)} />}
    </>
  );
};

// Step-by-step installation instructions modal for iOS & other browsers
export const IOSInstallModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 mx-auto flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 mb-2">
            <Smartphone className="w-7 h-7 text-slate-950" />
          </div>
          <h3 className="text-base font-bold text-white">ติดตั้งแอปลงบนมือถือ</h3>
          <p className="text-xs text-slate-400">
            เปิดแอปได้จากหน้าจอหลักทันที รองรับทั้ง iPhone, iPad และ Android
          </p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-3">
          <div className="text-xs font-semibold text-amber-400">วิธีติดตั้งบน iOS (Safari) / iPhone:</div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              แตะปุ่ม <strong>แชร์ (Share)</strong> <Share className="inline w-3.5 h-3.5 text-blue-400 mx-0.5 -mt-0.5" /> ที่แถบเมนูด้านล่างของ Safari
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              เลื่อนลงมาแล้วเลือก <strong className="text-white">"เพิ่มไปยังหน้าจอโฮม"</strong> (Add to Home Screen <PlusSquare className="inline w-3.5 h-3.5 text-slate-300 mx-0.5 -mt-0.5" />)
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              แตะ <strong className="text-white">"เพิ่ม" (Add)</strong> มุมขวาบน เพื่อเสร็จสิ้น
            </div>
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3 text-[11px] text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300">สำหรับ Android (Chrome):</div>
          <p>
            แตะเมนู <strong>จุดสามจุด (⋮)</strong> มุมขวาบน ➔ เลือก <strong>"ติดตั้งแอป"</strong> หรือ <strong>"เพิ่มลงในหน้าจอหลัก"</strong>
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
        >
          เข้าใจแล้ว / ปิด
        </button>
      </div>
    </div>
  );
};
