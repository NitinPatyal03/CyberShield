import { motion } from "framer-motion";

interface Props {
  score: number;
  grade: string;
}

export default function ScoreCard({
  score,
  grade,
}: Props) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  const progress = Math.min(Math.max(score, 0), 100);

  const offset =
    circumference -
    (progress / 100) * circumference;

  const getColor = () => {
    if (score >= 90) return "#22C55E";
    if (score >= 75) return "#3B82F6";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-200">

      <h2 className="text-2xl font-bold text-slate-800 mb-8">
        Security Score
      </h2>

      <div className="flex flex-col items-center">

        <svg
          width="220"
          height="220"
          className="-rotate-90"
        >
          <circle
            cx="110"
            cy="110"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="16"
            fill="none"
          />

          <motion.circle
            cx="110"
            cy="110"
            r={radius}
            stroke={getColor()}
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{
              strokeDashoffset: circumference,
            }}
            animate={{
              strokeDashoffset: offset,
            }}
            transition={{
              duration: 1.4,
            }}
          />
        </svg>

        <div className="-mt-36 text-center">

          <h1 className="text-6xl font-bold">
            {score}
          </h1>

          <p className="text-xl text-slate-500 mt-2">
            {grade}
          </p>

        </div>

      </div>

      <div className="grid grid-cols-3 gap-4 mt-10">

        <div className="rounded-xl bg-slate-100 p-4 text-center">
          <p className="text-sm text-slate-500">
            Rating
          </p>

          <h3 className="font-bold text-lg">
            {grade}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-100 p-4 text-center">
          <p className="text-sm text-slate-500">
            Score
          </p>

          <h3 className="font-bold text-lg">
            {score}/100
          </h3>
        </div>

        <div className="rounded-xl bg-slate-100 p-4 text-center">
          <p className="text-sm text-slate-500">
            Status
          </p>

          <h3
            className="font-bold"
            style={{ color: getColor() }}
          >
            {score >= 90
              ? "Excellent"
              : score >= 75
              ? "Good"
              : score >= 60
              ? "Average"
              : "Poor"}
          </h3>
        </div>

      </div>
    </div>
  );
}