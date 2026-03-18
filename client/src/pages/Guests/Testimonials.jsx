import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import kiba from "../../assets/testimonials/kiba.png";
import kakashi from "../../assets/testimonials/kakashi.png";
import jiraiya from "../../assets/testimonials/jiraiya.png";
import tsunade from "../../assets/testimonials/tsunade.png";
import shino from "../../assets/testimonials/shino.png";
import orochimaru from "../../assets/testimonials/orochimaru.png";
gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Kiba Inuzuka",
    role: "Rescue Adopter",
    image: kiba,
    quote:
      "Growing up with Akamaru taught me loyalty isn't trained it's built. Adoption should always be about trust, not convenience.",
    color: "#1a0f2e",
    accent: "#8b5cf6",
  },
  {
    name: "Hatake Kakashi",
    role: "Shelter Partner",
    image: kakashi,
    quote:
      "Summoning dogs requires patience and respect. Real bonds form only when both sides are ready the same applies to adoption.",
    color: "#0f0a1a",
    accent: "#ef4444",
  },
  {
    name: "Jiraiya",
    role: "Animal Welfare Advocate",
    image: jiraiya,
    quote:
      "The toads taught me wisdom comes with responsibility. A companion isn't chosen for strength, but for compatibility.",
    color: "#0a1a0f",
    accent: "#10b981",
  },
  {
    name: "Tsunade Senju",
    role: "Long-Term Adopter",
    image: tsunade,
    quote:
      "Katsuyu reminds us that care doesn't stop after the decision. True adoption means staying especially when it gets hard.",
    color: "#1a1408",
    accent: "#f59e0b",
  },
  {
    name: "Shino Aburame",
    role: "Rescue Specialist",
    image: shino,
    quote:
      "Understanding animals means listening without words. Adoption works best when observation comes before action.",
    color: "#081a1a",
    accent: "#06b6d4",
  },
  {
    name: "Orochimaru",
    role: "Exotic Companion Guardian",
    image: orochimaru,
    quote:
      "Snakes taught me that trust is not loud or expressive. It is quiet, observant, and earned over time. True companionship is built through patience, not control.",
    color: "#0a0f1a",
    accent: "#22c55e",
  },
];

const Testimonials = () => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const sectionsRef = useRef([]);
  const imageRefs = useRef([]);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollHint(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * testimonials.length}`,
        pin: true,
        scrub: 1,

        onEnter: () => setShowIndicator(true),
        onEnterBack: () => setShowIndicator(true),
        onLeave: () => setShowIndicator(false),
        onLeaveBack: () => setShowIndicator(false),

        onUpdate: (self) => {
          const index = Math.min(
            testimonials.length - 1,
            Math.floor(self.progress * testimonials.length),
          );
          setActiveIndex(index);
        },
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const currentTestimonial = testimonials[activeIndex];

  return (
    <>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px 60px",
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          background:
            "radial-gradient(circle at 50% 40%, #0f1f33 0%, #081423 40%, #03070c 75%, #000 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 50%, rgba(159, 180, 207, 0.08) 0%, transparent 50%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div style={{ maxWidth: "1000px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "32px",
              lineHeight: 1.15,
              background: "linear-gradient(135deg, #ffffff 0%, #9fb4cf 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Stories That Speak
            <br />
            Without Saying Much
          </h1>

          <p
            style={{
              fontSize: "clamp(1.1rem, 2.2vw, 1.3rem)",
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 1.85,
              maxWidth: "680px",
              margin: "0 auto",
              fontWeight: 300,
            }}
          >
            Quiet moments. Deep bonds. Real voices from those who found
            connection through patience, not pressure.
          </p>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: showScrollHint ? 1 : 0,
            transition: "opacity 0.5s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.5)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Scroll to explore
          </span>
          <ChevronDown
            size={24}
            style={{
              color: currentTestimonial.accent,
              animation: "bounce 2s infinite",
            }}
          />
        </div>
      </section>

      <div
        ref={containerRef}
        style={{
          backgroundColor: currentTestimonial.color,
          position: "relative",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 30% 50%, ${currentTestimonial.accent}15 0%, transparent 50%)`,
            pointerEvents: "none",
            transition: "background 0s",
            zIndex: 0,
          }}
        />

        <section style={{ height: "100vh", position: "relative", zIndex: 1 }}>
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              height: "100%",
              padding: "0 80px",
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: activeIndex === i ? 1 : 0,
                  transform:
                    activeIndex === i
                      ? "scale(1)"
                      : i < activeIndex
                        ? "scale(0.9) translateY(-40px)"
                        : "scale(1.05) translateY(40px)",
                  transition: "all 0.6s ease",
                  pointerEvents: activeIndex === i ? "auto" : "none",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      i % 2 === 0 ? "1fr 1.2fr" : "1.2fr 1fr",
                    gap: "80px",
                    alignItems: "center",
                    width: "100%",
                  }}
                  className="testimonial-grid"
                >
                  <div
                    style={{
                      order: i % 2 === 0 ? 1 : 2,
                      position: "relative",
                      height: "600px",
                      borderRadius: "32px",
                      overflow: "hidden",
                      boxShadow: `0 40px 120px ${t.accent}30`,
                    }}
                    className="image-container"
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(135deg, ${t.accent}40 0%, transparent 100%)`,
                        zIndex: 1,
                      }}
                    />
                    <img
                      ref={(el) => (imageRefs.current[i] = el)}
                      src={t.image}
                      alt={t.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        bottom: "32px",
                        right: "32px",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: `${t.accent}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: "#fff",
                        zIndex: 2,
                      }}
                    >
                      {i + 1}
                    </div>
                  </div>

                  <div
                    style={{
                      order: i % 2 === 0 ? 2 : 1,
                    }}
                    className="content-container"
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "4px",
                        background: t.accent,
                        marginBottom: "32px",
                        borderRadius: "2px",
                      }}
                    />

                    <blockquote
                      style={{
                        fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                        lineHeight: 1.5,
                        fontStyle: "normal",
                        marginBottom: "48px",
                        color: "#ffffff",
                        fontWeight: 400,
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: "-40px",
                          top: "-20px",
                          fontSize: "6rem",
                          color: `${t.accent}30`,
                          fontFamily: "Georgia, serif",
                          lineHeight: 1,
                        }}
                      >
                        "
                      </span>
                      {t.quote}
                    </blockquote>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          width: "50px",
                          height: "2px",
                          background: `${t.accent}60`,
                        }}
                      />
                      <div>
                        <p
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            marginBottom: "4px",
                            color: "#ffffff",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {t.name}
                        </p>
                        <p
                          style={{
                            color: t.accent,
                            fontSize: "1rem",
                            fontWeight: 500,
                            letterSpacing: "0.05em",
                          }}
                        >
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {showIndicator && (
          <div
            style={{
              position: "fixed",
              right: "40px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              padding: "24px 16px",
              background: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
              borderRadius: "50px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            className="progress-indicator"
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  width: "4px",
                  height: activeIndex === i ? "56px" : "28px",
                  background:
                    activeIndex === i
                      ? currentTestimonial.accent
                      : "rgba(255,255,255,0.25)",
                  borderRadius: "4px",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  boxShadow:
                    activeIndex === i
                      ? `0 0 20px ${currentTestimonial.accent}80`
                      : "none",
                }}
                onClick={() => {
                  sectionsRef.current[i]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
              />
            ))}
          </div>
        )}

        <style>
          {`
            @keyframes bounce {
              0%,
              100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(10px);
              }
            }

            @media (max-width: 768px) {
              .testimonial-grid {
                grid-template-columns: 1fr !important;
                gap: 40px !important;
              }

              .image-container {
                order: 1 !important;
                height: 400px !important;
              }

              .content-container {
                order: 2 !important;
              }

              .progress-indicator {
                display: none !important;
              }
            }
          `}{" "}
        </style>
      </div>
    </>
  );
};

export default Testimonials;
