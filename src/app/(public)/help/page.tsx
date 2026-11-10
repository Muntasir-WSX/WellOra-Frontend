"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  PhoneCall,
  Mail,
  ChevronDown,
  ArrowRight,
  Headphones,
  LifeBuoy,
} from "lucide-react";
import Link from "next/link";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "appointment", label: "Appointments" },
    { id: "payment", label: "Payments & Refunds" },
    { id: "prescription", label: "E-Prescriptions" },
    { id: "doctor", label: "Doctors & Slots" },
  ];

  const faqs: FAQItem[] = [
    {
      id: 1,
      category: "appointment",
      question: "How do I book a 20-minute doctor appointment?",
      answer:
        "Go to the 'Doctors' or 'Available Today' page, select your preferred specialist, pick an available 20-minute slot, and complete the instant bKash payment to confirm your booking.",
    },
    {
      id: 2,
      category: "appointment",
      question: "Can I reschedule or cancel my booked slot?",
      answer:
        "Yes, you can cancel your appointment up to 1 hour before the scheduled start time from your Patient Dashboard to receive an automated refund.",
    },
    {
      id: 3,
      category: "payment",
      question: "Which payment methods are supported on WellOra?",
      answer:
        "We support instant online bKash payments, Nagad, Rocket, as well as Visa, Mastercard, and American Express debit/credit cards via our secure gateway.",
    },
    {
      id: 4,
      category: "payment",
      question: "How long does a refund take after cancellation?",
      answer:
        "Automated refunds are initiated instantly. For bKash/Nagad, it reflects in your MFS account within 1-2 hours. For cards, it takes 3-5 business days.",
    },
    {
      id: 5,
      category: "prescription",
      question: "Where can I download my E-Prescription?",
      answer:
        "Once your doctor completes the consultation, a PDF version of your E-Prescription will automatically appear in your Patient Dashboard and will also be sent to your registered email.",
    },
    {
      id: 6,
      category: "doctor",
      question: "Are all doctors on WellOra BMDC certified?",
      answer:
        "Yes, 100% of the medical specialists on WellOra undergo strict BMDC license verification before being permitted to offer consultation slots.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) => activeCategory === "all" || faq.category === activeCategory
  );

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    const firstMatch = faqs.find(
      (faq) => catId === "all" || faq.category === catId
    );
    setOpenFaqId(firstMatch ? firstMatch.id : null);
  };

  return (
    <div className="min-h-screen bg-slate-50 select-none pt-24 pb-20">
      {/* 1. HERO BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
          <img
            src="https://res.cloudinary.com/dnk0bvpym/image/upload/v1794296412/banner6_rqu8k8.jpg"
            alt="WellOra Help & Support Banner"
            className="w-full h-[350px] sm:h-[420px] object-cover object-center"
          />
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />

          {/* Text Content Overlay */}
          <div className="absolute inset-0 flex items-center px-6 sm:px-12 lg:px-16">
            <div className="max-w-2xl space-y-4 w-full">
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md"
              >
                <LifeBuoy className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>24/7 Patient Help Center</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md"
              >
                How Can We Help You Today?
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed"
              >
                Find answers to common questions about doctor appointment slots, bKash payment verification, and downloading e-prescriptions.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK SUPPORT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            href="tel:+8801700000000"
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex items-start gap-4 group"
          >
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Direct Support Line</h4>
              <p className="text-xs text-slate-500 mt-1">Talk to our medical desk assistants instantly.</p>
              <p className="text-sm font-extrabold text-emerald-600 mt-2">+880 1700-000000</p>
            </div>
          </a>

          <a
            href="mailto:support@wellora.com"
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex items-start gap-4 group"
          >
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Email Assistance</h4>
              <p className="text-xs text-slate-500 mt-1">Get written resolution for your inquiries.</p>
              <p className="text-sm font-extrabold text-emerald-600 mt-2">support@wellora.com</p>
            </div>
          </a>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex items-start gap-4 group">
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Live Support Desk</h4>
              <p className="text-xs text-slate-500 mt-1">Available 24/7 for booking troubleshooting.</p>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-2 hover:underline"
              >
                <span>Submit Ticket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FAQ ACCORDION SECTION */}
      <section id="faq-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Find quick answers to common queries regarding doctor appointments, payments, and digital records.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQs List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-emerald-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transform transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-emerald-600" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-semibold text-sm">
                No questions found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. STILL NEED HELP CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Still Have Questions?
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base">
              Our dedicated support team is here to assist you with any inquiries or custom scheduling needs.
            </p>
          </div>

          <Link
            href="/contact-us"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-700 hover:bg-slate-100 font-bold text-sm sm:text-base transition-all shadow-md shrink-0 hover:scale-[1.02] active:scale-95"
          >
            <Mail className="w-5 h-5" />
            <span>Contact Support Desk</span>
          </Link>
        </div>
      </section>
    </div>
  );
}