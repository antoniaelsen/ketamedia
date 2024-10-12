import { Visualizer } from "./Visualizer";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppBar } from "./components/AppBar";
import { InfoPanel } from "./components/InfoPanel";
import { theme } from "./components/theme";

function App() {
  return (
    <>
      <ThemeProvider theme={theme} defaultMode="system">
        <CssBaseline />
        <AppBar />
        <Visualizer />

        <InfoPanel />
      </ThemeProvider>
    </>
  );
}

export default App;
