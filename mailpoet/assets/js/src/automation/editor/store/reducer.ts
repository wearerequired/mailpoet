import { Action } from '@wordpress/data';
import { State } from './types';

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_INSERTER_SIDEBAR':
      return {
        ...state,
        inserterSidebar: {
          ...state.inserterSidebar,
          isOpened: !state.inserterSidebar.isOpened,
        },
      };
    case 'SET_INSERTER_POPOVER_ANCHOR':
      return {
        ...state,
        inserterPopover: {
          ...state.inserterPopover,
          anchor: action.anchor,
        },
      };
    case 'SET_SELECTED_STEP':
      return {
        ...state,
        selectedStep: action.value,
      };
    case 'UPDATE_WORKFLOW':
      return {
        ...state,
        workflowData: action.workflow,
        workflowSaved: false,
      };
    case 'SAVE':
      return {
        ...state,
        workflowData: action.workflow,
        workflowSaved: true,
      };
    case 'ACTIVATE':
      return {
        ...state,
        workflowData: action.workflow,
        workflowSaved: true,
      };
    case 'REGISTER_STEP_TYPE':
      return {
        ...state,
        stepTypes: {
          ...state.stepTypes,
          [action.stepType.key]: action.stepType,
        },
      };
    case 'UPDATE_STEP_NAME': {
      const step = {
        ...state.workflowData.steps[action.stepId],
        name: action.name,
      };
      return {
        ...state,
        workflowData: {
          ...state.workflowData,
          steps: {
            ...state.workflowData.steps,
            [action.stepId]: step,
          },
        },
        workflowSaved: false,
        selectedStep: step,
      };
    }
    case 'UPDATE_STEP_ARGS': {
      const prevArgs = state.workflowData.steps[action.stepId].args ?? {};

      const value =
        typeof action.value === 'function'
          ? action.value(prevArgs[action.name] ?? undefined)
          : action.value;

      const args = {
        ...prevArgs,
        [action.name]: value,
      };

      const step = { ...state.workflowData.steps[action.stepId], args };

      return {
        ...state,
        workflowData: {
          ...state.workflowData,
          steps: {
            ...state.workflowData.steps,
            [action.stepId]: step,
          },
        },
        workflowSaved: false,
        selectedStep: step,
      };
    }
    default:
      return state;
  }
}
