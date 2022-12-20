import { getState } from "../utils/getState";

export const removeStyles = () => {

  const { doc } = getState()

  const style = doc.getElementById('api-plugin-styles');
  style?.remove()

}