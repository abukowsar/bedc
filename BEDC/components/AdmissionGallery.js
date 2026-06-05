"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import admissionInfoOne from "../assets/admission/711830084_1299511748957786_4498741828197843170_n.jpg";
import admissionInfoTwo from "../assets/admission/716829969_1299511825624445_7645609704640734833_n.jpg";

const leaflets = [
  {
    src: admissionInfoOne,
    alt: "BEDC admission information leaflet page one",
    fileName: "BEDC-admission-info-2026-27-page-1.jpg",
  },
  {
    src: admissionInfoTwo,
    alt: "BEDC admission information leaflet page two",
    fileName: "BEDC-admission-info-2026-27-page-2.jpg",
  },
];

const labels = {
  en: {
    slider: "Admission leaflet preview slider",
    open: "Open preview",
    previous: "Previous admission leaflet",
    previousShort: "Prev",
    next: "Next admission leaflet",
    nextShort: "Next",
    pages: "Admission leaflet pages",
    showPage: "Show admission leaflet page",
    dialog: "Admission leaflet preview",
    closePreview: "Close preview",
    leaflet: "Admission leaflet",
    of: "of",
    download: "Download",
    close: "Close",
  },
  bn: {
    slider: "ভর্তি লিফলেট প্রিভিউ স্লাইডার",
    open: "প্রিভিউ খুলুন",
    previous: "আগের ভর্তি লিফলেট",
    previousShort: "আগের",
    next: "পরের ভর্তি লিফলেট",
    nextShort: "পরের",
    pages: "ভর্তি লিফলেট পৃষ্ঠা",
    showPage: "ভর্তি লিফলেট পৃষ্ঠা দেখুন",
    dialog: "ভর্তি লিফলেট প্রিভিউ",
    closePreview: "প্রিভিউ বন্ধ করুন",
    leaflet: "ভর্তি লিফলেট",
    of: "এর মধ্যে",
    download: "ডাউনলোড",
    close: "বন্ধ",
  },
};

export default function AdmissionGallery({ language = "en" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const text = labels[language] ?? labels.en;
  const activeLeaflet = leaflets[activeIndex];

  const showSlide = (direction) => {
    setActiveIndex((current) => (current + direction + leaflets.length) % leaflets.length);
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
      if (event.key === "ArrowLeft") showSlide(-1);
      if (event.key === "ArrowRight") showSlide(1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <div className="admissionLeafletSlider" aria-label={text.slider}>
        <button className="admissionLeafletPreview" type="button" onClick={() => setIsOpen(true)}>
          <Image
            src={activeLeaflet.src}
            alt={activeLeaflet.alt}
            sizes="(max-width: 900px) 100vw, 44vw"
            className="coverMedia"
          />
          <span>{text.open}</span>
        </button>

        <div className="admissionSliderControls">
          <button type="button" onClick={() => showSlide(-1)} aria-label={text.previous}>
            {text.previousShort}
          </button>
          <div aria-label={text.pages}>
            {leaflets.map((leaflet, index) => (
              <button
                key={leaflet.fileName}
                className={index === activeIndex ? "active" : ""}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${text.showPage} ${index + 1}`}
              />
            ))}
          </div>
          <button type="button" onClick={() => showSlide(1)} aria-label={text.next}>
            {text.nextShort}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="admissionModal" role="dialog" aria-modal="true" aria-label={text.dialog}>
          <button className="admissionModalBackdrop" type="button" onClick={() => setIsOpen(false)} aria-label={text.closePreview} />
          <div className="admissionModalPanel">
            <div className="admissionModalToolbar">
              <span>{text.leaflet} {activeIndex + 1} {text.of} {leaflets.length}</span>
              <div>
                <a href={activeLeaflet.src.src} download={activeLeaflet.fileName}>
                  {text.download}
                </a>
                <button type="button" onClick={() => setIsOpen(false)}>{text.close}</button>
              </div>
            </div>

            <div className="admissionModalImage">
              <Image src={activeLeaflet.src} alt={activeLeaflet.alt} sizes="90vw" />
            </div>

            <button className="admissionModalArrow previous" type="button" onClick={() => showSlide(-1)} aria-label={text.previous}>
              {text.previousShort}
            </button>
            <button className="admissionModalArrow next" type="button" onClick={() => showSlide(1)} aria-label={text.next}>
              {text.nextShort}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
