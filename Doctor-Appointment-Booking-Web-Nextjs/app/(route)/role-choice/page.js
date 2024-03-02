"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useRole } from "../../_context/RoleContext";
import { Button } from "@/components/ui/button";

function RoleChoicePage() {
  const router = useRouter();
  const { user } = useKindeBrowserClient();
  const { updateRole } = useRole();
  const [loading, setLoading] = useState(false);

  // Fonction pour gérer la sélection du rôle
  const handleRoleSelection = async (role) => {
    try {
      setLoading(true); // Activer le chargement

      // Étape 1: Récupérez l'utilisateur par e-mail pour obtenir son ID
      const userInfo = await GlobalApi.getUserByEmail(user.email);
      if (!userInfo || !userInfo.id) {
        throw new Error("Utilisateur non trouvé.");
      }

      // Étape 2: Mettez à jour le rôle de l'utilisateur avec son ID
      await GlobalApi.updateUserRole(userInfo.id, role);
      console.log(`Rôle mis à jour pour l'utilisateur ${userInfo.id}: ${role}`);

      // Mettre à jour le rôle dans le contexte
      role === "3" ? updateRole("doctor") : updateRole("patient");

      // Redirection basée sur le rôle choisi
      if (role === "3") {
        console.log(user.email, user.given_name);
        await GlobalApi.registerDoctor({
          email: user.email,
          Name: user.given_name,
        });
        router.push("/edit-profile");
      } else if (role === "4") {
        router.push("/");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du rôle de l'utilisateur",
        error
      );
    }
  };
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Nettoyage de l'événement
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const imageStyle = {
    marginBottom: "10px",
    width: screenWidth < 600 ? "150px" : "300px", // Taille plus petite pour les écrans < 600px
    height: screenWidth < 600 ? "200px" : "400px",
    borderRadius: "50px",
  };

  return loading ? (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>Loading...</div>
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "5vh",
        gap: "5px",
      }}
    >
      <p
        style={{
          display: "block",
          textAlign: "center",
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        Choix du Rôle
      </p>
      <p
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        Veuillez choisir votre rôle :
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          margin: "auto",
          gap: "20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img src="patient.jpg" alt="Patient" style={imageStyle} />
          <Button
            onClick={() => handleRoleSelection("4")}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              marginTop: "1rem",
              fontSize: "1.2rem",
            }}
          >
            Patient
          </Button>
        </div>
        <div style={{ textAlign: "center" }}>
          <img src="doctor.jpg" alt="Doctor" style={imageStyle} />

          <Button
            onClick={() => handleRoleSelection("3")}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              marginTop: "1rem",
              fontSize: "1.2rem",
            }}
          >
            Doctor
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RoleChoicePage;
