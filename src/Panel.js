import Button from "./Button";

const Panel = ({ node, onClickClose, onClickJumpToNode }) => {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        position: "absolute",
        left: `24px`,
        top: `96px`,
        zIndex: 2
      }}
    >
      <div className="max-w-sm py-6 px-3">
        <div className="bg-white shadow-xl rounded-lg ">
          <div className="bg-cover bg-center p-4">
            <div className="flex justify-end">
              <Button onClick={onClickClose}>X</Button>
            </div>
          </div>
          <div className="p-4 border-t border-gray-300">
            <p className="text-3xl text-gray-900">{node.user}</p>
          </div>
          <div className="p-4 border-t border-gray-300">
            <pre className="text-gray-700">
              {JSON.stringify({
                id: node.id,
                user: node.user,
                val: node.val
              })}
            </pre>
          </div>
          <div className="flex p-4 border-t border-gray-300 text-gray-700">
            <Button onClick={(event) => onClickJumpToNode(node, event)}>
              Jump to node
            </Button>
            <Button onClick={() => alert("Better here :)")}>Expand Node</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panel;
