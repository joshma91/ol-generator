import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "openlaw-elements/dist/openlaw-elements.min.css";
import TemplateList from "./TemplateList";
import Template from "./Template";
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

  const { loading, data, error } = useQuery(TEMPLATES_QUERY);

  return (
    <Grid>
      <Grid.Column stretched={true} computer={5} tablet={4} mobile={16} >
        <h2>Select a Saved Template</h2>
        <TemplateList
          loading={loading}
          error={error}
          data={data}
          setTemplate={setTemplate}
        />
      </Grid.Column>
      <Grid.Column computer={5} tablet={4} mobile={16} >
        <Template template={template} />
      </Grid.Column>
    </Grid>
  );
}
