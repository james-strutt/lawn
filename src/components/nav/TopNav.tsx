import { Link } from 'react-router-dom';
import { BrutalButton } from '@/components/brutal';
import { useUserStore } from '@/stores/userStore';

export default function TopNav() {
  const { isAuthenticated, user } = useUserStore();

  return (
    <nav className="border-b-brutal border-black bg-white sticky top-0 z-50 shadow-brutal-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="font-display text-2xl font-bold tracking-widest">
              LAWN
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/explore"
              className="font-mono text-sm uppercase font-medium hover:text-brand-accent transition-colors"
            >
              Explore
            </Link>
            <Link
              to="/explore?tool=rent-vs-buy"
              className="font-mono text-sm uppercase font-medium hover:text-brand-accent transition-colors"
            >
              Rent vs Buy
            </Link>
            <Link
              to="/pricing"
              className="font-mono text-sm uppercase font-medium hover:text-brand-accent transition-colors"
            >
              Pricing
            </Link>
            {isAuthenticated && (
              <Link
                to="/portfolio"
                className="font-mono text-sm uppercase font-medium hover:text-brand-accent transition-colors"
              >
                Portfolio
              </Link>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="font-mono text-xs uppercase text-gray-600">
                  {user.email}
                </span>
                <BrutalButton size="sm">Settings</BrutalButton>
              </>
            ) : (
              <>
                <button className="font-mono text-sm uppercase font-medium hover:text-brand-accent transition-colors">
                  Sign In
                </button>
                <BrutalButton variant="primary" size="sm">
                  Start Free Trial
                </BrutalButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
