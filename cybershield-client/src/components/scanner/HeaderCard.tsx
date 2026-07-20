interface Props {
  title: string;
  enabled: boolean;
}

function HeaderCard({ title, enabled }: Props) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg">
      <span>{title}</span>

      {enabled ? (
        <span className="text-green-600 font-semibold">
          Enabled
        </span>
      ) : (
        <span className="text-red-600 font-semibold">
          Missing
        </span>
      )}
    </div>
  );
}

export default HeaderCard;