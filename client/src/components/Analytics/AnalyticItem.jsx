import React, {useContext, useState} from "react";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoMdShare } from "react-icons/io";
import formatDate from "../../utils/FormatDate";
import GlobalContext from "../../context/GlobalContext";
import AnalyticsContext from "../../context/AnalyticsContext";
import DeleteModal from "./DeleteModal";

const AnalyticItem = (props) => {

  const {setIsSingle, index, quiz} = props;
  const {getAllQuestions, deleteQuiz, clientUrl} = useContext(AnalyticsContext);
  const {toastMessage} = useContext(GlobalContext);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const handleQuestionWiseAnalysis = async () => {
    await getAllQuestions(quiz.quizID);
    setIsSingle(true);
  }

  let date = formatDate(quiz.createdOn);

  const handleDelete = async () => {
    const ans = await deleteQuiz(quiz.quizID);
    if(ans){
      setIsDeleteModal(false);
    }
  }

  const handleCopy = () => {
    const url = `${clientUrl}/quiz/${quiz.quizID}`;
    navigator.clipboard.writeText(url);
    toastMessage("Copied to clipboard!", "success");
  }

  return (
    <>
      {isDeleteModal && <DeleteModal delete={handleDelete} setVisible={setIsDeleteModal} />}
      <tr>
        <td>{index+1}</td>
        <td>{quiz.name}</td>
        <td>{date}</td>
        <td>{quiz.impressions}</td>
        <td>
          <BiEdit className="editicon" />
          <RiDeleteBin6Fill onClick={()=> setIsDeleteModal(true)} className="deleteicon" />
          <IoMdShare onClick={()=> handleCopy()} className="shareicon" />
        </td>
        <td className="qwa">
            <div onClick={handleQuestionWiseAnalysis}>Question Wise Analysis</div>
        </td>
      </tr>
    </>
  );
};

export default AnalyticItem;
