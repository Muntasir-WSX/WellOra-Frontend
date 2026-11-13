"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  FileCheck,
  Award,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Sparkles,
  UploadCloud,
  X,
  File,
  Files,
} from "lucide-react";

import {
  applyDoctorApi,
  verifyDoctorEmailApi,
  IApplyDoctorFormValues,
} from "./applyDoctor";

export default function ApplyDoctorPage() {
  const router = useRouter();
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const additionalInputRef = useRef<HTMLInputElement | null>(null);

  // Multi-step State (1: Application Form, 2: OTP Verification)
  const [step, setStep] = useState<1 | 2>(1);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form Data State
  const [formData, setFormData] = useState<IApplyDoctorFormValues>({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
    licenseNumber: "",
    experienceYears: undefined,
    specialization: "",
    consultationFee: 1000,
    qualifications: "",
    bio: "",
  });

  // File States
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);

  // Step 2 OTP State
  const [otp, setOtp] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Required Resume Selection
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setErrorMessage("");
    }
  };

  // Handle Optional Additional Files Selection
  const handleAdditionalFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setAdditionalFiles((prev) => [...prev, ...files]);
    }
  };

  const removeAdditionalFile = (index: number) => {
    setAdditionalFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Step 1: Doctor Application Submit
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!resumeFile) {
      setErrorMessage("Resume file is required for doctor application.");
      return;
    }

    setLoading(true);

    try {
      const res = await applyDoctorApi(formData, {
        resume: resumeFile,
        additionalFiles,
      });

      if (res?.success || res?.statusCode === 200 || res?.statusCode === 201) {
        setSuccessMessage(
          "Application submitted successfully! Please check your email for the verification OTP."
        );
        setStep(2);
      } else {
        setErrorMessage(
          res?.message ||
            "Failed to submit doctor application. Please check your inputs."
        );
      }
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to process request. Please check your network and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: OTP Email Verification Submit
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await verifyDoctorEmailApi({
        email: formData.email,
        otp: otp.trim(),
      });

      if (res?.success || res?.statusCode === 200) {
        setSuccessMessage("Email verified successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setErrorMessage(res?.message || "Invalid or expired OTP code.");
      }
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 select-none pt-4 sm:pt-6 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl mb-6 border border-slate-200/80 min-h-[220px] sm:min-h-[260px] flex items-end">
          <img
            src="https://res.cloudinary.com/dnk0bvpym/image/upload/v1793982502/applyDoctor_bmjnk8.jpg"
            alt="WellOra Doctor Application Banner"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Gradient Overlay for Text Visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/20" />

          {/* Banner Content */}
          <div className="relative z-10 p-6 sm:p-8 w-full text-white space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold backdrop-blur-md">
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <span>BMDC Registered Doctors Only</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Join <span className="text-emerald-400">WellOra</span> as a Medical Specialist
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Expand your practice digitally, manage 20-minute patient slots with precision, and offer automated e-prescriptions seamlessly.
            </p>
          </div>
        </div>

        {/* Global Error & Success Alerts */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-600 text-xs sm:text-sm font-semibold"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-700 text-xs sm:text-sm font-semibold"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP 1: APPLICATION FORM */}
        {step === 1 && (
          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleApplySubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl space-y-8"
          >
            {/* 1. Account Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                <span>Account Credentials</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Enter Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Enter Your Mail"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-11 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="contactNumber"
                      placeholder="Enter Your Number"
                      value={formData.contactNumber || ""}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Professional Medical Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <span>Professional Qualifications</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* License Number (BMDC Reg Number) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    License / BMDC Reg. Number *
                  </label>
                  <div className="relative">
                    <FileCheck className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="licenseNumber"
                      required
                      placeholder="BMDC-A-12345"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Specialization *
                  </label>
                  <div className="relative">
                    <Stethoscope className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="specialization"
                      required
                      placeholder="Cardiology / Neurology"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Qualifications */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Qualifications *
                  </label>
                  <div className="relative">
                    <Award className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="qualifications"
                      required
                      placeholder="MBBS, FCPS (Cardiology)"
                      value={formData.qualifications}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Consultation Fee */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Consultation Fee (BDT)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      name="consultationFee"
                      placeholder="1000"
                      value={formData.consultationFee || ""}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Experience Years */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experienceYears"
                    placeholder="5"
                    value={formData.experienceYears || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Chamber / Practice Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="address"
                      placeholder="Panchlaish, Chattogram"
                      value={formData.address || ""}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Brief Bio / About Yourself
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-4 top-4 text-slate-400" />
                  <textarea
                    name="bio"
                    rows={3}
                    placeholder="Share a brief overview of your clinical experience and expertise..."
                    value={formData.bio || ""}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 3. Supporting Documents (Resume Required) */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-600" />
                <span>Supporting Documents</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Required Resume Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Resume / Curriculum Vitae (CV) *
                  </label>

                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleResumeChange}
                    className="hidden"
                  />

                  {!resumeFile ? (
                    <div
                      onClick={() => resumeInputRef.current?.click()}
                      className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 p-5 text-center transition-all flex flex-col items-center justify-center gap-2"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-slate-700">
                        Click to upload Resume *
                      </div>
                      <div className="text-[11px] text-slate-400">
                        PDF, DOC, or DOCX (Required)
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <File className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {resumeFile.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setResumeFile(null);
                          if (resumeInputRef.current) {
                            resumeInputRef.current.value = "";
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove Resume"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Optional Additional Certificates */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Additional Certificates (Optional)
                  </label>

                  <input
                    ref={additionalInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleAdditionalFilesChange}
                    className="hidden"
                  />

                  <div
                    onClick={() => additionalInputRef.current?.click()}
                    className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-slate-100/70 p-5 text-center transition-all flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-200/80 text-slate-600 flex items-center justify-center">
                      <Files className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-slate-700">
                      Attach BMDC / Degree Certificates
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Multiple files allowed (Optional)
                    </div>
                  </div>

                  {additionalFiles.length > 0 && (
                    <div className="mt-2.5 space-y-1.5">
                      {additionalFiles.map((file, idx) => (
                        <div
                          key={`${file.name}-${idx}`}
                          className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-100 text-xs"
                        >
                          <span className="truncate font-medium text-slate-700">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAdditionalFile(idx)}
                            className="text-slate-400 hover:text-red-500 shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Doctor Application</span>
                </>
              )}
            </button>
          </motion.form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl max-w-lg mx-auto text-center space-y-6"
          >
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <KeyRound className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">
                Verify Email Address
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                We sent a 6-digit verification code (OTP) to <br />
                <span className="font-bold text-slate-800">
                  {formData.email}
                </span>
                .
              </p>
            </div>

            <form onSubmit={handleOtpVerify} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-left">
                  Enter OTP Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center tracking-[0.5em] font-mono text-2xl py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Verify Email & Complete</span>
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors pt-2"
            >
              ← Back to Application Form
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}