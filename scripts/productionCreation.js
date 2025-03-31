/* eslint-disable no-console */
const fs = require('fs/promises');
const fsStd = require('fs');
const { execSync } = require('child_process');
const ANNOT_URL = 'annotations.bgee.org';
const DEV_URL = 'http://dbbgee.unil.ch';

const main = async () => {
  try {
    let config = await fs.readFile('./src/config.json', 'utf8');
    config = JSON.parse(config);
    if (config.isRawDataOnly && config.isDevOnly) {
      console.log('Try to build RawData and Dev at the same time!');
      return;
    }
    const originalGenericDomain = config.genericDomain;
    const originalPermanentVersionedDomain = config.permanentVersionedDomain;
    const originalApiDomain = config.apiDomain;
    const originalFtpDomain = config.ftpDomain;
    if (config.isRawDataOnly) {
      /* Change root URLs */
      config.genericDomain = config.genericDomain.replace('www.bgee.org', `${ANNOT_URL}`);
      config.permanentVersionedDomain = config.permanentVersionedDomain.replace('www.bgee.org', `${ANNOT_URL}`);
      config.apiDomain = config.apiDomain.replace('www.bgee.org', `${ANNOT_URL}`);
      config.ftpDomain = config.ftpDomain.replace('www.bgee.org', `${ANNOT_URL}`);
      /* Change API URL */
      const API_VERSION = config.version;
      const API_DOMAIN = API_VERSION.replaceAll('.', '-');
      config.apiDomain = config.apiDomain.replace('/api', `/api-${API_DOMAIN}`);
      /* Write modified config.json */
      await fs.writeFile('./src/config.json', JSON.stringify(config, null, 2));
      console.log('Setting config as annotations');
    }
    if (config.isDevOnly) {
      /* Change root URLs */
      config.genericDomain = config.genericDomain.replace('https://www.bgee.org', `${DEV_URL}`);
      config.permanentVersionedDomain = config.permanentVersionedDomain.replace('https://www.bgee.org', `${DEV_URL}`);
      config.apiDomain = config.apiDomain.replace('https://www.bgee.org', `${DEV_URL}`);
      config.ftpDomain = config.ftpDomain.replace('https://www.bgee.org', `${DEV_URL}`);
      /* Write modified config.json */
      await fs.writeFile('./src/config.json', JSON.stringify(config, null, 2));
      console.log('Setting config as dev/test');
    }

    const scss = await fs.readFile('./src/styles/global.scss', 'utf8');

    const html = await fs.readFile('./public/index.html', 'utf8');
    const noIndexSource = await fs.readFile(
      './archives/resources/htmlHead.txt',
      'utf8'
    );

    let pkg = await fs.readFile('./package.json', 'utf8');
    pkg = JSON.parse(pkg);

    console.log('Checking production attributes\n');
    let prod = true;
    if (config.archive) {
      prod = false;
      console.log(
        '\x1b[31m[ERROR] %s\x1b[0m',
        'config.json is set as an archive'
      );
    }
    if (scss.indexOf('$archive: false;') === -1) {
      prod = false;
      console.log(
        '\x1b[31m[ERROR] %s\x1b[0m',
        'styles.scss is set as an archive'
      );
    }
    if (html.indexOf(noIndexSource) !== -1) {
      prod = false;
      console.log(
        '\x1b[31m[ERROR] %s\x1b[0m',
        'noindex meta tag are put in public/index.html'
      );
    }
    if (pkg.homepage) {
      prod = false;
      console.log(
        '\x1b[31m[ERROR] %s\x1b[0m',
        'Unwanted "homepage" key is defined in package.json'
      );
    }

    if (!prod) {
      console.log('Problem with prod environement : Canceling build');
      return;
    }
    const paths = await fs.readFile('./src/routes/paths.js', 'utf8');
    if (config.isRawDataOnly) {
      console.log('\x1b[31m%s\x1b[0m', 'Annotation/Raw data interface settings');
      /* Change the default homepage for the Annotation/Raw data interface */
      const pathsTmp = paths.replace('HOME: `${URL_ROOT}/`', 'HOME: `${URL_ROOT}/search/raw-data`');
      await fs.writeFile('./src/routes/paths.js', pathsTmp);
    }

    console.log('\x1b[31m%s\x1b[0m', 'Building app');
    execSync('yarn build:cra', { stdio: 'inherit' });
    /* Fix symlinks manually because 'webpackConfig.resolve.symlinks = false;' & '"preserveSymlinks": true,' fail! */
    execSync('sh fix_symlinks.sh');
    if (config.isRawDataOnly) {
      /* Back to default */
      await fs.writeFile('./src/routes/paths.js', paths);
      config.genericDomain = originalGenericDomain;
      config.permanentVersionedDomain = originalPermanentVersionedDomain;
      config.apiDomain = originalApiDomain;
      config.ftpDomain = originalFtpDomain;
      await fs.writeFile('./src/config.json', JSON.stringify(config, null, 2));
    }
    if (config.isDevOnly) {
      /* Back to default */
      config.genericDomain = originalGenericDomain;
      config.permanentVersionedDomain = originalPermanentVersionedDomain;
      config.apiDomain = originalApiDomain;
      config.ftpDomain = originalFtpDomain;
      await fs.writeFile('./src/config.json', JSON.stringify(config, null, 2));
    }
    console.log('\x1b[31m%s\x1b[0m\n', 'App built successfully');
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', 'CATCH ! Error occured when building');
    console.log('\x1b[31m%s\x1b[0m', err);
    process.exit(1);
  }
};

main();
