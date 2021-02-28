import { ValidatedCLIOptions } from './options';
import createAdditionalDirectories from './steps/create-additional-directories';
import createFilesFromTemplates from './steps/create-files-from-templates';
import createProgrammaticFiles from './steps/create-programmatic-files';
import createWorkingDir from './steps/create-working-dir';
import getPreset from './steps/get-preset';
import initializeGit from './steps/initialize-git';
import selectTypeIfNeeded from './steps/select-type-if-needed';

export default async (
  name: string,
  targetDirectory: string,
  validatedCLIOptions: ValidatedCLIOptions,
): Promise<void> => {
  const options = await selectTypeIfNeeded(validatedCLIOptions);
  await createWorkingDir(targetDirectory, options);
  const preset = await getPreset(name, options);
  await createProgrammaticFiles(targetDirectory, preset);
  await createFilesFromTemplates(name, targetDirectory, options, preset);
  await createAdditionalDirectories(targetDirectory, options, preset);
  await initializeGit(targetDirectory, options);
};
