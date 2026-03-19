import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useNotificationSocket } from "../../../hooks/useSocket";
import Navbar from "../../components/Owners/NavbarOwner";
import NotificationBell from "../../Common/NotificationBell";
import OwnerToast from "../../Common/OwnerToast";
import Stepper from "../../components/Owners/Adopt/Stepper";
import SpeciesStep from "../../components/Owners/Adopt/SpeciesStep";
import BreedStep from "../../components/Owners/Adopt/BreedStep";
import PetSelector from "../../components/Owners/Adopt/PetSelector";
import PetDetailDrawer from "../../components/Owners/Adopt/PetDetailDrawer";
import ApplicationForm from "../../components/Owners/Adopt/ApplicationForm";
import ReviewSubmit from "../../components/Owners/Adopt/ReviewSubmit";

const STEPS = [
  { id: "species", label: "Species" },
  { id: "breed", label: "Breed" },
  { id: "pet", label: "Pet" },
  { id: "application", label: "Application" },
  { id: "review", label: "Review" },
];

const OwnerAdoptPet = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [toast, setToast] = useState(null);

  const { onNewNotification } = useNotificationSocket();

  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const [selectedPetId, setSelectedPetId] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const [applicationData, setApplicationData] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPetId, setDrawerPetId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onNewNotification((notification) => {
      console.log("Received notification:", notification);

      if (
        notification.type === "general" &&
        notification.title.includes("Application")
      ) {
        showToast("info", notification.title, notification.message);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [onNewNotification]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout", {});
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSpeciesSelect = (species) => {
    setSelectedSpecies(species);
    setSelectedBreed("");
    setSelectedPetId("");
    setSelectedPet(null);
    setCurrentStep(1);
    showToast("success", "Species Selected", `You selected ${species}`);
  };

  const handleBreedSelect = (breed) => {
    setSelectedBreed(breed);
    setSelectedPetId("");
    setSelectedPet(null);
    setCurrentStep(2);
    showToast(
      "success",
      "Breed Selected",
      breed === "all" ? "Showing all breeds" : `You selected ${breed}`,
    );
  };

  // Step 3: Pet Selection
  const handlePetSelect = async (petId) => {
    try {
      const res = await axiosInstance.get(`/api/owner/adoption/pets/${petId}`);

      if (res.data.success) {
        const petData = res.data.data;

        if (petData.applicationStatus.disabled) {
          showToast(
            "error",
            "Cannot Select Pet",
            petData.applicationStatus.text,
          );
          return;
        }

        setSelectedPetId(petId);
        setSelectedPet(petData);
        setCurrentStep(3);
        showToast("success", "Pet Selected", `You selected ${petData.name}!`);
      }
    } catch (err) {
      console.error("Fetch pet error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to select pet";
      showToast("error", "Error", errorMessage);
    }
  };

  const handleViewDetails = (petId) => {
    setDrawerPetId(petId);
    setDrawerOpen(true);
  };

  const handleApplicationSubmit = (formData) => {
    setApplicationData(formData);
    setCurrentStep(4);
    showToast("success", "Application Complete", "Please review and submit");
  };

  const handleFinalSubmit = async (agreedToTerms) => {
    if (submitting) return;

    try {
      setSubmitting(true);

      const payload = {
        petId: selectedPetId,
        applicationData,
        agreedToTerms,
      };

      const res = await axiosInstance.post(
        "/api/owner/adoption/apply",
        payload,
      );

      if (res.data.success) {
        showToast(
          "success",
          "Application Submitted!",
          "The shelter will review your application. You'll receive notifications about updates.",
        );

        setTimeout(() => {
          navigate("/owner-dashboard");
        }, 2500);
      }
    } catch (err) {
      console.error("Submit application error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to submit application";
      showToast("error", "Submission Failed", errorMessage);
      setSubmitting(false);
    }
  };

  const handleWithdraw = async (petId) => {
    try {
      const applicationsRes = await axiosInstance.get(
        "/api/owner/adoption/my-applications",
      );

      const application = applicationsRes.data.data.find(
        (app) =>
          app.petId._id === petId &&
          (app.status === "submitted" || app.status === "review"),
      );

      if (!application) {
        showToast("error", "Error", "No active application found for this pet");
        return;
      }

      const res = await axiosInstance.post(
        `/api/owner/adoption/withdraw/${application._id}`,
        {},
      );

      if (res.data.success) {
        showToast(
          "success",
          "Application Withdrawn",
          "Your application has been withdrawn successfully",
        );

        setSelectedPetId("");
        setSelectedPet(null);

        const currentBreed = selectedBreed;
        setSelectedBreed("");
        setTimeout(() => {
          setSelectedBreed(currentBreed);
        }, 100);
      }
    } catch (err) {
      console.error("Withdraw error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to withdraw application";
      showToast("error", "Error", errorMessage);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);

      if (currentStep === 1) {
        setSelectedSpecies("");
        setSelectedBreed("");
        setSelectedPetId("");
        setSelectedPet(null);
      } else if (currentStep === 2) {
        setSelectedBreed("");
        setSelectedPetId("");
        setSelectedPet(null);
      } else if (currentStep === 3) {
        setSelectedPetId("");
        setSelectedPet(null);
      } else if (currentStep === 4) {
        setApplicationData(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1e202c] flex">
      <Navbar onLogout={handleLogout} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                Adopt a Pet
              </h1>
              <p className="text-sm text-[#bfc0d1]">
                Find your perfect companion through our adoption process
              </p>
            </div>
            <NotificationBell />
          </div>

          <Stepper steps={STEPS} currentStep={currentStep} />

          <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-6 md:p-8">
            {currentStep === 0 && (
              <SpeciesStep
                onSelect={handleSpeciesSelect}
                selectedSpecies={selectedSpecies}
              />
            )}

            {currentStep === 1 && (
              <BreedStep
                species={selectedSpecies}
                onSelect={handleBreedSelect}
                selectedBreed={selectedBreed}
              />
            )}

            {currentStep === 2 && (
              <PetSelector
                species={selectedSpecies}
                breed={selectedBreed}
                onSelectPet={handlePetSelect}
                onViewDetails={handleViewDetails}
                selectedPetId={selectedPetId}
                onWithdraw={handleWithdraw}
              />
            )}

            {currentStep === 3 && (
              <ApplicationForm
                onSubmit={handleApplicationSubmit}
                initialData={applicationData}
              />
            )}

            {currentStep === 4 && selectedPet && (
              <ReviewSubmit
                pet={selectedPet}
                applicationData={applicationData}
                onSubmit={handleFinalSubmit}
                onBack={() => setCurrentStep(3)}
                submitting={submitting}
              />
            )}
          </div>

          {currentStep > 0 && currentStep < 4 && (
            <div className="mt-6 flex justify-start">
              <button
                onClick={handleBack}
                className="rounded-xl border-2 border-[#60519b]/30 bg-transparent px-6 py-2.5 text-sm font-semibold text-[#60519b] transition-all hover:bg-[#60519b]/10 active:scale-95"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Pet Detail Drawer */}
      <PetDetailDrawer
        petId={drawerPetId}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelectPet={handlePetSelect}
        onWithdraw={handleWithdraw}
      />

      {/* Toast Notification */}
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

export default OwnerAdoptPet;
