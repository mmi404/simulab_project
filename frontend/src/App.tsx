import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SimulationExplorer from './pages/SimulationExplorer';
import SimulationWorkspace from './pages/SimulationWorkspace';
import Layout from './components/Layout';
import { CpuScheduling } from './pages/simulations/CpuScheduling';
import DeadlockDetection from './pages/simulations/DeadlockDetection';
import { BankersAlgorithm } from './pages/simulations/BankersAlgorithm';
import GraphTraversal from './pages/GraphTraversal';
import SortingSimulation from './pages/simulations/SortingSimulation';
import AuthParams from './pages/AuthParams'; // Placeholder for Login/Register
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="explore" element={<SimulationExplorer />} />

            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="simulation/:id" element={<SimulationWorkspace />} />
              <Route path="sim/cpu-scheduling" element={<CpuScheduling />} />
              <Route path="sim/deadlock-detection" element={<DeadlockDetection />} />
              <Route path="sim/bankers-algorithm" element={<BankersAlgorithm />} />
              <Route path="sim/graph-traversal" element={<GraphTraversal />} />
              <Route path="sim/sorting" element={<SortingSimulation />} />
            </Route>

            {/* Auth routes */}
            <Route path="login" element={<AuthParams type="login" />} />
            <Route path="register" element={<AuthParams type="register" />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
