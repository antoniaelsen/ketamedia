import { Visualizer } from "./Visualizer";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { AppBar } from "./components/AppBar";
import { InfoPanel } from "./components/InfoPanel";
import { useAudioGraph } from "./audio/setup";

function App() {
  useAudioGraph();

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar />
        <Visualizer />

        <InfoPanel />
      </ThemeProvider>
    </>
  );
}

export default App;
