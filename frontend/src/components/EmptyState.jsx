/**
 * EmptyState — displayed when no notices match current filters.
 */
import { SearchX, RefreshCw } from "lucide-react";

const EmptyState = ({ message, onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 fade-in">
      <div className="w-20 h-20 rounded-2xl bg-surface-800/50 border border-white/5 flex items-center justify-center mb-6">
        <SearchX className="w-10 h-10 text-surface-600" />
      </div>
      <h3 className="text-xl font-semibold text-surface-300 mb-2">
        No notices found
      </h3>
      <p className="text-surface-500 text-sm max-w-md text-center mb-6">
        {message || "Try adjusting your filters or search query to find what you're looking for."}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600/20 text-primary-300 text-sm font-semibold hover:bg-primary-600/30 transition-all duration-300"
        >
          <RefreshCw className="w-4 h-4" />
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
