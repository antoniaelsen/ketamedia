import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Visualizer } from "./Visualizer";
import { AppBar } from "./components/AppBar";
import { InfoPanel } from "./components/InfoPanel";
import { theme } from "./components/theme";

const queryClient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme} defaultMode="system">
          <CssBaseline />
          <AppBar />
          <Visualizer />

          <InfoPanel />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
