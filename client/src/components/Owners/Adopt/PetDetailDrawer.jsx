import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { X, Loader2, MapPin, Mail, Phone, Check } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const PetDetailDrawer = ({
  petId,
  isOpen,
  onClose,
  onSelectPet,
  onWithdraw,
}) => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen && petId) {
      fetchPetDetails();
    }
  }, [isOpen, petId]);

  const fetchPetDetails = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/owner/adoption/pets/${petId}`);
      if (res.data.success) {
        setPet(res.data.data);
      }
    } catch (err) {
      console.error("Fetch pet details error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-[#1e202c] z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#60519b]/20 bg-[#1e202c]/95 backdrop-blur-sm px-6 py-4">
          <h2 className="text-xl font-bold text-white">Pet Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#bfc0d1] transition-all hover:bg-white/10 hover:text-white active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={40} className="animate-spin text-[#60519b]" />
          </div>
        ) : pet ? (
          <div className="p-6 space-y-6">
            {/* Image Carousel */}
            <div className="relative">
              {pet.images && pet.images.length > 0 ? (
                <>
                  <div className="aspect-video overflow-hidden rounded-2xl bg-[#31323e]">
                    <img
                      src={pet.images[currentImageIndex]}
                      alt={pet.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {pet.images.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto">
                      {pet.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`shrink-0 h-16 w-16 overflow-hidden rounded-lg transition-all ${
                            currentImageIndex === idx
                              ? "ring-2 ring-[#60519b] scale-110"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${pet.name} ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-video rounded-2xl bg-[#31323e] flex items-center justify-center">
                  <span className="text-8xl">🐾</span>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-6">
              <h3 className="text-2xl font-bold text-white mb-4">{pet.name}</h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#bfc0d1]/60 mb-1">Species</p>
                  <p className="text-white font-medium capitalize">
                    {pet.species}
                  </p>
                </div>
                <div>
                  <p className="text-[#bfc0d1]/60 mb-1">Breed</p>
                  <p className="text-white font-medium capitalize">
                    {pet.breed}
                  </p>
                </div>
                <div>
                  <p className="text-[#bfc0d1]/60 mb-1">Age</p>
                  <p className="text-white font-medium">
                    {pet.age} {pet.ageUnit}
                  </p>
                </div>
                <div>
                  <p className="text-[#bfc0d1]/60 mb-1">Gender</p>
                  <p className="text-white font-medium capitalize">
                    {pet.gender}
                  </p>
                </div>
                <div>
                  <p className="text-[#bfc0d1]/60 mb-1">Size</p>
                  <p className="text-white font-medium capitalize">
                    {pet.size}
                  </p>
                </div>
                <div>
                  <p className="text-[#bfc0d1]/60 mb-1">Color</p>
                  <p className="text-white font-medium capitalize">
                    {pet.color || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {pet.description && (
              <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-6">
                <h4 className="text-lg font-bold text-white mb-3">
                  About {pet.name}
                </h4>
                <p className="text-sm text-[#bfc0d1] leading-relaxed">
                  {pet.description}
                </p>
              </div>
            )}

            {/* Health & Behavior */}
            <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-6">
              <h4 className="text-lg font-bold text-white mb-4">
                Health & Behavior
              </h4>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div
                  className={`rounded-lg p-3 ${
                    pet.vaccinated
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  }`}
                >
                  <p className="text-xs text-[#bfc0d1]/60 mb-1">Vaccinated</p>
                  <p
                    className={`text-sm font-semibold ${
                      pet.vaccinated ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {pet.vaccinated ? "Yes" : "No"}
                  </p>
                </div>

                <div
                  className={`rounded-lg p-3 ${
                    pet.spayedNeutered
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  }`}
                >
                  <p className="text-xs text-[#bfc0d1]/60 mb-1">
                    Spayed/Neutered
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      pet.spayedNeutered ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {pet.spayedNeutered ? "Yes" : "No"}
                  </p>
                </div>

                <div
                  className={`rounded-lg p-3 ${
                    pet.houseTrained
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-yellow-500/10 border border-yellow-500/20"
                  }`}
                >
                  <p className="text-xs text-[#bfc0d1]/60 mb-1">
                    House Trained
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      pet.houseTrained ? "text-green-400" : "text-yellow-400"
                    }`}
                  >
                    {pet.houseTrained ? "Yes" : "In Progress"}
                  </p>
                </div>

                <div
                  className={`rounded-lg p-3 ${
                    pet.specialNeeds
                      ? "bg-blue-500/10 border border-blue-500/20"
                      : "bg-[#1e202c]/50 border border-[#60519b]/10"
                  }`}
                >
                  <p className="text-xs text-[#bfc0d1]/60 mb-1">
                    Special Needs
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      pet.specialNeeds ? "text-blue-400" : "text-[#bfc0d1]"
                    }`}
                  >
                    {pet.specialNeeds ? "Yes" : "None"}
                  </p>
                </div>
              </div>

              {pet.temperament && pet.temperament.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-[#bfc0d1]/60 mb-2">Temperament</p>
                  <div className="flex flex-wrap gap-2">
                    {pet.temperament.map((trait, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-[#60519b]/20 px-3 py-1 text-xs font-medium text-[#60519b]"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {pet.medicalNotes && (
                <div>
                  <p className="text-xs text-[#bfc0d1]/60 mb-2">
                    Medical Notes
                  </p>
                  <p className="text-sm text-[#bfc0d1] leading-relaxed">
                    {pet.medicalNotes}
                  </p>
                </div>
              )}

              {pet.specialNeeds && pet.specialNeedsDescription && (
                <div className="mt-4 rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
                  <p className="text-xs text-blue-400 font-semibold mb-1">
                    Special Needs Description
                  </p>
                  <p className="text-sm text-[#bfc0d1] leading-relaxed">
                    {pet.specialNeedsDescription}
                  </p>
                </div>
              )}
            </div>

            {/* Adoption Costs */}
            <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-6">
              <h4 className="text-lg font-bold text-white mb-4">
                Adoption Costs
              </h4>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#bfc0d1]">Adoption Fee</span>
                  <span className="text-white font-semibold">
                    ${pet.adoptionFee || 0}
                  </span>
                </div>

                {pet.donation > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#bfc0d1]">Suggested Donation</span>
                    <span className="text-white font-semibold">
                      ${pet.donation}
                    </span>
                  </div>
                )}

                {pet.maintenanceCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#bfc0d1]">
                      Est. Monthly Maintenance
                    </span>
                    <span className="text-white font-semibold">
                      ${pet.maintenanceCost}
                    </span>
                  </div>
                )}

                <div className="border-t border-[#60519b]/20 pt-3 flex justify-between">
                  <span className="text-white font-bold">Total Cost</span>
                  <span className="text-[#60519b] font-bold text-lg">
                    ${pet.totalAdoptionCost || pet.adoptionFee || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Shelter Info */}
            {pet.shelter && (
              <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-6">
                <h4 className="text-lg font-bold text-white mb-4">
                  Shelter Information
                </h4>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-[#60519b]/20 p-2">
                      <MapPin size={16} className="text-[#60519b]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#bfc0d1]/60 mb-1">Name</p>
                      <p className="text-sm text-white font-medium">
                        {pet.shelter.name || "Unknown Shelter"}
                      </p>
                    </div>
                  </div>

                  {pet.shelter.address && (
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-[#60519b]/20 p-2">
                        <MapPin size={16} className="text-[#60519b]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#bfc0d1]/60 mb-1">
                          Address
                        </p>
                        <p className="text-sm text-white">
                          {pet.shelter.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {pet.shelter.phone && (
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-[#60519b]/20 p-2">
                        <Phone size={16} className="text-[#60519b]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#bfc0d1]/60 mb-1">Phone</p>
                        <p className="text-sm text-white">
                          {pet.shelter.phone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Select Button */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (pet.applicationStatus?.reason === "own_submitted") {
                    onWithdraw(pet._id);
                    onClose();
                  } else if (!pet.applicationStatus?.disabled) {
                    onSelectPet(pet._id);
                    onClose();
                  }
                }}
                disabled={
                  pet.applicationStatus?.disabled &&
                  pet.applicationStatus?.reason !== "own_submitted"
                }
                className={`w-full flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold transition-all ${
                  pet.applicationStatus?.reason === "own_submitted"
                    ? "bg-linear-to-r from-yellow-500 to-yellow-600 text-white shadow-lg hover:shadow-xl active:scale-95"
                    : pet.applicationStatus?.disabled
                      ? pet.applicationStatus.reason === "active_by_other"
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed opacity-60"
                        : pet.applicationStatus.reason === "own_approved"
                          ? "bg-blue-600 text-white cursor-not-allowed"
                          : "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-linear-to-r from-[#60519b] to-[#7d6ab8] text-white shadow-lg shadow-[#60519b]/30 hover:shadow-xl hover:shadow-[#60519b]/40 active:scale-95"
                }`}
              >
                <Check size={20} strokeWidth={2.5} />
                {pet.applicationStatus?.text || "Select This Pet"}
              </button>

              {pet.applicationStatus?.disabled && (
                <div className="text-sm text-center px-4 py-2 rounded-lg bg-[#1e202c]/50">
                  {pet.applicationStatus.reason === "active_by_other" && (
                    <span className="text-gray-400">
                      Another user has applied for this pet
                    </span>
                  )}
                  {pet.applicationStatus.reason === "own_submitted" && (
                    <span className="text-yellow-400">
                      Your application is active. Click 'Withdraw' to cancel it.
                    </span>
                  )}
                  {pet.applicationStatus.reason === "own_approved" && (
                    <span className="text-green-400">
                      🎉 Congratulations! Your adoption has been approved
                    </span>
                  )}
                  {pet.applicationStatus.reason === "own_rejected" && (
                    <span className="text-yellow-400">
                      Your previous application was rejected. You can apply
                      again.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-24">
            <p className="text-[#bfc0d1]">Pet not found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PetDetailDrawer;
