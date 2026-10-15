export default function RestaurantLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="skeleton h-9 w-72 mb-2" />
          <div className="skeleton h-4 w-48" />
        </div>
        <div className="skeleton h-10 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-5">
            <div className="skeleton h-9 w-9 rounded-lg mb-3" />
            <div className="skeleton h-8 w-16 mb-1" />
            <div className="skeleton h-3 w-24" />
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card p-5">
            <div className="skeleton h-5 w-3/4 mb-3" />
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[...Array(3)].map((_, j) => <div key={j} className="skeleton h-16 rounded-lg" />)}
            </div>
            <div className="skeleton h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
