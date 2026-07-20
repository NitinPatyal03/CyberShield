import { ShieldAlert } from "lucide-react";
import type { ScanResult } from "../../services/scannerService";


interface Props {
  result: ScanResult;
}

export default function AISecurityAdvisor({ result }: Props) {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  if (result.isCertificateValid)
    strengths.push("SSL Certificate is valid.");
  else {
    weaknesses.push("SSL Certificate is invalid.");
    recommendations.push("Renew the SSL certificate.");
  }

  if (result.hasHsts)
    strengths.push("HSTS is enabled.");
  else {
    weaknesses.push("HSTS is missing.");
    recommendations.push("Enable HSTS.");
  }

  if (result.hasCsp)
    strengths.push("Content Security Policy is enabled.");
  else {
    weaknesses.push("Content Security Policy is missing.");
    recommendations.push("Configure a CSP.");
  }

  if (!result.hasXFrameOptions) {
    weaknesses.push("X-Frame-Options is missing.");
    recommendations.push("Enable X-Frame-Options.");
  }

  if (result.openPorts.some(p => p.isOpen)) {
    weaknesses.push("Open ports detected.");
    recommendations.push("Close unnecessary ports.");
  }

  if (result.vulnerabilities.length > 0) {
    weaknesses.push(
      `${result.vulnerabilities.length} vulnerabilities detected.`
    );
    recommendations.push("Resolve detected vulnerabilities.");
  }

  const posture =
    result.securityScore >= 90
      ? "Excellent"
      : result.securityScore >= 70
      ? "Good"
      : "Poor";

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6 mt-6">

      <div className="flex items-center gap-3 mb-4">

        <ShieldAlert className="text-blue-600" size={30} />

        <h2 className="text-2xl font-bold">
          AI Security Advisor
        </h2>

      </div>

      <div className="mb-5">

        <p className="font-semibold">
          Overall Security Posture
        </p>

        <p className="text-gray-600 mt-2">
          {posture}
        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div>

          <h3 className="font-semibold text-green-600 mb-2">
            Strengths
          </h3>

          <ul className="list-disc ml-5 space-y-1">
            {strengths.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

        </div>

        <div>

          <h3 className="font-semibold text-red-600 mb-2">
            Weaknesses
          </h3>

          <ul className="list-disc ml-5 space-y-1">
            {weaknesses.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

        </div>

      </div>

      <div className="mt-6">

        <h3 className="font-semibold text-blue-600 mb-2">
          Recommended Actions
        </h3>

        <ol className="list-decimal ml-5 space-y-1">
          {recommendations.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>

      </div>

    </div>
  );
}