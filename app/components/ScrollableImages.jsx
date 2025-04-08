import Image from "next/image";

const ScrollableImages = ({ images }) => {
  return (
    <div className="flex overflow-x-auto gap-4 hide-scrollbar self-center">
      {images.map((item) => (
        <div
          key={item}
          className="w-40 h-39 flex items-center justify-center rounded-lg overflow-hidden group"
        >
          <Image
            width={1000}
            height={1000}
            src={item}
            alt="Pet image"
            className="w-full h-full object-cover cursor-pointer transform transition duration-300 group-hover:scale-110"
          />
        </div>
      ))}
    </div>
  );
};

export default ScrollableImages;
