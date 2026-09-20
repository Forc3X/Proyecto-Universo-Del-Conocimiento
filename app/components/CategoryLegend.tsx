'use client';

interface CategoryLegendProps {
  categories: readonly { id: string; label: string; color: string; icon: string }[];
}

export default function CategoryLegend({ categories }: CategoryLegendProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
      {categories.map(cat => (
        <div key={cat.id} className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: `${cat.color}0c`, border: `1px solid ${cat.color}20` }}>
          <span className="text-[9px] font-bold" style={{ color: cat.color }}>{cat.icon}</span>
          <span className="text-[8px] font-medium" style={{ color: `${cat.color}99` }}>{cat.label}</span>
        </div>
      ))}
    </div>
  );
}
