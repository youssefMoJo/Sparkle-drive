import React, { useEffect, useState } from "react";
import axios from "axios";

function GetLocation(props) {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState("");

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    if (latitude && longitude) {
      const apiKey = "AIzaSyDQdpbsROGpW_0rnWGrHputmFGq9w_aTfY";
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

      axios
        .get(apiUrl)
        .then((response) => {
          if (response.data.results.length > 0) {
            const formattedAddress = response.data.results[0].formatted_address;
            setAddress(formattedAddress);
          } else {
            setAddress("Location not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching location:", error);
          setAddress("Error fetching location");
        });
    }
    // console.log("address: ", address)
    console.log(latitude, longitude);
    props.address(address);
    // props.sendLoc(latitude, longitude)
  };

  useEffect(() => {
    getLocation();
  });

  return (
    <div className="GetLocationContainer">
      <img
        className="addressImg"
        src={require("../Assets/address.png")}
        alt="addressImg"
        onClick={getLocation}
      />
    </div>
  );
}

export default GetLocation;
