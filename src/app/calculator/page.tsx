"use client";

import { useState, useMemo } from "react";
import {
  Calculator,
  TrendingUp,
  Home,
  Calendar,
  DollarSign,
  Info,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Link } from "react-router-dom";

function calcMonthlyPayment(P: number, annualRate: number, months: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return P / months;
  return (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export default function CalculatorPage() {
  const [propertyPrice, setPropertyPrice] = useState(12000000);
  const [annualRate, setAnnualRate] = useState(12);
  const [loanTermYears, setLoanTermYears] = useState(10);
  const [equityPct, setEquityPct] = useState(35);

  const months = loanTermYears * 12;

  const results = useMemo(() => {
    const monthly = calcMonthlyPayment(propertyPrice, annualRate, months);
    const totalPayment = monthly * months;
    const totalInterest = totalPayment - propertyPrice;
    const rentPortion = monthly * (1 - equityPct / 100);
    const equityPortion = monthly * (equityPct / 100);

    // Equity buildup data for chart
    const equityData = [];
    let equityBuilt = 0;
    for (let m = 1; m <= months; m++) {
      equityBuilt += equityPortion;
      if (m % 12 === 0) {
        equityData.push({
          year: `Yr ${m / 12}`,
          equity: Math.round(equityBuilt),
          remaining: Math.round(propertyPrice - equityBuilt),
        });
      }
    }

    return { monthly, totalPayment, totalInterest, rentPortion, equityPortion, equityData };
  }, [propertyPrice, annualRate, months, equityPct]);

  const pieData = [
    { name: "Rent Portion", value: Math.round(results.rentPortion), color: "#1a2332" },
    { name: "Equity Portion", value: Math.round(results.equityPortion), color: "#E63946" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Rent-to-Own Calculator</h1>
              <p className="text-gray-300 mt-0.5">See how renting can become owning.</p>
            </div>
          </div>

          {/* Formula display */}
          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4 inline-block">
            <p className="text-xs text-gray-400 mb-1 font-mono">Monthly Payment Formula</p>
            <p className="font-mono text-white text-sm">
              M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]
            </p>
            <p className="text-xs text-gray-500 mt-2">
              where P = Property price, r = monthly interest rate, n = number of months
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card">
              <h2 className="font-bold text-navy text-lg mb-6">Calculator Inputs</h2>

              <div className="space-y-6">
                {/* Property Price */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-navy">Property Price</label>
                    <span className="text-sm font-bold text-primary">
                      KES {propertyPrice.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2000000}
                    max={50000000}
                    step={500000}
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>KES 2M</span>
                    <span>KES 50M</span>
                  </div>
                  <input
                    type="number"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(Number(e.target.value))}
                    className="input-field mt-3 text-sm"
                  />
                </div>

                {/* Annual Interest Rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-navy flex items-center gap-1">
                      Annual Interest Rate
                      <Info className="w-3.5 h-3.5 text-gray-400" />
                    </label>
                    <span className="text-sm font-bold text-primary">{annualRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={25}
                    step={0.5}
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>5%</span>
                    <span>25%</span>
                  </div>
                </div>

                {/* Loan Term */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-navy">Loan Term</label>
                    <span className="text-sm font-bold text-primary">{loanTermYears} years</span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={25}
                    step={1}
                    value={loanTermYears}
                    onChange={(e) => setLoanTermYears(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>3 yrs</span>
                    <span>25 yrs</span>
                  </div>
                </div>

                {/* Equity Rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-navy flex items-center gap-1">
                      Equity Contribution
                      <Info className="w-3.5 h-3.5 text-gray-400" />
                    </label>
                    <span className="text-sm font-bold text-primary">{equityPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    step={5}
                    value={equityPct}
                    onChange={(e) => setEquityPct(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>10%</span>
                    <span>60%</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    % of monthly payment that builds ownership equity
                  </p>
                </div>
              </div>
            </div>

            {/* Quick presets */}
            <div className="card">
              <h3 className="font-semibold text-navy mb-3 text-sm">Quick Presets</h3>
              <div className="space-y-2">
                {[
                  { label: "Studio (Lavington)", price: 4500000, rate: 12, term: 5 },
                  { label: "2BR Apartment (Westlands)", price: 12000000, rate: 11, term: 10 },
                  { label: "3BR Apartment (Kilimani)", price: 18500000, rate: 10.5, term: 15 },
                  { label: "4BR Villa (Karen)", price: 45000000, rate: 10, term: 20 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setPropertyPrice(preset.price);
                      setAnnualRate(preset.rate);
                      setLoanTermYears(preset.term);
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <p className="text-sm font-medium text-navy">{preset.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      KES {(preset.price / 1000000).toFixed(1)}M · {preset.rate}% · {preset.term}yrs
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-5">
            {/* Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Monthly Payment", value: `KES ${Math.round(results.monthly).toLocaleString()}`, icon: Calendar, color: "text-primary bg-primary/10" },
                { label: "Equity / Month", value: `KES ${Math.round(results.equityPortion).toLocaleString()}`, icon: TrendingUp, color: "text-green-500 bg-green-50" },
                { label: "Total Cost", value: `KES ${(results.totalPayment / 1000000).toFixed(1)}M`, icon: DollarSign, color: "text-navy bg-navy/10" },
                { label: "Total Interest", value: `KES ${(results.totalInterest / 1000000).toFixed(1)}M`, icon: Home, color: "text-yellow-600 bg-yellow-50" },
              ].map((m) => (
                <div key={m.label} className="card !p-4">
                  <div className={`w-9 h-9 rounded-xl ${m.color} flex items-center justify-center mb-3`}>
                    <m.icon className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-black text-navy leading-tight">{m.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Payment breakdown pie */}
            <div className="card">
              <h2 className="font-bold text-navy text-lg mb-5">Monthly Payment Breakdown</h2>
              <div className="grid sm:grid-cols-2 gap-6 items-center">
                <div className="flex justify-center">
                  <PieChart width={200} height={200}>
                    <Pie
                      data={pieData}
                      cx={95}
                      cy={95}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`KES ${Number(v).toLocaleString()}`, ""]} />
                  </PieChart>
                </div>
                <div className="space-y-4">
                  {pieData.map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-bold text-navy">KES {item.value.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(item.value / Math.round(results.monthly)) * 100}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-navy">Total Monthly</span>
                      <span className="text-primary">KES {Math.round(results.monthly).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Equity Buildup Chart */}
            <div className="card">
              <h2 className="font-bold text-navy text-lg mb-5">Equity Buildup Over {loanTermYears} Years</h2>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={results.equityData}>
                  <defs>
                    <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E63946" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#E63946" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(v, name) => [`KES ${Number(v).toLocaleString()}`, name]} />
                  <Area type="monotone" dataKey="equity" name="Equity Built" stroke="#E63946" strokeWidth={2} fill="url(#eqGrad)" />
                  <Area type="monotone" dataKey="remaining" name="Remaining" stroke="#1a2332" strokeWidth={1.5} fill="none" strokeDasharray="4 2" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex gap-6 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-4 h-1 bg-primary rounded inline-block" />Equity Built</span>
                <span className="flex items-center gap-1.5"><span className="w-4 h-1 bg-navy rounded inline-block" style={{ border: "1px dashed #1a2332", background: "none" }} />Remaining Balance</span>
              </div>
            </div>

            {/* CTA */}
            <div className="card bg-gradient-to-br from-navy to-navy-light text-white text-center p-8">
              <h3 className="text-xl font-bold mb-2">Ready to start your ownership journey?</h3>
              <p className="text-gray-300 text-sm mb-6">Browse rent-to-own properties and apply today.</p>
              <div className="flex gap-3 justify-center">
                <Link to="/properties?type=rent-to-own" className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors">
                  Browse Rent-to-Own
                </Link>
                <Link to="/register" className="bg-white/10 border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors">
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
