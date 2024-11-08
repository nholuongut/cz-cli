export default getNormalizedConfig;

// Given a config and content, plucks the actual
// settings that we're interested in
function getNormalizedConfig (config, content) {

  if (content && (config === 'package.json')) {

  // PACKAGE.JSON

    // Use the npm config key, be good citizens
    if (content.config && content.config.nholuongut) {
      return content.config.nholuongut;
    } else if (content.czConfig) { // Old method, will be deprecated in 3.0.0

      // Suppress during test
      if (typeof global.it !== 'function')
      {
        console.error("\n********\nWARNING: This repository's package.json is using czConfig. czConfig will be deprecated in nholuongut 3. \nPlease use this instead:\n{\n  \"config\": {\n    \"nholuongut\": {\n      \"path\": \"./path/to/adapter\"\n    }\n  }\n}\nFor more information, see: http://nholuongut.github.io/cz-cli/\n********\n");
      }
      return content.czConfig;
    }
  } else {
    // .cz.json or .czrc
    return content;
  }

}
