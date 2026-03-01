import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '@/components/nav/TopNav';
import { BrutalButton, BrutalInput, BrutalCard, BrutalMetric, BrutalBadge, AnimatedLawnLogo } from '@/components/brutal';

export default function LandingPage() {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');

  const handleExplore = () => {
    if (address.trim()) {
      navigate(`/explore?address=${encodeURIComponent(address)}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b-brutal border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center">
            {/* Animated Logo */}
            <div className="flex justify-center mb-8">
              <AnimatedLawnLogo size="lg" autoPlay={true} loop={true} duration={2} />
            </div>

            {/* Tagline */}
            <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold uppercase tracking-wide sm:tracking-widest mb-4">
              Level the Playing Field.
              <br />
              Take Back Your Turf.
            </h1>

            <p className="font-sans text-lg sm:text-xl text-gray-700 mb-8 sm:mb-12 max-w-2xl mx-auto">
              Whether you're looking to buy or rent, a house or apartment,
              Lawn brings the power of analysis and AI to your fingertips.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <BrutalInput
                  placeholder="ENTER ANY NSW ADDRESS TO START..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleExplore()}
                  className="flex-1"
                />
                <BrutalButton onClick={handleExplore} variant="primary" size="lg">
                  Explore
                </BrutalButton>
              </div>
            </div>

            {/* Free Trial Badge */}
            <BrutalBadge variant="accent" className="text-xs sm:text-base px-3 sm:px-6 py-2 sm:py-3">
              14 DAY FREE TRIAL — NO CARD REQUIRED
            </BrutalBadge>
          </div>
        </div>
      </section>

      {/* Every Number Exposed */}
      <section className="py-12 sm:py-20 bg-surface-secondary border-b-brutal border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase text-center mb-8 sm:mb-12">
            Every Number. Exposed.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BrutalCard header="STAMP DUTY" headerBg="black">
              <BrutalMetric label="TOTAL" value="$33,490" />
              <div className="mt-4 space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bracket:</span>
                  <span>$372K–$1.24M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base:</span>
                  <span>$11,152</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">+ 4.5% excess</span>
                  <span>$22,338</span>
                </div>
              </div>
              <button className="mt-4 font-mono text-xs uppercase text-brand-accent font-bold">
                ☑ Show Working
              </button>
            </BrutalCard>

            <BrutalCard header="HIDDEN COSTS" headerBg="black">
              <BrutalMetric label="TOTAL" value="$6,350" />
              <div className="mt-4 space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Legal:</span>
                  <span>$2,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Inspect:</span>
                  <span>$850</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valuation:</span>
                  <span>$500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan app:</span>
                  <span>$600</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">LMI:</span>
                  <span>$1,900</span>
                </div>
              </div>
            </BrutalCard>

            <BrutalCard header="YOUR ACTUAL REPAYMENT" headerBg="black">
              <BrutalMetric label="MONTHLY" value="$4,890" detail="P&I @ 6.5% variable" />
              <div className="mt-4 space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan term:</span>
                  <span>30 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total interest:</span>
                  <span className="text-semantic-negative">$910,000</span>
                </div>
                <div className="flex justify-between border-t-2 border-black pt-2">
                  <span className="text-gray-600 font-bold">Total paid:</span>
                  <span className="font-bold">$1,760,000</span>
                </div>
              </div>
            </BrutalCard>
          </div>

          <p className="text-center font-sans text-lg text-gray-700 mt-12">
            Other property sites show you a price.
            <br />
            <strong>Lawn shows you every dollar it actually costs.</strong>
          </p>
        </div>
      </section>

      {/* Three Pathways */}
      <section className="py-12 sm:py-20 bg-white border-b-brutal border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <BrutalCard header="FIRST HOME" headerBg="accent">
              <h3 className="font-display text-2xl font-bold mb-4">"WHAT CAN I AFFORD?"</h3>
              <ul className="space-y-2 font-mono text-sm mb-6">
                <li>✓ Stamp duty exemptions</li>
                <li>✓ FHOG eligibility</li>
                <li>✓ Affordability calculator</li>
                <li>✓ Hidden cost breakdown</li>
                <li>✓ Hazard risk check</li>
              </ul>
              <BrutalButton onClick={() => navigate('/explore?tool=rent-vs-buy&fhb=true')} className="w-full">
                Start Free →
              </BrutalButton>
            </BrutalCard>

            <BrutalCard header="INVESTOR" headerBg="accent">
              <h3 className="font-display text-2xl font-bold mb-4">"WHAT'S THE YIELD?"</h3>
              <ul className="space-y-2 font-mono text-sm mb-6">
                <li>✓ Rental yield analysis</li>
                <li>✓ Cashflow projections</li>
                <li>✓ Negative gearing + tax</li>
                <li>✓ LTR vs STR comparison</li>
                <li>✓ Portfolio land tax</li>
                <li>✓ Due diligence reports</li>
              </ul>
              <BrutalButton onClick={() => navigate('/explore?tool=rent-vs-buy')} className="w-full">
                Start Free →
              </BrutalButton>
            </BrutalCard>
          </div>

          <BrutalCard header="EXPLORE" headerBg="white">
            <h3 className="font-display text-2xl font-bold mb-2">"SHOW ME THE MAP"</h3>
            <p className="font-sans text-gray-700 mb-4">
              Search any address. See zoning, flood risk, bushfire prone areas, heritage items,
              transport, schools — all on one map. No login needed.
            </p>
            <BrutalButton onClick={() => navigate('/explore')} className="w-full">
              Open Map →
            </BrutalButton>
          </BrutalCard>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 sm:py-20 bg-surface-secondary border-b-brutal border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase mb-8">
            Built on Government Data. Not Guesswork.
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {['NSW SPATIAL SERVICES', 'REVENUE NSW', 'TRANSPORT NSW', 'PLANNING PORTAL'].map(
              (source) => (
                <div
                  key={source}
                  className="border-brutal border-black bg-white p-4 shadow-brutal font-mono text-xs font-bold"
                >
                  {source}
                </div>
              )
            )}
          </div>

          <p className="font-sans text-lg text-gray-700">
            Every number on Lawn comes from official NSW government sources.
            <br />
            <strong>We show our working. Always.</strong>
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 sm:py-20 bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase mb-8">
            Stop Guessing. Start Knowing.
          </h2>

          <div className="max-w-xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <BrutalInput
                placeholder="ENTER YOUR EMAIL TO START..."
                className="flex-1 bg-white"
              />
              <BrutalButton variant="primary" size="lg">
                Go
              </BrutalButton>
            </div>
          </div>

          <p className="font-mono text-sm">
            14 days free. No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-brutal border-black bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="font-mono text-sm mb-4 md:mb-0">
              LAWN | About | Privacy | Terms | Contact
            </div>
            <div className="font-mono text-sm text-gray-600">
              © 2026 Lawn. Built in Sydney.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
