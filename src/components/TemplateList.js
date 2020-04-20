import React, { useState, useEffect } from "react";
import { Table } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "openlaw-elements/dist/openlaw-elements.min.css";

export default function TemplateList({ loading, error, data, setTemplate }) {
  const [activeKey, setActiveKey] = useState(null);

  if (loading) return "Loading...";
  if (error) return "There was an error loading the templates :(";
  if (!data || !data.templates || !data.templates.length) return "No templates";

  return (
    <>
      <Table celled striped collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>OpenLaw Template</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.templates.map((template, i) => {
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
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
}
