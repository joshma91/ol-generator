import React, { useState, useEffect } from "react";
import { APIClient, Openlaw } from "openlaw";
import { Button, Form, Input, Divider, Item } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "openlaw-elements/dist/openlaw-elements.min.css";
import OLForm from "./OLForm";
import Autosuggest from "react-autosuggest";
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

const openLawConfig = {
  server: process.env.REACT_APP_URL,
  userName: process.env.REACT_APP_OPENLAW_USER,
  password: process.env.REACT_APP_OPENLAW_PASSWORD
};

export default function Generate({ account }) {
  const [showOLForm, setShow] = useState();
  const [key, setKey] = useState(0);
  const [templateName, setTemplateName] = useState("");
  const [loadSuccess, setLoadSuccess] = useState(null);
  const [query, setQuery] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const [apiClient, setAPIClient] = useState();
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
          This template has been saved for you. View it{" "}
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
    console.log(loadSuccess);
    if (showOLForm && loadSuccess === null) {
      setQuery(<Item.Description>Please wait...</Item.Description>);
    }
    if (showOLForm && loadSuccess) {
      uploadTemplateID();
    } else if (showOLForm && loadSuccess === false) {
      setQuery(
        <Item.Description>
          We've encountered an error, sorry. Please try another template.
        </Item.Description>
      );
    }
  }, [loadSuccess]);

  useEffect(() => {
    const newApiClient = new APIClient(openLawConfig.server);
    newApiClient.login(openLawConfig.userName, openLawConfig.password);
    setAPIClient(newApiClient);
  }, []);

  const setAutoComplete = val => {
    setTemplateName(val);
    setTimeout(async () => {
      const res = await apiClient.templateSearch(val, 1, 10);
      setSuggestions(res.data);
      console.log(res.data);
    }, 500);
  };

  const getSuggestionValue = suggestion => suggestion.title;
  // Use your imagination to render suggestions.
  const renderSuggestion = suggestion => <div>{suggestion.title}</div>;

  const onSuggestionsFetchRequested = ({ value }) => {
    setAutoComplete(value);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  function shouldRenderSuggestions() {
    return templateName.trim().length > 2;
  }

  const onChange = (event, { newValue }) => {
    setTemplateName(typeof newValue !== "undefined" ? newValue : "");
  };

  const inputProps = {
    placeholder: "Template Name",
    value: templateName,
    onChange: onChange
  };

  return (
    <>
      <h2>View an OpenLaw Template</h2>
      <Form>
        <Form.Field
          control={Input}
          placeholder="Template Name"
          label="OpenLaw Template Name"
          value={templateName}
          onChange={e => setAutoComplete(e.target.value)}
        />

        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          shouldRenderSuggestions={shouldRenderSuggestions}
          inputProps={inputProps}
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
