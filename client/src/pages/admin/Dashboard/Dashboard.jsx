import './Dashboard.css';
import TurnoverGraph from './components/TurnoverChart/TurnoverChart';
import CounterCard from './components/CounterCard/CounterCard';
import CLVSpeedometer from './components/CLVSpeedometer/CLVSpeedometer';
import GrowthRateChart from './components/GrowthRateChart/GrowthRateChart';

const Dashboard = () => {
    return (
        <div className='dashboard'>
            <div className='top-bar'>
                <div className='title'>Dashboard</div>
            </div>
            <TurnoverGraph />
            <div className='bottom-div'>
                <CLVSpeedometer />
                <GrowthRateChart />
            </div>
            <div className='counter-card-container'>
                <CounterCard value="171" description="Active members (on average)" query='active' />
                <CounterCard value="133" description="New members" query='new' />
                <CounterCard value="89" description="Lost members" query='lost' />
            </div>
        </div>
    )
};

export default Dashboard;