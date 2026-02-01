export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Logo/Spinner */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-100"></div>
          <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <p className="text-slate-600 font-medium">Loading...</p>
          <p className="text-sm text-slate-400">Finding the best opportunities for you</p>
        </div>
      </div>
    </div>
  );
}
