import React from 'react';
import { Link } from 'react-router-dom';
import { FaMailBulk, FaPhoneAlt, FaHospital } from 'react-icons/fa';
import team from '../data/teamData';

const AboutUs = () => {
  return (
    <div className="w-full">
      {/* Introduction Section */}
      <section className="bg-[#f4f7fb] shadow-md py-12 px-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-10">
          <div className="max-w-[50%]">
            <h2 className="text-4xl text-gray-800 mb-5">Welcome to Remote_Remedy</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-5">
              Remote_Remedy is an innovative platform designed to bridge the gap between healthcare professionals and patients. Our website connects users with doctors, provides access to medications, and offers predictive health tools, all in one place.
            </p>
            <Link 
              to="/learn-more" 
              className="inline-block px-5 py-2.5 bg-blue-600 text-white text-lg rounded hover:bg-blue-700 transition-colors duration-300"
            >
              Learn More
            </Link>
          </div>

          <div className="w-[45%] h-[300px] perspective-[1000px]">
            <div className="relative w-full h-full transform-style-3d transition-transform duration-800 group">
              <img
                className="absolute w-full h-full object-cover rounded-lg backface-hidden"
                src="https://static.vecteezy.com/system/resources/previews/000/570/610/original/medical-concept-doctor-with-woman-patient-in-flat-cartoon-on-hospital-hall-vector.jpg"
                alt="Introduction"
              />
              <img
                className="absolute w-full h-full object-cover rounded-lg backface-hidden rotate-y-180 group-hover:rotate-y-180"
                src="https://static.vecteezy.com/system/resources/previews/000/656/917/original/vector-set-of-doctor-cartoon-characters-medical-staff-team-concept-in-front-of-hospital.jpg"
                alt="Back Side"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Motive Section */}
      <section className="bg-[#f4f7fb] shadow-md py-12 px-5 mb-12">
        <div className="max-w-7xl mx-auto flex items-center gap-10 animate-fadeIn">
          <div className="w-1/2 h-[350px] overflow-hidden rounded-lg shadow-md group">
            <img
              className="w-full h-full object-cover rounded-lg transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-6 group-hover:brightness-85"
              src="https://static.wixstatic.com/media/43ab93_b9a8144ece8746659201ed42c89542fb~mv2.png/v1/crop/x_1068,y_115,w_1248,h_753/fill/w_828,h_500,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/medical%20missions.png"
              alt="Motive Image"
            />
          </div>

          <div className="w-1/2 max-w-lg animate-fadeInLeft">
            <h3 className="text-3xl text-gray-800 mb-5">Our Mission: Helping You Stay Healthy, Especially in Times of Crisis</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              During global health crises like the COVID-19 pandemic, it is more important than ever to have reliable access to healthcare information and services. Remote_Remedy helps users by providing telemedicine consultations, disease prediction tools, and a variety of resources to manage health remotely, keeping you safe at home while ensuring you receive the care you need.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-10 text-center">
        <div className="space-y-2 mb-8">
          <h3 className="text-3xl text-gray-800">Meet Our Team</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-5">
          {team.map((member) => (
            <div 
              key={member.id} 
              className="bg-white rounded-lg shadow-md p-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="w-[150px] h-[150px] mx-auto rounded-full overflow-hidden">
                <img 
                  src={member.imgSrc} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-2xl text-gray-800 mt-2.5">{member.name}</h4>
              <p className="text-gray-600 mt-1"><strong>{member.specialty}</strong></p>
              <div className="flex justify-center gap-4 mt-4">
                {member.contact.map((contact, index) => {
                  const IconComponent = {
                    IoMdMail: FaMailBulk,
                    FaPhoneAlt: FaPhoneAlt,
                    FaHospital: FaHospital
                  }[contact.icon];

                  return IconComponent ? (
                    <IconComponent
                      key={index}
                      className="text-xl text-blue-600 hover:text-blue-700 transition-colors duration-300"
                    />
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;