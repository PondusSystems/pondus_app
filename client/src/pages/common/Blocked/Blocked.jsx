import './Blocked.css'; // Import the CSS file for styling

const Blocked = () => {
    return (
        <div className="blocked-container">
            <div className="blocked-message">
                <h1>Access Blocked</h1>
                <p>Your access has been revoked by the <strong>Pondus Systems</strong>.</p>
                <p>If you believe this is a mistake or if you need further assistance, please contact your administrator or support team.</p>
            </div>
        </div>
    );
};

export default Blocked;
