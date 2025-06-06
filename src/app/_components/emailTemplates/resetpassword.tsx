import toCapitalized from "@/app/_lib/toCapitalized";
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
  userFirstName?: string;
  resetPasswordLink?: string;
}

export const ResetPasswordEmail = ({
  userFirstName = "Gregg",
  resetPasswordLink,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>AutoClient: reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* <Img
            src={`${process.env.BASE_DOMAIN}/public/assets/logo.png`}
            
            height={40}
            alt="Happy Client"
          /> */}
          <Section>
            <Text style={text}>Hi {toCapitalized(userFirstName)},</Text>
            <Text style={text}>
              Someone recently requested a password change for your <br />
              <strong>Happy Client </strong>
              account. If this was you, you can set a new password here:
            </Text>
            <Button style={button} href={resetPasswordLink}>
              Reset password
            </Button>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={resetPasswordLink} className="text-blue-600 no-underline">
                {resetPasswordLink}
              </Link>
            </Text>
            <Text style={text}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Text style={text}>
              To keep your account secure, please do <b>NOT</b> forward this
              email to anyone.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#5110de",
  borderRadius: "4px",
  color: "#000",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};