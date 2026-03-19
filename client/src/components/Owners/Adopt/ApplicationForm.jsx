import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ApplicationForm = ({ onSubmit, initialData = {} }) => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    // Auto-filled (read-only)
    fullName: "",
    email: "",
    phone: "",
    address: "",

    // Living Situation
    residenceType: "",
    ownOrRent: "",
    petAllowed: "",

    // Household
    numberOfPeople: "",
    hasChildren: false,
    childrenAgeRange: "",
    hasOtherPets: false,
    otherPetsDetails: "",

    // Experience
    ownedPetsBefore: false,
    previousPetTypes: "",
    experienceLevel: "",

    // Time & Care
    hoursPerDay: "",
    primaryCaretaker: "",

    // Intent
    adoptionReason: "",
    adoptionPurpose: "",
    longTermCommitment: false,

    // Emergency
    relocatePlan: "",
    canAffordCare: false,

    // Optional
    preferredAdoptionDate: "",
    additionalNotes: "",

    ...initialData,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/auth/owner/profile");
      if (res.data.success) {
        const p = res.data.profile;
        setProfile(p);
        setFormData((prev) => ({
          ...prev,
          fullName: p.name || "",
          email: p.email || "",
          phone: p.phone || "",
          address: p.address || "",
        }));
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      let updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // If user owns the house, pets are always allowed
      if (name === "ownOrRent" && value === "own") {
        updated.petAllowed = "yes";
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.residenceType || !formData.ownOrRent) {
      alert("Please fill in all required fields");
      return;
    }

    if (!formData.experienceLevel) {
      alert("Please select your experience level");
      return;
    }

    if (!formData.adoptionReason.trim()) {
      alert("Please explain why you want to adopt this pet");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Adoption Application
        </h2>
        <p className="text-sm text-[#bfc0d1]">
          Please complete this form carefully. All fields marked with * are
          required.
        </p>
      </div>

      {/* Basic Info (Read-Only) */}
      <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          1. Applicant Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              readOnly
              className="w-full rounded-lg bg-[#1e202c]/50 border border-[#60519b]/20 px-4 py-2.5 text-white cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full rounded-lg bg-[#1e202c]/50 border border-[#60519b]/20 px-4 py-2.5 text-white cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              readOnly
              className="w-full rounded-lg bg-[#1e202c]/50 border border-[#60519b]/20 px-4 py-2.5 text-white cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              readOnly
              className="w-full rounded-lg bg-[#1e202c]/50 border border-[#60519b]/20 px-4 py-2.5 text-white cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Living Situation */}
      <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          2. Living Situation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
              Type of Residence *
            </label>
            <select
              name="residenceType"
              value={formData.residenceType}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-[#1e202c] border border-[#60519b]/20 px-4 py-2.5 text-white focus:outline-none focus:border-[#60519b]/50"
            >
              Continue7:29 PM<option value="">Select...</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="farm">Farm</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
              Do you own or rent? *
            </label>
            <select
              name="ownOrRent"
              value={formData.ownOrRent}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-[#1e202c] border border-[#60519b]/20 px-4 py-2.5 text-white focus:outline-none focus:border-[#60519b]/50"
            >
              <option value="">Select...</option>
              <option value="own">Own</option>
              <option value="rent">Rent</option>
            </select>
          </div>

          {formData.ownOrRent === "rent" && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
                Are pets allowed? *
              </label>
              <select
                name="petAllowed"
                value={formData.petAllowed}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-[#1e202c] border border-[#60519b]/20 px-4 py-2.5 text-white focus:outline-none focus:border-[#60519b]/50"
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="not_sure">Not Sure</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Household Details */}
      <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          3. Household Details
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
              Number of people in household *
            </label>
            <input
              type="number"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleChange}
              min="1"
              required
              className="w-full rounded-lg bg-[#1e202c] border border-[#60519b]/20 px-4 py-2.5 text-white focus:outline-none focus:border-[#60519b]/50"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="hasChildren"
              checked={formData.hasChildren}
              onChange={handleChange}
              id="hasChildren"
              className="h-5 w-5 rounded border-[#60519b]/20 bg-[#1e202c] text-[#60519b] focus:ring-[#60519b]/50"
            />
            <label htmlFor="hasChildren" className="text-sm text-white">
              We have children in the household
            </label>
          </div>

          {formData.hasChildren && (
            <div>
              <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
                Children's age range
              </label>
              <input
                type="text"
                name="childrenAgeRange"
                value={formData.childrenAgeRange}
                onChange={handleChange}
                placeholder="e.g., 5-10 years"
                className="w-full rounded-lg bg-[#1e202c] border border-[#60519b]/20 px-4 py-2.5 text-white placeholder:text-[#bfc0d1]/40 focus:outline-none focus:border-[#60519b]/50"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="hasOtherPets"
              checked={formData.hasOtherPets}
              onChange={handleChange}
              id="hasOtherPets"
              className="h-5 w-5 rounded border-[#60519b]/20 bg-[#1e202c] text-[#60519b] focus:ring-[#60519b]/50"
            />
            <label htmlFor="hasOtherPets" className="text-sm text-white">
              We have other pets
            </label>
          </div>

          {formData.hasOtherPets && (
            <div>
              <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
                Please describe (type, count)
              </label>
              <input
                type="text"
                name="otherPetsDetails"
                value={formData.otherPetsDetails}
                onChange={handleChange}
                placeholder="e.g., 2 cats, 1 dog"
                className="w-full rounded-lg bg-[#1e202c] border border-[#60519b]/20 px-4 py-2.5 text-white placeholder:text-[#bfc0d1]/40 focus:outline-none focus:border-[#60519b]/50"
              />
            </div>
          )}
        </div>
      </div>

      {/* Experience */}
      <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          4. Experience with Pets
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="ownedPetsBefore"
              checked={formData.ownedPetsBefore}
              onChange={handleChange}
              id="ownedPetsBefore"
              className="h-5 w-5 rounded border-[#60519b]/20 bg-[#1e202c] text-[#60519b] focus:ring-[#60519b]/50"
            />
            <label htmlFor="ownedPetsBefore" className="text-sm text-white">
              I have owned pets before
            </label>
          </div>

          {formData.ownedPetsBefore && (
            <div>
              <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
                What kind of pets?
              </label>
              <input
                type="text"
                name="previousPetTypes"
                value={formData.previousPetTypes}
                onChange={handleChange}
                placeholder="e.g., dogs, cats, birds"
                className="w-full rounded-lg bg-[#1e202c] border border-[#60519b]/20 px-4 py-2.5 text-white placeholder:text-[#bfc0d1]/40 focus:outline-none focus:border-[#60519b]/50"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
              Experience Level *
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-[#1e202c] border border-[#60519b]/20 px-4 py-2.5 text-white focus:outline-none focus:border-[#60519b]/50"
            >
              <option value="">Select...</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="experienced">Experienced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Time & Care */}
      <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          5. Time & Care Commitment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
              Hours per day available for pet care *
            </label>
            <select
              name="hoursPerDay"
              value={formData.hoursPerDay}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-[#1e202c] border border-[#60519b]/20 px-4 py-2.5 text-white focus:outline-none focus:border-[#60519b]/50"
            >
              <option value="">Select...</option>
              <option value="less_than_2">Less than 2 hours</option>
              <option value="2_to_4">2-4 hours</option>
              <option value="4_to_6">4-6 hours</option>
              <option value="more_than_6">More than 6 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
              Primary Caretaker *
            </label>
            <select
              name="primaryCaretaker"
              value={formData.primaryCaretaker}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-[#1e202c] border border-[#60519b]/20 px-4 py-2.5 text-white focus:outline-none focus:border-[#60519b]/50"
            >
              <option value="">Select...</option>
              <option value="self">Myself</option>
              <option value="family">Family Member</option>
              <option value="shared">Shared Responsibility</option>
            </select>
          </div>
        </div>
      </div>

      {/* Adoption Intent */}
      <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          6. Adoption Intent
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
              Why do you want to adopt this pet? *
            </label>
            <textarea
              name="adoptionReason"
              value={formData.adoptionReason}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Please explain your reasons for wanting to adopt..."
              className="w-full rounded-lg bg-[#1e202c] border border-[#60519b]/20 px-4 py-2.5 text-white placeholder:text-[#bfc0d1]/40 focus:outline-none focus:border-[#60519b]/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
              Primary Purpose *
            </label>
            <select
              name="adoptionPurpose"
              value={formData.adoptionPurpose}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-[#1e202c] border border-[#60519b]/20 px-4 py-2.5 text-white focus:outline-none focus:border-[#60519b]/50"
            >
              <option value="">Select...</option>
              <option value="companionship">Companionship</option>
              <option value="family">Family Pet</option>
              <option value="emotional_support">Emotional Support</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="longTermCommitment"
              checked={formData.longTermCommitment}
              onChange={handleChange}
              id="longTermCommitment"
              required
              className="h-5 w-5 rounded border-[#60519b]/20 bg-[#1e202c] text-[#60519b] focus:ring-[#60519b]/50"
            />
            <label htmlFor="longTermCommitment" className="text-sm text-white">
              I am committed to caring for this pet long-term *
            </label>
          </div>
        </div>
      </div>

      {/* Emergency & Responsibility */}
      <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          7. Emergency & Responsibility
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
              What will you do if you move or travel? *
            </label>
            <textarea
              name="relocatePlan"
              value={formData.relocatePlan}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Describe your plan..."
              className="w-full rounded-lg bg-[#1e202c] border border-[#60519b]/20 px-4 py-2.5 text-white placeholder:text-[#bfc0d1]/40 focus:outline-none focus:border-[#60519b]/50 resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="canAffordCare"
              checked={formData.canAffordCare}
              onChange={handleChange}
              id="canAffordCare"
              required
              className="h-5 w-5 rounded border-[#60519b]/20 bg-[#1e202c] text-[#60519b] focus:ring-[#60519b]/50"
            />
            <label htmlFor="canAffordCare" className="text-sm text-white">
              I can afford food, veterinary care, and other expenses *
            </label>
          </div>
        </div>
      </div>

      {/* Optional */}
      <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-6">
        <h3 className="text-lg font-bold text-white mb-4">8. Optional</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
              Preferred Adoption Date
            </label>
            <input
              type="date"
              name="preferredAdoptionDate"
              value={formData.preferredAdoptionDate}
              onChange={handleChange}
              className="w-full rounded-lg bg-[#1e202c] border border-[#60519b]/20 px-4 py-2.5 text-white focus:outline-none focus:border-[#60519b]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#bfc0d1] mb-2">
              Additional Notes
            </label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows="4"
              placeholder="Any additional information you'd like to share..."
              className="w-full rounded-lg bg-[#1e202c] border border-[#60519b]/20 px-4 py-2.5 text-white placeholder:text-[#bfc0d1]/40 focus:outline-none focus:border-[#60519b]/50 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-linear-to-r from-[#60519b] to-[#7d6ab8] px-8 py-3 text-base font-bold text-white shadow-lg shadow-[#60519b]/30 transition-all hover:shadow-xl hover:shadow-[#60519b]/40 active:scale-95"
        >
          Continue to Review
        </button>
      </div>
    </form>
  );
};
export default ApplicationForm;
