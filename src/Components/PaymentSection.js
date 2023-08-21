import "../Styles/PaymentSection.css";
// import CircleDiv from "./CircleDiv.js";
// import TriangleDiv from "./TriangleDiv";
// import SquareDiv from "./SquareDiv";
import React, { useState } from "react";
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

  return (
    <div className="PaymentSection">
      <div className="PaymentSectionDetailsSquare">
        {/* <CircleDiv />
        <TriangleDiv />
        <SquareDiv /> */}
        <div className="totalsection">
          <h3>Total</h3>
          <h3>$ {totalPrice} </h3>
        </div>

        <div className="confirmation-container">
          {/* <h2>Order Confirmation</h2> */}
          <div
            className={`confirmation-point${point1Checked ? " checked" : ""}`}
          >
            <input
              type="checkbox"
              checked={point1Checked}
              onChange={handlePoint1Change}
            />
            <label className="point-label">
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
            <label className="point-label">
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
            <label className="point-label">
              Before our team member arrives, we'll call to ensure the car is
              available for washing.
            </label>
          </div>
          <div
            className={`confirmation-point${confirmationChecked ? " checked" : ""
              }`}
          >
            <label className="point-label">
              <input
                type="checkbox"
                checked={confirmationChecked}
                onChange={handleConfirmationChange}
              />
              <span className="confirmation-text">
                I confirm that I have read and understood the above points.
              </span>
            </label>
          </div>

          <button
            onClick={confirmClicked}
            className={`confirm-button${!point1Checked ||
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
            onClick={handleContactButtonClick}
          >
            <img
              className="issueIcon"
              src={require("../Assets/issueIcon.png")}
              alt="issueIcon"
            />
            <div className="havingIssue">Have any issues?</div>
          </div>

          {showContactMessage && (
            <div className="contact-message">
              <p>
                Send us an email with your problem, and we will reply within 24
                hours. Please include your phone number in the email.
              </p>
              <p>
                <span className="problemEmail">Email:</span>{" "}
                <a href="mailto:support@example.com">support@example.com</a>
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default PaymentSection;
