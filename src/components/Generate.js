import React, { useState, useEffect } from "react";
import { Button, Form, Input, Divider, Item } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "openlaw-elements/dist/openlaw-elements.min.css";
import OLForm from "./OLForm";
import { Query } from "react-apollo";
import { useMutation } from "@apollo/react-hooks";
import { Switch, Route, Redirect, Link } from "react-router-dom";

import gql from "graphql-tag";

const SAVE_MUTATION = gql`
  mutation($name: String!, $description: String!, $account: String) {
    createTemplate(name: $name, description: $description, account: $account) {
      id
      createdAt
      description
      name
      account
    }
  }
`;

export default function Generate({ account }) {
  const [showOLForm, setShow] = useState();
  const [key, setKey] = useState(0);
  const [templateName, setTemplateName] = useState(null);
  const [loadSuccess, setLoadSuccess] = useState();
  const [query, setQuery] = useState();
  const [saveTemplate] = useMutation(SAVE_MUTATION);

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
    try {
      await saveTemplate({
        variables: {
          name: templateName,
          description: templateName,
          account: account
        }
      });
      setQuery(
        <Item.Description>
          This template was has been saved for you. View it{" "}
          <Link
            to="/saved"
            onClick={() => {
              setTimeout(() => {
                window.location.reload();
              });
            }}
          >
            here
          </Link>
        </Item.Description>
      );
    } catch (err) {
      console.log(err);
      setQuery(
        <Item.Description>
          This template was previously saved. View it{" "}
          <Link
            to="/saved"
            onClick={() => {
              setTimeout(() => {
                window.location.reload();
              });
            }}
          >
            here
          </Link>
        </Item.Description>
      );
    }
  };

  useEffect(() => {
    if (showOLForm && loadSuccess) uploadTemplateID();
  }, [loadSuccess]);

  return (
    <>
      <h2>View an OpenLaw Template</h2>
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
