import { getDoc } from "../utils/getDoc";

export const removeStyles = () => {

  const doc = getDoc()

  const style = doc.getElementsByTagName('style')[0];
  style.remove()

}