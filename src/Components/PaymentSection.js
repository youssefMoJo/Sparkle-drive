import "../Styles/PaymentSection.css";
// import CircleDiv from "./CircleDiv.js";
// import TriangleDiv from "./TriangleDiv";
// import SquareDiv from "./SquareDiv";
import React, { useState, useEffect } from "react";
import { useTotalPrice } from "./TotalPriceContext";
import { useIsFormReady } from "./FormReadyContext";

function PaymentSection(props) {
  const [point1Checked, setPoint1Checked] = useState(false);
  const [point2Checked, setPoint2Checked] = useState(false);
  const [point3Checked, setPoint3Checked] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [showContactMessage, setShowContactMessage] = useState(false);
  const { totalPrice } = useTotalPrice();
  const { isFormReady } = useIsFormReady();

  const [discountActiveStatus, setDiscountActiveStatus] = useState(false);

  const handleContactButtonClick = () => {
    setShowContactMessage(!showContactMessage);
  };

  const handlePoint1Change = () => {
    setPoint1Checked(!point1Checked);
  };

  const handlePoint2Change = () => {
    setPoint2Checked(!point2Checked);
  };

  const handlePoint3Change = () => {
    setPoint3Checked(!point3Checked);
  };

  const handleConfirmationChange = () => {
    if (confirmationChecked === false) {
      setPoint1Checked(true);
      setPoint2Checked(true);
      setPoint3Checked(true);
    } else {
      setPoint1Checked(false);
      setPoint2Checked(false);
      setPoint3Checked(false);
    }
    setConfirmationChecked(!confirmationChecked);
  };

  const confirmClicked = () => {
    if (
      point1Checked &&
      point2Checked &&
      point3Checked &&
      confirmationChecked &&
      isFormReady
    ) {
      props.sendConfirm(true);
    }
  };

  useEffect(() => {
    const chaeckDiscount = async () => {
      try {
        const response = await fetch(
          `https://carwash-d2381-default-rtdb.firebaseio.com/Discount.json`,
          {
            method: "GET", // Use the GET method to fetch data
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data from Firebase.");
        }

        const discountActivasionStatus = await response.json(); // Parse the response JSON
        setDiscountActiveStatus(discountActivasionStatus);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    chaeckDiscount();
  }, []);

  return (
    <div className="PaymentSection">
      <div className="PaymentSectionDetailsSquare">
        <div className="totalsection">
          <h3>Total</h3>
          <h3 style={{ color: "#3e8f3e" }}>${totalPrice} </h3>
        </div>

        {discountActiveStatus ? (
          <div className="totalsection">
            <h3>Discount</h3>
            <h3 style={{ color: "#e74c3c" }}>- $15 </h3>
          </div>
        ) : (
          <div></div>
        )}

        {discountActiveStatus && totalPrice > 0 ? (
          <div className="totalsection">
            <h3>New Total</h3>
            <h3 style={{ color: "#3e8f3e" }}>
              ${totalPrice === 0 ? 0 : totalPrice - 15}{" "}
            </h3>
          </div>
        ) : (
          <div></div>
        )}

        <div className="confirmation-container">
          <div
            className={`confirmation-point${point1Checked ? " checked" : ""}`}
          >
            <input
              type="checkbox"
              checked={point1Checked}
              onChange={handlePoint1Change}
            />
            <label onClick={handlePoint1Change} className="point-label">
              After confirmation, you'll receive a detailed message on your
              phone. Reply to the message to modify or cancel your request. Our
              team is here to assist you.
            </label>
          </div>
          <div
            className={`confirmation-point${point2Checked ? " checked" : ""}`}
          >
            <input
              type="checkbox"
              checked={point2Checked}
              onChange={handlePoint2Change}
            />
            <label onClick={handlePoint2Change} className="point-label">
              Our team member will reach out within 1 hour to reconfirm details.
            </label>
          </div>
          <div
            className={`confirmation-point${point3Checked ? " checked" : ""}`}
          >
            <input
              type="checkbox"
              checked={point3Checked}
              onChange={handlePoint3Change}
            />
            <label onClick={handlePoint3Change} className="point-label">
              Before our team member arrives, we'll call to ensure the car is
              available for washing.
            </label>
          </div>
          <div
            className={`confirmation-point${
              confirmationChecked ? " checked" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={confirmationChecked}
              onChange={handleConfirmationChange}
            />
            <label className="point-label">
              <span
                onClick={handleConfirmationChange}
                className="confirmation-text"
              >
                I confirm that I have read and understood the above points.
              </span>
            </label>
          </div>

          <button
            onClick={confirmClicked}
            className={`confirm-button${
              !point1Checked ||
              !point2Checked ||
              !point3Checked ||
              !confirmationChecked ||
              !isFormReady
                ? " disabled"
                : ""
            }`}
            disabled={
              !point1Checked ||
              !point2Checked ||
              !point3Checked ||
              !confirmationChecked ||
              !isFormReady
            }
          >
            Confirm Order
          </button>
          {!isFormReady ? (
            <p className="confirmationNote">
              Complete all required fields to activate the confirmation button
              and proceed with your order.
            </p>
          ) : (
            <p></p>
          )}

          <div
            className="havingIssueContainer"
            // onClick={handleContactButtonClick}
          >
            <img
              className="issueIcon"
              src={require("../Assets/issueIcon.png")}
              alt="issueIcon"
            />
            <div className="havingIssue">Have any issues?</div>
          </div>

          <div className="contact-message">
            <p>
              Send us an email with your problem, and we will reply within 24
              hours. Please include your phone number in the email.
            </p>
            <p>
              <span className="problemEmail">Email:</span>{" "}
              <a href="mailto:help.sparkledrive@gmail.com">
                help.sparkledrive@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSection;
