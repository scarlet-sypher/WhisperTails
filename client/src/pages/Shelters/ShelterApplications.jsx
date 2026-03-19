import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  User,
  Loader2,
  Heart,
} from "lucide-react";
import NavbarShelter from "../../components/Shelters/NavbarShelter";
import NotificationBell from "../../Common/NotificationBell";
import FullPageLoader from "../../Common/FullPageLoader";
import FullPageError from "../../Common/FullPageError";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ShelterApplications = () => {
  const navigate = useNavigate();
  const [applicationsData, setApplicationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/shelter/applications");

      if (res.data.success) {
        setApplicationsData(res.data.data);
      }
    } catch (err) {
      console.error("Fetch applications error:", err);
      setError("Failed to load applications");
    } finally {
      setLoading(false);
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

  const getStatusBadge = (status) => {
    const badges = {
      submitted: {
        bg: "bg-blue-500/20",
        text: "text-blue-400",
        icon: Clock,
        label: "New",
      },
      review: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        icon: FileText,
        label: "Under Review",
      },
      approved: {
        bg: "bg-green-500/20",
        text: "text-green-400",
        icon: CheckCircle,
        label: "Approved",
      },
      "application-rejected": {
        bg: "bg-red-500/20",
        text: "text-red-400",
        icon: XCircle,
        label: "Rejected",
      },
      rejected: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        icon: XCircle,
        label: "Rejected",
      },
    };
    return badges[status] || badges.submitted;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredData = applicationsData
    .map((group) => {
      const nonRejectedApps = group.applications.filter(
        (app) => app.status !== "rejected",
      );

      return {
        ...group,
        applications: nonRejectedApps,
      };
    })
    .filter((group) => {
      if (group.applications.length === 0) return false;

      if (filterStatus === "all") return true;
      return group.applications.some((app) => app.status === filterStatus);
    });

  if (loading) {
    return (
      <FullPageLoader
        title="Loading Applications..."
        subtitle="Fetching adoption applications"
      />
    );
  }

  if (error)
    return <FullPageError message={error} onRetry={fetchApplications} />;

  return (
    <div className="min-h-screen bg-[#1e202c] flex">
      <NavbarShelter onLogout={handleLogout} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                Adoption Applications
              </h1>
              <p className="text-sm text-[#bfc0d1]">
                Manage and review adoption applications for your pets
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/applications-shelter/archived")}
                className="flex items-center gap-2 rounded-xl border-2 border-[#4a5568]/30 bg-[#31323e] px-4 py-2.5 text-sm font-semibold text-[#bfc0d1] transition-all hover:border-[#4a5568]/50 hover:bg-[#4a5568]/10 hover:text-white active:scale-95"
              >
                <FileText size={16} />
                View Archived
              </button>
              <NotificationBell />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {[
              { value: "all", label: "All Applications" },
              { value: "submitted", label: "New" },
              { value: "review", label: "Under Review" },
              { value: "approved", label: "Approved" },
              { value: "application-rejected", label: "Rejected" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  filterStatus === filter.value
                    ? "bg-[#4a5568] text-white shadow-lg"
                    : "bg-[#31323e] text-[#bfc0d1] hover:bg-[#3a3b47]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Applications Grouped by Pet */}
          {filteredData.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-[#4a5568]/20 bg-[#31323e]">
              <FileText size={48} className="mx-auto mb-4 text-[#4a5568]" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Applications Found
              </h3>
              <p className="text-sm text-[#bfc0d1]">
                {filterStatus === "all"
                  ? "You haven't received any applications yet"
                  : `No ${filterStatus} applications at this time`}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredData.map((group) => {
                const pet = group.pet;
                const displayImage = pet.coverImage || pet.images?.[0] || "";

                // Filter applications by status if needed
                const displayApplications =
                  filterStatus === "all"
                    ? group.applications
                    : group.applications.filter(
                        (app) => app.status === filterStatus,
                      );

                if (displayApplications.length === 0) return null;

                return (
                  <div
                    key={pet._id}
                    className="rounded-2xl border border-[#4a5568]/20 bg-[#31323e] p-6"
                  >
                    {/* Pet Header */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#4a5568]/20">
                      <div className="h-16 w-16 rounded-xl overflow-hidden bg-[#1e202c]">
                        {displayImage ? (
                          <img
                            src={displayImage}
                            alt={pet.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Heart size={24} className="text-[#4a5568]" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-white mb-1">
                          {pet.name}
                        </h2>
                        <p className="text-sm text-[#bfc0d1]">
                          {pet.species} • {pet.breed}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#bfc0d1]/60 mb-1">
                          Total Applications
                        </p>
                        <p className="text-2xl font-bold text-[#4a5568]">
                          {displayApplications.length}
                        </p>
                      </div>
                    </div>

                    {/* Applications List */}
                    <div className="space-y-3">
                      {displayApplications.map((app) => {
                        const statusBadge = getStatusBadge(app.status);
                        const StatusIcon = statusBadge.icon;

                        return (
                          <div
                            key={app._id}
                            className="group rounded-xl border border-[#4a5568]/10 bg-[#1e202c]/50 p-4 transition-all hover:border-[#4a5568]/30 hover:bg-[#1e202c]/80"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                {/* Status Badge */}
                                <div
                                  className={`rounded-lg p-2 ${statusBadge.bg}`}
                                >
                                  <StatusIcon
                                    size={18}
                                    className={statusBadge.text}
                                  />
                                </div>

                                {/* Applicant Info */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <User
                                      size={14}
                                      className="text-[#bfc0d1]/60"
                                    />
                                    <h3 className="font-semibold text-white">
                                      {app.applicationData.fullName}
                                    </h3>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-[#bfc0d1]/60">
                                    <div className="flex items-center gap-1">
                                      <Calendar size={12} />
                                      <span>
                                        Applied {formatDate(app.submittedAt)}
                                      </span>
                                    </div>
                                    <span
                                      className={`px-2 py-0.5 rounded-full ${statusBadge.bg} ${statusBadge.text} font-medium`}
                                    >
                                      {statusBadge.label}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Action Button */}
                              <button
                                onClick={() =>
                                  navigate(
                                    `/shelter/applications-shelter/${app._id}`,
                                  )
                                }
                                className="flex items-center gap-2 rounded-lg bg-[#4a5568]/20 px-4 py-2 text-sm font-semibold text-[#4a5568] transition-all hover:bg-[#4a5568]/30 hover:scale-105 active:scale-95"
                              >
                                <Eye size={16} />
                                View Details
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ShelterApplications;
