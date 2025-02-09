import React from "react";
import PupilTracker from "../components/PupilTracker";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "'Helvetica Neue', sans-serif",
    backgroundColor: "#1e1e2f",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    gap: "20px",
  },
  header: {
    backgroundColor: "#4caf50",
    width: "100%",
    padding: "20px 0",
    textAlign: "center",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  title: {
    color: "#fff",
    fontSize: "2.5rem",
    margin: 0,
  },
  main: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    maxWidth: "1200px",
    gap: "20px",
  },
  footer: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px",
    textAlign: "center",
    width: "100%",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
};

const Home: React.FC = () => (
  <div style={styles.container}>
    <header style={styles.header}>
      <h1 style={styles.title}>👀 Pupil Detector</h1>
    </header>
    <main style={styles.main}>
      <PupilTracker />
    </main>
    <footer style={styles.footer}>
      <p>© 2025 Pupil Detection System. All Rights Reserved.</p>
    </footer>
  </div>
);

export default Home;
