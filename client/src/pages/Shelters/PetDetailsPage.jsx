import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  Heart,
  Calendar,
  DollarSign,
  MapPin,
  Edit,
  Trash2,
  ArrowLeft,
  Check,
  X,
  Shield,
  Activity,
  FileText,
} from "lucide-react";
import NavbarShelter from "../../components/Shelters/NavbarShelter";
import FullPageLoader from "../../Common/FullPageLoader";
import FullPageError from "../../Common/FullPageError";
import NotificationBell from "../../Common/NotificationBell";
import ShelterToast from "../../Common/ShelterToast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const PetDetailsPage = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(15);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchPetDetails();
  }, [petId]);

  useEffect(() => {
    let timer;
    if (showDeleteModal && deleteCountdown > 0) {
      timer = setTimeout(() => setDeleteCountdown(deleteCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showDeleteModal, deleteCountdown]);

  const fetchPetDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get(`/api/shelter/pets/${petId}`);

      if (response.data.success) {
        setPet(response.data.data);
      }
    } catch (err) {
      console.error("Fetch pet details error:", err);
      setError("Failed to load pet details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/add-pet?edit=${petId}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setDeleteCountdown(15);
  };

  const handleDeleteConfirm = async () => {
    if (deleteCountdown > 0) return;

    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/api/shelter/pets/${petId}`);

      if (response.data.success) {
        setToast({
          type: "success",
          title: "Pet Removed",
          message: `${pet.name} has been successfully removed`,
        });

        setTimeout(() => {
          navigate("/my-pets");
        }, 2000);
      }
    } catch (err) {
      console.error("Delete pet error:", err);
      setToast({
        type: "error",
        title: "Delete Failed",
        message: "Failed to delete pet. Please try again.",
      });
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout", {});
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const ImageModal = ({ imageUrl, onClose }) => {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        >
          <X size={24} />
        </button>
        <img
          src={imageUrl}
          alt="Full size"
          className="max-h-[90vh] max-w-[90vw] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <FullPageLoader
        title="Loading Pet Details…"
        subtitle="Fetching pet information"
      />
    );
  }

  if (error) return <FullPageError message={error} onRetry={fetchPetDetails} />;

  if (!pet) return <FullPageError message="Pet not found" />;

  return (
    <div className="min-h-screen bg-[#1e202c] flex">
      <NavbarShelter onLogout={handleLogout} />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate("/my-pets")}
              className="flex items-center gap-2 text-[#bfc0d1] transition-colors hover:text-white"
            >
              <ArrowLeft size={20} />
              <span>Back to My Pets</span>
            </button>
            <NotificationBell />
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Image Gallery */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-4">
                <div className="overflow-hidden rounded-2xl border border-[#4a5568]/20 bg-[#31323e]">
                  {pet.coverImage ? (
                    <img
                      src={pet.coverImage}
                      alt={pet.name}
                      className="h-80 w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(pet.coverImage)}
                    />
                  ) : pet.images && pet.images.length > 0 ? (
                    <img
                      src={pet.images[0]}
                      alt={pet.name}
                      className="h-80 w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(pet.images[0])}
                    />
                  ) : (
                    <div className="flex h-80 items-center justify-center bg-[#4a5568]/20">
                      <Heart size={64} className="text-[#4a5568]/40" />
                    </div>
                  )}
                </div>

                {pet.images && pet.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {pet.images
                      .filter((img) => img !== pet.coverImage)
                      .slice(0, 5)
                      .map((img, idx) => (
                        <div
                          key={idx}
                          className="overflow-hidden rounded-lg border border-[#4a5568]/20 cursor-pointer hover:border-[#4a5568]/50 transition-all"
                          onClick={() => setSelectedImage(img)}
                        >
                          <img
                            src={img}
                            alt={`${pet.name} ${idx + 2}`}
                            className="h-24 w-full object-cover hover:scale-110 transition-transform"
                          />
                        </div>
                      ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleEdit}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4a5568] py-3 text-sm font-semibold text-white transition-all hover:bg-[#5a6678] active:scale-95"
                  >
                    <Edit size={18} />
                    Edit Pet
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-3 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/20 active:scale-95"
                  >
                    <Trash2 size={18} />
                    Delete Pet
                  </button>
                </div>

                {/* Cost Summary */}
                <div className="rounded-2xl border border-[#4a5568]/20 bg-[#31323e] p-6">
                  <h3 className="mb-4 text-lg font-bold text-white">
                    Adoption Cost
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#bfc0d1]/70">
                        Maintenance Cost
                      </span>
                      <span className="font-semibold text-white">
                        ₹{pet.maintenanceCost || 0}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-[#bfc0d1]/70">Donation</span>
                      <span className="font-semibold text-white">
                        ₹{pet.donation || 0}
                      </span>
                    </div>

                    <div className="border-t border-[#4a5568]/20 pt-2 mt-2 flex justify-between">
                      <span className="font-bold text-white">Total</span>
                      <span className="font-bold text-[#4a5568]">
                        ₹{pet.totalAdoptionCost || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pet Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="rounded-2xl border border-[#4a5568]/20 bg-[#31323e] p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {pet.name}
                    </h1>
                    <p className="text-lg text-[#bfc0d1]/80">
                      {pet.breed} • {pet.species}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      pet.adoptionStatus === "available"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : pet.adoptionStatus === "pending"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {pet.adoptionStatus}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl bg-[#1e202c]/50 p-4">
                    <Calendar size={20} className="text-[#4a5568]" />
                    <div>
                      <p className="text-xs text-[#bfc0d1]/60">Age</p>
                      <p className="font-semibold text-white">
                        {pet.age} {pet.ageUnit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-[#1e202c]/50 p-4">
                    <Heart size={20} className="text-[#4a5568]" />
                    <div>
                      <p className="text-xs text-[#bfc0d1]/60">Gender</p>
                      <p className="font-semibold text-white capitalize">
                        {pet.gender}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-[#1e202c]/50 p-4">
                    <MapPin size={20} className="text-[#4a5568]" />
                    <div>
                      <p className="text-xs text-[#bfc0d1]/60">Size</p>
                      <p className="font-semibold text-white capitalize">
                        {pet.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-[#1e202c]/50 p-4">
                    <DollarSign size={20} className="text-[#4a5568]" />
                    <div>
                      <p className="text-xs text-[#bfc0d1]/60">Adoption Fee</p>
                      <p className="font-semibold text-white">
                        ${pet.adoptionFee}
                      </p>
                    </div>
                  </div>
                </div>

                {pet.color && (
                  <div className="mt-4 rounded-xl bg-[#1e202c]/50 p-4">
                    <p className="text-xs text-[#bfc0d1]/60 mb-1">Color</p>
                    <p className="font-semibold text-white">{pet.color}</p>
                  </div>
                )}
              </div>

              {/* Health & Care */}
              <div className="rounded-2xl border border-[#4a5568]/20 bg-[#31323e] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-[#4a5568]" />
                  <h2 className="text-xl font-bold text-white">
                    Health & Care
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Price Breakdown Grid */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Vaccinated */}
                    <div className="rounded-xl bg-[#1e202c]/50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {pet.vaccinated ? (
                            <Check size={20} className="text-green-400" />
                          ) : (
                            <X size={20} className="text-red-400" />
                          )}
                          <span className="text-sm text-[#bfc0d1]">
                            Vaccinated
                          </span>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            pet.vaccinated
                              ? "text-green-400"
                              : "text-[#bfc0d1]/40"
                          }`}
                        >
                          {pet.vaccinated ? "₹500" : "₹0"}
                        </span>
                      </div>
                      <div className="text-xs text-[#bfc0d1]/60">
                        {pet.vaccinated
                          ? "Included in maintenance"
                          : "Not vaccinated"}
                      </div>
                    </div>

                    {/* Spayed/Neutered */}
                    <div className="rounded-xl bg-[#1e202c]/50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {pet.spayedNeutered ? (
                            <Check size={20} className="text-green-400" />
                          ) : (
                            <X size={20} className="text-red-400" />
                          )}
                          <span className="text-sm text-[#bfc0d1]">
                            Spayed/Neutered
                          </span>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            pet.spayedNeutered
                              ? "text-green-400"
                              : "text-[#bfc0d1]/40"
                          }`}
                        >
                          {pet.spayedNeutered ? "₹400" : "₹0"}
                        </span>
                      </div>
                      <div className="text-xs text-[#bfc0d1]/60">
                        {pet.spayedNeutered
                          ? "Included in maintenance"
                          : "Not spayed/neutered"}
                      </div>
                    </div>

                    {/* House Trained */}
                    <div className="rounded-xl bg-[#1e202c]/50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {pet.houseTrained ? (
                            <Check size={20} className="text-green-400" />
                          ) : (
                            <X size={20} className="text-red-400" />
                          )}
                          <span className="text-sm text-[#bfc0d1]">
                            House Trained
                          </span>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            pet.houseTrained
                              ? "text-green-400"
                              : "text-[#bfc0d1]/40"
                          }`}
                        >
                          {pet.houseTrained ? "₹1000" : "₹0"}
                        </span>
                      </div>
                      <div className="text-xs text-[#bfc0d1]/60">
                        {pet.houseTrained
                          ? "Included in maintenance"
                          : "Not house trained"}
                      </div>
                    </div>

                    {/* Special Needs */}
                    <div className="rounded-xl bg-[#1e202c]/50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {pet.specialNeeds ? (
                            <Activity size={20} className="text-yellow-400" />
                          ) : (
                            <Check size={20} className="text-green-400" />
                          )}
                          <span className="text-sm text-[#bfc0d1]">
                            {pet.specialNeeds
                              ? "Special Needs"
                              : "No Special Needs"}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            pet.specialNeeds
                              ? "text-yellow-400"
                              : "text-[#bfc0d1]/40"
                          }`}
                        >
                          {pet.specialNeeds ? "₹100" : "₹0"}
                        </span>
                      </div>
                      <div className="text-xs text-[#bfc0d1]/60">
                        {pet.specialNeeds
                          ? "Requires extra care"
                          : "Standard care"}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#4a5568]/20 border border-[#4a5568]/30 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">
                        Total Maintenance Cost
                      </span>
                      <span className="text-lg font-bold text-[#4a5568]">
                        ₹{pet.maintenanceCost || 0}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#bfc0d1]/60">
                      Based on health and care services provided
                    </p>
                  </div>
                </div>

                {pet.medicalNotes && (
                  <div className="mt-4 rounded-xl bg-[#1e202c]/50 p-4">
                    <p className="text-xs text-[#bfc0d1]/60 mb-2">
                      Medical Notes
                    </p>
                    <p className="text-sm text-[#bfc0d1] leading-relaxed">
                      {pet.medicalNotes}
                    </p>
                  </div>
                )}
              </div>
              {pet.specialNeeds && pet.specialNeedsDescription && (
                <div className="mt-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4">
                  <p className="text-xs text-yellow-400/80 mb-2 font-semibold">
                    Special Needs Description
                  </p>
                  <p className="text-sm text-[#bfc0d1] leading-relaxed">
                    {pet.specialNeedsDescription}
                  </p>
                </div>
              )}

              {/* Temperament */}
              {pet.temperament && pet.temperament.length > 0 && (
                <div className="rounded-2xl border border-[#4a5568]/20 bg-[#31323e] p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-[#4a5568]" />
                    <h2 className="text-xl font-bold text-white">
                      Temperament
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pet.temperament.map((trait, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-[#4a5568]/20 px-4 py-2 text-sm text-[#bfc0d1]"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {pet.description && (
                <div className="rounded-2xl border border-[#4a5568]/20 bg-[#31323e] p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-[#4a5568]" />
                    <h2 className="text-xl font-bold text-white">
                      Description
                    </h2>
                  </div>
                  <p className="text-[#bfc0d1] leading-relaxed">
                    {pet.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-[#31323e] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-full bg-red-500/20 p-4">
                <Trash2 size={32} className="text-red-400" />
              </div>
            </div>

            <h3 className="mb-2 text-center text-xl font-bold text-white">
              Delete Pet Profile
            </h3>
            <p className="mb-6 text-center text-sm text-[#bfc0d1]/80 leading-relaxed">
              You are permanently going to delete this pet profile. Think it
              over.
            </p>

            {deleteCountdown > 0 && (
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-red-500/20 px-6 py-3">
                  <span className="text-2xl font-bold text-red-400">
                    {deleteCountdown}s
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#bfc0d1]/60">
                  Please wait to confirm deletion
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-[#4a5568]/30 bg-[#1e202c] py-3 text-sm font-semibold text-white transition-all hover:bg-[#1e202c]/80 disabled:opacity-50 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteCountdown > 0 || isDeleting}
                className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white transition-all hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {isDeleting ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <ShelterToast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default PetDetailsPage;
