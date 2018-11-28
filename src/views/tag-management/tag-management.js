import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import TagManagementList from './tag-management-list';
import TagManagementDetails from './tag-management-details';

import './tag-management.scss';

class TagManagement extends React.Component {
  render() {
    const { match } = this.props;
    if (match && match.isExact) return <Redirect to={`${match.url}list`} />;

    return (
      <Switch>
        <Route path={`${match.url}/list`} component={TagManagementList} />
        <Route path={`${match.url}/:tagId`} component={TagManagementDetails} />
      </Switch>
    );
  }
}

export default TagManagement;
