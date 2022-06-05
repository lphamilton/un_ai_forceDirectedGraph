const Toolbar = ({ children }) => {
  return (
    <div
      className="flex items-center justify-center bg-white p-2 bg-white shadow-xl rounded-lg"
      style={{
        position: "absolute",
        top: "24px",
        left: "32px",
        zIndex: 2
      }}
    >
      {children}
    </div>
  );
};

export default Toolbar;
