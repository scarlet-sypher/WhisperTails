import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  Heart,
  Upload,
  X,
  Loader2,
  PawPrint,
  Stethoscope,
  Activity,
  FileText,
  ArrowLeft,
} from "lucide-react";
import NavbarShelter from "../../components/Shelters/NavbarShelter";
import ShelterToast from "../../Common/ShelterToast";
import FullPageLoader from "../../Common/FullPageLoader";
import NotificationBell from "../../Common/NotificationBell";
import CostSummary from "../../components/Shelters/ShelterPet/CostSummary";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ShelterPetAdd = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editPetId = searchParams.get("edit");
  const isEditMode = !!editPetId;

  const [loading, setLoading] = useState(false);
  const [fetchingPet, setFetchingPet] = useState(false);
  const [toast, setToast] = useState(null);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [showCostSummary, setShowCostSummary] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "unknown",
    age: "",
    ageUnit: "years",
    size: "medium",
    color: "",
    vaccinated: false,
    spayedNeutered: false,
    houseTrained: false,
    specialNeeds: false,
    specialNeedsDescription: "",
    medicalNotes: "",
    temperament: [],
    adoptionFee: "",
    donation: "",
    description: "",
  });

  const [maintenanceCost, setMaintenanceCost] = useState(0);
  const [coverImageIndex, setCoverImageIndex] = useState(null);

  const temperamentOptions = [
    "Friendly",
    "Playful",
    "Calm",
    "Energetic",
    "Affectionate",
    "Independent",
    "Protective",
    "Social",
    "Shy",
    "Curious",
  ];

  const calculateMaintenanceCost = (data) => {
    let cost = 0;
    if (data.vaccinated) cost += 500;
    if (data.spayedNeutered) cost += 400;
    if (data.specialNeeds) cost += 100;
    if (data.houseTrained) cost += 1000;
    return cost;
  };

  const getTotalAdoptionCost = () => {
    const donationAmount = parseFloat(formData.donation) || 0;
    return maintenanceCost + donationAmount;
  };

  useEffect(() => {
    if (isEditMode) fetchPetForEdit();
  }, [editPetId]);

  const fetchPetForEdit = async () => {
    setFetchingPet(true);
    try {
      const response = await axiosInstance.get(
        `/api/shelter/pets/${editPetId}`,
      );

      if (response.data.success) {
        const pet = response.data.data;

        setFormData({
          name: pet.name || "",
          species: pet.species || "",
          breed: pet.breed || "",
          gender: pet.gender || "unknown",
          age: pet.age || "",
          ageUnit: pet.ageUnit || "years",
          size: pet.size || "medium",
          color: pet.color || "",
          vaccinated: pet.vaccinated || false,
          spayedNeutered: pet.spayedNeutered || false,
          houseTrained: pet.houseTrained || false,
          specialNeeds: pet.specialNeeds || false,
          specialNeedsDescription: pet.specialNeedsDescription || "",
          medicalNotes: pet.medicalNotes || "",
          temperament: pet.temperament || [],
          adoptionFee: pet.adoptionFee || "",
          donation: pet.donation || "",
          description: pet.description || "",
        });

        setMaintenanceCost(
          pet.maintenanceCost || calculateMaintenanceCost(pet),
        );
        setExistingImages(pet.images || []);

        if (pet.coverImage) {
          const idx = pet.images?.indexOf(pet.coverImage);
          if (idx >= 0) setCoverImageIndex(idx);
        }
      }
    } catch {
      setToast({
        type: "error",
        title: "Error",
        message: "Failed to load pet details",
      });
    } finally {
      setFetchingPet(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const updatedData = { ...prev, [name]: newValue };

      if (
        type === "checkbox" &&
        [
          "vaccinated",
          "spayedNeutered",
          "specialNeeds",
          "houseTrained",
        ].includes(name)
      ) {
        const newCost = calculateMaintenanceCost(updatedData);
        const diff = newCost - maintenanceCost;

        if (diff !== 0) {
          setToast({
            type: "success",
            title: "Maintenance Cost Updated",
            message: `₹${Math.abs(diff)} ${
              diff > 0 ? "added to" : "removed from"
            } maintenance cost`,
          });
        }
        setMaintenanceCost(newCost);
      }

      return updatedData;
    });
  };

  const handleTemperamentToggle = (trait) => {
    setFormData((prev) => ({
      ...prev,
      temperament: prev.temperament.includes(trait)
        ? prev.temperament.filter((t) => t !== trait)
        : [...prev.temperament, trait],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImagePreviews((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    setCoverImageIndex((prev) => {
      if (prev === index) return null;
      if (prev > index) return prev - 1;
      return prev;
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Pet name is required";
    }

    if (!formData.species.trim()) {
      return "Species is required";
    }

    if (formData.age !== "" && Number(formData.age) < 0) {
      return "Age cannot be negative";
    }

    if (!images.length && !existingImages.length) {
      return "Please upload at least one pet image";
    }

    if (images.length + existingImages.length > 5) {
      return "You can upload a maximum of 5 images";
    }

    if (formData.specialNeeds && !formData.specialNeedsDescription.trim()) {
      return "Please describe the special needs";
    }

    if (formData.donation && Number(formData.donation) < 0) {
      return "Donation amount cannot be negative";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setToast({
        type: "error",
        title: "Validation Error",
        message: validationError,
      });
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "temperament") {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      submitData.append("maintenanceCost", maintenanceCost);
      submitData.append("totalAdoptionCost", getTotalAdoptionCost());

      if (coverImageIndex !== null) {
        submitData.append("coverImageIndex", coverImageIndex);
      }

      images.forEach((img) => submitData.append("images", img));

      if (isEditMode) {
        submitData.append("existingImages", JSON.stringify(existingImages));
      }

      const url = isEditMode
        ? `/api/shelter/pets/${editPetId}`
        : `/api/shelter/pets`;

      const method = isEditMode ? "put" : "post";

      const response = await axiosInstance[method](url, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setToast({
          type: "success",
          title: isEditMode ? "Pet Updated" : "Pet Added",
          message: `${formData.name} saved successfully`,
        });

        setTimeout(() => {
          navigate(isEditMode ? "/my-pets" : "/shelter-dashboard");
        }, 1500);
      }
    } catch (err) {
      setToast({
        type: "error",
        title: "Error",
        message: err.response?.data?.message || "Failed to save pet",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingPet) {
    return (
      <FullPageLoader
        title="Loading Pet Details…"
        subtitle="Preparing form for editing"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#1e202c] flex">
      <NavbarShelter />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
          {isEditMode && (
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => navigate("/my-pets")}
                className="flex items-center gap-2 text-[#bfc0d1] hover:text-white"
              >
                <ArrowLeft size={20} />
                Back to My Pets
              </button>
              <NotificationBell />
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
              {isEditMode ? "Edit Pet Profile" : "Add New Pet"}
            </h1>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <div className="col-span-1 lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6 pb-28 lg:pb-0">
                <div className="rounded-2xl border border-[#4a5568]/20 bg-[#31323e] p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-[#4a5568] p-2">
                      <PawPrint size={20} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Basic Information
                    </h2>
                  </div>

                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#bfc0d1]">
                        Pet Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Max"
                        className="w-full rounded-xl border border-[#4a5568]/30 bg-[#1e202c] px-4 py-3 text-white placeholder-[#bfc0d1]/40 transition-all focus:border-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#4a5568]/20"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#bfc0d1]">
                        Species <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="species"
                        value={formData.species}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Dog, Cat"
                        className="w-full rounded-xl border border-[#4a5568]/30 bg-[#1e202c] px-4 py-3 text-white placeholder-[#bfc0d1]/40 transition-all focus:border-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#4a5568]/20"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#bfc0d1]">
                        Breed
                      </label>
                      <input
                        type="text"
                        name="breed"
                        value={formData.breed}
                        onChange={handleInputChange}
                        placeholder="e.g., Golden Retriever"
                        className="w-full rounded-xl border border-[#4a5568]/30 bg-[#1e202c] px-4 py-3 text-white placeholder-[#bfc0d1]/40 transition-all focus:border-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#4a5568]/20"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#bfc0d1]">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-[#4a5568]/30 bg-[#1e202c] px-4 py-3 text-white transition-all focus:border-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#4a5568]/20"
                      >
                        <option value="unknown">Unknown</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#bfc0d1]">
                        Age
                      </label>
                      <div className="flex gap-2 min-w-0">
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          min="0"
                          placeholder="0"
                          className="flex-1 min-w-0 rounded-xl border border-[#4a5568]/30 bg-[#1e202c] px-4 py-3 text-white placeholder-[#bfc0d1]/40 transition-all focus:border-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#4a5568]/20"
                        />
                        <select
                          name="ageUnit"
                          value={formData.ageUnit}
                          onChange={handleInputChange}
                          className="w-28 rounded-xl border border-[#4a5568]/30 bg-[#1e202c] px-4 py-3 text-white transition-all focus:border-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#4a5568]/20"
                        >
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#bfc0d1]">
                        Size
                      </label>
                      <select
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-[#4a5568]/30 bg-[#1e202c] px-4 py-3 text-white transition-all focus:border-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#4a5568]/20"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-[#bfc0d1]">
                        Color / Markings
                      </label>
                      <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        placeholder="e.g., Brown with white chest"
                        className="w-full rounded-xl border border-[#4a5568]/30 bg-[#1e202c] px-4 py-3 text-white placeholder-[#bfc0d1]/40 transition-all focus:border-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#4a5568]/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#4a5568]/20 bg-[#31323e] p-6">
                  {/* Header */}
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-[#5a6678] p-2">
                      <Stethoscope size={20} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Health Information
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Checkbox grid */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Vaccinated */}
                      <label className="flex items-start gap-3 rounded-xl border border-[#4a5568]/20 bg-[#1e202c] p-4">
                        <input
                          type="checkbox"
                          name="vaccinated"
                          checked={formData.vaccinated}
                          onChange={handleInputChange}
                          className="h-5 w-5 shrink-0 rounded border-[#4a5568] text-[#4a5568]"
                        />
                        <span className="text-sm text-[#bfc0d1]">
                          Vaccinated
                        </span>
                      </label>

                      {/* Spayed / Neutered */}
                      <label className="flex items-start gap-3 rounded-xl border border-[#4a5568]/20 bg-[#1e202c] p-4">
                        <input
                          type="checkbox"
                          name="spayedNeutered"
                          checked={formData.spayedNeutered}
                          onChange={handleInputChange}
                          className="h-5 w-5 shrink-0 rounded border-[#4a5568] text-[#4a5568]"
                        />
                        <span className="text-sm text-[#bfc0d1]">
                          Spayed / Neutered
                        </span>
                      </label>

                      {/* Special Needs */}
                      <label className="flex items-start gap-3 rounded-xl border border-[#4a5568]/20 bg-[#1e202c] p-4">
                        <input
                          type="checkbox"
                          name="specialNeeds"
                          checked={formData.specialNeeds}
                          onChange={handleInputChange}
                          className="h-5 w-5 shrink-0 rounded border-[#4a5568] text-[#4a5568]"
                        />
                        <span className="text-sm text-[#bfc0d1]">
                          Special Needs
                        </span>
                      </label>

                      {/* House Trained */}
                      <label className="flex items-start gap-3 rounded-xl border border-[#4a5568]/20 bg-[#1e202c] p-4">
                        <input
                          type="checkbox"
                          name="houseTrained"
                          checked={formData.houseTrained}
                          onChange={handleInputChange}
                          className="h-5 w-5 shrink-0 rounded border-[#4a5568] text-[#4a5568]"
                        />
                        <span className="text-sm text-[#bfc0d1]">
                          House Trained
                        </span>
                      </label>
                    </div>

                    {/* Special Needs Description */}
                    {formData.specialNeeds && (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#bfc0d1]">
                          Special Needs Description
                        </label>
                        <textarea
                          name="specialNeedsDescription"
                          value={formData.specialNeedsDescription}
                          onChange={handleInputChange}
                          rows="3"
                          placeholder="Describe the pet’s special needs, medical care, or assistance required..."
                          className="w-full rounded-xl border border-[#4a5568]/30 bg-[#1e202c] px-4 py-3 text-white placeholder-[#bfc0d1]/40 focus:outline-none focus:ring-2 focus:ring-[#4a5568]/20"
                        />
                      </div>
                    )}

                    {/* Medical Notes */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#bfc0d1]">
                        Medical Notes
                      </label>
                      <textarea
                        name="medicalNotes"
                        value={formData.medicalNotes}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full rounded-xl border border-[#4a5568]/30 bg-[#1e202c] px-4 py-3 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#4a5568]/20 bg-[#31323e] p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-[#6a7788] p-2">
                      <Activity size={20} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Behavior & Temperament
                    </h2>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-[#bfc0d1]">
                      Select traits that describe this pet
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {temperamentOptions.map((trait) => (
                        <button
                          key={trait}
                          type="button"
                          onClick={() => handleTemperamentToggle(trait)}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                            formData.temperament.includes(trait)
                              ? "bg-[#4a5568] text-white shadow-lg"
                              : "bg-[#1e202c] text-[#bfc0d1] hover:bg-[#4a5568]/30"
                          }`}
                        >
                          {trait}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#4a5568]/20 bg-[#31323e] p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-[#7a8898] p-2">
                      <Upload size={20} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Pet Photos</h2>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-[#bfc0d1]">
                      Upload up to 5 images
                    </label>

                    {imagePreviews.length > 0 && (
                      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                        {imagePreviews.map((preview, index) => (
                          <div
                            key={index}
                            className={`group relative rounded-xl border-2 ${
                              coverImageIndex === index
                                ? "border-[#4a5568]"
                                : "border-transparent"
                            }`}
                          >
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="h-32 w-full rounded-xl border border-[#4a5568]/20 object-cover"
                            />

                            <button
                              type="button"
                              onClick={() => setCoverImageIndex(index)}
                              className={`absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold transition ${
                                coverImageIndex === index
                                  ? "bg-[#4a5568] text-white"
                                  : "bg-black/60 text-white hover:bg-black/80"
                              }`}
                            >
                              {coverImageIndex === index
                                ? "Cover Photo"
                                : "Set as Cover"}
                            </button>

                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {images.length < 5 && (
                      <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#4a5568]/30 bg-[#1e202c] p-8 transition-all hover:border-[#4a5568] hover:bg-[#1e202c]/80">
                        <Upload
                          size={40}
                          className="mb-3 text-[#4a5568] transition-transform group-hover:scale-110"
                        />
                        <p className="text-sm font-medium text-[#bfc0d1]">
                          Click to upload images
                        </p>
                        <p className="mt-1 text-xs text-[#bfc0d1]/60">
                          PNG, JPG, GIF up to 2MB
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#4a5568]/20 bg-[#31323e] p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-[#4a5568] p-2">
                      <FileText size={20} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Additional Details
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#bfc0d1]">
                        Donation Fee ($)
                      </label>
                      <input
                        type="number"
                        name="donation"
                        value={formData.donation}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            donation: e.target.value,
                          }))
                        }
                        min="0"
                        placeholder="0"
                        className="w-full rounded-xl border border-[#4a5568]/30 bg-[#1e202c] px-4 py-3 text-white placeholder-[#bfc0d1]/40 focus:outline-none focus:ring-2 focus:ring-[#4a5568]/20"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#bfc0d1]">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="5"
                        placeholder="Tell potential adopters about this pet's personality, habits, and what makes them special..."
                        className="w-full rounded-xl border border-[#4a5568]/30 bg-[#1e202c] px-4 py-3 text-white placeholder-[#bfc0d1]/40 transition-all focus:border-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#4a5568]/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/shelter-dashboard")}
                    className="rounded-xl border border-[#4a5568]/30 bg-transparent px-8 py-3 font-semibold text-[#bfc0d1] transition-all hover:bg-[#4a5568]/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative overflow-hidden rounded-xl bg-[#4a5568] px-8 py-3 font-semibold text-white transition-all hover:bg-[#5a6678] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={20} className="animate-spin" />
                        {isEditMode ? "Updating Pet..." : "Adding Pet..."}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Heart size={20} />
                        {isEditMode ? "Update Pet" : "Add Pet"}
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="hidden lg:block lg:col-span-1">
              <div className="fixed top-1/2 right-8 -translate-y-1/2 w-[22rem]">
                <CostSummary
                  formData={formData}
                  maintenanceCost={maintenanceCost}
                  getTotalAdoptionCost={getTotalAdoptionCost}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <ShelterToast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <button
        onClick={() => setShowCostSummary((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#4a5568] px-5 py-3 text-white shadow-lg transition hover:bg-[#5a6678] lg:hidden"
      >
        ₹ Cost
      </button>

      <div
        className={`fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 lg:hidden ${
          showCostSummary ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="rounded-t-3xl bg-[#31323e] border-t border-[#4a5568]/30 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Cost Summary</h3>
            <button
              onClick={() => setShowCostSummary(false)}
              className="text-[#bfc0d1] hover:text-white"
            >
              ✕
            </button>
          </div>

          <CostSummary
            formData={formData}
            maintenanceCost={maintenanceCost}
            getTotalAdoptionCost={getTotalAdoptionCost}
          />
        </div>
      </div>
    </div>
  );
};

export default ShelterPetAdd;
