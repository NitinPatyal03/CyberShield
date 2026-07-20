import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

interface Props {
  recommendations: string[];
}

export default function RecommendationsPanel({
  recommendations,
}: Props) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-green-600" />

          <div>
            <h2 className="text-xl font-bold text-green-700">
              No Recommendations
            </h2>

            <p className="text-slate-600">
              Your website follows the recommended security practices.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getPriority = (text: string) => {
    const value = text.toLowerCase();

    if (
      value.includes("ssl") ||
      value.includes("https") ||
      value.includes("certificate") ||
      value.includes("critical")
    ) {
      return {
        title: "High Priority",
        bg: "bg-red-50",
        border: "border-red-300",
        text: "text-red-700",
        icon: <ShieldAlert className="h-6 w-6 text-red-600" />,
      };
    }

    if (
      value.includes("header") ||
      value.includes("cookie") ||
      value.includes("port")
    ) {
      return {
        title: "Medium Priority",
        bg: "bg-yellow-50",
        border: "border-yellow-300",
        text: "text-yellow-700",
        icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
      };
    }

    return {
      title: "Low Priority",
      bg: "bg-blue-50",
      border: "border-blue-300",
      text: "text-blue-700",
      icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
    };
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold">
            Security Recommendations
          </h2>

          <p className="text-slate-500">
            Recommended actions to improve security.
          </p>
        </div>

        <span className="rounded-full bg-blue-100 px-4 py-2 text-blue-700 font-semibold">
          {recommendations.length} Actions
        </span>

      </div>

      <div className="space-y-5">

        {recommendations.map((recommendation, index) => {
          const priority = getPriority(recommendation);

          return (
            <div
              key={index}
              className={`rounded-xl border ${priority.border} ${priority.bg} p-5 transition hover:shadow-md`}
            >
              <div className="flex gap-4">

                {priority.icon}

                <div className="flex-1">

                  <div className="flex items-center justify-between">

                    <h3
                      className={`font-bold ${priority.text}`}
                    >
                      {priority.title}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${priority.bg} ${priority.text}`}
                    >
                      Action Required
                    </span>

                  </div>

                  <p className="mt-3 leading-7 text-slate-700">
                    {recommendation}
                  </p>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}