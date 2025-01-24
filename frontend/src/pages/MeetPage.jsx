import { JaaSMeeting } from "@jitsi/react-sdk";
import React, { useRef, useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { TbTrash } from 'react-icons/tb';
import { MdContentCopy } from 'react-icons/md';
import { Alert } from "@mui/material";
import useDocTitle from "../hooks/useDocTitle";
import commonContext from "../contexts/common/commonContext";
import httpClient from "../httpClient";
import PDFGenerator from "../components/pdfgenerator/PDFGenerator";

const MeetPage = () => {

  const navigate = useNavigate(); 
  const userNotExists = localStorage.getItem("usertype")===undefined || localStorage.getItem("usertype")===null;

  useEffect(() => {
      if(userNotExists) {
          navigate("/");
      }
      //eslint-disable-next-line
  }, []);

  const apiRef = useRef(); 
  //eslint-disable-next-line
  const [logItems, updateLog] = useState([]);
  const [knockingParticipants, updateKnockingParticipants] = useState([]);
  const [searchparams] = useSearchParams();
  const meetId = searchparams.get("meetId");

  const { toggleFeedback } = useContext(commonContext);

  const isDoctor = localStorage.getItem("usertype")==="doctor";
  const email = searchparams.get("pemail");
  const phone = localStorage.getItem("phone");
  const [prescription, setPrescription] = useState([]);
  const [newPrescription, setNewPrescription] = useState({name: "", dosage: "", duration: "", durationUnit: "day(s)", dosageTime: "Before Food"});
  const [copyAlert, setCopyAlert] = useState(false);
  const [isInvName, setInvName] = useState(false);
  const [isInvDosage, setInvDosage] = useState(false);
  const [isInvDuration, setInvDuration] = useState(false);

  const [sendingMsg, setSendingMsg] = useState("Send");
  const [isMeetEnded, setMeetEnded] = useState(false);

  const JaasAppId = import.meta.env.VITE_JAAS_APP_ID;

  useDocTitle("Meet");

  useEffect(() => {
    // console.log(searchparams.get("name"))
      localStorage.setItem("lastMeetWith", searchparams.get("selectedDoc"));
      localStorage.setItem("lastMeetMail", searchparams.get("selectedMail"));
    //eslint-disable-next-line
  }, []);

  const printEventOutput = (payload) => {
    updateLog((items) => [...items, JSON.stringify(payload)]);
  };

  const handleAudioStatusChange = (payload, feature) => {
    if (payload.muted) {
      updateLog((items) => [...items, `${feature} off`]);
    } else {
      updateLog((items) => [...items, `${feature} on`]);
    }
  };

  const handleChatUpdates = (payload) => {
    if (payload.isOpen || !payload.unreadCount) {
      return;
    }
    apiRef.current.executeCommand("toggleChat");
    updateLog((items) => [
      ...items,
      `you have ${payload.unreadCount} unread messages`,
    ]);
  };

  const handleKnockingParticipant = (payload) => {
    updateLog((items) => [...items, JSON.stringify(payload)]);
    updateKnockingParticipants((participants) => [
      ...participants,
      payload?.participant,
    ]);
  };

  const resolveKnockingParticipants = (condition) => {
    knockingParticipants.forEach((participant) => {
      apiRef.current.executeCommand(
        "answerKnockingParticipant",
        participant?.id,
        condition(participant)
      );
      updateKnockingParticipants((participants) =>
        participants.filter((item) => item.id === participant.id)
      );
    });
  };

  const handleJitsiIFrameRef1 = (iframeRef) => {
    iframeRef.style.border = "10px solid #2d2d2d";
    iframeRef.style.background = "#2d2d2d";
    iframeRef.style.width = "100%";
    iframeRef.style.height = "100%";
    iframeRef.style.position = "absolute";
    iframeRef.style.top = "0";
    iframeRef.style.left = "0";
    iframeRef.style.margin = "0";
  };


  const handleApiReady = (apiObj) => {
    apiRef.current = apiObj;
    apiRef.current.on("knockingParticipant", handleKnockingParticipant);
    apiRef.current.on("audioMuteStatusChanged", (payload) =>
      handleAudioStatusChange(payload, "audio")
    );
    apiRef.current.on("videoMuteStatusChanged", (payload) =>
      handleAudioStatusChange(payload, "video")
    );
    apiRef.current.on("raiseHandUpdated", printEventOutput);
    apiRef.current.on("titleViewChanged", printEventOutput);
    apiRef.current.on("chatUpdated", handleChatUpdates);
    apiRef.current.on("knockingParticipant", handleKnockingParticipant);
  };

  const handleReadyToClose = () => {
    console.log("Ready to close...");
  };

  const handleEndMeeting = () => {
    toggleFeedback(true);
    httpClient.put('/delete_meet', { email: searchparams.get("selectedMail")} )
    .then((res) => {
      navigate("/Home");
    }).catch((err) => {
      console.log(err);
    });
  };
  
  const handleDocEndMeeting = () => {
    toggleFeedback(true);
    setMeetEnded(true);
    httpClient.put('/delete_meet', { email: searchparams.get("selectedMail")} );
    httpClient.post('/debit_wallet', { email: searchparams.get("pemail"), demail: searchparams.get("selectedMail") })
    httpClient.post('/add_wallet_history', { email: searchparams.get("pemail"),
    history: {desc: "Doctor Fee", amount: searchparams.get('fee'), date: new Date().toLocaleDateString(), add: false}
  })
  };

  const renderSpinner = () => (
    <div
      style={{
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      Loading..
    </div>
  );

  const deletePrescriptionItem = (ind) => {
    setPrescription(prescription.filter(( _ ,index) => index!==ind));
  }

  const addPrescriptionItem = () => {
    const newP = `${newPrescription.name} | ${newPrescription.dosage} (${newPrescription.dosageTime}) | ${newPrescription.duration} ${newPrescription.durationUnit}`;
    setPrescription([...prescription, newP]);
    setNewPrescription({name: "", dosage: "", duration: "", durationUnit: "day(s)", dosageTime: "Before Food"});
  }

  const handleFormSubmit = () => {
    const pdf = PDFGenerator({
      name: searchparams.get("name")? searchparams.get("name") : "Mr. ABC DEF",
      age: searchparams.get("age")? searchparams.get("age") : "NA",
      gender: searchparams.get("gender")? searchparams.get("gender")[0].toUpperCase() + searchparams.get("gender").slice(1).toLowerCase() : "NA",
      selectedDoc: searchparams.get("selectedDoc")? searchparams.get("selectedDoc") : "Doctor_Name"
    }, prescription);
    setSendingMsg("Sending...");
    var file = pdf.output('blob');
    let bodyContent = new FormData();
    bodyContent.append("email", email);
    bodyContent.append("file", file);
    httpClient.post("mail_file", bodyContent , {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => {
      console.log(res);
      setSendingMsg("Sent");
      setTimeout(() => {
        setSendingMsg("Send");
      }, 3000);
      httpClient.put('/delete_meet', { "email": searchparams.get("selectedMail") })
      navigate("/home");
    }).catch((err) => {
      console.log(err);
    });
    
    setPrescription([]);
    setNewPrescription({name: "", dosage: "", duration: "", durationUnit: "day(s)", dosageTime: "Before Food"});
  };

  const handleDownload = () => {
    const pdf = PDFGenerator({
      name: searchparams.get("name")? searchparams.get("name") : "Mr. ABC DEF",
      age: searchparams.get("age")? searchparams.get("age") : "NA",
      gender: searchparams.get("gender")? searchparams.get("gender")[0].toUpperCase() + searchparams.get("gender").slice(1).toLowerCase() : "NA",
      selectedDoc: searchparams.get("selectedDoc")? searchparams.get("selectedDoc") : "Doctor_Name"
    }, prescription);
    pdf.save("Remote_Remedy-Invoice.pdf");

  }

  if(userNotExists) {
    return <></>;
  }
  return (
    <div className="p-4 md:p-6 lg:p-8 text-black">
    {!isMeetEnded && (
      <div className="max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Live Meet</h2>
        <div className="flex items-center justify-center gap-4 mb-6">
          <span 
            className="cursor-pointer hover:text-gray-600 relative transition-colors duration-300"
            onClick={() => {
              setCopyAlert(true);
              navigator.clipboard.writeText(`https://8x8.vc/${JaasAppId}/${meetId}`);
              setTimeout(() => setCopyAlert(false), 2000);
            }}
          >
            <MdContentCopy size={20} />
            {copyAlert && (
              <div className="absolute -top-5 -right-10">
                <Alert severity="success">Copied</Alert>
              </div>
            )}
          </span>
        </div>
      </div>


      <div className="relative w-full" style={{ paddingTop: "75%" }}>
       <div className="absolute inset-0">
          <JaaSMeeting
            appId={JaasAppId}
            roomName={meetId}
            spinner={renderSpinner}
            configOverwrite={{
              subject: "Video Call",
              hideConferenceSubject: true,
              startWithAudioMuted: true,
              disableModeratorIndicator: true,
              startScreenSharing: false,
              enableEmailInStats: false,
              enableClosePage: false,
              toolbarButtons: [
                'camera',
                'fullscreen',
                'chat',
                'microphone',
                'hangup',
                'highlight',
                'participants-pane',
                'settings',
                'toggle-camera'
              ]
            }}
            onApiReady={handleApiReady}
            onReadyToClose={isDoctor ? handleDocEndMeeting : handleEndMeeting}
            getIFrameRef={handleJitsiIFrameRef1}
            interfaceConfigOverwrite={{
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
              SHOW_PROMOTIONAL_CLOSE_PAGE: false,
              SHOW_JITSI_WATERMARK: false
            }}
            userInfo={{
              displayName: isDoctor ? searchparams.get("selectedDoc") : searchparams.get("name")
            }}
          />
          </div>
          </div>
        </div>

    )}

    {isDoctor && (
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Prescription</h2>

        {prescription.length > 0 && (
          <div className="flex flex-wrap justify-start items-center mx-auto mb-8 border-2 border-blue-500 p-4 rounded-lg md:p-0 md:w-[90vw]">
            {prescription.map((item, index) => (
              <div key={index} 
                className="m-4 p-4 flex justify-around items-center bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-300"
              >
                <div className="relative">
                  <p className="whitespace-nowrap text-ellipsis overflow-hidden max-w-[800px] md:whitespace-normal md:overflow-visible">
                    {item}
                  </p>
                </div>
                <div className="ml-4 cursor-pointer hover:text-red-500 relative group">
                  <span onClick={() => deletePrescriptionItem(index)}>
                    <TbTrash />
                  </span>
                  <div className="invisible group-hover:visible absolute top-full left-1/2 transform -translate-x-1/2 text-sm">
                    Remove Item
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center justify-center mt-4">
          <div className="w-[500px] max-w-[95vw]">
            <div className="w-full mb-4">
              <input
                type="text"
                className="w-full text-center bg-white border border-gray-400 text-gray-800 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md p-2"
                value={newPrescription.name}
                onChange={(e) => {
                  setInvName(prescription.filter(item => item.split(" | ")[0].toLowerCase() === e.target.value.toLowerCase()).length > 0);
                  setNewPrescription({ ...newPrescription, name: e.target.value });
                }}
                placeholder="Medicine Name"
              />
            </div>

            <div className="flex flex-wrap justify-center items-center mb-4 w-full">
              <div className="flex flex-wrap justify-center items-center mb-4 w-full">
                <input
                  type="text"
                  className="w-[250px] max-w-[95vw] mx-2 my-1 text-center bg-white border border-gray-400 text-gray-800 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md p-2"
                  value={newPrescription.dosage}
                  onChange={(e) => {
                    setInvDosage(!(/^[0-5]-[0-5]-[0-5]$/.test(e.target.value)));
                    setNewPrescription({ ...newPrescription, dosage: e.target.value });
                  }}
                  placeholder="Dosage i.e. 1-0-0"
                />
                <select
                  value={newPrescription.dosageTime}
                  onChange={(e) => setNewPrescription({ ...newPrescription, dosageTime: e.target.value })}
                  className="w-[200px] max-w-[95vw] p-2 border border-gray-400 text-gray-800 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md text-center font-montserrat"
                >
                  <option value="Before Food">Before Food</option>
                  <option value="After Food">After Food</option>
                </select>
              </div>

              <div className="flex flex-wrap justify-center items-center mb-4 w-full">
                <input
                  type="text"
                  className="w-[250px] max-w-[95vw] mx-2 my-1 text-center bg-white border border-gray-400 text-gray-800 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md p-2"
                  value={newPrescription.duration}
                  onChange={(e) => {
                    setInvDuration(!(/^[0-9]{1,9}$/.test(e.target.value)) || (Number(e.target.value) === 0));
                    setNewPrescription({ ...newPrescription, duration: e.target.value });
                  }}
                  placeholder="Duration"
                />
                <select
                  value={newPrescription.durationUnit}
                  onChange={(e) => setNewPrescription({ ...newPrescription, durationUnit: e.target.value })}
                  className="w-[200px] max-w-[95vw] p-2 border border-gray-400 text-gray-800 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md text-center font-montserrat"
                >
                  <option value="day(s)">day(s)</option>
                  <option value="month(s)">month(s)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-[300px] max-w-[90vw]">
            <button
              onClick={addPrescriptionItem}
              disabled={(newPrescription.name.length === 0) || newPrescription.dosage === "" || newPrescription.duration === "" || isInvName || isInvDosage || isInvDuration}
              className="w-full py-2 px-4 rounded bg-gray-600 text-white transition-colors duration-300 hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-blue-700"
            >
              Add
            </button>
            {isInvName && <Alert severity="error">Medicine Name already exists</Alert>}
            {isInvDosage && <Alert severity="error">Dosage should be in the form of n-n-n and between 0-5</Alert>}
            {isInvDuration && <Alert severity="error">Invalid Duration</Alert>}
          </div>

          <div className="mt-8 flex justify-center items-center flex-wrap">
            <button
              onClick={handleFormSubmit}
              className="py-2 px-4 ml-4 rounded bg-gray-800 text-white transition-colors duration-300 hover:bg-gray-900 shadow-lg shadow-gray-500"
            >
              {sendingMsg}
            </button>
            <button
              onClick={handleDownload}
              className="py-2 px-4 ml-4 rounded bg-gray-800 text-white transition-colors duration-300 hover:bg-gray-900 shadow-lg shadow-gray-500"
            >
              Download
            </button>
          </div>

          <div className="mt-5">
            Note: Please ensure that you covered the prescription correctly before clicking the 'send' button.
            As the page will redirect to the home page.
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default MeetPage;