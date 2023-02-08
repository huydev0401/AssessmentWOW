import { Avatar, Button, Col, Dropdown, Layout, Row, Space, Spin } from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import Login from "../components/login/Login";
import { RealmContext } from "../context/realmProvider";
import {
  updateOneAssessment,
  fetchAssessments,
  getUser,
  selectUser,
  deleteOneAssessment,
  updateUser,
} from "../redux/assessmentsSlice";
import { objectIdToString } from "../utils";

function MasterLayout(props) {
  const { logout, isLoggedIn, mongo, user } = useContext(RealmContext);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector(selectUser);

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      dispatch(getUser({ mongo, user }));
      dispatch(fetchAssessments({ mongo, user })).then(() => {
        setLoading(false);
      });
      const changeStream = async () => {
        for await (const change of mongo
          .db("a247")
          .collection("assessments")
          .watch()) {
          const { documentKey, fullDocument } = change;
          switch (change.operationType) {
            case "update":
            case "replace": {
              dispatch(
                updateOneAssessment(
                  objectIdToString({
                    id: fullDocument._id,
                    changes: fullDocument,
                  })
                )
              );
              break;
            }
            case "delete": {
              dispatch(deleteOneAssessment(objectIdToString(documentKey._id)));
              break;
            }
          }
          //console.log(`change: ${objectIdToString(documentKey._id)}`, change);
        }
      };

      const userStream = async () => {
        for await (const change of mongo
          .db("a247")
          .collection("user")
          .watch()) {
          const { documentKey, fullDocument } = change;
          dispatch(getUser({ mongo, user }));
          switch (change.operationType) {
            case "update":
            case "replace": {
              dispatch(updateUser(objectIdToString(fullDocument)));
              break;
            }
          }
        }
      };
      changeStream();
      userStream();
    }
  }, [user]);
  if (isLoggedIn) {
    return (
      <Spin spinning={loading} size='large'>
        <Header
          style={{
            background: "#222",
            color: "white",
            padding: "15px 20px 15px 20px",
          }}>
          <Row justify='space-between' align='middle'>
            <Col lg={16} md={12} xs={10}>
              <img
                style={{ width: "100%", maxWidth: "200px" }}
                src='/images/a247logo.webp'
                alt=''
              />
            </Col>
            <Col lg={8} md={12} xs={14} style={{ textAlign: "right" }}>
              <Space>
                <div>
                  <h4 style={{ margin: 0 }}>{currentUser.email}</h4>
                  <small>
                    <strong>
                      {Intl.NumberFormat("en-US").format(currentUser.credit)}
                    </strong>{" "}
                    Credit{" "}
                  </small>
                </div>
                <Dropdown
                  arrow
                  menu={{
                    items: [
                      // { label: "Tài khoản", key: "user" },
                      // {
                      //   type: "divider",
                      // },
                      {
                        label: (
                          <Button
                            type='primary'
                            danger
                            size='small'
                            icon={<LogoutOutlined />}
                            onClick={() => {
                              logout().then(() => {
                                window.location.reload();
                              });
                            }}>
                            Đăng xuất
                          </Button>
                        ),
                        key: "logout",
                      },
                    ],
                  }}>
                  <Avatar
                    style={{ backgroundColor: "#87d068", cursor: "pointer" }}
                    icon={<UserOutlined />}
                  />
                </Dropdown>
              </Space>
            </Col>
          </Row>
          {/* <div
            style={{
              display: "inline-block",
              height: "64px",
              padding: "18px 0 18px 20px",
            }}
          >
            <img
              style={{ height: "100%" }}
              src="/images/a247logo.webp"
              alt=""
            />
          </div>
          <Space style={{ float: "right", padding: "12px 20px 12px" }}>
            <div
              style={{
                display: "inline-block",
                marginRight: "10px",
                textAlign: "right",
              }}
            >
              <h3 style={{ margin: 0 }}>{currentUser.fullname}</h3>
              <small>
                <strong>
                  {Intl.NumberFormat("en-US").format(currentUser.credit)}
                </strong>{" "}
                Credit{" "}
              </small>
            </div>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={() => {
                logout();
              }}
            >
              Thoát
            </Button>
          </Space> */}
        </Header>
        <Layout style={{ padding: "20px" }}>
          <Outlet />
        </Layout>

        <p
          style={{
            padding: "20px",
            textAlign: "center",
            background: "#222",
            color: "white",
          }}>
          © 2022 WoW Multimedia. version 1.0.2 beta
        </p>
      </Spin>
    );
  } else {
    return <Login />;
  }
}

export default MasterLayout;

// console.log("resetpass");
// const email = "ceo@wowmultimedia.vn";
// const password = "hongbeoi";
// const token = searchParams.get("token");
// const tokenId = searchParams.get("tokenId");
// //await app.emailPasswordAuth.sendResetPasswordEmail({ email });
// //http://localhost:3000/passwordReset?token=618fb81e0b796e24a9396724f5afffaf908615ac8e9f0118a68c1fe349f50b8315488d5b9d1ca4dc46ca6dd655580f9579545cf160b8aa800197671c768c042f&tokenId=6385d6ecc79c035dca86b136

// if (!!token && !!tokenId && !!password) {
//   await app.emailPasswordAuth.resetPassword({
//     password,
//     token,
//     tokenId,
//   });
// }
