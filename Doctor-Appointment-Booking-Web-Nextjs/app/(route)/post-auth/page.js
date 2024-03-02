"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import GlobalApi from "@/app/_utils/GlobalApi";

function Page() {
  const { user } = useKindeBrowserClient();
  const router = useRouter();

  useEffect(() => {
    const handleUser = async () => {
      if (user) {
        // Vérifiez si l'utilisateur existe
        const response = await GlobalApi.checkUserExists(user.email);
        if (response.data && response.data.length === 0) {
          // Si l'utilisateur n'existe pas, enregistrez-le
          await GlobalApi.registerUser({
            email: user.email,
            username: user.given_name,
            password: "default",
            role: "",
          });
          // Redirigez l'utilisateur vers la page de choix de rôle
          router.push("/role-choice");
        } else {
          // Si l'utilisateur existe déjà, récupérez son rôle et redirigez-le en conséquence
          const userRole = response.data[0].role.type;
          console.log(userRole);
          // Assurez-vous que cela correspond à la structure de votre réponse
          if (userRole === "doctor") {
            sessionStorage.setItem("role", "doctor");
            router.push("/doctor-home");
          } else {
            sessionStorage.setItem("role", "patient");
            router.push("/");
          }
        }
      }
    };

    handleUser().catch(console.error);
  }, [user, router]);

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>Loading...</div>
  ); // ou retournez un élément de chargement ou tout autre élément que vous souhaitez afficher temporairement
}

export default Page;
