import { useEffect } from 'react';
import './App.css';
import Loader from "./components/Loader/Loader.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyInfo } from './redux/companyInfoSlice.js';
import Router from './router/Router.jsx';

function App() {
  const { counter } = useSelector((state) => state.loader);
  const loading = counter > 0;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompanyInfo());
  }, [dispatch]);

  return (
    <div className="App">
      {loading && <Loader />}
      <Router />
    </div>
  )
}

export default App

