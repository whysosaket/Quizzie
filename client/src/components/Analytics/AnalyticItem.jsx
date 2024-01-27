import React from "react";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoMdShare } from "react-icons/io";
import { Link } from "react-router-dom";

const AnalyticItem = (props) => {

  const {setIsSingle} = props;

  const handleQuestionWiseAnalysis = () => {
    setIsSingle(true);
  }
  return (
    <>
      <tr>
        <td>1</td>
        <td>Quiz 1</td>
        <td>04 Sep, 2021</td>
        <td>667</td>
        <td>
          <BiEdit className="editicon" />
          <RiDeleteBin6Fill className="deleteicon" />
          <IoMdShare className="shareicon" />
        </td>
        <td className="qwa">
            <div onClick={handleQuestionWiseAnalysis}>Question Wise Analysis</div>
        </td>
      </tr>
    </>
  );
};

export default AnalyticItem;
