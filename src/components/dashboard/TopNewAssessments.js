import { Card, Table } from "antd";
import React, { useEffect } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import {
  selectAssessments,
  selectTopNewAssessments,
} from "../../redux/assessmentsSlice";
import { formatCountdown } from "antd/es/statistic/utils";

function TopNewAssessments(props) {
  const fullname = "Justin Nguyễn";
  const short = "sjahn";
  const email = "vunh2301@gmail.com";
  const asessments = useSelector(selectTopNewAssessments);
  useEffect(() => {}, [asessments]);
  return (
    <>
      <h3>Nội dung email</h3>
      {/* <h4>
        From: Online Assessment Platform {"<"}reports@a247.vn{">"}
      </h4>
      <h4>
        To: {fullname} {"<"}
        {email}
        {">"}
      </h4> */}
      <Card>
        <p>
          <b>{fullname}</b> thân mến:
        </p>
        <p>
          <b>Assessments 24x7</b> cảm ơn bạn đã đăng ký tham gia đánh giá của
          chúng tôi.
        </p>
        <p>
          <b>
            Bắt đầu làm bài đánh giá hoặc xem lại kết quả bài đánh giá vui lòng
            click vào liên kết bên dưới.
          </b>
        </p>
        <ul>
          <li>
            <b>DISC: </b>
            <a href={`https://link.a247.vn/${short}`}>
              https://link.a247.vn/{short}
            </a>
          </li>
          <li>
            <b>Motivators: </b>
            <a href={`https://link.a247.vn/${short}`}>
              https://link.a247.vn/{short}
            </a>
          </li>
        </ul>
      </Card>
    </>
  );
}

export default TopNewAssessments;
