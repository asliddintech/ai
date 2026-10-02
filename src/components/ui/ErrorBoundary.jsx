import React from 'react';
import { RotateCcw, AlertTriangle, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Studio Error Boundary Caught]:', error, errorInfo);
  }

  handleReload = () => {
    try {
      localStorage.removeItem('ai_video_prompt_studio_auth_token_v1');
    } catch (e) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-studio-950 text-studio-100 flex items-center justify-center p-6 selection:bg-indigo-500/30">
          <div className="max-w-md w-full bg-studio-900 border border-white/10 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-2xl relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner-light">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight font-display">
                Ishchi Maydonni Qayta Tiklash
              </h2>
              <p className="text-xs text-studio-300 leading-relaxed font-sans">
                Kutilmagan xatolik yuz berdi. Sahifani qayta yuklash orqali studiyani toza holatda ishga tushirishingiz mumkin.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold font-mono flex items-center justify-center gap-2 shadow-glow-indigo/50 transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Qayta Yuklash</span>
              </button>
              <button
                onClick={() => { this.setState({ hasError: false }); window.location.hash = ''; }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-studio-800 hover:bg-studio-700 text-studio-200 text-xs font-mono flex items-center justify-center gap-2 border border-white/10 transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Boshqaruv Paneli</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
