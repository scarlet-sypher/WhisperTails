import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { MapPin, Upload, Loader, X } from "lucide-react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const LostFoundPetForm = ({
  ownerEmail,
  onSuccess,
  editMode = false,
  petData = null,
}) => {
  const [formData, setFormData] = useState({
    category: "LOST",
    petName: "",
    species: "",
    latitude: null,
    longitude: null,
    locationAddress: "",
  });
  const [photo, setPhoto] = useState(null);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [preview, setPreview] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Initialize form with existing data in edit mode
  useEffect(() => {
    if (editMode && petData) {
      setFormData({
        category: petData.category || "LOST",
        petName: petData.petName || "",
        species: petData.species || "",
        latitude: petData.location?.latitude || null,
        longitude: petData.location?.longitude || null,
        locationAddress: petData.location?.address || "",
      });
      setExistingPhotos(petData.photos || []);
    }
  }, [editMode, petData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeExistingPhoto = (index) => {
    setExistingPhotos(existingPhotos.filter((_, i) => i !== index));
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          );
          const address = res.data.display_name || "Unknown location";
          setFormData((prev) => ({ ...prev, locationAddress: address }));
        } catch (err) {
          console.error("Geocode error:", err);
          setFormData((prev) => ({
            ...prev,
            locationAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
          }));
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location");
        setLoadingLocation(false);
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalPhotos = existingPhotos.length + (photo ? 1 : 0);
    if (totalPhotos === 0) {
      alert("Please upload a photo");
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      alert("Please capture location");
      return;
    }

    setSubmitting(true);

    const formPayload = new FormData();
    formPayload.append("category", formData.category);

    const petDataToSend = {
      ...formData,
      existingPhotos: existingPhotos,
    };
    formPayload.append("petData", JSON.stringify(petDataToSend));

    if (photo) {
      formPayload.append("photos", photo);
    }

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
            category: "LOST",
            petName: "",
            species: "",
            latitude: null,
            longitude: null,
            locationAddress: "",
          });
          setPhoto(null);
          setExistingPhotos([]);
          setPreview("");
        }
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert(
        err.response?.data?.message ||
          `Failed to ${editMode ? "update" : "report"} pet`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-lg font-bold text-white mb-4">
        {editMode ? "Edit Lost/Found Pet" : "Report Lost/Found Pet"}
      </h3>

      <div>
        <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
          Category *
        </label>
        <div className="flex gap-3">
          {["LOST", "FOUND"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFormData({ ...formData, category: cat })}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                formData.category === cat
                  ? "bg-[#60519b] text-white"
                  : "bg-[#1e202c]/50 text-[#bfc0d1] border border-[#60519b]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {editMode && existingPhotos.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
            Current Photo
          </label>
          <div className="flex gap-2 flex-wrap">
            {existingPhotos.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  alt={`Existing ${i + 1}`}
                  className="h-32 w-32 rounded-lg object-cover border border-[#60519b]/30"
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
          {editMode ? "Change Photo" : "Pet Photo *"}
        </label>
        <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#60519b]/40 bg-[#1e202c]/50 px-4 py-8 cursor-pointer hover:border-[#60519b] transition-colors">
          <Upload size={20} className="text-[#60519b]" />
          <span className="text-sm text-[#bfc0d1]">Upload Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
            required={!editMode && existingPhotos.length === 0}
          />
        </label>
        {preview && (
          <div className="mt-3">
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 rounded-lg object-cover border border-[#60519b]/30"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
          Pet Name (Optional)
        </label>
        <input
          type="text"
          name="petName"
          value={formData.petName}
          onChange={handleChange}
          className="w-full rounded-lg bg-[#1e202c]/50 border border-[#60519b]/30 px-4 py-2.5 text-white placeholder-[#bfc0d1]/40 focus:border-[#60519b] focus:outline-none"
          placeholder="If known"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
          Species (Optional)
        </label>
        <input
          type="text"
          name="species"
          value={formData.species}
          onChange={handleChange}
          className="w-full rounded-lg bg-[#1e202c]/50 border border-[#60519b]/30 px-4 py-2.5 text-white placeholder-[#bfc0d1]/40 focus:border-[#60519b] focus:outline-none"
          placeholder="e.g., Dog, Cat"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
          Location *
        </label>
        <button
          type="button"
          onClick={getLocation}
          disabled={loadingLocation}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#60519b]/20 border border-[#60519b]/40 px-4 py-2.5 text-sm font-medium text-[#60519b] hover:bg-[#60519b]/30 transition-all disabled:opacity-50"
        >
          {loadingLocation ? (
            <>
              <Loader size={18} className="animate-spin" />
              Fetching location...
            </>
          ) : (
            <>
              <MapPin size={18} />
              {editMode && formData.locationAddress
                ? "Update Location"
                : "Capture Live Location"}
            </>
          )}
        </button>
        {formData.locationAddress && (
          <div className="mt-2 p-3 rounded-lg bg-[#1e202c]/50 border border-[#60519b]/30">
            <p className="text-xs text-[#bfc0d1]">{formData.locationAddress}</p>
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
          Edit Location Text (Optional)
        </label>
        <input
          type="text"
          name="locationAddress"
          value={formData.locationAddress}
          onChange={handleChange}
          className="w-full rounded-lg bg-[#1e202c]/50 border border-[#60519b]/30 px-4 py-2.5 text-white placeholder-[#bfc0d1]/40 focus:border-[#60519b] focus:outline-none"
          placeholder="Modify if needed"
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
          "Update Pet"
        ) : (
          "Report Pet"
        )}
      </button>
    </form>
  );
};
export default LostFoundPetForm;
