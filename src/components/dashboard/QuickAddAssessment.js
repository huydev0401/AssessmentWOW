import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Empty,
  Form,
  Input,
  Radio,
  Row,
  Badge,
  Select,
  Spin,
  Tag,
  Tooltip,
} from "antd";
import { SendOutlined, SettingOutlined } from "@ant-design/icons";
import ShortUniqueId from "short-unique-id";
import QRCode from "qrcode";
import { RealmContext } from "../../context/realmProvider";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import {
  insertAssessment,
  insertAssessments,
  selectAssessments,
  selectUser,
  updateAssessments,
} from "../../redux/assessmentsSlice";
import { inviteFormat, ObjectId, validateEmail, _ } from "../../utils";
import moment from "moment";
const generateQR = async text => {
  try {
    console.log(await QRCode.toDataURL(text));
  } catch (err) {
    console.error(err);
  }
};
const uid = new ShortUniqueId({
  dictionary: "alphanum_lower",
  length: 5,
});

function QuickAddAssessment(props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const assessments = useSelector(selectAssessments);
  const [assessmentState, setAssessmentState] = useState();
  const [assessmentType, setAssessmentType] = useState([]);
  const { mongo, user, app } = useContext(RealmContext);
  const [advanced, setAdvanced] = useState(null);
  const [tags, settags] = useState([]);
  const currentUser = useSelector(selectUser);
  //console.log(currentUser);

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
  const handleChange = (changedValues, allValues) => {
    //console.log({ changedValues, allValues });

    if (allValues.type.length > 0) {
      var types = [];
      allValues.type.forEach(type => {
        types.push({
          type,
          short: uid(),
        });
      });
      setAssessmentType(types);
    }
    setAssessmentState(inviteFormat({ ...allValues, types, user }));
  };
  const handleFinish = async values => {
    setLoading(true);
    values = { ...values, email: values.email.toLowerCase() };
    const entities = [];
    for (const i in assessmentType) {
      entities.push({
        ...values,
        type: assessmentType[i].type,
        owner: user.id,
        short: assessmentType[i].short,
        status: "Created",
        report: {
          current: 0,
        },
        created: new Date(),
        updated: new Date(),
      });
    }

    //console.log(entities);
    const { payload } = await dispatch(insertAssessments({ mongo, entities }));
    //console.log(payload);

    //console.log("assessmentState", assessmentState);
    await user.functions.sendmail({
      from: "Assessments 24x7 <reports@a247.vn>",
      to: values.email,
      cc: values.emailCC,
      subject: "Bài đánh giá Assessments 24x7",
      "o:tag": "app.a247.vn",
      html: assessmentState,
    });
    await dispatch(
      updateAssessments({
        mongo,
        ids: payload.map(({ _id }) => ObjectId(_id)),
        update: { status: "Sented", updated: new Date() },
      })
    );
    form.resetFields();
    setAssessmentState(null);
    setLoading(false);
  };
  return (
    <Spin spinning={loading}>
      <Row gutter={20}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <h3>Thông tin khách hàng:</h3>
          <Form
            form={form}
            layout='vertical'
            name='quickAddAssessment'
            onFinish={handleFinish}
            onValuesChange={handleChange}
            initialValues={{
              email: "",
              type: [],
              language: "Vietnamese",
              gender: "Anh/Chị",
            }}>
            <Row gutter={20}>
              <Col span={16}>
                <Form.Item
                  name='email'
                  rules={[
                    {
                      type: "email",
                      required: true,
                      message: "Vui lòng nhập địa chỉ email!",
                    },
                  ]}>
                  <Input placeholder='Địa chỉ Email' allowClear />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='gender'
                  rules={[
                    {
                      required: true,
                    },
                  ]}>
                  <Select
                    style={{
                      width: "100%",
                    }}
                    options={[
                      {
                        value: "Anh/Chị",
                        label: "Anh/Chị",
                      },
                      {
                        value: "Anh",
                        label: "Anh",
                      },
                      {
                        value: "Chị",
                        label: "Chị",
                      },
                      {
                        value: "Bạn",
                        label: "Bạn",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={16}>
                <Form.Item
                  name='firstname'
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Họ và Tên lót!",
                    },
                  ]}>
                  <Input placeholder='Họ và Tên lót' allowClear />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='lastname'
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Tên!",
                    },
                  ]}>
                  <Input placeholder='Tên' allowClear />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={20}>
              <Col span={16}>
                <Form.Item
                  name='type'
                  rules={[
                    {
                      required: true,
                      message: "Vui chọn bài Đánh giá!",
                    },
                  ]}>
                  <Checkbox.Group>
                    <Row>
                      <Col span={12}>
                        <Checkbox value='DISC' style={{ lineHeight: "32px" }}>
                          DISC{" "}
                          <Tooltip
                            title={`1 bài test bằng ${
                              currentUser.creditRate?.["DISC"] || 1
                            } Credit`}>
                            <small className='text-red-600'>
                              (-{currentUser.creditRate?.["DISC"] || 1} Credit)
                            </small>
                          </Tooltip>
                        </Checkbox>
                      </Col>
                      <Col span={12}>
                        <Checkbox
                          value='Motivators'
                          style={{ lineHeight: "32px" }}>
                          Motivators{" "}
                          <Tooltip
                            title={`1 bài test bằng ${
                              currentUser.creditRate?.["Motivators"] || 1
                            } Credit`}>
                            <small className='text-red-600'>
                              (-{currentUser.creditRate?.["Motivators"] || 1}{" "}
                              Credit)
                            </small>
                          </Tooltip>
                        </Checkbox>
                      </Col>
                      <Col span={12}>
                        <Checkbox
                          value='Sale IQ Plus'
                          style={{ lineHeight: "32px" }}>
                          Sale IQ Plus{" "}
                          <Tooltip
                            title={`1 bài test bằng ${
                              currentUser.creditRate?.["Sale IQ Plus"] || 1
                            } Credit`}>
                            <small className='text-red-600'>
                              (-{currentUser.creditRate?.["Sale IQ Plus"] || 1}{" "}
                              Credit)
                            </small>
                          </Tooltip>
                        </Checkbox>
                      </Col>
                      <Col span={12}>
                        <Checkbox value='EIQ 2' style={{ lineHeight: "32px" }}>
                          EIQ 2{" "}
                          <Tooltip
                            title={`1 bài test bằng ${
                              currentUser.creditRate?.["EIQ 2"] || 1
                            } Credit`}>
                            <small className='text-red-600'>
                              ({currentUser.creditRate?.["EIQ 2"] || 1} Credit)
                            </small>
                          </Tooltip>
                        </Checkbox>
                      </Col>
                      <Col span={12}>
                        <Checkbox
                          value='Learning Styles'
                          style={{ lineHeight: "32px" }}>
                          Learning Styles{" "}
                          <Tooltip
                            title={`1 bài test bằng ${
                              currentUser.creditRate?.["Learning Styles"] || 1
                            } Credit`}>
                            <small className='text-red-600'>
                              (-
                              {currentUser.creditRate?.["Learning Styles"] ||
                                1}{" "}
                              Credit)
                            </small>
                          </Tooltip>
                        </Checkbox>
                      </Col>
                      <Col span={12}>
                        <Checkbox
                          value='Kids DISC'
                          style={{ lineHeight: "32px" }}>
                          Kids DISC{" "}
                          <Tooltip
                            title={`1 bài test bằng ${
                              currentUser.creditRate?.["Kids DISC"] || 1
                            } Credit`}>
                            <small className='text-red-600'>
                              (-{currentUser.creditRate?.["Kids DISC"] || 1}{" "}
                              Credit)
                            </small>
                          </Tooltip>
                        </Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name='language'>
                  <Radio.Group>
                    <Radio value='Vietnamese'>Vietnamese</Radio>
                    <Radio value='English' disabled>
                      English
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Collapse activeKey={advanced} ghost>
              <Collapse.Panel
                showArrow={false}
                header={null}
                key='advanced'
                forceRender>
                <Row gutter={20}>
                  <Col span={12}>
                    <Form.Item
                      name='emailCC'
                      rules={[
                        {
                          //type: "email",
                          validator: async (rule, value) => {
                            const values = value.replaceAll(" ", "");
                            if (!values) return true;
                            const arrValues = values.split(",");
                            console.log(arrValues);
                            for (let i = 0; i < arrValues.length; i++) {
                              if (!validateEmail(arrValues[i]))
                                throw new Error("Something wrong!");
                            }
                            return true;
                          },
                          message: "Vui lòng nhập địa chỉ email!",
                        },
                      ]}>
                      <Input
                        style={{ width: "100%" }}
                        placeholder='Địa chỉ Email CC'
                        allowClear
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name='tags'>
                      <Select
                        allowClear
                        placeholder='Tags: Nhập và nhấn Enter để tạo tag mới'
                        mode='tags'
                        style={{ width: "100%" }}
                        options={tags}
                        maxTagCount='responsive'
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Collapse.Panel>
            </Collapse>
            <Form.Item>
              <Button
                icon={<SettingOutlined />}
                onClick={() => {
                  if (advanced === null) {
                    setAdvanced(["advanced"]);
                  } else {
                    setAdvanced(null);
                  }
                }}>
                Mở rộng
              </Button>
              <Button
                style={{ float: "right" }}
                type='primary'
                htmlType='submit'
                icon={<SendOutlined />}>
                Gửi bài đánh giá
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <h3>
            Nội dung email:{" "}
            {/* <Select
              defaultValue='default'
              style={{
                width: 120,
              }}
              onChange={() => {}}
              options={[
                {
                  value: "default",
                  label: "Mặc định",
                },
                {
                  value: "random",
                  label: "Mẫu 1",
                },
              ]}
            /> */}
          </h3>
          <Card>
            {assessmentState ? (
              <div dangerouslySetInnerHTML={{ __html: assessmentState }} />
            ) : (
              // <ReactQuill
              //   theme="bubble"
              //   value={assessmentState}
              //   onChange={setAssessmentState}
              // />
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>
    </Spin>
  );
}

export default QuickAddAssessment;
