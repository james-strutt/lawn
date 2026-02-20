import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import ExplorePage from '@/pages/ExplorePage';
import PricingPage from '@/pages/PricingPage';
import PortfolioDashboard from '@/pages/PortfolioDashboard';
import NotFoundPage from '@/pages/NotFoundPage';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/first-home" element={<Navigate to="/explore?tool=rent-vs-buy&fhb=true" replace />} />
      <Route path="/investor" element={<Navigate to="/explore?tool=rent-vs-buy" replace />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/portfolio" element={<PortfolioDashboard />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
