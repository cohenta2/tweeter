import "./App.css";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure({
  // aws_cognito_region: "us-east-1", // (required) - Region where Amazon Cognito project was created
  aws_user_pools_id: process.env.REACT_APP_USER_POOL_ID, // (optional) -  Amazon Cognito User Pool ID
  aws_user_pools_web_client_id: process.env.REACT_APP_WEB_CLIENT, // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)
  aws_mandatory_sign_in: "enable",
});

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
