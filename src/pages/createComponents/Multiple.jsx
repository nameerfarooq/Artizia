import React from "react";
import Header from "../landingpage/Header";
import Footer from "../landingpage/Footer";
import PageTopSection from "../../components/shared/PageTopSection";
import { useState, useEffect, useRef } from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiFillTag } from "react-icons/ai";
import { BsFillClockFill } from "react-icons/bs";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider from "rc-slider";
import Web3Modal from "web3modal";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinanta";
import { create as ipfsHttpClient } from "ipfs-http-client";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import Search from "../../components/shared/Search";
import Duck from "../../../public/assets/images/duck.png";
import NftCard from "./NftCard";
import duck from '../../../public/assets/images/duck.png'

const fileTypes = ["JPG", "PNG", "GIF"];

const Multiple = ({ search, setSearch }) => {
  const [image, setImage] = useState("");
  // const [price, setPrice] = useState(0);
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  // const [minimumBid, setMinimumBid] = useState("");
  // const [startingTime, setStartingTime] = useState("");
  // const [endTime, setEndTime] = useState("");
  const [listingType, setlistingType] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  // const [imageList, setImageList] = useState([]);
  // const [ipfsList, setIPFSList] = useState([]);
  // const [urlList, setURLList] = useState([]);
  // start end date control logic
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      price = Number(value);
      console.log("Price", price);
      setInputValue(value);
      setShowWarning(false);
    } else {
      setShowWarning(true);
    }
  };

  var startTime = useRef(0);
  var endTime = useRef(0);

  useEffect(() => {
    if (startingDate && endingDate && endingDate < startingDate) {
      alert("End date should be after start date");
      setEndingDate("");
    }
  }, [startingDate, endingDate]);

  let price = useRef(0);
  const title = useRef("");
  const description = useRef("");

  var item = {};

  let imageList = useRef([]);
  let ipfsList = useRef([]);
  let urlList = useRef([]);

  const [crypto, setCrypto] = useState({
    value: 0,
    label: "ETH",
  });

  const [collection, setCollection] = useState({
    value: "USDT",
    label: "Select Collection",
  });
  // const collection = useRef("");

  const cryptoOptions = [
    { value: "", label: "Select Crypto" },
    { value: 0, label: "ETH" },
    { value: 1, label: "USDT" },
  ];

  const [collectionOptions, setcollectionOptions] = useState([
    { value: "", label: "Select Collection" },
    { value: "usdt", label: "USDT" },
  ]);

  const defaultOption = collectionOptions[0];
  const defaultCrypto = cryptoOptions[0];

  // const item = {};
  const [loading, setLoading] = useState(false);

  const addURLInList = (newValue) => {
    urlList.push(newValue);
  };

  // let tempImageList = [];
  const addImageIPFSInList = (newValue) => {
    imageList.push(newValue);
  };

  // let tempIPFSList = [];
  const addDataIPFSInList = (newValue) => {
    ipfsList.push(newValue);
  };

  const web3ModalRef = useRef();
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();

    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 31337) {
      window.alert("Change the network to Sepolia");
      throw new Error("Change network to Sepolia");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      // console.log("getSigner");

      return signer;
    }
    // console.log("getProvider");
    return web3Provider;
  };

  // Upload image to IPFS
  const uploadToIPFS = async (event) => {
    // console.log("file in uploadTOIpfs", file);
    if (typeof file !== "undefined") {
      for (let i = 0; i < file.length; i++) {
        try {
          // console.log("this is image file no", i, file[i]);
          const resut = await uploadFileToIPFS(file[i]);
          console.log("resut.pinataURL", resut.pinataURL);
          addImageIPFSInList(resut.pinataURL);
        } catch (error) {
          console.log("ipfs image upload error: ", error);
        }
      }

      // console.log("imageList", imageList);
      if (imageList.length != 0) {
        createNFT();
      } else {
        window.alert("imageList list is empty");
      }
    }
  };

  // Upload image and data to IPFS
  const createNFT = async () => {
    // console.log("CreateNFT");
    for (let i = 0; i < imageList.length; i++) {
      let image = imageList[i];
      let price = item.price;
      let crypto = 0;
      let collection = item.collection;
      let title = item.title;
      let description = item.description;
      // console.log("listingType", listingType);
      if (listingType == 0) {
        try {
          console.log("image", image);

          const dataInJSON = JSON.stringify({
            image,
            listingType,
            price,
            crypto,
            collection,
            title,
            description,
            royalty,
          });
          console.log("dataInJSON", dataInJSON);
          const result = await uploadJSONToIPFS(dataInJSON);
          addDataIPFSInList(result.pinataURL);

          console.log("result.pinataURL", result.pinataURL);
        } catch (error) {
          console.log("ipfs uri upload error: ", error);
        }
      } else {
        try {
          const dataInJSON = JSON.stringify({
            image,
            listingType,
            price,
            startingDate,
            endingDate,
            crypto,
            collection,
            title,
            description,
            royalty,
          });

          const result = await uploadJSONToIPFS(dataInJSON);

          addDataIPFSInList(result.pinataURL);

          console.log("RESULT.pinataURL", result.pinataURL);
        } catch (error) {
          console.log("ipfs uri upload error: ", error);
        }
      }
    }

    if (ipfsList.length != 0) {
      mintThenList();
    } else {
      window.alert("IPFS list is empty");
    }
  };

  // mint the NFT then list
  const mintThenList = async () => {
    const signer = await getProviderOrSigner(true);
    // console.log("Get the signer", signer);

    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS.address,
      NFT_CONTRACT_ABI.abi,
      signer
    );

    // console.log("NFT", nftContract);
    // console.log("NFT contract address", nftContract.address);
    // console.log("ipfsList", ipfsList);
    console.log("ipfsList", ipfsList);

    await (await nftContract.mint(ipfsList)).wait();

    let mintedTokens = await nftContract.getMintedTokensList();
    // console.log("mintedTokens before", mintedTokens);
    let multi = false;
    if (mintedTokens.length > 1) {
      multi = true;
      let listOfTokens = [];
      for (let i = 0; i < mintedTokens.length; i++) {
        console.log("mintedTokens[i]", mintedTokens[i].toString());
        listOfTokens.push(Number(mintedTokens[i].toString()));
      }
      mintedTokens = listOfTokens;
    } else {
      mintedTokens = Number(mintedTokens);
    }

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    // console.log("startTimestamp in if", startingDate);
    // console.log("endTimestamp in if", startingDate);

    // if (listingType == 0) {
    //   console.log("startTimestamp in if", startingDate);
    //   console.log("endTimestamp in if", startingDate);
    //   setStartingDate(0);
    //   setEndingDate(0);
    // } else if (listingType == 1) {
    //   const startDate = new Date(startingDate);
    //   const endDate = new Date(endingDate);

    //   // Convert start date to Unix timestamp (seconds)
    //   const startTimestamp = Math.floor(startDate.getTime() / 1000);

    //   // Convert end date to Unix timestamp (seconds)
    //   const endTimestamp = Math.floor(endDate.getTime() / 1000);

    //   console.log("startTimestamp in else", startTimestamp);
    //   console.log("endTimestamp in else", endTimestamp);
    // }

    // console.log("mintedTokens", mintedTokens);
    // console.log("item.price", item.price);
    // console.log("royalty", royalty);
    // console.log("listingType", listingType);
    // console.log("item.crypto", crypto);

    // UNCOMMENT this

    await (
      await marketplaceContract.listNft(
        nftContract.address,
        multi ? mintedTokens : [mintedTokens],
        ethers.utils.parseEther(item.price),
        royalty,
        listingType,
        startTime,
        endTime,
        crypto
      )
    ).wait();
    setLoading(false);
  };

  const [file, setFile] = useState(null);

  const handlechange = (file) => {
    setFile(file);
  };

  const [royalty, setRoyalty] = useState(0);
  const handleSliderChange = (value) => {
    // Update the value or perform any other actions
    console.log("Slider value:", value);
    setRoyalty(value);
    // ...
  };
  // const handleSliderChange = (value) => {
  //   // setRoyalty(value);
  //   if (value === 33) {
  //     setRoyalty(5);
  //   } else if (value === 66) {
  //     setRoyalty(10);
  //   } else if (value === 100) {
  //     setRoyalty(15);
  //   }
  // };

  useEffect(() => { }, [
    price,
    title,
    description,
    startingDate,
    endingDate,
    ipfsList,
    imageList,
  ]);

  const createItem = (e) => {
    setLoading(true);
    e.preventDefault();
    price = inputValue;

    console.log("crypto in check", crypto);

    console.log("startTimestamp in if", startingDate);
    console.log("endTimestamp in if", endingDate);

    if (listingType == 0) {
      console.log("startTimestamp in if", startingDate);
      console.log("endTimestamp in if", endingDate);
      setStartingDate(0);
      setEndingDate(0);
      startTime = 0;
      endTime = 0;
    } else if (listingType == 1) {
      const startDate = new Date(startingDate);
      const endDate = new Date(endingDate);

      // Convert start date to Unix timestamp (seconds)
      const startTimestamp = Math.floor(startDate.getTime() / 1000);

      // Convert end date to Unix timestamp (seconds)
      const endTimestamp = Math.floor(endDate.getTime() / 1000);

      console.log("startTimestamp in else", startTimestamp);
      console.log("endTimestamp in else", endTimestamp);
      setStartingDate(startTimestamp);
      setEndingDate(endTimestamp);
      startTime = startTimestamp;
      endTime = startTimestamp;
    }

    console.log("CHECK startingDate", startTime);
    console.log("CHECK endingDate", endTime);

    imageList = [];
    ipfsList = [];
    urlList = [];

    item = {
      title: title.current.value,
      price: price,
      description: description.current.value,
      crypto: 0,
      file: file,
      collection: collection,
    };

    // console.log("file", file);
    if (
      item.title != null &&
      item.price != null &&
      item.description != null &&
      item.crypto != null &&
      item.file != null &&
      item.collection != null
    ) {
      uploadToIPFS(file);
    } else {
      window.alert("Fill all the fields to continue");
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "hardhat",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      // numberOFICOTokens();
    }
  }, [walletConnected, price]);

  const getItem = async () => {
    try {
      const provider = await getProviderOrSigner();

      const marketplaceContract = new Contract(
        MARKETPLACE_CONTRACT_ADDRESS.address,
        MARKETPLACE_CONTRACT_ABI.abi,
        provider
      );

      const _listedNfts = await marketplaceContract.getListedNfts();

      console.log("listedNfts", _listedNfts);

      for (let i = 0; i < _listedNfts.length; i++) {
        console.log("_listedNfts", _listedNfts[i]);
      }

      // setTokenIdsMinted(_tokenIds.toString());
    } catch (err) {
      console.error(err);
    }
  };
  // const [collectionOptions, setcollectionOptions] = useState([
  //   { value: "", label: "Select Collection" },
  //   { value: "usdt", label: "USDT" },
  // ]);

  const [showProfileNFT, setshowProfileNFT] = useState(false);
  const [ShowMore, setShowMore] = useState(false);
  const [CreateCollection, setCreateCollection] = useState("");
  const [showCreateCollection, setshowCreateCollection] = useState(false);

  const AddCollection = () => {
    if (CreateCollection.length < 1) {
      alert("Input Collection Name to Create");
    } else {
      setcollectionOptions((previousOptions) => [
        ...previousOptions,
        { value: CreateCollection.toLowerCase(), label: CreateCollection },
      ]);
      console.log(collectionOptions, "collection updated");
      hideCreateCollection();
    }
  };
  const hideCreateCollection = () => {
    setCreateCollection("");
    setshowCreateCollection(false);
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const [selectedImagesNFT, setSelectedImagesNFT] = useState("");

  const fileInputRef2 = useRef(null);

  const handleButtonClick2 = () => {
    fileInputRef2.current.click();
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const imageUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedImagesNFT([...selectedImagesNFT, ...imageUrls]);

  };

  const handleRemoveImage = (index) => {
    const newArray = [...selectedImagesNFT];
    newArray.splice(index, 1);
    setSelectedImagesNFT(newArray);
  };

  const [NFts, setNfts] = useState('');

  useEffect(() => {
    if (selectedImagesNFT.length > 0) {
      if (listingType === 0) {

        const newNFTs = selectedImagesNFT.map((image, index) => ({
          image,
          price: '',
          desc: '',
          status: ''
        }));
        setNfts((prevNFTs) => [...prevNFTs, ...newNFTs.slice(prevNFTs.length)]);
      }
      else if (listingType === 1) {
        const newNFTs = selectedImagesNFT.map((image, index) => ({
          image,
          bid: '',
          startDate: '',
          endDate: '',
          desc: '',
          status: ''
        }));
        setNfts((prevNFTs) => [...prevNFTs, ...newNFTs.slice(prevNFTs.length)]);
      }
    }
  }, [selectedImagesNFT]);

  const handleRemoveCompletedNft = (index) => {
    handleRemoveImage(index)
    const newArray = [...NFts];
    newArray.splice(index, 1);
    setNfts(newArray);
  };
  const [currentNFT, setCurrentNFT] = useState(0)

  const [nftForm, setnftForm] = useState('')
  useEffect(() => {
    if (listingType === 0) {
      setnftForm({
        "price": "",
        "desc": "",
      })
    }
    else if (listingType === 1) {
      setnftForm({
        "desc": "",
        'bid': "",
        'startDate': "",
        'endDate': ""
      })
    }
  }, [listingType])


  const handleNftForm = (e) => {
    console.log("handling", e.target.name, e.target.value)
    setnftForm({ ...nftForm, [e.target.name]: e.target.value });
  }
  const saveNFT = () => {
    if (listingType === 0) {
      if (!nftForm.price || !nftForm.desc) {
        alert("Fill all fields to save a NFT")
      }
      else {

        const Data = {
          "price": nftForm.price,
          "desc": nftForm.desc,
          "image": NFts[currentNFT].image,
          "status": "completed"
        }
        setnftForm({
          "price": "",
          "desc": ""
        })
        updateCompleted(currentNFT, Data)
      }
    }

    else if (listingType === 1) {
      if (!nftForm.bid || !nftForm.desc || !nftForm.startDate || !nftForm.endDate) {
        alert("Fill all fields to save a NFT")
      }
      else {
        const Data = {
          "bid": nftForm.bid,
          "startDate": nftForm.startDate,
          "endDate": nftForm.endDate,
          "desc": nftForm.desc,
          "image": NFts[currentNFT].image,
          "status": "completed"
        }
        setnftForm({
          "bid": "",
          "desc": "",
          "startDate": "",
          "endDate": "",
          "image": "",
          "status": ""
        })
        updateCompleted(currentNFT, Data)
      }

    }

  }

  useEffect(() => {

    console.log(NFts, "final data")
    console.log(currentNFT, "Current NFT")
  }, [currentNFT, NFts])


  const updateCompleted = (index, updatedData) => {
    setNfts((prevNFTs) => {
      const updatedNFTs = [...prevNFTs];
      updatedNFTs[index] = { ...updatedNFTs[index], ...updatedData };
      return updatedNFTs;
    });


  };

  const [tabIndex, setTabIndex] = useState(0)
  useEffect(() => {
    if (NFts.length > 0) {

      if (NFts[0].status !== "completed") {
        setCurrentNFT(0);
      }
    }
    if (NFts.length > 0) {
      for (let i = 1; i < NFts.length; i++) {

        if (NFts[i - 1].status === "completed" && NFts[i].status !== "completed") {
          setCurrentNFT(i);
          break;
        }
      }
    }
    console.log("curent nft is", currentNFT)
  }, [NFts]);



  const tabs = Math.floor(NFts.length / 10);

  // Create an array of the desired length


  useEffect(() => {
    if (listingType === 1) {
      if (nftForm.startDate && nftForm.endDate && nftForm.endDate < nftForm.startDate) {
        alert("End date should be after start date");
        setnftForm(prevForm => ({
          ...prevForm,
          endDate: "" // Replace with your desired end date value
        }));
      }
    }

  }, [nftForm.startDate, nftForm.endDate]);

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() - 1); // Subtract 1 day from today's date
    const selectedStartDate = new Date(nftForm.startDate);

    if (selectedStartDate < today) {
      alert("Start date should not be before today's date");
      setnftForm(prevForm => ({
        ...prevForm,
        startDate: '' // Replace with your desired start date value
      }));
    }
  }, [nftForm.startDate]);

  const [choosenCollection, setChoosenCollection] = useState("")
  useEffect(() => {
    setChoosenCollection(collection)
    console.log("choosen", choosenCollection)
  }, [collection])

  const [selectedImage2, setSelectedImage2] = useState(null);
  const handleInputChange2 = (e) => {
    const file = e.target.files[0];
    setSelectedImage2(file);
  };
  const [collectionFinalized, setcollectionFinalized] = useState(false)

  return (
    <>
      <Header search={search} setSearch={setSearch} />
      <div className="create-single">
        <PageTopSection title={"Create Multiple Collectible"} />
        <div className="create-single-section-wrap">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <div className="row">
                  {!collectionFinalized &&
                    <>

                      <div className="line-three">
                        <div className="row">
                          <div className="col-lg-12">
                            <h2>Choose collection</h2>
                            <p>
                              This is the collection where your item will appear.
                            </p>
                            <Dropdown
                              options={collectionOptions}
                              onChange={(e) => {
                                console.log("important", e)
                                setCollection(e);
                              }}
                              value={collection.value}
                            />
                            <div
                              className="create-collection-btn"
                              onClick={() => setshowCreateCollection(true)}
                            >
                              <svg
                                enable-background="new 0 0 50 50"
                                height="25px"
                                id="Layer_1"
                                version="1.1"
                                viewBox="0 0 50 50"
                                width="25px"
                                xml: space="preserve"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlns: xlink="http://www.w3.org/1999/xlink"
                              >
                                <rect fill="none" height="50" width="50" />
                                <line
                                  fill="#2638CC"
                                  stroke="#2638CC"
                                  stroke-miterlimit="10"
                                  stroke-width="4"
                                  x1="9"
                                  x2="41"
                                  y1="25"
                                  y2="25"
                                />
                                <line
                                  fill="#2638CC"
                                  stroke="#2638CC"
                                  stroke-miterlimit="10"
                                  stroke-width="4"
                                  x1="25"
                                  x2="25"
                                  y1="9"
                                  y2="41"
                                />
                              </svg>
                              Create Collection
                            </div>
                            {showCreateCollection && (
                              <div className="Create-collection-popup">
                                <div className="Create-collection-popup-inner">
                                  <p>Collection Name</p>
                                  <input
                                    value={CreateCollection}
                                    onChange={(e) =>
                                      setCreateCollection(e.target.value)
                                    }
                                    type="text"
                                    placeholder="Enter collection name"
                                  />
                                  <p className="txt-2">Upload image</p>
                                  <input type="file" accept="image/*" onChange={handleInputChange2} />

                                  <div className="popUp-btn-group">
                                    <div
                                      className="button-styling btnCC"
                                      onClick={() => AddCollection()}
                                    >
                                      Next
                                    </div>
                                    <div
                                      onClick={hideCreateCollection}
                                      className="button-styling-outline btnCC"
                                    >
                                      <div className="btnCCin">Cancel</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div onClick={() => setcollectionFinalized(true)} className="browse-btn my-5 button-styling">Next</div>
                          </div>
                        </div>
                      </div>
                    </>}
                  {collectionFinalized &&
                    <>

                      <div className="col-lg-12">
                        {!showProfileNFT &&
                          <>
                            <div className="row">
                              <div className="col-lg-12">
                                <h2>Select method</h2>
                              </div>
                              <div className="col-lg-3 col-md-4 col-6">
                                <div
                                  onClick={() => {
                                    setlistingType(0);
                                  }}
                                  className={` create-single-card ${listingType === 0 ? "active" : ""
                                    }`}
                                >
                                  <AiFillTag />
                                  <h3>Fixed Price</h3>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-4 col-6">
                                <div
                                  onClick={() => {
                                    setlistingType(1);
                                  }}
                                  className={` create-single-card ${listingType === 1 ? "active" : ""
                                    }`}
                                >
                                  <BsFillClockFill />
                                  <h3>Timed Auction</h3>
                                </div>
                              </div>
                            </div>
                            <br />
                            <br />


                            {/* <div className="line-three">
                          <div className="row">
                            <div className="col-lg-12">
                              <h2>Choose collection</h2>
                              <div className="row">
                                <div className="col-lg-9">
                                  <p>
                                    This is the collection where your item will appear.
                                  </p>
                                  <Dropdown
                                    options={collectionOptions}
                                    onChange={(e) => {
                                      setCollection(e.value);
                                    }}
                                    value={defaultOption.value}
                                  />
                                  <div
                                    className="create-collection-btn"
                                    onClick={() => setshowCreateCollection(true)}
                                  >
                                    <svg
                                      enable-background="new 0 0 50 50"
                                      height="25px"
                                      id="Layer_1"
                                      version="1.1"
                                      viewBox="0 0 50 50"
                                      width="25px"
                                      xml: space="preserve"
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlns: xlink="http://www.w3.org/1999/xlink"
                                    >
                                      <rect fill="none" height="50" width="50" />
                                      <line
                                        fill="#2638CC"
                                        stroke="#2638CC"
                                        stroke-miterlimit="10"
                                        stroke-width="4"
                                        x1="9"
                                        x2="41"
                                        y1="25"
                                        y2="25"
                                      />
                                      <line
                                        fill="#2638CC"
                                        stroke="#2638CC"
                                        stroke-miterlimit="10"
                                        stroke-width="4"
                                        x1="25"
                                        x2="25"
                                        y1="9"
                                        y2="41"
                                      />
                                    </svg>
                                    Create Collection
                                  </div>
                                </div>
                                <div className="col-lg-3 col-md-3 col-5">
                                  <p>Crypto</p>
                                  <Dropdown
                                    options={cryptoOptions}
                                    onChange={(e) => {
                                      setCrypto(e.value);
                                    }}
                                    value={defaultCrypto.value}
                                  />
                                </div>
                              </div>


                              {showCreateCollection && (
                                <div className="Create-collection-popup">
                                  <div className="Create-collection-popup-inner">
                                    <p>Collection Name</p>
                                    <input
                                      value={CreateCollection}
                                      onChange={(e) =>
                                        setCreateCollection(e.target.value)
                                      }
                                      type="text"
                                      placeholder="Enter collection name"
                                    />
                                    <div className="popUp-btn-group">
                                      <button
                                        className="button-styling"
                                        onClick={() => AddCollection()}
                                      >
                                        Next
                                      </button>
                                      <button
                                        onClick={hideCreateCollection}
                                        className="button-styling-outline"
                                      >
                                        <div>Cancel</div>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                          </div>
                        </div> */}
                            <div className="line-four">
                              <div className="row">
                                <div className="col-lg-9">
                                  <h2>Title</h2>
                                  <input
                                    type="text"
                                    placeholder="e.g. ‘Crypto Funk"
                                    // defaultValue={title.current.value}
                                    ref={title}
                                  // onChange={(e) => setTitle(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="line-six">
                              <div className="row">
                                <div className="col-lg-9">
                                  <h2>Royalties</h2>
                                  <Slider
                                    min={0}
                                    max={15}
                                    defaultValue={0}
                                    // step={null}
                                    onChange={handleSliderChange}
                                    value={royalty}
                                  />
                                </div>
                                <div className="col-lg-3 ">
                                  <div className="royality-value">

                                    {royalty} %
                                  </div>
                                </div>
                              </div>
                            </div>

                            <button
                              className="button-styling"
                              onClick={() => setshowProfileNFT(true)}
                            >
                              Next
                            </button>
                          </>
                        }
                        {showProfileNFT &&

                          <div>

                            {/* <h2>Profile NFT</h2>
                            <div className="profile-nft-row1">
                              <div className="NFT-image-holder">
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  style={{ display: "none" }}
                                  onChange={handleImageUpload}
                                />
                                {selectedImage ? (
                                  <img src={selectedImage} alt="Uploaded" />
                                ) : (
                                  <img src={Duck} alt="" />
                                )}
                              </div>
                              <div className="NFT-image-upload-txt">
                                <p>
                                  PNG, JPG, GIF, WEBP <br /> or MP4. Max 200mb.
                                </p>
                                <button
                                  onClick={handleButtonClick}
                                  className="button-styling browse-btn"
                                >
                                  Browse
                                </button>
                              </div>
                            </div>
                            <br />
                            <br /> */}

                            <div className="col-lg-8 mx-auto collectionDivPreview">
                              <div className="img-holder">

                                <img src={duck} alt="" />
                              </div>
                              {/* <div className="title">
                            Collection Name

                          </div> */}
                              <div className="title-txt">
                                {choosenCollection.value}

                              </div>

                            </div>


                            <div>
                              <div>
                                <h2>Upload NFT</h2>
                                {NFts.length < 1 ? (
                                  <div className="Create-Collection-div">
                                    <p>PNG, JPG, GIF, WEBP or MP4. Max 200mb.</p>
                                    <br />
                                    <input
                                      ref={fileInputRef2}
                                      type="file"
                                      style={{ display: "none" }}
                                      multiple
                                      onChange={handleFileUpload}
                                    />
                                    <button
                                      onClick={handleButtonClick2}
                                      className="button-styling "
                                    >
                                      Browse
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <div className="NFT-thumbnail-holder">
                                      <div className="NFT-inner">
                                        {NFts.length > 0 &&
                                          NFts.map((nft, index) => {
                                            if (index >= tabIndex && index < Number(tabIndex + (10))) {
                                              return (
                                                < NftCard
                                                  isCompleted={nft.status === "completed" ? "true" : "false"}
                                                  isClicked={currentNFT === index ? "true" : "false"}
                                                  index={index}
                                                  img={nft.image}
                                                  handleRemoveImage={handleRemoveCompletedNft}
                                                />
                                              )
                                            }

                                          })}

                                      </div>

                                    </div>
                                    <div className="control-main-div">
                                      <input
                                        ref={fileInputRef2}
                                        type="file"
                                        style={{ display: "none" }}
                                        multiple
                                        onChange={handleFileUpload}
                                      />
                                      <button
                                        onClick={handleButtonClick2}
                                        className="button-styling "
                                      >
                                        Add More
                                      </button>
                                      {NFts.length > Number(10) &&
                                        <div className="controlsDiv">
                                          {NFts.length > Number(10)
                                            &&
                                            <>
                                              <svg onClick={() => setTabIndex(0)} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="7" cy="7" r="7" fill={`${tabIndex === 0 ? '#B601D1' : '#D9D9D9'}`} />
                                              </svg>
                                              <svg onClick={() => setTabIndex(10)} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="7" cy="7" r="7" fill={`${tabIndex === 10 ? '#B601D1' : '#D9D9D9'}`} />
                                              </svg>
                                            </>
                                          }


                                          {NFts.length > Number(20)
                                            &&
                                            <svg onClick={() => setTabIndex(20)} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <circle cx="7" cy="7" r="7" fill={`${tabIndex === 20 ? '#B601D1' : '#D9D9D9'}`} />
                                            </svg>
                                          }
                                          {NFts.length > Number(30)
                                            &&
                                            <svg onClick={() => setTabIndex(30)} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <circle cx="7" cy="7" r="7" fill={`${tabIndex === 30 ? '#B601D1' : '#D9D9D9'}`} />
                                            </svg>
                                          }
                                          {NFts.length > Number(40)
                                            &&
                                            <svg onClick={() => setTabIndex(40)} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <circle cx="7" cy="7" r="7" fill={`${tabIndex === 40 ? '#B601D1' : '#D9D9D9'}`} />
                                            </svg>
                                          }
                                          {NFts.length > Number(50)
                                            &&
                                            <svg onClick={() => setTabIndex(50)} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <circle cx="7" cy="7" r="7" fill={`${tabIndex === 50 ? '#B601D1' : '#D9D9D9'}`} />
                                            </svg>
                                          }
                                          {NFts.length > Number(60)
                                            &&
                                            <svg onClick={() => setTabIndex(60)} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <circle cx="7" cy="7" r="7" fill={`${tabIndex === 60 ? '#B601D1' : '#D9D9D9'}`} />
                                            </svg>
                                          }
                                          {NFts.length > Number(70)
                                            &&
                                            <svg onClick={() => setTabIndex(70)} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <circle cx="7" cy="7" r="7" fill={`${tabIndex === 70 ? '#B601D1' : '#D9D9D9'}`} />
                                            </svg>
                                          }
                                          {NFts.length > Number(80)
                                            &&
                                            <svg onClick={() => setTabIndex(80)} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <circle cx="7" cy="7" r="7" fill={`${tabIndex === 80 ? '#B601D1' : '#D9D9D9'}`} />
                                            </svg>
                                          }
                                          {NFts.length > Number(90)
                                            &&
                                            <svg onClick={() => setTabIndex(90)} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <circle cx="7" cy="7" r="7" fill={`${tabIndex === 90 ? '#B601D1' : '#D9D9D9'}`} />
                                            </svg>
                                          }
                                          {NFts.length > Number(100)
                                            &&
                                            <svg onClick={() => setTabIndex(100)} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <circle cx="7" cy="7" r="7" fill={`${tabIndex === 100 ? '#B601D1' : '#D9D9D9'}`} />
                                            </svg>
                                          }
                                        </div>
                                      }
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            <br />
                            <br />

                            {ShowMore &&
                              NFts.length > 0 &&
                              NFts[NFts.length - 1].status !== "completed" && (
                                <div>
                                  {listingType === 0 ?
                                    <div className="line-two">
                                      <div className="row">
                                        <div className="col-lg-9 col-md-9 col-7">
                                          <h2>Price</h2>
                                          <input
                                            type="text"
                                            value={nftForm.price}
                                            onChange={handleNftForm}
                                            name="price"
                                          // type="number"
                                          // placeholder="0.00"
                                          // ref={price}
                                          />
                                          {showWarning && (
                                            <p style={{ color: "red" }}>
                                              Please enter a valid positive number.
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    :
                                    <>
                                      <div className="line-two">
                                        <div className="row">
                                          <div className="col-lg-9">
                                            <h2>Minimum bid</h2>
                                            <input
                                              type="text"
                                              value={nftForm.bid}
                                              name="bid"
                                              onChange={handleNftForm}
                                            // type="number"
                                            // placeholder="0.00"
                                            // ref={price}
                                            />
                                            {showWarning && (
                                              <p style={{ color: "red" }}>
                                                Please enter a valid positive number.
                                              </p>
                                            )}
                                          </div>
                                          <div className="col-lg-3 col-md-3 col-5">

                                          </div>
                                        </div>
                                      </div>
                                      <div className="line-two">
                                        <div className="row">
                                          <div className="col-lg-6 col-md-6 col-6">
                                            <h2>Starting date</h2>
                                            <input
                                              id="startingTime"
                                              type="date"
                                              name="startDate"
                                              placeholder="mm/dd/yyyy"
                                              style={{ padding: "6px 10px 6px 15px" }}
                                              value={nftForm.startDate}
                                              min={new Date().toISOString().split('T')[0]}
                                              // onChange={(e) =>
                                              //   setStartingDate(e.target.value)
                                              // }
                                              onChange={handleNftForm}
                                            />
                                          </div>
                                          <div className="col-lg-6 col-md-6 col-6">
                                            <h2>Expiration date</h2>
                                            <input
                                              id="endTime"
                                              type="date"
                                              name="endDate"
                                              placeholder="mm/dd/yyyy"
                                              style={{ padding: "6px 10px 6px 15px" }}
                                              value={nftForm.endDate}
                                              // onChange={(e) => setEndingDate(e.target.value)}
                                              onChange={handleNftForm}
                                              min={nftForm.startDate}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </>}

                                  {/* <div className="line-four">
                                <div className="row">
                                  <div className="col-lg-9">
                                    <h2>Title</h2>
                                    <input
                                      type="text"
                                      placeholder="e.g. ‘Crypto Funk"
                                      // defaultValue={title.current.value}
                                      value={nftForm.title}
                                      onChange={handleNftForm}
                                      name="title"
                                    // onChange={(e) => setTitle(e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div> */}
                                  <div className="line-five">
                                    <div className="row">
                                      <div className="col-lg-9">
                                        <h2>Description</h2>
                                        <input
                                          type="text"
                                          placeholder="e.g. ‘This is very limited item’"
                                          value={nftForm.desc}
                                          onChange={handleNftForm}
                                          name="desc"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  {/* <div className="line-seven">
                                <div className="row">
                                  <div className="col-lg-8">
                                    <button type="submit" className="button-styling">
                                      Create Item
                                    </button>
                                  </div>
                                </div>
                              </div> */}
                                </div>
                              )}
                            {!ShowMore ? (
                              <div className="Button-holding-div">
                                <button
                                  className="button-styling"
                                  onClick={() => setShowMore(true)}
                                >
                                  Done
                                </button>
                                {/* <button className="button-styling-outline">
                              <div>Add More</div>
                            </button> */}
                              </div>
                            ) : (
                              <div className="Button-holding-div">
                                {
                                  NFts.length > 0 &&

                                    NFts[NFts.length - 1].status !== "completed" ?
                                    <button onClick={saveNFT} className="button-styling">Next</button>
                                    :
                                    <button className="disabledButton">
                                      Next
                                    </button>
                                }
                                {NFts.length > 0 && NFts[NFts.length - 1].status === "completed" ?
                                  <button className="button-styling ml-auto">
                                    <div>List</div>
                                  </button>
                                  :
                                  <button className="disabledButton">List</button>
                                }
                              </div>
                            )}
                          </div>
                        }
                      </div>
                    </>
                  }

                  <div className="line-one"></div>
                </div>
              </div>
            </div>
          </div>

          {/* <button onClick={getItem} className="button-styling">
            Get NFTS data
          </button> */}
        </div>
        <Search search={search} setSearch={setSearch} />
        <Footer />
      </div>
    </>
  );
};

export default Multiple;
