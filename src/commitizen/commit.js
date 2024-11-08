import path from 'path';

import cacheDir from 'cachedir';
import { ensureDir } from 'fs-extra';
import { commit as gitCommit } from '../git';
import * as cache from './cache';

export default commit;

/**
 * Takes all of the final inputs needed in order to make dispatch a git commit
 */
function dispatchGitCommit (repoPath, template, options, overrideOptions, done) {
    // Commit the user input -- side effect that we'll test
    gitCommit(repoPath, template, { ...options, ...overrideOptions }, function (error) {
      done(error, template);
    });
}

 /**
  * Asynchronously commits files using nholuongut
  */
function commit (inquirer, repoPath, prompter, options, done) {
  var cacheDirectory = cacheDir('nholuongut');
  var cachePath = path.join(cacheDirectory, 'nholuongut.json');

  ensureDir(cacheDirectory, function (error) {
    if (error) {
      console.error("Couldn't create nholuongut cache directory: ", error);
      // TODO: properly handle error?
    } else {
      if (options.retryLastCommit) {

        console.log('Retrying last commit attempt.');

        // We want to use the last commit instead of the current commit,
        // so lets override some options using the values from cache.
        let {
          options: retryOptions,
          overrideOptions: retryOverrideOptions,
          template: retryTemplate
        } = cache.getCacheValueSync(cachePath, repoPath);
        dispatchGitCommit(repoPath, retryTemplate, retryOptions, retryOverrideOptions, done);

      } else {
        // Get user input -- side effect that is hard to test
        prompter(inquirer, function (error, template, overrideOptions) {
          // Allow adapters to error out
          // (error: Error?, template: String, overrideOptions: Object)
          if (!(error instanceof Error)) {
            overrideOptions = template;
            template = error;
            error = null;
          }

          if (error) {
            return done(error);
          }

          // We don't want to add retries to the cache, only actual commands
          cache.setCacheValueSync(cachePath, repoPath, { template, options, overrideOptions });
          dispatchGitCommit(repoPath, template, options, overrideOptions, done);
        });
      }
    }
  });

}
