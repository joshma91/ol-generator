import React, { useState, useEffect } from "react";
import { Button, Form, Input, Divider } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "openlaw-elements/dist/openlaw-elements.min.css";
import OLForm from "./OLForm";
import { Query } from "react-apollo";
import TemplateList from "./TemplateList"
import { useQuery } from "@apollo/react-hooks";

import gql from "graphql-tag";

const TEMPLATES_QUERY = gql`
  query {
    templates {
      id
      description
      name
    }
  }
`;

export default function Generate() {
  const [template, setTemplate] = useState(null);

  const { loading, data, error } = useQuery(TEMPLATES_QUERY)



  return (
    <>
      <TemplateList loading={loading} error={error} data={data}/>
    </>
  );
}
