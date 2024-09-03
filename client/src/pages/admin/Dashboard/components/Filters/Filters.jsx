import { DatePicker, Select } from 'antd';
import dayjs from "dayjs";

const Filters = ({ selectedYear, setSelectedYear, selectedView, setSelectedView }) => {
    const options = [
        {
            value: 'monthly',
            label: 'Monthly',
        },
        {
            value: 'quarterly',
            label: 'Quarterly',
        },
        {
            value: 'halfYearly',
            label: 'Half Yearly',
        },
        {
            value: 'yearly',
            label: 'Yearly',
        }
    ];
    const currentYear = dayjs().year();

    const handleDateChange = (date, dateString) => {
        if (dateString) {
            setSelectedYear(dateString);
        } else {
            setSelectedYear('');
        }
    };

    const handleViewChange = (value) => {
        setSelectedView(value);
    }

    const disableFutureDates = (current) => {
        return current && current.year() > currentYear;
    };

    return (
        <div className='filters'>
            <DatePicker
                picker="year"
                className='year-picker'
                value={selectedYear ? dayjs(selectedYear) : selectedYear}
                onChange={handleDateChange}
                disabledDate={disableFutureDates}
                format='YYYY'
            />
            <Select
                className='view-selector'
                options={options}
                value={selectedView}
                onChange={handleViewChange}
            />
        </div>
    )
};

export default Filters;