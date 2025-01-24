import React from "react";
import { Link } from "react-router-dom";
import { footMenu, footSocial } from "../../data/footerData";
import { TfiAngleRight } from "react-icons/tfi";
import logo from "../../assets/header.png";

const Footer = () => {
  return (
    <footer
      id="footer"
      className="bg-gradient-to-br from-blue-1 to-blue-2 text-blue-8 py-12 mt-12"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_repeat(2,1fr)] gap-12 justify-items-center">
          <div >
            <Link to="/">
            <img
                src={logo}
                alt="footer-logo"
                style={{ height: "50px" }} 
                />
            </Link>
          </div>

          {footMenu.map((item) => {
            const { id, title, menu } = item;
            return (
              <div key={id} className="text-center md:text-left">
                <h4 className="font-bold text-lg mb-4">{title}</h4>
                <ul className="mt-6 grid gap-4 min-w-[200px]">
                  {menu.map((menuItem) => {
                    const { id, link, path } = menuItem;
                    return (
                      <li
                        key={id}
                        className="transition-all duration-300 ease-out"
                      >
                        <div className="flex items-center gap-2 hover:ml-2">
                          <TfiAngleRight className="text-sm text-opacity-80 " />
                          <Link
                            to={path}
                            className="text-sm opacity-80 hover:opacity-100 hover:underline hover:text-blue-500 transition-transform transform hover:translate-x-1"
                          >
                            {link}
                          </Link>
                        </div>
                      </li>
                    );
                  })}
                  {localStorage.getItem("usertype") === "patient" &&
                    title === "Shop & More" && (
                      <li className="transition-all duration-300 ease-in-out">
                        <div className="flex items-center gap-2 hover:ml-2">
                          <TfiAngleRight className="text-sm text-opacity-80" />
                          <Link
                            to="/doctors"
                            className="text-sm opacity-80 hover:opacity-100 hover:underline hover:text-blue-500 transition-transform transform hover:translate-x-1"
                          >
                            Book an Appointment
                          </Link>
                        </div>
                      </li>
                    )}
                </ul>
              </div>
            );
          })}
        </div>


        <div className="border-t border-opacity-70 mt-10"></div>


        <div className="flex flex-col-reverse  items-center justify-between mt-8 gap-8">
          <p className="text-sm flex flex-col items-center justify-between md:flex-row">
            <Link
              to="/"
              className="opacity-80 hover:opacity-100 transition-all"
            >
              {new Date().getFullYear()} @{" "}Remote_Remedy |{" "}
            </Link>{" "}
            {" "}| All Rights Reserved
          </p>
          <div className="flex gap-8 text-lg">
            {footSocial.map((item) => {
              const { id, icon, cls, path } = item;
              return (
                <Link
                  key={id}
                  to={path}
                  className={`hover:text-blue-9 transition-transform transform hover:scale-110 ${cls}`}
                >
                  {icon}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
