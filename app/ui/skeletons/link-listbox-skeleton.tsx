export function LinkListBoxSkeleton() {
  return (
    <div className="animate-pulse">
      <fieldset className="w-full bg-grey-100 rounded-xl p-5 flex flex-col gap-3 my-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            {/* Drag handle placeholder */}
            <div className="h-4 w-4 bg-gray-300 rounded-sm" />
            <legend className="h-4 w-16 bg-gray-300 rounded" />
          </div>
          <div className="h-4 w-12 bg-gray-300 rounded" />
        </div>

        {/* Platform dropdown */}
        <div className="flex flex-col gap-1">
          <div className="h-3 w-12 bg-gray-300 rounded" />
          <div className="h-10 w-full bg-gray-300 rounded-lg" />
        </div>

        {/* Link input */}
        <div className="flex flex-col gap-1">
          <div className="h-3 w-8 bg-gray-300 rounded" />
          <div className="h-10 w-full bg-gray-300 rounded-lg" />
        </div>
      </fieldset>
    </div>
  );
}
