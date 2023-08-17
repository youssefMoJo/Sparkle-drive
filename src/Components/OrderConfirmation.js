import React, { useState } from "react";

const OrderConfirmation = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleConfirm = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to confirm the order?"
    );

    if (userConfirmed) {
      setIsConfirmed(true);
    }
  };

  const handleReconfirmNumber = () => {
    const reconfirmedNumber = window.prompt(
      "Please reconfirm your phone number:",
      phoneNumber
    );

    if (reconfirmedNumber) {
      setPhoneNumber(reconfirmedNumber);
    }
  };

  return (
    <div>
      <p>Order details...</p>
      <button onClick={handleConfirm}>Confirm Order</button>

      {isConfirmed && (
        <div>
          <p>Order confirmed!</p>
          <p>Your phone number: {phoneNumber}</p>
          <button onClick={handleReconfirmNumber}>Reconfirm Number</button>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
