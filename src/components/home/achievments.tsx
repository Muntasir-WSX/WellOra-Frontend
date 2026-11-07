"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Users,
  Stethoscope,
  CalendarCheck,
  Star,
  Award,
} from "lucide-react";

// Counter Animation Sub-Component
function CounterItem({
  targetNumber,
  suffix = "",
  label,
  icon: Icon,
  delay = 0,
}: {
  targetNumber: number;
  suffix?: string;
  label: string;
  icon: React.ElementType;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000; // 2 seconds animation
      const frameRate = 1000 / 60; // 60 FPS
      const totalFrames = Math.round(duration / frameRate);
      const increment = targetNumber / totalFrames;

      let currentFrame = 0;

      const timer = setInterval(() => {
        currentFrame++;
        start += increment;

        if (currentFrame >= totalFrames) {
          setCount(targetNumber);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, frameRate);

      return () => clearInterval(timer);
    }
  }, [inView, targetNumber]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
    >
      <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 mb-4">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center">
        <span>{count.toLocaleString()}</span>
        <span className="text-emerald-600">{suffix}</span>
      </h3>

      <p className="mt-2 text-sm font-semibold text-slate-500 uppercase tracking-wider text-center">
        {label}
      </p>
    </motion.div>
  );
}

export default function Achievements() {
  const achievementsData = [
    {
      id: 1,
      targetNumber: 500,
      suffix: "+",
      label: "Verified Doctors",
      icon: Stethoscope,
    },
    {
      id: 2,
      targetNumber: 15000,
      suffix: "+",
      label: "Happy Patients",
      icon: Users,
    },
    {
      id: 3,
      targetNumber: 25000,
      suffix: "+",
      label: "Appointments Booked",
      icon: CalendarCheck,
    },
    {
      id: 4,
      targetNumber: 98,
      suffix: "%",
      label: "Positive Reviews",
      icon: Star,
    },
    {
      id: 5,
      targetNumber: 15,
      suffix: "+",
      label: "Medical Departments",
      icon: Award,
    },
  ];

  return (
    <section className="py-16 bg-slate-50 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
          >
            Our Milestones & Achievements
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 text-sm sm:text-base text-slate-600"
          >
            Delivering quality healthcare services with excellence and trust every single day.
          </motion.p>
        </div>

        {/* Counter Items Grid (5 items layout) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {achievementsData.map((item, index) => (
            <CounterItem
              key={item.id}
              targetNumber={item.targetNumber}
              suffix={item.suffix}
              label={item.label}
              icon={item.icon}
              delay={index * 0.1}
            />
          ))}
        </div>

      </div>
    </section>
  );
}