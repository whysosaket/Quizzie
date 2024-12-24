import { useContext } from "react";
import Image from "../../assets/cong.png";
import QuizContext from "../../context/QuizContext";

const Congratulations = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 bg-gray-50 text-gray-900">
      <div className="text-center max-w-xl p-8 rounded-xl bg-white shadow-md">
        <img 
          src={Image} 
          alt="congratulations" 
          className="w-48 h-auto mx-auto mb-8"
        />
        <h1 className="text-4xl mb-6 font-semibold text-gray-900">
          Congratulations!
        </h1>
        <p className="text-lg mb-6 text-gray-600">
          Thank you for participating in the Quiz
        </p>
      </div>
    </div>
  );
};

export default Congratulations;
