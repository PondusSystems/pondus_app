import { useState, useEffect } from 'react';
import './ProductsTable.css';
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import PlaceholderImage from '../../../../../assets/images/placeholder_image.png';
import { sortArray } from '../../../../../utils/sortUtils';


const ProductsTable = ({ data, handleEdit, handleDelete }) => {
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

    return (
        <table className='products-table'>
            <thead>
                <tr>
                    <th onClick={() => handleSort('name')}>
                        <div className='head-container'>
                            <div className='text'>Name</div>
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
                    <th onClick={() => handleSort('productId')}>
                        <div className='head-container'>
                            <div className='text'>Product ID</div>
                            {sortConfig.key === 'productId' &&
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
                    <th onClick={() => handleSort('price')}>
                        <div className='head-container'>
                            <div className='text'>Price</div>
                            {sortConfig.key === 'price' &&
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
                    <th onClick={() => handleSort('type')}>
                        <div className='head-container'>
                            <div className='text'>Type</div>
                            {sortConfig.key === 'type' &&
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
                {sortedData.map((product, index) => (
                    <tr key={index}>
                        <td>
                            <div className='name-container'>
                                <img src={product.image ? product.image : PlaceholderImage} className='product-image' alt='product-image' />
                                <div className='text'>{product.name}</div>
                            </div>
                        </td>
                        <td>
                            <div className='text'>{product.productId}</div>
                        </td>
                        <td>
                            <div className='text'>{product.currency.toUpperCase()} {product.price}</div>
                        </td>
                        <td>
                            <div className={`text label ${product.type === 'Subscription' ? 'y-label' : 'g-label'}`}>{product.type}</div>
                        </td>
                        <td>
                            <div className='btn-container'>
                                <button className='btn edit-btn' onClick={() => handleEdit(product)}>Edit</button>
                                <button className='btn delete-btn' onClick={() => handleDelete(product)}>Delete</button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
};

export default ProductsTable;