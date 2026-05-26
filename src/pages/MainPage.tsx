import { JSX, useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import useEmblaCarousel from "embla-carousel-react";
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

const ChevronLeft = (): JSX.Element => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = (): JSX.Element => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function StoriesCarousel(): JSX.Element {
  const stories = useStories();
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    setSelectedIndex(prev => Math.max(0, prev - 1));
  }, []);

  const scrollNext = useCallback(() => {
    setSelectedIndex(prev => Math.min(stories.length - 1, prev + 1));
  }, [stories.length]);

  // Sync drag-based navigation on mobile
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  // After React renders new active class, recalculate Embla positions and scroll
  useLayoutEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(selectedIndex, true);
  }, [selectedIndex, emblaApi]);

  return (
    <Box className="main-page__carousel-wrapper">
      <button
        className="main-page__carousel-btn main-page__carousel-btn--prev"
        onClick={scrollPrev}
        aria-label="Précédent"
      >
        <ChevronLeft />
      </button>
      <Box className="main-page__carousel" ref={emblaRef}>
        <Box className="main-page__carousel-track">
          {stories.map((story, index) => (
            <Box
              key={story.id}
              className={`main-page__carousel-slide${index === selectedIndex ? " main-page__carousel-slide--active" : ""}`}
            >
              <StoryCard story={story} />
            </Box>
          ))}
        </Box>
      </Box>
      <button
        className="main-page__carousel-btn main-page__carousel-btn--next"
        onClick={scrollNext}
        aria-label="Suivant"
      >
        <ChevronRight />
      </button>
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
