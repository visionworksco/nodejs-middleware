import { Options } from 'yargs';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

type CommanderOptions = { [key: string]: Options };

export class Commander {
  static arg(options: CommanderOptions): any {
    return yargs(hideBin(process.argv)).options(options).parseSync();
  }
}
