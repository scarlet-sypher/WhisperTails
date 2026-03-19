import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import NavbarShelter from "../../components/Shelters/NavbarShelter";
import FullPageLoader from "../../Common/FullPageLoader";
import FullPageError from "../../Common/FullPageError";
import ShelterToast from "../../Common/ShelterToast";
import PetManagementCard from "../../components/Shelters/PetManagement/PetManagementCard";
import PetDetailModal from "../../components/Shelters/PetManagement/PetDetailModal";
import { Award } from "lucide-react";
import defaultAvatar from "../../assets/Shelter/default-shelter.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ShelterPetManagement = () => {
  const [profile, setProfile] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("LOST");
  const [selectedPet, setSelectedPet] = useState(null);
  const [toast, setToast] = useState(null);

  const categories = [
    { key: "LOST", label: "Lost" },
    { key: "FOUND", label: "Found" },
    { key: "OWNED", label: "Owned" },
    { key: "FOSTER", label: "Foster" },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      fetchPets();
    }
  }, [activeCategory, profile]);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/shelter/profile");
      if (res.data.success) {
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/api/shelter/owner-pets?category=${activeCategory}`,
      );
      if (res.data.success) {
        setPets(res.data.data);
      }
    } catch (err) {
      console.error("Fetch pets error:", err);
      showToast("error", "Error", "Failed to load pets");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (petId, newStatus) => {
    try {
      const res = await axiosInstance.patch(
        `/api/shelter/owner-pets/${petId}/status`,
        { status: newStatus },
      );
      if (res.data.success) {
        showToast("success", "Success", "Pet status updated successfully");
        setSelectedPet(null);
        fetchPets();
      }
    } catch (err) {
      console.error("Status update error:", err);
      showToast("error", "Error", "Failed to update status");
    }
  };

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout", {});
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading && !profile) {
    return (
      <FullPageLoader
        title="Loading Pet Management..."
        subtitle="Fetching owner-added pets"
      />
    );
  }

  if (error) {
    return <FullPageError message={error} onRetry={fetchProfile} />;
  }

  const avatarUrl =
    profile?.avatar &&
    profile.avatar !== "something(url)" &&
    profile.avatar.trim() !== ""
      ? profile.avatar
      : defaultAvatar;

  return (
    <div className="min-h-screen bg-[#1e202c] flex">
      <NavbarShelter onLogout={handleLogout} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
          <div className="mb-6 rounded-2xl border border-[#4a5568]/20 bg-[#31323e] p-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#4a5568] blur-lg opacity-50" />
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-[#31323e] bg-[#4a5568]">
                  <img
                    src={avatarUrl}
                    alt="Shelter"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {profile?.name || "Shelter"}
                </h2>
                <p className="text-sm text-[#bfc0d1]">
                  {profile?.email || "No email"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#4a5568] p-2">
                <Award size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Owner Pet Management
              </h1>
            </div>
            <p className="mt-2 text-sm text-[#bfc0d1]">
              View and manage all pets added by owners
            </p>
          </div>

          <div className="mb-6 flex justify-center">
            <div className="flex gap-2 rounded-xl bg-[#31323e] p-2 shadow-xl shadow-black/20">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-8 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${
                    activeCategory === cat.key
                      ? "bg-linear-to-r from-[#4a5568] to-[#5a6678] text-white shadow-lg shadow-[#4a5568]/40 scale-105"
                      : "text-[#bfc0d1] hover:bg-[#3a3b47] hover:text-white hover:scale-105"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {loading && profile ? (
            <div className="flex justify-center py-12">
              <div className="text-[#bfc0d1]">Loading pets...</div>
            </div>
          ) : pets.length === 0 ? (
            <div className="rounded-2xl border border-[#4a5568]/20 bg-[#31323e] p-12 text-center">
              <p className="text-[#bfc0d1]">
                No {activeCategory.toLowerCase()} pets found
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {pets.map((pet) => (
                <PetManagementCard
                  key={pet._id}
                  pet={pet}
                  onShowDetails={() => setSelectedPet(pet)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedPet && (
        <PetDetailModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {toast && (
        <ShelterToast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ShelterPetManagement;
