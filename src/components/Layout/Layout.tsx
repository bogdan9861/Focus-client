import React from "react";
import { Layout as AntdLayout } from "antd";

import Aside from "../aside/Aside";

import "./Layout.scss";

type Props = {
  child: React.ReactNode;
};

const Layout = ({ child }: Props) => {
  return (
    <div className="main">
      <Aside open={true} />
      <AntdLayout.Content>{child}</AntdLayout.Content>
    </div>
  );
};

export default Layout;
