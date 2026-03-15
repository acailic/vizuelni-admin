'use client'

import { Component, type ReactNode } from 'react'
import { ChartFrame } from './ChartFrame'

interface Props {
  title: string
  description?: string
  height?: number
  resetKey: string
  children: ReactNode
}

interface State {
  hasError: boolean
  errorMessage: string | null
}

export class ChartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, errorMessage: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, errorMessage: null })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ChartFrame
          title={this.props.title}
          description={this.props.description}
          height={this.props.height}
          errorMessage={this.state.errorMessage || 'Chart failed to render.'}
        />
      )
    }

    return this.props.children
  }
}
