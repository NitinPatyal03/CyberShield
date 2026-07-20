import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

interface WebsiteDetails {
  id: number;
  url: string;
  statusCode: number;
  responseTime: number;
  securityScore: number;
  grade: string;

  isHttps: boolean;

  hasHsts: boolean;
  hasCsp: boolean;
  hasXFrameOptions: boolean;
  hasXContentTypeOptions: boolean;
  hasReferrerPolicy: boolean;
  hasPermissionsPolicy: boolean;

  certificateIssuer: string;
  certificateSubject: string;
  certificateExpiryDate: string;
  daysUntilExpiry: number;
  isCertificateValid: boolean;

  serverHeader: string;
}

export default function HistoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<WebsiteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);

      const res = await api.get(`/scanner/${id}`);

      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load scan details.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-lg font-semibold">
        Loading Scan Details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 rounded-lg border border-red-300 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto p-8">

      <div className="flex items-center justify-between mb-8">

  <h1 className="text-3xl font-bold">
    Scan Details
  </h1>

  <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-800 transition"
  >
    ← Back
  </button>

</div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Website Information */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="font-bold text-xl mb-4">
            Website Information
          </h2>

          <div className="space-y-3">

            <p><strong>URL:</strong> {data.url}</p>

            <p><strong>Security Score:</strong> {data.securityScore}</p>

            <p><strong>Grade:</strong> {data.grade}</p>

            <p><strong>Status Code:</strong> {data.statusCode}</p>

            <p><strong>HTTPS:</strong> {data.isHttps ? "✅ Enabled" : "❌ Disabled"}</p>

            <p><strong>Response Time:</strong> {data.responseTime} ms</p>

            <p><strong>Server:</strong> {data.serverHeader}</p>

          </div>

        </div>

        {/* SSL Certificate */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="font-bold text-xl mb-4">
            SSL Certificate
          </h2>

          <div className="space-y-3">

            <p>
              <strong>Certificate Valid:</strong>{" "}
              {data.isCertificateValid ? "✅ Yes" : "❌ No"}
            </p>

            <p>
              <strong>Issuer:</strong> {data.certificateIssuer}
            </p>

            <p>
              <strong>Subject:</strong> {data.certificateSubject}
            </p>

            <p>
              <strong>Expiry Date:</strong> {data.certificateExpiryDate}
            </p>

            <p>
              <strong>Days Remaining:</strong> {data.daysUntilExpiry}
            </p>

          </div>

        </div>

      </div>

      {/* Security Headers */}

      <div className="bg-white rounded-xl shadow mt-6 p-6">

        <h2 className="font-bold text-xl mb-4">
          Security Headers
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <p>HSTS: {data.hasHsts ? "✅ Enabled" : "❌ Missing"}</p>

          <p>Content Security Policy: {data.hasCsp ? "✅ Enabled" : "❌ Missing"}</p>

          <p>X-Frame-Options: {data.hasXFrameOptions ? "✅ Enabled" : "❌ Missing"}</p>

          <p>X-Content-Type-Options: {data.hasXContentTypeOptions ? "✅ Enabled" : "❌ Missing"}</p>

          <p>Referrer Policy: {data.hasReferrerPolicy ? "✅ Enabled" : "❌ Missing"}</p>

          <p>Permissions Policy: {data.hasPermissionsPolicy ? "✅ Enabled" : "❌ Missing"}</p>

        </div>

      </div>

    </div>
  );
}