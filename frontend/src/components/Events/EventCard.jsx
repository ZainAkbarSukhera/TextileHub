// import React, { useState, useEffect } from "react";
// import styles from "../../styles/styles";
// import CountDown from "./CountDown";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { addTocart } from "../../redux/actions/cart";
// import { toast } from "react-toastify";
// import axios from "axios"; // Import axios for API requests



// const EventCard = ({ active, data }) => {
//   const { cart } = useSelector((state) => state.cart);
//   const dispatch = useDispatch();

//   // State for handling the bid amount and user data
//   const [bidAmount, setBidAmount] = useState("");
//   // Handle bid amount change
//   const handleBidAmountChange = (e) => {
//     setBidAmount(e.target.value);
//   };

//   // Handle adding item to cart
//   const addToCartHandler = (data) => {
//     const isItemExists = cart && cart.find((i) => i._id === data._id);
//     if (isItemExists) {
//       toast.error("Item already in cart!");
//     } else {
//       if (data.stock < 1) {
//         toast.error("Product stock limited!");
//       } else {
//         const cartData = { ...data, qty: 1 };
//         dispatch(addTocart(cartData)); // Add to Redux cart state
//         toast.success("Item added to cart successfully!");
//       }
//     }
//   };

//   const placeBidHandler = async () => {
//     if (!bidAmount || bidAmount <= 0) {
//       toast.error("Please enter a valid bid amount.");
//       return;
//     }
  
//     try {
//       const response = await axios.post(
//         `http://localhost:8000/api/v2/event/place-bid/${data._id}`, // Replace :id with data._id
//         {
//           bidAmount: parseFloat(bidAmount), // Parse the bid amount to float
//         },
//         {
//           withCredentials: true, // Ensure cookies are sent with the request
//         }
//       );
  
//       toast.success(response.data.message);
//       setBidAmount(""); // Clear the bid input field after successful bid
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Something went wrong!");
//     }
//   };
//   return (
//     <div className={`w-full block bg-white rounded-lg ${active ? "unset" : "mb-12"} lg:flex p-2`}>
//       <div className="w-full lg:w-[50%] m-auto">
//         <img src={`${data.images[0]?.url}`} alt={data.name} />
//       </div>
//       <div className="w-full lg:w-[50%] flex flex-col justify-center">
//         <h2 className={`${styles.productTitle}`}>{data.name}</h2>
//         <p>{data.description}</p>
//         <div className="flex py-2 justify-between">
//           <div className="flex">
//             <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
//               {data.originalPrice}$
//             </h5>
//             <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
//               {data.discountPrice}$
//             </h5>
//           </div>
//           <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
//             {data.sold_out} sold
//           </span>
//         </div>
//         <CountDown data={data} />
//         <br />

//         {/* Bid input */}
//         <div className="flex items-center py-4">
//           <input
//             type="number"
//             placeholder="Enter bid amount"
//             value={bidAmount}
//             onChange={handleBidAmountChange}
//             className="border p-2 rounded w-40"
//           />
//           <button onClick={placeBidHandler} className={`${styles.button} text-[#fff] ml-5`}>
//             Place Bid
//           </button>
//         </div>

//         {/* Add to cart and See Details buttons */}
//         <div className="flex items-center">
//           <Link to={`/product/${data._id}?isEvent=true`}>
//             <div className={`${styles.button} text-[#fff]`}>See Details</div>
//           </Link>
//           <div
//             className={`${styles.button} text-[#fff] ml-5`}
//             onClick={() => addToCartHandler(data)}
//           >
//             Add to cart
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventCard;



import React, { useState } from "react";
import styles from "../../styles/styles";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import axios from "axios";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // State for handling the bid amount
  const [bidAmount, setBidAmount] = useState("");

  // Handle bid amount change
  const handleBidAmountChange = (e) => {
    setBidAmount(e.target.value);
  };

  // Handle adding item to cart
  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData)); // Add to Redux cart state
        toast.success("Item added to cart successfully!");
      }
    }
  };

  // Place a bid handler
  const placeBidHandler = async () => {
    if (!bidAmount || bidAmount <= 0) {
      toast.error("Please enter a valid bid amount.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/v2/event/place-bid/${data._id}`, // Replace :id with data._id
        {
          bidAmount: parseFloat(bidAmount), // Parse the bid amount to float
        },
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );

      toast.success(response.data.message);
      setBidAmount(""); // Clear the bid input field after successful bid
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className={`w-full block bg-white rounded-lg ${active ? "unset" : "mb-12"} lg:flex p-2`}>
      <div className="w-full lg:w-[50%] m-auto">
        <img src={`${data.images[0]?.url}`} alt={data.name} />
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}>{data.name}</h2>
        <p>{data.description}</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
              Rs {data.originalPrice}
            </h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
              Rs {data.discountPrice}
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            {data.sold_out} sold
          </span>
        </div>

        {/* Show current highest bid */}
        {data.currentHighestBid && (
          <div className="flex py-2">
            <h5 className="font-bold text-[20px] text-[#d55b45] pr-3">
              Current Highest Bid: Rs {data.currentHighestBid}
            </h5>
          </div>
        )}

        <CountDown data={data} />
        <br />

        {/* Bid input */}
        <div className="flex items-center py-4">
          <input
            type="number"
            placeholder="Enter bid amount"
            value={bidAmount}
            onChange={handleBidAmountChange}
            className="border p-2 rounded w-40"
          />
          <button onClick={placeBidHandler} className={`${styles.button} text-[#fff] ml-5`}>
            Place Bid
          </button>
        </div>


        <div className="flex items-center">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <div className={`${styles.button} text-[#fff]`}>See Details</div>
          </Link>
        
        </div>
      </div>
    </div>
  );
};

export default EventCard;

