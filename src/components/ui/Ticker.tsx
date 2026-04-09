interface TickerProps {
  message?: string;
}

const defaultMessage =
  "Latest Updates: NH-44 AI inspection completed | City teams requested to update repair logs by 18:00 | New citizen reporting workflow is now live.";

export default function Ticker({ message = defaultMessage }: TickerProps) {
  return (
    <div className="bg-gray-50 border-y border-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-3 overflow-hidden">
        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
          Latest Updates
        </span>
        <div className="overflow-hidden w-full whitespace-nowrap text-sm text-blue-900 font-medium">
          <span className="inline-block animate-marquee">{message}</span>
        </div>
      </div>
    </div>
  );
}
