import ScrollableItemsSection from "./ScrollableItemsSection";

const PreviewUserCard = ({
  title,
  items,
  onHeaderClick,
  onItemClick,
  renderTextContent,
  renderOwnerAddProperty,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-center hover:bg-gray-50">
      <div className="flex flex-row justify-between text-lg font-semibold text-gray-700">
        <div
          className="cursor-pointer hover:text-amber-600"
          onClick={onHeaderClick}
        >
          {title}
        </div>
        {renderOwnerAddProperty && renderOwnerAddProperty}
      </div>

      <ScrollableItemsSection
        items={items}
        onItemClick={onItemClick}
        renderContent={renderTextContent}
      />
    </div>
  );
};

export default PreviewUserCard;
