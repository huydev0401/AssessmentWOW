import lodash from "lodash";
import deepdash from "deepdash";
import * as Realm from "realm-web";
import dayjs from "dayjs";
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
export const {
  BSON: { ObjectId },
} = Realm;
export const _ = deepdash(lodash);

export const objectIdToString = (obj) => {
  return _.mapValuesDeep(obj, (v) => {
    if (v?._bsontype === "ObjectID") {
      v = v.toString();
    }
    return v;
  });
};

export const removeEmptyObject = (obj) =>
  _.filterDeep(obj, (value, key, parent) => {
    var func = _.overSome([_.isNil, _.isNaN]);
    return !func(value);
  });
export const inviteFormat = ({ firstname, lastname, types, gender, user }) => {
  var links = "";
  var userEmail = user.customData.email;
  console.log(userEmail);
  if (!firstname || !lastname || !types || types.length <= 0) {
    return "";
  }
  types.forEach((type) => {
    links += `
      <li>
        <b>${type.type}: </b>
        <a href="https://link.a247.vn/${type.short}" target="_blank">
          https://link.a247.vn/${type.short}
        </a>
      </li>
      `;
  });
  if (
    userEmail == "ethannguyen@actioncoachcbd.com" ||
    userEmail == "theo@a247.vn"
  ) {
    return `
    <p>
      <b>${gender ? gender : "Anh/Chị"} ${firstname} ${lastname}</b>
      thân mến!
    </p>
    <p>
      <b>Assessments 24x7</b> bày tỏ Lòng Biết Ơn đến <b>${
        gender ? gender : "Anh/Chị"
      } ${lastname}</b> đã tin tưởng và lựa chọn chúng tôi để mở rộng góc nhìn Phát Triển Sự Nghiệp & Cân Bằng Cuộc Sống!
    </p>
    <p>
    Để BẮT ĐẦU bài trắc nghiệm hoặc xem KẾT QUẢ, <b>${
      gender ? gender : "Anh/Chị"
    } ${lastname}</b> vui lòng CLICK vào các LINKS bên dưới:
    </p>
    <ul>
      ${links}
    </ul>
    <p>
    Chân thành cảm ơn <b>${gender ? gender : "Anh/Chị"} ${lastname}</b>
    </p>
    <p>
    <b>Assessment24x7</b> là hệ thống TRẮC NGHIỆM giúp PHÁT TRIỂN BẢN THÂN trên nền tảng khoa học hành vi của những chuyên gia hàng đầu Thế Giới với sự điều hành của Tiến sĩ Tony Alexandra. Chúng tôi có hơn 30 năm kinh nghiệm trong ngành và được công nhận là hệ thống trắc nghiệm hàng đầu Thế giới. Chúng tôi phục vụ các Khách hàng đa dạng từ các Huấn luyện viên phát triển cá nhân đến các tập đoàn lớn như Coca-Cola, Tony Robin, các tập đoàn Bảo hiểm…
    </p>
    <p>
    Giờ đây <b>Assessment24x7</b>  được phổ biến rộng rãi ở Việt Nam với <b>06 bài TEST</b> đã được DỊCH sang tiếng Việt bao gồm:
    </p>
    <p>
    -	<b>DISC</b> (Phong cách Hành Vi ứng dụng Nguyên tắc Bạch Kim trong giao tiếp, bán hàng)
    </p>
    <p>
    -	<b>Motivators</b> (Động lực thúc đẩy thành công)
    </p>
    <p>
    -	<b>Sales IQ Plus</b> (Thông minh Bán hàng)
    </p>
    <p>
    -	<b>EiQ</b> (Thông minh Cảm Xúc)
    </p>
    <p>
    -	<b>Learning Style</b> (Phong cách học tập, nâng cao chất lượng Giảng dạy trong ngành Giáo dục)
    </p>
    <p>
    -	<b>DISC KIDs</b> (Phát triển THIÊN TÀI trong mỗi đứa TRẺ)
    </p>
    <p>
    Anh Chị hãy liên hệ <b>Coach TheO Vũ Bá Thế</b> là người ĐƯỢC CẤP Giấy phép CHÍNH THỨC ở Việt Nam, đang Phân phối & Đào tạo các nội dung trên!
    </p>
    <p>
    Điện thoại: <a href="tel:0989 165 465">0989 165 465</a> – Email: <a href="mailto:theovu@actioncoach.com">theovu@actioncoach.com</a>
    </p>
    <a href="">
    </a>
  `;
  }
  return `
    <p>
      <b>${gender ? gender : "Anh/Chị"} ${firstname} ${lastname}</b>
      thân mến:
    </p>
    <p>
      <b>Assessments 24x7</b> cảm ơn <b>${
        gender ? gender : "Anh/Chị"
      } ${lastname}</b> đã đăng ký tham gia đánh giá
      của chúng tôi.
    </p>
    <p>
      Bắt đầu làm bài đánh giá hoặc xem lại kết quả bài đánh giá <b>${
        gender ? gender : "Anh/Chị"
      } ${lastname}</b> vui
        lòng click vào liên kết bên dưới.
    </p>
    <ul>
      ${links}
    </ul>
  `;
};

export const randomInteger = (max) => {
  return Math.floor(Math.random() * (max + 1));
};

export const randomRgbColor = () => {
  let r = randomInteger(255);
  let g = randomInteger(255);
  let b = randomInteger(255);
  return [r, g, b];
};

export const randomHexColor = () => {
  let [r, g, b] = randomRgbColor();

  let hr = r.toString(16).padStart(2, "0");
  let hg = g.toString(16).padStart(2, "0");
  let hb = b.toString(16).padStart(2, "0");

  return "#" + hr + hg + hb;
};
function toSlug(str) {
  // Chuyển hết sang chữ thường
  str = str.toLowerCase();

  // xóa dấu
  str = str
    .normalize("NFD") // chuyển chuỗi sang unicode tổ hợp
    .replace(/[\u0300-\u036f]/g, ""); // xóa các ký tự dấu sau khi tách tổ hợp

  // Thay ký tự đĐ
  str = str.replace(/[đĐ]/g, "d");

  // Xóa ký tự đặc biệt
  str = str.replace(/([^0-9a-z-\s])/g, "");

  // Xóa khoảng trắng thay bằng ký tự -
  //str = str.replace(/(\s+)/g, '-');

  // Xóa ký tự - liên tiếp
  //str = str.replace(/-+/g, '-');

  // xóa phần dư - ở đầu & cuối
  str = str.replace(/^-+|-+$/g, "");

  // return
  return str;
}
export const search = (items, text, filter, dateRange, status) => {
  text = text.split(" ");
  return items.filter((item) => {
    let hasTag = false;
    let isRange = _.isEmpty(dateRange)
      ? true
      : dayjs(item.created).isBetween(dateRange[0], dateRange[1].add(1, "d"))
      ? true
      : false;
    let isStatus = !status ? true : status === item.status ? true : false;

    if (filter && filter.length > 0) {
      for (let i = 0; i < filter.length; i++) {
        if (item.tags && item.tags.includes(filter[i])) {
          hasTag = true;
          break;
        }
      }
    } else {
      hasTag = true;
    }
    return (
      isStatus &&
      isRange &&
      hasTag &&
      text.every((el) => {
        return toSlug(`${item.firstname} ${item.lastname} ${item.email}`)
          .toLowerCase()
          .includes(toSlug(el).toLowerCase());
      })
    );
  });
};
