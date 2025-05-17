import React, { useEffect, useRef, useState } from 'react';

interface IconDropdownProps {
  value: string;
  onChange: (newValue: string) => void;
  iconMap: Record<string, React.ReactNode>;
  label?: string;
}

const IconDropdown: React.FC<IconDropdownProps> = ({ value, onChange, iconMap }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-sm font-medium text-gray-700 block mb-1"></label>
      <button
        type="button"
        className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center space-x-2">
          {value && iconMap[value]}
          <span className="text-sm text-gray-700">{value || 'Select Icon'}</span>
        </div>
        <span className="text-gray-500">&#9662;</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg w-full overflow-y-auto">
          <div className="max-h-60 overflow-y-auto rounded-b-xl">
          {Object.entries(iconMap).map(([key, IconComponent]) => (
            <button
              key={key}
              type="button"
              className="w-full px-4 py-2 flex items-center space-x-2 hover:bg-gray-100"
              onClick={() => {
                onChange(key);
                setOpen(false);
              }}
            >
              {IconComponent}
              <span className="text-sm text-gray-700">{key}</span>
            </button>
          ))}
        </div>
        </div>
      )}
    </div>
  );
};

export default IconDropdown;
