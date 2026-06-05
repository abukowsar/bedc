"use client";

import { useState } from "react";
import Image from "next/image";
import AdmissionGallery from "../components/AdmissionGallery";
import admissionInfoOne from "../assets/admission/711830084_1299511748957786_4498741828197843170_n.jpg";
import campusAbout from "../assets/campus/1.jpg";
import campusGround from "../assets/campus/2.jpg";
import achievementVisit from "../assets/extra/1.jpg";
import studentActivity from "../assets/extra/2.jpg";
import classroomGuidance from "../assets/extra/3.jpg";
import trainingLeaflet from "../assets/training/1.jpg";
import trainingClassroom from "../assets/training/2.jpg";
import trainingPractice from "../assets/training/501378399_3761058154184041_1929328746354654996_n.jpg";
import heroMain from "../assets/hero/1.jpg";
import heroCampus from "../assets/hero/2.jpg";
import heroCulture from "../assets/hero/3.jpg";

const heroSlides = [
  [heroMain, "BEDC anniversary program with college guests and faculty"],
  [heroCampus, "Burichang Ershad Degree College campus program"],
  [heroCulture, "Students performing at a BEDC cultural program"],
];

const copy = {
  en: {
    utility: "Burichang, Cumilla | EIIN 105331",
    notice: "Admission open for Class XI, academic year 2026-27.",
    noticeLink: "Download admission info",
    brand: "Burichang Ershad Degree College",
    brandTag: "Education, discipline, creativity",
    nav: ["About", "Programs", "Campus", "Admission Info", "Contact"],
    sliderLabel: "Campus moments",
    sliderTitle: "Heritage, culture, and student achievement",
    badge: "2026-27 admission now open",
    heroTitle: <>Build your future at <em>BEDC</em></>,
    heroText: "Burichang Ershad Degree College helps students move from ambition to achievement through experienced teachers, disciplined learning, modern classroom support, and a proud local legacy since 1986.",
    downloadAdmission: "Download Admission Info",
    explorePrograms: "Explore Programs",
    heroHighlights: [
      ["01", "Class XI Admission", "Science, Humanities, and Business Studies guidance for the new academic year."],
      ["02", "Skill Development", "IT, spoken English, BNCC, Rover Scouts, debate, sports, and career training."],
      ["03", "University Prep", "Support for exams, counseling, and higher education preparation."],
    ],
    quickLinks: [
      ["01", "Admission Info", "Download the 2026-27 admission leaflet.", "#admission-info"],
      ["02", "Programs", "HSC, Degree, skills, and co-curricular pathways.", "#programs"],
      ["03", "Campus Life", "See learning spaces, activities, and student support.", "#campus"],
      ["04", "Contact", "Call or email the admission desk.", "#contact"],
    ],
    stats: [
      ["1986", "Established"],
      ["105331", "EIIN"],
      ["7975", "College code"],
      ["3706", "Degree code"],
    ],
    aboutImageNote: "Online admission process is active for the 2026-27 academic year.",
    aboutKicker: "About BEDC",
    aboutTitle: "Rooted in heritage, prepared for a digital future.",
    aboutText: "Founded by freedom fighter and former member of parliament Professor Md. Yunus, BEDC serves the community with quality education, scholarship support, practical training, and active student development.",
    aboutFacts: [
      "Smart classrooms and multimedia learning support",
      "BNCC, Rover Scouts, clubs, culture, and sports",
      "Merit scholarship and book assistance",
      "University admission and career preparation",
    ],
    admissionHelp: "Get admission help",
    whyKicker: "Why choose BEDC",
    whyTitle: "A complete learning environment for college students.",
    features: [
      ["01", "Heritage and reputation", "A community-rooted institution serving Burichang and nearby areas with disciplined education.", campusGround, "BEDC campus grounds and academic building"],
      ["02", "Experienced teachers", "Regular classes, guided evaluation, and careful mentoring for HSC and Degree students.", classroomGuidance, "Teachers guiding BEDC students in a classroom"],
      ["03", "Smart learning support", "Modern classroom tools and practical IT training help students prepare for the future.", heroCampus, "BEDC students and faculty at a campus program"],
      ["04", "Career development", "Skill training, admission guidance, and co-curricular programs build confidence beyond exams.", achievementVisit, "BEDC faculty and guests presenting an achievement crest"],
      ["05", "BNCC and Rover Scouts", "Structured activities support leadership, discipline, teamwork, and service.", studentActivity, "BEDC students participating in a group activity"],
      ["06", "Active campus culture", "Debate, sports, study tours, cultural programs, national days, and student clubs.", heroCulture, "BEDC students performing at a cultural program"],
    ],
    programKicker: "Programs and support",
    programTitle: "Study pathways with practical guidance.",
    downloadDetails: "Download details",
    programs: [
      ["HSC", "Science, Humanities, and Business Studies admission support for the 2026-27 academic year."],
      ["Degree", "Higher education pathways with local guidance, academic care, and steady progress."],
      ["Skill Training", "IT, spoken English, ticketing and reservation, and practical career-building programs."],
      ["Scholarship Support", "Professor Md. Yunus Foundation supports students with scholarships and books."],
    ],
    admissionKicker: "Admission info",
    admissionTitle: "Download the official admission leaflet.",
    admissionCardKicker: "Class XI admission 2026-27",
    admissionCardTitle: "Science, Humanities, and Business Studies admission details are ready.",
    admissionCardText: "The leaflet includes college codes, special features, training opportunities, student activities, admission support, and contact numbers.",
    campusKicker: "Campus life",
    campusTitle: "Learning continues through activities, training, and service.",
    campusText: "Students can build confidence through classroom learning, IT training, spoken English, debate, sports, cultural programs, BNCC, Rover Scouts, and study tours.",
    trainingCaptions: ["Training sessions", "Classroom guidance", "Practical activities"],
    ctaKicker: "Request info. Visit campus. Apply now.",
    ctaTitle: "Let BEDC help you choose your next step.",
    ctaText: "Call for admissions, program guidance, campus visits, or scholarship information.",
    form: {
      name: "Student name",
      phone: "Phone number",
      email: "Email address",
      program: "Program interest",
      message: "How can we help?",
      submit: "Send Request",
      options: ["HSC Science", "HSC Humanities", "HSC Business Studies", "Degree", "Skill Training"],
    },
    footer: "EIIN 105331. College code 7975. Degree code 3706.",
  },
  bn: {
    utility: "বুড়িচং, কুমিল্লা | EIIN 105331",
    notice: "২০২৬-২৭ শিক্ষাবর্ষে একাদশ শ্রেণিতে ভর্তি চলছে।",
    noticeLink: "ভর্তির তথ্য ডাউনলোড",
    brand: "বুড়িচং এরশাদ ডিগ্রি কলেজ",
    brandTag: "শিক্ষা, শৃঙ্খলা, সৃজনশীলতা",
    nav: ["পরিচিতি", "প্রোগ্রাম", "ক্যাম্পাস", "ভর্তির তথ্য", "যোগাযোগ"],
    sliderLabel: "ক্যাম্পাস মুহূর্ত",
    sliderTitle: "ঐতিহ্য, সংস্কৃতি ও শিক্ষার্থীদের অর্জন",
    badge: "২০২৬-২৭ শিক্ষাবর্ষে ভর্তি চলছে",
    heroTitle: <>আপনার ভবিষ্যৎ গড়ুন <em>BEDC</em>-তে</>,
    heroText: "অভিজ্ঞ শিক্ষক, শৃঙ্খলাবদ্ধ পাঠদান, আধুনিক শ্রেণিকক্ষ সহায়তা এবং ১৯৮৬ সাল থেকে গড়ে ওঠা গর্বিত ঐতিহ্যের মাধ্যমে বুড়িচং এরশাদ ডিগ্রি কলেজ শিক্ষার্থীদের স্বপ্নকে অর্জনে রূপ দিতে সহায়তা করে।",
    downloadAdmission: "ভর্তির তথ্য ডাউনলোড",
    explorePrograms: "প্রোগ্রাম দেখুন",
    heroHighlights: [
      ["01", "একাদশ শ্রেণিতে ভর্তি", "নতুন শিক্ষাবর্ষে বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা শাখার ভর্তি সহায়তা।"],
      ["02", "দক্ষতা উন্নয়ন", "আইটি, স্পোকেন ইংলিশ, বিএনসিসি, রোভার স্কাউট, বিতর্ক, ক্রীড়া ও ক্যারিয়ার প্রশিক্ষণ।"],
      ["03", "বিশ্ববিদ্যালয় প্রস্তুতি", "পরীক্ষা, কাউন্সেলিং ও উচ্চশিক্ষার প্রস্তুতিতে সহায়তা।"],
    ],
    quickLinks: [
      ["01", "ভর্তির তথ্য", "২০২৬-২৭ শিক্ষাবর্ষের ভর্তি লিফলেট ডাউনলোড করুন।", "#admission-info"],
      ["02", "প্রোগ্রাম", "এইচএসসি, ডিগ্রি, দক্ষতা ও সহশিক্ষা কার্যক্রম।", "#programs"],
      ["03", "ক্যাম্পাস জীবন", "শিক্ষা পরিবেশ, কার্যক্রম ও শিক্ষার্থী সহায়তা দেখুন।", "#campus"],
      ["04", "যোগাযোগ", "ভর্তি সহায়তার জন্য কল বা ইমেইল করুন।", "#contact"],
    ],
    stats: [
      ["1986", "প্রতিষ্ঠিত"],
      ["105331", "EIIN"],
      ["7975", "কলেজ কোড"],
      ["3706", "ডিগ্রি কোড"],
    ],
    aboutImageNote: "২০২৬-২৭ শিক্ষাবর্ষের অনলাইন ভর্তি প্রক্রিয়া চালু আছে।",
    aboutKicker: "BEDC পরিচিতি",
    aboutTitle: "ঐতিহ্যে শিকড়, ডিজিটাল ভবিষ্যতের প্রস্তুতি।",
    aboutText: "মুক্তিযোদ্ধা ও সাবেক সংসদ সদস্য অধ্যাপক মোঃ ইউনুস কর্তৃক প্রতিষ্ঠিত BEDC মানসম্মত শিক্ষা, বৃত্তি সহায়তা, ব্যবহারিক প্রশিক্ষণ ও শিক্ষার্থী উন্নয়নের মাধ্যমে সমাজকে সেবা দিয়ে যাচ্ছে।",
    aboutFacts: [
      "স্মার্ট ক্লাসরুম ও মাল্টিমিডিয়া শিক্ষা সহায়তা",
      "বিএনসিসি, রোভার স্কাউট, ক্লাব, সংস্কৃতি ও ক্রীড়া",
      "মেধাবৃত্তি ও বই সহায়তা",
      "বিশ্ববিদ্যালয় ভর্তি ও ক্যারিয়ার প্রস্তুতি",
    ],
    admissionHelp: "ভর্তি সহায়তা নিন",
    whyKicker: "কেন BEDC",
    whyTitle: "কলেজ শিক্ষার্থীদের জন্য পূর্ণাঙ্গ শিক্ষা পরিবেশ।",
    features: [
      ["01", "ঐতিহ্য ও সুনাম", "বুড়িচং ও আশপাশের এলাকার জন্য শৃঙ্খলাবদ্ধ শিক্ষায় নিবেদিত একটি সমাজভিত্তিক প্রতিষ্ঠান।", campusGround, "BEDC campus grounds and academic building"],
      ["02", "অভিজ্ঞ শিক্ষক", "এইচএসসি ও ডিগ্রি শিক্ষার্থীদের জন্য নিয়মিত ক্লাস, মূল্যায়ন ও যত্নশীল দিকনির্দেশনা।", classroomGuidance, "Teachers guiding BEDC students in a classroom"],
      ["03", "স্মার্ট শিক্ষা সহায়তা", "আধুনিক শ্রেণিকক্ষ উপকরণ ও ব্যবহারিক আইটি প্রশিক্ষণ শিক্ষার্থীদের ভবিষ্যতের জন্য প্রস্তুত করে।", heroCampus, "BEDC students and faculty at a campus program"],
      ["04", "ক্যারিয়ার উন্নয়ন", "দক্ষতা প্রশিক্ষণ, ভর্তি সহায়তা ও সহশিক্ষা কার্যক্রম আত্মবিশ্বাস গড়ে তোলে।", achievementVisit, "BEDC faculty and guests presenting an achievement crest"],
      ["05", "বিএনসিসি ও রোভার স্কাউট", "নেতৃত্ব, শৃঙ্খলা, দলগত কাজ ও সেবামূলক মানসিকতা গড়ে তুলতে সংগঠিত কার্যক্রম।", studentActivity, "BEDC students participating in a group activity"],
      ["06", "সক্রিয় ক্যাম্পাস সংস্কৃতি", "বিতর্ক, ক্রীড়া, শিক্ষা সফর, সাংস্কৃতিক অনুষ্ঠান, জাতীয় দিবস ও শিক্ষার্থী ক্লাব।", heroCulture, "BEDC students performing at a cultural program"],
    ],
    programKicker: "প্রোগ্রাম ও সহায়তা",
    programTitle: "ব্যবহারিক দিকনির্দেশনাসহ পড়াশোনার পথ।",
    downloadDetails: "বিস্তারিত ডাউনলোড",
    programs: [
      ["এইচএসসি", "২০২৬-২৭ শিক্ষাবর্ষে বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা শাখায় ভর্তি সহায়তা।"],
      ["ডিগ্রি", "স্থানীয় দিকনির্দেশনা, একাডেমিক যত্ন ও ধারাবাহিক অগ্রগতির উচ্চশিক্ষা পথ।"],
      ["দক্ষতা প্রশিক্ষণ", "আইটি, স্পোকেন ইংলিশ, টিকিটিং ও রিজার্ভেশনসহ ব্যবহারিক ক্যারিয়ার প্রশিক্ষণ।"],
      ["বৃত্তি সহায়তা", "অধ্যাপক মোঃ ইউনুস ফাউন্ডেশন শিক্ষার্থীদের বৃত্তি ও বই সহায়তা করে।"],
    ],
    admissionKicker: "ভর্তির তথ্য",
    admissionTitle: "অফিসিয়াল ভর্তি লিফলেট ডাউনলোড করুন।",
    admissionCardKicker: "একাদশ শ্রেণিতে ভর্তি ২০২৬-২৭",
    admissionCardTitle: "বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা শাখার ভর্তি তথ্য প্রস্তুত।",
    admissionCardText: "লিফলেটে কলেজ কোড, বিশেষ বৈশিষ্ট্য, প্রশিক্ষণ সুযোগ, শিক্ষার্থী কার্যক্রম, ভর্তি সহায়তা ও যোগাযোগ নম্বর রয়েছে।",
    campusKicker: "ক্যাম্পাস জীবন",
    campusTitle: "কার্যক্রম, প্রশিক্ষণ ও সেবার মাধ্যমে শিক্ষা চলমান থাকে।",
    campusText: "শ্রেণিকক্ষ শিক্ষা, আইটি প্রশিক্ষণ, স্পোকেন ইংলিশ, বিতর্ক, ক্রীড়া, সাংস্কৃতিক অনুষ্ঠান, বিএনসিসি, রোভার স্কাউট ও শিক্ষা সফরের মাধ্যমে শিক্ষার্থীরা আত্মবিশ্বাস গড়ে তোলে।",
    trainingCaptions: ["প্রশিক্ষণ সেশন", "শ্রেণিকক্ষ নির্দেশনা", "ব্যবহারিক কার্যক্রম"],
    ctaKicker: "তথ্য নিন। ক্যাম্পাস ভিজিট করুন। এখনই আবেদন করুন।",
    ctaTitle: "আপনার পরবর্তী ধাপ বেছে নিতে BEDC পাশে আছে।",
    ctaText: "ভর্তি, প্রোগ্রাম নির্বাচন, ক্যাম্পাস ভিজিট বা বৃত্তির তথ্যের জন্য যোগাযোগ করুন।",
    form: {
      name: "শিক্ষার্থীর নাম",
      phone: "ফোন নম্বর",
      email: "ইমেইল ঠিকানা",
      program: "প্রোগ্রাম নির্বাচন",
      message: "আমরা কীভাবে সাহায্য করতে পারি?",
      submit: "অনুরোধ পাঠান",
      options: ["এইচএসসি বিজ্ঞান", "এইচএসসি মানবিক", "এইচএসসি ব্যবসায় শিক্ষা", "ডিগ্রি", "দক্ষতা প্রশিক্ষণ"],
    },
    footer: "EIIN 105331. কলেজ কোড 7975. ডিগ্রি কোড 3706.",
  },
};

const programValues = ["hsc-science", "hsc-humanities", "hsc-business", "degree", "skill-training"];

export default function Home() {
  const [language, setLanguage] = useState("en");
  const t = copy[language];
  const isBangla = language === "bn";

  return (
    <main className={`collegePage${isBangla ? " bangla" : ""}`} id="top" lang={isBangla ? "bn" : "en"}>
      <div className="collegeUtility">
        <span>{t.utility}</span>
        <div>
          <a href="tel:+8801914541329">01914-541329</a>
          <a href="mailto:bedc1986@gmail.com">bedc1986@gmail.com</a>
        </div>
      </div>

      <div className="collegeNotice">
        <span className="noticeDot" />
        <span>{t.notice}</span>
        <a href="#admission-info">{t.noticeLink}</a>
      </div>

      <header className="collegeHeader">
        <a className="collegeBrand" href="#top" aria-label={`${t.brand} home`}>
          <Image src="/college-mark.svg" alt="" width={58} height={58} priority />
          <span>
            <strong>{t.brand}</strong>
            <small>{t.brandTag}</small>
          </span>
        </a>
        <nav className="collegeNav" aria-label="Main navigation">
          <a href="#about">{t.nav[0]}</a>
          <a href="#programs">{t.nav[1]}</a>
          <a href="#campus">{t.nav[2]}</a>
          <a href="#admission-info">{t.nav[3]}</a>
          <a href="#contact">{t.nav[4]}</a>
        </nav>
        <div className="collegeActions" aria-label="Language selector">
          <button className={language === "en" ? "active" : ""} type="button" onClick={() => setLanguage("en")}>EN</button>
          <button className={language === "bn" ? "active" : ""} type="button" onClick={() => setLanguage("bn")}>BN</button>
        </div>
      </header>

      <section className="collegeHero">
        <div className="heroImage" aria-label="Campus highlights slider">
          {heroSlides.map(([src, alt], index) => (
            <Image key={alt} src={src} alt={alt} priority={index === 0} sizes="(max-width: 980px) 100vw, 48vw" className="heroSlideImage" />
          ))}
          <div className="heroSliderCaption">
            <span>{t.sliderLabel}</span>
            <strong>{t.sliderTitle}</strong>
          </div>
          <div className="heroSliderDots" aria-hidden="true"><span /><span /><span /></div>
        </div>
        <div className="heroWash" />
        <div className="heroOrnament one" />
        <div className="heroOrnament two" />

        <div className="collegeHeroCopy">
          <span className="collegeBadge">{t.badge}</span>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <div className="collegeHeroActions">
            <a className="collegeButton light" href="#admission-info">{t.downloadAdmission}</a>
            <a className="collegeButton ghost" href="#programs">{t.explorePrograms}</a>
          </div>
          <div className="heroHighlights" aria-label="College highlights">
            {t.heroHighlights.map(([number, title, text]) => (
              <article key={title}>
                <span>{number}</span>
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="quickAccess" aria-label="Quick access">
        {t.quickLinks.map(([number, title, text, href]) => (
          <a key={title} href={href}>
            <span>{number}</span>
            <div>
              <strong>{title}</strong>
              <small>{text}</small>
            </div>
            <b aria-hidden="true">+</b>
          </a>
        ))}
      </section>

      <section className="collegeStats" aria-label="College facts">
        {t.stats.map(([value, label]) => (
          <article key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <section className="collegeWelcome" id="about">
        <div className="welcomeImage">
          <Image src={campusAbout} alt="Burichang Ershad Degree College campus" sizes="(max-width: 900px) 100vw, 44vw" className="coverMedia" />
          <span>{t.aboutImageNote}</span>
        </div>
        <div className="welcomeCopy">
          <p>{t.aboutKicker}</p>
          <h2>{t.aboutTitle}</h2>
          <span>{t.aboutText}</span>
          <div className="welcomeFacts">
            {t.aboutFacts.map((fact) => <strong key={fact}>{fact}</strong>)}
          </div>
          <a className="collegeButton solid" href="#contact">{t.admissionHelp}</a>
        </div>
      </section>

      <section className="whySection">
        <div className="sectionIntro">
          <p>{t.whyKicker}</p>
          <h2>{t.whyTitle}</h2>
        </div>
        <div className="reasonGrid">
          {t.features.map(([number, title, text, image, alt]) => (
            <article key={title}>
              <div className="reasonImage">
                <Image src={image} alt={alt} sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw" />
                <span>{number}</span>
              </div>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="programSection" id="programs">
        <div className="programIntro">
          <p>{t.programKicker}</p>
          <h2>{t.programTitle}</h2>
          <a href="#admission-info">{t.downloadDetails} <span aria-hidden="true">+</span></a>
        </div>
        <div className="programList">
          {t.programs.map(([title, text]) => (
            <article key={title}>
              <span>{title}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="admissionInfoSection" id="admission-info">
        <div className="sectionIntro">
          <p>{t.admissionKicker}</p>
          <h2>{t.admissionTitle}</h2>
        </div>
        <div className="admissionInfoGrid">
          <AdmissionGallery language={language} />
          <div className="admissionDownloadCard">
            <span>{t.admissionCardKicker}</span>
            <h3>{t.admissionCardTitle}</h3>
            <p>{t.admissionCardText}</p>
            <div className="admissionCodeList">
              <strong>EIIN 105331</strong>
              <strong>{isBangla ? "কলেজ কোড 7975" : "College Code 7975"}</strong>
              <strong>{isBangla ? "ডিগ্রি কোড 3706" : "Degree Code 3706"}</strong>
            </div>
            <a className="collegeButton solid" href={admissionInfoOne.src} download="BEDC-admission-info-2026-27.jpg">
              {t.downloadAdmission}
            </a>
          </div>
        </div>
      </section>

      <section className="campusSection" id="campus">
        <div className="campusHeading">
          <div className="sectionIntro">
            <p>{t.campusKicker}</p>
            <h2>{t.campusTitle}</h2>
          </div>
          <p>{t.campusText}</p>
        </div>
        <div className="campusGallery">
          <figure className="wide" style={{ position: "relative" }}>
            <Image src={trainingLeaflet} alt="BEDC students participating in a training session" sizes="60vw" className="coverMedia" />
            <figcaption><span>01</span>{t.trainingCaptions[0]}</figcaption>
          </figure>
          <figure className="campusViewTwo" style={{ position: "relative" }}>
            <Image src={trainingClassroom} alt="BEDC classroom training and guidance activity" sizes="36vw" className="coverMedia" />
            <figcaption><span>02</span>{t.trainingCaptions[1]}</figcaption>
          </figure>
          <figure className="campusViewThree" style={{ position: "relative" }}>
            <Image src={trainingPractice} alt="BEDC student practicing during a training activity" sizes="36vw" className="coverMedia" />
            <figcaption><span>03</span>{t.trainingCaptions[2]}</figcaption>
          </figure>
        </div>
      </section>

      <section className="collegeCta" id="contact">
        <div>
          <p>{t.ctaKicker}</p>
          <h2>{t.ctaTitle}</h2>
          <span>{t.ctaText}</span>
          <div className="collegeContactDetails">
            <span>01914-541329</span>
            <span>01718-128605</span>
            <span>01716-440535</span>
            <span>01744-549871</span>
            <span>bedc1986@gmail.com</span>
          </div>
        </div>
        <form className="collegeContactForm" action="mailto:bedc1986@gmail.com" method="post" encType="text/plain">
          <input type="text" name="name" placeholder={t.form.name} aria-label={t.form.name} required />
          <input type="tel" name="phone" placeholder={t.form.phone} aria-label={t.form.phone} required />
          <input type="email" name="email" placeholder={t.form.email} aria-label={t.form.email} required />
          <select name="program" aria-label={t.form.program} defaultValue="">
            <option value="" disabled>{t.form.program}</option>
            {t.form.options.map((option, index) => <option key={option} value={programValues[index]}>{option}</option>)}
          </select>
          <textarea name="message" placeholder={t.form.message} aria-label={t.form.message} />
          <button type="submit">{t.form.submit}</button>
        </form>
      </section>

      <footer className="collegeFooter">
        <a className="collegeBrand" href="#top">
          <Image src="/college-mark.svg" alt="" width={46} height={46} />
          <span>
            <strong>{t.brand}</strong>
            <small>{isBangla ? "বুড়িচং, কুমিল্লা" : "Burichang, Cumilla"}</small>
          </span>
        </a>
        <p>{t.footer}</p>
      </footer>
    </main>
  );
}
