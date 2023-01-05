import "./StartScreen.css";

const StartScreen = ({startGame})=>{
    return (
        <div className="start">
            <h1> Palavre Secreta</h1>
            <p> Clique no botão abaixo apra comeaçr o jogo!</p>
            <button onClick={startGame} >Começar jogo</button>
        </div>
    );
};

export default StartScreen;