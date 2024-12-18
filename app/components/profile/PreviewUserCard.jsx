import ScrollableItemsSection from "./ScrollableItemsSection";

const PreviewUserCard = ({
  title,
  items,
  onHeaderClick,
  onItemClick,
  renderContent,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-center hover:bg-gray-50">
      <div
        onClick={onHeaderClick}
        className="text-lg font-semibold text-gray-700 cursor-pointer hover:text-amber-600"
      >
        {title}
      </div>

      <ScrollableItemsSection
        items={items}
        onItemClick={onItemClick}
        renderContent={renderContent}
      />
    </div>
  );
};

export default PreviewUserCard;
