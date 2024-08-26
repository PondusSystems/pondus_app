import { useState, useEffect } from 'react';
import './UsersTable.css';
import userImage from '../../../../../assets/images/user_icon.png';
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { sortArray } from '../../../../../utils/sortUtils';

const UsersTable = ({ data, handleEdit, handleDelete }) => {
    const [sortedData, setSortedData] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: '',
        direction: ''
    });

    useEffect(() => {
        setSortedData(data);
    }, [data]);

    const handleSort = (key) => {
        const newArr = [...sortedData];
        let direction;
        if (sortConfig.key != key) {
            direction = 'desc';
        }
        else if (sortConfig.direction === 'desc') {
            direction = 'asc'
        }
        else {
            setSortConfig({
                key: '',
                direction: ''
            });
            setSortedData(data);
            return;
        }
        sortArray(newArr, key, direction);
        setSortedData(newArr);
        setSortConfig({
            key,
            direction
        });
    };

    const getLabel = (user) => {
        if (user.status === 'New') {
            return 'yellow-label'
        }
        else if (user.status === 'Active') {
            return 'green-label'
        }
        else if (user.status === 'Lost') {
            return 'red-label'
        }
        else {
            return '';
        }
    };

    return (
        <table className='users-table'>
            <thead>
                <tr>
                    <th onClick={() => handleSort('name')}>
                        <div className='head-container'>
                            <div className='text'>Full Name</div>
                            {sortConfig.key === 'name' &&
                                <>
                                    {sortConfig.direction === 'desc' ?
                                        < FaCaretDown className='icon' />
                                        :
                                        <FaCaretUp className='icon' />
                                    }
                                </>
                            }
                        </div>
                    </th>
                    <th onClick={() => handleSort('email')}>
                        <div className='head-container'>
                            <div className='text'>Email</div>
                            {sortConfig.key === 'email' &&
                                <>
                                    {sortConfig.direction === 'desc' ?
                                        < FaCaretDown className='icon' />
                                        :
                                        <FaCaretUp className='icon' />
                                    }
                                </>
                            }
                        </div>
                    </th>
                    <th onClick={() => handleSort('number')}>
                        <div className='head-container'>
                            <div className='text'>Phone</div>
                            {sortConfig.key === 'number' &&
                                <>
                                    {sortConfig.direction === 'desc' ?
                                        < FaCaretDown className='icon' />
                                        :
                                        <FaCaretUp className='icon' />
                                    }
                                </>
                            }
                        </div>
                    </th>
                    <th onClick={() => handleSort('status')}>
                        <div className='head-container'>
                            <div className='text'>Status</div>
                            {sortConfig.key === 'status' &&
                                <>
                                    {sortConfig.direction === 'desc' ?
                                        < FaCaretDown className='icon' />
                                        :
                                        <FaCaretUp className='icon' />
                                    }
                                </>
                            }
                        </div>
                    </th>
                    <th>
                        Action
                    </th>
                </tr>
            </thead>
            <tbody>
                {sortedData.map((user, index) => (
                    <tr key={index}>
                        <td>
                            <div className='name-container'>
                                <img src={userImage} className='user-image' />
                                <div className='text'>{user.name}</div>
                            </div>
                        </td>
                        <td>
                            <div className='text'>{user.email}</div>
                        </td>
                        <td>
                            <div className='text'>{user.number}</div>
                        </td>
                        <td>
                            <div className={`text label ${getLabel(user)}`}>{user.status}</div>
                        </td>
                        <td>
                            <div className='btn-container'>
                                <button className='btn edit-btn' onClick={() => handleEdit(user)}>Edit</button>
                                <button className='btn delete-btn' onClick={() => handleDelete(user)}>Delete</button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
};

export default UsersTable;