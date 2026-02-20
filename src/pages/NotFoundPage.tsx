import { useNavigate } from 'react-router-dom';
import TopNav from '@/components/nav/TopNav';
import { BrutalButton, BrutalCard } from '@/components/brutal';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-secondary">
      <TopNav />
      <div className="max-w-2xl mx-auto px-6 py-20">
        <BrutalCard header="404 — NOT FOUND" headerBg="black">
          <div className="text-center py-8">
            <div className="font-display text-6xl font-bold mb-4">404</div>
            <p className="font-sans text-xl text-gray-700 mb-8">
              This page doesn't exist. Unlike your dream home.
            </p>
            <BrutalButton onClick={() => navigate('/')} variant="primary">
              Go Home
            </BrutalButton>
          </div>
        </BrutalCard>
      </div>
    </div>
  );
}
