import './CounterCard.css';
import HeartIcon from '../../../../../assets/icons/heart.svg?react';

const CounterCard = ({ value, description }) => {
    return (
        <div className='counter-card'>
            <HeartIcon />
            <div className='text'>
                <div className='value'>{value}</div>
                <div className='description'>{description}</div>
            </div>
        </div>
    )
};

export default CounterCard;