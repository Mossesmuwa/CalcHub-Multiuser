import { Component } from "react";
import Logo from "./Logo";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("CalcHub crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-center">
          <div className="card auth-card" style={{ textAlign: "center" }}>
            <Logo />
            <h1>Something broke</h1>
            <p className="subtitle">
              That wasn't supposed to happen. Try reloading.
            </p>
            <button
              className="btn-primary"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
