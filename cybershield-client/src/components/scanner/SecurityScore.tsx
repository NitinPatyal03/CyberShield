interface Props {
  score: number;
  grade: string;
}

export default function SecurityScore({
  score,
  grade,
}: Props) {
  return (
    <div className="rounded-2xl bg-white shadow-lg p-8">

      <h3 className="text-xl font-semibold mb-6">
        Security Score
      </h3>

      <div className="flex flex-col items-center">

        <div className="h-44 w-44 rounded-full border-[16px] border-green-500 flex items-center justify-center">

          <div className="text-center">

            <h2 className="text-5xl font-bold">
              {score}
            </h2>

            <p className="text-xl font-semibold mt-2">
              {grade}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}