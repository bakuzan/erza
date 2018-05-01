import React from 'react'

export default function withAsyncPageLoad(WrappedComponent) {
    return class extends React.Component {
        shouldComponentUpdate(nextProps) {
            const noNextItems = nextProps.items.length === 0;
            return !(nextProps.isFetching && noNextItems);
        }
        render() {
            return <WrappedComponent {...this.props} />
        }
    }
}