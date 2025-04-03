import React from "react";
import dynamic from "next/dynamic";

// Динамический импорт 3D компонентов для оптимизации
const HeroSection = dynamic(() => import("@/components/HeroSection"), { ssr: true });

import Header from "@/components/Header";
import HistorySection from "@/components/HistorySection";
import ProgramsSection from "@/components/ProgramsSection";
import ResearchSection from "@/components/ResearchSection";
import StudentLifeSection from "@/components/StudentLifeSection";
import ContactsSection from "@/components/ContactsSection";
import Footer from "@/components/Footer";

/**
 * Главная страница сайта
 */
export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <HistorySection />
      <ProgramsSection />
      <ResearchSection />
      <StudentLifeSection />
      <ContactsSection />
      <Footer />
    </main>
  );
}
