const AuthImagePattern = ({ title, subtitle }) => {
  const colors = [
    "bg-blue-300",
    "bg-orange-300",
    "bg-blue-200",
    "bg-orange-200",
    "bg-blue-100",
    "bg-orange-100",
  ];

  return (
    <div className="hidden lg:flex h-screen-[-64px] items-center justify-center bg-gradient-to-br from-base-200 via-base-300 to-base-100 p-12">
      <div className="max-w-md text-center">
        {/* Grid Pattern */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl ${colors[i % colors.length]} ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-3xl font-bold mb-4 text-primary">{title}</h2>
        <p className="text-base text-base-content/70">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
