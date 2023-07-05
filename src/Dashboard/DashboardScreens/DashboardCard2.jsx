import React, { useRef, useCallback, useState, useEffect } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import "../DashboardComponents/DashboardCard.css";
import { Link } from "react-router-dom";
import ProfileDrawer from "../../components/shared/ProfileDrawer";
import nft from '../../../public/assets/images/nft-big.png'
const DashboardCard2 = ({
    onOpen,
    path,
    id,
    title,
    image,
    price,
    crypto,
    royalty,
    description,
    collection,
    userAddress,
}) => {
    const [showLinks, setShowLinks] = useState(false);
    // const [walletConnected, setWalletConnected] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const [showEditSidebar, setshowEditSidebar] = useState(false)

    console.log("USER in buy now", userAddress);

    const openDrawer = () => {
        if (showLinks === true) {
            return onOpen(false);
        } else {
            setIsVisible(true);
        }
    };

    return (
        <>
            <div onMouseEnter={() => setShowLinks(true)} onMouseLeave={() => setShowLinks(false)} className="col-lg-3 col-md-4">
                <Link to={path}>
                    <div className="css-vurnku height-335" style={{ position: "relative" }}>
                        <a className="css-118gt74" onClick={() => openDrawer()}>
                            <div className="css-15eyh94">
                                <div className="css-2r2ti0">
                                    <div className="css-15xcape">
                                        <span
                                            className="lazy-load-image-custom-wrapper lazy-load-image-background  lazy-load-image-loaded"
                                            style={{
                                                display: "flex",
                                                width: "100% ",
                                                height: "100%",
                                                borderRadius: "8px 8px 0px 0px",
                                            }}
                                        >
                                            <img src={image} className="J-image" />

                                            {showLinks && (
                                                <div className="social-links1">
                                                    <ul>
                                                        <li onClick={() => setIsVisible(true)}>
                                                            <a href="">VIEW</a>
                                                        </li>
                                                        <li onClick={() => setshowEditSidebar(true)}>
                                                            <a href="">EDIT</a>
                                                        </li>

                                                    </ul>
                                                </div>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="J1-bottom css-1xg74gr"
                                style={{ position: "relative" }}
                            >
                                <BiDotsHorizontalRounded className="doted-icon" />
                                <div className="css-fwx73e">
                                    <div className="css-10nf7hq detail-wrap">
                                        <div className="center-icon">
                                            <div className="icon">
                                                <img src="/assets/images/duck.png" alt="" />
                                                <img src="/assets/images/chack.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="top">
                                            <div className="left">{title}</div>
                                            <div className="right">{id}</div>
                                        </div>
                                        <div className="bottom">
                                            <div className="left">Price</div>
                                            <div className="right">
                                                <img src="/assets/images/bitCoin.png" alt="" />
                                                {price}
                                            </div>
                                        </div>
                                        <div className="css-x2gp5l"></div>
                                    </div>
                                    <div className="nft-card-btn-holder">
                                        <button>Accept</button>
                                        <button>Decline</button>
                                    </div>
                                </div>
                                {/* <div className="J-buynow css-1elubna">
                                    
                                    <div className="button css-pxd23z">
                                        <p>Buy Now</p>
                                        <span>
                                            <img src="/assets/icons/shop.png" alt="" />
                                        </span>
                                    </div>
                                </div> */}
                            </div>
                        </a>
                        {/* <span
                            className="btc-gray-logo"
                            onClick={() => {
                                setShowLinks(!showLinks);
                            }}
                        >
                            <span>
                                <BsShareFill />
                            </span>
                        </span> */}
                        {/* <img src="/assets/images/btc.png" alt="" className='btc-gray-logo' onClick={() => { setShowLinks(!showLinks) }} /> */}
                    </div>
                </Link>

                {/* <button onClick={buyWithETH}>Buy with ETH</button>
                                    <button onClick={buyWithUSDT}>Buy with USDT</button> */}
            </div>
            {showEditSidebar &&
                <div className='Edit-nft'>
                    <div className='Edit-nft-inner'>
                        <div className='close-btn-edit-nft' onClick={() => setshowEditSidebar(false)}>
                            <svg width="20" height="20" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M25.0157 0H25.3602C25.637 0.0762734 25.8902 0.220569 26.097 0.419655C26.3038 0.61874 26.4575 0.866292 26.544 1.13987C26.6306 1.41346 26.6474 1.70429 26.5928 1.98598C26.5381 2.26766 26.4139 2.53122 26.2313 2.75265L25.9679 3.03604C22.6257 6.35545 19.3037 9.69508 15.9818 13.0145L15.6779 13.217L15.9818 13.4598C19.3442 16.7995 22.6864 20.1594 26.1096 23.58C26.3425 23.7813 26.5165 24.0419 26.6128 24.3342C26.7091 24.6265 26.7242 24.9395 26.6566 25.2397C26.5969 25.5247 26.4659 25.7899 26.2758 26.0104C26.0856 26.231 25.8423 26.3998 25.5691 26.5009C25.2959 26.602 25.0014 26.6322 24.7133 26.5886C24.4252 26.545 24.1531 26.4291 23.9221 26.2517L23.6182 25.9683L13.6523 15.9899C13.5683 15.9109 13.4936 15.8226 13.4295 15.7267L13.1662 15.9696L3.03835 26.0898C2.81125 26.3346 2.52056 26.5116 2.19865 26.601C1.87674 26.6903 1.53624 26.6885 1.21529 26.5958C0.95016 26.5202 0.708757 26.3783 0.51381 26.1835C0.318863 25.9887 0.176967 25.7475 0.101377 25.4826L0 25.2397V24.6729C0.141895 24.1796 0.431818 23.7416 0.830552 23.418L10.6545 13.6015C10.7459 13.5203 10.8482 13.4521 10.9584 13.3991L10.6342 13.1359C7.37307 9.87724 4.11197 6.59838 0.830552 3.3397C0.441664 3.00729 0.153859 2.57252 0 2.08481V1.51802C0.0491955 1.27542 0.148531 1.04576 0.291522 0.843633C0.434513 0.641507 0.618089 0.471322 0.830552 0.34405C1.08222 0.219853 1.34729 0.124876 1.62055 0.0607802H1.82306C2.41002 0.177363 2.93912 0.491743 3.32196 0.951358L13.1054 10.7273L13.3687 10.9702C13.4176 10.8748 13.4791 10.7864 13.5512 10.7071L23.294 0.951358C23.6786 0.483773 24.2171 0.1681 24.8132 0.0607802L25.0157 0Z" fill="#6A6A6A" />
                            </svg>
                        </div>
                        <div className="edit-nft-image">
                            <img src={nft} alt="" />
                        </div>
                        <div className="edit-nft-form">
                            <div className="edit-nft-items">
                                <p>Title</p>
                                <input type="text" value="Naqi" />
                            </div>
                            <div className="edit-nft-items">
                                <p>Choose Collection</p>
                                <p className="edit-sidebar-sub-content">This is the collection where your item will appear.</p>
                                <input type="text" value="Select collection" />
                            </div>

                            <div className="edit-nft-items">
                                <p>Description</p>
                                <div className="desc-input">
                                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. collection
                                </div>
                            </div>
                            <div className="edit-nft-items">
                                <p>Price</p>
                                <input type="text" value="0.00" />
                            </div>
                            <div className="edit-nft-items">
                                <p>Price</p>
                                <input type="text" value="ETH" />
                            </div>
                            <div className="Btns-edit-nft-sidebar">
                                <button onClick={() => setshowEditSidebar(false)}>Cancel</button>
                                <button>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <ProfileDrawer
                isVisible={isVisible}
                onClose={onClose}
                id={id}
                title={title}
                image={image}
                price={price}
                paymentMethod={crypto}
                royalty={royalty}
                description={description}
                collection={collection}
                userAddress={userAddress}
                showBuyNow={false}
                ShowAcceptbtn={true}
            />
        </>
    );
};

export default DashboardCard2;
