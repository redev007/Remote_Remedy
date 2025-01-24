import React from "react";
import { FaFacebookF, FaGithub,FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import { FaPhoneAlt, FaHospital } from 'react-icons/fa';

export const footMenu = [
    {
        id: 1,
        title: "Shop & More",
        menu: [
            {
                id: 1,
                link: "Buy Medicines",
                path: "/buy-medicines"
            },
            {
                id: 2,
                link: "Disease Prediction",
                path: "/disease-prediction"
            }
        ]
    },
    {
        id: 2,
        title: "Ours",
        menu: [
            {
                id: 1,
                link: "About Us",
                path: "/about"  // Change path to "/about"
            },
            {
                id: 2,
                link: "Contact Us",
                path: "/contact"  // Change path to "/contact"
            },
            {
                id: 3,
                link: "Rate Us",
                path: "/feedback"
            },
        ]
    }
];

export const footSocial = [
    {
        id: 1,
        icon: <FaGithub />,
        cls: "GitHub",
        path: "https://github.com/ReDev007/Remote_Remedy",
    },
       {
        id: 2,
        icon: <IoMdMail />,
        cls: "Mail",
        path: "/",
    },
    {
        id: 3,
        icon: <FaPhoneAlt />,
        cls: "phone",
        path: "/",
    },
    {
        id: 4,
        icon: <FaHospital />,
        cls: "Hospital",
        path: "/",
    },
   
];
