import { spawn } from 'child_process'

import { unsExecutable, NETWORK, PASSPHRASE, SECOND_PASSPHRASE } from './config'

/**
 * Asynchronously spawn a child process
 * @param path Program path
 * @param args Program arguments
 * @example asyncChildProcessSpawn('./path/to/executable', 'arg1', 'arg2')
 * @see https://gist.github.com/rigwild/e0ddb0281f022990795cba88ea426558
 */
const asyncChildProcessSpawn = (path: string, ...args: string[]): Promise<{ stdout: string[], stderr: string[], code: number }> =>
  new Promise((resolve, reject) => {
    const command = spawn(path, args)

    let stdout: string[] = []
    let stderr: string[] = []

    command.stdout.on('data', data => stdout.push(data.toString()))
    command.stderr.on('data', data => stderr.push(data.toString()))
    command.on('close', code => (code === 0 ? resolve : reject)({ stdout, stderr, code }))
  })

export const send = (to: string, amount = 1, fee = 10000000) =>
  asyncChildProcessSpawn(
    unsExecutable,
    'send', amount.toString(),
    '--to', to,
    '--fee', fee.toString(),
    '--passphrase', PASSPHRASE,
    '--second-passphrase', SECOND_PASSPHRASE,
    '-n', NETWORK,
    '--no-check',
    '--await-confirmation', '10'
  )
