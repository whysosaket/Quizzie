import React from "react";
import Image from "../../assets/cong.png";

const Congratulations = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>🎉 Thank You for Participating! 🎉</h1>
        <img src={Image} alt="Congratulations" style={styles.image} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0A2540, #1D4E89)", // Dark blue gradient
    padding: "20px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.2)", // Semi-transparent white
    borderRadius: "16px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(10px)", // Frosted glass effect
    border: "1px solid rgba(255, 255, 255, 0.18)", // Subtle border
    textAlign: "center",
    color: "#ffffff",
    padding: "30px",
    maxWidth: "90%",
    width: "400px",
    margin: "20px",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "20px",
    fontWeight: "600",
    lineHeight: "1.4",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
  },
  image: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    margin: "20px 0",
    objectFit: "cover",
    border: "4px solid rgba(255, 255, 255, 0.3)",
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "500",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
};

export default Congratulations;
