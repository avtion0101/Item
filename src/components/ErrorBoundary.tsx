import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Here you could log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
          <div className="clay-card p-8 text-center max-w-md mx-auto">
            <h3 className="text-2xl font-black text-[var(--color-text-main)] mb-4">哎呀，出错了</h3>
            <p className="text-gray-600 mb-6">我们遇到了一些意想不到的问题。请刷新页面重试。</p>
            <button 
              onClick={() => window.location.reload()}
              className="clay-button w-full"
            >
              刷新页面
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
