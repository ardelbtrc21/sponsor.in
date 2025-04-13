import React, { } from "react";

const Test = () => {
    return (
        <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                {/* {console.log("test")} */}
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-blue-200">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 border-r justify"
                            >
                                <div className="flex justify-center">
                                    Name
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 border-r"
                            >
                                <div className="flex justify-center">
                                    Username
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 border-r"
                            >
                                <div className="flex justify-center">
                                    Role
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 border-r"
                            >
                                <div className="flex justify-center">
                                    Email
                                </div>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    );
};

export default Test;