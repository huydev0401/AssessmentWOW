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
      message.success("Vui lòng kiểm tra email của bạn!");
      setIsLoading(false);
    } catch (error) {
      message.error("Tài khoản của bạn không tồn tại! Vui lòng thử lại sau");
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
      message.success("Đổi mật khẩu thành công");
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      message.error("Đã có lỗi xảy ra, Vui lòng thử lại");
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
            Tạo mật khẩu mới
          </h2>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
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
                message: "Vui lòng xác nhận mật khẩu của bạn!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Xác nhận mật khẩu không chính xác!")
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
            Quên mật khẩu?
          </h2>
          <p className="text-[14px] mb-[20px]">
            Nhập email của bạn để reset mật khẩu
          </p>
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "Vui lòng nhập địa chỉ email hợp lệ!",
              },
              {
                required: true,
                message: "Vui lòng nhập địa chỉ email!",
              },
            ]}
          >
            <Input size="large" placeholder="Nhập email của bạn" />
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
            Nếu bạn không có yêu cầu reset password? Bạn có thể bỏ qua bước này
          </p>
          <Link to="/">Go Back</Link>
        </Form>
      </div>
    );
}
