import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { RiFileList3Line } from 'react-icons/ri';
import { FiMail, FiPhoneCall } from 'react-icons/fi';
import { CiMenuFries } from 'react-icons/ci';
import { MdClose } from 'react-icons/md';
import { IoWalletOutline } from 'react-icons/io5';
import commonContext from '../../contexts/common/commonContext';
import cartContext from '../../contexts/cart/cartContext';
import useOutsideClose from '../../hooks/useOutsideClose';
import Profile from './Profile';
import logo from "../../assets/header.png";
import AccountForm from '../form/Accountform';

const Header = () => {
    const { toggleForm, userLogout, toggleProfile } = useContext(commonContext);
    const { cartItems } = useContext(cartContext);
    const [isSticky, setIsSticky] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const curPath = location.pathname;
    
    const dropdownRef = useRef();
    const mobileMenuRef = useRef();

    useOutsideClose(dropdownRef, () => setShowDropdown(false));
    useOutsideClose(mobileMenuRef, () => setMobileMenuOpen(false));

    const navItems = [
        { path: '/home', label: 'HOME' },
        { path: '/doctors', label: 'DOCTORS', showFor: 'patient' },
        { path: '/disease-prediction', label: 'MODEL' },
        { path: '/buy-medicines', label: 'MEDICINES', badge: '20% off' }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY >= 50);
            setIsScrolled(window.scrollY >= 1);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const NavLink = ({ path, label, badge }) => (
        <div className={`relative group`}>
            <span 
                className={`text-xs font-bold cursor-pointer transition-colors duration-300
                    ${curPath === path ? "text-blue-900" : "text-blue-800 hover:text-blue-900"}`}
                onClick={() => {
                    navigate(path);
                    setMobileMenuOpen(false);
                }}
            >
                {label}
                {badge && (
                    <span className="absolute -right-0 md:-right-10 top-0 flex items-center justify-center w-12 h-5 bg-blue-20 rounded-full text-xs text-white-6">
                        {badge}
                    </span>
                )}
            </span>
            {curPath === path && (
                <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 h-0.5 w-full bg-blue-900" />
            )}
        </div>
    );

    return (
        <>
            {/* Top Contact Bar */}
            {localStorage.getItem("username") && localStorage.getItem("usertype") === "patient" && (
                <div className={`hidden md:flex justify-between items-center px-4 lg:px-40 py-4 border-b border-blue-800
                    transition-all duration-300 ${isScrolled ? 'h-0 opacity-0 invisible p-0' : 'h-full opacity-100 visible'}`}>
                    <div className="flex items-center gap-5 text-gray-600">
                        <Link to="/" className="flex items-center hover:text-gray-800 transition-colors duration-300">
                            <FiMail className="mr-1" />
                            <span className="text-sm">Remote_Remedy489@gmail.com</span>
                        </Link>
                        <Link to="/" className="flex items-center hover:text-gray-800 transition-colors duration-300">
                            <FiPhoneCall className="mr-1" />
                            <span className="text-sm">+91 12345 67890</span>
                        </Link>
                    </div>
                    <Link to="/doctors" className="text-blue-500 font-bold hover:text-blue-700 transition-colors duration-300">
                        Appointment
                    </Link>
                </div>
            )}

            {/* Main Header */}
            <header className={`relative w-full py-6 transition-colors duration-200 
                ${isSticky ? 'sticky top-0 left-0 z-1000 shadow-md bg-gradient-to-br from-blue-1 to-blue-2' : ''}`}>
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center">
                            <img src={logo} alt="Remote_Remedy" className="h-12 w-auto" />
                        </Link>

                        {localStorage.getItem("username") ? (
                            <>
                                {/* Desktop Navigation */}
                                <nav className="hidden md:flex items-center gap-12">
                                    {navItems.map((item) => (
                                        (!item.showFor || localStorage.getItem("usertype") === item.showFor) && (
                                            <NavLink key={item.path} {...item} />
                                        )
                                    ))}
                                    
                                    {/* Account Dropdown */}
                                    <div className="relative" ref={dropdownRef}>
                                        <span 
                                            className="text-xs font-bold text-blue-800 hover:text-blue-900 transition-colors duration-300 cursor-pointer"
                                            onClick={() => setShowDropdown(!showDropdown)}
                                        >
                                            ACCOUNT
                                        </span>
                                        {showDropdown && (
                                            <div className="absolute top-12 right-0 w-64bg-gradient-to-br from-blue-1 to-blue-2 p-6 rounded-lg shadow-lg z-50
                                                animate-fadeIn">
                                                <div className="text-white space-y-4">
                                                    <h4 className="font-semibold">
                                                        Hello! {localStorage.getItem("username")}
                                                    </h4>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            className="px-4 py-2 bg-blue-9 rounded hover:bg-slate-800 transition-colors duration-300"
                                                            onClick={() => {
                                                                setShowDropdown(false);
                                                                toggleProfile(true);
                                                            }}
                                                        >
                                                            Profile
                                                        </button>
                                                        <button 
                                                            className="px-4 py-2 border rounded hover:bg-blue-500 transition-colors duration-300"
                                                            onClick={() => {
                                                                userLogout();
                                                                navigate("/");
                                                            }}
                                                        >
                                                            Logout
                                                        </button>
                                                    </div>
                                                    <div className="space-y-3 pt-4 border-t border-blue-400">
                                                        <Link to="/my-wallet" className="flex items-center gap-2 hover:text-blue-200 transition-colors duration-300">
                                                            <IoWalletOutline />
                                                            My Wallet
                                                        </Link>
                                                        <Link to="/my-cart" className="flex items-center gap-2 hover:text-blue-200 transition-colors duration-300">
                                                            <AiOutlineShoppingCart />
                                                            My Cart
                                                            <span className="px-2 py-1 bg-blue-500 rounded-full text-xs">
                                                                {cartItems.length}
                                                            </span>
                                                        </Link>
                                                        <Link to="/my-orders" className="flex items-center gap-2 hover:text-blue-200 transition-colors duration-300">
                                                            <RiFileList3Line />
                                                            My Orders
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </nav>

                                {/* Mobile Menu */}
                                <div className="md:hidden" ref={mobileMenuRef}>
                                    <button 
                                        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                                        className="text-2xl text-blue-800 hover:text-blue-900 transition-colors duration-300"
                                    >
                                        {isMobileMenuOpen ? <MdClose /> : <CiMenuFries />}
                                    </button>

                                    {isMobileMenuOpen && (
                                        <div className="absolute top-full right-0 w-64 bg-gradient-to-br from-blue-1 to-blue-2 shadow-lg rounded-lg mt-2 p-4 z-50
                                            animate-fadeInLeft">
                                            <div className="space-y-4">
                                                {navItems.map((item) => (
                                                    (!item.showFor || localStorage.getItem("usertype") === item.showFor) && (
                                                        <div key={item.path} className="px-4 py-2 hover:bg-blue-50 rounded transition-colors duration-300">
                                                            <NavLink {...item} />
                                                        </div>
                                                    )
                                                ))}
                                                <hr className="my-2 border-blue-100" />
                                                <div className="space-y-3 px-4">
                                                    <Link to="/my-wallet" className="flex items-center gap-2 text-blue-800 hover:text-blue-600 transition-colors duration-300">
                                                        <IoWalletOutline />
                                                        My Wallet
                                                    </Link>
                                                    <Link to="/my-cart" className="flex items-center gap-2 text-blue-800 hover:text-blue-600 transition-colors duration-300">
                                                        <AiOutlineShoppingCart />
                                                        My Cart
                                                        <span className="px-2 py-1 bg-blue-100 rounded-full text-xs">
                                                            {cartItems.length}
                                                        </span>
                                                    </Link>
                                                    <Link to="/my-orders" className="flex items-center gap-2 text-blue-800 hover:text-blue-600 transition-colors duration-300">
                                                        <RiFileList3Line />
                                                        My Orders
                                                    </Link>
                                                </div>
                                                <hr className="my-2 border-blue-100" />
                                                <div className="px-4 space-y-2">
                                                    <button 
                                                        className="w-full px-4 py-2 bg-blue-9 text-white rounded hover:bg-slate-800 transition-colors duration-300"
                                                        onClick={() => {
                                                            setMobileMenuOpen(false);
                                                            toggleProfile(true);
                                                        }}
                                                    >
                                                        Profile
                                                    </button>
                                                    <button 
                                                        className="w-full px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors duration-300"
                                                        onClick={() => {
                                                            userLogout();
                                                            navigate("/");
                                                        }}
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <button 
                                onClick={toggleForm}
                                className="px-4 py-2 bg-blue-4 text-white-6 rounded hover:bg-slate-600 transition-colors duration-300"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <AccountForm />
            <Profile />
        </>
    );
};

export default Header;