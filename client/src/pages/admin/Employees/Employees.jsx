import { useState, useEffect } from 'react';
import './Employees.css';
import { IoSearch } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { message, Empty } from 'antd';
import { ShowLoading, HideLoading } from '../../../redux/loaderSlice';
import EmployeesTable from './components/EmployeesTable/EmployeesTable';
import PaginationHandler from '../../../components/PaginationHandler/PaginationHandler';
import CustomModal from '../../../components/CustomModal/CustomModal';
import UserForm from '../../../components/UserForm/UserForm';
import userService from '../../../services/userService';

const Employees = () => {
    const newData = [
        {
            name: 'Martha Steward',
            email: 'marthastew@mail.com',
            number: '+45 75700546',
            dateOfBirth: "1990-05-16",
            address: "Johar Town",
            city: "Lahore",
            zip: "7600",
            status: 'on leave',
            notes: "<p>notes testing</p>",
            createdAt: "2024-08-15T12:22:28.109+00:00",
            updatedAt: "2024-09-15T09:16:32.109+00:00",
        },
        {
            name: 'Tony Stark',
            email: 'tonystark@mail.com',
            number: '+45 75700549',
            dateOfBirth: "1998-07-27",
            address: "Model Town",
            city: "Lahore",
            zip: "9200",
            status: '',
            notes: '',
            createdAt: "2024-08-15T12:22:28.109+00:00",
            updatedAt: "2024-09-15T09:16:32.109+00:00",
        },
        {
            name: 'Steve Rogers',
            email: 'steverogers@mail.com',
            number: '+45 75700548',
            dateOfBirth: "2000-09-11",
            address: "Defence",
            city: "Lahore",
            zip: "1700",
            status: '',
            notes: '',
            createdAt: "2024-08-15T12:22:28.109+00:00",
            updatedAt: "2024-09-15T09:16:32.109+00:00",
        },
        {
            name: 'Bruce Banner',
            email: 'brucebanner@mail.com',
            number: '+45 75700541',
            dateOfBirth: "1994-01-08",
            address: "Bahria Town",
            city: "Lahore",
            zip: "5600",
            status: '',
            notes: '',
            createdAt: "2024-08-15T12:22:28.109+00:00",
            updatedAt: "2024-09-15T09:16:32.109+00:00",
        }
    ];

    const [pageIndex, setPageIndex] = useState(1);
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [paginationConfig, setPaginationConfig] = useState({
        count: 0,
        totalCount: 0,
        totalPages: 0
    });
    const [searchQuery, setSearchQuery] = useState("");
    const limit = 10;
    const dispatch = useDispatch();

    const fetchEmployees = async () => {
        dispatch(ShowLoading());
        try {
            const query = {
                pageIndex,
                limit,
                searchQuery
            }
            const response = await userService.searchEmployees(query);
            if (response.result) {
                setData(response.result.users);
                setPaginationConfig({
                    count: response.result.users.length,
                    totalCount: response.result.totalCount,
                    totalPages: response.result.totalPages
                });
            }
        } catch (error) {
            message.error(error.response.data.error);
            setData([]);
            setPaginationConfig({
                count: 0,
                totalCount: 0,
                totalPages: 0
            });
        } finally {
            dispatch(HideLoading());
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [pageIndex]);

    const handleSearch = () => {
        if (pageIndex !== 1) {
            setPageIndex(1);
        }
        else {
            fetchEmployees();
        }
    };

    const handleAdd = () => {
        setActionType("add");
        setEditUser(null);
        setIsOpen(true);
    };

    const handleEdit = (user) => {
        setActionType("edit");
        setEditUser(user);
        setIsOpen(true);
    };

    const handleDelete = async (user) => {
        const isConfirm = window.confirm('Are you sure?');
        if (!isConfirm) {
            return;
        }
        console.log('Deleting');
        dispatch(ShowLoading());
        try {
            const response = await userService.deleteEmployee(user._id);
            message.success(response.message);
            await fetchEmployees();
        } catch (error) {
            message.error(error.response.data.error);
        } finally {
            dispatch(HideLoading());
        }
    };

    const handleSave = async (user) => {
        console.log('Save Employee: ', user);
        const payload = { ...user }
        dispatch(ShowLoading());
        try {
            let response;
            if (actionType === "add") {
                response = await userService.createEmployee(payload);
            }
            else {
                if (!payload.password) {
                    delete payload.password;
                }
                response = await userService.updateEmployee(editUser._id, payload);
            }
            message.success(response.message);
            onRequestClose();
            await fetchEmployees();
        } catch (error) {
            message.error(error.response.data.error);

        } finally {
            dispatch(HideLoading());
        }
    };

    const onRequestClose = () => {
        setIsOpen(false);
    };

    const handlePageChange = (page) => {
        setPageIndex(page);
    };

    return (
        <div className='employees'>
            <div className='top-bar'>
                <div className='title'>Employees</div>
                <div className='btn-container'>
                    <input type='text' className='search-btn' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <IoSearch size={30} className='search-icon' onClick={handleSearch} />
                    <button className='create-btn' onClick={handleAdd}>Create employee</button>
                </div>
            </div>
            {(data && data.length > 0) ?
                <div>
                    <EmployeesTable data={data} handleEdit={handleEdit} handleDelete={handleDelete} />
                    <PaginationHandler count={paginationConfig.count} totalCount={paginationConfig.totalCount} pageIndex={pageIndex} totalPages={paginationConfig.totalPages} handlePageChange={handlePageChange} />
                </div>
                :
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
            <CustomModal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel={"Add/Edit Employee Form"}>
                <UserForm user={editUser} userType="employee" actionType={actionType} handleSave={handleSave} />
            </CustomModal>
        </div>
    )
};

export default Employees;