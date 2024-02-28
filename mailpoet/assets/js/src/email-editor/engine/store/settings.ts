import { EmailEditorSettings, EmailStyles, EmailEditorLayout } from './types';

export function getEditorSettings(): EmailEditorSettings {
  return window.MailPoetEmailEditor.editor_settings as EmailEditorSettings;
}

export function getEmailStyles(): EmailStyles {
  return window.MailPoetEmailEditor.email_styles as EmailStyles;
}

export function getEditorLayout(): EmailEditorLayout {
  return window.MailPoetEmailEditor.editor_layout as EmailEditorLayout;
}
