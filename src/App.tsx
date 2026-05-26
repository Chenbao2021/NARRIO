import React, { Suspense, JSX } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useParams,
} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { StyledEngineProvider, CssBaseline } from "@mui/material";
import { TimerProvider } from "./context/TimerContext";
import ScrollToTop from "./components/ScrollToTop";
import NavigationProgress from "./components/NavigationProgress";
import PageLoader from "./components/PageLoader";
import "./index.less";

const MainPage = React.lazy(() => import("./pages/MainPage"));
const IntroPage = React.lazy(() => import("./pages/IntroPage"));
const LevelPage = React.lazy(() => import("./pages/LevelPage"));

const theme = createTheme({
  palette: {
    background: { default: "#faf9f7", paper: "#fffef9" },
    primary: { main: "#2d2d2d" },
    secondary: { main: "#ca8a04" },
    text: { primary: "#2d2d2d", secondary: "#6b7280" },
  },
  typography: {
    fontFamily: '"Nunito", sans-serif',
    h1: { fontFamily: '"Caveat", cursive' },
    h2: { fontFamily: '"Caveat", cursive' },
    h3: { fontFamily: '"Caveat", cursive' },
    h4: { fontFamily: '"Caveat", cursive' },
    h5: { fontFamily: '"Caveat", cursive' },
    h6: { fontFamily: '"Caveat", cursive' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { background: "#faf9f7" } },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontFamily: '"Caveat", cursive',
          fontSize: "1.1rem",
          borderRadius: "4px 9px 6px 4px",
          transition: "all 0.15s ease",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
        contained: {
          border: "2px solid #2d2d2d",
          boxShadow: "3px 3px 0 rgba(0,0,0,0.12)",
          "&:hover": {
            boxShadow: "5px 5px 0 rgba(0,0,0,0.15)",
          },
        },
        outlined: {
          boxShadow: "2px 2px 0 rgba(0,0,0,0.06)",
        },
      },
    },
  },
});

function Layout(): JSX.Element {
  return (
    <>
      <ScrollToTop />
      <NavigationProgress />
      <Outlet />
    </>
  );
}

function StoryShell(): JSX.Element {
  const { storyId } = useParams();
  return (
    <TimerProvider key={storyId}>
      <Outlet />
    </TimerProvider>
  );
}

export default function App(): JSX.Element {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<MainPage />} />
                <Route path="/story" element={<StoryShell />}>
                  <Route path=":storyId" element={<IntroPage />} />
                  <Route
                    path=":storyId/level/:levelId"
                    element={<LevelPage />}
                  />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
