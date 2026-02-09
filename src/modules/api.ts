import { resolveOptions } from '@utils/resolveOptions';
import { ApiRequestOptions } from '../types';
import { anonymize } from '@utils/anonymize';
import { handleResponse } from '@modules/handleResponse';
import { initialize } from './initialize';
import { transformData } from './transformData';
import { cloneProps } from './cloneProps';
import { getPluginConfig } from '@utils/pluginConfig';

const requestFn = cy.request.bind({})

export const api = (...params: Partial<ApiRequestOptions>[]) => {

  const { props, app } = initialize()
  const options: ApiRequestOptions = resolveOptions(...params)
  const index = props.length - 1
  cloneProps(props, index, options)
  // Only mask when hideCredentials is explicitly true (e.g. when using cy.env() for secrets or in CI). Default off so locals can see values.
  if (getPluginConfig('hideCredentials')) props[index] = anonymize(props[index])
  transformData(props, index)

  return requestFn({ ...options, log: false }).then(res => handleResponse(res, options, props, index, app))
}