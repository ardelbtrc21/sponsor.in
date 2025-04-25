// CreateProposalForm.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux"; // untuk ambil dari auth state
import axios from "axios";
import { useParams } from "react-router-dom";

const CreateProposalForm = () => {
  const { id: sponsorId } = useParams();
  const [proposalName, setProposalName] = useState("");
  const [fileProposal, setFileProposal] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [targetAgeMin, setTargetAgeMin] = useState("");
  const [targetAgeMax, setTargetAgeMax] = useState("");
  const [targetGender, setTargetGender] = useState("");
  const [message, setMessage] = useState("");


  const { user } = useSelector((state) => state.auth); 
  let username;
  let sponsoree_id;
  if(user && user.username){
    username = user.username
  }
  const getUser= async () =>{
    try {
      sponsoree_id = await axios.get(`http://localhost:5000/api/user/${username}`);

    } catch (error) {
        console.log(error);
    }
  };
  console.log("user : " + user)
  // const detailUser = axios.get(`http://localhost:5000/api/user/${username}`)
  // console.log("detail user: " + detailUser)
  // const sponsoreeId = detailUser.data.sponsoree_id
  console.log("sponsoree id: " + sponsoree_id)
  console.log("sponsor id: " + sponsorId);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("proposal_name", proposalName);
      formData.append("file_proposal", "file");
      formData.append("event_name", eventName);
      formData.append("event_date", eventDate);
      formData.append("event_location", eventLocation);
      formData.append("target_age_min", targetAgeMin);
      formData.append("target_age_max", targetAgeMax);
      formData.append("target_gender", targetGender);
      formData.append("sponsor_id", sponsorId);
      // formData.append("sponsoree_id", sponsoreeId);

      await axios.post("http://localhost:5000/api/create-proposal", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setMessage("Proposal created successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Error creating proposal.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-xl bg-white shadow-md">
      <input type="text" placeholder="Proposal Name" value={proposalName} onChange={(e) => setProposalName(e.target.value)} className="w-full p-2 border rounded" required />

      <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFileProposal(e.target.files[0])} className="w-full p-2 border rounded" required />

      <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} className="w-full p-2 border rounded" required />

      <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full p-2 border rounded" required />

      <input type="text" placeholder="Event Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} className="w-full p-2 border rounded" required />

      <input type="number" placeholder="Target Age Min" value={targetAgeMin} onChange={(e) => setTargetAgeMin(e.target.value)} className="w-full p-2 border rounded" required />

      <input type="number" placeholder="Target Age Max" value={targetAgeMax} onChange={(e) => setTargetAgeMax(e.target.value)} className="w-full p-2 border rounded" required />

      <select value={targetGender} onChange={(e) => setTargetGender(e.target.value)} className="w-full p-2 border rounded" required>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="all">All</option>
      </select>

      <button type="submit" className="bg-primary text-white p-2 rounded w-full">Submit Proposal</button>

      {message && <p className="text-center text-sm mt-2 text-gray-700">{message}</p>}
    </form>
  );
};

export default CreateProposalForm;