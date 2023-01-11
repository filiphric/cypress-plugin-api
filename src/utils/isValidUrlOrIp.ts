import { isValidUrl } from "@utils/isValidUrl";
import { isValidIp } from "@utils/isValidIp";

export const isValidUrlOrIp = (str: string) => {
  return isValidUrl(str) || isValidIp(str)
}
