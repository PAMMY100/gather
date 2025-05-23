const Ad = ({ size }: { size: "sm" | "md" | "lg" }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm">
      {/* Top */}
      <div className="flex items-center justify-between text-gray font-medium"></div>
      {/* Bottom */}
      <div></div>
    </div>
  );
};

export default Ad;
