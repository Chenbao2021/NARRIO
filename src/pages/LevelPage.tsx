import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  JSX,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import IosShareIcon from "@mui/icons-material/IosShare";
import { useTranslation } from "react-i18next";
import TypewriterText from "../components/TypewriterText";
import TimerDisplay from "../components/TimerDisplay";
import QuizModal from "../components/QuizModal";
import QRModal from "../components/QRModal";
import { useTimer, formatElapsed } from "../context/TimerContext";
import { useStories } from "../hooks/useStories";
import "./LevelPage.less";

const CheckDoodle = (): JSX.Element => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="28"
      cy="28"
      r="24"
      stroke="#ca8a04"
      strokeWidth="2"
      fill="#fef9c3"
    />
    <path
      d="M16 28 L24 36 L40 20"
      stroke="#ca8a04"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function LevelPage(): JSX.Element {
  const { storyId, levelId } = useParams<{
    storyId: string;
    levelId: string;
  }>();
  const navigate = useNavigate();
  const { elapsed } = useTimer();
  const cardRef = useRef<HTMLDivElement>(null);

  const stories = useStories();
  const story = useMemo(
    () => stories.find((s) => s.id === Number(storyId)),
    [stories, storyId],
  );

  const level = useMemo(
    () => story?.levels.find((l) => l.id === Number(levelId)),
    [story, levelId],
  );

  const nextLevel = useMemo(
    () => story?.levels.find((l) => l.id === (level?.id ?? 0) + 1),
    [story, level],
  );

  const isLastLevel = useMemo(
    () =>
      story &&
      level &&
      level.id === story.levels[story.levels.length - 1]?.id,
    [story, level],
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  useEffect(() => {
    cardRef.current?.scrollTo(0, 0);
  }, [levelId]);

  const handleNext = useCallback(() => {
    if (!story || !level || !nextLevel) return;
    if (level.choices) {
      setModalOpen(true);
    } else {
      navigate(`/story/${storyId}/level/${nextLevel.id}`);
    }
  }, [story, level, nextLevel, navigate, storyId]);

  const handleModalConfirm = useCallback(() => {
    setModalOpen(false);
    if (!story || !level || !nextLevel) return;
    navigate(`/story/${storyId}/level/${nextLevel.id}`);
  }, [story, level, nextLevel, navigate, storyId]);

  const handleBack = useCallback(() => {
    if (!level) return;
    if (level.id === 1) {
      navigate(`/story/${storyId}`);
    } else {
      navigate(`/story/${storyId}/level/${level.id - 1}`);
    }
  }, [level, navigate, storyId]);

  const handleFinish = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const { t } = useTranslation();

  if (!story || !level) {
    return (
      <Box sx={{ p: 3 }}>
        <Button onClick={() => navigate("/")}>{t('level.backHome')}</Button>
      </Box>
    );
  }

  const elapsedLabel = formatElapsed(elapsed);

  return (
    <Box
      className="level-page"
      sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      <Container
        maxWidth="md"
        className="level-page__container"
        sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
      >
        <Box className="level-page__sticky-header" sx={{ flexShrink: 0 }}>
          <Box className="level-page__topbar">
            <Box className="level-page__breadcrumb">
              <Typography
                component="span"
                className="level-page__breadcrumb-label"
              >
                {story.title}
              </Typography>
              <Typography component="span" className="level-page__breadcrumb-sep">
                /
              </Typography>
              <Typography
                component="span"
                className="level-page__breadcrumb-current"
              >
                {level.title}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={() => setQrOpen(true)} size="small" aria-label="Inviter">
                <IosShareIcon fontSize="small" />
              </IconButton>
              <TimerDisplay />
            </Box>
          </Box>

          <Box className="level-page__progress">
            {story.levels.map((l) => (
              <Box
                key={l.id}
                className={[
                  "level-page__pip",
                  l.id < level.id ? "level-page__pip--done" : "",
                  l.id === level.id ? "level-page__pip--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            ))}
          </Box>

          <TypewriterText
            text={level.title}
            speed={20}
            variant="h3"
            sx={{ mb: 2, fontWeight: 700 }}
          />

          {isLastLevel && (
            <Box className="level-page__completion-badge">
              <CheckDoodle />
              <Typography className="level-page__completion-text">
                {t('level.elapsed', { time: elapsedLabel })}
              </Typography>
            </Box>
          )}
        </Box>

        <Box ref={cardRef} className="level-page__card" sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <TypewriterText
            text={level.description}
            speed={18}
            variant="body1"
            sx={{ lineHeight: 2.2, fontSize: "1.05rem" }}
          />
        </Box>

        <Box className="level-page__footer">
          <Button
            variant="outlined"
            onClick={handleBack}
            className="level-page__btn level-page__btn--back"
          >
            {t('level.back')}
          </Button>

          {isLastLevel ? (
            <Button
              variant="contained"
              onClick={handleFinish}
              className="level-page__btn level-page__btn--finish"
            >
              {t('level.finish')}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              className="level-page__btn level-page__btn--next"
            >
              {level.choices
                ? t('level.nextQuiz', { title: nextLevel?.title ?? t('level.nextFallback') })
                : t('level.nextArrow', { title: nextLevel?.title ?? t('level.nextFallback') })}
            </Button>
          )}
        </Box>
      </Container>

      <QuizModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
        choices={level.choices ?? []}
        correctAnswer={level.correctAnswer ?? 0}
      />

      <QRModal open={qrOpen} onClose={() => setQrOpen(false)} storyId={storyId!} />
    </Box>
  );
}
