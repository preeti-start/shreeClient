import React from 'react';
import PropTypes from 'prop-types'
import { throttle } from 'lodash';

export default class InfiniteScroller extends React.Component {
    static propTypes = {
        isLoading: PropTypes.bool,
        loadMore: PropTypes.func.isRequired,
        scrollThreshold: PropTypes.number,
        scrollableTarget: PropTypes.string.isRequired,
    }

    static defaultProps = {
        isLoading: false,
        scrollThreshold: 0.8,
    }

    constructor(props) {
        super(props);
        this.throttledScroller = throttle(this.onScroll.bind(this), 150);
    }

    componentDidMount() {
        const { scrollableTarget } = this.props;
        if (scrollableTarget) {
            const scrollableElement = document.getElementById(scrollableTarget);
            scrollableElement.addEventListener('scroll', this.throttledScroller);
        }
    }

    componentWillUnmount() {
        const { scrollableTarget } = this.props;
        if (scrollableTarget) {
            const scrollableElement = document.getElementById(scrollableTarget);
            if (scrollableElement) {
                scrollableElement.removeEventListener('scroll', this.throttledScroller);
            }
        }
    }

    onScroll(e) {
        const { scrollThreshold } = this.props;
        const { clientHeight, scrollTop, scrollHeight } = e.target;
        const isElementAtBottom = scrollTop + clientHeight >= scrollThreshold * scrollHeight;
        if (!this.props.isLoading && isElementAtBottom && scrollTop > this.lastScrollTop) {
            this.props.loadMore();
        }
        this.lastScrollTop = scrollTop;
    }

    render() {
        return (
            <div>{this.props.children}</div>
        )
    }
}
