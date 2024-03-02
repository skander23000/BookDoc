"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import GlobalApi from "@/app/_utils/GlobalApi";

export default function Page() {
  const { user } = useKindeBrowserClient();

  // État local pour stocker les informations du docteur
  const [doctorInfo, setDoctorInfo] = useState({
    id: "",
    Address: "",
    categories: "",
    StartTime: "",
    EndTime: "",
    Year_of_Experience: "",
    About: "",
    Phone: "",
    image: "",
  });

  // Simuler la récupération des données du docteur
  useEffect(() => {
    if (user?.email) {
      const fetchData = async () => {
        try {
          const doctor = await GlobalApi.getDoctorByEmail(user.email); // Supposant que cette fonction retourne directement l'objet docteur
          if (doctor) {
            setDoctorInfo({
              id: doctor.id || "", // Supposant que la réponse inclut un ID
              Address: doctor.Address || "",
              categories: doctor.categories || "",
              StartTime: doctor.StartTime + ":00" || "",
              EndTime: doctor.EndTime + ":00" || "",
              Year_of_Experience: doctor.Year_of_Experience || "",
              About: doctor.About || "",
              Phone: doctor.Phone || "",
              image: doctor.image || "",
            });
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des informations du docteur:",
            error
          );
          // Gérer l'erreur (par exemple, afficher une notification à l'utilisateur)
        }
      };
      fetchData();
    }
  }, [user]);

  // Gérer la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("files", doctorInfo.image); // Le fichier à uploader
    formData.append("ref", "api::doctor.doctor"); // 'doctor' est le nom de votre collection
    formData.append("refId", doctorInfo.id); // L'ID de l'entrée de docteur à associer
    formData.append("field", "image"); // Le champ de votre modèle de docteur qui stockera l'image

    try {
      const response = await GlobalApi.uploadImage(formData);
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire", error);
    }
    //////////////////////////////////////////////////////////////////////////
    const infoToSubmit = {
      ...doctorInfo,
      StartTime: doctorInfo.StartTime.includes(":")
        ? doctorInfo.StartTime + ":00"
        : doctorInfo.StartTime,
      EndTime: doctorInfo.EndTime.includes(":")
        ? doctorInfo.EndTime + ":00"
        : doctorInfo.EndTime,
    };

    const { image, ...doctorInfoToSubmitWithoutImage } = infoToSubmit;
    console.log(infoToSubmit);
    await GlobalApi.updateDoctor(doctorInfo.id, doctorInfoToSubmitWithoutImage);
    alert("Informations mises à jour!");
  };

  // Gérer la mise à jour des champs du formulaire
  const handleChange = (event) => {
    const { name, type } = event.target;

    if (type === "file") {
      const file = event.target.files[0];
      setDoctorInfo((prevInfo) => ({
        ...prevInfo,
        [name]: file, // Stocke le fichier sélectionné
      }));
    } else {
      const value = event.target.value;
      setDoctorInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-xl font-bold mb-4 text-center">Éditer le profil</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Adresse */}
          <div>
            <label htmlFor="address" className="block">
              Adresse
            </label>
            <input
              type="text"
              id="address"
              name="Address"
              value={doctorInfo.Address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm p-2"
            />
          </div>

          {/* Années d'expérience */}
          <div>
            <label htmlFor="yearsOfExperience" className="block">
              Années d'expérience
            </label>
            <input
              type="text"
              id="Year_of_Experience"
              name="Year_of_Experience"
              value={doctorInfo.Year_of_Experience}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm p-2"
            />
          </div>

          {/* Heure de début et de fin */}
          <div className="flex space-x-4">
            <div>
              <label htmlFor="startTime" className="block">
                Heure de début
              </label>
              <input
                type="time"
                id="StartTime"
                name="StartTime"
                value={doctorInfo.StartTime}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-2 border-black shadow-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block">
                Heure de fin
              </label>
              <input
                type="time"
                id="EndTime"
                name="EndTime"
                value={doctorInfo.EndTime}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-2 border-black shadow-sm p-2"
              />
            </div>
          </div>

          {/* À propos de moi (Markdown) */}
          <div>
            <label htmlFor="aboutMe" className="block">
              À propos de moi
            </label>
            <textarea
              id="About"
              name="About"
              value={doctorInfo.About}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm p-2"
              rows="4"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label htmlFor="category" className="block">
              Catégorie
            </label>
            <select
              id="categories"
              name="categories"
              value={doctorInfo.categories}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm p-2"
            >
              <option value="">Sélectionnez une catégorie</option>
              <option value="1">ophtalmo</option>
              <option value="2">Dentiste</option>
            </select>
          </div>

          {/* Téléphone */}
          <div>
            <label htmlFor="phone" className="block">
              Téléphone
            </label>
            <input
              type="text"
              id="Phone"
              name="Phone"
              value={doctorInfo.Phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm p-2"
            />
          </div>
          {/* Image */}
          <div>
            <label htmlFor="image" className="block">
              Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm p-2"
            />
          </div>

          {/* Bouton de soumission */}
          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded float-right "
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
