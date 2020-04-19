import React, { useState, useEffect } from "react";
import { Button, Form, Input, Divider } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "openlaw-elements/dist/openlaw-elements.min.css";

export default function Template({ loading, error, data }) {
  if (loading) return "Loading...";
  return (
    <>
      hello
    </>
  );
}
