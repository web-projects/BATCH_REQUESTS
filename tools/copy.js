import path from 'path';
import ncp from 'graceful-ncp';

/**
 * Copies all dependencies of Maltese to the output (build) folder.
 */
async function copy({ watch } = {}) {
  const basePath = path.join(__dirname, '..'); 
  console.log('Base Path located at ' + basePath);

  const targetPath = path.join(basePath, 'build'); 
  console.log('Target Path located at ' + targetPath);

   // Move the ecosystem file for Azure Deployment.
   console.log("Moving ecosystem file");
   let ecosystemPath = path.join(targetPath, 'ecosystem.json');
   await ncp(path.join(basePath, 'ecosystem.json'), ecosystemPath);
}

export default copy;
