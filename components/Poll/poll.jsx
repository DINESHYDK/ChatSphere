export function Poll({ title, options }) {
  return (
<div className="max-w-2xl m-1 p-3 border border-gray-200 rounded-lg">
      <h2 className="text-lg font-semibold text-foreground mb-6">{title}</h2>

      <div className="space-y-1">
        {options.map((option) => (
          <div
            key={option.id}
            className="
              flex items-center gap-3 p-1 rounded-lg
              bg-card hover:bg-muted
              transition-colors duration-200 ease-out
              cursor-pointer
              border border-border
            "
          >
            <div className="flex-shrink-0">
              <img
                src={option.avatarUrl || "/placeholder.svg"}
                className="
                  w-11 h-11
                  rounded-full
                  object-cover
                  border border-border
                "
              />
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="
                text-sm font-medium text-card-foreground
                truncate
              "
              >
                {option.text}
              </p>
            </div>

            <div
              className="
              flex-shrink-0
              w-12 text-right
            "
            >
              <span
                className="
                text-sm font-medium text-muted-foreground
              "
              ></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Poll;
