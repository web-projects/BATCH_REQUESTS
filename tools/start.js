import run from './run';
import clean from './clean';
import copy from './copy';

async function start() {
    await run(clean);
    await run(copy.bind(undefined, {
        watch: true,
    }));
}

export default start;
