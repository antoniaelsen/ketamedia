import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";

function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}></ThemeProvider>
    </>
  );
}

export default App;
