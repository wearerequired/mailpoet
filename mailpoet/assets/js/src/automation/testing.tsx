import { ReactNode } from 'react';
import { useMutation } from './api';
import { id } from './id';
import { NextStep, Step, Workflow } from './editor/components/workflow/types';

export const createRootStep = (nextSteps: NextStep[]): Step => ({
  id: 'root',
  type: 'root',
  key: 'core:root',
  args: {},
  next_steps: nextSteps,
});

export const createEmptyTrigger = (): Step => ({
  id: id(),
  type: 'trigger',
  key: 'core:empty',
  args: {},
  next_steps: [],
});

const createWorkflow = (): Partial<Workflow> => {
  const emptyTrigger = createEmptyTrigger();
  return {
    name: 'Empty workflow',
    steps: {
      root: createRootStep([{ id: emptyTrigger.id }]),
      [emptyTrigger.id]: emptyTrigger,
    },
  };
};

export function CreateEmptyWorkflowButton(): JSX.Element {
  const [createSchema, { loading, error }] = useMutation('workflows', {
    method: 'POST',
  });

  return (
    <div>
      <button
        className="button"
        type="button"
        onClick={async () => {
          await createSchema({
            body: JSON.stringify(createWorkflow()),
          });
          window.location.reload();
        }}
        disabled={loading}
      >
        Create empty workflow (premium required)
      </button>
      {error && (
        <div>{error?.data?.message ?? 'An unknown error occurred'}</div>
      )}
    </div>
  );
}

type TemplateButtonProps = {
  slug: string;
  children?: ReactNode;
};

export function CreateWorkflowFromTemplateButton({
  slug,
  children,
}: TemplateButtonProps): JSX.Element {
  const [createWorkflowFromTemplate, { loading, error }] = useMutation(
    'workflows/create-from-template',
    {
      method: 'POST',
      body: JSON.stringify({
        slug,
      }),
    },
  );

  return (
    <div>
      <button
        className="button button-primary"
        type="button"
        onClick={async () => {
          await createWorkflowFromTemplate();
          window.location.reload();
        }}
        disabled={loading}
      >
        {children}
      </button>
      {error && (
        <div>{error?.data?.message ?? 'An unknown error occurred'}</div>
      )}
    </div>
  );
}
