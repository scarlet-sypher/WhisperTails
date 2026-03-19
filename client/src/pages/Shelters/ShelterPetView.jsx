import React, { useEffect, useState } from "react";
import { Heart, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import NavbarShelter from "../../components/Shelters/NavbarShelter";
import FullPageLoader from "../../Common/FullPageLoader";
import FullPageError from "../../Common/FullPageError";
import NotificationBell from "../../Common/NotificationBell";
import PetDetailsCard from "../../components/Shelters/ShelterPet/PetDetailsCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ShelterPetView = () => {
  const navigate = useNavigate();

  const [petList, setPetList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPets: 0,
    limit: 6,
  });

  useEffect(() => {
    loadPets(1);
  }, []);

  const loadPets = async (page) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axiosInstance.get("/api/shelter/pets", {
        params: { page, limit: pageInfo.limit },
      });

      if (response.data.success) {
        setPetList(response.data.data.pets);
        setPageInfo(response.data.data.pagination);
      }
    } catch (err) {
      console.error("Fetch pets error:", err);
      setErrorMessage("Failed to load pets");
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      await axiosInstance.post("/api/auth/logout", {});
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const changePage = (page) => {
    if (page >= 1 && page <= pageInfo.totalPages) {
      loadPets(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToAddPet = () => {
    navigate("/add-pet");
  };

  if (isLoading) {
    return (
      <FullPageLoader
        title="Loading Your Pets…"
        subtitle="Fetching pet profiles"
      />
    );
  }

  if (errorMessage) {
    return <FullPageError message={errorMessage} onRetry={() => loadPets(1)} />;
  }

  return (
    <div className="flex min-h-screen bg-[#1e202c]">
      <NavbarShelter onLogout={logoutUser} />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-white">My Pets</h1>
              <p className="text-[#bfc0d1]/80">
                Manage your shelter&apos;s pet profiles
              </p>
            </div>

            <div className="flex items-center gap-4">
              <NotificationBell />
              <button
                onClick={goToAddPet}
                className="flex items-center gap-2 rounded-xl bg-[#4a5568] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#5a6678] active:scale-95"
              >
                <Plus size={18} />
                Add Pet
              </button>
            </div>
          </div>

          <div className="mb-8 rounded-xl border border-[#4a5568]/20 bg-[#31323e] p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-[#4a5568] p-3">
                  <Heart size={22} className="text-white" />
                </div>

                <div>
                  <p className="text-lg font-semibold text-white">
                    Keep profiles complete & up to date
                  </p>
                  <p className="mt-1 text-sm text-[#bfc0d1]/70 max-w-md">
                    Pets with clear photos, health details, and accurate
                    descriptions receive significantly more adoption requests.
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-flex rounded-full bg-[#4a5568]/20 px-3 py-1 text-xs font-medium text-[#bfc0d1]">
                Adoption Tips
              </span>
            </div>
          </div>

          {petList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-4 rounded-full bg-[#4a5568]/20 p-6">
                <Heart size={48} className="text-[#4a5568]/40" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                No pets yet
              </h3>
              <p className="mb-6 text-[#bfc0d1]/70">
                Start by adding your first pet profile
              </p>
              <button
                onClick={goToAddPet}
                className="flex items-center gap-2 rounded-xl bg-[#4a5568] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#5a6678] active:scale-95"
              >
                <Plus size={18} />
                Add Your First Pet
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {petList.map((pet) => (
                  <PetDetailsCard key={pet._id} pet={pet} />
                ))}
              </div>

              {pageInfo.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => changePage(pageInfo.currentPage - 1)}
                    disabled={pageInfo.currentPage === 1}
                    className="flex items-center gap-2 rounded-xl border border-[#4a5568]/20 bg-[#31323e] px-4 py-2 text-sm font-semibold text-white transition-all hover:border-[#4a5568]/50 hover:bg-[#31323e]/80 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from(
                      { length: pageInfo.totalPages },
                      (_, index) => index + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => changePage(page)}
                        className={`h-10 w-10 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
                          page === pageInfo.currentPage
                            ? "bg-[#4a5568] text-white"
                            : "border border-[#4a5568]/20 bg-[#31323e] text-[#bfc0d1] hover:border-[#4a5568]/50 hover:bg-[#31323e]/80"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => changePage(pageInfo.currentPage + 1)}
                    disabled={pageInfo.currentPage === pageInfo.totalPages}
                    className="flex items-center gap-2 rounded-xl border border-[#4a5568]/20 bg-[#31323e] px-4 py-2 text-sm font-semibold text-white transition-all hover:border-[#4a5568]/50 hover:bg-[#31323e]/80 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShelterPetView;
