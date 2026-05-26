import { useMemo, useCallback, useState, JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import IosShareIcon from "@mui/icons-material/IosShare";
import { useTranslation } from "react-i18next";
import TypewriterText from "../components/TypewriterText";
import TimerDisplay from "../components/TimerDisplay";
import QRModal from "../components/QRModal";
import { useStories } from "../hooks/useStories";
import "./IntroPage.less";

const QuillDoodle = (): JSX.Element => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M22 4 C22 4 16 8 10 18 L8 24 L14 22 C14 22 20 16 22 4Z"
      stroke="#9ca3af"
      strokeWidth="1.5"
      fill="none"
      strokeLinejoin="round"
    />
    <line
      x1="10"
      y1="18"
      x2="14"
      y2="22"
      stroke="#9ca3af"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default function IntroPage(): JSX.Element {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const stories = useStories();

  const story = useMemo(
    () => stories.find((s) => s.id === Number(storyId)),
    [stories, storyId],
  );

  const handleStart = useCallback(() => {
    navigate(`/story/${storyId}/level/1`);
  }, [navigate, storyId]);

  const handleBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const [qrOpen, setQrOpen] = useState(false);

  if (!story) {
    return (
      <Box className="intro-page intro-page--notfound">
        <Button onClick={handleBack}>{t("intro.back")}</Button>
      </Box>
    );
  }

  return (
    <Box className="intro-page">
      <Container maxWidth="md" className="intro-page__container">
        <Box className="intro-page__topbar">
          <Button
            variant="text"
            onClick={handleBack}
            className="intro-page__back-btn"
          >
            {t("intro.back")}
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => setQrOpen(true)} size="small" aria-label="Inviter">
              <IosShareIcon fontSize="small" />
            </IconButton>
            <TimerDisplay />
          </Box>
        </Box>

        <Box className="intro-page__content">
          <Box className="intro-page__label">
            <QuillDoodle />
            {/* <span>{t('intro.label')}</span> */}
          </Box>

          <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
            {story.title}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: "#6b7280", fontWeight: 400 }}>
            {story.subtitle}
          </Typography>

          <Box className="intro-page__story-card">
            <TypewriterText
              text={story.intro}
              speed={20}
              variant="body1"
              grow
              sx={{ lineHeight: 2, fontSize: "1.05rem" }}
            />
          </Box>
        </Box>

        <Box className="intro-page__footer">
          <Button
            variant="contained"
            onClick={handleStart}
            className="intro-page__cta"
            size="large"
          >
            {t("intro.clues")}
          </Button>
        </Box>
      </Container>

      <QRModal open={qrOpen} onClose={() => setQrOpen(false)} storyId={storyId!} />
    </Box>
  );
}
