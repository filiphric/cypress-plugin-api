import { getState } from "../utils/getState";

export const removeStyles = () => {

  const { doc } = getState()

  const style = doc.getElementsByTagName('style')[0];
  style.remove()

}