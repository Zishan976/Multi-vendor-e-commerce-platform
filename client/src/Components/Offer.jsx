import { X } from "lucide-react";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Offer = () => {
  const [visible, setVisible] = useState(true);

  const handleClaim = () => {
    navigator.clipboard.writeText("WELCOME40");
    toast.success("Coupon copied to clipboard!");
    setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <>
      {visible && (
        <div className="flex justify-between items-center px-4 py-2 bg-linear-to-r from-purple-600 to-orange-500 text-white shadow-md">
          <span className="md:text-lg text-sm font-semibold">
            Get 40% OFF on First Order!
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={handleClaim}
              className="hidden md:inline bg-white text-purple-600 font-semibold md:px-4 md:py-2 px-2 py-1 rounded hover:bg-gray-100 transition"
            >
              Claim Offer
            </button>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 text-xl font-bold"
            >
              <X />
            </button>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default Offer;
