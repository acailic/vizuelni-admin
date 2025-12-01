import { Trans, t } from '@lingui/macro';

export const TestComponent = () => {
  const message = t`Hello World`;

  return (
    <div>
      <Trans id="test.greeting">Hello, this is a test</Trans>
      <p>{message}</p>
    </div>
  );
};
