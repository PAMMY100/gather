import Image from "next/image";

const Ad = ({ size }: { size: "sm" | "md" | "lg" }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm">
      {/* Top */}
      <div className="flex items-center justify-between text-gray font-medium">
        <span>Sponsor Ads</span>
        <Image src="/more.png" alt="" width={16} height={16} />
      </div>
      {/* Bottom */}
      <div
        className={`flex flex-col mt-4 ${size === "sm" ? "gap-2" : "gap-4"}`}
      >
        <div
          className={`relative w-full ${
            size === "sm" ? "h-24" : size === "md" ? "h-36" : "h-48"
          }`}
        >
          <Image
            src="https://images.pexels.com/photos/30876414/pexels-photo-30876414/free-photo-of-delicious-multi-grain-bread-with-cheese-and-tomatoes.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
            alt=""
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="flex items-center gap-4">
          <Image
            src="https://images.pexels.com/photos/30876414/pexels-photo-30876414/free-photo-of-delicious-multi-grain-bread-with-cheese-and-tomatoes.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
            alt=""
            width={24}
            height={24}
            className="rounded-full w-6 h-6 object-cover"
          />
          <span className="text-blue-500 font-medium">BigChef Lounge</span>
        </div>
        <p className={size === 'sm' ? "text-xs" : "text-sm"}>
          {size === "sm"
            ? "lorem hbee guuj gsmm lolln amet conferment kill"
            : size === "md"
            ? "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, nostrum ad autem labore praesentium quas fuga necessitatibus eos repudiandae numquam quidem ab."
            : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, nostrum ad autem labore praesentium tempore sequi reiciendis accusamus sunt odio magni quas fuga necessitatibus eos repudiandae numquam quidem, temporibuab."}
        </p>
        <button className="bg-gray-200 text-gray-500 p-2 text-xs rounded-lg">
          Learn more
        </button>
      </div>
    </div>
  );
};

export default Ad;
