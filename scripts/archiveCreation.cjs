const fs = require('fs/promises');
const fsStd = require('fs');
const { execSync } = require('child_process');
const ARCH_URL = 'https://archives.bgee.org/';

const main = async () => {
  try {
    let config = await fs.readFile('./src/config.json', 'utf8');
    config = JSON.parse(config);
    const APP_VERSION = config.version;
    const URL_VERSION = APP_VERSION.replaceAll('.', '-');
    const buildDirectory = `./archives/${APP_VERSION}-archived`;
    if (fsStd.existsSync(buildDirectory)) {
      console.log('\x1b[31m%s\x1b[0m', `[ABORT] An archive already exists for the version ${APP_VERSION}`);
      return;
    }
    config.archive = true;
    const originalImageDomain = config.imageDomain;
    const originalGenericDomain = config.genericDomain;
    const originalPermanentVersionedDomain = config.permanentVersionedDomain;
    const originalApiDomain = config.apiDomain;
    const originalFtpDomain = config.ftpDomain;
    config.imageDomain = `/${URL_VERSION}${config.imageDomain}`;
    config.genericDomain = `${ARCH_URL}${URL_VERSION}`;
    config.permanentVersionedDomain = `${ARCH_URL}${URL_VERSION}`;
    config.apiDomain = `${ARCH_URL}api-${URL_VERSION}`;
    config.ftpDomain = `${ARCH_URL}ftp/${URL_VERSION}`;
    const websiteUrl = `${config.genericDomain}`;
    await fs.writeFile('./src/config.json', JSON.stringify(config, null, 2));
    console.log('Setting config as an archive');

    const scss = await fs.readFile('./src/styles/global.scss', 'utf8');
    const tmpScss = scss
      .replace('$archive: false;', '$archive: true;')
      .replace('/img/external-link', `/${URL_VERSION}/img/external-link`);
    await fs.writeFile('./src/styles/global.scss', tmpScss);
    console.log('Setting scss as an archive');

    // FIXME  how to add that in SSR index ???
    const noIndexSource = await fs.readFile('./archives/resources/htmlHead.txt', 'utf8');

    const robots = await fs.readFile('./public/robots.txt', 'utf8');
    let tmprobots = 'User-agent: *\nDisallow: /\n';
    await fs.writeFile('./public/robots.txt', tmprobots);
    console.log('Setting proper archived robots.txt file\n');

    try {
      console.log('\x1b[31m%s\x1b[0m', 'Building app');
      // ARCHIVE_BASE: serve JS/CSS and routes under /<URL_VERSION>/ (vite.config.ts, react-router.config.ts).
      // BUILD_DIR: build straight into the archive directory, without moving it afterwards, so that the
      // asset path stored in the server build is right (react-router.config.ts, scripts/fix_symlinks.sh).
      // `npm run build` already runs scripts/fix_symlinks.sh
      execSync('npm run build', {
        stdio: 'inherit',
        env: { ...process.env, ARCHIVE_BASE: `/${URL_VERSION}/`, BUILD_DIR: buildDirectory },
      });
      console.log('Removing unnecessary directories\n');
      execSync('rm -fr coverage', { stdio: 'inherit' });
    } catch (err) {
      console.log('Error =>', err);
    }

    //  Set back to production
    console.log('\x1b[31m%s\x1b[0m', 'Settings production data back\n');
    config.archive = false;
    config.imageDomain = originalImageDomain;
    config.genericDomain = originalGenericDomain;
    config.permanentVersionedDomain = originalPermanentVersionedDomain;
    config.apiDomain = originalApiDomain;
    config.ftpDomain = originalFtpDomain;
    await fs.writeFile('./src/config.json', JSON.stringify(config, null, 2));
    await fs.writeFile('./src/styles/global.scss', scss);
    await fs.writeFile('./public/robots.txt', robots);
    console.log('\x1b[93m%s %s\x1b[0m\n', 'The website url setup for the archive is', websiteUrl);
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err);
  }
};

main();
