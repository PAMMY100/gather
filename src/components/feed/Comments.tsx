import Image from "next/image";

const Comments = () => {
  return (
    <div className="">
      {/* Write */}
      <div className="flex-1 flex items-center gap-4">
        <Image
          src="https://images.pexels.com/photos/31816538/pexels-photo-31816538/free-photo-of-two-women-embracing-on-pebble-beach-at-night.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
          alt=""
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full">
          <input
            type="text"
            placeholder="write a comment..."
            className="bg-transparent outline-none flex-1"
          />
          <Image
            src="/emoji.png"
            alt=""
            width={16}
            height={16}
            className="cursor-pointer"
          />
        </div>
      </div>
      {/* Comments */}
      <div className="">
        {/* Comment */}
        <div className="flex gap-4 justify-between mt-6">
          {/* Avatar */}
          <Image
            src="https://images.pexels.com/photos/31816538/pexels-photo-31816538/free-photo-of-two-women-embracing-on-pebble-beach-at-night.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          {/* DESC */}
          <div className="flex flex-col gap-2 flex-1">
            <span className="font-medium">Sam Bells</span>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Voluptates dignissimos, ex eaque, quibusdam minima vitae ipsam
              incidunt fugiat sapiente maiores nostrum quas saepe laudantium
              expedita deserunt nemo exercitationem, cum molestias.
            </p>
            <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
              <div className="flex items-center gap-4">
                <Image
                  src="/like.png"
                  alt=""
                  width={12}
                  height={12}
                  className="cursor-pointer w-3 h-3"
                />
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">123 Likes</span>
              </div>
              <div className="">Reply</div>
            </div>
          </div>
          {/* ICON */}
          <Image
            src="/more.png"
            alt=""
            width={16}
            height={16}
            className="cursor-pointer w-4 h-4"
          />
        </div>
      </div>
    </div>
  );
};

export default Comments;
