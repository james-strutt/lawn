import TopNav from '@/components/nav/TopNav';
import { BrutalCard, BrutalButton } from '@/components/brutal';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-surface-secondary">
      <TopNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="font-display text-2xl sm:text-4xl font-bold uppercase text-center mb-8 sm:mb-12">
          Honest Pricing. Obviously.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <BrutalCard header="FREE" headerBg="black">
            <div className="text-center mb-6">
              <div className="font-display text-4xl font-bold mb-2">$0</div>
              <div className="font-mono text-sm text-gray-600">FOREVER</div>
            </div>

            <ul className="space-y-3 font-mono text-sm mb-8">
              <li>✓ Map exploration</li>
              <li>✓ Property search</li>
              <li>✓ Stamp duty calculator</li>
              <li>✓ FHB eligibility</li>
              <li>✓ Hazard data</li>
              <li>✓ 5 saved properties</li>
              <li>✓ 2 property comparison</li>
            </ul>

            <BrutalButton className="w-full">Sign Up Free</BrutalButton>
          </BrutalCard>

          {/* Pro Tier */}
          <BrutalCard header="PRO" headerBg="accent">
            <div className="text-center mb-6">
              <div className="font-display text-4xl font-bold mb-2">$29</div>
              <div className="font-mono text-sm text-gray-600">PER MONTH</div>
              <div className="font-mono text-xs text-gray-600 mt-1">14 DAY FREE TRIAL</div>
            </div>

            <div className="mb-4 font-mono text-sm font-bold">Everything in Free, plus:</div>

            <ul className="space-y-3 font-mono text-sm mb-8">
              <li>✓ Unlimited saved properties</li>
              <li>✓ Rental yield analysis</li>
              <li>✓ Cashflow projections</li>
              <li>✓ Tax position modelling</li>
              <li>✓ Unlimited comparison</li>
              <li>✓ Portfolio dashboard</li>
              <li>✓ Sales history (full)</li>
              <li>✓ 3 due diligence reports/month</li>
              <li>✓ PPTX + PDF export</li>
            </ul>

            <BrutalButton variant="primary" className="w-full">
              Start 14-Day Free Trial
            </BrutalButton>
          </BrutalCard>
        </div>

        {/* Report Credits */}
        <div className="mt-12">
          <BrutalCard header="REPORT CREDITS" headerBg="black">
            <p className="font-sans text-gray-700 mb-6">
              Need more reports? Top up anytime.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { reports: 5, price: 25, perReport: 5 },
                { reports: 15, price: 60, perReport: 4 },
                { reports: 50, price: 150, perReport: 3 },
              ].map((pack) => (
                <div
                  key={pack.reports}
                  className="border-brutal border-black bg-surface-secondary p-4 text-center"
                >
                  <div className="font-display text-2xl font-bold mb-1">
                    {pack.reports} REPORTS
                  </div>
                  <div className="font-display text-xl mb-2">${pack.price}</div>
                  <div className="font-mono text-xs text-gray-600 mb-4">
                    ${pack.perReport} each
                  </div>
                  <BrutalButton size="sm" className="w-full">
                    Buy
                  </BrutalButton>
                </div>
              ))}
            </div>

            <p className="font-mono text-sm text-gray-600 text-center mt-6">
              Credits never expire. Use them whenever you need them.
            </p>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
