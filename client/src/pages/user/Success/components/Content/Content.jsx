import './Content.css';
import { Link } from 'react-router-dom';

const Content = () => {
    return (
        <div className="success-content">
            <div className="title">Thank you for registering</div>
            <div className='description'>We have registered your payment and you can now proceed to get the full benefit of your membership.</div>
            <Link to='/billing' className='btn'>Go to your account</Link>
        </div>
    )
};

export default Content;