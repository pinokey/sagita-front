//サイトの表側を司るコード
import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/sagitaPortal.json";

const App = () => {
  // ユーザーのパブリックウォレットを保存するために使用する状態変数を定義する
  //currentAccountという変数をsetCurrentAccountという関数を使って変えますよという宣言
  //{x}で値を支える
  const [currentAccount, setCurrentAccount] = useState("");
  console.log("currentAccount: ", currentAccount);
  const [ParentName, setParentName] = useState("");
  const [ParentAddress, setParentAddress] = useState("");
  const [ChildName, setChildName] = useState("");
  const [ChildAddress, setChildAddress] = useState("");

  const [allEdges, setAllEdges] = useState([]);
  const contractAddress = "0xc8b538D83669604772C18F7B004Bfe7053cDb33b";
  const contractABI = abi.abi;
  const getAllEdges = async () => {
    const {ethereum} = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const sagitaPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        //コントラクトからgetAllWavesメソッドを呼び出す
        const edges = await sagitaPortalContract.getAllEdges();
        //UIに必要な三つの情報を以下のように設定(親、子、承認数) 
        const edgesCleaned = edges.map(edge => {
          return {
            parentname: edge.parentname,
            childname: edge.childname, 
            approvecount: edge.approvers.length,
          };
        });
        setAllEdges(edgesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!!");        
      }
    } catch (error) {
      console.log(error);
    }
  };


  const checkIfWalletIsConnected = async () => { 
    //window.ethereumにアクセスできることを確認する
    try {
    const {ethereum} = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum); 
    }
    //ユーザーのウォレットへのアクセス許可を確認
    const accounts = await ethereum.request({ method: "eth_accounts" }); 
    if (accounts.length !==  0) {
      const account = accounts[0]; 
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found")
    }
  } catch (error) {
    console.log(error);
  }
};

//emitされたイベントに反応する
useEffect(() => {
  let sagitaPortalContract;

  const onNewEdge = (indexer, timestamp, parentname, parentcontract, childname, childcontract, approvers) =>  {
    console.log("NewWave", parentname, childname, approvers);
    setAllEdges(prevState => [
      ...prevState,
      {
        parentname: parentname,
        childname: childname, 
        approvecount: approvers.length
      },
    ]);
  };

  //new edgeイベントがコントラクトから発信された時情報を受け取る
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    sagitaPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    sagitaPortalContract.on("NewEdge", onNewEdge);
  }
  //メモリリークを防ぐためにnewWaveのイベントを解除します
  return () => {
    if (sagitaPortalContract) {
      sagitaPortalContract.off("NewEdge", onNewEdge);
    }
  };
}, []);

//connectWallet メソッドの実装
const connectWallet = async () => {
  try {
    const {ethereum} = window;
    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }
    const accounts = await ethereum.request({method: "eth_requestAccounts"});
    console.log("Connected: ", accounts[0]);
    setCurrentAccount(accounts[0]);    
  } catch (error) {
    console.log(error)
  }
}

//edgeを追加する関数を実装
const AddEdge = async() => {
  try {
    const {ethereum} = window;
    console.log("aaa");    
    if (ethereum) {
      console.log("bb");    
      const provider = new ethers.providers.Web3Provider(ethereum);
    
      const signer = provider.getSigner();
      const sagitaPortalContract = new ethers.Contract(contractAddress,  contractABI, signer);
      // let count = await sagitaPortalContract.getTotalWaves();
      // let contractBalance = await provider.getBalance( 
      //   sagitaPortalContract.address);
      //   console.log(
      //     "Contract balance:", 
      //     ethers.utils.formatEther(contractBalance)
      //   );
      // console.log("Retrieved total wave count...", count.toNumber());
      console.log("Signer:",signer);    
      //コントラクトにwaveを書き込む
      const addedgeTxn = await sagitaPortalContract.addEdge(ParentName,ParentAddress,ChildName,ChildAddress,[], {gasLimit:300000});
      console.log("Mining...", addedgeTxn.hash);
      await addedgeTxn.wait();
      console.log("Minted --", addedgeTxn.hash);
      getAllEdges();
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
  console.log(error)
  } 
}


//投票する関数を実装
const approve = async(index) => {
  try {
    const {ethereum} = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const sagitaPortalContract = new ethers.Contract(contractAddress,  contractABI, signer);
      // let count = await sagitaPortalContract.getTotalWaves();
      let contractBalance = await provider.getBalance( 
        sagitaPortalContract.address);
      //   console.log(
      //     "Contract balance:", 
      //     ethers.utils.formatEther(contractBalance)
      //   );
      // console.log("Retrieved total wave count...", count.toNumber());
      console.log("Signer:",signer);    
      //コントラクトにwaveを書き込む
      const approveTxn = await sagitaPortalContract.approve(index, {gasLimit:300000});
      console.log("Mining...", approveTxn.hash);
      await approveTxn.wait();
      console.log("Minted --", approveTxn.hash);
      // count = await sagitaPortalContract.getTotalWaves();
      // console.log("Retrieved total wave count ...", count.toNumber()) ;
      // let contractBalance_post = await provider.getBalance(sagitaPortalContract.address);
      // if (contractBalance_post < contractBalance){
      //   console.log("User won ETH!");
      // } else {
      //   console.log("User didn't win Eth.");
      // }
      // console.log(
      //   "contract balance after approval",
      //   ethers.utils.formatEther(contractBalance_post)
      // );
      getAllEdges();
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
  console.log(error)
  } 
}
  
// webページがロードされた時、実行する関数
  useEffect(() => {
    checkIfWalletIsConnected();  
    getAllEdges();
  }, []) 
  return (

    <div className="mainContainer">
       <div className="fixed left-0 right-0 bg-white z-10">
         <div className="mx-auto max-w-7xl px-2 lg:px-4">
       <header className="flex flex-col lg:flex-row lg:items-center lg:h-20">
       <div className="flex items-center h-14"><div className="flex flex-grow"><a className="flex items-center" href="/">
      Sagita
       </a>
       </div>
       </div>
               <div className="ml-auto flex items-center"><nav className="hidden lg:flex space-x-10 ml-4 items-center"><a className="text-base font-medium text-gray-500 hover:text-gray-900" href="/addedge">Add Band</a><a className="text-base font-medium text-gray-500 hover:text-gray-900" href="/validation">Approve Band</a>
               <div>Chain: <b>Rinkeby</b></div>
               <div>
                  {/* ウォレットコネクトボタンの実装*/}
        {!currentAccount &&  (
          <button className="mx-auto justify-center py-2 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md border border-transparent" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {currentAccount && (
          <button className="mx-auto justify-center py-2 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md border border-transparent" onClick={connectWallet}>
            Wallet Connected
          </button>
        )}</div></nav></div></header></div></div>
      <div className="dataContainer">
        <div className="text-lg mb-1">
          What is segita?
        </div>
        <div className="text-gray-400 text-sm bio">
          sagita visualizes the relation of the original and fanfic. Let's visualize your community!!
        </div>
       
        <h2 className="text-lg mb-1">Add Bands</h2>
        <div className="sticky bottom-0 py-4 md:py-0 bg-white mb-12">
        {currentAccount && (
          <form className="mt-8 space-y-4">
    
      <div className="rounded-md -space-y-px text-sm md:text-base">
      <div className="grid grid-cols-12 items-center">
      <label for="ParentName" className="col-span-3 text-left">Parent Collection Name<span className="text-red-400">*</span></label>
      <textarea name="messageArea" className="col-span-9 appearance-none rounded-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      placeholder="Parent Collection Name"
      type="text"
      id="ParentName"
      value={ParentName}
      onChange={e => setParentName(e.target.value)}/>
      </div>
      <div className="grid grid-cols-12 items-center">
      <label for="ParentAddress" className="col-span-3 text-left">Parent Collection Contract Address<span className="text-red-400">*</span></label>
      <textarea name="messageArea" className="col-span-9 appearance-none rounded-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      placeholder="Parent Contract Address"
      type="text"
      id="ParentAddress"
      value={ParentAddress}
      onChange={e => setParentAddress(e.target.value)}/>
      </div>
       <div className="grid grid-cols-12 items-center">
       <label for="ChildName" className="col-span-3 text-left">Child Collection Name<span className="text-red-400">*</span></label>
       <textarea name="messageArea" className="col-span-9 appearance-none rounded-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      placeholder="Child Collection Name"
      type="text"
      id="ChildName"
      value={ChildName}
      onChange={e => setChildName(e.target.value)}/>
      </div>
      <div className="grid grid-cols-12 items-center">
      <label for="ChildAddress" className="col-span-3 text-left">Child Collection Contract Address<span className="text-red-400">*</span></label>
       <textarea name="messageArea" className="col-span-9 appearance-none rounded-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      placeholder="Child Contract Address"
      type="text"
      id="ChildAddress"
      value={ChildAddress}
      onChange={e => setChildAddress(e.target.value)}/>
      </div>
          </div>
     
      </form>)}
      </div>
      {currentAccount && (
      <button className="group  addband relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => AddEdge()}>
        add band
      </button>)}
     

        <h2 className="text-lg mb-1">Bands</h2>
        <p className="text-gray-400 text-sm">Please approve to visualize your community !!</p>
        {/*edgeのリストとapproveボタンを表示*/}
        {currentAccount && (
          allEdges.slice(0).map((edge, index) => {
            return (
              <div>
              <div key={index} style={{ backgroundColor: "#F8F8FF", marginTop: "16px", padding: "8px"}}>
                <div>Parent: {edge.parentname}</div>
                <div>Child: {edge.childname}</div>
                <div>Approves: {edge.approvecount}</div>
                </div>
                <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => approve(index)}>
          approve
        </button> 
                </div>
            )
          })
        )}
      
      </div>
     
    </div>
  );
}
export default App


// export default function App() {

//   const wave = () => {

//   }

//   return (
//     <div className="mainContainer">

//       <div className="dataContainer">
//         <div className="header">
//         <span role="img" aria-label="hand-wave">👋</span> WELCOME!
//         </div>

//         <div className="bio">
//         イーサリアムウォレットを接続して、メッセージを作成したら、<span role="img" aria-label="hand-wave">👋</span>を送ってください<span role="img" aria-label="shine">✨</span>
//         </div>

//         <button className="waveButton" onClick={wave}>
//         Wave at Me
//         </button>
//       </div>
//     </div>
//   );
// }
