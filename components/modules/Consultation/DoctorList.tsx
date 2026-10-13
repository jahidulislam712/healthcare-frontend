"use client";

import { getDoctors } from "@/app/(commonLayout)/consultation/_action";
import { useQuery } from "@tanstack/react-query";

function DoctorList() {
  const { data } = useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });

  const doctors = data?.data ?? [];
  return (
    <div>
      {doctors.map((doctor) => (
        <div key={doctor.id}>
          <h2>{doctor.name}</h2>
        </div>
      ))}
    </div>
  );
}

export default DoctorList;
