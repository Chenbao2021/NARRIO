import { JSX, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Story } from "../data/stories";
import { useStories } from "../hooks/useStories";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "./MainPage.less";


const MagnifyDoodle = (): JSX.Element => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="13" cy="13" r="9" stroke="#9ca3af" strokeWidth="2" />
    <line
      x1="20"
      y1="20"
      x2="28"
      y2="28"
      stroke="#9ca3af"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const colorMap: Record<Story['colorKey'], { bg: string; border: string; badge: string }> =
  {
    yellow: { bg: "#fef9c3", border: "#ca8a04", badge: "#ca8a04" },
    blue: { bg: "#dbeafe", border: "#93c5fd", badge: "#3b82f6" },
    green: { bg: "#d1fae5", border: "#6ee7b7", badge: "#059669" },
    pink: { bg: "#fce7f3", border: "#f9a8d4", badge: "#db2777" },
  };

function StoryCard({ story }: { story: Story }): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = colorMap[story.colorKey];

  return (
    <Box
      className="main-page__card"
      sx={{ background: `linear-gradient(to bottom right, ${colors.bg}, #f3f4f6)`, borderColor: colors.border }}
    >
      <Box className="main-page__card-emoji" aria-hidden="true">
        {story.emoji}
      </Box>
      <Box className="main-page__card-body">
        <Typography variant="h4" className="main-page__card-title">
          {story.title}
        </Typography>
        <Typography className="main-page__card-sub">
          {story.subtitle}
        </Typography>
        <Box className="main-page__card-meta">
          <MagnifyDoodle />
          <Typography component="span" className="main-page__card-levels">
            {t('main.levels', { count: story.levels.length })}
          </Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        className="main-page__card-btn"
        onClick={() => navigate(`/story/${story.id}`)}
      >
        {t('main.start')}
      </Button>
    </Box>
  );
}

function StoriesCarousel(): JSX.Element {
  const { t } = useTranslation();
  const stories = useStories();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isFirstRender = useRef(true);

  // Center the active slide via native scroll-snap. Embla's transform-based
  // centering desynced whenever a slide's own width changed (our active/spine
  // swap), so we drive the browser's own scroll machinery instead.
  useEffect(() => {
    const slide = slideRefs.current[selectedIndex];
    if (!slide) return;
    slide.scrollIntoView({
      behavior: isFirstRender.current ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
    isFirstRender.current = false;
  }, [selectedIndex]);

  // While the user drags/swipes, detect the slide nearest the center once the scroll settles
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let settleTimeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(settleTimeout);
      settleTimeout = setTimeout(() => {
        const containerRect = track.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;
        slideRefs.current.forEach((slide, index) => {
          if (!slide) return;
          const rect = slide.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - containerCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });
        setSelectedIndex(prev => (prev === closestIndex ? prev : closestIndex));
      }, 120);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      clearTimeout(settleTimeout);
    };
  }, []);

  return (
    <Box className="main-page__carousel-wrapper">
      <Box className="main-page__carousel" ref={trackRef}>
        <Box className="main-page__carousel-track">
          {stories.map((story, index) => {
            const isActive = index === selectedIndex;
            return (
              <Box
                key={story.id}
                ref={(el: HTMLDivElement | null) => { slideRefs.current[index] = el; }}
                className={`main-page__carousel-slide${isActive ? " main-page__carousel-slide--active" : ""}`}
                onClick={isActive ? undefined : () => setSelectedIndex(index)}
                role={isActive ? undefined : "button"}
                tabIndex={isActive ? undefined : 0}
                aria-label={isActive ? undefined : t('main.selectStory', { title: story.title })}
                onKeyDown={isActive ? undefined : (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedIndex(index);
                  }
                }}
              >
                <StoryCard story={story} />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default function MainPage(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Box className="main-page">
      <LanguageSwitcher />
      <Container maxWidth="md" className="main-page__container">
        <Box className="main-page__header">
          <Typography variant="h2" className="main-page__title">
            Narrio
          </Typography>
          <Typography className="main-page__subtitle">
            {t('main.subtitle')}
          </Typography>
        </Box>

        <Box className="main-page__stories">
          <StoriesCarousel />
        </Box>

        <Typography className="main-page__hint">
          {t('main.hint')}
        </Typography>
      </Container>
    </Box>
  );
}
