import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useDocTitle from "../hooks/useDocTitle";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { MdExpandMore } from "react-icons/md";
import { AiFillLinkedin, AiFillGithub } from "react-icons/ai";
import { TbStethoscope, TbHeartPlus } from "react-icons/tb";
import { BsRobot } from "react-icons/bs";
import { GiMedicines } from "react-icons/gi";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt, FaHospital } from "react-icons/fa";
import { IoAccessibility } from "react-icons/io5";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";
import bg from "../assets/landing-bg.png";
import need from "../assets/need.png";
import profiles from "../data/teamData";

const LandingPage = () => {
  const { isLoading, toggleLoading } = useContext(commonContext);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const faqRef = useRef(null);

  useEffect(() => {
    toggleLoading(true);
    setTimeout(() => toggleLoading(false), 2000);
  }, []);

  useScrollDisable(isLoading);
  useDocTitle();
  const navigate = useNavigate();

  const handleFaqClick = (index) => {
    setOpenFaqIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleOutsideClick = (event) => {
    if (faqRef.current && !faqRef.current.contains(event.target)) {
      setOpenFaqIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  const handleOnCLick = () => {
    navigate("/doctors");
  };

  const faqs = [
    {
      question: "What is Remote_Remedy?",
      answer:
        "It is the web application that connects patients to the right doctor or allow them to choose a doctor as per their need. It provides information about users, doctors, news, appointments, and prescriptions. It also allows users to create instant meetings with doctors, and buy medicines. It allows users to check their health status by using his/her symptoms.",
    },
    {
      question:
        "Can we get a free account in Remote_Remedy and use all its features for free?",
      answer:
        "Yes, Ofcourse. You can use all the features provided by Remote_Remedy for free.",
    },
    {
      question: "Can we book an appointment at any time?",
      answer:
        "Yes. You can book an appointment of a doctor if he/she is free at that time.",
    },
    {
      question: "Is there a way to test our health?",
      answer:
        "Yes. You can test your health by a Model that predicts the disease probability in the future.",
    },
    {
      question: "Can we purchase the medicines from here?",
      answer: "Yes. You can purchase the medicines from Remote_Remedy store.",
    },
  ];

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <div id="landing-page">
        <section className="h-screen w-full">
          {/* curvy-img */}
          <div className="relative top-[5.5rem] h-[90%] bg-left bg-no-repeat bg-cover -b-4 left-0 z-0 bg-curvy-shape max-lg:h-[95%] max-md:h-[80%] max-md:top-[23.5rem]"></div>
          <div className="absolute left-0 top-0 h-[85%] z-[1] flex justify-evenly items-center w-full text-blue-8 text-shadow-landing-highlight max-md:flex max-md:justify-end max-md:items-center max-md:flex-col-reverse max-xxs:top-12 max-lg:px-4">
            <div className="max-w-[50%] max-md:pt-8 max-md:max-w-[90%]">
              {/* highlight-heading */}
              <h2 className="text-[2.5rem] mb-4 text-shado animated-heading max-md:text-[1.7em]">
                Healing Hands & Caring Hearts
              </h2>
              {/* highlight-text */}
              <p className="text-[1rem] mt-[1.4rem] animate-fadeIn duration-200 ease-in-out gap-[2em] max-md:text-[1em]">
                Connecting patients and doctors, no matter the distance <br />
                we are dedicated to your wellbeing & committed to your care...
              </p>
              {/* {localStorage.getItem("username") && localStorage.getItem("username") !== "undefined" && localStorage.getItem("usertype") === "patient" && (
                                <button onClick={() => navigate("/wellness-programs")}>Join Wellness Program</button>
                            )} */}
            </div>

            <div className="max-w-[50%] text-center max-md:max-w-full">
              <img src={bg} alt="landing bg" className="my-[20px] mx-auto max-md:max-w-[90%]" />
            </div>
          </div>
        </section>
        {/* services-section */}
        <section className="py-16 px-0 text-center bg-white-1">
          <div>
            <h2 className="text-[#333] mb-8">Services we provide</h2>
          </div>
          {/* service-list */}
          <div className="flex flex-wrap justify-around mt-8 max-w-[1200px] my-0 mx-auto">
            {/* service-item */}
            <div className="bg-[#f5f5f5] flex flex-col items-center flex-shrink flex-grow-0 basis-[30%] min-w-[280px] max-w-[280px] text-center p-[25px] rounded-[10px] transition-all duration-300 border-[1px] border-white-[#dcdcdc] m-4 hover:scale-[1.05] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              {/* icon-container */}
              <div className="flex items-center justify-center min-h-[80px] max-h-[80px]">
                {/* icon icon-1*/}
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-[1.8rem] bg-[rgba(25, 150, 143, 0.1)] text-[#19958f] border-[2px] border-[#19958f]">
                  <TbStethoscope />
                </div>
              </div>
              <h3 className="text-[#222] mb-3 text-[1.25rem]">
                Experienced Doctors
              </h3>
              <p className="text-[#555] text-[0.9rem]">
                Connect with doctors through live video calls and receive
                prescriptions.
              </p>
            </div>
            <div className="flex flex-col items-center flex-shrink flex-grow-0 basis-[30%] min-w-[280px] max-w-[280px] text-center p-[25px] rounded-[10px] transition-all duration-300 border-[1px] border-white-[#dcdcdc] bg-[#f5f5f5] m-4 hover:scale-[1.05] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-center min-h-[80px] max-h-[80px]">
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-[1.8rem] bg-[rgba(245, 158, 50, 0.1)] text-[#f59c23] border-[2px] border-[#f59c23]">
                  <BsRobot />
                </div>
              </div>
              <h3 className="text-[#222] mb-3 text-[1.25rem]">
                Health Prediction
              </h3>
              <p className="text-[#555] text-[0.9rem]">
                Assess your health status with our advanced disease detection
                model.
              </p>
            </div>
            <div className="flex flex-col items-center flex-shrink flex-grow-0 basis-[30%] min-w-[280px] max-w-[280px] text-center p-[25px] rounded-[10px] transition-all duration-300 border-[1px] border-white-[#dcdcdc] bg-[#f5f5f5] m-4 hover:scale-[1.05] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-center min-h-[80px] max-h-[80px]">
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-[1.8rem] bg-[rgba(240, 80, 50, 0.1)] text-[#f05032] border-[2px] border-[#f05032]">
                  <GiMedicines />
                </div>
              </div>
              <h3 className="text-[#222] mb-3 text-[1.25rem]">
                Pharmacy store
              </h3>
              <p className="text-[#555] text-[0.9rem]">
                Buy medications securely through our integrated pharmacy
                service.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 px-0">
          <div className="w-full flex flex-wrap my-0 mx-auto justify-center items-center max-w-[1300px] max-md:flex max-md:flex-col">
            <div className="flex-shrink-0 flex-grow-0 basis-[40%] w-full p-4 text-center max-md:mb-8">
              <img src={need} alt="why" className="w-[90%] max-ma:max-w-[400px] max-md:w-[90%]"/>
            </div>
            <div className="flex-shrink-0 flex-grow-0 basis-[55%] p-4 max-md:p-8">
              <h2 className="text-blue-9 mb-8">Why do we need a proper health care?</h2>
              <ul>
                <li className="my-4 mx-auto text-blue-8">
                  WHO recommends 44.5 doctors per 10,000 people but India has
                  only 22 per 10k people so major supply demand mismatchIndia
                  has 22.8 doctors for every 10K citizens, the half of what WHO
                  recommends.
                </li>
                <li className="my-4 mx-auto text-blue-8">
                  Also, local doctors may fail to provide the best consultation
                  as they lack expertise & experience.
                </li>
                <li className="my-4 mx-auto text-blue-8">
                  Thus all-in-one online hospital was created. It offers a
                  disease prediction system, pharmacy, and payments.
                </li>
                <li className="my-4 mx-auto text-blue-8">
                  This platform provides access to quality healthcare from
                  anywhere, improving healthcare outcomes and accessibility.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 px-0 bg-white-1">
          <div className="text-center text-blue-9">
            <h2>Our Benefits</h2>
            <div className="flex flex-wrap my-0 mx-auto max-w-[1000px] justify-center mt-8 text-blue-7">
              {/* first */}
              <div   className="flex justify-between items-center shrink-0 grow-0 basis-[20%] min-w-[210px] max-w-[210px] text-center py-4 px-8 rounded-[7px] transition-all duration-300 ease-in-out bg-[rgba(246,171,47,0.1)] m-4 hover:shadow-[0_0_4px_0_#f6ab2f]"
              >
                {/* icon */}
                <div className="text-[1.5rem] shrink-0 grow-0 basis-[20%] text-[#f6ab2f]">
                  <MdOutlineHealthAndSafety />{" "}
                </div>
                <p className="flex shrink-0 grow-0 basis-[70%]">TeleHealth services</p>
              </div>
              <div className="flex justify-between items-center shrink-0 grow-0 basis-[20%] min-w-[210px] max-w-[210px] text-center py-4 px-8 rounded-[7px] transition-all duration-300 ease-in-out bg-[rgba(12,184,182,0.1)] m-4 hover:shadow-[0_0_4px_0_#0cb8b6]">
                <div className="text-[1.5rem] shrink-0 grow-0 basis-[20%] text-[#0cb8b6]">
                  <IoAccessibility />{" "}
                </div>
                <p className="flex shrink-0 grow-0 basis-[70%]">Convenience and accessibility</p>
              </div>
              <div className="flex justify-between items-center shrink-0 grow-0 basis-[20%] min-w-[210px] max-w-[210px] text-center py-4 px-8 rounded-[7px] transition-all duration-300 ease-in-out bg-[rgba(230,73,45,0.1)] m-4 hover:shadow-[0_0_4px_0_#e6492d]">
                <div className="text-[1.5rem] shrink-0 grow-0 basis-[20%] text-[#e6492d] ">
                  <TbStethoscope />{" "}
                </div>
                <p className="flex shrink-0 grow-0 basis-[70%]">Online Appointment Booking</p>
              </div>
              <div className="flex justify-between items-center shrink-0 grow-0 basis-[20%] min-w-[210px] max-w-[210px] text-center py-4 px-8 rounded-[7px] transition-all duration-300 ease-in-out bg-[rgba(22,101,216,0.1)] m-4 hover:shadow-[0_0_4px_0_#1665d8]">
                <div className="text-[1.5rem] shrink-0 grow-0 basis-[20%] text-[#1665d8] ">
                  <TbHeartPlus />{" "}
                </div>
                <p className="flex shrink-0 grow-0 basis-[70%]">Competitive advantage</p>
              </div>
            </div>
          </div>
        </section>

        {localStorage.getItem("username") &&
          localStorage.getItem("username") !== "undefined" &&
          localStorage.getItem("usertype") === "patient" && (
            <section className="team-section">
              <div className="team-div">
                <div className="head">
                  <h2>Meet Our Team</h2>
                </div>
                <div className="team">
                  {profiles.map((profile) => (
                    <div className="item" key={profile.id}>
                      <div className="img-div">
                        <img
                          src={profile.imgSrc}
                          alt={profile.name}
                          className="img"
                        />
                        <div className="contact-div">
                          {profile.contact.map((contact, index) => {
                            const IconComponent =
                              contact.icon === "IoMdMail"
                                ? IoMdMail
                                : contact.icon === "FaPhoneAlt"
                                ? FaPhoneAlt
                                : FaHospital;
                            return (
                              <div
                                className="contact-icon"
                                key={index}
                                onClick={handleOnCLick}
                              >
                                <IconComponent />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <h3>{profile.name}</h3>
                      <p>{profile.specialty}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

        <section className="faq-section">
          <div className="faq-div" ref={faqRef}>
            <div className="img-div">
              <img src="faq-img.png" alt="faq" />
            </div>
            <div className="content">
              <h2 className="head">Any Queries ?</h2>
              <div className="faqs">
                {faqs.map((item, index) => (
                  <Accordion
                    key={index}
                    className="faq-item object-cover shadow-md hover:shadow-[0px_0px_10px_2px_rgba(59,130,246,0.6)]"
                    expanded={openFaqIndex === index}
                    onChange={() => handleFaqClick(index)}
                  >
                    <AccordionSummary
                      expandIcon={<MdExpandMore className="icon" />}
                      className="expand-icon"
                    >
                      <div className="item-qn">{item.question}</div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="item-ans">{item.answer}</div>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;
