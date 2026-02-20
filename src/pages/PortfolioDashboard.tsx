import { useState, useEffect } from 'react';
import TopNav from '@/components/nav/TopNav';
import { BrutalCard, BrutalMetric, BrutalButton } from '@/components/brutal';
import { useUserStore } from '@/stores/userStore';
import authService from '@/services/supabase/authService';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { TrendingUp, Home, DollarSign } from 'lucide-react';

export default function PortfolioDashboard() {
  const { user, isAuthenticated } = useUserStore();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadPortfolio();
    }
  }, [isAuthenticated]);

  const loadPortfolio = async () => {
    try {
      const saved = await authService.getSavedProperties();
      setProperties(saved || []);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate portfolio metrics
  const totalValue = properties.reduce(
    (sum, p) => sum + (p.property_value || 0),
    0
  );

  const totalRent = properties.reduce(
    (sum, p) => sum + (p.weekly_rent || 0) * 52,
    0
  );

  const averageYield = totalValue > 0 ? (totalRent / totalValue) * 100 : 0;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-secondary">
        <TopNav />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <BrutalCard header="AUTHENTICATION REQUIRED">
            <p className="font-sans text-lg mb-4">
              Please sign in to access your portfolio dashboard.
            </p>
            <BrutalButton variant="primary">Sign In</BrutalButton>
          </BrutalCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary">
      <TopNav />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl font-bold uppercase mb-8">
          Portfolio Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <BrutalCard header="TOTAL VALUE" headerBg="accent">
            <div className="flex items-start gap-3">
              <Home className="mt-1" size={24} />
              <BrutalMetric
                label={`${properties.length} PROPERTIES`}
                value={formatCurrency(totalValue)}
              />
            </div>
          </BrutalCard>

          <BrutalCard header="ANNUAL RENT" headerBg="accent">
            <div className="flex items-start gap-3">
              <DollarSign className="mt-1" size={24} />
              <BrutalMetric
                label="RENTAL INCOME"
                value={formatCurrency(totalRent)}
                detail={`${formatCurrency(totalRent / 12)}/month`}
              />
            </div>
          </BrutalCard>

          <BrutalCard header="PORTFOLIO YIELD" headerBg="accent">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-1" size={24} />
              <BrutalMetric
                label="AVERAGE YIELD"
                value={formatPercent(averageYield)}
                variant={averageYield >= 4 ? 'success' : 'default'}
              />
            </div>
          </BrutalCard>
        </div>

        {/* Properties List */}
        <BrutalCard header="YOUR PROPERTIES">
          {loading ? (
            <div className="text-center py-8 font-mono">Loading...</div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8">
              <p className="font-sans text-gray-600 mb-4">
                No properties in your portfolio yet.
              </p>
              <BrutalButton href="/explore">Explore Properties</BrutalButton>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="border-2 border-black p-4 hover:bg-surface-secondary transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-sans font-medium mb-1">
                        {property.address}
                      </h3>
                      <div className="font-mono text-xs text-gray-600">
                        {property.zone && `Zone: ${property.zone}`}
                        {property.area && ` • ${property.area} m²`}
                      </div>
                    </div>
                    <div className="text-right">
                      {property.property_value && (
                        <div className="font-mono font-bold">
                          {formatCurrency(property.property_value)}
                        </div>
                      )}
                      {property.weekly_rent && (
                        <div className="font-mono text-sm text-gray-600">
                          ${property.weekly_rent}/wk
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </BrutalCard>
      </div>
    </div>
  );
}
