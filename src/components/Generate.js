import React, { useState, useEffect } from "react";
import { APIClient, Openlaw } from "openlaw";
import {
  Container,
  Loader,
  Button,
  Message,
  Form,
  Input,
  Divider
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "openlaw-elements/dist/openlaw-elements.min.css";
import AgreementPreview from "./AgreementPreview";
import OLForm from "./OLForm";
import OpenLawForm from "openlaw-elements";
import { Query, Mutation } from "react-apollo";
import { useMutation } from '@apollo/react-hooks';

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
  const [saveTemplate] = useMutation(SAVE_MUTATION)

  const openLawConfig = {
    server: process.env.REACT_APP_URL,
    templateName: process.env.REACT_APP_TEMPLATE_NAME,
    userName: process.env.REACT_APP_OPENLAW_USER,
    password: process.env.REACT_APP_OPENLAW_PASSWORD
  };

  const instantiateOLClient = async () => {
    setLoadSuccess(false);
    setShow(true);
    setKey(key + 1);
  };

  const uploadTemplateID = async () => {
    const res = await saveTemplate({variables: { name: templateName, description: templateName }})

    console.log(res)
    setQuery(
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
    );
  };

  useEffect(() => {
    console.log(showOLForm, loadSuccess);
    if (showOLForm && loadSuccess) uploadTemplateID();
  }, [loadSuccess]);

  return (
    <>
      <Form>
        <Form.Field
          control={Input}
          placeholder="Template Name"
          label="OpenLaw Template Name"
          value={templateName}
          onChange={e => setTemplateName(e.target.value)}
        />
        <Button type="submit" onClick={() => instantiateOLClient()}>
          Submit
        </Button>
      </Form>
      {query}
      <Divider />
      {showOLForm ? (
        <OLForm
          setLoadSuccess={setLoadSuccess}
          key={key}
          templateName={templateName}
        />
      ) : null}
    </>
  );
}
