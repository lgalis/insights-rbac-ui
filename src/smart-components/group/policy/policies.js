import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { expandable } from '@patternfly/react-table';
import AddPolicyWizard from './add-policy/add-policy-wizard';
import EditPolicy from './add-policy/edit-policy-modal';
import { TableToolbarView } from '../../../presentational-components/shared/table-toolbar-view';
import RemovePolicy from './../policy/add-policy/remove-policy-modal';
import { createRows } from './policy-table-helpers';
import { fetchGroupPolicies } from '../../../redux/actions/policy-actions';

const columns = [{ title: 'Name', cellFormatters: [ expandable ]}, 'Description', 'Roles', 'Created', 'Modified' ];

const GroupPolicies = ({ fetchGroupPolicies, policies, pagination }) => {
  const [ filterValue, setFilterValue ] = useState('');
  const fetchData = (setRows) => {
    fetchGroupPolicies().then(({ value: { data }}) => setRows(createRows(data, filterValue)));
  };

  const routes = () => <Fragment>
    <Route exact path="/policies/add_policy/:id" render={ props => <AddPolicyWizard { ...props }
      postMethod={ fetchGroupPolicies } /> }/>
    <Route exact path="/policies/edit/:id" render={ props => <EditPolicy { ...props }
      postMethod={ fetchGroupPolicies }/> } />
    <Route exact path="/policies/deny/:id" render={ props => <RemovePolicy { ...props }
      postMethod={ fetchGroupPolicies }/> } />
  </Fragment>;

  /*const actionResolver = (_policyData, { rowIndex }) =>
    rowIndex % 2 === 1 ? null :
      [
        {
          title: 'Edit',
          onClick: (_event, _rowId, policy) =>
            history.push(`/policies/edit/${policy.uuid}`)
        },
        {
          title: 'Delete',
          style: { color: 'var(--pf-global--danger-color--100)'	},
          onClick: (_event, _rowId, policy) =>
            history.push(`/policies/remove/${policy.uuid}`)
        }
      ];*/

  return (
    <Fragment>
      <TableToolbarView
        data={ policies }
        createRows={ createRows }
        columns={ columns }
        fetchData={ fetchData }
        request={ fetchGroupPolicies }
        routes={ routes }
        titlePlural="policies"
        titleSingular="policy"
        pagination={ pagination }
        filterValue={ filterValue }
        setFilterValue={ setFilterValue }
      />
    </Fragment>);
};

const mapStateToProps = ({ policyReducer: { policies, filterValue, isLoading }}) => ({
  policies: policies.data,
  pagination: policies.meta,
  isLoading,
  searchFilter: filterValue
});

const mapDispatchToProps = dispatch => {
  return {
    fetchGroupPolicies: apiProps => dispatch(fetchGroupPolicies(apiProps))
  };
};

GroupPolicies.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  }),
  policies: PropTypes.array,
  platforms: PropTypes.array,
  isLoading: PropTypes.bool,
  searchFilter: PropTypes.string,
  fetchGroupPolicies: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    limit: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired
  })
};

GroupPolicies.defaultProps = {
  policies: [],
  pagination: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupPolicies);
