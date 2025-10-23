import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import LandingPage from '../pages/LandingPage';
import Auth from '../pages/Auth';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import MachineDetails from '../pages/MachineDetails';
import AIAnalysis from '../pages/AIAnalysis';
import AnalysisReport from '../pages/AnalysisReport';
import ManageMachines from '../pages/ManageMachines';
import ManageOperators from '../pages/ManageOperators';
import ProtectedRoute from '../components/ProtectedRoute';
import Loader from '../components/Loader';

const AppRouter = () => {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/machine/:id" element={<MachineDetails />} />
          <Route path="/ai-analysis" element={<AIAnalysis />} />
          <Route path="/analysis-report" element={<AnalysisReport />} />
        </Route>

        <Route element={<ProtectedRoute ownerOnly={true} />}>
          <Route path="/admin/machines" element={<ManageMachines />} />
          <Route path="/admin/operators" element={<ManageOperators />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
