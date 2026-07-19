import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";

// Pulls the first meaningful number out of strings like "₹1.42 Cr" or "₹85 Lakh"
function parsePriceToNumber(priceStr) {
  if (!priceStr) return 5000000;
  const cleaned = priceStr.replace(/[₹,]/g, "").toLowerCase();
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 5000000;
  if (cleaned.includes("cr")) return num * 1e7;
  if (cleaned.includes("lakh") || cleaned.includes("lac")) return num * 1e5;
  return num;
}

function formatINR(n) {
  return Math.round(n).toLocaleString("en-IN");
}

export default function EMICalculator({ price }) {
  const basePrice = useMemo(() => parsePriceToNumber(price), [price]);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const loanAmount = basePrice * (1 - downPaymentPct / 100);

  const emi = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;
    if (monthlyRate === 0) return loanAmount / months;
    const factor = Math.pow(1 + monthlyRate, months);
    return (loanAmount * monthlyRate * factor) / (factor - 1);
  }, [loanAmount, rate, tenure]);

  const totalPayment = emi * tenure * 12;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="bg-navy/[0.03] border border-navy/10 rounded-2xl p-6">
      <h4 className="font-display text-lg mb-5 flex items-center gap-2">
        <Calculator size={18} className="text-gold" /> Estimated Monthly EMI
      </h4>

      <div className="space-y-5 mb-6">
        <div>
          <div className="flex justify-between text-xs text-navy/60 mb-1.5">
            <span>Down Payment</span>
            <span className="font-semibold text-navy">{downPaymentPct}% (₹{formatINR(basePrice * (downPaymentPct / 100))})</span>
          </div>
          <input type="range" min={0} max={80} step={5} value={downPaymentPct} onChange={(e) => setDownPaymentPct(Number(e.target.value))} className="w-full accent-gold" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-navy/60 mb-1.5">
            <span>Interest Rate</span>
            <span className="font-semibold text-navy">{rate}% p.a.</span>
          </div>
          <input type="range" min={6} max={14} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-gold" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-navy/60 mb-1.5">
            <span>Loan Tenure</span>
            <span className="font-semibold text-navy">{tenure} Years</span>
          </div>
          <input type="range" min={5} max={30} step={1} value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full accent-gold" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-[11px] text-navy/50 mb-1">Monthly EMI</p>
          <p className="font-display text-lg text-gold">₹{formatINR(emi)}</p>
        </div>
        <div>
          <p className="text-[11px] text-navy/50 mb-1">Loan Amount</p>
          <p className="font-display text-lg">₹{formatINR(loanAmount)}</p>
        </div>
        <div>
          <p className="text-[11px] text-navy/50 mb-1">Total Interest</p>
          <p className="font-display text-lg">₹{formatINR(totalInterest)}</p>
        </div>
      </div>
      <p className="text-[11px] text-navy/40 mt-3 text-center">
        Indicative estimate only. Actual EMI depends on your lender's terms.
      </p>
    </div>
  );
}
