import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { Loader2, Search } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const BreedStep = ({ species, onSelect, selectedBreed }) => {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (species) {
      fetchBreeds();
    }
  }, [species]);

  const fetchBreeds = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/owner/adoption/breeds/${species}`,
      );
      if (res.data.success) {
        setBreeds(["all", ...res.data.data]);
      }
    } catch (err) {
      console.error("Fetch breeds error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBreeds = breeds.filter((b) =>
    b.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
        <h2 className="text-2xl font-bold text-white mb-2">Select a Breed</h2>
        <p className="text-sm text-[#bfc0d1]">
          Choose a specific breed or see all available
        </p>
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bfc0d1]/60"
        />
        <input
          type="text"
          placeholder="Search breeds..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl bg-[#31323e] border border-[#60519b]/20 pl-12 pr-4 py-3 text-white placeholder:text-[#bfc0d1]/40 focus:outline-none focus:border-[#60519b]/50"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
        {filteredBreeds.map((breed) => {
          const isSelected = selectedBreed === breed;
          return (
            <button
              key={breed}
              onClick={() => onSelect(breed)}
              className={`
                group relative overflow-hidden rounded-xl px-4 py-3
                transition-all duration-300 text-left
                ${
                  isSelected
                    ? "bg-linear-to-br from-[#60519b] to-[#7d6ab8] shadow-lg shadow-[#60519b]/30"
                    : "bg-[#31323e] border border-[#60519b]/20 hover:border-[#60519b]/50 hover:scale-105"
                }
              `}
            >
              <p
                className={`text-sm font-medium capitalize ${
                  isSelected ? "text-white" : "text-[#bfc0d1]"
                }`}
              >
                {breed === "all" ? "All Breeds" : breed}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BreedStep;
