import {
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Building2,
} from "lucide-react";

interface Props {
  issuer: string;
  subject: string;
  expiryDate: string | null;
  daysRemaining: number;
  valid: boolean;
}

export default function SSLCard({
  issuer,
  subject,
  expiryDate,
  daysRemaining,
  valid,
}: Props) {
  const daysLeft = daysRemaining;

  const health = Math.max(
    Math.min((daysLeft / 365) * 100, 100),
    0
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition hover:shadow-xl">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          {valid ? (
            <ShieldCheck className="h-8 w-8 text-green-600" />
          ) : (
            <ShieldAlert className="h-8 w-8 text-red-600" />
          )}

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              SSL Certificate
            </h2>

            <p className="text-sm text-slate-500">
              Certificate Information
            </p>
          </div>

        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            valid
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {valid ? "VALID" : "EXPIRED"}
        </span>

      </div>

      {/* Information */}
      <div className="mt-8 space-y-6">

        {/* Issuer */}
        <div className="flex items-center gap-4">

          <Building2 className="h-6 w-6 text-blue-600" />

          <div>
            <p className="text-sm text-slate-500">
              Issuer
            </p>

            <p className="font-semibold text-slate-800">
              {issuer || "N/A"}
            </p>
          </div>

        </div>

        {/* Subject */}
        <div className="flex items-center gap-4">

          <Building2 className="h-6 w-6 text-indigo-600" />

          <div>
            <p className="text-sm text-slate-500">
              Subject
            </p>

            <p className="font-semibold text-slate-800 break-all">
              {subject || "N/A"}
            </p>
          </div>

        </div>

        {/* Expiry */}
        <div className="flex items-center gap-4">

          <Calendar className="h-6 w-6 text-orange-500" />

          <div>
            <p className="text-sm text-slate-500">
              Expiry Date
            </p>

            <p className="font-semibold text-slate-800">
              {expiryDate
                ? new Date(expiryDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

        </div>

      </div>

      {/* Certificate Health */}
      <div className="mt-8">

        <div className="mb-2 flex justify-between">

          <span className="text-sm text-slate-500">
            Certificate Health
          </span>

          <span className="font-semibold text-slate-800">
            {daysLeft >= 0
              ? `${daysLeft} Days Left`
              : "Expired"}
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">

          <div
            className={`h-full rounded-full transition-all duration-500 ${
              health > 60
                ? "bg-green-500"
                : health > 30
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{
              width: `${health}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}