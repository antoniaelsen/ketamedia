import { Visualizer } from "./Visualizer";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { AppBar } from "./components/AppBar";
import { InfoDrawer } from "./components/InfoDrawer";

function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AppBar />
        <Visualizer />

        <InfoDrawer />
      </ThemeProvider>
    </>
  );
}

export default App;
