import Image from "next/image";

const ScrollableItemsSection = ({ items, onItemClick, renderContent, selectedId }) => {
  return (
    <div className="flex gap-4 overflow-x-auto py-4 hide-scrollbar">
      {items.map((item) => (
        <div
          key={item.id}
          className={`min-w-[10rem] h-52 flex flex-col items-center justify-between overflow-hidden ${selectedId && item.id != selectedId ? "opacity-50" : selectedId ? "scale-110" : ""}`}
        >
          <div className="w-40 h-40 flex items-center justify-center rounded-lg overflow-hidden group">
            <Image
              width={1000}
              height={1000}
              src={item.imageSrc}
              alt={item.title}
              className="w-full h-full object-cover cursor-pointer transform transition duration-300 group-hover:scale-110"
              onClick={() => onItemClick(item.id)}
            />
          </div>

          {renderContent && renderContent(item)}
        </div>
      ))}
    </div>
  );
};

export default ScrollableItemsSection;
