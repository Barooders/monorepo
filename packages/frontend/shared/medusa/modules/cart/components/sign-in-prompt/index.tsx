import LocalizedClientLink from '@/medusa/modules/common/components/localized-client-link';
import { Button, Heading, Text } from '@medusajs/ui';

const SignInPrompt = () => {
  return (
    <div className="flex items-center justify-between bg-white">
      <div>
        <Heading
          level="h2"
          className="txt-xlarge"
        >
          Already have an account?
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          Sign in for a better experience.
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button
            variant="secondary"
            className="h-10"
            data-testid="sign-in-button"
          >
            Sign in
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  );
};

export default SignInPrompt;
