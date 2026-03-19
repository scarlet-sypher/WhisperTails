import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Owners/NavbarOwner";
import FullPageLoader from "../../Common/FullPageLoader";
import OwnerToast from "../../Common/OwnerToast";
import OwnedPetForm from "../../components/Owners/Pets/OwnedPetForm";
import LostFoundPetForm from "../../components/Owners/Pets/LostFoundPetForm";
import FosterPetForm from "../../components/Owners/Pets/FosterPetForm";
import PetCard from "../../components/Owners/Pets/PetCard";
import defaultAvatar from "../../assets/Owner/default-owner.png";
import { User } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const OwnerPets = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topTab, setTopTab] = useState("add");
  const [categoryTab, setCategoryTab] = useState("owned");
  const [pets, setPets] = useState([]);
  const [toast, setToast] = useState(null);
  const [editingPet, setEditingPet] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (topTab === "view") {
      fetchPets();
    }
  }, [topTab]);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/auth/owner/profile");
      if (res.data.success) {
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      showToast("error", "Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };
  const handlePetDeleted = (petId) => {
    setPets(pets.filter((pet) => pet._id !== petId));
    showToast("success", "Deleted", "Pet deleted successfully");
  };

  const fetchPets = async () => {
    try {
      const res = await axiosInstance.get("/api/owner/pets");
      if (res.data.success) {
        setPets(res.data.data);
      }
    } catch (err) {
      console.error("Fetch pets error:", err);
      showToast("error", "Error", "Failed to load pets");
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

  if (loading) {
    return (
      <FullPageLoader
        title="Loading Pet Management..."
        subtitle="Preparing your pet dashboard"
      />
    );
  }

  const handlePetEdit = (petData) => {
    setEditingPet(petData);
    setTopTab("add");

    const categoryMap = {
      OWNED: "owned",
      LOST: "lost-found",
      FOUND: "lost-found",
      FOSTER: "foster",
    };
    setCategoryTab(categoryMap[petData.category] || "owned");
  };

  const handleEditSuccess = (updatedPet) => {
    showToast("success", "Success", "Pet updated successfully");
    setEditingPet(null);
    setTopTab("view");
    fetchPets();
  };

  const handleCancelEdit = () => {
    setEditingPet(null);
  };

  const avatarUrl =
    profile?.avatar &&
    profile.avatar !== "something(url)" &&
    profile.avatar.trim() !== ""
      ? profile.avatar
      : defaultAvatar;

  return (
    <div className="min-h-screen bg-[#1e202c] flex">
      <Navbar onLogout={handleLogout} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
          <div className="mb-6 rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0">
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-[#60519b] to-[#7d6ab8] blur-lg opacity-50" />
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-[#31323e] bg-linear-to-br from-[#60519b] to-[#7d6ab8]">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-white" />
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {profile?.name || "Owner"}
                </h2>
                <p className="text-sm text-[#bfc0d1]">
                  {profile?.email || "No email"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 flex justify-center">
            <div className="flex gap-2 rounded-xl bg-[#31323e] p-2 shadow-xl shadow-black/20">
              {["add", "view"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTopTab(tab)}
                  className={`px-8 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${
                    topTab === tab
                      ? "bg-linear-to-r from-[#60519b] to-[#7d6ab8] text-white shadow-lg shadow-[#60519b]/40 scale-105"
                      : "text-[#bfc0d1] hover:bg-[#3a3b47] hover:text-white hover:scale-105"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-64 shrink-0">
              <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-4">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#bfc0d1]/60">
                  Categories
                </h3>
                <div className="space-y-2">
                  {[
                    { key: "owned", label: "Owned Pet" },
                    { key: "lost-found", label: "Lost / Found Pet" },
                    { key: "foster", label: "Foster / Temporary Care" },
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setCategoryTab(cat.key)}
                      disabled={topTab === "view"}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        categoryTab === cat.key && topTab === "add"
                          ? "bg-linear-to-r from-[#60519b] to-[#7d6ab8] text-white shadow-lg shadow-[#60519b]/30"
                          : topTab === "view"
                            ? "text-[#bfc0d1]/40 cursor-not-allowed"
                            : "text-[#bfc0d1] hover:bg-[#3a3b47] hover:text-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1">
              {topTab === "add" && (
                <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-6">
                  {editingPet && (
                    <button
                      onClick={handleCancelEdit}
                      className="mb-4 px-4 py-2 rounded-lg bg-[#1e202c] hover:bg-[#3a3b47] text-[#bfc0d1] hover:text-white text-sm font-medium transition-all"
                    >
                      ← Cancel Edit
                    </button>
                  )}

                  {categoryTab === "owned" && (
                    <OwnedPetForm
                      ownerEmail={profile?.email}
                      ownerPhone={profile?.phone}
                      onSuccess={
                        editingPet && editingPet.category === "OWNED"
                          ? handleEditSuccess
                          : () => {
                              showToast(
                                "success",
                                "Success",
                                "Pet added successfully",
                              );
                            }
                      }
                      editMode={editingPet && editingPet.category === "OWNED"}
                      petData={
                        editingPet && editingPet.category === "OWNED"
                          ? editingPet
                          : null
                      }
                    />
                  )}

                  {categoryTab === "lost-found" && (
                    <LostFoundPetForm
                      ownerEmail={profile?.email}
                      onSuccess={
                        editingPet &&
                        (editingPet.category === "LOST" ||
                          editingPet.category === "FOUND")
                          ? handleEditSuccess
                          : () => {
                              showToast(
                                "success",
                                "Success",
                                "Lost/Found pet reported successfully",
                              );
                            }
                      }
                      editMode={
                        editingPet &&
                        (editingPet.category === "LOST" ||
                          editingPet.category === "FOUND")
                      }
                      petData={
                        editingPet &&
                        (editingPet.category === "LOST" ||
                          editingPet.category === "FOUND")
                          ? editingPet
                          : null
                      }
                    />
                  )}

                  {categoryTab === "foster" && (
                    <FosterPetForm
                      ownerEmail={profile?.email}
                      ownerPhone={profile?.phone}
                      onSuccess={
                        editingPet && editingPet.category === "FOSTER"
                          ? handleEditSuccess
                          : () => {
                              showToast(
                                "success",
                                "Success",
                                "Foster pet added successfully",
                              );
                            }
                      }
                      editMode={editingPet && editingPet.category === "FOSTER"}
                      petData={
                        editingPet && editingPet.category === "FOSTER"
                          ? editingPet
                          : null
                      }
                    />
                  )}
                </div>
              )}

              {topTab === "view" && (
                <div>
                  {pets.length === 0 ? (
                    <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-12 text-center">
                      <p className="text-[#bfc0d1]">No pets added yet</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                      {pets.map((pet) => (
                        <PetCard
                          key={pet._id}
                          pet={pet}
                          onPetDeleted={handlePetDeleted}
                          onPetEdit={handlePetEdit}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <OwnerToast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default OwnerPets;
