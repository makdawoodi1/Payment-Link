import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FallBackComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/payments/link-generator')
  }, [])

  return <div></div>;
};

export default FallBackComponent;
