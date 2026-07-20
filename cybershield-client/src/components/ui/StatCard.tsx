import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl bg-white p-6 shadow-lg border border-slate-200"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-500 text-sm">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </h2>

          {subtitle && (
            <p className="text-sm text-slate-400 mt-2">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className="h-16 w-16 rounded-xl flex items-center justify-center text-3xl text-white"
          style={{ background: color }}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}