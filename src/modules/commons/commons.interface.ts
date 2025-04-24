import { PAGES_SCREENS_NAMES } from './commons.constant';
import { TypeForm } from './commons.enum';
export type PageScreenName =
  (typeof PAGES_SCREENS_NAMES)[keyof typeof PAGES_SCREENS_NAMES];
interface Fields {
  type: string;
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
}
interface SubmitButton {
  label: string;
  action: string;
}
interface Props {
  title: string;
  fields: Fields[];
  submitButton: SubmitButton;
}
export interface CommonInterfaceFormScreen {
  type: TypeForm;
  screen: PageScreenName;
  props: Props;
}
