import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users, Shield } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#d1d5db] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#6c63ff]/10 via-transparent to-[#4f46e5]/10" />
      <div className="absolute top-20 left-20 w-[28rem] h-[28rem] bg-[#6c63ff]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-[28rem] h-[28rem] bg-[#4f46e5]/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl bg-[#181a23]/80 backdrop-blur-xl border border-[#6c63ff]/20 rounded-3xl shadow-[0_0_60px_rgba(108,99,255,0.2)] p-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Join{" "}
            <span className="bg-gradient-to-r from-[#6c63ff] to-[#8b5cf6] bg-clip-text text-transparent">
              WhisperTails
            </span>
          </h1>
          <p className="text-lg text-[#9ca3af]">
            Choose your path into a smarter pet ecosystem
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate("/signupOwner")}
            className="group relative overflow-hidden rounded-2xl border border-[#6c63ff]/20 bg-[#11131a] p-8 hover:border-[#6c63ff] transition-all duration-300 hover:shadow-[0_0_30px_rgba(108,99,255,0.25)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6c63ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

            <div className="relative z-10 flex flex-col items-start space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#6c63ff] to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-lg shadow-[#6c63ff]/30">
                <Users className="text-white" size={28} />
              </div>

              <h2 className="text-2xl font-semibold text-white">Pet Owner</h2>

              <p className="text-[#9ca3af] leading-relaxed">
                Discover pets, connect with experts, and manage your companion’s
                journey.
              </p>

              <div className="flex items-center text-[#6c63ff] font-medium">
                Continue
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/signupShelter")}
            className="group relative overflow-hidden rounded-2xl border border-[#6c63ff]/20 bg-[#11131a] p-8 hover:border-[#6c63ff] transition-all duration-300 hover:shadow-[0_0_30px_rgba(108,99,255,0.25)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

            <div className="relative z-10 flex flex-col items-start space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#8b5cf6] to-[#6c63ff] rounded-xl flex items-center justify-center shadow-lg shadow-[#8b5cf6]/30">
                <Shield className="text-white" size={28} />
              </div>

              <h2 className="text-2xl font-semibold text-white">
                Shelter / Trainer
              </h2>

              <p className="text-[#9ca3af] leading-relaxed">
                List pets, connect with adopters, and build trust in the
                community.
              </p>

              <div className="flex items-center text-[#8b5cf6] font-medium">
                Continue
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </div>
            </div>
          </button>
        </div>

        <div className="text-center mt-10 text-sm text-[#6b7280]">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#6c63ff] cursor-pointer hover:underline"
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
