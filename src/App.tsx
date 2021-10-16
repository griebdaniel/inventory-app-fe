import './App.css';
import { StyledEngineProvider } from '@mui/system';
import SupplyEditor from './components/supply/SupplyEditor';

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <SupplyEditor />
    </StyledEngineProvider>
  );
}

export default App;
