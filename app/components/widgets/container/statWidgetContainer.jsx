import React from 'react';
import StatWidgetHeader from '../container/statWidgetHeader.jsx';
import StatWidgetBody from './statWidgetBody.jsx';

export default class StatWidgetContainer extends React.Component {
    constructor(props) {
        super(props);
        this.widgetOptions = {
            showHeader: this.props.showHeader || true,
            ownerDraw: this.props.ownerDraw || false,
            looseLayout: this.props.looseLayout || false,
            phantomMode: this.props.phantomMode || false,
            fluidHeight: this.props.fluidHeight || false,
            title: this.props.title || 'Unknown Widget',
        };
    }

    render() {
        let widgetHeader = null;
        let widgetBodyRender = null;

        if (this.widgetOptions.ownerDraw) {
            if (!this.widgetOptions.looseLayout && process.env.NODE_ENV === 'development') {
                for (let i = 0; i < this.props.children.length; ++i) {
                    const renderer = this.props.children[i];
                    if (renderer.type.name !== 'StatWidgetBody' && renderer.type.name !== 'StatWidgetHeader'
                        && renderer.type.name !== 'StatWidgetFooter') {
                            throw new Error('Invalid usage pattern of owner drawn stat widgets. Please embed your control within a stat widget header, body or footer.');
                    }
                }
            }
            widgetBodyRender = this.props.children;
        } else {
            if (this.widgetOptions.showHeader) {
                widgetHeader = (
                    <StatWidgetHeader title={this.widgetOptions.title} />
                );
            }

            let content = this.props.children;

            if (this.widgetOptions.phantomMode) {
                content = (
                    <h1 className="phantom-glow">No Content</h1>
                );
            }

            widgetBodyRender = (
                <StatWidgetBody>
                    {content}
                </StatWidgetBody>
            );
        }

        return (
            <div className={`card border border-dark stat-widget-container ${this.widgetOptions.fluidHeight ? '': ''}`}>
                {widgetHeader}
                {widgetBodyRender}
            </div>
        );
    }
}
