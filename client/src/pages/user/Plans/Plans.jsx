import { useState, useEffect } from 'react';
import './Plans.css';
import PlanCard from './components/PlanCard/PlanCard';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../../../redux/loaderSlice';
import productService from '../../../services/productService';
import stripeService from '../../../services/stripeService';

const Plans = () => {
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();

    const fetchProducts = async () => {
        dispatch(ShowLoading());
        try {
            const response = await productService.fetchAllProducts();
            if (response.products) {
                setProducts(response.products);
            }
        } catch (error) {
            message.error(error.response.data.error);
        } finally {
            dispatch(HideLoading());
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleContinue = async (priceId) => {
        console.log('Go with: ', priceId);
        dispatch(ShowLoading());
        try {
            const response = await stripeService.createCheckoutSession({ priceId });
            if (response.url) {
                console.log('URL: ', response.url);
                window.location.href = response.url;
            }
        } catch (error) {
            message.error(error.response.data.error);
        } finally {
            dispatch(HideLoading());
        }
    };

    return (
        <div className='plans'>
            <div className='main-title'>Plans</div>
            {(products && products.length > 0) &&
                <div className='cards-container'>
                    {products.map((product, index) => (
                        <div key={index}>
                            <>
                                {product.type === 'Subscription' &&
                                    <PlanCard product={product} handleContinue={handleContinue} popular={index === (products.length / 2) - 1} />
                                }
                            </>
                        </div>
                    ))}
                </div>
            }
        </div >
    )
};

export default Plans;