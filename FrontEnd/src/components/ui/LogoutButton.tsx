//src/components/ui/LogoutButton.tsx
// src/components/ui/LogoutButton.tsx
import React from "react";

interface LogoutButtonProps {
  onLogout: () => void; // Lägg till en prop för onLogout
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return <button onClick={onLogout}>Logga ut</button>;
};

export default LogoutButton;
