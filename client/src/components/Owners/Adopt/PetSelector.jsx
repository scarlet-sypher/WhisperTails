import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { Loader2, Eye, Check } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const PetSelector = ({
  species,
  breed,
  onSelectPet,
  onViewDetails,
  selectedPetId,
  onWithdraw,
}) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (species && breed) {
      fetchPets();
    }
  }, [species, breed]);

  const fetchPets = async () => {
    try {
      const res = await axiosInstance.get("/api/owner/adoption/pets", {
        params: { species, breed },
      });
      if (res.data.success) {
        setPets(res.data.data);
      }
    } catch (err) {
      console.error("Fetch pets error:", err);
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

  if (pets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🐾</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No pets available
        </h3>
        <p className="text-sm text-[#bfc0d1]">
          Try selecting a different breed or species
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Pet</h2>
        <p className="text-sm text-[#bfc0d1]">
          Found {pets.length} pet{pets.length !== 1 ? "s" : ""} available for
          adoption
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => {
          const isSelected = selectedPetId === pet._id;
          const displayImage = pet.coverImage || pet.images?.[0] || "";

          return (
            <div
              key={pet._id}
              className={`
                group relative overflow-hidden rounded-2xl
                transition-all duration-300
                ${
                  isSelected
                    ? "ring-4 ring-[#60519b] shadow-xl shadow-[#60519b]/30 scale-105"
                    : "hover:scale-105"
                }
              `}
            >
              <div className="bg-[#31323e] border border-[#60519b]/20">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={pet.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-[#1e202c]/50 flex items-center justify-center">
                      <span className="text-6xl">🐾</span>
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute inset-0 bg-[#60519b]/20 flex items-center justify-center">
                      <div className="bg-[#60519b] rounded-full p-3">
                        <Check
                          size={24}
                          className="text-white"
                          strokeWidth={3}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {pet.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-[#bfc0d1]">
                    <div>
                      <span className="text-[#bfc0d1]/60">Species:</span>{" "}
                      <span className="capitalize">{pet.species}</span>
                    </div>
                    <div>
                      <span className="text-[#bfc0d1]/60">Breed:</span>{" "}
                      <span className="capitalize">{pet.breed}</span>
                    </div>
                    <div>
                      <span className="text-[#bfc0d1]/60">Age:</span> {pet.age}{" "}
                      {pet.ageUnit}
                    </div>
                    <div>
                      <span className="text-[#bfc0d1]/60">Gender:</span>{" "}
                      <span className="capitalize">{pet.gender}</span>
                    </div>
                  </div>

                  {/* Shelter Info */}
                  {pet.shelter && (
                    <div className="mb-4 text-xs text-[#bfc0d1]/80 bg-[#1e202c]/50 rounded-lg p-2">
                      <span className="text-[#bfc0d1]/60">Shelter:</span>{" "}
                      {pet.shelter.name || "Unknown Shelter"}
                    </div>
                  )}

                  {/* Adoption Fee */}
                  <div className="mb-4 text-sm font-semibold text-[#60519b]">
                    Adoption Fee: $
                    {pet.totalAdoptionCost || pet.adoptionFee || 0}
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onViewDetails(pet._id)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-[#60519b]/20 px-3 py-2 text-xs font-semibold text-[#60519b] transition-all hover:bg-[#60519b]/30 active:scale-95"
                    >
                      <Eye size={14} />
                      Details
                    </button>

                    <button
                      onClick={() => {
                        if (pet.applicationStatus?.reason === "own_submitted") {
                          onWithdraw(pet._id);
                        } else if (!pet.applicationStatus?.disabled) {
                          onSelectPet(pet._id);
                        }
                      }}
                      disabled={
                        pet.applicationStatus?.disabled &&
                        pet.applicationStatus?.reason !== "own_submitted"
                      }
                      className={`
    rounded-lg px-3 py-2 text-xs font-semibold
    transition-all
    ${
      pet.applicationStatus?.reason === "own_submitted"
        ? "bg-linear-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-lg active:scale-95"
        : pet.applicationStatus?.disabled
          ? pet.applicationStatus.reason === "active_by_other"
            ? "bg-gray-600 text-gray-300 cursor-not-allowed opacity-60"
            : pet.applicationStatus.reason === "own_approved"
              ? "bg-blue-600 text-white cursor-not-allowed"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          : isSelected
            ? "bg-linear-to-r from-green-500 to-green-600 text-white active:scale-95"
            : "bg-linear-to-r from-[#60519b] to-[#7d6ab8] text-white hover:shadow-lg hover:shadow-[#60519b]/30 active:scale-95"
    }
  `}
                    >
                      {pet.applicationStatus?.text ||
                        (isSelected ? "Selected" : "Select")}
                    </button>
                  </div>

                  {pet.applicationStatus?.disabled && (
                    <div className="mt-3 text-center">
                      <p className="text-xs leading-relaxed">
                        {pet.applicationStatus.reason === "active_by_other" && (
                          <span className="text-gray-400">
                            Another user has applied for this pet
                          </span>
                        )}
                        {pet.applicationStatus.reason === "own_submitted" && (
                          <span className="text-yellow-400">
                            Click 'Withdraw' to cancel your application
                          </span>
                        )}
                        {pet.applicationStatus.reason === "own_approved" && (
                          <span className="text-green-400">
                            ✓ Adoption approved!
                          </span>
                        )}
                        {pet.applicationStatus.reason === "own_rejected" && (
                          <span className="text-yellow-400">
                            You can reapply
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PetSelector;
