interface Props {
  progress: number;
}

export default function ProgressCard({
  progress,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">

      <h3 className="text-xl font-semibold">
        Scanning Website
      </h3>

      <div className="w-full bg-slate-200 rounded-full h-5 mt-6">

        <div
          className="bg-blue-600 h-5 rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <p className="mt-4 text-slate-500">
        {progress}% Completed
      </p>

    </div>
  );
}