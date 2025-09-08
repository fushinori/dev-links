import {
  Body,
  Button,
  Container,
  Html,
  Head,
  Heading,
  Hr,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "@react-email/components";

interface Props {
  url: string;
}

const baseUrl = `https://${process.env.YOUR_DOMAIN}`;

export default function VerifyEmail({ url }: Props) {
  const verifyUrl = `${baseUrl}${url}`;
  return (
    <Html>
      <Head>
        <style>
          {`
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap');
            *{
            font-family: 'Instrument Sans', sans-serif;
            }`}
        </style>
      </Head>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: "#633CFF",
              },
            },
          },
        }}
      >
        <Body className="mx-auto my-auto bg-white px-2">
          <Preview>Dev Links Email Verification</Preview>
          <Container className="my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Section className="mt-[16px]">
              <Img
                src={`${baseUrl}/dev-links-logo.png`}
                width="40"
                height="40"
                alt="Dev Links"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 font-bold text-[24px] text-black">
              Verify your email
            </Heading>
            <Hr />
            <Text className="text-[15px]">
              Glad to have you on board! Please click the button below to verify
              your email address and finish setting up your account.
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded-lg bg-brand px-5 py-3 text-center text-white cursor-pointer font-bold"
                href={verifyUrl}
              >
                Verify email
              </Button>
            </Section>
            <Text className="text-[15px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={verifyUrl} className="text-blue-600 no-underline">
                {verifyUrl}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
