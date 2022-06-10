import React from 'react';
import GlobalHeader from '../components/globalHeader.jsx';
import GlobalNavBar from '../components/globalNavBar.jsx';

export default class MasterPageLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const layoutClass = (this.props.isFluid) ? 'container-fluid' : 'container';
        return (
            <div>
                <header>
                    <GlobalNavBar />
                    <GlobalHeader />
                </header>
                <main style={{marginTop: '58px'}}>
                    <div className={layoutClass} style={{overflow: 'hidden'}}>
                        <h1 className="h3 text-center py-5 mb-0">{this.props.pageTitle}</h1>
                        {this.props.children}
                    </div>
                </main>
            </div>
        );
    }
}
