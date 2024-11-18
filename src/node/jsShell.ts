import type { SpawnSyncOptions } from 'node:child_process'
import child_process from 'node:child_process'
import process from 'node:process'
import { isArray } from '../is/isArray'
import type { IShellMessage } from '../types'

/**
 *
 * @param { string | string[] } commander 指令
 * @param { string } stdio 'inherit' | 'pipe'
 * @param { boolean } errorExit 错误时是否结束进程
 * @returns
 */

interface Options {
  args?: string[]
  stdio?: 'inherit' | 'pipe'
  errorExit?: boolean
  isLog?: boolean
  cwd?: string
  options?: SpawnSyncOptions
}
export function jsShell<T extends string | string[]>(
  commander: T,
  options: Options | 'inherit' | 'pipe' = 'inherit',
) {
  let args: string[] = []
  let stdio: 'inherit' | 'pipe' = 'inherit'
  let errorExit: boolean = true
  let isLog: boolean = false
  let cwd: string | undefined
  let _options: SpawnSyncOptions = {}
  if (typeof options === 'string') {
    stdio = options
  }
  else {
    args = options.args ?? []
    stdio = options.stdio ?? 'inherit'
    errorExit = options.errorExit ?? true
    isLog = options.isLog ?? false
    cwd = options.cwd
    _options = options.options ?? {}
  }

  return (
    isArray(commander)
      ? commander.map(command => executor(command))
      : executor(commander)
  ) as T extends string ? IShellMessage : IShellMessage[]
  function executor(commander: string): IShellMessage {
    const { status, output, stdout, stderr, error, signal, pid }
      = child_process.spawnSync(commander, args as string[], {
        shell: true,
        encoding: 'utf8',
        stdio: stdio === 'inherit' ? 'inherit' : ['inherit', 'pipe', 'inherit'],
        cwd,
        ..._options,
      })

    const result
      = typeof output[1] === 'string' ? output[1]?.trim() : output[1]?.toString()
    if (status === 130) {
      if (isLog)
        console.log('已取消...')
      return { status, result } as IShellMessage
    }
    if (status !== 0) {
      if (isLog)
        console.log(result || error?.message)
      if (errorExit)
        process.exit(1)
    }

    return {
      status,
      result,
      stdout,
      stderr,
      error,
      signal,
      pid,
    } as IShellMessage
  }
}
