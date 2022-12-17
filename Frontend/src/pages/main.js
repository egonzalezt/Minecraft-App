import Header from "../components/header";
import Footer from "../components/footer";
import NavBar from "../components/navBar";

function Main() {
    return (
        <div>
            <NavBar />
            <div id="text" style={{
                backgroundImage: `url(${"../img/book.png"})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "50% 100%",
                backgroundPosition: "center",
            }}>
                <Header />
                <div style={{ padding: 10 }}>
                    <br />
                    <h2><u>kiubo gonorea</u></h2>
                    <p className="normal">
                        Presione el boton para descargar los mods men.
                    </p>
                    <p className="normal">
                        Version de maincra 1.16.5
                    </p>
                    <p className="normal">
                        Forge 36.2.39
                    </p>
                    <p className="normal">
                        Turip Ip Ip
                    </p>

                    <p className="normal">
                        Montesitos Product Owner
                    </p>
                    <p className="normal">
                        Llamas220 Product Owner
                    </p>
                    <p className="normal">
                        Daves2126 Developer
                    </p>
                    <p className="normal">
                        Catmizxc Supervisor, Cloud Engineer
                    </p>
                    <p className="normal">
                        Perderas BetaTester
                    </p>
                    <p className="normal">
                        Almowolf (UI) Designer
                    </p>
                    <p className="normal">
                        Turip Ip Ip
                    </p>
                    <p className="normal">
                        Made by VasitosCorp
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Main;
