import React, { useState, useEffect } from "react";
import { Button, Form, Input, Divider } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "openlaw-elements/dist/openlaw-elements.min.css";

export default function Generate({ loading, error, data }) {
  if (loading) return "Loading...";
  if (error) return "There was an error loading the templates :(";
  if (!data || !data.templates || !data.templates.length) return "No templates";

  return (
    <>
      {data.templates.map(template => {
        return (
          <ul>
            <li>{template.id}</li>
            <li>{template.description}</li>
            <li>{template.name}</li>
          </ul>
        );
      })}
      )
    </>
  );
}
