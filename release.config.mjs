/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: [
    'main',
    {
      name: 'beta',
      prerelease: true,
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@anolilab/semantic-release-pnpm',
    [
      '@semantic-release/exec',
      {
        prepareCmd:
          './scripts/update_manifest_version.sh ${nextRelease.version} && ./scripts/update_issue_templates.sh ${nextRelease.version}',
        publishCmd:
          'yarn concurrently --names "CHROME,EDGE,FIREFOX,OPERA" -c "yellow.bold,blue.bold,orange.bold,red.bold" "yarn build:chrome && yarn package:chrome" "yarn build:edge && yarn package:edge" "yarn build:firefox && yarn package:firefox" "yarn build:opera && yarn package:opera"',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          '.github/ISSUE_TEMPLATE/bug_report_template.yml',
          'src/manifest.common.json',
          'package.json',
          'CHANGELOG.md',
        ],
        message:
          'chore(release): ${nextRelease.version}\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: ['dist/*.zip'],
        releasedLabels: ['🚀 released'],
      },
    ],
  ],
};
