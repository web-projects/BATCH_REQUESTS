import fs from 'fs';
import path from 'path';
import { reject } from 'underscore';
import * as logger from './logger';
import ServerUtils from './serverUtils';
// import GeneralUtils from '../core/utils/generalUtils';

export default class Grip {
    constructor() {
        this.indexPage = '';
    }

    executeSetup() {
        const weakSelf = this;
        return new Promise((resolve) => {
            // Load up the index page.
            weakSelf.indexPage = fs.readFileSync(
                (process.env.NODE_ENV === 'development')
                ? './build/index.html'
                : path.join(__dirname, 'index.html'), 'utf8',
            );

            resolve(null);
        }).catch((error) => {
            logger.log2_e('An error occurred while loading up {{ GRIP }}');
            logger.log2_e(error);

            reject(error);
        });
    }

    getDefaultInfo() {
        return {
            title: 'IPA5 Dashboard',
            description: '',
            keywords: '',
        };
    }

    getHomepageInfo() {
        return {
            title: 'IPA5 Dashboard',
            description: '',
            keywords: '',
        };
    }

    getLoginPageInfo() {
        return {
            title: 'IPA5 Dashboard - Sign In',
            description: '',
            keywords: '',
        };
    }

    getLoginFailureInfo() {
        return {
            title: 'Login failure',
            description: '',
            keywords: '',
        };
    }

    getLogoutInfo() {
        return {
            title: 'Logged out',
            description: '',
            keywords: '',
        };
    }

    getDevicesInfo() {
        return {
            title: 'Devices',
            description: '',
            keywords: '',
        };
    }

    render(item) {
        const pageItem = item === null ? this.getDefaultInfo() : item;

        const renderedTitle = ServerUtils.isNullOrEmpty(pageItem.title) ? 'IPA5 Dashboard' : pageItem.title;
        const renderedDescription = ServerUtils.isNullOrEmpty(pageItem.description) ? '' : pageItem.description;
        const renderedKeywords = ServerUtils.isNullOrEmpty(pageItem.keywords) ? '' : pageItem.keywords;

        let renderedHtmlPage = this.indexPage.replace('{{TITLE}}', renderedTitle);
        renderedHtmlPage = renderedHtmlPage.replace('{{DESCRIPTION}}', renderedDescription);
        renderedHtmlPage = renderedHtmlPage.replace('{{KEYWORDS}}', renderedKeywords);

        return renderedHtmlPage;
    }
}
