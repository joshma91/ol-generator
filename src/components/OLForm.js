import React from "react";
import { APIClient, Openlaw } from "openlaw";
import { Container, Loader, Button, Message } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "openlaw-elements/dist/openlaw-elements.min.css";
import OpenLawForm from "openlaw-elements";
import AgreementPreview from "./AgreementPreview";
import "../App.css";

const openLawConfig = {
  server: process.env.REACT_APP_URL,
  userName: process.env.REACT_APP_OPENLAW_USER,
  password: process.env.REACT_APP_OPENLAW_PASSWORD
};

const apiClient = new APIClient(openLawConfig.server);

class OLForm extends React.Component {
  constructor({ templateName }) {
    super();
    const template = templateName.trim();
    this.state = { templateName: template };
  }

  //initial state of variables for Assignment Template, and web3,etc
  state = {
    // State variables for OpenLaw
    title: "",
    template: "",
    creatorId: "",
    compiledTemplate: null,
    parameters: {},
    executionResult: null,
    variables: null,
    draftId: "",

    isError: false,

    // State variables for preview component
    previewHTML: null,
    loading: false,
    success: false
  };

  componentDidMount = async () => {
    this.props.setLoadSuccess(null);
    try {
      //const { web3, accounts, contract } = this.props;
      //create an instance of the API client with url as parameter
      apiClient.login(openLawConfig.userName, openLawConfig.password);

      //Retrieve your OpenLaw template by name, use async/await
      const template = await apiClient.getTemplate(this.state.templateName);

      //pull properties off of JSON and make into variables
      const title = template.title;

      //Retreive the OpenLaw Template, including MarkDown
      const content = template.content;

      //Get the most recent version of the OpenLaw API Tutorial Template
      const versions = await apiClient.getTemplateVersions(
        this.state.templateName,
        20,
        1
      );

      //Get the creatorID from the template.
      const creatorId = versions[0].creatorId;

      //Get my compiled Template, for use in rendering the HTML in previewTemplate
      const compiledTemplate = await Openlaw.compileTemplate(content);
      if (compiledTemplate.isError) {
        throw "template error" + compiledTemplate.errorMessage;
      }

      const parameters = {};
      const { executionResult, errorMessage } = await Openlaw.execute(
        compiledTemplate.compiledTemplate,
        {},
        parameters
      );

      const variables = await Openlaw.getExecutedVariables(executionResult, {});

      this.setState({
        title,
        template,
        creatorId,
        compiledTemplate,
        parameters,
        executionResult,
        variables
      });

      this.props.setLoadSuccess(true);
    } catch (err) {
      // ** This is helpful for logging in development, or throwing exceptions at runtime.

      this.props.setLoadSuccess(false);
      this.setState({ isError: true });
    }
  };

  onChange = (key, value) => {
    const { compiledTemplate } = this.state;
    const parameters = key
      ? {
          ...this.state.parameters,
          [key]: value
        }
      : this.state.parameters;

    const { executionResult, errorMessage } = Openlaw.execute(
      compiledTemplate.compiledTemplate,
      {},
      parameters
    );
    const variables = Openlaw.getExecutedVariables(executionResult, {});
    this.setState({ parameters, variables, executionResult });
  };

  setTemplatePreview = async () => {
    const { parameters, compiledTemplate } = this.state;

    const executionResult = await Openlaw.execute(
      compiledTemplate.compiledTemplate,
      {},
      parameters
    );
    const agreements = await Openlaw.getAgreements(
      executionResult.executionResult
    );
    const previewHTML = await Openlaw.renderForReview(
      agreements[0].agreement,
      {}
    );
    await this.setState({ previewHTML });
    document.getElementById("preview").scrollIntoView({
      behavior: "smooth"
    });
  };

  buildOpenLawParamsObj = async (template, creatorId) => {
    const { parameters, draftId } = this.state;

    const object = {
      templateId: template.id,
      title: template.title,
      text: template.content,
      creator: creatorId,
      parameters,
      overriddenParagraphs: {},
      agreements: {},
      readonlyEmails: [],
      editEmails: [],
      draftId
    };
    return object;
  };

  onSubmit = async () => {
    try {
      //login to api
      this.setState({ loading: true }, async () => {
        apiClient.login(openLawConfig.userName, openLawConfig.password);

        //add Open Law params to be uploaded
        const uploadParams = await this.buildOpenLawParamsObj(
          this.state.template,
          this.state.creatorId
        );

        //uploadDraft, sends a draft contract to "Draft Management", which can be edited.
        const draftId = await apiClient.uploadDraft(uploadParams);

        const contractParams = {
          ...uploadParams,
          draftId
        };

        const contractId = await apiClient.uploadContract(contractParams);

        await apiClient.sendContract([], [], contractId);

        await this.setState({ loading: false, success: true, draftId });
        document.getElementById("success").scrollIntoView({
          behavior: "smooth"
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {
      variables,
      parameters,
      executionResult,
      previewHTML,
      loading,
      success,
      isError
    } = this.state;
    if (isError) return null;
    if (!executionResult) return <Loader active />;

    return (
      <Container text style={{ marginTop: "2em" }}>
        <h1>{this.state.templateName.toUpperCase()}</h1>
        <OpenLawForm
          apiClient={apiClient}
          executionResult={executionResult}
          parameters={parameters}
          onChangeFunction={this.onChange}
          openLaw={Openlaw}
          variables={variables}
        />
        <div className="button-group">
          <Button onClick={this.setTemplatePreview}>Preview</Button>
          <Button primary loading={loading} onClick={this.onSubmit}>
            Submit
          </Button>
        </div>

        <Message
          style={success ? { display: "block" } : { display: "none" }}
          className="success-message"
          positive
          id="success"
        >
          <Message.Header>Submission Successful</Message.Header>
          <p>
            Check your <b>e-mail</b> to sign contract
          </p>
        </Message>
        <AgreementPreview id="preview" previewHTML={previewHTML} />
      </Container>
    );
  }
}

export default OLForm;
