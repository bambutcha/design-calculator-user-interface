import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("UI error boundary:", error);
  }

  private handleRecover = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 12,
            background: "#0f1115",
            color: "#f3f4f6",
            fontFamily: "Segoe UI, sans-serif",
          }}
        >
          <h2 style={{ margin: 0 }}>Возникла ошибка интерфейса</h2>
          <p style={{ margin: 0, color: "#9ca3af" }}>
            Нажмите кнопку, чтобы восстановить последнюю сессию.
          </p>
          <button
            onClick={this.handleRecover}
            style={{
              marginTop: 8,
              padding: "10px 18px",
              borderRadius: 10,
              border: "none",
              background: "#6366f1",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Перезапустить приложение
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
