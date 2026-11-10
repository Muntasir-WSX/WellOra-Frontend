"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {User,Mail,Lock,Phone,ArrowLeft,Eye,EyeOff,AlertCircle,Stethoscope,KeyRound,CheckCircle2,Award,Building2,DollarSign,FileText,} from "lucide-react";
import {applyDoctorApi,verifyDoctorEmailApi,IApplyDoctorPayload,} from "./applyDoctor";

export default function ApplyDoctorPage() {
  const router = useRouter();

  const [step, setStep] = useState<"register" | "otp">("register");

  const [formData, setFormData] = useState<IApplyDoctorPayload>({
    name: "",
    email: "",
    password: "",
    doctor: {
      contactNumber: "",
      address: "",
      registrationNumber: "",
      experience: 1,
      gender: "MALE",
      appointmentFee: 500,
      qualification: "",
      designation: "",
      currentWorkingPlace: "",
      about: "",
      departmentId: "",
    },
  });

  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (
      [
        "contactNumber",
        "address",
        "registrationNumber",
        "experience",
        "gender",
        "appointmentFee",
        "qualification",
        "designation",
        "currentWorkingPlace",
        "about",
        "departmentId",
      ].includes(name)
    ) {
      setFormData({
        ...formData,
        doctor: {
          ...formData.doctor,
          [name]:
            name === "experience" || name === "appointmentFee"
              ? Number(value)
              : value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await applyDoctorApi(formData);
      if (res.success) {
        setSuccessMessage(
          "Application submitted! Check your email for OTP verification."
        );
        setStep("otp");
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to submit application. Please check your data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await verifyDoctorEmailApi({
        email: formData.email,
        otp,
      });

      if (res.success) {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12">
      {/* Left Banner */}
      <div className="md:col-span-5 relative hidden md:block h-full">
        <img
          src="https://res.cloudinary.com/dnk0bvpym/image/upload/v1793982502/applyDoctor_bmjnk8.jpg"
          alt="WellOra Doctor Application Portal"
          className="w-full h-full object-cover object-center absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-10 left-8 right-8 text-white space-y-2 z-10">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md">
            Doctor Network
          </span>
          <h3 className="text-2xl lg:text-3xl font-extrabold leading-tight">
            Join WellOra Professional Panel
          </h3>
          <p className="text-xs text-slate-300">
            Provide consultations, offer e-prescriptions, and grow your medical
            practice digitally.
          </p>
        </div>
      </div>

      {/* Right Form Area */}
      <div className="md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center h-full overflow-y-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors mb-3 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <AnimatePresence mode="wait">
          {step === "register" ? (
            <motion.div
              key="doctor-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4 space-y-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Apply as Doctor
                </h2>
                <p className="text-xs text-slate-500">
                  Fill in your BMDC registration details to apply for doctor
                  onboard.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleDoctorSubmit} className="space-y-3">
                {/* Basic Info: Name, Email, Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Your Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-9 pr-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="doctor@hospital.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-9 pr-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Contact Number
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="contactNumber"
                        placeholder="01700000000"
                        value={formData.doctor.contactNumber}
                        onChange={handleChange}
                        className="w-full pl-9 pr-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & BMDC Reg Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      BMDC Registration No.
                    </label>
                    <div className="relative">
                      <FileText className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="registrationNumber"
                        required
                        placeholder="A-12345"
                        value={formData.doctor.registrationNumber}
                        onChange={handleChange}
                        className="w-full pl-9 pr-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Qualification & Designation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Qualifications
                    </label>
                    <div className="relative">
                      <Award className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="qualification"
                        required
                        placeholder="MBBS, FCPS (Cardiology)"
                        value={formData.doctor.qualification}
                        onChange={handleChange}
                        className="w-full pl-9 pr-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Designation
                    </label>
                    <div className="relative">
                      <Stethoscope className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="designation"
                        required
                        placeholder="Assistant Professor"
                        value={formData.doctor.designation}
                        onChange={handleChange}
                        className="w-full pl-9 pr-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Working Place, Fee & Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Working Hospital
                    </label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="currentWorkingPlace"
                        placeholder="Chittagong Medical"
                        value={formData.doctor.currentWorkingPlace}
                        onChange={handleChange}
                        className="w-full pl-9 pr-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Consultation Fee (BDT)
                    </label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        name="appointmentFee"
                        required
                        placeholder="800"
                        value={formData.doctor.appointmentFee}
                        onChange={handleChange}
                        className="w-full pl-9 pr-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      placeholder="5"
                      value={formData.doctor.experience}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 mt-3 hover:scale-[1.01] active:scale-95 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Stethoscope className="w-4 h-4" />
                      <span>Submit Doctor Application</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            /* OTP Step */
            <motion.div
              key="otp-doctor-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 space-y-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Verify Doctor Email
                </h2>
                <p className="text-xs text-slate-500">
                  Enter 6-digit OTP code sent to{" "}
                  <span className="font-bold text-emerald-600">
                    {formData.email}
                  </span>
                  .
                </p>
              </div>

              {successMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    6-Digit OTP Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-extrabold tracking-widest text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify Email & Apply</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("register")}
                  className="w-full text-center text-xs font-semibold text-slate-500 hover:underline"
                >
                  Edit Application Details
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 text-center text-xs text-slate-500 font-medium">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-emerald-600 font-bold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}