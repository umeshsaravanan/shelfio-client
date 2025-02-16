import React from "react";
import { FaPlus, FaCog, FaChevronRight } from "react-icons/fa";
import { useAuthCtx } from "../../Contexts/AuthCtx";

const NavbarNew = ({ navAddress = [] }) => {
  const { logoutHandler } = useAuthCtx();
  return (
    <div className="h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 cursor-default">
        {navAddress.map((address, i) => (
          <>
            <span
              className={
                navAddress.length === i + 1
                  ? "text-lg font-semibold text-gray-800"
                  : "text-sm text-gray-500"
              }
            >
              {address}
            </span>
            {navAddress.length !== i + 1 && (
              <FaChevronRight size={16} className="text-gray-400" />
            )}
          </>
        ))}

        {/* <span className="text-sm text-gray-500">12 pages</span> */}
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
          <FaPlus size={16} />
          <span>New Page</span>
        </button>

        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <FaCog size={20} className="text-gray-600" />
        </button>

        <button
          onClick={logoutHandler}
          className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg`}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default NavbarNew;
