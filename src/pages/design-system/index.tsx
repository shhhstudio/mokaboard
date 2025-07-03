import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Heroe } from "@/sections/website/heroe/heroe";



const IndexPage: React.FC = () => {
  return (
    <Layout type="web">
      <Layout.Content>
        <Heroe />
      </Layout.Content>
    </Layout>
  );
};

export default IndexPage;
