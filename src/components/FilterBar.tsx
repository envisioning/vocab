interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories?: string[]; // Add this line
}

export default function FilterBar({
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange,
  selectedCategory,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div
      className="sticky top-0 bg-white shadow-md p-4 z-10 mb-6"
      role="search"
      aria-label="Filter articles"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search articles..."
            className="px-4 py-2 border rounded-lg flex-grow min-w-[200px]"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onSearchChange("");
            }}
            aria-label="Search articles"
          />
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2 border rounded-lg min-w-[150px]"
            aria-label="Sort articles"
          >
            <option value="g">Sort by Generality</option>
            <option value="a">Sort Alphabetically</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-2 border rounded-lg min-w-[150px]"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

const CATEGORY_OPTIONS = [
  { value: "CORE", label: "Foundational AI Concepts" },
  { value: "ARCH", label: "Architectures & Models" },
  {
    value: "IMPL",
    label: "Implementation & Infrastructure",
  },
  { value: "DATA", label: "Data processing & Handling" },
  { value: "MATH", label: "Math & Statistical Foundations" },
  { value: "GOV", label: "Governance, Ethics & Safety" },
  { value: "BIO", label: "Biological & Neural" },
];
