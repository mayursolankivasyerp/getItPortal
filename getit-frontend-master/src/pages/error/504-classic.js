import React from "react";
import { Link } from "react-router-dom";
import { Block, BlockContent, Button } from "../../components/Component";
 
const Error504Classic = () => {
  return (
    <>
      <Block className="nk-block-middle wide-xs mx-auto">
        <BlockContent className="nk-error-ld text-center">
          <h1 className="nk-error-head">403</h1>
          <h3 className="nk-error-title">Access Denied</h3>
          <p className="nk-error-text">
          "Access denied" often indicates that you are not permitted to utilize a certain resource or system.
          </p>
          <Link to={`${process.env.PUBLIC_URL}/`}>
            <Button color="primary" size="lg" className="mt-2">
              Back To Home
            </Button>
          </Link>
        </BlockContent>
      </Block>
    </>
  );
};
export default Error504Classic;
 