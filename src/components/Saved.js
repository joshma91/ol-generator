import React, { useState, useEffect } from "react";
import { Button, Form, Input, Divider } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "openlaw-elements/dist/openlaw-elements.min.css";
import OLForm from "./OLForm";
import { Query } from "react-apollo";
import { useMutation } from "@apollo/react-hooks";

import gql from "graphql-tag";

const TEST_QUERY = gql`
  query {
    templates {
      id
      description
      name
    }
  }
`;

const SAVE_MUTATION = gql`
  mutation($name: String!, $description: String!) {
    save(name: $name, description: $description) {
      id
      description
      name
    }
  }
`;

export default function Generate() {
  const [showOLForm, setShow] = useState();
  const [key, setKey] = useState(0);
  const [templateName, setTemplateName] = useState(null);
  const [loadSuccess, setLoadSuccess] = useState();
  const [query, setQuery] = useState();
  const [saveTemplate] = useMutation(SAVE_MUTATION);


  return (
    <>
      <Query query={TEST_QUERY}>
        {({ loading, error, data, subscribeToMore }) => {
          if (loading) return <div>Fetching</div>;
          if (error) return <div>Error</div>;
          return (
            <React.Fragment>
              {data.templates.map(template => {
                return (
                  <ul>
                    <li>{template.id}</li>
                    <li>{template.description}</li>
                    <li>{template.name}</li>
                  </ul>
                );
              })}
            </React.Fragment>
          );
        }}
      </Query>
    </>
  );
}
