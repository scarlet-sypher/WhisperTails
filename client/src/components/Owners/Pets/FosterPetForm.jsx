import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { Upload, Loader, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const FosterPetForm = ({
  ownerEmail,
  ownerPhone,
  onSuccess,
  editMode = false,
  petData = null,
}) => {
  const [formData, setFormData] = useState({
    petName: "",
    species: "",
    breed: "",
    approximateAge: "",
    fosterReason: "",
    duration: "",
    careNotes: "",
    phone: ownerPhone || "",
  });
  const [photos, setPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Initialize form with existing data in edit mode
  useEffect(() => {
    if (editMode && petData) {
      setFormData({
        petName: petData.petName || "",
        species: petData.species || "",
        breed: petData.breed || "",
        approximateAge: petData.approximateAge || "",
        fosterReason: petData.fosterDetails?.reason || "",
        duration: petData.fosterDetails?.duration || "",
        careNotes: petData.fosterDetails?.careNotes || "",
        phone: petData.ownerPhone || ownerPhone || "",
      });
      setExistingPhotos(petData.photos || []);
    }
  }, [editMode, petData, ownerPhone]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos([...photos, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeExistingPhoto = (index) => {
    setExistingPhotos(existingPhotos.filter((_, i) => i !== index));
  };

  const removeNewPhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalPhotos = existingPhotos.length + photos.length;
    if (totalPhotos === 0) {
      alert("Please upload at least one photo");
      return;
    }

    setSubmitting(true);

    const formPayload = new FormData();
    formPayload.append("category", "FOSTER");

    const petDataToSend = {
      ...formData,
      existingPhotos: existingPhotos,
    };
    formPayload.append("petData", JSON.stringify(petDataToSend));

    photos.forEach((photo) => {
      formPayload.append("photos", photo);
    });

    try {
      let res;
      if (editMode && petData) {
        res = await axiosInstance.put(
          `/api/owner/pets/${petData._id}`,
          formPayload,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      } else {
        res = await axiosInstance.post("/api/owner/pets", formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        onSuccess?.(res.data.data);
        if (!editMode) {
          setFormData({
            species: "",
            breed: "",
            approximateAge: "",
            fosterReason: "",
            duration: "",
            careNotes: "",
            phone: ownerPhone || "",
          });
          setPhotos([]);
          setExistingPhotos([]);
          setPreviews([]);
        }
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert(
        err.response?.data?.message ||
          `Failed to ${editMode ? "update" : "add"} foster pet`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-lg font-bold text-white mb-4">
        {editMode
          ? "Edit Foster / Temporary Care Pet"
          : "Add Foster / Temporary Care Pet"}
      </h3>

      {editMode && existingPhotos.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
            Current Photos
          </label>
          <div className="flex gap-2 flex-wrap">
            {existingPhotos.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  alt={`Existing ${i + 1}`}
                  className="h-20 w-20 rounded-lg object-cover border border-[#60519b]/30"
                />
                <button
                  type="button"
                  onClick={() => removeExistingPhoto(i)}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
          {editMode ? "Add More Photos" : "Pet Photos *"}
        </label>
        <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#60519b]/40 bg-[#1e202c]/50 px-4 py-8 cursor-pointer hover:border-[#60519b] transition-colors">
          <Upload size={20} className="text-[#60519b]" />
          <span className="text-sm text-[#bfc0d1]">Upload Photos (Max 5)</span>
          <input
            type="file"
            accept="image/*"
            multiple
            max="5"
            onChange={handlePhotoChange}
            className="hidden"
            required={!editMode && existingPhotos.length === 0}
          />
        </label>
        {previews.length > 0 && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {previews.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="h-20 w-20 rounded-lg object-cover border border-[#60519b]/30"
                />
                <button
                  type="button"
                  onClick={() => removeNewPhoto(i)}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
            Pet Name *
          </label>
          <input
            type="text"
            name="petName"
            value={formData.petName || ""}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-[#1e202c]/50 border border-[#60519b]/30 px-4 py-2.5 text-white"
            placeholder="e.g., Buddy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
            Species *
          </label>
          <input
            type="text"
            name="species"
            value={formData.species}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-[#1e202c]/50 border border-[#60519b]/30 px-4 py-2.5 text-white placeholder-[#bfc0d1]/40 focus:border-[#60519b] focus:outline-none"
            placeholder="e.g., Dog, Cat"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
            Breed (Optional)
          </label>
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            className="w-full rounded-lg bg-[#1e202c]/50 border border-[#60519b]/30 px-4 py-2.5 text-white placeholder-[#bfc0d1]/40 focus:border-[#60519b] focus:outline-none"
            placeholder="e.g., Labrador"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
          Approximate Age *
        </label>
        <input
          type="text"
          name="approximateAge"
          value={formData.approximateAge}
          onChange={handleChange}
          required
          className="w-full rounded-lg bg-[#1e202c]/50 border border-[#60519b]/30 px-4 py-2.5 text-white placeholder-[#bfc0d1]/40 focus:border-[#60519b] focus:outline-none"
          placeholder="e.g., 2 years, 6 months"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
          Foster Reason *
        </label>
        <textarea
          name="fosterReason"
          value={formData.fosterReason}
          onChange={handleChange}
          required
          rows="2"
          className="w-full rounded-lg bg-[#1e202c]/50 border border-[#60519b]/30 px-4 py-2.5 text-white placeholder-[#bfc0d1]/40 focus:border-[#60519b] focus:outline-none resize-none"
          placeholder="Why are you fostering this pet?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
          Duration *
        </label>
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
          className="w-full rounded-lg bg-[#1e202c]/50 border border-[#60519b]/30 px-4 py-2.5 text-white placeholder-[#bfc0d1]/40 focus:border-[#60519b] focus:outline-none"
          placeholder="e.g., 3 months, Indefinite"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
          Care Notes
        </label>
        <textarea
          name="careNotes"
          value={formData.careNotes}
          onChange={handleChange}
          rows="3"
          className="w-full rounded-lg bg-[#1e202c]/50 border border-[#60519b]/30 px-4 py-2.5 text-white placeholder-[#bfc0d1]/40 focus:border-[#60519b] focus:outline-none resize-none"
          placeholder="Special care instructions, dietary needs, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
          Contact Phone *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full rounded-lg bg-[#1e202c]/50 border border-[#60519b]/30 px-4 py-2.5 text-white placeholder-[#bfc0d1]/40 focus:border-[#60519b] focus:outline-none"
          placeholder="+1 234 567 8900"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#60519b] to-[#7d6ab8] px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#60519b]/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader size={18} className="animate-spin" />
            {editMode ? "Updating..." : "Submitting..."}
          </>
        ) : editMode ? (
          "Update Foster Pet"
        ) : (
          "Add Foster Pet"
        )}
      </button>
    </form>
  );
};

export default FosterPetForm;
