import { useCallback, useEffect, useRef, useState } from "react";
import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import hardcodedNodes from "./hardCodedNodes.json";
import DummyData from "./data.json";
import InitalTenNodes from "./initialTenNodes.json";
import metaData from "./metaDataAsObj.json";
import topThreeArray from "./top_three_all.json";
import topThreeJson from "./top_three_formattedJson.json"
import hardcodedlinks from "./hardCodedLinks.json";
import topTenJson from "./top_ten_all.json"
import dataForIterations from "./dataForIterations.json";

import Button from "./Button";
import Info from "./Info";
import Menu from "./Menu";
import Panel from "./Panel";
import Toolbar from "./Toolbar";

import "./style.scss";
import log from "tailwindcss/lib/util/log";

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

const createLinks = (source, targets) => {// source: string, targets: Array<string>
  return targets.map(id => {
    return {"source": source, "target": id}
  });
}  


export default function App() {
  const [myData, setMyData] = useState(
    {
      "links": [],
      "nodes": [{
          "id":"0",
          "title": "Weather GAN: Multi-Domain Weather Translation Using Generative Adversarial Networks"
        }]
    }
  );
  const [hiddenData, setHiddenData] = useState(InitalTenNodes);
  const [nodeLinkStartEnd, setLinkStartEnd] = useState([0,3]);
  const [menuData, setMenuData] = useState(false);
  const [panelData, setPanelData] = useState(false);
  const [is3D, setIs3D] = useState(false);

  const trackers = {0: InitalTenNodes.nodes};
  const idsOfInitialNodes = InitalTenNodes.nodes.map(node => node.id);
  const [trackerData, setTrackerData] = useState(trackers);
  let [count, setCount] = useState(0);
  const [nodesAlreadyThere, setNodesAlready] = useState(idsOfInitialNodes);
  const refGraph = useRef();
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

  // const createIteration = () => {
  //   let newNodes = [];
  //   let newLinks = [];
  //   let idsOfNewlyCreatedNodes = [...nodesAlreadyThere];
  //   const nodesFromCurrentIteration = trackerData[count];
  //   nodesFromCurrentIteration.forEach(node => { // []10
  //     const topTenConnectedToCurrentNode = topTenJson[node.id]; // []10
  //     const topTenIdsRelatedToThisNode_noRepeats = topTenConnectedToCurrentNode.filter(node => { // []
  //       return !idsOfNewlyCreatedNodes.includes(parseInt(node));
  //     });
  //     const newCreatedNodes = createNodes(topTenIdsRelatedToThisNode_noRepeats); // []string
  //     const idsOfNewNodes = newCreatedNodes.map(node => node.id);
  //     const newCreatedLinks = createLinks(node.id, topTenConnectedToCurrentNode.map(stringy => parseInt(stringy)))
  //     newLinks = newLinks.concat(newCreatedLinks);
  //     newNodes = newNodes.concat(newCreatedNodes);
  //     idsOfNewlyCreatedNodes = idsOfNewlyCreatedNodes.concat(idsOfNewNodes)
  //   });

  //   setNodesAlready([...idsOfNewlyCreatedNodes]);
  //   setCount(count + 1);
  //   trackerData[count + 1] = newNodes;
    
  //   setTrackerData({
  //    ...trackerData
  //   })
      
  //   setMyData({
  //     nodes: [...myData.nodes,...newNodes],
  //     links: [...myData.links, ...newLinks]
  //   })
  //   console.log(myData)
  // }
  const [myCounter, setMyCounter] = useState(0);

  const fakeData = {
    0: {
      "links": [{"source":0,"target":1}, {"source":0,"target":2},{"source":0,"target":3},{"source":0,"target":4}],
      "nodes": [{"id": 1},{"id": 2},{"id": 3},{"id": 4}]
    },
    1: {
      "links": [{"source":1,"target":5},{"source":1,"target":2},{"source":1,"target":3}],
      "nodes": [{"id": 5}]
    },
    2: {
      "links": [{"source":2,"target":5},{"source":2,"target":4}],
      "nodes": []
    },
    3: {
      "links": [{"source":3,"target":5},{"source":3,"target":4}],
      "nodes": []
    },
    4: {
      "links": [{"source":4,"target":5}],
      "nodes": []
    },
    5: {
      "links": [],
      "nodes": []
    }
  }

  const createDataNeeded = () => {
    const allNodes = [];
    const finalObject = {};
    for(let key in topTenJson) {
      const links = topTenJson[key].map(idString => {
        return {"source": key, "target": idString }
      })
      const nodes = [];
      topTenJson[key].forEach(idString => { // all of the targets metadata, but not the key itself
        const nodeMetaData = {
          "title": metaData[idString].title,
          "id": idString
        }
        if (!allNodes.includes(idString)) {
          nodes.push(nodeMetaData)
        }
      })

      finalObject[key] = {
        links,
        nodes
      }

    }
    console.log(finalObject)
  }
  // createDataNeeded()
  
  const createIteration = (fromClick) => { // error happens when there are sources not inside the metadata
    const currentLinkSourceId = myCounter.toString();
    const nodesToBeAdded = [];
    const allNodeIdsAlreadyWritten = [...myData.nodes].map(node => node.id);
    if (!allNodeIdsAlreadyWritten.includes(currentLinkSourceId)) {
      nodesToBeAdded.push({
        "id": currentLinkSourceId,
        "title": metaData[currentLinkSourceId].title
      })
    }
    const dataAddedSoFar = [...nodesToBeAdded,...myData.nodes].map(node => node.id);
    dataForIterations[myCounter].nodes.forEach(node => {
      if (!dataAddedSoFar.includes(node.id)) {
        nodesToBeAdded.push(node)
      }
    })
    setMyData({
      "links": [...myData.links ,...dataForIterations[myCounter].links],
      "nodes": [...nodesToBeAdded,...myData.nodes] // the source node, the old nodes, the current nodes
    })
    
    if (myCounter < 50 || fromClick) { 
      setMyCounter(myCounter + 1);
      
    }
  }

     useEffect(() => {
      if (myCounter < 50) {
        const interval = setInterval(() => {
          createIteration(false, interval)
        }, 100);
        return () => clearInterval(interval);
      }
    }, [myCounter]);

    // useEffect(() => {
    //   createIteration(false)
    // }, [myCounter]);


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

  // const handleAutomateAddNodes = () => {
  //   // useEffect(() => {
  //   //   const interval = setInterval(() => {
  //   //     createIteration()
  //   //   }, 300);
  //   //   return () => clearInterval(interval);
  //   // }, [myCounter]);

  //   useEffect(() => {
  //       createIteration()
  //   }, [myCounter]);
  // }

  const handleOnClickNode = useCallback((node) => {
    setMenuData(false);
    setPanelData({ ...node });
  }, []);

  const handleOnRightClickNode = useCallback((node, event) => {
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
        nodeAutoColorBy={(node) => node.title}
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
        <Button onClick={createIteration.bind({}, [true])}>Add Connections</Button>
        <Button onClick={handleOnClickToggle3D}>Toggle Space</Button>
      </Toolbar>
      <Info countNodes={myData.nodes.length} countLinks={myData.links.length} />
    </div>
  );
}
