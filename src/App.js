import { useCallback, useEffect, useRef, useState } from "react";
import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
// import { myString } from "./LiveData";
import DummyData from "./data.json";
import RealData from "./trimmedData2.json";

import Button from "./Button";
import Info from "./Info";
import Menu from "./Menu";
import Panel from "./Panel";
import Toolbar from "./Toolbar";

import "./style.scss";

const myInitialData = {
  "nodes": [
    {
        "id": "0",
        "user": "abc",
        "Title": "Weather GAN: Multi-Domain Weather Translation Using Generative Adversarial Networks"
    },
    {
        "id": "1",
        "user":"def",
        "Title": "OpenWeather: a peer-to-peer weather data transmission protocol"
    }
  ],
  links: [
    {
      source: "0",
      target: "1"
    }
  ]
};

const nodeToAdd = {
  id: 1346410,
  user: "name3",
  val: 4
};

const applyAnalytics = (data) => {
  const nodes = data.nodes.map((node) => {
    return {
      ...node,
      val: Math.floor(Math.random() * 6) + 1
    };
  });

  const links = data.links.map((link) => {
    return {
      ...link,
      width: 2
    };
  });

  return { ...data, nodes, links };
};

export default function App() {
  // const testData = myInitialData;
  const testData = applyAnalytics(RealData);

  const [myData, setMyData] = useState(RealData);
  const [menuData, setMenuData] = useState(false);
  const [panelData, setPanelData] = useState(false);
  const [is3D, setIs3D] = useState(false);

  const refGraph = useRef();
  console.log(refGraph)

  const handleOnClickRemoveNode = useCallback(() => {
    if (myData.nodes.find((node) => node.id === nodeToAdd.id)) {
      const links = myData.links.filter(
        (link) =>
          link.source.id !== nodeToAdd.id && link.target.id !== nodeToAdd.id
      );

      setMyData({
        ...myData,
        nodes: myData.nodes.filter((node) => node.id !== nodeToAdd.id),
        links
      });
    }
  }, [myData]);

  const jumpToNode = useCallback(
    (refGraph, node) => {
      if (is3D) {
        const distance = 256;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

        refGraph.current.cameraPosition(
          {
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio
          }, // new position
          node, // lookAt ({ x, y, z })
          1500 // ms transition duration
        );
      } else {
        // refGraph.current.centerAt(node.x, node.y, 1500);
        refGraph.current.zoomToFit(1500,300,(inputNode) => {
          return inputNode.id === node.id
        })
        // console.log(refGraph.current.zoom)
      }
    },
    [is3D]
  );

  const handleOnClickAddNode = useCallback(() => {
    const nodeToJumpTo = myData.nodes.find(
      (node) => node.id === myData.nodes[0].id
    );

    jumpToNode(refGraph, nodeToJumpTo);

    if (!myData.nodes.find((node) => node.id === nodeToAdd.id)) {
      setMyData({
        ...myData,
        nodes: [...myData.nodes, nodeToAdd],
        links: [
          ...myData.links,
          {
            target: 1346410,
            source: nodeToJumpTo.id,
            width: 0
          }
        ]
      });
    }
  }, [myData, refGraph, jumpToNode]);

  const handleOnClickNode = useCallback((node) => {
    setMenuData(false);
    setPanelData({ ...node });
  }, []);

  const handleOnRightClickNode = useCallback((node, event) => {
    console.log(event);
    setMenuData({
      positionX: event.pageX,
      positionY: event.pageY
    });
  }, []);

  const handleOnClickBackGround = useCallback((e) => {
    setMenuData(false);
  }, []);

  const handleOnRightClickBackGround = useCallback(() => {
    setMenuData(false);
  }, []);

  const handleOnclickClosePanel = useCallback(() => {
    setPanelData(false);
    setMenuData(false);
  }, []);

  const handleOnclickJumpToNode = useCallback(
    (node) => {
      jumpToNode(refGraph, node);
    },
    [refGraph, jumpToNode]
  );

  const handleOnClickToggle3D = useCallback(() => {
    setIs3D(!is3D);
  }, [is3D]);

  const Space = is3D ? ForceGraph3D : ForceGraph2D;

  return (
    <div className="App">
      <Space
        ref={refGraph}
        graphData={myData}
        nodeAutoColorBy={(node) => node.Title}
        onNodeClick={handleOnClickNode}
        onNodeRightClick={handleOnRightClickNode}
        onBackgroundClick={handleOnClickBackGround}
        onBackgroundRightClick={handleOnRightClickBackGround}
        nodeVal={(node) => 0}
        nodeLabel={(node) => node.Title}
        onNodeDragEnd={(node) => {
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
        }}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={(link) => {
          return link.width;
        }}
      />
      {panelData && (
        <Panel
          node={panelData}
          onClickClose={handleOnclickClosePanel}
          onClickJumpToNode={handleOnclickJumpToNode}
        />
      )}
      {menuData && (
        <Menu positionX={menuData.positionX} positionY={menuData.positionY} />
      )}
      <Toolbar>
        <Button onClick={handleOnClickAddNode}>Add node</Button>
        <Button onClick={handleOnClickRemoveNode}>Remove node</Button>
        <Button onClick={handleOnClickToggle3D}>Toggle Magic</Button>
      </Toolbar>
      <Info countNodes={myData.nodes.length} countLinks={myData.links.length} />
    </div>
  );
}
