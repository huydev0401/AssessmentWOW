import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Input,
  Pagination,
  Popconfirm,
  Progress,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  CloudDownloadOutlined,
  LinkOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  dateRangeAssessments,
  deleteAssessment,
  filterAssessments,
  searchAssessments,
  selectAssessments,
  typeAssessments,
  selectFilter,
  selectFilterAssessments,
  selectSearch,
  selectStatus,
  selectType,
  statusAssessments,
} from "../../redux/assessmentsSlice";
import "moment/locale/vi";
import { RealmContext } from "../../context/realmProvider";
import { randomHexColor, _ } from "../../utils";
import Search from "antd/es/transfer/search";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";

function Assessments(props) {
  const { mongo } = useContext(RealmContext);
  const assessments = useSelector(selectAssessments);
  const computeAssessments = useSelector(selectFilterAssessments);
  const search = useSelector(selectSearch);
  const selectTag = useSelector(selectFilter);
  const filStatus = useSelector(selectStatus);
  const filType = useSelector(selectType);

  const [tags, settags] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    var _tags = [];
    assessments.forEach(a => {
      if (a.tags) _tags = _.union(_tags, a.tags);
    });
    _tags = _tags.map(t => {
      return { value: t, label: t };
    });
    settags(_tags);
  }, [assessments]);
  const handleDelete = id => {
    dispatch(deleteAssessment({ mongo, id }));
  };
  const statusColor = status => {
    switch (status) {
      case "Created":
        return "#999";
      case "Sented":
        return "#2db7f5";
      case "Opened":
      case "Doing":
        return "#108ee9";
      case "Completed":
        return "#87d068";
    }
    return "#2db7f5";
  };
  const handleSearch = e => {
    dispatch(searchAssessments(e.target.value));
  };
  const handleFilter = value => {
    dispatch(filterAssessments(value));
  };
  const handleDateRange = values => {
    dispatch(dateRangeAssessments(values));
  };
  const handleStatus = value => {
    dispatch(statusAssessments(value));
  };
  const handleType = value => {
    dispatch(typeAssessments(value));
  };
  const handleSelectTag = tag => {
    dispatch(filterAssessments([...selectTag, tag]));
  };
  const handleSelectStatus = value => {
    dispatch(statusAssessments(value));
  };
  return (
    <Card>
      <Input.Search
        style={{
          width: 250,
          marginRight: 15,
          marginBottom: 20,
        }}
        defaultValue={search}
        placeholder='Nhập từ khoá tìm kiếm'
        onChange={handleSearch}
        enterButton
      />

      <Select
        allowClear
        value={filType}
        placeholder='Lọc theo Bài test'
        style={{
          width: 200,
          marginRight: 15,
          marginBottom: 20,
        }}
        onChange={handleType}
        options={[
          {
            value: "DISC",
            label: "DISC",
          },
          {
            value: "Motivators",
            label: "Motivators",
          },
          {
            value: "Sale IQ Plus",
            label: "Sale IQ Plus",
          },
          {
            value: "EIQ 2",
            label: "EIQ 2",
          },
          {
            value: "Learning Styles",
            label: "Learning Styles",
          },
          {
            value: "Kids DISC",
            label: "Kids DISC",
          },
        ]}
      />
      <Select
        allowClear
        placeholder='Lọc theo Tags'
        mode='multiple'
        value={selectTag}
        style={{ width: 200, marginRight: 15, marginBottom: 20 }}
        onChange={handleFilter}
        options={tags}
        maxTagCount='responsive'
      />
      <Select
        allowClear
        value={filStatus}
        placeholder='Lọc theo Trạng thái'
        style={{
          width: 200,
          marginRight: 15,
          marginBottom: 20,
        }}
        onChange={handleStatus}
        options={[
          {
            value: "Created",
            label: "Created",
          },
          {
            value: "Sented",
            label: "Sented",
          },
          {
            value: "Opened",
            label: "Opened",
          },
          {
            value: "Doing",
            label: "Doing",
          },
          {
            value: "Completed",
            label: "Completed",
          },
          {
            value: "Expired",
            label: "Expired",
          },
        ]}
      />
      <DatePicker.RangePicker
        locale={locale}
        style={{ width: 300, marginRight: 15, marginBottom: 20 }}
        format='DD MMM YYYY'
        presets={[
          {
            label: "7 Ngày trước",
            value: [dayjs().add(-7, "d"), dayjs()],
          },
          {
            label: "14 Ngày trước",
            value: [dayjs().add(-14, "d"), dayjs()],
          },
          {
            label: "30 Ngày trước",
            value: [dayjs().add(-30, "d"), dayjs()],
          },
          {
            label: "90 Ngày trước",
            value: [dayjs().add(-90, "d"), dayjs()],
          },
          {
            label: "Tháng này",
            value: [
              dayjs(`${dayjs().format("YYYY-MM-")}01`),
              dayjs(`${dayjs().format("YYYY-MM-")}${dayjs().daysInMonth()}`),
            ],
          },
          {
            label: "Tháng trước",
            value: [
              dayjs(`${dayjs().format("YYYY-MM-")}01`).subtract(1, "month"),
              dayjs(
                `${dayjs().format("YYYY-MM-")}${dayjs().daysInMonth()}`
              ).subtract(1, "month"),
            ],
          },
        ]}
        onChange={handleDateRange}
      />

      <Table
        id='body-view'
        rowKey='_id'
        columns={[
          {
            title: "Bài đánh giá",
            dataIndex: "type",
            render: (_, entity) => {
              var avatar = null;
              switch (entity.type) {
                case "DISC": {
                  avatar =
                    "https://actioncoachassessments.com/UploadArea/269/badge6.jpg";
                  break;
                }
                case "Motivators": {
                  avatar =
                    "https://actioncoachassessments.com/UploadArea/269/badge5.jpg";
                  break;
                }
                case "Sale IQ Plus": {
                  avatar =
                    "https://actioncoachassessments.com/UploadArea/269/badge1.jpg";
                  break;
                }
                case "EIQ 2": {
                  avatar =
                    "https://actioncoachassessments.com/UploadArea/269/badge4.jpg";
                  break;
                }
                case "Learning Styles": {
                  avatar =
                    "https://actioncoachassessments.com/UploadArea/269/badge2.jpg";
                  break;
                }
                case "Kids DISC": {
                  avatar =
                    "https://www.assessments24x7.com/_nuxt/img/disc-kids-icon.b89fcd1.png";
                  break;
                }
              }
              return (
                <Space>
                  <Tooltip title={entity.type}>
                    <Avatar size={52} src={avatar} />
                  </Tooltip>
                  <div>
                    <h4 style={{ margin: 0 }}>
                      {entity.firstname} {entity.lastname}
                    </h4>
                    <span style={{ margin: 0 }}>
                      <Tooltip title='Đi tới bài đánh giá'>
                        <a
                          href={`https://link.a247.vn/${entity.short}`}
                          target='_blank'>
                          {entity.type} <LinkOutlined />
                        </a>
                      </Tooltip>
                    </span>
                  </div>
                </Space>
              );
            },
          },
          {
            title: "Email",
            sorter: (a, b) => a.email > b.email,
            dataIndex: "email",
            render: email => (
              <span style={{ fontSize: "13px", color: "#5f6368" }}>
                {email}
              </span>
            ),
          },
          {
            title: "Tags",
            dataIndex: "tags",
            align: "center",
            width: "180px",
            render: (_, { tags }) => (
              <>
                {tags
                  ? tags.map(tag => {
                      let color = randomHexColor();
                      return (
                        <Tag
                          style={{ cursor: "pointer" }}
                          color='blue'
                          key={tag}
                          onClick={() => handleSelectTag(tag)}>
                          {tag}
                        </Tag>
                      );
                    })
                  : ""}
              </>
            ),
          },
          {
            title: "Ngày tạo",
            dataIndex: "created",
            sorter: (a, b) => a.created - b.created,
            align: "center",
            width: "180px",
            render: created => {
              return (
                <h4 style={{ fontSize: "13px", color: "#5f6368", margin: 0 }}>
                  {moment().diff(moment(created), "hours") >= 24
                    ? moment(created).format("ll")
                    : moment(created).fromNow()}
                </h4>
              );
            },
          },
          {
            title: "Hết hạn",
            dataIndex: "expired",
            align: "center",
            width: "120px",
            render: (_, { created, status }) => {
              if (status === "Completed") {
                return (
                  <span style={{ fontSize: "13px", color: "#5f6368" }}>
                    Hoàn thành
                  </span>
                );
              } else {
                return (
                  <h4 style={{ fontSize: "13px", color: "#1677ff", margin: 0 }}>
                    Còn {moment(created).add(30, "d").diff(moment(), "days")}{" "}
                    ngày
                  </h4>
                );
              }
            },
          },
          {
            title: "Kết quả",
            dataIndex: "report",
            align: "center",
            width: "125px",
            render: (_, entity) => (
              <>
                {entity.report && entity.report.download ? (
                  <h4>
                    <a href={entity.report.download} target='_blank'>
                      Tải báo cáo <CloudDownloadOutlined />
                    </a>
                  </h4>
                ) : (
                  <Progress
                    type='circle'
                    percent={Math.floor(
                      entity.report && entity.report.current
                        ? entity.report.current
                        : 0
                    )}
                    width={50}
                    style={{
                      marginRight: 8,
                    }}
                  />
                )}
                {/* {entity.firstname} {entity.lastname}{" "}
                <a href={`https://a247.vn/${entity.short}`} target='_blank'>
                  <CloudDownloadOutlined />
                </a> */}
              </>
            ),
          },
          {
            title: "Trạng thái",
            align: "center",
            width: "130px",

            sorter: (a, b) => a.status > b.status,
            dataIndex: "status",
            render: (_, entity) => (
              <>
                <Tag
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectStatus(entity.status)}
                  color={statusColor(entity.status)}>
                  {entity.status}
                </Tag>
                {entity.status === "Created" || entity.status === "Sented" ? (
                  <Popconfirm
                    title='Bạn muốn xoá?'
                    onConfirm={() => handleDelete(entity._id)}>
                    <Button
                      size='small'
                      type='primary'
                      danger
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                ) : (
                  ""
                )}
                <br />
                <span style={{ fontSize: "12px", color: "#5f6368" }}>
                  {moment().diff(moment(entity.updated), "hours") >= 24
                    ? moment(entity.updated).format("ll")
                    : moment(entity.updated).fromNow()}
                </span>
              </>
            ),
          },
        ]}
        dataSource={computeAssessments}
        pagination={{
          total: computeAssessments.length,
          pageSizeOptions: [10, 20, 50, 100, 200],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
    </Card>
  );
}

export default Assessments;
