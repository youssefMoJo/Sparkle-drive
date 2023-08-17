import "../Styles/Slogan.css";

function Slogan() {
  return (
    <div className="SloganContainer">
      <div className="Slogan">
        Sparkling clean cars, delivered to your door!
      </div>
      <img
        className="SloganImg"
        src={require("../Assets/slogan1.png")}
        alt="SloganImg"
      />
    </div>
  );
}

export default Slogan;
