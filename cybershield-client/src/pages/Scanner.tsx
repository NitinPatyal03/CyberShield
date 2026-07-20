import { useState } from "react";

import { scanWebsite } from "../services/scannerService";
import type { ScanResult } from "../services/scannerService";

import ScoreCard from "../components/ScoreCard";
import HeaderCard from "../components/scanner/HeaderCard";
import SSLCard from "../components/scanner/SSLCard";
import PortsTable from "../components/scanner/PortsTable";
import VulnerabilityCard from "../components/scanner/VulnerabilityCard";
import RecommendationsPanel from "../components/scanner/RecommendationsPanel";
import { generateSecurityReport } from "../utils/pdfGenerator";
import AISecurityAdvisor from "../components/scanner/AISecurityAdvisor";

function Scanner() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!url.trim()) {
      setError("Please enter a website URL.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await scanWebsite(url);
      setResult(response);
    } catch (err) {
      console.error(err);
      setError("Unable to scan website.");
    } finally {
      setLoading(false);
    }
  };

  // Generate recommendations automatically
  const recommendations: string[] = [];

  if (result) {
    if (!result.hasHsts)
      recommendations.push(
        "Enable Strict-Transport-Security (HSTS) to force HTTPS connections."
      );

    if (!result.hasCsp)
      recommendations.push(
        "Configure a Content-Security-Policy (CSP) to reduce XSS attacks."
      );

    if (!result.hasXFrameOptions)
      recommendations.push(
        "Enable X-Frame-Options to prevent clickjacking attacks."
      );

    if (!result.hasXContentTypeOptions)
      recommendations.push(
        "Enable X-Content-Type-Options to stop MIME-type sniffing."
      );

    if (!result.hasReferrerPolicy)
      recommendations.push(
        "Configure Referrer-Policy to limit sensitive information leakage."
      );

    if (!result.hasPermissionsPolicy)
      recommendations.push(
        "Use Permissions-Policy to restrict browser features."
      );

    if (!result.isCertificateValid)
      recommendations.push(
        "Renew or replace the SSL certificate immediately."
      );

    if (result.openPorts.some((p) => p.isOpen))
      recommendations.push(
        "Review open ports and close unnecessary services."
      );

    if (result.vulnerabilities.length > 0)
      recommendations.push(
        "Resolve all detected vulnerabilities based on their severity."
      );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          Website Security Scanner
        </h1>

        <p className="mt-2 text-slate-500">
          Analyze websites for SSL, Security Headers, Open Ports and
          Vulnerabilities.
        </p>
      </div>

      {/* Scan Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row">

          <input
            className="flex-1 rounded-xl border border-slate-300 p-4 focus:border-blue-500 focus:outline-none"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={handleScan}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Scanning..." : "Scan Website"}
          </button>

        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* Empty State */}
      {!loading && !result && (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-lg">

          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-5xl">
            🛡️
          </div>

          <h2 className="text-3xl font-bold">
            Start Your First Scan
          </h2>

          <p className="mt-4 text-slate-500">
            Enter a website URL above and CyberShield will analyze:
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-xl bg-slate-50 p-4">
              🔒 SSL Certificate
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              🛡 Security Headers
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              🌐 Open Ports
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              🚨 Vulnerabilities
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              🍪 Cookies
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              📊 Security Score
            </div>

          </div>

        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl bg-white p-6 shadow-lg">

          <div className="mb-4 h-3 overflow-hidden rounded-full bg-slate-200">
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-blue-600"></div>
          </div>

          <p className="text-slate-600">
            Performing security analysis...
          </p>

        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-8">

          <ScoreCard
  score={result.securityScore}
  grade={result.grade}
/>

<div className="flex justify-end">
  <button
    onClick={() => generateSecurityReport(result, url)}
    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-emerald-700"
  >
    📄 Download Security Report
  </button>
</div>

{/* SSL + Security Headers */}
          <div className="grid gap-6 lg:grid-cols-2">

            <SSLCard
              issuer={result.certificateIssuer}
              subject={result.certificateSubject}
              expiryDate={result.certificateExpiryDate}
              daysRemaining={result.daysUntilExpiry}
              valid={result.isCertificateValid}
            />

            <div className="rounded-2xl bg-white p-6 shadow-lg">

              <h2 className="mb-6 text-xl font-bold">
                Security Headers
              </h2>

              <div className="grid gap-4 md:grid-cols-2">

                <HeaderCard title="HSTS" enabled={result.hasHsts} />

                <HeaderCard
                  title="Content Security Policy"
                  enabled={result.hasCsp}
                />

                <HeaderCard
                  title="X-Frame-Options"
                  enabled={result.hasXFrameOptions}
                />

                <HeaderCard
                  title="X-Content-Type-Options"
                  enabled={result.hasXContentTypeOptions}
                />

                <HeaderCard
                  title="Referrer Policy"
                  enabled={result.hasReferrerPolicy}
                />

                <HeaderCard
                  title="Permissions Policy"
                  enabled={result.hasPermissionsPolicy}
                />

              </div>

            </div>

          </div>

          {/* Ports + Recommendations */}
          <div className="grid gap-6 lg:grid-cols-2">

            <PortsTable ports={result.openPorts} />

            <RecommendationsPanel
              recommendations={recommendations}
            />

          </div>

          {/* Vulnerabilities */}
          <div>

  <h2 className="mb-4 text-2xl font-bold">
    Vulnerabilities
  </h2>

  <div className="grid gap-4">

    {result.vulnerabilities.length === 0 ? (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-700">
        ✅ No vulnerabilities detected.
      </div>
    ) : (
      result.vulnerabilities.map((item, index) => (
        <VulnerabilityCard
          key={index}
          vulnerability={item}
        />
      ))
    )}

  </div>

</div>

{/* AI Security Advisor */}
<AISecurityAdvisor result={result} />

        </div>
      )}
    </div>
  );
}

export default Scanner;