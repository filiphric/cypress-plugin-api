import { getState } from "../utils/getState";
import { getPluginStyle, PLUGIN_STYLE_ID } from "./addStyles";

export const removeStyles = () => {

  const { doc } = getState()

  const style = getPluginStyle(doc, PLUGIN_STYLE_ID);
  style?.remove()

}
