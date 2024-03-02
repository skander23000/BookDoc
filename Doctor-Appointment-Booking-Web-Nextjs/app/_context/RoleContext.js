// RoleContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const RoleContext = createContext();

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }) => {
  // Initialiser l'état du rôle avec une valeur depuis localStorage si elle existe
  const [role, setRole] = useState(() => {
    // Vérifiez si window est défini, ce qui indique que le code s'exécute dans le navigateur
    if (typeof window !== "undefined") {
      const savedRole = sessionStorage.getItem("role");

      return savedRole;
    }
  });
  // Mettre à jour localStorage chaque fois que le rôle change
  useEffect(() => {
    if (role) {
      sessionStorage.setItem("role", role);
    }
  }, [role]);

  const updateRole = (newRole) => {
    setRole(newRole);
  };

  return (
    <RoleContext.Provider value={{ role, updateRole }}>
      {children}
    </RoleContext.Provider>
  );
};
