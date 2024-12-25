import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

const SortFiltersOption = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const params = useSearchParams();
  const router = useRouter();

  const formattedOptions = [
    { label: "Sort by Title", value: "title" },
    { label: "Sort by Price", value: "price" },
    { label: "Sort by Rating", value: "rating" },
    { label: "Sort by Distance", value: "distance" },
  ];

  const handleChange = (selectedOption) => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    currentQuery.sortBy = selectedOption;

    setIsOpen(false);

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: currentQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const getDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      return {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      };
    }
    return { top: 0, left: 0 };
  };

  const { top, left } = getDropdownPosition();

  return (
    <div className="inline-block text-left">
      <div
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`flex flex-col items-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer border rounded-lg border-gray-300 text-neutral-500`}
      >
        <FontAwesomeIcon icon={faSort} size="lg" className="text-neutral-500" />
        <div className="font-normal text-xs">Sort</div>
      </div>

      {isOpen && (
        <div
          className="fixed w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
          style={{ top: `${top}px`, left: `${left}px` }}
        >
          <div className="py-1">
            {formattedOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleChange(option.value)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortFiltersOption;
