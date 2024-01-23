import React from 'react'
import '../styles/Analytics.css'
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoMdShare } from "react-icons/io";

const Analytics = () => {
  return (
    <div className='analysis'>
      <h1 className='analtitle'>Quiz Analysis</h1>
      <div className='analtable'>
      <table className='table'>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Quiz Name</th>
            <th>Created On</th>
            <th>Impression</th>
            <th>{" "}</th>
            <th>{" "}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Quiz 1</td>
            <td>04 Sep, 2021</td>
            <td>667</td>
            <td>
              <BiEdit className='editicon' />
              <RiDeleteBin6Fill className='deleteicon' />
              <IoMdShare className='shareicon' />
            </td>
            <td className="qwa">Question Wise Analysis</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Quiz 2</td>
            <td>04 Sep, 2021</td>
            <td>667</td>
            <td>
              <BiEdit className='editicon' />
              <RiDeleteBin6Fill className='deleteicon' />
              <IoMdShare className='shareicon' />
            </td>
            <td className="qwa">Question Wise Analysis</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Quiz 3</td>
            <td>04 Sep, 2021</td>
            <td>667</td>
            <td>
              <BiEdit className='editicon' />
              <RiDeleteBin6Fill className='deleteicon' />
              <IoMdShare className='shareicon' />
            </td>
            <td className="qwa">Question Wise Analysis</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Quiz 4</td>
            <td>04 Sep, 2021</td>
            <td>667</td>
            <td>
              <BiEdit className='editicon' />
              <RiDeleteBin6Fill className='deleteicon' />
              <IoMdShare className='shareicon' />
            </td>
            <td className="qwa">Question Wise Analysis</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Quiz 5</td>
            <td>04 Sep, 2021</td>
            <td>667</td>
            <td>
              <BiEdit className='editicon' />
              <RiDeleteBin6Fill className='deleteicon' />
              <IoMdShare className='shareicon' />
            </td>
            <td className="qwa">Question Wise Analysis</td>
          </tr>
        </tbody>
      </table>

      </div>
    </div>
  )
}

export default Analytics