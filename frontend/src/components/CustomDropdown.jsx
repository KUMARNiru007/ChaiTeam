import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

const CustomDropdown = ({ options, placeholder, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(placeholder);
  const dropdownRef = useRef(null);
  const { darkMode } = useTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelectedValue(option.label);
    setIsOpen(false);
    if (onSelect) onSelect(option);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full rounded-xl border ${
          darkMode
            ? 'bg-[#27272A] border-white/30'
            : 'border-gray-300 bg-gray-50 text-gray-700 focus:bg-gray-100 hover:bg-gray-10'
        } py-2 px-3 pr-8 text-left focus:border-[var(--chaiteam-orange)] focus:outline-none0 transition-colors cursor-pointer`}
      >
        {selectedValue}
        <i
          className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${darkMode ? 'text-white' : ''}`}
        ></i>
      </button>

      {isOpen && (
        <div
          className={`absolute mt-2 w-full rounded-2xl border ${
            darkMode
              ? 'bg-[var(--chaiteam-bg-primary)] text-white border-white/30'
              : 'border-gray-200 bg-white'
          } shadow-lg z-10 overflow-hidden max-h-60 overflow-y-auto cursor-pointer p-2`}
        >
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleSelect(option)}
              className={`px-3 py-2 m-1 cursor-pointer ${
                darkMode
                  ? 'hover:bg-[var(--chaiteam-bg-secondary)]/50 text-white hover:text-white'
                  : 'hover:bg-[var(--chaiteam-bg-secondary)]/30'
              }  transition-colors rounded-lg ${
                selectedValue === option.label
                  ? 'bg-[var(--chaiteam-bg-secondary)]/40 text-[var(--chaiteam-bg-primary)] font-medium'
                  : 'text-gray-700'
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
