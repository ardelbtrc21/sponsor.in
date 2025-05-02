// CreateProposalForm.jsx
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux"; // untuk ambil dari auth state
import axios from "axios";
import { DatePicker, Modal, Select, Space } from "antd";
import { useParams } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ModernLayout from "../components/Layout";
import { Menu, Transition } from "@headlessui/react";

const ListApprovalProposal = () => {
  const navigate = useNavigate();
  const { id: sponsorId } = useParams();
  const { RangePicker } = DatePicker;
  const [proposals, setProposals] = useState([]);
  const [proposalName, setProposalName] = useState("");
  const [file_proposal, setFileProposal] = useState(null);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [targetAgeMin, setTargetAgeMin] = useState("");
  const [targetAgeMax, setTargetAgeMax] = useState("");
  const [targetGender, setTargetGender] = useState("");
  const [message, setMessage] = useState("");
  const [sponsoree_id, setSponsoreeId] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [tagRelated, setTagRelated] = useState([]);
  const [targetParticipant, setTargetParticipant] = useState([]);
  const [status, setStatus] = useState([]);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  //pagination
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);

  //filter tanggal dan kategori
  // const [openFilterModal, setOpenFilterModal] = useState(false);
  // const [confirmLoading, setConfirmLoading] = useState(false);
  // const [filterEventDate, setFilterEventDate] = useState("");
  // const [filterEventLocation, setFilterEventLocation] = useState([]);
  // const [filterTargetAgeMin, setFilterTargetAgeMin] = useState([]);
  // const [filterTargetAgeMax, setFilterTargetAgeMax] = useState([]);
  // const [filterTargetGender, setFilterTargetGender] = useState([]);
  // const [filterTagRelated, setFilterTagRelated] = useState([]);
  // const [filterTargetParticipant, setFilterTargetParticipant] = useState("");
  // const [filterStatus, setFilterStatus] = useState("");

  //urutan tabel
  const [sortBy, setSortBy] = useState("status");
  const [flagOrder, setFlagOrder] = useState(1);
  const [order, setOrder] = useState("DESC");

  //searching
  const [keyword, setKeyword] = useState("");

  const { user } = useSelector((state) => state.auth);
  let username;
  if (user && user.username) {
    username = user.username
  }

  const getProposals = async () => {
    try {
      // const response = await axios.get(`/api/changes?sortBy=${sortBy}&order=${order}&keyword=${keyword}&page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&filter=${filterCategory}`);
      const response = await axios.post("/api/proposals", {
        sortBy: sortBy,
        order: order,
        keyword: keyword,
        page: page,
        limit: limit,
        filter: {
          eventDate: eventDate,
          eventLocation: eventLocation,
          targetAgeMin: targetAgeMin,
          targetAgeMax: targetAgeMax,
          targetGender: targetGender,
          tagRelated: tagRelated,
          targetParticipant: targetParticipant,
          status: status
        }

      });
      setProposals(response.data.result);
      setPages(response.data.totalPage);
      setRows(response.data.totalRows);
    } catch (error) {
      navigate("/dashboard");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.msg,
      });
    }
  };

  const proposalPage = ({ selected }) => {
    setPage(selected);
  };

  //pagination limit
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOkFilterModal = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpenFilterModal(false);
      setConfirmLoading(false);
    }, 0);
  };

  const handleCancelModal = () => {
    setOpenFilterModal(false);
  };

  return (
    <ModernLayout>
      <div>
        <Modal
          okButtonProps={{ style: { backgroundColor: "#0369a1" } }}
          cancelButtonProps={{ style: { display: "none" } }}
          okText="OK"
          cancelText="Cancel"
          title="Filter"
          open={openFilterModal}
          onOk={handleOkFilterModal}
          confirmLoading={confirmLoading}
          onCancel={handleCancelModal}
          style={{ top: 50 }}
        >
          <div >
            <div>
              <label className="block mb-2 text-base text-gray-900">Event Date</label>
              <Space direction="vertical" size={12} class="width-[100%] mb-5">
                <RangePicker
                  style={{
                    width: "100%",
                  }}
                  onChange={(values) => {
                    if (values) {
                      setStartDate(dayjs(values[0].hour(0).minute(0).second(0).millisecond(0)) ?? "");
                      setEndDate(dayjs(values[1].hour(23).minute(59).second(0).millisecond(0)) ?? "");
                    } else {
                      setStartDate("");
                      setEndDate("");
                    }
                  }}
                  format="DD MMMM YYYY"
                  value={[startDate, endDate]}
                  disabledDate={(current) => {
                    return current >= dayjs(new Date());
                  }}
                />
              </Space>
            </div>
            <div className="mt-6">
              <label className="block mb-2 text-base text-gray-900">Change Requirement</label>
              <Space direction="vertical" size={12} class="width-[100%] mb-5" >
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Please select category"
                  onChange={setFilterRequirement}
                  options={[{ "label": "Apps/Systems Requirement", "value": "Apps/Systems Requirement" }, { "label": "Exception", "value": "Exception" }, { "label": "Uncategorized", "value": "Uncategorized" }]}
                />
              </Space>
            </div>
            <div>
              <label className="block mb-2 text-base text-gray-900">Change Category</label>
              <Space direction="vertical" size={12} class="width-[100%] mb-5" >
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Please select category"
                  onChange={setFilterCategory}
                  options={changeCategory && changeCategory.map(x => ({ label: x.value, value: x.id_category }))}
                />
              </Space>
            </div>
            <div>
              <label className="block mb-2 text-base text-gray-900">Status</label>
              <Space direction="vertical" size={12} class="width-[100%] mb-10" >
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Please select Status"
                  onChange={(e) => setFilterStatus(e)}
                  options={[{
                    label: "Requested",
                    value: "Requested"
                  }, {
                    label: "Reschedule",
                    value: "Reschedule"
                  }, {
                    label: "Waiting for resolution",
                    value: "Waiting for resolution"
                  }, {
                    label: "Completed",
                    value: "Completed"
                  }]}
                />
              </Space>
            </div>
          </div>
        </Modal>
        <div className="font-bold mb-4 mt-2 flex justify-between items-center ">
          <div className="text-sm font-normal">
            <Menu as="div" className="relative inline-block text-left mr-4">
              <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-2 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  Limit : {limit}
                  <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >

                <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a onClick={() => { setLimit(10); setPage(0); }} className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "cursor-pointer block px-4 py-2 text-sm")}>10</a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a onClick={() => { setLimit(50); setPage(0); }} className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "cursor-pointer block px-4 py-2 text-sm")}>50</a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a onClick={() => { setLimit(100); setPage(0); }} className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "cursor-pointer block px-4 py-2 text-sm")}>100</a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a onClick={() => { setLimit(250); setPage(0); }} className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "cursor-pointer block px-4 py-2 text-sm")}>250</a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a onClick={() => { setLimit(1000); setPage(0); }} className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "cursor-pointer block px-4 py-2 text-sm")}>1000</a>
                      )}
                    </Menu.Item>

                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {sortBy === "" ? "" : "Sort by = " + sortBy + " (" + order + ")"}
          </div>
          <div className="flex w-[32rem] justify-end items-center">
            <Link to="/change/add">
              <button className="flex bg-sky-600 text-white rounded px-2 py-1 hover:bg-sky-700 ">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-5 mr-1 m-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="font-normal text-sm">
                  Add Change
                </div>
              </button>
            </Link>

            {/* searching */}
            <div className="relative ml-5 w-3/5">
              <input type="search" value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(0); }} className="font-normal w-full h-[40px] focus:outline-none p-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300" placeholder="Search" />
              <div className="absolute top-0 right-0 p-2.5 text-sm text-white bg-sky-700 rounded-r-lg">
                <svg className="w-4 h-5" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <span className="sr-only">Search</span>
              </div>
            </div>

            <div>
              <button onClick={() => setOpenFilterModal(true)} className="ml-1 max-h-10 text-white rounded px-1 py-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-sky-600 hover:text-sky-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
              </button>
            </div>

          </div>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="table w-full text-sm text-left text-gray-500 table-auto">
            <div className="table-row text-center text-xs text-gray-700 bg-gray-50 font-bold">
              <div scope="col" className="table-cell px-6 py-3">
                <button onClick={() => { setSortBy("title"); handleFlagOrder(); }} className="flex hover:text-blue-700 items-center">
                  Title
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="ml-1 w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </button>
              </div>
              <div scope="col" className="table-cell px-6 py-3 m-auto">
                <button onClick={() => { setSortBy("change_reference"); handleFlagOrder(); }} className="flex hover:text-blue-700 items-center m-auto text-center">
                  Change Reference
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="ml-1 w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </button>
              </div>
              <div scope="col" className="table-cell px-6 py-3">
                <span className="m-auto">
                  Server
                </span>
              </div>
              <div scope="col" className="table-cell px-6 py-3">
                <span className="m-auto">
                  PIC Team Unix
                </span>
              </div>
              <div scope="col" className="table-cell px-6 py-3">
                <button onClick={() => { setSortBy("status"); handleFlagOrder(); }} className="flex hover:text-blue-700 items-center m-auto">
                  Status
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="ml-1 w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </button>
              </div>
              <div scope="col" className="table-cell px-6 py-3">
                <button onClick={() => { setSortBy("scheduled_date"); handleFlagOrder(); }} className="flex hover:text-blue-700 items-center m-auto">
                  Scheduled Date
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="ml-1 w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </button>
              </div>
              <div scope="col" className="table-cell px-6 py-3">
                <button onClick={() => { setSortBy("completed_date"); handleFlagOrder(); }} className="flex hover:text-blue-700 items-center m-auto">
                  Completed Date
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="ml-1 w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </button>
              </div>
            </div>
            {changes && changes.map((change, index) => (
              <Link key={index} target={"_blank"} to={`/change/detail/${change.id_change}`} className="table-row hover:cursor-pointer hover:text-sky-700 bg-white border-b">
                <div className="table-cell px-4 py-4 w-[300px] break-words">
                  {change.title}
                </div>
                <div className="table-cell px-4 py-4 break-words">
                  [{change.change_type}] {change.change_reference}
                </div>
                <div className="table-cell">
                  <ul className="ml-3 list-disc p-2">
                    {change.servers.map((server, index) => (
                      <li key={index} className="break-normal">
                        {server.hostname}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="table-cell px-4 py-4 break-normal">
                  {change.pic && change?.pic?.map((pic, index) => (
                    <div key={index}>
                      <ul className="ml-7 list-disc">
                        <li>
                          <div className="flex items-center">
                            <div className="break-words text-left">
                              <div className="text-sm">
                                {pic.name}
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="table-cell px-4 py-4">
                  <div className={`${change.status === "Requested" ? "bg-red-50 text-red-700 ring-red-600/10" : change.status === "Completed" ? "bg-green-50 text-green-700 ring-green-600/10" : change.status === "Reschedule" ? "bg-orange-50 text-orange-700 ring-orange-600/10" : "bg-yellow-50 text-yellow-700 ring-yellow-600/10"} inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset`}>
                    {change.status}
                  </div>
                </div>
                <div className="table-cell px-4 py-4 break-normal">
                  {change?.scheduled_date ? dayjs(change?.scheduled_date).format("DD MMMM YYYY HH:mm") : ""}
                </div>
                <div className="table-cell px-4 py-4 break-normal">
                  {change?.completed_date ? dayjs(change?.completed_date).format("DD MMMM YYYY HH:mm") : "N/A"}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* pagination */}
        <div className="mt-7 flex flex-col items-center mb-10">
          <p className="mb-3">
            Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
          </p>
          <nav
            className="pagination is-centered"
            key={rows}
            role="navigation"
            aria-label="pagination"
          >
            <ReactPaginate
              previousLabel={"< Prev"}
              nextLabel={"Next >"}
              pageCount={pages}
              onPageChange={changePage}
              containerClassName={"isolate inline-flex -space-x-px rounded-md shadow-sm"}
              pageLinkClassName={"relative inline-flex items-center px-4 py-2 mx-1 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-200 hover:text-black focus:z-20 focus:outline-offset-0"}
              previousLinkClassName={"relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"}
              nextLinkClassName={"relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"}
              activeLinkClassName={"relative z-10 inline-flex items-center bg-sky-700 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"}
              disabledLinkClassName={"pagination-link is-disabled"}
            />
          </nav>
        </div>
      </div>
    </ModernLayout>
  );
};

export default ListApprovalProposal;