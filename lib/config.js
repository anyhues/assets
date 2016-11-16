const path = require('path')
const convict = require('convict')

const featureTests = {
  productionOnly (config) {
    return config.get('env') === 'production'
  },
  developmentOnly (config) {
    return config.get('env') === 'development'
  },
  always (config) {
    return true
  }
}

convict.addFormat({
  name: 'placeholder',
  validate: (val) => { },
  coerce: (val, config) =>
    val.replace(/\$\{([\w\.]+)}/g, (v, m) => config.get(m))
})

convict.addFormat({
  name: 'feature',
  validate: (val) => { },
  coerce: (val, config) => featureTests[val](config)
})

const config = convict({
  rootPath: {
    doc: 'root path',
    format: 'String',
    default: path.resolve(__dirname, '..')
  },
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8235,
    env: 'PORT'
  },
  host: {
    doc: 'development host address',
    format: 'ipaddress',
    default: '0.0.0.0',
    env: 'HOST',
    arg: 'host'
  },
  tmpPath: {
    doc: 'tmp path',
    format: 'String',
    default: 'tmp'
  },
  buildPath: {
    doc: 'development buildribution path',
    format: '*',
    default: 'build'
  },
  buildGlob: {
    doc: 'build file glob',
    format: 'placeholder',
    default: '${buildPath}/**/*'
  },
  distPath: {
    doc: 'release dist path',
    format: '*',
    default: './dist'
  },
  distGlob: {
    doc: 'release dist path',
    format: 'placeholder',
    default: '${distPath}/**/*'
  },
  distGzipGlob: {
    doc: 'release dist path',
    format: 'placeholder',
    default: '${distPath}/**/*.{css,js}'
  },
  stylePath: {
    doc: 'style src path',
    format: '*',
    default: './styles'
  },
  styleGlob: {
    doc: 'style glob pattern',
    format: 'placeholder',
    default: '${stylePath}/*.styl'
  },
  styleWatchGlob: {
    doc: 'style glob pattern',
    format: 'placeholder',
    default: '${stylePath}/**/*.styl'
  },
  styleBuildPath: {
    doc: 'style build path',
    format: 'placeholder',
    default: '${buildPath}/css'
  },
  styleBuildGlob: {
    doc: 'style glob pattern inside of build folder',
    format: 'placeholder',
    default: '${styleBuildPath}/**/*.css'
  },
  styleDistPath: {
    doc: 'style build path',
    format: 'placeholder',
    default: '${distPath}/css'
  },
  fontPath: {
    doc: 'font src path',
    format: '*',
    default: './fonts'
  },
  fontGlob: {
    doc: 'font src glob',
    format: 'placeholder',
    default: '${fontPath}/**/*'
  },
  fontBuildPath: {
    doc: 'font build path',
    format: 'placeholder',
    default: '${buildPath}/fonts'
  },
  fontBuildGlob: {
    doc: 'font build glob',
    format: 'placeholder',
    default: '${buildPath}/fonts/**/*'
  },
  fontDistPath: {
    doc: 'font dist path',
    format: 'placeholder',
    default: '${distPath}/fonts'
  },
  imagesPath: {
    doc: 'image src path',
    format: '*',
    default: './images'
  },
  imagesGlob: {
    doc: 'image glob pattern',
    format: 'placeholder',
    default: '${imagesPath}/**/[^_]*.{jpg,jpeg,png,gif,svg}'
  },
  imagesTmpPath: {
    doc: 'image tmp path',
    format: 'placeholder',
    default: '${tmpPath}/images'
  },
  imagesTmpGlob: {
    doc: 'image tmp glob pattern',
    format: 'placeholder',
    default: '${imagesTmpPath}/**/[^_]*.{jpg,jpeg,png,gif,svg}'
  },
  imagesTmpBackupPath: {
    doc: 'image tmp path',
    format: 'placeholder',
    default: '${tmpPath}/images-backup'
  },
  imagesTmpOptimizedPath: {
    doc: 'image tmp path',
    format: 'placeholder',
    default: '${tmpPath}/images-optimized'
  },
  imagesTmpOptimizedGlob: {
    doc: 'image tmp path',
    format: 'placeholder',
    default: '${imagesTmpOptimizedPath}/**/[^_]*.{jpg,jpeg,png,gif,svg}'
  },
  imagesBuildPath: {
    doc: 'image build path',
    format: 'placeholder',
    default: '${buildPath}/images'
  },
  imagesBuildGlob: {
    doc: 'image build glob',
    format: 'placeholder',
    default: '${buildPath}/images/**/[^_]*.{jpg,jpeg,png,gif,svg,xml}'
  },
  imagesDistPath: {
    doc: 'image dist path',
    format: 'placeholder',
    default: '${distPath}/images'
  },
  vendorPath: {
    doc: 'vendor base path',
    format: '*',
    default: './foreign'
  },
  vendorGlob: {
    doc: 'vendor base glob',
    format: 'placeholder',
    default: '${vendorPath}/**/*'
  },
  vendorBuildPath: {
    doc: 'vendor base glob',
    format: 'placeholder',
    default: '${buildPath}/foreign'
  },
  vendorDistPath: {
    doc: 'vendor base glob',
    format: 'placeholder',
    default: '${distPath}/foreign'
  },
  featureImageOptimization: {
    doc: 'decided whether images should be optimized',
    format: 'feature',
    default: 'productionOnly'
  },
  featureSourceMaps: {
    doc: 'decided whether images should be optimized',
    format: 'feature',
    default: 'developmentOnly'
  },
  featurePrefixStyles: {
    doc: 'decided whether images should be optimized',
    format: 'feature',
    default: 'always'
  }
})

const featureToggles = ['featureImageOptimization', 'featureSourceMaps', 'featurePrefixStyles']

// because of the pre-evaluated feature methods, we have to reset the feature-toggles to make them work as expected.
//
// NOTE: because of its nature, a "in-code" toggled feature will not work atm.
featureToggles.forEach((featureToggle) => config.reset(featureToggle))

module.exports = config
