import { createSelector } from 'reselect'
import { isEmpty } from 'ramda'
import { getFormSyncErrors } from 'redux-form'
import { getIsFormValid } from '../hook-form'
import { pageTabs } from './constants'
import { ITabsState } from './types'
import { IState } from '../../store'

const getTabsState = (state: IState): ITabsState => state.tabs

const getInvalidForms = (state: IState): Array<string> =>
  pageTabs.reduce((acc: Array<string>, el: any) => {
    const validForm = getIsFormValid(el.formName)(state)
    const invalidHookForm = validForm !== null && !validForm
    const invalidReduxForm = !isEmpty(getFormSyncErrors(el.formName)(state))
    return invalidHookForm || invalidReduxForm ? [...acc, el.formName] : acc
  }, [])

export const getThereAreInvalidForms = createSelector(
  getInvalidForms,
  invalidForms => !isEmpty(invalidForms),
)

export const getPageTabs = createSelector(
  getInvalidForms,
  getTabsState,
  (invalidForms, tabsState) =>
    pageTabs.map(el => {
      const formIsInvalid = invalidForms.includes(el.formName)
      const isActive = tabsState.active === el.formName
      return { ...el, formIsInvalid, isActive }
    }),
)