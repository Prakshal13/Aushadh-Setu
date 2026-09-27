import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Aushadh Setu ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.hash = '';
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 bg-white/95 rounded-3xl border border-[#EBE4D8] shadow-[0_16px_40px_rgba(26,22,20,0.06)] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">healing</span>
            </div>
            <h2 className="font-display font-bold text-xl text-text-obsidian">
              Portal Recovery Activated
            </h2>
            <p className="text-xs text-text-muted leading-relaxed">
              An unexpected render anomaly occurred in this section. The system prevented application crash and isolated the module safely.
            </p>
            {this.state.error?.message && (
              <div className="p-3 bg-stone-50 rounded-xl font-mono text-[11px] text-rose-700 text-left overflow-x-auto border border-stone-200">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-full bg-primary-rich text-white text-xs font-bold shadow-sm hover:bg-[#6e4300] transition cursor-pointer"
              >
                Return to Landing / Refresh
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
