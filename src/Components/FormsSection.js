import React, { useState, useEffect } from "react";
import pricingData from "./pricingData";
import "../Styles/FormsSection.css";
import Slogan from "./Slogan";
import { useTotalPrice } from "./TotalPriceContext";
import { useIsFormReady } from "./FormReadyContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RingLoader from "react-spinners/RingLoader";

function FormsSection(props) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reEnterPhoneNumber, setReEnterPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [selectedCarTypeIndex, setSelectedCarTypeIndex] = useState(null);
  const [selectedCarType, setSelectedCarType] = useState("");
  const [selectedCleanTypeIndex, setSelectedCleanTypeIndex] = useState(null);
  const [selectedCleanType, setSelectedCleanType] = useState("");

  // This if for Exterior Customization
  const [selectedExCustomizationIndex, setselectedExCustomizationIndex] =
    useState(null);
  const [selectedExCustomization, setSelectedExCustomization] = useState("");

  // This if for Interior Customization
  const [selectedInCustomizationIndex, setselectedInCustomizationIndex] =
    useState(null);
  const [selectedInCustomization, setSelectedInCustomization] = useState("");

  // This if for Both Customization
  const [selectedBoCustomizationIndex, setselectedBoCustomizationIndex] =
    useState(null);
  const [selectedBoCustomization, setSelectedBoCustomization] = useState("");

  const [selectedPayTypeIndex, setSelectedPayTypeIndex] = useState(null);
  const [selectedPayType, setSelectedPayType] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(18); // Default selected time (6 PM)

  const { setTotalPrice, totalPrice } = useTotalPrice(); // Get the setTotalPrice function
  const { setisFormReady } = useIsFormReady(); // Get the setTotalPrice function

  const [confirmationError, setConfirmationError] = useState(false);

  const [discountActiveStatus, setDiscountActiveStatus] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [discountAvtivisionStartTime, setDiscountAvtivisionStartTime] =
    useState(null);

  let formReady =
    name.length > 0 &&
    phoneNumber.length === 16 &&
    reEnterPhoneNumber === phoneNumber &&
    address.length > 0 &&
    postalCode.length === 7 &&
    selectedCarType.length > 0 &&
    selectedCleanType.length > 0 &&
    selectedPayType.length > 0 &&
    selectedDate.length > 0;

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

        if (discountActivasionStatus) {
          const activationResponse = await fetch(
            `https://carwash-d2381-default-rtdb.firebaseio.com/DiscountActivatedTimestamp.json`,
            {
              method: "GET", // Use the GET method to fetch data
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const discountActivasionTimeStamp = await activationResponse.json();

          if (discountActivasionTimeStamp === 0) {
            // If it doesn't exist, save the current time as the activation timestamp
            await fetch(
              `https://carwash-d2381-default-rtdb.firebaseio.com/DiscountActivatedTimestamp.json`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(Date.now()),
              }
            );
          } else {
            const getDiscountActivationTimeStamp = await fetch(
              `https://carwash-d2381-default-rtdb.firebaseio.com/DiscountActivatedTimestamp.json`,
              {
                method: "GET", // Use the GET method to fetch data
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const discountActivationTimeStampValue =
              await getDiscountActivationTimeStamp.json();
            setDiscountAvtivisionStartTime(discountActivationTimeStampValue);

            const currentTime = Date.now();
            const countdownDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
            const timeRemainingValue =
              discountActivationTimeStampValue +
              countdownDuration -
              currentTime;

            setTimeRemaining(timeRemainingValue);
          }
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    chaeckDiscount();

    const confirmationButtonClicked = async () => {
      try {
        let TotalAfterDiscount = totalPrice;
        if (discountActiveStatus) {
          TotalAfterDiscount = totalPrice - 15;
        }
        const response = await fetch(
          `https://carwash-d2381-default-rtdb.firebaseio.com/Days/${selectedDate}/${phoneNumber}.json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              phoneNumber,
              address,
              postalCode,
              selectedCarType,
              selectedCleanType,
              selectedExCustomization,
              selectedInCustomization,
              selectedBoCustomization,
              selectedPayType,
              selectedDate,
              selectedTime,
              totalPrice,
              TotalAfterDiscount,
            }),
          }
        );

        if (response.ok) {
          console.log("Data successfully saved in the database.");
          window.scrollTo(0, 0);

          props.showConfirmationPage(true);
          setName("");
          setPhoneNumber("");
          setReEnterPhoneNumber("");
          setAddress("");
          setPostalCode("");
          setSelectedCarType("");
          setSelectedCarTypeIndex(null);
          setSelectedCleanType("");
          setSelectedCleanTypeIndex(null);
          setSelectedExCustomization("");
          setselectedExCustomizationIndex(null);
          setSelectedInCustomization("");
          setselectedInCustomizationIndex(null);
          setSelectedBoCustomization("");
          setselectedBoCustomizationIndex(null);
          setSelectedDate("");
          setSelectedPayType("");
          setSelectedPayTypeIndex(null);
          setConfirmationError(false);
        } else {
          console.log("Failed to save data in the database.");
          setConfirmationError(true);
          toast.error("Failed to save data. Please try again later.", {
            position: toast.POSITION.TOP_CENTER,
          });

          setTimeout(function () {
            window.location.reload();
          }, 3500);

          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 100);
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setConfirmationError(true);
        toast.error("An error occurred. Please try again later.", {
          position: toast.POSITION.TOP_CENTER,
        });

        setTimeout(function () {
          window.location.reload();
        }, 3500);

        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      }
    };

    if (props.sendConfirm) {
      confirmationButtonClicked();
    }
  }, [props.sendConfirm]);

  if (formReady) {
    if (
      selectedExCustomization.length > 0 ||
      selectedInCustomization.length > 0 ||
      selectedBoCustomization.length > 0
    ) {
      setisFormReady(true);
    } else {
      setisFormReady(false);
    }
  }

  const generateNextSevenDays = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const availableDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(tomorrow);
      date.setDate(tomorrow.getDate() + i);

      const options = { weekday: "short", month: "short", day: "numeric" };
      const formattedDate = date.toLocaleDateString("en-US", options);

      if (i === 0) {
        availableDays.push({
          date: "Tomorrow",
          value: date.toISOString().split("T")[0],
        });
      } else {
        availableDays.push({
          date: formattedDate,
          value: date.toISOString().split("T")[0],
        });
      }
    }
    return availableDays;
  };

  const availableDays = generateNextSevenDays();

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedTime(isWeekend(event.target.value) ? 12 : 18);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(parseInt(event.target.value));
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  // Determine if the selected date is a weekend
  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 5 || day === 6; // Sunday (0) or Saturday (6)
  };

  const handlePostalCode = (event) => {
    const input = event.target.value.toUpperCase(); // Remove non-digit characters

    if (/^[A-Z0-9 -]*$/.test(input)) {
      setPostalCode(
        input.replace(/(\w{3})(\w{0,3})/, (_, first, second) => {
          if (second) {
            return `${first}-${second}`;
          }
          return first;
        })
      );
    }
  };

  const handlePhoneChange = (event) => {
    // Get the raw phone number without any formatting
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");

    // Apply the desired formatting based on the length of the raw number
    let formattedPhoneNumber = "";
    if (rawPhoneNumber.length >= 1) {
      formattedPhoneNumber = "(" + rawPhoneNumber.slice(0, 3) + ")";
    }
    if (rawPhoneNumber.length >= 4) {
      formattedPhoneNumber += " " + rawPhoneNumber.slice(3, 6);
    }
    if (rawPhoneNumber.length >= 7) {
      formattedPhoneNumber += " - " + rawPhoneNumber.slice(6, 10);
    }

    // Update the state with the formatted phone number
    setPhoneNumber(formattedPhoneNumber);
  };

  const handleReEnterPhoneChange = (event) => {
    // Get the raw phone number without any formatting
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");

    // Apply the desired formatting based on the length of the raw number
    let formattedPhoneNumber = "";
    if (rawPhoneNumber.length >= 1) {
      formattedPhoneNumber = "(" + rawPhoneNumber.slice(0, 3) + ")";
    }
    if (rawPhoneNumber.length >= 4) {
      formattedPhoneNumber += " " + rawPhoneNumber.slice(3, 6);
    }
    if (rawPhoneNumber.length >= 7) {
      formattedPhoneNumber += " - " + rawPhoneNumber.slice(6, 10);
    }

    // Update the state with the formatted phone number
    setReEnterPhoneNumber(formattedPhoneNumber);
  };

  const carTypes = ["Cydan", "SUV", "Truck"];

  const handleCarTypeClick = (index) => {
    if (selectedCarTypeIndex === index) {
      // If the same div is clicked again, unselect it
      setSelectedCarTypeIndex(null);
      setSelectedCarType("");
    } else {
      // Otherwise, select the clicked div
      setSelectedCarTypeIndex(index);
      setSelectedCarType(carTypes[index]);
    }
  };

  const PayTypes = ["Cash", "e-Transfer"];

  const handlePayTypeClick = (index) => {
    if (selectedPayTypeIndex === index) {
      // If the same div is clicked again, unselect it
      setSelectedPayTypeIndex(null);
      setSelectedPayType("");
    } else {
      // Otherwise, select the clicked div
      setSelectedPayTypeIndex(index);
      setSelectedPayType(PayTypes[index]);
    }
  };

  const cleanTypes = ["Exterior", "Interior", "Both"];

  const handleCleanTypeClick = (index) => {
    if (selectedCleanTypeIndex === index) {
      // If the same div is clicked again, unselect it
      setSelectedCleanTypeIndex(null);
      setSelectedCleanType("");
    } else {
      if (cleanTypes[index] === "Exterior") {
        setselectedInCustomizationIndex(null);
        setSelectedInCustomization("");
        setselectedBoCustomizationIndex(null);
        setSelectedBoCustomization("");
      } else if (cleanTypes[index] === "Interior") {
        setselectedExCustomizationIndex(null);
        setSelectedExCustomization("");
        setselectedBoCustomizationIndex(null);
        setSelectedBoCustomization("");
      } else if (cleanTypes[index] === "Both") {
        setselectedExCustomizationIndex(null);
        setSelectedExCustomization("");
        setselectedInCustomizationIndex(null);
        setSelectedInCustomization("");
      }
      // Otherwise, select the clicked div
      setSelectedCleanTypeIndex(index);
      setSelectedCleanType(cleanTypes[index]);
    }
  };

  const washExCustomizations = ["Basic Clean", "Premium Shine"];
  const washExCustomizationsDescription = [
    "A thorough wash using water and soap to refresh your vehicle's exterior.",
    "Give your car a premium shine with a complete treatment: water, soap, detailed drying, wheel cleaning, tire shining, and a glossy finish.",
  ];

  const handleExCustomizations = (index) => {
    if (selectedExCustomizationIndex === index) {
      // If the same div is clicked again, unselect it
      setselectedExCustomizationIndex(null);
      setSelectedExCustomization("");
    } else {
      // Otherwise, select the clicked div
      setselectedExCustomizationIndex(index);
      setSelectedExCustomization(washExCustomizations[index]);
    }
  };

  const washInCustomizations = ["Basic Clean", "Premium Shine"];
  const washInCustomizationsDescription = [
    "Vacuuming of carpets, mats, and seats, along with window cleaning.",
    "Using a carpet shampooer for deep cleaning of carpets, mats, and seats, along with thorough vacuuming and window cleaning.",
  ];

  const handleInCustomizations = (index) => {
    if (selectedInCustomizationIndex === index) {
      // If the same div is clicked again, unselect it
      setselectedInCustomizationIndex(null);
      setSelectedInCustomization("");
    } else {
      // Otherwise, select the clicked div
      setselectedInCustomizationIndex(index);
      setSelectedInCustomization(washInCustomizations[index]);
    }
  };

  const washBoCustomizations = ["Basic Clean", "Premium Shine"];
  const washBoCustomizationsDescription = ["", ""];

  const handleBoCustomizations = (index) => {
    if (selectedBoCustomizationIndex === index) {
      // If the same div is clicked again, unselect it
      setselectedBoCustomizationIndex(null);
      setSelectedBoCustomization("");
    } else {
      // Otherwise, select the clicked div
      setselectedBoCustomizationIndex(index);
      setSelectedBoCustomization(washBoCustomizations[index]);
    }
  };

  if (cleanTypes[selectedCleanTypeIndex] && carTypes[selectedCarTypeIndex]) {
    if (selectedExCustomization.length > 0) {
      setTotalPrice(
        pricingData.carTypes[carTypes[selectedCarTypeIndex]][
          cleanTypes[selectedCleanTypeIndex]
        ][washExCustomizations[selectedExCustomizationIndex]]
      );
    } else if (selectedInCustomization.length > 0) {
      setTotalPrice(
        pricingData.carTypes[carTypes[selectedCarTypeIndex]][
          cleanTypes[selectedCleanTypeIndex]
        ][washInCustomizations[selectedInCustomizationIndex]]
      );
    } else if (selectedBoCustomization.length > 0) {
      setTotalPrice(
        pricingData.carTypes[carTypes[selectedCarTypeIndex]][
          cleanTypes[selectedCleanTypeIndex]
        ][washBoCustomizations[selectedBoCustomizationIndex]]
      );
    } else {
      setTotalPrice(0);
    }
  } else {
    setTotalPrice(0);
  }

  const timeRangeStart = isWeekend(selectedDate) ? 12 : 18;
  const timeRangeEnd = isWeekend(selectedDate) ? 21 : 22;

  function TimeBox({ label, value }) {
    return (
      <div className="time-box">
        <p className="time-box-value">{value}</p>
        <p className="time-box-label">{label}</p>
      </div>
    );
  }

  const days = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor(
    (timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
  );
  const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);

  useEffect(() => {
    // Update the remaining time every second
    const interval = setInterval(updateRemainingTime, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeRemaining]);

  const updateRemainingTime = () => {
    if (timeRemaining > 1000) {
      setTimeRemaining(timeRemaining - 1000);
    } else {
      setTimeRemaining(0);
    }
  };

  return (
    <div className="FormsSection">
      <Slogan />
      <div className="formsContainer">
        <div className="discount-message">
          {discountActiveStatus ? (
            timeRemaining !== null ? (
              <div className="discount-active">
                <p className="discount-label">Discount is active.</p>
                <p className="discount-info">
                  Enjoy the $15 discount during the first week!
                </p>
                <div className="time-boxes">
                  <TimeBox label="Days" value={days} />
                  <TimeBox label="Hours" value={hours} />
                  <TimeBox label="Minutes" value={minutes} />
                  <TimeBox label="Seconds" value={seconds} />
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )
          ) : (
            <p className="noDiscount">No discount available at the moment.</p>
          )}
        </div>
        {/* this is for name input */}
        <div className="formSmallSection">
          <div className="greenTickWithTitle">
            {name.length > 0 ? (
              <img
                className="greenTick"
                src={require(`../Assets/greenTick2.png`)}
                alt="greenTick"
              />
            ) : (
              <div></div>
            )}

            <div className="tile">
              Name<span className="star">*</span>
            </div>
          </div>
          <input className="input" value={name} onChange={handleNameChange} />
        </div>

        {/* this is for phone input */}
        <div className="formSmallSection">
          <div className="greenTickWithTitle">
            {phoneNumber.length === 16 ? (
              <img
                className="greenTick"
                src={require(`../Assets/greenTick2.png`)}
                alt="greenTick"
              />
            ) : (
              <div></div>
            )}
            <div className="tile">
              Phone<span className="star">*</span>
            </div>
          </div>

          <input
            className="input"
            type="text"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="(xxx) xxx-xxxx"
          />
        </div>

        {/* this is for Re-enter phone input */}
        <div className="formSmallSection">
          <div className="greenTickWithTitle">
            {reEnterPhoneNumber.length === 16 &&
            reEnterPhoneNumber === phoneNumber ? (
              <img
                className="greenTick"
                src={require(`../Assets/greenTick2.png`)}
                alt="greenTick"
              />
            ) : (
              <div></div>
            )}
            <div className="tile">
              Re-enter Phone<span className="star">*</span>
            </div>
          </div>

          <input
            className="input"
            type="text"
            value={reEnterPhoneNumber}
            onChange={handleReEnterPhoneChange}
            placeholder="(xxx) xxx-xxxx"
          />
        </div>

        {/* this is for address input */}
        <div className="formSmallSection">
          <div className="greenTickWithTitle">
            {address.length > 0 ? (
              <img
                className="greenTick"
                src={require(`../Assets/greenTick2.png`)}
                alt="greenTick"
              />
            ) : (
              <div></div>
            )}
            <div className="tile">
              Address<span className="star">*</span>
            </div>
          </div>
          <input
            className="input"
            onChange={handleAddressChange}
            value={address}
            placeholder="123 Main Street"
          />
        </div>

        <div className="formSmallSection">
          <div className="greenTickWithTitle">
            {postalCode.length === 7 ? (
              <img
                className="greenTick"
                src={require(`../Assets/greenTick2.png`)}
                alt="greenTick"
              />
            ) : (
              <div></div>
            )}
            <div className="tile">
              Postal Code<span className="star">*</span>
            </div>
          </div>
          <input
            className="input"
            onChange={handlePostalCode}
            value={postalCode}
            placeholder="xxx-xxx"
            maxLength={7}
          />
        </div>

        <div className="formSmallSection">
          <div className="greenTickWithTitle">
            {selectedCarType.length > 0 ? (
              <img
                className="greenTick"
                src={require(`../Assets/greenTick2.png`)}
                alt="greenTick"
              />
            ) : (
              <div></div>
            )}
            <div className="tile">
              Car type<span className="star">*</span>
            </div>
          </div>
          <div className="TypesContainer">
            {carTypes.map((type, i) => {
              return (
                <div
                  onClick={() => handleCarTypeClick(i)}
                  key={i}
                  className="eachTypeContainer"
                  style={{
                    backgroundColor:
                      selectedCarTypeIndex === i ? "#E9E9E9" : "white",
                    color: "black",
                    borderColor:
                      selectedCarTypeIndex === i ? "black" : "#BABABA",
                    cursor: "pointer",
                  }}
                >
                  <img
                    className="carTypeImg"
                    src={require(`../Assets/${type}.png`)}
                    alt="CydanImg"
                  />
                  <div className="typeName">{type}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="formSmallSection">
          <div className="greenTickWithTitle">
            {selectedCleanType.length > 0 ? (
              <img
                className="greenTick"
                src={require(`../Assets/greenTick2.png`)}
                alt="greenTick"
              />
            ) : (
              <div></div>
            )}
            <div className="tile">
              Clean type<span className="star">*</span>
            </div>
          </div>
          <div className="TypesContainer">
            {cleanTypes.map((type, i) => {
              return (
                <div
                  onClick={() => handleCleanTypeClick(i)}
                  key={i}
                  className="eachTypeContainer"
                  style={{
                    backgroundColor:
                      selectedCleanTypeIndex === i ? "green" : "white",
                    color: selectedCleanTypeIndex === i ? "white" : "black",
                    borderColor:
                      selectedCleanTypeIndex === i ? "black" : "#BABABA",
                    cursor: "pointer",
                  }}
                >
                  <div className="typeName">{type}</div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedCleanType === "Exterior" ||
        selectedCleanType === "Interior" ||
        selectedCleanType === "Both" ? (
          <div className="formSmallSection">
            <div className="greenTickWithTitle">
              {selectedExCustomization.length > 0 ||
              selectedInCustomization.length > 0 ||
              selectedBoCustomization.length > 0 ? (
                <img
                  className="greenTick"
                  src={require(`../Assets/greenTick2.png`)}
                  alt="greenTick"
                />
              ) : (
                <div></div>
              )}
              <div className="tile">
                Customize Your{" "}
                {selectedCleanType === "Both"
                  ? "Exterior and Interior"
                  : selectedCleanType === "Exterior"
                  ? "Exterior"
                  : selectedCleanType === "Interior"
                  ? "Interior"
                  : ""}{" "}
                Wash
                <span className="star">*</span>
              </div>
            </div>
            <div className="TypesContainers">
              {selectedCleanType === "Exterior" ? (
                washExCustomizations.map((type, i) => {
                  return (
                    <div
                      onClick={() => handleExCustomizations(i)}
                      key={i}
                      className="eachTypeContainerForCustomization"
                      style={{
                        backgroundColor:
                          selectedExCustomizationIndex === i
                            ? "green"
                            : "white",
                        color:
                          selectedExCustomizationIndex === i
                            ? "white"
                            : "black",
                        borderColor:
                          selectedExCustomizationIndex === i
                            ? "black"
                            : "#BABABA",
                        cursor: "pointer",
                      }}
                    >
                      <div className="typeName">
                        <span style={{ fontWeight: "bold" }}>{type}: </span>
                        {washExCustomizationsDescription[i]}
                      </div>
                    </div>
                  );
                })
              ) : selectedCleanType === "Interior" ? (
                washInCustomizations.map((type, i) => {
                  return (
                    <div
                      onClick={() => handleInCustomizations(i)}
                      key={i}
                      className="eachTypeContainerForCustomization"
                      style={{
                        backgroundColor:
                          selectedInCustomizationIndex === i
                            ? "green"
                            : "white",
                        color:
                          selectedInCustomizationIndex === i
                            ? "white"
                            : "black",
                        borderColor:
                          selectedInCustomizationIndex === i
                            ? "black"
                            : "#BABABA",
                        cursor: "pointer",
                      }}
                    >
                      <div className="typeName">
                        <span style={{ fontWeight: "bold" }}>{type}: </span>
                        {washInCustomizationsDescription[i]}
                      </div>
                    </div>
                  );
                })
              ) : selectedCleanType === "Both" ? (
                washBoCustomizations.map((type, i) => {
                  return (
                    <div
                      onClick={() => handleBoCustomizations(i)}
                      key={i}
                      className="eachTypeContainerForCustomization"
                      style={{
                        backgroundColor:
                          selectedBoCustomizationIndex === i
                            ? "green"
                            : "white",
                        color:
                          selectedBoCustomizationIndex === i
                            ? "white"
                            : "black",
                        borderColor:
                          selectedBoCustomizationIndex === i
                            ? "black"
                            : "#BABABA",
                        cursor: "pointer",
                      }}
                    >
                      <div className="typeName">
                        <span style={{ fontWeight: "bold" }}>{type}: </span>
                        <div style={{ lineHeight: "1.5" }}>
                          {washBoCustomizationsDescription[i]}
                          <br />
                          <span
                            style={{
                              color:
                                selectedBoCustomizationIndex === i
                                  ? "yellow"
                                  : "blue",
                              fontWeight: "bold",
                            }}
                          >
                            Exterior:{" "}
                          </span>{" "}
                          {washExCustomizationsDescription[i]}
                          <br />
                          <br />
                          <span
                            style={{
                              color:
                                selectedBoCustomizationIndex === i
                                  ? "yellow"
                                  : "blue",
                              fontWeight: "bold",
                            }}
                          >
                            Interior:{" "}
                          </span>
                          {washInCustomizationsDescription[i]}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div></div>
              )}
            </div>
          </div>
        ) : (
          <div></div>
        )}

        <div className="formSmallSection">
          <div className="greenTickWithTitle">
            {selectedDate.length > 0 ? (
              <img
                className="greenTick"
                src={require(`../Assets/greenTick2.png`)}
                alt="greenTick"
              />
            ) : (
              <div></div>
            )}
            <div className="tile">
              Date<span className="star">*</span>
            </div>
          </div>
          <div className="date-section">
            <select
              className="date-dropdown"
              value={selectedDate}
              onChange={handleDateChange}
            >
              <option value="">Select a date</option>
              {availableDays.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.date}
                </option>
              ))}
            </select>
            <div className="working-hours">
              <p
                className={`working-hours-note${
                  isWeekend(selectedDate)
                    ? ""
                    : selectedDate.length === 0
                    ? ""
                    : "-weekend"
                }`}
              >
                Weekdays: 6 PM - 10 PM
              </p>
              <p
                className={`working-hours-note${
                  isWeekend(selectedDate) ? "-weekend" : ""
                }`}
              >
                Weekends: 12 PM - 9 PM
              </p>
            </div>
          </div>
        </div>

        <div className="formSmallSection">
          <div className="tile">Preferred Time:</div>
          <div className="timeSliderContainer">
            <input
              type="range"
              min={timeRangeStart}
              max={timeRangeEnd}
              value={selectedTime}
              onChange={handleTimeChange}
              disabled={!selectedDate}
            />
            {/* <p className="sellectedTime">{selectedTime}:00 PM</p> */}
            <p className="sellectedTime">
              {selectedTime % 12 === 0 ? 12 : selectedTime % 12}
              :00 {selectedTime < 12 ? "AM" : "PM"}
            </p>
          </div>
        </div>

        <div className="formSmallSection">
          <div className="greenTickWithTitle">
            {selectedPayType.length > 0 ? (
              <img
                className="greenTick"
                src={require(`../Assets/greenTick2.png`)}
                alt="greenTick"
              />
            ) : (
              <div></div>
            )}
            <div className="tile">
              Payment type<span className="star">*</span>
            </div>
          </div>
          <div className="TypesContainer">
            {PayTypes.map((type, i) => {
              return (
                <div
                  onClick={() => handlePayTypeClick(i)}
                  key={i}
                  className="eachTypeContainer"
                  style={{
                    backgroundColor:
                      selectedPayTypeIndex === i ? "green" : "white",
                    color: selectedPayTypeIndex === i ? "white" : "black",
                    borderColor:
                      selectedPayTypeIndex === i ? "black" : "#BABABA",
                    cursor: "pointer",
                  }}
                >
                  <div className="typeName">{type}</div>
                </div>
              );
            })}
          </div>
          <p className="note">
            <span className="important-text">No Payment Required</span> Until
            Your Vehicle is{" "}
            <span className="satisfactory-text">Satisfactorily Cleaned.</span>
          </p>
        </div>
      </div>

      {props.sendConfirm && !confirmationError ? (
        <div className="loadingContainer">
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "45%",
              zIndex: 1000,
            }}
          >
            <RingLoader color="blue" />
          </div>
          <div className="loadingBG"></div>
        </div>
      ) : (
        <div></div>
      )}
      <ToastContainer />
    </div>
  );
}
export default FormsSection;
