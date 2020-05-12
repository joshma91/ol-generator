import React, { useState, useEffect } from "react";
import { Table, Radio, Icon } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "openlaw-elements/dist/openlaw-elements.min.css";
import { useMutation } from "@apollo/react-hooks";

import gql from "graphql-tag";

const DELETE_MUTATION = gql`
  mutation deleteTemplate($id: ID!) {
    deleteTemplate(where: { id: $id }) {
      id
      name
    }
  }
`;

export default function TemplateList({
  loading,
  error,
  data,
  setTemplate,
  account
}) {
  const [activeKey, setActiveKey] = useState(null);
  const [checked, setChecked] = useState(false);
  const [deleteTemplate] = useMutation(DELETE_MUTATION);

  const remove = async (template, i) => {
    await deleteTemplate({ variables: { id: template.id } });
    document.getElementById(`row-${i}`).remove();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>There was an error loading the templates :(</p>;
  if (!data || !data.templates || !data.templates.length)
    return <p>No templates</p>;

  return (
    <>
      <Radio
        label="Show templates I added"
        style={{ fontWeight: "bold" }}
        toggle
        value={checked}
        onClick={() => setChecked(!checked)}
      />
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={10}>OpenLaw Template</Table.HeaderCell>
            <Table.HeaderCell width={6}>Date Added</Table.HeaderCell>
            {checked ? <Table.HeaderCell></Table.HeaderCell> : null}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.templates.map((template, i) => {
            if (checked && account !== template.account) return null;
            return (
              <Table.Row
                style={
                  activeKey === template.id
                    ? { fontWeight: "bold" }
                    : { fontWeight: "normal" }
                }
                key={i}
                id={`row-${i}`}
              >
                <Table.Cell width={10}>
                  <span
                    className="fake-link"
                    onClick={() => {
                      setActiveKey(template.id);
                      setTemplate({ name: template.name, id: template.id });
                    }}
                  >
                    {template.name}
                  </span>
                </Table.Cell>
                <Table.Cell width={6}>
                  {template.createdAt.substring(0, 10)}
                </Table.Cell>
                {checked ? (
                  <Table.Cell>
                    <Icon
                      onClick={() => remove(template, i)}
                      name="x"
                      color="red"
                      className="fake-link"
                    />
                  </Table.Cell>
                ) : null}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
}
