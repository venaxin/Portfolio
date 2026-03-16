import { useState, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import MeteorShower from "./MeteorShower.jsx";
const ProjectCardLazy = lazy(() => import("./components/ProjectCard.jsx"));
const CaseStudyLazy = lazy(() => import("./components/CaseStudy.jsx"));
const ResumeSectionLazy = lazy(() => import("./components/ResumeSection.jsx"));
const ExperienceSectionLazy = lazy(() =>
  import("./components/ExperienceSection.jsx")
);
import projects from "./data/projects.js";
import resumePdf from "./data/Resume.pdf";

function App() {
  const sections = useMemo(
    () => [
      { id: "home", label: "Home" },
      { id: "about", label: "About" },
      { id: "experience", label: "Experience" },
      { id: "resume", label: "Resume" },
      { id: "projects", label: "Projects" },
      { id: "contact", label: "Contact" },
    ],
    []
  );

  const [activeSection, setActiveSection] = useState("home");
  const [openCaseStudy, setOpenCaseStudy] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mount-on-demand: track which sections have been seen
  const mountedSectionsRef = useRef(new Set(["home"]));
  const isNarrowAtMountRef = useRef(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  const [, forceRerender] = useState(0);

  // Apply indigo theme on mount (hardcoded, no user configuration)
  useEffect(() => {
    document.documentElement.classList.add("theme-indigo");
    return () => document.documentElement.classList.remove("theme-indigo");
  }, []);

  // Detect prefers-reduced-motion and mobile breakpoint
  useEffect(() => {
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const update = () => {
      setPrefersReduced(mqReduced.matches);
      setIsMobile(mqMobile.matches);
    };
    update();
    mqReduced.addEventListener("change", update);
    mqMobile.addEventListener("change", update);
    return () => {
      mqReduced.removeEventListener("change", update);
      mqMobile.removeEventListener("change", update);
    };
  }, []);

  // Scroll tracking for parallax (rAF-throttled, passive)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--scroll-y",
          `${window.scrollY}px`
        );
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver for scrollspy + mount-on-demand
  useEffect(() => {
    const mountedRef = mountedSectionsRef;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            if (!mountedRef.current.has(entry.target.id)) {
              mountedRef.current.add(entry.target.id);
              forceRerender((n) => n + 1);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const target =
      rect.top + scrollTop - (window.innerHeight - rect.height) / 2;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  // Animation variants for sections
  const sectionVariants = prefersReduced
    ? undefined
    : {
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      };


  return (
    <div className="relative min-h-screen">
      {/* Gradient background */}
      <div className="fixed inset-0 gradient-sky z-0"></div>

      {/* Atmospheric glow — pure CSS, zero texture cost */}
      <AtmosphericGlow />

      {/* Stars + meteors — always on, respects prefers-reduced-motion */}
      <MeteorShower disabled={prefersReduced} density={0.7} fps={30} />

      <div className="relative z-20">
        {sections.map((section) => (
          <Section
            key={section.id}
            id={section.id}
            variants={sectionVariants}
            isMobile={isMobile}
          >
            {(section.id === "projects" ||
              isMobile ||
              isNarrowAtMountRef.current ||
              mountedSectionsRef.current.has(section.id) ||
              section.id === "home") && (
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-4">
                  {section.label}
                </h2>
                {section.id === "home" && (
                  <div>
                    <p className="text-lg text-white mb-4">
                      Welcome to my portfolio! Scroll to explore.
                    </p>
                    {prefersReduced ? (
                      <span className="text-2xl text-yellow-400 font-semibold">
                        Software Developer
                      </span>
                    ) : (
                      <TypeAnimation
                        sequence={[
                          "Software Developer",
                          1000,
                          "Full‑stack Developer",
                          1000,
                          "Frontend Engineer",
                          1000,
                        ]}
                        wrapper="span"
                        repeat={Infinity}
                        className="text-2xl text-yellow-400 font-semibold"
                      />
                    )}
                  </div>
                )}
                {section.id === "about" && (
                  <div className="max-w-5xl mx-auto grid gap-4 sm:grid-cols-2">
                    <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                      <h3 className="text-xl font-semibold mb-2">
                        Software Developer
                      </h3>

                      <p className="text-sm text-white/80">
                        CS Master's student at UB and former Software Developer
                        at Goodz, where I built and optimized production systems
                        across both web and mobile. I've led front-end
                        migrations to Angular, engineered high-performance UI
                        components, implemented real-time features with
                        WebSockets, and improved React Native app stability,
                        navigation, and build performance. I care deeply about
                        UX, performance, and delivering reliable experiences
                        under real constraints.
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        {[
                          "Angular",
                          "React Native",
                          "JavaScript / TypeScript",
                          "PHP + MySQL",
                          "WebSockets",
                          "Firebase (FCM)",
                          "Mobile Performance",
                          "UI/UX Engineering",
                          "Bitbucket / Git",
                          "OpenStreetMap APIs",
                        ].map((s) => (
                          <span
                            key={s}
                            className="px-2 py-1 rounded border border-white/15"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                      <h3 className="text-xl font-semibold mb-2">Now / Next</h3>
                      <ul className="text-sm text-white/80 space-y-1">
                        <li>
                          Now: Building CommitLife, SplitVoice, and PantryChef.
                        </li>
                        <li>
                          Next: Seeking Software Developer Internship — Winter
                          2026.
                        </li>
                      </ul>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <a
                          href={resumePdf}
                          className="btn-accent rounded-md px-3 py-1 text-xs"
                        >
                          Resume
                        </a>
                        <a
                          href="mailto:abdulrahman.hussain02@gmail.com"
                          className="rounded-md border border-white/20 hover:border-white/40 px-3 py-1 text-xs"
                        >
                          Email
                        </a>
                        <a
                          href="https://linkedin.com/in/abdul-rahman-hussain"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md border border-white/20 hover:border-white/40 px-3 py-1 text-xs"
                        >
                          LinkedIn
                        </a>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border border-white/10 bg-white/5 sm:col-span-2">
                      <h3 className="text-xl font-semibold mb-2">
                        What I care about
                      </h3>
                      <div className="grid sm:grid-cols-3 gap-3 text-sm text-white/80">
                        <div>
                          <div className="font-medium text-white">
                            Accessible‑first
                          </div>
                          <p className="text-white/70">
                            WCAG-friendly, keyboard/SR labels, motion‑safe
                            defaults.
                          </p>
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            Reliable & Tested
                          </div>
                          <p className="text-white/70">
                            Clean architecture, meaningful tests, performance
                            budgets.
                          </p>
                        </div>
                        <div>
                          <div className="font-medium text-white">Impact</div>
                          <p className="text-white/70">
                            Shipping features that solve real user problems.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {section.id === "experience" && (
                  <Suspense
                    fallback={<div className="text-white/70">Loading…</div>}
                  >
                    <ExperienceSectionLazy />
                  </Suspense>
                )}
                {section.id === "resume" && (
                  <div className="max-w-6xl mx-auto">
                    <Suspense
                      fallback={<div className="text-white/70">Loading…</div>}
                    >
                      <ResumeSectionLazy pdfUrl={resumePdf} showTitle={false} />
                    </Suspense>
                  </div>
                )}
                {section.id === "projects" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <Suspense
                      fallback={<div className="text-white/70">Loading…</div>}
                    >
                      {projects.map((p, i) => (
                        <ProjectCardLazy
                          key={p.title}
                          project={p}
                          index={i}

                          onOpenCaseStudy={() => setOpenCaseStudy(p)}
                        />
                      ))}
                    </Suspense>
                  </div>
                )}
                {section.id === "contact" && (
                  <div>
                    <p className="text-lg text-white mb-4">
                      Reach out to me via email or social media!
                    </p>
                    <div className="flex justify-center gap-6">
                      <a
                        href="mailto:abdulrahman.hussain02@gmail.com"
                        className="text-white hover:text-yellow-400 transition-colors"
                        aria-label="Send me an email"
                      >
                        <FaEnvelope size={32} />
                      </a>
                      <a
                        href="https://linkedin.com/in/abdul-rahman-hussain"
                        className="text-white hover:text-yellow-400 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit my LinkedIn profile"
                      >
                        <FaLinkedin size={32} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Section>
        ))}
      </div>

      {/* Desktop sidebar nav */}
      <nav className="hidden sm:flex fixed right-4 top-1/2 -translate-y-1/2 flex-col space-y-4 z-20">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`text-sm font-medium transition-colors ${
              activeSection === section.id
                ? "text-accent"
                : "text-white hover:text-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-white/30`}
          >
            {section.label}
          </button>
        ))}
      </nav>

      {/* Mobile sections button + panel */}
      <button
        onClick={() => setMobileNavOpen((v) => !v)}
        className="sm:hidden fixed bottom-4 left-4 z-30 rounded-full border border-white/20 bg-black/60 backdrop-blur px-3 py-2 text-sm text-white hover:border-white/40"
        title="Sections"
      >
        Sections
      </button>
      {mobileNavOpen && (
        <div
          className="sm:hidden fixed bottom-16 left-4 z-30 w-[min(92vw,360px)] rounded-xl border border-white/10 bg-black/70 backdrop-blur-md p-3 text-white shadow-2xl"
          role="dialog"
          aria-label="Sections"
        >
          <div className="mb-2 text-base font-semibold">Sections</div>
          <div className="grid grid-cols-2 gap-2">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setMobileNavOpen(false);
                  scrollToSection(s.id);
                }}
                className={`text-xs px-2 py-2 rounded-md border ${
                  activeSection === s.id
                    ? "border-white/40 text-accent"
                    : "border-white/20 hover:border-white/40"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setMobileNavOpen(false)}
              className="text-xs px-3 py-1 rounded-md border border-white/20 hover:border-white/40"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Case Study Modal */}
      <Suspense fallback={null}>
        <CaseStudyLazy
          project={openCaseStudy}
          onClose={() => setOpenCaseStudy(null)}
        />
      </Suspense>
    </div>
  );
}

// Lightweight pure-CSS atmospheric glow — replaces animated GIF parallax.
// Each div is a radial-gradient promoted to its own compositor layer.
// Transform changes on scroll are handled entirely on the GPU.
function AtmosphericGlow() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[4] hidden sm:block"
      aria-hidden="true"
    >
      {/* Violet nebula — upper left */}
      <div
        className="absolute rounded-full"
        style={{
          left: "-8vw",
          top: "4vh",
          width: "55vw",
          height: "55vw",
          background:
            "radial-gradient(closest-side, rgba(120,40,200,0.22), transparent)",
          transform:
            "translateY(calc(var(--scroll-y, 0px) * -0.025))",
          willChange: "transform",
        }}
      />
      {/* Amber accent — right side */}
      <div
        className="absolute rounded-full"
        style={{
          right: "-6vw",
          top: "28vh",
          width: "48vw",
          height: "48vw",
          background:
            "radial-gradient(closest-side, rgba(245,158,11,0.10), transparent)",
          transform:
            "translateY(calc(var(--scroll-y, 0px) * -0.04))",
          willChange: "transform",
        }}
      />
      {/* Deep indigo — bottom center */}
      <div
        className="absolute rounded-full"
        style={{
          left: "22vw",
          bottom: "-8vh",
          width: "52vw",
          height: "52vw",
          background:
            "radial-gradient(closest-side, rgba(75,0,130,0.28), transparent)",
          transform:
            "translateY(calc(var(--scroll-y, 0px) * -0.015))",
          willChange: "transform",
        }}
      />
    </div>
  );
}

// Section component with animation
function Section({ id, children, variants, isMobile }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const enableAnim = variants && !isMobile;
  const initialIsNarrow =
    typeof window !== "undefined" ? window.innerWidth <= 768 : false;
  const initialState = enableAnim && !initialIsNarrow ? "hidden" : "visible";
  const animateState = enableAnim
    ? isInView
      ? "visible"
      : "hidden"
    : "visible";

  return (
    <motion.section
      ref={ref}
      id={id}
      className="min-h-screen flex items-center justify-center p-[10%] content-auto"
      variants={enableAnim ? variants : undefined}
      initial={initialState}
      animate={animateState}
    >
      {children}
    </motion.section>
  );
}

export default App;
