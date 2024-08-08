import React from "react";
import LogoSmall from "../../images/vasyLogo.png";
import LogoDark from "../../images/logo-dark.png";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle } from "../../components/Component";
import { Link } from "react-router-dom";
import { Button } from "../../components/Component";

const Success = ({ status }) => {
  const urlParams = new URLSearchParams(status);
  const action = urlParams.get("action");
  return (
    <>
      <Head title="Success" />
      <Block className="nk-block-middle nk-auth-body">
        <div className="brand-logo pb-5">
          <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
            <img className="logo-small logo-img logo-img-small" src={LogoSmall} alt="logo" />
          </Link>
        </div>
        <BlockHead>
          <BlockContent>
            <BlockTitle tag="h4">
              {action === "Approve" ? "Your ticket is approved." : "Your ticket is rejected"}
            </BlockTitle>
            <BlockDes className="text-success">
              <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
                <Button color="primary" size="lg">
                  Back to Home
                </Button>
              </Link>
            </BlockDes>
          </BlockContent>
        </BlockHead>
      </Block>
    </>
  );
};
export default Success;
