import React, { useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  Heart,
  AlertCircle,
  Home,
  Phone,
  Mail,
  User,
  Edit2,
  Trash2,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import axiosInstance from "../../../utils/axiosInstance";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const PetDetailsModal = ({ pet, onClose, onDelete, onEdit }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "OWNED":
        return <Heart size={20} className="text-green-400" />;
      case "LOST":
      case "FOUND":
        return <AlertCircle size={20} className="text-red-400" />;
      case "FOSTER":
        return <Home size={20} className="text-blue-400" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "OWNED":
        return "border-green-500/30 bg-green-500/10 text-green-400";
      case "LOST":
      case "FOUND":
        return "border-red-500/30 bg-red-500/10 text-red-400";
      case "FOSTER":
        return "border-blue-500/30 bg-blue-500/10 text-blue-400";
      default:
        return "border-[#60519b]/30 bg-[#60519b]/10 text-[#60519b]";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await axiosInstance.delete(`/api/owner/pets/${pet._id}`);
      if (res.data.success) {
        onDelete(pet._id);
        setShowDeleteConfirm(false);
        onClose();
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete pet");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#31323e] rounded-2xl border border-[#60519b]/30 shadow-2xl animate-slideUp">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#1e202c]/80 hover:bg-[#60519b] text-white transition-all duration-300 hover:scale-110"
          >
            <X size={20} />
          </button>

          <div className="relative h-80 bg-[#1e202c]/50 overflow-hidden">
            <div className="flex gap-2 h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {pet.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${pet.petName || "Pet"} - ${index + 1}`}
                  className="h-full w-full object-cover snap-center shrink-0"
                />
              ))}
            </div>
            {pet.photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                {pet.photos.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-white/50"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {pet.petName || "Unnamed Pet"}
                </h2>
                {pet.species && (
                  <p className="text-lg text-[#bfc0d1]">
                    {pet.species}{" "}
                    {pet.breed && pet.breed !== "Mixed/Unknown"
                      ? `• ${pet.breed}`
                      : ""}
                  </p>
                )}
              </div>
              <span
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${getCategoryColor(
                  pet.category,
                )}`}
              >
                {getCategoryIcon(pet.category)}
                {pet.category}
              </span>
            </div>

            <div className="flex items-center gap-4 pb-4 border-b border-[#60519b]/20">
              <div className="flex items-center gap-2 text-sm text-[#bfc0d1]">
                <Calendar size={16} className="text-[#60519b]" />
                <span>Added {formatDate(pet.createdAt)}</span>
              </div>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  pet.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : pet.status === "resolved"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#bfc0d1]/60">
                  Owner Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-[#bfc0d1]">
                    <User size={16} className="text-[#60519b]" />
                    <span>{pet.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#bfc0d1]">
                    <Mail size={16} className="text-[#60519b]" />
                    <span>{pet.ownerEmail}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#bfc0d1]">
                    <Phone size={16} className="text-[#60519b]" />
                    <span>{pet.ownerPhone}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#bfc0d1]/60">
                  Pet Details
                </h3>
                <div className="space-y-2 text-sm text-[#bfc0d1]">
                  {pet.approximateAge && (
                    <div>
                      <span className="text-[#60519b]">Age:</span>{" "}
                      {pet.approximateAge}
                    </div>
                  )}
                  {pet.healthNotes && (
                    <div>
                      <span className="text-[#60519b]">Health:</span>{" "}
                      {pet.healthNotes}
                    </div>
                  )}
                  {pet.ownerNote && (
                    <div>
                      <span className="text-[#60519b]">Notes:</span>{" "}
                      {pet.ownerNote}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {pet.location?.address && (
              <div className="p-4 rounded-xl bg-[#1e202c]/50 border border-[#60519b]/20">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={20}
                    className="text-[#60519b] mt-0.5 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">
                      Location
                    </h4>
                    <p className="text-sm text-[#bfc0d1]">
                      {pet.location.address}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {pet.category === "FOSTER" && pet.fosterDetails && (
              <div className="p-4 rounded-xl bg-[#1e202c]/50 border border-[#60519b]/20">
                <h4 className="text-sm font-semibold text-white mb-3">
                  Foster Information
                </h4>
                <div className="space-y-2 text-sm text-[#bfc0d1]">
                  {pet.fosterDetails.reason && (
                    <div>
                      <span className="text-[#60519b]">Reason:</span>{" "}
                      {pet.fosterDetails.reason}
                    </div>
                  )}
                  {pet.fosterDetails.duration && (
                    <div>
                      <span className="text-[#60519b]">Duration:</span>{" "}
                      {pet.fosterDetails.duration}
                    </div>
                  )}
                  {pet.fosterDetails.careNotes && (
                    <div>
                      <span className="text-[#60519b]">Care Notes:</span>{" "}
                      {pet.fosterDetails.careNotes}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-[#60519b]/20">
              <button
                onClick={() => {
                  onClose();
                  if (onEdit) onEdit(pet);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#60519b] hover:bg-[#7d6ab8] text-white font-semibold transition-all duration-300 hover:scale-105"
              >
                <Edit2 size={18} />
                Edit Pet
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold transition-all duration-300 hover:scale-105 border border-red-500/30"
              >
                <Trash2 size={18} />
                Delete Pet
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          petName={pet.petName || "this pet"}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          loading={deleting}
        />
      )}
    </>
  );
};

export default PetDetailsModal;
