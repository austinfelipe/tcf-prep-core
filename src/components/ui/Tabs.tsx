'use client';

interface Tab {
  id: string;
  label: string;
  badge?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeId: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeId, onTabChange, className = '' }: TabsProps) {
  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {tab.label}
              {tab.badge && (
                <span
                  className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        );
      })}
    </div>
  );
}
