import { X } from "lucide-react";
import PropertyInquiryForm from "./PropertyInquiryForm";

const TITLES = {
  "Enquire Now": "Enquire Now",
  "Book Site Visit": "Book a Site Visit",
  "Contact Agent": "Contact Agent",
  "Download Brochure": "Download Brochure",
  "Request Callback": "Request a Callback",
};

export default function EnquiryModal({ property, onClose, source = "Enquire Now", onSuccess }) {
  const isVisit = source === "Book Site Visit";
  const isBrochure = source === "Download Brochure";
  const isCallback = source === "Request Callback";

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-paper w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-navy/10 sticky top-0 bg-paper">
          <p className="font-display text-xl">{TITLES[source] || "Enquire Now"}</p>
          <button onClick={onClose} className="text-navy/50 hover:text-navy">
            <X size={22} />
          </button>
        </div>
        <div className="p-6">
          {isBrochure && (
            <p className="text-sm text-navy/60 mb-4">
              Share your details and we'll send the brochure link straight to your download.
            </p>
          )}
          {isCallback && (
            <p className="text-sm text-navy/60 mb-4">
              Leave your number and our team will call you back shortly.
            </p>
          )}
          <PropertyInquiryForm
            property={property}
            source={source}
            showDateField={isVisit}
            minimal={isBrochure || isCallback}
            submitLabel={isVisit ? "Request Site Visit" : isBrochure ? "Get Brochure" : isCallback ? "Request Callback" : "Submit Enquiry"}
            onSuccess={() => {
              onSuccess?.();
              setTimeout(onClose, isBrochure ? 800 : 2500);
            }}
          />
        </div>
      </div>
    </div>
  );
}
