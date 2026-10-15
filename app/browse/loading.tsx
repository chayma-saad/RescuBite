export default function BrowseLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="skeleton h-9 w-64 mb-2" />
      <div className="skeleton h-4 w-48 mb-6" />
      <div className="flex gap-3 mb-6">
        <div className="skeleton h-10 flex-1 rounded-lg" />
        <div className="skeleton h-10 w-32 rounded-lg" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="skeleton h-40 rounded-none" />
            <div className="p-4 space-y-2">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-1/2" />
              <div className="skeleton h-3 w-2/3" />
              <div className="skeleton h-9 w-full rounded-lg mt-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
