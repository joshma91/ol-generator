import React, { useState, useEffect } from "react";
import { Table, Radio } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "openlaw-elements/dist/openlaw-elements.min.css";

export default function TemplateList({ loading, error, data, setTemplate, account }) {
  const [activeKey, setActiveKey] = useState(null);
  const [checked, setChecked] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>There was an error loading the templates :(</p>;
  if (!data || !data.templates || !data.templates.length)
    return <p>No templates</p>;

  return (
    <>
      <Radio label="show templates I added" toggle value={checked} onClick={() => setChecked(!checked)} />
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>OpenLaw Template</Table.HeaderCell>
            <Table.HeaderCell>Date Added</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.templates.map((template, i) => {
            if(checked && account !== template.account) return null
            return (
              <Table.Row
                style={
                  activeKey === template.id
                    ? { fontWeight: "bold" }
                    : { fontWeight: "normal" }
                }
                key={i}
              >
                <Table.Cell>
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
                <Table.Cell>{template.createdAt.substring(0, 10)}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
}
