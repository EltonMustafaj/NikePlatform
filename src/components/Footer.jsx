import './Footer.css'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3 className="text-gradient">NIKE Patika</h3>
                        <p>Dyqani më i mirë i patikave NIKE në Kosovë</p>
                    </div>

                    <div className="footer-section">
                        <h4>Kontakti</h4>
                        <p>Email: info@nikepatika.com</p>
                        <p>Tel: +383 XX XXX XXX</p>
                    </div>

                    <div className="footer-section">
                        <h4>Informacione</h4>
                        <p>Pagesa me Cash në Dorëzim</p>
                        <p>Dërgesa në të gjithë Kosovën</p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 NIKE Patika. Të gjitha të drejtat e rezervuara.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
