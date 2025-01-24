import React, { useState, useEffect, useContext } from "react";
import Modal from '@mui/material/Modal';
import useDocTitle from "../hooks/useDocTitle";
import { IoMdClose } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";
import { Alert } from "@mui/material";
import { BsEmojiAngry, BsEmojiFrown, BsEmojiExpressionless, BsEmojiSmile, BsEmojiLaughing } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineLightBulb, HiUserGroup } from "react-icons/hi";
import { FaVideo } from "react-icons/fa";
import httpClient from "../httpClient";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";
import HealthFact from "../components/facts/HealthFact";


const Home = () => {
    useDocTitle("Home");
    const navigate = useNavigate();

    const { isLoading, toggleLoading } = useContext(commonContext);

    const [haslastMeet, setHasLastMeet] = useState(localStorage.getItem("lastMeetWith")!==undefined && localStorage.getItem("lastMeetWith")!==null && localStorage.getItem("lastMeetWith")!=="null");
    const [feedbackRate, setFeedbackRate] = useState(3);
    const [feedbackAlert, setFeedbackAlert] = useState(false);
    const [searchPatient, setSearchPatient] = useState(localStorage.getItem("setSearchPatient")!==undefined && localStorage.getItem("setSearchPatient")!==null && localStorage.getItem("setSearchPatient")==="true");
    const isDoctor = localStorage.getItem("usertype")==="doctor";
    const [searching, setSearching] = useState(localStorage.getItem("searching")!==undefined && localStorage.getItem("searching")!==null ? localStorage.getItem("searching")==="2" ? 2 : 1 : 0);
    const [patient_name, setPatient_name] = useState(localStorage.getItem("curpname")!==undefined && localStorage.getItem("curpname")!==null && localStorage.getItem("curpname")!=="null" ? localStorage.getItem("curpname") : "");
    const [meetlink, setMeetlink] = useState(localStorage.getItem("curmlink")!==undefined && localStorage.getItem("curmlink")!==null && localStorage.getItem("curmlink")!=="null" ? localStorage.getItem("curmlink") : "");
    const userNotExists = localStorage.getItem("usertype")===undefined || localStorage.getItem("usertype")===null;
    const [joinmeet, setJoinmeet] = useState(false);
    const [message, setMessage] = useState("");
    const [joinlink, setJoinlink] = useState("");
    const [doctormail, setDoctorMail] = useState("");
    const [doctorname, setDoctorName] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [isAlert, setIsAlert] = useState("");
    const [availablemodal, setAvailablemodal] = useState(false);
    const [alertmessage, setAlertmessage] = useState("");
    const [available, setAvailable] = useState(localStorage.getItem("available")===undefined || localStorage.getItem("available")===null || localStorage.getItem("available")==="true");
    const [isVerified, setVerified] = useState(localStorage.getItem("verified")!==undefined && localStorage.getItem("verified")!==null && localStorage.getItem("verified")==="true");
    const [verCont, setVerCont] = useState("Your Account is not verified yet! Please verify for appointments!!");
    const [verAlert, setVerAlert] = useState(false);


    const handleFeedbackClose = () => {

        httpClient.post('/doctor_app', {
            email: localStorage.getItem("lastMeetMail"),
            stars: feedbackRate
        });
        localStorage.setItem("lastMeetWith", null);
        setHasLastMeet(false);

        setFeedbackAlert(true);
        setTimeout(() => {
            setHasLastMeet(false);
            setFeedbackAlert(false);
        }, 2000);
    };
    const ratings = ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"];

    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

    useEffect(() => {
        const now = new Date(new Date().getTime() - 10*60000);

        if(userNotExists) {
            navigate("/");
        }

        if(!userNotExists) {
            if (!isDoctor) { 
            toggleLoading(true);
            httpClient.post('/patient_apo', { email: localStorage.getItem('email') })
                .then((res) => {
                    let upcoming = [];
                    res.data.appointments.sort().reverse().forEach((appointment) => {
                        if (new Date(appointment.date+" " + appointment.time) >= now) {
                            upcoming.unshift(appointment);
                        }
                    });
                    toggleLoading(false);
                    setUpcomingAppointments(upcoming);
                })
                .catch((err) => {
                    toggleLoading(false);
                    console.log(err);
                })
            }
            else {
                toggleLoading(true);
                httpClient.post('/set_appointment', { email: localStorage.getItem('email') })
                    .then((res) => {
                        let upcoming = [];
                        res.data.appointments.sort().reverse().forEach((appointment) => {
                            if(new Date(appointment.date+" "+appointment.time) >= now){
                                upcoming.unshift(appointment);
                            }
                        });
                        toggleLoading(false);
                        setUpcomingAppointments(upcoming)
                    })
                    .catch((err) => {
                        toggleLoading(false);
                        console.log(err);
                    })
            }
        }
        // eslint-disable-next-line
    }, []);

    const searchmeet = () => {
        setSearchPatient(true);
        setSearching(0);
        httpClient.post('make_meet', { email: localStorage.getItem('email') })
            .then((res) => {
                console.log(res.data);
                if (res.data.link===null) {
                    setTimeout(() => {
                        setSearching(1);
                    }, 1000);
                    setTimeout(() => {
                        setSearchPatient(false);
                    }, 2000);
                }
                else {
                    setPatient_name(res.data.link['name']);
                    setMeetlink(res.data.link['link']);
                    setTimeout(() => {
                        setSearching(2);
                    }, 2000);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // setInterval(() => {
    //     httpClient.post('make_meet', { email: localStorage.getItem('email') })
    //         .then((res) => {
    //             if (res.data.link!==null) {
    //                 setPatient_name(res.data.link['name']);
    //                 setMeetlink(res.data.link['link']);
    //                 setSearchPatient(true);
    //                 setSearching(2);
    //             }
    //             else {
    //                 setSearchPatient(false);
    //                 setSearching(0);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    // }, 25000);

    {localStorage.getItem("usertype")==="doctor" &&
    setInterval(() => {
        setMeetlink(localStorage.getItem("curmlink"));
        setPatient_name(localStorage.getItem("curpname"));
        setSearching(localStorage.getItem("searching")==="2" ? 2 : localStorage.getItem("searching")==="1" ? 1 : 0);
        setSearchPatient(localStorage.getItem("setSearchPatient") === "true" ? true : false);
    }, 10000);}

    const handleappointmentmeet = (doc, demail, link) => {
        if(doc){
            setJoinlink(link);
            setDoctorMail(demail);
            setDoctorName(doc);
            setJoinmeet(true);
        }
        else{
            httpClient.post("meet_status", {email: localStorage.getItem("email"), link: link})
            httpClient.put("/currently_in_meet", {email: localStorage.getItem("email")})
            .then(res => {
                setSearchPatient(false);
                navigate(link);
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    const handlemeet = () => {
        httpClient.post("/meet_status", { "email": doctormail }).then((res) => {
            if ((res.status === 208 && res.data.link === joinlink) || res.status === 200) {
              httpClient.put("/make_meet", {
                "email": doctormail,
                "link": joinlink,
                "patient": localStorage.getItem("username")
              }).then((res) => {
                setTimeout(() => {
                  httpClient.post("/currently_in_meet", { "email": doctormail }).then((res) => {
                    if (res.data.curmeet) {
                      setIsConnecting(false);
                      navigate(joinlink)
                    }
                    else {
                      httpClient.put('/delete_meet', { "email": doctormail })
                      setIsConnecting(false);
                      setMessage(res.data.message);
                    }
                  })
                }, 30000);
              }).catch(() => {
                // console.log(res)
              })
            }
            else {
              setIsConnecting(false);
              setMessage(res.data.message);
            }
          }).catch(() => {
            // console.log(res)
          })
    }

    const iamavailable = () => {
        setIsAlert("success");
        setAlertmessage("Now, patients can meet you")
        setAvailablemodal(false);
        setTimeout(() => {
            httpClient.put("/doctor_avilability", { "email": localStorage.getItem("email") })
            setIsAlert("");
            setAlertmessage("");
            setAvailable(true);
            localStorage.setItem("available", true);
        }, 3000);
    }

    const iamnotavailable = () => {
        setIsAlert("error");
        setAlertmessage("Now, patients can't meet you")
        setAvailablemodal(false);
        setTimeout(() => {
            httpClient.put("/doc_status", { "email": localStorage.getItem("email") })
            setIsAlert("");
            setAlertmessage("");
            setAvailable(false);
            localStorage.setItem("available", false);
        }, 3000);
    }

    const check = () => {
        httpClient.post("/verify", { "email": localStorage.getItem("email") })
            .then((res) => {
                console.log(res.data);
                if (res.data.verified) {
                    setVerCont("Yayy! Your Account is verified!!")
                    setVerAlert(true);
                    setTimeout(() => {
                        setVerified(true);
                    }, 2000);
                    localStorage.setItem("verified", true);
                }
                else {
                    setVerCont("Oops! Your Account isn't verified yet!!");
                    setVerAlert(false);
                    setTimeout(() => {
                        setVerCont("Your Account is not verified yet! Please verify for appointments!!");
                        setVerified(false);
                    }, 2000);
                    localStorage.setItem("verified", false);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // const news = [{message: "Hello! all, today is the holiday", doctor: "Sam"}, {message: "Please be safe and stay at home", doctor: "Joe"}];

    useScrollDisable(isLoading);

    if(isLoading) {
        return <Preloader />;
    }


    return (
        <div className="pt-24">
        {isDoctor && !isVerified && (
            <Alert severity={verAlert ? "success" : "error"} 
                className="fixed top-24 w-full flex justify-center">
                {verCont}
            </Alert>
        )}

        {isDoctor && !isVerified && (
            <div className="mx-auto w-[93vw] max-w-[1100px] my-8 text-blue-800 flex justify-center items-center">
                <h3>Wanna check your verification status? </h3>
                <button 
                    onClick={check}
                    className="ml-4 bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-all duration-300 shadow-lg">
                    Check
                </button>
            </div>
        )}

        {isDoctor && (
            <div className="mx-auto w-[93vw] max-w-[1100px] relative p-12 border-2 border-blue-200 rounded-lg mb-12 transition-all duration-300 hover:w-[95vw] hover:border-blue-400">
                <div className="absolute inset-0 bg-[url('/search_patients.png')] bg-center bg-no-repeat bg-cover -z-10 blur"></div>
                <div className="flex justify-around items-center">
                    <div className="text-blue-800 flex flex-wrap items-end">
                        <h2 className="mr-2">Is there any patient waiting?</h2>
                        <p className="text-lg">Search for a patient now</p>
                    </div>
                    <div>
                        <button 
                            onClick={searchmeet}
                            disabled={!isVerified}
                            className="bg-blue-800 text-white px-8 py-4 rounded-lg hover:bg-blue-900 transition-all duration-300 shadow-lg disabled:cursor-not-allowed">
                            Search
                        </button>
                    </div>
                </div>
            </div>
        )}

<div className="mx-auto w-[93vw] max-w-[1100px] mb-16">
      <h2 className="mb-4 text-indigo-900">Upcoming Appointments</h2>
      <div>
        <ul>
          {upcomingAppointments.map((item, index) => (
            <li key={index} className="flex justify-between items-center p-2 px-4 mb-4 bg-slate-200 rounded-lg transition-all duration-300 hover:bg-slate-300">
              <div className="text-slate-700 flex flex-wrap items-end">
                <p className="text-lg mr-2">
                  {new Date(item.date + " " + item.time).toString().slice(0,3) + "," + 
                  new Date(item.date + " " + item.time).toString().slice(3, 16) + 
                  "at " + new Date(item.date + " " + item.time).toString().slice(16,21)},
                </p>
                <p> By {item.doctor ? item.doctor : item.patient}</p>
              </div>
              <button 
                className="bg-[#000066] text-white px-8 py-4 rounded-lg transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={new Date(item.date+" "+item.time) > new Date()}
                onClick={() => handleappointmentmeet(item.doctor,item.demail,item.link)}>
                Join
              </button>
            </li>
          ))}
          {upcomingAppointments.length === 0 && (
            <li className="flex justify-between items-center p-4 px-6 mb-4 bg-slate-200 rounded-lg">
              <div className="text-slate-700">No appointments found...</div>
              {!isDoctor && (
                <button 
                  className="bg-[#000066] text-white px-8 py-3 rounded-lg hover:opacity-90 transition-all duration-300"
                  onClick={() => navigate('/doctors')}>
                  Book
                </button>
              )}
            </li>
          )}
        </ul>
      </div>
    </div>


                    



        <div className="mx-auto w-[93vw] max-w-[1100px] bg-[#eedfa3] border-2 border-[#ff5500] p-6 text-[#ff5500] rounded-lg mb-20 transition-all duration-300 hover:w-[95vw] hover:p-8 hover:border-3">
            <div className="flex items-center mb-4 text-[#ff5900]">
                <HiOutlineLightBulb className="text-4xl mr-2" />
                <h2>Healthy Fact of the Day</h2>
            </div>
            <div className="px-4">
                <HealthFact />
            </div>
        </div>

        {isDoctor && isVerified && (
            <div 
                onClick={() => setAvailablemodal(true)}
                className="fixed bottom-10 left-5 p-3 rounded-lg bg-blue-900 text-white cursor-pointer z-50 flex flex-col items-center transition-all duration-300 hover:bg-blue-800">
                {isAlert !== "" && (
                    <Alert severity={isAlert} className="absolute -top-16 text-black w-64 left-0">
                        {alertmessage}
                    </Alert>
                )}
                Set your availability
                <span className={`w-full h-[3px] mt-1 rounded-lg bg-red-500 ${available ? "bg-green-500" : ""}`}></span>
            </div>
        )}
                


            <Modal open={haslastMeet && (!isDoctor)} onClose={handleFeedbackClose}>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] p-4 px-5 shadow-lg border-2 border-blue-200 bg-white rounded-lg text-blue-700 text-center">
                    <div className="text-right text-blue-500 hover:text-blue-800 transition-all duration-300 cursor-pointer">
                        <IoMdClose onClick={handleFeedbackClose} />
                    </div>
                    <div className="feedback-details">
                        {feedbackAlert && <Alert severity="success">Thank you for your response</Alert>}
                        <h3 className="my-4">Feedback</h3>
                        <div className="mb-3">How was your consultation with {localStorage.getItem("lastMeetWith")}?</div>
                        <div className="ratings">
                            <div className="flex justify-center items-center">
                                <div 
                                    className={`text-4xl mx-2 cursor-pointer ${feedbackRate === 0 ? 'text-red-500' : 'text-gray-500'}`}
                                    onClick={() => setFeedbackRate(0)}>
                                    <BsEmojiAngry />
                                </div>
                                <div 
                                    className={`text-4xl mx-2 cursor-pointer ${feedbackRate === 1 ? 'text-red-500' : 'text-gray-500'}`}
                                    onClick={() => setFeedbackRate(1)}>
                                    <BsEmojiFrown />
                                </div>
                                <div 
                                    className={`text-4xl mx-2 cursor-pointer ${feedbackRate === 2 ? 'text-orange-500' : 'text-gray-500'}`}
                                    onClick={() => setFeedbackRate(2)}>
                                    <BsEmojiExpressionless />
                                </div>
                                <div 
                                    className={`text-4xl mx-2 cursor-pointer ${feedbackRate === 3 ? 'text-green-500' : 'text-gray-500'}`}
                                    onClick={() => setFeedbackRate(3)}>
                                    <BsEmojiSmile />
                                </div>
                                <div 
                                    className={`text-4xl mx-2 cursor-pointer ${feedbackRate === 4 ? 'text-green-500' : 'text-gray-500'}`}
                                    onClick={() => setFeedbackRate(4)}>
                                    <BsEmojiLaughing />
                                </div>
                            </div>
                            <div className="mt-4 mb-4">
                                {ratings[feedbackRate]}
                            </div>
                        </div>
                    </div>
                    <div>
                        <button 
                            onClick={handleFeedbackClose}
                            disabled={feedbackAlert}
                            className="bg-blue-300 border border-blue-500 text-white px-3 py-2.5 rounded my-2 mx-1.5 font-montserrat transition-all duration-300 hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-500">
                            {feedbackAlert ? "Submitted" : "Submit"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Feedback Modal for Doctors */}
            <Modal open={haslastMeet && isDoctor} onClose={() => {
                localStorage.setItem("lastMeetWith", null);
                setHasLastMeet(false);
            }}>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] p-4 px-5 shadow-lg border-2 border-blue-200 bg-white rounded-lg text-blue-700 text-center">
                    <div className="text-right text-blue-500 hover:text-blue-800 transition-all duration-300 cursor-pointer">
                        <IoMdClose onClick={() => {
                            localStorage.setItem("lastMeetWith", null);
                            httpClient.put('/delete_meet', { "email": doctormail });
                            setHasLastMeet(false);
                        }} />
                    </div>
                    <div className="pb-6">
                        <h3 className="my-3">Thank You <BsEmojiSmile /> </h3>
                        <div className="thankyou-note">
                            Thank you, {localStorage.getItem("username")}!!<br /> You just treated one more life!
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Search Patient Modal */}
            <Modal open={searchPatient} onClose={() => setSearchPatient(false)}>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] p-4 px-5 shadow-lg border-2 border-blue-200 bg-white rounded-lg text-blue-700 text-center">
                    <div className="text-right text-blue-500 hover:text-blue-800 transition-all duration-300 cursor-pointer">
                        <IoMdClose onClick={() => setSearchPatient(false)} />
                    </div>
                    
                    {searching === 0 && (
                        <div className="text-center flex flex-col items-center">
                            <div className="relative p-4">
                                <HiUserGroup className="w-[min(70vw,200px)] h-[min(70vw,200px)] text-blue-500" />
                                <div className="absolute bottom-2.5 right-2.5 w-[min(100px,50vw)] h-[min(100px,50vw)]">
                                    <div className="w-full h-full animate-spin">
                                        <div className="absolute bottom-0 right-0 w-[min(150px,40vw)] h-[min(150px,40vw)] animate-maintain">
                                            <img className="w-full h-full" src="search-img.png" alt="searching" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3>Searching...</h3>
                        </div>
                    )}

                    {searching === 1 && (
                        <div className="text-center flex flex-col items-center">
                            <div className="relative p-4">
                                <HiUserGroup className="w-[min(70vw,200px)] h-[min(70vw,200px)] text-blue-500" />
                                <div className="absolute bottom-2.5 right-2.5 w-[min(100px,50vw)] h-[min(100px,50vw)] rounded-full bg-white border-5 border-green-500 p-2.5 text-green-500 flex items-center justify-center">
                                    <IoCheckmarkDone className="w-[min(90px,45vw)] h-[min(90px,45vw)]" />
                                </div>
                            </div>
                            <h3>No Patients Found!</h3>
                        </div>
                    )}

                    {searching === 2 && (
                        <div className="text-center flex flex-col items-center">
                            <h3>Patient Found!</h3>
                            <div className="flex flex-col items-center">
                                <div>Name: {patient_name}</div>
                                <div className="py-4 text-white">
                                    <button
                                        onClick={() => {
                                            httpClient.post("meet_status", {email: localStorage.getItem("email")});
                                            httpClient.put("/currently_in_meet", {email: localStorage.getItem("email")})
                                                .then(res => {
                                                    setSearchPatient(false);
                                                    localStorage.setItem("setSearchPatient", false);
                                                    navigate(`${meetlink}`);
                                                })
                                                .catch(err => console.log(err));
                                        }}
                                        className="bg-blue-300 border border-blue-500 text-white px-3 py-2.5 rounded my-2 mx-1.5 transition-all duration-300 hover:bg-blue-500">
                                        Connect now <FaVideo className="inline" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Join Meet Modal */}
            <Modal open={joinmeet} onClose={() => {
                setJoinmeet(false);
                setIsConnecting(false);
                setMessage(false);
                setDoctorMail("");
                setDoctorName("");
                setJoinlink("");
            }}>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] p-4 px-5 shadow-lg border-2 border-blue-200 bg-white rounded-lg text-blue-700 text-center">
                    <div className="text-right text-blue-500 hover:text-blue-800 transition-all duration-300 cursor-pointer">
                        <IoMdClose onClick={() => {
                            setJoinmeet(false);
                            setIsConnecting(false);
                            setMessage(false);
                            setDoctorMail("");
                            setDoctorName("");
                            setJoinlink("");
                        }} />
                    </div>
                    <div className="meet-details">
                        {message && <div className="not-available-note">Oops! {doctorname} is currently in another meet, you can wait a few minutes or else try again. </div>}
                    </div>
                    {isConnecting ? (
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex space-x-1">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="w-2 h-8 bg-blue-500 animate-wave" style={{animationDelay: `${i * 0.1}s`}}></div>
                                ))}
                            </div>
                            <div>Connecting...</div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <button 
                                onClick={() => {
                                    setIsConnecting(true);
                                    handlemeet();
                                }}
                                className="bg-blue-300 border border-blue-500 text-white px-3 py-2.5 rounded my-2 mx-1.5 transition-all duration-300 hover:bg-blue-500">
                                Connect <FaVideo className="inline" />
                            </button>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Available Modal */}
            <Modal open={availablemodal} onClose={() => setAvailablemodal(false)}>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[min(400px,90vw)] p-4 px-5 shadow-lg border-2 border-blue-200 bg-white rounded-lg text-blue-700 text-center">
                    <div className="text-right text-blue-500 hover:text-blue-800 transition-all duration-300 cursor-pointer">
                        <IoMdClose onClick={() => setAvailablemodal(false)} />
                    </div>
                    <div className="flex flex-col items-center text-white gap-2.5">
                        <div 
                            onClick={() => iamavailable()}
                            className="bg-blue-500 p-2.5 rounded-lg w-[min(90%,250px)] cursor-pointer transition-all duration-300 hover:bg-blue-600">
                            Yes, I am available!
                        </div>
                        <div 
                            onClick={() => iamnotavailable()}
                            className="bg-blue-500 p-2.5 rounded-lg w-[min(90%,250px)] cursor-pointer transition-all duration-300 hover:bg-blue-600">
                            No, I am not available!
                        </div>
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default Home;