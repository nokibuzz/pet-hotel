"use client";

import { TbBuilding, TbHome } from "react-icons/tb";
import Container from "../Container";
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";
import { GiPerson } from "react-icons/gi";

export const categories = [
  {
    label: "Personal Accomodation",
    icon: TbHome,
    description: "This is private home, that take care of pets",
  },
  {
    label: "Hotel",
    icon: TbBuilding,
    description: "This is a verified hotel, that will take care of your pets",
  },
  {
    label: "Personal",
    icon: GiPerson,
    description: "This is single person, that will take care of your pets",
  },
];

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();

  const isMainPage = pathname === "/";

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div
        className="pt-4 flex flex-row items-center justify-around overflow-x-auto
      "
      >
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            selected={category === item.label}
            icon={item.icon}
          />
        ))}
      </div>
    </Container>
  );
};

export default Categories;
