// CreateProposalForm.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // untuk ambil dari auth state
import axios from "axios";
import { Slider, InputNumber, Space, Select, message, Upload } from 'antd';
import { useParams } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { InboxOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ModernLayout from "../components/Layout";
const { Dragger } = Upload;

const CreateProposalForm = () => {
  const navigate = useNavigate();
  const { id: sponsorId } = useParams();
  const [proposalName, setProposalName] = useState("");
  const [file_proposal, setFileProposal] = useState(null);
  const [eventName, setEventName] = useState("");
  const [sponsor, setSponsor] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [targetAgeMin, setTargetAgeMin] = useState("");
  const [targetAgeMax, setTargetAgeMax] = useState("");
  const [targetGender, setTargetGender] = useState("");
  const [supportNeeded, setSupportNeeded] = useState("");
  const [message, setMessage] = useState("");
  const [sponsoree_id, setSponsoreeId] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [tagsDB, SetTagsDB] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagSponsor, setTagSponsor] = useState([]);
  const filteredTags = tagsDB.filter(o => !tags.includes(o));
  const [targetsDB, SetTargetsDB] = useState([]);
  const [targets, setTargets] = useState([]);
  const [targetSponsor, setTargetsSponsor] = useState([]);
  const filteredTargets = targetsDB.filter(o => !targets.includes(o));
  const [fileList, setFileList] = useState([]);
  const [targetMismatchWarningTarget, setTargetMismatchWarningTarget] = useState(false);
  const [targetMismatchWarningTag, setTargetMismatchWarningTag] = useState(false);
  const [targetMismatchWarningCategory, setTargetMismatchWarningCategory] = useState(false);
  const [mismatchedTargets, setMismatchedTargets] = useState([]);
  const [mismatchedTag, setMismatchedTag] = useState([]);
  const [category_provides, setCategoryProvides] = useState([]);
  const [mismatchedCategory, setMismatchedCategory] = useState([]);

  const { user } = useSelector((state) => state.auth);
  let username;
  if (user && user.username) {
    username = user.username
  }

  const sliderValue = [
    targetAgeMin !== "" ? Number(targetAgeMin) : 0,
    targetAgeMax !== "" ? Number(targetAgeMax) : 100
  ];

  const getUser = async () => {
    try {
      const response = await axios.get(`/api/user/${username}`);
      setSponsoreeId(response?.data?.user_sponsorees?.sponsoree_id)
    } catch (error) {
      console.log(error);
    }
  };

  const getSponsor = async () => {
    try {
      const response = await axios.get(`/api/sponsors/${sponsorId}`);
      setSponsor(response);
      setCategoryProvides(response.data.category_provides?.split(','))
      if (response.data.target_sponsors) {
        setTargetsSponsor(response.data.target_sponsors.map(item => item.target_participant_category));
      }
      if (response.data.tags_sponsors) {
        setTagSponsor(response.data.tags_sponsors.map(item => item.tag_name));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const categories = [
    { value: "Fund", label: "Fund" },
    { value: "Product", label: "Product" },
    { value: "Services", label: "Services" }
  ];

  useEffect(() => {
    const mismatches = targets?.filter(target => !targetSponsor.includes(target));
    setTargetMismatchWarningTarget(mismatches.length > 0);
    setMismatchedTargets(mismatches);
  }, [targets, targetSponsor]);

  useEffect(() => {
    const mismatches = tags?.filter(tag => !tagSponsor.includes(tag));
    setTargetMismatchWarningTag(mismatches.length > 0);
    setMismatchedTag(mismatches);
  }, [tags, tagSponsor]);

  useEffect(() => {
    if (category_provides) {
      const mismatches = supportNeeded?.values?.filter(support => !category_provides.includes(support));
      setTargetMismatchWarningCategory(mismatches?.length > 0);
      setMismatchedCategory(mismatches);
    }
  }, [supportNeeded, category_provides]);


  const getTags = async () => {
    try {
      const response = await axios.get("/api/tags");
      const tagNames = response.data.map(item => item.tag_name);
      SetTagsDB(tagNames);
    } catch (error) {
      console.log(error);
    }
  };

  const getTargets = async () => {
    try {
      const response = await axios.get("/api/targets");
      const targetCategory = response.data.map(item => item.target_participant_category);
      SetTargetsDB(targetCategory);
    } catch (error) {
      console.log(error);
    }
  };

  const props = {
    type: "file",
    name: "file_proposal",
    multiple: false,
    openFileDialogOnClick: true,
    beforeUpload: (file) => {
      // Validasi tipe file
      if (file.type !== "application/pdf") {
        Swal.fire({
          icon: "error",
          iconColor: "#dc2626", // merah untuk error
          title: "<strong>Oops...</strong>",
          html: `<p>Only PDF files are allowed.</p>`,
          background: "#fff",
          color: "#1f2937",
          showConfirmButton: true,
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            popup: 'rounded-2xl shadow-md px-6 py-4',
            title: 'text-xl font-semibold mb-2 text-red-600',
            htmlContainer: 'text-sm text-gray-700',
            confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5'
          }
        });
        return Upload.LIST_IGNORE;
      }
      // Validasi ukuran file
      if (file.size > 20 * 1024 * 1024) {
        Swal.fire({
          title: "<strong>Oops...</strong>",
          html: "<p>File must be smaller than 10MB.</p>",
          icon: "error",
          iconColor: "#dc2626", // warna merah (red-600)
          showCancelButton: false,
          confirmButtonText: "OK",
          background: "#fff",
          color: "#1f2937", // text-gray-800
          buttonsStyling: false,
          customClass: {
            popup: 'rounded-2xl shadow-md px-6 py-4',
            title: 'text-xl font-semibold mb-2',
            htmlContainer: 'text-sm text-gray-700',
            confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
          },
        });
        return Upload.LIST_IGNORE;
      }
      return false; // mencegah auto upload
    },
    onChange(info) {
      const file = info.file;
      const newFileList = info.fileList.slice(-1);
      setFileList(newFileList);
      if (file) {
        setFileProposal(file)
      }

      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    fileList,
  };

  useEffect(() => {
    getUser()
    getTags()
    getTargets()
    getSponsor()
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const tempSupport = supportNeeded.values;
      formData.append("proposal_name", proposalName);
      formData.append("file_proposal", "file");
      formData.append("event_name", eventName);
      formData.append("event_date", eventDate);
      formData.append("event_location", eventLocation);
      formData.append("target_age_min", targetAgeMin);
      formData.append("target_age_max", targetAgeMax);
      formData.append("target_gender", targetGender);
      formData.append("tags", JSON.stringify(tags));
      formData.append("target_participants", JSON.stringify(targets));
      formData.append("sponsor_id", sponsorId);
      formData.append("sponsoree_id", sponsoree_id);
      formData.append("file_proposal", file_proposal);
      formData.append("support_needed", tempSupport.join(','));

      await axios.post("/api/create-proposal", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      Swal.fire({
        title: "<strong>Proposal successfully created!</strong>",
        html: "<p>Your request has been successfully added</p>",
        icon: "success",
        iconColor: "#22c55e", // green-500
        showCancelButton: false,
        confirmButtonText: "OK",
        background: "#fff",
        color: "#1f2937", // text-gray-800
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-2xl shadow-md px-6 py-4',
          title: 'text-xl font-semibold mb-2',
          htmlContainer: 'text-sm text-gray-700',
          confirmButton: 'bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5',
        },
      });
      navigate(-1);
    } catch (error) {
      console.log(error)
      setFormErrors(error.response.data);
      if (error.response.data.msg) {
        Swal.fire({
          title: "<strong>Oops...</strong>",
          html: `<p>${error.response.data.msg}</p>`,
          icon: "error",
          iconColor: "#dc2626", // red-600
          showCancelButton: false,
          confirmButtonText: "OK",
          background: "#fff",
          color: "#1f2937",
          buttonsStyling: false,
          customClass: {
            popup: 'rounded-2xl shadow-md px-6 py-4',
            title: 'text-xl font-semibold mb-2',
            htmlContainer: 'text-sm text-gray-700',
            confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
          },
        });
      } else if (error.response.data.sponsoree_id) {
        Swal.fire({
          title: "<strong>Oops...</strong>",
          html: `<p>${error.response.data.sponsoree_id}</p>`,
          icon: "error",
          iconColor: "#dc2626", // red-600
          showCancelButton: false,
          confirmButtonText: "OK",
          background: "#fff",
          color: "#1f2937",
          buttonsStyling: false,
          customClass: {
            popup: 'rounded-2xl shadow-md px-6 py-4',
            title: 'text-xl font-semibold mb-2',
            htmlContainer: 'text-sm text-gray-700',
            confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
          },
        });
      } else if (error.response.data.sponsor_id) {
        Swal.fire({
          title: "<strong>Oops...</strong>",
          html: `<p>${error.response.data.sponsor_id}</p>`,
          icon: "error",
          iconColor: "#dc2626", // red-600
          showCancelButton: false,
          confirmButtonText: "OK",
          background: "#fff",
          color: "#1f2937",
          buttonsStyling: false,
          customClass: {
            popup: 'rounded-2xl shadow-md px-6 py-4',
            title: 'text-xl font-semibold mb-2',
            htmlContainer: 'text-sm text-gray-700',
            confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
          },
        });
      }
    }
  };

  return (
    <ModernLayout>
      {user && user.role === "Sponsoree" && (
        <div className="min-h-screen p-6 bg-white text-black">
          <div className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Submit Proposal</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-base font-medium text-gray-900">Proposal Title<span className="text-sm text-red-500 ml-1">*</span></label>
                <input type="text" name="proposalName" placeholder="Proposal Title" value={proposalName} onChange={(e) => setProposalName(e.target.value)} className="w-full p-3 border rounded-xl" />
                <div className="flex flex-col mt-2">
                  <span className="text-sm text-gray-500">{proposalName.length} characters</span>
                  <span className="text-sm text-red-800">{formErrors.proposal_name}</span>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-base font-medium text-gray-900">Event Name<span className="text-sm text-red-500 ml-1">*</span></label>
                <input type="text" name="eventName" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} className="w-full p-3 border rounded-xl" />
                <span className="text-sm text-red-800 mt-2 block">{formErrors.event_name}</span>
              </div>

              <div>
                <label className="block mb-2 text-base font-medium text-gray-900">Event Date<span className="text-sm text-red-500 ml-1">*</span></label>
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50" />
                <span className="text-sm text-red-800 mt-2 block">{formErrors.event_date}</span>
              </div>

              <div>
                <label className="block mb-2 text-base font-medium text-gray-900">Event Location<span className="text-sm text-red-500 ml-1">*</span></label>
                <input type="text" name="eventLocation" placeholder="Event Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} className="w-full p-3 border rounded-xl" />
                <span className="text-sm text-red-800 mt-2 block">{formErrors.event_location}</span>
              </div>

              <div>
                <label className="block mb-2 text-base font-medium text-gray-900">Scope Age Participant<span className="text-sm text-red-500 ml-1">*</span></label>
                <Slider range min={0} max={100} value={sliderValue} onChange={(value) => { setTargetAgeMin(value[0]); setTargetAgeMax(value[1]); }} />
                <div className="flex items-center gap-2 mt-3">
                  <InputNumber min={0} max={100} value={targetAgeMin} onChange={(value) => setTargetAgeMin(value)} placeholder="Min Age" />
                  <span>-</span>
                  <InputNumber min={0} max={100} value={targetAgeMax} onChange={(value) => setTargetAgeMax(value)} placeholder="Max Age" />
                </div>
                <div className="mt-2 text-sm">Usia: {targetAgeMin || 0} - {targetAgeMax || 100} tahun</div>
                <span className="text-sm text-red-800 mt-2 block">{formErrors.target_age}</span>
              </div>

              <div>
                <label className="block mb-2 text-base font-medium text-gray-900">Target Gender<span className="text-sm text-red-500 ml-1">*</span></label>
                <div className="relative">
                  <select name="targetGender" value={targetGender} onChange={(e) => setTargetGender(e.target.value)} className="w-full appearance-none p-3 pr-10 border rounded-xl bg-white text-base">
                    <option value="">Select Gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="All">All</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <span className="text-sm text-red-800 mt-2 block">{formErrors.target_gender}</span>
              </div>

              <div>
                <label className="block mb-2 text-base font-medium text-gray-900">
                  Target Participant<span className="text-sm text-red-500 ml-1">*</span>
                </label>
                <Select
                  mode="multiple"
                  name="targets"
                  placeholder="Search here"
                  value={targets}
                  className="w-full p-3 pr-10 border rounded-xl bg-white text-base"
                  onChange={(e) => setTargets(e)}
                  options={filteredTargets.map(item => ({ value: item, label: item }))}
                />
                <span className="text-sm text-red-800 mt-2 block">
                  {formErrors.target_participants}
                </span>
                {targetMismatchWarningTarget && (
                  <span className="text-sm text-yellow-600 mt-2 block">
                    ⚠ Beberapa target participant yang dipilih tidak termasuk dalam preferensi sponsor.
                  </span>
                )}
                {targetMismatchWarningTarget && (
                  <div className="text-sm text-yellow-600 mt-2">
                    ⚠ Target participant berikut tidak termasuk dalam preferensi sponsor:
                    <ul className="list-disc ml-6 mt-1">
                      {mismatchedTargets.map((target, index) => (
                        <li key={index}>{target}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2 text-base font-medium text-gray-900">Tags Related Event<span className="text-sm text-red-500 ml-1">*</span></label>
                <Select mode="multiple" name="tags" placeholder="Search here" value={tags} className="w-full p-3 pr-10 border rounded-xl bg-white text-base" onChange={(e) => setTags(e)} options={filteredTags.map(item => ({ value: item, label: item }))} />
                <span className="text-sm text-red-800 mt-2 block">
                  {formErrors.tags}
                </span>
                {targetMismatchWarningTag && (
                  <span className="text-sm text-yellow-600 mt-2 block">
                    ⚠ Beberapa tag related yang dipilih tidak termasuk dalam preferensi sponsor.
                  </span>
                )}
                {targetMismatchWarningTag && (
                  <div className="text-sm text-yellow-600 mt-2">
                    ⚠ Tag related berikut tidak termasuk dalam preferensi sponsor:
                    <ul className="list-disc ml-6 mt-1">
                      {mismatchedTargets.map((target, index) => (
                        <li key={index}>{target}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2 text-base font-medium text-gray-900">Support Needed<span className="text-sm text-red-500 ml-1">*</span></label>
                <Select
                  mode="multiple"
                  name="support_needed"
                  placeholder="Search here"
                  value={supportNeeded.values}
                  className="w-full p-3 pr-10 border rounded-xl bg-white text-base"
                  onChange={(values) =>
                    setSupportNeeded({
                      ...supportNeeded,
                      values,
                    })
                  }
                  options={categories}
                />
                <span className="text-sm text-red-800 mt-2 block">
                  {formErrors.support_needed}
                </span>
                {targetMismatchWarningCategory && (
                  <span className="text-sm text-yellow-600 mt-2 block">
                    ⚠ Beberapa support needed yang dipilih tidak termasuk dalam preferensi sponsor.
                  </span>
                )}
                {targetMismatchWarningCategory && (
                  <div className="text-sm text-yellow-600 mt-2">
                    ⚠ Support needed berikut tidak termasuk dalam preferensi sponsor:
                    <ul className="list-disc ml-6 mt-1">
                      {mismatchedCategory.map((target, index) => (
                        <li key={index}>{target}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2 text-base font-medium text-gray-900">Proposal File<span className="text-sm text-red-500 ml-1">*</span></label>
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">Only Accept PDF File and Accept Size Max (20 Mb)</p>
                </Dragger>
                <span className="text-sm text-red-800 mt-2 block">{formErrors.file_proposal}</span>
              </div>

              <div className="flex justify-center pt-8">
                <button type="submit" className="w-1/2 bg-primary text-white py-3 rounded-xl hover:opacity-90">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ModernLayout>
  );
};

export default CreateProposalForm;