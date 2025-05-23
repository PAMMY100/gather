import AddPost from "@/components/AddPost";
import Feed from "@/components/Feed";
import RightMenu from "@/components/RightMenu";
import Stories from "@/components/Stories";
import React from "react";

const HomePage = () => {
  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]"></div>
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <Stories />
          <AddPost />
          <Feed />
        </div>
      </div>
      <div className="hidden lg:block w-[30%]">
        <RightMenu />
      </div>
    </div>
  );
};

export default HomePage;
