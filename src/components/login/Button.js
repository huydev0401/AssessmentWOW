import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const ButtonStyles = styled.button`
  cursor: pointer;
  padding: 0 25px;
  line-height: 1;
  border-radius: 8px;
  font-weight: 600;
  font-size: 18px;
  height: ${(props) => props.height || "66px"};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1677ff;
  color: #fff;
  outline: none;
  border: none;
  @media (max-width: 768px) {
    height: 58.4px;
  }
  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;
const Button = ({
  type = "button",
  onClick = () => {},
  children,
  className,
  ...props
}) => {
  const { isLoading, to } = props;
  const child = !!isLoading ? <LoadingSpinner></LoadingSpinner> : children;
  if (to !== "" && typeof to === "string") {
    return (
      <NavLink to={to} className="inline-block">
        <ButtonStyles type={type} className={className} {...props}>
          {child}
        </ButtonStyles>
      </NavLink>
    );
  }
  return (
    <ButtonStyles
      type={type}
      className={className}
      onClick={onClick}
      {...props}
    >
      {child}
    </ButtonStyles>
  );
};

export default Button;
