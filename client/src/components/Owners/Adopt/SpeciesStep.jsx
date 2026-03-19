import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import {
  Loader2,
  PawPrint,
  Bird,
  Rabbit,
  Fish,
  Bug,
  Cat,
  Dog,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const speciesIcons = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  rabbit: Rabbit,
  fish: Fish,
  reptile: Bug,

  other: PawPrint,
};

const SpeciesStep = ({ onSelect, selectedSpecies }) => {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpecies();
  }, []);

  const fetchSpecies = async () => {
    try {
      const res = await axiosInstance.get("/api/owner/adoption/species");
      if (res.data.success) {
        setSpecies(res.data.data);
      }
    } catch (err) {
      console.error("Fetch species error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-[#60519b]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Choose a Species</h2>
        <p className="text-sm text-[#bfc0d1]">
          Select the type of pet you'd like to adopt
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {species.map((s) => {
          const isSelected = selectedSpecies === s;
          const Icon = speciesIcons[s] || PawPrint;

          return (
            <button
              key={s}
              onClick={() => onSelect(s)}
              className={`
                group relative overflow-hidden rounded-2xl p-6
                transition-all duration-300 ease-out
                ${
                  isSelected
                    ? "bg-linear-to-br from-[#60519b] to-[#7d6ab8] scale-105 shadow-2xl shadow-[#60519b]/40"
                    : "bg-[#31323e] border border-[#60519b]/20 hover:border-[#60519b]/50 hover:scale-105"
                }
              `}
            >
              {/* Glow effect */}
              {!isSelected && (
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#60519b]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              )}

              <div className="relative z-10 flex flex-col items-center text-center gap-3">
                <div
                  className={`
                    p-4 rounded-xl transition-all duration-300
                    ${
                      isSelected
                        ? "bg-white/15"
                        : "bg-[#1e202c] group-hover:bg-[#60519b]/15"
                    }
                  `}
                >
                  <Icon
                    size={32}
                    className={`transition-all duration-300 ${
                      isSelected
                        ? "text-white"
                        : "text-[#bfc0d1] group-hover:text-[#60519b]"
                    }`}
                  />
                </div>

                <p
                  className={`text-sm font-semibold capitalize tracking-wide ${
                    isSelected ? "text-white" : "text-[#bfc0d1]"
                  }`}
                >
                  {s}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SpeciesStep;
