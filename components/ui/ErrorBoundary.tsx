"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Remonté à un outil de monitoring (Sentry, etc.) en production.
    console.error("ErrorBoundary a intercepté une erreur :", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="error-state" role="alert">
            <p>Une erreur inattendue est survenue.</p>
            <button type="button" onClick={() => this.setState({ hasError: false })}>
              Réessayer
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
