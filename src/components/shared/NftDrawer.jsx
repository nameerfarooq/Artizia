import React, { useRef, useCallback, useState, useEffect } from "react";
import Drawer from "react-bottom-drawer";
import { TfiEye } from "react-icons/tfi";
import { AiFillTag, AiOutlineHeart } from "react-icons/ai";
import { BsCheck, BsFillClockFill } from "react-icons/bs";
import "./Shared.css";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import SocialShare from "./SocialShare";
import Details from "./profileDrawerTabs/Details";
import Bids from "./profileDrawerTabs/Bids";
import History from "./profileDrawerTabs/History";
import Form from "react-bootstrap/Form";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Web3Modal from "web3modal";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import TETHER_CONTRACT_ADDRESS from "../../contractsData/TetherToken-address.json";
import TETHER_CONTRACT_ABI from "../../contractsData/TetherToken.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import Modal from "react-bootstrap/Modal";
import { AiOutlineClose } from "react-icons/ai";
import '../../App.css'
import nft from '../../../public/assets/images/nft-2.png'
import {
    Area,
    AreaChart,
    CartesianGrid,
    Rectangle,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Label,
} from "recharts";
import ChartForEarning from "../../pages/settingFolder/ChartForEarning";
import Slider from "rc-slider";



const Monthly_data = [
    {
        data: "Jan",
        value: 0,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Feb",
        value: 0.5,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Mar",
        value: 0.85,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Apr",
        value: 0.98,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "May",
        value: 0.45,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "June",
        value: 0.43,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "July",
        value: 0.41,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Aug",
        value: 0.52,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Sep",
        value: 0.54,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Oct",
        value: 0.85,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Nov",
        value: 0.48,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Dec",
        value: 0,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
];
const Weekly_data = [
    {
        data: "Jan",
        value: 5,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Feb",
        value: 2.5,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Mar",
        value: 9.85,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Apr",
        value: 2.98,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "May",
        value: 4.45,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "June",
        value: 6.43,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "July",
        value: 3.41,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Aug",
        value: 2.52,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Sep",
        value: 4.54,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Oct",
        value: 0.85,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Nov",
        value: 0.48,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Dec",
        value: 0,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
];
const Daily_data = [
    {
        data: "Jan",
        value: 0,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Feb",
        value: 0,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Mar",
        value: 0,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Apr",
        value: 2,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "May",
        value: 3,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "June",
        value: 4,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "July",
        value: 5,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Aug",
        value: 6,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Sep",
        value: 5,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Oct",
        value: 4,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Nov",
        value: 3,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
    {
        data: "Dec",
        value: 2,
        Average_price: "0.62 ETH",
        Num_sales: "1",
        Date: "May 07 at 5:00 PM",
    },
];

const ProfileDrawer = ({ isVisible, onClose, timedAuction }) => {



    // const [image, setImage] = useState("");
    let image = "";
    // const [price, setPrice] = useState(null);
    // const [title, setTitle] = useState("");
    // const [description, setDescription] = useState("");
    // const [minimumBid, setMinimumBid] = useState("");
    const [listingType, setlistingType] = useState(0);
    const [walletConnected, setWalletConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [startingDate, setStartingDate] = useState("");
    const [endingDate, setEndingDate] = useState("");

    var startTime = useRef(0);
    var endTime = useRef(0);
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

    useEffect(() => {
        if (startingDate && endingDate && endingDate < startingDate) {
            alert("End date should be after start date");
            setEndingDate("");
        }
    }, [startingDate, endingDate]);

    const web3ModalRef = useRef();

    var item = {};

    let price = useRef(0);
    const title = useRef("");
    const description = useRef("");

    // Helper function to fetch a Provider/Signer instance from Metamask
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
        if (typeof file !== "undefined") {
            try {
                setLoading(true);
                console.log("this is image file ", file);
                const resut = await uploadFileToIPFS(item.file);
                //const result = await client.add(file)
                console.log("!!!!!!!!!!!!!!!!!!", resut);
                // setImage(resut.pinataURL);
                image = resut.pinataURL;
                setLoading(false);
                // create nft using image IPFS and other data
                console.log("Calling the createNFT function");
                createNFT();
            } catch (error) {
                setLoading(false);
                console.log("ipfs image upload error: ", error);
            }
        }
    };

    // Upload image and data to IPFS
    const createNFT = async () => {
        if (listingType == 0) {
            let price = item.price;
            let crypto = item.crypto;
            let collection = item.collection;
            let title = item.title;
            let description = item.description;

            try {
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
                console.log("uploadJSONToIPFS", result.pinataURL);
                mintThenList(result.pinataURL);

                //   }
            } catch (error) {
                console.log("ipfs uri upload error: ", error);
            }
        } else {
            let price = item.price;
            let crypto = item.crypto;
            let collection = item.collection;
            let title = item.title;
            let description = item.description;

            try {
                const dataInJSON = JSON.stringify({
                    image,
                    listingType,
                    price,
                    // crypto, uncommment this after fixing frontend
                    startTime,
                    endTime,
                    collection,
                    title,
                    description,
                    royalty,
                });

                console.log("dataInJSON", dataInJSON);
                const result = await uploadJSONToIPFS(dataInJSON);

                console.log("RESULT", result);
                mintThenList(result.pinataURL);
            } catch (error) {
                console.log("ipfs uri upload error: ", error);
            }
        }
    };

    // mint the NFT then list
    const mintThenList = async (result) => {
        console.log("In mintThenList");

        const signer = await getProviderOrSigner(true);

        const nftContract = new Contract(
            NFT_CONTRACT_ADDRESS.address,
            NFT_CONTRACT_ABI.abi,
            signer
        );

        console.log("In mintThenList");

        await (await nftContract.mint([result])).wait();

        let mintedTokens = await nftContract.getMintedTokensList();

        mintedTokens = Number(mintedTokens);

        console.log("mintedTokens", mintedTokens);

        const marketplaceContract = new Contract(
            MARKETPLACE_CONTRACT_ADDRESS.address,
            MARKETPLACE_CONTRACT_ABI.abi,
            signer
        );

        await (
            await marketplaceContract.listNft(
                nftContract.address,
                [mintedTokens],
                ethers.utils.parseEther(item.price),
                royalty,
                listingType,
                startTime,
                endTime,
                crypto
            )
        ).wait();
    };

    const [file, setFile] = useState(null);
    const [crypto, setCrypto] = useState({ value: 0, label: "ETH" });

    const [collection, setCollection] = useState({
        value: "USDT",
        label: "Select Collection",
    });

    const handlechange = (file) => {
        setFile(file);
    };

    const [royalty, setRoyalty] = useState(0);

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
    const handleSliderChange = (value) => {
        // Update the value or perform any other actions
        console.log("Slider value:", value);
        setRoyalty(value);
        // ...
    };
    // const handleSliderChange = (value) => {
    //     // setRoyalty(value);
    //     if (value === 33) {
    //         setRoyalty(5);
    //     } else if (value === 66) {
    //         setRoyalty(10);
    //     } else if (value === 100) {
    //         setRoyalty(15);
    //     }
    // };

    useEffect(() => { }, [price, title, description]);

    function createItem(e) {
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

            const startTimestamp = Math.floor(startDate.getTime() / 1000);

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

        console.log("price", price);

        console.log("title", title.current.value);

        console.log("description", description.current.value);

        console.log("collection", collection);

        console.log("crypto", crypto);
        console.log("file", file);
        setFile(null);
        console.log("file", file);

        item = {
            title: title.current.value,
            price: price,
            description: description.current.value,
            crypto: crypto,
            file: file,
            collection: collection,
        };

        console.log("item", item);

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
    }

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
    }, [walletConnected]);

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
        } catch (err) {
            console.error(err);
        }
    };
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

    return (
        <>
            <Drawer
                isVisible={isVisible}
                onClose={() => onClose(false)}
                className=" nft-drawer-wrapper"
            >
                <div className="create-single">


                    <div className="profile-drawer" style={{ position: "relative" }}>
                        <span
                            className="profile-drawer-cancle"
                            onClick={() => onClose()}
                        >
                            x
                        </span>

                        <div className="create-single-section-wrap">
                            <form onSubmit={createItem}>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-7 mx-auto">
                                            <div className="row">


                                                {!timedAuction ? (
                                                    <div className="line-two">
                                                        <div className="row">
                                                            <div className="col-lg-9 col-md-9 col-7">
                                                                <h2>Price</h2>
                                                                <input
                                                                    type="text"
                                                                    value={inputValue}
                                                                    onChange={handleInputChange}
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
                                                                <h2>Crypto</h2>
                                                                <Dropdown
                                                                    options={cryptoOptions}
                                                                    onChange={(e) => {
                                                                        setCrypto(e.value);
                                                                    }}
                                                                    value={defaultCrypto.value}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="line-two">
                                                            <div className="row">
                                                                <div className="col-lg-9">
                                                                    <h2>Minimum bid</h2>
                                                                    <input
                                                                        type="text"
                                                                        value={inputValue}
                                                                        onChange={handleInputChange}
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
                                                                    <h2>Crypto</h2>
                                                                    <Dropdown
                                                                        options={cryptoOptions}
                                                                        onChange={(e) => {
                                                                            setCrypto(e.value);
                                                                        }}
                                                                        value={defaultCrypto.value}
                                                                    />
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
                                                                        placeholder="mm/dd/yyyy"
                                                                        style={{ padding: "6px 10px 6px 15px" }}
                                                                        value={startingDate}
                                                                        onChange={(e) =>
                                                                            setStartingDate(e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="col-lg-6 col-md-6 col-6">
                                                                    <h2>Expiration date</h2>
                                                                    <input
                                                                        id="endTime"
                                                                        type="date"
                                                                        placeholder="mm/dd/yyyy"
                                                                        style={{ padding: "6px 10px 6px 15px" }}
                                                                        value={endingDate}
                                                                        onChange={(e) => setEndingDate(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

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
                                                </div>
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
                                                <div className="line-five">
                                                    <div className="row">
                                                        <div className="col-lg-9">
                                                            <h2>Description</h2>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. ‘This is very limited item’"
                                                                ref={description}
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
                                                        <div className="col-lg-3 royality-value">
                                                            {royalty} %
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="line-seven">
                                                    <div className="row">
                                                        <div className="col-lg-8">
                                                            <button type="submit" className="button-styling">
                                                                Done
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 mx-auto nft-drawer-dp">
                                            <h2 >Profile image</h2>
                                            <div className="img-holder">
                                                <img src={nft} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <br></br>
                            {/* <button onClick={getItem} className="button-styling">
            Get NFTS data
          </button> */}
                        </div>

                    </div>
                </div>
            </Drawer>

        </>
    );
}

export default ProfileDrawer;
