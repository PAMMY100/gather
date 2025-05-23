import Image from "next/image";
import Link from "next/link";

const UserInfoCard = ({ userId }: { userId: string }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User Information</span>
        <Link href="/" className="text-blue-500 text-xl">
          see all
        </Link>
      </div>
      {/* Bottom */}
      <div className="flex flex-col gap-4 text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-xl text-black">Sam Bells</span>
          <span className="text -sm">Sam Bells</span>
        </div>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi
          obcaecati et aliquam saepe beatae nobis minus corrupti modi, illo
          aspernatur consectetur. Rem ullam commodi et, iste voluptatum sed
          temporibus architecto.
        </p>
        <div className="flex items-center gap-2">
          <Image src="/map.png" alt="" width={16} height={16} />
          <span>
            Living in <b>Denver</b>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Image src="/school.png" alt="" width={16} height={16} />
          <span>
            Went to <b>Edgar High School</b>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Image src="/work.png" alt="" width={16} height={16} />
          <span>
            works in <b>Apple Inc</b>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1 items-center">
            <Image src="" alt="" width={16} height={16} />
            <Link href="" className="text-blue-500 font-medium">
              Sam.dev
            </Link>
          </div>
          <div className="flex gap-1 items-center">
            <Image src="" alt="" width={16} height={16} />
            <span>Joined November 2024</span>
          </div>
        </div>
        <button className="bg-blue-500 text-white rounded-md p-2 text-sm">
          Follow
        </button>
        <span className="text-red-400 seld-end text-xs cursor-pointer">
          Block User
        </span>
      </div>
    </div>
  );
};

export default UserInfoCard;
