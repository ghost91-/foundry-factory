import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { Options } from '../options';
import inquirer from 'inquirer';

export default async (targetDirectory: string, { force }: Options): Promise<void> => {
  const spinner = ora('Initializing working directory').start();

  try {
    if (fs.existsSync(targetDirectory)) {
      if (force) {
        await fs.remove(targetDirectory);
      } else {
        spinner.stop();
        const { action }: { action: 'overwrite' | 'merge' | 'cancel' } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `Target directory ${chalk.blue(targetDirectory)} already exists. Pick an action:`,
            choices: [
              { name: 'Overwrite', value: 'overwrite' },
              { name: 'Merge', value: 'merge' },
              { name: 'Cancel', value: 'cancel' },
            ],
          },
        ]);
        spinner.start();
        if (action === 'cancel') {
          spinner.warn(chalk.yellow('Cancelled...'));
          process.exit();
        }
        if (action === 'overwrite') {
          await fs.emptyDir(targetDirectory);
        }
      }
    }
    await fs.ensureDir(targetDirectory);
  } catch (err) {
    spinner.fail(chalk.red('Failed to create working directory'));
    throw err;
  }

  spinner.succeed(chalk.green('Created working directory'));
};
