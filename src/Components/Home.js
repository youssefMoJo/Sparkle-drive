import React, { useState } from "react";
import Poster from "./Poster";
import FormsSection from "./FormsSection";
import PaymentSection from "./PaymentSection";
import "../Styles/Home.css";
import { TotalPriceProvider } from "./TotalPriceContext";
import { FormReadyProvider } from "./FormReadyContext";

function Home() {
  const [confirmationStatus, setConfirmationStatus] = useState(false);
  const [showLastConfirmationPage, setShowLastConfirmationPage] =
    useState(false);

  // Callback function to receive data from the child
  const sendingConfirmation = (data) => {
    setConfirmationStatus(data);
  };

  const showLastPage = (data) => {
    console.log(data);
    setShowLastConfirmationPage(data);
  };

  const refreshPage = () => {
    // Reload the current page
    window.location.reload();
  };

  return (
    <FormReadyProvider>
      <TotalPriceProvider>
        {showLastConfirmationPage ? (
          <div className="confirmation-message">
            <div className="confirmation-header">Thank You for Your Order!</div>
            <div className="confirmation-content">
              Your Car Wash Request Has Been Confirmed.
              <br />
              <br />
              Thank you for choosing us for your car washing needs. We look
              forward to providing you with a clean and shiny vehicle!
              <br />
              <br />
              Best regards,
              <br />
              <span className="company-name">[Your Company Name]</span>
            </div>
            <button className="restart-button" onClick={refreshPage}>
              Start a New Order
            </button>
          </div>
        ) : (
          <div className="Home">
            <Poster />
            <FormsSection
              showConfirmationPage={showLastPage}
              sendConfirm={confirmationStatus}
            />
            <PaymentSection sendConfirm={sendingConfirmation} />
          </div>
        )}
      </TotalPriceProvider>
    </FormReadyProvider>
  );
}

export default Home;
