"use client";

import Container from "../Container";
import Search from "./Search";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import BasicFilters from "./BasicFilters";
import AnimatedDog from "./AnimatedDog";

const Navbar = ({ currentUser }) => {
  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0 h-full">
            <div className="flex-1">
              <Logo />
            </div>
            {/* <div className="flex-1 flex justify-center"><Search /></div> */}
            <div
              className="flex-grow flex justify-center items-center"
              style={{ flexGrow: 2 }}
            >
              <AnimatedDog />
            </div>
            <div className="flex-1 flex justify-end">
              <UserMenu currentUser={currentUser} />
            </div>
          </div>
        </Container>
      </div>
      <BasicFilters />
    </div>
  );
};

export default Navbar;
