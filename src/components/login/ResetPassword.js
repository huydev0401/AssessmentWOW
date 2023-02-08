import React, { useContext } from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { RealmContext } from "../../context/realmProvider";
import { useState } from "react";

export default function ResetPassword() {
  const [form] = Form.useForm();
  const { app } = useContext(RealmContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const tokenId = searchParams.get("tokenId");
  const [isLoading, setIsLoading] = useState(false);
  const onHandleResetPW = async (values) => {
    setIsLoading(true);
    try {
      await app.emailPasswordAuth.sendResetPasswordEmail({
        email: values.email,
      });
      message.success("Please Check Your Email!");
      setIsLoading(false);
    } catch (error) {
      message.error("Your Account Does Not Exist! Please Try Again");
      setIsLoading(false);
    }
  };
  const onHandleChangePW = async (values) => {
    console.log("Change: ", values);
    setIsLoading(true);
    try {
      await app.emailPasswordAuth.resetPassword({
        password: values.confirm,
        token,
        tokenId,
      });
      message.success("Change Password Successfully");
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      message.error("An Error Occurred, Please Try Again");
      setIsLoading(false);
    }
  };
  if (!!token && tokenId) {
    return (
      <div className="bg-[#d9dffa] w-[100%] h-[100vh] flex items-center justify-center px-[15px] md:px-auto">
        <Form
          form={form}
          name="register"
          onFinish={onHandleChangePW}
          scrollToFirstError
          className="bg-white px-[40px] pt-[50px] pb-[30px] md:py-[50px] rounded-[8px] text-[#40507a] relative"
        >
          <div className="absolute top-[-32px]">
            <img src="/images/lock-icon.png" alt="" />
          </div>
          <h2 className="text-[#1677ff] font-bold text-[24px] md:text-[32px] mb-[15px] capitalize">
            Create new password
          </h2>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              Submit
            </Button>
          </Form.Item>
          <Link to="/">Go Back</Link>
        </Form>
      </div>
    );
  } else
    return (
      <div className="bg-[#d9dffa] w-[100%] h-[100vh] flex items-center justify-center px-[15px] md:px-auto">
        <Form
          form={form}
          name="register"
          onFinish={onHandleResetPW}
          scrollToFirstError
          className="bg-white px-[40px] pt-[50px] pb-[30px] md:py-[50px] rounded-[8px] text-[#40507a] relative"
        >
          <div className="absolute top-[-32px]">
            <img src="/images/lock-icon.png" alt="" />
          </div>
          <h2 className="text-[#1677ff] font-bold text-[24px] md:text-[32px] mb-0 capitalize">
            Forgot your password?
          </h2>
          <p className="text-[14px] mb-[20px]">Let's get you new one!</p>
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input size="large" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              RESET MY PASSWORD
            </Button>
          </Form.Item>
          <p className="text-[14px]">
            Didn't request a password reset? You can ignore this message
          </p>
          <Link to="/">Go Back</Link>
        </Form>
      </div>
    );
}
