import React, {useContext} from "react";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoMdShare } from "react-icons/io";
import formatDate from "../../utils/FormatDate";
import GlobalContext from "../../context/GlobalContext";
import AnalyticsContext from "../../context/AnalyticsContext";

const AnalyticItem = (props) => {

  const {setIsSingle, index, quiz} = props;
  const {getAllQuestions} = useContext(AnalyticsContext);

  const handleQuestionWiseAnalysis = async () => {
    await getAllQuestions(quiz.quizID);
    setIsSingle(true);
  }

  let date = formatDate(quiz.createdOn);

  return (
    <>
      <tr>
        <td>{index+1}</td>
        <td>{quiz.name}</td>
        <td>{date}</td>
        <td>{quiz.impressions}</td>
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
