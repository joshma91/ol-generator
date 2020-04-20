import React, { useState, useEffect } from "react";
import { Button, Form, Input, Divider } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "openlaw-elements/dist/openlaw-elements.min.css";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import OLForm from "./OLForm";

export default function Template({ template }) {
  const [loadSuccess, setLoadSuccess] = useState();

  if (!template) return null;
  return (
    <>
      <OLForm setLoadSuccess={setLoadSuccess} templateName={template.name} />
    </>
  );
}
