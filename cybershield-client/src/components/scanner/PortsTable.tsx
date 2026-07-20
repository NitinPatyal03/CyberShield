import type { PortResult } from "../../services/scannerService";
import { Wifi, ShieldAlert } from "lucide-react";

interface Props {
  ports: PortResult[];
}

export default function PortsTable({ ports }: Props) {
  const openPorts = ports.filter((p) => p.isOpen);

  const getRisk = (port: number) => {
    const highRiskPorts = [21, 23, 25, 135, 139, 445, 3389];
    const mediumRiskPorts = [22, 53, 3306, 5432];

    if (highRiskPorts.includes(port)) {
      return {
        label: "High",
        color: "bg-red-100 text-red-700",
      };
    }

    if (mediumRiskPorts.includes(port)) {
      return {
        label: "Medium",
        color: "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      label: "Low",
      color: "bg-green-100 text-green-700",
    };
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition hover:shadow-xl">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Open Ports
          </h2>

          <p className="text-slate-500">
            Network Port Analysis
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 px-5 py-3 text-center">
          <h3 className="text-2xl font-bold text-blue-700">
            {openPorts.length}
          </h3>

          <p className="text-sm text-slate-500">
            Open Ports
          </p>
        </div>

      </div>

      {openPorts.length === 0 ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">

          <Wifi className="mx-auto mb-3 h-10 w-10 text-green-600" />

          <h3 className="text-xl font-semibold text-green-700">
            No Open Ports Detected
          </h3>

          <p className="mt-2 text-slate-500">
            Great! No commonly scanned ports are exposed.
          </p>

        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="border-b bg-slate-50">

              <tr>
                <th className="px-4 py-3 text-left">Port</th>

                <th className="px-4 py-3 text-left">
                  Service
                </th>

                <th className="px-4 py-3 text-center">
                  Protocol
                </th>

                <th className="px-4 py-3 text-center">
                  Status
                </th>

                <th className="px-4 py-3 text-center">
                  Risk
                </th>
              </tr>

            </thead>

            <tbody>

              {openPorts.map((port) => {
                const risk = getRisk(port.port);

                return (
                  <tr
                    key={port.port}
                    className="border-b transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">

                      <span className="rounded-lg bg-slate-100 px-3 py-2 font-bold">
                        {port.port}
                      </span>

                    </td>

                    <td className="px-4 py-4 font-medium text-slate-700">
                      {port.service}
                    </td>

                    <td className="px-4 py-4 text-center">

                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700">
                        TCP
                      </span>

                    </td>

                    <td className="px-4 py-4 text-center">

                      <span
                        className={`rounded-full px-3 py-1 ${
                          port.isOpen
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {port.isOpen ? "Open" : "Closed"}
                      </span>

                    </td>

                    <td className="px-4 py-4 text-center">

                      <span
                        className={`rounded-full px-3 py-1 font-medium ${risk.color}`}
                      >
                        {risk.label}
                      </span>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      )}

      {openPorts.length > 0 && (
        <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4">

          <div className="flex items-start gap-3">

            <ShieldAlert className="mt-1 h-5 w-5 text-yellow-600" />

            <div>

              <h3 className="font-semibold text-yellow-700">
                Security Recommendation
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Review all exposed ports carefully. Close unnecessary
                services, restrict access using firewall rules, and expose
                only the ports required by your application.
              </p>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}