"use client";
import GlobalApi from "@/app/_utils/GlobalApi";
import React, { useEffect, useState } from "react";
import DoctorDetail from "../_components/DoctorDetail";
import DoctorSuggestionList from "../_components/DoctorSuggestionList";

function Details({ params }) {
  const [doctor, setDoctor] = useState();
  const [isLoading, setIsLoading] = useState(false); // Ajout d'un état de chargement

  useEffect(() => {
    getDoctorById();
  }, []);

  const getDoctorById = () => {
    setIsLoading(true); // Commence le chargement
    GlobalApi.getDoctorById(params.recordId).then((resp) => {
      setDoctor(resp.data.data);
      setIsLoading(false); // Fin du chargement
    });
  };

  return (
    <div className="p-5 md:px-10">
      <h2 className="font-bold text-[22px]">Details</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 ">
        {/* Doctor Detail */}
        <div className=" col-span-3">
          {isLoading ? (
            <p style={{ margin: "25% 50%" }}>Loading...</p>
          ) : (
            doctor && <DoctorDetail doctor={doctor} />
          )}
        </div>
        {/* Doctor Suggestion */}
        <div>
          <DoctorSuggestionList />
        </div>
      </div>
    </div>
  );
}

export default Details;
