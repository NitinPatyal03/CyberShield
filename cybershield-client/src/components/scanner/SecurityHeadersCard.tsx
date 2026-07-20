import {
  ShieldCheck,
  ShieldX,
} from "lucide-react";

import type { SecurityHeader } from "../../services/scannerService";

interface Props {
  headers: SecurityHeader[];
}

export default function SecurityHeadersCard({
  headers,
}: Props) {

  const passed = headers.filter(h => h.present).length;
  const percentage = Math.round(
    (passed / headers.length) * 100
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold">
            Security Headers
          </h2>

          <p className="text-slate-500">
            HTTP Response Header Analysis
          </p>
        </div>

        <div className="text-right">
          <h3 className="text-3xl font-bold">
            {percentage}%
          </h3>

          <p className="text-slate-500">
            Coverage
          </p>
        </div>

      </div>

      <div className="mt-8 space-y-4">

        {headers.map((header) => (

          <div
            key={header.name}
            className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
          >

            <div className="flex items-center gap-4">

              {header.present ? (
                <ShieldCheck className="text-green-600" />
              ) : (
                <ShieldX className="text-red-600" />
              )}

              <div>

                <h3 className="font-semibold">
                  {header.name}
                </h3>

                <p className="text-sm text-slate-500">
                  {header.description}
                </p>

              </div>

            </div>

            <span
              className={`rounded-full px-4 py-1 text-sm font-semibold ${
                header.present
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {header.present ? "Present" : "Missing"}
            </span>

          </div>

        ))}

      </div>

      <div className="mt-8">

        <div className="mb-2 flex justify-between">

          <span className="text-sm text-slate-500">
            Overall Header Security
          </span>

          <span className="font-semibold">
            {passed}/{headers.length}
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-blue-600"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}