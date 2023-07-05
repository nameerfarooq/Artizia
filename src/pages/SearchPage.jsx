import React, { useEffect, useRef, useState } from "react";
import Footer from "./landingpage/Footer";
import Header from "./landingpage/Header";
import Search from "../components/shared/Search";
import SearchNftCards from "../components/cards/SearchNftCards";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useLocation, useParams } from "react-router-dom";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import Web3Modal from "web3modal";
import MARKETPLACE_CONTRACT_ADDRESS from "../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../contractsData/ArtiziaNFT.json";
import axios from "axios";

const SearchPage = ({ search, setSearch }) => {
  const [status, setStatus] = useState({ value: "one", label: "New" });
  const [categories, setCategories] = useState({ value: "art", label: "Art" });
  const [item, setItem] = useState({ value: "all", label: "All" });
  const [sortBy, setSortBy] = useState({ value: "all", label: "All" });
  const [rating, setRating] = useState({ value: "all", label: "All" });
  const [chain, setChain] = useState({ value: "all", label: "All" });
  const [currency, setCurrency] = useState({ value: "eth", label: "ETH" });
  const [slider, setSlider] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 }); // initial price range
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dataFromQuery = searchParams.get("data");

  // Receiving data from URL parameters
  const { data } = useParams();

  const [walletConnected, setWalletConnected] = useState(false);
  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);
  const [userAddress, setUserAddress] = useState("0x000000....");

  const web3ModalRef = useRef();

  const connectWallet = async () => {
    console.log("Connect wallet");
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };
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
      return signer;
    }
    return web3Provider;
  };

  const getListedNfts = async () => {
    const provider = await getProviderOrSigner();

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );

    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS.address,
      NFT_CONTRACT_ABI.abi,
      provider
    );
    let listingType;

    let mintedTokens = await marketplaceContract.getListedNfts();
    let myNFTs = [];
    let myAuctions = [];
    for (let i = 0; i < mintedTokens.length; i++) {
      let id;
      id = +mintedTokens[i].tokenId.toString();

      const metaData = await nftContract.tokenURI(id);

      let auctionData = await marketplaceContract._idToAuction(id);

      //   console.log()

      axios
        .get(metaData)
        .then((response) => {
          const meta = response.data;
          let data = JSON.stringify(meta);

          data = data.slice(2, -5);
          data = data.replace(/\\/g, "");

          data = JSON.parse(data);
          // Extracting values using dot notation
          const price = data.price;
          listingType = data.listingType;
          const crypto = data.crypto;
          const title = data.title;
          const image = data.image;
          const royalty = data.royalty;
          const description = data.description;
          const collection = data.collection;
          const paymentMethod = data.paymentMethod;

          const nftData = {
            id: id, //
            title: title,
            image: image,
            price: price,
            crypto: crypto,
            royalty: royalty,
            description: description,
            collection: collection,
            paymentMethod: paymentMethod,

          };

          console.log(nftData);
          myNFTs.push(nftData);
          setNftListFP(myNFTs);
          console.log("myNFTs in function", myNFTs);
          // if (listingType === 0) {
          //   const nftData = {
          //     id: id, //
          //     title: title,
          //     image: image,
          //     price: price,
          //     crypto: crypto,
          //     royalty: royalty,
          //     description: description,
          //     collection: collection,
          //   };

          //   console.log(nftData);
          //   myNFTs.push(nftData);
          //   setNftListFP(myNFTs);
          //   console.log("myNFTs in function", myNFTs);
          // } else if (listingType === 1) {
          //   const nftData = {
          //     id: id, //
          //     title: title,
          //     image: image,
          //     price: price,
          //     basePrice: auctionData.basePrice.toString(),
          //     endTime: auctionData.endTime.toString(),
          //     highestBid: auctionData.highestBid.toString(),
          //     highestBidder: auctionData.highestBidder.toString(),
          //     isLive: auctionData.isLive.toString(),
          //     seller: auctionData.seller.toString(),
          //     startTime: auctionData.startTime.toString(),
          //   };

          //   myAuctions.push(nftData);
          //   console.log("auction in function", myAuctions);
          //   setNftListAuction(myAuctions);
          // }
        })

        .catch((error) => {
          console.error("Error fetching metadata:", error);
        });
    }
  };

  const getAddress = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setUserAddress(accounts[0]);
    console.log("getAddress", accounts[0]);
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, [walletConnected]);

  useEffect(() => {
    connectWallet();
    getListedNfts();
    getAddress();
  }, [userAddress]);

  const statusOptions = [
    { value: "one", label: "New" },
    { value: "two", label: "Old" },
    { value: "three", label: "Used" },
  ];
  const categoriesOptions = [
    { value: "one", label: "Art" },
    { value: "two", label: "Game" },
    { value: "three", label: "Carton" },
  ];

  const itemOptions = [
    { value: "one", label: "All" },
    { value: "two", label: "All" },
    { value: "three", label: "All" },
  ];
  const sortByOptions = [
    { value: "one", label: "All" },
    { value: "two", label: "All" },
    { value: "three", label: "All" },
  ];

  const ratingOptions = [
    { value: "one", label: "All" },
    { value: "two", label: "All" },
    { value: "three", label: "All" },
  ];
  const chainOptions = [
    { value: "one", label: "All" },
    { value: "two", label: "All" },
    { value: "three", label: "All" },
  ];
  const currencyOptions = [
    { value: "one", label: "ETH" },
    { value: "two", label: "All" },
    { value: "three", label: "All" },
  ];

  const handleSliderChange = (value) => {
    // update the price range when slider value changes
    setPriceRange({
      min: value[0],
      max: value[1],
    });
  };

  return (
    <>
      <Header search={search} setSearch={setSearch} />
      <div className="search-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-9 mx-auto">
              <div className="search-input">
                <div
                  className="l-1 hide-on-mobile-screen-app"
                  id="modal_view_left"
                  data-toggle="modal"
                  data-target="#get_quote_modal"
                >
                  <div style={{ cursor: "pointer" }}>
                    <img src="/assets/images/filter.png" alt="" />{" "}
                    <span>Filter</span>
                  </div>
                </div>
                <input type="search" placeholder="Search for nft item" />
              </div>
            </div>
          </div>
          <div className="filter-card-wrap">
            <div className="row">
              <div className="col-lg-3 hide-on-desktop-screen-app">
                <div className="search-filter">
                  <div className="l-1">
                    <img src="/assets/images/filter.png" alt="" />{" "}
                    <span>Filter</span>
                  </div>
                  <div className="l-2">
                    <p>Status</p>
                    <Dropdown
                      options={statusOptions}
                      onChange={(e) => {
                        setStatus(e);
                      }}
                      value={status.label}
                    />
                  </div>
                  <div className="l-3">
                    <p>Categories</p>
                    <Dropdown
                      options={categoriesOptions}
                      onChange={(e) => {
                        setCategories(e);
                      }}
                      value={categories.label}
                    />
                  </div>
                  <div className="l-4">
                    <p>Items</p>
                    <Dropdown
                      options={itemOptions}
                      onChange={(e) => {
                        setItem(e);
                      }}
                      value={item.label}
                    />
                  </div>
                  <div className="l-5">
                    <p>Sort byasd</p>
                    <Dropdown
                      options={sortByOptions}
                      onChange={(e) => {
                        setSortBy(e);
                      }}
                      value={sortBy.label}
                    />
                  </div>
                  <div className="l-6">
                    <p>Rating</p>
                    <Dropdown
                      options={ratingOptions}
                      onChange={(e) => {
                        setRating(e);
                      }}
                      value={rating.label}
                    />
                  </div>
                  <div className="l-7">
                    <p>Chain</p>
                    <Dropdown
                      options={chainOptions}
                      onChange={(e) => {
                        setChain(e);
                      }}
                      value={chain.label}
                    />
                  </div>
                  <div className="l-8">
                    <p>Price range</p>
                    <Slider
                      range
                      min={0}
                      max={100000}
                      value={[priceRange.min, priceRange.max]}
                      onChange={handleSliderChange}
                    />
                    <div className="range-number">
                      {/* <div>0</div> */}
                      <div>
                        ${priceRange.min} - ${priceRange.max}
                      </div>
                      {/* <div>100000</div> */}
                    </div>
                  </div>
                  <div className="l-9">
                    <p>Currency</p>
                    <Dropdown
                      options={currencyOptions}
                      onChange={(e) => {
                        setCurrency(e);
                      }}
                      value={currency.label}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-12">
                <div className="row">
                  {nftListFP.map((item) => (
                    <SearchNftCards
                      key={item?.id}
                      id={item?.id}
                      title={item?.title}
                      image={item?.image}
                      price={item?.price}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Search search={search} setSearch={setSearch} />
      </div>

      <div
        class="modal modal_outer left_modal fade"
        id="get_quote_modal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myModalLabel2"
      >
        <div class="modal-dialog" role="document">
          <form method="post" id="get_quote_frm">
            <div class="modal-content ">
              <div class="modal-header">
                <div className="l-1">
                  <img src="/assets/images/filter.png" alt="" />{" "}
                  <span>Filter</span>
                </div>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body get_quote_view_modal_body">
                <div className="search-filter">
                  <div className="l-2">
                    <p>Status</p>
                    <Dropdown
                      options={statusOptions}
                      onChange={(e) => {
                        setStatus(e);
                      }}
                      value={status.label}
                    />
                  </div>
                  <div className="l-3">
                    <p>Categories</p>
                    <Dropdown
                      options={categoriesOptions}
                      onChange={(e) => {
                        setCategories(e);
                      }}
                      value={categories.label}
                    />
                  </div>
                  <div className="l-4">
                    <p>Items</p>
                    <Dropdown
                      options={itemOptions}
                      onChange={(e) => {
                        setItem(e);
                      }}
                      value={item.label}
                    />
                  </div>
                  <div className="l-5">
                    <p>Sort by</p>
                    <Dropdown
                      options={sortByOptions}
                      onChange={(e) => {
                        setSortBy(e);
                      }}
                      value={sortBy.label}
                    />
                  </div>
                  <div className="l-6">
                    <p>Rating</p>
                    <Dropdown
                      options={ratingOptions}
                      onChange={(e) => {
                        setRating(e);
                      }}
                      value={rating.label}
                    />
                  </div>
                  <div className="l-7">
                    <p>Chain</p>
                    <Dropdown
                      options={chainOptions}
                      onChange={(e) => {
                        setChain(e);
                      }}
                      value={chain.label}
                    />
                  </div>
                  <div className="l-8">
                    <p>Price range</p>
                    <Slider
                      range
                      min={0}
                      max={100000}
                      value={[priceRange.min, priceRange.max]}
                      onChange={handleSliderChange}
                    />
                    <div className="range-number">
                      {/* <div>0</div> */}
                      <div>
                        ${priceRange.min} - ${priceRange.max}
                      </div>
                      {/* <div>100000</div> */}
                    </div>
                  </div>
                  <div className="l-9">
                    <p>Currency</p>
                    <Dropdown
                      options={currencyOptions}
                      onChange={(e) => {
                        setCurrency(e);
                      }}
                      value={currency.label}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
