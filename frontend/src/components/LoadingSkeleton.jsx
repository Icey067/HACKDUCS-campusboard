/**
 * LoadingSkeleton — shimmer-effect placeholder cards while data loads.
 */
const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-5 space-y-4">
          <div className="flex justify-between">
            <div className="shimmer h-6 w-24 rounded-full" />
            <div className="shimmer h-8 w-8 rounded-lg" />
          </div>
          <div className="shimmer h-6 w-3/4 rounded-lg" />
          <div className="shimmer h-4 w-1/2 rounded-lg" />
          <div className="space-y-2">
            <div className="shimmer h-3 w-full rounded" />
            <div className="shimmer h-3 w-5/6 rounded" />
            <div className="shimmer h-3 w-4/6 rounded" />
          </div>
          <div className="flex justify-between pt-3 border-t border-white/5">
            <div className="shimmer h-4 w-28 rounded" />
            <div className="shimmer h-7 w-16 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
